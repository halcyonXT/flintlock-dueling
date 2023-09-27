/**
 *                                        Flintlock  dueling
 *                                         A mod by Halcyon
 * 
 *                                  Contact on Discord - h.alcyon
 */

/**
 * TO-DO:
 * - Add dueling invitation with requested ship
 */

this.options = {
    root_mode: "",
    map_name: "",
    max_players: 12,
    starting_ship: 101,
    map_size: 100,
    speed_mod: 1.2,
    max_level: 1,
    weapons_store: false,
    soundtrack: "warp_drive.mp3",
    custom_map: "",
};

let staticMemory = {
    banSwearWords: true, //Change to true if you want to ban swear words - may have an impact on performance

    retractableComponentIDs: ["mainControlsBackground"],
    layout: ['qwertyuiop'.split(''), 'asdfghjkl'.split(''), 'zxcvbnm'.split('')],
    layoutString: 'qwertyuiopasdfghjklzxcvbnm'
}

let sessionMemory = {
    rememberedIDs: [],
    admins: [],
    chatChannels: [
        {
            parties: ["global"],
            messages: []
        }
    ],
    banned: [

    ]
}

const SHIP_SELECTION = {
    "vanilla": {
        "tier7": [
            [701, "Odyssey"],
            [702, "Shadow X3"],
            [703, "Bastion"],
            [704, "Aries"]
        ],
        "tier6": [
            [601, "Advanced Fighter"],
            [602, "Scorpion"],
            [603, "Marauder"],
            [604, "Condor"],
            [605, "A-Speedster"],
            [606, "Rock Tower"],
            [607, "Barracuda"],
            [608, "O-Defender"]
        ],
        "tier5": [
            [501, "U-Sniper"],
            [502, "Fury-Star"],
            [503, "T-Warrior"],
            [504, "Aetos"],
            [505, "Shadow X2"],
            [506, "Howler"],
            [507, "Bat-Defender"],
        ],
        "tier4": [
            [401, "Vanguard"],
            [402, "Mercury"],
            [403, "X-Warrior"],
            [404, "Interceptor"],
            [405, "Pioneer"],
            [406, "Crusader"],
        ],
        "tier3": [
            [301, "Pulse Fighter"],
            [302, "Side Fighter"],
            [303, "Shadow X1"],
            [304, "Y-Defender"],
        ],
        "tier2": [
            [201, "Delta Fighter"],
            [202, "Trident"],
        ],
        "tier1": [
            [101, "Fly"]
        ]
    }
}

let SWEAR_WORD_LIST = [];

staticMemory.banSwearWords && (async () => {
    try {
        let raw = await fetch('https://raw.githubusercontent.com/zacanger/profane-words/master/words.json')
        let data = await raw.json();
        SWEAR_WORD_LIST = data.sort((a, b) => b.length - a.length);
        statusMessage("success", "Fetched swear word list")
    } catch (ex) {
        statusMessage("error", "Cannot fetch swear word list")
        statusMessage("error", ex)
    }
})();

const ECHO_SPAN = 105;
let echoed = false;

const debugEcho = (msg) => echo(JSON.stringify(msg));
const centeredEcho = (msg, color = "") => echo(`${" ".repeat(~~((ECHO_SPAN / 2) - Array.from(msg).length / 2))}${color}${msg}`)
const anchoredEcho = (msgLeft, msgRight, color = "", anchor) => echo(color + `${" ".repeat(~~((ECHO_SPAN / 2) - (anchor.length / 2)) - Array.from(msgLeft).length)}${msgLeft}${anchor}${msgRight}`, " ")
const commandEcho = (command, description, example, color) => echo(color + command + `[[;#FFFFFF30;]${" ".repeat(~~(((ECHO_SPAN / 2) - command.length) - (description.length / 2)))}` + color + description + `[[;#FFFFFF30;]${" ".repeat(Math.ceil(((ECHO_SPAN / 2) - example.length) - (description.length / 2)))}` + color + example)

help = () => {
    echo(" ")
    centeredEcho("Command list:", "[[ub;#FF4f4f;]");
    commandEcho("Command", "Description", "Example usage", "[[b;#5FFFFF;]")
    commandEcho("showIDs()", "Prints a list with the IDs and names of all players", "showIDs()", "[[;#FFFFFF;]")
    commandEcho("help()", "Prints the list of commands", "help()", "[[;#FFFFFF;]")
    commandEcho("adminList()", "Prints the list of admins", "adminList()", "[[;#FFFFFF;]");
    commandEcho("giveAdmin(id)", "Gives player with the specified ID admin privileges", "giveAdmin(4)", "[[;#FFFFFF;]");
    commandEcho("removeAdmin(id)", "Removes admin privileges from player with specified ID", "removeAdmin(4)", "[[;#FFFFFF;]");
    echo(" ")
}

adminList = () => {
    echo(" ")
    centeredEcho("Admin list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Player ID", "[[b;#5FFFFF;]", "|")
    for (let ship of sessionMemory.admins) {
        anchoredEcho(`${game.ships[fetchShip(ship)].name} `, ` ${ship}`, "[[;#FFFFFF;]", "|")
    }
    echo(" ")
}

