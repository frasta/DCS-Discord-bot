// Digital Bot Simulator - by Asta - Version 1.0
// https://forum.dcs.world/topic/318803-discord-bot-for-dcs-dbs-digital-bot-simulator-by-asta
// Licence: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)  see the LICENSE.md for detail

// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const UDP = require('dgram')
const publicIp = require('http');

// UDP
const serverUDP = UDP.createSocket('udp4')
const serverUDPlive = UDP.createSocket('udp4')
const portIn = 14802
const portInLive = 14803
const portOut = 14804
const hostname = 'localhost'

// IDs
const channelLiveID = ""; //TODO add yours
const messageLiveID = ""; //TODO add yours
const channelTchatID = ""; //TODO add yours
const botID = ""; //TODO add yours
const titleDCS = "**__DCS__**"; //TODO, I recommend to upload your emoji on your Discord and replace this "text" by your "<:emojiID:123>"
const titleSRS = "**__SRS__**"; //TODO, I recommend to upload your emoji on your Discord and replace this "text" by your "<:emojiID:123>"
const titleTacview = "**__TACVIEW__**"; //TODO, I recommend to upload your emoji on your Discord and replace this "text" by your "<:emojiID:123>"
const titleLotATC = "**__LotATC__**"; //TODO, I recommend to upload your emoji on your Discord and replace this "text" by your "<:emojiID:123>"

// Paths
const path_DCS_SavedGames = "C:/Users/yourNickName/Saved Games/DCS.openbeta_server"; //TODO add you own path
const path_autoupdate = "C:/Program Files/Eagle Dynamics/DCS World OpenBeta Server/autoupdate.cfg"; //TODO add you own path
const path_SRS = "C:/Program Files/DCS-SimpleRadio-Standalone/Scripts/DCS-SRS/entry.lua"; //TODO add you own path
const path_SRSconf = "C:/Program Files/DCS-SimpleRadio-Standalone/server.cfg"; //TODO add you own path
const path_dcsConf = path_DCS_SavedGames+"/Config/serverSettings.lua";
const path_dcsLock = path_DCS_SavedGames+"/dcs.lock";
const path_Tacview = path_DCS_SavedGames+"/Scripts/Hooks/TacviewGameGUI.lua";
const path_LotATC = path_DCS_SavedGames+"/Mods/services/LotAtc/entry.lua";
const path_LotATCconf = path_DCS_SavedGames+"/Mods/services/LotAtc/config.lua";

// Strings
const str_serverOFF = ":red_circle:**__[SERVER CURRENTLY OFF]__**:red_circle:"
const str_serverOFFshort = ":red_circle:__**[SERVER OFFLINE]**__:red_circle: "; 
const str_DCStitle = titleDCS+"\n__Name:__ ";
const str_DCSmissionName = "__Mission:__ ";
const str_DCSip = "__IP:__ ";
const str_DCSmissionTime = "__Started since:__ ";
const str_DCSpassword = "__Pass:__ ";
const str_DCSnopassword = "(no password)";
const str_DCSversion = "__Version:__ ";
const str_DCSic = "__IC:__ ";
const str_DCSplayers = "__Players:__";
const str_SRStitle = "\n"+titleSRS+"\n__Version:__ ";
const str_Tacviewtitle = "\n"+titleTacview+"\n__Version:__ ";
const str_Lotatctitle = "\n"+titleLotATC+"\n__Version:__ ";
const str_SRSfreq = "__Test frequencies:__ ";
const str_port = "__Port:__ ";
const str_codeBlue = "__Blue pass:__ ";
const str_codeRed = "__Red pass:__ ";
const str_emoji_colorWhite = ":white_circle: "; //0
const str_emoji_colorRed = ":red_circle: "; //1
const str_emoji_colorBlue = ":blue_circle: "; //2
const str_emoji_check = ":white_check_mark:"; 
const str_emoji_cross = ":x:"; 

