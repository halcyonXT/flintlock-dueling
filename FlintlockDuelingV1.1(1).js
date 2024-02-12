/**
 *                                        Flintlock  dueling
 *                                         A mod by Nanoray
 * 
 *                                  Contact on Discord - h.alcyon
 */


let staticMemory = {
    banSwearWords: false, // * Change to true if you want to ban swear words - may have a small impact on performance. The censor algorithm is still in a BETA version
    alwaysPickUpGems: true, // * Changeable - example: If you have 720 gems as a-speedster it will go down to 719

    // * Since low ELO players gain more from winning against high elo players, and vice versa -
    // * This variable determines the maximum ELO one can gain/lose from a single battle 
    MAX_WIN_LOSS_THRESHOLD: 75,

    // * K factor based in which ELO is calculated. Recommended not to change
    ELO_K_FACTOR: 64,

    
    // ! Experimental mode
    // * Mode description:
    // *             - Other player stats will be invisible (how much shield/gems they have remaining) during duel
    // *             - Dropped gems will be invisible
    // *             - Lasers fired will be invisible
    _ultraDarkMode: false, 

    // * If you want players to ONLY be able to select a certain ship, set this to that ships code
    // * e.g. if you want players to only use a-speedster, set it to 605
    requireShip: null, 

    // * Defined in number of ticks
    // * Throttles the amount of times an individual player can call `ui_component_clicked` (therefore less lag)
    // ! To disable rate limiting, replace this number with 0
    _CLICK_RATE_LIMIT: 15,

    afkChecker: {
        // * True = will check for AFK people
        active: true,

        // * Change the first number to reflect how many seconds until a player is pronounced AFK
        delay: 20 * 60 
    },

    bruteforceBan_minimumSimilarity: 75, // * FOR EXPERIENCED USERS ONLY - How similar a name needs to be to be affected by bruteforceBan, in percents (e.g. 75 === 75%)



    // ! BELOW ARE PROPERTIES THAT YOU SHOULD NOT CHANGE
    retractableComponentIDs: ["mainControlsBackground"],
    layout: ['qwertyuiop'.split(''), 'asdfghjkl'.split(''), 'zxcvbnm'.split('')],
    layoutString: 'qwertyuiopasdfghjklzxcvbnm',

    GEM_CAPS: {
        1: 20,
        2: 80,
        3: 180,
        4: 320,
        5: 500,
        6: 720,
        7: 980
    }
}

// ! SHOULD NOT BE CHANGED
let sessionMemory = {
    rememberedIDs: [],
    admins: [],
    chatChannels: [
        {
            parties: ["global"],
            messages: []
        }
    ],
    banned: [],
    bruteforceBanned: [],
    forceIdle: []
}

