output "google_cloud_run_service" {
  value = {
    api = google_cloud_run_service.api
  }
}

output "google_service_account" {
  value = {
    service_account = google_service_account.service_account
  }
}

output "google_cloud_run_v2_job" {
  value = {
    migrate = google_cloud_run_v2_job.migrate
    seed = google_cloud_run_v2_job.seed
  }
}