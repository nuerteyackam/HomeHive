# HomeHive
Real Estate Listing Platform

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Demo](#demo)
- [License](#license)

---

## About the Project
HomeHive is a full-stack real estate listing platform that allows users to browse, create, and manage property listings. It includes features for property management, user management, and investment analysis, making it a comprehensive solution for real estate agents, administrators, and potential buyers.

---

## Features
- **User Management**:
  - Admins can create, edit, delete, and manage users.
  - Role-based access control (Admin, Agent, Regular User).

- **Property Management**:
  - Agents can create, edit, and delete property listings.
  - Properties include details like price, bedrooms, bathrooms, square footage, and location.

- **Investment Analysis**:
  - Users can calculate ROI, cash flow, and other metrics for properties.

- **Activity Logs**:
  - Admins can view logs of user actions for better accountability.

- **Authentication**:
  - Secure login and registration using JWT-based authentication.

- **Responsive Design**:
  - Fully responsive UI for desktop and mobile devices.

---

## Technologies Used
### Frontend:
- React.js
- Axios
- Bootstrap

### Backend:
- Node.js
- Express.js
- PostgreSQL
- JSON Web Tokens (JWT) for authentication

### Deployment:
- Frontend: Vercel
- Backend: Render

---

## Installation
### Prerequisites:
- Node.js (v18.x or higher)
- PostgreSQL

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/HomeHive.git
   cd HomeHive
   ```

2. Install dependencies for both the client and server:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Set up the PostgreSQL database:
   - Create a new database (e.g., `homehive`).
   - Run the migrations or import the database schema.

4. Configure environment variables (see [Environment Variables](#environment-variables)).

5. Start the development servers:
   - Backend:
     ```bash
     cd server
     npm run dev
     ```
   - Frontend:
     ```bash
     cd client
     npm start
     ```

---

## Environment Variables
Create a `.env` file in both the `client` and `server` directories with the following variables:

### Server (`server/.env`):
```env
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/homehive
JWT_SECRET=your_jwt_secret
```

### Client (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5000
```

---

## Usage
1. **Admin Dashboard**:
   - Navigate to `/admin` to manage users, properties, and activity logs.

2. **Property Listings**:
   - Browse properties on the homepage.
   - Create or edit properties as an agent.

3. **Investment Analysis**:
   - Use the analytics page to calculate ROI and other metrics.

4. **Authentication**:
   - Log in or register to access features based on your role.

---

## Folder Structure
```
HomeHive/
├── client/                  # Frontend code
│   ├── public/              # Public assets
│   ├── src/                 # React source code
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions (e.g., axios instance)
│   │   └── context/         # Context API for authentication
├── server/                  # Backend code
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Middleware (e.g., auth)
│   └── config/              # Configuration files
└── README.md                # Project documentation
```

---

## API Endpoints
### Authentication:
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Log in and receive a JWT.

### Users:
- `GET /api/users/admin/all` - Get all users (Admin only).
- `POST /api/users/admin/create` - Create a new user (Admin only).
- `PUT /api/users/admin/:id` - Update a user (Admin only).
- `DELETE /api/users/admin/:id` - Delete a user (Admin only).

### Properties:
- `GET /api/properties` - Get all properties.
- `POST /api/properties` - Create a new property (Agent only).
- `PUT /api/properties/:id` - Update a property (Agent only).
- `DELETE /api/properties/:id` - Delete a property (Agent only).

### Investment Analysis:
- `GET /api/investment-analyses` - Get all analyses for the logged-in user.
- `POST /api/investment-analyses` - Create a new analysis.
- `DELETE /api/investment-analyses/:id` - Delete an analysis.

---

## Deployment
### Frontend:
1. Build the React app:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `build` folder to Vercel.

### Backend:
1. Deploy the backend to Render or another hosting platform.
2. Ensure the `DATABASE_URL` and `JWT_SECRET` environment variables are set.

---

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## Live Demo
Check out the live application here: [HomeHive Live App](https://homehive-pbjjrxjhl-joels-projects-13e73204.vercel.app/)

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
