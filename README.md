# Community Watch - Police Management System

A full-stack web application for managing police operations, crime reports, and officer assignments.

## Features

### 🔐 Authentication System
- Secure login for police officers and administrators
- Role-based access control (Admin/Officer)
- Session management with localStorage

### 📊 Dashboard
- Real-time statistics overview
- Recent crime reports display
- Priority cases highlighting
- Quick action buttons

### 🚨 Crime Reports Management
- View all crime reports with filtering and search
- Filter by status (Open, Pending, Closed)
- Filter by crime category
- Detailed report view with modal
- Officer assignment tracking

### 👮 Officers Management
- View all police officers
- Filter by role (Admin/Officer)
- Officer profile details
- Assignment history tracking
- Contact information management

### 📋 Assignment Management
- View assignments in multiple formats:
  - All assignments list
  - Grouped by officer
  - Grouped by case
- Track officer roles in cases
- Assignment status monitoring

## Technology Stack

### Backend (Flask)
- **Flask** - Web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-RESTful** - REST API development
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-Bcrypt** - Password hashing
- **SQLite** - Database

### Frontend (React)
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Context API** - State management
- **CSS3** - Modern styling with CSS variables
- **Responsive Design** - Mobile-first approach

## Project Structure

```
Community-watch/
├── server/                 # Flask backend
│   ├── app.py             # Main application file
│   ├── models.py          # Database models
│   ├── config.py          # Configuration
│   ├── decorators.py      # Authentication decorators
│   └── seed.py            # Database seeding
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── data/          # Mock data for development
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install Python dependencies:
   ```bash
   pipenv install
   pipenv shell
   ```

3. Initialize the database:
   ```bash
   python seed.py
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```
   The server will run on `http://localhost:5555`

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The client will run on `http://localhost:4000`

## Demo Credentials

### Admin Access
- **Email:** john.smith@police.gov
- **Password:** password123

### Officer Access
- **Email:** sarah.johnson@police.gov
- **Password:** password123

## API Endpoints

### Authentication
- `POST /login` - User login
- `POST /logout` - User logout

### Officers
- `GET /officers` - Get all officers
- `GET /officers/<id>` - Get specific officer
- `POST /officers` - Create new officer
- `PATCH /officers/<id>` - Update officer
- `DELETE /officers/<id>` - Delete officer (Admin only)

### Crime Reports
- `GET /reports` - Get all crime reports
- `GET /reports/<id>` - Get specific report
- `POST /reports` - Create new report (Login required)
- `PATCH /reports/<id>` - Update report
- `DELETE /reports/<id>` - Delete report

### Assignments
- `GET /assignments` - Get all assignments
- `GET /assignments/<id>` - Get specific assignment
- `POST /assignments` - Create new assignment

### Crime Categories
- `GET /categories` - Get all crime categories
- `POST /categories` - Create new category

## Features in Detail

### Role-Based Access Control
- **Admin users** can:
  - Manage all officers
  - Delete crime reports
  - Create and manage assignments
  - Access all system features

- **Officer users** can:
  - View crime reports
  - View officer information
  - View assignments
  - Create new crime reports

### Responsive Design
- Mobile-first approach
- Optimized for tablets and desktops
- Touch-friendly interface
- Accessible navigation

### Data Management
- Real-time filtering and search
- Sortable data tables
- Modal-based detail views
- Form validation

## Development Notes

### Static Data
The application currently uses static mock data located in `client/src/data/mockData.js`. This data structure mirrors the backend models and can be easily replaced with API calls.

### Styling Architecture
- CSS custom properties (variables) for consistent theming
- Utility classes for common patterns
- Component-specific stylesheets
- Responsive breakpoints

### State Management
- React Context API for authentication
- Local component state for UI interactions
- localStorage for session persistence

## Future Enhancements

- [ ] Real-time notifications
- [ ] File upload for evidence
- [ ] Advanced reporting and analytics
- [ ] Mobile app development
- [ ] Integration with external systems
- [ ] Audit logging
- [ ] Advanced search capabilities
- [ ] Bulk operations
- [ ] Export functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
