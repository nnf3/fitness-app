resource "google_identity_platform_config" "authentication" {
  provider                   = google-beta
  project                    = var.project_id
  autodelete_anonymous_users = true

  sign_in {
    allow_duplicate_emails = true

    anonymous {
      enabled = true
    }

    email {
      enabled           = true
      password_required = false
    }

    phone_number {
      enabled            = true
      test_phone_numbers = {
        "+11231231234" = "000000"
      }
    }
  }

  sms_region_config {
    allowlist_only {
      allowed_regions = [
        "JP",
      ]
    }
  }

  blocking_functions {
    triggers {
      event_type = "beforeSignIn"
      function_uri = "https://asia-northeast1-${var.project_id}.cloudfunctions.net/block_email_spam"
    }
    forward_inbound_credentials {
      refresh_token = true
      access_token = true
      id_token = true
    }
  }

  multi_tenant {
    allow_tenants = false
  }

  depends_on = [
    google_firebase_project.project,
    google_project_service.services,
  ]
}

resource "google_identity_platform_default_supported_idp_config" "google" {
  provider = google-beta
  project  = var.project_id

  enabled       = true
  idp_id        = "google.com"
  client_id     = "${var.project_id}.apps.googleusercontent.com"
  client_secret = var.auth_client_secret

  depends_on = [
    google_firebase_project.project,
    google_project_service.services,
  ]
}