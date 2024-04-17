# defines actual api service
resource "aws_api_gateway_rest_api" "rest_api"{
    name = var.api_name
    description = "API for access to roller stats"
}
resource "aws_api_gateway_deployment" "rest_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id

  triggers = {
      redeployment = sha1(jsonencode([
        aws_api_gateway_resource.rest_api_statbook_resource.id,
        module.lambda_get_statbooks.aws_api_gateway_method_id,

        aws_api_gateway_resource.rest_api_statbook_footage_resource.id,
        module.lambda_link_footage_with_statbook.aws_api_gateway_method_id,
      ]))
  }
  lifecycle {
      create_before_destroy = true
  }
}
resource "aws_api_gateway_stage" "rest_api_stage" {
  deployment_id = aws_api_gateway_deployment.rest_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = var.rest_api_stage_name
}


# cognito authorizer
resource "aws_api_gateway_authorizer" "api_authorizer" {
  name          = "CognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  provider_arns = [var.authorizer_arn]
}

# LAMBDA INTEGRATIONS
# These modules tie together the lambda functions above with the api methods described below
resource "aws_api_gateway_resource" "rest_api_statbook_resource" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part = "statbook"
}

module lambda_get_statbooks{
  source = "./lambda_api_integration"
  name = "${var.api_name}_${var.rest_api_stage_name}_get-statbooks"
  lambda_execution_role_arn = var.lambda_execution_role_arn
  resource_id = aws_api_gateway_resource.rest_api_statbook_resource.id

  lambda_environment = {
    asset_bucket_arn = var.asset_bucket_arn,
    asset_bucket_name = var.asset_bucket_name
  }
  
  auth_config = {
    authorization = "COGNITO_USER_POOLS",
    authorizer_id = aws_api_gateway_authorizer.api_authorizer.id
  }

  api_config = {
    api_id = aws_api_gateway_rest_api.rest_api.id
    http_path = aws_api_gateway_resource.rest_api_statbook_resource.path
    http_method = "GET"
  }

  source_code_hash = var.source_code_hash
  handler_config = {
    s3_bucket = var.handler_code_bucket_name
    s3_key = var.handler_code_key
    handler = "statbook/get/handler.handler",
    runtime = "nodejs16.x"    
  }

}

resource "aws_api_gateway_resource" "rest_api_statbook_footage_resource" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id = aws_api_gateway_resource.rest_api_statbook_resource.id
  path_part = "footage"

  depends_on = [
    aws_api_gateway_resource.rest_api_statbook_resource
  ]
}

module lambda_link_footage_with_statbook{
  source = "./lambda_api_integration"
  name = "${var.api_name}_${var.rest_api_stage_name}_link-footage-with-statbook"
  lambda_execution_role_arn = var.lambda_execution_role_arn
  resource_id = aws_api_gateway_resource.rest_api_statbook_footage_resource.id

  lambda_environment = {
    asset_bucket_arn = var.asset_bucket_arn,
    asset_bucket_name = var.asset_bucket_name
  }
  
  auth_config = {
    authorization = "COGNITO_USER_POOLS",
    authorizer_id = aws_api_gateway_authorizer.api_authorizer.id
  }

  api_config = {
    api_id = aws_api_gateway_rest_api.rest_api.id
    http_path = aws_api_gateway_resource.rest_api_statbook_footage_resource.path
    http_method = "PUT"
  }

  source_code_hash = var.source_code_hash
  handler_config = {
    s3_bucket = var.handler_code_bucket_name
    s3_key = var.handler_code_key
    timeout = 120
    memory_size = 256
    handler = "statbook/footage/put/handler.handler",
    runtime = "nodejs16.x"    
  }

}