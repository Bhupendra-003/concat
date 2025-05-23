# TODO and Progress

### TODO
- Handle the problem where the problem already exists in the database, so no id being returned and we can't insert it in the contest-problems junction table.

### System
- added authentication ✅
- added email verification ✅ but cant use email verification as we dont have own domain fallbacking to username and password login ✅.
- added session check in dashboard and auth page ✅
- added sign in and sign up functionality ✅
- added sign out functionality ✅
- added landing page ✅
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
- Realtion between contest and problems being stored ✅
- Handled the problem where the problem and contest already exists in the database ✅

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
---
- Problem: Duplicate Entries in Contest Table creating problem
- Solution: Added Contest Index (auto increment) now name can be same but index will be different.
--- 
- Problem: But problems table has `onConflictDoNothing()` so it will not return id when the problems exits, because it will not insert any data, and since we have no id, we can't insert realtion in problem jucntion table because it needs problem id to insert.
- Solution: On conflict I am updating the problem slug with same value using `onConflictDoUpdate()`, its still an update for Postgres but it will return id, so i am getting id even if it is a conflict by updating. a