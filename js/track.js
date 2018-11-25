(function(window) {
    'use strict';

    var query = uri_query();
	var state = query.state;
	var variation = query.variation;
	var swordless = query.swordless;	
	var spheres_enabled = query.sphere;
	var map_enabled = query.map;
	
    window.prizes = [];
    window.medallions = [0, 0];
    //window.map_enabled = query.map === 'true';
	window.lastItem = null;

    // Event of clicking on the item tracker
    window.toggle = function(label) {
        if (label.substring(0,5) === 'chest') {
            var value = items.dec(label);
            document.getElementById(label).className = 'chest-' + value;
            if (map_enabled != 'no') {
                var x = label.substring(5);
                document.getElementById('dungeon'+x).className = 'dungeon ' +
                    (value ? dungeons[x].can_get_chest() : 'opened');
            }
            return;
        }
		if (label.substring(0,8) === 'keychest') {
            var value = items.dec(label);
			if (value === 0) {
				document.getElementById(label).className = 'keychest-' + value;
				document.getElementById(label).innerHTML = '';
			} else {					
				document.getElementById(label).className = 'keychest';
				document.getElementById(label).innerHTML = value;
			}
			
            if (map_enabled != 'no') {
                var x = label.substring(8);
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
			if (variation != 'retro') {
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
			if (variation != 'retro') {
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
			if ((variation === 'keysanity' || variation === 'retro') && (label === 'moonpearl' || label === 'tunic' || label === 'sword' || label === 'shield')) {
				var node = document.getElementsByClassName(label)[1],
					is_boss = node.classList.contains('boss');
			} else {
				var node = document.getElementsByClassName(label)[0],
					is_boss = node.classList.contains('boss');
			}
			if ((typeof items[label]) === 'boolean') {
				items[label] = !items[label];
				
				if (items[label] == true)
					lastItem = label;
				else
					lastItem = null;

				node.classList[items[label] ? 'add' : 'remove'](is_boss ? 'defeated' : 'active');
			} else {
				if (label === 'sword' && swordless === 'yes') {
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
			   document.getElementsByClassName('tunic')[(variation === 'keysanity' || variation === 'retro' ? 1 : 0)].classList[!items.moonpearl ? 'add' : 'remove']('bunny');
				//document.getElementsByClassName('tunic')[0].classList[!items.moonpearl ? 'add' : 'remove']('bunny');
			}
		}
        if (map_enabled != 'no') {
            for (var k = 0; k < chests.length; k++) {
                if (!chests[k].is_opened)
                    document.getElementById('chestMap'+k).className = 'chest ' + chests[k].is_available();
            }
            for (var k = 0; k < dungeons.length; k++) {
                if (!dungeons[k].is_beaten)
                    document.getElementById('bossMap'+k).className = 'boss ' + dungeons[k].is_beatable();
				if (variation === 'keysanity' || variation === 'retro') {
					if (items['keychest'+k])
						document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
				} else {
					if (items['chest'+k])
						document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
				}

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

        if (map_enabled != 'no') {
            // Update Sahasralah, Fat Fairy, and Master Sword Pedestal
            var pendant_chests = [25, 61, 62];
            for (var k = 0; k < pendant_chests.length; k++) {
                if (!chests[pendant_chests[k]].is_opened)
                    document.getElementById('chestMap'+pendant_chests[k]).className = 'chest ' + chests[pendant_chests[k]].is_available();
            }
        }
    };

    // event of clicking on Mire/TRock's medallion subsquare
    window.toggle_medallion = function(n) {
        medallions[n] += 1;
        if (medallions[n] === 4) medallions[n] = 0;

        document.getElementById('medallion'+n).className = 'medallion-' + medallions[n];

        if (map_enabled) {
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
		
        if (map_enabled) {
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

    if (map_enabled != 'no') {
        // Event of clicking a chest on the map
        window.toggle_chest = function(x) {
            chests[x].is_opened = !chests[x].is_opened;
            var highlight = document.getElementById('chestMap'+x).classList.contains('highlight');
            document.getElementById('chestMap'+x).className = 'chest ' +
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
            document.getElementById('chestMap'+x).classList.add('highlight');
            document.getElementById('caption').innerHTML = caption_to_html(chests[x].caption);
        };
        window.unhighlight = function(x) {
            document.getElementById('chestMap'+x).classList.remove('highlight');
            document.getElementById('caption').innerHTML = '&nbsp;';
        };
        // Highlights a chest location and shows the caption (but for dungeons)
        window.highlight_dungeon = function(x) {
            document.getElementById('dungeon'+x).classList.add('highlight');
            document.getElementById('caption').innerHTML = caption_to_html(dungeons[x].caption);
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

	window.setSphereItem = function(label) {
		
		if (lastItem === null) {
			document.getElementById(label).className = "sphere noitem";
		} else {
			if (lastItem.substring(0, 5) === "sword"	|| lastItem.substring(0, 5) === "shiel" || lastItem.substring(0, 5) === "moonp") {
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

    window.start = function() {
        for (var k = 0; k < dungeons.length; k++) {
            prizes[k] = 0;
        }

        //if (mode === 'standard') {
//            document.getElementsByClassName('sword')[0].classList.add('active-1');
  //      }

        if (map_enabled != 'no') {
            for (k = 0; k < chests.length; k++) {
                document.getElementById('chestMap'+k).className = 'chest ' + (chests[k].is_opened ? 'opened' : chests[k].is_available());
            }
            document.getElementById('bossMapAgahnim').className = 'boss';
            document.getElementById('castle').className = 'castle ' + agahnim.is_available();
            for (k = 0; k < dungeons.length; k++) {
                document.getElementById('bossMap'+k).className = 'boss ' + dungeons[k].is_beatable();
                document.getElementById('dungeon'+k).className = 'dungeon ' + dungeons[k].can_get_chest();
            }
			if (map_enabled === 'small') {
				var link = document.createElement("link");
				link.rel = 'stylesheet';
				link.type = 'text/css';
				link.href = 'smallmap.css';
				document.head.appendChild(link);
				//document.getElementById('spheres').style.display = 'none';
			}
        } else {
            document.getElementById('app').classList.add('mapless');
            document.getElementById('map').style.display = 'none';
        }
		
		if (state === 'inverted') {
			document.getElementById('chestMap2').style.left = "77.4%";
			
			document.getElementById('chestMap65').style.left = "74.5%";
			document.getElementById('chestMap65').style.top = "5%";
			
			document.getElementById('chestMap66').style.left = "81.6%";
			document.getElementById('chestMap66').style.top = "5%";
			
			document.getElementById('bossMapAgahnim').style.left = "78%";
			document.getElementById('bossMapAgahnim').style.top = "4.5%";
			document.getElementById('castle').style.left = "78%";
			document.getElementById('castle').style.top = "4.5%";
			
			document.getElementById('bossMap10').style.left = "25%";
			document.getElementById('bossMap10').style.top = "52.5%";
			document.getElementById('dungeon10').style.left = "25%";
			document.getElementById('dungeon10').style.top = "52.5%";
		}
		
		if (variation === 'keysanity' || variation === 'retro') {
			document.getElementById('normalopen0').className = 'keysanityhidden';
			document.getElementById('normalopen1').className = 'keysanityhidden';
			document.getElementById('normalopen2').className = 'keysanityhidden';
			document.getElementById('normalopen3').className = 'keysanityhidden';
			document.getElementById('normalopenitems').className = 'keysanityhidden';
			document.getElementById('keysanity0').className = '';
			document.getElementById('keysanity1').className = '';
			document.getElementById('keysanity2').className = '';
			document.getElementById('keysanity3').className = '';
			document.getElementById('keysanityitems').className = '';
			if (variation === 'retro') {
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
				document.getElementById('keychest0').innerHTML = 3;
				document.getElementById('keychest1').innerHTML = 3;
				document.getElementById('keychest2').innerHTML = 3;
				document.getElementById('keychest3').innerHTML = 11;
				document.getElementById('keychest4').innerHTML = 7;
				document.getElementById('keychest5').innerHTML = 5;
				document.getElementById('keychest6').innerHTML = 5;
				document.getElementById('keychest7').innerHTML = 5;
				document.getElementById('keychest8').innerHTML = 5;
				document.getElementById('keychest9').innerHTML = 9;
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
		} else {
			document.getElementById('chestMap65').style.visibility = 'hidden';
			document.getElementById('chestMap66').style.visibility = 'hidden';
		}
		
		if (spheres_enabled == 'no') {
			document.getElementById('spheres').style.visibility = 'hidden';
			document.getElementById('app').classList.add('sphereless');
		} else {
			document.getElementById('spheres').style.visibility = 'visible';
		}
				
    };
}(window));