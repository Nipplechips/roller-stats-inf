module "global_settings_socket_api" {
  source = "../global_constants"
}

module "lambda_function_socket_connect" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${module.global_settings_socket_api.deployment_name_and_stage}-socket-connect"
  s3_bucket        = module.global_settings_socket_api.lambda_builds_bucket_name
  handler       = "footage/connect/handler.handler"
  runtime       = "nodejs16.x"

  source_path = "../code/dist/footage/connect"

  store_on_s3 = true
  publish = true
  
  # attach_policy = true
  # policy = aws_iam_policy.lambda_execution_policy.arn

  cloudwatch_logs_retention_in_days = 7

  # allowed_triggers = {
  #   AllowExecutionFromAPIGateway = {
  #     service    = "apigateway"
  #     source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
  #   }
  # }

  # environment_variables = {
  #   asset_bucket_name = "${module.global_settings_apiv2.application_assets_bucket_name}"
  # }
}

module "lambda_function_socket_send_message" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${module.global_settings_socket_api.deployment_name_and_stage}-socket-send-message"
  s3_bucket        = module.global_settings_socket_api.lambda_builds_bucket_name
  handler       = "handler.handler"
  runtime       = "nodejs16.x"

  source_path = "../code/dist/test"

  store_on_s3 = true
  publish = true
  
  # attach_policy = true
  # policy = aws_iam_policy.lambda_execution_policy.arn

  cloudwatch_logs_retention_in_days = 7

  # allowed_triggers = {
  #   AllowExecutionFromAPIGateway = {
  #     service    = "apigateway"
  #     source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
  #   }
  # }

  # environment_variables = {
  #   asset_bucket_name = "${module.global_settings_apiv2.application_assets_bucket_name}"
  # }
}

module "lambda_function_socket_disconnect" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${module.global_settings_socket_api.deployment_name_and_stage}-socket-disconnect"
  s3_bucket        = module.global_settings_socket_api.lambda_builds_bucket_name
  handler       = "handler.handler"
  runtime       = "nodejs16.x"

  source_path = "../code/dist/test"

  store_on_s3 = true
  publish = true
  
  # attach_policy = true
  # policy = aws_iam_policy.lambda_execution_policy.arn

  cloudwatch_logs_retention_in_days = 7

  # allowed_triggers = {
  #   AllowExecutionFromAPIGateway = {
  #     service    = "apigateway"
  #     source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
  #   }
  # }

  # environment_variables = {
  #   asset_bucket_name = "${module.global_settings_apiv2.application_assets_bucket_name}"
  # }
}

resource "aws_apigatewayv2_api" "websocket_api" {
  name                       = "${module.global_settings_socket_api.deployment_name_and_stage}-websocket-api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_integration" "connect_integration" {
  api_id           = aws_apigatewayv2_api.websocket_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = module.lambda_function_socket_connect.lambda_function_invoke_arn
}

resource "aws_apigatewayv2_integration" "disconnect_integration" {
  api_id           = aws_apigatewayv2_api.websocket_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = module.lambda_function_socket_disconnect.lambda_function_invoke_arn
}

resource "aws_apigatewayv2_integration" "sendmessages_integration" {
  api_id           = aws_apigatewayv2_api.websocket_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = module.lambda_function_socket_send_message.lambda_function_invoke_arn
}

resource "aws_apigatewayv2_route" "connect_route" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.connect_integration.id}"
}

resource "aws_apigatewayv2_route" "disconnect_route" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.disconnect_integration.id}"
}

resource "aws_apigatewayv2_route" "sendmessages_route" {
  api_id    = aws_apigatewayv2_api.websocket_api.id
  route_key = "sendmessage"
  target    = "integrations/${aws_apigatewayv2_integration.sendmessages_integration.id}"
}


resource "aws_lambda_permission" "connect_lambda_permissions" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_function_socket_connect.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "sendmessage_lambda_permissions" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_function_socket_send_message.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "disconect_lambda_permissions" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_function_socket_disconnect.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "socket_api_stage" {
  api_id   = aws_apigatewayv2_api.websocket_api.id
  name    = "default"
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 30
    throttling_rate_limit = 30
    logging_level = "INFO"
    detailed_metrics_enabled = true
  }
}