if (!echoed) {
    setTimeout(() => {
        echo(" ")
        echo(" ")
        
        centeredEcho("         🇼​🇪​🇱​🇨​🇴​🇲​🇪​ 🇹​🇴​", "[[b;#FFFFFF;]");
        centeredEcho(" ＦＬＩＮＴＬＯＣＫ ＤＵＥＬＩＮＧ              ", "[[gb;#FF0000;]");
        centeredEcho("            🇦​ 🇲​🇴​🇩​ 🇧​🇾​ 🇭​🇦​🇱​🇨​🇾​🇴​🇳", "[[;#FFFFFF30;]")
        echo(" ")
        centeredEcho("Contact:", "[[ub;#FF4f4f;]");
        centeredEcho("Discord - h.alcyon", "[[;#FFFFFF;]");
        help()
        echo(" ")
    }, 2000)

    echoed = true;
}

showIDs = function () {
    echo(" ")
    centeredEcho("Player list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Player ID", "[[b;#5FFFFF;]", "|")
    for (let ship of game.ships) {
        anchoredEcho(`${ship.name} `, ` ${ship.id}`, "[[;#FFFFFF;]", "|")
    }
    echo(" ")
}

giveAdmin = (id) => {
    for (let ship of game.ships) {
        if (ship.id === id) {
            if (!(sessionMemory.admins.includes(id))) {
                sessionMemory.admins.push(id)
                game.ships[fetchShip(id)].isUIExpanded && renderExpandedMenu(game.ships[fetchShip(id)], "admin")
                return statusMessage("success", `Player with the id of ${id} (${game.ships[fetchShip(id)].name}) has been granted admin privileges`)
            } else {
                return statusMessage("error", `Player is already admin. Do removeAdmin(${id}) to remove`)
            }
        }
    }
    return statusMessage("error", `Player with the id of ${id} doesn't exist`)
}

removeAdmin = (id) => {
    for (let admin of sessionMemory.admins) {
        if (admin === id) {
            sessionMemory.admins = removeFromArray(sessionMemory.admins, id)
            let target = game.ships[fetchShip(id)]
            target.isUIExpanded && renderExpandedMenu(target, determineType(target))
            closeDashboard(target, game)
            return statusMessage("success", `Player with the id of ${id} (${target.name}) no longer has admin privileges`)
        }
    }
    return statusMessage("error", `There is no admin with the id of ${id}`)
}

const statusMessage = (status, message) => {
    let str = ""
    switch (status) {
        case "error":
            str = str + "[[b;#FF0000;] ERROR - "
            break
        case "success":
            str = str + "[[b;#00FF00;] SUCCESS - "
            break
        case "warn":
            str = str + "[[b;#FFFF00;] WARN - "
            break
        default:
            str = str + "[[b;#007bff;] INFO - "
            break
    }
    echo(str + "[[;#FFFFFF;]" + message)
}

const determineType = (ship) => sessionMemory.admins.includes(ship.id) ? "admin" : "regular"

this.event = function (event, game) {
    switch (event.name) {
        case "ship_spawned":
            if (event.ship != null) {
                if (sessionMemory.banned.includes(event.ship.name)) {
                    kickPlayer(event.ship)
                }
                event.ship.chatOpen = false
                event.ship.draftMessage = ""
                event.ship.chatTargetID = -1
                event.ship.dashboardOpen = false
                event.ship.recievedMessages = []
                event.ship.globalChatExpanded = false
                event.ship.set({ x: 0, y: 0 });
                if (!(sessionMemory.rememberedIDs.includes(event.ship.id))) {
                    sessionMemory.rememberedIDs.push(event.ship.id)
                }
                renderExpandedMenu(event.ship, determineType(event.ship));
                setTimeout(() => {
                    minimizeGlobalChat(event.ship)
                }, 1000)
            }
            break;
        case "ui_component_clicked":
            var component = event.id;
            switch (component) {
                case "expandButton":
                    return event.ship.isUIExpanded
                    ?
                    renderRetractedMenu(event.ship)
                    :
                    renderExpandedMenu(event.ship, determineType(event.ship));

                case "showShipTree":
                    return SHIP_TREE_PANEL.renderShipTree(event.ship);

                case "closeShipTree":
                    return SHIP_TREE_PANEL.closeShipTree(event.ship);

                case "openAdjust":
                    statusMessage("if", "openAdjust")
                    return ADJUST_PANEL.renderPanel(event.ship);

                case "closeAdjust":
                    return ADJUST_PANEL.closePanel(event.ship);
                    
                case "showDashboard":
                    return renderDashboard(event.ship, game);

                case "sendMessage":
                    return handleSendMessage(event.ship, game);

                case "closeDashboard":
                    return closeDashboard(event.ship, game);

                case "back_chat":
                    return closeChat(event.ship, game);

                case "global_channel":
                    return openGlobalChat(event.ship, game);

                case "resize_global_chat":
                    if (event.ship.globalChatExpanded) {
                        minimizeGlobalChat(event.ship)
                    } else {
                        renderExpandedChat(event.ship, game)
                    }
                    return;

                default:
                    // Search every KEY and if component.startsWith(KEY) execute and return the function
                    // All prefix-based component must be formatted like {action}_{id}
                    //                      Make sure to include the underscore ^^^

                    // Sort these by frequency to boost performance
                    const prefixes = {
                        "channel": () => {
                            handleOpenChat(event.ship, Number(component.split("_")[1]), game)
                        },
                        "key": () => {
                            handleDraftChange(event.ship, component.split("_")[1], game)
                        },
                        "kick": () => {
                            kickPlayer(game.ships[fetchShip(Number(component.split("_")[1]))])
                        },
                        "ban": () => {
                            sessionMemory.banned.push(game.ships[fetchShip(Number(component.split("_")[1]))].name)
                            kickPlayer(game.ships[fetchShip(Number(component.split("_")[1]))])
                        },
                        "selectShip": () => {
                            let type = component.split("_")[1];
                            let level = type.charAt(0);
                            event.ship.set({type: Number(type), stats: Number(level.repeat(8))})
                        },
                        "adjust": () => {
                            ADJUST_PANEL.compileNewStats(event.ship, component);
                        }
                    }
                    for (let prefix of Object.keys(prefixes)) {
                        if (component.startsWith(prefix + "_")) {
                            return prefixes[prefix]();
                        }
                    }
                    return;
            }
            return;
    }
};

