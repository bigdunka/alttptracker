var autotrackHost = null;
var autotrackSocket = null;
var autotrackDeviceName = "";

var autotrackReconnectTimer = null;
var autotrackTimer = null;

var autotrackPrevData = null;

var autotrackRefreshInterval = 1000;
var autotrackRefreshIntervalAfterRequest = 100;
var autotrackTimeoutDelay = 10000;

var MAX_REQUESTS_PER_CYCLE = 5;
var requestcounter = 0;
var romrequestqueue = [];

var WRAM_START = 0xF50000;
var WRAM_SIZE = 0x20000;
var SAVEDATA_START = WRAM_START + 0xF000;
var SAVEDATA_SIZE = 0x500;

var doorsmaxchests = 500;

var dungeonitemlocations = [
	//EP
	{
		"togglename": "chest0",
		"currentcount": 0,
		"chest": [[0x172, 0x10], [0x154, 0x10], [0x150, 0x10], [0x152, 0x10], [0x170, 0x10], [0x191, 0x08]],
		"compass": [0x365, 0x20],
		"map": [0x369, 0x20],
		"smallkey": 0x4E2,
		"keycount": 0,
		"bigkey": [0x367, 0x20],
		"seenchestcount": [0x404, 0x20],
		"seenkeycount": [0x475, 0x20],
		"chestcount_ram": 0x4B4,
		"keycount_ram": 0x4E2,
		"dungeonindex": 2,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//DP
	{
		"togglename": "chest1",
		"currentcount": 0,
		"chest": [[0xe6, 0x10], [0xe7, 0x04], [0xe8, 0x10], [0x10a, 0x10], [0xea, 0x10], [0x67, 0x08]],
		"compass": [0x365, 0x10],
		"map": [0x369, 0x10],
		"smallkey": 0x4E3,
		"keycount": 0,
		"bigkey": [0x367, 0x10],
		"seenchestcount": [0x404, 0x10],
		"seenkeycount": [0x475, 0x10],
		"chestcount_ram": 0x4B6,
		"keycount_ram": 0x4E3,
		"dungeonindex": 3,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//ToH
	{
		"togglename": "chest2",
		"currentcount": 0,
		"chest": [[0x10f, 0x04], [0xee, 0x10], [0x10e, 0x10], [0x4e, 0x10], [0x4e, 0x20], [0xf, 0x08]],
		"compass": [0x364, 0x20],
		"map": [0x368, 0x20],
		"smallkey": 0x4EA,
		"keycount": 0,
		"bigkey": [0x366, 0x20],
		"seenchestcount": [0x403, 0x20],
		"seenkeycount": [0x474, 0x20],
		"chestcount_ram": 0x4C4,
		"keycount_ram": 0x4EA,
		"dungeonindex": 10,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//PoD
	{
		"togglename": "chest3",
		"currentcount": 0,
		"chest": [[0x12, 0x10], [0x56, 0x10], [0x54, 0x10], [0x54, 0x20], [0x74, 0x10], [0x14, 0x10], [0x34, 0x10], [0x34, 0x20], [0x34, 0x40], [0x32, 0x10], [0x32, 0x20], [0xd4, 0x10], [0xd4, 0x20], [0xb5, 0x08]],
		"compass": [0x365, 0x02],
		"map": [0x369, 0x02],
		"smallkey": 0x4E6,
		"keycount": 0,
		"bigkey": [0x367, 0x02],
		"seenchestcount": [0x404, 0x02],
		"seenkeycount": [0x475, 0x02],
		"chestcount_ram": 0x4BC,
		"keycount_ram": 0x4E6,
		"dungeonindex": 6,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//SP
	{
		"togglename": "chest4",
		"currentcount": 0,
		"chest": [[0x50, 0x10], [0x6e, 0x10], [0x6c, 0x10], [0x6a, 0x10], [0x68, 0x10], [0x8c, 0x10], [0xec, 0x10], [0xec, 0x20], [0xcc, 0x10], [0xd, 0x08]],
		"compass": [0x365, 0x04],
		"map": [0x369, 0x04],
		"smallkey": 0x4E5,
		"keycount": 0,
		"bigkey": [0x367, 0x04],
		"seenchestcount": [0x404, 0x04],
		"seenkeycount": [0x475, 0x04],
		"chestcount_ram": 0x4BA,
		"keycount_ram": 0x4E5,
		"dungeonindex": 5,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//SW
	{
		"togglename": "chest5",
		"currentcount": 0,
		"chest": [[0xce, 0x10], [0xd0, 0x10], [0xae, 0x10], [0xae, 0x20], [0xb0, 0x10], [0xb0, 0x20], [0xb2, 0x10], [0x53, 0x08]],
		"compass": [0x364, 0x80],
		"map": [0x368, 0x80],
		"smallkey": 0x4E8,
		"keycount": 0,
		"bigkey": [0x366, 0x80],
		"seenchestcount": [0x403, 0x80],
		"seenkeycount": [0x474, 0x80],
		"chestcount_ram": 0x4C0,
		"keycount_ram": 0x4E8,
		"dungeonindex": 8,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//TT
	{
		"togglename": "chest6",
		"currentcount": 0,
		"chest": [[0x1b6, 0x10], [0x1b6, 0x20], [0x196, 0x10], [0x1b8, 0x10], [0xca, 0x10], [0x8a, 0x10], [0x88, 0x10], [0x159, 0x08]],
		"compass": [0x364, 0x10],
		"map": [0x368, 0x10],
		"smallkey": 0x4EB,
		"keycount": 0,
		"bigkey": [0x366, 0x10],
		"seenchestcount": [0x403, 0x10],
		"seenkeycount": [0x474, 0x10],
		"chestcount_ram": 0x4C6,
		"keycount_ram": 0x4EB,
		"dungeonindex": 11,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//IP
	{
		"togglename": "chest7",
		"currentcount": 0,
		"chest": [[0x5c, 0x10], [0x7e, 0x10], [0x3e, 0x10], [0xbe, 0x10], [0xfc, 0x10], [0x15c, 0x10], [0x13c, 0x10], [0x1bd, 0x08]],
		"compass": [0x364, 0x40],
		"map": [0x368, 0x40],
		"smallkey": 0x4E9,
		"keycount": 0,
		"bigkey": [0x366, 0x40],
		"seenchestcount": [0x403, 0x40],
		"seenkeycount": [0x474, 0x40],
		"chestcount_ram": 0x4C2,
		"keycount_ram": 0x4E9,
		"dungeonindex": 9,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//MM
	{
		"togglename": "chest8",
		"currentcount": 0,
		"chest": [[0x144, 0x10], [0x166, 0x10], [0x184, 0x10], [0x182, 0x10], [0x1a2, 0x10], [0x186, 0x10], [0x186, 0x20], [0x121, 0x08]],
		"compass": [0x365, 0x01],
		"map": [0x369, 0x01],
		"smallkey": 0x4E7,
		"keycount": 0,
		"bigkey": [0x367, 0x01],
		"seenchestcount": [0x404, 0x01],
		"seenkeycount": [0x475, 0x01],
		"chestcount_ram": 0x4BE,
		"keycount_ram": 0x4E7,
		"dungeonindex": 7,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//TR
	{
		"togglename": "chest9",
		"currentcount": 0,
		"chest": [[0x1ac, 0x10], [0x16e, 0x10], [0x16e, 0x20], [0x16c, 0x10], [0x28, 0x10], [0x48, 0x10], [0x8, 0x10], [0x1aa, 0x10], [0x1aa, 0x20], [0x1aa, 0x40], [0x1aa, 0x80], [0x149, 0x08]],
		"compass": [0x364, 0x08],
		"map": [0x368, 0x08],
		"smallkey": 0x4EC,
		"keycount": 0,
		"bigkey": [0x366, 0x08],
		"seenchestcount": [0x403, 0x08],
		"seenkeycount": [0x474, 0x08],
		"chestcount_ram": 0x4C8,
		"keycount_ram": 0x4EC,
		"dungeonindex": 12,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//GT
	{
		"togglename": "chest10",
		"currentcount": 0,
		"chest": [[0x119, 0x04], [0xf6, 0x10], [0xf6, 0x20], [0xf6, 0x40], [0xf6, 0x80], [0x116, 0x10], [0xfa, 0x10], [0xf8, 0x10], [0xf8, 0x20], [0xf8, 0x40], [0xf8, 0x80], [0x118, 0x10], [0x118, 0x20], [0x118, 0x40], [0x118, 0x80], [0x38, 0x10], [0x38, 0x20], [0x38, 0x40], [0x11a, 0x10], [0x13a, 0x10], [0x13a, 0x20], [0x13a, 0x40], [0x13a, 0x80], [0x7a, 0x10], [0x7a, 0x20], [0x7a, 0x40], [0x9a, 0x10]],
		"compass": [0x364, 0x04],
		"map": [0x368, 0x04],
		"smallkey": 0x4ED,
		"keycount": 0,
		"bigkey": [0x366, 0x04],
		"seenchestcount": [0x403, 0x04],
		"seenkeycount": [0x474, 0x04],
		"chestcount_ram": 0x4CA,
		"keycount_ram": 0x4ED,
		"dungeonindex": 13,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//HC
	{
		"togglename": "chest11",
		"currentcount": 0,
		"chest": [[0xe4, 0x10], [0xe2, 0x10], [0x100, 0x10], [0x64, 0x10], [0x22, 0x10], [0x22, 0x20], [0x22, 0x40], [0x24, 0x10]],
		"compass": [0x365, 0x40],
		"map": [0x369, 0x40],
		"smallkey": 0x4E0,
		"keycount": 0,
		"bigkey": [0x367, 0x40],
		"seenchestcount": [0x404, 0x40],
		"seenkeycount": [0x475, 0x40],
		"chestcount_ram": 0x4B2,
		"keycount_ram": 0x4E1,
		"dungeonindex": 1,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	},
	//CT
	{
		"togglename": "chest12",
		"currentcount": 0,
		"chest": [[0x1c0, 0x10], [0x1a0, 0x10]],
		"compass": [0x365, 0x08],
		"map": [0x369, 0x08],
		"smallkey": 0x4E4,
		"keycount": 0,
		"bigkey": [0x367, 0x08],
		"seenchestcount": [0x404, 0x08],
		"seenkeycount": [0x475, 0x08],
		"chestcount_ram": 0x4B8,
		"keycount_ram": 0x4E4,
		"dungeonindex": 4,
		"subtractedkeysfromchests": false,
		"wastotalknown": false
	}
];
	
var dungeonitemflags = {};

function setMysteryDungeonItems() {
	dungeonitemflags = {
		"wildmaps": flags.wildmaps,
		"wildcompasses": flags.wildcompasses,
		"wildkeys": flags.wildkeys,
		"wildbigkeys": flags.wildbigkeys	
	};
}

var romVersionLow = -1;
var romVersionHigh = -1;
var chestcounts_rom_map = {};
var keycounts_rom_map = {};


function autotrackStartTimer() {
    autotrackTimer = setTimeout(autotrackReadMem, romrequestqueue.length === 0 ? autotrackRefreshInterval : autotrackRefreshIntervalAfterRequest);
}

function autotrackSetStatus(text) {
    document.getElementById("autotrackingstatus").textContent = "Autotracking Status: " + text;
}

function autotrackConnect(host="ws://localhost:" + flags.trackingport) {
    if (autotrackSocket !== null || autotrackReconnectTimer !== null) {
        autotrackDisconnect();
        return;
    }

    autotrackHost = host;
    autotrackSocket = new WebSocket(host);
    autotrackSocket.binaryType = 'arraybuffer';

    autotrackSocket.onclose = function(event) {
        autotrackCleanup();
        autotrackSetStatus("Disconnected: " + event.reason);
    }

    autotrackSocket.onerror = function(event) {
        autotrackCleanup();
        autotrackSetStatus("Error");
    }
    
    autotrackSocket.onopen = autotrackOnConnect;
    
    autotrackSetStatus("Connecting");
    //document.getElementById("autoTrackButton").textContent="Disconnect";

    autotrackReconnectTimer = setTimeout(function () {
        autotrackReconnectTimer = null;
        autotrackCleanup();
        autotrackConnect(autotrackHost);
    }, autotrackTimeoutDelay);
	
	if (flags.unknown === "M") {
		setMysteryDungeonItems();
	}
}

function autotrackDisconnect() {
    if (autotrackReconnectTimer !== null) {
        clearTimeout(autotrackReconnectTimer);
        autotrackReconnectTimer = null;
    }
    autotrackCleanup();
    //document.getElementById("autoTrackButton").textContent="Connect";
}

function autotrackCleanup() {
    if (autotrackTimer !== null) {
        clearTimeout(autotrackTimer);
        autotrackTimer = null;
    }
    if (autotrackSocket !== null) {
        autotrackSocket.onopen = function () {};
        autotrackSocket.onclose = function () {};
        autotrackSocket.onmessage = function () {};
        autotrackSocket.onerror = function () {};
        autotrackSocket.close();
        autotrackSocket = null;
    }

    autotrackPrevData = null;
    //autotrackSetStatus("Disconnected");
}

function autotrackOnConnect(event) {
    autotrackSetStatus("Connected, requesting devices list");

    autotrackSocket.send(JSON.stringify({
        Opcode: "DeviceList",
        Space: "SNES"
    }));
    autotrackSocket.onmessage = autotrackOnDeviceList;
}

function autotrackOnDeviceList(event) {
    var results = JSON.parse(event.data).Results;
    if (results.length < 1) {
        autotrackCleanup();
        autotrackSetStatus("No device found");
        return;
    }
    autotrackDeviceName = results[0];

    autotrackSocket.send(JSON.stringify({
        Opcode : "Attach",
        Space : "SNES",
        Operands : [autotrackDeviceName]
    }));
    autotrackSetStatus("Connected to " + autotrackDeviceName);

    autotrackStartTimer();
}

function autotrackReadMem() {
    function snesread(address, size, callback) {
        autotrackSocket.send(JSON.stringify({
            Opcode : "GetAddress",
            Space : "SNES",
            Operands : [address.toString(16), size.toString(16)]
        }));
        autotrackSocket.onmessage = callback;
    };

	function handleNextRomRequest() {
		if (romrequestqueue.length === 0 || requestcounter >= MAX_REQUESTS_PER_CYCLE) {
			autotrackStartTimer();
            return;
		}
		requestcounter++;
		var nextrequest = romrequestqueue.shift();
		switch (nextrequest[0]) {
			case "romversion":
				snesread(0x007FE0, 4, function (event) {
					var versionBytes = new Uint8Array(event.data);
					romVersionLow = versionBytes[0] + (versionBytes[1] << 8);
					if (romVersionLow >= 0x8000) romVersionLow = 0;
					romVersionHigh = versionBytes[2] + (versionBytes[3] << 8);
					if (romVersionHigh >= 0x8000) romVersionHigh = 0;
					handleNextRomRequest();
				});
				break;
			case "chests":
				snesread(0x187040 + dungeonitemlocations[nextrequest[1]]["dungeonindex"] * 2, 2, function (event) {
					var countBytes = new Uint8Array(event.data);
					chestcounts_rom_map["" + nextrequest[1]] = countBytes[0] + (countBytes[1] << 8);
					handleNextRomRequest();
				});
				break;
			case "keys":
				snesread(0x187010 + dungeonitemlocations[nextrequest[1]]["dungeonindex"], 1, function (event) {
					var countBytes = new Uint8Array(event.data);
					keycounts_rom_map["" + nextrequest[1]] = countBytes[0];
					handleNextRomRequest();
				});
				break;
		}
	}

    if (autotrackReconnectTimer !== null)
        clearTimeout(autotrackReconnectTimer);
    autotrackReconnectTimer = setTimeout(function () {
        autotrackReconnectTimer = null;
        autotrackCleanup();
        autotrackConnect(autotrackHost);
    }, autotrackTimeoutDelay);
    
    snesread(WRAM_START + 0x10, 1, function (event) {
        var gamemode = new Uint8Array(event.data)[0];
        if (![0x07, 0x09, 0x0b].includes(gamemode)) {
            autotrackStartTimer();
            return;
        }
        snesread(SAVEDATA_START, 0x280, function (event2) {
            snesread(SAVEDATA_START + 0x280, 0x280, function (event3) {
                var data = new Uint8Array([...new Uint8Array(event2.data), ...new Uint8Array(event3.data)]);
                autotrackDoTracking(data);
                autotrackPrevData = data;
				requestcounter = 0;
				handleNextRomRequest();
            });
        });
    });
}

function autotrackDoTracking(data) {
    function changed(offset) {
        return autotrackPrevData === null || autotrackPrevData[offset] !== data[offset];
    };
    function disabledbit(offset, mask) {
        return (data[offset] & mask) === 0 && (autotrackPrevData === null || ((autotrackPrevData[offset] & mask) !== 0));
    };
    function newbit(offset, mask) {
        return (data[offset] & mask) !== 0 && (autotrackPrevData === null || ((autotrackPrevData[offset] & mask) !== (data[offset] & mask)));
    };
    function newbit_group(locations) {
        var activated = false;
        for (const location of locations) {
            if ((data[location[0]] & location[1]) === 0)
                return false;
            if (autotrackPrevData === null || ((autotrackPrevData[location[0]] & location[1]) === 0))
                activated = true;
        }
        return activated;
    };

    function updatechest(chest, offset, mask) {
        if (newbit(offset, mask) && !chests[chest].is_opened)
            toggle_chest(chest);
    };
    function updatechest_group(chest, locations) {
        if (newbit_group(locations) && !chests[chest].is_opened)
            toggle_chest(chest);
    };

    function add_request(request) {
		//Check if it's already in the queue
		outerLoop:
		for (var i = 0; i < romrequestqueue.length; i++) {
			var r = romrequestqueue[i];
			if (r.length !== request.length) continue;
			for (var j = 0; j < r.length; j++) {
				if (r[j] !== request[j]) continue outerLoop;
			}
			return;
		}
        romrequestqueue.push(request);
    };
    
	if (flags.entrancemode === 'N') {
		updatechest(0, 0x226, 0x10); // King's Tomb
		updatechest_group(1, [[0x2BB, 0x40], [0x216, 0x10]]); // Sunken Treasure + Flooded Chest
		updatechest(2, 0x208, 0x10); // Link's House
		updatechest(3, 0x1FC, 0x10); // Spiral Cave
		updatechest(4, 0x218, 0x10); // Mimic Cave
		updatechest(5, 0x206, 0x10); // T A V E R N
		updatechest(6, 0x210, 0x10); // Chicken House
		updatechest(7, 0x20C, 0x10); // Brewery
		updatechest(8, 0x238, 0x10); // C House
		updatechest(9, 0x214, 0x10); // Aginah's Cave
		updatechest_group(10, [[0x21A, 0x10], [0x21A, 0x20]]); // Mire Shed Left + Right
		updatechest_group(11, [[0x1F0, 0x10], [0x1F0, 0x20]]); // Superbunny Cave Top + Bottom
		updatechest_group(12, [[0x20A, 0x10], [0x20A, 0x20], [0x20A, 0x40]]); // Sahasrahla's Hut Left + Middle + Right
		updatechest(13, 0x22E, 0x10); // Spike Cave
		updatechest_group(14, [[0x05E, 0x10], [0x05E, 0x20], [0x05E, 0x40], [0x05E, 0x80], [0x05F, 0x01]]); // Kakariko Well Top + Left + Middle + Right + Bottom
		updatechest_group(15, [[0x23A, 0x10], [0x23A, 0x20], [0x23A, 0x40], [0x23A, 0x80], [0x23B, 0x01]]); // Blind's Hut Top + Left + Right + Far Left + Far Right
		updatechest_group(16, [[0x23C, 0x10], [0x23C, 0x20], [0x23C, 0x40], [0x23C, 0x80], [0x23D, 0x04]]); // Hype Cave Top + Left + Right + Bottom + NPC
		updatechest_group(17, [[0x1DE, 0x10], [0x1DE, 0x20], [0x1DE, 0x40], [0x1DE, 0x80], [0x1DF, 0x01], [0x1FE, 0x10], [0x1FE, 0x20]]); // Paradox Lower (Far Left + Left + Right + Far Right + Middle) + Upper (Left + Right)
		updatechest(18, 0x248, 0x10); // Bonk Rock
		updatechest_group(19, [[0x246, 0x10], [0x246, 0x20], [0x246, 0x40], [0x246, 0x80], [0x247, 0x04]]); // Mini Moldorms Cave Far Left + Left + Right + Far Right + NPC
		updatechest(20, 0x240, 0x10); // Ice Rod Cave
		updatechest(21, 0x078, 0x80); // Hookshot Cave Bottom Right
		updatechest_group(22, [[0x078, 0x10], [0x078, 0x20], [0x078, 0x40]]); // Hookshot Cave Top Right + Top Left + Bottom Left
		updatechest(23, 0x20D, 0x04); // Chest Game
		updatechest(24, 0x3C9, 0x02); // Bottle Vendor
		updatechest(25, 0x410, 0x10); // Sahasrahla (GP)
		updatechest(26, 0x410, 0x08); // Stump Kid
		updatechest(27, 0x410, 0x04); // Sick Kid
		updatechest(28, 0x3C9, 0x10); // Purple Chest
		updatechest(29, 0x3C9, 0x01); // Hobo
		updatechest(30, 0x411, 0x01); // Ether Tablet
		updatechest(31, 0x411, 0x02); // Bombos Tablet
		updatechest(32, 0x410, 0x20); // Catfish
		updatechest(33, 0x410, 0x02); // King Zora
		updatechest(34, 0x410, 0x01); // Lost Old Man
		updatechest(35, 0x411, 0x20); // Potion Shop
		updatechest(36, 0x1C3, 0x02); // Lost Wood Hideout
		updatechest(37, 0x1C5, 0x02); // Lumberjack
		updatechest(38, 0x1D5, 0x04); // Spectacle Rock Cave
		updatechest(39, 0x237, 0x04); // Cave 45
		updatechest(40, 0x237, 0x02); // Graveyard Ledge
		updatechest(41, 0x24D, 0x02); // Checkerboard Cave
		updatechest(42, 0x24F, 0x04); // Hammer Pegs
		updatechest(43, 0x410, 0x80); // Library
		updatechest(44, 0x411, 0x10); // Mushroom
		updatechest(45, 0x283, 0x40); // Spectacle Rock
		updatechest(46, 0x285, 0x40); // Floating Island
		updatechest(47, 0x2A8, 0x40); // Race Game
		updatechest(48, 0x2B0, 0x40); // Desert Ledge
		updatechest(49, 0x2B5, 0x40); // Lake Hylia Island
		updatechest(50, 0x2CA, 0x40); // Bumper Cave
		updatechest(51, 0x2DB, 0x40); // Pyramid
		updatechest(52, 0x2E8, 0x40); // Dig Game
		updatechest(53, 0x301, 0x40); // Zora's Ledge
		updatechest(54, 0x2AA, 0x40); // Dig/Flute Spot
		updatechest_group(56, [[0x3C6, 0x01], [0x0AA, 0x10]]); // Uncle + Passage
		updatechest(59, 0x411, 0x80); // Magic Bat
		updatechest(60, 0x411, 0x04); // Blacksmith
		updatechest_group(61, [[0x22C, 0x10], [0x22C, 0x20]]); // Fat Fairy Left + Right
		updatechest(62, 0x300, 0x40); // Pedestal
		updatechest_group(64, [[0x228, 0x10], [0x228, 0x20]]); // Waterfall Fairy Left + Right
		updatechest_group(55, [[0x022, 0x10], [0x022, 0x20], [0x022, 0x40]]); // Sewers Left + Middle + Right
		updatechest_group(57, [[0x0E4, 0x10], [0x0E2, 0x10], [0x100, 0x10]]); // Hyrule Castle Map + Boomerang + Zelda
		updatechest(58, 0x024, 0x10); // Sanctuary
		updatechest(63, 0x064, 0x10); // Hyrule Castle - Dark Cross
		updatechest(65, 0x1C0, 0x10); // Castle Tower - Room 03
		updatechest(66, 0x1A0, 0x10); // Castle Tower - Dark Maze
	} else {
		updatechest(0, 0x2BB, 0x40); // Sunken Treasure
		updatechest(1, 0x208, 0x10); // Link's House
		updatechest(2, 0x3C9, 0x02); // Bottle Vendor
		updatechest(3, 0x410, 0x08); // Stump Kid
		updatechest(4, 0x3C9, 0x10); // Purple Chest
		updatechest(5, 0x3C9, 0x01); // Hobo
		updatechest(6, 0x411, 0x01); // Ether Tablet
		updatechest(7, 0x411, 0x02); // Bombos Tablet
		updatechest(8, 0x410, 0x20); // Catfish
		updatechest(9, 0x410, 0x02); // King Zora
		updatechest(10, 0x410, 0x01); // Lost Old Man
		updatechest(11, 0x411, 0x10); // Mushroom
		updatechest(12, 0x283, 0x40); // Spectacle Rock
		updatechest(13, 0x285, 0x40); // Floating Island
		updatechest(14, 0x2A8, 0x40); // Race Game
		updatechest(15, 0x2B0, 0x40); // Desert Ledge
		updatechest(16, 0x2B5, 0x40); // Lake Hylia Island
		updatechest(17, 0x2CA, 0x40); // Bumper Cave
		updatechest(18, 0x2DB, 0x40); // Pyramid
		updatechest(19, 0x2E8, 0x40); // Dig Game
		updatechest(20, 0x301, 0x40); // Zora's Ledge
		updatechest(21, 0x2AA, 0x40); // Dig/Flute Spot
		updatechest(22, 0x300, 0x40); // Pedestal
	}
	
    function update_boss(boss, offset) {
        if (newbit(offset, 0x08) && !items[boss]) {
            click_map();
            toggle(boss);
        }
    };
    update_boss("boss0", 0x191); // Eastern Palace
    update_boss("boss1", 0x067); // Desert Palace
    update_boss("boss2", 0x00F); // Hera
    update_boss("boss3", 0x0B5); // Palace of Darkness
    update_boss("boss4", 0x00D); // Swamp Palace
    update_boss("boss5", 0x053); // Skull Woods
    update_boss("boss6", 0x159); // Thieves Town
    update_boss("boss7", 0x1BD); // Ice Palace
    update_boss("boss8", 0x121); // Misery Mire
    update_boss("boss9", 0x149); // Turtle Rock
    update_boss("agahnim2", 0x01B); // Ganons Tower

    function updatesmallkeys(dungeon, offset) {
        if (changed(offset)) {
            var newkeys = autotrackPrevData === null ? data[offset] : (data[offset] - autotrackPrevData[offset] + items["smallkey" + dungeon]);
            if (newkeys > items["smallkey" + dungeon]) {
                document.getElementById("smallkey" + dungeon).innerHTML = newkeys;
                items["smallkey" + dungeon] = newkeys;
                updateMapTracker();
            }
        }
    };

    updatesmallkeys("0", 0x4E2);
    updatesmallkeys("1", 0x4E3);
    updatesmallkeys("2", 0x4EA);
    updatesmallkeys("3", 0x4E6);
    updatesmallkeys("4", 0x4E5);
    updatesmallkeys("5", 0x4E8);
    updatesmallkeys("6", 0x4EB);
    updatesmallkeys("7", 0x4E9);
    updatesmallkeys("8", 0x4E7);
    updatesmallkeys("9", 0x4EC);
    updatesmallkeys("10", 0x4ED); // GT
    updatesmallkeys("half0", 0x4E1); // Sewers and Hyrule Castle
    updatesmallkeys("half1", 0x4E4); // Castle Tower

    function updatebigkey(dungeon, offset, mask) {
        if (newbit(offset, mask) && !items["bigkey" + dungeon]) {
            click_map();
            toggle("bigkey" + dungeon);
        }
    };
	
    updatebigkey("0", 0x367, 0x20);
    updatebigkey("1", 0x367, 0x10);
    updatebigkey("2", 0x366, 0x20);
    updatebigkey("3", 0x367, 0x02);
    updatebigkey("4", 0x367, 0x04);
    updatebigkey("5", 0x366, 0x80);
    updatebigkey("6", 0x366, 0x10);
    updatebigkey("7", 0x366, 0x40);
    updatebigkey("8", 0x367, 0x01);
    updatebigkey("9", 0x366, 0x08);
    updatebigkey("10", 0x366, 0x04);
    updatebigkey("half0", 0x367, 0xC0);
    updatebigkey("half1", 0x367, 0x08);

    function setitem(item, value) {
        click_map();
		if (item != 'mushroom') {
			while (items[item] != value)
				toggle(item);
		} else {
			if (!window.mushroomfound) {
				while (items[item] != value)
					toggle(item);
			}
		}
    };

	if (changed(0x343)) // Bombs
        setitem("bomb", data[0x343] > 0);

    if (changed(0x3C5) && data[0x3C5] >= 3) // Agahnim Killed
        setitem("agahnim", true);

	if (newbit(0x38E, 0xC0)) {
        var bits = data[0x38E] & 0xC0;
        setitem("bow", bits == 0x40 && flags.nonprogressivebows ? 1 : (bits == 0x80 ? 2 : 3));
    }
	
    if (newbit(0x38C, 0xC0)) {
        var bits = data[0x38C] & 0xC0;
        setitem("boomerang", bits == 0x80 ? 1 : (bits == 0x40 ? 2 : 3));
    }

    if (disabledbit(0x38C, 0x20))
        setitem("mushroom", false);
	
    if (newbit(0x38C, 0x20))
        setitem("mushroom", true);
	
    if (newbit(0x38C, 0x10))
        setitem("powder", true);

    if (newbit(0x38C, 0x04))
        setitem("shovel", true);
	
    if (newbit(0x38C, 0x03))
        setitem("flute", true);

    if (newbit(0x342, 0x01))
        setitem("hookshot", true);

    if (newbit(0x345, 0x01))
        setitem("firerod", true);

    if (newbit(0x346, 0x01))
        setitem("icerod", true);

    if (newbit(0x347, 0x01))
        setitem("bombos", true);

    if (newbit(0x348, 0x01))
        setitem("ether", true);

    if (newbit(0x349, 0x01))
        setitem("quake", true);

    if (newbit(0x34A, 0x01))
        setitem("lantern", true);

    if (newbit(0x34B, 0x01))
        setitem("hammer", true);

    if (newbit(0x34D, 0x01))
        setitem("net", true);

    if (newbit(0x34E, 0x01))
        setitem("book", true);

    if (newbit(0x350, 0x01))
        setitem("somaria", true);

    if (newbit(0x351, 0x01))
        setitem("byrna", true);

    if (newbit(0x352, 0x01))
        setitem("cape", true);

    if (newbit(0x353, 0x02))
        setitem("mirror", true);

    if (newbit(0x355, 0x01))
        setitem("boots", true);

    if (newbit(0x356, 0x01))
        setitem("flippers", true);

    if (newbit(0x357, 0x01))
        setitem("moonpearl", true);

    if (changed(0x354))
        setitem("glove", data[0x354]);

    if (changed(0x359))
        setitem("sword", (flags['swordmode'] === 'S' || data[0x359] == 0xFF) ? 0 : data[0x359]);

    if (changed(0x35A))
        setitem("shield", data[0x35A]);

    if (changed(0x35B))
        setitem("tunic", data[0x35B] + 1);

    if (changed(0x37B))
        setitem("magic", data[0x37B] > 0);
	
	if (flags.wildmaps) {
		if (newbit(0x369, 0x20) && prizes[0] === 0)
			setmap(0, 5);
		
		if (newbit(0x369, 0x10) && prizes[1] === 0)
			setmap(1, 5);
		
		if (newbit(0x368, 0x20) && prizes[2] === 0)
			setmap(2, 5);
		
		if (newbit(0x369, 0x02) && prizes[3] === 0)
			setmap(3, 5);
		
		if (newbit(0x369, 0x04) && prizes[4] === 0)
			setmap(4, 5);
		
		if (newbit(0x368, 0x80) && prizes[5] === 0)
			setmap(5, 5);
		
		if (newbit(0x368, 0x10) && prizes[6] === 0)
			setmap(6, 5);
		
		if (newbit(0x368, 0x40) && prizes[7] === 0)
			setmap(7, 5);
		
		if (newbit(0x369, 0x01) && prizes[8] === 0)
			setmap(8, 5);
		
		if (newbit(0x368, 0x08) && prizes[9] === 0)
			setmap(9, 5);
	}
	
	if (flags.wildcompasses) {
		if (newbit(0x365, 0x20) && enemizer[0] === 0)
			setcompass(0, 11);
		
		if (newbit(0x365, 0x10) && enemizer[1] === 0)
			setcompass(1, 11);
		
		if (newbit(0x364, 0x20) && enemizer[2] === 0)
			setcompass(2, 11);
		
		if (newbit(0x365, 0x02) && enemizer[3] === 0)
			setcompass(3, 11);
		
		if (newbit(0x365, 0x04) && enemizer[4] === 0)
			setcompass(4, 11);
		
		if (newbit(0x364, 0x80) && enemizer[5] === 0)
			setcompass(5, 11);
		
		if (newbit(0x364, 0x10) && enemizer[6] === 0)
			setcompass(6, 11);
		
		if (newbit(0x364, 0x40) && enemizer[7] === 0)
			setcompass(7, 11);
		
		if (newbit(0x365, 0x01) && enemizer[8] === 0)
			setcompass(8, 11);
		
		if (newbit(0x364, 0x08) && enemizer[9] === 0)
			setcompass(9, 11);
	}
	
	function setmap(dungeon, value) {
		rightClickPrize(dungeon);
    };
	
	function setcompass(dungeon, value) {
		rightClickEnemy(dungeon);
    };
	
	for (let i = 0; i < 4; i++) {
        const bottleLoc = 0x35C + i;
        if (changed(bottleLoc)) {
			if (data[bottleLoc] > 0)
			{
				setitem("bottle" + (i + 1).toString(), data[bottleLoc] - 1);
			}
			else
			{
				setitem("bottle" + (i + 1).toString(), 0);
			}
        }
    }
	
	if (flags.autotracking === "Y") {
		// Check for Mystery changes, and if so, reset the flags and the current counts
		if (flags.unknown === "M") {
			if (flags.wildmaps != dungeonitemflags.wildmaps || flags.wildcompasses != dungeonitemflags.wildcompasses || flags.wildkeys != dungeonitemflags.wildkeys || flags.wildbigkeys != dungeonitemflags.wildbigkeys) {
				dungeonitemlocations[0]["currentcount"] = items.chest0;
				dungeonitemlocations[1]["currentcount"] = items.chest1;
				dungeonitemlocations[2]["currentcount"] = items.chest2;
				dungeonitemlocations[3]["currentcount"] = items.chest3;
				dungeonitemlocations[4]["currentcount"] = items.chest4;
				dungeonitemlocations[5]["currentcount"] = items.chest5;
				dungeonitemlocations[6]["currentcount"] = items.chest6;
				dungeonitemlocations[7]["currentcount"] = items.chest7;
				dungeonitemlocations[8]["currentcount"] = items.chest8;
				dungeonitemlocations[9]["currentcount"] = items.chest9;
				dungeonitemlocations[10]["currentcount"] = items.chest10;
				dungeonitemlocations[11]["currentcount"] = items.chest11;
				dungeonitemlocations[12]["currentcount"] = items.chest12;
				setMysteryDungeonItems();
			}
		}
		
		for (let i = 0; i < dungeonitemlocations.length; i++) {
			//In Vanilla and Basic Doors, the total chest and key counts are always known, but not in Crossed
			if (flags.doorshuffle === 'N' || flags.doorshuffle === 'B') {
				var haschanged = false;
				var oldcount = dungeonitemlocations[i]["currentcount"];
				var currentcount = oldcount;

				for (let j = 0; j < dungeonitemlocations[i]["chest"].length; j++) {
					if (newbit(dungeonitemlocations[i]["chest"][j][0], dungeonitemlocations[i]["chest"][j][1])) {
						currentcount++;
						haschanged = true;
						//console.log("i: " + i.toString() + " j: " + j.toString());
					}
				}
				
				if (haschanged) {
					//If it is a dungeon item and it isn't wild, increment oldcount so currentcount doesn't change
					if (!flags.wildmaps && newbit(dungeonitemlocations[i]["map"][0], dungeonitemlocations[i]["map"][1])) oldcount++;
					if (!flags.wildcompasses && newbit(dungeonitemlocations[i]["compass"][0], dungeonitemlocations[i]["compass"][1])) oldcount++;
					if (!flags.wildkeys && data[dungeonitemlocations[i]["smallkey"]] > dungeonitemlocations[i]["keycount"])
					{
						var newkeys = data[dungeonitemlocations[i]["smallkey"]] - dungeonitemlocations[i]["keycount"];
						oldcount += newkeys;
						dungeonitemlocations[i]["keycount"] += newkeys;
					}
					if (!flags.wildbigkeys && newbit(dungeonitemlocations[i]["bigkey"][0], dungeonitemlocations[i]["bigkey"][1])) oldcount++;
					
					while (oldcount != currentcount) {
						if (oldcount < currentcount) {
							if (items["chest" + i] === 0) break;
							toggle(dungeonitemlocations[i]["togglename"]);
							oldcount++;
						} else {
							rightClickChest(dungeonitemlocations[i]["togglename"]);
							oldcount--;
						}
					}
					
					//Save the value for the next change
					dungeonitemlocations[i]["currentcount"] = currentcount;
				}
			} else {
				//Check baserom version to ensure we're only reading the correct and allowed values from the ROM
				if (romVersionHigh === -1) {
					add_request(["romversion"]);
					return;
				}
				//Old versions not supported
				if (romVersionHigh < 5) {
					return;
				}
				if (!flags.crosseddoorsknownchestsmode) {
					//Check if the total key count is known to the player according to the game
					if (data[dungeonitemlocations[i]["seenkeycount"][0]] & dungeonitemlocations[i]["seenkeycount"][1]) {
						//Check if the total key count has already been read from the ROM, otherwise request it
						if (!keycounts_rom_map.hasOwnProperty("" + i)) {
							add_request(["keys", i]);
						}
					}
				}
				//Check if the total chest count is already marked as known in the tracker
				if (items["chestknown" + i]) {
					if (dungeonitemlocations[i]["wastotalknown"]) {
						//It was already known before, so the current chest count is expected to be accurate
						var oldcount = dungeonitemlocations[i]["currentcount"];
						var currentcount = data[dungeonitemlocations[i]["chestcount_ram"]] + (data[dungeonitemlocations[i]["chestcount_ram"] + 1] << 8);
						
						if (currentcount > oldcount || (!flags.crosseddoorsknownchestsmode && !flags.wildkeys && keycounts_rom_map.hasOwnProperty("" + i) && !dungeonitemlocations[i]["subtractedkeysfromchests"])) {
							//If it is a dungeon item and it isn't wild, increment oldcount so currentcount doesn't change
							if (!flags.wildmaps && newbit(dungeonitemlocations[i]["map"][0], dungeonitemlocations[i]["map"][1])) oldcount++;
							if (!flags.wildcompasses && newbit(dungeonitemlocations[i]["compass"][0], dungeonitemlocations[i]["compass"][1])) oldcount++;
							if (flags.crosseddoorsknownchestsmode) {
								if (!flags.wildkeys && data[dungeonitemlocations[i]["smallkey"]] > dungeonitemlocations[i]["keycount"])
								{
									var newkeys = data[dungeonitemlocations[i]["smallkey"]] - dungeonitemlocations[i]["keycount"];
									oldcount += newkeys;
									dungeonitemlocations[i]["keycount"] += newkeys;
								}
								if (!flags.wildbigkeys && newbit(dungeonitemlocations[i]["bigkey"][0], dungeonitemlocations[i]["bigkey"][1])) oldcount++;
							} else {
								//Count keys we didn't know about as items since we haven't subtracted them from the total count
								if (!flags.wildkeys && keycounts_rom_map.hasOwnProperty("" + i)) {
									if (!dungeonitemlocations[i]["subtractedkeysfromchests"]) {
										dungeonitemlocations[i]["keycount"] = data[dungeonitemlocations[i]["smallkey"]];
										var remaining_keys = Math.max(0, keycounts_rom_map["" + i] - dungeonitemlocations[i]["keycount"]);
										oldcount -= remaining_keys;
										dungeonitemlocations[i]["subtractedkeysfromchests"] = true;
									} else {
										if (data[dungeonitemlocations[i]["smallkey"]] > dungeonitemlocations[i]["keycount"])
										{
											var newkeys = data[dungeonitemlocations[i]["smallkey"]] - dungeonitemlocations[i]["keycount"];
											oldcount += newkeys;
											dungeonitemlocations[i]["keycount"] += newkeys;
										}
									}
								}
							}
							
							while (oldcount != currentcount) {
								if (oldcount < currentcount) {
									if (items["chest" + i] === 0) break;
									toggle(dungeonitemlocations[i]["togglename"]);
									oldcount++;
								} else {
									rightClickChest(dungeonitemlocations[i]["togglename"]);
									oldcount--;
								}
							}
							//Save the value for the next change
							dungeonitemlocations[i]["currentcount"] = currentcount;
						}
					} else {
						//This is new information, so initialize some values
						dungeonitemlocations[i]["wastotalknown"] = true;
						dungeonitemlocations[i]["currentcount"] = data[dungeonitemlocations[i]["chestcount_ram"]] + (data[dungeonitemlocations[i]["chestcount_ram"] + 1] << 8);
						dungeonitemlocations[i]["keycount"] = data[dungeonitemlocations[i]["smallkey"]];
					}
				} else {
					if (dungeonitemlocations[i]["wastotalknown"]) {
						dungeonitemlocations[i]["subtractedkeysfromchests"] = false;
						dungeonitemlocations[i]["wastotalknown"] = false;
						dungeonitemlocations[i]["currentcount"] = 0;
						dungeonitemlocations[i]["keycount"] = 0;
					}
					if (!flags.crosseddoorsknownchestsmode) {
						//Check if the total chest count is known to the player according to the game, otherwise we can't autotrack
						if (data[dungeonitemlocations[i]["seenchestcount"][0]] & dungeonitemlocations[i]["seenchestcount"][1]) {
							//Check if the total chest count has already been read from the ROM, otherwise request it
							if (chestcounts_rom_map.hasOwnProperty("" + i)) {
								//We now know the total chest count
								dungeonitemlocations[i]["wastotalknown"] = true;
								clickCompass(i);
								var total_chests = chestcounts_rom_map["" + i];
								var current_chests = data[dungeonitemlocations[i]["chestcount_ram"]] + (data[dungeonitemlocations[i]["chestcount_ram"] + 1] << 8);
								var remaining_chests = Math.max(0, total_chests - current_chests);
								//Subtract known dungeon items still in the dungeon from remaining items
								var remaining_items = remaining_chests;
								if (!flags.wildmaps && (data[dungeonitemlocations[i]["map"][0]] & dungeonitemlocations[i]["map"][1]) === 0) remaining_items--;
								if (!flags.wildcompasses && (data[dungeonitemlocations[i]["compass"][0]] & dungeonitemlocations[i]["compass"][1]) === 0) remaining_items--;
								//Small keys are handled later, big keys are always counted as items
								dungeonitemlocations[i]["currentcount"] = current_chests;
								if (total_chests > 0) {
									items["chest" + i] = remaining_items >= doorsmaxchests ? 0 : remaining_items + 1;
									toggle(dungeonitemlocations[i]["togglename"]);
								}
							} else {
								add_request(["chests", i]);
							}
						}
					}
				}
			}
		}
	}

}
