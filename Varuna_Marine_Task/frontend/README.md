## Fuel EU Frontend

A modern React-based web application built for the Fuel EU Maritime Compliance Platform, enabling users to manage routes, compare emissions data, and maintain compliance through intuitive dashboards.

## Overview

The Fuel EU Frontend serves as the presentation layer of the platform, providing a clean and responsive interface for maritime compliance operations.
It connects seamlessly with backend services to visualize data such as routes, fuel usage, compliance baselines, and pool management.

The project is designed with scalability and modularity in mind, following Hexagonal (Ports and Adapters) architecture to maintain a clear separation of concerns between core logic and external dependencies.

## Architecture Summary

This frontend follows a Hexagonal Architecture structure:

src/
├── core/
│ ├── domain/ # Core business entities and models
│ ├── application/ # Business use-cases (state, actions, logic)
│ └── ports/ # Interfaces for communication with external systems
│
├── adapters/
│ ├── ui/ # React components, pages, and hooks
│ └── infrastructure/ # API clients, services, and data adapters
│
└── assets/ # Static files (images, styles, etc.)

This structure ensures:

Clear separation of concerns between business logic and UI.

Easy testing and maintenance.

Plug-and-play flexibility for APIs or UI updates.

## Setup & Run Instructions

Clone the repository

git clone https://github.com/yourusername/fuel-eu-frontend.git
cd fuel-eu-frontend

Install dependencies

npm install

Start the development server

npm run dev

The application will be available at http://localhost:3000

(Optional) Build for production

npm run build

## Running Tests

Execute the test suite using:

npm test

You can also run tests in watch mode:

npm run test:watch

## Routes Management

Manage vessel routes, set baselines, and check compliance.

Sample API Request
GET /api/routes
Response:
[
{
"id": 1,
"vessel": "Aurora",
"fuelType": "Biofuel",
"complianceStatus": "Compliant"
}
]

## Key Features

Routes Tab – View, edit, and manage maritime routes and baseline emissions.

Compare Tab – Analyze compliance status and compare emissions data.

Banking Tab – Bank surplus energy credits and apply stored amounts.

Pooling Tab – Create and manage pools for compliance balance transfers.

Responsive UI – Fully responsive and optimized for multiple screen sizes.

## Tech Stack

Frontend: React + Vite

State Management: Context API / Redux Toolkit (if applicable)

Styling: Tailwind CSS

Testing: Jest + React Testing Library

API Communication: Axios

## Contributing

Pull requests and suggestions are welcome!
Please create a branch and submit a PR for review.