// Load files we will read
var contentDCSConf = fs.readFileSync(path_dcsConf, 'utf8');
var contentDCS = fs.readFileSync(path_autoupdate, 'utf8');
var contentSRS = fs.readFileSync(path_SRS, 'utf8');
var contentSRSConf = fs.readFileSync(path_SRSconf, 'utf8');
var contentTacview = fs.readFileSync(path_Tacview, 'utf8');
var contentLotATC = fs.readFileSync(path_LotATC, 'utf8');
var contentLotATCconf = fs.readFileSync(path_LotATCconf, 'utf8');
var linesDCSConf = contentDCSConf.split('\n');
var linesDCS = contentDCS.split('\n');
var linesSRS = contentSRS.split('\n');
var linesSRSConf = contentSRSConf.split('\n');
var linesTacview = contentTacview.split('\n');
var linesLotATC = contentLotATC.split('\n');
var linesLotATCconf = contentLotATCconf.split('\n');

// Objets
var chanelLive = null;
var lastMessage = "";
var beforeLastMessage = "";
var messageToShow = "";
var myIP = "";
var liveData = "";
var missionTime = "";
var missionName = "";
var playersData = null;


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Bot Started
client.on("ready", function() {
	console.log(`Ready!`);
	
	publicIp.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
		resp.on('data', function(ip) {
			console.log("My public IP address is: " + ip);
				myIP = ip;
		});
	});

	chanelLive = client.channels.cache.find(channel => channel.id === channelLiveID);
	chanelTchat = client.channels.cache.find(channel => channel.id === channelTchatID);
	
	sleep(10000).then(() => { // Delay is time to get the answer for the IP
		updateLiveData();
	})
});

