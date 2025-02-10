#!/usr/bin/env bash
set -e  # Exit on error

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# ------------------------------------------------------------------------
# Colors and formatting
# ------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
BOLD='\033[1m'
DIM='\033[2m'

# ------------------------------------------------------------------------
# Helper functions
# ------------------------------------------------------------------------
print_header() {
    echo -e "\n${BLUE}${BOLD}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓${NC}"
    echo -e "${BLUE}${BOLD}  $1${NC}"
    echo -e "${BLUE}${BOLD}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓${NC}\n"
}

print_step() {
    echo -e "${YELLOW}${BOLD}➤ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ Error: $1${NC}"
    exit 1
}

print_info() {
    echo -e "${DIM}  ℹ $1${NC}"
}

print_var() {
    echo -e "  ${BOLD}$1${NC}: ${BLUE}$2${NC}"
}

# ------------------------------------------------------------------------
# Check and install required tools
# ------------------------------------------------------------------------
check_requirements() {
    print_step "Checking required tools..."
    
    # Check for jq
    if ! command -v jq &> /dev/null; then
        print_info "jq not found. Installing..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install jq
            print_success "jq installed successfully"
        else
            print_error "Please install jq manually and try again"
        fi
    else
        print_success "jq is installed"
    fi
}

# Run requirements check
check_requirements

# ------------------------------------------------------------------------
# Check and install AWS CLI if not present
# ------------------------------------------------------------------------
check_aws_cli() {
    print_step "Checking AWS CLI..."
    
    if ! command -v aws &> /dev/null; then
        print_info "AWS CLI not found. Installing..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS installation
            curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
            sudo installer -pkg AWSCLIV2.pkg -target /
            rm AWSCLIV2.pkg
            print_success "AWS CLI installed successfully"
        else
            print_error "Unsupported operating system. Please install AWS CLI manually."
        fi
    else
        print_success "AWS CLI is installed"
    fi
}

# Run AWS CLI check
check_aws_cli

# ------------------------------------------------------------------------
# Load environment variables from .env file
# ------------------------------------------------------------------------
load_env() {
    print_step "Loading environment variables..."
    
    if [ -f "$PROJECT_ROOT/.env" ]; then
        source "$PROJECT_ROOT/.env"
    fi
    
    STACK_NAME="proposal-website-${COMPANY_NAME// /-}"
    DOMAIN_NAME=${DOMAIN_NAME:-"proposals.gettingautomated.com"}
    BUCKET_NAME=${BUCKET_NAME:-"proposals.gettingautomated.com"}
    ENVIRONMENT=${ENVIRONMENT:-"prod"}
    CERTIFICATE_ARN=${CERTIFICATE_ARN:-""}
    
    # Validate required environment variables
    local required_vars=("DOMAIN_NAME" "COMPANY_NAME" "REGION" "ENVIRONMENT")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "$var is not set in .env file"
        fi
    done
    print_success "Environment variables loaded"
}

# Load environment variables
load_env

print_header "Proposal Website Deployment"
print_info "Configuration:"
print_var "Domain Name" "${DOMAIN_NAME}"
print_var "Environment" "${ENVIRONMENT}"
print_var "AWS Region" "${REGION}"
print_var "Stack Name" "${STACK_NAME}"
print_var "Bucket Name" "${BUCKET_NAME}"

# ------------------------------------------------------------------------
# Request or find existing ACM certificate (DNS validation)
# ------------------------------------------------------------------------
print_step "Checking for existing certificate..."
EXISTING_CERT_ARN=$(aws acm list-certificates \
  --region "$REGION" \
  --query "CertificateSummaryList[?DomainName=='$DOMAIN_NAME'].CertificateArn" \
  --output text)

if [ -n "$EXISTING_CERT_ARN" ] && [ "$EXISTING_CERT_ARN" != "None" ]; then
  print_info "Found existing cert ARN: $EXISTING_CERT_ARN"
  CERT_ARN="$EXISTING_CERT_ARN"
else
  print_info "Requesting a new certificate for domain: $DOMAIN_NAME"
  CERT_ARN=$(aws acm request-certificate \
    --domain-name "$DOMAIN_NAME" \
    --validation-method DNS \
    --region "$REGION" \
    --query CertificateArn \
    --output text)
  print_info "Requested new certificate: $CERT_ARN"
  
  print_info "Waiting for certificate details to become available..."
  sleep 10  # Wait for AWS to generate the DNS validation records
fi

# ------------------------------------------------------------------------
# Get certificate validation details
# ------------------------------------------------------------------------
print_step "Getting certificate validation details..."
VALIDATION_STATUS=$(aws acm describe-certificate \
  --certificate-arn "$CERT_ARN" \
  --region "$REGION" \
  --query 'Certificate.DomainValidationOptions[0].ValidationStatus' \
  --output text 2>/dev/null || echo "UNKNOWN")

