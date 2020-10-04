//Node libraries
const fs = require("fs");
const Discord = require("discord.js");

const botconfig = require("./botconfig.json");

const channel_commands_path = "./cmds/channel"

const bot = new Discord.Client({disableEveryone: true});

//Collections to hold available commands
bot.channelcommands = new Discord.Collection();

//Set available CHANNEL commands
fs.readdir(channel_commands_path, (err, files) => {
	if (err) console.error(err);

	let jsFiles = files.filter(f => f.split(".").pop() === "js"); //get all .js files in cmds/channel dir
	if (jsFiles.length <= 0) {
		console.log("No channel commands to load!");
		return;
	}

	console.log(`Loading ${jsFiles.length} channel commands...`);
	jsFiles.forEach((f, i) => {
		let props = require(`${channel_commands_path}/${f}`);
		console.log(`${i+1}: ${f} loaded`);
		bot.channelcommands.set(props.help.name, props);
	});
})


bot.on("ready", async () => {
	console.log(`${bot.user.username} bot is ready!`);
});



//Async function for incoming messages
bot.on("message", async message => {

	if (message.author.bot) return; //if the user is a bot do nothing

	//TODO check for spam message -> ban user
	const guild = bot.guilds.cache.get(botconfig.guild_id)
	let messageArray = message.content.split(" "); //message into list
	let command = messageArray[0]; //get command 
	let args = messageArray.slice(1); //remove command from argument list

	if (!command.startsWith(botconfig.prefix)) return; //if message is not a bot command, ignore

	console.log(`Channel command received ${message.content}`);
	let cmd = bot.channelcommands.get(command.slice(botconfig.prefix.length)); //remove prefix to get command string
	if(cmd) cmd.run(bot, message, guild); 
})


bot.login(botconfig.token);