const SHIPS = {
    "vanilla": {
        101: { name: "Fly", code: `` },
        191: {
            name: "Spectating",
            code: '{"name":"Spectator","level":1.9,"model":1,"size":0.025,"zoom":0.075,"specs":{"shield":{"capacity":[1e-30,1e-30],"reload":[1000,1000]},"generator":{"capacity":[1e-30,1e-30],"reload":[1,1]},"ship":{"mass":1,"speed":[200,200],"rotation":[1000,1000],"acceleration":[1000,1000]}},"bodies":{"face":{"section_segments":100,"angle":0,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-2,-2,2,2],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,1,1,0],"height":[0,1,1,0],"vertical":true,"texture":[6]}},"typespec":{"name":"Spectator","level":1,"model":1,"code":101,"specs":{"shield":{"capacity":[1e-30,1e-30],"reload":[1000,1000]},"generator":{"capacity":[1e-30,1e-30],"reload":[1,1]},"ship":{"mass":1,"speed":[200,200],"rotation":[1000,1000],"acceleration":[1000,1000]}},"shape":[0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001,0.001],"lasers":[],"radius":0.001}}'
        },
        201: { name: "Delta-Fighter", code: `` },
        202: { name: "Trident", code: `` },
        301: { name: "Pulse-Fighter", code: `` },
        302: { name: "Side-Fighter", code: `` },
        303: { name: "Shadow X-1", code: `` },
        304: { name: "Y-Defender", code: `` },
        401: { name: "Vanguard", code: `` },
        402: { name: "Mercury", code: `` },
        403: { name: "X-Warior", code: `` },
        404: { name: "Side-interceptor", code: `` },
        405: { name: "Pioneer", code: `` },
        406: { name: "Crusader", code: `` },
        501: { name: "U-Sniper", code: `` },
        502: { name: "FuryStar", code: `` },
        503: { name: "T-Warrior", code: `` },
        504: { name: "Aetos", code: `` },
        505: { name: "Shadow X-2", code: `` },
        506: { name: "Howler", code: `` },
        507: { name: "Bat-Defender", code: `` },
        601: { name: "Advanced-Fighter", code: `` },
        602: { name: "Scorpion", code: `` },
        603: { name: "Marauder", code: `` },
        604: { name: "Condor", code: `` },
        605: { name: "A-Speedster", code: `` },
        606: { name: "Rock-Tower", code: `` },
        607: {
            name: "O-Defender",
            code: '{"name":"O-Defender","level":6,"model":7,"size":2.2,"specs":{"shield":{"capacity":[400,550],"reload":[10,13]},"generator":{"capacity":[70,100],"reload":[25,40]},"ship":{"mass":500,"speed":[70,80],"rotation":[30,40],"acceleration":[60,80]}},"bodies":{"main":{"section_segments":8,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0],"y":[-90,-88,0,90,91],"z":[0,0,0,0,0]},"width":[5,6,25,10,20],"height":[2,10,40,20,20],"texture":[63,1,10],"propeller":true,"laser":{"damage":[35,60],"rate":2,"type":2,"speed":[130,180],"number":1,"angle":0,"error":0}},"side":{"section_segments":10,"offset":{"x":50,"y":0,"z":0},"position":{"x":[-40,-5,15,25,20,0,-50],"y":[-100,-70,-40,-10,20,50,90],"z":[0,0,0,0,0,0,0]},"width":[5,20,20,20,20,20,5],"height":[15,25,30,30,30,25,0],"texture":[0,1,2,3,4,63]},"cockpit":{"section_segments":8,"offset":{"x":0,"y":-60,"z":18},"position":{"x":[0,0,0,0,0,0,0],"y":[-10,0,20,30,40],"z":[0,0,0,0,0]},"width":[0,5,10,10,0],"height":[0,5,10,12,0],"texture":[9]},"top_propulsor":{"section_segments":15,"offset":{"x":0,"y":0,"z":10},"position":{"x":[0,0,0,0],"y":[80,95,100,90],"z":[0,0,0,0]},"width":[5,20,10,0],"height":[5,15,5,0],"propeller":true,"texture":[1,63,12]},"bottom_propulsor":{"section_segments":15,"offset":{"x":0,"y":0,"z":-10},"position":{"x":[0,0,0,0],"y":[80,95,100,90],"z":[0,0,0,0]},"width":[5,20,10,0],"height":[5,15,5,0],"propeller":true,"texture":[1,63,12]}},"wings":{"join":{"offset":{"x":0,"y":20,"z":0},"length":[80,0],"width":[130,50],"angle":[-1],"position":[0,-30],"texture":[8],"bump":{"position":-20,"size":15}}},"typespec":{"name":"O-Defender","level":6,"model":8,"code":608,"specs":{"shield":{"capacity":[400,550],"reload":[10,13]},"generator":{"capacity":[70,100],"reload":[25,40]},"ship":{"mass":500,"speed":[70,80],"rotation":[30,40],"acceleration":[60,80]}},"shape":[4.409,4.448,4.372,4.204,4.119,4.136,4.174,4.107,4.066,4.094,4.073,4.141,4.16,4.062,4.015,3.966,3.83,3.76,3.742,3.591,3.502,3.494,3.575,4.291,4.422,4.409,4.422,4.291,3.575,3.494,3.502,3.591,3.742,3.76,3.83,3.966,4.015,4.062,4.16,4.141,4.073,4.094,4.066,4.107,4.174,4.136,4.119,4.204,4.372,4.448],"lasers":[{"x":0,"y":-3.96,"z":0,"angle":0,"damage":[35,60],"rate":2,"type":2,"speed":[130,180],"number":1,"spread":0,"error":0,"recoil":0}],"radius":4.448}}'
        },
        701: { name: "Odyssey", code: `` },
        702: { name: "Shadow X-3", code: `` },
        703: { name: "Bastion", code: `` },
        704: { name: "Aries", code: `` },
    }
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

const VOCABULARY = [
    // 1
    {text: "You", icon: "\u004e", key: "O"},
    {text: "Me", icon: "\u004f", key: "E"},
    {text: "Wait", icon: "\u0048", key: "T"},
    {text: "Yes", icon: "\u004c", key: "Y"},
    // 2
    {text: "No", icon: "\u004d", key: "N"},
    {text: "Hello", icon: "\u0045", key: "H"},
    {text: "Sorry", icon: "\u00a1", key: "S"},
    {text: "My ship", icon: "\u0061", key: "M"},
    // 3
    {text: "Attack", icon: "\u0049", key: "A"},
    {text: "Follow Me", icon: "\u0050", key: "F"},
    {text: "Good Game", icon: "\u00a3", key: "G"},
    {text: "Leave", icon: "\u00b3", key: "L"},
    // 4
    {text: "Stats", icon: "\u0078", key: "K"},
    {text: "Hmm", icon: "\u004b", key: "Q"},
    {text: "Lucky", icon: "\u2618", key: "U"},
    {text: "Ping", icon: "\u231b", key: "P"},
    // 5
    {text: "Discord", icon: "\u007b", key: "D"},
    {text: "Idiot", icon: "\u0079", key: "I"},
    {text: "Lag", icon: "\u0069", key: "J"},
    {text: "Spectate", icon: "\u0059", key: "W"}
    // Infinity
]

const VERSION = "1.1"

this.options = {
    ships: Object.values(SHIPS["vanilla"]).flatMap(a => a.code),
    map_name: "",
    max_players: 12,
    starting_ship: 801,
    map_size: 100,
    speed_mod: 1.2,
    max_level: 1,
    weapons_store: false,
    vocabulary: VOCABULARY,
    soundtrack: "warp_drive.mp3",
    custom_map: "",
    map_name: "Flintlock dueling",
};



let SWEAR_WORD_LIST = [];

// ! S1
const statusMessage = (status, message) => {
    try {
        let str = ""
        switch (status) {
            case "err":
            case "error":
                str = str + "[[b;#FF0000;]｢ERROR｣ "
                break
            case "suc":
            case "success":
                str = str + "[[b;#00FF00;]｢SUCCESS｣ "
                break
            case "warn":
                str = str + "[[b;#FFFF00;]｢WARN｣ "
                break
            default:
                str = str + "[[b;#007bff;]｢INFO｣ "
                break
        }
        game.modding.terminal.echo(" ");
        echo(str + "[[;#FFFFFF;]" + message);
        game.modding.terminal.echo(" ");
    } catch (ex) {
        console.warn(ex)
    }
}

// ! ONLY RUNS ONCE
const renderSpectateRegen = (ship) => {
    let Y_OFFSET = 1;
    const Y_ADDITION = 3.5;
    const HEIGHT = 2.5;
    const BUTTON_WIDTH = 1.5;
    const MULT = 1;
    const RIGHT_SHIFT = 2;
    const Y_TEXT_OFFSET = 0.15;

    ship.setUIComponent({
        id: "spectate",
        position: [76 + RIGHT_SHIFT, Y_OFFSET, BUTTON_WIDTH, HEIGHT],
        clickable: true,
        shortcut: "1",
        visible: true,
        components: [
            {type: "box", position: [0, 0, 100, 100], fill: "hsla(180, 40%, 75%, 0.25)", stroke: "hsla(180, 40%, 75%, 1)", width: 2},
            {type: "text", position: [0, 0, 100, 100], align: "center", value: "1", color: "hsla(180, 40%, 75%, 1)"},
        ]
    })
    ship.setUIComponent({
        id: "spectate_text",
        position: [65.5 + RIGHT_SHIFT, Y_OFFSET + Y_TEXT_OFFSET, 10, HEIGHT * MULT],
        clickable: false,
        visible: true,
        components: [
            {type: "text", position: [0, 0, 100, 100], align: "right", value: "Spectate", color: "hsla(180, 40%, 75%, 1)"},
        ]
    })

    Y_OFFSET += Y_ADDITION;

    ship.setUIComponent({
        id: "regen_text",
        position: [65.5 + RIGHT_SHIFT, Y_OFFSET + Y_TEXT_OFFSET, 10, HEIGHT * MULT],
        clickable: false,
        visible: true,
        components: [
            {type: "text", position: [0, 0, 100, 100], align: "right", value: "Regen", color: "hsla(3, 100%, 69%, 1.00)"},
        ]
    })
    ship.setUIComponent({
        id: "regen",
        position: [76 + RIGHT_SHIFT, Y_OFFSET, BUTTON_WIDTH, HEIGHT],
        clickable: true,
        shortcut: "2",
        visible: true,
        components: [
            {type: "box", position: [0, 0, 100, 100], fill: "hsla(3, 100%, 69%, 0.25)", stroke: "hsla(3, 100%, 69%, 1.00)", width: 2},
            {type: "text", position: [0, 0, 100, 100], align: "center", value: "2", color: "hsla(3, 100%, 69%, 1.00)"},
        ]
    })

    Y_OFFSET += Y_ADDITION;

    ship.setUIComponent({
        id: "teleport_text",
        position: [65.5 + RIGHT_SHIFT, Y_OFFSET + Y_TEXT_OFFSET, 10, HEIGHT * MULT],
        clickable: false,
        visible: true,
        components: [
            {type: "text", position: [0, 0, 100, 100], align: "right", value: "Teleport to next", color: "hsla(57, 100%, 81%, 1.00)"},
        ]
    })
    ship.setUIComponent({
        id: "teleport",
        position: [76 + RIGHT_SHIFT, Y_OFFSET, BUTTON_WIDTH, HEIGHT],
        clickable: true,
        shortcut: "3",
        visible: true,
        components: [
            {type: "box", position: [0, 0, 100, 100], fill: "hsla(57, 100%, 81%, 0.25)", stroke: "hsla(57, 100%, 81%, 1.00)", width: 2},
            {type: "text", position: [0, 0, 100, 100], align: "center", value: "3", color: "hsla(57, 100%, 81%, 1.00)"},
        ]
    })
}

const turnToSpectator = (ship) => {
    ship.spectating = {
        value: true,
        lastShip: String(ship.type) === "191" ? ship.spectating.lastShip : String(ship.type)
    }
    ship.set({type: 191, collider: false, crystals: 0});
}

// ! S2
if (staticMemory.banSwearWords) {
    (async () => {
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
} else {
    statusMessage("if", "Swear words are not censored")
}

const ECHO_SPAN = 105;
let echoed = false;

const NULL_COMPONENT = {
    position: [0,0,0,0],
    visible: false,
    shortcut: null,
    components: []
};

const shipByID = (id) => game.ships.find(obj => obj.id == id);

const newLine = () => game.modding.terminal.echo(" ");
const debugEcho = (msg) => game.modding.terminal.echo(JSON.stringify(msg));
const centeredEcho = (msg, color = "") => game.modding.terminal.echo(`${" ".repeat(~~((ECHO_SPAN / 2) - Array.from(msg).length / 2))}${color}${msg}`)
const anchoredEcho = (msgLeft, msgRight, color = "", anchor) => game.modding.terminal.echo(color + `${" ".repeat(~~((ECHO_SPAN / 2) - (anchor.length / 2)) - Array.from(msgLeft).length)}${msgLeft}${anchor}${msgRight}`, " ")
const commandEcho = (command, description, example, color) => game.modding.terminal.echo(color + command + `[[;#FFFFFF30;]${" ".repeat(~~(((ECHO_SPAN / 2) - command.length) - (description.length / 2)))}` + color + description + `[[;#FFFFFF30;]${" ".repeat(Math.ceil(((ECHO_SPAN / 2) - example.length) - (description.length / 2)))}` + color + example)

;(function setCenterObject() {
    game.setObject({
        id: "centerImage",
        type: {
            id: "centerImage",
            obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
            emissive: "https://raw.githubusercontent.com/halcyonXT/project-storage/main/PNG.png"
        },
        position: { x: -1, y: 0, z: -15 },
        scale: { x: 95, y: 52, z: 0 },
        rotation: { x: Math.PI, y: 0, z: 0 }
    });
})();

;(function setBlackBackground() {
    if (staticMemory._ultraDarkMode) {
        game.setObject({
            id: "blackBackground",
            type: {
                id: "blackBackground",
                obj: "https://starblast.data.neuronality.com/mods/objects/plane.obj",
                emissive: "https://raw.githubusercontent.com/halcyonXT/project-storage/main/bcgr.png"
            },
            position: { x: -1, y: -10, z: -20 },
            scale: { x: 9999, y: 9999, z: 0 },
            rotation: { x: 0, y: 0, z: 0 }
        });
    }
})();

kick = (id, shouldReport = true) => {
    let ship = shipByID(id);
    if (!ship) {
        return statusMessage("error", "No ship with the specified ID")
    }
    if (shouldReport) {
        statusMessage("success", `${ship.name} has been kicked`);
    }
    kickPlayer(ship);
}

ban = (id) => {
    let ship = shipByID(id);
    if (!ship) {
        return statusMessage("error", "No ship with the specified ID")
    }
    sessionMemory.banned.push(ship.name);
    statusMessage("success", `${ship.name} has been banned`)
    kickPlayer(ship);
}

bannedList = () => {
    centeredEcho("Banned list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Index", "[[b;#5FFFFF;]", "|")
    for (let player in sessionMemory.banned) {
        anchoredEcho(`${sessionMemory.banned[player]} `, ` ${player}`, "[[;#FFFFFF;]", "|")
    }
    for (let player in sessionMemory.bruteforceBanned) {
        anchoredEcho(`${sessionMemory.bruteforceBanned[player]} `, ` 99${player}`, "[[;#FF0000;]", "|")
    }
    echo("[[;#FFFFFF;]Index changes every time you unban someone. If you want to unban multiple people, it's recommended to run this function after every unban")
    newLine();
}

unban = (ind) => {
    let isBrute = false, sind = null;
    if (ind < 0 || ind >= sessionMemory.banned.length) {
        let bfind = Number((String(ind)).slice(2));
        if (!sessionMemory.bruteforceBanned[bfind]) {
            return statusMessage("error", "Invalid index provided. Do bannedList() to find out indexes.")
        }
        isBrute = true;
        sind = bfind;
    }
    if (isBrute) {
        statusMessage("success", `${sessionMemory.bruteforceBanned[sind]} is no longer bruteforce banned`);
        sessionMemory.bruteforceBanned = removeIndexFromArray(sessionMemory.bruteforceBanned, sind);
    } else {
        statusMessage("success", `${sessionMemory.banned[ind]} is no longer banned`);
        sessionMemory.banned = removeIndexFromArray(sessionMemory.banned, ind);
    }
}

bruteforceBan = (id) => {
    let ship = shipByID(id);
    if (!ship) {
        return statusMessage("error", "No ship with the specified ID")
    }
    sessionMemory.bruteforceBanned.push(ship.name);
    statusMessage("warn", `${ship.name} has been bruteforce banned. To revert this action, use the unban command`);
    let copy = {...ship};
    kickPlayer(ship);
    for (let sh of game.ships) {
        let lsim = levenshteinSimilarity(copy.name, sh.name);
        if (lsim >= staticMemory.bruteforceBan_minimumSimilarity) {
            statusMessage("warn", `${sh.name} has been kicked: Levenshtein similarity ${lsim} - Maximum ${staticMemory.bruteforceBan_minimumSimilarity}`);
            kickPlayer(sh);
        }
    }
}

resetMinBruteforceSim = (num) => {
    if (!num || typeof num !== "number" || num < 10 || num > 100) {
        return statusMessage("error", "Invalid input. Must be a number from 10 to 100");
    }
    staticMemory.bruteforceBan_minimumSimilarity = num;
    statusMessage("success", "Bruteforce ban will now require " + num + "% similarity to kick");
}

help = () => {
    newLine();
    centeredEcho("Command list:", "[[ub;#FF4f4f;]");
    commandEcho("Command", "Description", "Example usage", "[[b;#5FFFFF;]")
    centeredEcho("General", "[[u;#808080;]");
    commandEcho("help()", "Prints the list of commands", "help()", "[[;#FFFFFF;]")
    commandEcho("chelp(command)", "Extended description for a specific command", "chelp(adminList)", "[[;#FFFFFF;]");
    commandEcho("showIDs()", "Prints a list with the IDs and names of all players", "showIDs()", "[[;#FFFFFF;]")
    commandEcho("showShipIDs()", "Prints a list with the IDs and names of all ships", "showShipIDs()", "[[;#FFFFFF;]");
    commandEcho("bannedList()", "Shows a list of banned player names and INDEXES", "bannedList()", "[[;#FFFFFF;]");
    newLine();
    centeredEcho("Administrative", "[[u;#808080;]");
    commandEcho("adminList()", "Prints the list of admins", "adminList()", "[[;#FFFFFF;]");
    commandEcho("giveAdmin(id)", "Gives player with the specified ID admin privileges", "giveAdmin(4)", "[[;#FFFFFF;]");
    commandEcho("removeAdmin(id)", "Removes admin privileges from player with specified ID", "removeAdmin(4)", "[[;#FFFFFF;]");
    commandEcho("requireShip(shipID)", "Makes the selected ship mandatory for all players", "requireShip(605)", "[[;#FFFFFF;]");
    commandEcho("unrequireShip()", "Removes the required ship", "requireShip()", "[[;#FFFFFF;]");
    commandEcho("ban(id)", "Bans player with the specified ID", "ban(4)", "[[;#FFFFFF;]");
    commandEcho("unban(index)", "Unbans player with the specified INDEX", "unban(0)", "[[;#FFFFFF;]");
    commandEcho("kick(id)", "Kicks player with the specified ID", "kick(4)", "[[;#FFFFFF;]");
    newLine();
    centeredEcho("Dangerous administrative", "[[gu;#CC0000;]");
    commandEcho("bruteforceBan(id)", "Recommended to do chelp(bruteforceBan) before using", "bruteforceBan(4)", "[[;#FFFFFF;]");
    commandEcho("resetMinBruteforceSim(num)", "Reset minimal similarity for bruteforce kick", "resetMinBruteforceSim(50)", "[[;#FFFFFF;]");
    newLine();
}

chelp = (funct) => {
    if (typeof funct !== "function") {
        return statusMessage("error", "Invalid argument. " + String(funct) + " is not a command.")
    }
    newLine()
    switch (funct.name) {
        case "kick":
            commandEcho("kick(id)", "Kicks player with the specified ID", "kick(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Kicks the player with the specified ID.");
            echo("[[;#FFFFFF;] The player will be able to rejoin with the same name afterwards.");
            break
        case "bruteforceBan":
            commandEcho("bruteforceBan(id)", "Recommended to do chelp(bruteforceBan) before using", "bruteforceBan(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Recursively kicks every player and newcomer with a name similar to that of the player with the specified ID");
            echo("[[;#FFFFFF;] Similarity is calculated using the Levenshtein distance similarity algorithm. More on Levenshtein distance:");
            echo("[[ib!;#FFFFFF;] https://en.wikipedia.org/wiki/Levenshtein_distance");
            newLine();
            echo("[[;#FFFFFF;] minimumSimilarity - Minimal similarity of names required to kick a player - Default is 75%");
            echo("[[;#FFFFFF;] To reset minimumSimilarity, use resetMinBruteforceSim(num)");
            newLine();
            echo("[[;#FFFFFF;] Example of bruteforceBan functionality:");
            echo("[[;#FFFFFF;] Assume there are players 'HALO', 'ICEMAN1' and 'ICEMAN2' on a server");
            echo("[[;#FFFFFF;] Running bruteforceBan(2) on 'ICEMAN1' will give the following result:");
            echo("[[;#FFFFFF;]       - 'ICEMAN1' is kicked");
            echo("[[;#FFFFFF;]       - 'ICEMAN2' is kicked because they have a name similarity of 85.7%");
            echo("[[;#FFFFFF;]       - If someone named 'ICEMAN33' joins, the will be kicked because they have a similarity of 75%");
            newLine();
            echo("[[;#FFFFFF;] bruteforceBan can have unwanted effects, take this example:");
            echo("[[;#FFFFFF;] Assume the minimum similarity is 66%");
            echo("[[;#FFFFFF;] There is a player named 'ICEMAN' who likes to troll and multitab, and a good friend of yours named 'CINEMA'");
            echo("[[;#FFFFFF;] Assume the player list is 'HALO', 'ICEMAN1', 'ICEMAN2', 'ICEMAN33' and 'CINEMA'");
            echo("[[;#FFFFFF;] Running bruteforceBan(2) on 'ICEMAN1' will give the following result:");
            echo("[[;#FFFFFF;]       - 'ICEMAN1' is kicked");
            echo("[[;#FFFFFF;]       - 'ICEMAN2' is kicked");
            echo("[[;#FFFFFF;]       - 'ICEMAN33' is kicked");
            echo("[[;#FFFFFF;]       - Your good friend 'CINEMA' is kicked as well because they have a similarity above 66%");
            echo("[[;#FFFFFF;]       - Your good friend 'NICEMAN' joins the server, but is kicked due to having a similarity above 66%");
            newLine();
            echo("[[;#FFFFFF;] Think carefully before running this command");
            break
        case "ban":
            commandEcho("ban(id)", "Bans player with the specified ID", "ban(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Using the ID parameter gotten from showIDs(), bans the player with the specified ID.");
            echo(`[[;#FFFFFF;] For example, if you banned a player with the name of 'HALO', this is how it would go:`);
            echo("[[;#FFFFFF;]       - Kicks the player");
            echo("[[;#FFFFFF;]       - Every time someone named 'HALO' joins, they are immediately kicked");
            newLine();
            echo("[[;#FFFFFF;] Banning in starblast modding is not very effective, as they can just rejoin with a name like 'HALO1' to not be kicked");
            echo("[[;#FFFFFF;] Banning in starblast modding is not very effective, as they can just rejoin with a name like 'HALO1' to not be kicked");
            break
        case "adminList":
            commandEcho("adminList()", "Prints the list of admins", "adminList()", "[[;#FFFFFF;]");
            newLine()
            echo("[[;#FFFFFF;] Prints a list of players given admin permissions using the giveAdmin(id) command.");
            echo("[[;#FFFFFF;] All shown players are able to kick and ban other players.");
            echo("[[;#FFFFFF;] To remove admin permissions from any of these players, use removeAdmin(id).");
            break
        case "chelp":
            commandEcho("chelp(command)", "Extended description for a specific command", "chelp(adminList)", "[[;#FFFFFF;]");
            newLine()
            echo("[[;#FFFFFF;] Gives more information on the specified command than help() does.");
            break
        case "giveAdmin":
            commandEcho("giveAdmin(id)", "Gives player with the specified ID admin privileges", "giveAdmin(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Gives player with the specified ID administrator permissions.");
            echo("[[;#FFFFFF;] To ensure you've given the right player admin permissions, it will print a message saying their name.");
            newLine();
            echo("[[;#FFFFFF;] The newly added admin will have the following permissions:");
            echo("[[;#FFFFFF;]       - Kick");
            echo("[[;#FFFFFF;]       - Ban");
            newLine();
            echo("[[;#FFFFFF;] Note: Only the mod starter has the ability to perform a bruteforce ban.");
            break
        case "help":
            commandEcho("help()", "Prints the list of commands", "help()", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Provides the list and an elementary description of all current commands.");
            echo("[[;#FFFFFF;] It's recommended to use chelp() if you're confused about a command.");
            break
        case "removeAdmin":
            commandEcho("removeAdmin(id)", "Removes admin privileges from player with specified ID", "removeAdmin(4)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Removes administrator permissions from a player with the specified ID.");
            echo("[[;#FFFFFF;] To ensure you've removen the right admin, it will pring a message saying their name.");
            newLine();
            echo("[[;#FFFFFF;] The removed admin will lose the following permissions:");
            echo("[[;#FFFFFF;]       - Kick");
            echo("[[;#FFFFFF;]       - Ban");
            break
        case "requireShip":
            commandEcho("requireShip(shipID)", "Makes the selected ship mandatory for all players", "requireShip(605)", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Makes the specified ship a mandatory ship.");
            echo("[[;#FFFFFF;] If an incorrect ship has been provided, it will remain unset.");
            newLine();
            echo("[[;#FFFFFF;] After correctly running the command:");
            echo("[[;#FFFFFF;] All currently active players will turn into the specified ship.");
            echo("[[;#FFFFFF;] All spectators will turn into the specified ship upon unspectating.");
            echo("[[;#FFFFFF;] 'Select ship' modal will cease to give players the permission to change their ship");
            newLine();
            echo("[[;#FFFFFF;] To find out the ID of a certain ship, type showShipIDs()");
            echo("[[;#FFFFFF;] To counteract the requireShip command, type unrequireShip()");
            break
        case "showIDs":
            commandEcho("showIDs()", "Prints a list with the IDs and names of all players", "showIDs()", "[[;#FFFFFF;]")
            newLine();
            echo("[[;#FFFFFF;] Prints a list of players' names with their respective identification (ID) unique numbers.");
            echo("[[;#FFFFFF;] Player IDs are used in the following commands:");
            echo("[[;#FFFFFF;]       - giveAdmin(id)");
            echo("[[;#FFFFFF;]       - removeAdmin(id)");
            break
        case "showShipIDs":
            commandEcho("showShipIDs()", "Prints a list with the IDs and names of all ships", "showShipIDs()", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Prints a list of ship names with their respective identification (ID) unique numbers.");
            echo("[[;#FFFFFF;] Ship IDs are used in the following commands:");
            echo("[[;#FFFFFF;]       - requireShip(shipID)");
            break
        case "unrequireShip":
            commandEcho("unrequireShip()", "Removes the required ship", "requireShip()", "[[;#FFFFFF;]");
            newLine();
            echo("[[;#FFFFFF;] Directly counteracts requireShip - Removes the mandatory ship specified using the requireShip command.");
            echo("[[;#FFFFFF;] If there is no mandatory ship, it will remain unset.");
            newLine();
            echo("[[;#FFFFFF;] After correctly running the command:");
            echo("[[;#FFFFFF;] 'Select ship' modal will give players the permission to change their ship");
            break
        default:
            return statusMessage("if", "Unknown command or extended description hasn't been added yet")
    }
    newLine()
}

showShipIDs = () => {
    centeredEcho("Ship list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Ship name ", " Ship ID", "[[b;#5FFFFF;]", "|")
    for (let key of Object.keys(SHIPS["vanilla"])) {
        anchoredEcho(`${SHIPS["vanilla"][key].name} `, ` ${key}`, "[[;#FFFFFF;]", "|")
    }
    newLine();
}

adminList = () => {
    newLine();
    centeredEcho("Admin list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Player ID", "[[b;#5FFFFF;]", "|")
    for (let ship of sessionMemory.admins) {
        anchoredEcho(`${game.ships[fetchShip(ship)].name} `, ` ${ship}`, "[[;#FFFFFF;]", "|")
    }
    newLine();
}

requireShip = (id) => {
    let pID = Number(id);
    if (!SHIPS["vanilla"][pID]) {
        return statusMessage("error", "No ship with the ID of " + pID)
    }
    if (staticMemory.requireShip === pID) {
        return statusMessage("if", `"${SHIPS["vanilla"][pID].name}" is already the required ship`)
    }
    try {
        staticMemory.requireShip = pID;
        for (let ship of game.ships) {
            if (ship.spectating.value) {
                ship.spectating.lastShip = pID;
            } else {
                let type = String(pID);
                let level = type.charAt(0);
                ship.set({type: Number(type), stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], collider: true, shield: 99999});
            }
        }
        statusMessage("success", `"${SHIPS["vanilla"][pID].name}" is now the required ship`)
    } catch (ex) {
        statusMessage("error", "requireShip(...) error - More in console");
        console.warn(ex);
    }
}

unrequireShip = () => {
    if (!staticMemory.requireShip) {
        statusMessage("if", `There is already no required ship`)
    } else {
        statusMessage("success", `"${SHIPS["vanilla"][staticMemory.requireShip].name}" is no longer the required ship`)
    }
    staticMemory.requireShip = null;
}

if (!echoed) {
    setTimeout(() => {
        newLine();
        newLine();
        
        centeredEcho("welcome to", "[[b;#FFFFFF;]");
        centeredEcho(" ＦＬＩＮＴＬＯＣＫ ＤＵＥＬＩＮＧ            ", "[[gb;#FF0000;]");
        centeredEcho("a mod by nanoray", "[[;#FFFFFF30;]")
        newLine();
        centeredEcho("Contact:", "[[ub;#FF4f4f;]");
        centeredEcho("Discord - h.alcyon", "[[;#FFFFFF;]");
        help()
        newLine();
        echo("[[;#FFFF00;]If it seems like a part of the instructions is cut off, zoom out")
        echo("[[;#FFFF00;]NOTE: Giving yourself admin upon mod startup using giveAdmin() is highly recommended")
        newLine();
    }, 2000)

    echoed = true;
}

showIDs = function () {
    newLine();
    centeredEcho("Player list:", "[[ub;#FF4f4f;]");
    anchoredEcho("Player name ", " Player ID", "[[b;#5FFFFF;]", "|")
    for (let ship of game.ships) {
        anchoredEcho(`${ship.name} `, ` ${ship.id}`, "[[;#FFFFFF;]", "|")
    }
    newLine();
}

giveAdmin = (id) => {
    for (let ship of game.ships) {
        if (ship.id === id) {
            if (!(sessionMemory.admins.includes(id))) {
                sessionMemory.admins.push(id)
                game.ships[fetchShip(id)].isUIExpanded && renderExpandedMenu(game.ships[fetchShip(id)], "admin")
                return statusMessage("success", `Player with the id of ${id} (${game.ships[fetchShip(id)].name}) has been granted admin privileges`)
            } else {
                return statusMessage("if", `Player is already admin. Do removeAdmin(${id}) to remove`)
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



const determineType = (ship) => sessionMemory.admins.includes(ship.id) ? "admin" : "regular";

const teleportToNext = (ship, game, __CALL_STACK = 0) => {
    turnToSpectator(ship);
    let tp = ship.lastTeleported;
    if (!tp && typeof tp !== "number") {
        tp = 0;
    } else {
        tp += 1;
        if (tp >= game.ships.length) {
            tp = 0;
        } 
    }
    ship.lastTeleported = tp;
    if (game.ships[tp].id === ship.id) {
        if (__CALL_STACK < 1) {
            return teleportToNext(ship, game, __CALL_STACK + 1);
        } else {
            return fleetingMessage(ship, "Nobody to teleport to");
        }
    }
    let ref = game.ships[tp];
    ship.set({x: ref.x, y: ref.y});
}

let _scoreboard_defaults = {
    components: [
        { type: "box", position: [0, 0, 100, 8], fill: "hsla(0, 100%, 50%, 0.25)" },
        { type: "box", position: [62, 0, 11, 8], fill: "hsla(0, 100%, 50%, 1)" },
        { type: "box", position: [76, 0, 25, 8], fill: "hsla(0, 100%, 50%, 1)" },
        { type: "text", position: [2, 1, 98, 6], value: "𝗣𝗹𝗮𝘆𝗲𝗿𝘀", color: "hsla(0, 100%, 50%, 1)", align: "left" },
        { type: "text", position: [62, 0, 11, 8], value: "𝗞/𝗗", color: "hsla(0, 0%, 0%, 1.00)", align: "center" },
        { type: "text", position: [76, 0.5, 24, 7], value: "𝗘𝗟𝗢", color: "hsla(0, 0%, 0%, 1.00)", align: "center" },
    ]
}
const updateScoreboard = () => {
    let sortedPlayers = [...game.ships].sort((a, b) => b.elo - a.elo);

    let playerComponents = sortedPlayers.map((item, index) => {
        let Y_OFFSET = (index + 1) * 9;
        return [
            { type: "box", position: [0, Y_OFFSET, 100, 8], fill: "hsla(0, 100%, 50%, 0.065)" },
            { type: "box", position: [62, Y_OFFSET, 11, 8], fill: "hsla(0, 100%, 50%, 0.1)" },
            { type: "box", position: [76, Y_OFFSET, 25, 8], fill: "hsla(0, 100%, 50%, 0.1)" },
            { type: "player", position: [2, Y_OFFSET + 1, 59, 6], id: item.id, color: "hsla(0, 0%, 100%, 1)", align: "left" },
            { type: "text", position: [62, Y_OFFSET, 11, 8], value: item.kd.value, color: "hsla(0, 0%, 100%, 1)", align: "center" },
            { type: "text", position: [76, Y_OFFSET + 1, 24, 6], value: item.elo, color: "hsla(0, 0%, 100%, 1)", align: "center" },
        ]
    });

    let outp = playerComponents.flat();

    game.setUIComponent({
        id: "scoreboard",
        clickable: false,
        visible: true,
        components: [
            ..._scoreboard_defaults.components,
            ...outp
        ]
    });
}

const handleEloCalculation = (killer, victim) => {
    const KILLER_TIER = (killer.type / 100) >> 0, VICTIM_TIER = (victim.type / 100) >> 0;
    victim.custom.goto = {x: victim.x, y: victim.y};

    const calculateKD = (kills, deaths) => {
        let outp = kills / deaths;
        if (outp === Infinity) {
            return kills;
        }
        return Number(outp.toFixed(1));
    }

    if (KILLER_TIER <= VICTIM_TIER) {
        victimNewElo = updateSubjectElo(victim.elo, killer.elo, false);
        killer.elo = updateSubjectElo(killer.elo, victim.elo, true);
        victim.elo = victimNewElo;
    }

    killer.kd = {
        value: calculateKD(killer.kd.kills + 1, killer.kd.deaths),
        kills: killer.kd.kills + 1,
        deaths: killer.kd.deaths
    }

    victim.kd = {
        value: calculateKD(victim.kd.kills, victim.kd.deaths + 1),
        kills: victim.kd.kills,
        deaths: victim.kd.deaths + 1
    }

    updateScoreboard();
}

const customEvent = (eventName) => {
    switch (eventName) {
        case "ship_left":
            updateScoreboard();
            break
    }
}

this.event = function (event, game) {
    switch (event.name) {
        case "ship_destroyed":
            handleEloCalculation(event.killer, event.ship);
            break
        case "ship_spawned":
            if (event.ship != null) {
                if (sessionMemory.banned.includes(event.ship.name)) {
                    kickPlayer(event.ship)
                }
                if (event.ship.name) {
                    for (let comp of sessionMemory.bruteforceBanned) {
                        let lsim = levenshteinSimilarity(comp, event.ship.name);
                        if (lsim >= staticMemory.bruteforceBan_minimumSimilarity) {
                            statusMessage("warn", `${event.ship.name} has been kicked: Levenshtein similarity ${lsim} - Maximum ${staticMemory.bruteforceBan_minimumSimilarity}`);
                            setTimeout(() => {
                                kickPlayer(event.ship.name);
                            }, 50);
                        }
                    }
                }
                if (!event.ship.custom.hasOwnProperty("registered")) {
                    event.ship.elo = 0;
                    event.ship.kd = {
                        value: 0,
                        kills: 0,
                        deaths: 0
                    }
                    event.ship.custom.goto = {x: 0, y: 0};
                    event.ship.custom.forcedToSpectate = false;
                    updateScoreboard();
                    statusMessage("info", `${event.ship.name} joined. ID: ${event.ship.id}`);
                }
                event.ship.custom.registered = true;
                event.ship.lastTeleported = null;
                event.ship.chatOpen = false;
                event.ship.draftMessage = "";
                event.ship.chatTargetID = -1;
                event.ship.dashboardOpen = false;
                event.ship.recievedMessages = [];
                event.ship.globalChatExpanded = false;
                event.ship._nextButtonClick = 0;
                event.ship.afk = {
                    time: 0,
                    lastPos: {
                        x: 0,
                        y: 0
                    }
                },
                event.ship.spectating = {
                    value: false,
                    lastShip: null
                };
                let type = staticMemory.requireShip ? String(staticMemory.requireShip) : "605";
                let level = type.charAt(0);
                event.ship.set({
                    x: event.ship.custom.goto.x, 
                    y: event.ship.custom.goto.y, 
                    type: Number(type), 
                    stats: Number(level.repeat(8)), 
                    shield: 9999, 
                    crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], 
                    collider: true
                })
                if (!(sessionMemory.rememberedIDs.includes(event.ship.id))) {
                    sessionMemory.rememberedIDs.push(event.ship.id)
                }
                renderExpandedMenu(event.ship, determineType(event.ship));
                renderSpectateRegen(event.ship);
                setTimeout(() => {
                    minimizeGlobalChat(event.ship)
                }, 1000)
            }
            break;
        case "ui_component_clicked":
            var component = event.id;
            const DELAY_BUTTON_CLICK = staticMemory._CLICK_RATE_LIMIT; // * in ticks
            
            const RATE_LIMIT_EXCEPTIONS = ["key"];

            if (game.step < event.ship._nextButtonClick) {
                let ex = false;
                for (let pref of RATE_LIMIT_EXCEPTIONS) {
                    if (component.startsWith(pref)) {
                        ex = true;
                        break;
                    }
                }
                if (!ex) {
                    return fleetingMessage(event.ship, "You are being rate limited")
                }
            }

            event.ship._nextButtonClick = game.step + DELAY_BUTTON_CLICK;

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

                case "spectate":
                    if (event.ship.custom.forcedToSpectate) {
                        return fleetingMessage(event.ship, "You have been forced to spectate");
                    }
                    if (event.ship.spectating.value) {
                        let type = event.ship.spectating.lastShip;
                        let level = type.charAt(0);
                        event.ship.set({type: Number(type), stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], collider: true, shield: 99999});
                        event.ship.spectating.value = false;
                    } else {
                        turnToSpectator(event.ship);
                    }
                    break

                case "regen":
                    event.ship.set({shield: 99999, crystals: staticMemory.GEM_CAPS[(event.ship.type / 100) >> 0]})
                    break

                case "openAdjust":
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
                
                case "teleport":
                    return teleportToNext(event.ship, game);

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
                    const extractArg = (comp) => comp.split("_")[1];

                    const prefixes = {
                        "selectShip": () => {
                            let type = component.split("_")[1];
                            let level = type.charAt(0);

                            // ! Guard clause if the player already had ship tree open when requireShip() was fired
                            if (staticMemory.requireShip && staticMemory.requireShip != Number(type)) {
                                return;
                            }

                            event.ship.set({type: Number(type), stats: Number(level.repeat(8)), crystals: staticMemory.GEM_CAPS[(Number(type) / 100) >> 0], shield: 99999})
                        },
                        "channel": () => {
                            handleOpenChat(event.ship, Number(extractArg(component)), game)
                        },
                        "key": () => {
                            handleDraftChange(event.ship, extractArg(component), game)
                        },
                        "tpto": () => {
                            let ref = shipByID(Number(extractArg(component)));
                            if (!ref) {
                                return fleetingMessage(event.ship, "Unknown ship");
                            }
                            turnToSpectator(event.ship);
                            event.ship.set({x: ref.x, y: ref.y});
                        },
                        "forcespec": () => {
                            let ind = fetchShip(Number(extractArg(component)));
                            let ref = game.ships[ind];
                            if (ref.custom.forcedToSpectate) {
                                game.ships[ind].custom.forcedToSpectate = false;
                                fleetingMessage(game.ships[ind], "You are no longer forced to spectate");
                            } else {
                                turnToSpectator(game.ships[ind]);
                                fleetingMessage(game.ships[ind], "You have been forced to spectate");
                                game.ships[ind].custom.forcedToSpectate = true;
                            }
                            if (event.ship.dashboardOpen) {
                                determineForceSpecType(event.ship, game.ships[ind])
                            }
                        },
                        "kick": () => {
                            kickPlayer(game.ships[fetchShip(Number(extractArg(component)))])
                        },
                        "ban": () => {
                            sessionMemory.banned.push(game.ships[fetchShip(Number(extractArg(component)))].name)
                            kickPlayer(game.ships[fetchShip(Number(extractArg(component)))])
                        },
                        "adjust": () => {
                            // TODO - Optimize this operation
                            // ! Currently the most expensive operation in the mod

                            // ! I proudly announce that this is now optimized
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

const kickPlayer = (ship) => ship.gameover({ "": "You have been kicked from participating", "Score": 0 });

const minimizeGlobalChat = (ship) => {
    ship.globalChatExpanded = false;
    ship.setUIComponent({
        id: "global_chat_front",
        position: [0, 64, 30, 31],
        visible: false,
        clickable: false,
        components: []
    })
    ship.setUIComponent({
        id: "resize_global_chat",
        position: [1, 85, 5, 5],
        visible: true,
        shortcut: "C",
        clickable: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)", width: 1 },
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: "→" },
            { type: "text", position: [61, 6, 34, 44], color: "hsla(0, 0%, 73%, 1.00)", align: 'right', value: "[C]" },
        ]
    })
}

const renderExpandedChat = (ship, game) => {
    ship.globalChatExpanded = true;
    let components = [
        { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.02)" },
        { type: "box", position: [0, 0, 100, 1], fill: "hsla(0, 0%, 100%, 0.31)" },
        { type: "box", position: [0, 99, 100, 1], fill: "hsla(0, 0%, 100%, 0.31)" }
    ]
    let chat = [...sessionMemory.chatChannels[0].messages].reverse()
    for (let i = 0, Y_OFFSET = 0; i < chat.length; i++) {
        if (i >= 4) { break }
        components.push({
            type: "box",
            position: [0, 84 - Y_OFFSET, 100, 16],
            fill: "hsla(0, 0%, 100%, 0.02)"
        })
        components.push({
            type: "text",
            position: [0, 84 - Y_OFFSET, 100, 16],
            color: "hsla(0, 0%, 100%, 1.00)",
            value: chat[i].message,
            align: "left"
        })
        if (fetchShip(chat[i].sentBy) !== -1) {
            components.push({
                type: "player",
                position: [0, 77.55 - Y_OFFSET, 40, 6.45],
                color: "hsla(0, 0%, 100%, 0.00)",
                id: chat[i].sentBy
            })
            components.push({
                type: "text",
                position: [10, 77.55 - Y_OFFSET, 100, 6.45],
                color: "hsla(0, 0%, 100%, 1.00)",
                value: game.ships[fetchShip(chat[i].sentBy)].name,
                align: "left"
            })
        } else {
            components.push({
                type: "text",
                position: [10, 77.55 - Y_OFFSET, 100, 6.45],
                color: "hsla(0, 0%, 100%, 1.00)",
                value: "Player left",
                align: "left"
            })
        }
        Y_OFFSET += 25.675
    }
    ship.setUIComponent({
        id: "global_chat_front",
        position: [0, 59, 30, 31],
        visible: true,
        clickable: false,
        components: components
    })
    ship.setUIComponent({
        id: "resize_global_chat",
        position: [31, 85, 5, 5],
        visible: true,
        shortcut: "C",
        clickable: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)", width: 2 },
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: "←" },
            { type: "text", position: [61, 6, 34, 44], color: "hsla(0, 0%, 73%, 1.00)", align: 'right', value: "[C]" },
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
                // ! shortcut: staticMemory.layout[i][j].toUpperCase(),
                clickable: true,
                components: [
                    { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)" },
                    { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: staticMemory.layout[i][j], align: "center" },
                ]
            })
        }
    }
    initiator.setUIComponent({
        id: "key_space",
        position: [30, 80, 30, 5],
        visible: true,
        shortcut: "4",
        clickable: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)" },
        ]
    })
    try {
        initiator.setUIComponent({
            id: "typingSpace",
            position: [20, 60, 50, 5],
            visible: true,
            clickable: false,
            components: [
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.06)", stroke: "hsla(0, 0%, 100%, 0.31)" },
                { type: "text", position: [2, 0, 96, 100], color: "hsla(0, 0%, 100%, 1.00)", value: initiator.draftMessage, align: "left" },
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
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)" },
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: "↩", align: "center" },
        ]
    })
    initiator.setUIComponent({
        id: "sendMessage",
        position: [75, 60, 5, 5],
        visible: true,
        clickable: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)" },
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: "➤", align: "center" },
        ]
    })
}

