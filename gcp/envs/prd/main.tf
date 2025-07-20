module "storage" {
  source     = "../../modules/storage"

  env        = "prd"
  project_id = var.project_id
}

module "firebase" {
  source             = "../../modules/firebase"

  project_id         = var.project_id
  storage_bucket_id  = module.storage.google_storage_bucket.storage.name
}

module "secret" {
  source     = "../../modules/secret"

  project_id = var.project_id
  neon_database_url = var.neon_database_url
}

module "registry" {
  source     = "../../modules/registry"

  project_id = var.project_id
}

# module "server" {
#   source     = "../../modules/server"

#   project_id = var.project_id
#   registry_repository_id = module.registry.google_artifact_registry_repository.api.name
#   neon_database_url = var.neon_database_url
# }