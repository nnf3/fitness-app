.PHONY: init
init:
	echo "Initializing..."

	export GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
	@read -p "Enter project-id: " project_id; \
	gcloud config set project $$project_id && \
	if [ -f variables.auto.tfvars ]; then \
		sed -i '' "s/^project_id = .*/project_id = \"$$project_id\"/" variables.auto.tfvars; \
	else \
		echo "project_id = \"$$project_id\"" > variables.auto.tfvars; \
	fi
	terraform init
	gcloud auth login
	gcloud services enable serviceusage.googleapis.com
	gcloud services enable firebase.googleapis.com
	gcloud services enable cloudbuild.googleapis.com

	echo "Done!"