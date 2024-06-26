module "global_settings_dynamo"{
    source = "../global_constants"
}

module "dynamodb_table" {
  source = "terraform-aws-modules/dynamodb-table/aws"

  name                        = "${module.global_settings_dynamo.dynamodb_chat_table_name}"
  hash_key                    = "pk"
  range_key                   = "sk"
  table_class                 = "STANDARD_INFREQUENT_ACCESS"
  deletion_protection_enabled = false
  stream_enabled = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  ttl_attribute_name = "ttl"
  ttl_enabled = true
  attributes = [
    {
      name = "pk"
      type = "S"
    },
    {
      name = "sk"
      type = "S"
    }
  ]

  
}
