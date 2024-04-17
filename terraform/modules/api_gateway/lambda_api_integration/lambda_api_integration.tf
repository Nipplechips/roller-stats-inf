module "global_settings" {
  source = "../../global_constants"
}

module "lambda_integration_fn" {
  source = "../lambda_api_function"
  name = var.name
  lambda_execution_role_arn = var.lambda_execution_role_arn
  source_code_hash = var.source_code_hash
  handler_config = var.handler_config
  env_vars = var.lambda_environment
}

# add options method to api
resource "aws_api_gateway_method" "options" {
  rest_api_id      = var.api_config.api_id
  resource_id      = var.resource_id
  http_method      = "OPTIONS"
  authorization    = "NONE"
  api_key_required = false
}
# OPTIONS method response.
resource "aws_api_gateway_method_response" "options" {
  rest_api_id      = var.api_config.api_id
  resource_id      = var.resource_id
  http_method = aws_api_gateway_method.options.http_method
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
resource "aws_api_gateway_integration" "options" {
  rest_api_id      = var.api_config.api_id
  resource_id      = var.resource_id
  http_method          = "OPTIONS"
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" : "{\"statusCode\": 200}"
  }
}

# OPTIONS integration response.
resource "aws_api_gateway_integration_response" "options" {
  rest_api_id      = var.api_config.api_id
  resource_id      = var.resource_id
  http_method = aws_api_gateway_integration.options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.options
  ]
}

# add method to api
resource "aws_api_gateway_method" "rest_api_method"{
  rest_api_id = var.api_config.api_id
  resource_id = var.resource_id
  http_method = var.api_config.http_method
  authorization = var.auth_config.authorization
  authorizer_id = var.auth_config.authorizer_id
  api_key_required = var.auth_config.authorizer_id == "" ? true : false

  request_parameters = {
    "method.request.path.proxy" = true,
  }
}

# link api method to lambda invocation
resource "aws_api_gateway_integration" "rest_api_method_integration" {
  rest_api_id = var.api_config.api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.rest_api_method.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = module.lambda_integration_fn.arn

  depends_on = [module.lambda_integration_fn]
}

resource "aws_lambda_permission" "apigw_lambda_get_activities_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_integration_fn.name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${module.global_settings.region}:${module.global_settings.account_id}:${var.api_config.api_id}/*/${var.api_config.http_method}${var.api_config.http_path}"
}

