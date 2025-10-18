# Backend ERP - Purchase Module

Backend system for the Purchase module of an academic ERP.

## Installation

```bash
npm install
```

## Database Configuration

Configure your environment variables in `.env` file:
```bash
DB_HOST=your_host
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
DB_SSL=true
JWT_SECRET=your_jwt_secret
PORT=3000
```

Run the database setup script to create tables and load initial data:
```bash
node setup-db.js
```

## Execution

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verificar` - Token verification

### Suppliers
- `GET /api/proveedores` - List all suppliers
- `GET /api/proveedores/:id` - Get supplier by ID
- `POST /api/proveedores` - Create new supplier
- `PUT /api/proveedores/:id` - Update supplier
- `DELETE /api/proveedores/:id` - Delete supplier

### Purchase Orders
- `GET /api/compras` - List all purchase orders
- `GET /api/compras/:id` - Get purchase order by ID
- `POST /api/compras` - Create new purchase order
- `PUT /api/compras/:id` - Update purchase order
- `DELETE /api/compras/:id` - Delete purchase order

## Business Rules

### Purchase Order States
- **PENDIENTE**: Created, waiting for approval
- **APROBADA**: Approved by supervisor
- **RECHAZADA**: Rejected
- **RECIBIDA**: Merchandise received
- **CANCELADA**: Cancelled

### Roles and Permissions
- **supervisor**: Full access (create, modify, delete, approve orders)
- **comprador**: Create and modify orders
- **consulta**: Read-only access

### Validations
- Supplier is mandatory when creating an order
- Products must exist in inventory
- Quantities and prices cannot be negative
- Employee must exist
