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
	
	window.entrances = [{ // [0]
		caption: 'Link\'s House',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [1]
		caption: 'Bonk Fairy',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [2]
		caption: 'Dam',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [3]
		caption: 'Haunted Grove',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [4]
		caption: 'Magic Shop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [5]
		caption: 'Well of Wishing',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [6]
		caption: 'Fairy Spring',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [7]
		caption: 'Hyrule Castle - Main Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [8]
		caption: 'Hyrule Castle - Top Entrance (West)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [9]
		caption: 'Hyrule Castle - Top Entrance (East)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [10]
		caption: 'Hyrule Castle - Agahnim\'s Tower',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [11]
		caption: 'Hyrule Castle - Secret Entrance Stairs',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [12]
		caption: 'Hyrule Castle - Secret Entrance Drop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [13]
		caption: 'Sanctuary',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [14]
		caption: 'Bonk Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [15]
		caption: 'Grave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [16]
		caption: 'Graveyard Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [17]
		caption: 'King\'s Grave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [18]
		caption: 'North Fairy Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [19]
		caption: 'North Fairy Cave Drop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [20]
		caption: 'Gamble',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [21]
		caption: 'Thief\'s Hideout',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [22]
		caption: 'Hideout Stump',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [23]
		caption: 'Lumberjack Hut',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [24]
		caption: 'Lumberjack Tree Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [25]
		caption: 'Lumberjack Tree',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [26]
		caption: 'Ascension Cave (Entrance)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [27]
		caption: 'Fortune Teller',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [28]
		caption: 'Well Drop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [29]
		caption: 'Well Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [30]
		caption: 'Thief\'s Hut',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [31]
		caption: 'Elder\'s House (West)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [32]
		caption: 'Elder\'s House (East)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [33]
		caption: 'Snitch Lady (West)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [34]
		caption: 'Snitch Lady (East)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [35]
		caption: 'Chicken House',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [36]
		caption: 'Lazy Kid\'s House',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [37]
		caption: 'Bush Covered House',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [38]
		caption: 'Bomb Hut',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [39]
		caption: 'Shop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [40]
		caption: 'Tavern (Back)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [41]
		caption: 'Tavern (Front)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [42]
		caption: 'Swordsmiths',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [43]
		caption: 'Bat Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [43]
		caption: 'Bat Cave Drop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [44]
		caption: 'Library',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [45]
		caption: 'Two Brothers (West)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [46]
		caption: 'Two Brothers (East)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [47]
		caption: 'Chest Game',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [48]
		caption: 'Eastern Palace',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [49]
		caption: 'Sahasrahla\'s Hut',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [50]
		caption: 'Fairy Spring',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [51]
		caption: 'Fairy Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [52]
		caption: 'Desert Palace - Main Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [53]
		caption: 'Desert Palace - West Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [54]
		caption: 'Desert Palace - East Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [55]
		caption: 'Desert Palace - North Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [56]
		caption: 'Checkerboard Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [57]
		caption: 'Aginah\'s Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [58]
		caption: 'Desert Fairy',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [59]
		caption: '50 Rupee Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [60]
		caption: 'Shop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [61]
		caption: 'Fortune Teller',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [62]
		caption: 'Mini Moldorm Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [63]
		caption: 'Pond of Happiness',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [64]
		caption: 'Ice Rod Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [65]
		caption: 'Good Bee Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [66]
		caption: '20 Rupee Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [67]
		caption: 'Tower of Hera',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [68]
		caption: 'Spectacle Rock Cave (Top)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [69]
		caption: 'Spectacle Rock Cave Peak',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [70]
		caption: 'Spectacle Rock Cave (Bottom)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [71]
		caption: 'Ascension Cave (Exit)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [72]
		caption: 'Return Cave (Entrance)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [73]
		caption: 'Return Cave (Exit)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [74]
		caption: 'Old Man Cave (West)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [75]
		caption: 'Old Man Cave (East)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [76]
		caption: 'Paradox Cave (Top)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [77]
		caption: 'Paradox Cave (Middle)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [78]
		caption: 'Paradox Cave (Bottom)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [79]
		caption: 'Spiral Cave (Entrance)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [80]
		caption: 'Spiral Cave (Bottom)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [81]
		caption: 'Hookshot Fairy Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [82]
		caption: 'Fairy Ascension Cave (Exit)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [83]
		caption: 'Fairy Ascension Cave (Entrance)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [84]
		caption: 'Mimic Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [85]
		caption: 'Bomb Shop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [86]
		caption: 'Bonk Fairy',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [87]
		caption: 'Hype Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [88]
		caption: 'Swamp Palace',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [89]
		caption: 'Dark Sanctuary',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [90]
		caption: 'Forest Shop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [91]
		caption: 'North East Shop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [92]
		caption: 'Pyramid Hole',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [93]
		caption: 'Fat Fairy',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [94]
		caption: 'Pyramid Exit',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [95]
		caption: 'Skull Woods - Back Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [96]
		caption: 'Skull Woods - West Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [97]
		caption: 'Skull Woods - North Drop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [98]
		caption: 'Skull Woods - Central Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [99]
		caption: 'Skull Woods - South Drop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [100]
		caption: 'Skull Woods - NE Drop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [101]
		caption: 'Skull Woods - East Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [102]
		caption: 'Skull Woods - SE Drop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [103]
		caption: 'Lumberjack Shop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [104]
		caption: 'Bumper Cave (Bottom)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [105]
		caption: 'Fortune Teller',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [106]
		caption: 'Chest Game',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [107]
		caption: 'Thieves\' Town',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [108]
		caption: 'C-Shaped House',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [109]
		caption: 'Shop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [110]
		caption: 'Bombable Hut',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [111]
		caption: 'Hammer Peg Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [112]
		caption: 'Arrow Game',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [113]
		caption: 'Palace of Darkness',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [114]
		caption: 'Hint (North)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [115]
		caption: 'Fairy Spring',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [116]
		caption: 'Hint (South)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [117]
		caption: 'Ice Palace',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [118]
		caption: 'Shop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [119]
		caption: 'Ledge Fairy',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [120]
		caption: 'Ledge Hint',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [121]
		caption: 'Ledge Spike Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [122]
		caption: 'Misery Mire',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [123]
		caption: 'Shed',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [124]
		caption: 'Fairy',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [125]
		caption: 'Hint',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [126]
		caption: 'Ganon\'s Tower',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [127]
		caption: 'Spike Cave',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [128]
		caption: 'Bumper Cave (Top)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [129]
		caption: 'Fairy Spring',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [130]
		caption: 'Hookshot Cave (Exit)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [131]
		caption: 'Hookshot Cave (Entrance)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [132]
		caption: 'Superbunny Cave (Top)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [133]
		caption: 'Superbunny Cave (Bottom)',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [134]
		caption: 'Shop',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [135]
		caption: 'Turtle Rock - Main Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [136]
		caption: 'Turtle Rock - Back Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [137]
		caption: 'Turtle Rock Ledge - West Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}, { // [138]
		caption: 'Turtle Rock Ledge - East Entrance',
		is_opened: false,
		note: '',
		known_location: '',
		type: 0,
		connected_to: -1,
		connector_id: -1,
		is_available: function() {
			//Logic
			return 'available';
		}
	}];


	
	//Is Inverted Mode
	if (flags.gametype === "I")
	{
		window.dungeons = [{ // [0]
			caption: 'Eastern Palace',
			is_beaten: false,
			is_beatable: function() {
				if (!canReachLightWorld()) return 'unavailable';
				return window.EPBoss();
			},
			can_get_chest: function() {
				if (!canReachLightWorld()) return 'unavailable';
				return window.EPChests();
			}
		}, { // [1]
			caption: 'Desert Palace {book}',
			is_beaten: false,
			is_beatable: function() {
				if (!canReachLightWorldBunny() || !items.book) return 'unavailable';
				return window.DPBoss();
			},
			can_get_chest: function() {
				if (!items.book || !canReachLightWorldBunny()) return 'unavailable';
				return window.DPChests();
			}
		}, { // [2]
			caption: 'Tower of Hera {hammer} [{hookshot}/{glove2}]',
			is_beaten: false,
			is_beatable: function() {
				if(!(items.glove || activeFlute()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2)) return 'unavailable';
				return window.HeraBoss();
			},
			can_get_chest: function() {
				if(!(items.glove || activeFlute()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2)) return 'unavailable';
				return window.HeraChests();
			}
		}, { // [3]
			caption: 'Palace of Darkness',
			is_beaten: false,
			is_beatable: function() {
				if(!canReachPyramid()) return 'unavailable';
				return window.PoDBoss();
			},
			can_get_chest: function() {
				if (!canReachPyramid()) return 'unavailable';
				return window.PoDChests();
			}
		}, { // [4]
			caption: 'Swamp Palace {mirror} {flippers}',
			is_beaten: false,
			is_beatable: function() {
				if (!items.moonpearl || !canReachLightWorldBunny() || !items.mirror || !items.flippers) return 'unavailable';
				return window.SPBoss();
			},
			can_get_chest: function() {
				if (!items.moonpearl || !canReachLightWorldBunny() || !items.mirror || !items.flippers) return 'unavailable';
				return window.SPChests();
			}
		}, { // [5]
			caption: 'Skull Woods',
			is_beaten: false,
			is_beatable: function() {
				return window.SWBoss();
			},
			can_get_chest: function() {
				return window.SWChests();
			}
		}, { // [6]
			caption: 'Thieves\' Town',
			is_beaten: false,
			is_beatable: function() {
				return window.TTBoss();
			},
			can_get_chest: function() {
				return window.TTChests();
			}
		}, { // [7]
			caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
			is_beaten: false,
			is_beatable: function() {
				if (!items.flippers || (!items.firerod && !items.bombos) || (!items.firerod && items.bombos && (items.sword == 0 && !is_swordless))) return 'unavailable';
				return window.IPBoss();
			},
			can_get_chest: function() {
				if (!items.flippers || (!items.firerod && !items.bombos) || (!items.firerod && items.bombos && (items.sword == 0 && !is_swordless))) return 'unavailable';
				return window.IPChests();
			}
		}, { // [8]
			caption: 'Misery Mire {medallion0} [{boots}/{hookshot}',
			is_beaten: false,
			is_beatable: function() {
				if (!(activeFlute() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';
				if (!items.bigkey8) return 'unavailable';
				var state = medallion_check(0);
				if (state) return state;
				return window.MMBoss();
			},
			can_get_chest: function() {
				if (!(activeFlute() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';
				var state = medallion_check(0);
				if (state) return state;
				return window.MMChests();
			}
		}, { // [9]
			caption: 'Turtle Rock {medallion0}/{mirror}',
			is_beaten: false,
			is_beatable: function() {
				if (!(items.glove || activeFlute()) || !items.somaria) return 'unavailable';
				//First, check for back door access through mirror, it has logic priority
				if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2))) {
					return window.TRBackBoss();
				//If not, go through normal front door access
				} else {
					if (!items.bigkey9) return 'unavailable';
					var state = medallion_check(1);
					if (state) return state;
					return window.TRFrontBoss();
				}
			},
			can_get_chest: function() {
				if (!(items.glove || activeFlute())) return 'unavailable';
				//First, check for back door access through mirror, it has logic priority
				if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2))) {
					return window.TRBackChests();
				//If not, go through normal front door access
				} else {
					if (!items.somaria) return 'unavailable';
					var state = medallion_check(1);
					if (state) return state;
					return window.TRFrontChests();
				}
			}
		}, { // [10]
			caption: 'Ganon\'s Castle (Crystals)',
			is_beaten: false,
			is_beatable: function() {
				if (crystal_check() < flags.ganonvulncount || !canReachLightWorld()) return 'unavailable';
				if (flags.goals === 'F' && (items.sword > 1 || is_swordless && items.hammer) && (items.lantern || items.firerod)) return 'available';
				return window.GTBoss();			
			},
			can_get_chest: function() {
				if (crystal_check() < flags.opentowercount) return 'unavailable';
				return window.GTChests();
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
			caption: 'Light World Swamp',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
			}
		}, { // [2] [1]
			caption: 'Stoops Lonk\'s Hoose',
			is_opened: false,
			is_available: always
		}, { // [24] [2]
			caption: 'Bottle Vendor: Pay 100 rupees',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? 'available' : 'unavailable';
			}
		}, { // [26] [3]
			caption: 'Ol\' Stumpy',
			is_opened: false,
			is_available: always
		}, { // [28] [4]
			caption: 'Gary\'s Lunchbox (save the frog first)',
			is_opened: false,
			is_available: function() {
				return (items.mirror || items.glove === 2) && canReachLightWorldBunny() ? 'available' : 'unavailable';
			}
		}, { // [29] [5]
			caption: 'Fugitive under the bridge {flippers}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? (items.flippers ? 'available' : 'unavailable') : 'unavailable';
			}
		}, { // [30] [6]
			caption: 'Ether Tablet {sword2}{book}',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.hammer && items.book && (activeFlute() || items.glove) && (items.hookshot || items.glove === 2) ?
					(items.sword >= 2 || (is_swordless && items.hammer) ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'information') :
					'unavailable';
			}
		}, { // [31] [7]
			caption: 'Bombos Tablet {sword2}{book}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() && items.book ?
					(items.sword >= 2 || (is_swordless && items.hammer)) ? 'available' : 'information' :
					'unavailable';
			}
		}, { // [32] [8]
			caption: 'Catfish',
			is_opened: false,
			is_available: function() {
				if(!items.glove)
					return 'unavailable';
				if(canReachPyramid())
					return 'available';
				return 'unavailable';
			}
		}, { // [33] [9]
			caption: 'King Zora: Pay 500 rupees',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? (items.flippers || items.glove ? 'available' : 'unavailable') : 'unavailable';
			}
		}, { // [34] [10]
			caption: 'Lost Old Man {lantern}',
			is_opened: false,
			is_available: function() {
				return items.glove || activeFlute() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
			}
		}, { // [44] [11]
			caption: 'Mushroom',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [45] [12]
			caption: 'Spectacle Rock',
			is_opened: false,
			is_available: function() {
				if(!(items.glove || activeFlute()))
					return 'unavailable';
				return items.moonpearl && items.hammer && (items.hookshot || items.glove === 2) ?
					(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
					'information';
			}
		}, { // [46] [13]
			caption: 'Floating Island',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
					(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
					'unavailable';
			}
		}, { // [47] [14]
			caption: 'Race Minigame {bomb}/{boots}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [48] [15]
			caption: 'Desert West Ledge {book}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.book ? (items.moonpearl ? 'available' : 'information') : 'information') : 'unavailable';
			}
		}, { // [49] [16]
			caption: 'Lake Hylia Island {flippers}',
			is_opened: false,
			is_available: function() {
				if(!canReachLightWorldBunny())
					return 'unavailable';
				return items.moonpearl ? (items.flippers ? 'available' : 'information') : 'information';
			}
		}, { // [50] [17]
			caption: 'Bumper Cave {cape}{mirror}',
			is_opened: false,
			is_available: function() {
				return items.glove && items.cape && items.mirror && canReachLightWorld() ? 'available' : 'information';
			}
		}, { // [51] [18]
			caption: 'Pyramid',
			is_opened: false,
			is_available: function() {
				if(canReachPyramid())
					return 'available';
				return 'unavailable';
			}
		}, { // [52] [19]
			caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
			is_opened: false,
			is_available: always
		}, { // [53] [20]
			caption: 'Zora River Ledge {flippers}',
			is_opened: false,
			is_available: function() {
				if(!canReachLightWorld())
					return 'unavailable';
				if(items.flippers)
					return 'available';
				return 'information';
			}
		}, { // [54] [21]
			caption: 'Buried Item {shovel}',
			is_opened: false,
			is_available: function() {
				return items.shovel && canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [62] [22]
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
				return items.book ? 'information' : 'unavailable';
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
				return window.EPBoss();
			},
			can_get_chest: function() {
				return window.EPChests();
				
			}
		}, { // [1]
			caption: 'Desert Palace {book} / {glove2} {mirror} {flute}',
			is_beaten: false,
			is_beatable: function() {
				if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
				return window.DPBoss();
			},
			can_get_chest: function() {
				if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
				return window.DPChests();
			}
		}, { // [2]
			caption: 'Tower of Hera {mirror} / {hookshot} {hammer}',
			is_beaten: false,
			is_beatable: function() {
				if (!items.flute && !items.glove) return 'unavailable';
				if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
				return window.HeraBoss();
			},
			can_get_chest: function() {
				if (!items.flute && !items.glove) return 'unavailable';
				if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
				return window.HeraChests();
			}
		}, { // [3]
			caption: 'Palace of Darkness',
			is_beaten: false,
			is_beatable: function() {
				if (!canReachDarkWorld()) return 'unavailable';
				if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
				return window.PoDBoss();
			},
			can_get_chest: function() {
				if (!canReachDarkWorld()) return 'unavailable';
				if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
				return window.PoDChests();
			}
		}, { // [4]
			caption: 'Swamp Palace {mirror} {flippers}',
			is_beaten: false,
			is_beatable: function() {
				if (!canReachDarkWorld() || !items.mirror || !items.flippers) return 'unavailable';
				if (!items.glove && !items.agahnim) return 'unavailable';
				return window.SPBoss();
			},
			can_get_chest: function() {
				if (!canReachDarkWorld() || !items.mirror || !items.flippers) return 'unavailable';
				if (!items.glove && !items.agahnim) return 'unavailable';
				return window.SPChests();
			}
		}, { // [5]
			caption: 'Skull Woods',
			is_beaten: false,
			is_beatable: function() {
				if (!can_reach_outcast() || !canReachDarkWorld()) return 'unavailable';
				return window.SWBoss();
			},
			can_get_chest: function() {
				if (!can_reach_outcast() || !canReachDarkWorld()) return 'unavailable';
				return window.SWChests();
			}
		}, { // [6]
			caption: 'Thieves\' Town',
			is_beaten: false,
			is_beatable: function() {
				if (!can_reach_outcast() || !canReachDarkWorld()) return 'unavailable';
				return window.TTBoss();
			},
			can_get_chest: function() {
				if (!can_reach_outcast() || !canReachDarkWorld()) return 'unavailable';
				return window.TTChests();
			}
		}, { // [7]
			caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
			is_beaten: false,
			is_beatable: function() {
				if (!items.moonpearl || !items.flippers || items.glove !== 2 || !canReachDarkWorld()) return 'unavailable';
				if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && !is_swordless))) return 'unavailable';
				return window.IPBoss();
			},
			can_get_chest: function() {
				if (!items.moonpearl || !items.flippers || items.glove !== 2 || !canReachDarkWorld()) return 'unavailable';
				if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && !is_swordless))) return 'unavailable';
				return window.IPChests();
			}
		}, { // [8]
			caption: 'Misery Mire {medallion0} [{boots}/{hookshot}]',
			is_beaten: false,
			is_beatable: function() {
				if (!items.moonpearl || !items.flute || items.glove !== 2 || !canReachDarkWorld()) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';
				if (!items.bigkey8) return 'unavailable';
				var state = medallion_check(0);
				if (state) return state;
				return window.MMBoss();
			},
			can_get_chest: function() {
				if (!items.moonpearl || !items.flute || items.glove !== 2 || !canReachDarkWorld()) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';
				var state = medallion_check(0);
				if (state) return state;
				return window.MMChests();
			}
		}, { // [9]
			caption: 'Turtle Rock {medallion0} {hammer} {somaria}',
			is_beaten: false,
			is_beatable: function() {
				if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !canReachDarkWorld()) return 'unavailable';
				if (!items.hookshot && !items.mirror) return 'unavailable';
				if (!items.bigkey9) return 'unavailable';
				var state = medallion_check(1);
				if (state) return state;
				return window.TRFrontBoss();
			},
			can_get_chest: function() {
				if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !canReachDarkWorld()) return 'unavailable';
				if (!items.hookshot && !items.mirror) return 'unavailable';
				if (!items.somaria) return 'unavailable';
				var state = medallion_check(1);
				if (state) return state;				
				return window.TRFrontChests();
			}
		}, { // [10]
			caption: 'Ganon\'s Castle (Crystals)',
			is_beaten: false,
			is_beatable: function() {
				if (crystal_check() < flags.ganonvulncount || !canReachDarkWorld()) return 'unavailable';
				//Fast Ganon
				if (flags.goals === 'F' && (items.sword > 1 || is_swordless && (items.hammer || items.net)) && (items.lantern || items.firerod)) return 'available';
				return window.GTBoss();
			},
			can_get_chest: function() {
				if (crystal_check() < flags.opentowercount || items.glove < 2 || !items.hammer || !canReachDarkWorld()) return 'unavailable';
				return window.GTChests();
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
		window.chests = [{ // [1]
			caption: 'Light World Swamp (2)',
			is_opened: false,
			is_available: always
		}, { // [2]
			caption: 'Stoops Lonk\'s Hoose',
			is_opened: (is_standard),
			is_available: always
		}, { // [24]
			caption: 'Bottle Vendor: Pay 100 rupees',
			is_opened: false,
			is_available: always
		}, { // [26]
			caption: 'Ol\' Stumpy',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
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
						'information' :
					'unavailable';
			}
		}, { // [31]
			caption: 'Bombos Tablet {mirror}{sword2}{book}',
			is_opened: false,
			is_available: function() {
				return items.book && items.mirror && (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ?
					(items.sword >= 2 || is_swordless)? 'available' : 'information' :
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
						'information' :
					'unavailable';
			}
		}, { // [46]
			caption: 'Floating Island {mirror}',
			is_opened: false,
			is_available: function() {
				return (items.glove || items.flute) && (items.hookshot || items.hammer && items.mirror) ?
					items.mirror && items.moonpearl && items.glove === 2 ?
						items.lantern || items.flute ? 'available' : 'darkavailable' :
						'information' :
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
				return items.book || items.flute && items.glove === 2 && items.mirror ? 'available' : 'information';
			}
		}, { // [49]
			caption: 'Lake Hylia Island {mirror}',
			is_opened: false,
			is_available: function() {
				return items.flippers ?
					items.moonpearl && items.mirror && (items.agahnim || items.glove === 2 || items.glove && items.hammer) ?
						'available' : 'possible' :
					'information';
			}
		}, { // [50]
			caption: 'Bumper Cave {cape}',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() ?
					items.glove && items.cape ? 'available' : 'information' :
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
				if (items.glove) return 'information';
				return 'unavailable';
			}
		}, { // [54]
			caption: 'Buried Itam {shovel}',
			is_opened: false,
			is_available: function() {
				return items.shovel ? 'available' : 'unavailable';
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
				return items.book ? 'information' : 'unavailable';
			}
		}];
	}	
}(window));
