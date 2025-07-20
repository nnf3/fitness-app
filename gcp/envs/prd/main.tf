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