const kickPlayer = (ship) => ship.gameover({ "Rating": "You have been kicked from participating", "Score": 0 });

const minimizeGlobalChat = (ship) => {
    ship.globalChatExpanded = false;
    console.log(ship);
    ship.setUIComponent({
        id: "global_chat_front",
        position: [0, 64, 30, 31],
        visible: false,
        clickable: false,
        components: []
    })
    ship.setUIComponent({
        id: "resize_global_chat",
        position: [1, 90, 5, 5],
        visible: true,
        clickable: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF30", stroke: "#FFFFFF60", width: 1 },
            { type: "text", position: [0, 0, 100, 100], color: "#FFF", align: "center", value: "→" }
        ]
    })
}

const renderExpandedChat = (ship, game) => {
    ship.globalChatExpanded = true
    let components = [
        { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF05" },
        { type: "box", position: [0, 0, 100, 1], fill: "#FFFFFF50" },
        { type: "box", position: [0, 99, 100, 1], fill: "#FFFFFF50" }
    ]
    let chat = [...sessionMemory.chatChannels[0].messages].reverse()
    for (let i = 0, Y_OFFSET = 0; i < chat.length; i++) {
        if (i >= 4) { break }
        components.push({
            type: "box",
            position: [0, 84 - Y_OFFSET, 100, 16],
            fill: "#FFFFFF05"
        })
        components.push({
            type: "text",
            position: [0, 84 - Y_OFFSET, 100, 16],
            color: "#FFFFFF",
            value: chat[i].message,
            align: "left"
        })
        if (fetchShip(chat[i].sentBy) !== -1) {
            components.push({
                type: "player",
                position: [0, 77.55 - Y_OFFSET, 40, 6.45],
                color: "#FFFFFF00",
                id: chat[i].sentBy
            })
            components.push({
                type: "text",
                position: [10, 77.55 - Y_OFFSET, 100, 6.45],
                color: "#FFFFFF",
                value: game.ships[fetchShip(chat[i].sentBy)].name,
                align: "left"
            })
        } else {
            components.push({
                type: "text",
                position: [10, 77.55 - Y_OFFSET, 100, 6.45],
                color: "#FFFFFF",
                value: "Player left",
                align: "left"
            })
        }
        Y_OFFSET += 25.675
    }
    ship.setUIComponent({
        id: "global_chat_front",
        position: [0, 64, 30, 31],
        visible: true,
        clickable: false,
        components: components
    })
    ship.setUIComponent({
        id: "resize_global_chat",
        position: [31, 90, 5, 5],
        visible: true,
        clickable: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#24242450", stroke: "#FFFFFF50", width: 2 },
            { type: "text", position: [0, 0, 100, 100], color: "#FFF", align: "center", value: "←" }
        ]
    })
}

//ship
const renderKeyboard = (initiator, game) => {
    for (let i = 0; i < staticMemory.layout.length; i++) {
        for (let j = 0; j < staticMemory.layout[i].length; j++) {
            const X_OFFSET = i == 0 ? 0 : i == 1 ? 2 : 4
            initiator.setUIComponent({
                id: `key_${staticMemory.layout[i][j]}`,
                position: [20 + X_OFFSET + (j * 6), 65 + (i * 5), 6, 5],
                visible: true,
                shortcut: staticMemory.layout[i][j].toUpperCase(),
                clickable: true,
                components: [
                    { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF50", stroke: "#FFFFFF50" },
                    { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: staticMemory.layout[i][j], align: "center" },
                ]
            })
        }
    }
    initiator.setUIComponent({
        id: "key_space",
        position: [30, 80, 30, 5],
        visible: true,
        shortcut: " ",
        clickable: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF50", stroke: "#FFFFFF50" },
        ]
    })
    try {
        initiator.setUIComponent({
            id: "typingSpace",
            position: [20, 60, 50, 5],
            visible: true,
            clickable: false,
            components: [
                { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF10", stroke: "#FFFFFF50" },
                { type: "text", position: [2, 0, 96, 100], color: "#FFF", value: initiator.draftMessage, align: "left" },
            ]
        })
    } catch (err) {
        echo(err)
        console.log(err)
    }
    initiator.setUIComponent({
        id: "key_backspace",
        position: [70, 60, 5, 5],
        visible: true,
        clickable: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF50", stroke: "#FFFFFF50" },
            { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: "↩", align: "center" },
        ]
    })
    initiator.setUIComponent({
        id: "sendMessage",
        position: [75, 60, 5, 5],
        visible: true,
        clickable: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF50", stroke: "#FFFFFF50" },
            { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: "➤", align: "center" },
        ]
    })
}

