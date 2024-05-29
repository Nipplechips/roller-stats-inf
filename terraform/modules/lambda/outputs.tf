output "lambda_execution_role_arn" { 
  value = aws_iam_role.lambda_execution_role.arn 
}

output "source_code_hash" {
  value = data.archive_file.lambda_code.output_base64sha256
}

output "handler_code_key" {
  value = aws_s3_object.lambda_code.key
}

output "node_modules_layer_arn"{
  value = aws_lambda_layer_version.node_modules.arn
}



output "connect_lambda_arn" {
  value = aws_lambda_function.connect.invoke_arn
}

output "sendmessage_lambda_arn" {
  value = aws_lambda_function.SendMessage.invoke_arn
}

output "disconnect_lambda_arn" {
  value = aws_lambda_function.disconnect.invoke_arn
}

output "connect_lambda_function_name" {
  value = aws_lambda_function.connect.function_name
}

output "sendmessage_lambda_function_name" {
  value = aws_lambda_function.SendMessage.function_name
}

output "disconnect_lambda_function_name" {
  value = aws_lambda_function.disconnect.function_name
}

