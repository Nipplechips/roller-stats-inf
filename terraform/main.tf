module "global_settings_main" {
  source = "./modules/global_constants"
}
module "s3_assets" {
  source                         = "./modules/s3"
  s3_code_deployment_bucket_name = module.global_settings_main.lambda_builds_bucket_name
  s3_assets_bucket_name          = module.global_settings_main.application_assets_bucket_name

}

module "userpool" {
  source = "./modules/cognito"
}

module "lambda" {
  source                      = "./modules/lambda"
  code_deployment_bucket_name = module.s3_assets.code_bucket_name
  app_asset_bucket_name       = module.s3_assets.asset_bucket_name
  app_asset_bucket_arn        = module.s3_assets.asset_bucket_arn

  depends_on = [
    module.s3_assets
  ]
}

module "dynamodb" {
  source = "./modules/dynamodb"
}

module "api_gatewayv2" {
  source = "./modules/api"

  userpool_client_id     = module.userpool.app_client_id
  userpool_endpoint      = module.userpool.userpool_endpoint
  node_modules_layer_arn = module.lambda.node_modules_layer_arn
  db_table_name = module.dynamodb.table_name
  db_table_arn = module.dynamodb.table_arn
  depends_on = [module.userpool, module.lambda]

}


