# Sun-Serve - Solar Panel Installation & Maintenance Management System

## 📋 Project Overview

SunServe is a comprehensive full-stack web application designed to manage solar panel installations, maintenance requests, service tickets, and equipment inventory. The system streamlines operations for solar installation companies by providing a centralized platform for managing customer requests, technician assignments, and business workflows.

### Business Problem

Solar installation companies face challenges in:

- **Managing Installation Requests**: Tracking customer inquiries from initial request through completion
- **Coordinating Technicians**: Efficiently assigning and scheduling technician workloads
- **Maintenance Tracking**: Organizing routine maintenance and emergency repairs
- **Inventory Management**: Monitoring solar panel equipment and supplies
- **Service Quality**: Ensuring timely responses to customer service tickets
- **Data Organization**: Maintaining accurate records across multiple business processes

SunServe solves these problems by providing a role-based management system that enforces business rules, automates workflows, and ensures data integrity.

---

## 🎯 Business Workflows

### 1. User Authentication Workflow

- Account creation with role assignment (Customer, Technician, Manager, Admin)
- Secure login using JWT-based authentication
- Role-based access control to protected resources
- Session management and token validation

### 2. Installation Request Workflow

1. **Customer** submits installation request with system specifications
2. **Manager/Admin** reviews and approves request
3. **Manager** assigns installation to qualified technician
4. **Technician** performs installation and updates status
5. **System** tracks progress from request to completion

### 3. Maintenance Management Workflow

1. **Customer** requests maintenance for existing installation
2. **System** validates installation ownership
3. **Manager** schedules maintenance and assigns technician
4. **Technician** performs service and records details
5. **System** updates maintenance history and costs

### 4. Service Ticket Workflow

1. **Any User** creates service ticket for issues or inquiries
2. **Manager** prioritizes and assigns tickets to appropriate staff
3. **Assigned Staff** investigates and resolves ticket
4. **System** tracks resolution time and customer satisfaction

### 5. Equipment Inventory Workflow

- **Manager/Admin** adds equipment to inventory
- **System** tracks stock levels and alerts on low inventory
- **Technicians** reference available equipment for installations
- **Managers** monitor equipment costs and supplier information

---

## 👥 User Roles

### Customer

- **Permissions**:
  - Create installation requests
  - Submit maintenance requests for their installations
  - Create service tickets
  - View their own installations, maintenance history, and tickets
- **Restrictions**: Cannot access other customers' data, cannot approve requests

### Technician

- **Permissions**:
  - View assigned installations and maintenance requests
  - Update status of assigned work
  - Create service tickets
  - View equipment inventory
- **Restrictions**: Cannot approve installations, limited to assigned work

### Manager

- **Permissions**:
  - Approve installation requests
  - Assign work to technicians
  - Manage equipment inventory
  - View all installations, maintenance, and tickets
  - Assign service tickets
- **Restrictions**: Cannot delete users, limited administrative functions

### Admin

- **Permissions**:
  - Full system access
  - User management (create, update, delete)
  - System configuration
  - All manager permissions
- **Restrictions**: None

---

## 🛠 Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcryptjs

### Development Tools

- **Version Control**: Git & GitHub
- **API Testing**: Postman
- **Development Server**: Nodemon

### Frontend (Phase III)

- **Framework**: React
- **Integration**: REST API communication

---

## 📊 Database Architecture

### Collections (6 Total)

1. **Users** - Customer, Technician, Manager, Admin accounts
2. **Installations** - Solar panel installation records
3. **MaintenanceRequests** - Maintenance and repair requests
4. **ServiceTickets** - Customer service and issue tracking
5. **Equipment** - Inventory management for solar components
6. **Schedules** - Technician scheduling and availability

### Key Relationships

- Users → Installations (customer relationship)
- Users → Installations (technician assignment)
- Installations → MaintenanceRequests (service history)
- Users → ServiceTickets (creator and assignee)
- Users → Schedules (technician schedules)

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - Register new user (Public)
- `POST /api/auth/login` - User login (Public)
- `GET /api/auth/me` - Get current user (Protected)

### User Routes (`/api/users`)

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user (Protected)
- `PUT /api/users/:id` - Update user (Protected)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/role/:role` - Get users by role (Admin/Manager)

### Installation Routes (`/api/installations`)

- `POST /api/installations` - Create installation request (Customer)
- `GET /api/installations` - Get installations (Protected, role-filtered)
- `GET /api/installations/:id` - Get single installation (Protected)
- `PUT /api/installations/:id` - Update installation (Manager/Admin)
- `DELETE /api/installations/:id` - Delete installation (Admin only)

### Maintenance Routes (`/api/maintenance`)

- `POST /api/maintenance` - Create maintenance request (Customer)
- `GET /api/maintenance` - Get maintenance requests (Protected, role-filtered)
- `GET /api/maintenance/:id` - Get single request (Protected)
- `PUT /api/maintenance/:id` - Update request (Manager/Admin/Technician)
- `DELETE /api/maintenance/:id` - Delete request (Admin only)

### Service Ticket Routes (`/api/tickets`)

- `POST /api/tickets` - Create service ticket (Protected)
- `GET /api/tickets` - Get tickets (Protected, role-filtered)
- `GET /api/tickets/:id` - Get single ticket (Protected)
- `PUT /api/tickets/:id` - Update ticket (Protected)
- `DELETE /api/tickets/:id` - Delete ticket (Admin only)

### Equipment Routes (`/api/equipment`)

- `POST /api/equipment` - Add equipment (Admin/Manager)
- `GET /api/equipment` - Get all equipment (Protected)
- `GET /api/equipment/:id` - Get single equipment (Protected)
- `PUT /api/equipment/:id` - Update equipment (Admin/Manager)
- `DELETE /api/equipment/:id` - Delete equipment (Admin only)
- `GET /api/equipment/lowstock` - Get low stock items (Admin/Manager)

### System Routes

- `GET /api/health` - Health check (Public)

**Total Endpoints**: 29 (exceeds 10 minimum requirement)
**Protected Endpoints**: 26 (exceeds 3 minimum requirement)

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm (comes with Node.js)
- Git

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/sunserve.git
   cd sunserve/sunserve-backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret_key
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   - **Local MongoDB**:
     ```bash
     mongod
     ```
   - **MongoDB Atlas**: Use connection string in MONGODB_URI

5. **Start the Development Server**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

6. **Verify Installation**

   ```bash
   curl http://localhost:5000/api/health
   ```

   Expected response:

   ```json
   {
     "success": true,
     "message": "SunServe API is running successfully",
     "timestamp": "2024-02-12T...",
     "environment": "development"
   }
   ```

---

## 🧪 Testing with Postman

1. **Import Collection**: Create a Postman collection for SunServe
2. **Set Environment Variables**:
   - `BASE_URL`: `http://localhost:5000/api`
   - `TOKEN`: (will be set after login)

