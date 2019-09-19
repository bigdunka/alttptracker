(function(window) {
    'use strict';

	var is_swordless = flags.swordmode === 'S';
	var is_standard = flags.gametype === 'S';
	var is_bossshuffle = flags.bossshuffle != 'N';
	var is_enemyshuffle = flags.enemyshuffle != 'N';
	var is_retro = flags.gametype === 'R';
	var is_advanced = flags.itemplacement === 'A';
	
    function medallion_check(i) {
        if ((!items.sword && !is_swordless) || !items.bombos && !items.ether && !items.quake) return 'unavailable';
        if (medallions[i] === 1 && !items.bombos ||
            medallions[i] === 2 && !items.ether ||
            medallions[i] === 3 && !items.quake) return 'unavailable';
        if (medallions[i] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';
    }
	
	function crystal_check() {
		var crystal_count = 0;
		for (var k = 0; k < 10; k++) {
			if ((prizes[k] === 3 || prizes[k] === 4) && items['boss'+k]) {
				crystal_count++;
			}
		}
		return crystal_count;
	}

    function melee() { return items.sword || items.hammer; }
    function melee_bow() { return melee() || items.bow > 0; }
    function cane() { return items.somaria || items.byrna; }
    function rod() { return items.firerod || items.icerod; }
	function agatowerweapon() { return items.sword > 0 || items.somaria || items.bow > 0 || items.hammer || items.firerod; }

    function always() { return 'available'; }

	function enemizer_check(i) {
		switch (enemizer[i]) {
			case 0:
				return 'possible';
				break;
			case 1:
				if (items.sword > 0 || items.hammer || items.bow > 0 || items.boomerang > 0 || items.byrna || items.somaria || items.icerod || items.firerod) return 'available';
				break;
			case 2:
				if (melee_bow() || cane() || rod() || items.hammer) return 'available';
				break;
			case 3:
				if (items.sword > 0 || items.hammer) return 'available';
				break;
			case 4:
				if (items.sword > 0 || items.hammer || items.bow > 0) return 'available';
				break;
			case 5:
				if (items.hookshot && (items.sword > 0 || items.hammer)) return 'available';
				break;
			case 6:
				if (items.sword > 0 || items.hammer || items.firerod || items.byrna || items.somaria) return 'available';
				break;
			case 7:
				if (items.sword > 0 || items.hammer || items.somaria || items.byrna) return 'available';
				break;
			case 8:
				if (items.firerod || (items.bombos && (items.sword > 0 || items.hammer))) return 'available';
				break;
			case 9:
				if (melee_bow() || items.hammer) return 'available';
				break;
			case 10:
				if (items.firerod && items.icerod && (items.hammer || items.sword > 0)) return 'available';
				break;
				
		}
		return 'unavailable';
	}
	
	function available_chests(allchests, keys, maxchest, chestcount) {
		var achests = 0;
		var pchests = 0;
		var dachests = 0;
		var dpchests = 0;
		var uchests = 0;

		for (var i = 0; i < allchests.length; i++) {
			switch (allchests[i]) {
				case 'A':
					achests++;
					break;
				case 'P':
					pchests++;
					break;
				case 'DA':
					dachests++;
					break;
				case 'DP':
					dpchests++;
					break;
				case 'U':
					uchests++;
					break;
			}
		}
		
		//Move dungeon item and key chests from available to possible (Don't count big key, is a 1 for 1)
		switch (flags.dungeonitems) {
			case 'S':
				pchests = pchests + (achests > 1 ? 2 : achests);
				achests = achests - (achests > 1 ? 2 : achests) - keys;
				break;
			case 'M':
				achests = achests - keys;
				pchests = pchests + keys;
				break;
			case 'K':
			case 'F':
				achests = achests - keys;
				pchests = pchests + keys;
				break;
		}		
		
		var itemscollected = (maxchest - chestcount);
		
		for (var i = 0; i < itemscollected; i++) {
			if (achests > 0) {
				achests--;
			} else if (dachests > 0) {
				dachests--;
			} else if (pchests > 0) {
				pchests--;
			} else if (dpchests > 0) {
				dpchests--;
			}
		}
		
		//if (uchests >= chestcount && (achests > 0 || pchests > 0 || dachests > 0 || dpchests > 0)) return 'possible';
//		if (uchests >= chestcount) return 'unavailable';
		if (achests > 0) return 'available';
		if (pchests > 0) return 'possible';
		if (dachests > 0) return 'darkavailable';
		if (dpchests > 0) return 'darkpossible';
		return 'unavailable';
	}
	
	function can_reach_outcast() {
		return items.moonpearl && (items.glove === 2 || items.glove && items.hammer || items.agahnim && items.hookshot && (items.hammer || items.glove || items.flippers));
	}
	
	function canReachDarkWorld()
	{
		return items.moonpearl && (items.glove === 2 || items.glove && items.hammer || items.agahnim);
	}
	
	function canReachLightWorld()//Can walk around in Light World as Link
	{
		return items.moonpearl && (items.glove === 2 || items.glove && items.hammer || items.agahnim);
	}

	function canReachLightWorldBunny()//Can walk around in Light World as bunny or Link
	{
		return items.agahnim || canReachLightWorld() || (items.glove === 2 && activeFlute());
	}

	function canReachPyramid()
	{
		return items.flippers || canReachPyramidWithoutFlippers();
	}

	function canReachPyramidWithoutFlippers()
	{
		return items.hammer || activeFlute() || (items.mirror && canReachLightWorldBunny());
	}

	function activeFlute()
	{
		return items.flute && canReachLightWorld();
	}
	
	//Is Inverted Mode
	if (flags.gametype === "I")
	{
		// define dungeon chests
		window.dungeons = [{ // [0]
			caption: 'Eastern Palace',
			is_beaten: false,
			is_beatable: function() {
				if (!canReachLightWorld()) return 'unavailable';				
				var dungeoncheck = enemizer_check(0);
				//Standard check
				if (!items.bigkey0 || dungeoncheck === 'unavailable' || !(items.bow > 0 && !is_enemyshuffle)) return 'unavailable';
				//Dark Room check
				if (!items.lantern && !(items.firerod && is_advanced)) return dungeoncheck === 'possible' ? 'darkpossible' : 'darkavailable';
				return dungeoncheck;
			},
			can_get_chest: function() {
				if (!canReachLightWorldBunny()) return 'unavailable';
				switch (flags.dungeonitems) {
					case 'S':
						return items.chest0 <= 2 && !items.lantern || items.chest0 === 1 && !(items.bow > 0) ? 'possible' : 'available';
						break;
					case 'M':
						//break;
					case 'K':
						if (items.chest0 >= 3) return 'available';
						if (items.chest0 >= 2) return items.lantern ? 'available' : 'darkavailable';
						if (items.chest0 === 1) {
							if (dungeoncheck === 'unavailable') {
								return dungeoncheck;
							}
							if (items.bow > 0) return items.lantern ? dungeoncheck : 'darkavailable';
						}
						return 'unavailable';
					case 'F':
						if (items.bigkey0 && items.bow > 0 && items.lantern) return 'available';
						if (items.chest0 >= 4) return 'available';
						if (items.chest0 >= 3 && !items.bigkey0 && !items.lantern) return 'darkavailable';
						if (items.chest0 >= 3 && (items.bigkey0 || items.lantern)) return 'possible';
						if (items.chest0 >= 2 && items.bigkey0) return items.lantern ? 'possible' : 'darkavailable';
						if (items.chest0 === 1) {
							if (dungeoncheck === 'unavailable') {
								return dungeoncheck;
							}
							if (items.bigkey0 && items.bow > 0) return items.lantern ? dungeoncheck : 'darkavailable';
						}
						return 'unavailable';
						break;
				}
			}
		}, { // [1]
			caption: 'Desert Palace {book}',
			is_beaten: false,
			is_beatable: function() {
				if (!canReachLightWorldBunny()) return 'unavailable';				
				if (!items.book || !items.glove || (!items.lantern && !items.firerod)) return 'unavailable';
				var dungeoncheck = enemizer_check(1);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (dungeoncheck === 'available') {
							return items.boots ? 'available' : 'possible';
						}
						return dungeoncheck;
						break;
					case 'K':
						if (items.smallkey1 === 1) {
							if (dungeoncheck === 'available') {
								return items.boots ? 'available' : 'possible';
							}
							return dungeoncheck;
						}
						return dungeoncheck === 'unavailable' ? 'unavailable' : 'possible';
						break;
					case 'F':
						if (!items.bigkey1) return 'unavailable';
						return dungeoncheck;
						break;
				}
			},
			can_get_chest: function() {
				if (!items.book || !canReachLightWorldBunny()) return 'unavailable';
				var dungeoncheck = enemizer_check(1);
				switch (flags.dungeonitems) {
					case 'S':
						if (items.chest1 === 2) return items.boots ? 'available' : 'possible';
						if (items.chest1 === 1) {
							if (items.glove && (items.firerod || items.lantern) && items.boots) return dungeoncheck === 'unavailable' ? 'possible' : dungeoncheck;
							return 'possible'
						}
						break;
					case 'M':
						if (items.chest1 === 4) return 'available';
						if (items.chest1 > 1) return items.boots ? 'available' : 'possible';
						if (items.chest1 === 1) {
							if (items.glove && (items.firerod || items.lantern) && items.boots) return dungeoncheck === 'unavailable' ? 'possible' : dungeoncheck;
							return 'possible'
						}
						break;
					case 'K':
						if (items.chest1 === 5) return 'available';
						if (items.smallkey1 === 0) {
							if (items.chest1 === 4) return items.boots ? 'available' : 'possible';
							if (items.chest1 === 3) return items.boots ? (dungeoncheck === 'unavailable' ? 'unavailable' : 'possible') : 'unavailable';
						} else {
							if (items.chest1 > 2) return 'available';
							if (items.chest1 > 1) return items.boots ? 'available' : 'possible';
							if (items.chest1 === 1) return items.boots ? dungeoncheck : 'unavailable';
						}
						break;
					case 'F':
						if (items.chest1 === 6) return 'available';
						if (items.chest1 === 5) {
							if (items.bigkey1 || items.boots || items.smallkey1 === 1) return 'available';
						}
						if (items.chest1 === 4) {
							if (items.bigkey1 && !items.boots && items.smallkey1 === 0 && items.glove && (items.lantern || items.firerod)) return dungeoncheck;
							if ((items.bigkey1 && items.boots) || items.smallkey1 === 1) return 'available';
						}
						if (items.chest1 === 3) {
							if (items.smallkey1 === 1) {
								if (items.bigkey1 || items.boots) return 'available';
							} else {
								if (items.bigkey1 && items.boots && items.glove && (items.lantern || items.firerod)) return dungeoncheck;
							}
						}
						if (items.chest1 === 2) {
							if (items.smallkey1 === 0 || !items.bigkey1) {
								return 'unavailable';
							} else {
								if (items.boots) {
									return 'available';
								} else {
									if (items.glove && (items.lantern || items.firerod)) return dungeoncheck;
								}
							}
						}
						if (items.chest1 === 1) {
							if (!items.boots) return 'unavailable';
							if (items.bigkey1 && items.smallkey1 === 1 && items.glove && (items.lantern || items.firerod)) return dungeoncheck;
						}
						break;
				}
				return 'unavailable';
			}
		}, { // [2]
			caption: 'Tower of Hera {hammer} [{hookshot}/{glove2}]',
			is_beaten: false,
			is_beatable: function() {
				if(!(items.glove || activeFlute()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2)) return 'unavailable';
				var dungeoncheck = enemizer_check(2);
				if (dungeoncheck === 'unavailable') return 'unavailable';
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (!items.lantern && !items.firerod) return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						if (!items.lantern && !items.flute) return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
						return dungeoncheck;
						break;
					case 'K':
						if ((!items.lantern && !items.firerod) || items.smallkey2 === 0) return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						if (!items.lantern && !items.flute) return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
						return dungeoncheck;
						break;
					case 'F':
						if (!items.bigkey2) return 'unavailable';
						if (!items.lantern && !items.flute) return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
						return dungeoncheck;
						break;
				}
			},
			can_get_chest: function() {
				if(!(items.glove || activeFlute()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2)) return 'unavailable';
				var dungeoncheck = enemizer_check(2);				
				switch (flags.dungeonitems) {
					case 'S':
						if (items.lantern || items.firerod) {
							if (!items.lantern && !items.flute) {
								return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
							} else {
								return dungeoncheck === 'available' ? 'available' : 'possible';
							}
						}
						return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						break;
					case 'M':
						if (items.chest2 === 4) {
							return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
						}
						if (items.chest2 === 3) {
							if (items.lantern || items.firerod) return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
							return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						}
						if (items.chest2 === 2) {
							if (items.lantern || items.firerod) {
								if (!items.lantern && !items.flute) {
									return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
								} else {
									return dungeoncheck === 'available' ? 'available' : 'possible';
								}
							}
							return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						}
						if (dungeoncheck === 'unavailable') return 'unavailable';
						if (!items.lantern && !items.firerod) return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						return dungeoncheck === 'available' ? ((!items.lantern && !items.flute) ? 'darkavailable' : 'available') : ((!items.lantern && !items.flute) ? 'darkpossible' : 'possible');
						break;
					case 'K':
						if (items.chest2 > 3) {
							return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
						}
						if (items.chest2 > 1) {
							if (items.smallkey2 === 0 || (!items.lantern && !items.firerod)) {
								return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
							} else {
								return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
							}
						}
						if (items.chest2 === 1) {
							if (items.smallkey2 === 0 || (!items.lantern && !items.firerod) || dungeoncheck === 'unavailable') return 'unavailable';
						}
						return dungeoncheck === 'available' ? ((!items.lantern && !items.flute) ? 'darkavailable' : 'available') : ((!items.lantern && !items.flute) ? 'darkpossible' : 'possible'); 
						break;
					case 'F':
					
						if (items.chest2 > 4) {
							return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
						}
						if (items.chest2 === 4) {
							if (items.smallkey2 === 0 && !items.bigkey2) return 'unavailable';
							if (!items.bigkey2 && (items.smallkey2 === 1 || (!items.lantern && !items.firerod))) return 'unavailable';
							return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
						}
						if (items.chest2 === 3) {
							if (items.bigkey2) return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
							return 'unavailable';
						}
						if (items.chest2 === 2 && items.bigkey2) {
							if (dungeoncheck != 'unavailable') {
								return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
							} else {
								if (items.smallkey2 === 0 || (!items.lantern && !items.firerod)) return 'unavailable';
								return dungeoncheck === 'available' ? ((!items.lantern && !items.flute) ? 'darkavailable' : 'available') : ((!items.lantern && !items.flute) ? 'darkpossible' : 'possible');
							}
						}
						if (items.chest2 === 1 && items.bigkey2 && items.smallkey2 == 1 && (items.lantern || items.firerod) && dungeoncheck != 'unavailable') return dungeoncheck === 'available' ? ((!items.lantern && !items.flute) ? 'darkavailable' : 'available') : ((!items.lantern && !items.flute) ? 'darkpossible' : 'possible');
						break;
				}				
				return 'unavailable';
			}
		}, { // [3]
			caption: 'Palace of Darkness',
			is_beaten: false,
			is_beatable: function() {
				if(!canReachPyramid() || !(items.bow > 0) || !items.hammer) return 'unavailable';
				var dungeoncheck = enemizer_check(3);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (dungeoncheck === 'unavailable') return 'unavailable';
						return dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'darkpossible' : 'darkpossible') ;
						break;
					case 'K':
						if (items.smallkey3 < 6) return 'unavailable'
						if (dungeoncheck === 'unavailable') return 'unavailable';
						return dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'darkpossible' : 'darkpossible') ;
						break;
					case 'F':
						if (items.smallkey3 < 6 || !items.bigkey3) return 'unavailable'
						if (dungeoncheck === 'unavailable') return 'unavailable';
						return dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'darkpossible' : 'darkpossible') ;
						break;
				}
			},
			can_get_chest: function() {
				if (!canReachPyramidWithoutFlippers() && !canReachPyramid()) return 'unavailable';
				var dungeoncheck = enemizer_check(2);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (items.hammer && items.bow > 0 && items.lantern) return 'available';
						if (items.chest3 > 3) {
							if (!items.hammer && !items.bow) return items.lantern ? 'available' : 'possible';
						}
						if (items.chest3 > 1) {
							return (items.bow) ? 'available' : 'possible';
						}
						return 'possible'
						break;
					case 'K':
						//Prioritize Helma last
						if (items.smallkey3 === 6 && items.hammer && items.bow > 0 && items.lantern && dungeoncheck === 'available') return 'available';
						
						// item count approach
						var reachable = 0;
						var curr_keys = 0;
						var dark_chests = 0;
						curr_keys += items.smallkey3;
						reachable += 1; // free first chest
						// 0 key chests
						if (items.bow > 0) reachable += 2; // bow locked right side
						// conditioned key usage
						if (items.bow > 0 && items.hammer) {
							reachable += 2; // bridge and dropdown
						} else {
							if (curr_keys > 0) {
								reachable += 2; // bridge and dropdown
								curr_keys -= 1; // front door used
							}
						}
						// 1 key chests
						if (curr_keys > 0) {
							reachable += 3; // Back side of POD, since it yields most chests for the key
							curr_keys -= 1;
							dark_chests += 2;
						}
						if (curr_keys > 0) {
							reachable += 3; // Dark area with big chest, always assume big key is possible
							curr_keys -= 1;
							dark_chests += 3;
						}
						if (items.bow > 0 && items.hammer && curr_keys > 0) {
							reachable += 1; // King Helmasaur. We do not prioritize him when he is beatable. This way we show the max amount of items.
							curr_keys -= 1;
							dark_chests += 1;
						}
						if (curr_keys > 0) {
							reachable += 1; // Spike Room
							curr_keys -= 1;
						}
						if (curr_keys > 0) {
							reachable += 1; // Vanilla big key chest
							curr_keys -= 1;
						}

						if (items.chest3 > 13 - reachable) {
							if (items.chest3 > 13 - (reachable - dark_chests)) {
								return 'possible';
							} else {
								return items.lantern ? 'possible' : 'darkavailable';
							}
						}
						return 'unavailable'; // We got all reachable chests or even more if helmasaur was not prioritized
						break;
					case 'F':
						if (items.smallkey3 === 6 && items.bigkey3 && items.hammer && items.bow > 0 && items.lantern && dungeoncheck === 'available') return 'available';
						// item count approach
						var reachable = 0;
						var curr_keys = 0;
						var dark_chests = 0;
						curr_keys += items.smallkey3;
						reachable += 1; // free first chest
						// 0 key chests
						if (items.bow > 0) reachable += 2; // bow locked right side
						// conditioned key usage
						if (items.bow > 0 && items.hammer) {
							reachable += 2; // bridge and dropdown
						} else {
							if (curr_keys > 0) {
								reachable += 2; // bridge and dropdown
								curr_keys -= 1; // front door used
							}
						}
						// 1 key chests
						if (curr_keys > 0) {
							reachable += 3; // Back side of POD, since it yields most chests for the key
							curr_keys -= 1;
							dark_chests += 2;
						}
						if (curr_keys > 0) {
							reachable += items.bigkey3 ? 3 : 2; // Dark area with big chest
							curr_keys -= 1;
							dark_chests += items.bigkey3 ? 3 : 2;
						}
						if (items.bow > 0 && items.hammer && items.bigkey3 && curr_keys > 0) {
							reachable += 1; // King Helmasaur. We do not prioritize him when he is beatable. This way we show the max amount of items.
							curr_keys -= 1;
							dark_chests += 1;
						}
						if (curr_keys > 0) {
							reachable += 1; // Spike Room
							curr_keys -= 1;
						}
						if (curr_keys > 0) {
							reachable += 1; // Vanilla big key chest
							curr_keys -= 1;
						}

						if (items.chest3 > 14 - reachable) {
							if (items.chest3 > 14 - (reachable - dark_chests)) {
								return 'possible';
							} else {
								return items.lantern ? 'possible' : 'darkavailable';
							}
						}
						
						return 'unavailable'; // We got all reachable chests or even more if helmasaur was not prioritized
						break;
				}
			}
		}, { // [4]
			caption: 'Swamp Palace {mirror} {flippers}',
			is_beaten: false,
			is_beatable: function() {
				if (!items.moonpearl || !canReachLightWorldBunny() || !items.mirror || !items.flippers || !items.hammer || !items.hookshot) return 'unavailable';
				var dungeoncheck = enemizer_check(4);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						return dungeoncheck;
						break;
					case 'K':
					case 'F':
						if (items.smallkey4 === 0) return 'unavailable';
						return dungeoncheck;
						break;
				}
			},
			can_get_chest: function() {
				if (!items.moonpearl || !canReachLightWorldBunny() || !items.mirror || !items.flippers) return 'unavailable';
				var dungeoncheck = enemizer_check(4);
				switch (flags.dungeonitems) {
					case 'S':
						if (items.chest4 === 6) return 'available';
						if (!items.hammer) return 'unavailable';
						if (items.chest4 === 5) return 'available';
						if (items.chest4 > 2) return !items.hookshot ? 'possible' : 'available';
						return !items.hookshot ? 'unavailable' : 'available';
						break;
					case 'M':
						if (items.chest4 === 8) return 'available';
						if (!items.hammer) return 'unavailable';
						if (items.chest4 > 4) return 'available';
						return !items.hookshot ? 'unavailable' : 'available';
						break;
					case 'K':
						if (items.chest4 === 9) return 'available';
						if (items.smallkey4 === 0) return 'unavailable';
						if (items.chest4 === 8) return 'available';
						if (!items.hammer) return 'unavailable';
						if (items.chest4 > 4) return 'available';
						return !items.hookshot ? 'unavailable' : 'available';
						break;
					case 'F':
						if (items.chest4 === 10) return 'available';
						if (items.smallkey4 === 0) return 'unavailable';
						if (items.chest4 === 9) return 'available';
						if (!items.hammer) return 'unavailable';
						if (items.chest4 > 5) return 'available';
						if (items.chest4 === 5 && (items.bigkey4 || items.hookshot)) return 'available';
						if (items.chest4 > 1) return !items.hookshot ? 'unavailable' : 'available';
						if (items.chest4 === 1) return items.bigkey4 ? 'available' : 'unavailable';
						break;
				}
				return 'unavailable';
			}
		}, { // [5]
			caption: 'Skull Woods',
			is_beaten: false,
			is_beatable: function() {
				if (!items.firerod || (items.sword == 0 && !is_swordless)) return 'unavailable';
				var dungeoncheck = enemizer_check(5);
				return dungeoncheck;
			},
			can_get_chest: function() {
				var dungeoncheck = enemizer_check(5);
				switch (flags.dungeonitems) {
					case 'S':
						if (items.chest5 === 2) return !items.firerod ? 'possible' : 'available';
						return dungeoncheck === 'unavailable' || !items.firerod || (items.sword == 0 && !is_swordless) ? 'possible' : 'available';
						break;
					case 'M':
						if (items.chest5 > 2) return 'available';
						if (items.chest5 === 2) !items.firerod ? 'possible' : 'available';
						return dungeoncheck === 'unavailable' || !items.firerod || (items.sword == 0 && !is_swordless) ? 'possible' : 'available';
						break;
					case 'K':
						if (items.chest5 > 2) return 'available';
						if (items.chest5 === 2) return !items.firerod ? 'unavailable' : 'available';
						return dungeoncheck === 'unavailable' || (items.sword == 0 && !is_swordless) ? 'unavailable' : dungeoncheck;
						break;
					case 'F':
						if (items.chest5 > 3) return 'available';
						if (items.chest5 < 4 && !items.firerod && !items.bigkey5) return 'unavailable';
						if (items.chest5 === 3 && (items.firerod || items.bigkey5)) return 'available';
						if (items.chest5 === 2 && !items.firerod) return 'unavailable';
						if (items.chest5 === 2) {
							if (items.bigkey5) return 'available';
							if (items.sword > 0 || is_swordless) return dungeoncheck;
						}
						return (!items.firerod || (items.sword == 0 && !is_swordless) || !items.bigkey5) ? 'unavailable' : 'available';
						if (!items.bigkey5 || dungeoncheck === 'unavailable' || (!is_swordless && items.sword === 0)) return 'unavailable';
						return dungeoncheck;
						break;
				}
				return 'unavailable';
			}
		}, { // [6]
			caption: 'Thieves\' Town',
			is_beaten: false,
			is_beatable: function() {
				var dungeoncheck = enemizer_check(6);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
					case 'K':
						return dungeoncheck;
						break;
					case 'F':
						return (!items.bigkey6) ? 'unavailable' : dungeoncheck;
						break;
				}
			},
			can_get_chest: function() {
				var dungeoncheck = enemizer_check(6);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (items.chest6 > 2) return 'available';
						if (items.chest6 === 2) {
							if ((!items.hammer) && dungeoncheck === 'unavailable') return 'possible';
							if (items.hammer) return 'available';
							return dungeoncheck;
						}							
						return (items.chest6 === 1 && (!items.hammer)) ? 'possible' : dungeoncheck;
						break;
					case 'K':
						if (items.chest6 > 2) return 'available';
						if (items.chest6 === 2) {
							if ((!items.hammer || items.smallkey6 === 0) && dungeoncheck === 'unavailable') return 'unavailable';
							if (items.hammer && items.smallkey6 === 1) return 'available';
							return dungeoncheck;
						}							
						return (items.chest6 === 1 && (!items.hammer || items.smallkey6 === 0)) ? 'unavailable' : dungeoncheck;
						break;
					case 'F':
						if (items.chest6 > 4) return 'available';
						if (items.chest6 < 5 && !items.bigkey6) return 'unavailable';
						if (items.chest6 > 2) return 'available';
						if (items.chest6 > 1) {
							if (items.smallkey6 === 1 && items.hammer) return 'available';
							return dungeoncheck;
						}
						if ((items.smallkey6 === 0 || !items.hammer || dungeoncheck === 'unavailable')) return 'unavailable'; 
						return dungeoncheck;
						break;
				}
			}
		}, { // [7]
			caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
			is_beaten: false,
			is_beatable: function() {
				if (!items.flippers || !items.hammer) return 'unavailable';
				if (!items.firerod && !items.bombos) return 'unavailable';
				if (!items.firerod && items.bombos && (items.sword == 0 && !is_swordless)) return 'unavailable';
				var dungeoncheck = enemizer_check(7);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
					case 'K':
					case 'F':
						return dungeoncheck;
						break;
				}
			},
			can_get_chest: function() {
				if (!items.flippers) return 'unavailable';
				if (!items.firerod && !items.bombos) return 'unavailable';
				if (!items.firerod && items.bombos && (items.sword == 0 && !is_swordless)) return 'unavailable';				
				var dungeoncheck = enemizer_check(7);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (items.chest7 > 1 && items.hammer && (items.hookshot || items.somaria)) return 'available';
						if (items.chest7 === 1 && items.hammer && (items.hookshot || items.somaria) && dungeoncheck === 'available') return 'available';
						return 'possible';
						break;
					case 'K':
						//if (items.hammer) return ((items.smallkey7 === 1 && items.somaria) || items.smallkey7 === 2) ? 'available' : 'possible';
						//if (items.hammer) return 'possible';
						if (items.chest7 >= 4) return 'possible';
						if (items.chest7 >= 2 && items.hammer) return 'possible';
						break;
					case 'F':
						if (items.bigkey7 && items.hammer) return ((items.smallkey7 === 1 && items.somaria) || items.smallkey7 === 2) ? 'available' : 'possible';
						if (items.bigkey7 && items.hammer) return 'possible';
						if (items.chest7 >= 5) return 'possible';
						if (items.chest7 >= 4 && items.bigkey7) return 'possible';
						if (items.chest7 >= 2 && items.hammer) return 'possible';
						break;
				}
				return 'unavailable';	
			}
		}, { // [8]
			caption: 'Misery Mire {medallion0}',
			is_beaten: false,
			is_beatable: function() {
				if (!melee_bow()) return 'unavailable';
				if (!(activeFlute() || (items.mirror && canReachLightWorldBunny())) || !items.somaria) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';
				var state = medallion_check(0);
				if (state) return state;
				var dungeoncheck = enemizer_check(8);
				if (dungeoncheck === 'unavailable') return 'unavailable';
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
					case 'K':
						if (!items.lantern && !items.firerod) return 'darkpossible';
						return dungeoncheck === 'available' ? (!items.lantern ? 'darkavailable' : 'available') : (!items.lantern ? 'darkpossible' : 'possible');
						break;
					case 'F':
						if (!items.bigkey8) return 'unavailable';
						return dungeoncheck === 'available' ? (!items.lantern ? 'darkavailable' : 'available') : (!items.lantern ? 'darkpossible' : 'possible');
						break;
				}
			},
			can_get_chest: function() {
				if (!(activeFlute() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';
				var state = medallion_check(0);
				if (state) return state;
				var dungeoncheck = enemizer_check(8);
				switch (flags.dungeonitems) {
					case 'S':
						if ((items.lantern || items.firerod) && items.somaria) return (!items.lantern ? 'darkavailable' : 'available');
						return 'possible';
						break;
					case 'M':
						if ((items.lantern || items.firerod) && items.somaria) return (!items.lantern ? 'darkavailable' : 'available');
						if (items.chest8 === 4) return 'available';
						if (!items.lantern && !items.firerod) return 'possible';
						if (dungeoncheck === 'unavailable' || !items.somaria) return 'possible';
						return dungeoncheck === 'available' ? (!items.lantern ? 'darkavailable' : 'available') : (!items.lantern ? 'darkpossible' : 'possible');
						break;
					case 'K':
						if ((items.lantern || items.firerod) && items.somaria) return (!items.lantern ? 'darkavailable' : 'available');
						if (items.chest8 > 3) return 'available';
						if (!items.lantern && !items.firerod && !items.somaria) return 'unavailable';
						if (items.chest8 === 3) {
							if (!items.lantern && !items.firerod && items.somaria && dungeoncheck != 'unavailable') return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
							if (items.lantern || items.firerod) return 'available';
						}
						if (items.chest8 === 2 && (items.lantern || items.firerod)) return 'available';
						return 'unavailable';
						break;
					case 'F':
						if (items.lantern && items.bigkey8 && items.somaria) return 'available';
						if (items.chest8 >= 5) return 'available';
						if (items.chest8 >= 4 && items.bigkey8) return 'available';
						if (items.chest8 >= 3 && items.bigkey8 && items.somaria && !items.lantern && !items.firerod) return 'darkavailable';
						if (items.chest8 >= 3 && (items.lantern || items.firerod)) return 'available';
						if (items.chest8 >= 2 && (items.firerod || items.lantern) && items.bigkey8) return 'available';
						if (items.chest8 >= 1 && !items.lantern && items.firerod && items.bigkey8 && items.somaria) return 'darkavailable';
						return 'unavailable';					
						break;
				}
			}
		}, { // [9]
			caption: 'Turtle Rock {medallion0}/{mirror}',
			is_beaten: false,
			is_beatable: function() {
				//All win conditions require Somaria and a way to DM,
				if (!(items.glove || activeFlute()) || !items.somaria) return 'unavailable';
				var dungeoncheck = enemizer_check(9);
				if (dungeoncheck === 'unavailable') return 'unavailable';
				
				//First, check for back door access through mirror, it has logic priority
				if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2)))
				{
					switch (flags.dungeonitems) {
						case 'S':
						case 'M':
							//Can go in through big key/laser eye room, get up to 2 items without any required items, which could be small/big key, no other items needed (Although unlikely)
							return 'possible';
							break;
						case 'K':
							/* if (items.smallkey9 === 0 || !items.bigkey9) return 'unavailable';
							return dungeoncheck;
							break; */
						case 'F':
							if (items.smallkey9 === 0 || !items.bigkey9) return 'unavailable';
							return 'possible';
							break;
					}
				}
				else  //Back door not available, go through the front
				{
					var state = medallion_check(1);
					if (state) return state;

					switch (flags.dungeonitems) {
						case 'S':
						case 'M':
							//Need a safety or advanced on to get all items, but not fire rod (map/compass may be on right)
							if ((items.byrna || items.cape || items.shield === 3) || is_advanced) {
								if (items.firerod) return dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible');
							}
							return (items.lantern ? 'possible' : 'darkpossible');
							break;
						case 'K':
						case 'F':
								if (items.smallkey9 < 4 || !items.bigkey9) return 'unavailable';
								if ((items.byrna || items.cape || items.shield === 3) || is_advanced) {
									if (items.firerod) return dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible');
								}
								return (items.lantern ? 'possible' : 'darkpossible');
							break;
					}
				}
			},
			can_get_chest: function() {
				switch (flags.dungeonitems) {
					case 'S':
						if(!(items.glove || activeFlute())) return 'unavailable';
						var laser_safety = items.byrna || items.cape || items.shield === 3, dark_room = items.lantern ? 'available' : 'darkavailable';
						if(items.mirror && ((items.hookshot && items.moonpearl) || items.glove === 2))
						{
							if(!items.somaria)
								return 'possible';
							if(medallion_check(1))
							{
								if(items.chest9 <= 3)
									return 'possible';
								if(items.chest9 <= 4)
									return laser_safety && items.lantern ? 'available' : 'possible';
								return laser_safety && items.lantern ? 'available' : 'possible';
							}
							//Disabled sequence break logic until that revision
							if(items.chest9 <= 1)
								return !laser_safety ? (items.firerod && items.icerod ? 'possible' : 'possible') : items.firerod && items.icerod && items.lantern ? 'available' : 'possible';
							if(items.chest9 <= 2)
								return !laser_safety ? (items.firerod ? 'possible' : 'possible') : items.firerod && items.lantern ? 'available' : 'possible';
							if(items.chest9 <= 3)
								return !laser_safety ? (items.firerod ? 'possible' : 'possible') : items.firerod ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'possible';
							return !laser_safety ? (items.firerod ? 'possible' : 'possible') : items.firerod ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : (items.lantern ? 'available' : 'possible');
						}
						if(!items.somaria)
							return 'unavailable';
						var state = medallion_check(1);
						if(state)
							return state;
						return 'possible';
						break;
					case 'M':
						if(!(items.glove || activeFlute())) return 'unavailable';
						var laser_safety = items.byrna || items.cape || items.shield === 3, dark_room = items.lantern ? 'available' : 'darkavailable';
						if(items.mirror && ((items.hookshot && items.moonpearl) || items.glove === 2))
						{
							if(!items.somaria)
								return 'possible';
							if(medallion_check(1))
							{
								if(items.chest9 <= 3)
									return 'possible';
								if(items.chest9 <= 4)
									return laser_safety && items.lantern ? 'available' : 'possible';
								return laser_safety && items.lantern ? 'available' : 'possible';
							}
							//Disabled sequence break logic until that revision
							if(items.chest9 <= 1)
								return !laser_safety ? (items.firerod && items.icerod ? 'possible' : 'possible') : items.firerod && items.icerod && items.lantern ? 'available' : 'possible';
							if(items.chest9 <= 2)
								return !laser_safety ? (items.firerod ? 'possible' : 'possible') : items.firerod && items.lantern ? 'available' : 'possible';
							if(items.chest9 <= 3)
								return !laser_safety ? (items.firerod ? 'possible' : 'possible') : items.firerod ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'possible';
							return !laser_safety ? (items.firerod ? 'possible' : 'possible') : items.firerod ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : (items.lantern ? 'available' : 'possible');
						}
						if(!items.somaria) return 'unavailable';
						var state = medallion_check(1);
						if(state) return state;
						return 'possible';
						break;
					case 'K':
						if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2)))
						{
							if (items.somaria) {
								if (items.bigkey9 && items.firerod && items.icerod)
								{
									if (items.chest9 >= 5) return (items.lantern || items.flute) ? 'available' : 'darkavailable';
									return (items.byrna || items.cape || items.shield === 3) ? (items.lantern || items.flute) ? 'available' : 'darkavailable' : (items.lantern || items.flute) ? 'available' : 'darkavailable';									
								}
								
								var totalchests = 0;
								var darkchests = 0;
								var sequencechests = 0;
								
								totalchests = 3;
								
								if (items.bigkey9) totalchests = totalchests + 1;
								if (items.firerod) totalchests = totalchests + 2;

								if (items.byrna || items.cape || items.shield === 3)
								{
									totalchests = totalchests + 4;
								}
								else
								{
									sequencechests = sequencechests + 4;
									totalchests = totalchests + 4;
								}

								if (!items.lantern && !items.bigkey9 && items.smallkey9 == 0)
								{
									darkchests = darkchests + 1;
									totalchests = totalchests + 1;
								}
								else
								{
									totalchests = totalchests + 1;
								}
								
								sequencechests = 0;
								
								if (items.chest9 > 12 - totalchests) {
									if (items.chest9 > 12 - (totalchests - darkchests - sequencechests)) {
										return items.lantern ? 'possible' : 'darkavailable';
									} else {
										return items.lantern ? 'possible' : 'darkavailable';
									}
								}
								
								return 'unavailable';
							} else {
								if (items.chest9 >= 9) {
									return (items.byrna || items.cape || items.shield === 3) ? 'available' : 'sequencebreak';
								} else {
									return 'unavailable';
								}
							}
						}
						else
						{
							//Back door is not available, use normal logic
							if (!items.somaria) return 'unavailable';						
							
							var state = medallion_check(1);
							if (state) return state;

							if (items.bigkey9 && items.smallkey9 === 4 && items.firerod && items.icerod && items.lantern && (items.byrna || items.cape || items.shield === 3)) return 'available';
							
							// item count approach
							var reachable = 0;
							var curr_keys = 0;
							var dark_chests = 0;
							curr_keys += items.smallkey9;
							reachable += 1; // free first chest
							// 0 key chests
							if (items.firerod) {
								reachable += 2; // fire rod locked right side				
							}
							// 1 key chests
							if (curr_keys > 0) {
								reachable += 1; // Chain Chomp room
								curr_keys -= 1;
							}
							// 2 key chests
							if (curr_keys > 0) { 
								curr_keys -= 1;
								if (!items.bigkey9) {
									// Unable to proceed beyond big key room, but can get vanilla big key chest
									reachable += 1;
								} else {
									reachable += 2; // Big chest and roller room
									if (items.byrna || items.cape || items.shield === 3) {
										// Logic for laser bridge, needs safety item to be in logic
										reachable += 4;
										if (!items.lantern) {
											dark_chests += 4;
										}
									}
								}
							}
							// 3 key chests
							if (curr_keys > 0) { 
								curr_keys -= 1;
								reachable += 1; // Either Trinexx or vanilla big key chest will be obtainable with 3 keys
							}				
							
							// 4 key chests
							if (curr_keys > 0) { 
								if (!items.lantern && items.icerod && items.firerod) {
									dark_chests += 1; // All of TR is clearable in the dark
									reachable += 1;
								}
							}
							
							if (items.chest9 > 1 - reachable) {
								if (items.chest9 > 1 - (reachable - dark_chests)) {
									return 'possible';
								} else {
									return items.lantern ? 'possible' : 'darkavailable';
								}
							}
							
							return 'unavailable';
						}					
						
						return 'unavailable';
						break;
					case 'F':
						if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2)))
						{
							//Back door is available, override normal logic
							//First 4 chests are available from the laser bridge based off safety
							//if (items.smallkey9 === 0) {
							if (items.somaria) {
								//With cane, no small keys, can get all 12 chests based off items as long as no doors are opened from behind
								//4 chests with safety, sequencebreak without safety
								//Lantern is only required for one chest if you don't have a small key or the big key
								//Fire rod adds 2 chests
								//Fire rod, ice rod, and big key adds 1 chest (Trinexx)
								//Big Key adds 1 chest
								
								if (items.bigkey9 && items.firerod && items.icerod)
								{
									if (items.chest9 >= 5) return (items.lantern || items.flute) ? 'available' : 'darkavailable';
									return (items.byrna || items.cape || items.shield === 3) ? (items.lantern || items.flute) ? 'available' : 'darkavailable' : (items.lantern || items.flute) ? 'available' : 'darkavailable';
									//TEMPORARLY DISABLING THE SEQUENCE BREAK CHECK, WILL ADD INTO TOGGLE SWITCH
									//return (items.byrna || items.cape || items.shield === 3) ? (items.lantern || items.flute) ? 'available' : 'darkavailable' : (items.lantern || items.flute) ? 'sequencebreak' : 'darkavailable';									
								}
								
								var totalchests = 0;
								var darkchests = 0;
								var sequencechests = 0;
								
								totalchests = 3;
								
								if (items.bigkey9) totalchests = totalchests + 1;
								if (items.firerod) totalchests = totalchests + 2;

								if (items.byrna || items.cape || items.shield === 3)
								{
									totalchests = totalchests + 4;
								}
								else
								{
									sequencechests = sequencechests + 4;
									totalchests = totalchests + 4;
								}

								if (!items.lantern && !items.bigkey9 && items.smallkey9 == 0)
								{
									darkchests = darkchests + 1;
									totalchests = totalchests + 1;
								}
								else
								{
									totalchests = totalchests + 1;
								}
								
								sequencechests = 0;
								
								if (items.chest9 > 12 - totalchests) {
									if (items.chest9 > 12 - (totalchests - darkchests - sequencechests)) {
										return items.lantern ? 'possible' : 'darkavailable';
									} else {
										return items.lantern ? 'possible' : 'darkavailable';
									}
								}
								
								return 'unavailable';
							} else {
								//No cane, no small keys
								if (items.chest9 >= 9) {
									return (items.byrna || items.cape || items.shield === 3) ? 'available' : 'sequencebreak';
								} else {
									return 'unavailable';
								}
							}
						}
						else
						{
							//Back door is not available, use normal logic
							if (!items.somaria) return 'unavailable';						
							
							var state = medallion_check(1);
							if (state) return state;

							if (items.bigkey9 && items.smallkey9 === 4 && items.firerod && items.icerod && items.lantern && (items.byrna || items.cape || items.shield === 3)) return 'available';
							
							// item count approach
							var reachable = 0;
							var curr_keys = 0;
							var dark_chests = 0;
							curr_keys += items.smallkey9;
							reachable += 1; // free first chest
							// 0 key chests
							if (items.firerod) {
								reachable += 2; // fire rod locked right side				
							}
							// 1 key chests
							if (curr_keys > 0) {
								reachable += 1; // Chain Chomp room
								curr_keys -= 1;
							}
							// 2 key chests
							if (curr_keys > 0) { 
								curr_keys -= 1;
								if (!items.bigkey9) {
									// Unable to proceed beyond big key room, but can get vanilla big key chest
									reachable += 1;
								} else {
									reachable += 2; // Big chest and roller room
									if (items.byrna || items.cape || items.shield === 3) {
										// Logic for laser bridge, needs safety item to be in logic
										reachable += 4;
										if (!items.lantern) {
											dark_chests += 4;
										}
									}
								}
							}
							// 3 key chests
							if (curr_keys > 0) { 
								curr_keys -= 1;
								reachable += 1; // Either Trinexx or vanilla big key chest will be obtainable with 3 keys
							}				
							
							// 4 key chests
							if (curr_keys > 0) { 
								if (!items.lantern && items.icerod && items.firerod) {
									dark_chests += 1; // All of TR is clearable in the dark
									reachable += 1;
								}
							}
							
							if (items.chest9 > 12 - reachable) {
								if (items.chest9 > 12 - (reachable - dark_chests)) {
									return 'possible';
								} else {
									return items.lantern ? 'possible' : 'darkavailable';
								}
							}
							
							return 'unavailable';
						}					
						
						return 'unavailable';
						break;
				}
			}
		}, { // [10]
			caption: 'Ganon\'s Castle (Crystals)',
			is_beaten: false,
			is_beatable: function() {
				if (crystal_check() < flags.ganonvulncount || !canReachLightWorld()) return 'unavailable';
				if (flags.goals === 'F' && (items.sword > 1 || is_swordless && items.hammer) && (items.lantern || items.firerod)) return 'available';
				
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (items.bow > 0 && items.hookshot && (items.firerod || items.lantern)) {
							if (!items.somaria || !items.boots || !items.firerod) return 'possible';
							return (is_bossshuffle && !items.icerod) ? 'possible' : 'available';
						}
						break;
					case 'K':
					case 'F':		
						if (items.bigkey10 &&  items.bow > 0 && items.hookshot && (items.firerod || items.lantern)) {
							if (items.smallkey10 < 3) return 'possible';
							if (items.smallkey10 >= 3) return (is_bossshuffle && !items.icerod) ? 'possible' : 'available';
						}
						break;
				}				
				return 'unavailable';				
			},
			can_get_chest: function() {
				if (crystal_check() < flags.opentowercount) return 'unavailable';
				
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (items.bow > 0 && items.hookshot && (items.firerod || items.lantern)) {
							if (!items.somaria || !items.boots || !items.firerod) return 'possible';
							return (is_bossshuffle && !items.icerod) ? 'possible' : 'available';
						}
						break;
					case 'K':
					case 'F':		
						if (items.bigkey10 && items.smallkey10 > 2 && items.bow > 0 && items.hookshot && items.firerod && items.somaria) return 'available';
						// Counting reachable items and keys
						var reachable = 0;
						var curr_keys = 0;
						curr_keys += items.smallkey10;
						curr_keys += 1; // free key on left side
						// 0 key chests
						reachable += 2; // first two right side chests
						if (items.boots) reachable += 1; // torch
						if (items.somaria) reachable += 1; // tile room
						if (items.hookshot && items.hammer) reachable += 4; // stalfos room
						if (items.bigkey10 && items.bow > 0 && (items.lantern || items.firerod)){ 
							reachable += 2; // mini helmasaur room
							curr_keys += 1; // mini helmasaur room
						}
						// 0 key chests with common sense
						if (items.somaria && items.firerod && curr_keys > 0) reachable += 4; // rest of the right side chests. The key is gained back after those.
						if (items.hookshot && items.hammer) reachable += 1; // chest before randomizer room. We assume the key in the switch room is used for this one
						if (items.bigkey10 && items.bow > 0 && (items.lantern || items.firerod) && curr_keys > 0) {
							reachable += 1; // room after mini helmasaurs. We assume players keep enough keys to reach top. If they didnt, then they got other chests for that key.
							curr_keys -= 1;
						}
						if (items.bigkey10 && items.bow > 0 && (items.lantern || items.firerod) && items.hookshot && ((items.sword > 0 || is_swordless) || items.hammer) && curr_keys > 0) {
							reachable += 1; // Chest after Moldorm. See assumptions above.
							curr_keys -= 1;
						}
						// 1 key chests 
						if (curr_keys > 0) {
							if (items.hookshot && items.hammer) { // we can reach randomizer room and the area after that
								reachable += items.bigkey10 ? 9 : 8;
								curr_keys -= 1;
							} else {
								if (items.somaria && items.firerod) {    // we can reach armos' area via right side
									reachable += items.bigkey10 ? 5 : 4;
									curr_keys -= 1;
								}
							}
						}
						if ((items.hookshot || items.boots) && items.hammer && curr_keys > 0) {
							reachable += 1; // Vanilla map chest aka double firebar chest. Since one item for one key is the least bang for the buck we check this one last.
							curr_keys -= 1;
						}
						// 1 key chests
						if (items.chest10 > (27 - reachable)) return 'possible'; // available was checked at the beginning. You can get all items with 2 smallkey10 alone but let's make it 'possible' in case someone had to open second right side door to get to armos in order to get hookshot

						return 'unavailable'; // We got all reachable items or even more than that in case the player did not follow the 'common sense'
						break;
				}				
				return 'unavailable';					
				
				if (flags.dungeonitems === 'F') {
					
				} else if (flags.dungeonitems === 'K') {
					
				} else {

				}
			}
		}];

		window.agahnim = {
			caption: 'Agahnim',
			is_available: function() {
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						return (items.sword || items.hammer || (items.net && (items.somaria || items.byrna || items.firerod || items.bow > 0))) && (items.sword || (is_swordless && (items.hammer || items.net))) && (activeFlute() || items.glove) ? items.lantern && agatowerweapon() ? 'available' : 'darkavailable' : 'unavailable';					
						break;
					case 'K':
					case 'F':
						return (items.sword || items.hammer || (items.net && (items.somaria || items.byrna || items.firerod || items.bow > 0))) && (items.sword || (is_swordless && (items.hammer || items.net))) && (activeFlute() || items.glove) && items.smallkeyhalf1 === 2 && agatowerweapon() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
						break;
				}
			}
		};

		//define overworld chests
		window.chests = [{ // [0]
			caption: 'King\'s Tomb {boots} + {glove2}',
			is_opened: false,
			is_available: function() {
				return items.boots && items.glove === 2 && canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [1]
			caption: 'Light World Swamp (2)',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [2]
			caption: 'Stoops Lonk\'s Hoose',
			is_opened: false,
			is_available: always
		}, { // [3]
			caption: 'Spiral Cave',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
					(items.moonpearl ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'sequencebreak') :
					'unavailable';
			}
		}, { // [4]
			caption: 'Mimic Cave',
			is_opened: false,
			is_available: function() {
				return items.hammer && items.moonpearl && (activeFlute() || items.glove) && (items.hookshot || items.glove === 2) ?
					(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
					'unavailable';
			}
		}, { // [5]
			caption: 'Tavern',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [6]
			caption: 'Chicken House {bomb}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [7]
			caption: 'Bombable Hut {bomb}',
			is_opened: false,
			is_available: always
		}, { // [8]
			caption: 'C House',
			is_opened: false,
			is_available: always
		}, { // [9]
			caption: 'Aginah\'s Cave {bomb}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [10]
			caption: 'Mire Shed (2)',
			is_opened: false,
			is_available: function() {
				return activeFlute() || (items.mirror && canReachLightWorldBunny()) ? 'available' : 'unavailable';
			}
		}, { // [11]
			caption: 'Super Bunny Chests (2)',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) ?
					(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
					'unavailable';
			}
		}, { // [12]
			caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror && items.boots ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [13]
			caption: 'Byrna Spike Cave',
			is_opened: false,
			is_available: function() {
				return items.glove && items.hammer && (items.byrna || items.cape) ?
					items.lantern || activeFlute() ? 'available' : 'darkavailable' :
					'unavailable';
			}
		}, { // [14]
			caption: 'Kakariko Well (4 + {bomb})',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [15]
			caption: 'Thieve\'s Hut (4 + {bomb})',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'possible' : 'unavailable')) : 'unavailable';
			}
		}, { // [16]
			caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
			is_opened: false,
			is_available: always
		}, { // [17]
			caption: 'Paradox Cave (5 + 2 {bomb})',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
					(items.moonpearl ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : (items.sword >= 2 ? 'possible' : 'unavailable')) :
					'unavailable';
			}
		}, { // [18]
			caption: 'West of Sanctuary {boots}',
			is_opened: false,
			is_available: function() {
				return items.boots && canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [19]
			caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [20]
			caption: 'Ice Rod Cave {bomb}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [21]
			caption: 'Hookshot Cave (bottom chest) {hookshot}/{boots}',
			is_opened: false,
			is_available: function() {
				return items.glove && (items.boots || items.hookshot) ?
					(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
					'unavailable';
			}
		}, { // [22]
			caption: 'Hookshot Cave (3 top chests) {hookshot}',
			is_opened: false,
			is_available: function() {
				return items.glove && items.hookshot ?
					(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
					'unavailable';
			}
		}, { // [23]
			caption: 'Treasure Chest Minigame: Pay 30 rupees',
			is_opened: false,
			is_available: always
		}, { // [24]
			caption: 'Bottle Vendor: Pay 100 rupees',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? 'available' : 'unavailable';
			}
		}, { // [25]
			caption: 'Sahasrahla {pendant0}',
			is_opened: false,
			is_available: function() {
				if(canReachLightWorldBunny())
					for(var k = 0; k < 10; k++)
						if(prizes[k] === 1 && items['boss'+k])
							return 'available';
				return 'unavailable';
			}
		}, { // [26]
			caption: 'Ol\' Stumpy',
			is_opened: false,
			is_available: always
		}, { // [27]
			caption: 'Lazy Drunk Kid: Distract him with {bottle} because he can\'t lay off the sauce!',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() && items.bottle ? 'available' : 'unavailable';
			}
		}, { // [28]
			caption: 'Gary\'s Lunchbox (save the frog first)',
			is_opened: false,
			is_available: function() {
				return (items.mirror || items.glove === 2) && canReachLightWorldBunny() ? 'available' : 'unavailable';
			}
		}, { // [29]
			caption: 'Fugitive under the bridge {flippers}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? (items.flippers ? 'available' : 'sequencebreak') : 'unavailable';
			}
		}, { // [30]
			caption: 'Ether Tablet {sword2}{book}',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.hammer && items.book && (activeFlute() || items.glove) && (items.hookshot || items.glove === 2) ?
					(items.sword >= 2 || (is_swordless && items.hammer) ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'possible') :
					'unavailable';
			}
		}, { // [31]
			caption: 'Bombos Tablet {sword2}{book}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() && items.book ?
					(items.sword >= 2 || (is_swordless && items.hammer)) ? 'available' : 'possible' :
					'unavailable';
			}
		}, { // [32]
			caption: 'Catfish',
			is_opened: false,
			is_available: function() {
				if(!items.glove)
					return 'unavailable';
				if(canReachPyramid())
					return 'available';
				return items.boots ? 'sequencebreak' : 'unavailable';
			}
		}, { // [33]
			caption: 'King Zora: Pay 500 rupees',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? (items.flippers || items.glove ? 'available' : 'sequencebreak') : 'unavailable';
			}
		}, { // [34]
			caption: 'Lost Old Man {lantern}',
			is_opened: false,
			is_available: function() {
				return items.glove || activeFlute() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
			}
		}, { // [35]
			caption: 'Witch: Give her {mushroom}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() && items.mushroom ? 'available' : 'unavailable';
			}
		}, { // [36]
			caption: 'Forest Hideout',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [37]
			caption: 'Lumberjack Tree {agahnim}{boots}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.agahnim && items.boots && items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [38]
			caption: 'Spectacle Rock Cave',
			is_opened: false,
			is_available: function() {
				return items.glove || activeFlute() ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'unavailable';
			}
		}, { // [39]
			caption: 'South of Grove',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'possible')) : 'unavailable';
			}
		}, { // [40]
			caption: 'Graveyard Cliff Cave',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [41]
			caption: 'Checkerboard Cave',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() && items.glove ? 'available' : 'unavailable';
			}
		}, { // [42]
			caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
			is_opened: false,
			is_available: function() {
				return items.hammer && (items.glove === 2 || (items.mirror && canReachLightWorldBunny())) ? 'available' : 'unavailable';
			}
		}, { // [43]
			caption: 'Library {boots}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.boots ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'possible')) : 'possible') : 'unavailable';
			}
		}, { // [44]
			caption: 'Mushroom',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [45]
			caption: 'Spectacle Rock',
			is_opened: false,
			is_available: function() {
				if(!(items.glove || activeFlute()))
					return 'unavailable';
				return items.moonpearl && items.hammer && (items.hookshot || items.glove === 2) ?
					(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
					'possible';
			}
		}, { // [46]
			caption: 'Floating Island',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
					(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
					'unavailable';
			}
		}, { // [47]
			caption: 'Race Minigame {bomb}/{boots}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [48]
			caption: 'Desert West Ledge {book}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.book ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'possible')) : 'possible') : 'unavailable';
			}
		}, { // [49]
			caption: 'Lake Hylia Island {flippers}',
			is_opened: false,
			is_available: function() {
				if(!canReachLightWorldBunny())
					return 'unavailable';
				return items.moonpearl ? (items.flippers ? 'available' : 'sequencebreak') : 'possible';
			}
		}, { // [50]
			caption: 'Bumper Cave {cape}{mirror}',
			is_opened: false,
			is_available: function() {
				return items.glove && items.cape && items.mirror && canReachLightWorld() ? 'available' : 'possible';
			}
		}, { // [51]
			caption: 'Pyramid',
			is_opened: false,
			is_available: function() {
				if(canReachPyramid())
					return 'available';
				return items.boots ? 'sequencebreak' : 'unavailable';
			}
		}, { // [52]
			caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
			is_opened: false,
			is_available: always
		}, { // [53]
			caption: 'Zora River Ledge {flippers}',
			is_opened: false,
			is_available: function() {
				if(!canReachLightWorld())
					return 'unavailable';
				if(items.flippers)
					return 'available';
				//if(items.boots)
					//return 'sequencebreak';
				return 'possible';
			}
		}, { // [54]
			caption: 'Buried Item {shovel}',
			is_opened: false,
			is_available: function() {
				return items.shovel && canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [55]
			caption: 'Escape Sewer Side Room (3) {bomb}/{boots} (yellow = might need small key)',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.glove && items.moonpearl ? 'available' :
					(items.mirror ? 'possible' : 'unavailable')) : 'unavailable';
			}
		}, { // [56]
			caption: "Castle Secret Entrance (Uncle + 1)",
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [57]
			caption: 'Hyrule Castle Dungeon (3)',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [58]
			caption: 'Sanctuary',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [59]
			caption: 'Mad Batter {hammer} + {powder}',
			is_opened: false,
			is_available: function() {
				return items.powder && items.hammer && canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [60]
			caption: 'Take the frog home',
			is_opened: false,
			is_available: function() {
				return (items.mirror || items.glove === 2) && canReachLightWorldBunny() ? 'available' : 'unavailable';
			}
		}, { // [61]
			caption: 'Fat Fairy: Buy OJ bomb from Light Link\'s House after {crystal}5 {crystal}6 (2 items)',
			is_opened: false,
			is_available: function() {
				//crystal check
				var crystal_count = 0;
				for(var k = 0; k < 10; k++)
					if(prizes[k] === 4 && items['boss'+k])
						crystal_count += 1;
				return crystal_count >= 2 && items.mirror && canReachLightWorldBunny() ? 'available' : 'unavailable';
			}
		}, { // [62]
			caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
			is_opened: false,
			is_available: function() {
				if(!canReachLightWorldBunny())
					return 'unavailable';
				var pendant_count = 0;
				for(var k = 0; k < 10; k++)
					if((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k])
						if(++pendant_count === 3)
							return 'available';
				return items.book ? 'possible' : 'unavailable';
			}
		}, { // [63]
			caption: 'Escape Sewer Dark Room {lantern}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? (items.lantern ? 'available' : 'darkavailable') : (items.mirror ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [64]
			caption: 'Waterfall of Wishing (2) {flippers}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? (items.flippers ? 'available' : 'sequencebreak') : 'unavailable';
			}
		}, { // [65]
			caption: 'Castle Tower',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) ? (items.lantern || items.flute) ? 'available' : 'darkavailable' : 'unavailable';
			}
		}, { // [66]
			caption: 'Castle Tower (small key)',
			is_opened: false,
			is_available: function() {
				if (is_retro) {
					return (activeFlute() || items.glove) ? (items.lantern || items.flute) ? 'available' : 'darkavailable' : 'unavailable';
				} else {
					return (activeFlute() || items.glove) && items.smallkeyhalf1 > 0 ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}
		}];
		
		
	}
	else
	{
		// define dungeon chests
		window.dungeons = [{ // [0]
			caption: 'Eastern Palace',
			is_beaten: false,
			is_beatable: function() {
				var dungeoncheck = enemizer_check(0);
				//Standard check
				if (!items.bigkey0 || dungeoncheck === 'unavailable' || !(items.bow > 0 && !is_enemyshuffle)) return 'unavailable';
				//Dark Room check
				if (!items.lantern && !(items.firerod && is_advanced)) return dungeoncheck === 'possible' ? 'darkpossible' : 'darkavailable';
				return dungeoncheck;
			},
			can_get_chest: function() {
				var dungeoncheck = enemizer_check(0);
				var keys = 0;
				
				switch (flags.dungeonitems) {
					case 'S':
						return items.chest0 <= 2 && !items.lantern || items.chest0 === 1 && !(items.bow > 0) ? 'possible' : 'available';
						break;
					case 'M':
					case 'K':
						if (items.chest0 >= 3) return 'available';
						if (items.chest0 >= 2) return items.lantern ? 'available' : 'darkavailable';
						if (items.chest0 === 1) {
							if (dungeoncheck === 'unavailable') {
								return dungeoncheck;
							}
							if (items.bow > 0) return items.lantern ? dungeoncheck : 'darkavailable';
						}
						return 'unavailable';
						break;
					case 'F':
						if (items.bigkey0 && items.bow > 0 && items.lantern) return 'available';
						if (items.chest0 >= 4) return 'available';
						if (items.chest0 >= 3 && !items.bigkey0 && !items.lantern) return 'darkavailable';
						if (items.chest0 >= 3 && (items.bigkey0 || items.lantern)) return 'possible';
						if (items.chest0 >= 2 && items.bigkey0) return items.lantern ? 'possible' : 'darkavailable';
						if (items.chest0 === 1) {
							if (dungeoncheck === 'unavailable') {
								return dungeoncheck;
							}
							if (items.bigkey0 && items.bow > 0) return items.lantern ? dungeoncheck : 'darkavailable';
						}
						return 'unavailable';			
						break;
				}
				
				/* var chests = ['U','U','U','U','U','U'];
				
				//Cannonball Chest
				chests[0] = 'A';
				//Compass Chest
				chests[1] = 'A';
				//Map Chest
				chests[2] = 'A';				
				//Big Chest
				chests[3] = (flags.dungeonitems === 'F' ? (items.bigkey0 ? 'A' : 'U') : (items.lantern ? 'A' : 'P'));
				//Big Key Chest
				chests[4] = (items.lantern ? 'A' : 'DA');
				if (chests[4] === 'A') keys = 1;
				//Boss
				chests[5] = (items.bigkey0 && dungeoncheck != 'unavailable') ? 'A' : 'U';
				if (chests[5] === 'A') {
					if (is_enemyshuffle) {
						chests[5] = 'P';
					} else {
						if (items.bow === 0) chests[5] = 'U';
					}					
					if (!items.lantern && !(items.firerod && is_advanced)) {
						chests[5] = (chests[5] === 'P') ? 'DP' : 'DA';
					}
				}
				
				return available_chests(chests, keys, items.maxchest0, items.chest0); */
				
			}
		}, { // [1]
			caption: 'Desert Palace {book} / {glove2} {mirror} {flute}',
			is_beaten: false,
			is_beatable: function() {
				if (!(items.book && items.glove) && !(items.flute && items.glove === 2 && items.mirror) || (!items.lantern && !items.firerod)) return 'unavailable';
				var dungeoncheck = enemizer_check(1);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (dungeoncheck === 'available') {
							return items.boots ? 'available' : 'possible';
						}
						return dungeoncheck;
						break;
					case 'K':
						if (items.smallkey1 === 1) {
							if (dungeoncheck === 'available') {
								return items.boots ? 'available' : 'possible';
							}
							return dungeoncheck;
						}
						return dungeoncheck === 'unavailable' ? 'unavailable' : 'possible';
						break;
					case 'F':
						if (!items.bigkey1) return 'unavailable';
						return dungeoncheck;
						break;
				}
			},
			can_get_chest: function() {
				if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
				
				var dungeoncheck = enemizer_check(1);
				/*var keys = 0;
				var chests = ['U','U','U','U','U','U'];
				
				//Torch
				chests[0] = (items.boots ? 'A' : 'U');
				//Compass Chest
				chests[1] = ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K') ? (items.smallkey1 === 1 ? 'A' : 'U') : (items.boots ? 'A' : 'P'));
				//Map Chest
				chests[2] = 'A';
				//Big Chest
				chests[3] = (flags.dungeonitems === 'F' ? (items.bigkey1 ? 'A' : 'U') : (items.boots ? 'A' : 'P'));
				//Big Key Chest
				chests[4] = ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K') ? (items.smallkey1 === 1 ? 'A' : 'U') : (items.boots ? 'A' : 'P'));
				//Boss
				chests[5] = (items.bigkey1 && items.glove > 0 && (items.lantern || items.firerod) && dungeoncheck != 'unavailable') ? 'A' : 'U';
				
				if (items.boots) keys = 2;
				
				return available_chests(chests, keys, items.maxchest1, items.chest1); */
				//return available_chests(chests, 1, chests[3], items.maxchest1, items.chest1);			
								
				
				
				
				
				switch (flags.dungeonitems) {
					case 'S':
						if (items.chest1 === 2) return items.boots ? 'available' : 'possible';
						if (items.chest1 === 1) {
							if (items.glove && (items.firerod || items.lantern) && items.boots) return dungeoncheck === 'unavailable' ? 'possible' : dungeoncheck;
							return 'possible'
						}
						break;
					case 'M':
						if (items.chest1 === 4) return 'available';
						if (items.chest1 > 1) return items.boots ? 'available' : 'possible';
						if (items.chest1 === 1) {
							if (items.glove && (items.firerod || items.lantern) && items.boots) return dungeoncheck === 'unavailable' ? 'possible' : dungeoncheck;
							return 'possible'
						}
						break;
					case 'K':
						if (items.chest1 === 5) return 'available';
						if (items.smallkey1 === 0) {
							if (items.chest1 === 4) return items.boots ? 'available' : 'possible';
							if (items.chest1 === 3) return items.boots ? (dungeoncheck === 'unavailable' ? 'unavailable' : 'possible') : 'unavailable';
						} else {
							if (items.chest1 > 2) return 'available';
							if (items.chest1 > 1) return items.boots ? 'available' : 'possible';
							if (items.chest1 === 1) return items.boots ? dungeoncheck : 'unavailable';
						}
						break;
					case 'F':
						if (items.chest1 === 6) return 'available';
						if (items.chest1 === 5) {
							if (items.bigkey1 || items.boots || items.smallkey1 === 1) return 'available';
						}
						if (items.chest1 === 4) {
							if (items.bigkey1 && !items.boots && items.smallkey1 === 0 && items.glove && (items.lantern || items.firerod)) return dungeoncheck;
							if ((items.bigkey1 && items.boots) || items.smallkey1 === 1) return 'available';
						}
						if (items.chest1 === 3) {
							if (items.smallkey1 === 1) {
								if (items.bigkey1 || items.boots) return 'available';
							} else {
								if (items.bigkey1 && items.boots && items.glove && (items.lantern || items.firerod)) return dungeoncheck;
							}
						}
						if (items.chest1 === 2) {
							if (items.smallkey1 === 0 || !items.bigkey1) {
								return 'unavailable';
							} else {
								if (items.boots) {
									return 'available';
								} else {
									if (items.glove && (items.lantern || items.firerod)) return dungeoncheck;
								}
							}
						}
						if (items.chest1 === 1) {
							if (!items.boots) return 'unavailable';
							if (items.bigkey1 && items.smallkey1 === 1 && items.glove && (items.lantern || items.firerod)) return dungeoncheck;
						}
						break;
				}
				//return 'unavailable';
			}
		}, { // [2]
			caption: 'Tower of Hera {mirror} / {hookshot} {hammer}',
			is_beaten: false,
			is_beatable: function() {
				if (!items.flute && !items.glove) return 'unavailable';
				if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
				var dungeoncheck = enemizer_check(2);
				if (dungeoncheck === 'unavailable') return 'unavailable';
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (!items.lantern && !items.firerod) return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						if (!items.lantern && !items.flute) return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
						return dungeoncheck;
						break;
					case 'K':
						if ((!items.lantern && !items.firerod) || items.smallkey2 === 0) return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						if (!items.lantern && !items.flute) return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
						return dungeoncheck;
						break;
					case 'F':
						if (!items.bigkey2) return 'unavailable';
						if (!items.lantern && !items.flute) return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
						return dungeoncheck;
						break;
				}
			},
			can_get_chest: function() {
				if (!items.flute && !items.glove) return 'unavailable';
				if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
				var dungeoncheck = enemizer_check(2);
				
				/*var keys = 0;
				var chests = ['U','U','U','U','U','U'];
				
				//Small Key
				chests[0] = 'A';
				//Compass Chest
				chests[1] = 'A';
				//Big Key Chest
				chests[2] = ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K') ? (items.smallkey2 === 1 && (items.lantern || items.firerod) ? 'A' : 'U') : (items.lantern || items.firerod) ? 'P' : 'U');
				//Map Chest
				chests[3] = (flags.dungeonitems === 'K' ? (items.bigkey2 ? 'A' : 'U') : 'P');
				//Big Chest
				chests[4] = (flags.dungeonitems === 'K' ? (items.bigkey2 ? 'A' : 'U') : 'P');
				//Boss
				chests[5] = (!items.bigkey1 || dungeoncheck === 'unavailable') ? 'U' : (dungeoncheck === 'available' ? 'A' : 'P');
				
				if (items.lantern || items.firerod) keys = 2;
				
				return available_chests(chests, keys, items.maxchest2, items.chest2);*/
				
				
				switch (flags.dungeonitems) {
					case 'S':
						if (items.lantern || items.firerod) {
							if (!items.lantern && !items.flute) {
								return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
							} else {
								return dungeoncheck === 'available' ? 'available' : 'possible';
							}
						}
						return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						break;
					case 'M':
						if (items.chest2 === 4) {
							return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
						}
						if (items.chest2 === 3) {
							if (items.lantern || items.firerod) return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
							return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						}
						if (items.chest2 === 2) {
							if (items.lantern || items.firerod) {
								if (!items.lantern && !items.flute) {
									return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
								} else {
									return dungeoncheck === 'available' ? 'available' : 'possible';
								}
							}
							return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						}
						if (dungeoncheck === 'unavailable') return 'unavailable';
						if (!items.lantern && !items.firerod) return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
						return dungeoncheck === 'available' ? ((!items.lantern && !items.flute) ? 'darkavailable' : 'available') : ((!items.lantern && !items.flute) ? 'darkpossible' : 'possible');
						break;
					case 'K':
						if (items.chest2 > 3) {
							return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
						}
						if (items.chest2 > 1) {
							if (items.smallkey2 === 0 || (!items.lantern && !items.firerod)) {
								return (!items.lantern && !items.flute) ? 'darkpossible' : 'possible';
							} else {
								return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
							}
						}
						if (items.chest2 === 1) {
							if (items.smallkey2 === 0 || (!items.lantern && !items.firerod) || dungeoncheck === 'unavailable') return 'unavailable';
						}
						return dungeoncheck === 'available' ? ((!items.lantern && !items.flute) ? 'darkavailable' : 'available') : ((!items.lantern && !items.flute) ? 'darkpossible' : 'possible'); 
						break;
					case 'F':
						if (items.chest2 > 4) {
							return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
						}
						if (items.chest2 === 4) {
							if (items.smallkey2 === 0 && !items.bigkey2) return 'unavailable';
							if (!items.bigkey2 && (items.smallkey2 === 1 || (!items.lantern && !items.firerod))) return 'unavailable';
							return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
						}
						if (items.chest2 === 3) {
							if (items.bigkey2) return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
							return 'unavailable';
						}
						if (items.chest2 === 2 && items.bigkey2) {
							if (dungeoncheck != 'unavailable') {
								return (!items.lantern && !items.flute) ? 'darkavailable' : 'available';
							} else {
								if (items.smallkey2 === 0 || (!items.lantern && !items.firerod)) return 'unavailable';
								return dungeoncheck === 'available' ? ((!items.lantern && !items.flute) ? 'darkavailable' : 'available') : ((!items.lantern && !items.flute) ? 'darkpossible' : 'possible');
							}
						}
						if (items.chest2 === 1 && items.bigkey2 && items.smallkey2 == 1 && (items.lantern || items.firerod) && dungeoncheck != 'unavailable') return dungeoncheck === 'available' ? ((!items.lantern && !items.flute) ? 'darkavailable' : 'available') : ((!items.lantern && !items.flute) ? 'darkpossible' : 'possible');
						break;
				}				
				return 'unavailable';
			}
		}, { // [3]
			caption: 'Palace of Darkness',
			is_beaten: false,
			is_beatable: function() {
				if (!canReachDarkWorld() || !(items.bow > 0) || !items.hammer) return 'unavailable';
				if (!items.agahnim && !items.glove) return 'unavailable';
				var dungeoncheck = enemizer_check(3);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (dungeoncheck === 'unavailable') return 'unavailable';
						return dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'darkpossible' : 'darkpossible') ;
						break;
					case 'K':
						if (items.smallkey3 < 6) return 'unavailable'
						if (dungeoncheck === 'unavailable') return 'unavailable';
						return dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'darkpossible' : 'darkpossible') ;
						break;
					case 'F':
						if (items.smallkey3 < 6 || !items.bigkey3) return 'unavailable'
						if (dungeoncheck === 'unavailable') return 'unavailable';
						return dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'darkpossible' : 'darkpossible') ;
						break;
				}
			},
			can_get_chest: function() {
				if (!canReachDarkWorld()) return 'unavailable';
				if (!items.agahnim && !items.glove) return 'unavailable';
				var dungeoncheck = enemizer_check(2);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (items.hammer && items.bow > 0 && items.lantern) return 'available';
						if (items.chest3 > 3) {
							if (!items.hammer && !items.bow) return items.lantern ? 'available' : 'possible';
						}
						if (items.chest3 > 1) {
							return (items.bow) ? 'available' : 'possible';
						}
						return 'possible'
						break;
					case 'K':
						//Prioritize Helma last
						if (items.smallkey3 === 6 && items.hammer && items.bow > 0 && items.lantern && dungeoncheck === 'available') return 'available';
						
						// item count approach
						var reachable = 0;
						var curr_keys = 0;
						var dark_chests = 0;
						curr_keys += items.smallkey3;
						reachable += 1; // free first chest
						// 0 key chests
						if (items.bow > 0) reachable += 2; // bow locked right side
						// conditioned key usage
						if (items.bow > 0 && items.hammer) {
							reachable += 2; // bridge and dropdown
						} else {
							if (curr_keys > 0) {
								reachable += 2; // bridge and dropdown
								curr_keys -= 1; // front door used
							}
						}
						// 1 key chests
						if (curr_keys > 0) {
							reachable += 3; // Back side of POD, since it yields most chests for the key
							curr_keys -= 1;
							dark_chests += 2;
						}
						if (curr_keys > 0) {
							reachable += 3; // Dark area with big chest, always assume big key is possible
							curr_keys -= 1;
							dark_chests += 3;
						}
						if (items.bow > 0 && items.hammer && curr_keys > 0) {
							reachable += 1; // King Helmasaur. We do not prioritize him when he is beatable. This way we show the max amount of items.
							curr_keys -= 1;
							dark_chests += 1;
						}
						if (curr_keys > 0) {
							reachable += 1; // Spike Room
							curr_keys -= 1;
						}
						if (curr_keys > 0) {
							reachable += 1; // Vanilla big key chest
							curr_keys -= 1;
						}

						if (items.chest3 > 13 - reachable) {
							if (items.chest3 > 13 - (reachable - dark_chests)) {
								return 'possible';
							} else {
								return items.lantern ? 'possible' : 'darkavailable';
							}
						}
						return 'unavailable'; // We got all reachable chests or even more if helmasaur was not prioritized
						break;
					case 'F':
						if (items.smallkey3 === 6 && items.bigkey3 && items.hammer && items.bow > 0 && items.lantern && dungeoncheck === 'available') return 'available';
						// item count approach
						var reachable = 0;
						var curr_keys = 0;
						var dark_chests = 0;
						curr_keys += items.smallkey3;
						reachable += 1; // free first chest
						// 0 key chests
						if (items.bow > 0) reachable += 2; // bow locked right side
						// conditioned key usage
						if (items.bow > 0 && items.hammer) {
							reachable += 2; // bridge and dropdown
						} else {
							if (curr_keys > 0) {
								reachable += 2; // bridge and dropdown
								curr_keys -= 1; // front door used
							}
						}
						// 1 key chests
						if (curr_keys > 0) {
							reachable += 3; // Back side of POD, since it yields most chests for the key
							curr_keys -= 1;
							dark_chests += 2;
						}
						if (curr_keys > 0) {
							reachable += items.bigkey3 ? 3 : 2; // Dark area with big chest
							curr_keys -= 1;
							dark_chests += items.bigkey3 ? 3 : 2;
						}
						if (items.bow > 0 && items.hammer && items.bigkey3 && curr_keys > 0) {
							reachable += 1; // King Helmasaur. We do not prioritize him when he is beatable. This way we show the max amount of items.
							curr_keys -= 1;
							dark_chests += 1;
						}
						if (curr_keys > 0) {
							reachable += 1; // Spike Room
							curr_keys -= 1;
						}
						if (curr_keys > 0) {
							reachable += 1; // Vanilla big key chest
							curr_keys -= 1;
						}

						if (items.chest3 > 14 - reachable) {
							if (items.chest3 > 14 - (reachable - dark_chests)) {
								return 'possible';
							} else {
								return items.lantern ? 'possible' : 'darkavailable';
							}
						}
						
						return 'unavailable'; // We got all reachable chests or even more if helmasaur was not prioritized
						break;
				}
			}
		}, { // [4]
			caption: 'Swamp Palace {mirror} {flippers}',
			is_beaten: false,
			is_beatable: function() {
				if (!canReachDarkWorld() || !items.mirror || !items.flippers || !items.hammer || !items.hookshot) return 'unavailable';
				if (!items.glove && !items.agahnim) return 'unavailable';
				var dungeoncheck = enemizer_check(4);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						return dungeoncheck;
						break;
					case 'K':
					case 'F':
						if (items.smallkey4 === 0) return 'unavailable';
						return dungeoncheck;
						break;
				}
			},
			can_get_chest: function() {
				if (!canReachDarkWorld() || !items.mirror || !items.flippers) return 'unavailable';
				if (!items.glove && !items.agahnim) return 'unavailable';				
				var dungeoncheck = enemizer_check(4);
				switch (flags.dungeonitems) {
					case 'S':
						if (items.chest4 === 6) return 'available';
						if (!items.hammer) return 'unavailable';
						if (items.chest4 === 5) return 'available';
						if (items.chest4 > 2) return !items.hookshot ? 'possible' : 'available';
						return !items.hookshot ? 'unavailable' : 'available';
						break;
					case 'M':
						if (items.chest4 === 8) return 'available';
						if (!items.hammer) return 'unavailable';
						if (items.chest4 > 4) return 'available';
						return !items.hookshot ? 'unavailable' : 'available';
						break;
					case 'K':
						if (items.chest4 === 9) return 'available';
						if (items.smallkey4 === 0) return 'unavailable';
						if (items.chest4 === 8) return 'available';
						if (!items.hammer) return 'unavailable';
						if (items.chest4 > 4) return 'available';
						return !items.hookshot ? 'unavailable' : 'available';
						break;
					case 'F':
						if (items.chest4 === 10) return 'available';
						if (items.smallkey4 === 0) return 'unavailable';
						if (items.chest4 === 9) return 'available';
						if (!items.hammer) return 'unavailable';
						if (items.chest4 > 5) return 'available';
						if (items.chest4 === 5 && (items.bigkey4 || items.hookshot)) return 'available';
						if (items.chest4 > 1) return !items.hookshot ? 'unavailable' : 'available';
						if (items.chest4 === 1) return items.bigkey4 ? 'available' : 'unavailable';
						break;
				}
				return 'unavailable';
			}
		}, { // [5]
			caption: 'Skull Woods',
			is_beaten: false,
			is_beatable: function() {
				if (!can_reach_outcast() || !canReachDarkWorld() || !items.firerod || (items.sword == 0 && !is_swordless)) return 'unavailable';
				var dungeoncheck = enemizer_check(5);
				return dungeoncheck;
			},
			can_get_chest: function() {
				if (!can_reach_outcast() || !canReachDarkWorld()) return 'unavailable';
				var dungeoncheck = enemizer_check(5);
				switch (flags.dungeonitems) {
					case 'S':
						if (items.chest5 === 2) return !items.firerod ? 'possible' : 'available';
						return dungeoncheck === 'unavailable' || !items.firerod || (items.sword == 0 && !is_swordless) ? 'possible' : 'available';
						break;
					case 'M':
						if (items.chest5 > 2) return 'available';
						if (items.chest5 === 2) !items.firerod ? 'possible' : 'available';
						return dungeoncheck === 'unavailable' || !items.firerod || (items.sword == 0 && !is_swordless) ? 'possible' : 'available';
						break;
					case 'K':
						if (items.chest5 > 2) return 'available';
						if (items.chest5 === 2) return !items.firerod ? 'unavailable' : 'available';
						return dungeoncheck === 'unavailable' || (items.sword == 0 && !is_swordless) ? 'unavailable' : dungeoncheck;
						break;
					case 'F':
						if (items.chest5 > 3) return 'available';
						if (items.chest5 < 4 && !items.firerod && !items.bigkey5) return 'unavailable';
						if (items.chest5 === 3 && (items.firerod || items.bigkey5)) return 'available';
						if (items.chest5 === 2 && !items.firerod) return 'unavailable';
						if (items.chest5 === 2) {
							if (items.bigkey5) return 'available';
							if (items.sword > 0 || is_swordless) return dungeoncheck;
						}
						return (!items.firerod || (items.sword == 0 && !is_swordless) || !items.bigkey5) ? 'unavailable' : 'available';
						if (!items.bigkey5 || dungeoncheck === 'unavailable' || (!is_swordless && items.sword === 0)) return 'unavailable';
						return dungeoncheck;
						break;
				}
				return 'unavailable';
			}
		}, { // [6]
			caption: 'Thieves\' Town',
			is_beaten: false,
			is_beatable: function() {
				if (!can_reach_outcast() || !canReachDarkWorld()) return 'unavailable';
				var dungeoncheck = enemizer_check(6);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
					case 'K':
						return dungeoncheck;
						break;
					case 'F':
						return (!items.bigkey6) ? 'unavailable' : dungeoncheck;
						break;
				}
			},
			can_get_chest: function() {
				if (!can_reach_outcast() || !canReachDarkWorld()) return 'unavailable';
				var dungeoncheck = enemizer_check(6);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (items.chest6 > 2) return 'available';
						if (items.chest6 === 2) {
							if ((!items.hammer) && dungeoncheck === 'unavailable') return 'possible';
							if (items.hammer) return 'available';
							return dungeoncheck;
						}							
						return (items.chest6 === 1 && (!items.hammer)) ? 'possible' : dungeoncheck;
						break;
					case 'K':
						if (items.chest6 > 2) return 'available';
						if (items.chest6 === 2) {
							if ((!items.hammer || items.smallkey6 === 0) && dungeoncheck === 'unavailable') return 'unavailable';
							if (items.hammer && items.smallkey6 === 1) return 'available';
							return dungeoncheck;
						}							
						return (items.chest6 === 1 && (!items.hammer || items.smallkey6 === 0)) ? 'unavailable' : dungeoncheck;
						break;
					case 'F':
						if (items.chest6 > 4) return 'available';
						if (items.chest6 < 5 && !items.bigkey6) return 'unavailable';
						if (items.chest6 > 2) return 'available';
						if (items.chest6 > 1) {
							if (items.smallkey6 === 1 && items.hammer) return 'available';
							return dungeoncheck;
						}
						if ((items.smallkey6 === 0 || !items.hammer || dungeoncheck === 'unavailable')) return 'unavailable'; 
						return dungeoncheck;
						break;
				}
			}
		}, { // [7]
			caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
			is_beaten: false,
			is_beatable: function() {
				if (!items.moonpearl || !items.flippers || items.glove !== 2 || !items.hammer || !canReachDarkWorld()) return 'unavailable';
				if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && !is_swordless))) return 'unavailable';
				if (!items.hookshot && (!items.somaria || !items.bigkey7)) return 'unavailable';
				var dungeoncheck = enemizer_check(7);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
					case 'K':
					case 'F':
						return dungeoncheck;
						break;
				}
			},
			can_get_chest: function() {
				if (!items.moonpearl || !items.flippers || items.glove !== 2 || !canReachDarkWorld()) return 'unavailable';
				if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && !is_swordless))) return 'unavailable';
				var dungeoncheck = enemizer_check(7);
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (items.chest7 > 1 && items.hammer && (items.hookshot || items.somaria)) return 'available';
						if (items.chest7 === 1 && items.hammer && (items.hookshot || items.somaria) && dungeoncheck === 'available') return 'available';
						return 'possible';
						break;
					case 'K':
						//if (items.hammer) return ((items.smallkey7 === 1 && items.somaria) || items.smallkey7 === 2) ? 'available' : 'possible';
						//if (items.hammer) return 'possible';
						if (items.chest7 >= 4) return 'possible';
						if (items.chest7 >= 2 && items.hammer) return 'possible';
						break;
					case 'F':
						if (items.bigkey7 && items.hammer) return ((items.smallkey7 === 1 && items.somaria) || items.smallkey7 === 2) ? 'available' : 'possible';
						if (items.bigkey7 && items.hammer) return 'possible';
						if (items.chest7 >= 5) return 'possible';
						if (items.chest7 >= 4 && items.bigkey7) return 'possible';
						if (items.chest7 >= 2 && items.hammer) return 'possible';
						break;
				}
				return 'unavailable';				
			}
		}, { // [8]
			caption: 'Misery Mire {medallion0}',
			is_beaten: false,
			is_beatable: function() {
				if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria || !canReachDarkWorld() || !melee_bow()) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';
				var state = medallion_check(0);
				if (state) return state;
				var dungeoncheck = enemizer_check(8);
				if (dungeoncheck === 'unavailable') return 'unavailable';
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
					case 'K':
						if (!items.lantern && !items.firerod) return 'darkpossible';
						return dungeoncheck === 'available' ? (!items.lantern ? 'darkavailable' : 'available') : (!items.lantern ? 'darkpossible' : 'possible');
						break;
					case 'F':
						if (!items.bigkey8) return 'unavailable';
						return dungeoncheck === 'available' ? (!items.lantern ? 'darkavailable' : 'available') : (!items.lantern ? 'darkpossible' : 'possible');
						break;
				}
			},
			can_get_chest: function() {
				if (!items.moonpearl || !items.flute || items.glove !== 2 || !canReachDarkWorld()) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';
				if (items.sword === 0 && !is_swordless) return 'unavailable';
				var state = medallion_check(0);
				if (state) return state;
				var dungeoncheck = enemizer_check(8);
				switch (flags.dungeonitems) {
					case 'S':
						if ((items.lantern || items.firerod) && items.somaria) return (!items.lantern ? 'darkavailable' : 'available');
						return 'possible';
						break;
					case 'M':
						if ((items.lantern || items.firerod) && items.somaria) return (!items.lantern ? 'darkavailable' : 'available');
						if (items.chest8 === 4) return 'available';
						if (!items.lantern && !items.firerod) return 'possible';
						if (dungeoncheck === 'unavailable' || !items.somaria) return 'possible';
						return dungeoncheck === 'available' ? (!items.lantern ? 'darkavailable' : 'available') : (!items.lantern ? 'darkpossible' : 'possible');
						break;
					case 'K':
						if ((items.lantern || items.firerod) && items.somaria) return (!items.lantern ? 'darkavailable' : 'available');
						if (items.chest8 > 3) return 'available';
						if (!items.lantern && !items.firerod && !items.somaria) return 'unavailable';
						if (items.chest8 === 3) {
							if (!items.lantern && !items.firerod && items.somaria && dungeoncheck != 'unavailable') return dungeoncheck === 'available' ? 'darkavailable' : 'darkpossible';
							if (items.lantern || items.firerod) return 'available';
						}
						if (items.chest8 === 2 && (items.lantern || items.firerod)) return 'available';
						return 'unavailable';
						break;
					case 'F':
						if (items.lantern && items.bigkey8 && items.somaria) return 'available';
						if (items.chest8 >= 5) return 'available';
						if (items.chest8 >= 4 && items.bigkey8) return 'available';
						if (items.chest8 >= 3 && items.bigkey8 && items.somaria && !items.lantern && !items.firerod) return 'darkavailable';
						if (items.chest8 >= 3 && (items.lantern || items.firerod)) return 'available';
						if (items.chest8 >= 2 && (items.firerod || items.lantern) && items.bigkey8) return 'available';
						if (items.chest8 >= 1 && !items.lantern && items.firerod && items.bigkey8 && items.somaria) return 'darkavailable';
						return 'unavailable';					
						break;
				}
			}
		}, { // [9]
			caption: 'Turtle Rock {medallion0} {hammer}',
			is_beaten: false,
			is_beatable: function() {
				if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !canReachDarkWorld()) return 'unavailable';
				if (!items.hookshot && !items.mirror) return 'unavailable';
				var state = medallion_check(1);
				if (state) return state;				
				
				var dungeoncheck = enemizer_check(9);
				if (dungeoncheck === 'unavailable') return 'unavailable';
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if ((items.byrna || items.cape || items.shield === 3) || is_advanced) {
							if (items.firerod) return dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible');
						}
						return (items.lantern ? 'possible' : 'darkpossible');
						break;
					case 'K':
					case 'F':
						if (items.smallkey9 < 4 || !items.bigkey9) return 'unavailable';
						if ((items.byrna || items.cape || items.shield === 3) || is_advanced) {
							if (items.firerod) return dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible');
						}
						return (items.lantern ? 'possible' : 'darkpossible');
						break;
				}
			},
			can_get_chest: function() {
				if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !canReachDarkWorld()) return 'unavailable';
				if (!items.hookshot && !items.mirror) return 'unavailable';
				var state = medallion_check(1);
				if (state) return state;				
				
				var dungeoncheck = enemizer_check(9);
				switch (flags.dungeonitems) {
					case 'S':
						if (dungeoncheck === 'available' && items.lantern && (items.byrna || items.cape || items.shield === 3)) return 'available';
						var laser_safety = items.byrna || items.cape || items.shield === 3, dark_room = items.lantern ? 'available' : 'darkavailable';
						if (items.chest9 <= 1) return !laser_safety ? 'unavailable' : (dungeoncheck != 'unavailable') ? dark_room : 'possible';
						if (items.chest9 <= 2) return !laser_safety ? 'unavailable' : items.firerod ? dark_room : 'possible';
						if (items.chest9 <= 4) return laser_safety && items.firerod && items.lantern ? 'available' : 'possible';
						return items.firerod ? 'available' : 'possible';
						break;
					case 'M':
						if (dungeoncheck === 'available' && items.lantern && (items.byrna || items.cape || items.shield === 3)) return 'available';
						
						var laser_safety = items.byrna || items.cape || items.shield === 3, dark_room = items.lantern ? 'available' : 'darkavailable';
						if (items.chest9 <= 1) return !laser_safety ? 'unavailable' : (dungeoncheck != 'unavailable') ? dark_room : 'possible';
						if (items.chest9 <= 4) return !laser_safety ? 'unavailable' : items.firerod ? dark_room : 'possible';
						if (items.chest9 <= 6) return laser_safety && items.firerod && items.lantern ? 'available' : 'possible';
						return items.firerod ? 'available' : 'possible';						
						
						break;
					case 'K':
						if (dungeoncheck === 'available' && items.smallkey9 === 4 && items.firerod && items.icerod && items.lantern && (items.byrna || items.cape || items.shield === 3)) return 'available';
						//Assumed big key is available
						
						// item count approach
						var reachable = 0;
						var curr_keys = 0;
						var dark_chests = 0;
						curr_keys += items.smallkey9;
						reachable += 1; // free first chest
						// 0 key chests
						if (items.firerod) {
							reachable += 2; // fire rod locked right side				
						}
						// 1 key chests
						if (curr_keys > 0) {
							reachable += 1; // Chain Chomp room
							curr_keys -= 1;
						}
						// 2 key chests
						if (curr_keys > 0) { 
							curr_keys -= 1;
							if (!items.bigkey9) {
								// Unable to proceed beyond big key room, but can get vanilla big key chest
								reachable += 1;
							} else {
								reachable += 2; // Big chest and roller room
								if (items.byrna || items.cape || items.shield === 3) {
									// Logic for laser bridge, needs safety item to be in logic
									reachable += 4;
									if (!items.lantern) {
										dark_chests += 4;
									}
								}
							}
						}
						if (items.bigkey9) {
							// 3 key chests
							if (curr_keys > 0) { 
								curr_keys -= 1;
								reachable += 1; // Either Trinexx or vanilla big key chest will be obtainable with 3 keys
							}				
							
							// 4 key chests
							if (curr_keys > 0) { 
								if (!items.lantern && items.icerod && items.firerod) {
									dark_chests += 1; // All of TR is clearable in the dark
									reachable += 1;
								}
							}				
						}
						if (items.chest9 > 12 - reachable) {
							if (items.chest9 > 12 - (reachable - dark_chests)) {
								return 'possible';
							} else {
								return items.lantern ? 'possible' : 'darkavailable';
							}
						}
						
						return 'unavailable';						
												
						break;
					case 'F':
						if (dungeoncheck === 'available' && items.bigkey9 && items.smallkey9 === 4 && items.firerod && items.icerod && items.lantern && (items.byrna || items.cape || items.shield === 3)) return 'available';

						// item count approach
						var reachable = 0;
						var curr_keys = 0;
						var dark_chests = 0;
						curr_keys += items.smallkey9;
						reachable += 1; // free first chest
						// 0 key chests
						if (items.firerod) {
							reachable += 2; // fire rod locked right side				
						}
						// 1 key chests
						if (curr_keys > 0) {
							reachable += 1; // Chain Chomp room
							curr_keys -= 1;
						}
						// 2 key chests
						if (curr_keys > 0) { 
							curr_keys -= 1;
							if (!items.bigkey9) {
								// Unable to proceed beyond big key room, but can get vanilla big key chest
								reachable += 1;
							} else {
								reachable += 2; // Big chest and roller room
								if (items.byrna || items.cape || items.shield === 3) {
									// Logic for laser bridge, needs safety item to be in logic
									reachable += 4;
									if (!items.lantern) {
										dark_chests += 4;
									}
								}
							}
						}
						if (items.bigkey9) {
							// 3 key chests
							if (curr_keys > 0) { 
								curr_keys -= 1;
								reachable += 1; // Either Trinexx or vanilla big key chest will be obtainable with 3 keys
							}				
							
							// 4 key chests
							if (curr_keys > 0) { 
								if (!items.lantern && items.icerod && items.firerod) {
									dark_chests += 1; // All of TR is clearable in the dark
									reachable += 1;
								}
							}				
						}
						if (items.chest9 > 12 - reachable) {
							if (items.chest9 > 12 - (reachable - dark_chests)) {
								return 'possible';
							} else {
								return items.lantern ? 'possible' : 'darkavailable';
							}
						}
						
						return 'unavailable';
						break;
				}
			}
		}, { // [10]
			caption: 'Ganon\'s Castle (Crystals)',
			is_beaten: false,
			is_beatable: function() {
				if (crystal_check() < flags.ganonvulncount || !canReachDarkWorld()) return 'unavailable';
				if (flags.goals === 'F' && (items.sword > 1 || is_swordless && items.hammer) && (items.lantern || items.firerod)) return 'available';
				
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						if (items.glove === 2 && items.bow > 0 && items.hookshot && (items.firerod || items.lantern)) {
							if (!items.somaria || !items.boots || !items.firerod) return 'possible';
							return (is_bossshuffle && !items.icerod) ? 'possible' : 'available';
						}
						break;
					case 'K':
					case 'F':		
						if (items.bigkey10 &&  items.bow > 0 && items.hookshot && (items.firerod || items.lantern)) {
							if (items.smallkey10 < 3) return 'possible';
							if (items.smallkey10 >= 3) return (is_bossshuffle && !items.icerod) ? 'possible' : 'available';
						}
						break;
				}				
				return 'unavailable';
			},
			can_get_chest: function() {
				if (crystal_check() < flags.opentowercount || items.glove < 2 || !items.hammer || !canReachDarkWorld()) return 'unavailable';
				
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						//THIS NEEDS TO BE REDESIGNED
						if (items.bow > 0 && items.hookshot && items.firerod && items.somaria && items.boots) return 'available';
						return 'possible';
						break;
					case 'K':
					case 'F':		
						if (items.bigkey10 && items.smallkey10 > 2 && items.bow > 0 && items.hookshot && items.firerod && items.somaria) return 'available';
							// Counting reachable items and keys
							var reachable = 0;
							var curr_keys = 0;
							curr_keys += items.smallkey10;
							curr_keys += 1; // free key on left side
							// 0 key chests
							reachable += 2; // first two right side chests
							if (items.boots) reachable += 1; // torch
							if (items.somaria) reachable += 1; // tile room
							if (items.hookshot && items.hammer) reachable += 4; // stalfos room
							if (items.bigkey10 && items.bow > 0 && (items.lantern || items.firerod)){ 
								reachable += 2; // mini helmasaur room
								curr_keys += 1; // mini helmasaur room
							}
							// 0 key chests with common sense
							if (items.somaria && items.firerod && curr_keys > 0) reachable += 4; // rest of the right side chests. The key is gained back after those.
							if (items.hookshot && items.hammer) reachable += 1; // chest before randomizer room. We assume the key in the switch room is used for this one
							if (items.bigkey10 && items.bow > 0 && (items.lantern || items.firerod) && curr_keys > 0) {
								reachable += 1; // room after mini helmasaurs. We assume players keep enough keys to reach top. If they didnt, then they got other chests for that key.
								curr_keys -= 1;
							}
							if (items.bigkey10 && items.bow > 0 && (items.lantern || items.firerod) && items.hookshot && ((items.sword > 0 || is_swordless) || items.hammer) && curr_keys > 0) {
								reachable += 1; // Chest after Moldorm. See assumptions above.
								curr_keys -= 1;
							}
							// 1 key chests 
							if (curr_keys > 0) {
								if (items.hookshot && items.hammer) { // we can reach randomizer room and the area after that
									reachable += items.bigkey10 ? 9 : 8;
									curr_keys -= 1;
								} else {
									if (items.somaria && items.firerod) {    // we can reach armos' area via right side
										reachable += items.bigkey10 ? 5 : 4;
										curr_keys -= 1;
									}
								}
							}
							if ((items.hookshot || items.boots) && items.hammer && curr_keys > 0) {
								reachable += 1; // Vanilla map chest aka double firebar chest. Since one item for one key is the least bang for the buck we check this one last.
								curr_keys -= 1;
							}
							// 1 key chests
							if (items.chest10 > (27 - reachable)) return 'possible'; // available was checked at the beginning. You can get all items with 2 smallkey10 alone but let's make it 'possible' in case someone had to open second right side door to get to armos in order to get hookshot

							return 'unavailable'; // We got all reachable items or even more than that in case the player did not follow the 'common sense'
						break;
				}				
				return 'unavailable';
			}
		}];

		window.agahnim = {
			caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
			is_available: function() {
				switch (flags.dungeonitems) {
					case 'S':
					case 'M':
						return ((items.sword >= 2 || (items.cape && items.sword) || (is_swordless && (items.hammer || (items.cape && items.net)))) && agatowerweapon()) ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
						break;
					case 'K':
					case 'F':
						return (items.sword >= 2 || (items.cape && items.sword) || (is_swordless && (items.hammer || (items.cape && items.net)))) && items.smallkeyhalf1 === 2 && agatowerweapon() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
						break;
				}
			}
		};

		//define overworld chests
		window.chests = [{ // [0]
			caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
			is_opened: false,
			is_available: function() {
				if (!items.boots) return 'unavailable';
				if (can_reach_outcast() && items.mirror || items.glove === 2) return 'available';
				return 'unavailable';
			}
		}, { // [1]
			caption: 'Light World Swamp (2)',
			is_opened: false,
			is_available: always
		}, { // [2]
			caption: 'Stoops Lonk\'s Hoose',
			is_opened: (is_standard),
			is_available: always
		}, { // [3]
			caption: 'Spiral Cave',
			is_opened: false,
			is_available: function() {
				return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
					items.lantern || items.flute ? 'available' : 'darkavailable' :
					'unavailable';
			}
		}, { // [4]
			caption: 'Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion0} unkown OR possible w/out {firerod})',
			is_opened: false,
			is_available: function() {
				if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !items.mirror) return 'unavailable';
				var state = medallion_check(1);
				if (state) return state;

				if (flags.dungeonitems === 'F') {
					return items.smallkey9 <= 1 ? 'unavailable' : 'available';
				}

				return items.firerod ?
					items.lantern || items.flute ? 'available' : 'darkavailable' :
					'possible';
			}
		}, { // [5]
			caption: 'Tavern',
			is_opened: false,
			is_available: always
		}, { // [6]
			caption: 'Chicken House {bomb}',
			is_opened: false,
			is_available: always
		}, { // [7]
			caption: 'Bombable Hut {bomb}',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() ? 'available' : 'unavailable';
			}
		}, { // [8]
			caption: 'C House',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() ? 'available' : 'unavailable';
			}
		}, { // [9]
			caption: 'Aginah\'s Cave {bomb}',
			is_opened: false,
			is_available: always
		}, { // [10]
			caption: 'Mire Shed (2)',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.flute && items.glove === 2 ? 'available' : 'unavailable';
			}
		}, { // [11]
			caption: 'Super Bunny Chests (2)',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 && (items.hookshot || items.mirror && items.hammer) ?
					items.lantern || items.flute ? 'available' : 'darkavailable' :
					'unavailable';
			}
		}, { // [12]
			caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
			is_opened: false,
			is_available: always
		}, { // [13]
			caption: 'Byrna Spike Cave',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove && items.hammer && (items.byrna || items.cape) ?
					items.lantern || items.flute ? 'available' : 'darkavailable' :
					'unavailable';
			}
		}, { // [14]
			caption: 'Kakariko Well (4 + {bomb})',
			is_opened: false,
			is_available: always
		}, { // [15]
			caption: 'Thieve\'s Hut (4 + {bomb})',
			is_opened: false,
			is_available: always
		}, { // [16]
			caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() || (items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
			}
		}, { // [17]
			caption: 'Paradox Cave (5 + 2 {bomb})',
			is_opened: false,
			is_available: function() {
				return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
					items.lantern || items.flute ? 'available' : 'darkavailable' :
					'unavailable';
			}
		}, { // [18]
			caption: 'West of Sanctuary {boots}',
			is_opened: false,
			is_available: function() {
				return items.boots ? 'available' : 'unavailable';
			}
		}, { // [19]
			caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
			is_opened: false,
			is_available: always
		}, { // [20]
			caption: 'Ice Rod Cave {bomb}',
			is_opened: false,
			is_available: always
		}, { // [21]
			caption: 'Hookshot Cave (bottom chest) {hookshot}/{boots}',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 && (items.hookshot || (items.mirror && items.hammer && items.boots)) ?
					items.lantern || items.flute ? 'available' : 'darkavailable' :
					'unavailable';
			}
		}, { // [22]
			caption: 'Hookshot Cave (3 top chests) {hookshot}',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 && items.hookshot ?
					items.lantern || items.flute ? 'available' : 'darkavailable' :
					'unavailable';
			}
		}, { // [23]
			caption: 'Treasure Chest Minigame: Pay 30 rupees',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() ? 'available' : 'unavailable';
			}
		}, { // [24]
			caption: 'Bottle Vendor: Pay 100 rupees',
			is_opened: false,
			is_available: always
		}, { // [25]
			caption: 'Sahasrahla {pendant0}',
			is_opened: false,
			is_available: function() {
				for (var k = 0; k < 10; k++) {
					if (prizes[k] === 1 && items['boss'+k])
						return 'available';
				}
				return 'unavailable';
			}
		}, { // [26]
			caption: 'Ol\' Stumpy',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
			}
		}, { // [27]
			caption: 'Lazy Drunk Kid: Distract him with {bottle} because he can\'t lay off the sauce!',
			is_opened: false,
			is_available: function() {
				return items.bottle ? 'available' : 'unavailable';
			}
		}, { // [28]
			caption: 'Gary\'s Lunchbox (save the frog first)',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
			}
		}, { // [29]
			caption: 'Fugitive under the bridge {flippers}',
			is_opened: false,
			is_available: function() {
				return items.flippers ? 'available' : 'unavailable';
			}
		}, { // [30]
			caption: 'Ether Tablet {sword2}{book}',
			is_opened: false,
			is_available: function() {
				return items.book && (items.glove || items.flute) && (items.mirror || items.hookshot && items.hammer) ?
					(items.sword >= 2 || is_swordless) ?
						items.lantern || items.flute ? 'available' : 'darkavailable' :
						'possible' :
					'unavailable';
			}
		}, { // [31]
			caption: 'Bombos Tablet {mirror}{sword2}{book}',
			is_opened: false,
			is_available: function() {
				return items.book && items.mirror && (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ?
					(items.sword >= 2 || is_swordless)? 'available' : 'possible' :
					'unavailable';
			}
		}, { // [32]
			caption: 'Catfish',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove && (items.agahnim || items.hammer || items.glove === 2 && items.flippers) ?
					'available' : 'unavailable';
			}
		}, { // [33]
			caption: 'King Zora: Pay 500 rupees',
			is_opened: false,
			is_available: function() {
				return items.flippers || items.glove ? 'available' : 'unavailable';
			}
		}, { // [34]
			caption: 'Lost Old Man {lantern}',
			is_opened: false,
			is_available: function() {
				return items.glove || items.flute ?
					items.lantern ? 'available' : 'darkavailable' :
					'unavailable';
			}
		}, { // [35]
			caption: 'Witch: Give her {mushroom}',
			is_opened: false,
			is_available: function() {
				return items.mushroom ? 'available' : 'unavailable';
			}
		}, { // [36]
			caption: 'Forest Hideout',
			is_opened: false,
			is_available: always
		}, { // [37]
			caption: 'Lumberjack Tree {agahnim}{boots}',
			is_opened: false,
			is_available: function() {
				return items.agahnim && items.boots ? 'available' : 'possible';
			}
		}, { // [38]
			caption: 'Spectacle Rock Cave',
			is_opened: false,
			is_available: function() {
				return items.glove || items.flute ?
					items.lantern || items.flute ? 'available' : 'darkavailable' :
					'unavailable';
			}
		}, { // [39]
			caption: 'South of Grove {mirror}',
			is_opened: false,
			is_available: function() {
				return items.mirror && (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
			}
		}, { // [40]
			caption: 'Graveyard Cliff Cave {mirror}',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() && items.mirror ? 'available' : 'unavailable';
			}
		}, { // [41]
			caption: 'Checkerboard Cave {mirror}',
			is_opened: false,
			is_available: function() {
				return items.flute && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
			}
		}, { // [42]
			caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 && items.hammer ? 'available' : 'unavailable';
			}
		}, { // [43]
			caption: 'Library {boots}',
			is_opened: false,
			is_available: function() {
				return items.boots ? 'available' : 'possible';
			}
		}, { // [44]
			caption: 'Mushroom',
			is_opened: false,
			is_available: always
		}, { // [45]
			caption: 'Spectacle Rock {mirror}',
			is_opened: false,
			is_available: function() {
				return items.glove || items.flute ?
					items.mirror ?
						items.lantern || items.flute ? 'available' : 'darkavailable' :
						'possible' :
					'unavailable';
			}
		}, { // [46]
			caption: 'Floating Island {mirror}',
			is_opened: false,
			is_available: function() {
				return (items.glove || items.flute) && (items.hookshot || items.hammer && items.mirror) ?
					items.mirror && items.moonpearl && items.glove === 2 ?
						items.lantern || items.flute ? 'available' : 'darkavailable' :
						'possible' :
					'unavailable';
			}
		}, { // [47]
			caption: 'Race Minigame {bomb}/{boots}',
			is_opened: false,
			is_available: always
		}, { // [48]
			caption: 'Desert West Ledge {book}/{mirror}',
			is_opened: false,
			is_available: function() {
				return items.book || items.flute && items.glove === 2 && items.mirror ? 'available' : 'possible';
			}
		}, { // [49]
			caption: 'Lake Hylia Island {mirror}',
			is_opened: false,
			is_available: function() {
				return items.flippers ?
					items.moonpearl && items.mirror && (items.agahnim || items.glove === 2 || items.glove && items.hammer) ?
						'available' : 'possible' :
					'unavailable';
			}
		}, { // [50]
			caption: 'Bumper Cave {cape}',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() ?
					items.glove && items.cape ? 'available' : 'possible' :
					'unavailable';
			}
		}, { // [51]
			caption: 'Pyramid',
			is_opened: false,
			is_available: function() {
				return items.agahnim || items.glove && items.hammer && items.moonpearl ||
					items.glove === 2 && items.moonpearl && items.flippers ? 'available' : 'unavailable';
			}
		}, { // [52]
			caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
			}
		}, { // [53]
			caption: 'Zora River Ledge {flippers}',
			is_opened: false,
			is_available: function() {
				if (items.flippers) return 'available';
				if (items.glove) return 'possible';
				return 'unavailable';
			}
		}, { // [54]
			caption: 'Buried Itam {shovel}',
			is_opened: false,
			is_available: function() {
				return items.shovel ? 'available' : 'unavailable';
			}
		}, { // [55]
			caption: 'Escape Sewer Side Room (3) {bomb}/{boots}' + (is_standard ? '' : ' (yellow = need small key)'),
			is_opened: false,
			is_available: function() {
				if (is_standard) return 'available';
				if (flags.dungeonitems === 'F') {
					if (items.glove) return 'available';
					if (items.smallkeyhalf0 === 1) return items.lantern ? 'available' : 'darkavailable';
					return 'unavailable';
				}
				
				return items.glove ? 'available' : items.lantern ? 'possible' : 'darkavailable';
			}
		}, { // [56]
			caption: "Castle Secret Entrance (Uncle + 1)",
			is_opened: is_standard,
			is_available: always
		}, { // [57]
			caption: 'Hyrule Castle Dungeon (3)',
			is_opened: is_standard,
			is_available: always
		}, { // [58]
			caption: 'Sanctuary',
			is_opened: is_standard,
			is_available: always
		}, { // [59]
			caption: 'Mad Batter {hammer}/{mirror} + {powder}',
			is_opened: false,
			is_available: function() {
				return items.powder && (items.hammer || items.glove === 2 && items.mirror && items.moonpearl) ? 'available' : 'unavailable';
			}
		}, { // [60]
			caption: 'Take the frog home {mirror} / Save+Quit',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
			}
		}, { // [61]
			caption: 'Fat Fairy: Buy OJ bomb from Dark Link\'s House after {crystal}5 {crystal}6 (2 items)',
			is_opened: false,
			is_available: function() {
				//crystal check
				var crystal_count = 0;
				for (var k = 0; k < 10; k++) {
					if (prizes[k] === 4 && items['boss'+k])
						crystal_count += 1;
				}

				if (!items.moonpearl || crystal_count < 2) return 'unavailable';
				return items.hammer && (items.agahnim || items.glove) ||
					items.agahnim && items.mirror && can_reach_outcast() ? 'available' : 'unavailable';
			}
		}, { // [62]
			caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
			is_opened: false,
			is_available: function() {
				var pendant_count = 0;
				for (var k = 0; k < 10; k++) {
					if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k]) {
						if (++pendant_count === 3) return 'available';
					}
				}
				return items.book ? 'possible' : 'unavailable';
			}
		}, { // [63]
			caption: 'Escape Sewer Dark Room {lantern}',
			is_opened: is_standard,
			is_available: function() {
				return is_standard || items.lantern ? 'available' : 'darkavailable';
			}
		}, { // [64]
			caption: 'Waterfall of Wishing (2) {flippers}',
			is_opened: false,
			is_available: function() {
				return items.flippers ? 'available' : 'unavailable';
			}
		}, { // [65]
			caption: 'Castle Tower',
			is_opened: false,
			is_available: function() {
				return items.sword >= 2 || (is_swordless && items.hammer) || items.cape ? 'available' : 'unavailable';
			}
		}, { // [66]
			caption: 'Castle Tower (small key)',
			is_opened: false,
			is_available: function() {
				if (is_retro) {
					return (items.sword >= 2 || (is_swordless && items.hammer) || items.cape) ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				} else {
					return (items.sword >= 2 || (is_swordless && items.hammer) || items.cape) && items.smallkeyhalf1 > 0 ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}
		}];


		
	}
	
	
	
	
	
	
	
	
	
}(window));
