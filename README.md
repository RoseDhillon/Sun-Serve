SunServe - Solar Panel Installation & Maintenance Management System
Project Phase I - Backend Foundation

Business Case Definition
Problem Statement
Solar installation companies face significant operational challenges in managing their business processes. Current systems are fragmented, leading to inefficiencies in tracking customer requests, coordinating technician schedules, managing equipment inventory, and ensuring timely service delivery. There is no centralized platform that integrates installation management, maintenance tracking, service ticketing, and inventory control into a cohesive system with role-based access control.
Use Case
SunServe addresses the operational needs of solar installation companies by providing a comprehensive management platform that:

For Customers: Submit installation requests, schedule maintenance services, track their solar panel systems, and create service tickets for issues
For Technicians: View assigned installations and maintenance jobs, update work status, access equipment specifications, and manage daily schedules
For Managers: Approve installation requests, assign work to technicians, monitor inventory levels, track service quality metrics, and manage resource allocation
For Administrators: Oversee all system operations, manage user accounts across all roles, configure system settings, and maintain data integrity

Solution
The proposed solution is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js) with JWT-based authentication. The system implements:
Core Architecture

RESTful API Backend: Node.js with Express.js handling 29 endpoints across 6 resource categories
NoSQL Database: MongoDB with Mongoose ODM managing 6 collections with defined relationships
Authentication & Authorization: JWT-based authentication with role-based access control enforced at the backend level
Security: bcrypt password hashing, protected routes, input validation, and centralized error handling

Business Workflows

Installation Request Workflow: Customer submission → Manager approval → Technician assignment → Job completion → Status tracking
Maintenance Management: Customer request → Schedule creation → Technician assignment → Service delivery → Record keeping
Service Ticket System: Issue creation → Priority assignment → Technician assignment → Resolution → Closure
Equipment Inventory: Stock tracking → Low inventory alerts → Restock management → Equipment allocation
User Authentication: Role-based registration → Secure login → Protected resource access → Session management

Data Models
User
Purpose: Manages all system users across four roles (Admin, Manager, Technician, Customer)
Fields:

Authentication: email (unique), password (hashed), role
Personal Information: name, phone, address (street, city, state, zipCode)
Status: isActive, createdAt

Relationships: Referenced in installations (customer, assignedTechnician), maintenance requests, service tickets, and schedules

Installation
Purpose: Tracks solar panel installation requests from inquiry through completion
Fields:

Customer Information: customer (ref: User), address
System Specifications: systemSize, panelType, numberOfPanels, estimatedCost
Workflow: status (requested, approved, scheduled, in_progress, completed, cancelled)
Assignment: assignedTechnician (ref: User), approvedBy (ref: User)
Dates: requestedDate, scheduledDate, completedDate

Relationships: Linked to User (customer, technician, approver), referenced by MaintenanceRequest

MaintenanceRequest
Purpose: Manages ongoing maintenance and service needs for installed systems
Fields:

References: customer (ref: User), installation (ref: Installation)
Request Details: requestType (routine, repair, inspection, cleaning, upgrade), description, priority
Workflow: status (requested, scheduled, in_progress, completed, cancelled)
Assignment: assignedTechnician (ref: User)
Tracking: scheduledDate, completedDate, estimatedDuration, actualDuration, cost

Relationships: Links Customer → Installation → Maintenance history

ServiceTicket
Purpose: Tracks customer service issues and internal support requests
Fields:

Identification: ticketNumber (auto-generated: TICKET-000001), title, description
Classification: category (technical, billing, general, emergency, warranty), priority, status
Assignment: createdBy (ref: User), assignedTo (ref: User)
Context: relatedInstallation (ref: Installation), relatedMaintenance (ref: MaintenanceRequest)
Resolution: resolution, closedAt

Relationships: Can link to installations and maintenance requests for context

Equipment
Purpose: Manages solar panel equipment and component inventory
Fields:

Identification: name, category, manufacturer, model
Specifications: power, voltage, dimensions, weight, warranty, efficiency
Inventory: quantity, minimumStock, unitPrice, location
Supplier: supplier.name, supplier.contact, supplier.email
Tracking: lastRestocked, isActive

Relationships: Referenced when assigning equipment to installations

Schedule
Purpose: Manages technician work schedules and prevents double-booking
Fields:

Assignment: technician (ref: User), date, timeSlot (morning, afternoon, evening)
Job Details: jobType (installation, maintenance, inspection, repair)
References: relatedInstallation, relatedMaintenance
Status: status (scheduled, in_progress, completed, cancelled, rescheduled)
Location: street, city, state, zipCode
Timing: estimatedDuration, actualStartTime, actualEndTime

Relationships: Links technicians to specific jobs with time constraints
Constraints: Unique index on (technician + date + timeSlot) prevents double-booking

Technology Stack
Backend

Runtime: Node.js
Framework: Express.js v4.18.2
Database: MongoDB with Mongoose ODM v8.0.3
Authentication: JSON Web Tokens (jsonwebtoken v9.0.2)
Security: bcryptjs v2.4.3 for password hashing
Environment: dotenv v16.3.1 for configuration
CORS: cors v2.8.5 for cross-origin requests

Development Tools

Hot Reload: nodemon v3.0.2
Version Control: Git & GitHub (Private Repository)
API Testing: Postman / Thunder Client
Database GUI: MongoDB Compass (Optional)

Setup Instructions
Prerequisites

Node.js v14 or higher
MongoDB (local installation) OR MongoDB Atlas account (cloud)
npm package manager
Git

Installation Steps

Clone Repository

bash git clone https://github.com/YOUR_USERNAME/sunserve.git
cd sunserve

Install Dependencies

bash npm install

Configure Environment Variables
Create backend/.env file:

env PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sunserve
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000

Start MongoDB (if using local installation)

bash mongod

Start Development Server

bash npm run dev

Verify Installation

bash curl http://localhost:5000/api/health

API Endpoints Summary
Total Endpoints: 29 (Exceeds requirement of 10)
Protected Endpoints: 26 (Exceeds requirement of 3)

Authentication: 3 endpoints
User Management: 5 endpoints
Installations: 5 endpoints
Maintenance: 5 endpoints
Service Tickets: 5 endpoints
Equipment: 6 endpoints

Full API documentation available in project documentation.

Security Implementation

Password Security: bcrypt hashing with salt rounds
Token Management: JWT with configurable expiration
Role-Based Access: Four roles (Admin, Manager, Technician, Customer)
Backend Enforcement: All authorization server-side
Input Validation: Middleware validates all requests
Error Handling: Centralized, secure error responses

Project Status
Phase I - Backend Foundation -- COMPLETED
Phase II - Database & Security Integration (WORKING)
Phase III - Frontend & Deployment (FUTURE)

Team Members

Member 1: [Zixin Li] - Project Setup & Configuration
Member 2: [Kim Joson] - Authentication & User Management
Member 3: [Thi Tieu Man Tran] - Installation Management
Member 4: [Gurleen Kaur] - Maintenance Requests
Member 5: [Adit Rakeshkumar Rana] - Service Tickets & Equipment
Member 6: [Rosenoor Singh Dhillon] - Scheduling & Middleware
