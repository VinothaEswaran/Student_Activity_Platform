# Student Activity Platform

A full-stack campus event management system built with **React.js + Spring Boot** featuring real JWT authentication.

---

## Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React.js 18, React Router 6, Axios        |
| Backend   | Spring Boot 3.2, Spring Security, JPA     |
| Auth      | JWT (JSON Web Tokens)                     |
| Database  | H2 (dev) / MySQL (production)             |
| Build     | Maven (backend), npm (frontend)           |

---

## Features

- ✅ **Real JWT Authentication** — Register / Login / Protected routes
- ✅ **Role-based access** — STUDENT, ORGANIZER, ADMIN
- ✅ **Event Management** — Create, browse, filter, search events by category
- ✅ **Event Registration** — Register/unregister with capacity tracking
- ✅ **Real-time Notifications** — Auto-sent on registration confirm
- ✅ **Profile Management** — Edit profile, view notification center
- ✅ **Responsive UI** — Works on desktop and mobile

---

## Quick Start

### Prerequisites

- Java 17+
- Node.js 18+ & npm
- Maven 3.8+

---

### 1. Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

> The backend starts on **http://localhost:8080**  
> H2 console available at **http://localhost:8080/h2-console**  
> (JDBC URL: `jdbc:h2:mem:studentdb`, User: `sa`, Password: *(blank)*)

---

### 2. Run the Frontend

```bash
cd frontend
npm install
npm start
```

> Opens at **http://localhost:3000**

---

### 3. Use the App

1. Go to `http://localhost:3000`
2. Click **Create one** to register
3. Choose role: `STUDENT` to join events, `ORGANIZER` to create them
4. Log in and explore!

---

## Switching to MySQL (Production)

In `backend/src/main/resources/application.properties`:

1. Comment out the H2 section
2. Uncomment the MySQL section and fill in your credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/studentplatform?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

Create the database first:
```sql
CREATE DATABASE studentplatform;
```

---

## API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | `/api/auth/register` | Register user      |
| POST   | `/api/auth/login`    | Login → JWT token  |

### Events
| Method | Endpoint                       | Description               |
|--------|--------------------------------|---------------------------|
| GET    | `/api/events`                  | List all events           |
| GET    | `/api/events/{id}`             | Get event detail          |
| GET    | `/api/events/category/{cat}`   | Filter by category        |
| GET    | `/api/events/search?keyword=`  | Search events             |
| GET    | `/api/events/my-registrations` | My registered events      |
| POST   | `/api/events`                  | Create event (ORGANIZER)  |
| POST   | `/api/events/{id}/register`    | Register for event        |
| DELETE | `/api/events/{id}/register`    | Unregister from event     |
| DELETE | `/api/events/{id}`             | Delete event (ORGANIZER)  |

### Notifications
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | `/api/notifications`              | Get all notifications    |
| GET    | `/api/notifications/unread-count` | Unread notification count|
| PUT    | `/api/notifications/mark-all-read`| Mark all as read         |

### Users
| Method | Endpoint     | Description          |
|--------|--------------|----------------------|
| GET    | `/api/users/me` | Get current user  |
| PUT    | `/api/users/me` | Update profile    |

---

## Project Structure

```
student-activity-platform/
├── backend/
│   └── src/main/java/com/studentplatform/
│       ├── controller/     # REST controllers
│       ├── model/          # JPA entities
│       ├── repository/     # Spring Data repos
│       ├── service/        # Business logic
│       ├── security/       # JWT + Spring Security
│       ├── config/         # Security config
│       └── dto/            # Data Transfer Objects
├── frontend/
│   └── src/
│       ├── pages/          # Login, Register, Dashboard, Events...
│       ├── components/     # Layout, Sidebar
│       ├── context/        # AuthContext (JWT state)
│       └── services/       # Axios API calls
└── README.md
```

---


