## Mochimo Bouncer Bot for Discord
##### Author: dcryptt
#### Oct. 2020

- Provides command functionality to kick multiple users at once
- (WIP) Listens and identifies spam messages by users, than bans the users accordingly


### Requirements ###
Latest version of node v14+
```
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt -y install nodejs
```

#### 1. Install project dependencies
```
cd <bouncer repo dir>
npm install
```

### 2. Create discord bot: https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/ (up to step 5)
- You should be logged into your own discord. Go to discordapp.com/developers/applications/me
- Create a "New Application", name is arbitrary (e.g. Bouncer).
- In new application, click "Bot" under Settings. Click "Add Bot".
- In bot settings page, get bot token "Click to reveal token". Save it somewhere safe. Do not share it. Also disable the "Public Bot" setting.
- OAuth2 tab, select SCOPES "bot" and the necessary BOT PERMISSIONS (View Channels, Send Messages, Kick and Ban). Copy the generated url.
- Open the URL in a browser. This should open a discord page where you can invite the bot to your server.
- Once done, check that the bot account is in the server from your usual discord account.


### 3. Bouncer bot

Edit files with own configuration:

- botSettings.json
  - token: new generated token from own bot created in setup
  - guild_id: set ID of the Mochimo server (currently set)

### 4. Run the bot!
```
node bouncerbot.js
```
or 
```
chmod +x restart.sh
nohup ./restart.sh &
```



## ----- Command specification -----
Function 0 (passive)
--> listens for spam messages and bans the spamming users

Function 1: $!multkick <@user*>
--> kicks all users mentioned

