(function(window) {
    'use strict';

	var spoilerLoaded = false;
	var spoiler;
	var overrideEntranceCloseFlag = false;
	var connectStart = false;
	var connectFinish = false;
	var connectorid = 0;
	
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
				if (flags.dungeonitems != 'F' && flags.dungeonitems != 'K' && flags.gametype != 'R' && label != 'chest10') {
					document.getElementById(label).className = 'chest-' + value + ' large';
				} else {
					document.getElementById(label).className = 'chest-' + value;
				}
				
				document.getElementById(label).innerHTML = '';
			} else {
				if (flags.dungeonitems != 'F' && flags.dungeonitems != 'K' && flags.gametype != 'R' && label != 'chest10') {
					document.getElementById(label).className = 'chest large';
				} else {
					document.getElementById(label).className = 'chest';
				}
				
				document.getElementById(label).innerHTML = value;
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
			if (flags.entrancemode != 'N') {					
				for (var k = 0; k < entrances.length; k++) {
					if (!entrances[k].is_opened) {
						var entrancetype = '';
						if (entrances[k].is_available()) {
							if (entrances[k].type === 1) {
							//Connector
								entrancetype = 'connector';
							} else if (entrances[k].type === 2) {
							//Dungeon
								entrancetype = 'dungeon';
							} else if (entrances[k].type === 3) {
							//Location
								entrancetype = 'keylocation';
							}
						}
						document.getElementById('entranceMap'+k).className = 'entrance ' + entrances[k].is_available() + entrancetype;
					}
				}
			} else {
				for (var k = 0; k < dungeons.length; k++) {
					if (!dungeons[k].is_beaten)
						document.getElementById('bossMap'+k).className = 'boss ' + dungeons[k].is_beatable();
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
			document.getElementById('chest'+k).style.backgroundColor = (flags.entrancemode != 'N' ? getDungeonBackground(dungeons[k].can_get_chest()) : 'white');
		}
    };

	window.getDungeonBackground = function(x) {
		switch (x) {
			case 'available':
				return 'lime';
				break;
			case 'unavailable':
				return 'red';
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
        prizes[n] += 1;
        if (prizes[n] === 5) prizes[n] = 0;

        document.getElementById('dungeonPrize'+n).className = 'prize-' + prizes[n];

        if (flags.mapmode != 'N' && flags.entrance === 'N') {
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

        if (flags.mapmode != 'N' && flags.entrance === 'N') {
            // Update Sahasralah, Fat Fairy, and Master Sword Pedestal
            var pendant_chests = [25, 61, 62];
            for (var k = 0; k < pendant_chests.length; k++) {
                if (!chests[pendant_chests[k]].is_opened)
                    document.getElementById('locationMap'+pendant_chests[k]).className = 'location ' + chests[pendant_chests[k]].is_available();
            }
        }
    };	
	
	
    // event of right clicking on a boss's enemizer portrait
    window.rightClickEnemy = function(n) {
        enemizer[n] -= 1;
        if (enemizer[n] === -1) enemizer[n] = 10;
        document.getElementById('dungeonEnemy'+n).className = 'enemizer-' + enemizer[n];
		dungeons[n].is_beatable();
		if (!dungeons[n].is_beaten)
			document.getElementById('bossMap'+n).className = 'boss ' + dungeons[n].is_beatable();
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
	
	window.rightClickChest = function(label) {
		var value = items.inc(label);
		if (value === 0) {
			if (flags.dungeonitems != 'F' && flags.dungeonitems != 'K' && flags.gametype != 'R' && label != 'chest10') {
				document.getElementById(label).className = 'chest-' + value + ' large';
			} else {
				document.getElementById(label).className = 'chest-' + value;
			}
			
			document.getElementById(label).innerHTML = '';
		} else {
			if (flags.dungeonitems != 'F' && flags.dungeonitems != 'K' && flags.gametype != 'R' && label != 'chest10') {
				document.getElementById(label).className = 'chest large';
			} else {
				document.getElementById(label).className = 'chest';
			}
			
			document.getElementById(label).innerHTML = value;
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
                if (!entrances[k].is_opened)
                    document.getElementById('entranceMap'+k).className = 'entrance ' + entrances[k].is_available();
				}
			} else {
	            for (var k = 0; k < dungeons.length; k++) {
	                if (!dungeons[k].is_beaten)
	                    document.getElementById('bossMap'+k).className = 'boss ' + dungeons[k].is_beatable();
						if (items['chest'+k])
							document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
				}
			}

			toggle_agahnim();
        }		
	};
	
	window.rightClickEntrance = function(n) {
		$('#entranceModal').show();
		document.getElementById('entranceID').value = n;
		document.getElementById('entranceModalTitle').innerHTML = entrances[n].caption;
		document.getElementById('entranceModalNote').value = entrances[n].note;
		if (entrances[n].connected_to === -1) {
			document.getElementById('entranceModalDisconnect').style.visibility = 'collapse';
			document.getElementById('entranceModalDisconnect').style.height = '0px';
			document.getElementById('entranceModalConnect').style.visibility = 'visible';
			document.getElementById('entranceModalConnect').style.height = '20px';
			document.getElementById('entranceModalMain').style.height = '300px';
			document.getElementById('entranceModalConnector').innerHTML = '';
		} else {
			document.getElementById('entranceModalConnector').innerHTML = entrances[entrances[n].connected_to].caption;
			document.getElementById('entranceModalDisconnect').style.visibility = 'visible';
			document.getElementById('entranceModalDisconnect').style.height = '60px';
			document.getElementById('entranceModalConnect').style.visibility = 'collapse';
			document.getElementById('entranceModalConnect').style.height = '0px';
			document.getElementById('entranceModalMain').style.height = '150px';
		}
		if (entrances[n].type === 1) {
			document.getElementById('modalTags').style.visibility = 'collapse';
		} else {
			document.getElementById('modalTags').style.visibility = 'visible';
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
		document.getElementById('bomb').style.backgroundColor = '#000';
		document.getElementById('bumper').style.backgroundColor = '#000';
		document.getElementById('spike').style.backgroundColor = '#000';
		document.getElementById('hook').style.backgroundColor = '#000';		
		
		if (entrances[n].known_location != '') {
			document.getElementById(entrances[n].known_location).style.backgroundColor = '#00F';
			document.getElementById('entranceModalConnect').style.visibility = 'collapse';
			document.getElementById('entranceModalConnect').style.height = '0px';
			document.getElementById('entranceModalDisconnect').style.visibility = 'collapse';
			document.getElementById('entranceModalDisconnect').style.height = '0px';		
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
	
	window.entranceDisconnect = function(n) {
		entrances[entrances[document.getElementById('entranceID').value].connected_to].type = 0;
		entrances[document.getElementById('entranceID').value].type = 0;
		entrances[entrances[document.getElementById('entranceID').value].connected_to].connected_to = -1;
		entrances[document.getElementById('entranceID').value].connected_to = -1;
		
		document.getElementById('entranceModalDisconnect').style.visibility = 'collapse';
		//document.getElementById('entranceModalConnect').style.visibility = 'visible';		
		var divtoremove = document.getElementById('connectordiv' + entrances[document.getElementById('entranceID').value].connector_id);
		divtoremove.remove();
		updateMapTracker();
		
		hideEntranceModal();
	}
	
	window.StartAConnector = function(n) {
		if (connectStart === false) {
			document.getElementById('connectorStartImg').src = './images/items/cancel.png';
			connectStart = true;
		} else {
			document.getElementById('connectorStartImg').src = './images/items/connect.png';
			connectStart = false;
			connectFinish = false;
		}
	}

	window.StartAConnectorModal = function(n) {
		document.getElementById('connectorStartImg').src = './images/items/cancel.png';
		connectStart = true;
		connectFinish = true;
		$('#entranceModal').hide();
	}
	
	window.HideConnectors = function(n) {
		if (document.getElementById('connectorLineDiv').style.visibility === 'collapse') {
			document.getElementById('connectorLineDiv').style.visibility = 'visible';
			document.getElementById('hideConnectorLinesImg').src = './images/items/hide.png';
		} else {
			document.getElementById('connectorLineDiv').style.visibility = 'collapse';
			document.getElementById('hideConnectorLinesImg').src = './images/items/show.png';
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
		document.getElementById('bomb').style.backgroundColor = '#000';
		document.getElementById('bumper').style.backgroundColor = '#000';
		document.getElementById('spike').style.backgroundColor = '#000';
		document.getElementById('hook').style.backgroundColor = '#000';
		
		if (entrances[document.getElementById('entranceID').value].known_location === n) {
			entrances[document.getElementById('entranceID').value].known_location = '';
			entrances[document.getElementById('entranceID').value].type = 0;
		} else {
			entrances[document.getElementById('entranceID').value].known_location = n;
			entrances[document.getElementById('entranceID').value].type = (t === true ? 2 : 3);
			document.getElementById(n).style.backgroundColor = '#00F';
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
			} else if (connectFinish === true) {
				if (x != parseInt(document.getElementById('entranceID').value)) {
					entrances[x].connected_to = parseInt(document.getElementById('entranceID').value);
					entrances[x].type = 1;
					entrances[x].known_location = '';
					entrances[x].connector_id = connectorid;
					entrances[parseInt(document.getElementById('entranceID').value)].connected_to = x;
					entrances[parseInt(document.getElementById('entranceID').value)].type = 1;
					entrances[parseInt(document.getElementById('entranceID').value)].connector_id = connectorid;

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
				
				document.getElementById('connectorStartImg').src = './images/items/connect.png';
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
				document.getElementById('bossMap'+x).className = 'boss ' + (dungeons[x].is_beaten ? 'opened' : dungeons[x].is_beatable());
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
			if (entrances[x].type != 0) {
				if (entrances[x].type === 1) {
					displayCaption = displayCaption + ' > Connected To: '+ entrances[entrances[x].connected_to].caption;
				} else {
					displayCaption = displayCaption + ' -- '+ getFriendlyName(entrances[x].known_location);
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
		}
		
		return friendly;
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
				for(var i = 0; i < entrances.length; i++)
					document.getElementById('entranceMap'+i).classList.remove('highlight');
				for(var i = 0; i < dungeonContents.length; i++)
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
		toggle('moonpearl');
		toggle('moonpearl');
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
			if (document.getElementById('locationMap65') != null) {
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
		
		updateMapTracker();
		
    };
}(window));