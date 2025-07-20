.PHONY: init
init:
	echo "Initializing..."

	export GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
	@read -p "Enter project-id: " project_id; \
	gcloud config set project $$project_id && \
	echo "project_id = \"$$project_id\"" > variables.auto.tfvars
	terraform init
	gcloud auth login
	gcloud services enable serviceusage.googleapis.com
	gcloud services enable firebase.googleapis.com

	echo "Done!"