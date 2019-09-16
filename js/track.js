(function(window) {
    'use strict';

	var spoilerLoaded = false;
	var spoiler;

    window.prizes = [];
    window.enemizer = [];
    window.medallions = [0, 0];
	window.lastItem = null;
	window.trashItems = [];
	window.mapsAreTrash = false;
	window.compassesAreTrash = false;
	window.dungeonContents = [];

	window.dungeonNames = ["EP", "DP", "ToH", "PoD", "SP", "SW", "TT", "IP", "MM", "TR", "GT"];

    // Event of clicking on the item tracker
    window.toggle = function(label) {
        /* if (label.substring(0,5) === 'chest') {
            var value = items.dec(label);
            document.getElementById(label).className = 'chest-' + value;
            if (map_enabled != 'no') {
                var x = label.substring(5);
                document.getElementById('dungeon'+x).className = 'dungeon ' +
                    (value ? dungeons[x].can_get_chest() : 'opened');
            }
            return;
        } */
		if (label.substring(0,5) === 'chest') {
            var value = items.dec(label);
			if (value === 0) {
				//if (flags.dungeonitems === 'S' && flags.gametype != 'R') {
					//document.getElementById(label).className = 'chest-' + value + ' largechest';
				//} else {
					document.getElementById(label).className = 'chest-' + value;
				//}
				document.getElementById(label).innerHTML = '';
			} else {
				//if (flags.dungeonitems === 'S' && flags.gametype != 'R') {
					//document.getElementById(label).className = 'chest largechest';
				//} else {
					document.getElementById(label).className = 'chest';
				//}
				document.getElementById(label).innerHTML = value;
			}
			
            if (flags.mapmode != 'N') {
                var x = label.substring(5);
                document.getElementById('dungeon'+x).className = 'dungeon ' +
                    (value ? dungeons[x].can_get_chest() : 'opened');
            }
            return;
        }
		
		var skipkey = false;
		
		if (label.substring(0,6) === 'bigkey') {
			items[label] = !items[label];
			
			if (items[label]) {
				document.getElementById(label).className = 'bigkey collected';
			} else {
				document.getElementById(label).className = 'bigkey';
			}
			
			skipkey = true;
		}
		
		if (label.substring(0,12) === 'smallkeyhalf') {
			if (flags.gametype != 'R') {
				var value = items.inc(label);
				document.getElementById(label).innerHTML = value;
				skipkey = true;
			} else {
				var value = items.dec(label);
				document.getElementById(label).innerHTML = value;
				skipkey = true;
			}
        }		
		if (label.substring(0,8) === 'smallkey' && label.substring(0,12) != 'smallkeyhalf') {
			if (flags.gametype != 'R') {
				var value = items.inc(label);
				document.getElementById(label).innerHTML = value;
				skipkey = true;
			} else {
				var value = items.dec(label);
				document.getElementById(label).innerHTML = value;
				skipkey = true;
			}
        }
		
		if (!skipkey) {
			//if (label === 'moonpearl' || label === 'tunic' || label === 'sword' || label === 'shield') {
				//var node = document.getElementsByClassName(label)[1],
					//is_boss = node.classList.contains('boss');
			//} else {
				var node = document.getElementsByClassName(label)[0],
					is_boss = node.classList.contains('boss');
			//}
			if ((typeof items[label]) === 'boolean') {
				items[label] = !items[label];
				
				if (items[label] == true)
					lastItem = label;
				else
					lastItem = null;

				node.classList[items[label] ? 'add' : 'remove'](is_boss ? 'defeated' : 'active');
			} else {
				if (label === 'sword' && flags.swordmode === 'S') {
				} else {
					var value = items.inc(label);
					node.className = node.className.replace(/ ?active-\w+/, '');
					if (value) node.classList.add('active-' + value);
					
					if (value)
						lastItem = label + " active-" + value;
					else				
						lastItem = null;					
				}
			}
			// Initiate bunny graphics!
			if (label === 'moonpearl' || label === 'tunic') {
			   document.getElementsByClassName('tunic')[0].classList[!items.moonpearl ? 'add' : 'remove']('bunny');
				//document.getElementsByClassName('tunic')[0].classList[!items.moonpearl ? 'add' : 'remove']('bunny');
			}
		}
        if (flags.mapmode != 'N') {
            for (var k = 0; k < chests.length; k++) {
                if (!chests[k].is_opened)
                    document.getElementById('locationMap'+k).className = 'location ' + chests[k].is_available();
            }
            for (var k = 0; k < dungeons.length; k++) {
                if (!dungeons[k].is_beaten)
                    document.getElementById('bossMap'+k).className = 'boss ' + dungeons[k].is_beatable();
				//if (variation === 'keysanity' || variation === 'retro') {
					//if (items['keychest'+k])
						//document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
				//} else {
					if (items['chest'+k])
						document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
				//}

			}
            // Clicking a boss on the tracker will check it off on the map!
            if (is_boss) {
                toggle_boss(label.substring(4));
            }
            //if (label === 'agahnim' || label === 'cape' || label === 'sword' || label === 'lantern' || label === 'smallkeyhalf1') {
                toggle_agahnim();
            //}
        }
    };

    // event of clicking on a boss's pendant/crystal subsquare
    window.toggle_dungeon = function(n) {
        prizes[n] += 1;
        if (prizes[n] === 5) prizes[n] = 0;

        document.getElementById('dungeonPrize'+n).className = 'prize-' + prizes[n];

        if (flags.mapmode != 'N') {
            // Update Sahasralah, Fat Fairy, and Master Sword Pedestal
            var pendant_chests = [25, 61, 62];
            for (var k = 0; k < pendant_chests.length; k++) {
                if (!chests[pendant_chests[k]].is_opened)
                    document.getElementById('locationMap'+pendant_chests[k]).className = 'location ' + chests[pendant_chests[k]].is_available();
            }
        }
    };
	
    window.rightClickPrize = function(n) {
        prizes[n] -= 1;
        if (prizes[n] === -1) prizes[n] = 4;

        document.getElementById('dungeonPrize'+n).className = 'prize-' + prizes[n];

        if (flags.mapmode != 'N') {
            // Update Sahasralah, Fat Fairy, and Master Sword Pedestal
            var pendant_chests = [25, 61, 62];
            for (var k = 0; k < pendant_chests.length; k++) {
                if (!chests[pendant_chests[k]].is_opened)
                    document.getElementById('locationMap'+pendant_chests[k]).className = 'location ' + chests[pendant_chests[k]].is_available();
            }
        }
    };	

    // event of clicking on a boss's enemizer portrait
    window.toggle_enemy = function(n) {
        enemizer[n] += 1;
        if (enemizer[n] === 11) enemizer[n] = 0;
        document.getElementById('dungeonEnemy'+n).className = 'enemizer-' + enemizer[n];
		dungeons[n].is_beatable();
		if (!dungeons[n].is_beaten)
			document.getElementById('bossMap'+n).className = 'boss ' + dungeons[n].is_beatable();
    };

    // event of clicking on Mire/TRock's medallion subsquare
    window.toggle_medallion = function(n) {
        medallions[n] += 1;
        if (medallions[n] === 4) medallions[n] = 0;

        document.getElementById('medallion'+n).className = 'medallion-' + medallions[n];

        if (flags.mapmode != "N") {
            // Update availability of dungeon boss AND chests
            dungeons[8+n].is_beaten = !dungeons[8+n].is_beaten;
            toggle_boss(8+n);
            if (items['chest'+(8+n)] > 0)
                document.getElementById('dungeon'+(8+n)).className = 'dungeon ' + dungeons[8+n].can_get_chest();
            // TRock medallion affects Mimic Cave
            if (n === 1) {
                chests[4].is_opened = !chests[4].is_opened;
                toggle_chest(4);
            }
            // Change the mouseover text on the map
            dungeons[8+n].caption = dungeons[8+n].caption.replace(/\{medallion\d+\}/, '{medallion'+medallions[n]+'}');
        }
    };


    // event of clicking on each dungeon's bigkey
    window.toggle_bigkey = function(n) {
		items['bigkey'+n] = !items['bigkey'+n];
		
		if (items['bigkey'+n]) {
			document.getElementById('bigkey'+n).className = 'bigkey collected';
		} else {
			document.getElementById('bigkey'+n).className = 'bigkey';
		}
		
        if (flags.mapmode != "N") {
            // Update availability of dungeon boss AND chests
            dungeons[8+n].is_beaten = !dungeons[8+n].is_beaten;
            toggle_boss(8+n);
            if (items['chest'+(8+n)] > 0)
                document.getElementById('dungeon'+(8+n)).className = 'dungeon ' + dungeons[8+n].can_get_chest();
            // TRock medallion affects Mimic Cave
            if (n === 1) {
                chests[4].is_opened = !chests[4].is_opened;
                toggle_chest(4);
            }
            // Change the mouseover text on the map
            dungeons[8+n].caption = dungeons[8+n].caption.replace(/\{medallion\d+\}/, '{medallion'+medallions[n]+'}');
        }
    };

    if (flags.mapmode != 'N') {
        // Event of clicking a chest on the map
        window.toggle_chest = function(x) {
            chests[x].is_opened = !chests[x].is_opened;
            var highlight = document.getElementById('locationMap'+x).classList.contains('highlight');
            document.getElementById('locationMap'+x).className = 'location ' +
                (chests[x].is_opened ? 'opened' : chests[x].is_available()) +
                (highlight ? ' highlight' : '');
        };
        // Event of clicking a dungeon location (not really)
        window.toggle_boss = function(x) {
            dungeons[x].is_beaten = !dungeons[x].is_beaten;
            document.getElementById('bossMap'+x).className = 'boss ' +
                (dungeons[x].is_beaten ? 'opened' : dungeons[x].is_beatable());
        };
        window.toggle_agahnim = function() {
            document.getElementById('castle').className = 'castle ' +
                (items.agahnim ? 'opened' : agahnim.is_available());
        };
        // Highlights a chest location and shows the caption
        window.highlight = function(x) {
            document.getElementById('locationMap'+x).classList.add('highlight');
            document.getElementById('caption').innerHTML = caption_to_html(chests[x].content ?(chests[x].content+" | "+chests[x].caption) :chests[x].caption);
        };
        window.unhighlight = function(x) {
            document.getElementById('locationMap'+x).classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
        };
        // Highlights a chest location and shows the caption (but for dungeons)
        window.highlight_dungeon = function(x) {
            document.getElementById('dungeon'+x).classList.add('highlight');
            document.getElementById('caption').innerHTML = caption_to_html(dungeons[x].trashContent ?(dungeons[x].trashContent+" | "+dungeons[x].caption) :dungeons[x].caption);
        };
        window.unhighlight_dungeon = function(x) {
            document.getElementById('dungeon'+x).classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
        };
        window.highlight_agahnim = function() {
            document.getElementById('castle').classList.add('highlight');
            document.getElementById('caption').innerHTML = caption_to_html(agahnim.caption);
        };
        window.unhighlight_agahnim = function() {
            document.getElementById('castle').classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
        };
    }

	window.findItems = function(items) {
		if(spoilerLoaded && flags.mapmode != "N")
		{
			var results = "";
			for(var i = 0; i < chests.length; i++)
			{
				var hasItem = false,itemsInLocation = chests[i].content.split(", ");
				for(var j = 0; j < items.length; j++)
					if(itemsInLocation.includes(items[j]))
					{
						hasItem = true;
						break;
					}
				if(hasItem)
				{
					if(flags.mapmode != 'N')
						document.getElementById('locationMap'+i).classList.add('highlight');
					var locationName = chests[i].caption;
					results = results === "" ?locationName :results+", "+locationName;
				}
			}
			for(var i = 0; i < dungeonContents.length; i++)
			{
				var dungeonHasItem = false,itemMap = dungeonContents[i];
				for(var locationName in itemMap)
				{
					var hasItem = false,itemName = itemMap[locationName];
					for(var j = 0; j < items.length; j++)
						if(itemName === items[j])
						{
							dungeonHasItem = hasItem = true;
							break;
						}
					if(hasItem)
					{
						results = results === "" ?dungeonNames[i]+" "+locationName :results+", "+dungeonNames[i]+" "+locationName;
					}
				}
				if(dungeonHasItem)
				{
					if(flags.mapmode != 'N')
						document.getElementById('dungeon'+i).classList.add('highlight');
				}
			}
			if(results !== "")
				document.getElementById('caption').innerHTML = caption_to_html(results);
		}
	};

	window.unhighlightAll = function() {
		if(spoilerLoaded)
		{
			if(flags.mapmode != 'N')
			{
				for(var i = 0; i < chests.length; i++)
					document.getElementById('locationMap'+i).classList.remove('highlight');
				for(var i = 0; i < dungeonContents.length; i++)
						document.getElementById('dungeon'+i).classList.remove('highlight');
			}
            document.getElementById('caption').innerHTML = '&nbsp;';
		}
	};

	window.showNiceItems = function(x) {
		if(spoilerLoaded && flags.mapmode != "N")
            document.getElementById('caption').innerHTML = caption_to_html(dungeons[x].niceContent);
	};

	window.clearCaption = function() {
		if(spoilerLoaded)
            document.getElementById('caption').innerHTML = '&nbsp;';
	};

	window.setSphereItem = function(label) {
		
		if (lastItem === null) {
			document.getElementById(label).className = "sphere noitem";
		} else {
			if (lastItem.substring(0, 5) === "sword" || lastItem.substring(0, 5) === "shiel" || lastItem.substring(0, 5) === "moonp") {
				document.getElementById(label).className = "sphere sphere" + lastItem;
			} else if (lastItem.substring(0, 5) === "tunic")
			{}
			else
				document.getElementById(label).className = "sphere " + lastItem;
			
		}
		
		lastItem = null;
		
	}

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
	
	window.checkGoal = function() {
		
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
			var spoiler = JSON.parse(reader.result);
			loadSpoiler(spoiler);
		};
		reader.readAsText(file);
		closeSpoilerModal();
	}
	
    window.start = function() {
		//If spoiler mode, first show the modal to load the spoiler log
		if (flags.spoilermode === 'Y') {
			$('#spoilerModal').show();
		}
		
		switch (flags.goals) {
			case 'G':
				document.getElementById('goaldiv').classList.add('crystals');
				break;
			case 'A':
				document.getElementById('goaldiv').classList.add('alldungeons');
				break;
			case 'P':
				document.getElementById('goaldiv').classList.add('pendants');
				break;
			case 'O':
				document.getElementById('goaldiv').classList.add('other');
				break;
		}
		
		//Hiding for now, will re-implement later with a cleaner setup
		document.getElementById('goaldiv').classList.add('other');
		
		//Default the dungeon prizes and enemizer defaults
        for (var k = 0; k < dungeons.length; k++) {
            prizes[k] = 0;
			if (flags.bossshuffle === 'N') {
				enemizer[k] = k + 1;
			} else {
				enemizer[k] = 0;
			}
        }
		
		//Set the starting number of treasures
		document.getElementById('chest0').innerHTML = items.chest0;
		document.getElementById('chest1').innerHTML = items.chest1;
		document.getElementById('chest2').innerHTML = items.chest2;
		document.getElementById('chest3').innerHTML = items.chest3;
		document.getElementById('chest4').innerHTML = items.chest4;
		document.getElementById('chest5').innerHTML = items.chest5;
		document.getElementById('chest6').innerHTML = items.chest6;
		document.getElementById('chest7').innerHTML = items.chest7;
		document.getElementById('chest8').innerHTML = items.chest8;
		document.getElementById('chest9').innerHTML = items.chest9;
		document.getElementById('chest10').innerHTML = items.chest10;

		//If not enemizer, hide the enemizer switches
		if (flags.bossshuffle === 'N') {
			document.getElementById('dungeonEnemy0').style.visibility = 'hidden';
			document.getElementById('dungeonEnemy1').style.visibility = 'hidden';
			document.getElementById('dungeonEnemy2').style.visibility = 'hidden';
			document.getElementById('dungeonEnemy3').style.visibility = 'hidden';
			document.getElementById('dungeonEnemy4').style.visibility = 'hidden';
			document.getElementById('dungeonEnemy5').style.visibility = 'hidden';
			document.getElementById('dungeonEnemy6').style.visibility = 'hidden';
			document.getElementById('dungeonEnemy7').style.visibility = 'hidden';
			document.getElementById('dungeonEnemy8').style.visibility = 'hidden';
			document.getElementById('dungeonEnemy9').style.visibility = 'hidden';
		}

		//Hide map if not using
        if (flags.mapmode != 'N') {
            for (k = 0; k < chests.length; k++) {
                document.getElementById('locationMap'+k).className = 'location ' + (chests[k].is_opened ? 'opened' : chests[k].is_available());
            }
            document.getElementById('bossMapAgahnim').className = 'boss';
            document.getElementById('castle').className = 'castle ' + agahnim.is_available();
            for (k = 0; k < dungeons.length; k++) {
                document.getElementById('bossMap'+k).className = 'boss ' + dungeons[k].is_beatable();
                document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
            }
			if (flags.mapmode === 'C') {
				var link = document.createElement("link");
				link.rel = 'stylesheet';
				link.type = 'text/css';
				link.href = 'css/smallmap.css';
				document.head.appendChild(link);
				//document.getElementById('spheres').style.display = 'none';
			}
        } else {
            document.getElementById('app').classList.add('mapless');
            document.getElementById('map').style.display = 'none';
        }
		
		//Switch overworld locations if inverted
		if (flags.gametype === 'I') {
			document.getElementById('locationMap2').style.left = "77.4%";

			document.getElementById('locationMap65').style.left = "74.5%";
			document.getElementById('locationMap65').style.top = "5%";
			
			document.getElementById('locationMap66').style.left = "81.6%";
			document.getElementById('locationMap66').style.top = "5%";
			
			document.getElementById('bossMapAgahnim').style.left = "78%";
			document.getElementById('bossMapAgahnim').style.top = "4.5%";
			document.getElementById('castle').style.left = "78%";
			document.getElementById('castle').style.top = "4.5%";
			
			document.getElementById('bossMap10').style.left = "25%";
			document.getElementById('bossMap10').style.top = "52.5%";
			document.getElementById('dungeon10').style.left = "25%";
			document.getElementById('dungeon10').style.top = "52.5%";
		}

		//If big keys are not shuffled, hide the icons
		if (flags.dungeonitems != 'F') {
			document.getElementById('bigkey0').style.visibility = 'hidden';
			document.getElementById('bigkey1').style.visibility = 'hidden';
			document.getElementById('bigkey2').style.visibility = 'hidden';
			document.getElementById('bigkey3').style.visibility = 'hidden';
			document.getElementById('bigkey4').style.visibility = 'hidden';
			document.getElementById('bigkey5').style.visibility = 'hidden';
			document.getElementById('bigkey6').style.visibility = 'hidden';
			document.getElementById('bigkey7').style.visibility = 'hidden';
			document.getElementById('bigkey8').style.visibility = 'hidden';
			document.getElementById('bigkey9').style.visibility = 'hidden';
			document.getElementById('bigkey10').style.visibility = 'hidden';
		}
		
		//If small keys are not shuffled, hide the icons
		if (flags.dungeonitems != 'F' && flags.dungeonitems != 'K' && flags.gametype != 'R') {
			document.getElementById('locationMap65').style.visibility = 'hidden';
			document.getElementById('locationMap66').style.visibility = 'hidden';
			document.getElementById('smallkey0').style.visibility = 'hidden';
			document.getElementById('smallkey1').style.visibility = 'hidden';
			document.getElementById('smallkey2').style.visibility = 'hidden';
			document.getElementById('smallkey3').style.visibility = 'hidden';
			document.getElementById('smallkey4').style.visibility = 'hidden';
			document.getElementById('smallkey5').style.visibility = 'hidden';
			document.getElementById('smallkey6').style.visibility = 'hidden';
			document.getElementById('smallkey7').style.visibility = 'hidden';
			document.getElementById('smallkey8').style.visibility = 'hidden';
			document.getElementById('smallkey9').style.visibility = 'hidden';
			document.getElementById('smallkey10').style.visibility = 'hidden';
			document.getElementById('smallhalfheader0').style.visibility = 'hidden';
			document.getElementById('smallkeyhalf0').style.visibility = 'hidden';
			document.getElementById('smallhalfheader1').style.visibility = 'hidden';
			document.getElementById('smallkeyhalf1').style.visibility = 'hidden';
			//document.getElementById('chest0').classList.add('largechest');
			//document.getElementById('chest1').classList.add('largechest');
			//document.getElementById('chest2').classList.add('largechest');
			//document.getElementById('chest3').classList.add('largechest');
			//document.getElementById('chest4').classList.add('largechest');
			//document.getElementById('chest5').classList.add('largechest');
			//document.getElementById('chest6').classList.add('largechest');
			//document.getElementById('chest7').classList.add('largechest');
			//document.getElementById('chest8').classList.add('largechest');
			//document.getElementById('chest9').classList.add('largechest');			
		}
		
		
		//If game type is Retro, default the keys to max and decrement
		if (flags.gametype === 'R') {
			document.getElementById('smallkey0').innerHTML = 0;
			document.getElementById('smallkey1').innerHTML = 1;
			document.getElementById('smallkey2').innerHTML = 1;
			document.getElementById('smallkey3').innerHTML = 6;
			document.getElementById('smallkey4').innerHTML = 1;
			document.getElementById('smallkey5').innerHTML = 3;
			document.getElementById('smallkey6').innerHTML = 1;
			document.getElementById('smallkey7').innerHTML = 2;
			document.getElementById('smallkey8').innerHTML = 3;
			document.getElementById('smallkey9').innerHTML = 4;
			document.getElementById('smallkey10').innerHTML = 4;
			document.getElementById('smallkeyhalf0').innerHTML = 1;
			document.getElementById('smallkeyhalf1').innerHTML = 2;
			items.smallkey0 = 0;
			items.smallkey1 = 1;
			items.smallkey2 = 1;
			items.smallkey3 = 6;
			items.smallkey4 = 1;
			items.smallkey5 = 3;
			items.smallkey6 = 1;
			items.smallkey7 = 2;
			items.smallkey8 = 3;
			items.smallkey9 = 4;
			items.smallkey10 = 4;
			items.smallkeyhalf0 = 1;
			items.smallkeyhalf1 = 2;
		}
		
		if (flags.spheresmode == 'N') {
			document.getElementById('spheres').style.visibility = 'hidden';
			document.getElementById('spheres').style.display = 'none';
			document.getElementById('app').classList.add('sphereless');
		} else {
			document.getElementById('spheres').style.visibility = 'visible';
		}
				
    };
}(window));

function closeSpoilerModal() {
	$('#spoilerModal').hide();
}