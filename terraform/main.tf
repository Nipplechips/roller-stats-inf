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
  app_asset_bucket_arn        = module.s3_assets.asset_bucket_arn

  depends_on = [
    module.s3_assets
  ]
}

module "api_gatewayv2" {
  source = "./modules/api"

  userpool_client_id        = module.userpool.app_client_id
  userpool_endpoint         = module.userpool.userpool_endpoint
  lambda_execution_role_arn = module.lambda.lambda_execution_role_arn
  node_modules_layer_arn = module.lambda.node_modules_layer_arn
  source_code_hash = module.lambda.source_code_hash

  depends_on = [module.userpool, module.lambda]

}
# module "api_gateway" {
#   source = "./modules/api_gateway"

#   api_name               = "${module.global_settings.deployment_name_and_stage}-rollerstats-api"
#   rest_api_stage_name    = "dev"
#   api_gateway_region     = module.global_settings.region
#   api_gateway_account_id = module.global_settings.account_id

#   handler_code_key         = module.lambda.handler_code_key
#   handler_code_bucket_name = module.s3_assets.code_bucket_name
#   source_code_hash         = module.lambda.source_code_hash

#   asset_bucket_name = module.s3_assets.asset_bucket_name
#   asset_bucket_arn  = module.s3_assets.asset_bucket_arn

#   userpool_id               = module.userpool.userpool_id
#   authorizer_arn            = module.userpool.userpool_arn
#   lambda_execution_role_arn = module.lambda.lambda_execution_role_arn

#   connect_integration_uri          = module.lambda.connect_lambda_arn
#   disconnect_integration_uri       = module.lambda.disconnect_lambda_arn
#   sendmessage_integration_uri      = module.lambda.sendmessage_lambda_arn
#   connect_lambda_function_name     = module.lambda.connect_lambda_function_name
#   disconnect_lambda_function_name  = module.lambda.disconnect_lambda_function_name
#   sendmessage_lambda_function_name = module.lambda.sendmessage_lambda_function_name

#   depends_on = [
#     module.lambda,
#     module.userpool
#   ]

# }