// Listen the new message on the Discord
client.on("messageCreate", (message) => {
    if (message.content === '!init' && messageLiveID === ""){
		chanelLive.send("First message!");
    } else {
		if (message.channelId === channelTchatID && message.author.id != botID) {
			serverUDP.send("[" + message.author.username + "]: " +message.content.replace(/[^a-zA-Z0-9 èàùìòÈÀÒÙÌéáúíóÉÁÚÍÓëäüïöËÄÜÏÖêâûîôÊÂÛÎÔç"'_:?)(-]*$/, ''),portOut,'127.0.0.1');
		}
	}
});

// Log in to Discord with your client's token
client.login(token);


serverUDP.on('listening', () => {
	// Server address it’s using to listen

	const address = serverUDP.address()
	console.log('Listining to ', 'Address: ', address.address, 'Port: ', address.port)
})

serverUDP.on('message', (message, info) => {
	//console.log('Message', message.toString())
	if (message.toString().includes("team shot") && (message.toString().includes(beforeLastMessage) || message.toString().includes(lastMessage) )) {
		//Ignore, used to avoid console spam when planes are colliding
	} else {
		beforeLastMessage = lastMessage;
		lastMessage = message.toString();
		chanelTchat.send(message.toString());
	}
	updateLiveData();
})

serverUDP.bind(portIn)



serverUDPlive.on('listening', () => {
  // Server address it’s using to listen

  const address = serverUDPlive.address()
  console.log('Listining to ', 'Address: ', address.address, 'Port: ', address.port)
})

var rateUpdateConf = 0;
serverUDPlive.on('message', (message, info) => {
	//console.log('Message', message.toString())
	liveData = JSON.parse(message.toString());
	missionTime = liveData.missionTime;
	missionName = liveData.missionName.split(".miz")[0];
	playersData = liveData.players;
	if(rateUpdateConf == 4) { //Feel free to edit it if you want
		updateConf();
		rateUpdateConf = 0;
	} else {
		rateUpdateConf++;
	}
	updateLiveData();
	
})

serverUDPlive.bind(portInLive)

function updateLiveData() {
	messageToShow = "";
	if (fs.existsSync(path_dcsLock) && lastMessage != str_serverOFFshort) {		
		//****************
		//*** DCS data ***
		//****************
		for(var i = linesDCSConf.length-1; i >= 0; i--) {
			if(linesDCSConf[i].indexOf("[\"name\"]")>=0) {
				messageToShow += str_DCStitle+"***"+linesDCSConf[i].split("= \"")[1].split("\",")[0]+"***\n";
				i = 0;
			}
		}
		for(var i = linesDCSConf.length-1; i >= 0; i--) {
			if(linesDCSConf[i].indexOf("[\"port\"] = ")>=0) {
				messageToShow += str_DCSip+"**"+myIP+":"+linesDCSConf[i].split("[\"port\"] = ")[1].split(",")[0]+"**\n";
				i = 0;
			}
		}
		if(missionName != "") {
			messageToShow += str_DCSmissionName+"**"+missionName+"**\n";
		} else {
			for(var i = linesDCSConf.length-1; i >= 0; i--) {
				if(linesDCSConf[i].indexOf(".miz")>=0) {
					messageToShow += str_DCSmissionName+"**"+linesDCSConf[i].slice(linesDCSConf[i].lastIndexOf('\\') + 1).split(".miz")[0]+"**\n";
					i = 0;
				}
			}
		}
		if(missionTime != "") {
			messageToShow += str_DCSmissionTime+"**"+secondsToHM(missionTime)+"**\n";
		}
		for(var i = linesDCSConf.length-1; i >= 0; i--) {
			if (linesDCSConf[i].indexOf("[\"password\"]")>=0) {
				messageToShow += str_DCSpassword+"**"+((linesDCSConf[i].split("= \"")[1].split("\",")[0])?linesDCSConf[i].split("= \"")[1].split("\",")[0]: str_DCSnopassword)+"**\n";
			}
		}
		for(var i = 0; i < linesDCS.length; i++) {
			if(linesDCS[i].indexOf("\"version\"")>=0) {
				messageToShow += str_DCSversion+"**"+linesDCS[i].split(": \"")[1].split("\",")[0]+"**\n";
			}
		}
		for(var i = 0; i < linesDCSConf.length; i++) {
			if (linesDCSConf[i].indexOf("[\"require_pure_models\"]")>=0) {
				if (linesDCSConf[i].indexOf("true")>=0) {
					messageToShow += str_DCSic +"**"+ "yes**\n";
				} else {
					messageToShow += str_DCSic +"**"+ "no**\n";
				}
			}
		}
		
		//****************
		//* Players data *
		//****************
		if (playersData != null && Object.keys(playersData).length > 0) {
			playersData.forEach(function(player) {
				messageToShow += "  "+getColorString(player.side)+"*"+player.name+"* "+player.aircraft+"\n"
			});
		}
		
		//****************
		//*** SRS data ***
		//****************
		messageToShow += str_SRStitle
		for(var i = 0; i < linesSRS.length; i++) {
			if (linesSRS[i].indexOf("version = \"")>=0) {
				messageToShow += "**"+linesSRS[i].split("version = \"")[1].split("\"")[0].trim()+"**\n"
				i = linesSRS.length-1
			}
		}
		
		for(var i = 0; i < linesSRSConf.length; i++) {
			if (linesSRSConf[i].indexOf("SERVER_PORT=")>=0) {
				messageToShow += str_port+"**"+linesSRSConf[i].split("SERVER_PORT=")[1].trim()+"**\n"
			} else if (linesSRSConf[i].indexOf("TEST_FREQUENCIES=")>=0) {
				messageToShow += str_SRSfreq+"**"+linesSRSConf[i].split("TEST_FREQUENCIES=")[1].trim()+"**\n"
			} else if (linesSRSConf[i].indexOf("EXTERNAL_AWACS_MODE_BLUE_PASSWORD=")>=0) {
				messageToShow += str_codeBlue+"**"+((linesSRSConf[i].split("EXTERNAL_AWACS_MODE_BLUE_PASSWORD=")[1].trim())?linesSRSConf[i].split("EXTERNAL_AWACS_MODE_BLUE_PASSWORD=")[1].trim(): str_DCSnopassword)+"**\n";
			} else if (linesSRSConf[i].indexOf("EXTERNAL_AWACS_MODE_RED_PASSWORD=")>=0) {
				messageToShow += str_codeRed+"**"+((linesSRSConf[i].split("EXTERNAL_AWACS_MODE_RED_PASSWORD=")[1].trim())?linesSRSConf[i].split("EXTERNAL_AWACS_MODE_RED_PASSWORD=")[1].trim(): str_DCSnopassword)+"**\n";
			}
		}
		
		//****************
		//* Tacview data *
		//****************
		messageToShow += str_Tacviewtitle
		for(var i = 0; i < linesTacview.length; i++) {
			if (linesTacview[i].indexOf("local tacviewName = 'Tacview ")>=0) {
				messageToShow += "**"+linesTacview[i].split("local tacviewName = 'Tacview ")[1].split(" C++ flight")[0].trim()+"**\n"
				i = linesTacview.length-1
			}
		}
		
		//***************
		//* LotATC data *
		//***************
		messageToShow += str_Lotatctitle
		for(var i = 0; i < linesLotATC.length; i++) {
			if (linesLotATC[i].indexOf("version    = \"")>=0) {
				messageToShow += "**"+linesLotATC[i].split("version    = \"")[1].split("\"")[0].trim()+"**\n"
				i = linesLotATC.length-1
			}
		}
		for(var i = 0; i < linesLotATCconf.length; i++) {
			if (linesLotATCconf[i].indexOf("    port = ")>=0) {
				messageToShow += str_port + "**"+linesLotATCconf[i].split("    port = ")[1].split(",")[0].trim()+"**\n"
			}
			if (linesLotATCconf[i].indexOf("    red_password = \"")>=0) {
				messageToShow += str_codeRed + "**"+((linesLotATCconf[i].split("    red_password = \"")[1].split("\"")[0].trim())?linesLotATCconf[i].split("    red_password = \"")[1].split("\"")[0]: str_DCSnopassword)+"**\n"
			}
			if (linesLotATCconf[i].indexOf("    blue_password = \"")>=0) {
				messageToShow += str_codeBlue + "**"+((linesLotATCconf[i].split("    blue_password = \"")[1].split("\"")[0].trim())?linesLotATCconf[i].split("    blue_password = \"")[1].split("\"")[0]: str_DCSnopassword)+"**\n"
				i = linesLotATCconf.length-1
			}
		}
		
	} else {
		messageToShow = str_serverOFF;
		chanelTchat.send(str_serverOFFshort);
	}

	chanelLive.messages.fetch(messageLiveID).then(message => {
		message.edit(messageToShow);
	})
}

//Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Transform seconds in hour+minutes
function secondsToHM(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);

    var hDisplay = h > 0 ? h + "H ": "";
    var mDisplay = m + "m ";
	
    return hDisplay + mDisplay; 
}

//Returns the correct team color following the the teamID
function getColorString(colorId) {
	if (colorId != null) {
		if(colorId == 2) {
			return str_emoji_colorBlue;
		} else if (colorId == 1) {
			return str_emoji_colorRed;
		} else {
			return str_emoji_colorWhite;
		}
	} else {
		return str_emoji_colorWhite;
	}
}

//Sometimes recheck the data in conf files
function updateConf(){
	contentDCSConf = fs.readFileSync(path_dcsConf, 'utf8');
	contentDCS = fs.readFileSync(path_autoupdate, 'utf8');
	contentSRS = fs.readFileSync(path_SRS, 'utf8');
	contentSRSConf = fs.readFileSync(path_SRSconf, 'utf8');
	contentTacview = fs.readFileSync(path_Tacview, 'utf8');
	contentLotATC = fs.readFileSync(path_LotATC, 'utf8');
	contentLotATCconf = fs.readFileSync(path_LotATCconf, 'utf8');
	linesDCSConf = contentDCSConf.split('\n');
	linesDCS = contentDCS.split('\n');
	linesSRS = contentSRS.split('\n');
	linesSRSConf = contentSRSConf.split('\n');
	linesTacview = contentTacview.split('\n');
	linesLotATC = contentLotATC.split('\n');
	linesLotATCconf = contentLotATCconf.split('\n');
}