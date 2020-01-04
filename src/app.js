"use strict";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Dependencies
let Discord = require("discord.js");

// Utils
let conf = require("./utils/configHandler");
let log = require("./utils/logger");

// Handler
let messageHandler = require("./handler/messageHandler");

let version = conf.getVersion();
let appname = conf.getName();
let devname = conf.getAuthor();

let splashPadding = 12 + appname.length + version.toString().length;

console.log(
    "\n" +
    ` #${"-".repeat(splashPadding)}#\n` +
    ` # Started ${appname} v${version} #\n` +
    ` #${"-".repeat(splashPadding)}#\n\n` +
    ` Copyright (c) ${(new Date()).getFullYear()} ${devname}\n`
);

log.done("Started.");

const config = conf.getConfig();
const client = new Discord.Client();

process.on("unhandledRejection", (err, promise) => log.error(`Unhandled rejection (promise: ${promise}, reason: ${err})`));

client.on("ready", () => {
    log.info("Running...");
    log.info(`Got ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds`);
    client.user.setActivity(config.bot_settings.bot_status);
});

client.on("guildCreate", guild => log.info(`New guild joined: ${guild.name} (id: ${guild.id}) with ${guild.memberCount} members`));

client.on("guildDelete", guild => log.info(`Deleted from guild: ${guild.name} (id: ${guild.id}).`));

client.on("message", (message) => messageHandler(message, client));

client.on("error", log.error);

client.login(config.auth.bot_token).then(() => {
    log.done("Token login was successful!");
}, (err) => {
    log.error(`Token login was not successful: "${err}"`);
    log.error("Shutting down due to incorrect token...\n\n");
    process.exit(1);
});
