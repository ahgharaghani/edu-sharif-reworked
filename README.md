# Sharif Edu Wrapper

A clean web interface and API wrapper for Sharif University of Technology's student educational portal (`edu.sharif.edu`).

## Tech Stack

- **Backend**: Go (`net/http`)
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Scraper**: Python (Selenium) for portal authentication and data extraction

## Getting Started

### Prerequisites

- [Go](https://go.dev/) 1.21+
- [Node.js](https://nodejs.org/) 18+ and npm

### 1. Build Frontend

```bash
cd frontend
npm install
npm run build
```

### 2. Run Backend

```bash
cd backend
go run main.go
```

The application will be available at `http://localhost:8080`.

### Development

To run the frontend dev server with hot reload:

```bash
cd frontend
npm run dev
```

The dev server runs at `http://localhost:3000` and proxies API requests to `http://localhost:8080`.

## License

[MIT](LICENSE)
