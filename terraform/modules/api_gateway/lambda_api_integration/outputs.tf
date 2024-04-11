output aws_api_gateway_method_id{
    value = aws_api_gateway_method.rest_api_method.id
}
output aws_api_gateway_integration_id{
    value = aws_api_gateway_integration.rest_api_method_integration.id
}