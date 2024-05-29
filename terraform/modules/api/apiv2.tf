module "global_settings_apiv2"{
    source = "../global_constants"
}

resource "aws_lambda_function" "get_statbooks" {
  
  function_name = "${module.global_settings_apiv2.deployment_name_and_stage}-get-statbooks"
  s3_bucket        = module.global_settings_apiv2.lambda_builds_bucket_name
  s3_key           = module.global_settings_apiv2.lambda_builds_object_key
  source_code_hash = var.source_code_hash
  handler       = "statbook/get/handler.handler"
layers = [var.node_modules_layer_arn]
  role             = var.lambda_execution_role_arn
  runtime       = "nodejs16.x"
  
}
resource "aws_cloudwatch_log_group" "get_statbooks_logs" {
  name              = "/aws/lambda/${aws_lambda_function.get_statbooks.function_name}"
  retention_in_days = 7
}

resource "aws_lambda_function" "update_statbook_metadata" {
  
  function_name = "${module.global_settings_apiv2.deployment_name_and_stage}-update-statbook-metadata"
  s3_bucket        = module.global_settings_apiv2.lambda_builds_bucket_name
  s3_key           = module.global_settings_apiv2.lambda_builds_object_key
  source_code_hash = var.source_code_hash
  handler       = "statbook/put/handler.handler"
layers = [var.node_modules_layer_arn]
  role             = var.lambda_execution_role_arn
  runtime       = "nodejs16.x"
}
resource "aws_cloudwatch_log_group" "update_statbook_metadata" {
  name              = "/aws/lambda/${aws_lambda_function.update_statbook_metadata.function_name}"
  retention_in_days = 7
}


resource "aws_lambda_function" "link_footage_with_statbook" {
  
  function_name = "${module.global_settings_apiv2.deployment_name_and_stage}-link-footage-with-statbook"
  s3_bucket        = module.global_settings_apiv2.lambda_builds_bucket_name
  s3_key           = module.global_settings_apiv2.lambda_builds_object_key
  source_code_hash = var.source_code_hash
  handler       = "statbook/footage/put/handler.handler"
  layers = [var.node_modules_layer_arn]
  role             = var.lambda_execution_role_arn
  runtime       = "nodejs16.x"
}
resource "aws_cloudwatch_log_group" "link_footage_with_statbook" {
  name              = "/aws/lambda/${aws_lambda_function.link_footage_with_statbook.function_name}"
  retention_in_days = 7
}


module "api_gateway" {
  source = "terraform-aws-modules/apigateway-v2/aws"

  name          = "${module.global_settings_apiv2.deployment_name_and_stage}"
  description   = "Roller Stats HTTP API Gateway"
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  # Custom domain
  create_api_domain_name = false
  # domain_name                 = "terraform-aws-modules.modules.tf"
  # domain_name_certificate_arn = "arn:aws:acm:eu-west-1:052235179155:certificate/2b3a7ed9-05e1-4f9e-952b-27744ba06da6"

  # Access logs
  # default_stage_access_log_destination_arn = "arn:aws:logs:eu-west-1:835367859851:log-group:debug-apigateway"
  # default_stage_access_log_format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"

  # Routes and integrations
  integrations = {
      "POST /statbook/footage" = {
      lambda_arn             = aws_lambda_function.link_footage_with_statbook.arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorizer_key = "cognito"
      authorizer_type = "JWT"  
    }

    "POST /statbook" = {
      lambda_arn             = aws_lambda_function.update_statbook_metadata.arn
      payload_format_version = "2.0"
      timeout_milliseconds   = 12000
      authorizer_key = "cognito"
      authorizer_type = "JWT"  
    }

    "GET /statbook" = {
      integration_type = "HTTP_PROXY"
      lambda_arn = aws_lambda_function.get_statbooks.arn
      authorizer_key = "cognito"
      authorizer_type = "JWT"      
    }

    "$default" = {
      lambda_arn = "arn:aws:lambda:eu-west-1:052235179155:function:my-default-function"
    }
  }

  authorizers = {
    "cognito" = {
      authorizer_type  = "JWT"
      identity_sources = ["$request.header.Authorization"]
      name             = "${module.global_settings_apiv2.deployment_stage}-apigw-userpool-jwt-authorizer"
      audience         = [var.userpool_client_id]
      issuer           = "https://${var.userpool_endpoint}"
    }
  }

  tags = {
    Name = "http-apigateway"
  }
}