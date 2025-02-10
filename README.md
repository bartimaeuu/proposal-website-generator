# Proposal Website Generator

A serverless web application for creating and hosting proposal websites. Built with React, TypeScript, and AWS services.

## Architecture

### AWS Services

- **S3**: Stores proposal content and feedback data
- **CloudFront**: Serves proposal content with edge caching
- **Lambda**: Handles feedback submission and retrieval
- **IAM**: Manages service permissions and access control

## 🌟 Features

### Content Management
- **Admin Interface**
  - Intuitive form-based editing
  - Real-time preview
  - Content validation
- **JSON Content Structure**
  - Flexible data schema
  - Easy to extend
  - Version control friendly
  - Validation with Zod
- **Feedback System**
  - Section-based comments
  - Real-time updates
  - Persistent storage
  - Error handling

### UI Components
- **Hero Section**
  - Dynamic backgrounds
  - Responsive layout
  - Custom typography
  - Call-to-action buttons
- **Problem/Solution**
  - Impact analysis
  - Visual comparisons
  - Key metrics display
  - Custom icons
- **Feature Showcase**
  - Icon selection
  - Benefit highlights
  - Interactive tooltips
  - Responsive grid
- **Timeline/Process**
  - Visual progress indicators
  - Milestone tracking
  - Date management
  - Phase descriptions
- **Pricing Tables**
  - Multiple tier support
  - Feature comparison
  - Custom pricing options
  - Highlight recommended
- **FAQ Section**
  - Collapsible answers
  - Category organization
  - Search functionality
  - Easy updates
- **Contact Integration**
  - Calendly scheduling
  - Social media links
  - Custom forms
  - Meeting preferences

### Security Features
- **Content Protection**
  - CloudFront for proposals
  - Lambda for feedback
- **AWS Security**
  - S3 bucket policies
  - IAM role management
  - CloudFront OAC

## 🚀 Getting Started

### Prerequisites
1. **Node.js Environment**
   - Node.js v16 or higher
   - npm or yarn package manager
   - TypeScript support

2. **AWS Account Setup**
   - IAM user for CloudFormation
   - AWS CLI installed and configured
   - Default region set

3. **Domain Requirements**
   - Registered domain name
   - DNS access
   - SSL certificate in ACM
   - Route 53 (optional)

### Installation

1. **Repository Setup**
```bash
# Clone repository
git clone https://github.com/yourusername/proposal-website-generator.git
cd proposal-website-generator

# Install dependencies
npm install

# Install dev dependencies
npm install -D @types/react @types/node
```

2. **Environment Configuration**
```bash
# Create environment files
cp .env.example .env
cp provision_aws/.env.example provision_aws/.env

# Configure main .env
COMPANY_NAME="Your Company"
REGION="us-east-1"
DOMAIN_NAME="proposals.yourcompany.com"
VITE_CLOUDFRONT_URL="https://xxx.cloudfront.net"
VITE_FEEDBACK_URL="https://xxxx.lambda-url.us-east-1.on.aws"

# Configure AWS .env
AWS_PROFILE=default
CERTIFICATE_ARN=arn:aws:acm:us-east-1:xxxx
```

3. **AWS Deployment**
```bash
# Deploy infrastructure
cd provision_aws
./provision.sh

# Verify deployment
aws cloudformation describe-stacks --stack-name proposal-website

# Upload example content
./scripts/upload-examples.sh
```

4. **Local Development**
```bash
# Start dev server
npm run dev

# Run type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
├── provision_aws/                # AWS Infrastructure
│   ├── provision.sh             # Main deployment script
│   ├── template.yaml            # CloudFormation template
│   └── .env                     # AWS configuration
├── scripts/                     # Utility Scripts
│   ├── upload-examples.sh       # Example uploader
│   └── generate-content.js      # Content generator
├── src/
│   ├── admin/                   # Admin Interface
│   │   ├── components/          # Admin-specific components
│   │   │   ├── DynamicForm/    # Form generation
│   │   │   ├── IconSelector/   # Icon picker
│   │   │   └── Preview/        # Live preview
│   │   └── ProposalForm/       # Main form logic
│   ├── components/              # Shared Components
│   │   ├── layout/             # Layout components
│   │   ├── ui/                 # UI elements
│   │   ├── Feedback/           # Feedback component
│   │   └── sections/           # Proposal sections
│   ├── data/                   # Content & Templates
│   │   ├── examples/           # Example proposals
│   │   └── schemas/            # Content schemas
│   ├── hooks/                  # Custom React hooks
│   ├── styles/                 # Global styles
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
│   │   ├── feedback.ts         # Feedback handling
│   │   └── proposal.ts         # Proposal loading
│   └── tests/                     # Test suites
```