const openGlobalChat = (initiator, game) => {
    initiator.chatTargetID = -1
    initiator.draftMessage = ""
    initiator.chatOpen = true
    initiator.recievedMessages = removeFromArray(initiator.recievedMessages, -1)
    for (let i = 0; i < sessionMemory.rememberedIDs.length; i++) {
        initiator.setUIComponent({ id: `channel_${sessionMemory.rememberedIDs[i]}`, visible: false })
        initiator.setUIComponent({ id: `player_${sessionMemory.rememberedIDs[i]}`, visible: false })
        initiator.setUIComponent({ id: `invite_${sessionMemory.rememberedIDs[i]}`, visible: false })
        initiator.setUIComponent({ id: `ban_${sessionMemory.rememberedIDs[i]}`, visible: false })
        initiator.setUIComponent({ id: `kick_${sessionMemory.rememberedIDs[i]}`, visible: false })
    }
    initiator.setUIComponent({ id: `global_channel`, visible: false })
    initiator.setUIComponent({
        id: "back_chat",
        position: [72, 17, 4, 3],
        clickable: true,
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#20202050", stroke: "#FFFFFF50" },
            { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: "←", align: "center" },
        ]
    })
    initiator.setUIComponent({
        id: "chat_player_indicator",
        position: [22, 17, 45, 3],
        clickable: false,
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: `Global Chat`, align: "left" }
        ]
    })
    renderKeyboard(initiator, game);
    renderGlobalMessages(initiator.id)
}
//targets
const renderGlobalMessages = (ship) => {
    let target = ship.id
    let chat = sessionMemory.chatChannels[0]
    for (let i in game.ships) {
        for (let j = 0; j < chat.messages.length; j++) {
            if (game.ships[i].chatTargetID === -1) {
                try {
                    let messageType = chat.messages[j].sentBy === game.ships[i].id ? "user" : "foreign"
                    game.ships[i].setUIComponent({
                        id: `message_${j}`,
                        position: [22.5, 22.2 + (j * 6.66), 56, 4],
                        clickable: false,
                        visible: game.ships[i].chatOpen,
                        components: [
                            { type: "box", position: [0, 0, 100, 100], fill: messageType == "foreign" ? "#00FF0060" : "#0000FF60", stroke: "#FFFFFF50" },
                            { type: "text", position: [2, 2, 96, 96], color: "#FFF", value: chat.messages[j].message, align: messageType == "foreign" ? "left" : "right" },
                        ]
                    })
                    game.ships[i].setUIComponent({
                        id: `message_${j}_indicator`,
                        position: [22.5, 20.2 + (j * 6.66), 56, 2],
                        clickable: false,
                        visible: game.ships[i].chatOpen,
                        components: messageType === "foreign" ?
                            fetchShip(chat.messages[j].sentBy) !== -1 ?
                                [
                                    { type: "player", id: chat.messages[j].sentBy, position: [0, 0, 100, 100], color: "#FFF" },
                                ]
                                :
                                [
                                    { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: "Player left", align: "left" },
                                ]
                            : [
                                { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: "You", align: "right" },
                            ]
                    })
                } catch (err) {
                    echo(err)
                    console.log(err)
                }
            }
        }
    }
}

const handleDraftChange = (ship, key, game) => {
    function removeLastCharacter(str) {
        if (str === '') {
            return '';
        } else {
            return str.slice(0, -1);
        }
    }
    switch (key) {
        case "space":
            ship.draftMessage = ship.draftMessage + " "
            break
        case "backspace":
            ship.draftMessage = removeLastCharacter(ship.draftMessage)
            break
        default:
            ship.draftMessage = ship.draftMessage + key
    }
    ship.setUIComponent({
        id: "typingSpace",
        position: [20, 60, 50, 5],
        visible: true,
        clickable: false,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF10", stroke: "#FFFFFF50" },
            { type: "text", position: [2, 0, 96, 100], color: "#FFF", value: ship.draftMessage, align: "left" },
        ]
    })
}

const handleSendMessage = (ship, game) => {
    //statusMessage("amb", "Entered handleSendMessage")
    if (ship.draftMessage === "") { return }
    //statusMessage("success", "Not empty")

    //const CUSTOM_FONT = "abcdefghijklmnopqrstuvwxyz";
    //let NORMAL_FONT = "abcdefghijklmnopqrstuvwxyz".split('');
    let newDraftMessage;

    
    ;(() => {
        try {
            let lowercasedInput = ship.draftMessage;
            for (let swearWord of SWEAR_WORD_LIST) {
                const regex = new RegExp(swearWord, 'gi');
                lowercasedInput = lowercasedInput.replace(regex, (match) => '*'.repeat(match.length));
            }
            newDraftMessage = lowercasedInput;
        } catch (ex) {
            statusMessage("error", ex)
        }
    })();
    

    ship.draftMessage = "";
    
    let type = ship.chatTargetID === -1 ? "global" : "direct"
    let targets = [ship.id, ship.chatTargetID]
    let chatIndex = type === "global" ? 0 : fetchChat(targets[0], targets[1])
    sessionMemory.chatChannels[chatIndex].messages.length === 6 && sessionMemory.chatChannels[chatIndex].messages.shift()
    if (type === "direct") {
        sessionMemory.chatChannels[chatIndex].messages.push({
            sentBy: Math.min(ship.id, ship.chatTargetID) === ship.id ? 0 : 1,
            message: newDraftMessage
        })
    } else {
        sessionMemory.chatChannels[chatIndex].messages.push({
            sentBy: ship.id,
            message: newDraftMessage
        })
    }
    ship.draftMessage = ""
    ship.setUIComponent({
        id: "typingSpace",
        position: [20, 60, 50, 5],
        visible: true,
        clickable: false,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF10", stroke: "#FFFFFF50" },
            { type: "text", position: [2, 0, 96, 100], color: "#FFF", value: ship.draftMessage, align: "left" },
        ]
    })
    if (type === "direct") {
        renderMessages(targets[0], targets[1])
        let target = game.ships[fetchShip(ship.chatTargetID)]
        if (!(target.recievedMessages.includes(ship.id))) {
            target.recievedMessages.push(ship.id)
        }
        if (target.chatOpen) {
            if (target.chatTargetID !== ship.id) {
                notify(target)
            } else {
                target.recievedMessages = removeFromArray(target.recievedMessages, ship.id)
            }
        } else if (target.dashboardOpen) {
            renderDashboard(target, game)
            notify(target)
        } else {
            notify(target)
        }
    } else {
        renderGlobalMessages(ship)
        for (let ship of game.ships) {
            if (ship.globalChatExpanded) {
                renderExpandedChat(ship, game)
            }
        }
    }
}

