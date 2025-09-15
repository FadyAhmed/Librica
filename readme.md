# Librica

A robust library management system built with NestJS, PostgreSQL, and Docker.

---

## Table of Contents
- [Local Run](#local-run)
- [Docker Run (Recommended)](#docker-run-recommended)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)

---

## Local Run

To run the application locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/FadyAhmed/Librica.git](https://github.com/FadyAhmed/Librica.git)
    ```

2.  **Install PostgreSQL:**
    Make sure you have a PostgreSQL server installed and running on your machine.

3.  **Configure environment variables:**
    Update the `.env.dev` file to add the following:
    ```bash
    DATABASE_URL=postgresql://username:password@localhost:5432/postgres?currentSchema=librica
    PORT=3000
    ```

4.  **Modify the start script:**
    Open the `start.sh` file, uncomment the dev commands, and comment out the others.

5.  **Run the application:**
    ```bash
    ./start.sh
    ```

---

## Docker Run (Recommended)

For a more streamlined setup, use Docker:

1.  **Modify the start script:**
    Open the `start.sh` file and ensure the non-dev scripts are not commented.

2.  **Build and run the containers:**
    ```bash
    docker-compose build && docker-compose up
    ```

---

## API Documentation

Use the provided Postman collection to test the application and explore the API endpoints.

---

## API Endpoints

### Authorization

-   `POST /api/auth/signup`: Sign up a new user.
-   `POST /api/auth/login`: Log in a user and get a JWT access token.
-   `GET /api/auth/me`: Retrieve the authenticated user's data.

### Books

-   `POST /api/books/create`: (Admin) Add a new book.
-   `PUT /api/books/update/:id`: (Admin) Update a book's details.
-   `DELETE /api/books/update/:id`: (Admin) Delete a book.
-   `GET /api/books?page=1`: List all system books with pagination.
-   `GET /api/books/search?page=1&title=book`: Search for books by title.

### Borrowers

-   `POST /api/borrower/check-out/:bookId`: Borrow a book. The due date cannot be more than one month from the checkout date.
-   `POST /api/borrower/return/:bookId`: Return a borrowed book.
-   `GET /api/borrower/my-borrows?page=1`: List the currently borrowed books for the authenticated user.
-   `GET /api/borrower?page=1&borrowingStatus=OVER_DUE&durationFrom=1`: (Admin) List all borrowers in the system, with filtering by status and duration.
-   `GET /api/borrower/analytics?borrowingStatus=ALL&durationFrom=1`: (Admin) Get borrower analytics and download a CSV file.
-   `PUT /api/borrower/:borrowId`: (Admin) Update the due date for a specific borrow process.
-   `DELETE /api/borrower/:borrowId`: (Admin) Remove a borrow process.