# MindNest Booking Service

A robust session booking microservice for the MindNest mental health platform. This service manages therapist-patient appointment scheduling, time slot templates, and booking lifecycle management.

## 🚀 Features

- **Session Booking Management**: Create, view, and manage therapy session bookings
- **Time Slot Templates**: Define recurring availability schedules for therapists
- **Dynamic Time Slot Generation**: Automatically generate available time slots from templates
- **Booking Lifecycle**: Handle booking confirmation, cancellation, completion, and no-show status
- **Multi-User Support**: Separate booking management for patients and therapists
- **Validation & Security**: Comprehensive input validation and security middleware
- **MongoDB Integration**: Scalable NoSQL database with Mongoose ODM
- **RESTful API**: Clean, well-documented API endpoints
- **Health Monitoring**: Built-in health check endpoint
- **Logging**: Request logging with Morgan middleware

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindnest-booking-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/session_booking

   # Optional: Production MongoDB URI
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/session_booking

   # CORS Configuration (optional)
   ALLOWED_ORIGINS=http://localhost:3000,https://mindnest-frontend.vercel.app
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally or use a cloud MongoDB instance
   - The service will automatically create the required collections on startup

5. **Start the service**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 🏗️ Architecture

```
mindnest-booking-service/
├── src/
│   ├── config/
│   │   └── database.js           # MongoDB connection configuration
│   ├── controllers/
│   │   ├── bookingController.js  # Booking request handling
│   │   ├── templateController.js # Template management
│   │   └── timeslotController.js # Time slot operations
│   ├── models/
│   │   ├── Booking.js           # Booking data model
│   │   ├── TimeSlot.js          # Time slot data model
│   │   ├── TimeSlotTemplate.js  # Template data model
│   │   └── Notification.js      # Notification data model
│   ├── routes/
│   │   ├── bookings.js          # Booking API routes
│   │   ├── templates.js         # Template API routes
│   │   └── timeslots.js         # Time slot API routes
│   └── services/
│       ├── bookingService.js    # Booking business logic
│       ├── templateService.js   # Template business logic
│       └── timeSlotService.js   # Time slot business logic
├── server.js                    # Express server setup
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Health Check

#### `GET /health`
Check service health status.

**Response:**
```json
{
  "status": "OK",
  "service": "Session Booking Microservice",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Time Slot Templates

#### `POST /api/templates`
Create a new time slot template for a therapist.

**Request Body:**
```json
{
  "therapistId": 123,
  "dayOfWeek": "monday",
  "startTime": "09:00",
  "endTime": "17:00",
  "sessionDuration": 60,
  "breakTime": 15
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "therapistId": 123,
    "dayOfWeek": "monday",
    "startTime": "09:00",
    "endTime": "17:00",
    "sessionDuration": 60,
    "breakTime": 15,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/templates/therapist/:therapistId`
Get all templates for a specific therapist.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "therapistId": 123,
      "dayOfWeek": "monday",
      "startTime": "09:00",
      "endTime": "17:00",
      "sessionDuration": 60,
      "breakTime": 15,
      "isActive": true
    }
  ]
}
```

#### `PUT /api/templates/:id`
Update an existing template.

**Request Body:**
```json
{
  "startTime": "10:00",
  "sessionDuration": 45
}
```

#### `DELETE /api/templates/:id`
Delete a template.

### Time Slots

#### `POST /api/timeslots/generate`
Generate time slots from a template for a date range.

**Request Body:**
```json
{
  "templateId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "generated": 124,
    "message": "Successfully generated 124 time slots"
  }
}
```

#### `GET /api/timeslots/therapist/:therapistId`
Get all time slots for a therapist.

**Query Parameters:**
- `date`: Filter by specific date (YYYY-MM-DD)
- `isBooked`: Filter by booking status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "therapistId": 123,
      "templateId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "date": "2024-01-01T00:00:00.000Z",
      "startTime": "09:00",
      "endTime": "10:00",
      "isBooked": false,
      "isActive": true
    }
  ]
}
```

#### `GET /api/timeslots/available/:therapistId`
Get available (unbooked) time slots for a therapist.

**Query Parameters:**
- `startDate`: Start date for availability (YYYY-MM-DD)
- `endDate`: End date for availability (YYYY-MM-DD)

#### `PUT /api/timeslots/:id`
Update a time slot.

#### `DELETE /api/timeslots/:id`
Delete a time slot.

### Bookings

#### `POST /api/bookings`
Create a new booking.