const openGlobalChat = (initiator, game) => {
    initiator.chatTargetID = -1
    initiator.draftMessage = ""
    initiator.chatOpen = true
    initiator.recievedMessages = removeFromArray(initiator.recievedMessages, -1);
    const NULL_COMP = NULL_COMPONENT;
    for (let i = 0; i < sessionMemory.rememberedIDs.length; i++) {
        initiator.setUIComponent({ id: `channel_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `player_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `invite_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `ban_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `kick_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `tpto_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `forcespec_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
    }
    initiator.setUIComponent({ id: `global_channel`, ...NULL_COMP })
    initiator.setUIComponent({
        id: "back_chat",
        position: [72, 17, 4, 3],
        clickable: true,
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 13%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)" },
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: "←", align: "center" },
        ]
    })
    initiator.setUIComponent({
        id: "chat_player_indicator",
        position: [22, 17, 45, 3],
        clickable: false,
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: `Global Chat`, align: "left" }
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
                            { type: "box", position: [0, 0, 100, 100], fill: messageType == "foreign" ? "hsla(120, 100%, 50%, 0.38)" : "hsla(240, 100%, 50%, 0.38)", stroke: "hsla(0, 0%, 100%, 0.31)" },
                            { type: "text", position: [2, 2, 96, 96], color: "hsla(0, 0%, 100%, 1.00)", value: chat.messages[j].message, align: messageType == "foreign" ? "left" : "right" },
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
                                    { type: "player", id: chat.messages[j].sentBy, position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)" },
                                ]
                                :
                                [
                                    { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: "Player left", align: "left" },
                                ]
                            : [
                                { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: "You", align: "right" },
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
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.06)", stroke: "hsla(0, 0%, 100%, 0.31)" },
            { type: "text", position: [2, 0, 96, 100], color: "hsla(0, 0%, 100%, 1.00)", value: ship.draftMessage, align: "left" },
        ]
    })
}

const handleSendMessage = (ship, game) => {
    if (ship.draftMessage === "") { return };

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
    ship.setUIComponent({
        id: "typingSpace",
        position: [20, 60, 50, 5],
        visible: true,
        clickable: false,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.06)", stroke: "hsla(0, 0%, 100%, 0.31)" },
            { type: "text", position: [2, 0, 96, 100], color: "hsla(0, 0%, 100%, 1.00)", value: "", align: "left" },
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
            notify(target, {from: ship.name, message: newDraftMessage})
        } else {
            notify(target, {from: ship.name, message: newDraftMessage})
        }
    } else {
        renderGlobalMessages(ship)
        for (let ship of game.ships) {
            if (ship.globalChatExpanded) {
                renderExpandedChat(ship, game)
            } else {
                ship.setUIComponent({
                    id: "resize_global_chat",
                    position: [1, 85, 5, 5],
                    visible: true,
                    clickable: true,
                    components: [
                        { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)", width: 1 },
                        { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: "→" },
                        { type: "round", position: [72, 4, 24, 35], fill: "hsla(0, 100%, 50%, 1.00)" },
                    ]
                })
            }
        }
    }
    ship.draftMessage = ""
}

const removeFromArray = (arr, target) => arr.filter(item => item !== target);
const removeIndexFromArray = (arr, index) => arr.filter((_, ind) => ind !== index);

const handleOpenChat = (initiator, targetID, game) => {
    initiator.chatTargetID = targetID
    initiator.draftMessage = ""
    initiator.chatOpen = true
    initiator.recievedMessages = removeFromArray(initiator.recievedMessages, targetID);
    let NULL_COMP = NULL_COMPONENT;
    for (let i = 0; i < sessionMemory.rememberedIDs.length; i++) {
        initiator.setUIComponent({ id: `channel_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `player_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `invite_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `ban_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `kick_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `tpto_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
        initiator.setUIComponent({ id: `forcespec_${sessionMemory.rememberedIDs[i]}`, ...NULL_COMP })
    }
    initiator.setUIComponent({ id: `global_channel`, ...NULL_COMP })
    initiator.setUIComponent({
        id: "back_chat",
        position: [72, 17, 4, 3],
        clickable: true,
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 13%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)" },
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: "←", align: "center" },
        ]
    })
    initiator.setUIComponent({
        id: "chat_player_indicator",
        position: [22, 17, 45, 3],
        clickable: false,
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: `Chatting with: ${game.ships[fetchShip(targetID)].name}`, align: "left" }
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
                        { type: "box", position: [0, 0, 100, 100], fill: messageType == "foreign" ? "hsla(120, 100%, 50%, 0.38)" : "hsla(240, 100%, 50%, 0.38)", stroke: "hsla(0, 0%, 100%, 0.31)" },
                        { type: "text", position: [2, 2, 96, 96], color: "hsla(0, 0%, 100%, 1.00)", value: chat.messages[j].message, align: messageType == "foreign" ? "left" : "right" },
                    ]
                })
            }
        }
    }
}

const FLEETING_TTL = 3000;

let notificationTimer = null
const notify = (ship, info) => {
    clearTimeout(notificationTimer)
    ship.setUIComponent({
        id: "new_message",
        position: [0, 85, 78, 5],
        clickable: false,
        visible: true,
        components: [
            { type: "text", position: [40, 0, 37, 100], color: "hsla(0, 0%, 100%, 1.00)", value: info.from + ":", align: "right" },
            { type: "text", position: [80, 0, 20, 100], color: "hsla(0, 0%, 80%, 1.00)", value: info.message, align: "right" }
        ]
    })
    notificationTimer = setTimeout(() => {
        ship.setUIComponent({
            id: "new_message",
            ...NULL_COMPONENT
        })
    }, FLEETING_TTL)
}

let fleetingTimer = null
const fleetingMessage = (ship, message) => {
    clearTimeout(fleetingTimer);
    ship.setUIComponent({
        id: "fleeting",
        position: [0, 80, 78, 5],
        clickable: false,
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 100%, 65%, 1.00)", value: message, align: "right" }
        ]
    })
    fleetingTimer = setTimeout(() => {
        ship.setUIComponent({
            id: "fleeting",
            ...NULL_COMPONENT
        })
    }, FLEETING_TTL)
}

let lastRememberedYOffset = 0;
const determineForceSpecType = (ship, target, Y_OFFSET = null) => {
    if (!ship.dashboardOpen) return;
    let newY_OFFSET = 0;
    if (!Y_OFFSET) {
        newY_OFFSET = lastRememberedYOffset;
    } else {
        newY_OFFSET = Y_OFFSET;
        lastRememberedYOffset = Y_OFFSET;
    }
    if (target.custom.forcedToSpectate) {
        ship.setUIComponent({
            id: `forcespec_${target.id}`,
            position: [60, newY_OFFSET, 4, 5],
            clickable: true,
            visible: true,
            components: [
                {type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.18)", stroke: "hsla(0, 0%, 100%, 1.00)", width: 2},
                {type: "text", position: [0, 17, 100, 68], align: "center", value: "◎", color: "hsla(0, 0%, 100%, 1.00)"},
                {type: "text", position: [4, 74, 92, 22], align: "center", value: "FORCE", color: "hsla(0, 0%, 100%, 1.00)"},
                {type: "text", position: [4, 2, 92, 22], align: "center", value: "UNSPECTATE", color: "hsla(0, 0%, 100%, 1.00)"},
            ]
        })
    } else {
        ship.setUIComponent({
            id: `forcespec_${target.id}`,
            position: [60, newY_OFFSET, 4, 5],
            clickable: true,
            visible: true,
            components: [
                {type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 100%, 50%, 0.18)", stroke: "hsla(0, 100%, 50%, 1.00)", width: 2},
                {type: "text", position: [0, 17, 100, 68], align: "center", value: "◉", color: "hsla(0, 100%, 50%, 1.00)"},
                {type: "text", position: [4, 74, 92, 22], align: "center", value: "FORCE", color: "hsla(0, 100%, 50%, 1.00)"},
                {type: "text", position: [4, 2, 92, 22], align: "center", value: "SPECTATE", color: "hsla(0, 100%, 50%, 1.00)"},
            ]
        })
    }
}

let dashboardClosables = [];
const renderDashboard = (ship, game) => {
    if (ship.chatOpen) { return }
    ship.dashboardOpen = true
    ship.setUIComponent({
        id: "chat_player_indicator",
        position: [21, 17, 46, 3],
        clickable: false,
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: `Dashboard`, align: "left" }
        ]
    })
    ship.setUIComponent({
        id: `global_channel`,
        position: [20, 20, 60, 5],
        clickable: true,
        visible: true,
        components: [
            { type: "text", position: [0, 0, 100, 100], value: "All-players chat 🗪", color: "hsla(0, 0%, 100%, 1.00)", align: "center" },
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)" },
            { type: "box", position: [0, 99, 100, 1], fill: "hsla(0, 0%, 100%, 0.31)" },
            { type: "box", position: [0, 0, 100, 1], fill: "hsla(0, 0%, 100%, 0.31)" }
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
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)", width: 2 },
                { type: "text", position: [5, 0, 90, 100], color: "hsla(0, 0%, 100%, 1.00)", value: "🗪", align: "center" },
                { type: "round", position: [0, 0, 29, 35], fill: "hsla(0, 100%, 50%, 1.00)" },
            ] : [
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)", width: 2 },
                { type: "text", position: [5, 0, 90, 100], color: "hsla(0, 0%, 100%, 1.00)", value: "🗪", align: "center" },
            ]
        })
        ship.setUIComponent({
            id: `tpto_${game.ships[i].id}`,
            position: [72, Y_OFFSET, 4, 5],
            clickable: true,
            visible: true,
            components: [
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)", width: 2 },
                {type: "text", position: [4, 4, 92, 70], align: "center", value: "⌖", color: "hsla(0, 0%, 100%, 1.00)"},
                {type: "text", position: [4, 74, 92, 22], align: "center", value: "TELEPORT", color: "hsla(0, 0%, 100%, 1.00)"},
            ]
        })
        if (determineType(ship) == "admin") {
            ship.setUIComponent({
                id: `ban_${game.ships[i].id}`,
                position: [68, Y_OFFSET, 4, 5],
                clickable: true,
                visible: true,
                components: [
                    {type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 100%, 50%, 0.18)", stroke: "hsla(0, 100%, 50%, 1.00)", width: 2},
                    {type: "text", position: [4, 4, 92, 70], align: "center", value: "🔨", color: "hsla(0, 100%, 50%, 1.00)"},
                    {type: "text", position: [4, 74, 92, 22], align: "center", value: "BAN", color: "hsla(0, 100%, 50%, 1.00)"},
                ]
            })
            ship.setUIComponent({
                id: `kick_${game.ships[i].id}`,
                position: [64, Y_OFFSET, 4, 5],
                clickable: true,
                visible: true,
                components: [
                    {type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 100%, 50%, 0.18)", stroke: "hsla(0, 100%, 50%, 1.00)", width: 2},
                    {type: "text", position: [4, 4, 92, 70], align: "center", value: "🦵", color: "hsla(0, 100%, 50%, 1.00)"},
                    {type: "text", position: [4, 74, 92, 22], align: "center", value: "KICK", color: "hsla(0, 100%, 50%, 1.00)"},
                ]
            })
            determineForceSpecType(ship, game.ships[i], Y_OFFSET);
        }
        ship.setUIComponent({
            id: `player_${game.ships[i].id}`,
            position: [20, Y_OFFSET, 60, 5],
            clickable: false,
            visible: true,
            components: [
                { type: "player", id: game.ships[i].id, position: [3, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)" },
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)" },
                { type: "box", position: [0, 99, 100, 1], fill: "hsla(0, 0%, 100%, 0.31)" },
                { type: "box", position: [0, 0, 100, 1], fill: "hsla(0, 0%, 100%, 0.31)" }
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
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)" },
            { type: "box", position: [0, 99.5, 100, 0.5], fill: "hsla(0, 0%, 100%, 0.31)" },
        ]
    })
    ship.setUIComponent({
        id: "closeDashboard",
        position: [76, 17, 4, 3],
        clickable: true,
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 100%, 50%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)" },
            { type: "text", position: [0, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", value: "✖", align: "center" },
        ]
    })
    ship.setUIComponent({
        id: "navbar",
        position: [20, 17, 60, 3],
        clickable: false,
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 5], fill: "hsla(0, 0%, 100%, 0.31)" },
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.13)" },
            { type: "box", position: [0, 98, 100, 2], fill: "hsla(0, 0%, 100%, 0.31)" },
        ]
    })
}

const closeDashboard = (ship, game) => {
    ship.dashboardOpen = false;
    let elementsToClose = ['dashboard', 'typingSpace', 'sendMessage', 'closeDashboard', 'navbar', 'back_chat', 'global_channel', 'chat_player_indicator']
    
    if (ship.chatOpen) {
        for (let letter of staticMemory.layoutString.split('')) {
            elementsToClose.push(`key_${letter}`)
        }
        for (let i = 0; i <= 6; i++) {
            elementsToClose.push(`message_${i}`)
            elementsToClose.push(`message_${i}_indicator`)
        }
        elementsToClose = [...elementsToClose, 'key_space', 'key_backspace']
        ship.chatOpen = false;
    }

    
    for (let ship of sessionMemory.rememberedIDs) {
        elementsToClose.push(`ban_${ship}`)
        elementsToClose.push(`kick_${ship}`)
        elementsToClose.push(`player_${ship}`)
        elementsToClose.push(`channel_${ship}`)
        elementsToClose.push(`tpto_${ship}`)
        elementsToClose.push(`forcespec_${ship}`)
    }
    for (let component of elementsToClose) {
        ship.setUIComponent({
            id: component,
            ...NULL_COMPONENT
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
            ...NULL_COMPONENT
        })
    }
    renderDashboard(ship, game)
}


const ADJUST_PANEL = {
    closingComponents: ["adjustPanel", "navbar", "closeAdjust"],
    currentClosingComponents: [],
    
    closePanel: function(ship) {
        for (let component of [...this.closingComponents, ...this.currentClosingComponents]) {
            ship.setUIComponent({id: component, ...NULL_COMPONENT})
        }
    },

    compileNewStats: function(ship, componentID) {
        let currentStats = String(ship.stats).split('');
        if (currentStats.length !== 8) {
            while (currentStats.length !== 8) {
                currentStats.unshift(0);
            }
        }

        let upgradeLevel = componentID.split("_")[2];
        let upgrade = String(Number(componentID.split("_")[1]));

        currentStats[upgrade - 1] = upgradeLevel; 
        ship.set({stats: Number(currentStats.join(""))});
        
        // Below is update renderer - this.renderPanel is not used because of tick quirks
        // Actually scratch that

        this.renderPanel(ship, upgrade, Number(currentStats.join("")))
    },

    renderPanel: function(ship, targetUpgrade = null, replaceStats = null) {
        try {

            if (ship.spectating.value) {
                fleetingMessage(ship, "You're spectating");
                return this.closePanel(ship);
            }

            let upgradesAvailable = Number(String(ship.type).charAt(0));
            let currentUpgrades = {};
            let stats = String(replaceStats ? replaceStats : ship.stats).split('')

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
                    { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)" },
                    { type: "box", position: [0, 99.5, 100, 0.5], fill: "hsla(0, 0%, 100%, 0.31)" },
                    { type: "box", position: [0, 0, 100, 0.5], fill: "hsla(0, 0%, 100%, 0.31)" }
                ]
            })
            ship.setUIComponent({
                id: "navbar",
                position: [20, 17, 60, 3],
                clickable: false,
                visible: true,
                components: [
                    { type: "text", position: [2, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", align: 'left', value: 'Adjust upgrades' },
                    { type: "box", position: [0, 0, 100, 5], fill: "hsla(0, 0%, 100%, 0.31)" },
                    { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.13)" },
                    { type: "box", position: [0, 98, 100, 2], fill: "hsla(0, 0%, 100%, 0.31)" },
                ]
            })
            ship.setUIComponent({
                id: "closeAdjust",
                position: [76, 17, 4, 3],
                clickable: true,
                visible: true,
                components: [
                    {type: "box", position: [0, 0, 100 ,100], fill: "hsla(0, 100%, 50%, 0.31)"},
                    {type: "text", position: [0,10,100,90], color: "hsla(0, 0%, 100%, 1.00)", value: "✖"}
                ]
            })
            
            this.currentClosingComponents = [];
    
            let keys = Object.keys(currentUpgrades);

            // ! This was a quick workaround to a bug I had, too lazy to rewrite
            // ! Only god can judge me ☝️🙏
            const UPGRADES = {
                "1": {name: "Capacity", color: (a) => "hsla(180, 100%, 50%, " + (a ? a+")" : "1.00)")},
                "2": {name: "Regen", color: (a) => "hsla(180, 100%, 50%, " + (a ? a+")" : "1.00)")},
                "3": {name: "Capacity", color: (a) => "hsla(60, 100%, 50%, " + (a ? a+")" : "1.00)")},
                "4": {name: "Regen", color: (a) => "hsla(60, 100%, 50%, " + (a ? a+")" : "1.00)")},
                "5": {name: "Damage", color: (a) => "hsla(36, 98%, 50%, " + (a ? a+")" : "1.00)")},
                "6": {name: "Speed", color: (a) => "hsla(36, 98%, 50%, " + (a ? a+")" : "1.00)")},
                "7": {name: "Speed", color: (a) => "hsla(0, 100%, 50%, " + (a ? a+")" : "1.00)")},
                "8": {name: "Agility", color: (a) => "hsla(0, 100%, 50%, " + (a ? a+")" : "1.00)")},
            }

            const HEIGHT = 38.5 / upgradesAvailable;

            // ! Horror
            for (let i = 0, len = keys.length, skipRenderFlag = false; i < len; i++) {
                if (targetUpgrade && (targetUpgrade != (i + 1))) {
                    skipRenderFlag = true;
                } else {
                    skipRenderFlag = false;
                }
                for (let j = upgradesAvailable, X_OFFSET = i * 5.5 + i * 2; j >= 0; j--) {
                    let Y_OFFSET = ((upgradesAvailable - j) * HEIGHT) + ((upgradesAvailable - j) * 2)

                    this.currentClosingComponents.push(`adjust_${keys[i]}_${j}`)
                    if (skipRenderFlag) continue;

                    if (j !== 0) {
                        ship.setUIComponent({
                            id: `adjust_${keys[i]}_${j}`,
                            position: [21 + X_OFFSET, 21 + Y_OFFSET, 5.5, HEIGHT],
                            visible: true,
                            clickable: true,
                            components: [
                                { type: "box", position: [0, 0, 100, 100], fill: UPGRADES[keys[i]].color((Number(currentUpgrades[keys[i]]) >= j ? "0.7" : "0.2")) }
                            ] 
                        }) 
                    } else {
                        ship.setUIComponent({
                            id: `adjust_${keys[i]}_${j}`,
                            position: [21 + X_OFFSET, 21 + Y_OFFSET, 5.5, 58 - (Y_OFFSET)],
                            visible: true,
                            clickable: true,
                            components: [
                                { type: "box", position: [0, 0, 100, 100], fill: UPGRADES[keys[i]].color("0.7"), width: 3, stroke: UPGRADES[keys[i]].color()},
                                { type: "text", position: [10, 10, 80, 80], color: UPGRADES[keys[i]].color(), value: UPGRADES[keys[i]].name}
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
    closingComponents: ["shipTree", "navbar_stp", "closeShipTree"],
    currentClosingComponents: [],
    
    closeShipTree: function(ship) {
        for (let component of [...this.closingComponents, ...this.currentClosingComponents]) {
            ship.setUIComponent({id: component, ...NULL_COMPONENT})
        }
    },

    renderShipTree: function(ship) {
        if (ship.spectating.value) {
            return fleetingMessage(ship, "You're spectating")
        }

        const START_X = 20, WIDTH = 50;
        let selectedTree = "vanilla";
        
        ship.setUIComponent({
            id: "shipTree",
            position: [START_X, 20, 60, 60],
            clickable: false,
            visible: true,
            components: [
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)" },
                { type: "box", position: [0, 99.5, 100, 0.5], fill: "hsla(0, 0%, 100%, 0.31)" },
                { type: "box", position: [0, 0, 100, 0.5], fill: "hsla(0, 0%, 100%, 0.31)" }
            ]
        })
        ship.setUIComponent({
            id: "navbar_stp",
            position: [START_X, 17, 60, 3],
            clickable: false,
            visible: true,
            components: [
                { type: "text", position: [2, 0, 100, 100], color: "hsla(0, 0%, 100%, 1.00)", align: 'left', value: 'Ship selection' },
                { type: "box", position: [0, 0, 100, 5], fill: "hsla(0, 0%, 100%, 0.31)" },
                { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.13)" },
                { type: "box", position: [0, 98, 100, 2], fill: "hsla(0, 0%, 100%, 0.31)" },
            ]
        })
        ship.setUIComponent({
            id: "closeShipTree",
            position: [76, 17, 4, 3],
            clickable: true,
            visible: true,
            components: [
                {type: "box", position: [0, 0, 100 ,100], fill: "hsla(0, 100%, 50%, 0.31)"},
                {type: "text", position: [0,10,100,90], color: "hsla(0, 0%, 100%, 1.00)", value: "✖"}
            ]
        })
        // Ships space - [21, 21, 58, 58] - Total width and height: 58%
        // Width and height gap 2% - 8 elements of width 5.5% and height 6.2% for tier 6, less elements but same dimensions for other tiers
        this.currentClosingComponents = [];

        let keys = Object.keys(SHIP_SELECTION[selectedTree]);
        try {
            for (let i = 0, tier = keys[0]; i < keys.length; i++) {
                tier = keys[i];
                if (tier === 191) continue;
                let selectedTier = SHIP_SELECTION[selectedTree][tier];
                for (let j = 0, 
                    OFFSET_X = (21 + ((58 - (5.5 * selectedTier.length + (2 * (selectedTier.length - 1) - 1))) / 2)),
                    OFFSET_Y = keys.indexOf(tier) * 6.2 + keys.indexOf(tier) * 2;
                    j < selectedTier.length;
                    j++) {
                        ship.setUIComponent({
                            id: `selectShip_${selectedTier[j][0]}`,
                            position: [OFFSET_X + (j * 5.5 + (j * 2)), 21 + OFFSET_Y, 5.5, 6.2],
                            visible: true,
                            clickable: !staticMemory.requireShip ? true : tier === staticMemory.requireShip,
                            components: !staticMemory.requireShip ? [
                                {type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.00)", stroke: "hsla(0, 0%, 100%, 0.56)", width: 2},
                                {type: "box", position: [5, 8, 90, 84], fill: "hsla(0, 0%, 100%, 0.13)", stroke: "hsla(0, 0%, 100%, 0.38)", width: 2},
                                {type: "text",position: [7, 10, 86, 80], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: selectedTier[j][1]}
                            ] : tier === staticMemory.requireShip ? [
                                {type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0.00)", stroke: "hsla(0, 0%, 100%, 0.56)", width: 2},
                                {type: "box", position: [5, 8, 90, 84], fill: "hsla(0, 0%, 100%, 0.13)", stroke: "hsla(0, 0%, 100%, 0.38)", width: 2},
                                {type: "text",position: [7, 10, 86, 80], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: selectedTier[j][1]}
                            ] : [
                                {type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 100%, 0)", stroke: "hsla(0, 0%, 100%, 0.56)", width: 2},
                                {type: "box", position: [5, 8, 90, 84], fill: "hsla(0, 0%, 100%, 0.13)", stroke: "hsla(0, 0%, 100%, 0.38)", width: 2},
                                {type: "text",position: [7, 10, 86, 80], color: "hsla(0, 0%, 100%, 1.00)", align: "center", value: selectedTier[j][1]}
                            ], 
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
            const BACKGROUND_WIDTH = 28
            const BUTTONS = [
                { label: "⯐ Select ship", id: "showShipTree" },
                { label: type == "admin" ? "⬒ Dashboard+" : "⬒ Dashboard", id: "showDashboard" },
                { label: "⚙ Adjust stats", id: "openAdjust" },
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
                        { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)", width: 3 },
                        { type: "text", position: [5, 20, 90, 60], color: "hsla(0, 0%, 100%, 1.00)", value: BUTTONS[i].label, align: "center" },
                    ]
                })
            }
            ship.setUIComponent({
                id: "mainControlsBackground",
                position: [36, 0, BACKGROUND_WIDTH, 8],
                clickable: false,
                visible: true,
                components: [
                    { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)" },
                    { type: "box", position: [0, 98, 100, 2], fill: "hsla(0, 0%, 100%, 0.31)" }
                ]
            })
            ship.setUIComponent({
                id: "expandButton",
                position: [60, 8.5, 4, 4],
                clickable: true,
                shortcut: "X",
                visible: true,
                components: [
                    { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)", width: 3 },
                    { type: "text", position: [61, 6, 34, 44], color: "hsla(0, 0%, 73%, 1.00)", align: 'right', value: "[X]" },
                    { type: "text", position: [0, 15, 100, 70], color: "hsla(0, 0%, 100%, 1.00)", value: "↑" },
                ]
            })
            break
    }

}

const renderRetractedMenu = (ship) => {
    ship.isUIExpanded = false
    for (let id of staticMemory.retractableComponentIDs) {
        ship.setUIComponent({ id, ...NULL_COMPONENT })
    }
    ship.setUIComponent({
        id: "expandButton",
        position: [60, 1, 4, 4],
        clickable: true,
        shortcut: "X",
        visible: true,
        components: [
            { type: "box", position: [0, 0, 100, 100], fill: "hsla(0, 0%, 14%, 0.31)", stroke: "hsla(0, 0%, 100%, 0.31)", width: 3 },
            { type: "text", position: [60, 6, 34, 44], color: "hsla(0, 0%, 73%, 1.00)", align: 'right', value: "[X]" },
            { type: "text", position: [0, 15, 100, 70], color: "hsla(0, 0%, 100%, 1.00)", value: "↓" },
        ]
    })
}


let _tickLoopJobs = [];

// * Accepts: {id: "myComp", ships: []}
let _nullifyComponentIDs = [];

const reinstateTickLoopJobs = () => {
    _tickLoopJobs = [];

    if (staticMemory.alwaysPickUpGems) {
        _tickLoopJobs.push((ship) => {
            let k = (ship.type / 100) >> 0;
            if (ship.crystals === staticMemory.GEM_CAPS[k]) {
                ship.set({crystals: staticMemory.GEM_CAPS[k] - 1})
            }
        });
    }

    if (staticMemory.afkChecker.active) {
        _tickLoopJobs.push(
            (ship) => {
                let fixed = ship.x.toFixed(2);
                ship.afk.time = (ship.afk.time + 1) * ((ship.type !== 191) & (fixed === ship.afk.lastPos));
                ship.afk.lastPos = fixed;
                if (ship.afk.time > staticMemory.afkChecker.delay) {
                    fleetingMessage(ship, "You are AFK");
                    ship.spectating = {
                        value: true,
                        lastShip: String(ship.type)
                    }
                    ship.set({type: 191, collider: false, crystals: 0});
                }
            }
        )
    }

}
reinstateTickLoopJobs();


let _lastNumOfShips = 0;
this.tick = (game) => {
    if (game.ships.length < _lastNumOfShips) {
        asynchronize(
            () => customEvent("ship_left")
        )
    }
    _lastNumOfShips = game.ships.length;

    for (let ship of game.ships) {
        for (let i = 0, len = _tickLoopJobs.length; i < len; i++) {
            _tickLoopJobs[i](ship);
        }
    }
}


// ! Below are helper functions
function expectedProbability(playerRating, opponentRating) {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

const roundToDecimalPlace = (number, decimalPlaces) => Number(number.toFixed(decimalPlaces));

function updateSubjectElo(subject, opponent, didSubjectWin) {
    const {MAX_WIN_LOSS_THRESHOLD} = staticMemory;

    let kFactor = staticMemory.ELO_K_FACTOR;

    const expectedWinProbability = expectedProbability(subject, opponent);

    const actualOutcome = didSubjectWin ? 1 : 0;

    const newRating = subject + kFactor * (actualOutcome - expectedWinProbability);

    if (didSubjectWin) {
        if (newRating > (subject + MAX_WIN_LOSS_THRESHOLD)) {
            newRating = subject + MAX_WIN_LOSS_THRESHOLD;
        }
    } else {
        if (newRating < (subject - MAX_WIN_LOSS_THRESHOLD)) {
            newRating = subject - MAX_WIN_LOSS_THRESHOLD;
        }
    }

    return roundToDecimalPlace(newRating, 1); 
}



function levenshteinSimilarity(str1, str2) {
    function levenshteinDistance(s1, s2) {
        const m = s1.length;
        const n = s2.length;

        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) {
            for (let j = 0; j <= n; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                } else if (j === 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? 0 : 1),
                        dp[i][j - 1] + 1,
                        dp[i - 1][j] + 1
                    );
                }
            }
        }

        return dp[m][n];
    }

    const distance = levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;

    return similarity;
}


function asynchronize(callback) {
    setTimeout(() => {
        try {
            callback();
        } catch (error) {
            statusMessage("error", `asynchronize(...) failure: Callback - ${callback.name}. More in console`)
            console.warn(error);
        }
    }, 0);
}