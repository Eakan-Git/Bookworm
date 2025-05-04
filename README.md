# 📚 Bookworm

<div align="center">
  <img src="frontend/public/images/logo.png" alt="Bookworm Logo" width="120" />
  <h3>A Modern Online Bookstore</h3>
  <p>Built with React, FastAPI, and PostgreSQL</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi" alt="FastAPI 0.115" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/Docker-Compose-blue?logo=docker" alt="Docker Compose" />
</p>

---

## 🌟 Features

-   **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
-   **🔐 User Authentication**: Secure login with JWT tokens
-   **🛒 Shopping Cart**: Add books to cart, adjust quantities, and checkout
-   **⭐ Reviews & Ratings**: Read and write book reviews with star ratings
-   **💰 Discounts**: Special offers and discounts on selected books
-   **🔍 Search & Filter**: Find books by category, author, or rating
-   **🌐 Multilingual**: Support for English and Vietnamese
-   **💵 Multi-currency**: Support for USD and VND

## 🚀 Getting Started

### Prerequisites

-   [Docker](https://www.docker.com/get-started) and Docker Compose
-   Git

### Quick Start

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/bookworm.git
    cd bookworm
    ```

2. **Set up environment variables**

    ```bash
    cp .env.example .env
    ```

    Edit the `.env` file and set a secure `SECRET_KEY` for JWT token generation:

    ```
    SECRET_KEY=your_secure_secret_key_here
    ```

3. **Build and start the containers**

    ```bash
    docker-compose up -d
    ```

    This will start three containers:

    - Frontend (React): http://localhost:5173
    - Backend (FastAPI): http://localhost:8000
    - Database (PostgreSQL)

4. **Seed the database (optional)**

    To populate the database with sample data, set `SEED_ON_STARTUP=true` in your `.env` file before starting the containers, or run:

    ```bash
    docker-compose exec backend python -m scripts.seed_db
    ```

5. **Access the application**

    Open your browser and navigate to [http://localhost:5173](http://localhost:5173)

## 🛠️ Development

### Project Structure

```
bookworm/
├── frontend/            # React frontend
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   └── Dockerfile       # Frontend Docker configuration
├── backend/             # FastAPI backend
│   ├── api/             # API endpoints and business logic
│   ├── models/          # Database models
│   ├── scripts/         # Utility scripts
│   └── Dockerfile       # Backend Docker configuration
├── docker-compose.yml   # Docker Compose configuration
└── .env                 # Environment variables
```

### Running in Development Mode

The default Docker Compose setup mounts your local directories as volumes, so any changes you make to the code will be reflected in the running containers:

-   Frontend changes will trigger automatic reloading thanks to Vite's hot module replacement
-   Backend changes will be automatically reloaded by Uvicorn's `--reload` flag

### API Documentation

Once the backend is running, you can access the auto-generated API documentation:

-   Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
-   ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 🧪 Testing

### Running Backend Tests

```bash
docker-compose exec backend pytest
```

### Running Frontend Tests

```bash
docker-compose exec frontend npm test
```

## 🚢 Deployment

For production deployment, make the following changes:

1. Set `ENVIRONMENT=production` in your `.env` file
2. Set `COOKIE_SECURE=True` to ensure cookies are only sent over HTTPS
3. Use a proper domain name and HTTPS certificates
4. Consider using a managed database service instead of the Docker PostgreSQL container

## 🙏 Acknowledgements

-   [FastAPI](https://fastapi.tiangolo.com/) - Modern, fast web framework for building APIs
-   [React](https://reactjs.org/) - A JavaScript library for building user interfaces
-   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
-   [DaisyUI](https://daisyui.com/) - Tailwind CSS component library
-   [PostgreSQL](https://www.postgresql.org/) - Advanced open source database
