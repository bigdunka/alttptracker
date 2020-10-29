(function(window) {
    'use strict';

	function melee() { return items.sword || items.hammer; }
    function melee_bow() { return melee() || items.bow > 0; }
    function cane() { return items.somaria || items.byrna; }
    function rod() { return items.firerod || items.icerod; }

    function medallion_check(i) {
        if ((items.sword === 0 && flags.swordmode != 'S') || !items.bombos && !items.ether && !items.quake) return 'unavailable';
        if (medallions[i] === 1 && !items.bombos ||
            medallions[i] === 2 && !items.ether ||
            medallions[i] === 3 && !items.quake) return 'unavailable';
		if (items.bombos && items.ether && items.quake) return 'available';
        if (medallions[i] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';
		return 'available';
    }

	//Check which boss is at the end of the dungeon
	function enemizer_check(i) {
		//All possible required items to kill a boss
		if (melee() && items.hookshot && items.icerod && items.firerod) return 'available';
		if (!melee_bow() && !rod() && !cane() && items.boomerang === 0) return 'unavailable';
		switch (enemizer[i]) {
			case 0:
				return (flags.bossshuffle != 'N' ? 'possible' : 'available');
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
				if (items.firerod || (items.bombos && (items.sword > 0 || (flags.swordmode === 'S' && items.hammer)))) return 'available';
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

	function can_reach_outcast() {
		return items.moonpearl && (items.glove === 2 || items.glove && items.hammer || items.agahnim && items.hookshot && (items.hammer || items.glove || items.flippers));
	}
	
	function canReachOtherWorld() //Can get from light => dark, or dark => light
	{
		return items.moonpearl && (items.glove === 2 || items.glove && items.hammer || items.agahnim);
	}
	
	function canReachLightWorldBunny() //Can walk around in Light World as bunny or Link
	{
		return items.agahnim || canReachOtherWorld() || (items.glove === 2 && activeFlute());
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
		return items.flute && canReachOtherWorld();
	}
	
	function available_chests(dungeonid, allchests, maxchest, chestcount) {
		var achests = 0;
		var pchests = 0;
		var dachests = 0;
		var dpchests = 0;
		var uchests = 0;
		var keys = 0;

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
				case 'K':
					keys++;
					break;
			}
		}
		
		//Move dungeon items from available to possible
		if (!flags.wildmaps) {
			if (achests > 0) {
				pchests++;
				achests--;
			} else if (dachests > 0) {
				dpchests++;
				dachests--;
			}
		}
		
		if (!flags.wildcompasses) {
			if (achests > 0) {
				pchests++;
				achests--;
			} else if (dachests > 0) {
				dpchests++;
				dachests--;
			}
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
		
		if (flags.ambrosia === 'Y' && chestcount === 1 && !dungeons[dungeonid].is_beaten) {
			switch (dungeonid) {
				case 0:
					return EPBoss();
					break;
				case 1:
					return DPBoss();
					break;
				case 2:
					return HeraBoss();
					break;
				case 3:
					return PoDBoss();
					break;
				case 4:
					return SPBoss();
					break;
				case 5:
					return SWBoss();
					break;
				case 6:
					return TTBoss();
					break;
				case 7:
					return IPBoss();
					break;
				case 8:
					return MMBoss();
					break;
				case 9:
					if (flags.gametype === 'I' && items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2))) {
						return window.TRBackBoss();
					}
					return TRFrontBoss();
					break;
			}
		}
		
		if (achests > 0) return 'available';
		if (dachests > 0) return 'darkavailable';
		if (pchests > 0) return 'possible';
		if (dpchests > 0) return 'darkpossible';
		return 'unavailable';
	}

	function maxKeys(dungeon)
	{
		return flags.doorshuffle === 'C' ? 29 : [0,1,1,6,1,3,1,2,3,4,4,1,2][dungeon];
	}

	function freeDungeonItems(dungeon)
	{
		return 0;//Might be improved in the future?
		
		/* if(flags.doorshuffle === 'C')
			return 0;//Might be improved in the future?
		switch(dungeon)
		{
			case 2:
			case 6:
				return flags.wildbigkeys ? 1 : 0;
			case 4:
				return flags.wildbigkeys && items.flippers ? 1 : 0;
			case 5:
				return flags.wildbigkeys && flags.entrancemode === 'N' ? 1 : 0;
			case 9:
				var count = 0;
				switch(flags.dungeonitems)
				{
					case 'K':
						count--;
						break;
					case 'S':
						count -= flags.gametype === 'R' ? 3 : 7;
						break;
					case 'M':
						count -= flags.gametype === 'R' ? 1 : 5;
				}
				if(flags.gametype === 'I' && (items.glove || activeFlute()) && items.mirror && ((items.hookshot && items.moonpearl) || items.glove === 2) && (items.cape || items.byrna || items.shield === 3))
					count += 4;//Has access to laser bridge
				if(flags.gametype === 'I' && (items.glove || activeFlute()) && items.mirror && ((items.hookshot && items.moonpearl) || items.glove === 2) && (items.hookshot || items.somaria) && flags.wildbigkeys && items.bigkey9)
					count++;//Has access to big chest
				return Math.max(0,count);
		}
		return 0; */
	}

	function door_enemizer_check(dungeon) {
		return (dungeon === 6 && flags.doorshuffle === 'C' && !items.bombfloor) || (dungeon === 7 && (!items.hammer || items.glove == 0)) ? 'unavailable' : enemizer_check(dungeon);
	}

	window.doorCheck = function(dungeon,onlyDarkPossible,darkRoom,torchDarkRoom,posRequired,goal) {
		if(flags.doorshuffle === 'N')
			return null;
		var doorcheck = goal === 'boss' && dungeon < 10 ? door_enemizer_check(dungeon) : 'available';
		if(doorcheck === 'unavailable')
			return 'unavailable';//Can't beat boss
		//if(goal === 'boss' && dungeon == 6 && flags.doorshuffle === 'C' && !items.bombfloor)
		//	return 'unavailable';
		//if(doorcheck === 'available' && goal === 'item' && dungeon == 6 && flags.doorshuffle === 'C' && !items.bombfloor)
		//	doorcheck = 'possible';
		if(goal === 'item' && dungeon <= 10 && flags.doorshuffle === 'B' && items['maxchest'+dungeon]-items['chest'+dungeon] < freeDungeonItems(dungeon))
			return onlyDarkPossible ? 'darkavailable' : 'available';//At least one item available no matter how the dungeon is shuffled
		if(goal === 'item' && dungeon < 10 && flags.doorshuffle === 'B' && !items['boss'+dungeon] && door_enemizer_check(dungeon) != 'available' && items['chest'+dungeon] == 1)
		{
			if(door_enemizer_check(dungeon) === 'unavailable' && flags.wildmaps && flags.wildcompasses && flags.wildkeys && flags.wildbigkeys)
				return 'unavailable';//Boss has last item
			doorcheck = 'possible';//Boss could have last item
		}
		if(goal === 'item' && dungeon < 10 && flags.doorshuffle === 'C' && !items['boss'+dungeon] && door_enemizer_check(dungeon) != 'available' && items['chest'+dungeon] <= 2)
			doorcheck = 'possible';//Boss could have last item
		if(goal === 'item' && dungeon <= 10 && flags.doorshuffle === 'C' && items['chest'+dungeon] === 1)
			doorcheck = 'possible';//Unknown if even one item is still in there
		var dungeonAlt = dungeon > 10 ? 'half'+(dungeon-11) : ''+dungeon;
		if(doorcheck === 'available' && flags.wildkeys && flags.gametype != 'R' && items['smallkey'+dungeonAlt] < maxKeys(dungeon))
			doorcheck = 'possible';//Could need more small keys
		if(doorcheck === 'available' && flags.wildbigkeys && (dungeon <= 10 || flags.doorshuffle === 'C') && !items['bigkey'+dungeonAlt])
			doorcheck = 'possible';//Could need big key
		if(flags.doorshuffle === 'C')
		{
			posRequired = ['firerod','somaria','flippers','hookshot','boots','bow','hammer','swordorswordless','glove',goal === 'item' || !flags.wildkeys || !flags.wildbigkeys ? 'laserbridge' : '',flags.gametype != 'I' && flags.entrancemode === 'N' && dungeon === 1 ? 'mirrordesert' : '',flags.gametype === 'I' && flags.entrancemode === 'N' && dungeon === 5 ? 'mirrorskull' : '',flags.bossshuffle === 'N' ? '' : 'icerod'];
			darkRoom = torchDarkRoom = true;
		}
		if(doorcheck === 'available')
		{
			label:
			for(var i = 0; i < posRequired.length; i++) {
				switch(posRequired[i])
				{
					case '':
						break;
					case 'firesource':
						if(!items.lantern && !items.firerod)
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'hookboots':
						if(!items.hookshot && !items.boots)
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'wizzrobe':
						if(!melee_bow() && !rod() && !cane())
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'freezor':
						if(!items.firerod && (!items.bombos || (items.sword === 0 && flags.swordmode != 'S')))
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'swordorswordless':
						if(items.sword === 0 && flags.swordmode != 'S')
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'laserbridge':
						if(!items.cape && !items.byrna && items.shield < 3)
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'mirrordesert':
						if(!items.mirror || !items.flute || items.glove < 2)
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'mirrorskull':
						if(!items.mirror || !canReachLightWorldBunny())
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					default:
						if(!items[posRequired[i]])
						{
							doorcheck = 'possible';
							break label;
						}
				}
			}
		}
		if(onlyDarkPossible)
			doorcheck = 'dark'+doorcheck;
		if(doorcheck === 'available' && !onlyDarkPossible && !items.lantern && (darkRoom || (torchDarkRoom/* && (!items.firerod || flags.itemplacement === 'B')*/)))//Advanced placement in the future?
			doorcheck = 'possible';//Could require light source
		return doorcheck;
	};
	
    window.EPBoss = function() {
		var dungeoncheck = enemizer_check(0);
		//Standard check
		if (!items.bigkey0 || dungeoncheck === 'unavailable') return 'unavailable';
		if (items.bow === 0 && flags.enemyshuffle === 'N') return 'unavailable';
		//Dark Room check
		if (!items.lantern) {
			if (flags.wildbigkeys) {
				if (items.firerod) return dungeoncheck;
				return dungeoncheck === 'possible' ? 'darkpossible' : 'darkavailable';
			} else {
				if (items.firerod) return 'possible';
				return dungeoncheck === 'possible' ? 'darkpossible' : 'darkavailable';
			}
		}
		return dungeoncheck;
    };

    window.DPBoss = function() {
		var dungeoncheck = enemizer_check(1);
		if (!items.bigkey1 || dungeoncheck === 'unavailable' || items.glove === 0 || (!items.firerod && !items.lantern)) return 'unavailable';
		if (flags.wildkeys && !flags.wildbigkeys && (items.smallkey1 === 0 && flags.gametype != 'R') && !items.boots) return 'possible';
		if (!flags.wildkeys && !flags.wildbigkeys && !items.boots) return 'possible';
		return dungeoncheck;
    };

    window.HeraBoss = function() {
		var dungeoncheck = enemizer_check(2);
		if (!items.bigkey2 || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildbigkeys) return (dungeoncheck === 'available' ? ((!items.flute && !items.lantern) ? 'darkavailable' : 'available') : ((!items.flute && !items.lantern) ? 'darkpossible' : 'possible')); 
		if ((flags.wildkeys && (items.smallkey2 === 0 && flags.gametype != 'R')) || (!items.lantern && !items.firerod)) return (!items.flute && !items.lantern) ? 'darkpossible' : 'possible';
		return (dungeoncheck === 'available' ? ((!items.flute && !items.lantern) ? 'darkavailable' : 'available') : ((!items.flute && !items.lantern) ? 'darkpossible' : 'possible'));
    };

    window.PoDBoss = function() {
		var dungeoncheck = enemizer_check(3);
		if (!items.bigkey3 || !items.hammer || items.bow === 0 || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildbigkeys || flags.wildkeys) {
			if (items.smallkey3 < 5 && flags.gametype != 'R') return 'unavailable';
			if (items.smallkey3 === 5 && flags.gametype != 'R') {
				return (items.lantern ? 'possible' : 'darkpossible');
			} else {
				return (dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
			}
		} else {
			return (dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
		}
    };

    window.SPBoss = function() {
		var dungeoncheck = enemizer_check(4);
		if (!items.hammer || !items.hookshot || (items.smallkey4 === 0 && flags.gametype != 'R')) return 'unavailable';
		return dungeoncheck;
    };

    window.SWBoss = function() {
		var dungeoncheck = enemizer_check(5);
		if (!items.firerod || (items.sword === 0 && flags.swordmode != 'S')) return 'unavailable';
		return dungeoncheck;
	};

    window.TTBoss = function() {
		var dungeoncheck = enemizer_check(6);
		return (items.bigkey6 ? dungeoncheck : 'unavailable');
    };

    window.IPBoss = function() {
		var dungeoncheck = enemizer_check(7);
		if (!items.hammer || dungeoncheck == 'unavailable') return 'unavailable';
		if (flags.wildbigkeys) {
			if (!items.bigkey7 && !items.somaria && !items.hookshot) return 'unavailable';
			if (!items.hookshot && items.somaria && !items.bigkey7) return 'possible';
		} else {
			if (!items.hookshot && !items.somaria) return 'possible';
		}
		
		return dungeoncheck;
    };

    window.MMBoss = function() {
		if (medallion_check(0) === 'unavailable') return 'unavailable';
		var dungeoncheck = enemizer_check(8);
		if (!items.bigkey8 || !items.somaria || dungeoncheck === 'unavailable') return 'unavailable';
		if (dungeoncheck === 'available' && medallion_check(0) === 'available') {
			if (items.lantern) {
				return 'available';
			}
			return (items.firerod ? 'darkavailable' : 'darkpossible');
		}
    };

    window.TRFrontBoss = function() {
		if (medallion_check(1) === 'unavailable') return 'unavailable';
		var dungeoncheck = enemizer_check(9);
		if (!items.bigkey9 || !items.somaria || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildkeys) {
			if (items.smallkey9 < 4 && flags.gametype != 'R') return 'unavailable';
		}
		return (dungeoncheck === 'available' && medallion_check(1) === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
    };

	window.TRMidBoss = function() {
		var dungeoncheck = enemizer_check(9);
		if (!items.bigkey9 || !items.somaria || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildbigkeys || flags.wildkeys) {
			if (items.smallkey9 < 2 && flags.gametype != 'R') return 'unavailable';
			if ((items.smallkey9 < 4 && flags.gametype != 'R') || medallion_check(1) === 'possible') return 'possible';
			return dungeoncheck;
		} else {
			if (!items.firerod) return 'possible';
			return (dungeoncheck === 'available' && medallion_check(1) === 'available' ? (items.lantern ? 'avaialble' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
		}
    };
	
    window.TRBackBoss = function() {
		var dungeoncheck = enemizer_check(9);
		if (!items.bigkey9 || !items.somaria || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildkeys) {
			if (items.smallkey9 === 0 && flags.gametype != 'R') return 'unavailable';
			if ((items.smallkey9 < 4 && flags.gametype != 'R') || medallion_check(1) === 'possible') return 'possible';
			return dungeoncheck;
		} else {
			if (!items.firerod) return 'possible';
			return (dungeoncheck === 'available' && medallion_check(1) === 'available' ? (items.lantern ? 'avaialble' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
		}
    };

    window.GTBoss = function() {
		var dungeoncheck = enemizer_check(0);
		
		if (!items.bigkey10 || (items.bow === 0 && flags.enemyshuffle === 'N') || (!items.lantern && !items.firerod) || !items.hookshot || ((items.sword < 2 && flags.swordmode != 'S') || (flags.swordmode === 'S' && !items.hammer)) || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildkeys) {
			if (items.smallkey10 === 0 && flags.gametype != 'R') return 'unavailable';
			if (items.smallkey10 < 3 && flags.gametype != 'R') return 'possible';
		}
		
		return dungeoncheck;
    };
	
	function ConvertBossToChest(x) {
		switch(x) {
			case 'available':
				return 'A';
			case 'possible':
				return 'P';
			case 'darkavailable':
				return 'DA';
			case 'darkpossible':
				return 'DP';
			case 'unavailable':
				return 'U';
		}
	}
	
	window.EPChests = function() {
		var dungeoncheck = enemizer_check(0);
		
		var chests = ['U','U','U','U','U','U'];
		
		//Cannonball Chest
		chests[0] = 'A';
		//Compass Chest
		chests[1] = 'A';
		//Map Chest
		chests[2] = 'A';				
		//Big Chest
		if (flags.wildbigkeys) {
			chests[3] = (items.bigkey0 ? 'A' : 'U');
		} else if (!flags.wildmaps && !flags.compasses && !flags.wildmkeys && !flags.wildbigkeys) {
			chests[3] = (items.lantern ? 'K' : 'P'); //Key replaces itself
		} else {
			chests[3] = 'K'; //Key replaces itself
		}
		//Big Key Chest
		if (!flags.wildmaps && !flags.compasses && !flags.wildmkeys && !flags.wildbigkeys) {
			chests[4] = (items.lantern ? 'A' : ((items.bow > 0 && dungeoncheck === 'available') ? 'DA' : 'P'));
		} else {
			chests[4] = (items.lantern ? 'A' : 'DA');
		}
		//Boss
		chests[5] = ConvertBossToChest(EPBoss());
		
		return available_chests(0, chests, items.maxchest0, items.chest0); 		
    };

    window.DPChests = function() {
		var chests = ['U','U','U','U','U','U'];

		//Map Chest
		chests[0] = 'A';
		
		//Torch
		if (items.boots) {
			// If not wild keys, this will be set as a key
			if (!flags.wildkeys && flags.gametype != 'R') {
				chests[1] = 'K';
			} else {
				//if it is wild keys or retro, it will simply be an item, even if the big key is wild, as that will be replaced with the big chest
				chests[1] = 'A';
			}
		}
		
		//Compass Chest
		//Big Key Chest
		if (flags.gametype == 'R') {
			//If retro, simply available
			chests[2] = 'A';
			chests[3] = 'A';
		} else {
			//If wild keys simply need a key
			if (flags.wildkeys) {
				chests[2] = (items.smallkey1 === 1 ? 'A' : 'U');
				chests[3] = (items.smallkey1 === 1 ? 'A' : 'U');
			} else {
				//If wild keys is off, but wild big keys is on, then it is only available if both boots and big key, otherwise possible
				if (flags.wildbigkeys) {
					if (items.boots) {
						//If Boots, two items at a minimum are avaialble, so flagging compass as available as always with boots,
						//where the rest are only possible without the big key
						chests[2] = 'A';
						chests[3] = (items.bigkey1 && items.boots ? 'A' : 'P');
					} else {
						chests[2] = (items.bigkey1 && items.boots ? 'A' : 'P');
						chests[3] = (items.bigkey1 && items.boots ? 'A' : 'P');
					}
				} else {
					//Neither wild keys is on, available with boots, otherwise possible
					chests[2] = (items.boots ? 'A' : 'P');
					chests[3] = (items.boots ? 'A' : 'P');
				}
			}
		}
		
		//Big Chest
		if (flags.wildbigkeys) {
			//If wild big keys, always simply available with the key
			chests[4] = (items.bigkey1 ? 'A' : 'U');
		} else {
			//In all non-wild big keys, it will be replaced by itself
			if (flags.wildkeys) {
				//Need both the small key and boots to be available, else it will be possible because it could be in the map chest
				chests[4] = (items.boots && items.smallkey === 1 ? 'K' : 'P');
			} else {
				//If both wild keys and wild big keys are off, available with boots, but still possible without
				chests[4] = (items.boots ? 'K' : 'P');
			}
				
		}
		
		//Boss
		chests[5] = ConvertBossToChest(DPBoss());
		
		return available_chests(1, chests, items.maxchest1, items.chest1);
    };

    window.HeraChests = function() {
		var isDark = (!items.flute && !items.lantern);
		
		var chests = ['U','U','U','U','U','U'];

		//Small Key
		if (flags.wildbigkeys && (flags.wildkeys || flags.gametype === 'R')) {
			chests[0] = (isDark ? 'DA' : 'A');
		} else {
			chests[0] = (items.lantern || items.firerod) ? 'K' : (isDark ? 'DP' : 'P'); //Setting this as the small key as it is always available with a fire source
		}
		
		//Map
		chests[1] = (isDark ? 'DA' : 'A');

		//Big Key Chest
		if (flags.wildbigkeys) {
			if ((items.smallkey2 === 0 && flags.gametype != 'R') || (!items.lantern && !items.firerod)) {
				chests[2] = 'U';
			} else {
				//This needs to be only possible, because the small key could be locked upstairs in wild big keys
				chests[2] = (isDark ? 'DP' : 'P');
			}
		} else {
			if (items.lantern || items.firerod) {
				chests[2] = 'K';
			} else {
				chests[2] = 'U';
			}
		}

		//Compass Chest
		if (flags.wildbigkeys) {
			chests[3] = (items.bigkey2 ? (isDark ? 'DA' : 'A') : 'U');
		} else if (flags.wildkeys) {
			if (items.smallkey2 === 1 && (items.lantern || items.firerod)) {
				chests[3] = (isDark ? 'DA' : 'A');
			} else {
				chests[3] = (isDark ? 'DP' : 'P');
			}
		} else {
			if (items.lantern || items.firerod) {
				chests[3] = (isDark ? 'DA' : 'A');
			} else {
				chests[3] = (isDark ? 'DP' : 'P');
			}
		}
		
		//Big Chest
		if (flags.wildbigkeys) {
			chests[4] = (items.bigkey2 ? (isDark ? 'DA' : 'A') : 'U');
		} else if (flags.wildkeys || flags.gametype === 'R') {
			if ((items.smallkey2 === 1 || flags.gametype === 'R') && (items.lantern || items.firerod)) {
				chests[4] = (isDark ? 'DA' : 'A');
			} else {
				chests[4] = (isDark ? 'DP' : 'P');
			}
		} else {
			if (items.lantern || items.firerod) {
				chests[4] = (isDark ? 'DA' : 'A');
			} else {
				chests[4] = (isDark ? 'DP' : 'P');
			}
		}
		
		//Boss
		chests[5] = ConvertBossToChest(HeraBoss());
		
		return available_chests(2, chests, items.maxchest2, items.chest2);
    };

    window.PoDChests = function() {
		var chests = ['U','U','U','U','U','U','U','U','U','U','U','U','U','U'];
		
		//Because of the complexity of PoD and key logic, there are going to be five modes here to consider:
		//1) No Key Shuffle
		//2) Retro (w/ Big Key shuffle checks)
		//3) Small Key shuffle only
		//4) Big Key shuffle only
		//5) Small Key + Big Key shuffle
		//
		//We will revisit this at a later time, likely v32, to try to condense
		
		//1) No Key Shuffle
		if (!flags.wildbigkeys && !flags.wildkeys && flags.gametype != 'R') {
			if (items.bow === 0 && flags.enemyshuffle === 'N') {
				//Shooter Room
				chests[0] = 'P';
				//Map Chest
				chests[1] = 'P';
				//The Arena - Ledge
				chests[2] = 'P';
				//Stalfos Basement
				chests[3] = 'P';
				//The Arena - Bridge
				chests[4] = 'P';
				//Big Key Chest
				chests[5] = 'P';
				//Compass Chest
				chests[6] = 'P';
				//Harmless Hellway
				chests[7] = 'P';
				//Dark Basement - Left
				chests[8] = (items.lantern || items.firerod) ? 'P' : 'DP';
				//Dark Basement - Right
				chests[9] = (items.lantern || items.firerod) ? 'P' : 'DP';
				//Dark Maze - Top
				chests[10] = (items.lantern ? 'P' : 'DP');
				//Dark Maze - Bottom
				chests[11] = (items.lantern ? 'P' : 'DP');
				//Big Chest
				chests[12] = (items.lantern ? 'P' : 'DP');
				//Boss
				chests[13] = 'U';
				
			} else {
				//If there is a bow, all chests are available with hammer, with dark logic
				//Reserving four keys up front, two in the back, with the big key
				
				//Shooter Room
				chests[0] = 'K'; //Reserved key 1
				//Map Chest
				chests[1] = 'A';
				//The Arena - Ledge
				chests[2] = 'K'; //Reserved key 2
				//Stalfos Basement
				chests[3] = 'K'; //Reserved key 3
				//The Arena - Bridge
				chests[4] = 'K'; //Reserved big key
				//Big Key Chest
				chests[5] = 'K'; //Reserved key 4
				//Compass Chest
				chests[6] = 'K'; //Reserved key 5
				//Harmless Hellway
				chests[7] = 'K'; //Reserved key 6
				//Dark Basement - Left
				chests[8] = (items.lantern || items.firerod) ? 'A' : 'DA';
				//Dark Basement - Right
				chests[9] = (items.lantern || items.firerod) ? 'A' : 'DA';
				//Dark Maze - Top
				chests[10] = (items.lantern ? 'A' : 'DA');
				//Dark Maze - Bottom
				chests[11] = (items.lantern ? 'A' : 'DA');
				//Big Chest
				chests[12] = (items.lantern ? 'A' : 'DA');
				//Boss
				chests[13] = ConvertBossToChest(PoDBoss());
			}
		//2) Retro (w/ Big Key shuffle checks)
		//We ignore the wild keys check, as retro overrides it
		} else if (flags.gametype === 'R') {
			chests[0] = 'A';
			
			if (items.bow > 0 || flags.enemyshuffle != 'N') {
				//Map Chest
				chests[1] = 'A';
				//The Arena - Ledge
				chests[2] = 'A';
			}
			
			chests[3] = 'A';
			chests[4] = 'A';
			chests[5] = 'A';
			chests[6] = 'A';
			chests[7] = 'A';
			chests[8] = (items.lantern || items.firerod) ? 'A' : 'DA';
			chests[9] = (items.lantern || items.firerod) ? 'A' : 'DA';
			chests[10] = (items.lantern ? 'A' : 'DA');
			chests[11] = (items.lantern ? 'A' : 'DA');
			//Big Chest
			if (items.bigkey3) {
				chests[12] = (items.lantern ? 'A' : 'DA');
			}			
		
		//3) Small Key shuffle only
		} else if (!flags.wildbigkeys && flags.wildkeys) {
			chests[0] = 'A';

			if (items.bow > 0 || flags.enemyshuffle != 'N') {
				//Map Chest
				chests[1] = 'A';
				//The Arena - Ledge
				chests[2] = 'A';
			}
			
			if ((items.hammer && (items.bow > 0 || flags.enemyshuffle != 'N')) || items.smallkey3 > 0) {
				//Stalfos Basement
				chests[3] = 'A';
				//The Arena - Bridge
				chests[4] = 'A';
			}
			
			//Big Key Chest
			if (((items.hammer && (items.bow > 0 || flags.enemyshuffle != 'N')) && items.smallkey3 > 2) || items.smallkey3 > 3) {
				chests[5] = 'A';
			}
			
			if (((items.hammer && (items.bow > 0 || flags.enemyshuffle != 'N')) && items.smallkey3 > 0) || items.smallkey3 > 1) {
				//Compass Chest
				chests[6] = 'A';
				//Dark Basement - Left
				chests[8] = (items.lantern || items.firerod) ? 'A' : 'DA';
				//Dark Basement - Right
				chests[9] = (items.lantern || items.firerod) ? 'A' : 'DA';
			}
			
			if (((items.hammer && (items.bow > 0 || flags.enemyshuffle != 'N')) && items.smallkey3 > 3) || items.smallkey3 > 4) {
				//Harmless Hellway
				chests[7] = 'A';
			}
			
			if (((items.hammer && (items.bow > 0 || flags.enemyshuffle != 'N')) && items.smallkey3 > 1) || items.smallkey3 > 2) {
				//Dark Maze - Top
				chests[10] = (items.lantern ? 'A' : 'DA');
				//Dark Maze - Bottom
				chests[11] = (items.lantern ? 'A' : 'DA');
				//Big Chest
				chests[12] = (items.lantern ? 'K' : 'DP'); // This is the big key replacement
			}
			
			//Boss
			chests[13] = ConvertBossToChest(PoDBoss());
		//4) Big Key shuffle only
		} else if (flags.wildbigkeys && !flags.wildkeys) {
			if (items.bow === 0 && flags.enemyshuffle === 'N') {
				//Shooter Room
				chests[0] = 'P';
				//Map Chest
				chests[1] = 'P';
				//The Arena - Ledge
				chests[2] = 'P';
				//Stalfos Basement
				chests[3] = 'P';
				//The Arena - Bridge
				chests[4] = 'P';
				//Big Key Chest
				chests[5] = 'P';
				//Compass Chest
				chests[6] = 'P';
				//Harmless Hellway
				chests[7] = 'P';
				//Dark Basement - Left
				chests[8] = (items.lantern || items.firerod) ? 'P' : 'DP';
				//Dark Basement - Right
				chests[9] = (items.lantern || items.firerod) ? 'P' : 'DP';
				//Dark Maze - Top
				chests[10] = (items.lantern ? 'P' : 'DP');
				//Dark Maze - Bottom
				chests[11] = (items.lantern ? 'P' : 'DP');
				//Big Chest
				chests[12] = (items.bigkey3 ? (items.lantern ? 'P' : 'DP') : 'U');
				//Boss
				chests[13] = 'U';
				
			} else {
				//If there is a bow, all chests are available with hammer, with dark logic
				//Reserving four keys up front, two in the back, with the big key
				
				//Shooter Room
				chests[0] = 'K'; //Reserved key 1
				//Map Chest
				chests[1] = 'A';
				//The Arena - Ledge
				chests[2] = 'K'; //Reserved key 2
				//Stalfos Basement
				chests[3] = 'K'; //Reserved key 3
				//The Arena - Bridge
				chests[4] = 'K'; //Reserved key 4
				//Big Key Chest
				chests[5] = 'K'; //Reserved key 5
				//Compass Chest
				chests[6] = 'K'; //Reserved key 6
				//Harmless Hellway
				chests[7] = 'A';
				//Dark Basement - Left
				chests[8] = (items.lantern || items.firerod) ? 'A' : 'DA';
				//Dark Basement - Right
				chests[9] = (items.lantern || items.firerod) ? 'A' : 'DA';
				//Dark Maze - Top
				chests[10] = (items.lantern ? 'A' : 'DA');
				//Dark Maze - Bottom
				chests[11] = (items.lantern ? 'A' : 'DA');
				//Big Chest
				chests[12] = (items.bigkey3 ? (items.lantern ? 'A' : 'DA') : 'U');
				//Boss
				chests[13] = ConvertBossToChest(PoDBoss());
			}
		//5) Small Key + Big Key shuffle
		} else {
			chests[0] = 'A';
			
			if (items.bow > 0 || flags.enemyshuffle != 'N') {
				//Map Chest
				chests[1] = 'A';
				//The Arena - Ledge
				chests[2] = 'A';
			}
			
			if ((items.hammer && (items.bow > 0 || flags.enemyshuffle != 'N')) || items.smallkey3 > 0) {
				//Stalfos Basement
				chests[3] = 'A';
				//The Arena - Bridge
				chests[4] = 'A';
			}
			
			//Big Key Chest
			if (((items.hammer && (items.bow > 0 || flags.enemyshuffle != 'N')) && items.smallkey3 > 2) || items.smallkey3 > 3) {
				chests[5] = 'A';
			}
			
			if (((items.hammer && (items.bow > 0 || flags.enemyshuffle != 'N')) && items.smallkey3 > 0) || items.smallkey3 > 1) {
				//Compass Chest
				chests[6] = 'A';
				//Dark Basement - Left
				chests[8] = (items.lantern || items.firerod) ? 'A' : 'DA';
				//Dark Basement - Right
				chests[9] = (items.lantern || items.firerod) ? 'A' : 'DA';
			}
			
			if (((items.hammer && (items.bow > 0 || flags.enemyshuffle != 'N')) && items.smallkey3 > 3) || items.smallkey3 > 4) {
				//Harmless Hellway
				chests[7] = 'A';
			}
			
			if (((items.hammer && (items.bow > 0 || flags.enemyshuffle != 'N')) && items.smallkey3 > 1) || items.smallkey3 > 2) {
				//Dark Maze - Top
				chests[10] = (items.lantern ? 'A' : 'DA');
				//Dark Maze - Bottom
				chests[11] = (items.lantern ? 'A' : 'DA');
				//Big Chest
				chests[12] = (items.bigkey3 ? (items.lantern ? 'A' : 'DA') : 'U');
			}
			
			//Boss
			chests[13] = ConvertBossToChest(PoDBoss());
		}
		
		return available_chests(3, chests, items.maxchest3, items.chest3);
    };

    window.SPChests = function() {
		var chests = ['U','U','U','U','U','U','U','U','U','U'];
		
		//Entrance
		if (flags.wildkeys || flags.gametype === 'R') {
			chests[0] = 'A';
		} else {
			chests[0] = 'K';
		}
		
		if (items.smallkey4 > 0 || flags.gametype == 'R')
		{
			//Map Chest
			chests[1] = 'A';
			
			//Without hammer, cannot go any further
			if (items.hammer) {
				//Compass Chest
				chests[2] = 'A';

				//Big Chest
				if (items.bigkey4) {
					if (flags.wildbigkeys) {
						chests[3] = 'A';
					} else {
						chests[3] = (items.hookshot ? 'K' : 'U');
					}
				}

				//West Chest
				chests[4] = 'A';

				//Big Key Chest
				chests[5] = 'A';

				//Without hookshot, cannot go any further
				if (items.hookshot) {
				
					//Flooded Room - Left
					chests[6] = 'A';
					
					//Flooded Room - Right
					chests[7] = 'A';
						
					//Waterfall Room
					chests[8] = 'A';
					
					//Boss
					chests[9] = ConvertBossToChest(SPBoss());
				}
			}
		}
		
		return available_chests(4, chests, items.maxchest4, items.chest4);
    };

    window.SWChests = function() {
		var dungeoncheck = enemizer_check(5);
		
		var chests = ['U','U','U','U','U','U','U','U'];
				
		//Compass Chest
		if (flags.wildkeys || flags.gametype === 'R') {
			chests[0] = 'A';
		} else {
			chests[0] = 'K'; //Marking front three chests as keys
		}
		
		//Pot Prison
		if (flags.wildkeys || flags.gametype === 'R') {
			chests[1] = 'A';
		} else {
			chests[1] = 'K'; //Marking front three chests as keys
		}
		
		//Map Chest
		if (flags.wildkeys || flags.gametype === 'R') {
			chests[2] = 'A';
		} else {
			chests[2] = 'K'; //Marking front three chests as keys
		}
		
		//Pinball Room
		chests[3] = 'A';
		
		//Big Chest
		if (flags.wildbigkeys) {
			chests[4] = (items.bigkey5) ? 'A' : 'U';
		} else {
			if (items.firerod && (items.sword > 0 || flags.swordmode === 'S') && dungeoncheck === 'available') {
				chests[4] = 'K'; //If is full clearable, set to a key, else possible
			} else {
				chests[4] = 'P';
			}
		}
		
		//Big Key Chest		
		chests[5] = 'A';
		
		//Cannot proceed without fire rod
		if (items.firerod) {
			//Bridge Room
			chests[6] = 'A';

			//Boss
			chests[7] = ConvertBossToChest(SWBoss());
		}
		
		return available_chests(5, chests, items.maxchest5, items.chest5);
    };

    window.TTChests = function() {
		var chests = ['U','U','U','U','U','U','U','U'];
		
		//Map Chest
		chests[0] = 'A';
		
		//Ambush Chest
		chests[1] = 'A';
		
		//Compass Chest
		chests[2] = 'A';
		
		//Big Key Chest
		if (flags.wildbigkeys && flags.wildkeys) {
			chests[3] = 'A';
		} else if (flags.wildbigkeys && !flags.wildkeys) {
			//The small key could be in Blind's Cell
			chests[3] = (items.bigkey6 ? 'A' : 'P');
		} else {
			chests[3] = 'K';
		}		
		
		if (items.bigkey6) {
			//Attic
			chests[4] = 'A';
			
			//Blind's Cell
			if (flags.wildkeys || flags.gametype === 'R') {
				chests[5] = 'A';
			} else {
				chests[5] = 'K'; //Reserving this chest for the small key possibility without hammer
			}			 
			
			//Big Chest			
			if (flags.wildbigkeys || flags.wildkeys || flags.gametype === 'R') {
				chests[6] = ((items.smallkey6 === 1 || flags.gametype == 'R') && items.hammer ? 'A' : 'U');
			} else {
				chests[6] = (items.hammer ? 'A' : 'P');
			}
			
			//Boss
			chests[7] = ConvertBossToChest(TTBoss());
		}
		
		return available_chests(6, chests, items.maxchest6, items.chest6);
    };

    window.IPChests = function() {
		var chests = ['U','U','U','U','U','U','U','U'];
		
        //Compass Chest
		if (flags.wildkeys || flags.gametype === 'R') {
			chests[0] = 'A';
		} else {
			chests[0] = 'K'; //Reserving as small key 1
		}
		
        //Spike Room
		if (flags.wildkeys) {
			chests[1] = (items.hookshot || (items.smallkey7 > 0 || flags.gametype == 'R')) ? 'A' : 'U';			
		} else {
			chests[1] = (items.hookshot || items.somaria) ? 'A' : 'P';
		}
		
		if (items.hammer) {
			//Map Chest
			if (flags.wildkeys) {
				chests[2] = (items.hookshot || (items.smallkey7 > 0 || flags.gametype == 'R')) ? 'A' : 'U';			
			} else {
				chests[2] = (items.hookshot || items.somaria) ? (!flags.wildkeys ? 'K' : 'A') : 'P'; //Reserving as small key 2
			}
		
			//Big Key Chest
			if (flags.wildkeys) {
				chests[3] = (items.hookshot || (items.smallkey7 > 0 || flags.gametype == 'R')) ? 'A' : 'U';
			} else {
				chests[3] = (items.hookshot || items.somaria) ? 'A' : 'P';
			}

			//Boss
			chests[7] = ConvertBossToChest(IPBoss());
		}
		
        //Freezor Chest
		chests[4] = 'A';
		
        //Iced T Room
		chests[5] = 'A';
		
        //Big Chest
		if (flags.wildbigkeys) {
			chests[6] = (items.bigkey7 ? 'A' : 'U');
		} else {
			chests[6] = (items.hammer ? 'K' : 'P');
		}
		
		return available_chests(7, chests, items.maxchest7, items.chest7);
    };

    window.MMChests = function() {
		if (medallion_check(0) === 'unavailable') return 'unavailable';
		if (medallion_check(0) === 'possible') return 'possible';

		var chests = ['U','U','U','U','U','U','U','U'];
		
		//Bridge Chest
		//Spike Chest
		//Main Lobby
		if (!flags.wildkeys) {
			chests[0] = (items.lantern || items.firerod ? 'K' : 'P'); //Reserving as small key 1 if a fire source is available
			chests[1] = (items.lantern || items.firerod ? 'K' : 'P'); //Reserving as small key 2 if a fire source is available
			chests[2] = (items.lantern || items.firerod ? 'K' : 'P'); //Reserving as small key 3 if a fire source is available
		} else {
			chests[0] = 'A';
			chests[1] = 'A';
			chests[2] = 'A';
		}
		
		//Map Chest
		chests[3] = 'A';

		if (items.lantern || items.firerod) {
			//Compass Chest
			chests[4] = 'A';
			
			//Big Key Chest
			chests[5] = 'A';
		}
		
		//Big Chest
		if (flags.wildbigkeys) {
			chests[6] = (items.bigkey8 ? 'A' : 'U');
		} else if (flags.wildkeys) {
			chests[6] = (items.lantern || items.firerod ? 'K' : 'U'); //Reserving big key
		} else {
			chests[6] = (items.lantern || items.firerod ? 'K' : 'P'); //Reserving big key
		}		
		
		//Boss
		chests[7] = ConvertBossToChest(MMBoss());
		
		return available_chests(8, chests, items.maxchest8, items.chest8);
    };

    window.TRFrontChests = function() {
		if (medallion_check(1) === 'unavailable') return 'unavailable';
		var isDark = (!items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots));
		
		if (medallion_check(1) === 'possible') return (isDark ? 'darkpossible' : 'possible');

		var chests = ['U','U','U','U','U','U','U','U','U','U','U','U'];
		
		//Because of the complexity of PoD and key logic, there are going to be five modes here to consider:
		//1) No Key Shuffle
		//2) Retro (w/ Big Key shuffle checks)
		//3) Small Key shuffle only
		//4) Big Key shuffle only
		//5) Small Key + Big Key shuffle
		//
		//We will revisit this at a later time, likely v32, to try to condense
		
		//1) No Key Shuffle
		if (!flags.wildbigkeys && !flags.wildkeys && flags.gametype != 'R') {
			//Compass Chest
			chests[0] = 'K'; //Reserved as first small key
			
			//Chain Chomps
			chests[1] = 'K'; //Reserved as second small key
			
			if (items.firerod) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'K'; //Reserved as third small key, regardless if the fire rod is accessable or not
			
			//Big Chest
			chests[5] = (items.firerod ? 'K' : 'P'); //Reserved as big key, if fire rod made it accessable to this point
			
			//Crystaroller Room
			chests[6] = (items.firerod ? 'K' : 'P'); //Reserved as fourth small key
			
			//Laser Bridge
			chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
			chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
			chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
			chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
			
			//Boss
			chests[11] = ConvertBossToChest(TRFrontBoss());
		//2) Retro (w/ Big Key shuffle checks)
		//We ignore the wild keys check, as retro overrides it
		} else if (flags.gametype === 'R') {
			//Compass Chest
			chests[0] = 'A';
			
			//Chain Chmops
			chests[1] = 'A';
			
			if (items.firerod) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A';
			
			//Big Chest
			chests[5] = (items.firerod ? 'K' : 'P'); //Reserved as big key, if fire rod made it accessable to this point
			
			//Crystaroller Room
			chests[6] = (items.firerod ? 'A' : 'P');
			
			//Laser Bridge
			chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
			chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
			chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
			chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
			
			//Boss
			chests[11] = ConvertBossToChest(TRFrontBoss());
		//3) Small Key shuffle only
		} else if (!flags.wildbigkeys && flags.wildkeys) {
			//Compass Chest
			chests[0] = 'A';
			
			if (items.firerod) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			if (items.smallkey9 > 0) {
				//Chain Chomps
				chests[1] = 'A';
				
				if (items.smallkey9 > 1) {
					//Big Key Chest
					chests[4] = 'A';
				
					//Big Chest
					chests[5] = (items.firerod ? 'K' : 'P'); //Reserved as big key, if fire rod made it accessable to this point
					
					//Crystaroller Room
					chests[6] = (items.firerod ? 'A' : 'P');
					
					if (items.smallkey9 > 2) {
						//Laser Bridge
						chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
						chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
						chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
						chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
						
						if (items.smallkey9 > 3) {
							//Boss
							chests[11] = ConvertBossToChest(TRFrontBoss());
						}
					}	
				}
			}
		//4) Big Key shuffle only
		} else if (flags.wildbigkeys && !flags.wildkeys) {
			//Compass Chest
			chests[0] = (items.firerod ? 'K' : 'P'); //Reserved as first small key
			
			//Chain Chomps
			chests[1] = (items.firerod ? 'K' : 'P'); //Reserved as second small key
			
			if (items.firerod) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = (items.firerod ? 'K' : 'P'); //Reserved as third small key, regardless if the fire rod is accessable or not
			
			if (items.bigkey9) {
				//Big Chest
				chests[5] = (items.firerod ? 'A' : 'P'); //Reserved as big key, if fire rod made it accessable to this point
				
				//Crystaroller Room
				chests[6] = (items.firerod ? 'K' : 'P'); //Reserved as fourth small key
				
				//Laser Bridge
				chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				
				//Boss
				chests[11] = ConvertBossToChest(TRFrontBoss());
			}
		//5) Small Key + Big Key shuffle
		} else {
			//Compass Chest
			chests[0] = 'A';
			
			if (items.firerod) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			if (items.smallkey9 > 0) {
				//Chain Chomps
				chests[1] = 'A';
				
				if (items.smallkey9 > 1) {
					//Big Key Chest
					chests[4] = 'A';
					
					if (items.bigkey9) {				
						//Big Chest
						chests[5] = 'A';
						
						//Crystaroller Room
						chests[6] = 'A';
						
						if (items.smallkey9 > 2) {
							//Laser Bridge
							chests[7] = (items.lantern ? 'A' : 'DA');
							chests[8] = (items.lantern ? 'A' : 'DA');
							chests[9] = (items.lantern ? 'A' : 'DA');
							chests[10] = (items.lantern ? 'A' : 'DA');
							
							if (items.smallkey9 > 3) {
								//Boss
								chests[11] = ConvertBossToChest(TRFrontBoss());
							}
						}	
					}
				}
			}
		}
		
		if (isDark) {
			for (var i = 0; i < 12; i++) {
				if (chests[i] === 'A') chests[i] = 'DA';
				if (chests[i] === 'P') chests[i] = 'DP';
			}
		}
		
		return available_chests(9, chests, items.maxchest9, items.chest9);
    };

	window.TRMidChests = function() {
		var isDark = (!items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots));
		
		var chests = ['U','U','U','U','U','U','U','U','U','U','U','U'];
		
		//Always have direct access to Big Key and Chain Chomp chest through west door, regardless of keys
		
		//1) No Key Shuffle
		if (!flags.wildbigkeys && !flags.wildkeys && flags.gametype != 'R') {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}
			
			//Chain Chomps
			chests[1] = 'A';
			
			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A'; //Reserved as third small key
			
			//Big Chest
			chests[5] = (items.somaria || items.hookshot ? (items.somaria && items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, could be in the front of the dungeon
			
			//Crystaroller Room
			//If you do not have somaria, you can get through with the big key
			chests[6] = (items.somaria && items.firerod ? 'A' : 'P');
			
			//Laser Bridge
			//If you have somaria but not fire rod, there are up to two items not accessible, so only marking two as keys and the rest are possible
			if (items.somaria) {
				chests[7] = 'K'; //Reserved as first small key
				chests[8] = 'K'; //Reserved as second small key
				chests[9] = (items.firerod ? 'K' : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? 'K' : (items.lantern ? 'P' : 'DP'));
			}
			
			//Boss
			chests[11] = ConvertBossToChest(TRMidBoss());
		//2) Retro (w/ Big Key shuffle checks)
		//We ignore the wild keys check, as retro overrides it
		} else if (flags.gametype === 'R') {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}
			
			//Chain Chomps
			chests[1] = 'A';
			
			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A';
			
			//Big Chest
			chests[5] = (items.somaria || items.hookshot ? (items.somaria && items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, could be in the front of the dungeon
			
			//Crystaroller Room
			//If you do not have somaria, you can get through with the big key
			chests[6] = (items.somaria && items.firerod ? 'A' : 'P');
			
			//Laser Bridge
			//If you have somaria but not fire rod, there are up to two items not accessible, so only marking two as keys and the rest are possible
			if (items.somaria) {
				chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
			}
			
			//Boss
			chests[11] = ConvertBossToChest(TRMidBoss());
		//3) Small Key shuffle only
		} else if (!flags.wildbigkeys && flags.wildkeys) {
			//Compass Chest
			if (items.somaria && items.smallkey9 > 0) {
				chests[0] = 'A';
			}
			
			//Chain Chomps
			chests[1] = 'A';
			
			if (items.firerod && items.somaria && items.smallkey9 > 0) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A';
			
			//Big Chest
			chests[5] = (items.somaria || items.hookshot ? (items.somaria && items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, could be in the front of the dungeon
			
			//Crystaroller Room
			//If you do not have somaria, you can get through with the big key
			chests[6] = (items.somaria && items.firerod && items.smallkey9 > 0 ? 'A' : 'P');
			
			//Laser Bridge
			//If you have somaria but not fire rod, there are up to two items not accessible, so only marking two as keys and the rest are possible
			if (items.somaria) {
				if (items.smallkey9 > 2) {
					chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
					chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
					chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
					chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				} else if (items.smallley9 > 0) {
					chests[7] = (items.lantern ? 'P' : 'DP');
					chests[8] = (items.lantern ? 'P' : 'DP');
					chests[9] = (items.lantern ? 'P' : 'DP');
					chests[10] = (items.lantern ? 'P' : 'DP');
				}
			}
			
			//Boss
			chests[11] = ConvertBossToChest(TRMidBoss());			
			
		//4) Big Key shuffle only
		} else if (flags.wildbigkeys && !flags.wildkeys) {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}
			
			//Chain Chomps
			chests[1] = 'A';
			
			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A';
			
			//Big Chest
			if ((items.somaria || items.hookshot) && items.bigkey9) {
				chests[5] = 'A';
			}
			
			//Crystaroller Room
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			if (items.bigkey9) {
				chests[6] = 'A';
			}
			
			//Laser Bridge
			if (items.somaria && items.bigkey9) {
				chests[7] = 'K'; //Reserved as first small key
				chests[8] = 'K'; //Reserved as second small key
				chests[9] = 'K'; //Reserved as third small key
				chests[10] = 'K'; //Reserved as fourth small key
			}
			
			//Boss
			chests[11] = ConvertBossToChest(TRMidBoss());
		//5) Small Key + Big Key shuffle
		} else {
			//Compass Chest
			if (items.somaria && items.smallkey9 > 0) {
				chests[0] = 'A';
			}
			
			//Chain Chomps
			chests[1] = 'A';
			
			if (items.firerod && items.somaria && items.smallkey9 > 0) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A';
			
			//Big Chest
			if ((items.somaria || items.hookshot) && items.bigkey9) {
				chests[5] = 'A';
			}
			
			//Crystaroller Room
			//If you do not have somaria, you can get through with the big key
			if (items.bigkey9) {
				chests[6] = 'A';
			}
			
			//Laser Bridge
			//If you have somaria but not fire rod, there are up to two items not accessible, so only marking two as keys and the rest are possible
			if (items.somaria && items.bigkey9) {
				chests[7] = (items.smallkey9 > 2 ? (items.lantern ? 'A' : 'DA') : (items.smallkey9 > 0 ? (items.lantern ? 'P' : 'DP') : 'U'));
				chests[8] = (items.smallkey9 > 2 ? (items.lantern ? 'A' : 'DA') : (items.smallkey9 > 0 ? (items.lantern ? 'P' : 'DP') : 'U'));
				chests[9] = (items.smallkey9 > 2 ? (items.lantern ? 'A' : 'DA') : (items.smallkey9 > 0 ? (items.lantern ? 'P' : 'DP') : 'U'));
				chests[10] = (items.smallkey9 > 2 ? (items.lantern ? 'A' : 'DA') : (items.smallkey9 > 0 ? (items.lantern ? 'P' : 'DP') : 'U'));
			}
			
			//Boss
			chests[11] = ConvertBossToChest(TRMidBoss());	
		}
		
		if (isDark) {
			for (var i = 0; i < 12; i++) {
				if (chests[i] === 'A') chests[i] = 'DA';
				if (chests[i] === 'P') chests[i] = 'DP';
			}
		}
		
		return available_chests(9, chests, items.maxchest9, items.chest9);
    };

    window.TRBackChests = function() {
		var isDark = (!items.flute && !items.lantern);
		
		var chests = ['U','U','U','U','U','U','U','U','U','U','U','U'];
		
		//Always have direct access to Laser Bridge through back door, Big Key and Chain Chomp chest through west door, regardless of keys
		
		//1) No Key Shuffle
		if (!flags.wildbigkeys && !flags.wildkeys && flags.gametype != 'R') {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}
			
			//Chain Chomps
			chests[1] = 'A';
			
			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A';
			
			//Big Chest
			chests[5] = (items.somaria || items.hookshot ? (items.somaria && items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, could be in the front of the dungeon
			
			//Crystaroller Room
			//If you have somaria, you can get to it with dark logic
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			chests[6] = (items.somaria ? (items.lantern ? 'A' : 'DA') : 'P');
			
			//Laser Bridge
			chests[7] = 'K'; //Reserved as first small key
			chests[8] = 'K'; //Reserved as second small key
			chests[9] = 'K'; //Reserved as third small key
			chests[10] = 'K'; //Reserved as fourth small key
			
			//Boss
			chests[11] = ConvertBossToChest(TRBackBoss());
		//2) Retro (w/ Big Key shuffle checks)
		//We ignore the wild keys check, as retro overrides it
		} else if (flags.gametype === 'R') {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}
			
			//Chain Chomps
			chests[1] = 'A';
			
			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A';
			
			//Big Chest
			if (flags.wildbigkeys) {
				chests[5] = (items.bigkey9 && (items.somaria || items.hookshot) ? 'A' : 'U');
			} else {
				chests[5] = (items.somaria || items.hookshot ? (items.somaria && items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, could be in the front of the dungeon
			}
			
			//Crystaroller Room
			//If you have somaria, you can get to it with dark logic
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			chests[6] = (items.somaria ? (items.lantern ? 'A' : 'DA') : 'P');
			
			//Laser Bridge
			chests[7] = 'A';
			chests[8] = 'A';
			chests[9] = 'A';
			chests[10] = 'A';
			
			//Boss
			chests[11] = ConvertBossToChest(TRBackBoss());
		//3) Small Key shuffle only
		} else if (!flags.wildbigkeys && flags.wildkeys) {
			//Compass Chest
			if (items.somaria && items.smallkey9 > 0) {
				chests[0] = 'A';
			}
			
			//Chain Chomps
			chests[1] = 'A';
			
			if (items.firerod && items.somaria && items.smallkey9 > 0) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A';
			
			//Big Chest
			chests[5] = ((items.somaria || items.firerod) ? 'K' : 'P');
			
			//Crystaroller Room
			//If you have somaria, you can get to it with dark logic
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			chests[6] = (items.somaria ? (items.lantern ? 'A' : 'DA') : 'P');
			
			//Laser Bridge
			chests[7] = 'A';
			chests[8] = 'A';
			chests[9] = 'A';
			chests[10] = 'A';
			
			//Boss
			chests[11] = ConvertBossToChest(TRBackBoss());			
			
		//4) Big Key shuffle only
		} else if (flags.wildbigkeys && !flags.wildkeys) {
			//Compass Chest
			if (items.somaria) {
				chests[0] = 'A';
			}
			
			//Chain Chomps
			chests[1] = 'A';
			
			if (items.firerod && items.somaria) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A';
			
			//Big Chest
			chests[5] = ((items.somaria || items.firerod) && items.bigkey9 ? 'A' : 'U');
			
			//Crystaroller Room
			//If you have somaria, you can get to it with dark logic
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			chests[6] = (items.somaria ? (items.lantern ? 'A' : (items.bigkey9 ? 'A' : 'DA')) : (items.bigkey9 ? 'A' : 'U'));
			
			//Laser Bridge
			chests[7] = (items.somaria ? 'K' : 'P'); //Reserved as first small key if access to the front are available, else possible only with small keys up front
			chests[8] = (items.somaria ? 'K' : 'P'); //Reserved as second small key if access to the front are available, else possible only with small keys up front
			chests[9] = (items.somaria ? 'K' : 'P'); //Reserved as third small key if access to the front are available, else possible only with small keys up front
			chests[10] = (items.somaria ? 'K' : 'P'); //Reserved as fourth small key if access to the front are available, else possible only with small keys up front
			
			//Boss
			chests[11] = ConvertBossToChest(TRBackBoss());
		//5) Small Key + Big Key shuffle
		} else {
			//Compass Chest
			if (items.somaria && items.smallkey9 > 0) {
				chests[0] = 'A';
			}
			
			//Chain Chomps
			chests[1] = 'A';
			
			if (items.firerod && items.somaria && items.smallkey9 > 0) {
				//Roller Room - Left
				chests[2] = 'A';
				
				//Roller Room - Right
				chests[3] = 'A';
			}
			
			//Big Key Chest
			chests[4] = 'A';
			
			//Big Chest
			chests[5] = ((items.somaria || items.firerod) && items.bigkey9 ? 'A' : 'U');
			
			//Crystaroller Room
			//If you have somaria, you can get to it with dark logic
			//If you do not have somaria, you can go through the eye room and get through with the big key without dark logic
			chests[6] = (items.somaria ? (items.lantern ? 'A' : (items.bigkey9 ? 'A' : 'DA')) : (items.bigkey9 ? 'A' : 'U'));
			
			//Laser Bridge
			chests[7] = 'A'; //Reserved as first small key
			chests[8] = 'A'; //Reserved as second small key
			chests[9] = 'A'; //Reserved as third small key
			chests[10] = 'A'; //Reserved as fourth small key
			
			//Boss
			chests[11] = ConvertBossToChest(TRBackBoss());
		}
		
		if (isDark) {
			for (var i = 0; i < 12; i++) {
				if (chests[i] === 'A') chests[i] = 'DA';
				if (chests[i] === 'P') chests[i] = 'DP';
			}
		}
		
		return available_chests(9, chests, items.maxchest9, items.chest9);
    };

    window.GTChests = function() {
		var dungeoncheck = enemizer_check(0);
		var isDark = (!items.flute && !items.lantern && flags.gametype != 'I' && !(flags.glitches != 'N' && items.boots));

		var chests = ['U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U','U'];
		
		//1) No Key Shuffle
		if (!flags.wildbigkeys && !flags.wildkeys && flags.gametype != 'R') {

			//Bob's Torch - 0 
			if (items.boots) chests[0] = 'A';

			if (items.hammer) {
				if (items.hookshot) {
					//DMs Room - Top Left - 0
					chests[1] = 'K'; //Reserving as small key 1
					//DMs Room - Top Right - 0
					chests[2] = 'K'; //Reserving as small key 2
					//DMs Room - Bottom Left - 0
					chests[3] = 'A';
					//DMs Room - Bottom Right - 0
					chests[4] = 'A';
					
					//Firesnake Room - 0
					chests[6] = 'K';  //Reserving as small key 3
					
					//Randomizer Room - Top Left - 1
					chests[7] = 'A';
					//Randomizer Room - Top Right - 1
					chests[8] = 'A';
					//Randomizer Room - Bottom Left - 1
					chests[9] = 'A';
					//Randomizer Room - Bottom Right - 1
					chests[10] = 'A';
				}			
				
				if (items.hookshot || items.boots) {
					//Map Chest - 1
					chests[5] = 'A';
				}	
			}
			
			if ((items.hammer && items.hookshot) || (items.firerod && items.somaria)) {
				//Big Chest - 2
				chests[11] = 'K'; //Reserving as big key
				//Bob's Chest - 2
				chests[12] = 'A';
				//Big Key Chest - 2
				chests[13] = 'A';
				//Big Key Room - Left - 2
				chests[14] = 'A';
				//Big Key Room - Right - 2
				chests[15] = 'A';
			}
			
			//Hope Room - Left - 0
			chests[16] = 'A';
			
			//Hope Room - Right - 0
			chests[17] = 'A';
			
			if (items.somaria) {
				//Tile Room - 0
				chests[18] = 'A';
				
				if (items.firerod) {
					//Compass Room - Top Left - 2
					chests[19] = 'K'; //Reserving as small key 4
					//Compass Room - Top Right - 2
					chests[20] = 'A';
					//Compass Room - Bottom Left - 2
					chests[21] = 'A';
					//Compass Room - Bottom Right - 2
					chests[22] = 'A';
				}
			}
			
			if ((items.bow > 0 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = 'A';
				//Mini Helmasaur Room - Right - 3
				chests[24] = 'A';
				//Pre-Moldorm Chest - 3
				chests[25] = 'A';
				
				if (items.hookshot) {
					//Moldorm Chest
					chests[26] = 'A';
				}
			}
		//2) Retro (w/ Big Key shuffle checks)
		//We ignore the wild keys check, as retro overrides it
		} else if (flags.gametype === 'R') {
			//Bob's Torch - 0 
			if (items.boots) chests[0] = 'A';

			if (items.hammer) {
				if (items.hookshot) {
					//DMs Room - Top Left - 0
					chests[1] = 'A';
					//DMs Room - Top Right - 0
					chests[2] = 'A';
					//DMs Room - Bottom Left - 0
					chests[3] = 'A';
					//DMs Room - Bottom Right - 0
					chests[4] = 'A';
					
					//Firesnake Room - 0
					chests[6] = 'A';
					
					//Randomizer Room - Top Left - 1
					chests[7] = 'A';
					//Randomizer Room - Top Right - 1
					chests[8] = 'A';
					//Randomizer Room - Bottom Left - 1
					chests[9] = 'A';
					//Randomizer Room - Bottom Right - 1
					chests[10] = 'A';
				}			
				
				if (items.hookshot || items.boots) {
					//Map Chest - 1
					chests[5] = 'A';
				}	
			}
			
			if ((items.hammer && items.hookshot) || (items.firerod && items.somaria)) {
				//Big Chest - 2
				chests[11] = (flags.wildbigkeys ? (items.bigkey10 ? 'A' : 'U') : 'K'); //Reserving as big key
				//Bob's Chest - 2
				chests[12] = 'A';
				//Big Key Chest - 2
				chests[13] = 'A';
				//Big Key Room - Left - 2
				chests[14] = 'A';
				//Big Key Room - Right - 2
				chests[15] = 'A';
			}
			
			//Hope Room - Left - 0
			chests[16] = 'A';
			
			//Hope Room - Right - 0
			chests[17] = 'A';
			
			if (items.somaria) {
				//Tile Room - 0
				chests[18] = 'A';
				
				if (items.firerod) {
					//Compass Room - Top Left - 2
					chests[19] = 'A';
					//Compass Room - Top Right - 2
					chests[20] = 'A';
					//Compass Room - Bottom Left - 2
					chests[21] = 'A';
					//Compass Room - Bottom Right - 2
					chests[22] = 'A';
				}
			}
			
			if ((items.bow > 0 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = 'A';
				//Mini Helmasaur Room - Right - 3
				chests[24] = 'A';
				//Pre-Moldorm Chest - 3
				chests[25] = 'A';
				
				if (items.hookshot) {
					//Moldorm Chest
					chests[26] = 'A';
				}
			}
		//3) Small Key shuffle only
		} else if (!flags.wildbigkeys && flags.wildkeys) {
			//Bob's Torch - 0 
			if (items.boots) chests[0] = 'A';

			if (items.hammer) {
				if (items.hookshot) {
					//DMs Room - Top Left - 0
					chests[1] = 'A';
					//DMs Room - Top Right - 0
					chests[2] = 'A';
					//DMs Room - Bottom Left - 0
					chests[3] = 'A';
					//DMs Room - Bottom Right - 0
					chests[4] = 'A';
					
					//Firesnake Room - 0
					chests[6] = 'A';
					
					if (items.smallkey10 > 0) {
						//Randomizer Room - Top Left - 1
						chests[7] = 'A';
						//Randomizer Room - Top Right - 1
						chests[8] = 'A';
						//Randomizer Room - Bottom Left - 1
						chests[9] = 'A';
						//Randomizer Room - Bottom Right - 1
						chests[10] = 'A';
					}
				}			
				
				if ((items.hookshot || items.boots) && items.smallkey10 > 0 ) {
					//Map Chest - 1
					chests[5] = 'A';
				}	
			}
			
			if (((items.hammer && items.hookshot) || (items.firerod && items.somaria)) && items.smallkey10 > 1) {
				//Big Chest - 2
				chests[11] = 'K';
				//Bob's Chest - 2
				chests[12] = 'A';
				//Big Key Chest - 2
				chests[13] = 'A';
				//Big Key Room - Left - 2
				chests[14] = 'A';
				//Big Key Room - Right - 2
				chests[15] = 'A';
			}
			
			//Hope Room - Left - 0
			chests[16] = 'A';
			
			//Hope Room - Right - 0
			chests[17] = 'A';
			
			if (items.somaria) {
				//Tile Room - 0
				chests[18] = 'A';
				
				if (items.firerod && items.smallkey10 > 1) {
					//Compass Room - Top Left - 2
					chests[19] = 'A';
					//Compass Room - Top Right - 2
					chests[20] = 'A';
					//Compass Room - Bottom Left - 2
					chests[21] = 'A';
					//Compass Room - Bottom Right - 2
					chests[22] = 'A';
				}
			}
			
			if ((items.bow > 0 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod) && items.smallkey10 > 0 && items.bigkey10) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
				//Mini Helmasaur Room - Right - 3
				chests[24] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
				//Pre-Moldorm Chest - 3
				chests[25] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
				
				if (items.hookshot) {
					//Moldorm Chest - 3
					chests[26] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
				}
			}
		//4) Big Key shuffle only
		} else if (flags.wildbigkeys && !flags.wildkeys) {
			//Bob's Torch - 0 
			if (items.boots) chests[0] = 'A';

			if (items.hammer) {
				if (items.hookshot) {
					//DMs Room - Top Left - 0
					chests[1] = 'K'; //Reserving as small key 1
					//DMs Room - Top Right - 0
					chests[2] = 'K'; //Reserving as small key 2
					//DMs Room - Bottom Left - 0
					chests[3] = 'A';
					//DMs Room - Bottom Right - 0
					chests[4] = 'A';
					
					//Firesnake Room - 0
					chests[6] = 'K';  //Reserving as small key 3
					
					//Randomizer Room - Top Left - 1
					chests[7] = 'A';
					//Randomizer Room - Top Right - 1
					chests[8] = 'A';
					//Randomizer Room - Bottom Left - 1
					chests[9] = 'A';
					//Randomizer Room - Bottom Right - 1
					chests[10] = 'A';
				}			
				
				if (items.hookshot || items.boots) {
					//Map Chest - 1
					chests[5] = 'A';
				}	
			}
			
			if ((items.hammer && items.hookshot) || (items.firerod && items.somaria)) {
				//Big Chest - 2
				chests[11] = (items.bigkey10 ? 'A' : 'U');
				//Bob's Chest - 2
				chests[12] = 'A';
				//Big Key Chest - 2
				chests[13] = 'A';
				//Big Key Room - Left - 2
				chests[14] = 'A';
				//Big Key Room - Right - 2
				chests[15] = 'A';
			}
			
			//Hope Room - Left - 0
			chests[16] = 'A';
			
			//Hope Room - Right - 0
			chests[17] = 'A';
			
			if (items.somaria) {
				//Tile Room - 0
				chests[18] = 'A';
				
				if (items.firerod) {
					//Compass Room - Top Left - 2
					chests[19] = 'K'; //Reserving as small key 4
					//Compass Room - Top Right - 2
					chests[20] = 'A';
					//Compass Room - Bottom Left - 2
					chests[21] = 'A';
					//Compass Room - Bottom Right - 2
					chests[22] = 'A';
				}
			}
			
			if (items.bigkey10 && (items.bow > 0 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = 'A';
				//Mini Helmasaur Room - Right - 3
				chests[24] = 'A';
				//Pre-Moldorm Chest - 3
				chests[25] = 'A';
				
				if (items.hookshot) {
					//Moldorm Chest
					chests[26] = 'A';
				}
			}
		//5) Small Key + Big Key shuffle
		} else {
			//Bob's Torch - 0 
			if (items.boots) chests[0] = 'A';

			if (items.hammer) {
				if (items.hookshot) {
					//DMs Room - Top Left - 0
					chests[1] = 'A';
					//DMs Room - Top Right - 0
					chests[2] = 'A';
					//DMs Room - Bottom Left - 0
					chests[3] = 'A';
					//DMs Room - Bottom Right - 0
					chests[4] = 'A';
					
					//Firesnake Room - 0
					chests[6] = 'A';
					
					if (items.smallkey10 > 0) {
						//Randomizer Room - Top Left - 1
						chests[7] = 'A';
						//Randomizer Room - Top Right - 1
						chests[8] = 'A';
						//Randomizer Room - Bottom Left - 1
						chests[9] = 'A';
						//Randomizer Room - Bottom Right - 1
						chests[10] = 'A';
					}
				}			
				
				if ((items.hookshot || items.boots) && items.smallkey10 > 0 ) {
					//Map Chest - 1
					chests[5] = 'A';
				}	
			}
			
			if (((items.hammer && items.hookshot) || (items.firerod && items.somaria)) && items.smallkey10 > 1) {
				//Big Chest - 2
				chests[11] = (items.bigkey10 ? 'A' : 'U');
				//Bob's Chest - 2
				chests[12] = 'A';
				//Big Key Chest - 2
				chests[13] = 'A';
				//Big Key Room - Left - 2
				chests[14] = 'A';
				//Big Key Room - Right - 2
				chests[15] = 'A';
			}
			
			//Hope Room - Left - 0
			chests[16] = 'A';
			
			//Hope Room - Right - 0
			chests[17] = 'A';
			
			if (items.somaria) {
				//Tile Room - 0
				chests[18] = 'A';
				
				if (items.firerod && items.smallkey10 > 1) {
					//Compass Room - Top Left - 2
					chests[19] = 'A';
					//Compass Room - Top Right - 2
					chests[20] = 'A';
					//Compass Room - Bottom Left - 2
					chests[21] = 'A';
					//Compass Room - Bottom Right - 2
					chests[22] = 'A';
				}
			}
			
			if ((items.bow > 0 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod) && items.smallkey10 > 0 && items.bigkey10) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
				//Mini Helmasaur Room - Right - 3
				chests[24] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
				//Pre-Moldorm Chest - 3
				chests[25] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
				
				if (items.hookshot) {
					//Moldorm Chest - 3
					chests[26] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
				}
			}
		}		
		
		
		
		
		
		
		
		
		if (flags.wildbigkeys || flags.wildkeys || flags.gametype === 'R') {
			
			
		} else {
			//Bob's Torch - 0 
			if (items.boots) chests[0] = 'A';

			if (items.hammer) {
				if (items.hookshot) {
					//DMs Room - Top Left - 0
					chests[1] = 'K'; //Reserving as small key 1
					//DMs Room - Top Right - 0
					chests[2] = 'K'; //Reserving as small key 2
					//DMs Room - Bottom Left - 0
					chests[3] = 'A';
					//DMs Room - Bottom Right - 0
					chests[4] = 'A';
					
					//Firesnake Room - 0
					chests[6] = 'K';  //Reserving as small key 3
					
					//Randomizer Room - Top Left - 1
					chests[7] = 'A';
					//Randomizer Room - Top Right - 1
					chests[8] = 'A';
					//Randomizer Room - Bottom Left - 1
					chests[9] = 'A';
					//Randomizer Room - Bottom Right - 1
					chests[10] = 'A';
				}			
				
				if (items.hookshot || items.boots) {
					//Map Chest - 1
					chests[5] = 'A';
				}	
			}
			
			if ((items.hammer && items.hookshot) || (items.firerod && items.somaria)) {
				//Big Chest - 2
				chests[11] = 'K';				
				//Bob's Chest - 2
				chests[12] = 'A';
				//Big Key Chest - 2
				chests[13] = 'A';
				//Big Key Room - Left - 2
				chests[14] = 'A';
				//Big Key Room - Right - 2
				chests[15] = 'A';
			}
			
			//Hope Room - Left - 0
			chests[16] = 'A';
			
			//Hope Room - Right - 0
			chests[17] = 'A';
			
			if (items.somaria) {
				//Tile Room - 0
				chests[18] = 'A';
				
				if (items.firerod) {
					//Compass Room - Top Left - 2
					chests[19] = 'K'; //Reserving as small key 4
					//Compass Room - Top Right - 2
					chests[20] = 'A';
					//Compass Room - Bottom Left - 2
					chests[21] = 'A';
					//Compass Room - Bottom Right - 2
					chests[22] = 'A';
				}
			}
			
			if ((items.bow > 0 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = 'A';
				//Mini Helmasaur Room - Right - 3
				chests[24] = 'A';
				//Pre-Moldorm Chest - 3
				chests[25] = 'A';
				
				if (items.hookshot) {
					//Moldorm Chest
					chests[26] = 'A';
				}
			}
		}
		
		if (isDark) {
			for (var i = 0; i < 27; i++) {
				if (chests[i] === 'A') chests[i] = 'DA';
				if (chests[i] === 'P') chests[i] = 'DP';
			}
		}		
		
		return available_chests(10, chests, items.maxchest10, items.chest10);
    };	
		
}(window));
