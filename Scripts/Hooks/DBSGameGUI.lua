-- Digital Bot Simulator - by Asta - Version 1.0
-- https://forum.dcs.world/topic/318803-discord-bot-for-dcs-dbs-digital-bot-simulator-by-asta
-- Licence: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)  see the LICENSE.md for detail
net.log("Loading - DBS GameGUI - Asta: 1.0")

---------------------------------------------------------------------------
-----------           PARAMETERS FOR THE SYSADMIN         -----------------
---------------------------------------------------------------------------
-- Edit the parameters you want to share or not, reboot server after edit--
local showChatMessages = true
local showCustomEmoji = true -- If true, you have to put you own emojiIDs
local showEventFriendly_fire = true
local showEventChange_slot = true
local showEventTakeoff = false
local showEventLanding = false
local showEventConnect = true
local showEventDisconnect = true
local showEventEject = false
local showEventKill = false
local showEventCrash = false
local showEventPilot_death = false

-- If you need to change network conf
local portUDPOut = 14802
local portUDPOutLive = 14803
local portUDPIn = 14804
local addressIP = "127.0.0.1"
---------------------------------------------------------------------------

local DBS = {}

local socket = require("socket")
local udp = socket.udp()
udp:setsockname("*", portUDPIn)
udp:setoption('broadcast', true)
udp:settimeout(0.0001)

local messagePlayersString = ""
local messageLiveData = ""
local PlayersArray = nil
local data = nil
local lastTK = 0


function DBS.onMissionLoadBegin()
	updateData()
end 

function DBS.onSimulationStart()
	udp:sendto(":green_circle:__**[MISSION READY]**__:green_circle:", addressIP, portUDPOut)
end 

function DBS.onSimulationFrame()
	data = udp:receive()
	if data then
		net.send_chat(data, true)
		data = nil
	end
end


function DBS.onSimulationStop()
	--udp:sendto(":red_circle:__**[MISSON STOPPED]**__:red_circle: ", addressIP, portUDPOut)
	updateData()	
end 

function DBS.onChatMessage(message, from)
	if (showChatMessages == true) then
		messagePlayersString = "__**"..cleanSTR(net.get_player_info(from, 'name')).."**__: "..cleanSTR(message)
		if string.match(message,"]:") then
			--Do Nothing when message already coming from Discord
		else
			udp:sendto(messagePlayersString, addressIP, portUDPOut)
		end
	end
	updateData()	
end 


function DBS.onGameEvent(eventName,arg1,arg2,arg3,arg4)
    --"mission_end", winner, msg
    --"self_kill", playerID
    
	if (eventName == "friendly_fire" and showEventFriendly_fire == true) then -- playerID, weaponName, victimPlayerID
		if arg1 ~= arg3 and (tonumber(DCS.getModelTime())-lastTK>1) then
			lastTK = tonumber(DCS.getModelTime())
			udp:sendto("**"..cleanSTR(net.get_player_info(arg1, 'name')).."** did team shot on **"..cleanSTR(net.get_player_info(arg3, 'name')).."** with "..ternary(arg2 == nil or arg2 == "", "gun", arg2).."! :man_police_officer: ", addressIP, portUDPOut)
		end
	elseif (eventName == "change_slot" and showEventChange_slot == true) then --"change_slot", playerID, slotID, prevSide
		if DCS.getUnitType(net.get_player_info(arg1, 'slot')) == "" or DCS.getUnitType(net.get_player_info(arg1, 'slot')) == nil then
			udp:sendto("**"..cleanSTR(net.get_player_info(arg1, 'name')).."** back to spectator :eyes:", addressIP, portUDPOut)
		else
			udp:sendto("**"..cleanSTR(net.get_player_info(arg1, 'name')).."** just took a "..--[[..ternary(net.get_player_info(arg1, 'side') == 1, ":red_circle:", ":blue_circle:")]]getIcon(DCS.getUnitType(net.get_player_info(arg1, 'slot'))), addressIP, portUDPOut)
		end
	elseif (eventName == "takeoff" and showEventTakeoff == true) then --"takeoff", playerID, unit_missionID, airdromeName
		udp:sendto("**"..cleanSTR(net.get_player_info(arg1, 'name')).."** just took off from "..ternary(arg3 == nil or arg3 == "", "a field", arg3).." with a "..getIcon(DCS.getUnitType(net.get_player_info(arg1, 'slot'))), addressIP, portUDPOut)
	elseif (eventName == "landing" and showEventLanding == true) then --"landing", playerID, unit_missionID, airdromeName
		udp:sendto("**"..cleanSTR(net.get_player_info(arg1, 'name')).."** just landed on "..ternary(arg3 == nil or arg3 == "", "a field", arg3).." with a "..getIcon(DCS.getUnitType(net.get_player_info(arg1, 'slot'))), addressIP, portUDPOut)
	elseif (eventName == "connect" and showEventConnect == true) then --"connect", playerID, name
		udp:sendto("**"..cleanSTR(arg2).."** connected. :star_struck:", addressIP, portUDPOut)
	elseif (eventName == "disconnect" and showEventDisconnect == true) then --"disconnect", playerID, name, playerSide, reason_code
		udp:sendto("**"..cleanSTR(arg2).."** disconnected.", addressIP, portUDPOut)
	elseif (eventName == "eject" and showEventEject == true) then --"eject", playerID, unit_missionID
		udp:sendto("**"..cleanSTR(net.get_player_info(arg1, 'name')).."** ejected!", addressIP, portUDPOut)
	elseif (eventName == "kill" and showEventKill == true) then --"kill", killerPlayerID, killerUnitType, killerSide, victimPlayerID, victimUnitType, victimSide, weaponName
		udp:sendto("**"..cleanSTR(net.get_player_info(arg1, 'name')).."**"..ternary(net.get_player_info(arg1, 'side') == 1, ":red_circle:", ":blue_circle:").." killed **"..cleanSTR(net.get_player_info(arg4, 'name')).."**"..ternary(net.get_player_info(arg4, 'side') == 1, ":red_circle:", ":blue_circle:")..ternary(arg7 == nil or arg7 == "", "", " with "..arg7).."!", addressIP, portUDPOut)
	elseif (eventName == "crash" and showEventCrash == true) then --"crash", playerID, unit_missionID
		udp:sendto("**"..cleanSTR(net.get_player_info(arg1, 'name')).."** crashed!", addressIP, portUDPOut)
	elseif (eventName == "pilot_death" and showEventPilot_death == true) then --"pilot_death", playerID, unit_missionID
		udp:sendto("**"..cleanSTR(net.get_player_info(arg1, 'name')).."** died!", addressIP, portUDPOut)
	end 
	
	
	updateData()
