output "table_name" {
    value = module.dynamodb_table.dynamodb_table_id  
}
output "table_arn"{
    value = module.dynamodb_table.dynamodb_table_arn
}
output "table_stream_arn" {
  value = module.dynamodb_table.dynamodb_table_stream_arn
}