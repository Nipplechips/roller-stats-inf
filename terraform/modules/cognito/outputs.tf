output "userpool_id"{
    value = aws_cognito_user_pool.user_pool.id
}
output "userpool_endpoint"{
    value = aws_cognito_user_pool.user_pool.endpoint
}
output "app_client_id"{
    value = aws_cognito_user_pool_client.user_pool_client.id
}
output "userpool_arn"{
    value = aws_cognito_user_pool.user_pool.arn
}
