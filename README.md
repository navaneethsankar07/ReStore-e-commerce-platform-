# ReStore – C2C Marketplace Platform

ReStore is a modern C2C marketplace platform designed for buying and selling pre-owned items. It provides a simple and responsive interface for users to list products, browse available items, and manage their listings.

## Features

* User authentication with Firebase Authentication
* Create, update, and delete product listings
* Browse and search available products
* Product details with images and seller information
* Image upload and management using Cloudinary
* Shopping cart functionality
* State management using Redux Toolkit
* Responsive design for desktop and mobile devices
* Real-time data management with Firebase Firestore

## Tech Stack

### Frontend

* React.js
* Vite
* Redux Toolkit
* React Router
* CSS

### Backend & Services

* Firebase Authentication
* Firebase Firestore
* Cloudinary

## Getting Started

### Prerequisites

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/navaneethsankar07/ReStore.git
cd ReStore
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and configure the required Firebase and Cloudinary environment variables.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Environment Variables

The application requires Firebase and Cloudinary configuration through environment variables.

Do not commit your `.env` file or expose private credentials in the repository.

## Production Build

Create a production build with:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## License

This project was developed as a personal project for learning and demonstrating modern frontend development practices.