## 🛠 Usage Guide

### Creating New Proposals

1. **Access Admin Interface**
   - Navigate to `/admin`
   - Log in if required
   - Select "New Proposal"

2. **Basic Information**
   - Client name and details
   - Project title
   - Industry/category
   - Overview description

3. **Content Sections**
   - Problem statement
     - Current challenges
     - Impact analysis
     - Market context
   - Solution features
     - Key benefits
     - Technical details
     - Implementation approach
   - Process/Timeline
     - Project phases
     - Milestones
     - Deliverables
   - Pricing/Investment
     - Cost breakdown
     - Payment terms
     - Optional add-ons

4. **Customization**
   - Brand colors
   - Typography
   - Custom images
   - Icon selection

5. **Security Settings**
   - Password protection
   - Expiration date
   - Access restrictions
   - Tracking options

6. **Preview & Publish**
   - Review all sections
   - Test responsiveness
   - Check integrations
   - Generate URL

### Example Templates

1. **Using Templates**
   ```bash
   # List available templates
   ls src/data/examples/

   # Copy template
   cp src/data/examples/company-xyz.json src/data/proposals/new-proposal.json

   # Upload to S3
   ./scripts/upload-examples.sh
   ```

2. **Creating Templates**
   - Start with base schema
   - Add custom sections
   - Include sample content
   - Document customization

### Feedback System

1. **Implementation**
   - Lambda Function URL for API
   - Single comments.json per proposal
   - Section-based feedback
   - Automatic timestamp and ID generation

2. **Features**
   - Get feedback by proposal
   - Submit new feedback
   - Cache management
   - Error handling

3. **Security**
   - CORS validation
   - Origin checking
   - S3 bucket policies
   - Lambda permissions

## 🔐 Security Implementation

### AWS Security

1. **S3 Bucket Policies**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bucket-name/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::account-id:distribution/dist-id"
        }
      }
    }
  ]
}
```

2. **IAM Roles**
   - Proposal creator role
   - Content manager role
   - Admin role
   - Read-only role

### Content Security

1. **Password Protection**
   - Bcrypt hashing
   - Salt generation
   - Temporary access
   - Rate limiting

2. **URL Security**
   - Signed URLs
   - Expiration
   - IP restrictions
   - Referrer checking

## 📝 Development

### Local Development
```bash
# Start development
npm run dev

# Type checking
npm run type-check

# Testing
npm run test
npm run test:watch

# Linting
npm run lint
npm run lint:fix
```

### AWS Deployment
```bash
# Full deployment
cd provision_aws
./provision.sh

# Update content only
./scripts/upload-examples.sh

# Update infrastructure
aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name proposal-website
```

### Environment Variables

1. **Development**
```env
VITE_AWS_REGION=us-east-1
VITE_CLOUDFRONT_URL=https://xxx.cloudfront.net
VITE_API_ENDPOINT=https://api.example.com
```

2. **Production**
```env
NODE_ENV=production
COMPANY_NAME=Your Company
DOMAIN_NAME=proposals.company.com
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Make changes
   - Follow style guide
   - Add tests
   - Update documentation
4. Commit changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. Push to branch
   ```bash
   git push origin feature/amazing-feature
   ```
6. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔄 Updates & Maintenance

### Version History
- v1.0.0 - Initial release
- v1.1.0 - AWS integration
- v1.2.0 - Enhanced security
- v1.3.0 - Example templates

### Roadmap
- [ ] Multi-language support
- [ ] Analytics integration
- [ ] Custom themes
- [ ] API documentation

## 🔄 Updates & Maintenance

### Version History
- v1.0.0 - Initial release
- v1.1.0 - AWS integration
- v1.2.0 - Enhanced security
- v1.3.0 - Example templates

### Roadmap
- [ ] Multi-language support
- [ ] Analytics integration
- [ ] Custom themes
- [ ] API documentation