# Project README

Welcome to our project! This guide will help you get started with setting up the project environment on your local machine. Please follow the instructions carefully to ensure a smooth setup process.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node
- Git
- A MySQL database server

### Cloning the Repository

First, clone the repository to your local machine using Git:

```bash
git clone <repository-url>
cd <repository-directory>
```

Replace `<repository-url>` with the URL of this Git repository, and `<repository-directory>` with the name of the folder where the repository is cloned.

### Configuration Files

After cloning the repository, you need to create two important configuration files: `development.json` and `.env`. These files will store your local development environment settings.

#### Creating `development.json`

Create a file named `development.json` in the root directory of the project. Open it with your favorite text editor and fill in the fields as shown below:

```json
{
  "NODE_ENV": "production",
  "PORT": "3000",
  "BASE_URL": "https://localhost:3000",
  "DB": {
    "USERNAME": "",
    "PASSWORD": "",
    "NAME": "",
    "HOSTNAME": "",
    "DIALECT": "mysql"
  },
  "CORS": {
    "WHITE_LIST": [""]
  }
}
```

Make sure to replace the empty fields (`USERNAME`, `PASSWORD`, `NAME`, `HOSTNAME`, and the `WHITE_LIST` array) with your actual database credentials and desired CORS white list domains.

#### Creating `.env` File

Create a file named `.env` in the root directory of the project. This file will store environment variables. For now, add the following line:

```env
NODE_ENV=development
```

This sets the Node environment to development mode. You can change this to `production` if you are deploying the application.

### Installing Dependencies

With the configuration files in place, install the project dependencies by running:

```bash
npm install
```

### Running the Application

To start the application, run:

```bash
npm start
```

This will start the server on the port specified in your `development.json` file (default is 3000). You can access the application by navigating to `http://localhost:3000` in your web browser.
