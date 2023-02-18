# DBS : Digital Bot Simulator

## A DCS World Discord bot by Asta☠
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/559138601573548052/1071379042621739069/DBS.png" />
</p>


### What the bot can do or not
- Share DCS/Tacview/LotATC/SRS server info (names, IP, ports, passwords, players online, etc...) directly on your Discord
- Get the DCS events (connections, slots, takeoffs, shots, team shots, kills, ejections, crashs, landings, messages, server ready)
- Talk between DCS ingame chat (**[2all]** only) and a Discord channel (also works with LotATC's chat). I had to remove every special characters from Discord to DCS chat to avoid "\<BAD UTF\>" problem
- The bot is working with one server instance, I don't know for more instances (I guess you would have to duplicate and configure one bot for one instance)
- Your bot will not be boosted by Discord Nitro, so you will have two limits, the bot can't use emojiIDs from another Discord, and the bot has a limit of 2000 character per message.
- If there is a bug, report to me on the ED's forum thread, I'll see to correct it.
- For now, I don't take "feature requests", "ideas", "customization", etc...  everyone will have a different idea of what its bot should do and/or how it should be, so if you need something specific, feel free to make your own modifications (the server is under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license (CC BY-NC-SA 4.0), so you can make modify it)

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/559138601573548052/1071133963541807314/image.png" />
</p>


### What I ask in exchange?
- Mention a small credit to me in your server/mission 🥰


### Requirements before installation
- be admin on the Discord where you will install the bot
- have access to your DCS server with SRS + Tacview + LotATC
- be able to edit configuration files (no need to have skill in development, but must feel OK with file editing, **Notpad++** strongly recommended)


### Installation
- Shutdown your DCS server
- Install node.js [link](https://nodejs.org/en/)
- Create folder where the bot will be installed and go inside using the Windows Command Prompt (CMD)
- When inside, type 
`npm init`
- Install node plugins 
`npm install discord.js`
- Download and unzip the .zip file
- Take the **DBSGameGUI.lua** file and put it in the folder **../SavesGames/yourDCSserver/Scripts/Hooks/**
- Take the other files and put them where you created your bot's folder 
- Create your Discord bot [link](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot).

It must have those permissions : read Messages/View Channels, send messages, Manage messages, read message history, use external Emojis, add reactions

Follow the steps until this part: [link](https://discordjs.guide/creating-your-bot/#using-config-json) putting your ID in the **config.json** (see screen below)
- You need to activate **PRESENCE INTENT** and **MESSAGE CONTENT INTENT** (see this screen)
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/559138601573548052/1076181402963423272/image.png" />
</p>

- Create two Discord channels, one for server info' and the second one for all the events (including the chat)
- Get the developper Discord mod (settings ⚙ => advanced => Developper mod) (see screen below)
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1072564804809654332/1072568029180862505/image.png" />
</p>

- Right click on the channels and get the IDs to put them in the **index.js** file. (see screens below)
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1072564804809654332/1072568306545983499/image.png" />
  <img src="https://cdn.discordapp.com/attachments/1072564804809654332/1072568306982211635/image-1.png" />
</p>

- Same for the bot's ID (see screens below)
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1072564804809654332/1072568409046384681/image.png" />
  <img src="https://cdn.discordapp.com/attachments/1072564804809654332/1072568306982211635/image-1.png" />
</p>

- Still in the **index.js** file, you must change some paths regarding where your files are located on your computer 
- In the **index.js** file, you can see different "TODO" to identify where you need to make modifications
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/559138601573548052/1076520654268014682/image.png" />
</p>

- Run the bot, for that, use the  Windows Command Prompt (CMD) where the **index.js** is, and type
`node index.js`
(see screen below) 
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1072564804809654332/1072568638160261130/image.png" />
</p>

if error because missing dgram library, still with the Windows Command Prompt (CMD) where the index.js is, type
`npm install dgram`
same for http if needed
`npm install http`
- In the info channel, type 
`!init`
- It will make the bot to answer. 
`First message!`
- Take the ID of this message without deleting it. And paste the ID in the **index.js** file (if you delete this message by accident, remove the ID, save, restart the bot and redo "!init")
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1072564804809654332/1072569115681771551/image.png" />
  <img src="https://cdn.discordapp.com/attachments/1072564804809654332/1072568306982211635/image-1.png" />
</p>

- Restart the bot (To stop the bot,in the CMD windows, do CTRL+C, and start in again the bot with "node index.js")
- Start DCS server
Should works! 🤞 


### Customize your bot
- The biggest part is in the **../SavesGames/yourDCSserver/Scripts/Hooks/DBSGameGUI.lua** file.
You can of course change the ports if needed (if modified, must be also edited in the index.js file)
And you can decide what info' you want to send from the DCS server to the Discord bot, choosing true or false at each item.
If you modify something here, it will be applied to the server only at the next server start. 
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1072564804809654332/1072571238989443204/image.png"/>
</p>

- if you want to use your custom emojis from your server, you need to get their IDs and put them in the **index.js** ( //TODO put your own Emoji ID ) file and in the **DBSGameGUI.lua** file (mostly in the function getIcon)
To get the emoji ID of something you added to your Discord server:
- type in Discord:
`\:TheNameOfYourEmoji:`
And you should get something like that
`<:TheNameOfYourEmoji:aRandomNumber>`
(or see the screen below)
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/1072564804809654332/1072574057314254978/image.png"/>
</p>

- Then you can copy it and paste it in your **index.js** and/or **DBSGameGUI.lua** files 🙂
Saved, reboot and enjoy 🙂
- if you want to remove an info from the bot (a password for example, or the IP, or player list, ...)
you just need to comment the line "messageToShow" adding // just before, in the **index.js** file.
For example, if I want to not share the list of players online, I add // at the beginning of the messageToShow line.
```javascript
//****************
//* Players data *
//****************
if (playersData != null && Object.keys(playersData).length > 0) {
	playersData.forEach(function(player) {
		//messageToShow += "  "+getColorString(player.side)+"*"+player.name+"* "+player.aircraft+"\n"
	});
}
```


### License
![CC BY-NC-SA](https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-sa.png)

CC BY-NC-SA: This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format for noncommercial purposes only, and only so long as attribution is given to the creator. If you remix, adapt, or build upon the material, you must license the modified material under identical terms. 

CC BY-NC-SA includes the following elements:
BY – Credit must be given to the creator
NC – Only noncommercial uses of the work are permitted
SA – Adaptations must be shared under the same terms
See for [LICENSE.MD](https://github.com/frasta/DCS-Discord-bot/blob/main/LICENSE.md) more details.

### Any question?
If you have any question, find me on my Discord in a public channel (please no DM, your question can help other people 😉) =>
[![My Discord](https://cdn.discordapp.com/attachments/559138601573548052/999311782382424084/unknown.png)](https://discord.gg/ZUZdMzQ)
or on the ED's forum :) => [link](https://forum.dcs.world/topic/318803-discord-bot-for-dcs-dbs-digital-bot-simulator-by-asta/)



### Do you like my work?
Then, feel free to buy me a coffee ☕ 

<a href="https://www.buymeacoffee.com/Astazou" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>


Thank you

Asta☠