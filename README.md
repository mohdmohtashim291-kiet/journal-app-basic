# Journal App — React + Spring Boot REST API + MongoDB

A beginner-friendly full-stack journal app:
- React + Vite frontend
- Spring Boot REST API
- MongoDB database
- Create, list, edit, and delete journal entries

## Requirements
- Java 17+ (your installed newer Java should also work if supported by your Spring Boot version)
- Maven
- Node.js + npm
- MongoDB running locally on port 27017

## 1. Run MongoDB
Make sure MongoDB is running:
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

## 2. Run backend
Open terminal in `backend`:
```bash
cd backend
mvn spring-boot:run
```
Backend: `http://localhost:8080`
API: `http://localhost:8080/api/journals`

## 3. Run frontend
Open a second terminal in `frontend`:
```bash
cd frontend
npm install
npm run dev
```
Open the local URL printed by Vite (usually `http://localhost:5173`).

## API routes
| Method | URL | Purpose |
|---|---|---|
| GET | `/api/journals` | List entries |
| GET | `/api/journals/{id}` | Get one entry |
| POST | `/api/journals` | Create entry |
| PUT | `/api/journals/{id}` | Update entry |
| DELETE | `/api/journals/{id}` | Delete entry |

Example POST JSON:
```json
{
  "title": "My first entry",
  "content": "Today I learned Spring Boot and React."
}
```

## Project structure
```text
journal-app-basic/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/journal/
│       │   ├── JournalApplication.java
│       │   ├── controller/JournalController.java
│       │   ├── model/JournalEntry.java
│       │   └── repository/JournalRepository.java
│       └── resources/application.properties
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── style.css
```

## Notes
- This is a learning project, not production-hardened.
- Backend CORS is enabled for Vite's local dev server.
- If MongoDB uses a different host/port, update `backend/src/main/resources/application.properties`.
