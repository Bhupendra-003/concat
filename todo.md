# TODO and Progress

### TODO
- In auth make search query for views to remember last view
- Create Contest button with open on click and write logic 
- Unify interfaces into types.ts file 

### System
- added authentication ✅
- added email verification ✅ but cant use email verification as we dont have own domain fallbacking to username and password login ✅.
- added session check in dashboard and auth page ✅
- added sign in and sign up functionality ✅
- added sign out functionality ✅
- added google sign in ✅


### User Side
- Make Timer for left time, and stopwatch that users can start and pause ✅
- dashboard UI ✅
- contest page ✅

### Admin Side
- Create Cards for Contests ✅
- Create Contest ✅
- Create progress bar which shows left contest time ✅
- contest page ✅
- contest being stored and fetched ✅
- problems being stored and fetched ✅

## Tips
- If want to migrate schema, use `drizzle-kit push` but if giving error, drop schema first from neon console.
- if getting error `Internal Server Error: 500`, check logs in your ide terminal

## Challenges
- Problem: when inserting problems in the database, the leetcodeId field is not being set correctly. It is being set to the lcid value, but it should be set to the leetcode_id value.
- Solution: Summary of the root cause and solution:

  Your database schema uses leetcodeId (camelCase) as the property name in your TypeScript model, but the actual column in the database is leetcode_id (snake_case).
  When inserting data, your code must use the TypeScript property name (leetcodeId) to match the model, not the raw column name (leetcode_id).
  By changing your insert mapping from leetcode_id to leetcodeId, the value is now correctly passed to the database, resolving the NOT NULL constraint error.

  Key takeaway:
  Always ensure the property names in your insert/update objects match the field names in your ORM/model, not necessarily the raw database column names.
