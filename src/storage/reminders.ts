import type { GuildMember, Message, Snowflake, User } from "discord.js";
import { sql } from "kysely";

import type { Ban, Reminder } from "./model.js";

import db from "./kysely.js";
import log from "../utils/logger.js";

export async function removeReminder(
    reminderId: Reminder["id"],
    ctx = db(),
): Promise<void> {
    await ctx.deleteFrom("reminders").where("id", "=", reminderId).execute();
}

export function getCurrentReminders(
    now = new Date(),
    ctx = db(),
): Promise<Reminder[]> {
    return ctx
        .selectFrom("reminders")
        .where("remindAt", "<=", now.toISOString())
        .selectAll()
        .execute();
}

export async function insertMessageReminder(
    user: User,
    messageId: Snowflake,
    channelId: Snowflake,
    guildId: Snowflake,
    remindAt: Date,
    ctx = db(),
): Promise<void> {
    log.debug(
        `Saving Reminder measurement for user ${user.id} on message ${messageId} for ${remindAt}`,
    );

    await ctx
        .insertInto("reminders")
        .values({
            id: crypto.randomUUID(),

            userId: user.id,
            remindAt: remindAt.toISOString(),
            messageId,
            channelId,
            guildId,
            reminderNote: null,

            createdAt: sql`current_timestamp`,
            updatedAt: sql`current_timestamp`,
        })
        .execute();
}

export async function insertStaticReminder(
    user: User,
    channelId: Snowflake,
    guildId: Snowflake,
    remindAt: Date,
    reminderNote: string | null = null,
    ctx = db(),
): Promise<void> {
    log.debug(
        `Saving Reminder Measurement for user ${user.id} for ${remindAt}`,
    );

    await ctx
        .insertInto("reminders")
        .values({
            id: crypto.randomUUID(),

            userId: user.id,
            remindAt: remindAt.toISOString(),
            channelId,
            guildId,
            reminderNote,
            messageId: null,

            createdAt: sql`current_timestamp`,
            updatedAt: sql`current_timestamp`,
        })
        .execute();
}
