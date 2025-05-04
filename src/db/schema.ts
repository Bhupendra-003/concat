import { pgTable, text, timestamp, boolean, integer, primaryKey, uuid, index } from "drizzle-orm/pg-core";

// User table
export const user = pgTable("user", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    username: text('username').notNull().default(''),
    points: integer('points').notNull().default(0),
    rank: integer('rank').notNull().default(-1),
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
    maxParticipants: integer('max_participants').notNull().default(60),
    participants: integer('participants').notNull().default(0),
    status: text('status').notNull().default('upcoming'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Problem table (no tag array)
export const problem = pgTable("problem", {
    id: uuid("id").defaultRandom().primaryKey(),
    leetcodeId: integer('leetcode_id').notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    difficulty: text('difficulty').notNull(),
    link: text('link').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Contest-Problem relationship table
export const contestProblems = pgTable("contest_problems", {
    contestId: uuid("contest_id").notNull().references(() => contest.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id").notNull().references(() => problem.id, { onDelete: "cascade" }),
    points: integer('points').notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.contestId, t.problemId] })
}));

// User-Contest table
export const userContest = pgTable("user_contest", {
    userId: text('user_id').notNull().references(() => user.id, { onDelete: "cascade" }),
    contestId: uuid("contest_id").notNull().references(() => contest.id, { onDelete: "cascade" }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    totalPoints: integer('total_points').notNull().default(0),
    averageTime: integer("average_time").notNull().default(0), // average time taken to solve
    totalTimeTakenSeconds: integer('total_time_taken_seconds').notNull().default(0),
    rank: integer('rank'),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.contestId] }),
    contestIdx: index("contest_idx").on(t.contestId), // Add index for efficient querying by contestId
}));

// User-Contest-Problem relationship table
export const userContestProblem = pgTable("user_contest_problem", {
    userId: text('user_id').notNull().references(() => user.id, { onDelete: "cascade" }),
    contestId: uuid("contest_id").notNull().references(() => contest.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id").notNull().references(() => problem.id, { onDelete: "cascade" }),
    pointsEarned: integer('points_earned').notNull().default(0),
    timeTakenSeconds: integer('time_taken_seconds').notNull().default(0),
    submittedAt: timestamp('submitted_at').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.contestId, t.problemId] })
}));

// Contest leaderboard table
export const contestLeaderboard = pgTable("contest_leaderboard", {
    contestId: uuid("contest_id").notNull().references(() => contest.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    score: integer("score").notNull(), // total points
    rank: integer("rank").notNull(), // computed rank
    updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (t) => ({
    pk: primaryKey({ columns: [t.contestId, t.userId] }),
    contestIdx: index("contest_leaderboard_idx").on(t.contestId), // Add index for efficient querying by contestId
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
    userContest,
    userContestProblem,
    contestLeaderboard
};
