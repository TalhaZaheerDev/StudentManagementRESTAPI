# Student Management REST API

A simple, clean REST API built with Spring Boot for managing student records. Features CRUD operations, validation, and a modern web interface.

![Java](https://img.shields.io/badge/Java-17+-orange?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-green?style=flat-square&logo=spring)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=flat-square&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## Features

- ✅ **CRUD Operations** - Create, Read, Update, Delete students
- ✅ **Input Validation** - Email format, required fields, age range
- ✅ **RESTful API** - Clean endpoints following REST conventions
- ✅ **Global Exception Handling** - Consistent error responses
- ✅ **Web Interface** - Modern, responsive UI included
- ✅ **PostgreSQL** - Production-ready database

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Spring Boot 3.2 | Application framework |
| Spring Data JPA | Database operations |
| Hibernate | ORM (Object-Relational Mapping) |
| PostgreSQL | Relational database |
| Lombok | Boilerplate reduction |
| Jakarta Validation | Input validation |

## Project Structure

```
src/main/java/com/student/management/
├── StudentManagementApplication.java    # Main class
├── config/                              # Configuration
├── controller/                          # REST endpoints
├── dto/                                 # Data transfer objects
├── entity/                              # JPA entities
├── exception/                           # Exception handling
├── repository/                          # Data access layer
└── service/                             # Business logic
```

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL 12+

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/TalhaZaheerDev/StudentManagementRESTAPI.git
   cd StudentManagementRESTAPI
   ```

2. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE student_db;
   ```

3. **Configure database connection**
   
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/student_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

5. **Access the application**
   - Web UI: http://localhost:8080
   - API Base: http://localhost:8080/api/students

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/students` | Create a new student |
| `GET` | `/api/students` | Get all students |
| `GET` | `/api/students/{id}` | Get student by ID |
| `PUT` | `/api/students/{id}` | Update student |
| `DELETE` | `/api/students/{id}` | Delete student |

### Request/Response Examples

**Create Student**
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "age": 22}'
```

**Response**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 22
  }
}
```

## Student Entity

| Field | Type | Validation |
|-------|------|------------|
| id | Long | Auto-generated |
| name | String | Required, 2-100 chars |
| email | String | Required, valid email, unique |
| age | Integer | Required, 1-150 |

## Validation Errors

Invalid requests return structured error responses:

```json
{
  "timestamp": "2024-01-23T12:00:00",
  "status": 400,
  "error": "Validation Failed",
  "errors": {
    "email": "Please provide a valid email address",
    "name": "Name is required"
  }
}
```

## Documentation

For detailed code explanations and interview preparation, see [DOCUMENTATION.md](DOCUMENTATION.md).

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built by https://github.com/talhazaheerdev
