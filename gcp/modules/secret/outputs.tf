output "google_secret_manager_secret" {
  value = {
    db_url = google_secret_manager_secret.db_url
  }
}