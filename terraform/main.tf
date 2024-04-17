module "s3_assets" {
  source = "./modules/s3"
}

module "userpool" {
  source = "./modules/cognito"
}

module "lambda" {
  source                      = "./modules/lambda"
  code_deployment_bucket_name = module.s3_assets.code_bucket_name
  app_asset_bucket_name       = module.s3_assets.asset_bucket_name
  app_asset_bucket_arn       = module.s3_assets.asset_bucket_arn

  depends_on = [
    module.s3_assets
  ]
}

module "api_gateway" {
  source = "./modules/api_gateway"

  rest_api_stage_name    = "dev"
  api_gateway_region     = module.global_settings.region
  api_gateway_account_id = module.global_settings.account_id

  handler_code_key         = module.lambda.handler_code_key
  handler_code_bucket_name = module.s3_assets.code_bucket_name

  asset_bucket_name = module.s3_assets.asset_bucket_name
  asset_bucket_arn  = module.s3_assets.asset_bucket_arn
  userpool_id       = module.userpool.userpool_id

  lambda_execution_role_arn = module.lambda.lambda_execution_role_arn

  source_code_hash          = module.lambda.source_code_hash

  authorizer_arn = module.userpool.userpool_arn

  depends_on = [
    module.lambda,
    module.userpool
  ]

}

