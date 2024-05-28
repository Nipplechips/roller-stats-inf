module "global_settings_socket_api" {
  source = "../global_constants"
}

resource "aws_apigatewayv2_api" "websocket_api" {
  name                       = "${module.global_settings_socket_api.deployment_name_and_stage}-websocket-api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_integration" "connect_integration" {
  api_id           = aws_apigatewayv2_api.websocket_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = var.connect_integration_uri
}

resource "aws_apigatewayv2_integration" "disconnect_integration" {
  api_id           = aws_apigatewayv2_api.websocket_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = var.disconnect_integration_uri
}

resource "aws_apigatewayv2_integration" "sendmessages_integration" {
  api_id           = aws_apigatewayv2_api.websocket_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = var.sendmessage_integration_uri
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
  route_key = "sendmessages"
  target    = "integrations/${aws_apigatewayv2_integration.sendmessages_integration.id}"
}


resource "aws_lambda_permission" "connect_lambda_permissions" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.connect_lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "sendmessage_lambda_permissions" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.sendmessage_lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "disconect_lambda_permissions" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.disconnect_lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.websocket_api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "socket_api_stage" {
  api_id   = aws_apigatewayv2_api.websocket_api.id
  name    = var.rest_api_stage_name
  auto_deploy = true

  default_route_settings {
    throttling_burst_limit = 30
    throttling_rate_limit = 30
  }
}
