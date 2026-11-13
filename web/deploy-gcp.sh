#!/usr/bin/env bash
# =========================================================================
# Insolvenz-Wächter: Google Cloud Run Frankfurt Deployment Script
# =========================================================================
set -e

REGION="europe-west3" # Frankfurt am Main, Germany
SERVICE_NAME="insolvenz-waechter"
REPO_NAME="insolvenz-waechter-repo"

echo "🔍 Checking GCP authentication and active project..."
PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Error: No GCP project configured. Run 'gcloud init' or 'gcloud config set project <YOUR_PROJECT_ID>' first."
  exit 1
fi

echo "🚀 Deploying to GCP Project: $PROJECT_ID in Region: $REGION (Frankfurt)"

# 1. Enable required GCP services
echo "📦 Enabling required APIs (Cloud Run, Artifact Registry, Cloud Build)..."
gcloud services enable run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  cloudscheduler.googleapis.com --quiet

# 2. Create Artifact Registry repository if it doesn't exist
if ! gcloud artifacts repositories describe "$REPO_NAME" --location="$REGION" &>/dev/null; then
  echo "📁 Creating Artifact Registry Docker repository..."
  gcloud artifacts repositories create "$REPO_NAME" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Insolvenz-Wächter Container Repository" \
    --quiet
fi

IMAGE_URI="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/web:latest"

# 3. Build & push container using Google Cloud Build (no local Docker daemon required!)
echo "🔨 Building container image with Google Cloud Build..."
gcloud builds submit --tag "$IMAGE_URI" .

# 4. Deploy container to Cloud Run
echo "⚡ Deploying container to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_URI" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --update-env-vars "NODE_ENV=production,REGION=europe-west3"

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format="value(status.url)")

echo "=========================================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "🌐 Cloud Run URL: $SERVICE_URL"
echo "🇩🇪 Data Residency: Frankfurt am Main (europe-west3)"
echo "=========================================================="