end

	
DCS.setUserCallbacks(DBS)

net.log("Loaded - DBS GameGUI - Asta: 1.0")



-- Toolbox functions
function ternary ( cond , T , F )
    if cond then return T else return F end
end

-- Upload your own emojis first, then replace all my emojiIDs by yours
function getIcon(plane) 
	if (showCustomEmoji == true) then
	    if (plane == "Mirage-F1CE" or plane == "Mirage-F1EE" or plane == "Mirage-F1BE" or plane == "Mirage-F1M") then
			plane = "<:f1:996524364629557280>"
		elseif (plane == "M-2000C") then
			plane =  "<:M2k:996529713264726081>"
		elseif (plane == "F-16C_50") then
			plane =  "<:F16:1063795853120262237>"
		elseif (plane == "AJS37") then
			plane =  "<:vig:1063743766718058636>"
		elseif (plane == "F-5E-3") then
			plane =  "<:F5:1063742309931417712>"
		elseif (plane == "F-4E") then
			plane =  "<:F4:1063748948336054322>"
		elseif (plane == "J-11A" or plane == "Su-27") then
			plane =  "<:Su27:1063735540056334346>"
		elseif (plane == "AV8BNA") then
			plane =  "<:av8b:1063795848514908200>"
		elseif (plane == "Su-33") then
			plane =  "<:Su33:1063737145753341962>"
		elseif (plane == "MiG-21Bis") then
			plane =  "<:mig21:1063742287756152862>"
		elseif (plane == "F-14A-135-GR" or plane == "F-14B") then
			plane =  "<:F14:1063598833805824030>"
		elseif (plane == "MiG-29A" or plane == "MiG-29S") then
			plane =  "<:Mig29:1063741453739765861>"
		elseif (plane == "F-15C" or plane == "F-15E") then
			plane =  "<:F15:1063731483686223952>"
		elseif (plane == "FA-18C_hornet") then
			plane =  "<:F18:1063601274907537448>"
		elseif (plane == "JF-17") then
			plane =  "<:jf17:1063745272666132580>"
			
		elseif (plane == "C-101CC" or plane == "C-101EB") then
			plane =  "<:c101:1063795851589324821>"
		elseif (plane == "MB-339A" or plane == "MB-339APAN") then
			plane =  "<:mb339:1063795855246753822>"
		elseif (plane == "L-39C" or plane == "L-39ZA") then
			plane =  "<:L39:1063800652561645619>"
		elseif (plane == "Bronco-OV-10A") then
			plane =  "<:ov10:1063747426663538688>"
		elseif (plane == "MiG-15bis") then
			plane =  "<:Mig15:1063795856265981953>"
		elseif (plane == "MiG-19P") then
			plane =  "<:Mig19:1063795858119864400>"
		elseif (plane == "F-86F Sabre") then
			plane =  "<:F86:1063796579967975515>"
		elseif (plane == "A-4E-C") then
			plane =  "<:A4:1063732914807902268>"
		elseif (plane == "Su-25T" or plane == "Su-25") then
			plane =  "<:Su25:1063795860133138532>"
		elseif (plane == "A-10A" or plane == "A-10C" or plane == "A-10C_2") then
			plane =  "<:A10:1063746313948250153>"
			
		elseif (plane == "TF-51D" or plane == "P-51D" or plane == "P-51D-30-NA") then
			plane =  "<:p51:1063890328786042921>"
		elseif (plane == "SpitfireLFMkIXCW" or plane == "SpitfireLFMkIX") then
			plane =  "<:Spit:1063890331562688672>"
		elseif (plane == "FW-190D9" or plane == "FW-190A8") then
			plane =  "<:FW190:1063894552617955461>"
		elseif (plane == "Bf-109K-4") then
			plane =  "<:bf109:1063890324780499035>"
		elseif (plane == "F-4UD") then
			plane =  "<:F4U:1063895915808690248>"
		elseif (plane == "MosquitoFBMkVI") then
			plane =  "<:Mos:1063894557533687828>"
		elseif (plane == "P-47D-30" or plane == "P-47D-40") then
			plane =  "<:P47:1063894559735689256>"
		elseif (plane == "I-16") then
			plane =  "<:I16:1063894555780468816>"
			
		elseif (plane == "Yak-52") then
			plane =  "<:yak52:1063890333177491526>"
		elseif (plane == "Christen Eagle II") then
			plane =  "<:CE2:1063890327154458744>"
			
		elseif (plane == "UH-1H") then
			plane =  "<:huey:1063730362922053672>"
		elseif (plane == "Mi-24P") then
			plane =  "<:Mi24:1063729323489640508>"
		elseif (plane == "AH-64D_BLK_II") then
			plane =  "<:ah64:1063738298784301096>"
		elseif (plane == "Mi-8MT") then
			plane =  "<:Mi8:1063739236467093554>"
		elseif (plane == "Ka-50" or plane == "Ka-50_3") then
			plane =  "<:ka50:1063747269263884328>"
		elseif (plane == "SA342Mistral" or plane == "SA342Minigun" or plane == "SA342M" or plane == "SA342L") then
			plane =  "<:gaz:1063740174313463818>"
		else
			--Do nothing
		end
	else
		--Do nothing
	end

	return plane
