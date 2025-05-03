import { pgTable, text, timestamp, boolean, integer, primaryKey, uuid } from "drizzle-orm/pg-core";

// User table
export const user = pgTable("user", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    username: text('username').notNull().default(''),
    points: integer('points').notNull().default(0),
    rank: integer('rank').notNull().default(0),
    solved: integer('solved').notNull().default(0),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    activeContest: uuid('active_contest').references(() => contest.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    role: text('role').notNull().default('user') // 'user' or 'creator'
});

// Session table
export const session = pgTable("session", {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

// Account table
export const account = pgTable("account", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Verification table
export const verification = pgTable("verification", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Contest table (no tags or problems array)
export const contest = pgTable("contest", {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    startTime: timestamp('start_time').notNull(),
    duration: integer('duration').notNull(),
    questions: integer('questions').notNull(),
    maxParticipants: integer('max_participants').notNull(),
    participants: integer('participants').notNull(),
    status: text('status').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Problem table (no tag array)
export const problem = pgTable("problem", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text('name').notNull(),
    points: integer('points').notNull(),
    difficulty: text('difficulty').notNull(),
    link: text('link').notNull(),
});

// Contest-Problem relationship table
export const contestProblems = pgTable("contest_problems", {
    contestId: uuid("contest_id").notNull().references(() => contest.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id").notNull().references(() => problem.id, { onDelete: "cascade" })
}, (t) => ({
    pk: primaryKey({ columns: [t.contestId, t.problemId] })
}));

// Tag table
export const tag = pgTable("tag", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique()
});

// Problem-Tag relationship table
export const problemTags = pgTable("problem_tags", {
    problemId: uuid("problem_id").notNull().references(() => problem.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tag.id, { onDelete: "cascade" })
}, (t) => ({
    pk: primaryKey({ columns: [t.problemId, t.tagId] })
}));

// Export schema
export const schema = {
    user,
    session,
    account,
    verification,
    contest,
    problem,
    contestProblems,
    tag,
    problemTags,
};