3. **Test Authentication**:
   - Register a user: `POST {{BASE_URL}}/auth/register`
   - Login: `POST {{BASE_URL}}/auth/login`
   - Copy the token from login response
   - Add to Authorization header: `Bearer YOUR_TOKEN`

4. **Test Protected Routes**:
   - Use the token in Authorization header for all protected endpoints
   - Test role-based access control by creating users with different roles

---

## 📁 Project Structure

```
sunserve-backend/
│
├── config/
│   └── database.js          # MongoDB connection
│
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management
│   ├── installationController.js
│   ├── maintenanceController.js
│   ├── ticketController.js
│   └── equipmentController.js
│
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── authorize.js         # Role-based authorization
│   ├── errorHandler.js      # Centralized error handling
│   └── validate.js          # Request validation
│
├── models/
│   ├── User.js              # User schema
│   ├── Installation.js      # Installation schema
│   ├── MaintenanceRequest.js
│   ├── ServiceTicket.js
│   ├── Equipment.js
│   └── Schedule.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── installationRoutes.js
│   ├── maintenanceRoutes.js
│   ├── ticketRoutes.js
│   └── equipmentRoutes.js
│
├── utils/
│   └── constants.js         # Application constants
│
├── .env                     # Environment variables (not in repo)
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js                # Application entry point
```

---

## 🔒 Security Features

### Implemented Security Measures

1. **Password Hashing**: Using bcryptjs with salt rounds
2. **JWT Authentication**: Secure token-based authentication
3. **Role-Based Authorization**: Backend enforcement of user permissions
4. **Input Validation**: Request validation middleware
5. **Error Handling**: Secure error messages (no stack traces in production)
6. **Environment Variables**: Sensitive data stored in .env file
7. **CORS Configuration**: Controlled cross-origin requests
8. **Protected Routes**: Middleware-based route protection

### Security Best Practices

- Passwords never returned in API responses
- Sensitive routes require authentication token
- Role-based access enforced at backend level
- SQL injection prevented through Mongoose ODM
- XSS protection through input validation

---

## 📈 Project Status

### Phase I - Backend Foundation ✅

- [x] Project setup and configuration
- [x] Database connection established
- [x] 6 MongoDB collections with schemas
- [x] 29 RESTful API endpoints
- [x] Authentication and authorization
- [x] Error handling middleware
- [x] GitHub repository initialized
- [x] README documentation

### Phase II - Database and Security Integration (Upcoming)

- [ ] Full MongoDB integration and testing
- [ ] Enhanced security features
- [ ] Data validation and integrity enforcement
- [ ] Advanced authentication features

### Phase III - Frontend Integration and Deployment (Future)

- [ ] React frontend development
- [ ] API integration
- [ ] Deployment to hosting platform
- [ ] Production configuration

---

## 👥 Team Members

- **Member 1**: [Name] - Project Setup & Authentication
- **Member 2**: [Name] - User Management & Authorization
- **Member 3**: [Name] - Installation & Equipment Management
- **Member 4**: [Name] - Maintenance & Service Tickets
- **Member 5**: [Name] - Middleware & Error Handling

---

## 📝 Development Guidelines

### Git Workflow

1. Create feature branches from main
2. Write meaningful commit messages
3. Each team member must make at least 5 meaningful commits
4. Pull latest changes before pushing
5. Resolve conflicts before merging

### Coding Standards

- Use consistent naming conventions
- Add comments for complex logic
- Follow RESTful API design principles
- Validate all user inputs
- Handle errors gracefully

---

## 🐛 Known Issues / Future Enhancements

### Phase I Limitations

- MongoDB must be running locally or connection string configured
- No frontend interface yet (API-only)
- Limited testing coverage

### Planned Enhancements (Phase II & III)

- Email notifications for status updates
- File upload for installation photos
- Advanced reporting and analytics
- Real-time technician tracking
- Mobile app support

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 📄 License

This project is developed as part of a course assignment at Humber College.

---

## 🤝 Support

For questions or issues:

1. Check the course project specification document
2. Review this README
3. Contact team members
4. Reach out to the course instructor

---

## 🎓 Academic Integrity

All code in this repository is original work by the team members listed above. Any external libraries or code snippets are properly attributed. This project adheres to Humber College's Academic Integrity Policy.

---

**Course**: Modern Web Technologies  
**Institution**: Humber College  
**Semester**: Winter 2024  
**Project Weight**: 30% of final grade

---

_Last Updated: February 2024_
