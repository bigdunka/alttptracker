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
		if (label.substring(0,5) === 'chest') {
            var value = items.dec(label);
			if (value === 0) {
				document.getElementById(label).className = 'chest-' + value;
				document.getElementById(label).innerHTML = '';
			} else {
				document.getElementById(label).className = 'chest';
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
			var node = document.getElementsByClassName(label)[0], is_boss = node.classList.contains('boss');
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
					if (items['chest'+k])
						document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
			}
            // Clicking a boss on the tracker will check it off on the map!
            if (is_boss) {
                toggle_boss(label.substring(4));
            }
			toggle_agahnim();
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
	
	window.crystalGoal = function() {
		if (flags.opentower === 'R') {
			document.getElementById('crystalsselectdiv').style.visibility = 'inherit';
		}
	}

	window.ganonGoal = function() {
		if (flags.ganonvuln === 'R' && (flags.goals === 'G' || flags.goals === 'F')) {
			document.getElementById('ganonselectdiv').style.visibility = 'inherit';
		}
	}
	
	window.setCrystalGoal = function(x) {
		document.getElementById('crystalsdiv').classList.remove('crystals');
		document.getElementById('crystalsdiv').classList.remove('crystals0');
		document.getElementById('crystalsdiv').classList.remove('crystals1');
		document.getElementById('crystalsdiv').classList.remove('crystals2');
		document.getElementById('crystalsdiv').classList.remove('crystals3');
		document.getElementById('crystalsdiv').classList.remove('crystals4');
		document.getElementById('crystalsdiv').classList.remove('crystals5');
		document.getElementById('crystalsdiv').classList.remove('crystals6');
		document.getElementById('crystalsdiv').classList.remove('crystals7');
		document.getElementById('crystalsdiv').classList.add('crystals' + x);
		document.getElementById('crystalsselectdiv').style.visibility = 'collapse';
		flags.opentowercount = (x === '' ? 8 : x);
	}

	window.setGanonGoal = function(x) {
		document.getElementById('ganondiv').classList.remove('ganon');
		document.getElementById('ganondiv').classList.remove('ganon0');
		document.getElementById('ganondiv').classList.remove('ganon1');
		document.getElementById('ganondiv').classList.remove('ganon2');
		document.getElementById('ganondiv').classList.remove('ganon3');
		document.getElementById('ganondiv').classList.remove('ganon4');
		document.getElementById('ganondiv').classList.remove('ganon5');
		document.getElementById('ganondiv').classList.remove('ganon6');
		document.getElementById('ganondiv').classList.remove('ganon7');
		document.getElementById('ganondiv').classList.add('ganon' + x);
		document.getElementById('ganonselectdiv').style.visibility = 'collapse';
		flags.ganonvulncount = (x === '' ? 8 : x);
	}

    window.start = function() {
		//If spoiler mode, first show the modal to load the spoiler log
		if (flags.spoilermode === 'Y') {
			$('#spoilerModal').show();
		}
		
		if (flags.opentower === 'R') {
			document.getElementById('crystalsdiv').classList.add('crystals');
			flags.opentowercount = 8;
		} else {
			document.getElementById('crystalsdiv').classList.add('crystals' + flags.opentowercount);
		}		
		
		switch (flags.goals) {
			case 'G':
			case 'F':
				if (flags.ganonvuln === 'R') {
					document.getElementById('ganondiv').classList.add('ganon');
					flags.ganonvulncount = 8;
				} else {
					document.getElementById('ganondiv').classList.add('ganon' + flags.ganonvulncount);
				}
				break;
			case 'A':
				document.getElementById('ganondiv').classList.add('alldungeons');
				break;
			case 'P':
				document.getElementById('ganondiv').classList.add('pendants');
				break;
			case 'O':
				document.getElementById('ganondiv').classList.add('other');
				break;
		}		
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
			document.getElementById('chest0').classList.add('large');
			document.getElementById("c0bkdiv").remove();
			document.getElementById("c0skdiv").remove();
			document.getElementById('chest1').classList.add('large');
			document.getElementById("c1bkdiv").remove();
			document.getElementById("c1skdiv").remove();
			document.getElementById('chest2').classList.add('large');
			document.getElementById("c2bkdiv").remove();
			document.getElementById("c2skdiv").remove();
			document.getElementById('chest3').classList.add('large');
			document.getElementById("c3bkdiv").remove();
			document.getElementById("c3skdiv").remove();
			document.getElementById('chest4').classList.add('large');
			document.getElementById("c4bkdiv").remove();
			document.getElementById("c4skdiv").remove();
			document.getElementById('chest5').classList.add('large');
			document.getElementById("c5bkdiv").remove();
			document.getElementById("c5skdiv").remove();
			document.getElementById('chest6').classList.add('large');
			document.getElementById("c6bkdiv").remove();
			document.getElementById("c6skdiv").remove();
			document.getElementById('chest7').classList.add('large');
			document.getElementById("c7bkdiv").remove();
			document.getElementById("c7skdiv").remove();
			document.getElementById('chest8').classList.add('large');
			document.getElementById("c8bkdiv").remove();
			document.getElementById("c8skdiv").remove();
			document.getElementById('chest9').classList.add('large');
			document.getElementById("c9bkdiv").remove();
			document.getElementById("c9skdiv").remove();			
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
		
		if (flags.swordmode === 'A') {
			toggle('sword');
		}
				
    };
}(window));