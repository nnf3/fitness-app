resource "google_cloudbuildv2_connection" "github" {
  project  = var.project_id
  name     = "fitness-app"
  location = "us-central1"

  github_config {
    app_installation_id = var.app_installation_id
    authorizer_credential {
      oauth_token_secret_version = var.github_token_version.id
    }
  }

  depends_on = [
    google_project_iam_member.cloudbuild_roles,
    google_project_iam_member.cloudbuild_default_secret_accessor,
  ]
}

resource "google_cloudbuildv2_repository" "github" {
  project           = var.project_id
  name              = "fitness-app"
  parent_connection = google_cloudbuildv2_connection.github.id
  remote_uri        = "https://github.com/nnf3/fitness-app.git"
}

resource "google_cloudbuild_trigger" "github" {
  project         = var.project_id
  location        = "us-central1"
  service_account = "projects/${var.project_id}/serviceAccounts/${google_service_account.cloudbuild.unique_id}"
  filename        = "server/cloudbuild.yaml"

  substitutions = {
    _PROJECT_ID = var.project_id
  }

  repository_event_config {
    repository = google_cloudbuildv2_repository.github.id
    push {
      branch = "^main$"
    }
  }
}