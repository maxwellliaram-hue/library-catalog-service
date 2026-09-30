# Library Catalog Service

This project defines the MongoDB schema for a library catalog and seeds realistic sample data for genres and books.

## Setup

1. Copy `.env.example` to `.env`.
2. Update `MONGODB_URI` with your MongoDB connection string.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed the database:
   ```bash
   npm run seed
   ```

## Schema Design

### Book fields

#### `title`
- Stored as a plain string field.
- It belongs directly to the book and is read and displayed together with the rest of the record.
- Embedding keeps the title with the book record, which is simpler and faster for catalog pages that usually fetch the whole book instead of joining to another collection.

#### `author`
- Stored as a plain string field.
- The author is a core attribute of the book itself and is not shared as a separate entity in this project.
- Keeping it embedded avoids an unnecessary `authors` collection and keeps the catalog query simple.

#### `isbn`
- Stored as a plain string field with a unique constraint.
- It acts as a global identifier for a specific book edition and is most useful for direct lookup.
- A string is appropriate because ISBNs are formatted identifiers, not object references, and the unique index helps ensure each title edition is distinct.

#### `description`
- Stored as a plain string field.
- This is descriptive text for the book and is usually fetched alongside the book record.
- Embedding avoids a separate collection and reduces query complexity for a catalog detail view.

#### `coverImage`
- Stored as a plain string URL.
- The image is part of the book's presentation and does not need its own collection or relationship logic.
- This keeps the data simple while still supporting external image hosting and fast reads.

#### `totalCopies` and `availableCopies`
- Stored as numeric fields on the same `Book` document.
- Inventory is a property of a specific book instance in the library, so it is most natural to keep them with the book.
- This avoids a separate inventory collection and allows stock checks to happen in one read without joins.
- Trade-off: the data is duplicated less than it would be in a normalized design, but it means the inventory numbers live inside the book document instead of being split across collections.

#### `genre`
- Stored as a MongoDB `ObjectId` reference to a `Genre` document.
- This is the one field that is intentionally not embedded because many books can share the same genre, such as multiple sci-fi or romance titles.
- A reference keeps genre data normalized and avoids duplication of repeated strings like "Science Fiction" across every book.
- Trade-off: reading a book may require a join-like population step to resolve the genre name, but this keeps the genre list consistent and makes updates easier when the genre catalog changes.

### Genre fields

#### `name`
- Stored as a plain string with a unique constraint.
- The genre name is the display label shown in the UI and is a simple lookup value.
- It is not embedded into each book because it is shared across many books and should be managed in one authoritative collection.

#### `slug`
- Stored as a lowercase URL-safe string with a unique constraint.
- It supports clean route generation such as `/genres/science-fiction` without repeated formatting logic in the application.
- Keeping it as a separate field in the `Genre` collection is useful because the slug is a stable identifier for routes and should be consistent across all books that reference the genre.

## Summary

This schema balances simplicity and maintainability: descriptive, per-book metadata stays embedded in the `Book` document, while shared catalog categories such as genres are normalized into a separate `Genre` collection. That makes the seed data easy to manage while still keeping reads fast and updates consistent.
