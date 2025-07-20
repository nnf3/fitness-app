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

output "google_cloud_scheduler_job" {
  value = {
    stop_service = google_cloud_scheduler_job.stop_service
    start_service = google_cloud_scheduler_job.start_service
  }
}