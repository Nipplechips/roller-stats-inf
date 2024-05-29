output "rest_api_url" {
  value = "${module.api_gateway.apigatewayv2_api_api_endpoint}"
}

output "rest_api_id" {
  value = module.api_gateway.apigatewayv2_api_id
}