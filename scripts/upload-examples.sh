#!/bin/bash

# Get the bucket name from environment variable
BUCKET_NAME=$1

if [ -z "$BUCKET_NAME" ]; then
    echo "Error: Bucket name not provided"
    echo "Usage: ./upload-examples.sh <bucket-name>"
    exit 1
fi

# Create examples directory in S3
aws s3api put-object --bucket "$BUCKET_NAME" --key "examples/"

# Upload all example files from src/data/examples
echo "Uploading example files to s3://$BUCKET_NAME/examples/"
aws s3 cp src/data/examples/ "s3://$BUCKET_NAME/examples/" \
    --recursive \
    --exclude "*.ts" \
    --content-type "application/json" \
    --cache-control "max-age=3600"

echo "Example files uploaded successfully"
