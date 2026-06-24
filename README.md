# MyLibrary Backend

REST API for managing a personal book library with user registration, login, JWT authentication, and protected CRUD operations for books, series, and quotes. Features advanced capabilities like server-side pagination, text search, and multi-field filtration.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Features

- User registration & login with password hashing (`bcrypt`)
- JWT-based authorization (Access Token)
- Get current authorized user info
- Create, read, update, and delete books, book series, and book quotes
- User-specific data: each user can access and manage only their own library records
- Advanced `GET /api/books` capabilities:
  - **Pagination:** Uses `page` and `limit` to optimize server load and responses.
  - **Search:** Case-insensitive search by book title or author using MongoDB Regular Expressions (`$regex`).
  - **Filtration:** Filter results dynamically by exact book `status`, `rating` or `genre`.
  - **Sorting:** Automatically returns newer records first (`sort({ createdAt: -1 })`).
- Cascade cleanups: deleting a book automatically deletes its quotes; deleting a series safely unlinks it from books
- Data validation for ObjectIDs and request schemas (e.g., restricted book statuses)
- Centralized error handling middleware

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
CONNECTION_STRING=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
```

## Run

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Users

Register a new user:

```http
POST /api/users/register
```

Body:

```json
{
  "username": "Maryna",
  "email": "maryna@example.com",
  "password": "password123"
}
```

Login:

```http
POST /api/users/login
```

Body:

```json
{
  "email": "maryna@example.com",
  "password": "password123"
}
```

Get current user:

```http
GET /api/users/current
```

Authorization:

```http
Bearer <accessToken>
```

### Books

All book routes require a Bearer token.

Get books (Supports Pagination, Search, and Filtration):

```http
GET /api/books?page=1&limit=5&search=Tolkien&status=READING&rating=5
```

Query Parameters (All optional):

* `page` (number, default: 1) — Page number.
* `limit` (number, default: 10) — Elements per page.
* `search` (string) — Search keyword for `title` or `author` (case-insensitive).
* `status` (string) — Filter by book status (`WISH`, `PURCHASED`, `READING`, `COMPLETED`, `ABANDONED`, `ON_HOLD`).
* `rating` (number) — Filter by book rating (1 to 5).
* `genre` (string) — Filter by book genre (`Fantasy`, `Dystopian`, `Psychology`, etc.)

Create a book:

```http
POST /api/books
```

Body:

```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "publishDate": "1937-09-21",
  "genre": "Fantasy",
  "status": "READING",
  "annotation": "A great adventure story.",
  "rating": 5,
  "favouriteCharacters": ["Bilbo", "Gandalf"],
  "series": "65fc... (optional series ID)"
}
```

Get book by id (returns book details and its specific quotes):

```http
GET /api/books/:id
```

Update book:

```http
PUT /api/books/:id
```

Delete book (cascades and removes all related quotes):

```http
DELETE /api/books/:id
```

### Series

All series routes require a Bearer token.

Get all series:

```http
GET /api/series
```

Create a series:

```http
POST /api/series
```

Body:

```json
{
  "name": "The Lord of the Rings",
  "description": "Epic high-fantasy novel series."
}
```

Get series by id (returns series details and the list of associated books):

```http
GET /api/series/:id
```

Update series:

```http
PUT /api/series/:id
```

Delete series (safely unlinks this series from all related books):

```http
DELETE /api/series/:id
```

### Quotes

All quote routes require a Bearer token.

Get all quotes:

```http
GET /api/quotes
```

Create a quote:

```http
POST /api/quotes
```

Body:

```json
{
  "text": "Not all those who wander are lost.",
  "book": "65fc... (required book ID)"
}
```

Get quote by id:

```http
GET /api/quotes/:id
```

Update quote:

```http
PUT /api/quotes/:id
```

Delete quote:

```http
DELETE /api/quotes/:id
```

## Authentication

After login, copy the `accessToken` from the response and send it in protected requests using the Authorization header:

```http
Authorization: Bearer <accessToken>
```

In Postman, select `Authorization`, choose `Bearer Token`, and paste only the token value.
