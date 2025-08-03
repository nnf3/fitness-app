module "storage" {
  source     = "../../modules/storage"

  env        = "prd"
  project_id = var.project_id
}

module "firebase" {
  source             = "../../modules/firebase"

  project_id         = var.project_id
  storage_bucket_id  = module.storage.google_storage_bucket.storage.name
  auth_client_secret = var.auth_client_secret
}

module "secret" {
  source     = "../../modules/secret"

  project_id = var.project_id
  neon_database_url = var.neon_database_url
  github_token = var.github_token
}

module "registry" {
  source     = "../../modules/registry"

  project_id = var.project_id
}

module "server" {
  source     = "../../modules/server"

  project_id = var.project_id
  registry_repository_api_id = module.registry.google_artifact_registry_repository.api.repository_id
  registry_repository_migrate_id = module.registry.google_artifact_registry_repository.migrate.repository_id
  db_url_secret_id = module.secret.google_secret_manager_secret.db_url.secret_id
}

module "cloudbuild" {
  source     = "../../modules/cloudbuild"

  project_id = var.project_id
  project_number = var.project_number
  app_installation_id = var.app_installation_id
  github_token_version = module.secret.google_secret_manager_secret_version.github_token_version
}