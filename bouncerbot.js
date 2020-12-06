//Node libraries
const fs = require("fs");
const Discord = require("discord.js");

const botconfig = require("./botconfig.json");
const bannable_strings = require('./bannable_strings.json')

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
	console.log("Bannabled strings:")
	console.log(bannable_strings)

	//(Testing) Just running this to see if it caches the members so that later on it has full member list
	const guild = bot.guilds.cache.get(botconfig["guild_id"])
	await guild.members.fetch()
});



//Async function for incoming messages
bot.on("message", async message => {

	if (message.author.bot) return; //if the user is a bot do nothing

	console.log(`${message.author.id}: ${message.content}`)

	// Check for spam message -> ban user
	for (const ban_string of bannable_strings) {
		if (message.content.startsWith(ban_string)) {
			console.log("BANNABLE MESSAGE FOUND!")

			let ban_options = {
				"days": 1,
				"reason": 'MCMBouncer - User message identified as spam.'
			}
			
			let target = (await message.guild.members.fetch()).find(m => m.id === message.author.id)
			let target_roles = target.roles.cache.map(r => r.name)
			console.log(target_roles)

			// if spammer cannot be found as a guild member -> just recently joined
			// or if spammer only has the normal @everyone role (extra caution for banning)
			if (typeof target === 'undefined' || (target_roles.length == 1 && target_roles[0] == '@everyone')) {
				console.log(new Date())
				console.log(`BANNING SPAMMER: ${message.author.id}`)
				message.member.ban(ban_options);
				break
			}
		}
	}



	let messageArray = message.content.split(" "); //message into list
	let command = messageArray[0]; //get command 
	let args = messageArray.slice(1); //remove command from argument list

	if (!command.startsWith(botconfig.prefix)) return; //if message is not a bot command, ignore

	const guild = bot.guilds.cache.get(botconfig["guild_id"])

	console.log(`Channel command received ${message.content}`);
	let cmd = bot.channelcommands.get(command.slice(botconfig.prefix.length)); //remove prefix to get command string
	if(cmd) cmd.run(bot, message, guild); 
})


bot.login(botconfig.token);