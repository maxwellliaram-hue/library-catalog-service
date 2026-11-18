# Library Catalog Service

A MongoDB-backed library catalog API with bcrypt password hashing, JWT authentication, and librarian-only catalog management.

## Setup

1. Install Node.js (18+) and MongoDB.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and a strong, private `JWT_SECRET` (at least 32 random characters).
3. Install dependencies: `npm install`.
4. Seed sample catalog data and the development librarian: `npm run seed`.
5. Start the API: `npm start`.

The API listens on `http://localhost:3000`. Never commit your real `.env` file. The seeded credentials below are for local assignment testing only; change them before any deployment.

## Seeded librarian (development only)

- Username: `librarian`
- Email: `librarian@library.local`
- Password: `LibraryAdmin123!`

The seed script hashes this password with bcrypt (12 salt rounds) before saving it. It is idempotent and maintains one librarian account; it does not store a plaintext password. Override the values with the `SEED_LIBRARIAN_*` environment variables. Do not use these public test credentials in production.

## API endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create a patron account; clients cannot assign themselves a role |
| POST | `/api/auth/login` | Public | Verify credentials and set an httpOnly JWT cookie |
| POST | `/api/auth/logout` | Public | Clear the authentication cookie in the browser |
| GET | `/api/users/profile` | Authenticated | Return only the caller's own profile |
| GET | `/api/books` | Public | List catalog books |
| POST | `/api/books` | Librarian | Create a book |
| PUT | `/api/books/:id` | Librarian | Update a book |
| DELETE | `/api/books/:id` | Librarian | Delete a book |

### Authorization behavior

- No token or an invalid/expired token on a protected route returns **401 Unauthorized**.
- A valid patron token on a librarian-only route returns **403 Forbidden**.
- A valid librarian token can perform catalog mutations.
- Registration always creates a `patron`; role assignment is controlled by the seed/admin process.
- The profile endpoint derives the user identity from the verified JWT subject and never accepts a user ID from the request.

For API clients that do not use cookies, middleware also accepts `Authorization: Bearer <token>`; the login endpoint intentionally issues the token as an httpOnly cookie.

## Token Storage and Security Trade-off

This API stores the JWT in a browser **httpOnly cookie**, rather than localStorage. After a successful login, the server sets a cookie named `token` with the `httpOnly` flag, `SameSite=Strict`, a one-hour lifetime, and the `Secure` flag in production. The browser automatically sends the cookie with matching requests, while frontend JavaScript cannot read its value. This reduces the chance that an injected script in a Cross-Site Scripting (XSS) attack can steal the token. The JWT contains the user's database ID as its subject and is signed with the server-only `JWT_SECRET`; protected requests verify the signature and reload the user from MongoDB so the current role is used.

The trade-off is that cookies are sent automatically by browsers, which creates a Cross-Site Request Forgery (CSRF) concern. This project uses `SameSite=Strict` as a browser-level mitigation and the API should additionally enforce trusted origins/CSRF tokens if it is deployed in a cross-site frontend configuration. The `Secure` flag is enabled in production so the cookie is sent only over HTTPS. By comparison, localStorage is simple to use with bearer headers, but any JavaScript running on the page can read it, making token theft through XSS easier. An httpOnly cookie is therefore the selected option for this API, with stricter cookie and origin configuration required for deployment.

Logout is client-side cookie invalidation: `POST /api/auth/logout` sends a matching expired cookie using `Set-Cookie`. This project does not maintain a server-side token blocklist, so a copied token remains valid until its one-hour expiry; the browser's own cookie is cleared immediately.

## Existing catalog schema

Book metadata is stored in the `Book` collection. Genre names and slugs are normalized in the `Genre` collection and referenced by ObjectId from each book.