end

--Used to remove specific characters which can cause trouble for the bot
function cleanSTR(strToClean)
	strToClean = string.gsub(strToClean, ",,", "")
	strToClean = string.gsub(strToClean, ";;", "")
	strToClean = string.gsub(strToClean, "::", "")
	strToClean = string.gsub(strToClean, "%.%.", "")
	strToClean = string.gsub(strToClean, "\\", "")
	strToClean = string.gsub(strToClean, "\/", "(")
	strToClean = string.gsub(strToClean, "\"", "")
	strToClean = string.gsub(strToClean, "\'", "")
	strToClean = string.gsub(strToClean, "`", "")
	strToClean = string.gsub(strToClean, "~~", "")
	strToClean = string.gsub(strToClean, "__", "")
	strToClean = string.gsub(strToClean, "--", "")
	strToClean = string.gsub(strToClean, "*", "")
	strToClean = strToClean:match( "^%s*(.-)%s*$")
	return strToClean
end

-- Send by JSON mission's name, mission's time and online players
function updateData()
	messageLiveData = "{\n\"missionTime\":"..DCS.getModelTime()..",\n\"missionName\":\""..cleanSTR(get_last_string_after_backslash(DCS.getMissionFilename())).."\",\n\"players\": \n"
	PlayersArray = net.get_player_list()
	messageLiveData = messageLiveData.."[ "
	if (#PlayersArray > 0) then
		for nameCount = 1, table.getn(PlayersArray) do	
			messageLiveData = messageLiveData.."\n{\n\"name\": \""..cleanSTR(net.get_player_info(PlayersArray[nameCount], 'name')).."\",\n\"side\": "..net.get_player_info(PlayersArray[nameCount], 'side')..",\n\"aircraft\": \""..getIcon(DCS.getUnitType(net.get_player_info(PlayersArray[nameCount], 'slot'))).."\"\n},"
		end
	else
		--Do nothing
	end
	messageLiveData = messageLiveData:sub(1, -2).."]\n}"
	
	udp:sendto(messageLiveData, addressIP, portUDPOutLive)
end

-- I tested and asked ChatGPT for this function :-)
function get_last_string_after_backslash(str)
    local index = string.find(str, "\\[^\\]*$")
    if index == nil then
        return str
    else
        return string.sub(str, index + 1)
    end
end