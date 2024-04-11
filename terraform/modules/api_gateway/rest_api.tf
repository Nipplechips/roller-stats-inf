# defines actual api service
resource "aws_api_gateway_rest_api" "rest_api"{
    name = var.api_name
    description = "API for access to roller stats"
}
resource "aws_api_gateway_deployment" "rest_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id

  triggers = {
      redeployment = sha1(jsonencode([]))
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
