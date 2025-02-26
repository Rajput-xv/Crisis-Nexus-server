# Crisis Nexus

## A central hub for disaster awareness and management in Disaster-Prone Areas

Welcome to the Crisis Nexus Platform, a cutting-edge solution designed to enhance awareness and management in disaster-prone areas. This platform leverages advanced technology to provide strategic solutions for management during critical times.

## Table of Contents
- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Backend Setup](#backend-setup)
- [Running the Application](#running-the-application)
- [License](#license)

## Project Overview
The Crisis Nexus Platform is a comprehensive solution aimed at improving resilience in areas vulnerable to natural disasters. Key features include:
- Real-time data collection and analysis
- Secured Donation of resources
- Collaborative platform for relief efforts
- Awareness workshpos & lectures

Our platform combines cutting-edge technology with strategic planning to ensure sustainable resources during and after disasters.

## Setup Instructions
To get started with the Disaster Relief and Recovery Platform, follow these steps:
1. Fork and clone the repository.
2. Set up environment variables.
3. Install dependencies.
4. Start the application.

## Environment Variables
Create a `.env` file in the server directory of your project with the following content:

Generate a JWT secret key using the following command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
```bash
MONGODB_URI=mongodb://atlas-sql-679b6550f8ad6a407aa4ea76-21pnx.a.query.mongodb.net/test?ssl=true&authSource=admin
JWT_SECRET=your_generated_jwt_secret_key_here
OPENWEATHER_API_KEY=Your_Api_Key
PORT=5000
```
Replace the placeholder values with your generated JWT secret key.

## Backend Setup
Navigate to the server directory and run the following commands:
```bash
cd ./server
npm install
npm start
```


## Running the Application
Once both backend and frontend setups are complete, your Disaster Relief and Recovery Platform should be running and ready for use.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

Thank you for exploring the Disaster Relief and Recovery Platform. Together, we can build a more resilient future for communities worldwide.