if [ "$VALIDATION_STATUS" != "SUCCESS" ]; then
  # Retry a few times if the DNS records are not available
  for i in {1..3}; do
    DNS_NAME=$(aws acm describe-certificate \
      --certificate-arn "$CERT_ARN" \
      --region "$REGION" \
      --query 'Certificate.DomainValidationOptions[0].ResourceRecord.Name' \
      --output text)

    DNS_VALUE=$(aws acm describe-certificate \
      --certificate-arn "$CERT_ARN" \
      --region "$REGION" \
      --query 'Certificate.DomainValidationOptions[0].ResourceRecord.Value' \
      --output text)

    if [ "$DNS_NAME" != "None" ] && [ "$DNS_VALUE" != "None" ]; then
      break
    fi
    print_info "Waiting for DNS validation details to become available (attempt $i)..."
    sleep 5
  done

  if [ "$DNS_NAME" = "None" ] || [ "$DNS_VALUE" = "None" ]; then
    print_error "Failed to get DNS validation details. Please try running the script again in a minute."
  fi

  print_info "Certificate pending validation. Please create this DNS record:"
  print_var "Type" "CNAME"
  print_var "Name" "$DNS_NAME"
  print_var "Value" "$DNS_VALUE"
  echo ""
  print_info "After creating the DNS record, wait a few minutes and run this script again."
  exit 1
fi

# ------------------------------------------------------------------------
# Deploy CloudFormation stack
print_step "Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file "$SCRIPT_DIR/template.yaml" \
  --stack-name "$STACK_NAME" \
  --parameter-overrides \
    DomainName="$DOMAIN_NAME" \
    BucketName="$BUCKET_NAME" \
    Environment="$ENVIRONMENT" \
    CertificateArn="$CERT_ARN" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --region "$REGION" || print_error "Failed to deploy CloudFormation stack"

print_success "CloudFormation stack deployed successfully"

# Get stack outputs
print_step "Getting stack outputs..."
OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query 'Stacks[0].Outputs' \
  --output json)

# Extract values from outputs
DISTRIBUTION_ID=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="DistributionId") | .OutputValue')
WEBSITE_URL=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="WebsiteURL") | .OutputValue')
BUCKET_NAME=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="BucketName") | .OutputValue')
FUNCTION_URL=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="FeedbackFunctionUrl") | .OutputValue')

# Update .env with Lambda Function URL before building
print_step "Updating .env file with Lambda Function URL..."
if [ -f "$PROJECT_ROOT/.env" ]; then
    # Get current FEEDBACK_URL value if it exists
    CURRENT_URL=$(grep "^VITE_FEEDBACK_URL=" "$PROJECT_ROOT/.env" | cut -d '=' -f2)
    
    # Only update if the URL is different
    if [ "$CURRENT_URL" != "$FUNCTION_URL" ]; then
        print_info "Updating Lambda Function URL..."
        sed -i '' '/VITE_FEEDBACK_URL/d' "$PROJECT_ROOT/.env"
        
        # Add Lambda Function URL
        echo "" >> "$PROJECT_ROOT/.env"
        echo "# Lambda Function URL for feedback" >> "$PROJECT_ROOT/.env"
        echo "VITE_FEEDBACK_URL=$FUNCTION_URL" >> "$PROJECT_ROOT/.env"
        print_success "Lambda Function URL updated"
    else
        print_info "Lambda Function URL unchanged, skipping update"
    fi
else
    print_error ".env file not found"
fi

print_header "Setup Complete!"
print_info "To complete the setup:"
print_var "1. Create a CNAME record in your DNS provider" ""
print_var "   Name/Host" "${DOMAIN_NAME}"
print_var "   Value/Target" "${WEBSITE_URL}"
echo ""
print_var "CloudFront Distribution ID" "${DISTRIBUTION_ID}"
print_var "Website URL" "https://${DOMAIN_NAME}"

print_success "Deployment completed successfully! "

# ------------------------------------------------------------------------
# Build and deploy the React site
# ------------------------------------------------------------------------
print_step "Building React application..."
cd "$PROJECT_ROOT"  # Move to project root
npm install
npm run build

print_step "Creating proposals directory in S3 bucket..."
aws s3api put-object \
    --bucket "$BUCKET_NAME" \
    --key "proposals/" \
    --content-length 0

print_step "Uploading built site to S3..."
aws s3 sync dist "s3://${BUCKET_NAME}" \
    --delete \
    --cache-control "max-age=31536000,public" \
    --exclude "*.html" \
    --exclude "proposals/*" \
    --exclude "feedback/*"

# Upload HTML files with different cache settings
aws s3 sync dist "s3://${BUCKET_NAME}" \
    --delete \
    --cache-control "no-cache,no-store,must-revalidate" \
    --exclude "*" \
    --include "*.html"

print_step "Creating CloudFront invalidation..."
aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*"

print_header "Deployment Complete!"
print_info "Your site is now live at: https://${DOMAIN_NAME}"
print_info "You can upload proposal JSON files to: s3://${BUCKET_NAME}/proposals/"
print_success "Deployment completed successfully! "

# Upload example files
echo "Uploading example files..."
"$PROJECT_ROOT/scripts/upload-examples.sh" "$BUCKET_NAME"

print_success "Deployment completed successfully!"