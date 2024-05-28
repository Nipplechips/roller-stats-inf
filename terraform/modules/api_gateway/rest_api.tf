# defines actual api service
resource "aws_api_gateway_rest_api" "rest_api"{
    name = var.api_name
    description = "API for access to roller stats"
}
resource "aws_api_gateway_deployment" "rest_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id

  triggers = {
      redeployment = sha1(jsonencode([
        # aws_api_gateway_resource.rest_api_statbook_resource.id,
        # module.lambda_get_statbooks.aws_api_gateway_method_id,
        # module.lambda_update_statbook_metadata.aws_api_gateway_method_id,

        # aws_api_gateway_resource.rest_api_statbook_footage_resource.id,
        # module.lambda_link_footage_with_statbook.aws_api_gateway_method_id,

        # aws_api_gateway_resource.rest_api_storage_resource.id,
        # module.lambda_get_storage_item_url.aws_api_gateway_method_id,
        timestamp()
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
resource "aws_api_gateway_method_settings" "method_settings" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  stage_name  = aws_api_gateway_stage.rest_api_stage.stage_name
  method_path = "*/*"
  settings {
    logging_level = "INFO"
    data_trace_enabled = true
    metrics_enabled = true
  }
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
# add options method to api resource
resource "aws_api_gateway_method" "statbook_options" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_statbook_resource.id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false
}
# OPTIONS method response.
resource "aws_api_gateway_method_response" "statbook_options_response" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_statbook_resource.id
  http_method     = aws_api_gateway_method.statbook_options.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# OPTIONS integration.
resource "aws_api_gateway_integration" "statbook_options_integration" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_statbook_resource.id
  http_method          = "OPTIONS"
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" : "{\"statusCode\": 200}"
  }
}

# OPTIONS integration response.
resource "aws_api_gateway_integration_response" "statbook_options_integration_response" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_statbook_resource.id
  http_method = aws_api_gateway_integration.statbook_options_integration.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,PUT,POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.statbook_options_integration
  ]
}

module lambda_get_statbooks{
  source = "./lambda_api_integration"
  name = "${var.api_name}_get-statbooks"
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

module lambda_update_statbook_metadata{
  source = "./lambda_api_integration"
  name = "${var.api_name}_update-statbook-metadata"
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
    api_resource = aws_api_gateway_resource.rest_api_statbook_resource
    http_path = aws_api_gateway_resource.rest_api_statbook_resource.path
    http_method = "POST"
  }

  source_code_hash = var.source_code_hash
  handler_config = {
    s3_bucket = var.handler_code_bucket_name
    s3_key = var.handler_code_key
    handler = "statbook/put/handler.handler"
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

# add options method to api resource
resource "aws_api_gateway_method" "statbook_footage_options" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_statbook_footage_resource.id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false
}
# OPTIONS method response.
resource "aws_api_gateway_method_response" "statbook_footage_options_response" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_statbook_footage_resource.id
  http_method     = aws_api_gateway_method.statbook_footage_options.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# OPTIONS integration.
resource "aws_api_gateway_integration" "statbook_footage_options_integration" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_statbook_footage_resource.id
  http_method          = "OPTIONS"
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" : "{\"statusCode\": 200}"
  }
}

# OPTIONS integration response.
resource "aws_api_gateway_integration_response" "statbook_footage_options_integration_response" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_statbook_footage_resource.id
  http_method = aws_api_gateway_integration.statbook_footage_options_integration.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,PUT,POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.statbook_footage_options_integration
  ]
}

module lambda_link_footage_with_statbook{
  source = "./lambda_api_integration"
  name = "${var.api_name}_link-footage-with-statbook"
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
    http_method = "POST"
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

resource "aws_api_gateway_resource" "rest_api_storage_resource" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part = "storage"
}

module lambda_get_storage_item_url{
  source = "./lambda_api_integration"
  name = "${var.api_name}_get-storage-item-url"
  lambda_execution_role_arn = var.lambda_execution_role_arn
  resource_id = aws_api_gateway_resource.rest_api_storage_resource.id

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
    http_path = aws_api_gateway_resource.rest_api_storage_resource.path
    http_method = "GET"
  }

  source_code_hash = var.source_code_hash
  handler_config = {
    s3_bucket = var.handler_code_bucket_name
    s3_key = var.handler_code_key
    handler = "storage/get/handler.handler"
  }

}


# add options method to api resource
resource "aws_api_gateway_method" "storage_item_options" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_storage_resource.id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false
}

# OPTIONS method response.
resource "aws_api_gateway_method_response" "storage_item_options_response" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_storage_resource.id
  http_method     = aws_api_gateway_method.storage_item_options.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# OPTIONS integration.
resource "aws_api_gateway_integration" "storage_item_options_integration" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_storage_resource.id
  http_method          = "OPTIONS"
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" : "{\"statusCode\": 200}"
  }
}

# OPTIONS integration response.
resource "aws_api_gateway_integration_response" "storage_item_options_integration_response" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.rest_api_storage_resource.id
  http_method = aws_api_gateway_integration.storage_item_options_integration.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,PUT,POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.storage_item_options_integration
  ]
}