output "rest_api_url" {
  value = "${aws_api_gateway_deployment.rest_api_deployment.invoke_url}${aws_api_gateway_stage.rest_api_stage.stage_name}"
}

output "rest_api_id" {
  value = aws_api_gateway_rest_api.rest_api.id
}