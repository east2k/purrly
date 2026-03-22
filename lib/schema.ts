import {
    pgTable,
    text,
    integer,
    boolean,
    timestamp,
    pgEnum,
    serial,
    uniqueIndex,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ──

export const reactionTypeEnum = pgEnum("reaction_type", ["HUG", "ME_TOO"]);
export const whisperStatusEnum = pgEnum("whisper_status", ["PENDING", "ACTIVE", "EXPIRED"]);
export const reportContentTypeEnum = pgEnum("report_content_type", ["POST", "COMMENT", "WHISPER_MESSAGE"]);
export const reportStatusEnum = pgEnum("report_status", ["PENDING", "REVIEWED", "ACTIONED"]);
export const reconnectStatusEnum = pgEnum("reconnect_status", ["PENDING", "ACCEPTED", "DECLINED", "EXPIRED"]);

// ── Users (synced from Clerk) ──

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    displayId: text("display_id").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    comments: many(comments),
    reactions: many(reactions),
    whisperMemories: many(whisperMemories),
    dailyCheckIns: many(dailyCheckIns),
}));

// ── Posts ──

export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    text: text("text").notNull(),
    mood: text("mood"),
    language: text("language"),
    commentsEnabled: boolean("comments_enabled").default(true).notNull(),
    hideIdentity: boolean("hide_identity").default(true).notNull(),
    authorId: text("author_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
}, (table) => [
    index("posts_author_id_idx").on(table.authorId),
    index("posts_created_at_idx").on(table.createdAt),
]);

export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, { fields: [posts.authorId], references: [users.id] }),
    comments: many(comments),
    reactions: many(reactions),
}));

// ── Comments ──

export const comments = pgTable("comments", {
    id: serial("id").primaryKey(),
    text: text("text").notNull(),
    postId: integer("post_id").notNull().references(() => posts.id),
    authorId: text("author_id").notNull().references(() => users.id),
    hideIdentity: boolean("hide_identity").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
}, (table) => [
    index("comments_post_id_idx").on(table.postId),
]);

export const commentsRelations = relations(comments, ({ one }) => ({
    post: one(posts, { fields: [comments.postId], references: [posts.id] }),
    author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

// ── Reactions ──

export const reactions = pgTable("reactions", {
    id: serial("id").primaryKey(),
    type: reactionTypeEnum("type").notNull(),
    postId: integer("post_id").notNull().references(() => posts.id),
    authorId: text("author_id").references(() => users.id),
    sessionId: text("session_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("reactions_post_id_idx").on(table.postId),
    uniqueIndex("reactions_unique_user_idx").on(table.postId, table.authorId, table.type),
    uniqueIndex("reactions_unique_session_idx").on(table.postId, table.sessionId, table.type),
]);

export const reactionsRelations = relations(reactions, ({ one }) => ({
    post: one(posts, { fields: [reactions.postId], references: [posts.id] }),
    author: one(users, { fields: [reactions.authorId], references: [users.id] }),
}));

// ── Whispers ──

export const whispers = pgTable("whispers", {
    id: serial("id").primaryKey(),
    participantOneId: text("participant_one_id").notNull().references(() => users.id),
    participantTwoId: text("participant_two_id").notNull().references(() => users.id),
    status: whisperStatusEnum("status").default("PENDING").notNull(),
    expiresAt: timestamp("expires_at"),
    extended: boolean("extended").default(false).notNull(),
    requestedById: text("requested_by_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
    index("whispers_participant_one_idx").on(table.participantOneId),
    index("whispers_participant_two_idx").on(table.participantTwoId),
]);

export const whispersRelations = relations(whispers, ({ one, many }) => ({
    participantOne: one(users, { fields: [whispers.participantOneId], references: [users.id], relationName: "whisperParticipantOne" }),
    participantTwo: one(users, { fields: [whispers.participantTwoId], references: [users.id], relationName: "whisperParticipantTwo" }),
    requestedBy: one(users, { fields: [whispers.requestedById], references: [users.id], relationName: "whisperRequestedBy" }),
    messages: many(whisperMessages),
    memories: many(whisperMemories),
}));

// ── Whisper Messages ──

export const whisperMessages = pgTable("whisper_messages", {
    id: serial("id").primaryKey(),
    whisperId: integer("whisper_id").notNull().references(() => whispers.id),
    senderId: text("sender_id").notNull().references(() => users.id),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("whisper_messages_whisper_id_idx").on(table.whisperId),
]);

export const whisperMessagesRelations = relations(whisperMessages, ({ one }) => ({
    whisper: one(whispers, { fields: [whisperMessages.whisperId], references: [whispers.id] }),
    sender: one(users, { fields: [whisperMessages.senderId], references: [users.id] }),
}));

// ── Whisper Memories ──

export const whisperMemories = pgTable("whisper_memories", {
    id: serial("id").primaryKey(),
    whisperId: integer("whisper_id").notNull().references(() => whispers.id),
    userId: text("user_id").notNull().references(() => users.id),
    savedAt: timestamp("saved_at").defaultNow().notNull(),
}, (table) => [
    uniqueIndex("whisper_memories_unique_idx").on(table.whisperId, table.userId),
]);

export const whisperMemoriesRelations = relations(whisperMemories, ({ one, many }) => ({
    whisper: one(whispers, { fields: [whisperMemories.whisperId], references: [whispers.id] }),
    user: one(users, { fields: [whisperMemories.userId], references: [users.id] }),
    reconnectRequests: many(reconnectRequests),
}));

// ── Reconnect Requests ──

export const reconnectRequests = pgTable("reconnect_requests", {
    id: serial("id").primaryKey(),
    memoryId: integer("memory_id").notNull().references(() => whisperMemories.id),
    requestedById: text("requested_by_id").notNull().references(() => users.id),
    requestedToId: text("requested_to_id").notNull().references(() => users.id),
    status: reconnectStatusEnum("status").default("PENDING").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reconnectRequestsRelations = relations(reconnectRequests, ({ one }) => ({
    memory: one(whisperMemories, { fields: [reconnectRequests.memoryId], references: [whisperMemories.id] }),
    requestedBy: one(users, { fields: [reconnectRequests.requestedById], references: [users.id], relationName: "reconnectRequestedBy" }),
    requestedTo: one(users, { fields: [reconnectRequests.requestedToId], references: [users.id], relationName: "reconnectRequestedTo" }),
}));

// ── Daily Check-ins ──

export const dailyCheckIns = pgTable("daily_check_ins", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    date: text("date").notNull(),
    water: integer("water").default(0).notNull(),
    sleep: integer("sleep").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
    uniqueIndex("daily_check_ins_unique_idx").on(table.userId, table.date),
]);

export const dailyCheckInsRelations = relations(dailyCheckIns, ({ one }) => ({
    user: one(users, { fields: [dailyCheckIns.userId], references: [users.id] }),
}));

// ── Reports ──

export const reports = pgTable("reports", {
    id: serial("id").primaryKey(),
    reporterId: text("reporter_id"),
    contentType: reportContentTypeEnum("content_type").notNull(),
    contentId: integer("content_id").notNull(),
    reason: text("reason").notNull(),
    status: reportStatusEnum("status").default("PENDING").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reportsRelations = relations(reports, ({ one }) => ({
    reporter: one(users, { fields: [reports.reporterId], references: [users.id] }),
}));