const removeFromArray = (arr, target) => arr.filter(item => item !== target);

const handleOpenChat = (initiator, targetID, game) => {
    initiator.chatTargetID = targetID
    initiator.draftMessage = ""
    initiator.chatOpen = true
    initiator.recievedMessages = removeFromArray(initiator.recievedMessages, targetID)
    for (let i = 0; i < sessionMemory.rememberedIDs.length; i++) {
        initiator.setUIComponent({ id: `channel_${sessionMemory.rememberedIDs[i]}`, visible: false })
        initiator.setUIComponent({ id: `player_${sessionMemory.rememberedIDs[i]}`, visible: false })
        initiator.setUIComponent({ id: `invite_${sessionMemory.rememberedIDs[i]}`, visible: false })
        initiator.setUIComponent({ id: `ban_${sessionMemory.rememberedIDs[i]}`, visible: false })
        initiator.setUIComponent({ id: `kick_${sessionMemory.rememberedIDs[i]}`, visible: false })
    }
    initiator.setUIComponent({ id: `global_channel`, visible: false })
    initiator.setUIComponent({
        id: "back_chat",
        position: [72, 17, 4, 3],
        clickable: true,
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#20202050", stroke: "#FFFFFF50" },
            { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: "←", align: "center" },
        ]
    })
    initiator.setUIComponent({
        id: "chat_player_indicator",
        position: [22, 17, 45, 3],
        clickable: false,
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: `Chatting with: ${game.ships[fetchShip(targetID)].name}`, align: "left" }
        ]
    })
    renderKeyboard(initiator, game);
    if (fetchChat(initiator.id, targetID) !== -1) {
        renderMessages(initiator.id, targetID)
    } else {
        sessionMemory.chatChannels.push({
            parties: [initiator.id, targetID],
            messages: []
        })
    }
}

const fetchChat = (id1, id2) => sessionMemory.chatChannels.findIndex(el => el.parties !== undefined && el.parties.includes(id1) && el.parties.includes(id2))
const fetchShip = (id) => game.ships.findIndex(el => el.id === id)

const renderMessages = (id1, id2) => {
    let targets = [fetchShip(id1), fetchShip(id2)]
    const returnOtherTarget = (exc) => {
        for (let i of targets) { if (i !== targets[exc]) { return i } }
    }
    let chat = sessionMemory.chatChannels[fetchChat(id1, id2)]
    for (let i = 0; i < 2; i++) {
        targets = [fetchShip(id1), fetchShip(id2)]
        for (let j = 0; j < chat.messages.length; j++) {
            if (game.ships[targets[i]].chatTargetID == game.ships[returnOtherTarget(i)].id) {
                let messageType = Math.min(game.ships[targets[i]].id, game.ships[returnOtherTarget(i)].id) == game.ships[targets[i]].id ? chat.messages[j].sentBy == 0 ? "user" : "foreign" : chat.messages[j].sentBy == 1 ? "user" : "foreign"
                game.ships[targets[i]].setUIComponent({
                    id: `message_${j}`,
                    position: [22, 21 + (j * 6.66), 56, 5.2],
                    clickable: false,
                    visible: game.ships[targets[i]].chatOpen,
                    components: [
                        { type: "box", position: [0, 0, 100, 100], fill: messageType == "foreign" ? "#00FF0060" : "#0000FF60", stroke: "#FFFFFF50" },
                        { type: "text", position: [2, 2, 96, 96], color: "#FFF", value: chat.messages[j].message, align: messageType == "foreign" ? "left" : "right" },
                    ]
                })
            }
        }
    }
}

let notificationTimer = null
const notify = (ship) => {
    clearTimeout(notificationTimer)
    ship.setUIComponent({
        id: "new_message",
        position: [0, 90, 78, 5],
        clickable: false,
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], color: "#FF4F4F", value: "New message", align: "right" }
        ]
    })
    notificationTimer = setTimeout(() => {
        ship.setUIComponent({
            id: "new_message",
            position: [0, 90, 78, 5],
            clickable: false,
            visible: false,
            components: [
                { type: "text", position: [0, 0, 100, 100], color: "#FF4F4F", value: "New message", align: "right" }
            ]
        })
    }, 2500)
}

