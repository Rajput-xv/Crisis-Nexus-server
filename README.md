# Crisis Nexus Server

A robust backend server for disaster awareness and management in disaster-prone areas.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Server](#running-the-server)
- [License](#license)

## Overview

Crisis Nexus Server is a comprehensive backend solution designed to enhance disaster awareness and management capabilities. The platform provides a centralized hub for coordinating relief efforts, managing resources, and facilitating communication during critical times.

## Features

- **Authentication & Authorization**: Secure user registration and login with JWT tokens
- **User Management**: Comprehensive user profiles and role-based access control
- **Event Management**: Create, track, and manage disaster-related events
- **Task Coordination**: Assign and monitor relief tasks and activities
- **Resource Management**: Track and allocate emergency resources
- **Donation System**: Secure platform for resource donations with Stripe integration
- **Incident Reporting**: Real-time incident reporting and tracking
- **Weather Integration**: Live weather data integration for better planning
- **Hospital Services**: Hospital and medical facility management
- **Email Notifications**: Automated email services for critical updates

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Payment Processing**: Stripe
- **Email Service**: Nodemailer with SendinBlue API
- **Cloud Storage**: Cloudinary
- **Weather API**: OpenWeather API
- **File Upload**: Multer
- **Development**: Nodemon

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Crisis-Nexus-server
   ```

2. **Navigate to server directory**
   ```bash
   cd server
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Environment Configuration

Create a `.env` file in the server directory with the following variables:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# External APIs
OPENWEATHER_API_KEY=your_openweather_api_key

# Server Configuration
PORT=5000

# Email Service (SendinBlue)
SENDINBLUE_API_KEY=your_sendinblue_api_key

<!-- # Payment Processing (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret -->
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Running the Server

### Development Mode
```bash
npm run dev
```

The server will start on the specified PORT (default: 5000) and connect to your MongoDB database.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Crisis Nexus Server** - Building resilient communities through technology.
