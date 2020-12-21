(function(window) {
    'use strict';

	var spoiler;
	var overrideEntranceCloseFlag = false;
	var connectStart = false;
	var connectFinish = false;
	var connectorid = 0;
	window.connectorIndex = [];
	window.connectorOne = [];
	window.connectorTwo = [];
	
    window.prizes = [];
    window.enemizer = [];
    window.medallions = [0, 0];
	window.lastItem = null;
	window.trashItems = [];
	window.mapsAreTrash = false;
	window.compassesAreTrash = false;
	window.dungeonContents = [];
	window.rightClickedLocation = -1;
	window.rightClickedType = null;

	window.dungeonNames = ["EP", "DP", "ToH", "PoD", "SP", "SW", "TT", "IP", "MM", "TR", "GT"];

	window.doorWindow = null;
	window.dungeonPaths = null;

	var standardbombs = false;

    // Event of clicking on the item tracker
    window.toggle = function(label) {
		if(rightClickedLocation != -1)
		{
			name = getNiceName(label);
			if(rightClickedType === "chest")
			{
				if(name.charAt(0) < 'a' || name.charAt(0) > 'z')
				{
					if(!chests[rightClickedLocation].content)
						chests[rightClickedLocation].content = name;
					else
						chests[rightClickedLocation].content += ", "+name;
					document.getElementById('caption').innerHTML = caption_to_html(name+' placed at '+chests[rightClickedLocation].caption);
				}
				document.getElementById('locationMap'+rightClickedLocation).classList.remove('rightclick');
			}
			if(rightClickedType === "dungeon")
			{
				if(name.charAt(0) < 'a' || name.charAt(0) > 'z')
				{
					if(!dungeons[rightClickedLocation].content)
						dungeons[rightClickedLocation].content = name;
					else
						dungeons[rightClickedLocation].content += ", "+name;
					document.getElementById('caption').innerHTML = caption_to_html(name+' placed in '+dungeons[rightClickedLocation].caption);
				}
				document.getElementById('dungeon'+rightClickedLocation).classList.remove('rightclick');
			}
			rightClickedLocation = -1;
			return;
		}

		if(label === 'mirror' && flags.doorshuffle != 'N')
		{
			document.getElementById('mirrorscroll').style.display = items.mirror ?'block' :'none';
		}

		if (label.substring(0,5) === 'chest') {
            var value = items.dec(label);
			if (value === 0) {
				if (!flags.wildkeys && !flags.wildbigkeys && flags.gametype != 'R' && label != 'chest10') {
					document.getElementById(label).className = 'chest-' + value + ' large';
				} else {
					document.getElementById(label).className = 'chest-' + value;
				}
				
				document.getElementById(label).innerHTML = '';
			} else {
				if (!flags.wildkeys && !flags.wildbigkeys && flags.gametype != 'R' && label != 'chest10') {
					document.getElementById(label).className = 'chest large';
				} else {
					document.getElementById(label).className = 'chest';
				}
				
				document.getElementById(label).innerHTML = flags.doorshuffle === 'C' ? (value - 1) + '+' : value;
			}
			
            if (flags.mapmode != 'N') {
				if (flags.entrancemode === 'N') {
					var x = label.substring(5);
					document.getElementById('dungeon'+x).className = 'dungeon ' +
						(value ? dungeons[x].can_get_chest() : 'opened');
				}
            }
			updateMapTracker();
            return;
        }
		
		var skipkey = false;
		
		if (label.substring(0,6) === 'bigkey') {
			items[label] = !items[label];
			
			if (items[label]) {
				document.getElementById(label).className = label.substring(0,10) == 'bigkeyhalf' ? 'bigkeyhalf collected' : 'bigkey collected';
			} else {
				document.getElementById(label).className = label.substring(0,10) == 'bigkeyhalf' ? 'bigkeyhalf' : 'bigkey';
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
				if (label != 'bomb') {
					node.classList[items[label] ? 'add' : 'remove'](is_boss ? 'defeated' : 'active');
				} else {
					if (standardbombs) {
						//Because you always have bombs...except in Standard
						node.classList[items[label] ? 'add' : 'remove'](is_boss ? 'defeated' : 'active');
					}
				}
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
			if (flags.entrancemode != 'N') {					
				for (var k = 0; k < entrances.length; k++) {
					if (!entrances[k].is_opened) {
						var entrancetype = '';
						if (entrances[k].is_available()) {
							if (entrances[k].known_location != '') {
								entrancetype = isDungeon(entrances[k].known_location) ? 'dungeon' : 'keylocation';
							} else if (entrances[k].is_connector) {
								entrancetype = 'connector';
							}
						}
						document.getElementById('entranceMap'+k).className = 'entrance ' + entrances[k].is_available() + entrancetype;
					}
				}
			} else {
				for (var k = 0; k < dungeons.length; k++) {
					document.getElementById('bossMap'+k).className = 'bossprize-' + prizes[k] + ' boss ' + (dungeons[k].is_beaten ? 'opened' : dungeons[k].is_beatable());
					if (items['chest'+k])
						document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
				}
			}
			
            // Clicking a boss on the tracker will check it off on the map!
            if (is_boss) {
                toggle_boss(label.substring(4));
            }
			toggle_agahnim();
        }
		
		//Update the backgrounds of the chests in entrance
		for (var k = 0; k < dungeons.length; k++) {
			document.getElementById('chest'+k).style.backgroundColor = 'white';// (flags.entrancemode != 'N' ? getDungeonBackground(dungeons[k].can_get_chest()) : 'white');
		}
    };

	window.receiveMessage = function(event)
	{
		if(window.origin === event.origin)
		{
			if(event.data == "UPDATE" && doorWindow)
				doorWindow.postMessage(dungeonPaths,"*");
			else
				if(event.data.length === 13)
					dungeonPaths = event.data;
		}
	}

	window.showDoorWindow = function()
	{
		if(doorWindow && !doorWindow.closed)
			doorWindow.focus();
		else
			doorWindow = window.open('dungeontracker.html?door_shuffle='+flags.doorshuffle+'&wild_keys='+flags.wildkeys+'&wild_big_keys='+flags.wildbigkeys+'&world_state='+flags.gametype+(dungeonPaths ?'&request_update=true' :''),'','width=372,height=650,titlebar=0,menubar=0,toolbar=0,scrollbars=1,resizable=1');
	}

	window.getDungeonBackground = function(x) {
		switch (x) {
			case 'available':
				return 'lime';
				break;
			case 'unavailable':
				return '#900';
				break;
			case 'possible':
				return 'yellow';
				break;
			case 'information':
				return 'orange';
				break;
			case 'darkavailable':
				return 'blue';
				break;
			case 'darkpossible':
				return 'purple';
				break;
		}
	}
	
    // event of clicking on a boss's pendant/crystal subsquare
    window.toggle_dungeon = function(n) {
		var maxdungeon = (flags.wildmaps ? 6 : 5);
        prizes[n] += 1;
        if (prizes[n] === maxdungeon) prizes[n] = 0;

        document.getElementById('dungeonPrize'+n).className = 'prize-' + prizes[n];

        if (flags.mapmode != 'N' && flags.entrancemode === 'N') {
            // Update Sahasralah, Fat Fairy, and Master Sword Pedestal
            var pendant_chests = [25, 61, 62];
            for (var k = 0; k < pendant_chests.length; k++) {
                if (!chests[pendant_chests[k]].is_opened)
                    document.getElementById('locationMap'+pendant_chests[k]).className = 'location ' + chests[pendant_chests[k]].is_available();
            }
        }
		
		updateMapTracker();
    };
	
    window.rightClickPrize = function(n) {
		var mindungeon = (flags.wildmaps ? 5 : 4);
        prizes[n] -= 1;
        if (prizes[n] === -1) prizes[n] = mindungeon;

        document.getElementById('dungeonPrize'+n).className = 'prize-' + prizes[n];

        if (flags.mapmode != 'N' && flags.entrancemode === 'N') {
            // Update Sahasralah, Fat Fairy, and Master Sword Pedestal
            var pendant_chests = [25, 61, 62];
            for (var k = 0; k < pendant_chests.length; k++) {
                if (!chests[pendant_chests[k]].is_opened)
                    document.getElementById('locationMap'+pendant_chests[k]).className = 'location ' + chests[pendant_chests[k]].is_available();
            }
        }
		updateMapTracker();
    };	
	
	
    // event of right clicking on a boss's enemizer portrait
    window.rightClickEnemy = function(n) {
        enemizer[n] -= 1;
        if (enemizer[n] === -1) enemizer[n] = 10;
        document.getElementById('dungeonEnemy'+n).className = 'enemizer-' + enemizer[n];
		dungeons[n].is_beatable();
		if (!dungeons[n].is_beaten)
			if (document.getElementById('bossMap'+n) != null) {
				//document.getElementById('bossMap'+n).className = 'boss ' + dungeons[n].is_beatable();
				document.getElementById('bossMap'+n).className = 'bossprize-' + prizes[n] + ' boss ' + dungeons[n].is_beatable();
			}
    };

    // event of clicking on a boss's enemizer portrait
    window.toggle_enemy = function(n) {
        enemizer[n] += 1;
        if (enemizer[n] === 11) enemizer[n] = 0;
        document.getElementById('dungeonEnemy'+n).className = 'enemizer-' + enemizer[n];
		dungeons[n].is_beatable();
		if (!dungeons[n].is_beaten)
			if (document.getElementById('bossMap'+n) != null) {
				//document.getElementById('bossMap'+n).className = 'boss ' + dungeons[n].is_beatable();
				document.getElementById('bossMap'+n).className = 'bossprize-' + prizes[n] + ' boss ' + dungeons[n].is_beatable();
			}
    };
	
	window.rightClickChest = function(label) {
		var value = items.inc(label);
		if (value === 0) {
			if (!flags.wildkeys && !flags.wildbigkeys && flags.gametype != 'R' && label != 'chest10') {
				document.getElementById(label).className = 'chest-' + value + ' large';
			} else {
				document.getElementById(label).className = 'chest-' + value;
			}
			
			document.getElementById(label).innerHTML = '';
		} else {
			if (!flags.wildkeys && !flags.wildbigkeys && flags.gametype != 'R' && label != 'chest10') {
				document.getElementById(label).className = 'chest large';
			} else {
				document.getElementById(label).className = 'chest';
			}
			
			document.getElementById(label).innerHTML = flags.doorshuffle === 'C' ? (value - 1) + '+' : value;
		}
		
		if (flags.mapmode != 'N') {
			var x = label.substring(5);
			if (document.getElementById('dungeon'+x) != null) 
				document.getElementById('dungeon'+x).className = 'dungeon ' + (value ? dungeons[x].can_get_chest() : 'opened');
		}
		updateMapTracker();
	};
	
	window.rightClickKey = function(label) {
		if (label.substring(0,12) === 'smallkeyhalf') {
			if (flags.gametype != 'R') {
				var value = items.dec(label);
				document.getElementById(label).innerHTML = value;
			} else {
				var value = items.inc(label);
				document.getElementById(label).innerHTML = value;
			}
        }		
		if (label.substring(0,8) === 'smallkey' && label.substring(0,12) != 'smallkeyhalf') {
			if (flags.gametype != 'R') {
				var value = items.dec(label);
				document.getElementById(label).innerHTML = value;
			} else {
				var value = items.inc(label);
				document.getElementById(label).innerHTML = value;
			}
        }
		
        if (flags.mapmode != 'N') {
            for (var k = 0; k < chests.length; k++) {
                if (!chests[k].is_opened)
                    document.getElementById('locationMap'+k).className = 'location ' + chests[k].is_available();
            }
            if (flags.entrancemode != 'N') {
				for (var k = 0; k < entrances.length; k++) {
					if (!entrances[k].is_opened) {
						var entrancetype = '';
						if (entrances[k].is_available()) {
							if (entrances[k].known_location != '') {
								entrancetype = isDungeon(entrances[k].known_location) ? 'dungeon' : 'keylocation';
							} else if (entrances[k].is_connector) {
								entrancetype = 'connector';
							}
						}
						document.getElementById('entranceMap'+k).className = 'entrance ' + entrances[k].is_available() + entrancetype;
					}
				}
			} else {
	            for (var k = 0; k < dungeons.length; k++) {
	                if (!dungeons[k].is_beaten)
	                    document.getElementById('bossMap'+k).className = 'bossprize-' + prizes[k] + ' boss ' + dungeons[k].is_beatable();
						if (items['chest'+k])
							document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
				}
			}

			toggle_agahnim();
        }		
	};

    window.toggle_bomb_floor = function() {
		if(rightClickedLocation != -1)
		{
			name = "TT Bomb Floor";
			if(rightClickedType === "chest")
			{
				if(!chests[rightClickedLocation].content)
					chests[rightClickedLocation].content = name;
				else
					chests[rightClickedLocation].content += ", "+name;
					document.getElementById('caption').innerHTML = caption_to_html(name+' placed at '+chests[rightClickedLocation].caption);
				document.getElementById('locationMap'+rightClickedLocation).classList.remove('rightclick');
			}
			if(rightClickedType === "dungeon")
			{
				if(!dungeons[rightClickedLocation].content)
					dungeons[rightClickedLocation].content = name;
				else
					dungeons[rightClickedLocation].content += ", "+name;
					document.getElementById('caption').innerHTML = caption_to_html(name+' placed in '+dungeons[rightClickedLocation].caption);
				document.getElementById('dungeon'+rightClickedLocation).classList.remove('rightclick');
			}
			rightClickedLocation = -1;
			return;
		}
		
        items.bombfloor = !items.bombfloor;

        document.getElementById('bombfloor').className = 'bombfloor-' + (items.bombfloor ? 1 : 0);

		updateMapTracker();
    };

	window.click_map = function() {
		if(rightClickedLocation != -1)
		{
			if(rightClickedType === "chest")
				document.getElementById('locationMap'+rightClickedLocation).classList.remove('rightclick');
			if(rightClickedType === "dungeon")
				document.getElementById('dungeon'+rightClickedLocation).classList.remove('rightclick');
			rightClickedLocation = -1;
		}
	};

	window.rightClickLocation = function(n) {
		if(rightClickedLocation === -1)
		{
			rightClickedLocation = n;
			rightClickedType = "chest";
            document.getElementById('locationMap'+n).classList.add('rightclick');
			document.getElementById('caption').innerHTML = caption_to_html('Select an item to place at '+chests[rightClickedLocation].caption);
		}
		else
			if(rightClickedType === "chest" && rightClickedLocation === n)
			{
				chests[n].content = "";
				document.getElementById('caption').innerHTML = caption_to_html('Content of '+chests[rightClickedLocation].caption+' cleared');
				document.getElementById('locationMap'+n).classList.remove('rightclick');
				rightClickedLocation = -1;
			}
			else
			{
				if(rightClickedType === "chest")
					document.getElementById('locationMap'+rightClickedLocation).classList.remove('rightclick');
				if(rightClickedType === "dungeon")
					document.getElementById('dungeon'+rightClickedLocation).classList.remove('rightclick');
				document.getElementById('locationMap'+n).classList.add('rightclick');
				rightClickedLocation = n;
				rightClickedType = "chest";
				document.getElementById('caption').innerHTML = caption_to_html('Select an item to place at '+chests[rightClickedLocation].caption);
			}
	};

	window.rightClickDungeon = function(n) {
		if(rightClickedLocation === -1)
		{
			rightClickedLocation = n;
			rightClickedType = "dungeon";
            document.getElementById('dungeon'+n).classList.add('rightclick');
			document.getElementById('caption').innerHTML = caption_to_html('Select an item to place in '+dungeons[rightClickedLocation].caption);
		}
		else
			if(rightClickedType === "dungeon" && rightClickedLocation === n)
			{
				dungeons[n].content = "";
				document.getElementById('caption').innerHTML = caption_to_html('Content of '+dungeons[rightClickedLocation].caption+' cleared');
				document.getElementById('dungeon'+n).classList.remove('rightclick');
				rightClickedLocation = -1;
			}
			else
			{
				if(rightClickedType === "chest")
					document.getElementById('locationMap'+rightClickedLocation).classList.remove('rightclick');
				if(rightClickedType === "dungeon")
					document.getElementById('dungeon'+rightClickedLocation).classList.remove('rightclick');
				document.getElementById('dungeon'+n).classList.add('rightclick');
				rightClickedLocation = n;
				rightClickedType = "dungeon";
				document.getElementById('caption').innerHTML = caption_to_html('Select an item to place in '+dungeons[rightClickedLocation].caption);
			}
	};
	
	window.rightClickEntrance = function(n) {
		$('#entranceModal').show();
		document.getElementById('entranceID').value = n;
		document.getElementById('entranceModalTitle').innerHTML = entrances[n].caption;
		document.getElementById('entranceModalNote').value = entrances[n].note;
		document.getElementById('ConnectorListSpan').innerHTML = '';
		var entrancecount = 0;
		if (entrances[n].is_connector) {
			for (var i = 0; i < connectorIndex.length; i++) {
				if ((connectorOne[i] === n || connectorTwo[i] === n) && entrancecount < 3) {
					var spantemplate = document.getElementById('connectTemplateSpan');
					var spanclone = spantemplate.cloneNode(true);
					spanclone.id = "disconnectEntrance" + connectorIndex[i];
					spanclone.setAttribute('onClick','entranceDisconnect(' + connectorIndex[i] + ',' + n + ');');
					spanclone.style.visibility = 'visible';
					if (connectorOne[i] === n) {
						spanclone.innerHTML = entrances[connectorTwo[i]].caption + '&nbsp;&nbsp;&nbsp;<img style="height: 15px;"src="./images/interface/cancel.png" />&nbsp;&nbsp;&nbsp;';
					} else {
						spanclone.innerHTML = entrances[connectorOne[i]].caption + '&nbsp;&nbsp;&nbsp;<img style="height: 15px;"src="./images/interface/cancel.png" />&nbsp;&nbsp;&nbsp;';
					}
					
					var spanlist = document.getElementById('ConnectorListSpan');
					spanlist.appendChild(spanclone);
					entrancecount++;
				}
			}
		}
		
		if (entrancecount > 2) {
			document.getElementById('addConnectorSpan').style.visibility = 'collapse';			
		} else {
			document.getElementById('addConnectorSpan').style.visibility = 'visible';
		}
		
		document.getElementById('entranceModalNote').focus();
		
		document.getElementById('hc_m').style.backgroundColor = '#000';
		document.getElementById('hc_w').style.backgroundColor = '#000';
		document.getElementById('hc_e').style.backgroundColor = '#000';
		document.getElementById('ct').style.backgroundColor = '#000';
		document.getElementById('ep').style.backgroundColor = '#000';
		document.getElementById('dp_m').style.backgroundColor = '#000';
		document.getElementById('dp_w').style.backgroundColor = '#000';
		document.getElementById('dp_e').style.backgroundColor = '#000';
		document.getElementById('dp_n').style.backgroundColor = '#000';
		document.getElementById('toh').style.backgroundColor = '#000';
		document.getElementById('pod').style.backgroundColor = '#000';
		document.getElementById('sp').style.backgroundColor = '#000';
		document.getElementById('sw').style.backgroundColor = '#000';
		document.getElementById('tt').style.backgroundColor = '#000';
		document.getElementById('ip').style.backgroundColor = '#000';
		document.getElementById('mm').style.backgroundColor = '#000';
		document.getElementById('tr_m').style.backgroundColor = '#000';
		document.getElementById('tr_w').style.backgroundColor = '#000';
		document.getElementById('tr_e').style.backgroundColor = '#000';
		document.getElementById('tr_b').style.backgroundColor = '#000';
		document.getElementById('link').style.backgroundColor = '#000';
		document.getElementById('sanc').style.backgroundColor = '#000';
		document.getElementById('mount').style.backgroundColor = '#000';
		document.getElementById('chest').style.backgroundColor = '#000';
		document.getElementById('gt').style.backgroundColor = '#000';
		document.getElementById('ganon').style.backgroundColor = '#000';
		document.getElementById('magic').style.backgroundColor = '#000';
		document.getElementById('kid').style.backgroundColor = '#000';
		document.getElementById('smith').style.backgroundColor = '#000';
		document.getElementById('bat').style.backgroundColor = '#000';
		document.getElementById('library').style.backgroundColor = '#000';
		document.getElementById('sahas').style.backgroundColor = '#000';
		document.getElementById('mimic').style.backgroundColor = '#000';
		document.getElementById('rupee').style.backgroundColor = '#000';
		document.getElementById('shop').style.backgroundColor = '#000';
		document.getElementById('dark').style.backgroundColor = '#000';
		document.getElementById('connector').style.backgroundColor = '#000';		
		document.getElementById('bomb').style.backgroundColor = '#000';
		document.getElementById('bumper').style.backgroundColor = '#000';
		document.getElementById('spike').style.backgroundColor = '#000';
		document.getElementById('hook').style.backgroundColor = '#000';		
		document.getElementById('dam').style.backgroundColor = '#000';		
		
		if (entrances[n].known_location != '') {
			document.getElementById(entrances[n].known_location).style.backgroundColor = '#00F';
		}
	}
	
	window.checkReturn = function(n) {
		if (n.keyCode == 13) {
			hideEntranceModal();
		}
	}
	
	window.hideEntranceModal = function(n) {
		if (overrideEntranceCloseFlag === false) {
			entrances[document.getElementById('entranceID').value].note = document.getElementById('entranceModalNote').value;
			if (document.getElementById('entranceModalNote').value != '') {
				//Add the note icon
				var divtoadd = document.createElement('div');
				divtoadd.id = 'notediv' + document.getElementById('entranceID').value;
				var loc = document.getElementById('entranceMap' + document.getElementById('entranceID').value);
				
				divtoadd.style.top = loc.offsetTop - 10;
				divtoadd.style.left = loc.offsetLeft + 10;
				divtoadd.className = 'notediv';

				divtoadd.style.width = 10;
				divtoadd.style.height = 10;
				divtoadd.style.position = 'absolute';
				
				divtoadd.innerHTML = '!';
				
				document.getElementById('informationDiv').appendChild(divtoadd);				
				
			} else {
				//Remove the note icon if it exists
				var divtoremove = document.getElementById('notediv' + document.getElementById('entranceID').value);
				if (divtoremove != null) {
					divtoremove.remove();
				}
			}
			$('#entranceModal').hide();
		} else {
			overrideEntranceCloseFlag = false;
		}
		
		updateMapTracker();
	}
	
	window.overrideEntranceClose = function(n) {
		overrideEntranceCloseFlag = true;
	}
	
	window.entranceConnect = function(n) {
		prepareToConnect = true;
		$('#entranceModal').hide();
	}
	
	window.entranceDisconnect = function(n, l) {
		for (var i = 0; i < connectorIndex.length; i++) {
			var c1 = connectorOne[i];
			var c2 = connectorTwo[i];
			var c1count = 0;
			var c2count = 0;
			if (connectorIndex[i] === n) {
				connectorIndex.splice(i,1);
				connectorOne.splice(i,1);
				connectorTwo.splice(i,1);
				for (var j = 0; j < connectorOne.length; j++) {
					if (connectorOne[j] === c1 || connectorTwo[j] === c1) {
						c1count++;
					}
					if (connectorOne[j] === c2 || connectorTwo[j] === c2) {
						c2count++;
					}
					
					if (c1count > 0 && c2count > 0) {
						j = 999;
					}
				}
				
				if (c1count === 0) {
					entrances[c1].is_connector = false;
				}
				if (c2count === 0) {
					entrances[c2].is_connector = false;
				}

				i = 999;
			}
		}
		
		var divtoremove = document.getElementById('connectordiv' + n);
		divtoremove.remove();
		updateMapTracker();
		
		hideEntranceModal();
	}
	
	window.StopAConnector = function() {
		document.getElementById('connectorStop').style.visibility = 'hidden';
		connectStart = false;
		connectFinish = false;
	}

	window.StartAConnectorModal = function() {
		document.getElementById('connectorStop').style.visibility = 'visible';
		connectStart = true;
		connectFinish = true;
		$('#entranceModal').hide();
	}
	
	window.HideConnectors = function() {
		if (document.getElementById('connectorLineDiv').style.visibility === 'collapse') {
			document.getElementById('connectorLineDiv').style.visibility = 'visible';
			document.getElementById('hideConnectorLinesImg').src = './images/interface/hide.png';
		} else {
			document.getElementById('connectorLineDiv').style.visibility = 'collapse';
			document.getElementById('hideConnectorLinesImg').src = './images/interface/show.png';
		}
	}
	
	window.tagEntrance = function(n, t) {
		document.getElementById('hc_m').style.backgroundColor = '#000';
		document.getElementById('hc_w').style.backgroundColor = '#000';
		document.getElementById('hc_e').style.backgroundColor = '#000';
		document.getElementById('ct').style.backgroundColor = '#000';
		document.getElementById('ep').style.backgroundColor = '#000';
		document.getElementById('dp_m').style.backgroundColor = '#000';
		document.getElementById('dp_w').style.backgroundColor = '#000';
		document.getElementById('dp_e').style.backgroundColor = '#000';
		document.getElementById('dp_n').style.backgroundColor = '#000';
		document.getElementById('toh').style.backgroundColor = '#000';
		document.getElementById('pod').style.backgroundColor = '#000';
		document.getElementById('sp').style.backgroundColor = '#000';
		document.getElementById('sw').style.backgroundColor = '#000';
		document.getElementById('tt').style.backgroundColor = '#000';
		document.getElementById('ip').style.backgroundColor = '#000';
		document.getElementById('mm').style.backgroundColor = '#000';
		document.getElementById('tr_m').style.backgroundColor = '#000';
		document.getElementById('tr_w').style.backgroundColor = '#000';
		document.getElementById('tr_e').style.backgroundColor = '#000';
		document.getElementById('tr_b').style.backgroundColor = '#000';
		document.getElementById('link').style.backgroundColor = '#000';
		document.getElementById('sanc').style.backgroundColor = '#000';
		document.getElementById('mount').style.backgroundColor = '#000';
		document.getElementById('chest').style.backgroundColor = '#000';
		document.getElementById('gt').style.backgroundColor = '#000';
		document.getElementById('ganon').style.backgroundColor = '#000';
		document.getElementById('magic').style.backgroundColor = '#000';
		document.getElementById('kid').style.backgroundColor = '#000';
		document.getElementById('smith').style.backgroundColor = '#000';
		document.getElementById('bat').style.backgroundColor = '#000';
		document.getElementById('library').style.backgroundColor = '#000';
		document.getElementById('sahas').style.backgroundColor = '#000';
		document.getElementById('mimic').style.backgroundColor = '#000';
		document.getElementById('rupee').style.backgroundColor = '#000';
		document.getElementById('shop').style.backgroundColor = '#000';
		document.getElementById('dark').style.backgroundColor = '#000';
		document.getElementById('connector').style.backgroundColor = '#000';
		document.getElementById('bomb').style.backgroundColor = '#000';
		document.getElementById('bumper').style.backgroundColor = '#000';
		document.getElementById('spike').style.backgroundColor = '#000';
		document.getElementById('hook').style.backgroundColor = '#000';
		document.getElementById('dam').style.backgroundColor = '#000';
		
		if (entrances[document.getElementById('entranceID').value].known_location === n) {
			entrances[document.getElementById('entranceID').value].known_location = '';
			entrances[document.getElementById('entranceID').value].type = 0;
			var information = document.getElementById('informationdiv'+document.getElementById('entranceID').value);
			if (information != null) {
				information.remove();
			}
		} else {
			entrances[document.getElementById('entranceID').value].known_location = n;
			entrances[document.getElementById('entranceID').value].type = (t === true ? 2 : 3);
			document.getElementById(n).style.backgroundColor = '#00F';
			
			if (document.getElementById('informationdiv'+document.getElementById('entranceID').value) != null) {
				document.getElementById('informationdiv'+document.getElementById('entranceID').value).innerHTML = n.replace('_','-').toUpperCase();
			} else {
				var divtoadd = document.createElement('div');
				divtoadd.id = 'informationdiv' + document.getElementById('entranceID').value;
				var loc = document.getElementById('entranceMap' + document.getElementById('entranceID').value);
				
				if (loc.offsetTop < 20) {
					divtoadd.style.top = loc.offsetTop + 15;
				} else {
					divtoadd.style.top = loc.offsetTop - 15;
				}
				
				
				divtoadd.style.left = loc.offsetLeft - 14;
				divtoadd.className = 'informationdiv';

				divtoadd.style.width = 40;
				divtoadd.style.height = 12;
				divtoadd.style.position = 'absolute';
				
				divtoadd.innerHTML = n.replace('_','-').toUpperCase();
				
				document.getElementById('informationDiv').appendChild(divtoadd);
			}		
		}
		hideEntranceModal();
	}

    // event of clicking on Mire/TRock's medallion subsquare
    window.toggle_medallion = function(n) {
        medallions[n] += 1;
        if (medallions[n] === 4) medallions[n] = 0;

        document.getElementById('medallion'+n).className = 'medallion-' + medallions[n];

        if (flags.mapmode != "N") {
            // Update availability of dungeon boss AND chests
            dungeons[8+n].is_beaten = !dungeons[8+n].is_beaten;
            toggle_boss(8+n);
            if (items['chest'+(8+n)] > 0 && document.getElementById('dungeon'+(8+n)) != null)
                document.getElementById('dungeon'+(8+n)).className = 'dungeon ' + dungeons[8+n].can_get_chest();
            // TRock medallion affects Mimic Cave
            if (n === 1) {
                chests[4].is_opened = !chests[4].is_opened;
                toggle_chest(4);
            }
            // Change the mouseover text on the map
            dungeons[8+n].caption = dungeons[8+n].caption.replace(/\{medallion\d+\}/, '{medallion'+medallions[n]+'}');
			updateMapTracker();
        }
    };

    // event of right clicking on a boss's enemizer portrait
    window.rightClickMedallion = function(n) {
        medallions[n] -= 1;
        if (medallions[n] === -1) medallions[n] = 3;
		
        document.getElementById('medallion'+n).className = 'medallion-' + medallions[n];

        if (flags.mapmode != "N") {
            // Update availability of dungeon boss AND chests
            dungeons[8+n].is_beaten = !dungeons[8+n].is_beaten;
            toggle_boss(8+n);
            if (items['chest'+(8+n)] > 0 && document.getElementById('dungeon'+(8+n)) != null)
                document.getElementById('dungeon'+(8+n)).className = 'dungeon ' + dungeons[8+n].can_get_chest();
            // TRock medallion affects Mimic Cave
            if (n === 1) {
                chests[4].is_opened = !chests[4].is_opened;
                toggle_chest(4);
            }
            // Change the mouseover text on the map
            dungeons[8+n].caption = dungeons[8+n].caption.replace(/\{medallion\d+\}/, '{medallion'+medallions[n]+'}');
			updateMapTracker();
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

//    if (flags.mapmode != 'N') {
        // Event of clicking a chest on the map
        window.toggle_chest = function(x) {
            chests[x].is_opened = !chests[x].is_opened;
            var highlight = document.getElementById('locationMap'+x).classList.contains('highlight');
            document.getElementById('locationMap'+x).className = 'location ' +
                (chests[x].is_opened ? 'opened' : chests[x].is_available()) +
                (highlight ? ' highlight' : '');
        };
		// Event of clicking on an entrance on the map
        window.toggle_location = function(x) {
			if (connectStart === false) {
				entrances[x].is_opened = !entrances[x].is_opened;
				var highlight = document.getElementById('entranceMap'+x).classList.contains('highlight');
				document.getElementById('entranceMap'+x).className = 'entrance ' +
					(entrances[x].is_opened ? 'opened' : entrances[x].is_available()) +
					(highlight ? ' highlight' : '');
				var information = document.getElementById('informationdiv'+x);
				if (information != null) {
					information.style.visibility = (entrances[x].is_opened ? 'collapse' : 'visible');
				}
			} else if (connectFinish === true) {
				if (x != parseInt(document.getElementById('entranceID').value)) {
					entrances[x].is_connector = true;
					entrances[document.getElementById('entranceID').value].is_connector = true;
					
					connectorIndex.push(connectorid);
					connectorOne.push(parseInt(document.getElementById('entranceID').value));
					connectorTwo.push(x);
					
					var divtoadd = document.createElement('div');
					divtoadd.id = 'connectordiv' + connectorid;
					var connector1 = document.getElementById('entranceMap' + x);
					var connector2 = document.getElementById('entranceMap' + document.getElementById('entranceID').value);
					
					if (connector1.offsetTop > connector2.offsetTop) {
						divtoadd.style.top = connector2.offsetTop + 6;
					} else {
						divtoadd.style.top = connector1.offsetTop + 6;
					}
					if (connector1.offsetLeft > connector2.offsetLeft) {
						divtoadd.style.left = connector2.offsetLeft + 6;
					} else {
						divtoadd.style.left = connector1.offsetLeft + 6;
					}
					
					if (connector1.offsetLeft > connector2.offsetLeft) {
						if (connector1.offsetTop > connector2.offsetTop) {
							divtoadd.className = 'crossedright';
						} else {
							divtoadd.className = 'crossedleft';
						}
					} else {
						if (connector1.offsetTop > connector2.offsetTop) {
							divtoadd.className = 'crossedleft';
						} else {
							divtoadd.className = 'crossedright';
						}
					}

					divtoadd.style.width = Math.abs(connector1.offsetLeft - connector2.offsetLeft);
					divtoadd.style.height = Math.abs(connector1.offsetTop - connector2.offsetTop);
					divtoadd.style.position = 'absolute';
					
					document.getElementById('connectorLineDiv').appendChild(divtoadd);
					connectorid++;
				}
				
				document.getElementById('connectorStop').style.visibility = 'hidden';
				connectStart = false;
				connectFinish = false;
				
			} else {
				document.getElementById('entranceID').value = x;
				connectFinish = true;
			}
			
			updateMapTracker();
        };
		
        // Event of clicking a dungeon location (not really)
        window.toggle_boss = function(x) {
            dungeons[x].is_beaten = !dungeons[x].is_beaten;
			if (document.getElementById('bossMap'+x) != null) {
				document.getElementById('bossMap'+x).className = 'bossprize-' + prizes[x] + ' boss ' + (dungeons[x].is_beaten ? 'opened' : dungeons[x].is_beatable());
				updateMapTracker();
			}
        };
        window.toggle_agahnim = function() {
			if (flags.entrancemode === 'N') {
				document.getElementById('castle').className = 'castle ' +
					(items.agahnim ? 'opened' : agahnim.is_available());
			}
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
        // Highlights a entrance location and shows the caption
        window.highlight_entrance = function(x) {
            document.getElementById('entranceMap'+x).classList.add('highlight');
			var displayCaption = entrances[x].caption;
			if (entrances[x].known_location != '') {
				displayCaption = displayCaption + ' -- ' + getFriendlyName(entrances[x].known_location);
			}
			if (entrances[x].is_connector) {
				for (var i = 0; i < connectorIndex.length; i++) {
					if (connectorOne[i] === x) {
						displayCaption = displayCaption + ' ==> ' + (entrances[connectorTwo[i]].caption);
					}
					if (connectorTwo[i] === x) {
						displayCaption = displayCaption + ' ==> ' + (entrances[connectorOne[i]].caption);
					}
				}
			}
			if (entrances[x].note != '') {
				displayCaption = displayCaption + ' ['+entrances[x].note+']';
			}
			document.getElementById('caption').innerHTML = caption_to_html(displayCaption);
        };
        window.unhighlight_entrance = function(x) {
            document.getElementById('entranceMap'+x).classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
        };
        // Highlights a chest location and shows the caption (but for dungeons)
        window.highlight_dungeon = function(x) {
            document.getElementById('dungeon'+x).classList.add('highlight');
            document.getElementById('caption').innerHTML = caption_to_html((dungeons[x].content ? (dungeons[x].content+" | ") : "")+(dungeons[x].trashContent ? (dungeons[x].trashContent+" | ") : "")+dungeons[x].caption);
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
    //}

	window.getFriendlyName = function(x) {
		var friendly = '';
		
		switch (x) {
			case 'hc_m':
				friendly = 'Hyrule Castle (Main)';
				break;
			case 'hc_w':
				friendly = 'Hyrule Castle (West)';
				break;
			case 'hc_e':
				friendly = 'Hyrule Castle (East)';
				break;
			case 'ct':
				friendly = 'Castle Tower';
				break;
			case 'ep':
				friendly = 'Eastern Palace';
				break;
			case 'dp_m':
				friendly = 'Desert Palace (Main)';
				break;
			case 'dp_w':
				friendly = 'Desert Palace (West)';
				break;
			case 'dp_e':
				friendly = 'Desert Palace (East)';
				break;
			case 'dp_n':
				friendly = 'Desert Palace (North)';
				break;
			case 'toh':
				friendly = 'Tower of Hera';
				break;
			case 'pod':
				friendly = 'Palace of Darkness';
				break;
			case 'sp':
				friendly = 'Swamp Palace';
				break;
			case 'sw':
				friendly = 'Skull Woods (Back)';
				break;
			case 'tt':
				friendly = 'Thieve\'s Town';
				break;
			case 'ip':
				friendly = 'Ice Palace';
				break;
			case 'mm':
				friendly = 'Misery Mire';
				break;
			case 'tr_m':
				friendly = 'Turtle Rock (Main)';
				break;
			case 'tr_w':
				friendly = 'Turtle Rock (West)';
				break;
			case 'tr_e':
				friendly = 'Turtle Rock (East)';
				break;
			case 'tr_b':
				friendly = 'Turtle Rock (Back)';
				break;
			case 'link':
				friendly = 'Link\'s House';
				break;
			case 'sanc':
				friendly = 'Sanctuary';
				break;
			case 'mount':
				friendly = 'Death Mountain (Start)';
				break;
			case 'chest':
				friendly = 'Room/Cave w/ Chest';
				break;
			case 'gt':
				friendly = 'Ganon\'s Tower';
				break;
			case 'ganon':
				friendly = 'Ganon';
				break;
			case 'magic':
				friendly = 'Magic Shop';
				break;
			case 'kid':
				friendly = 'Lazy Kid';
				break;
			case 'smith':
				friendly = 'Swordsmiths';
				break;
			case 'bat':
				friendly = 'Magic Bat';
				break;
			case 'library':
				friendly = 'Library';
				break;
			case 'sahas':
				friendly = 'Sahasrahla\'s Hut';
				break;
			case 'mimic':
				friendly = 'Mimic Cave';
				break;
			case 'rupee':
				friendly = 'Rupee Cave';
				break;
			case 'shop':
				friendly = 'Shop';
				break;
			case 'dark':
				friendly = 'Dark Cave';
				break;
			case 'bomb':
				friendly = 'Bomb Shop';
				break;
			case 'bumper':
				friendly = 'Bumper Cave';
				break;
			case 'spike':
				friendly = 'Spike Cave';
				break;
			case 'hook':
				friendly = 'Hookshot Cave';
				break;
			case 'connector':
				friendly = 'Unknown Connector';
				break;			
			case 'dam':
				friendly = 'Dam';
				break;
		}
		
		return friendly;
	}

	window.isDungeon = function(x) {
		switch (x) {
			case 'hc_m':
			case 'hc_w':
			case 'hc_e':
			case 'ct':
			case 'ep':
			case 'dp_m':
			case 'dp_w':
			case 'dp_e':
			case 'dp_n':
			case 'toh':
			case 'pod':
			case 'sp':
			case 'sw':
			case 'tt':
			case 'ip':
			case 'mm':
			case 'tr_m':
			case 'tr_w':
			case 'tr_e':
			case 'tr_b':
			case 'gt':
			case 'ganon':
				return true;
				break;
		}
		
		return false;
	}
	
	window.findItems = function(items) {
		if(/*spoilerLoaded && */flags.mapmode != "N")
		{
			var results = "";
			for(var i = 0; i < chests.length; i++)
			{
				if(chests[i].content)
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
			}
			for(var i = 0; i < dungeons.length; i++)
			{
				if(dungeons[i].content)
				{
					var hasItem = false,itemsInLocation = dungeons[i].content.split(", ");
					for(var j = 0; j < items.length; j++)
						if(itemsInLocation.includes(items[j]))
						{
							hasItem = true;
							break;
						}
					if(hasItem)
					{
						if(flags.mapmode != 'N')
							document.getElementById('dungeon'+i).classList.add('highlight');
						var locationName = dungeons[i].caption;
						results = results === "" ?locationName :results+", "+locationName;
					}
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
		//if(spoilerLoaded)
		{
			if(flags.mapmode != 'N')
			{
				for(var i = 0; i < chests.length; i++)
					document.getElementById('locationMap'+i).classList.remove('highlight');
				if (flags.entrancemode != 'N') {
					for(var i = 0; i < entrances.length; i++)
						document.getElementById('entranceMap'+i).classList.remove('highlight');
				}
				else
					for(var i = 0; i < dungeons.length; i++)
						document.getElementById('dungeon'+i).classList.remove('highlight');
			}
            document.getElementById('caption').innerHTML = '&nbsp;';
		}
	};
	
	window.showNiceItems = function(x) {
		if (flags.mapmode != "N") {
			if(spoilerLoaded) {
				document.getElementById('caption').innerHTML = caption_to_html(dungeons[x].niceContent);
			}
		}
	};

	window.clearCaption = function() {
		//if(spoilerLoaded)
		document.getElementById('caption').innerHTML = '&nbsp;';
	};

	window.setSphereItem = function(label) {
		if (lastItem === null) {
			document.getElementById(label).className = "sphere noitem";
		} else {
			if (lastItem.substring(0, 5) === "sword" || lastItem.substring(0, 5) === "shiel" || lastItem.substring(0, 5) === "moonp") {
				document.getElementById(label).className = "sphere sphere" + lastItem;
			}
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
		updateMapTracker();	
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
		updateMapTracker();
	}
	
	window.updateMapTracker = function() {
		click_map();
		toggle('moonpearl');
		toggle('moonpearl');
	}

	window.changeFlags = function() {
		//Set flags
		document.getElementById("stateselect").value = flags.gametype;
		document.getElementById("entranceselect").value = flags.entrancemode;
		document.getElementById("bossselect").value = flags.bossshuffle;
		document.getElementById("enemyselect").value = flags.enemyshuffle;
		document.getElementById("shuffledmaps").checked = (flags.wildmaps ? true : false);
		document.getElementById("shuffledcompasses").checked = (flags.wildcompasses ? true : false);
		document.getElementById("shuffledkeys").checked = (flags.wildkeys ? true : false);
		document.getElementById("shuffledbigkeys").checked = (flags.wildbigkeys ? true : false);
		document.getElementById("goalselect").value = flags.goals;
		document.getElementById("swordselect").value = flags.swordmode;
		
		$('#flagsModal').show();
	}
	
	window.closeFlagsModal = function() {
		$('#flagsModal').hide();
	}
	window.adjustFlags = function() {
		var adjustForRetro = false;
		var adjustForEntrance = false;
		
		//World State
		if (document.getElementById('stateselect').value != flags.gametype)
		{
			if (document.getElementById('stateselect').value === "R" || flags.gametype === "R") {
				adjustForRetro = true;
			}
			
			if (flags.entrancemode === "N") {
				if (document.getElementById('stateselect').value === "I") {
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
				} else {
					document.getElementById('locationMap2').style.left = "27.4%";
					document.getElementById('locationMap65').style.left = "21.0%";
					document.getElementById('locationMap65').style.top = "52.6%";
					
					document.getElementById('locationMap66').style.left = "29.0%";
					document.getElementById('locationMap66').style.top = "52.6%";
					
					document.getElementById('bossMapAgahnim').style.left = "25.0%";
					document.getElementById('bossMapAgahnim').style.top = "52.6%";
					document.getElementById('castle').style.left = "25.0%";
					document.getElementById('castle').style.top = "52.6%";
					
					document.getElementById('bossMap10').style.left = "79.0%";
					document.getElementById('bossMap10').style.top = "5.5%";
					document.getElementById('dungeon10').style.left = "79.0%";
					document.getElementById('dungeon10').style.top = "5.5%";
				}
				
				if (document.getElementById('stateselect').value === "I" || flags.gametype === "I") {
					flags.gametype = document.getElementById('stateselect').value;
					loadChestFlags();
				}
			}
			else
			{
				if (document.getElementById('stateselect').value === "I") {
					window.document.getElementById('locationMap1').style.visibility = 'hidden';
					window.document.getElementById('entranceMap10').style.top = "40.0%";
					window.document.getElementById('entranceMap93').style.left = "25.7%";
					window.document.getElementById('entranceMap93').style.top = "43.0%";
					window.document.getElementById('entranceMap95').style.left = "23.2%";
					window.document.getElementById('entranceMap95').style.top = "44.0%";
				} else {
					window.document.getElementById('locationMap1').style.visibility = 'inherit';
					window.document.getElementById('entranceMap10').style.top = "42%";
					window.document.getElementById('entranceMap93').style.left = "25.7%";
					window.document.getElementById('entranceMap93').style.top = "42%";
					window.document.getElementById('entranceMap95').style.left = "72.4%";
					window.document.getElementById('entranceMap95').style.top = "50%";
				}
			}
			
			if (document.getElementById('entranceselect').value === "S") {
				adjustForEntrance = true;
			}
			
			flags.gametype = document.getElementById('stateselect').value;	
		}
		
		//Boss Shuffle
		if (document.getElementById('bossselect').value != flags.bossshuffle)
		{
			flags.bossshuffle = document.getElementById('bossselect').value;
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
				for (var k = 0; k < dungeons.length; k++) {
					enemizer[k] = k + 1;
				}
			} else {
				document.getElementById('dungeonEnemy0').style.visibility = 'inherit';
				document.getElementById('dungeonEnemy1').style.visibility = 'inherit';
				document.getElementById('dungeonEnemy2').style.visibility = 'inherit';
				document.getElementById('dungeonEnemy3').style.visibility = 'inherit';
				document.getElementById('dungeonEnemy4').style.visibility = 'inherit';
				document.getElementById('dungeonEnemy5').style.visibility = 'inherit';
				document.getElementById('dungeonEnemy6').style.visibility = 'inherit';
				document.getElementById('dungeonEnemy7').style.visibility = 'inherit';
				document.getElementById('dungeonEnemy8').style.visibility = 'inherit';
				document.getElementById('dungeonEnemy9').style.visibility = 'inherit';				
				for (var k = 0; k < dungeons.length; k++) {
					enemizer[k] = 0;
				}
			}
		}
		
		//Enemy Shuffle
		if (document.getElementById('enemyselect').value != flags.enemyshuffle) {
			flags.enemyshuffle = document.getElementById('enemyselect').value;
		}
		
		//Dungeon Items
		if (document.getElementById('shuffledmaps').checked != flags.wildmaps || document.getElementById('shuffledcompasses').checked != flags.wildcompasses || document.getElementById('shuffledkeys').checked != flags.wildkeys || document.getElementById('shuffledbigkeys').checked != flags.wildbigkeys || adjustForRetro) {
			
			var chestschecked0 = items.maxchest0 - items.chest0;
			var chestschecked1 = items.maxchest1 - items.chest1;
			var chestschecked2 = items.maxchest2 - items.chest2;
			var chestschecked3 = items.maxchest3 - items.chest3;
			var chestschecked4 = items.maxchest4 - items.chest4;
			var chestschecked5 = items.maxchest5 - items.chest5;
			var chestschecked6 = items.maxchest6 - items.chest6;
			var chestschecked7 = items.maxchest7 - items.chest7;
			var chestschecked8 = items.maxchest8 - items.chest8;
			var chestschecked9 = items.maxchest9 - items.chest9;
			var chestschecked10 = items.maxchest10 - items.chest10;
			
			var chestmod = 0;
			
			if (document.getElementById('shuffledmaps').checked) {
				chestmod++;
			}
			
			if (document.getElementById('shuffledcompasses').checked) {
				chestmod++;
			}
			
			if (document.getElementById('shuffledbigkeys').checked) {
				chestmod++;
			}
			
			var chests0 = flags.doorshuffle === 'C' ? 3 + chestmod : 3 + chestmod;
			var chests1 = flags.doorshuffle === 'C' ? 3 + chestmod : 2 + chestmod + ((document.getElementById('shuffledkeys').checked || flags.gametype === 'R') ? 1 : 0);
			var chests2 = flags.doorshuffle === 'C' ? 3 + chestmod : 2 + chestmod + ((document.getElementById('shuffledkeys').checked || flags.gametype === 'R') ? 1 : 0);
			var chests3 = flags.doorshuffle === 'C' ? 3 + chestmod : 5 + chestmod + ((document.getElementById('shuffledkeys').checked || flags.gametype === 'R') ? 6 : 0);
			var chests4 = flags.doorshuffle === 'C' ? 3 + chestmod : 6 + chestmod + ((document.getElementById('shuffledkeys').checked || flags.gametype === 'R') ? 1 : 0);
			var chests5 = flags.doorshuffle === 'C' ? 3 + chestmod : 2 + chestmod + ((document.getElementById('shuffledkeys').checked || flags.gametype === 'R') ? 3 : 0);
			var chests6 = flags.doorshuffle === 'C' ? 3 + chestmod : 4 + chestmod + ((document.getElementById('shuffledkeys').checked || flags.gametype === 'R') ? 1 : 0);
			var chests7 = flags.doorshuffle === 'C' ? 3 + chestmod : 3 + chestmod + ((document.getElementById('shuffledkeys').checked || flags.gametype === 'R') ? 2 : 0);
			var chests8 = flags.doorshuffle === 'C' ? 3 + chestmod : 2 + chestmod + ((document.getElementById('shuffledkeys').checked || flags.gametype === 'R') ? 3 : 0);
			var chests9 = flags.doorshuffle === 'C' ? 3 + chestmod : 5 + chestmod + ((document.getElementById('shuffledkeys').checked || flags.gametype === 'R') ? 4 : 0);
			var chests10 = flags.doorshuffle === 'C' ? 3 + chestmod : 20 + chestmod + ((document.getElementById('shuffledkeys').checked || flags.gametype === 'R') ? 4 : 0);
			
			items.chest0 = chests0 - chestschecked0;
			items.chest1 = chests1 - chestschecked1;
			items.chest2 = chests2 - chestschecked2;
			items.chest3 = chests3 - chestschecked3;
			items.chest4 = chests4 - chestschecked4;
			items.chest5 = chests5 - chestschecked5;
			items.chest6 = chests6 - chestschecked6;
			items.chest7 = chests7 - chestschecked7;
			items.chest8 = chests8 - chestschecked8;
			items.chest9 = chests9 - chestschecked9;
			items.chest10 = chests10 - chestschecked10;
			
			if (items.chest0 < 0) {
				items.chest0 = 0;
			}

			if (items.chest1 < 0) {
				items.chest1 = 0;
			}

			if (items.chest2 < 0) {
				items.chest2 = 0;
			}

			if (items.chest3 < 0) {
				items.chest3 = 0;
			}

			if (items.chest4 < 0) {
				items.chest4 = 0;
			}

			if (items.chest5 < 0) {
				items.chest5 = 0;
			}

			if (items.chest6 < 0) {
				items.chest6 = 0;
			}

			if (items.chest7 < 0) {
				items.chest7 = 0;
			}

			if (items.chest8 < 0) {
				items.chest8 = 0;
			}

			if (items.chest9 < 0) {
				items.chest9 = 0;
			}

			if (items.chest10 < 0) {
				items.chest10 = 0;
			}

			items.chest1 = (items.chest1 < 0 ? 0 : items.chest1);
			items.chest2 = (items.chest2 < 0 ? 0 : items.chest2);
			items.chest3 = (items.chest3 < 0 ? 0 : items.chest3);
			items.chest4 = (items.chest4 < 0 ? 0 : items.chest4);
			items.chest5 = (items.chest5 < 0 ? 0 : items.chest5);
			items.chest6 = (items.chest6 < 0 ? 0 : items.chest6);
			items.chest7 = (items.chest7 < 0 ? 0 : items.chest7);
			items.chest8 = (items.chest8 < 0 ? 0 : items.chest8);
			items.chest9 = (items.chest9 < 0 ? 0 : items.chest9);
			items.chest10 = (items.chest10 < 0 ? 0 : items.chest10);

			items.maxchest0 = chests0;
			items.maxchest1 = chests1;
			items.maxchest2 = chests2;
			items.maxchest3 = chests3;
			items.maxchest4 = chests4;
			items.maxchest5 = chests5;
			items.maxchest6 = chests6;
			items.maxchest7 = chests7;
			items.maxchest8 = chests8;
			items.maxchest9 = chests9;
			items.maxchest10 = chests10;
			
			items.inc = limit(1, {
				tunic: { min: 1, max: 3 },
				sword: { max: 4 },
				shield: { max: 3 },
				bottle: { max: 4 },
				bow: { max: 2 },
				boomerang: { max: 3 },
				glove: { max: 2 },
				smallkey0: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 0 },
				smallkey1: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 1 },
				smallkey2: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 1 },
				smallkey3: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 6 },
				smallkey4: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 1 },
				smallkey5: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 3 },
				smallkey6: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 1 },
				smallkey7: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 2 },
				smallkey8: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 3 },
				smallkey9: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 4 },
				smallkey10: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 4 },
				smallkeyhalf0: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 1 },
				smallkeyhalf1: { min: 0, max: flags.doorshuffle === 'C' ? 29 : 2 },
				chest0: { min: 0, max: chests0 },
				chest1: { min: 0, max: chests1 },
				chest2: { min: 0, max: chests2 },
				chest3: { min: 0, max: chests3 },
				chest4: { min: 0, max: chests4 },
				chest5: { min: 0, max: chests5 },
				chest6: { min: 0, max: chests6 },
				chest7: { min: 0, max: chests7 },
				chest8: { min: 0, max: chests8 },
				chest9: { min: 0, max: chests9 },
				chest10: { min: 0, max: chests10 }
			}); 
			
			items.dec = limit(-1, {
				chest0: { max: chests0 },
				chest1: { max: chests1 },
				chest2: { max: chests2 },
				chest3: { max: chests3 },
				chest4: { max: chests4 },
				chest5: { max: chests5 },
				chest6: { max: chests6 },
				chest7: { max: chests7 },
				chest8: { max: chests8 },
				chest9: { max: chests9 },
				chest10: { max: chests10 },
				smallkey0: { max: flags.doorshuffle === 'C' ? 29 : 0 },
				smallkey1: { max: flags.doorshuffle === 'C' ? 29 : 1 },
				smallkey2: { max: flags.doorshuffle === 'C' ? 29 : 1 },
				smallkey3: { max: flags.doorshuffle === 'C' ? 29 : 6 },
				smallkey4: { max: flags.doorshuffle === 'C' ? 29 : 1 },
				smallkey5: { max: flags.doorshuffle === 'C' ? 29 : 3 },
				smallkey6: { max: flags.doorshuffle === 'C' ? 29 : 1 },
				smallkey7: { max: flags.doorshuffle === 'C' ? 29 : 2 },
				smallkey8: { max: flags.doorshuffle === 'C' ? 29 : 3 },
				smallkey9: { max: flags.doorshuffle === 'C' ? 29 : 4 },
				smallkey10: { max: flags.doorshuffle === 'C' ? 29 : 4 },
				smallkeyhalf0: { max: flags.doorshuffle === 'C' ? 29 : 1 },
				smallkeyhalf1: { max: flags.doorshuffle === 'C' ? 29 : 2 }
			});
			
			rightClickChest('chest0');
			toggle('chest0');
			rightClickChest('chest1');
			toggle('chest1');
			rightClickChest('chest2');
			toggle('chest2');
			rightClickChest('chest3');
			toggle('chest3');
			rightClickChest('chest4');
			toggle('chest4');
			rightClickChest('chest5');
			toggle('chest5');
			rightClickChest('chest6');
			toggle('chest6');
			rightClickChest('chest7');
			toggle('chest7');
			rightClickChest('chest8');
			toggle('chest8');
			rightClickChest('chest9');
			toggle('chest9');
			rightClickChest('chest10');
			toggle('chest10');			
			
			
			/* document.getElementById('chest0').innerHTML = (items.chest0 > 0 ? items.chest0 : '');
			document.getElementById('chest1').innerHTML = (items.chest1 > 0 ? items.chest1 : '');
			document.getElementById('chest2').innerHTML = (items.chest2 > 0 ? items.chest2 : '');
			document.getElementById('chest3').innerHTML = (items.chest3 > 0 ? items.chest3 : '');
			document.getElementById('chest4').innerHTML = (items.chest4 > 0 ? items.chest4 : '');
			document.getElementById('chest5').innerHTML = (items.chest5 > 0 ? items.chest5 : '');
			document.getElementById('chest6').innerHTML = (items.chest6 > 0 ? items.chest6 : '');
			document.getElementById('chest7').innerHTML = (items.chest7 > 0 ? items.chest7 : '');
			document.getElementById('chest8').innerHTML = (items.chest8 > 0 ? items.chest8 : '');
			document.getElementById('chest9').innerHTML = (items.chest9 > 0 ? items.chest9 : '');
			document.getElementById('chest10').innerHTML = (items.chest10 > 0 ? items.chest10 : ''); */
			
			if (!document.getElementById('shuffledbigkeys').checked) {
				if (!items.bigkey0) toggle('bigkey0');
				if (!items.bigkey1) toggle('bigkey1');
				if (!items.bigkey2) toggle('bigkey2');
				if (!items.bigkey3) toggle('bigkey3');
				if (!items.bigkey4) toggle('bigkey4');
				if (!items.bigkey5) toggle('bigkey5');
				if (!items.bigkey6) toggle('bigkey6');
				if (!items.bigkey7) toggle('bigkey7');
				if (!items.bigkey8) toggle('bigkey8');
				if (!items.bigkey9) toggle('bigkey9');
				if (!items.bigkey10) toggle('bigkey10');
				if (!items.bigkeyhalf0) toggle('bigkeyhalf0');
				if (!items.bigkeyhalf1) toggle('bigkeyhalf1');		
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
				document.getElementById('bigkeyhalf0').style.visibility = 'hidden';
				document.getElementById('bigkeyhalf1').style.visibility = 'hidden';
			} else {
				if (items.bigkey0) toggle('bigkey0');
				if (items.bigkey1) toggle('bigkey1');
				if (items.bigkey2) toggle('bigkey2');
				if (items.bigkey3) toggle('bigkey3');
				if (items.bigkey4) toggle('bigkey4');
				if (items.bigkey5) toggle('bigkey5');
				if (items.bigkey6) toggle('bigkey6');
				if (items.bigkey7) toggle('bigkey7');
				if (items.bigkey8) toggle('bigkey8');
				if (items.bigkey9) toggle('bigkey9');
				if (items.bigkey10) toggle('bigkey10');
				if (items.bigkeyhalf0) toggle('bigkeyhalf0');
				if (items.bigkeyhalf1) toggle('bigkeyhalf1');
				document.getElementById('bigkey0').style.visibility = 'visible';
				document.getElementById('bigkey1').style.visibility = 'visible';
				document.getElementById('bigkey2').style.visibility = 'visible';
				document.getElementById('bigkey3').style.visibility = 'visible';
				document.getElementById('bigkey4').style.visibility = 'visible';
				document.getElementById('bigkey5').style.visibility = 'visible';
				document.getElementById('bigkey6').style.visibility = 'visible';
				document.getElementById('bigkey7').style.visibility = 'visible';
				document.getElementById('bigkey8').style.visibility = 'visible';
				document.getElementById('bigkey9').style.visibility = 'visible';
				document.getElementById('bigkey10').style.visibility = 'visible';
				document.getElementById('bigkeyhalf0').style.visibility = flags.doorshuffle === 'C' ? 'visible' : 'hidden';
				document.getElementById('bigkeyhalf1').style.visibility = flags.doorshuffle === 'C' ? 'visible' : 'hidden';
			}
			
			if (document.getElementById('shuffledkeys').checked && flags.gametype != 'R') {
				if (!flags.wildkeys) {
					items.smallkey0 = 0;
					items.smallkey1 = 0;
					items.smallkey2 = 0;
					items.smallkey3 = 0;
					items.smallkey4 = 0;
					items.smallkey5 = 0;
					items.smallkey6 = 0;
					items.smallkey7 = 0;
					items.smallkey8 = 0;
					items.smallkey9 = 0;
					items.smallkey10 = 0;
					items.smallkeyhalf0 = 0;
					items.smallkeyhalf1 = 0;
				}
			} else {// if (flags.gametype != 'R') {
				items.smallkey0 = flags.doorshuffle === 'C' ? 29 : 0;
				items.smallkey1 = flags.doorshuffle === 'C' ? 29 : 1;
				items.smallkey2 = flags.doorshuffle === 'C' ? 29 : 1;
				items.smallkey3 = flags.doorshuffle === 'C' ? 29 : 6;
				items.smallkey4 = flags.doorshuffle === 'C' ? 29 : 1;
				items.smallkey5 = flags.doorshuffle === 'C' ? 29 : 3;
				items.smallkey6 = flags.doorshuffle === 'C' ? 29 : 1;
				items.smallkey7 = flags.doorshuffle === 'C' ? 29 : 2;
				items.smallkey8 = flags.doorshuffle === 'C' ? 29 : 3;
				items.smallkey9 = flags.doorshuffle === 'C' ? 29 : 4;
				items.smallkey10 = flags.doorshuffle === 'C' ? 29 : 4;
				items.smallkeyhalf0 = flags.doorshuffle === 'C' ? 29 : 1;
				items.smallkeyhalf1 = flags.doorshuffle === 'C' ? 29 : 2;
			}
			
			document.getElementById('smallkey0').innerHTML = items.smallkey0;
			document.getElementById('smallkey1').innerHTML = items.smallkey1;
			document.getElementById('smallkey2').innerHTML = items.smallkey2;
			document.getElementById('smallkey3').innerHTML = items.smallkey3;
			document.getElementById('smallkey4').innerHTML = items.smallkey4;
			document.getElementById('smallkey5').innerHTML = items.smallkey5;
			document.getElementById('smallkey6').innerHTML = items.smallkey6;
			document.getElementById('smallkey7').innerHTML = items.smallkey7;
			document.getElementById('smallkey8').innerHTML = items.smallkey8;
			document.getElementById('smallkey9').innerHTML = items.smallkey9;
			document.getElementById('smallkey10').innerHTML = items.smallkey10;
			document.getElementById('smallkeyhalf0').innerHTML = items.smallkeyhalf0;
			document.getElementById('smallkeyhalf1').innerHTML = items.smallkeyhalf1;
			
			//If small keys are not shuffled, hide the icons
			if (!document.getElementById('shuffledkeys').checked && flags.gametype != 'R') {
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
			} else {
				document.getElementById('smallkey0').style.visibility = 'visible';
				document.getElementById('smallkey1').style.visibility = 'visible';
				document.getElementById('smallkey2').style.visibility = 'visible';
				document.getElementById('smallkey3').style.visibility = 'visible';
				document.getElementById('smallkey4').style.visibility = 'visible';
				document.getElementById('smallkey5').style.visibility = 'visible';
				document.getElementById('smallkey6').style.visibility = 'visible';
				document.getElementById('smallkey7').style.visibility = 'visible';
				document.getElementById('smallkey8').style.visibility = 'visible';
				document.getElementById('smallkey9').style.visibility = 'visible';
				document.getElementById('smallkey10').style.visibility = 'visible';
				document.getElementById('smallhalfheader0').style.visibility = 'visible';
				document.getElementById('smallkeyhalf0').style.visibility = 'visible';
				document.getElementById('smallhalfheader1').style.visibility = 'visible';
				document.getElementById('smallkeyhalf1').style.visibility = 'visible';
			}
			
			if (!document.getElementById('shuffledkeys').checked && !document.getElementById('shuffledbigkeys').checked) {
				document.getElementById('chest0').classList.add('large');
				document.getElementById("c0bkdiv").classList.add('hidden');
				document.getElementById("c0skdiv").classList.add('hidden');
				document.getElementById('chest1').classList.add('large');
				document.getElementById("c1bkdiv").classList.add('hidden');
				document.getElementById("c1skdiv").classList.add('hidden');
				document.getElementById('chest2').classList.add('large');
				document.getElementById("c2bkdiv").classList.add('hidden');
				document.getElementById("c2skdiv").classList.add('hidden');
				document.getElementById('chest3').classList.add('large');
				document.getElementById("c3bkdiv").classList.add('hidden');
				document.getElementById("c3skdiv").classList.add('hidden');
				document.getElementById('chest4').classList.add('large');
				document.getElementById("c4bkdiv").classList.add('hidden');
				document.getElementById("c4skdiv").classList.add('hidden');
				document.getElementById('chest5').classList.add('large');
				document.getElementById("c5bkdiv").classList.add('hidden');
				document.getElementById("c5skdiv").classList.add('hidden');
				document.getElementById('chest6').classList.add('large');
				document.getElementById("c6bkdiv").classList.add('hidden');
				document.getElementById("c6skdiv").classList.add('hidden');
				document.getElementById('chest7').classList.add('large');
				document.getElementById("c7bkdiv").classList.add('hidden');
				document.getElementById("c7skdiv").classList.add('hidden');
				document.getElementById('chest8').classList.add('large');
				document.getElementById("c8bkdiv").classList.add('hidden');
				document.getElementById("c8skdiv").classList.add('hidden');
				document.getElementById('chest9').classList.add('large');
				document.getElementById("c9bkdiv").classList.add('hidden');
				document.getElementById("c9skdiv").classList.add('hidden');
			} else {
				document.getElementById('chest0').classList.remove('large');
				document.getElementById("c0bkdiv").classList.remove('hidden');
				document.getElementById("c0skdiv").classList.remove('hidden');
				document.getElementById('chest1').classList.remove('large');
				document.getElementById("c1bkdiv").classList.remove('hidden');
				document.getElementById("c1skdiv").classList.remove('hidden');
				document.getElementById('chest2').classList.remove('large');
				document.getElementById("c2bkdiv").classList.remove('hidden');
				document.getElementById("c2skdiv").classList.remove('hidden');
				document.getElementById('chest3').classList.remove('large');
				document.getElementById("c3bkdiv").classList.remove('hidden');
				document.getElementById("c3skdiv").classList.remove('hidden');
				document.getElementById('chest4').classList.remove('large');
				document.getElementById("c4bkdiv").classList.remove('hidden');
				document.getElementById("c4skdiv").classList.remove('hidden');
				document.getElementById('chest5').classList.remove('large');
				document.getElementById("c5bkdiv").classList.remove('hidden');
				document.getElementById("c5skdiv").classList.remove('hidden');
				document.getElementById('chest6').classList.remove('large');
				document.getElementById("c6bkdiv").classList.remove('hidden');
				document.getElementById("c6skdiv").classList.remove('hidden');
				document.getElementById('chest7').classList.remove('large');
				document.getElementById("c7bkdiv").classList.remove('hidden');
				document.getElementById("c7skdiv").classList.remove('hidden');
				document.getElementById('chest8').classList.remove('large');
				document.getElementById("c8bkdiv").classList.remove('hidden');
				document.getElementById("c8skdiv").classList.remove('hidden');
				document.getElementById('chest9').classList.remove('large');
				document.getElementById("c9bkdiv").classList.remove('hidden');
				document.getElementById("c9skdiv").classList.remove('hidden');				
			}
			
			flags.wildmaps = document.getElementById('shuffledmaps').checked;
			flags.wildcompasses = document.getElementById('shuffledcompasses').checked;
			flags.wildkeys = document.getElementById('shuffledkeys').checked;
			flags.wildbigkeys = document.getElementById('shuffledbigkeys').checked;
		}

		if (document.getElementById('locationMap65') != null) {
			var showAgaChests = document.getElementById('shuffledkeys').checked || document.getElementById('stateselect').value === 'R' || flags.doorshuffle === 'C';
			document.getElementById('locationMap65').style.visibility = showAgaChests ? 'visible' : 'hidden';
			document.getElementById('locationMap66').style.visibility = showAgaChests ? 'visible' : 'hidden';
		}
		
		//Goal
		if (document.getElementById('goalselect').value != flags.goals) {
			
			
			document.getElementById('ganondiv').classList.remove('ganon');
			document.getElementById('ganondiv').classList.remove('pendants');
			document.getElementById('ganondiv').classList.remove('other');
			document.getElementById('ganondiv').classList.remove('alldungeons');
			
			switch (document.getElementById('goalselect').value) {
				case 'G':
				case 'F':
					if (flags.ganonvulncount === 8 || flags.goals === 'A') {
						document.getElementById('ganondiv').classList.add('ganon');
					} else {
						document.getElementById('ganondiv').classList.add('ganon' + flags.ganonvulncount);
					}
					break;
				case 'A':
					document.getElementById('ganondiv').classList.add('alldungeons');
					flags.ganonvulncount = 7;
					break;
				case 'P':
					document.getElementById('ganondiv').classList.add('pendants');
					flags.ganonvulncount = 8;
					break;
				case 'O':
					document.getElementById('ganondiv').classList.add('other');
					break;
			}
			
			flags.goals = document.getElementById('goalselect').value;
		}
		
		//Swords
		if (document.getElementById('swordselect').value != flags.swordmode) {
			if (document.getElementById('swordselect').value === "S") {
				while (items.sword != 0) {
					toggle('sword');
				}
			}
			flags.swordmode = document.getElementById('swordselect').value;
		}
		
		//Entrance
		if (document.getElementById('entranceselect').value != flags.entrancemode || adjustForEntrance) {
			var currentURL = window.location.href;
			
			if (document.getElementById('entranceselect').value === "N") {
				currentURL = currentURL.replace("entrancetracker.html", "tracker.html");
			} else {
				if (currentURL.indexOf("entrancetracker.html") === -1) {
					currentURL = currentURL.replace("tracker.html", "entrancetracker.html");
				}
			}
			
			var fParam = currentURL.substr(currentURL.indexOf("f=") + 2, 27);
			
			var replaceParam = flags.gametype + document.getElementById('entranceselect').value + flags.bossshuffle + flags.enemyshuffle + flags.glitches + flags.itemplacement + flags.goals + flags.opentower + flags.opentowercount + flags.ganonvuln + flags.ganonvulncount + flags.swordmode + flags.mapmode + flags.spoilermode + flags.spheresmode + 'Y' + 'N' + (flags.wildmaps ? '1' : '0') + (flags.wildcompasses ? '1' : '0') + (flags.wildkeys ? '1' : '0') + (flags.wildbigkeys ? '1' : '0') + flags.ambrosia + flags.autotracking + flags.trackingport;

			currentURL = currentURL.replace(fParam, replaceParam);
			
			window.location.href = currentURL;
		}
		
		updateMapTracker();
		
		if (flags.gametype === "S" && flags.entrancemode === 'N') {
			document.getElementById('locationMap2').classList.remove('unavailable');
			document.getElementById('locationMap56').classList.remove('unavailable');
			document.getElementById('locationMap58').classList.remove('unavailable');
			document.getElementById('locationMap2').classList.add('opened');
			document.getElementById('locationMap56').classList.add('opened');
			document.getElementById('locationMap58').classList.add('opened');
			chests[2].is_opened = true;
			chests[56].is_opened = true;
			chests[58].is_opened = true;
			if (flags.doorshuffle === 'N') {
				document.getElementById('locationMap57').classList.remove('unavailable');
				document.getElementById('locationMap63').classList.remove('unavailable');
				document.getElementById('locationMap57').classList.add('opened');
				document.getElementById('locationMap63').classList.add('opened');
				chests[57].is_opened = true;
				chests[63].is_opened = true;
			}
		}
		
		$('#flagsModal').hide();
	}
	
	function limit(delta, limits) {
        return function(item) {
            var value = items[item],
                max = limits[item].max,
                min = limits[item].min || 0;
            value += delta;
            if (value > max) value = min;
            if (value < min) value = max;
            return items[item] = value;
        };
    }
	
	function compactMapMenu()
	{
		return '<table style="color: white;">'+
'	<tr>'+
'		<td colspan="7">'+
'			Light World Dungeons'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td>'+
'			<img src="./images/interface/hc_m.png" style="cursor: pointer;" onclick="tagEntrance(\'hc_m\', true)" id="hc_m" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/hc_w.png" style="cursor: pointer;" onclick="tagEntrance(\'hc_w\', true)" id="hc_w" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/hc_e.png" style="cursor: pointer;" onclick="tagEntrance(\'hc_e\', true)" id="hc_e" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/ct.png" style="cursor: pointer;" onclick="tagEntrance(\'ct\', true)" id="ct" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/ep.png" style="cursor: pointer;" onclick="tagEntrance(\'ep\', true)" id="ep" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/dp_m.png" style="cursor: pointer;" onclick="tagEntrance(\'dp_m\', true)" id="dp_m" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/dp_w.png" style="cursor: pointer;" onclick="tagEntrance(\'dp_w\', true)" id="dp_w" />'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td>'+
'			<img src="./images/interface/dp_e.png" style="cursor: pointer;" onclick="tagEntrance(\'dp_e\', true)" id="dp_e" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/dp_n.png" style="cursor: pointer;" onclick="tagEntrance(\'dp_n\', true)" id="dp_n" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/toh.png" style="cursor: pointer;" onclick="tagEntrance(\'toh\', true)" id="toh" />'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td colspan="7">'+
'			Light World Key Locations'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td>'+
'			<img src="./images/interface/magic.png" style="cursor: pointer;" onclick="tagEntrance(\'magic\', false)" id="magic" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/kid.png" style="cursor: pointer;" onclick="tagEntrance(\'kid\', false)" id="kid" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/smith.png" style="cursor: pointer;" onclick="tagEntrance(\'smith\', false)" id="smith" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/bat.png" style="cursor: pointer;" onclick="tagEntrance(\'bat\', false)" id="bat" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/library.png" style="cursor: pointer;" onclick="tagEntrance(\'library\', false)" id="library" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/sahas.png" style="cursor: pointer;" onclick="tagEntrance(\'sahas\', false)" id="sahas" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/mimic.png" style="cursor: pointer;" onclick="tagEntrance(\'mimic\', false)" id="mimic" />'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td>'+
'			<img src="./images/interface/dam.png" style="cursor: pointer;" onclick="tagEntrance(\'dam\', false)" id="dam" />'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td colspan="7">'+
'			General Key Locations'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td>'+
'			<img src="./images/interface/rupee.png" style="cursor: pointer;" onclick="tagEntrance(\'rupee\', false)" id="rupee" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/shop.png" style="cursor: pointer;" onclick="tagEntrance(\'shop\', false)" id="shop" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/dark.png" style="cursor: pointer;" onclick="tagEntrance(\'dark\', false)" id="dark" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/connector.png" style="cursor: pointer;" onclick="tagEntrance(\'connector\', false)" id="connector" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/chest.png" style="cursor: pointer;" onclick="tagEntrance(\'chest\', false)" id="chest" />'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td colspan="7">'+
'			Starting Locations'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td>'+
'			<img src="./images/interface/link.png" style="cursor: pointer;" onclick="tagEntrance(\'link\', true)" id="link" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/sanc.png" style="cursor: pointer;" onclick="tagEntrance(\'sanc\', true)" id="sanc" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/mount.png" style="cursor: pointer;" onclick="tagEntrance(\'mount\', true)" id="mount" />'+
'		</td>							'+
'		'+
'		<td>'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td colspan="7">'+
'			Dark World Dungeons'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td>'+
'			<img src="./images/interface/pod.png" style="cursor: pointer;" onclick="tagEntrance(\'pod\', true)" id="pod" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/sp.png" style="cursor: pointer;" onclick="tagEntrance(\'sp\', true)" id="sp" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/sw.png" style="cursor: pointer;" onclick="tagEntrance(\'sw\', true)" id="sw" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/tt.png" style="cursor: pointer;" onclick="tagEntrance(\'tt\', true)" id="tt" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/ip.png" style="cursor: pointer;" onclick="tagEntrance(\'ip\', true)" id="ip" />'+
'		</td>		'+
'		<td>'+
'			<img src="./images/interface/mm.png" style="cursor: pointer;" onclick="tagEntrance(\'mm\', true)" id="mm" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/tr_m.png" style="cursor: pointer;" onclick="tagEntrance(\'tr_m\', true)" id="tr_m" />'+
'		</td>					'+
'	</tr>'+
'	<tr>'+
'		<td>'+
'			<img src="./images/interface/tr_w.png" style="cursor: pointer;" onclick="tagEntrance(\'tr_w\', true)" id="tr_w" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/tr_e.png" style="cursor: pointer;" onclick="tagEntrance(\'tr_e\', true)" id="tr_e" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/tr_b.png" style="cursor: pointer;" onclick="tagEntrance(\'tr_b\', true)" id="tr_b" />'+
'		</td>							'+
'		<td>'+
'			<img src="./images/interface/gt.png" style="cursor: pointer;" onclick="tagEntrance(\'gt\', true)" id="gt" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/ganon.png" style="cursor: pointer;" onclick="tagEntrance(\'ganon\', true)" id="ganon" />'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td colspan="7">'+
'			Dark World Key Locations'+
'		</td>'+
'	</tr>'+
'	<tr>'+
'		<td>'+
'			<img src="./images/interface/bomb.png" style="cursor: pointer;" onclick="tagEntrance(\'bomb\', false)" id="bomb" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/bumper.png" style="cursor: pointer;" onclick="tagEntrance(\'bumper\', false)" id="bumper" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/spike.png" style="cursor: pointer;" onclick="tagEntrance(\'spike\', false)" id="spike" />'+
'		</td>'+
'		<td>'+
'			<img src="./images/interface/hook.png" style="cursor: pointer;" onclick="tagEntrance(\'hook\', false)" id="hook" />'+
'		</td>'+
'	</tr>'+
'</table>';
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
		document.getElementById('chest0').innerHTML = flags.doorshuffle === 'C' ? (items.chest0-1)+'+' : items.chest0;
		document.getElementById('chest1').innerHTML = flags.doorshuffle === 'C' ? (items.chest1-1)+'+' : items.chest1;
		document.getElementById('chest2').innerHTML = flags.doorshuffle === 'C' ? (items.chest2-1)+'+' : items.chest2;
		document.getElementById('chest3').innerHTML = flags.doorshuffle === 'C' ? (items.chest3-1)+'+' : items.chest3;
		document.getElementById('chest4').innerHTML = flags.doorshuffle === 'C' ? (items.chest4-1)+'+' : items.chest4;
		document.getElementById('chest5').innerHTML = flags.doorshuffle === 'C' ? (items.chest5-1)+'+' : items.chest5;
		document.getElementById('chest6').innerHTML = flags.doorshuffle === 'C' ? (items.chest6-1)+'+' : items.chest6;
		document.getElementById('chest7').innerHTML = flags.doorshuffle === 'C' ? (items.chest7-1)+'+' : items.chest7;
		document.getElementById('chest8').innerHTML = flags.doorshuffle === 'C' ? (items.chest8-1)+'+' : items.chest8;
		document.getElementById('chest9').innerHTML = flags.doorshuffle === 'C' ? (items.chest9-1)+'+' : items.chest9;
		document.getElementById('chest10').innerHTML = flags.doorshuffle === 'C' ? (items.chest10-1)+'+' : items.chest10;

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
			if (flags.entrancemode === 'N') {
				document.getElementById('bossMapAgahnim').className = 'boss';
				document.getElementById('castle').className = 'castle ' + agahnim.is_available();
				for (k = 0; k < dungeons.length; k++) {
					document.getElementById('bossMap'+k).className = 'boss ' + dungeons[k].is_beatable();
					document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
				}
			}
			if (flags.mapmode === 'C') {
				var link = document.createElement("link");
				link.rel = 'stylesheet';
				link.type = 'text/css';
				link.href = flags.entrancemode === 'N' ? 'css/smallmap.css' : 'css/entrancesmallmap.css'; //Not changeable in mystery mode!
				document.head.appendChild(link);
				//document.getElementById('spheres').style.display = 'none';
				
				if (flags.entrancemode != 'N') {
					var modal = document.getElementById("entranceModal"),modalMain = document.getElementById("entranceModalMain");
					modal.style.width = "448px";
					modal.style.left = "0px";
					modalMain.style.width = "408px";
					modalMain.style.height = "600px";
					modalMain.style.left = "20px";
					modalMain.style.top = "36px";
					var modalTags = document.getElementById("modalTags");
					modalTags.innerHTML = compactMapMenu();
				}				
			}
        } else {
            document.getElementById('app').classList.add('mapless');
            document.getElementById('map').style.display = 'none';
        }
		
		if (!flags.wildbigkeys || flags.doorshuffle != 'C') {
			document.getElementById('bigkeyhalf0').style.visibility = 'hidden';
			document.getElementById('bigkeyhalf1').style.visibility = 'hidden';
		}
		
		//Switch overworld locations if inverted
		if (flags.gametype === 'I') {
			if (flags.entrancemode === 'N') {
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
			} else {
				window.document.getElementById('locationMap1').style.visibility = 'hidden';
				window.document.getElementById('entranceMap10').style.top = "40.0%";
				window.document.getElementById('entranceMap93').style.left = "25.7%";
				window.document.getElementById('entranceMap93').style.top = "43.0%";
				window.document.getElementById('entranceMap95').style.left = "23.2%";
				window.document.getElementById('entranceMap95').style.top = "44.0%";
			}
		}

		//If big keys are not shuffled, hide the icons
		if (!flags.wildbigkeys) {
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
		if (!flags.wildkeys && flags.gametype != 'R') {
			if (document.getElementById('locationMap65') != null && flags.doorshuffle != 'C') {
				document.getElementById('locationMap65').style.visibility = 'hidden';
				document.getElementById('locationMap66').style.visibility = 'hidden';
			}
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
		}
		
		//If all keys are not shuffled, change the chest styles
		if (!flags.wildkeys && !flags.wildbigkeys && flags.gametype != 'R') {
			document.getElementById('chest0').classList.add('large');
			document.getElementById("c0bkdiv").classList.add('hidden');
			document.getElementById("c0skdiv").classList.add('hidden');
			document.getElementById('chest1').classList.add('large');
			document.getElementById("c1bkdiv").classList.add('hidden');
			document.getElementById("c1skdiv").classList.add('hidden');
			document.getElementById('chest2').classList.add('large');
			document.getElementById("c2bkdiv").classList.add('hidden');
			document.getElementById("c2skdiv").classList.add('hidden');
			document.getElementById('chest3').classList.add('large');
			document.getElementById("c3bkdiv").classList.add('hidden');
			document.getElementById("c3skdiv").classList.add('hidden');
			document.getElementById('chest4').classList.add('large');
			document.getElementById("c4bkdiv").classList.add('hidden');
			document.getElementById("c4skdiv").classList.add('hidden');
			document.getElementById('chest5').classList.add('large');
			document.getElementById("c5bkdiv").classList.add('hidden');
			document.getElementById("c5skdiv").classList.add('hidden');
			document.getElementById('chest6').classList.add('large');
			document.getElementById("c6bkdiv").classList.add('hidden');
			document.getElementById("c6skdiv").classList.add('hidden');
			document.getElementById('chest7').classList.add('large');
			document.getElementById("c7bkdiv").classList.add('hidden');
			document.getElementById("c7skdiv").classList.add('hidden');
			document.getElementById('chest8').classList.add('large');
			document.getElementById("c8bkdiv").classList.add('hidden');
			document.getElementById("c8skdiv").classList.add('hidden');
			document.getElementById('chest9').classList.add('large');
			document.getElementById("c9bkdiv").classList.add('hidden');
			document.getElementById("c9skdiv").classList.add('hidden');			
		}		
		
		//If game type is Retro, default the keys to max and decrement
		if (flags.gametype === 'R') {
			items.smallkey0 = flags.doorshuffle === 'C' ? 29 : 0;
			items.smallkey1 = flags.doorshuffle === 'C' ? 29 : 1;
			items.smallkey2 = flags.doorshuffle === 'C' ? 29 : 1;
			items.smallkey3 = flags.doorshuffle === 'C' ? 29 : 6;
			items.smallkey4 = flags.doorshuffle === 'C' ? 29 : 1;
			items.smallkey5 = flags.doorshuffle === 'C' ? 29 : 3;
			items.smallkey6 = flags.doorshuffle === 'C' ? 29 : 1;
			items.smallkey7 = flags.doorshuffle === 'C' ? 29 : 2;
			items.smallkey8 = flags.doorshuffle === 'C' ? 29 : 3;
			items.smallkey9 = flags.doorshuffle === 'C' ? 29 : 4;
			items.smallkey10 = flags.doorshuffle === 'C' ? 29 : 4;
			items.smallkeyhalf0 = flags.doorshuffle === 'C' ? 29 : 1;
			items.smallkeyhalf1 = flags.doorshuffle === 'C' ? 29 : 2;
			document.getElementById('smallkey0').innerHTML = items.smallkey0;
			document.getElementById('smallkey1').innerHTML = items.smallkey1;
			document.getElementById('smallkey2').innerHTML = items.smallkey2;
			document.getElementById('smallkey3').innerHTML = items.smallkey3;
			document.getElementById('smallkey4').innerHTML = items.smallkey4;
			document.getElementById('smallkey5').innerHTML = items.smallkey5;
			document.getElementById('smallkey6').innerHTML = items.smallkey6;
			document.getElementById('smallkey7').innerHTML = items.smallkey7;
			document.getElementById('smallkey8').innerHTML = items.smallkey8;
			document.getElementById('smallkey9').innerHTML = items.smallkey9;
			document.getElementById('smallkey10').innerHTML = items.smallkey10;
			document.getElementById('smallkeyhalf0').innerHTML = items.smallkeyhalf0;
			document.getElementById('smallkeyhalf1').innerHTML = items.smallkeyhalf1;
		}
		
		if (flags.doorshuffle != 'C') {
			document.getElementById('bombfloor').style.visibility = 'hidden';
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
		
		document.getElementsByClassName('tunic')[0].classList.add(flags.sprite);
		
		if (flags.mystery === 'N') {
			document.getElementById('changeflagsdiv').style.visibility = 'hidden';
		}
		
		if (flags.doorshuffle === 'N') {
			document.getElementById('showpathsdiv').style.visibility = 'hidden';
			document.getElementById('mirrorscroll').style.visibility = 'hidden';
		}
		else
			window.addEventListener("message", receiveMessage, false);
		
		standardbombs = true;
		if (flags.gametype != 'S') {
			toggle('bomb');
			standardbombs = false;
		}
		
		if (flags.entrancemode === 'N') {			
			for (var i = 0; i < 10; i++) {
				document.getElementById('bossMap' + i).classList.add('bossprize-0');
			}
		}
		
		//If starting boots
		if (window.startingitems.charAt(0) === 'Y') {
			toggle('boots');
		}
		
		if (flags.autotracking === 'Y') {
            autotrackConnect();
		}
	
		updateMapTracker();
		
    };
}(window));