const renderDashboard = (ship, game) => {
    if (ship.chatOpen) { return }
    ship.dashboardOpen = true
    ship.setUIComponent({
        id: "chat_player_indicator",
        position: [21, 17, 46, 3],
        clickable: false,
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: `Dashboard`, align: "left" }
        ]
    })
    ship.setUIComponent({
        id: `global_channel`,
        position: [20, 20, 60, 5],
        clickable: true,
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], value: "Global Chat 🗪", color: "#FFF", align: "center" },
            { type: "box", position: [0, 0, 100, 100], fill: "#24242450" },
            { type: "box", position: [0, 99, 100, 1], fill: "#FFFFFF50" },
            { type: "box", position: [0, 0, 100, 1], fill: "#FFFFFF50" }
        ]
    })
    for (let i = 0, Y_OFFSET = 25; i < game.ships.length; i++) {
        if (game.ships[i].id === ship.id) { continue }
        ship.setUIComponent({
            id: `channel_${game.ships[i].id}`,
            position: [76, Y_OFFSET, 4, 5],
            clickable: true,
            visible: true,
            components: ship.recievedMessages.includes(game.ships[i].id) ? [
                { type: "round", position: [0, 0, 29, 35], fill: "#FF0000" },
                { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF50", stroke: "#FFFFFF50" },
                { type: "text", position: [5, 0, 90, 100], color: "#FFF", value: "🗪", align: "center" },
            ] : [
                { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF50", stroke: "#FFFFFF50" },
                { type: "text", position: [5, 0, 90, 100], color: "#FFF", value: "🗪", align: "center" },
            ]
        })
        ship.setUIComponent({
            id: `invite_${game.ships[i].id}`,
            position: [72, Y_OFFSET, 4, 5],
            clickable: true,
            visible: true,
            components: [
                { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF50", stroke: "#FFFFFF50" },
                { type: "text", position: [5, 0, 90, 100], color: "#FFF", value: "✉", align: "center" },
            ]
        })
        if (determineType(ship) == "admin") {
            ship.setUIComponent({
                id: `ban_${game.ships[i].id}`,
                position: [68, Y_OFFSET, 4, 2.5],
                clickable: true,
                visible: true,
                components: [
                    { type: "box", position: [0, 0, 100, 100], fill: "#FF000050", stroke: "#FF000050" },
                    { type: "text", position: [5, 0, 90, 100], color: "#FFF", value: "Ban", align: "center" },
                ]
            })
            ship.setUIComponent({
                id: `kick_${game.ships[i].id}`,
                position: [68, Y_OFFSET + 2.5, 4, 2.5],
                clickable: true,
                visible: true,
                components: [
                    { type: "box", position: [0, 0, 100, 100], fill: "#FF000050", stroke: "#FF000050" },
                    { type: "text", position: [5, 0, 90, 100], color: "#FFF", value: "Kick", align: "center" },
                ]
            })
        }
        ship.setUIComponent({
            id: `player_${game.ships[i].id}`,
            position: [20, Y_OFFSET, 60, 5],
            clickable: false,
            visible: true,
            components: [
                { type: "player", id: game.ships[i].id, position: [3, 0, 100, 100], color: "#FFF" },
                { type: "box", position: [0, 0, 100, 100], fill: "#24242450" },
                { type: "box", position: [0, 99, 100, 1], fill: "#FFFFFF50" },
                { type: "box", position: [0, 0, 100, 1], fill: "#FFFFFF50" }
            ]
        })
        Y_OFFSET += 5
    }
    ship.setUIComponent({
        id: "dashboard",
        position: [20, 20, 60, 65],
        clickable: false,
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#24242450" },
            { type: "box", position: [0, 99.5, 100, 0.5], fill: "#FFFFFF50" },
        ]
    })
    ship.setUIComponent({
        id: "closeDashboard",
        position: [76, 17, 4, 3],
        clickable: true,
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#FF000050", stroke: "#FFFFFF50" },
            { type: "text", position: [0, 0, 100, 100], color: "#FFF", value: "✖", align: "center" },
        ]
    })
    ship.setUIComponent({
        id: "navbar",
        position: [20, 17, 60, 3],
        clickable: false,
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 5], fill: "#FFFFFF50" },
            { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF20" },
            { type: "box", position: [0, 98, 100, 2], fill: "#FFFFFF50" },
        ]
    })
}

const closeDashboard = (ship, game) => {
    ship.dashboardOpen = false
    ship.chatOpen = false
    let elementsToClose = ['dashboard', 'typingSpace', 'sendMessage', 'key_space', 'key_backspace', 'closeDashboard', 'navbar', 'back_chat', 'global_channel', 'chat_player_indicator']
    for (let letter of staticMemory.layoutString.split('')) {
        elementsToClose.push(`key_${letter}`)
    }
    for (let ship of sessionMemory.rememberedIDs) {
        elementsToClose.push(`player_${ship}`)
        elementsToClose.push(`channel_${ship}`)
        elementsToClose.push(`invite_${ship}`)
        elementsToClose.push(`ban_${ship}`)
        elementsToClose.push(`kick_${ship}`)
    }
    for (let i = 0; i <= 6; i++) {
        elementsToClose.push(`message_${i}`)
        elementsToClose.push(`message_${i}_indicator`)
    }
    for (let component of elementsToClose) {
        ship.setUIComponent({
            id: component,
            visible: false
        })
    }
}

const closeChat = (ship, game) => {
    ship.chatOpen = false
    let elementsToClose = ['typingSpace', 'sendMessage', 'key_space', 'key_backspace', 'back_chat']
    for (let letter of staticMemory.layoutString.split('')) {
        elementsToClose.push(`key_${letter}`)
    }
    for (let i = 0; i <= 6; i++) {
        elementsToClose.push(`message_${i}`)
        elementsToClose.push(`message_${i}_indicator`)
    }
    for (let component of elementsToClose) {
        ship.setUIComponent({
            id: component,
            visible: false
        })
    }
    renderDashboard(ship, game)
}