**Request Body:**
```json
{
  "patientId": 456,
  "timeSlotId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "notes": "First session - anxiety treatment"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "bookingId": "BK1704067200000ABC12",
    "patientId": 456,
    "therapistId": 123,
    "timeSlotId": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "startTime": "09:00",
      "endTime": "10:00",
      "date": "2024-01-01T00:00:00.000Z"
    },
    "sessionDate": "2024-01-01T00:00:00.000Z",
    "sessionStartTime": "09:00",
    "sessionEndTime": "10:00",
    "status": "confirmed",
    "notes": "First session - anxiety treatment",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `GET /api/bookings/patient/:patientId`
Get all bookings for a patient.

**Query Parameters:**
- `status`: Filter by booking status (confirmed, cancelled, completed, no-show)
- `startDate`: Start date filter (YYYY-MM-DD)
- `endDate`: End date filter (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "bookingId": "BK1704067200000ABC12",
      "patientId": 456,
      "therapistId": 123,
      "sessionDate": "2024-01-01T00:00:00.000Z",
      "sessionStartTime": "09:00",
      "sessionEndTime": "10:00",
      "status": "confirmed",
      "notes": "First session - anxiety treatment"
    }
  ]
}
```

#### `GET /api/bookings/therapist/:therapistId`
Get all bookings for a therapist.

**Query Parameters:**
- `status`: Filter by booking status
- `startDate`: Start date filter
- `endDate`: End date filter

#### `GET /api/bookings/:id`
Get a specific booking by ID.

#### `PUT /api/bookings/:id/cancel`
Cancel a booking.

**Request Body:**
```json
{
  "cancellationReason": "Patient requested cancellation",
  "cancelledBy": "patient"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "bookingId": "BK1704067200000ABC12",
    "status": "cancelled",
    "cancellationReason": "Patient requested cancellation",
    "cancelledBy": "patient",
    "cancelledAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `PUT /api/bookings/:id/status`
Update booking status.

**Request Body:**
```json
{
  "status": "completed"
}
```

## 🔒 Data Models

### Booking Model
```javascript
{
  bookingId: String,           // Auto-generated unique ID
  patientId: Number,           // Patient identifier
  therapistId: Number,         // Therapist identifier
  timeSlotId: ObjectId,        // Reference to TimeSlot
  sessionDate: Date,           // Session date
  sessionStartTime: String,    // Session start time (HH:MM)
  sessionEndTime: String,      // Session end time (HH:MM)
  status: String,              // confirmed, cancelled, completed, no-show
  notes: String,               // Session notes
  cancellationReason: String,  // Reason for cancellation
  cancelledAt: Date,           // Cancellation timestamp
  cancelledBy: String          // patient or therapist
}
```

### TimeSlot Model
```javascript
{
  therapistId: Number,         // Therapist identifier
  templateId: ObjectId,        // Reference to TimeSlotTemplate
  date: Date,                  // Slot date
  startTime: String,           // Start time (HH:MM)
  endTime: String,             // End time (HH:MM)
  isBooked: Boolean,           // Booking status
  bookedBy: Number,            // Patient ID if booked
  isActive: Boolean            // Slot availability
}
```

### TimeSlotTemplate Model
```javascript
{
  therapistId: Number,         // Therapist identifier
  dayOfWeek: String,           // Day of week
  startTime: String,           // Start time (HH:MM)
  endTime: String,             // End time (HH:MM)
  sessionDuration: Number,     // Session duration in minutes (15-240)
  breakTime: Number,           // Break time in minutes (0-60)
  isActive: Boolean            // Template availability
}
```

## 🔧 Validation Rules

### Time Format
- All times must be in HH:MM format (24-hour)
- Valid range: 00:00 to 23:59

### Session Duration
- Minimum: 15 minutes
- Maximum: 4 hours (240 minutes)

### Break Time
- Minimum: 0 minutes
- Maximum: 1 hour (60 minutes)

### Day of Week
- Valid values: monday, tuesday, wednesday, thursday, friday, saturday, sunday

### Booking Status
- Valid values: confirmed, cancelled, completed, no-show

## 🚀 Key Features

### Automatic Time Slot Generation
- Generate time slots from templates for any date range
- Automatic conflict detection and resolution
- Efficient bulk creation with proper indexing

### Booking Lifecycle Management
- Complete booking workflow from creation to completion
- Automatic time slot reservation and release
- Cancellation tracking with reasons and timestamps

### Flexible Scheduling
- Template-based scheduling for recurring availability
- Custom session durations and break times
- Support for multiple therapists and patients

### Data Integrity
- MongoDB indexes for optimal query performance
- Unique constraints to prevent double bookings
- Comprehensive validation at API and model levels

## 📊 Monitoring

### Health Check
Monitor service health via the `/health` endpoint.

### Logging
The service provides comprehensive logging for:
- HTTP requests (Morgan middleware)
- Database operations
- Error handling
- Booking lifecycle events



## 🔄 Version History

- **v1.0.0**: Initial release with core booking features
  - Session booking management
  - Time slot template system
  - Dynamic time slot generation
  - Booking lifecycle management
  - MongoDB integration with Mongoose
  - RESTful API with validation 