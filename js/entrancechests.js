(function(window) {
    'use strict';

    function medallionCheck(i) {
        if ((items.sword === 0 && flags.swordmode != 'S') || !items.bombos && !items.ether && !items.quake) return 'unavailable';
        if (medallions[i] === 1 && !items.bombos ||
            medallions[i] === 2 && !items.ether ||
            medallions[i] === 3 && !items.quake) return 'unavailable';
		if (items.bombos && items.ether && items.quake) return 'available';
        if (medallions[i] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';
		return 'available';
    }
	
	function crystalCheck() {
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
    function canHitSwitch() { return items.bomb || melee_bow() || cane() || rod() || items.boomerang || items.hookshot; }
    function agatowerweapon() { return items.sword > 0 || items.somaria || items.bow > 0 || items.hammer || items.firerod; }

    function always() { return 'available'; }
		
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
		return items.agahnim || canReachLightWorld() || (items.glove === 2 && activeFluteInvertedEntrance());
	}

	function canReachPyramid()
	{
		return (canReachDarkWorld() && (items.flippers || canReachPyramidWithoutFlippers()));
	}

	function canReachPyramidWithoutFlippers()
	{
		return items.hammer || activeFluteInvertedEntrance() || (items.mirror && canReachLightWorldBunny());
	}

	function activeFlute()
	{
		return items.flute && canReachLightWorld();
	}
	
	function activeFluteInvertedEntrance()
	{
		return items.flute && (canReachInvertedLightWorld() || flags.activatedflute);
	}
	
	function hasFoundDungeon(x)
	{
		var dungeonname = '';
		
		switch (x) {
			case 0:
				dungeonname = 'ep'
				break;
			case 1:
				dungeonname = 'dp'
				break;
			case 2:
				dungeonname = 'toh'
				break;
			case 3:
				dungeonname = 'pod'
				break;
			case 4:
				dungeonname = 'sp'
				break;
			case 5:
				dungeonname = 'sw'
				break;
			case 6:
				dungeonname = 'tt'
				break;
			case 7:
				dungeonname = 'ip'
				break;
			case 8:
				dungeonname = 'mm'
				break;
			case 9:
				dungeonname = 'tr'
				break;
			case 10:
				dungeonname = 'gt'
				break;
		}	
		
		for (var i = 0; i < entrances.length; i++) {
			if (entrances[i].known_location === dungeonname) {
				return true;
			}
		}

		return false;
	}
	
	function hasFoundLocation(x) {
		for (var i = 0; i < entrances.length; i++) {
			if (entrances[i].known_location === x) {
				return true;
			}
		}
		return false;
	}
	
	function hasFoundEntrance(x) {
		return (entrances[x].is_connector || entrances[x].known_location != '') ? true : false;
	}
	
	//Region Connectors
	//Light World
	function canReachWDMNorth()
	{
		if (hasFoundEntrance(68) || (hasFoundEntrance(77) && items.hammer) || 
		(items.mirror && (hasFoundEntrance(69) || hasFoundEntrance(70) || hasFoundEntrance(71) || hasFoundEntrance(72) || hasFoundEntrance(73) || hasFoundEntrance(75) || hasFoundEntrance(76) || hasFoundEntrance(127) || hasFoundEntrance(131) || hasFoundEntrance(132) || hasFoundEntrance(133) || hasFoundEntrance(136))) || (items.flute && items.mirror)
		) return true;
		if (items.mirror && items.hookshot && (hasFoundEntrance(77) || hasFoundEntrance(78) || hasFoundEntrance(79) || hasFoundEntrance(80) || hasFoundEntrance(81) || hasFoundEntrance(82) || hasFoundEntrance(83) || hasFoundEntrance(84))) return true;
		
		return false;
	}

	function canReachWDM()
	{
		if (canReachWDMNorth() || (items.mirror && canReachDWWDM()) || items.flute || (items.hookshot && (hasFoundEntrance(77) || hasFoundEntrance(78) || hasFoundEntrance(79) || hasFoundEntrance(80) || hasFoundEntrance(81) || hasFoundEntrance(82) || hasFoundEntrance(83) || hasFoundEntrance(84) || (hasFoundEntrance(137) || hasFoundEntrance(138) || hasFoundEntrance(139)) && items.mirror)) || hasFoundEntrance(69) || hasFoundEntrance(70) || hasFoundEntrance(71) || hasFoundEntrance(72) || hasFoundEntrance(73) || hasFoundEntrance(75) || hasFoundEntrance(76)) return true;
		return false;
	}
	
	function canReachEDMNorth()
	{
		if ((canReachWDMNorth() && items.hammer) || hasFoundEntrance(77) || (hasFoundEntrance(68) && items.hammer) || (items.mirror && (hasFoundEntrance(127) || hasFoundEntrance(131) || hasFoundEntrance(132) || hasFoundEntrance(133) || hasFoundEntrance(136))) || (items.flute && items.mirror && items.hammer)) return true;
		return false;
	}

	function canReachEDM()
	{
		if (canReachEDMNorth() || (items.flute && items.hookshot) || (items.hookshot && canReachWDM()) || (items.hammer && canReachWDMNorth()) || ((hasFoundEntrance(134) || hasFoundEntrance(135) || hasFoundEntrance(137) || hasFoundEntrance(138) || hasFoundEntrance(139)) && items.mirror) || hasFoundEntrance(78) || hasFoundEntrance(79) || hasFoundEntrance(80) || hasFoundEntrance(81) || hasFoundEntrance(82) || hasFoundEntrance(83) || hasFoundEntrance(84)) return true;
		return false;
	}
	
	function canReachHCNorth()
	{
		if (hasFoundEntrance(8) ||  hasFoundEntrance(9) || hasFoundEntrance(10) || ((items.agahnim || items.glove && items.hammer && items.moonpearl || items.glove === 2 && items.moonpearl && items.flippers) && items.mirror) || (canReachDarkWorldEast() && items.mirror)) return true;
		return false;
	}
	
	//Dark World
	function canReachOutcast() {
		if (items.moonpearl && (items.glove === 2 || items.glove && items.hammer || items.agahnim && items.hookshot && (items.hammer || items.glove || items.flippers))) return true;
		if (hasFoundEntrance(90) || hasFoundEntrance(91) || (flags.doorshuffle === 'N' && hasFoundEntrance(96)) || hasFoundEntrance(99) || hasFoundEntrance(102) || hasFoundEntrance(104) || hasFoundEntrance(105) || hasFoundEntrance(106) || hasFoundEntrance(107) || hasFoundEntrance(108) || hasFoundEntrance(109) || (hasFoundEntrance(110) && items.moonpearl && items.hammer) || hasFoundEntrance(111) || (hasFoundEntrance(112) && items.moonpearl && items.glove === 2) || hasFoundEntrance(129)) return true;
		if ((hasFoundEntrance(86) || hasFoundEntrance(87) || hasFoundEntrance(88) || hasFoundEntrance(89) || hasFoundEntrance(113) || hasFoundEntrance(119)) && items.moonpearl && (items.glove === 2 || (items.flippers && items.hookshot) || (items.glove > 0 && items.hammer && items.hookshot))) return true;
		if (canReachDarkWorldEast() && items.moonpearl && ((items.flippers || items.hammer || items.glove > 0) && items.hookshot)) return true;
		if (hasFoundEntrance(92) && items.moonpearl && items.hookshot) return true;
		return false;
	}
	
	function canReachDarkWorldSouth() {
		if (canReachOutcast()) return true;
		if (hasFoundEntrance(86) || hasFoundEntrance(87) || hasFoundEntrance(88) || hasFoundEntrance(89) || hasFoundEntrance(113) || hasFoundEntrance(119)) return true;
		if (canReachDarkWorldEast() && items.moonpearl && items.hammer) return true;
		return false;
	}
	
	function canReachDarkWorldEast() {
		if (canReachDarkWorld() && (items.hammer || items.flippers)) return true;
		if (items.agahnim || hasFoundEntrance(94) || hasFoundEntrance(95) || hasFoundEntrance(114) || hasFoundEntrance(115) || hasFoundEntrance(116) || hasFoundEntrance(117) || ((hasFoundEntrance(86) || hasFoundEntrance(87) || hasFoundEntrance(88) || hasFoundEntrance(89) || hasFoundEntrance(113) || hasFoundEntrance(119)) && (items.hammer || items.flippers) && items.moonpearl) || (hasFoundEntrance(92) && items.moonpearl && (items.glove > 0 || items.hammer))) return true;
		if ((hasFoundEntrance(90) || hasFoundEntrance(91) || (flags.doorshuffle === 'N' && hasFoundEntrance(96)) || hasFoundEntrance(99) || hasFoundEntrance(102) || hasFoundEntrance(104) || hasFoundEntrance(105) || hasFoundEntrance(106) || hasFoundEntrance(107) || hasFoundEntrance(108) || hasFoundEntrance(109) || (hasFoundEntrance(110) && items.hammer) || hasFoundEntrance(111) || hasFoundEntrance(129)) && items.moonpearl && (items.flippers || items.hammer)) return true;
		if (canReachAndLeaveShoppingMall()) return true;
		return false;
	}
	
	function canReachDarkWorldSouthEast() {
		if (hasFoundEntrance(120) || hasFoundEntrance(121) || hasFoundEntrance(122) || ((canReachDarkWorld() || canReachDarkWorldEast() || canReachDarkWorldSouth()) && items.flippers && items.moonpearl)) return true;
	}
	
	function canReachMiseryMire() {
		if (hasFoundEntrance(123) || hasFoundEntrance(124) || hasFoundEntrance(125) || hasFoundEntrance(126) || (items.flute && items.glove === 2)) return true;
	}	
	
	function canReachDWDMNorth()
	{
		if (hasFoundEntrance(127) || hasFoundEntrance(131) || hasFoundEntrance(132) || hasFoundEntrance(133) || hasFoundEntrance(136) || (canReachEDMNorth() && items.hammer && items.glove === 2)) return true;
		return false;
	}

	function canReachDWWDM()
	{
		if (canReachDWDMNorth() || hasFoundEntrance(128) || hasFoundEntrance(130)) return true;
		return false;
	}
	
	function canReachDWEDM()
	{
		if (canReachDWDMNorth() || hasFoundEntrance(134) || hasFoundEntrance(135) || (canReachEDM() && items.glove === 2 && items.moonpearl)) return true;
		return false;
	}
	
	function canReachAndLeaveShoppingMall()
	{
		if ((hasFoundEntrance(120) || hasFoundEntrance(121) || hasFoundEntrance(122)) && items.moonpearl && items.flippers) return true;
		return false;
	}
	
	//Inverted
	function canReachInvertedLightWorld() // for inverted, can walk around in Light World as Link
	{
		return items.moonpearl && (canReachInvertedLightWorldBunny() || hasFoundEntrance(4) || (hasFoundEntrance(5) && items.flippers) || hasFoundEntrance(11) || hasFoundEntrance(16) || (hasFoundEntrance(17) && items.glove === 2) || hasFoundEntrance(37) || hasFoundEntrance(38) || (hasFoundEntrance(56) && items.glove) || (hasFoundEntrance(64) && items.flippers));
	}
	
	function canReachInvertedLightWorldBunny() // for inverted, can walk around in Light World as bunny or Link
	{
		// LW entrances that are bunny accessible, plus aga and flute 6 portal
		if (items.agahnim /* || (items.glove === 2 && activeFlute()) */ || hasFoundEntrance(0) || hasFoundEntrance(1) || hasFoundEntrance(2) || hasFoundEntrance(3) || hasFoundEntrance(6) || hasFoundEntrance(7) || hasFoundEntrance(8) || hasFoundEntrance(9) || hasFoundEntrance(10) || hasFoundEntrance(13) || hasFoundEntrance(14) || hasFoundEntrance(18) || hasFoundEntrance(20) || hasFoundEntrance(22) || hasFoundEntrance(23) || hasFoundEntrance(24) || hasFoundEntrance(26) || hasFoundEntrance(27) || hasFoundEntrance(29) || hasFoundEntrance(30) || hasFoundEntrance(31) || hasFoundEntrance(32) || hasFoundEntrance(33) || hasFoundEntrance(34) || hasFoundEntrance(35) || hasFoundEntrance(36) || hasFoundEntrance(39) || hasFoundEntrance(41) || hasFoundEntrance(42) || hasFoundEntrance(43) || hasFoundEntrance(45) || hasFoundEntrance(46) || hasFoundEntrance(47) || hasFoundEntrance(48) || hasFoundEntrance(49) || hasFoundEntrance(50) || hasFoundEntrance(51) || hasFoundEntrance(52) || hasFoundEntrance(54) || hasFoundEntrance(55) || hasFoundEntrance(57) || hasFoundEntrance(58) || hasFoundEntrance(59) || hasFoundEntrance(60) || hasFoundEntrance(61) || hasFoundEntrance(62) || hasFoundEntrance(63) || hasFoundEntrance(65) || hasFoundEntrance(66) || hasFoundEntrance(67) || hasFoundEntrance(74) || hasFoundEntrance(95)) return true;
		// LW entrances that are accessible with moon pearl
		if (items.moonpearl && (hasFoundEntrance(4) || (hasFoundEntrance(5) && items.flippers) || hasFoundEntrance(11) || hasFoundEntrance(16) || (hasFoundEntrance(17) && items.glove === 2) || hasFoundEntrance(37) || hasFoundEntrance(38) || (hasFoundEntrance(56) && items.glove) || (hasFoundEntrance(64) && items.flippers))) return true;
		// DW entrances accessible with moon pearl + mitts
		if (items.moonpearl && items.glove === 2 && (hasFoundEntrance(86) || hasFoundEntrance(87) || hasFoundEntrance(88) || hasFoundEntrance(89) || hasFoundEntrance(90) || hasFoundEntrance(91) || hasFoundEntrance(99) || hasFoundEntrance(102) || hasFoundEntrance(104) || hasFoundEntrance(105) || hasFoundEntrance(106) || hasFoundEntrance(107) || hasFoundEntrance(108) || hasFoundEntrance(109) || hasFoundEntrance(111) || hasFoundEntrance(112) || hasFoundEntrance(113) || hasFoundEntrance(119) || hasFoundEntrance(129))) return true;
		// DW entrances accessible with moon pearl + gloves + hammer
		if (items.moonpearl && items.glove && items.hammer && (hasFoundEntrance(86) || hasFoundEntrance(87) || hasFoundEntrance(88) || hasFoundEntrance(89) || hasFoundEntrance(90) || hasFoundEntrance(91) || hasFoundEntrance(92) || hasFoundEntrance(94) || hasFoundEntrance(99) || hasFoundEntrance(102) || hasFoundEntrance(104) || hasFoundEntrance(105) || hasFoundEntrance(106) || hasFoundEntrance(107) || hasFoundEntrance(108) || hasFoundEntrance(109) || hasFoundEntrance(110) || hasFoundEntrance(111) || hasFoundEntrance(113) || hasFoundEntrance(114) || hasFoundEntrance(115) || hasFoundEntrance(116) || hasFoundEntrance(117) || hasFoundEntrance(119) || hasFoundEntrance(129))) return true;
		// DW entrances accessible with moon pearl + mitts + hookshot (east DW)
		if (items.moonpearl && items.glove === 2 && items.hookshot && (hasFoundEntrance(92) || hasFoundEntrance(94) || hasFoundEntrance(114) || hasFoundEntrance(115) || hasFoundEntrance(116) || hasFoundEntrance(117))) return true;
		// DW entrances accessible with moon pearl + mitts or glove/hammer + flippers (southeast DW, IP/PoD portals)
		if (items.moonpearl && (items.glove === 2 || (items.glove && items.hammer)) && items.flippers && (hasFoundEntrance(118) || hasFoundEntrance(120) || hasFoundEntrance(121) || hasFoundEntrance(122))) return true;
		return false;
	}
	
	function canReachInvertedNorthDW()
	{
		// basic north DW locations
		if (hasFoundEntrance(90) || hasFoundEntrance(91) || hasFoundEntrance(99) || hasFoundEntrance(102) || hasFoundEntrance(104) || hasFoundEntrance(105) || hasFoundEntrance(106) || hasFoundEntrance(107) || hasFoundEntrance(108) || hasFoundEntrance(109) || hasFoundEntrance(111) || hasFoundEntrance(129)) return true; 
		// south DW locations + hammer pegs
		if (items.glove === 2 && (hasFoundEntrance(86) || hasFoundEntrance(87) || hasFoundEntrance(88) || hasFoundEntrance(89) || hasFoundEntrance(112) || hasFoundEntrance(113) || hasFoundEntrance(119))) return true;
		// east DW locations, can be accessed with hammer + mitts via south route or with NE DW access + hookshot
		if (((items.hammer && items.glove === 2) || (items.hookshot && (items.flippers || items.glove || items.hammer))) && (hasFoundEntrance(94) || hasFoundEntrance(114) || hasFoundEntrance(115) || hasFoundEntrance(116) || hasFoundEntrance(117))) return true;
		// north east shop, can be accessed with hammer + mitts via south route or hookshot by itself
		if (hasFoundEntrance(92) && ((items.hammer && items.glove === 2) || items.hookshot)) return true;
		// hammer-blocked VoO shop
		if (hasFoundEntrance(110) && items.hammer) return true;
		// southeast DW locations
		if (items.flippers && (items.glove === 2 || items.hookshot) && (hasFoundEntrance(118) || hasFoundEntrance(120) || hasFoundEntrance(121) || hasFoundEntrance(122))) return true;
		// flute 4
		if (activeFluteInvertedEntrance()) return true;
		// LW + mirror
		if (items.mirror && (canReachInvertedLightWorldBunny() || hasFoundEntrance(16) || hasFoundEntrance(17) || (hasFoundEntrance(37) && items.hammer) || hasFoundEntrance(38))) return true;
		return false;
	}
	
	function canReachInvertedSouthDW()
	{
		// south DW locations
		if (hasFoundEntrance(86) || hasFoundEntrance(87) || hasFoundEntrance(88) ||  hasFoundEntrance(89) || hasFoundEntrance(113) || hasFoundEntrance(119)) return true;
		// north DW locations = guaranteed access
		if (canReachInvertedNorthDW()) return true;
		// east DW locations (hookshot case covered by north DW)
		if ((hasFoundEntrance(92) || hasFoundEntrance(94) || hasFoundEntrance(114) || hasFoundEntrance(115) || hasFoundEntrance(116) || hasFoundEntrance(117)) && items.hammer) return true;
		// southeast DW locations
		if (items.flippers && items.hammer && (hasFoundEntrance(118) || hasFoundEntrance(120) || hasFoundEntrance(121) || hasFoundEntrance(122))) return true;
		// flute 4/7
		if (activeFluteInvertedEntrance()) return true;
		return false;
	}
	
	function canReachInvertedEastDW()
	{
		// east DW locations
		if (hasFoundEntrance(94) || hasFoundEntrance(114) || hasFoundEntrance(115) || hasFoundEntrance(116) || hasFoundEntrance(117)) return true;
		// north east shop
		if ((items.hammer || items.glove) && hasFoundEntrance(92)) return true;
		// north DW + flippers
		if (canReachInvertedNorthDW() && items.flippers) return true;
		// south DW + flippers or hammer
		if (canReachInvertedSouthDW() && (items.flippers || items.hammer)) return true;
		// flute 5
		if (activeFluteInvertedEntrance()) return true;
		// LW + mirror
		if (items.mirror && (canReachInvertedLightWorldBunny() || ((items.hammer || items.glove) && hasFoundEntrance(4)) || hasFoundEntrance(11))) return true;
		return false;
	}
	
	function canReachInvertedMireArea()
	{
		// mire area locations
		if (hasFoundEntrance(123) || hasFoundEntrance(124) || hasFoundEntrance(125) || hasFoundEntrance(126)) return true;		
		// flute 6
		if (activeFluteInvertedEntrance()) return true;
		// LW + mirror
		if (items.mirror && (canReachInvertedLightWorldBunny() || hasFoundEntrance(53) || hasFoundEntrance(56))) return true;		
		return false;
	}
	
	function canReachInvertedDarkDeathMountain()
	{
		// dark DM locations
		if (hasFoundEntrance(127) || hasFoundEntrance(128) || hasFoundEntrance(130) || hasFoundEntrance(131) || hasFoundEntrance(132) || hasFoundEntrance(133) || hasFoundEntrance(136)) return true;
		if (activeFluteInvertedEntrance()) return true;
		// mirror from LW west DM + paradox top
		if (items.mirror && (hasFoundEntrance(68) || hasFoundEntrance(69) || hasFoundEntrance(70) || hasFoundEntrance(71) || hasFoundEntrance(72) || hasFoundEntrance(73) || hasFoundEntrance(75) || hasFoundEntrance(76) || hasFoundEntrance(77))) return true;
		// hookshot + mirror from LW east DM
		if (items.moonpearl && items.hookshot && items.mirror && (hasFoundEntrance(77) || hasFoundEntrance(78) || hasFoundEntrance(79) || hasFoundEntrance(80) || hasFoundEntrance(81) || hasFoundEntrance(82) || hasFoundEntrance(83) || hasFoundEntrance(84) || hasFoundEntrance(85))) return true;
		return false;
	}
	
	function canReachInvertedWestDeathMountain()
	{
		// portal from dark DM
		if (canReachInvertedDarkDeathMountain()) return true;
		// west DM locations
		if (hasFoundEntrance(68) || hasFoundEntrance(69) || hasFoundEntrance(70) || hasFoundEntrance(71) || hasFoundEntrance(72) || hasFoundEntrance(73) || hasFoundEntrance(75) || hasFoundEntrance(76)) return true;
		// east DM locations
		if (items.moonpearl && items.hookshot && (hasFoundEntrance(77) || hasFoundEntrance(78) || hasFoundEntrance(79) || hasFoundEntrance(80) || hasFoundEntrance(81) || hasFoundEntrance(82) || hasFoundEntrance(83) || hasFoundEntrance(84) || hasFoundEntrance(85))) return true;
		// paradox top is a special butterfly
		if (items.moonpearl && items.hammer && hasFoundEntrance(77)) return true;
		return false;
	}
	
	function canReachInvertedEastDeathMountain()
	{
		// east DM locations
		if (hasFoundEntrance(77) || hasFoundEntrance(78) || hasFoundEntrance(79) || hasFoundEntrance(80) || hasFoundEntrance(81) || hasFoundEntrance(82) || hasFoundEntrance(83) || hasFoundEntrance(84) || hasFoundEntrance(85)) return true;
		// west DM locations
		if (items.moonpearl && items.hookshot && canReachInvertedWestDeathMountain()) return true;
		// hera is a special butterfly
		if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return true;
		// east dark DM portal
		if (items.glove === 2 && (canReachInvertedDarkDeathMountain() || hasFoundEntrance(134) || hasFoundEntrance(135) || hasFoundEntrance(137))) return true;
		return false;
	}
	
	window.loadChestFlagsEntrance = function() {
		
		window.dungeonChecks = [{ // [0]
			can_get_chest: function() {
				window.EntranceEPChests();
			}
		}, { // [1]
			can_get_chest: function() {
				window.EntranceDPChests();
			}
		}, { // [2]
			can_get_chest: function() {
				window.EntranceHeraChests();
			}
		}, { // [3]
			can_get_chest: function() {
				window.EntrancePoDChests();
			}
		}, { // [4]
			can_get_chest: function() {
				window.EntranceSPChests();
			}
		}, { // [5]
			can_get_chest: function() {
				window.EntranceSWChests();
			}
		}, { // [6]
			can_get_chest: function() {
				window.EntranceTTChests();
			}
		}, { // [7]
			can_get_chest: function() {
				window.EntranceIPChests();
			}
		}, { // [8]
			can_get_chest: function() {
				window.EntranceMMChests();
			}
		}, { // [9]
			can_get_chest: function() {
				window.EntranceTRChests();
			}
		}, { // [10]
			can_get_chest: function() {
				window.EntranceGTChests();
			}
		}, { // [11]
			can_get_chest: function() {
				window.EntranceHCChests();
			}
		}, { // [12]
			can_get_chest: function() {
				window.EntranceCTChests();
			}
		}];

		//Is Inverted Mode
		if (flags.gametype === "I")
		{
			window.entrances = [{ // [0]
				caption: 'Bomb Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [1]
				caption: 'Bonk Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(1)) return 'available';
					return items.boots && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [2]
				caption: 'Dam',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [3]
				caption: 'Haunted Grove',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [4]
				caption: 'Magic Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(4)) return 'available';
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [5]
				caption: 'Well of Wishing',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(5)) return 'available';
					return items.flippers && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [6]
				caption: 'Fairy Spring {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(6)) return 'available';
					return canReachInvertedLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [7]
				caption: 'Hyrule Castle - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [8]
				caption: 'Hyrule Castle - Top Entrance (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(8) || hasFoundEntrance(9) || hasFoundEntrance(10)) return 'available';
					// NOTE: Killing Aga 1 will provide a one-time transport to top of the castle, but cannot be returned to except with mirror + S&Q.
					// Killing Aga 2 also transports to the top of the castle, but subsequent climbs of GT will also transport back to the top of the castle.
					return (items.agahnim || items.agahnim2) ? 'available' : 'unavailable';
				}
			}, { // [9]
				caption: 'Hyrule Castle - Top Entrance (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(8) || hasFoundEntrance(9) || hasFoundEntrance(10)) return 'available';
					// NOTE: Killing Aga 1 will provide a one-time transport to top of the castle, but cannot be returned to except with mirror + S&Q.
					// Killing Aga 2 also transports to the top of the castle, but subsequent climbs of GT will also transport back to the top of the castle.
					return (items.agahnim || items.agahnim2) ? 'available' : 'unavailable';
				}
			}, { // [10]
				caption: 'Hyrule Castle - Ganon\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(10)) return 'available';
					if (crystalCheck() < flags.opentowercount && flags.opentowercount != 8) return 'unavailable';
					if (hasFoundEntrance(8) || hasFoundEntrance(9)) {
						if (flags.opentowercount == 8) {
							return 'possible';
						}
						if (crystalCheck() >= flags.opentowercount) return 'available';
					}
					// NOTE: Killing Aga 1 will provide a one-time transport to top of the castle, but cannot be returned to except with mirror + S&Q.
					// Killing Aga 2 also transports to the top of the castle, but subsequent climbs of GT will also transport back to the top of the castle.
					return (items.agahnim || items.agahnim2) ? 'available' : 'unavailable';
				}
			}, { // [11]
				caption: 'Hyrule Castle - Secret Entrance Stairs',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(11)) return 'available';
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [12]
				caption: 'Hyrule Castle - Secret Entrance Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [13]
				caption: 'Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [14]
				caption: 'Bonk Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(14)) return 'available';
					return items.boots && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [15]
				caption: 'Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return items.glove && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [16]
				caption: 'Graveyard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(16)) return 'available';
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [17]
				caption: 'King\'s Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(17)) return 'available';
					return items.glove === 2 && items.boots && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [18]
				caption: 'North Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [19]
				caption: 'North Fairy Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [20]
				caption: 'Gamble',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [21]
				caption: 'Thief\'s Hideout',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [22]
				caption: 'Hideout Stump',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [23]
				caption: 'Lumberjack Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [24]
				caption: 'Lumberjack Tree Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [25]
				caption: 'Lumberjack Tree',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return items.agahnim && items.boots && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [26]
				caption: 'Bumper Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return items.glove && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [27]
				caption: 'Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [28]
				caption: 'Well Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [29]
				caption: 'Well Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [30]
				caption: 'Thief\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [31]
				caption: 'Elder\'s House (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [32]
				caption: 'Elder\'s House (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [33]
				caption: 'Snitch Lady (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [34]
				caption: 'Snitch Lady (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [35]
				caption: 'Chicken House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [36]
				caption: 'Lazy Kid\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [37]
				caption: 'Bush Covered House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(37)) return 'available';
					return canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [38]
				caption: 'Bomb Hut {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(38)) return 'available';
					return canReachInvertedLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [39]
				caption: 'Shop (Kak)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [40]
				caption: 'Tavern (Back)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(40)) return 'available';
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [41]
				caption: 'Tavern (Front)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [42]
				caption: 'Swordsmiths',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [43]
				caption: 'Bat Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [44]
				caption: 'Bat Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return items.hammer && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [45]
				caption: 'Library',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [46]
				caption: 'Two Brothers (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(46)) return 'available';
					return 'unavailable';
				}
			}, { // [47]
				caption: 'Two Brothers (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [48]
				caption: 'Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [49]
				caption: 'Eastern Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [50]
				caption: 'Sahasrahla\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [51]
				caption: 'Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [52]
				caption: 'Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [53]
				caption: 'Desert Palace - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(53)) return 'available';
					return items.book && canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [54]
				caption: 'Desert Palace - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(54)) return 'available';
					if (items.moonpearl && items.glove && hasFoundEntrance(56)) return 'available';
					return 'unavailable';
				}
			}, { // [55]
				caption: 'Desert Palace - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(55)) return 'available';
					return 'unavailable';
				}
			}, { // [56]
				caption: 'Desert Palace - North Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(56)) return 'available';
					if (items.moonpearl && items.glove && hasFoundEntrance(54)) return 'available';
					return 'unavailable';
				}
			}, { // [57]
				caption: 'Checkerboard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(57)) return 'available';
					return items.glove && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [58]
				caption: 'Aginah\'s Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [59]
				caption: 'Desert Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [60]
				caption: '50 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(60)) return 'available';
					return items.glove && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [61]
				caption: 'Shop (Lake)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [62]
				caption: 'Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [63]
				caption: 'Mini Moldorm Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(63)) return 'available';
					return canReachInvertedLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [64]
				caption: 'Pond of Happiness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(64)) return 'available';
					if (items.glove === 2 && hasFoundEntrance(118)) return 'available';
					if (items.glove === 2 && items.flippers && (canReachInvertedSouthDW() || canReachInvertedEastDW())) return 'available';
					return items.flippers && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [65]
				caption: 'Ice Rod Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(65)) return 'available';
					return canReachInvertedLightWorld() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [66]
				caption: 'Good Bee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [67]
				caption: '20 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(67)) return 'available';
					return canReachInvertedLightWorld() && items.glove ? 'available' : 'unavailable';
				}
			}, { // [68]
				caption: 'Tower of Hera',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(77)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [69]
				caption: 'Spectacle Rock Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [70]
				caption: 'Spectacle Rock Cave Peak',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [71]
				caption: 'Spectacle Rock Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [72]
				caption: 'Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [73]
				caption: 'Return Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [74]
				caption: 'Bumper Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(74)) return 'available';
					return 'unavailable';
				}
			}, { // [75]
				caption: 'Old Man Cave (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [76]
				caption: 'Old Man Cave (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedWestDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [77]
				caption: 'Paradox Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [78]
				caption: 'Paradox Cave (Middle)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [79]
				caption: 'Paradox Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [80]
				caption: 'Spiral Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77) || hasFoundEntrance(80)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [81]
				caption: 'Spiral Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [82]
				caption: 'Hookshot Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [83]
				caption: 'Fairy Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77) || hasFoundEntrance(83)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [84]
				caption: 'Fairy Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77) || hasFoundEntrance(83) || hasFoundEntrance(84)) return 'available';
					if (items.moonpearl && items.glove === 2 && canReachInvertedEastDeathMountain()) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [85]
				caption: 'Mimic Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77) || hasFoundEntrance(85)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [86]
				caption: 'Link\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [87]
				caption: 'Bonk Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(87)) 
						return 'available';
					if (!items.boots)
						return 'unavailable';
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [88]
				caption: 'Hype Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedSouthDW() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [89]
				caption: 'Swamp Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [90]
				caption: 'Dark Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [91]
				caption: 'Forest Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [92]
				caption: 'North East Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(92)) return 'available';
					if (activeFluteInvertedEntrance()) return 'available';
					if (items.flippers && (canReachInvertedNorthDW() || canReachInvertedSouthDW() || canReachInvertedEastDW())) return 'available';
					if ((items.hammer || items.glove) && canReachInvertedEastDW()) return 'available';
					return 'unavailable';
				}
			}, { // [93]
				caption: 'Hyrule Castle Hole',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return items.agahnim2 ? 'available' : 'unavailable';
				}
			}, { // [94]
				caption: 'Fat Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(94)) return 'available';
					var crystal_count = 0;
					for(var k = 0; k < 10; k++)
						if(prizes[k] === 4 && items['boss'+k])
							crystal_count += 1;
					if (crystal_count >= 2 && canReachInvertedEastDW()) {
						return hasFoundLocation('bomb') ? 'available' : 'possible';
					}
					return 'unavailable';
				}
			}, { // [95]
				caption: 'Hyrule Castle Hole Exit',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [96]
				caption: 'Skull Woods - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(96)) return 'available';
					if (items.firerod && (hasFoundEntrance(97) || hasFoundEntrance(98))) return 'available';
					if (!items.firerod || !canReachInvertedNorthDW()) return 'unavailable';
					if (flags.doorshuffle === 'N') return 'available';
					if (items.mirror && (canReachInvertedLightWorldBunny() || hasFoundEntrance(16) || hasFoundEntrance(17) || (hasFoundEntrance(37) && items.hammer) || hasFoundEntrance(38))) return 'available';
					return 'possible';
				}
			}, { // [97]
				caption: 'Skull Woods - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(96) || hasFoundEntrance(97) || hasFoundEntrance(98)) return 'available';
					if (!canReachInvertedNorthDW()) return 'unavailable';
					if (flags.doorshuffle === 'N') return 'available';
					if (items.mirror && (canReachInvertedLightWorldBunny() || hasFoundEntrance(16) || hasFoundEntrance(17) || (hasFoundEntrance(37) && items.hammer) || hasFoundEntrance(38))) return 'available';
					return 'possible';
				}
			}, { // [98]
				caption: 'Skull Woods - North Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(96) || hasFoundEntrance(97) || hasFoundEntrance(98)) return 'available';
					if (!canReachInvertedNorthDW()) return 'unavailable';
					if (flags.doorshuffle === 'N') return 'available';
					if (items.mirror && (canReachInvertedLightWorldBunny() || hasFoundEntrance(16) || hasFoundEntrance(17) || (hasFoundEntrance(37) && items.hammer) || hasFoundEntrance(38))) return 'available';
					return 'possible';
				}
			}, { // [99]
				caption: 'Skull Woods - Central Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [100]
				caption: 'Skull Woods - South Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [101]
				caption: 'Skull Woods - NE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [102]
				caption: 'Skull Woods - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [103]
				caption: 'Skull Woods - SE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [104]
				caption: 'Lumberjack Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [105]
				caption: 'Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(105)) return 'available';
					if (items.mirror && hasFoundEntrance(26)) return 'available';
					return (items.glove && canReachInvertedNorthDW()) ? 'available' : 'unavailable';
				}
			}, { // [106]
				caption: 'Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [107]
				caption: 'Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [108]
				caption: 'Thieves\' Town',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [109]
				caption: 'C-Shaped House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedNorthDW() ? 'available' : 'unavailable';
				}
			}, { // [110]
				caption: 'Shop (VoO)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(110)) return 'available';
					if (hasFoundEntrance(37) && items.mirror) return 'available';
					if (items.mirror && items.moonpearl && canReachInvertedLightWorldBunny()) return 'available';
					return (items.hammer && canReachInvertedNorthDW()) ? 'available' : 'unavailable';
				}
			}, { // [111]
				caption: 'Bombable Hut {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(111)) return 'available';
					return canReachInvertedNorthDW() && items.bomb ? 'available' : 'unavailable';
				}
			}, { // [112]
				caption: 'Hammer Peg Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(112)) return 'available';
					if (items.mirror && items.hammer && canReachInvertedLightWorldBunny()) return 'available';
					return (items.glove === 2 && items.hammer && canReachInvertedNorthDW())  ? 'available' : 'unavailable';
				}
			}, { // [113]
				caption: 'Arrow Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [114]
				caption: 'Palace of Darkness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [115]
				caption: 'Hint (North)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [116]
				caption: 'Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [117]
				caption: 'Hint (South)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedEastDW() ? 'available' : 'unavailable';
				}
			}, { // [118]
				caption: 'Ice Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(118)) return 'available';
					if (items.mirror && hasFoundEntrance(64)) return 'available';
					return (items.flippers && (canReachInvertedEastDW() || canReachInvertedSouthDW() || hasFoundEntrance(120) || hasFoundEntrance(121) || hasFoundEntrance(122))) ? 'available' : 'unavailable';
				}
			}, { // [119]
				caption: 'Shop (Dark Lake)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [120]
				caption: 'Ledge Fairy {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(120)) return 'available';
					if (items.bomb) {
						if (hasFoundEntrance(120) || hasFoundEntrance(121) || hasFoundEntrance(122) || activeFluteInvertedEntrance()) return 'available';
						if (items.mirror && canReachInvertedLightWorldBunny()) return 'available';
						if (items.flippers && (canReachInvertedEastDW() || canReachInvertedSouthDW())) return 'available';
					}
					return 'unavailable';
				}
			}, { // [121]
				caption: 'Ledge Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(120) || hasFoundEntrance(121) || hasFoundEntrance(122) || activeFluteInvertedEntrance()) return 'available';
					if (items.mirror && canReachInvertedLightWorldBunny()) return 'available';
					return (items.flippers && (canReachInvertedEastDW() || canReachInvertedSouthDW())) ? 'available' : 'unavailable';
				}
			}, { // [122]
				caption: 'Ledge Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(122)) return 'available';
					if (!items.glove) return 'unavailable';
					if (hasFoundEntrance(120) || hasFoundEntrance(121) || activeFluteInvertedEntrance()) return 'available';
					if (items.mirror && canReachInvertedLightWorldBunny()) return 'available';
					return (items.flippers && (canReachInvertedEastDW() || canReachInvertedSouthDW())) ? 'available' : 'unavailable';
				}
			}, { // [123]
				caption: 'Misery Mire',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(123)) return 'available';
					if (!canReachInvertedMireArea()) return 'unavailable';
					return medallionCheck(0);
				}
			}, { // [124]
				caption: 'Shed',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedMireArea() ? 'available' : 'unavailable';
				}
			}, { // [125]
				caption: 'Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedMireArea() ? 'available' : 'unavailable';
				}
			}, { // [126]
				caption: 'Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedMireArea() ? 'available' : 'unavailable';
				}
			}, { // [127]
				caption: 'Agahnim\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(127)) return 'available';
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [128]
				caption: 'Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [129]
				caption: 'Return Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(129)) return 'available';
					if (items.mirror && hasFoundEntrance(74)) return 'available';
					return 'unavailable';
				}
			}, { // [130]
				caption: 'Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [131]
				caption: 'Hookshot Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(131)) return 'available';
					if (!items.mirror) return 'unavailable';
					if (hasFoundEntrance(77)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [132]
				caption: 'Hookshot Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(132)) return 'available';
					return items.glove && canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [133]
				caption: 'Superbunny Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [134]
				caption: 'Superbunny Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(134) || hasFoundEntrance(135)) return 'available';
					if (items.mirror && (hasFoundEntrance(78) || hasFoundEntrance(79) || hasFoundEntrance(80) || hasFoundEntrance(81) || hasFoundEntrance(82) || hasFoundEntrance(83) || hasFoundEntrance(84) || hasFoundEntrance(85))) return 'available';
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [135]
				caption: 'Shop (DDM)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(134) || hasFoundEntrance(135)) return 'available';
					if (items.mirror && (hasFoundEntrance(78) || hasFoundEntrance(79) || hasFoundEntrance(80) || hasFoundEntrance(81) || hasFoundEntrance(82) || hasFoundEntrance(83) || hasFoundEntrance(84) || hasFoundEntrance(85))) return 'available';
					return canReachInvertedDarkDeathMountain() ? 'available' : 'unavailable';
				}
			}, { // [136]
				caption: 'Turtle Rock - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(136)) return 'available';
					if (!canReachInvertedDarkDeathMountain()) return 'unavailable';
					return medallionCheck(1);
				}
			}, { // [137]
				caption: 'Turtle Rock - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(137)) return 'available';				
					if (!items.mirror) return 'unavailable';				
					if (hasFoundEntrance(77) || hasFoundEntrance(83)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [138]
				caption: 'Turtle Rock Ledge - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(138) || hasFoundEntrance(139)) return 'available';
					if (!items.mirror) return 'unavailable';				
					if (hasFoundEntrance(77) || hasFoundEntrance(80) || hasFoundEntrance(85)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [139]
				caption: 'Turtle Rock Ledge - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(138) || hasFoundEntrance(139)) return 'available';
					
					if (!items.mirror) return 'unavailable';				
					
					if (hasFoundEntrance(77) || hasFoundEntrance(80) || hasFoundEntrance(85)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}];
				
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
					if(!(items.glove || activeFluteInvertedEntrance()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2)) return 'unavailable';
					return window.HeraBoss();
				},
				can_get_chest: function() {
					if(!(items.glove || activeFluteInvertedEntrance()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2)) return 'unavailable';
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
					if (!items.flippers || (!items.firerod && !items.bombos) || (!items.firerod && items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPBoss();
				},
				can_get_chest: function() {
					if (!items.flippers || (!items.firerod && !items.bombos) || (!items.firerod && items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPChests();
				}
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}',
				is_beaten: false,
				is_beatable: function() {
					if (!(activeFluteInvertedEntrance() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					if (!items.bigkey8) return 'unavailable';
					var state = medallionCheck(0);
					if (state) return state;
					return window.MMBoss();
				},
				can_get_chest: function() {
					if (!(activeFluteInvertedEntrance() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallionCheck(0);
					if (state) return state;
					return window.MMChests();
				}
			}, { // [9]
				caption: 'Turtle Rock {medallion0}/{mirror}',
				is_beaten: false,
				is_beatable: function() {
					if (!(items.glove || activeFluteInvertedEntrance()) || !items.somaria) return 'unavailable';
					//First, check for back door access through mirror, it has logic priority
					if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2))) {
						return window.TRBackBoss();
					//If not, go through normal front door access
					} else {
						if (!items.bigkey9) return 'unavailable';
						var state = medallionCheck(1);
						if (state) return state;
						return window.TRFrontBoss();
					}
				},
				can_get_chest: function() {
					if (!(items.glove || activeFluteInvertedEntrance())) return 'unavailable';
					//First, check for back door access through mirror, it has logic priority
					if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2))) {
						return window.TRBackChests();
					//If not, go through normal front door access
					} else {
						if (!items.somaria) return 'unavailable';
						var state = medallionCheck(1);
						if (state) return state;
						return window.TRFrontChests();
					}
				}
			}, { // [10]
				caption: 'Ganon\'s Castle (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					if (crystalCheck() < flags.ganonvulncount || !canReachLightWorld()) return 'unavailable';
					if (flags.goals === 'F' && (items.sword > 1 || flags.swordmode === 'S' && items.hammer) && (items.lantern || items.firerod)) return 'available';
					return window.GTBoss();			
				},
				can_get_chest: function() {
					if (crystalCheck() < flags.opentowercount) return 'unavailable';
					return window.GTChests();
				}
			}, { // [11]
				caption: 'Hyrule Castle',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ?window.dungeons[11].can_get_chest() :'opened';
				},
				can_get_chest: function() {
					return window.HCChests();
				}
			}, { // [12]
				caption: 'Castle Tower',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return window.agahnim.is_available();
				},
				can_get_chest: function() {
					return window.CTChests();
				}
			}];

			window.agahnim = {
				caption: 'Agahnim',
				is_available: function() {
					return window.CTBoss();
				}
			};

			//define overworld chests
			window.chests = [{ // [0]
				caption: 'Light World Swamp',
				is_opened: false,
				is_available: function() {
					if (!hasFoundLocation('dam') ) return 'unavailable';
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [1]
				caption: 'Stoops Lonk\'s Hoose',
				is_opened: false,
				is_available: function() {
					// this is hidden in inverted, see script at bottom of entrancetracker.html
					return 'available';
				}
			}, { // [2]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [3]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [4]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return (items.mirror || (items.glove === 2 && canReachInvertedNorthDW())) && canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [5]
				caption: 'Fugitive under the bridge {flippers}',
				is_opened: false,
				is_available: function() {
					return items.flippers && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [6]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					if (!items.book) return 'unavailable';
					if (hasFoundEntrance(68)) return (items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'information';
					if (items.moonpearl && items.hammer && hasFoundEntrance(77)) return (items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'information';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return (items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'information';
					return 'unavailable';
				}
			}, { // [7]
				caption: 'Bombos Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					if (!items.book) return 'unavailable';
					return canReachInvertedLightWorldBunny() ?
						((items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'information') :
						'unavailable';
				}
			}, { // [8]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					if (items.glove && canReachInvertedEastDW()) return 'available';
					return items.moonpearl && items.flippers && items.mirror && canReachInvertedLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [9]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return canReachInvertedLightWorld() ? (items.flippers || items.glove ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [10]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					if (canReachInvertedDarkDeathMountain() && (hasFoundEntrance(68) || (items.moonpearl && items.hammer &&
						(items.glove === 2 || hasFoundEntrance(77))))) return items.lantern ? 'available' : 'darkavailable';
					if (canReachInvertedWestDeathMountain()) return items.lantern ? 'possible' : 'darkpossible';
					/*if (canReachInvertedDarkDeathMountain()) return items.lantern ? 'available' : 'darkavailable';
					if (hasFoundEntrance(68) || hasFoundEntrance(69) || hasFoundEntrance(70) || hasFoundEntrance(71) || hasFoundEntrance(72) || hasFoundEntrance(73) || hasFoundEntrance(75) || hasFoundEntrance(76)) return items.lantern ? 'available' : 'darkavailable';*/
					return 'unavailable';
				}
			}, { // [11]
				caption: 'Mushroom',
				is_opened: false,
				is_available: function() {
					return canReachInvertedLightWorldBunny() ? (items.moonpearl ? 'available' : 'information') : 'unavailable';
				}
			}, { // [12]
				caption: 'Spectacle Rock',
				is_opened: false,
				is_available: function() {
					if (hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(77)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return canReachInvertedWestDeathMountain() ? 'information' : 'unavailable';
				}
			}, { // [13]
				caption: 'Floating Island',
				is_opened: false,
				is_available: function() {
					if (hasFoundEntrance(77)) return 'available';
					if (items.moonpearl && items.hammer && hasFoundEntrance(68)) return 'available';
					if (items.moonpearl && items.hammer && items.glove === 2 && canReachInvertedDarkDeathMountain()) return 'available';
					return 'unavailable';
				}
			}, { // [14]
				caption: 'Race Minigame',
				is_opened: false,
				is_available: function() {
					if (items.moonpearl && hasFoundEntrance(46)) return 'available';
					return canReachInvertedLightWorldBunny() ? 'information' : 'unavailable';
				}
			}, { // [15]
				caption: 'Desert West Ledge',
				is_opened: false,
				is_available: function() {
					if (hasFoundEntrance(54)) return 'available';
					if (items.moonpearl && items.glove && hasFoundEntrance(56)) return 'available';
					return canReachInvertedLightWorldBunny() ? 'information' : 'unavailable';
				}
			}, { // [16]
				caption: 'Lake Hylia Island {flippers}',
				is_opened: false,
				is_available: function() {
					if (!canReachInvertedLightWorldBunny())
						return 'unavailable';
					return (items.moonpearl && items.flippers) ? 'available' : 'information';
				}
			}, { // [17]
				caption: 'Bumper Cave',
				is_opened: false,
				is_available: function() {
					if (hasFoundEntrance(129)) return 'available';
					return canReachInvertedNorthDW() ? 'information' : 'unavailable';
				}
			}, { // [18]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					if (canReachInvertedEastDW()) return 'available';
					if ((items.hammer || (items.flippers && items.glove)) && canReachInvertedNorthDW()) return 'available';				
					return 'unavailable';
				}
			}, { // [19]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: function() {
					return canReachInvertedSouthDW() ? 'available' : 'unavailable';
				}
			}, { // [20]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					if (!canReachInvertedLightWorld())
						return 'unavailable';
					if (items.flippers)
						return 'available';
					if (items.glove)
						return 'information';
					return 'unavailable';
				}
			}, { // [21]
				caption: 'Buried Item {shovel}',
				is_opened: false,
				is_available: function() {
					return items.shovel && canReachInvertedLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [22]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					if(!canReachInvertedLightWorldBunny())
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
		else if (flags.glitches != "N") {
			window.entrances = [{ // [0]
				caption: 'Link\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [1]
				caption: 'Bonk Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [2]
				caption: 'Dam',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [3]
				caption: 'Haunted Grove',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [4]
				caption: 'Magic Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [5]
				caption: 'Well of Wishing',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [6]
				caption: 'Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [7]
				caption: 'Hyrule Castle - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [8]
				caption: 'Hyrule Castle - Top Entrance (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [9]
				caption: 'Hyrule Castle - Top Entrance (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [10]
				caption: 'Hyrule Castle - Agahnim\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [11]
				caption: 'Hyrule Castle - Secret Entrance Stairs',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [12]
				caption: 'Hyrule Castle - Secret Entrance Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [13]
				caption: 'Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [14]
				caption: 'Bonk Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [15]
				caption: 'Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [16]
				caption: 'Graveyard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [17]
				caption: 'King\'s Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [18]
				caption: 'North Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [19]
				caption: 'North Fairy Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [20]
				caption: 'Gamble',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [21]
				caption: 'Thief\'s Hideout',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [22]
				caption: 'Hideout Stump',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [23]
				caption: 'Lumberjack Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [24]
				caption: 'Lumberjack Tree Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [25]
				caption: 'Lumberjack Tree',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [26]
				caption: 'Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [27]
				caption: 'Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [28]
				caption: 'Well Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [29]
				caption: 'Well Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [30]
				caption: 'Thief\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [31]
				caption: 'Elder\'s House (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [32]
				caption: 'Elder\'s House (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [33]
				caption: 'Snitch Lady (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [34]
				caption: 'Snitch Lady (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [35]
				caption: 'Chicken House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [36]
				caption: 'Lazy Kid\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [37]
				caption: 'Bush Covered House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [38]
				caption: 'Bomb Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [39]
				caption: 'Shop (Kak)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [40]
				caption: 'Tavern (Back)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [41]
				caption: 'Tavern (Front)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [42]
				caption: 'Swordsmiths',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [43]
				caption: 'Bat Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [44]
				caption: 'Bat Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [45]
				caption: 'Library',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [46]
				caption: 'Two Brothers (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [47]
				caption: 'Two Brothers (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [48]
				caption: 'Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [49]
				caption: 'Eastern Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [50]
				caption: 'Sahasrahla\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [51]
				caption: 'Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [52]
				caption: 'Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [53]
				caption: 'Desert Palace - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [54]
				caption: 'Desert Palace - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [55]
				caption: 'Desert Palace - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [56]
				caption: 'Desert Palace - North Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [57]
				caption: 'Checkerboard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [58]
				caption: 'Aginah\'s Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [59]
				caption: 'Desert Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [60]
				caption: '50 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [61]
				caption: 'Shop (Lake)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [62]
				caption: 'Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [63]
				caption: 'Mini Moldorm Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [64]
				caption: 'Pond of Happiness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [65]
				caption: 'Ice Rod Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [66]
				caption: 'Good Bee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [67]
				caption: '20 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [68]
				caption: 'Tower of Hera',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [69]
				caption: 'Spectacle Rock Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [70]
				caption: 'Spectacle Rock Cave Peak',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [71]
				caption: 'Spectacle Rock Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [72]
				caption: 'Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [73]
				caption: 'Return Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [74]
				caption: 'Return Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [75]
				caption: 'Old Man Cave (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [76]
				caption: 'Old Man Cave (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [77]
				caption: 'Paradox Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [78]
				caption: 'Paradox Cave (Middle)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [79]
				caption: 'Paradox Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [80]
				caption: 'Spiral Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [81]
				caption: 'Spiral Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [82]
				caption: 'Hookshot Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [83]
				caption: 'Fairy Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [84]
				caption: 'Fairy Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [85]
				caption: 'Mimic Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [86]
				caption: 'Bomb Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [87]
				caption: 'Bonk Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [88]
				caption: 'Hype Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [89]
				caption: 'Swamp Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [90]
				caption: 'Dark Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [91]
				caption: 'Forest Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [92]
				caption: 'North East Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [93]
				caption: 'Pyramid Hole',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [94]
				caption: 'Fat Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [95]
				caption: 'Pyramid Exit',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [96]
				caption: 'Skull Woods - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [97]
				caption: 'Skull Woods - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [98]
				caption: 'Skull Woods - North Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [99]
				caption: 'Skull Woods - Central Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [100]
				caption: 'Skull Woods - South Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [101]
				caption: 'Skull Woods - NE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [102]
				caption: 'Skull Woods - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [103]
				caption: 'Skull Woods - SE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [104]
				caption: 'Lumberjack Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [105]
				caption: 'Bumper Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [106]
				caption: 'Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [107]
				caption: 'Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [108]
				caption: 'Thieves\' Town',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [109]
				caption: 'C-Shaped House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [110]
				caption: 'Shop (VoO)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [111]
				caption: 'Bombable Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [112]
				caption: 'Hammer Peg Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [113]
				caption: 'Arrow Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [114]
				caption: 'Palace of Darkness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [115]
				caption: 'Hint (North)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [116]
				caption: 'Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [117]
				caption: 'Hint (South)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [118]
				caption: 'Ice Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [119]
				caption: 'Shop (Dark Lake)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [120]
				caption: 'Ledge Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [121]
				caption: 'Ledge Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [122]
				caption: 'Ledge Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [123]
				caption: 'Misery Mire',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [124]
				caption: 'Shed',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [125]
				caption: 'Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [126]
				caption: 'Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [127]
				caption: 'Ganon\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [128]
				caption: 'Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [129]
				caption: 'Bumper Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [130]
				caption: 'Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [131]
				caption: 'Hookshot Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [132]
				caption: 'Hookshot Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [133]
				caption: 'Superbunny Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [134]
				caption: 'Superbunny Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [135]
				caption: 'Shop (DDM)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [136]
				caption: 'Turtle Rock - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [137]
				caption: 'Turtle Rock - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [138]
				caption: 'Turtle Rock Ledge - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}, { // [139]
				caption: 'Turtle Rock Ledge - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					//Logic
					return 'available';
				}
			}];
				
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
					if (!items.flippers || (!items.firerod && !items.bombos) || (!items.firerod && items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPBoss();
				},
				can_get_chest: function() {
					if (!items.flippers || (!items.firerod && !items.bombos) || (!items.firerod && items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPChests();
				}
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}',
				is_beaten: false,
				is_beatable: function() {
					if (!(activeFlute() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					if (!items.bigkey8) return 'unavailable';
					var state = medallionCheck(0);
					if (state) return state;
					return window.MMBoss();
				},
				can_get_chest: function() {
					if (!(activeFlute() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallionCheck(0);
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
						var state = medallionCheck(1);
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
						var state = medallionCheck(1);
						if (state) return state;
						return window.TRFrontChests();
					}
				}
			}, { // [10]
				caption: 'Ganon\'s Castle (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					if (crystalCheck() < flags.ganonvulncount || !canReachLightWorld()) return 'unavailable';
					if (flags.goals === 'F' && (items.sword > 1 || flags.swordmode === 'S' && items.hammer) && (items.lantern || items.firerod)) return 'available';
					return window.GTBoss();			
				},
				can_get_chest: function() {
					if (crystalCheck() < flags.opentowercount) return 'unavailable';
					return window.GTChests();
				}
			}, { // [11]
				caption: 'Hyrule Castle',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ?window.dungeons[11].can_get_chest() :'opened';
				},
				can_get_chest: function() {
					return window.HCChests();
				}
			}, { // [12]
				caption: 'Castle Tower',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return window.agahnim.is_available();
				},
				can_get_chest: function() {
					return window.CTChests();
				}
			}];

			window.agahnim = {
				caption: 'Agahnim',
				is_available: function() {
					return window.CTBoss();
				}
			};

			//define overworld chests
			window.chests = [{ // [0]
				caption: 'Light World Swamp',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [1]
				caption: 'Stoops Lonk\'s Hoose',
				is_opened: false,
				is_available: always
			}, { // [2]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [3]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: always
			}, { // [4]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return (items.mirror || items.glove === 2) && canReachLightWorldBunny() ? 'available' : 'unavailable';
				}
			}, { // [5]
				caption: 'Fugitive under the bridge {flippers}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorld() ? (items.flippers ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [6]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*return items.moonpearl && items.hammer && items.book && (activeFlute() || items.glove) && (items.hookshot || items.glove === 2) ?
						(items.sword >= 2 || (flags.swordmode === 'S' && items.hammer) ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'information') :
						'unavailable';*/
				}
			}, { // [7]
				caption: 'Bombos Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*return canReachLightWorldBunny() && items.book ?
						(items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'information' :
						'unavailable';*/
				}
			}, { // [8]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*if(!items.glove)
						return 'unavailable';
					if(canReachPyramid())
						return 'available';
					return 'unavailable';*/
				}
			}, { // [9]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorld() ? (items.flippers || items.glove ? 'available' : 'unavailable') : 'unavailable';
				}
			}, { // [10]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return items.glove || activeFlute() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}, { // [11]
				caption: 'Mushroom',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
				}
			}, { // [12]
				caption: 'Spectacle Rock',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*if(!(items.glove || activeFlute()))
						return 'unavailable';
					return items.moonpearl && items.hammer && (items.hookshot || items.glove === 2) ?
						(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
						'information';*/
				}
			}, { // [13]
				caption: 'Floating Island',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*return (activeFlute() || items.glove) && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
						(items.lantern || activeFlute() ? 'available' : 'darkavailable') :
						'unavailable';*/
				}
			}, { // [14]
				caption: 'Race Minigame {bomb}/{boots}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
				}
			}, { // [15]
				caption: 'Desert West Ledge {book}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return canReachLightWorldBunny() ? (items.book ? (items.moonpearl ? 'available' : 'information') : 'information') : 'unavailable';
				}
			}, { // [16]
				caption: 'Lake Hylia Island {flippers}',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*if(!canReachLightWorldBunny())
						return 'unavailable';
					return items.moonpearl ? (items.flippers ? 'available' : 'information') : 'information';*/
				}
			}, { // [17]
				caption: 'Bumper Cave {cape}{mirror}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return items.glove && items.cape && items.mirror && canReachLightWorld() ? 'available' : 'information';
				}
			}, { // [18]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*if(canReachPyramid())
						return 'available';
					return 'unavailable';*/
				}
			}, { // [19]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: always
			}, { // [20]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*if(!canReachLightWorld())
						return 'unavailable';
					if(items.flippers)
						return 'available';
					return 'information';*/
				}
			}, { // [21]
				caption: 'Buried Item {shovel}',
				is_opened: false,
				is_available: function() {
					return 'available';
					//return items.shovel && canReachLightWorld() ? 'available' : 'unavailable';
				}
			}, { // [22]
				caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
				is_opened: false,
				is_available: function() {
					return 'available';
					/*if(!canReachLightWorldBunny())
						return 'unavailable';
					var pendant_count = 0;
					for(var k = 0; k < 10; k++)
						if((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k])
							if(++pendant_count === 3)
								return 'available';
					return items.book ? 'information' : 'unavailable';*/
				}
			}];
		}
		else
		{
			window.entrances = [{ // [0]
				caption: 'Link\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [1]
				caption: 'Bonk Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(1)) return 'available';
					return (items.boots ? 'available' : 'unavailable');
				}
			}, { // [2]
				caption: 'Dam',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [3]
				caption: 'Haunted Grove',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(3)) return 'available';
					return (items.mirror && canReachDarkWorldSouth() ? 'available' : 'unavailable');
				}
			}, { // [4]
				caption: 'Magic Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [5]
				caption: 'Well of Wishing',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(5)) return 'available';
					return (items.flippers ? 'available' : 'unavailable');
				}
			}, { // [6]
				caption: 'Fairy Spring {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [7]
				caption: 'Hyrule Castle - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [8]
				caption: 'Hyrule Castle - Top Entrance (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(8)) return 'available';
					return canReachHCNorth() ? 'available' : 'unavailable';
				}
			}, { // [9]
				caption: 'Hyrule Castle - Top Entrance (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(9)) return 'available';
					return canReachHCNorth() ? 'available' : 'unavailable';
				}
			}, { // [10]
				caption: 'Hyrule Castle - Agahnim\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(10)) return 'available';
					return canReachHCNorth() && (items.sword > 1 || items.cape || items.agahnim || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'unavailable';
				}
			}, { // [11]
				caption: 'Hyrule Castle - Secret Entrance Stairs',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [12]
				caption: 'Hyrule Castle - Secret Entrance Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [13]
				caption: 'Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [14]
				caption: 'Bonk Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(14)) return 'available';
					return (items.boots ? 'available' : 'unavailable');
				}
			}, { // [15]
				caption: 'Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return (items.glove > 0 ? 'available' : 'unavailable');
				}
			}, { // [16]
				caption: 'Graveyard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(16)) return 'available';
					return (items.mirror && items.moonpearl && canReachOutcast() ? 'available' : 'unavailable');
				}
			}, { // [17]
				caption: 'King\'s Grave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(17)) return 'available';
					if (!items.boots) return 'unavailable';
					if ((canReachOutcast() && items.mirror && items.moonpearl) || items.glove === 2) return 'available';
					return 'unavailable';
				}
			}, { // [18]
				caption: 'North Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [19]
				caption: 'North Fairy Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [20]
				caption: 'Gamble',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [21]
				caption: 'Thief\'s Hideout',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [22]
				caption: 'Hideout Stump',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [23]
				caption: 'Lumberjack Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [24]
				caption: 'Lumberjack Tree Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [25]
				caption: 'Lumberjack Tree',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(25)) return 'available';
					return items.agahnim && items.boots ? 'available' : 'unavailable';
				}
			}, { // [26]
				caption: 'Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(26)) return 'available';
					return (items.glove > 0 || (hasFoundEntrance(105) && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [27]
				caption: 'Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [28]
				caption: 'Well Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [29]
				caption: 'Well Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [30]
				caption: 'Thief\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [31]
				caption: 'Elder\'s House (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [32]
				caption: 'Elder\'s House (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [33]
				caption: 'Snitch Lady (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [34]
				caption: 'Snitch Lady (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [35]
				caption: 'Chicken House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [36]
				caption: 'Lazy Kid\'s House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [37]
				caption: 'Bush Covered House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [38]
				caption: 'Bomb Hut {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(38)) return 'available';
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [39]
				caption: 'Shop (Kak)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [40]
				caption: 'Tavern (Back)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [41]
				caption: 'Tavern (Front)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [42]
				caption: 'Swordsmiths',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [43]
				caption: 'Bat Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [44]
				caption: 'Bat Cave Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return ((hasFoundEntrance(112) && items.mirror) || (items.hammer || items.glove === 2 && items.mirror && items.moonpearl)) ? 'available' : 'unavailable';
				}
			}, { // [45]
				caption: 'Library',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [46]
				caption: 'Two Brothers (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(46)) return 'available';				
					return ((canReachDarkWorldSouth() && items.mirror) ? 'available' : 'unavailable');
				}
			}, { // [47]
				caption: 'Two Brothers (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [48]
				caption: 'Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [49]
				caption: 'Eastern Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [50]
				caption: 'Sahasrahla\'s Hut',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [51]
				caption: 'Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [52]
				caption: 'Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [53]
				caption: 'Desert Palace - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(53)) return 'available';				
					if (items.book || (items.flute && items.glove === 2 && items.mirror) || (items.mirror && canReachMiseryMire()) || ((hasFoundEntrance(123)) && items.mirror)) return 'available';
					return 'unavailable';
				}
			}, { // [54]
				caption: 'Desert Palace - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(54)) return 'available';
					return ((items.flute && items.glove === 2 && items.mirror) || (items.mirror && canReachMiseryMire()) || (hasFoundEntrance(56) && items.glove > 0)) ? 'available' : 'unavailable';
				}
			}, { // [55]
				caption: 'Desert Palace - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return hasFoundEntrance(55) ? 'available' : 'unavailable';
				}
			}, { // [56]
				caption: 'Desert Palace - North Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(56)) return 'available';
					return ((hasFoundEntrance(54) && items.glove > 0) || (items.mirror && canReachMiseryMire()) || (items.flute && items.glove === 2 && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [57]
				caption: 'Checkerboard Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(57)) return 'available';
					return (canReachMiseryMire() && items.mirror && items.glove > 0) ? 'available' : 'unavailable';
				}
			}, { // [58]
				caption: 'Aginah\'s Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [59]
				caption: 'Desert Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [60]
				caption: '50 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(60)) return 'available';
					return (items.glove > 0) ? 'available' : 'unavailable';
				}
			}, { // [61]
				caption: 'Shop (Lake)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [62]
				caption: 'Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [63]
				caption: 'Mini Moldorm Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(63)) return 'available';
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [64]
				caption: 'Pond of Happiness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(64)) return 'available';
					if (hasFoundEntrance(118) && items.mirror) return 'available';
					return (items.flippers) ? 'available' : 'unavailable';
				}
			}, { // [65]
				caption: 'Ice Rod Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(65)) return 'available';
					return items.bomb ? 'available' : 'unavailable';
				}
			}, { // [66]
				caption: 'Good Bee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return 'available';
				}
			}, { // [67]
				caption: '20 Rupee Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(67)) return 'available';
					return (items.glove > 0) ? 'available' : 'unavailable';
				}
			}, { // [68]
				caption: 'Tower of Hera',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(68)) return 'available';
					if (canReachDWWDM() && items.mirror) return 'available';
					return (canReachWDMNorth()) ? 'available' : 'unavailable';
				}
			}, { // [69]
				caption: 'Spectacle Rock Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(69)) return 'available';
					return canReachWDM() ? 'available' : 'unavailable';
				}
			}, { // [70]
				caption: 'Spectacle Rock Cave Peak',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(70)) return 'available';
					return canReachWDM() ? 'available' : 'unavailable';
				}
			}, { // [71]
				caption: 'Spectacle Rock Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(71)) return 'available';
					return canReachWDM() ? 'available' : 'unavailable';
				}
			}, { // [72]
				caption: 'Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(72)) return 'available';
					return canReachWDM() ? 'available' : 'unavailable';
				}
			}, { // [73]
				caption: 'Return Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(73)) return 'available';
					return canReachWDM() ? 'available' : 'unavailable';
				}
			}, { // [74]
				caption: 'Return Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(74)) return 'available';
					if (hasFoundEntrance(129) && items.mirror) return 'available';
					return 'unavailable';
				}
			}, { // [75]
				caption: 'Old Man Cave (West)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(75)) return 'available';
					return canReachWDM() ? 'available' : 'unavailable';
				}
			}, { // [76]
				caption: 'Old Man Cave (East)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(76)) return 'available';
					return canReachWDM() ? 'available' : 'unavailable';
				}
			}, { // [77]
				caption: 'Paradox Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(77)) return 'available';
					return canReachEDMNorth() ? 'available' : 'unavailable';
				}
			}, { // [78]
				caption: 'Paradox Cave (Middle)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(78)) return 'available';
					return canReachEDM() ? 'available' : 'unavailable';
				}
			}, { // [79]
				caption: 'Paradox Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(79)) return 'available';
					return canReachEDM() ? 'available' : 'unavailable';
				}
			}, { // [80]
				caption: 'Spiral Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(80)) return 'available';
					return (canReachEDMNorth() || hasFoundEntrance(80) || ((hasFoundEntrance(138) || hasFoundEntrance(139)) && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [81]
				caption: 'Spiral Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(81)) return 'available';
					return canReachEDM() ? 'available' : 'unavailable';
				}
			}, { // [82]
				caption: 'Hookshot Fairy Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(82)) return 'available';
					return canReachEDM() ? 'available' : 'unavailable';
				}
			}, { // [83]
				caption: 'Fairy Ascension Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(83)) return 'available';
					return (canReachEDMNorth() || (hasFoundEntrance(137) && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [84]
				caption: 'Fairy Ascension Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(84)) return 'available';
					if (items.moonpearl && items.mirror && canReachEDM()) return 'available';
					return (hasFoundEntrance(83) || canReachEDMNorth() || (canReachEDM() && items.glove === 2) || (hasFoundEntrance(137) && items.mirror)) ? 'available' : 'unavailable';
				}
			}, { // [85]
				caption: 'Mimic Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(85)) return 'available';
					return ((items.mirror && (hasFoundEntrance(138) || hasFoundEntrance(139)))) ? 'available' : 'unavailable';
				}
			}, { // [86]
				caption: 'Bomb Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachDarkWorldSouth() ? 'available' : 'unavailable';
				}
			}, { // [87]
				caption: 'Bonk Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(87)) return 'available';
					return (canReachDarkWorldSouth() && items.boots && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [88]
				caption: 'Hype Cave {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(88)) return 'available';
					return (canReachDarkWorldSouth() && items.moonpearl && items.bomb) ? 'available' : 'unavailable';
				}
			}, { // [89]
				caption: 'Swamp Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachDarkWorldSouth() ? 'available' : 'unavailable';
				}
			}, { // [90]
				caption: 'Dark Sanctuary',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachOutcast() ? 'available' : 'unavailable';
				}
			}, { // [91]
				caption: 'Forest Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return canReachOutcast() ? 'available' : 'unavailable';
				}
			}, { // [92]
				caption: 'North East Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(92)) return 'available';
					//if (items.moonpearl && items.glove && (items.agahnim || items.hammer || items.glove === 2 && items.flippers)) return 'available';
					if (canReachOutcast() && items.moonpearl && items.flippers) return 'available';
					return (canReachDarkWorldEast() && items.moonpearl && (items.flippers || items.glove > 0 || items.hammer)) ? 'available' : 'unavailable';
					//if (canReachDarkWorldSouth() && items.moonpearl && (items.flippers || items.hammer)) return 'available';
					//if (canReachDarkWorldEast() && items.moonpearl && (items.flippers || items.hammer || items.glove > 0)) return 'available';
					//return (!canReachDarkWorld() ) ? 'unavailable' : 'available';
				}
			}, { // [93]
				caption: 'Pyramid Hole',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(93)) return 'available';
					if (!items.agahnim2) return 'unavailable';
					return (canReachPyramid() || canReachDarkWorldEast()) ? 'available' : 'unavailable';
				}
			}, { // [94]
				caption: 'Fat Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(94)) return 'available';
					var crystal_count = 0;
					for(var k = 0; k < 10; k++)
						if(prizes[k] === 4 && items['boss'+k])
							crystal_count += 1;
					if (crystal_count >= 2 && (canReachPyramid() || canReachDarkWorldEast())) {
						return hasFoundLocation('bomb') ? 'available' : 'possible';
					}
					return 'unavailable';
				}
			}, { // [95]
				caption: 'Pyramid Exit',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(95)) return 'available';
					if (!items.agahnim2 || !items.moonpearl) return 'unavailable';
					return (canReachPyramid() || canReachDarkWorldEast()) ? 'available' : 'unavailable';
				}
			}, { // [96]
				caption: 'Skull Woods - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(96)) return 'available';
					if ((hasFoundEntrance(97) || hasFoundEntrance(98)) && items.moonpearl && items.firerod) return 'available';
					return (canReachOutcast() && items.moonpearl && items.firerod) ? (flags.doorshuffle === 'N' ? 'available' : 'possible') : 'unavailable';
				}
			}, { // [97]
				caption: 'Skull Woods - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(97)) return 'available';
					if ((hasFoundEntrance(96) || hasFoundEntrance(98)) && items.moonpearl) return 'available';
					return (canReachOutcast() && items.moonpearl) ? (flags.doorshuffle === 'N' ? 'available' : 'possible') : 'unavailable';
				}
			}, { // [98]
				caption: 'Skull Woods - North Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(98)) return 'available';
					if ((hasFoundEntrance(96) || hasFoundEntrance(97)) && items.moonpearl) return 'available';
					return (canReachOutcast() && items.moonpearl) ? (flags.doorshuffle === 'N' ? 'available' : 'possible') : 'unavailable';
				}
			}, { // [99]
				caption: 'Skull Woods - Central Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(99)) return 'available';
					return (canReachOutcast() && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [100]
				caption: 'Skull Woods - South Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(100)) return 'available';
					return (canReachOutcast() && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [101]
				caption: 'Skull Woods - NE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(101)) return 'available';
					return (canReachOutcast() && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [102]
				caption: 'Skull Woods - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(102)) return 'available';
					return (canReachOutcast() && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [103]
				caption: 'Skull Woods - SE Drop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(103)) return 'available';
					return (canReachOutcast() && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [104]
				caption: 'Lumberjack Shop',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return (canReachOutcast()) ? 'available' : 'unavailable';
				}
			}, { // [105]
				caption: 'Bumper Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(105)) return 'available';
					return (canReachOutcast() && items.glove > 0 && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [106]
				caption: 'Fortune Teller',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return (canReachOutcast()) ? 'available' : 'unavailable';
				}
			}, { // [107]
				caption: 'Chest Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return (canReachOutcast()) ? 'available' : 'unavailable';
				}
			}, { // [108]
				caption: 'Thieves\' Town',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(108)) return 'available';
					return (canReachOutcast() && items.moonpearl) ? 'available' : 'unavailable';
				}
			}, { // [109]
				caption: 'C-Shaped House',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					return (canReachOutcast()) ? 'available' : 'unavailable';
				}
			}, { // [110]
				caption: 'Shop (VoO)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(110)) return 'available';
					return (canReachOutcast() && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
				}
			}, { // [111]
				caption: 'Bombable Hut {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(111)) return 'available';
					return (canReachOutcast() && items.moonpearl && items.bomb) ? 'available' : 'unavailable';
				}
			}, { // [112]
				caption: 'Hammer Peg Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(112)) return 'available';
					return (canReachOutcast() && items.moonpearl && items.hammer && items.glove === 2) ? 'available' : 'unavailable';
				}
			}, { // [113]
				caption: 'Arrow Game',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(113)) return 'available';
					return (canReachOutcast() || canReachDarkWorldSouth()) ? 'available' : 'unavailable';
				}
			}, { // [114]
				caption: 'Palace of Darkness',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(114)) return 'available';
					return (items.moonpearl && canReachDarkWorldEast()) ? 'available' : 'unavailable';
				}
			}, { // [115]
				caption: 'Hint (North)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(115)) return 'available';
					return canReachDarkWorldEast() ? 'available' : 'unavailable';
				}
			}, { // [116]
				caption: 'Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(116)) return 'available';
					return canReachDarkWorldEast() ? 'available' : 'unavailable';
				}
			}, { // [117]
				caption: 'Hint (South)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(117)) return 'available';
					return canReachDarkWorldEast() ? 'available' : 'unavailable';
				}
			}, { // [118]
				caption: 'Ice Palace',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(118)) return 'available';
					if (hasFoundEntrance(64) && items.glove === 2) return 'available';
					if (!items.flippers || items.glove < 2) return 'unavailable';
					return 'available';
				}
			}, { // [119]
				caption: 'Shop (Dark Lake)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(119)) return 'available';
					return (canReachDarkWorldSouth()) ? 'available' : 'unavailable';
				}
			}, { // [120]
				caption: 'Ledge Fairy {bomb}',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(120)) return 'available';
					return (canReachDarkWorldSouthEast() && items.moonpearl && items.bomb) ? 'available' : 'unavailable';
				}
			}, { // [121]
				caption: 'Ledge Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(121)) return 'available';
					return (canReachDarkWorldSouthEast()) ? 'available' : 'unavailable';
				}
			}, { // [122]
				caption: 'Ledge Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(122)) return 'available';
					return (canReachDarkWorldSouthEast() && items.moonpearl && items.glove > 0) ? 'available' : 'unavailable';
				}
			}, { // [123]
				caption: 'Misery Mire',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(123)) return 'available';
					if (!canReachMiseryMire() || !items.moonpearl || medallionCheck(0) === 'unavailable') return 'unavailable';
					return (medallionCheck(0) === 'possible') ? 'possible' : 'available';
				}
			}, { // [124]
				caption: 'Shed',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(124)) return 'available';
					return (canReachMiseryMire()) ? 'available' : 'unavailable';
				}
			}, { // [125]
				caption: 'Fairy',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(125)) return 'available';
					return (canReachMiseryMire()) ? 'available' : 'unavailable';
				}
			}, { // [126]
				caption: 'Hint',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(126)) return 'available';
					return (canReachMiseryMire()) ? 'available' : 'unavailable';
				}
			}, { // [127]
				caption: 'Ganon\'s Tower',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(127)) return 'available';
					if (canReachDWDMNorth()) {
						if (flags.opentowercount == 8) {
							return 'possible';
						}
						return ((crystalCheck() >= flags.opentowercount)) ? 'available' : 'unavailable';
					}
					return 'unavailable';
				}
			}, { // [128]
				caption: 'Spike Cave',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(128)) return 'available';
					return (canReachWDM() || canReachWDMNorth() || canReachDWWDM()) ? 'available' : 'unavailable';
				}
			}, { // [129]
				caption: 'Bumper Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(129)) return 'available';
					return 'unavailable';
				}
			}, { // [130]
				caption: 'Fairy Spring',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(130)) return 'available';
					return (canReachWDM() || canReachWDMNorth() || canReachDWWDM()) ? 'available' : 'unavailable';
				}
			}, { // [131]
				caption: 'Hookshot Cave (Exit)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(131)) return 'available';
					return 'unavailable';
				}
			}, { // [132]
				caption: 'Hookshot Cave (Entrance)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(132)) return 'available';
					return (canReachDWDMNorth() && items.moonpearl && items.glove > 0) ? 'available' : 'unavailable';
				}
			}, { // [133]
				caption: 'Superbunny Cave (Top)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(133)) return 'available';
					return (canReachDWDMNorth()) ? 'available' : 'unavailable';
				}
			}, { // [134]
				caption: 'Superbunny Cave (Bottom)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(134)) return 'available';
					return (canReachDWEDM()|| (canReachEDM() && items.glove === 2)) ? 'available' : 'unavailable';
				}
			}, { // [135]
				caption: 'Shop (DDM)',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(135)) return 'available';
					return (canReachDWEDM()|| (canReachEDM() && items.glove === 2)) ? 'available' : 'unavailable';
				}
			}, { // [136]
				caption: 'Turtle Rock - Main Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(136)) return 'available';
					if (!canReachEDMNorth() || !items.moonpearl || !items.hammer || items.glove < 2 || medallionCheck(1) === 'unavailable') return 'unavailable';
					return (medallionCheck(1) === 'possible') ? 'possible' : 'available';
					
				}
			}, { // [137]
				caption: 'Turtle Rock - Back Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(137)) return 'available';
					return 'unavailable';
				}
			}, { // [138]
				caption: 'Turtle Rock Ledge - West Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(138)) return 'available';
					if (hasFoundEntrance(139)) return 'available';
					return 'unavailable';
				}
			}, { // [139]
				caption: 'Turtle Rock Ledge - East Entrance',
				is_opened: false,
				note: '',
				known_location: '',
				is_connector: false,
				is_available: function() {
					if (hasFoundEntrance(139)) return 'available';
					if (hasFoundEntrance(138)) return 'available';
					return 'unavailable';
				}
			}];		
			
			
			// define dungeon chests
			window.dungeons = [{ // [0]
				caption: 'Eastern Palace',
				is_beaten: false,
				is_beatable: function() {
					return dungeonBoss(0,[hasFoundLocation('ep') ? 'available' : 'unavailable'],[false]);
				},
				can_get_chest: function() {
					return dungeonChests(0,[hasFoundLocation('ep') ? 'available' : 'unavailable'],[false]);
				}
			}, { // [1]
				caption: 'Desert Palace',
				is_beaten: false,
				is_beatable: function() {
					return dungeonBoss(1,[hasFoundLocation('dp_m') ? 'available' : 'unavailable',hasFoundLocation('dp_w') ? 'available' : 'unavailable',hasFoundLocation('dp_e') ? 'available' : 'unavailable',hasFoundLocation('dp_n') ? 'available' : 'unavailable'],[false,false,false,false]);
				},
				can_get_chest: function() {
					return dungeonChests(1,[hasFoundLocation('dp_m') ? 'available' : 'unavailable',hasFoundLocation('dp_w') ? 'available' : 'unavailable',hasFoundLocation('dp_e') ? 'available' : 'unavailable',hasFoundLocation('dp_n') ? 'available' : 'unavailable'],[false,false,false,false]);
				}
			}, { // [2]
				caption: 'Tower of Hera',
				is_beaten: false,
				is_beatable: function() {
					return dungeonBoss(2,[hasFoundLocation('toh') ? 'available' : 'unavailable'],[false]);
				},
				can_get_chest: function() {
					return dungeonChests(2,[hasFoundLocation('toh') ? 'available' : 'unavailable'],[false]);
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
					if (!canReachOutcast() || !canReachDarkWorld()) return 'unavailable';
					return window.SWBoss();
				},
				can_get_chest: function() {
					if (!canReachOutcast() || !canReachDarkWorld()) return 'unavailable';
					return window.SWChests();
				}
			}, { // [6]
				caption: 'Thieves\' Town',
				is_beaten: false,
				is_beatable: function() {
					if (!canReachOutcast() || !canReachDarkWorld()) return 'unavailable';
					return window.TTBoss();
				},
				can_get_chest: function() {
					if (!canReachOutcast() || !canReachDarkWorld()) return 'unavailable';
					return window.TTChests();
				}
			}, { // [7]
				caption: 'Ice Palace {flippers} [{firerod}/{bombos}]',
				is_beaten: false,
				is_beatable: function() {
					if (!items.moonpearl || !items.flippers || items.glove !== 2 || !canReachDarkWorld()) return 'unavailable';
					if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPBoss();
				},
				can_get_chest: function() {
					if (!items.moonpearl || !items.flippers || items.glove !== 2 || !canReachDarkWorld()) return 'unavailable';
					if (!items.firerod && (!items.bombos || items.bombos && (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
					return window.IPChests();
				}
			}, { // [8]
				caption: 'Misery Mire {medallion0} [{boots}/{hookshot}]',
				is_beaten: false,
				is_beatable: function() {
					if (!items.moonpearl || !items.flute || items.glove !== 2 || !canReachDarkWorld()) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					if (!items.bigkey8) return 'unavailable';
					var state = medallionCheck(0);
					if (state) return state;
					return window.MMBoss();
				},
				can_get_chest: function() {
					if (!items.moonpearl || !items.flute || items.glove !== 2 || !canReachDarkWorld()) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallionCheck(0);
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
					var state = medallionCheck(1);
					if (state) return state;
					return window.TRFrontBoss();
				},
				can_get_chest: function() {
					if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !canReachDarkWorld()) return 'unavailable';
					if (!items.hookshot && !items.mirror) return 'unavailable';
					if (!items.somaria) return 'unavailable';
					var state = medallionCheck(1);
					if (state) return state;				
					return window.TRFrontChests();
				}
			}, { // [10]
				caption: 'Ganon\'s Castle (Crystals)',
				is_beaten: false,
				is_beatable: function() {
					if (crystalCheck() < flags.ganonvulncount || !canReachDarkWorld()) return 'unavailable';
					//Fast Ganon
					if (flags.goals === 'F' && (items.sword > 1 || flags.swordmode === 'S' && (items.hammer || items.net)) && (items.lantern || items.firerod)) return 'available';
					return window.GTBoss();
				},
				can_get_chest: function() {
					if (crystalCheck() < flags.opentowercount || items.glove < 2 || !items.hammer || !canReachDarkWorld()) return 'unavailable';
					return window.GTChests();
				}
			}, { // [11]
				caption: 'Hyrule Castle',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return items.chest11 ?window.dungeons[11].can_get_chest() :'opened';
				},
				can_get_chest: function() {
					return window.HCChests();
				}
			}, { // [12]
				caption: 'Castle Tower',//Only used with Entrance or Door Shuffle
				is_beaten: false,
				is_beatable: function() {
					return window.agahnim.is_available();
				},
				can_get_chest: function() {
					return window.CTChests();
				}
			}];

			window.agahnim = {
				caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
				is_available: function() {
					return window.CTBoss();
				}
			};

			//define overworld chests
			window.chests = [{ // [0]
				caption: 'Dam (Underwater)',
				is_opened: false,
				is_available: function () {
					return hasFoundLocation('dam') ? 'available' : 'unavailable';
				}
			}, { // [1]
				caption: 'Stoops Lonk\'s Hoose',
				is_opened: (flags.gametype === 'S'),
				is_available: always
			}, { // [2]
				caption: 'Bottle Vendor: Pay 100 rupees',
				is_opened: false,
				is_available: always
			}, { // [3]
				caption: 'Ol\' Stumpy',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && (canReachOutcast() || canReachDarkWorldSouth() || items.agahnim && items.hammer) ? 'available' : 'unavailable';
				}
			}, { // [4]
				caption: 'Gary\'s Lunchbox (save the frog first)',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
				}
			}, { // [5]
				caption: 'Fugitive under the bridge {flippers}',
				is_opened: false,
				is_available: function() {
					return items.flippers ? 'available' : 'unavailable';
				}
			}, { // [6]
				caption: 'Ether Tablet {sword2}{book}',
				is_opened: false,
				is_available: function() {
					if ((canReachWDMNorth() || (canReachDWWDM() && items.mirror)) && items.book) {
						return (items.sword >= 2 || (flags.swordmode === 'S' && items.hammer)) ? 'available' : 'information';
					}
					return 'unavailable';
				}
			}, { // [7]
				caption: 'Bombos Tablet {mirror}{sword2}{book}',
				is_opened: false,
				is_available: function() {
					return items.book && items.mirror && canReachDarkWorldSouth() ?
						(items.sword >= 2 || (flags.swordmode === 'S' && items.hammer))? 'available' : 'information' :
						'unavailable';
				}
			}, { // [8]
				caption: 'Catfish',
				is_opened: false,
				is_available: function() {
					if ((canReachDarkWorldEast() || hasFoundEntrance(92)) && items.moonpearl && items.glove) return 'available';
					return items.moonpearl && items.glove && (items.agahnim || items.hammer || items.glove === 2 && items.flippers) ?
						'available' : 'unavailable';
				}
			}, { // [9]
				caption: 'King Zora: Pay 500 rupees',
				is_opened: false,
				is_available: function() {
					return items.flippers || items.glove ? 'available' : 'unavailable';
				}
			}, { // [10]
				caption: 'Lost Old Man {lantern}',
				is_opened: false,
				is_available: function() {
					if (canReachWDMNorth()) {
						return items.lantern ? 'available' : 'darkavailable';
					}
					if (canReachWDM()) {
						return items.lantern ? 'possible' : 'darkpossible';
					}
					return 'unavailable';
				}
			}, { // [11]
				caption: 'Mushroom',
				is_opened: false,
				is_available: always
			}, { // [12]
				caption: 'Spectacle Rock {mirror}',
				is_opened: false,
				is_available: function() {
					if (canReachWDM()) {
						return items.mirror ? 'available' : 'information';
					}
					return 'unavailable';
				}
			}, { // [13]
				caption: 'Floating Island {mirror}',
				is_opened: false,
				is_available: function() {
					return (hasFoundEntrance(131) && items.mirror) ? 'available' : (canReachEDMNorth() ? 'information' : 'unavailable');
				}
			}, { // [14]
				caption: 'Race Minigame',
				is_opened: false,
				is_available: function() {
					return (hasFoundEntrance(46) || (canReachDarkWorldSouth() && items.mirror) ? 'available' : 'information');
				}
			}, { // [15]
				caption: 'Desert West Ledge',
				is_opened: false,
				is_available: function() {
					return (hasFoundEntrance(54) || (items.mirror && canReachMiseryMire()) || (items.flute && items.glove === 2 && items.mirror) || (hasFoundEntrance(56) && items.glove > 0)) ? 'available' : 'information';
				}
			}, { // [16]
				caption: 'Lake Hylia Island {mirror}',
				is_opened: false,
				is_available: function() {
					return items.flippers && items.mirror && items.moonpearl && (canReachDarkWorldEast() || canReachDarkWorldSouth()) ? 'available' : 'information';
				}
			}, { // [17]
				caption: 'Bumper Cave {cape}',
				is_opened: false,
				is_available: function() {
					return hasFoundEntrance(129) ? 'available' : (canReachOutcast() ? 'information' : 'unavailable');
				}
			}, { // [18]
				caption: 'Pyramid',
				is_opened: false,
				is_available: function() {
					return canReachDarkWorldEast() || items.agahnim || items.glove && items.hammer && items.moonpearl || items.glove === 2 && items.moonpearl && items.flippers ? 'available' : 'unavailable';
				}
			}, { // [19]
				caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
				is_opened: false,
				is_available: function() {
					return items.moonpearl && (canReachOutcast() || canReachDarkWorldSouth() || (items.agahnim && items.moonpearl && items.hammer)) ? 'available' : 'unavailable';
				}
			}, { // [20]
				caption: 'Zora River Ledge {flippers}',
				is_opened: false,
				is_available: function() {
					if (items.flippers) return 'available';
					if (items.glove) return 'information';
					return 'unavailable';
				}
			}, { // [21]
				caption: 'Buried Itam {shovel}',
				is_opened: false,
				is_available: function() {
					return items.shovel ? 'available' : 'unavailable';
				}
			}, { // [22]
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
	};

}(window));
