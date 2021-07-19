// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

import { VerifiedCommandInteraction, Result, ApplicationCommandDefinition } from "../types";

// Utils
//let config = require("../utils/configHandler").getConfig();
let { plebCommands } = require("../handler/commands");

async function handler(interaction: VerifiedCommandInteraction): Promise<Result> {
    //const prefix = config.bot_settings.prefix.command_prefix;
    let commandText = "";
    console.log(plebCommands);
    /*plebCommands.forEach((handler1, commandName) => {
        commandText += `${prefix}${commandName}:\n${handler1.description}\n\n`;
    });*/

    interaction.user.send({
        content: "Hallo, " + interaction.member.user.username + "!\n\n" +
            "Hier ist eine Liste mit allen Commands:\n\n```CSS\n" +
            commandText +
            "``` \n\n" +
            "Bei Fragen kannst du dich an @ShadowByte#1337 wenden!",
        split: true
    });

    return { content: "Bruder, siehe PN", ephemeral: true };
}

export const applicationCommands: ApplicationCommandDefinition[] = [
    {
        handler,
        data: {
            name: "hilfe",
            description: "Listet alle Commands auf"
        }
    }
];