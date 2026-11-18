# Apply the Week 3 package

This ZIP includes the Week 3 implementation files, a complete `seed.js` preserving the repository's existing genre/book sample data, and middleware tests.

1. Extract the ZIP.
2. Copy the contents of the extracted `library-catalog-service-week3` folder into the root of your cloned repository.
3. Allow the new files to be added. Review `package.json` if your project has other dependencies/scripts that must be retained.
4. Copy `.env.example` to `.env` and set `MONGODB_URI` and a long random `JWT_SECRET`.
5. Run `npm install`, `npm test`, `npm run seed`, then `npm start`.

Development librarian:
- Email: `librarian@library.local`
- Password: `LibraryAdmin123!`

These are test credentials only. Change them before deployment. The seed script resets the sample `Genre` and `Book` collections before recreating the fixtures, as the original repository seed did. It also ensures one librarian account exists.

After checking the project, commit and push:
```bash
git add .
git commit -m "Implement Week 3 authentication and role-based access"
git push origin main
```

The package has not been pushed to GitHub automatically; apply it and push from your own repository credentials.
