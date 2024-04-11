output "userpool_id"{
    value = aws_cognito_user_pool.user_pool.id
}
output "app_client_id"{
    value = aws_cognito_user_pool_client.user_pool_client.id
}
output "userpool_arn"{
    value = aws_cognito_user_pool.user_pool.arn
}