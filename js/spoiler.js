(function(window) {
    'use strict';

	window.spoilerLoaded = false;
	var spoiler;

    function caption_to_html(caption) {
        return caption.replace(/\{(\w+?)(\d+)?\}/g, function(__, name, n) {
            var dash = /medallion|pendant/.test(name)
            return '<div class="icon ' +
                (dash ? name + '-' + n :
                n ? name + ' active-' + n :
                name) + '"></div>';
        });
    }

	window.isTrashItem = function(itemName)
	{
		return trashItems.includes(itemName) || (mapsAreTrash && itemName.startsWith("Map")) || (compassesAreTrash && itemName.startsWith("Compass"))
	}

	window.setDungeonContents = function(dungeonIndex,region,prefix,locationNames)
	{
		var contents = [],niceString = "",trashString = "";
		for(var i = 0; i < locationNames.length; i++)
		{
			var locationName = locationNames[i],fullName = prefix+locationName;
			if(fullName in region)
			{
				var item = region[fullName],niceName = getNiceName(item),itemAtLocation = niceName+" at "+locationName;
				contents[locationName] = niceName;
				if(isTrashItem(item))
				{
					trashString = trashString === "" ?itemAtLocation :trashString+", "+itemAtLocation;
				}
				else
				{
					niceString = niceString === "" ?itemAtLocation :niceString+", "+itemAtLocation;
				}
			}
			else
				alert("Could not find location "+fullName+" (dungeon index "+dungeonIndex+")");
		}
		dungeonContents[dungeonIndex] = contents;
		dungeons[dungeonIndex].niceContent = niceString;
		dungeons[dungeonIndex].trashContent = trashString;
	}

	window.setContent = function(chestIndex,region,locationName)
	{
		if(locationName in region)
		{
			var item = region[locationName];
			chests[chestIndex].content = getNiceName(item);
			if(isTrashItem(item) && !chests[chestIndex].is_opened)
				window.toggle_chest(chestIndex);
		}
		else
			alert("Could not find location "+locationName);
	}

	window.setContents = function(chestIndex,region,locationNames)
	{
		var content = "",trash = true;
		for(var i = 0; i < locationNames.length; i++)
		{
			var locationName = locationNames[i];
			if(locationName in region)
			{
				var item = region[locationName];
				content += content === "" ?getNiceName(item) :", "+getNiceName(item);
				if(trash && !isTrashItem(item))
					trash = false;
			}
			else
				alert("Could not find location "+locationName+" (chest index "+chestIndex+")");
		}
		chests[chestIndex].content = content;
		if(trash && content !== "" && !chests[chestIndex].is_opened)
			window.toggle_chest(chestIndex);
	}

	window.setPrize = function(dungeonIndex,region,locationName)
	{
		if(locationName in region)
		{
			var prize = region[locationName];
			switch(prize)
			{
			case "PendantOfCourage":
				prizes[dungeonIndex] = 0;
				break;
			case "PendantOfWisdom":
			case "PendantOfPower":
				prizes[dungeonIndex] = 1;
				break;
			case "Crystal1":
			case "Crystal2":
			case "Crystal3":
			case "Crystal4":
			case "Crystal7":
				prizes[dungeonIndex] = 2;
				break;
			case "Crystal5":
			case "Crystal6":
				prizes[dungeonIndex] = 3;
				break;
			default:
				prizes[dungeonIndex] = 4;
			}
			window.toggle_dungeon(dungeonIndex);
		}
		else
			alert("Could not find location "+locationName);
	}

	window.setBoss = function(index,region,locationName)
	{
		if(locationName in region)
		{
			var boss = region[locationName];
			switch(boss)
			{
			case "Armos Knights":
				enemizer[index] = 0;
				break;
			case "Lanmolas":
				enemizer[index] = 1;
				break;
			case "Moldorm":
				enemizer[index] = 2;
				break;
			case "Helmasaur King":
				enemizer[index] = 3;
				break;
			case "Arrghus":
				enemizer[index] = 4;
				break;
			case "Mothula":
				enemizer[index] = 5;
				break;
			case "Blind":
				enemizer[index] = 6;
				break;
			case "Kholdstare":
				enemizer[index] = 7;
				break;
			case "Vitreous":
				enemizer[index] = 8;
				break;
			case "Trinexx":
				enemizer[index] = 9;
				break;
			default:
				enemizer[index] = 10;
			}
			window.toggle_enemy(index);
		}
		else
			alert("Could not find location "+locationName);
	}

	window.setMedallion = function(index,region,locationName)
	{
		if(locationName in region)
		{
			var prize = region[locationName];
			switch(prize)
			{
			case "Bombos":
				medallions[index] = 0;
				break;
			case "Ether":
				medallions[index] = 1;
				break;
			case "Quake":
				medallions[index] = 2;
				break;
			default:
				medallions[index] = 3;
			}
			window.toggle_medallion(index);
		}
		else
			alert("Could not find location "+locationName);
	}
	
	window.getNiceName = function(name)
	{
		switch(name)
		{
		case "OneRupee":
			return "Rupee";
		case "FiveRupees":
			return "5 Rupees";
		case "TwentyRupees":
		case "TwentyRupees2":
			return "20 Rupees";
		case "FiftyRupees":
			return "50 Rupees";
		case "OneHundredRupees":
			return "100 Rupees";
		case "ThreeHundredRupees":
			return "300 Rupees";
		case "ThreeBombs":
			return "3 Bombs";
		case "TenBombs":
			return "10 Bombs";
		case "Arrow":
			return "Arrow";
		case "TenArrows":
			return "10 Arrows";
		case "PieceOfHeart":
			return "Heart Piece";
		case "BossHeartContainer":
			return "Heart Container";
		case "HeartContainer":
			return "Sanctuary Heart";
		case "UncleSword":
		case "ProgressiveSword":
			return "Sword";
		case "ProgressiveShield":
			return "Shield";
		case "ProgressiveArmor":
			return "Armor";
		case "ProgressiveGlove":
			return "Gloves";
		case "SilverArrowUpgrade":
			return "Silver Arrows";
        case "ProgressiveBow":
        case "Bow":
        case "BowAndArrows":
            return "Bow";
        case "BowAndSilverArrows":
            return "Bow And Silver Arrows";
		case "Bottle":
			return "Bottle";
		case "BottleWithRedPotion":
			return "Bottle (Red Potion)";
		case "BottleWithGreenPotion":
			return "Bottle (Green Potion)";
		case "BottleWithBluePotion":
			return "Bottle (Blue Potion)";
		case "BottleWithFairy":
			return "Bottle (Fairy)";
		case "BottleWithBee":
			return "Bottle (Bee)";
		case "BottleWithGoldBee":
			return "Bottle (Gold Bee)";
		case "OcarinaActive":
			return "Flute (active)";
		case "OcarinaInactive":
			return "Flute";
		case "FireRod":
			return "Fire Rod";
		case "IceRod":
			return "Ice Rod";
		case "CaneOfSomaria":
			return "Cane of Somaria";
		case "CaneOfByrna":
			return "Cane of Byrna";
		case "MagicMirror":
			return "Mirror";
		case "BookOfMudora":
			return "Book of Mudora";
		case "MoonPearl":
			return "Moon Pearl";
		case "BugCatchingNet":
			return "Bug Net";
		case "Boomerang":
			return "Blue Boomerang";
		case "RedBoomerang":
			return "Red Boomerang";
		case "PegasusBoots":
			return "Pegasus Boots";
		case "HalfMagic":
			return "Half Magic";
		case "QuarterMagic":
			return "Quarter Magic";
		case "TriforcePieces":
			return "Triforce Piece";
		case "Rupoor":
			return "Rupoor";
		case "KeyH1":
		case "KeyH2":
			return "HC Key";
		case "KeyP1":
			return "EP Key";
		case "KeyP2":
			return "DP Key";
		case "KeyP3":
			return "ToH Key";
		case "KeyD1":
			return "PoD Key";
		case "KeyD2":
			return "SP Key";
		case "KeyD3":
			return "SW Key";
		case "KeyD4":
			return "TT Key";
		case "KeyD5":
			return "IP Key";
		case "KeyD6":
			return "MM Key";
		case "KeyD7":
			return "TR Key";
		case "KeyA1":
			return "CT Key";
		case "KeyA2":
			return "GT Key";
		case "Key":
		case "KeyGK":
			return "Key";
		case "BigKeyH1":
		case "BigKeyH2":
			return "HC Big Key";
		case "BigKeyP1":
			return "EP Big Key";
		case "BigKeyP2":
			return "DP Big Key";
		case "BigKeyP3":
			return "ToH Big Key";
		case "BigKeyD1":
			return "PoD Big Key";
		case "BigKeyD2":
			return "SP Big Key";
		case "BigKeyD3":
			return "SW Big Key";
		case "BigKeyD4":
			return "TT Big Key";
		case "BigKeyD5":
			return "IP Big Key";
		case "BigKeyD6":
			return "MM Big Key";
		case "BigKeyD7":
			return "TR Big Key";
		case "BigKeyA1":
			return "CT Big Key";
		case "BigKeyA2":
			return "GT Big Key";
		case "BigKey":
		case "BigKeyGK":
			return "Big Key";
		case "MapH1":
		case "MapH2":
			return "HC Map";
		case "MapP1":
			return "EP Map";
		case "MapP2":
			return "DP Map";
		case "MapP3":
			return "ToH Map";
		case "MapD1":
			return "PoD Map";
		case "MapD2":
			return "SP Map";
		case "MapD3":
			return "SW Map";
		case "MapD4":
			return "TT Map";
		case "MapD5":
			return "IP Map";
		case "MapD6":
			return "MM Map";
		case "MapD7":
			return "TR Map";
		case "MapA1":
			return "CT Map";
		case "MapA2":
			return "GT Map";
		case "Map":
		case "MapGK":
			return "Map";
		case "CompassH1":
		case "CompassH2":
			return "HC Compass";
		case "CompassP1":
			return "EP Compass";
		case "CompassP2":
			return "DP Compass";
		case "CompassP3":
			return "ToH Compass";
		case "CompassD1":
			return "PoD Compass";
		case "CompassD2":
			return "SP Compass";
		case "CompassD3":
			return "SW Compass";
		case "CompassD4":
			return "TT Compass";
		case "CompassD5":
			return "IP Compass";
		case "CompassD6":
			return "MM Compass";
		case "CompassD7":
			return "TR Compass";
		case "CompassA1":
			return "CT Compass";
		case "CompassA2":
			return "GT Compass";
		case "Compass":
		case "CompassGK":
			return "Compass";
		default:
			return name;
		}
	}
	
	window.loadSpoiler = function(s)
	{
		spoiler = s;
		var light = spoiler["Light World"],dark = spoiler["Dark World"],mountain = spoiler["Death Mountain"],bosses = spoiler["Bosses"],special = spoiler["Special"];
		var ep = spoiler["Eastern Palace"],dp = spoiler["Desert Palace"],toh = spoiler["Tower Of Hera"],castle = spoiler["Hyrule Castle"],aga = spoiler["Castle Tower"];
		var pod = spoiler["Dark Palace"],sp = spoiler["Swamp Palace"],sw = spoiler["Skull Woods"],tt = spoiler["Thieves Town"],ip = spoiler["Ice Palace"],mm = spoiler["Misery Mire"],tr = spoiler["Turtle Rock"],gt = spoiler["Ganons Tower"];
		
		
		
		window.setPrize(0,ep,"Eastern Palace - Prize");
		window.setPrize(1,dp,"Desert Palace - Prize");
		window.setPrize(2,toh,"Tower of Hera - Prize");
		window.setPrize(3,pod,"Palace of Darkness - Prize");
		window.setPrize(4,sp,"Swamp Palace - Prize");
		window.setPrize(5,sw,"Skull Woods - Prize");
		window.setPrize(6,tt,"Thieves' Town - Prize");
		window.setPrize(7,ip,"Ice Palace - Prize");
		window.setPrize(8,mm,"Misery Mire - Prize");
		window.setPrize(9,tr,"Turtle Rock - Prize");
		window.setBoss(0,bosses,"Eastern Palace");
		window.setBoss(1,bosses,"Desert Palace");
		window.setBoss(2,bosses,"Tower Of Hera");
		window.setBoss(3,bosses,"Palace Of Darkness");
		window.setBoss(4,bosses,"Swamp Palace");
		window.setBoss(5,bosses,"Skull Woods");
		window.setBoss(6,bosses,"Thieves Town");
		window.setBoss(7,bosses,"Ice Palace");
		window.setBoss(8,bosses,"Misery Mire");
		window.setBoss(9,bosses,"Turtle Rock");
		window.setMedallion(0,special,"Misery Mire Medallion");
		window.setMedallion(1,special,"Turtle Rock Medallion");
		window.setDungeonContents(0,ep,"Eastern Palace - ",["Cannonball Chest","Map Chest","Compass Chest","Big Chest","Big Key Chest","Boss"]);
		window.setDungeonContents(1,dp,"Desert Palace - ",["Map Chest","Torch","Compass Chest","Big Key Chest","Big Chest","Boss"]);
		window.setDungeonContents(2,toh,"Tower of Hera - ",["Basement Cage","Map Chest","Big Key Chest","Compass Chest","Big Chest","Boss"]);
		window.setDungeonContents(3,pod,"Palace of Darkness - ",["Shooter Room","The Arena - Bridge","Big Key Chest","Stalfos Basement","Map Chest","The Arena - Ledge","Compass Chest","Dark Basement - Right","Dark Basement - Left","Harmless Hellway","Dark Maze - Top","Dark Maze - Bottom","Big Chest","Boss"]);
		window.setDungeonContents(4,sp,"Swamp Palace - ",["Entrance","Map Chest","Compass Chest","Big Chest","West Chest","Big Key Chest","Flooded Room - Left","Flooded Room - Right","Waterfall Room","Boss"]);
		window.setDungeonContents(5,sw,"Skull Woods - ",["Compass Chest","Pot Prison","Pinball Room","Map Chest","Big Chest","Big Key Chest","Bridge Room","Boss"]);
		window.setDungeonContents(6,tt,"Thieves' Town - ",["Map Chest","Ambush Chest","Compass Chest","Big Key Chest","Attic","Blind's Cell","Big Chest","Boss"]);
		window.setDungeonContents(7,ip,"Ice Palace - ",["Compass Chest","Spike Room","Map Chest","Big Key Chest","Freezor Chest","Big Chest","Iced T Room","Boss"]);
		window.setDungeonContents(8,mm,"Misery Mire - ",["Bridge Chest","Spike Chest","Compass Chest","Big Key Chest","Main Lobby","Big Chest","Map Chest","Boss"]);
		window.setDungeonContents(9,tr,"Turtle Rock - ",["Compass Chest","Roller Room - Left","Roller Room - Right","Chain Chomps","Big Key Chest","Big Chest","Crystaroller Room","Eye Bridge - Top Right","Eye Bridge - Top Left","Eye Bridge - Bottom Right","Eye Bridge - Bottom Left","Boss"]);
		window.setDungeonContents(10,gt,"Ganon's Tower - ",["Hope Room - Right","Hope Room - Left","Tile Room","Compass Room - Top Right","Compass Room - Bottom Right","Compass Room - Bottom Left","Compass Room - Top Left","Bob's Torch","DMs Room - Bottom Left","DMs Room - Top Left","DMs Room - Top Right","DMs Room - Bottom Right","Map Chest","Firesnake Room","Randomizer Room - Bottom Left","Randomizer Room - Top Left","Randomizer Room - Top Right","Randomizer Room - Bottom Right","Bob's Chest","Big Key Chest","Big Key Room - Left","Big Key Room - Right","Big Chest","Mini Helmasaur Room - Right","Mini Helmasaur Room - Left","Pre-Moldorm Chest","Moldorm Chest"]);
		if(flags.mapmode != "N")
		{
			window.setContent(0,light,"King's Tomb");
			window.setContents(1,light,["Floodgate Chest","Sunken Treasure"]);
			window.setContent(2,flags.gametype === "I" ? dark : light,"Link's House");
			window.setContent(3,mountain,"Spiral Cave");
			window.setContent(4,mountain,"Mimic Cave");
			window.setContent(5,light,"Kakariko Tavern");
			window.setContent(6,light,"Chicken House");
			window.setContent(7,dark,"Brewery");
			window.setContent(8,dark,"C-Shaped House");
			window.setContent(9,light,"Aginah's Cave");
			window.setContents(10,dark,["Mire Shed - Left","Mire Shed - Right"]);
			window.setContents(11,dark,["Superbunny Cave - Top","Superbunny Cave - Bottom"]);
			window.setContents(12,light,["Sahasrahla's Hut - Left","Sahasrahla's Hut - Middle","Sahasrahla's Hut - Right"]);
			window.setContent(13,dark,"Spike Cave");
			window.setContents(14,light,["Kakariko Well - Bottom","Kakariko Well - Top","Kakariko Well - Left","Kakariko Well - Middle","Kakariko Well - Right"]);
			window.setContents(15,light,["Blind's Hideout - Left","Blind's Hideout - Far Left","Blind's Hideout - Far Right","Blind's Hideout - Right","Blind's Hideout - Top"]);
			window.setContents(16,dark,["Hype Cave - NPC","Hype Cave - Bottom","Hype Cave - Middle Left","Hype Cave - Middle Right","Hype Cave - Top"]);
			window.setContents(17,mountain,["Paradox Cave Upper - Left","Paradox Cave Upper - Right","Paradox Cave Lower - Far Left","Paradox Cave Lower - Left","Paradox Cave Lower - Middle","Paradox Cave Lower - Right","Paradox Cave Lower - Far Right"]);
			window.setContent(18,light,"Pegasus Rocks");
			window.setContents(19,light,["Mini Moldorm Cave - Far Left","Mini Moldorm Cave - Left","Mini Moldorm Cave - NPC","Mini Moldorm Cave - Right","Mini Moldorm Cave - Far Right"]);
			window.setContent(20,light,"Ice Rod Cave");
			window.setContent(21,dark,"Hookshot Cave - Bottom Right");
			window.setContents(22,dark,["Hookshot Cave - Top Right","Hookshot Cave - Top Left","Hookshot Cave - Bottom Left"]);
			window.setContent(23,dark,"Chest Game");
			window.setContent(24,light,"Bottle Merchant");
			window.setContent(25,light,"Sahasrahla");
			window.setContent(26,dark,"Stumpy");
			window.setContent(27,light,"Sick Kid");
			window.setContent(28,dark,"Purple Chest");
			window.setContent(29,light,"Hobo");
			window.setContent(30,mountain,"Ether Tablet");
			window.setContent(31,light,"Bombos Tablet");
			window.setContent(32,dark,"Catfish");
			window.setContent(33,light,"King Zora");
			window.setContent(34,mountain,"Old Man");
			window.setContent(35,light,"Potion Shop");
			window.setContent(36,light,"Lost Woods Hideout");
			window.setContent(37,light,"Lumberjack Tree");
			window.setContent(38,mountain,"Spectacle Rock Cave");
			window.setContent(39,light,"Cave 45");
			window.setContent(40,light,"Graveyard Ledge");
			window.setContent(41,light,"Checkerboard Cave");
			window.setContent(42,dark,"Hammer Pegs");
			window.setContent(43,light,"Library");
			window.setContent(44,light,"Mushroom");
			window.setContent(45,mountain,"Spectacle Rock");
			window.setContent(46,mountain,"Floating Island");
			window.setContent(47,light,"Maze Race");
			window.setContent(48,light,"Desert Ledge");
			window.setContent(49,light,"Lake Hylia Island");
			window.setContent(50,dark,"Bumper Cave");
			window.setContent(51,dark,"Pyramid");
			window.setContent(52,dark,"Digging Game");
			window.setContent(53,light,"Zora's Ledge");
			window.setContent(54,light,"Flute Spot");
			window.setContents(55,castle,["Sewers - Secret Room - Right","Sewers - Secret Room - Middle","Sewers - Secret Room - Left"]);
			window.setContents(56,castle,["Link's Uncle","Secret Passage"]);
			window.setContents(57,castle,["Hyrule Castle - Map Chest","Hyrule Castle - Boomerang Chest","Hyrule Castle - Zelda's Cell"]);
			window.setContent(58,castle,"Sanctuary");
			window.setContent(59,light,"Magic Bat");
			window.setContent(60,dark,"Blacksmith");
			window.setContents(61,dark,["Pyramid Fairy - Left","Pyramid Fairy - Right"]);
			window.setContent(62,light,"Master Sword Pedestal");
			window.setContent(63,castle,"Sewers - Dark Cross");
			window.setContents(64,light,["Waterfall Fairy - Left","Waterfall Fairy - Right"]);
			window.setContent(65,aga,"Castle Tower - Room 03");
			window.setContent(66,aga,"Castle Tower - Dark Maze");
		}
		spoilerLoaded = true;
	}

	window.readSpoilerLog = function(file)
	{
		if (document.getElementById("fewrupees").checked == true) {
			window.trashItems.push("OneRupee", "FiveRupees", "TwentyRupees", "TwentyRupees2");
		}
		if (document.getElementById("manyrupees").checked == true) {
			window.trashItems.push("FiftyRupees", "OneHundredRupees", "ThreeHundredRupees");
		}
		if (document.getElementById("threebombs").checked == true) {
			window.trashItems.push("ThreeBombs");
		}
		if (document.getElementById("tenbombs").checked == true) {
			window.trashItems.push("TenBombs");
		}
		if (document.getElementById("arrows").checked == true) {
			window.trashItems.push("Arrow", "TenArrows");
		}
		if (document.getElementById("heartpieces").checked == true) {
			window.trashItems.push("PieceOfHeart");
		}
		if (document.getElementById("heartcontainers").checked == true) {
			window.trashItems.push("HeartContainer", "BossHeartContainer");
		}
		if (document.getElementById("armor").checked == true) {
			window.trashItems.push("ProgressiveArmor");
		}
		if (document.getElementById("boomerangs").checked == true) {
			window.trashItems.push("Boomerang", "RedBoomerang");
		}
		if (document.getElementById("shields").checked == true) {
			window.trashItems.push("ProgressiveShield");
		}
		if (document.getElementById("maps").checked == true) {
			window.mapsAreTrash = true;
		}
		if (document.getElementById("compasses").checked == true) {
			window.compassesAreTrash = true;
		}
		
		var reader = new FileReader();
		reader.onload = function(){
			var editedresult = reader.result;
			var find = ':1';
			var re = new RegExp(find, 'g');
			editedresult = editedresult.replace(re, '');
			var spoiler = JSON.parse(editedresult);
			loadSpoiler(spoiler);
		};
		reader.readAsText(file);
		closeSpoilerModal();
	}
}(window));

function closeSpoilerModal() {
	$('#spoilerModal').hide();
}