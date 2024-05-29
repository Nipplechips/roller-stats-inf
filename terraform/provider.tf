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

  backend "s3" {
    profile = "drd_dev"
    bucket  = "rollerstats-terraform-tfstate"
    key     = "state/terraform.tfstate"
    region  = "eu-west-1"
    encrypt = true
  }

}

module "global_settings" {
  source = "./modules/global_constants"
}

provider "aws" {
  profile = "drd_dev"
  region  = module.global_settings.region
}