const ADJUST_PANEL = {
    closingComponents: ["adjustPanel", "navbar", "closeAdjust"],
    currentClosingComponents: [],
    
    closePanel: function(ship) {
        for (let component of [...this.closingComponents, ...this.currentClosingComponents]) {
            ship.setUIComponent({id: component, visible: false})
        }
    },

    compileNewStats: function(ship, componentID) {
        let currentStats = String(ship.stats).split('');
        if (currentStats.length !== 8) {
            while (currentStats.length !== 8) {
                currentStats.unshift(0);
            }
        }
        currentStats[String(Number(componentID.split("_")[1]) - 1)] = componentID.split("_")[2]; // do NOT ask me what the fuck im doing
        ship.set({stats: Number(currentStats.join(""))});
        
        // Below is update renderer - this.renderPanel is not used because of tick quirks
        // Actually scratch that

        setTimeout(() => {
            this.renderPanel(ship);
        }, 20)
    },

    renderPanel: function(ship) {
        try {

            let upgradesAvailable = Number(String(ship.type).charAt(0));
    
            let currentUpgrades = {};
    
            let stats = String(ship.stats).split('')

            while (stats.length !== 8) {
                stats.unshift("0");
            }

            for (let i in stats) {
                currentUpgrades[String(Number(i) + 1)] = stats[i];
            }
    
            ship.setUIComponent({
                id: "adjustPanel",
                position: [20, 20, 60, 60],
                clickable: false,
                visible: true,
                components: [
                    { type: "box", position: [0, 0, 100, 100], fill: "#24242450" },
                    { type: "box", position: [0, 99.5, 100, 0.5], fill: "#FFFFFF50" },
                    { type: "box", position: [0, 0, 100, 0.5], fill: "#FFFFFF50" }
                ]
            })
            ship.setUIComponent({
                id: "navbar",
                position: [20, 17, 60, 3],
                clickable: false,
                visible: true,
                components: [
                    { type: "text", position: [2, 0, 100, 100], color: "#FFFFFF", align: 'left', value: 'Adjust upgrades' },
                    { type: "box", position: [0, 0, 100, 5], fill: "#FFFFFF50" },
                    { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF20" },
                    { type: "box", position: [0, 98, 100, 2], fill: "#FFFFFF50" },
                ]
            })
            ship.setUIComponent({
                id: "closeAdjust",
                position: [76, 17, 4, 3],
                clickable: true,
                visible: true,
                components: [
                    {type: "box", position: [0, 0, 100 ,100], fill: "#FF000050"},
                    {type: "text", position: [0,10,100,90], color: "#FFF", value: "✖"}
                ]
            })
            
            this.currentClosingComponents = [];
    
            let keys = Object.keys(currentUpgrades);

            const UPGRADES = {
                "1": {name: "Capacity", color: "#00FFFF"},
                "2": {name: "Regen", color: "#00FFFF"},
                "3": {name: "Capacity", color: "#FFFF00"},
                "4": {name: "Regen", color: "#FFFF00"},
                "5": {name: "Damage", color: "#FB9902"},
                "6": {name: "Speed", color: "#FB9902"},
                "7": {name: "Speed", color: "#FF0000"},
                "8": {name: "Agility", color: "#FF0000"},
            }

            for (let i in keys) {
                for (let j = upgradesAvailable, TIER_BASED_Y_OFFSET = (7 - upgradesAvailable) * 5.5 + (7 - upgradesAvailable) * 2, X_OFFSET = i * 5.5 + i * 2; j >= 0; j--) {
                    let Y_OFFSET = (upgradesAvailable - j) * 5.5 + (upgradesAvailable - j) * 2;
                    this.currentClosingComponents.push(`adjust_${keys[i]}_${j}`)
                    if (j !== 0) {
                        ship.setUIComponent({
                            id: `adjust_${keys[i]}_${j}`,
                            position: [21 + X_OFFSET, 21 + Y_OFFSET + TIER_BASED_Y_OFFSET, 5.5, 5.5],
                            visible: true,
                            clickable: true,
                            components: [
                                { type: "box", position: [0, 0, 100, 100], fill: UPGRADES[keys[i]].color + (Number(currentUpgrades[keys[i]]) >= j ? "90" : "35") }
                            ] 
                        }) 
                    } else {
                        ship.setUIComponent({
                            id: `adjust_${keys[i]}_${j}`,
                            position: [21 + X_OFFSET, 21 + Y_OFFSET + TIER_BASED_Y_OFFSET, 5.5, 5.5],
                            visible: true,
                            clickable: true,
                            components: [
                                { type: "box", position: [0, 0, 100, 100], fill: UPGRADES[keys[i]].color + "90", width: 3, stroke: UPGRADES[keys[i]].color},
                                { type: "text", position: [10, 10, 80, 80], color: UPGRADES[keys[i]].color, value: UPGRADES[keys[i]].name}
                            ] 
                        }) 
                    }
                }
            }
        } catch (ex) {
            statusMessage("error", "Error adjusting stats: " + ex);
            console.error(ex);
        }

        // Space - [21, 21, 58, 58] - 
    }
}

const SHIP_TREE_PANEL = {
    closingComponents: ["shipTree", "navbar", "closeShipTree"],
    currentClosingComponents: [],
    
    closeShipTree: function(ship) {
        for (let component of [...this.closingComponents, ...this.currentClosingComponents]) {
            ship.setUIComponent({id: component, visible: false})
        }
    },

    renderShipTree: function(ship) {
        const START_X = 20, WIDTH = 50;
        let selectedTree = "vanilla";
        
        ship.setUIComponent({
            id: "shipTree",
            position: [START_X, 20, 60, 60],
            clickable: false,
            visible: true,
            components: [
                { type: "box", position: [0, 0, 100, 100], fill: "#24242450" },
                { type: "box", position: [0, 99.5, 100, 0.5], fill: "#FFFFFF50" },
                { type: "box", position: [0, 0, 100, 0.5], fill: "#FFFFFF50" }
            ]
        })
        ship.setUIComponent({
            id: "navbar",
            position: [START_X, 17, 60, 3],
            clickable: false,
            visible: true,
            components: [
                { type: "text", position: [2, 0, 100, 100], color: "#FFFFFF", align: 'left', value: 'Ship selection' },
                { type: "box", position: [0, 0, 100, 5], fill: "#FFFFFF50" },
                { type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF20" },
                { type: "box", position: [0, 98, 100, 2], fill: "#FFFFFF50" },
            ]
        })
        ship.setUIComponent({
            id: "closeShipTree",
            position: [76, 17, 4, 3],
            clickable: true,
            visible: true,
            components: [
                {type: "box", position: [0, 0, 100 ,100], fill: "#FF000050"},
                {type: "text", position: [0,10,100,90], color: "#FFF", value: "✖"}
            ]
        })
        // Ships space - [21, 21, 58, 58] - Total width and height: 58%
        // Width and height gap 2% - 8 elements of width 5.5% and height 6.2% for tier 6, less elements but same dimensions for other tiers
        this.currentClosingComponents = [];

        let keys = Object.keys(SHIP_SELECTION[selectedTree]);
        try {
            for (let i = 0, tier = keys[0]; i < keys.length; i++) {
                tier = keys[i];
                let selectedTier = SHIP_SELECTION[selectedTree][tier];
                for (let j = 0, 
                    OFFSET_X = 21 + ~~((58 - (5.5 * selectedTier.length + (2 * selectedTier.length - 1))) / 2),
                    OFFSET_Y = keys.indexOf(tier) * 6.2 + keys.indexOf(tier) * 2;
                    j < selectedTier.length;
                    j++) {
                        ship.setUIComponent({
                            id: `selectShip_${selectedTier[j][0]}`,
                            position: [OFFSET_X + (j * 5.5 + (j * 2)), 21 + OFFSET_Y, 5.5, 6.2],
                            visible: true,
                            clickable: true,
                            components: [
                                {type: "box", position: [0, 0, 100, 100], fill: "#FFFFFF00", stroke: "#FFFFFF90", width: 2},
                                {type: "box", position: [5, 8, 90, 84], fill: "#FFFFFF20", stroke: "#FFFFFF60", width: 2},
                                {type: "text",position: [7, 10, 86, 80], color: "#FFF", align: "center", value: selectedTier[j][1]}
                            ]
                        })
                        this.currentClosingComponents.push(`selectShip_${selectedTier[j][0]}`)
                }
            }
        } catch (ex) {
            statusMessage("error", "Error rendering ships: " + ex)
        }
    }
}


const renderExpandedMenu = (ship, type) => {
    ship.isUIExpanded = true
    switch (type) {
        case "admin":
        case "regular":
            const BACKGROUND_WIDTH = 50
            const BUTTONS = [
                { label: "Select Ship", id: "showShipTree" },
                { label: type == "admin" ? "Admin Dashboard" : "Dashboard", id: "showDashboard" },
                { label: "Adjust stats", id: "openAdjust" },
                { label: "More soon..", id: "fffff" },
            ]
            staticMemory.retractableComponentIDs = [...staticMemory.retractableComponentIDs, ...BUTTONS.map(item => item.id)]
            for (let i = 0,
                REF_WIDTH = BACKGROUND_WIDTH - BUTTONS.length,
                X_OFFSET = (100 - BACKGROUND_WIDTH) / 2 + .5,
                BUTTON_WIDTH = REF_WIDTH / BUTTONS.length;
                i < BUTTONS.length;
                i++,
                X_OFFSET += BUTTON_WIDTH + 1) {
                ship.setUIComponent({
                    id: BUTTONS[i].id,
                    position: [X_OFFSET, 1, BUTTON_WIDTH, 6],
                    clickable: true,
                    visible: true,
                    components: [
                        { type: "box", position: [0, 0, 100, 100], fill: "#24242450", stroke: "#FFFFFF50", width: 3 },
                        { type: "text", position: [5, 0, 90, 100], color: "#FFF", value: BUTTONS[i].label, align: "center" },
                    ]
                })
            }
            ship.setUIComponent({
                id: "mainControlsBackground",
                position: [25, 0, BACKGROUND_WIDTH, 8],
                clickable: false,
                visible: true,
                components: [
                    { type: "box", position: [0, 0, 100, 100], fill: "#24242450" },
                    { type: "box", position: [0, 98, 100, 2], fill: "#FFFFFF50" }
                ]
            })
            ship.setUIComponent({
                id: "expandButton",
                position: [71, 8.5, 4, 4],
                clickable: true,
                shortcut: "X",
                visible: true,
                components: [
                    { type: "box", position: [0, 0, 100, 100], fill: "#24242450", stroke: "#FFFFFF50", width: 3 },
                    { type: "text", position: [0, 15, 100, 70], color: "#FFF", value: "↑" },
                ]
            })
            break
    }

}

const renderRetractedMenu = (ship) => {
    ship.isUIExpanded = false
    for (let id of staticMemory.retractableComponentIDs) {
        ship.setUIComponent({ id, visible: false })
    }
    ship.setUIComponent({
        id: "expandButton",
        position: [71, 1, 4, 4],
        clickable: true,
        shortcut: "X",
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "#24242450", stroke: "#FFFFFF50", width: 3 },
            { type: "text", position: [0, 15, 100, 70], color: "#FFF", value: "↓" },
        ]
    })
}