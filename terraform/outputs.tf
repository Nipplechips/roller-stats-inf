output "rest_api_url" {
  value = module.api_gateway.rest_api_url
}

output "rest_api_id" {
  value = module.api_gateway.rest_api_id
}

output "user_pool_id" {
  value = module.userpool.userpool_id
}

output "user_pool_client_id" {
  value = module.userpool.app_client_id
}
