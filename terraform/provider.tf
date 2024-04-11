terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"

    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0.0"
    }
  }

}

module "global_settings" {
  source = "./modules/global_constants"
}


provider "aws" {
  profile = "drd_dev"
  region  = module.global_settings.region
}