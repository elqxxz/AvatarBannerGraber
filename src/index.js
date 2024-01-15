require('dotenv').config();
const {Client, IntentsBitField} = require('discord.js');
const {CommandKit} = require('commandkit');
const OptionsData = require('../src/data/GraberOptions.json');

const client = new Client({ 
    intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ] 
});

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`,
    eventsPath: `${__dirname}/events`,
    devGuildIds: [process.env.GUILD_ID],
    devRoleIds: [process.env.MOD_ROLE_ID],
    bulkRegister: true,
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isAutocomplete()) return;
    if (interaction.commandName!== 'get-avatar') return;

    const focusedValue = interaction.options.getFocused();

    const filteredChoices = OptionsData.filter((option) => 
        option.name.toLowerCase().startsWith(focusedValue.toLowerCase())
    )
    const results = filteredChoices.map((choice) => {
        return{
            name: `${choice.name}`,
            value: `${choice.id}`,
        }
    });
    interaction.respond(results.slice(0, 2)).catch(() => {});
});

client.login(process.env.TOKEN)