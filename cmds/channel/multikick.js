
module.exports.run = async (bot, message, guild) => {
	//Target is the user who wrote the message (command)
	let target = (await guild.members.fetch()).find(m => m.id === message.author.id)
	let target_roles = target.roles.cache.map(r => r.name)

	if (!target_roles.includes("Core Contributor") || !target.hasPermission("KICK_MEMBERS")) {
		console.warn(`multikick command attempt by user: ${target.user.username} (${target.user.id})`)
		let msg = await message.channel.send("User invalid permission.")
		await msg.delete({timeout: 10000})
		return
	}

	const members_to_kick = message.mentions.members
	if (members_to_kick.size === 0) {
		message.channel.send("No user mentions found.")
		return
	}

	let tot_kicked = 0
	let members_kicked = []
	let members_not_kicked = []
	for (const member_obj of members_to_kick) {
		let member = member_obj[1]
		if (member.hasPermission("KICK_MEMBERS") || member.hasPermission("BAN_MEMBERS")) {
			// message.channel.send(`${member} cannot be kicked.`)
			members_not_kicked.push(member.user.username)
			continue
		} else {
			try {
				member.kick()
				members_kicked.push(member.user.username)
				tot_kicked += 1
			} catch(err) {
				console.log(err)
				// message.channel.send(`Error when trying to kick member ${member}`)
				members_not_kicked.push(member.user.username)
			}
		}
	}

	//Send message results
	message.channel.send(`${tot_kicked}/${members_to_kick.size} members have been kicked from the server.`)	

	//All members that have been kicked
	if (members_kicked.length > 0) {
		let kicked_s = "Kicked: "
		let first = true
		for (const kicked_m of members_kicked) {
			if (!first) {
				kicked_s += ", "
			}
			first = false

			kicked_s += `${kicked_m}`
		}
		message.channel.send(kicked_s)
	}

	//All members that were not kicked due to having a higher permission or encountered error
	if (members_not_kicked.length > 0) {
		console.log(members_not_kicked)
		let not_kicked_s = "Unable to kick: "
		first = true
		for (const not_kicked_m of members_not_kicked) {
			if (!first) {
				not_kicked_s += ", "
			}
			first = false

			not_kicked_s += `${not_kicked_m}`
		}
		message.channel.send(not_kicked_s)
	}


}

module.exports.help = {
	name: "multikick"
}