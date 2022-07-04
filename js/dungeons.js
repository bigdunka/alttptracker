(function(window) {
    'use strict';

    function melee() { return items.sword || items.hammer; }
    function melee_bow() { return melee() || items.bow > 1; }
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

	function crystalCheck() {
		var crystal_count = 0;
		for (var k = 0; k < 10; k++) {
			if ((prizes[k] === 3 || prizes[k] === 4) && items['boss'+k]) {
				crystal_count++;
			}
		}
		return crystal_count;
	}

	function allDungeonCheck() {
		for (var k = 0; k < 10; k++) {
			if (!items['boss'+k]) {
				return false;
			}
		}
		return true;
	}

	//Check which boss is at the end of the dungeon
	function enemizer_check(i) {
		//All possible required items to kill a boss
		if (melee() && items.hookshot && items.icerod && items.firerod) return 'available';
		if (!melee_bow() && !rod() && !cane() && items.boomerang === 0) return 'unavailable';
		if (i === 10) {
			if (flags.bossshuffle != 'N') return 'possible';//Don't know which bosses are in GT
			return melee() ? 'available' : 'unavailable';
		}
		switch (enemizer[i]) {
			case 0:
			case 11:
				return (flags.bossshuffle != 'N' ? 'possible' : 'available');
				break;
			case 1:
				if (items.sword > 0 || items.hammer || items.bow > 1 || items.boomerang > 0 || items.byrna || items.somaria || items.icerod || items.firerod) return 'available';
				break;
			case 2:
				if (melee_bow() || cane() || rod() || items.hammer) return 'available';
				break;
			case 3:
				if (items.sword > 0 || items.hammer) return 'available';
				break;
			case 4:
				if (items.sword > 0 || items.hammer || items.bow > 1) return 'available';
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
	
	function canReachOutcastEntrance() {
		if (items.moonpearl && (items.glove === 2 || items.glove && items.hammer || items.agahnim && items.hookshot && (items.hammer || items.glove || items.flippers))) return true;
		if (hasFoundEntrance(90) || hasFoundEntrance(91) || (flags.doorshuffle === 'N' && hasFoundEntrance(96)) || hasFoundEntrance(99) || hasFoundEntrance(102) || hasFoundEntrance(104) || hasFoundEntrance(105) || hasFoundEntrance(106) || hasFoundEntrance(107) || hasFoundEntrance(108) || hasFoundEntrance(109) || (hasFoundEntrance(110) && items.moonpearl && items.hammer) || hasFoundEntrance(111) || (hasFoundEntrance(112) && items.moonpearl && items.glove === 2) || hasFoundEntrance(129)) return true;
		if ((hasFoundEntrance(86) || hasFoundEntrance(87) || hasFoundEntrance(88) || hasFoundEntrance(89) || hasFoundEntrance(113) || hasFoundEntrance(119)) && items.moonpearl && (items.glove === 2 || (items.flippers && items.hookshot) || (items.glove > 0 && items.hammer && items.hookshot))) return true;
		if (canReachDarkWorldEast() && items.moonpearl && ((items.flippers || items.hammer || items.glove > 0) && items.hookshot)) return true;
		if (hasFoundEntrance(92) && items.moonpearl && items.hookshot) return true;
		return false;
	}
	
	function canReachDarkWorldEast() {
		if (canReachDarkWorld() && (items.hammer || items.flippers)) return true;
		if (items.agahnim || hasFoundEntrance(94) || hasFoundEntrance(95) || hasFoundEntrance(114) || hasFoundEntrance(115) || hasFoundEntrance(116) || hasFoundEntrance(117) || ((hasFoundEntrance(86) || hasFoundEntrance(87) || hasFoundEntrance(88) || hasFoundEntrance(89) || hasFoundEntrance(113) || hasFoundEntrance(119)) && (items.hammer || items.flippers) && items.moonpearl) || (hasFoundEntrance(92) && items.moonpearl && (items.glove > 0 || items.hammer))) return true;
		if ((hasFoundEntrance(90) || hasFoundEntrance(91) || (flags.doorshuffle === 'N' && hasFoundEntrance(96)) || hasFoundEntrance(99) || hasFoundEntrance(102) || hasFoundEntrance(104) || hasFoundEntrance(105) || hasFoundEntrance(106) || hasFoundEntrance(107) || hasFoundEntrance(108) || hasFoundEntrance(109) || (hasFoundEntrance(110) && items.hammer) || hasFoundEntrance(111) || hasFoundEntrance(129)) && items.moonpearl && (items.flippers || items.hammer)) return true;
		if (canReachAndLeaveShoppingMall()) return true;
		return false;
	}
	
	function canReachDarkWorld()
	{
		return items.moonpearl && (items.glove === 2 || items.glove && items.hammer || items.agahnim);
	}	
	
	function canReachAndLeaveShoppingMall()
	{
		if ((hasFoundEntrance(120) || hasFoundEntrance(121) || hasFoundEntrance(122)) && items.moonpearl && items.flippers) return true;
		return false;
	}
	
	function hasFoundEntrance(x) {
		return (entrances[x].is_connector || entrances[x].known_location != '') ? true : false;
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
		if (!flags.wildmaps && dungeonid != 12) {
			if (achests > 0) {
				pchests++;
				achests--;
			} else if (dachests > 0) {
				dpchests++;
				dachests--;
			}
		}
		
		if (!flags.wildcompasses && dungeonid < 11) {
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
		
		if (flags.ambrosia === 'Y' && dungeonid < 10 && chestcount === 1 && !dungeons[dungeonid].is_beaten) {
			return ConvertChestToBoss(allchests[allchests.length-1]);
		}
		
		if (achests > 0) return 'available';
		if (dachests > 0) return 'darkavailable';
		if (pchests > 0) return 'possible';
		if (dpchests > 0) return 'darkpossible';
		return 'unavailable';
	}

	function maxKeys(dungeon)
	{
		return flags.doorshuffle === 'C' ? 29 : [0,1,1,6,1,3,1,2,3,4,4,1,2][dungeon];//Note: This assumes Key Drop Shuffle is off in Basic
	}

	function door_enemizer_check(dungeon) {
		if(dungeon === 6)
		{
			var atticCell = (flags.doorshuffle === 'C' ? items.bombfloor : items.bomb) && (items.bigkey6 || !flags.wildbigkeys);
			if(!atticCell && (flags.bossshuffle === 'N' || enemizer[6] === 7))
				return 'unavailable';
			if(!atticCell && flags.bossshuffle != 'N' && enemizer[6]%11 === 0)
			{
				var check = enemizer_check(6);
				return check === 'available' ? 'possible' : check;
			}
		}
		if(dungeon >= 10)
			return items.sword || items.hammer || items.net || dungeon === 11 ? 'available' : 'unavailable';
		return (dungeon === 7 && (!items.hammer || items.glove == 0)) ? 'unavailable' : enemizer_check(dungeon);
	}

	window.doorCheck = function(dungeon,onlyDarkPossible,darkRoom,torchDarkRoom,posRequired,goal,onlyBunny = false) {
		if(flags.doorshuffle === 'N')
			return null;
		var doorcheck = 'available',bosscheck = onlyBunny ? 'unavailable' : door_enemizer_check(dungeon),wildsmallkeys = flags.wildkeys || flags.gametype === 'R';
		if(goal === 'boss')
			doorcheck = bosscheck;
		if(doorcheck === 'unavailable')
			return 'unavailable';//Can't beat boss
		//if(goal === 'boss' && dungeon == 6 && flags.doorshuffle === 'C' && !items.bombfloor)
		//	return 'unavailable';
		//if(doorcheck === 'available' && goal === 'item' && dungeon == 6 && flags.doorshuffle === 'C' && !items.bombfloor)
		//	doorcheck = 'possible';
		//if(goal === 'item' && dungeon <= 10 && flags.doorshuffle === 'B' && items['maxchest'+dungeon]-items['chest'+dungeon] < freeDungeonItems(dungeon))
		//	return onlyDarkPossible ? 'darkavailable' : 'available';//At least one item available no matter how the dungeon is shuffled
		if(goal === 'item' && dungeon < 10 && flags.doorshuffle === 'B' && !items['boss'+dungeon] && bosscheck != 'available' && items['chest'+dungeon] == 1)
		{
			if(bosscheck === 'unavailable' && (flags.ambrosia === 'Y' || (flags.wildmaps && flags.wildcompasses && (wildsmallkeys || maxKeys(dungeon) == 0) && flags.wildbigkeys)))
				return 'unavailable';//Boss has last item
			doorcheck = 'possible';//Boss could have last item
		}
		if(goal === 'item' && dungeon < 10 && flags.doorshuffle === 'C' && !items['boss'+dungeon] && bosscheck != 'available' && (items['chest'+dungeon] == 1 || (!items['chestknown'+dungeon] && items['chest'+dungeon] == 2)))
		{
			if(bosscheck === 'unavailable' && items['chestknown'+dungeon] && (flags.ambrosia === 'Y' || (flags.wildmaps && flags.wildcompasses && wildsmallkeys && flags.wildbigkeys)))
				return 'unavailable';//Boss has last item
			doorcheck = 'possible';//Boss could have last item
		}
		if(doorcheck === 'available' && onlyBunny)
			doorcheck = 'possible';
		if(doorcheck === 'available' && goal === 'item' && flags.doorshuffle === 'C' && items['chest'+dungeon] === 1 && !items['chestknown'+dungeon])
			doorcheck = 'possible';//Unknown if even one item is still in there
		var dungeonAlt = dungeon > 10 ? 'half'+(dungeon-11) : ''+dungeon;
		if(doorcheck === 'available' && flags.wildkeys && flags.gametype != 'R' && items['smallkey'+dungeonAlt] < maxKeys(dungeon))
			doorcheck = 'possible';//Could need more small keys
		if(doorcheck === 'available' && flags.wildbigkeys && (dungeon <= 10 || flags.doorshuffle === 'C') && !items['bigkey'+dungeonAlt])
			doorcheck = 'possible';//Could need big key
		if(doorcheck === 'available' && goal != 'boss' && dungeon < 10 && bosscheck != 'available' && flags.ambrosia === 'N' && ((!wildsmallkeys && maxKeys(dungeon) > 0) || !flags.wildbigkeys))
			doorcheck = 'possible';//Boss could have required key
		if(flags.doorshuffle === 'C')
		{
			posRequired = ['firerod','somaria','flippers','hookshot','boots','bow','hammer','swordorswordless','glove','bomb',flags.bossshuffle === 'N' ? '' : 'icerod'];
			if(goal === 'item' || !wildsmallkeys || !flags.wildbigkeys)
				posRequired.push('laserbridge');
			if(flags.entrancemode === 'N' && dungeon === 4)
				posRequired.push('mirror');
			if(flags.gametype != 'I' && flags.entrancemode === 'N' && flags.overworldshuffle === 'N' && dungeon === 1)
				posRequired.push('mirrordesert');
			if(flags.gametype === 'I' && flags.entrancemode === 'N' && flags.overworldshuffle === 'N' && dungeon === 5)
				posRequired.push('mirrorskull');
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
					case 'boomerang':
						if(!items.boomerang && !items.bomb)
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'bombdash':
						if(!items.bomb && !items.boots)
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'kill':
						if(!melee_bow() && !cane() && !items.firerod)
						{
							doorcheck = 'possible';
							break label;
						}
						break;
					case 'killbomb':
						if(!items.bomb && !melee_bow() && !cane() && !items.firerod)
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
			doorcheck = 'darkavailable';//Could require light source
		return doorcheck;
	};

	//dungeonEntrances is an array of length dungeonEntranceCounts[dungeonID] with values 'available', 'possible' or 'unavailable'
	//dungeonEntrancesBunny is an array of length dungeonEntranceCounts[dungeonID] with values true (can only access as a bunny) or false/null/undefined otherwise
	window.dungeonBoss = function(dungeonID,dungeonEntrances,dungeonEntrancesBunny) {
		if(dungeonID === 11)
			return items.chest11 ?dungeonChests(11,dungeonEntrances,dungeonEntrancesBunny) :"opened";
		var state = "unavailable",bunny = true,allAccessible = true;
		for(var k = 0; k < dungeonEntranceCounts[dungeonID]; k++)
		{
			if(flags.doorshuffle === 'N' && dungeonEntrancesBunny[k])
				dungeonEntrances[k] = "unavailable";
			if(dungeonEntrances[k] !== "unavailable")
			{
				if(state !== "available")
					state = dungeonEntrances[k];
				if(!dungeonEntrancesBunny[k])
					bunny = false;
			}
			if(dungeonEntrances[k] !== "available" || dungeonEntrancesBunny[k])
				allAccessible = false;
		}
		if(bunny)
			return "unavailable";
		var best = state;
		switch(dungeonID)
		{
			case 0:
				state = flags.doorshuffle === 'N' ?EPBoss() :doorCheck(0,false,true,true,['hookshot','bow'],'boss');
				break;
			case 1:
				if(flags.doorshuffle === 'N')
				{
					var front = "unavailable",back = dungeonEntrances[3];
					if(dungeonEntrances[0] === "available" || dungeonEntrances[1] === "available" || dungeonEntrances[2] === "available")
						front = "available";
					else
						if(dungeonEntrances[0] === "possible" || dungeonEntrances[1] === "possible" || dungeonEntrances[2] === "possible")
							front = "possible";
					state = DPBoss(front,back);
				}
				else
					state = doorCheck(1,false,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','firesource','killbomb'],'boss');
				break;
			case 2:
				state = flags.doorshuffle === 'N' ?HeraBoss() :doorCheck(2,false,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'firesource' : '','kill'],'boss');
				break;
			case 3:
				state = flags.doorshuffle === 'N' ?PoDBoss() :doorCheck(3,false,true,true,['boots','hammer','bow','bomb'],'boss');
				break;
			case 4:
				state = flags.doorshuffle === 'N' ?SPBoss() :doorCheck(4,false,false,false,['flippers',flags.entrancemode === 'N' ?'mirror' :'','hookshot','hammer','bomb'],'boss');
				break;
			case 5:
				if(flags.doorshuffle === 'N')
				{
					var front = "unavailable",back = dungeonEntrances[3];
					if(dungeonEntrances[0] === "available" || dungeonEntrances[1] === "available" || dungeonEntrances[2] === "available")
						front = "available";
					else
						if(dungeonEntrances[0] === "possible" || dungeonEntrances[1] === "possible" || dungeonEntrances[2] === "possible")
							front = "possible";
					state = SWBoss(front,back);
				}
				else
					state = doorCheck(5,false,false,false,['firerod','swordorswordless','bomb'],'boss');
				break;
			case 6:
				state = flags.doorshuffle === 'N' ?TTBoss() :doorCheck(6,false,false,false,[(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'hammer' : '','glove','bomb'],'boss');
				break;
			case 7:
				state = flags.doorshuffle === 'N' ?IPBoss() :doorCheck(7,false,false,false,['freezor','hammer','glove','hookshot','somaria','bomb'],'boss');
				break;
			case 8:
				state = flags.doorshuffle === 'N' ?MMBoss("available") :doorCheck(8,false,true,false,['hookshot','firesource','somaria','bomb'],'boss');
				break;
			case 9:
				state = flags.doorshuffle === 'N' ?TRBoss(...dungeonEntrances) :doorCheck(9,false,true,false,['somaria','firerod',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'laserbridge' : ''],'boss');
				break;
			case 10:
				if((crystalCheck() < flags.ganonvulncount && flags.goals != 'A') || ((crystalCheck() < flags.opentowercount || !items.agahnim2) && flags.goals != 'F') || (flags.goals === 'A' && (!items.agahnim || !allDungeonCheck())))
					return "unavailable";
				if((flags.swordmode != 'S' && items.sword < 2) || (flags.swordmode === 'S' && !items.hammer) || (!items.lantern && !items.firerod))
					return "unavailable";
				if(flags.goals === 'F' && (items.sword > 1 || (flags.swordmode === 'S' && items.hammer)) && (items.lantern || items.firerod))
					state = "available";
				else
					state = flags.doorshuffle === 'N' ?GTBoss() :doorCheck(10,false,false,false,['hammer','firerod','hookshot','boomerang','somaria',(!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys ? 'boots' : '','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'boss');
				break;
			case 12:
				if(!items.sword && !items.hammer && !items.net)
					return "unavailable";
				state = flags.doorshuffle === 'C' ?doorCheck(12,false,true,true,[],'boss') :CTBoss();
		}
		if(flags.doorshuffle !== 'N' && state === "available" && (best === "possible" || !allAccessible))
			return "possible";
		if(flags.doorshuffle !== 'N' && state === "darkavailable" && (best === "possible" || !allAccessible))
			return "darkpossible";
		if(flags.doorshuffle === 'N' && state === "available" && best === "possible")
			return "possible";
		if(flags.doorshuffle === 'N' && state === "darkavailable" && best === "possible")
			return "darkpossible";
		return state;
	};

	//dungeonEntrances is an array of length dungeonEntranceCounts[dungeonID] with values 'available', 'possible' or 'unavailable'
	//dungeonEntrancesBunny is an array of length dungeonEntranceCounts[dungeonID] with values true (can only access as a bunny) or false/null/undefined otherwise
	window.dungeonChests = function(dungeonID,dungeonEntrances,dungeonEntrancesBunny) {
		var state = "unavailable",bunny = true,allAccessible = true;
		for(var k = 0; k < dungeonEntranceCounts[dungeonID]; k++)
		{
			if(flags.doorshuffle === 'N' && dungeonEntrancesBunny[k])
				dungeonEntrances[k] = "unavailable";
			if(dungeonEntrances[k] !== "unavailable")
			{
				if(state !== "available")
					state = dungeonEntrances[k];
				if(!dungeonEntrancesBunny[k])
					bunny = false;
			}
			if(dungeonEntrances[k] !== "available" || dungeonEntrancesBunny[k])
				allAccessible = false;
		}
		if(state === "unavailable")
			return "unavailable";
		if(bunny && flags.doorshuffle === 'N')
			return "unavailable";
		if(bunny && flags.doorshuffle === 'B' && dungeon !== 2)
			return "unavailable";
		var best = state;
		switch(dungeonID)
		{
			case 0:
				state = flags.doorshuffle === 'N' ?EPChests() :doorCheck(0,false,true,true,['hookshot','bow'],'item',bunny);
				break;
			case 1:
				if(flags.doorshuffle === 'N')
				{
					var front = "unavailable",back = dungeonEntrances[3];
					if(dungeonEntrances[0] === "available" || dungeonEntrances[1] === "available" || dungeonEntrances[2] === "available")
						front = "available";
					else
						if(dungeonEntrances[0] === "possible" || dungeonEntrances[1] === "possible" || dungeonEntrances[2] === "possible")
							front = "possible";
					state = DPChests(front,back);
				}
				else
					state = doorCheck(1,false,false,false,['boots','firesource','killbomb'],'item',bunny);
				break;
			case 2:
				state = flags.doorshuffle === 'N' ?HeraChests() :doorCheck(2,false,false,false,['firesource','kill'],'item',bunny);
				break;
			case 3:
				state = flags.doorshuffle === 'N' ?PoDChests() :doorCheck(3,false,true,true,['boots','hammer','bow','bomb'],'item',bunny);
				break;
			case 4:
				state = flags.doorshuffle === 'N' ?SPChests() :doorCheck(4,false,false,false,['flippers',flags.entrancemode === 'N' ?'mirror' :'','hookshot','hammer','bomb'],'item',bunny);
				break;
			case 5:
				if(flags.doorshuffle === 'N')
				{
					var front = "unavailable",back = dungeonEntrances[3];
					if(dungeonEntrances[0] === "available" || dungeonEntrances[1] === "available" || dungeonEntrances[2] === "available")
						front = "available";
					else
						if(dungeonEntrances[0] === "possible" || dungeonEntrances[1] === "possible" || dungeonEntrances[2] === "possible")
							front = "possible";
					state = SWChests(front,back);
				}
				else
					state = doorCheck(5,false,false,false,['firerod','swordorswordless','bomb'],'item',bunny);
				break;
			case 6:
				state = flags.doorshuffle === 'N' ?TTChests() :doorCheck(6,false,false,false,['hammer','glove','bomb'],'item',bunny);
				break;
			case 7:
				state = flags.doorshuffle === 'N' ?IPChests() :doorCheck(7,false,false,false,['freezor','hammer','glove','hookshot','somaria','bomb'],'item',bunny);
				break;
			case 8:
				state = flags.doorshuffle === 'N' ?MMChests("available") :doorCheck(8,false,true,false,['hookshot','firesource','somaria','bomb'],'item',bunny);
				break;
			case 9:
				state = flags.doorshuffle === 'N' ?TRChests(...dungeonEntrances) :doorCheck(9,false,true,false,['somaria','firerod','laserbridge'],'item',bunny);
				break;
			case 10:
				state = flags.doorshuffle === 'N' ?GTChests() :doorCheck(10,false,false,false,['hammer','firerod','hookshot','boomerang','somaria','boots','bow',flags.bossshuffle === 'N' ? '' : 'icerod','bomb'],'item',bunny);
				break;
			case 11:
				if(flags.doorshuffle === 'N')
				{
					var front = "unavailable",back = dungeonEntrances[4],sanc = dungeonEntrances[3];
					if(dungeonEntrances[0] === "available" || dungeonEntrances[1] === "available" || dungeonEntrances[2] === "available")
						front = "available";
					else
						if(dungeonEntrances[0] === "possible" || dungeonEntrances[1] === "possible" || dungeonEntrances[2] === "possible")
							front = "possible";
					state = HCChests(front,back,sanc);
				}
				else
					state = doorCheck(11,false,false,flags.gametype != 'S',['killbomb','bombdash'],'item',bunny);
				break;
			case 12:
				state = flags.doorshuffle === 'N' ?CTChests() :doorCheck(12,false,true,true,['kill','swordorswordless'],'item',bunny);
		}
		if(flags.doorshuffle !== 'N' && state === "available" && (best === "possible" || !allAccessible))
			return "possible";
		if(flags.doorshuffle !== 'N' && state === "darkavailable" && (best === "possible" || !allAccessible))
			return "darkpossible";
		if(flags.doorshuffle === 'N' && state === "available" && best === "possible")
			return "possible";
		if(flags.doorshuffle === 'N' && state === "darkavailable" && best === "possible")
			return "darkpossible";
		return state;
	};

    window.entranceInDarkWorld = function(n) {
		return n == 93 || n == 95 ? flags.gametype != 'I' : n >= 86;
	};

    window.entranceInBunnyWorld = function(n) {
		return n == 93 || n == 95 || (n >= 86) == (flags.gametype != 'I');
	};

    window.entranceChests = function(entranceNames,dungeonID) {
		if (items['chest'+dungeonID] > 0) {
			var entranceAvail = [];
			var entranceBunny = [];
			var found = false;
			nextEntrance:
			for (var i = 0; i < entranceNames.length; i++) {
				for (var j = 0; j < entrances.length; j++) {
					if (entrances[j].known_location === entranceNames[i]) {
						entranceAvail.push('available');
						entranceBunny.push(!items.moonpearl && entranceInBunnyWorld(j));
						found = true;
						continue nextEntrance;
					}
				}
				//special cases
				if (entranceNames[i] == 'placeholder' && dungeonID == 5 && canReachOutcastEntrance()) {
					entranceAvail.push('available');
					entranceBunny.push(!items.moonpearl && entranceInBunnyWorld(102));
					found = true;
					continue nextEntrance;
				}
				if (entranceNames[i] == 'placeholder' && dungeonID == 11 && i == 3) {
					entranceAvail.push(flags.gametype != 'I' && (flags.gametype == 'S' || flags.doorshuffle == 'N') ? 'available' : 'possible');
					entranceBunny.push(false);
					found = true;
					continue nextEntrance;
				}
				if (entranceNames[i] == 'placeholder' && dungeonID == 11 && i == 4 && (((entrances[22].known_location === 'sanc' || entrances[29].known_location === 'sanc' || entrances[18].known_location === 'sanc' || entrances[11].known_location === 'sanc')) || ((entrances[24].known_location === 'sanc' && items.boots && items.agahnim) || (entrances[13].known_location === 'sanc' && items.glove > 0 && (flags.gametype != 'I' || (items.moonpearl && canReachOutcastEntrance())) || entrances[43].known_location === 'sanc' && items.hammer || entrances[95].known_location === 'sanc' && items.agahnim2)))) {
					entranceAvail.push('available');
					var bunny = false;
					for (var j = 0; j < entrances.length; j++) {
						if (entrances[j].known_location === 'sanc') {
							bunny = !items.moonpearl && entranceInBunnyWorld(j);
							break;
						}
					}
					entranceBunny.push(bunny);
					found = true;
					continue nextEntrance;
				}
				//not found
				entranceAvail.push('unavailable');
				entranceBunny.push(false);
			}
	
			if (found) {
				var c = dungeonChests(dungeonID,entranceAvail,entranceBunny);
				if (c === 'available') {
					document.getElementById('chest'+dungeonID).style.backgroundColor = 'lime';
					document.getElementById('chest'+dungeonID).style.color = 'black';
				} else if (c === 'darkavailable') {
					document.getElementById('chest'+dungeonID).style.backgroundColor = 'blue';
					document.getElementById('chest'+dungeonID).style.color = 'white';
				} else if (c === 'possible') {
					document.getElementById('chest'+dungeonID).style.backgroundColor = 'yellow';
					document.getElementById('chest'+dungeonID).style.color = 'black';
				} else if (c === 'darkpossible') {
					document.getElementById('chest'+dungeonID).style.backgroundColor = 'purple';
					document.getElementById('chest'+dungeonID).style.color = 'white';
				} else if (c === 'unavailable') {
					document.getElementById('chest'+dungeonID).style.backgroundColor = 'red';
					document.getElementById('chest'+dungeonID).style.color = 'white';
				} else if (c === 'information') {
					document.getElementById('chest'+dungeonID).style.backgroundColor = 'orange';
					document.getElementById('chest'+dungeonID).style.color = 'black';
				}
			} else {
				document.getElementById('chest'+dungeonID).style.backgroundColor = 'white';
				document.getElementById('chest'+dungeonID).style.color = 'black';
			}
		}
	};

    window.EPBoss = function() {
		var dungeoncheck = enemizer_check(0);
		//Standard check
		if (!items.bigkey0 || dungeoncheck === 'unavailable') return 'unavailable';
		if (items.bow < 2 && flags.enemyshuffle === 'N') return 'unavailable';
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

	//front and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
    window.DPBoss = function(front = 'available',back = 'unavailable') {
		if (front != back && flags.entrancemode === 'N' && (items.glove || flags.glitches != 'N')) {
			if (front === 'available' || back === 'available') front = back = 'available';
			else front = back = 'possible';
		}
		var dungeoncheck = enemizer_check(1);
		if (!items.bigkey1 || dungeoncheck === 'unavailable' || back === 'unavailable' || (!items.firerod && !items.lantern)) return 'unavailable';
		if (back === 'possible') return 'possible';
		if (!flags.wildbigkeys) {
			if (front != 'available') return front;
			if ((flags.wildkeys && items.smallkey1 === 0 && flags.gametype != 'R') || !items.boots) return 'possible';
			if (!flags.wildkeys && flags.gametype != 'R' && !items.boots) return 'possible';
		}
		return dungeoncheck;
    };

    window.HeraBoss = function() {
		var dungeoncheck = enemizer_check(2);
		if (!items.bigkey2 || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildbigkeys) return (dungeoncheck === 'available' ? ((!items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots)) ? 'darkavailable' : 'available') : ((!items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots)) ? 'darkpossible' : 'possible')); 
		if ((flags.wildkeys && (items.smallkey2 === 0 && flags.gametype != 'R')) || (!items.lantern && !items.firerod)) return (!items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots)) ? 'darkpossible' : 'possible';
		return (dungeoncheck === 'available' ? ((!items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots)) ? 'darkavailable' : 'available') : ((!items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots)) ? 'darkpossible' : 'possible'));
    };

    window.PoDBoss = function() {
		var dungeoncheck = enemizer_check(3);
		if (!items.bigkey3 || !items.hammer || items.bow < 2 || dungeoncheck === 'unavailable') return 'unavailable';
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
		if (!items.flippers || (!items.mirror && flags.entrancemode === 'N')) return 'unavailable';
		var dungeoncheck = enemizer_check(4);
		if (!items.hammer || !items.hookshot || (items.smallkey4 === 0 && flags.gametype != 'R')) return 'unavailable';
		return dungeoncheck;
    };

	//front and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
    window.SWBoss = function(front = 'available',back = 'unavailable') {
		if (!items.firerod) return 'unavailable';
		if (front != back && flags.entrancemode === 'N' && (items.firerod || front === 'unavailable')) {
			if (front === 'available' || back === 'available') front = back = 'available';
			else front = back = 'possible';
		}
		var dungeoncheck = enemizer_check(5);
		var keycheck = front === 'available' || flags.gametype === 'R' || (flags.wildkeys && items.smallkey5) ? 'available' : front === 'possible' || (!flags.wildkeys && back != 'unavailable') ? 'possible' : 'unavailable';
		if (back === 'unavailable' || dungeoncheck === 'unavailable' || keycheck === 'unavailable' || (items.sword === 0 && flags.swordmode != 'S')) return 'unavailable';
		if (back === 'possible' || keycheck === 'possible') return 'possible';
		return dungeoncheck;
	};

    window.TTBoss = function() {
		var dungeoncheck = enemizer_check(6);
		if (!items.bomb && (flags.bossshuffle === 'N' || enemizer[6] === 7)) return 'unavailable';
		if (!items.bomb && dungeoncheck === 'available' && flags.bossshuffle != 'N' && enemizer[6]%11 === 0) dungeoncheck = 'possible';
		return (items.bigkey6 ? dungeoncheck : 'unavailable');
    };

    window.IPBoss = function() {
		if (!items.firerod && (!items.bombos || (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
		var dungeoncheck = enemizer_check(7);
		if (!items.hammer || items.glove === 0 || dungeoncheck === 'unavailable') return 'unavailable';
		if (!items.bomb) return items.somaria ? 'possible' : 'unavailable';
		if (flags.wildbigkeys) {
			if (!items.bigkey7) return 'possible';
		} else {
			if (!items.hookshot && flags.gametype != 'R') return 'possible';
		}
		if (flags.wildkeys || flags.gametype === 'R') {
			if (flags.gametype != 'R' && (items.smallkey7 === 0 || (items.smallkey7 === 1 && !items.somaria))) return 'possible';
		} else {
			if (!items.hookshot || !items.somaria) return 'possible';
		}
		
		return dungeoncheck;
    };

    window.MMBoss = function(medcheck) {
		if (!items.boots && !items.hookshot) return 'unavailable';
		if (medcheck === 'unavailable') return 'unavailable';
		var dungeoncheck = enemizer_check(8);
		if (!items.bigkey8 || !items.somaria || !items.bomb || dungeoncheck === 'unavailable') return 'unavailable';
		if (dungeoncheck === 'possible' || medcheck === 'possible') {
			return (items.lantern ? 'possible' : 'darkpossible');
		}
		if (!flags.wildbigkeys) {
			if (!items.lantern && !items.firerod) {
				return 'darkpossible';
			} else {
				return (items.lantern ? 'available' : 'darkavailable');
			}
		} else {
			return (items.lantern ? 'available' : 'darkavailable');
		}
		return (dungeoncheck === 'possible' ? (items.lantern ? 'possible' : 'darkpossible') : 'unavailable');
    };

	//front, middle, bigchest and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
	//Not properly implemented!
    window.TRBoss = function(front = 'available',middle = 'unavailable',bigchest = 'unavailable',back = 'unavailable') {
		if (back != 'unavailable' && middle != 'available' && items.somaria && items.lantern && (items.bomb || items.boots)) {//More complicated with dark room navigation
			middle = back;
		}
		if (bigchest != 'unavailable' && middle != 'available' && (flags.entrancemode === 'N' || ((items.somaria || items.hookshot) && (melee_bow() || items.firerod || cane())))) {
			middle = bigchest;
		}
		if (middle != 'unavailable' && bigchest != 'available' && items.bomb && flags.entrancemode === 'N') {
			bigchest = middle;
		}
		if (middle != 'unavailable' && front != 'available' && items.somaria) {
			front = middle;
		}
		if (front != 'unavailable' && middle != 'available' && items.somaria && items.smallkey9 >= 2) {
			middle = (flags.wildkeys || flags.gametype === 'R') && items.smallkey9 === 4 ? front : 'possible';
		}
		if ((middle != 'unavailable' || bigchest != 'unavailable') && back != 'available' && items.somaria && items.lantern && (items.bomb || items.boots) && items.bigkey9) {
			back = (flags.wildkeys || flags.gametype === 'R') && items.smallkey9 === 4 && flags.wildbigkeys ? (middle === 'available' ? middle : bigchest) : 'possible';
		}
		var dungeoncheck = enemizer_check(9);
		if (!items.bigkey9 || !items.smallkey9 || !items.somaria || (back === 'unavailable' && !items.bomb && !items.boots) || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildkeys) {
			if (items.smallkey9 < 4 && flags.gametype != 'R') return 'possible';
		}
		if (((!flags.wildkeys && flags.gametype != 'R') || !flags.wildbigkeys) && (!items.firerod || front != 'available' || middle != 'available' || (bigchest != 'available' && !flags.wildkeys && flags.gametype != 'R') || back != 'available')) return 'possible';
		return back === 'available' ? dungeoncheck : ((front === 'available' || middle === 'available' || back === 'available') && (items.bomb || items.boots) ? (items.lantern ? 'available' : 'darkavailable') : 'possible');
	};

    window.TRFrontBoss = function(medcheck) {
		if (medcheck === 'unavailable') return 'unavailable';
		var dungeoncheck = enemizer_check(9);
		if (!items.bigkey9 || !items.somaria || (!items.bomb && !items.boots) || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildkeys) {
			if (items.smallkey9 < 4 && flags.gametype != 'R') return 'unavailable';
		}
		return (dungeoncheck === 'available' && medcheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
    };

	window.TRMidBoss = function() {
		var dungeoncheck = enemizer_check(9);
		if (!items.bigkey9 || !items.somaria || (!items.bomb && !items.boots) || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildbigkeys || flags.wildkeys) {
			if (items.smallkey9 < 2 && flags.gametype != 'R') return 'unavailable';
			if (items.smallkey9 < 4 && flags.gametype != 'R') return 'possible';
			return dungeoncheck;
		} else {
			if (!items.firerod) return 'possible';
			return (dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
		}
    };
	
    window.TRBackBoss = function() {
		var dungeoncheck = enemizer_check(9);
		if (!items.bigkey9 || !items.somaria || dungeoncheck === 'unavailable') return 'unavailable';
		if (flags.wildkeys) {
			if (items.smallkey9 === 0 && flags.gametype != 'R') return 'unavailable';
			if (items.smallkey9 < 4 && flags.gametype != 'R') return 'possible';
			return dungeoncheck;
		} else {
			if (!items.firerod) return 'possible';
			return (dungeoncheck === 'available' ? (items.lantern ? 'available' : 'darkavailable') : (items.lantern ? 'possible' : 'darkpossible'));
		}
    };

    window.GTBoss = function() {
		var dungeoncheck = enemizer_check(10);
		if (!items.bigkey10 || (items.bow < 2 && flags.enemyshuffle === 'N') || (!items.lantern && !items.firerod) || !items.hookshot || ((items.sword < 2 && flags.swordmode != 'S') || (flags.swordmode === 'S' && !items.hammer)) || !items.bomb || dungeoncheck === 'unavailable') return 'unavailable';
		if (!items.sword && !items.hammer && !items.net) return 'unavailable';
		if (flags.wildkeys) {
			if (items.smallkey10 === 0 && flags.gametype != 'R') return 'unavailable';
			if (items.smallkey10 < 3 && flags.gametype != 'R') return 'possible';
		}
		
		return dungeoncheck;
    };

    window.CTBoss = function() {
		if((!items.bomb || flags.doorshuffle != 'N') && !melee_bow() && !cane() && !items.firerod) return 'unavailable';
		if(items.sword == 0 && flags.swordmode != 'S') return 'unavailable';
		if(items.sword == 0 && !items.hammer && !items.net) return 'unavailable';
		if(flags.wildkeys && flags.gametype != 'R' && items.smallkeyhalf1 < 2) return 'unavailable';
		return items.lantern ? 'available' : 'darkavailable';
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
	
	function ConvertChestToBoss(x) {
		switch(x) {
			case 'A':
				return 'available';
			case 'P':
				return 'possible';
			case 'DA':
				return 'darkavailable';
			case 'DP':
				return 'darkpossible';
			case 'U':
				return 'unavailable';
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
		} else {
			chests[3] = (items.lantern ? 'K' : 'P'); //Key replaces itself
		}
		//Big Key Chest
		if (!flags.wildbigkeys) {
			chests[4] = (items.lantern ? 'A' : (((items.bow > 1 || flags.enemyshuffle != 'N') && dungeoncheck === 'available') ? 'DA' : 'P'));
		} else {
			chests[4] = (items.lantern ? 'A' : 'DA');
		}
		//Boss
		chests[5] = ConvertBossToChest(EPBoss());
		
		return available_chests(0, chests, items.maxchest0, items.chest0); 		
    };

	//front and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
    window.DPChests = function(front = 'available',back = 'unavailable') {
		if (front != back && flags.entrancemode === 'N' && (items.glove || flags.glitches != 'N')) {
			if (front === 'available' || back === 'available') front = back = 'available';
			else front = back = 'possible';
		}

		var chests = ['U','U','U','U','U','U'];

		if (front != 'unavailable') {
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
							//If Boots, two items at a minimum are available, so flagging compass as available as always with boots,
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

			if (front === 'possible') {
				for (var k = 0; k < 5; k++) {
					if (chests[k] === 'A') chests[k] = 'P';
				}
			}
		}
		
		//Boss
		chests[5] = ConvertBossToChest(DPBoss(front,back));
		
		return available_chests(1, chests, items.maxchest1, items.chest1);
    };

    window.HeraChests = function() {
		var isDark = !items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots) && flags.entrancemode === 'N' && flags.overworldshuffle === 'N';
		
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
				if (flags.wildkeys) {
					chests[2] = (items.smallkey2 === 0 ? 'U' : (isDark ? 'DA' : 'A'));
				} else {
					//This needs to be only possible without the big key, because the small key could be locked upstairs in wild big keys
					if (items.bigkey2) {
						chests[2] = (isDark ? 'DA' : 'A');
					} else {
						chests[2] = (isDark ? 'DP' : 'P');
					}
				}
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
			if ((items.bow > 1 || flags.enemyshuffle != 'N') && items.bomb) {
				//If there is a bow and bombs, all chests are available with hammer, with dark logic
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
			} else {
				//Shooter Room
				chests[0] = 'P';
				if (items.bow > 1 || flags.enemyshuffle != 'N') {
					//Map Chest
					chests[1] = (items.bomb || items.boots) ? 'P' : 'U';
					//The Arena - Ledge
					chests[2] = (items.bomb ? 'P' : 'U');
				}
				//Stalfos Basement
				chests[3] = 'P';
				//The Arena - Bridge
				chests[4] = 'P';
				//Big Key Chest
				chests[5] = (items.bomb ? 'P' : 'U');
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
				chests[12] = (items.bomb ? items.lantern ? 'P' : 'DP' : 'U');
				//Boss
				chests[13] = 'U';				
			}

		//2) Retro (w/ Big Key shuffle checks)
		//We ignore the wild keys check, as retro overrides it
		} else if (flags.gametype === 'R') {
			chests[0] = 'A';
			
			if (items.bow > 1 || flags.enemyshuffle != 'N') {
				//Map Chest
				chests[1] = (items.bomb || items.boots) ? 'A' : 'U';
				//The Arena - Ledge
				chests[2] = (items.bomb ? 'A' : 'U');
			}
			//Stalfos Basement
			chests[3] = 'A';
			//The Arena - Bridge
			chests[4] = 'A';
			//Big Key Chest
			chests[5] = (items.bomb ? 'A' : 'U');
			//Compass Chest
			chests[6] = 'A';
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
			if (items.bigkey3) {
				chests[12] = (items.bomb ? items.lantern ? 'A' : 'DA' : 'P');
			}			
		
		//3) Small Key shuffle only
		} else if (!flags.wildbigkeys && flags.wildkeys) {
			chests[0] = 'A';

			if (items.bow > 1 || flags.enemyshuffle != 'N') {
				//Map Chest
				chests[1] = (items.bomb || items.boots) ? 'A' : 'U';
				//The Arena - Ledge
				chests[2] = (items.bomb ? 'A' : 'U');
			}
			
			if ((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) || items.smallkey3 > 0) {
				//Stalfos Basement
				chests[3] = 'A';
				//The Arena - Bridge
				chests[4] = 'A';
			}
			
			//Big Key Chest
			if (items.bomb && (((items.hammer && (items.bow > 1 || flags.enemyshuffle != 'N')) && items.smallkey3 > 2) || items.smallkey3 > 3)) {
				chests[5] = 'A';
			}
			
			if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 0) || items.smallkey3 > 1) {
				//Compass Chest
				chests[6] = 'A';
				//Dark Basement - Left
				chests[8] = (items.lantern || items.firerod) ? 'A' : 'DA';
				//Dark Basement - Right
				chests[9] = (items.lantern || items.firerod) ? 'A' : 'DA';
			}
			
			if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 3) || items.smallkey3 > 4) {
				//Harmless Hellway
				chests[7] = 'A';
			}
			
			if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 1) || items.smallkey3 > 2) {
				//Dark Maze - Top
				chests[10] = (items.lantern ? 'A' : 'DA');
				//Dark Maze - Bottom
				chests[11] = (items.lantern ? 'A' : 'DA');
				//Big Chest
				chests[12] = (items.bomb ? items.lantern ? 'K' : 'DP' : 'P'); // This is the big key replacement
			}
			
			//Boss
			chests[13] = ConvertBossToChest(PoDBoss());
		//4) Big Key shuffle only
		} else if (flags.wildbigkeys && !flags.wildkeys) {
			if ((items.bow > 1 || flags.enemyshuffle === 'N') && items.bomb) {
				//If there is a bow and bombs, all chests are available with hammer, with dark logic
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
			} else {
				//Shooter Room
				chests[0] = 'P';
				if (items.bow > 1 || flags.enemyshuffle === 'N') {
					//Map Chest
					chests[1] = (items.bomb || items.boots) ? 'P' : 'U';
					//The Arena - Ledge
					chests[2] = items.bomb ? 'P' : 'U';
				}
				//Stalfos Basement
				chests[3] = 'P';
				//The Arena - Bridge
				chests[4] = 'P';
				//Big Key Chest
				chests[5] = (items.bomb ? 'P' : 'U');
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
				chests[12] = (items.bigkey3 && items.bomb ? (items.lantern ? 'P' : 'DP') : 'U');
				//Boss
				chests[13] = 'U';
			}
		//5) Small Key + Big Key shuffle
		} else {
			chests[0] = 'A';
			
			if (items.bow > 1 || flags.enemyshuffle != 'N') {
				//Map Chest
				chests[1] = (items.bomb || items.boots ? 'A' : 'U');
				//The Arena - Ledge
				chests[2] = (items.bomb ? 'A' : 'U');
			}
			
			if ((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) || items.smallkey3 > 0) {
				//Stalfos Basement
				chests[3] = 'A';
				//The Arena - Bridge
				chests[4] = 'A';
			}
			
			//Big Key Chest
			if (items.bomb && (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N'))) && items.smallkey3 > 2) || items.smallkey3 > 3)) {
				chests[5] = 'A';
			}
			
			if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 0) || items.smallkey3 > 1) {
				//Compass Chest
				chests[6] = 'A';
				//Dark Basement - Left
				chests[8] = (items.lantern || items.firerod) ? 'A' : 'DA';
				//Dark Basement - Right
				chests[9] = (items.lantern || items.firerod) ? 'A' : 'DA';
			}
			
			//Harmless Hellway
			if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 3) || items.smallkey3 > 4) {
				chests[7] = 'A';
			}
			
			if (((items.hammer && ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.bomb || items.boots))) && items.smallkey3 > 1) || items.smallkey3 > 2) {
				//Dark Maze - Top
				chests[10] = (items.lantern ? 'A' : 'DA');
				//Dark Maze - Bottom
				chests[11] = (items.lantern ? 'A' : 'DA');
				//Big Chest
				chests[12] = (items.bigkey3 && items.bomb ? (items.lantern ? 'A' : 'DA') : 'U');
			}
			
			//Boss
			chests[13] = ConvertBossToChest(PoDBoss());
		}
		
		return available_chests(3, chests, items.maxchest3, items.chest3);
    };

    window.SPChests = function() {
		if (!items.flippers || (!items.mirror && flags.entrancemode === 'N')) return 'unavailable';
		var chests = ['U','U','U','U','U','U','U','U','U','U'];
		
		//Entrance
		if (flags.wildkeys || flags.gametype === 'R') {
			chests[0] = 'A';
		} else {
			chests[0] = 'K';
		}
		
		if (!flags.wildkeys || items.smallkey4 > 0 || flags.gametype == 'R') {
			//Map Chest
			chests[1] = (items.bomb ? 'A' : 'U');
			
			//Without hammer, cannot go any further
			if (items.hammer) {
				//Compass Chest
				chests[2] = 'A';

				//Big Chest
				if (flags.wildbigkeys) {
					chests[3] = (items.bigkey4 ? 'A' : 'U');
				} else {
					chests[3] = (items.hookshot ? 'K' : 'U');
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

	//front and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
    window.SWChests = function(front = 'available',back = 'unavailable') {
		if (front != back && flags.entrancemode === 'N' && (items.firerod || front === 'unavailable')) {
			if (front === 'available' || back === 'available') front = back = 'available';
			else front = back = 'possible';
		}
		var dungeoncheck = enemizer_check(5);
		
		var chests = ['U','U','U','U','U','U','U','U'];
		
		if (front != 'unavailable') {
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
			if (items.bomb) {
				if (flags.wildbigkeys) {
					chests[4] = (items.bigkey5) ? 'A' : 'U';
				} else {
					if (back === 'available' && (front === 'available' || flags.gametype === 'R' || (flags.wildkeys && items.smallkey5)) && (items.sword > 0 || flags.swordmode === 'S') && items.firerod && dungeoncheck === 'available') {
						chests[4] = 'K'; //If is full clearable, set to a key, else possible
					} else {
						chests[4] = 'P';
					}
				}
			}
			
			//Big Key Chest
			chests[5] = 'A';

			if (front === 'possible') {
				for (var k = 0; k < 6; k++) {
					if (chests[k] === 'A') chests[k] = 'P';
				}
			}
		}
		
		//Cannot proceed without fire rod
		if (back != 'unavailable') {
			//Bridge Room
			chests[6] = back === 'available' ? (front != 'available' && !flags.wildkeys && flags.gametype != 'R' ? 'P' : 'A') : 'P';

			//Boss
			chests[7] = ConvertBossToChest(SWBoss(front,back));
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
		if (!items.firerod && (!items.bombos || (items.sword == 0 && flags.swordmode != 'S'))) return 'unavailable';
		var chests = ['U','U','U','U','U','U','U','U'];
		
        //Compass Chest
		if (flags.wildkeys || flags.gametype === 'R') {
			chests[0] = 'A';
		} else {
			chests[0] = items.bomb ? 'K' : 'P'; //Reserving as small key 1 but only if we can get further into the dungeon as well
		}
		
		if (items.bomb) {
			//Spike Room
			if (flags.wildkeys) {
				chests[1] = (items.hookshot || (items.smallkey7 > 0 || flags.gametype == 'R')) ? 'A' : 'U';			
			} else {
				chests[1] = items.hookshot ? 'A' : 'P';
			}
			
			if (items.hammer) {
				//Map Chest
				if (items.glove > 0) {
					if (flags.wildkeys) {
						chests[2] = (items.hookshot || (items.smallkey7 > 0 || flags.gametype == 'R')) ? 'A' : 'U';		
					} else {
						chests[2] = (items.hookshot ? (!flags.wildkeys ? 'K' : 'A') : 'P'); //Reserving as small key 2
					}

					//Big Key Chest
					if (flags.wildkeys) {
						chests[3] = (items.hookshot || (items.smallkey7 > 0 || flags.gametype == 'R')) ? 'A' : 'U';
					} else {
						chests[3] = (items.hookshot || items.somaria) ? 'A' : 'P';
					}
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
		}
		
		return available_chests(7, chests, items.maxchest7, items.chest7);
    };

    window.MMChests = function(medcheck) {
		if (!items.boots && !items.hookshot) return 'unavailable';
		if (medcheck === 'unavailable') return 'unavailable';
		if (medcheck === 'possible') return 'possible';

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
		chests[7] = (items.bomb ? ConvertBossToChest(MMBoss(medcheck)) : 'U');
		
		return available_chests(8, chests, items.maxchest8, items.chest8);
    };

	//front, middle, bigchest and back can be 'available', 'possible' or 'unavailable', at most one can be 'unavailable'
	//Not properly implemented!
    window.TRChests = function(front = 'available',middle = 'unavailable',bigchest = 'unavailable',back = 'unavailable') {
		if (back != 'unavailable' && middle != 'available' && items.somaria && items.lantern && (items.bomb || items.boots)) {//More complicated with dark room navigation
			middle = back;
		}
		if (bigchest != 'unavailable' && middle != 'available' && (flags.entrancemode === 'N' || ((items.somaria || items.hookshot) && (melee_bow() || items.firerod || cane())))) {
			middle = bigchest;
		}
		if (middle != 'unavailable' && bigchest != 'available' && items.bomb && flags.entrancemode === 'N') {
			bigchest = middle;
		}
		if (middle != 'unavailable' && front != 'available' && items.somaria) {
			front = middle;
		}
		if (front != 'unavailable' && middle != 'available' && items.somaria && items.smallkey9 >= 2) {
			middle = (flags.wildkeys || flags.gametype === 'R') && items.smallkey9 === 4 ? front : 'possible';
		}
		if ((middle != 'unavailable' || bigchest != 'unavailable') && back != 'available' && items.somaria && items.lantern && (items.bomb || items.boots) && items.bigkey9) {
			back = (flags.wildkeys || flags.gametype === 'R') && items.smallkey9 === 4 && flags.wildbigkeys ? (middle === 'available' ? middle : bigchest) : 'possible';
		}
		var dungeoncheck = enemizer_check(9);
		//If we have absolutely everything, available
		if (dungeoncheck === 'available' && front === 'available' && middle === 'available' && bigchest === 'available' && back === 'available' && items.somaria && (items.bomb || items.boots) && items.firerod && items.smallkey9 === 4 && items.bigkey9) return items.lantern ? 'available' : 'darkavailable';
		//Else, see if we can use Inverted or OWG logic
		if (middle === 'available' && bigchest === 'available' && back === 'available') return TRBackChests();
		if (middle === 'available' && bigchest === 'available' && TRMidChests().endsWith('available')) return TRMidChests();
		if (middle != 'unavailable' && bigchest != 'unavailable' && back != 'unavailable') {
			var check = TRBackChests();
			if (check === 'available') return 'possible';
			if (check === 'darkavailable') return 'darkpossible';
			return check;
		}
		if (middle != 'unavailable' && bigchest != 'unavailable') {
			var check = TRMidChests();
			if (check === 'available') return 'possible';
			if (check === 'darkavailable') return 'darkpossible';
			return check;
		}
		//Otherwise, no idea
		return 'possible';
	};

    window.TRFrontChests = function(medcheck) {
		if (!items.somaria) return 'unavailable';
		if (medcheck === 'unavailable') return 'unavailable';
		var isDark = !items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots) && flags.entrancemode === 'N' && flags.overworldshuffle === 'N';
		
		if (medcheck === 'possible') return (isDark ? 'darkpossible' : 'possible');

		var chests = ['U','U','U','U','U','U','U','U','U','U','U','U'];
		
		//Because of the complexity of TR and key logic, there are going to be five modes here to consider:
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
			chests[5] = (items.bomb ? items.firerod ? 'K' : 'P' : 'U'); //Reserved as big key, if fire rod made it accessable to this point
			
			if (items.bomb || items.boots) {
				//Crystaroller Room
				chests[6] = (items.firerod ? 'K' : 'P'); //Reserved as fourth small key

				//Laser Bridge
				chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));

				//Boss
				chests[11] = ConvertBossToChest(TRFrontBoss(medcheck));
			}

		//2) Retro (w/ Big Key shuffle checks)
		//We ignore the wild keys check, as retro overrides it
		} else if (flags.gametype === 'R') {
			//Compass Chest
			chests[0] = 'A';
			
			//Chain Chomps
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
			chests[5] = (items.bomb ? items.firerod ? 'K' : 'P' : 'U'); //Reserved as big key, if fire rod made it accessable to this point
			
			if (items.bomb || items.boots) {
				//Crystaroller Room
				chests[6] = (items.firerod ? 'A' : 'P');

				//Laser Bridge
				chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));

				//Boss
				chests[11] = ConvertBossToChest(TRFrontBoss(medcheck));
			}

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
					chests[5] = (items.bomb ? (items.firerod ? 'K' : 'P') : 'U'); //Reserved as big key, if fire rod made it accessable to this point
					
					if (items.bomb || items.boots) {
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
								chests[11] = ConvertBossToChest(TRFrontBoss(medcheck));
							}
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
			
			if (items.bigkey9 && (items.bomb || items.boots)) {
				//Big Chest
				chests[5] = (items.bomb ? items.firerod ? 'A' : 'P' : 'U'); //Reserved as big key, if fire rod made it accessable to this point
				
				//Crystaroller Room
				chests[6] = (items.firerod ? 'K' : 'P'); //Reserved as fourth small key
				
				//Laser Bridge
				chests[7] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[8] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[9] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				chests[10] = (items.firerod ? (items.lantern ? 'A' : 'DA') : (items.lantern ? 'P' : 'DP'));
				
				//Boss
				chests[11] = ConvertBossToChest(TRFrontBoss(medcheck));
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
					
					if (items.bigkey9 && (items.bomb || items.boots)) {				
						//Big Chest
						chests[5] = (items.bomb ? 'A' : 'U');
						
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
								chests[11] = ConvertBossToChest(TRFrontBoss(medcheck));
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
		var isDark = !items.flute && !items.lantern && !(flags.glitches != 'N' && items.boots) && flags.entrancemode === 'N' && flags.overworldshuffle === 'N';
		
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
		var isDark = !items.flute && !items.lantern && flags.entrancemode === 'N' && flags.overworldshuffle === 'N';
		
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
		var isDark = !items.flute && !items.lantern && flags.gametype != 'I' && !(flags.glitches != 'N' && items.boots) && flags.entrancemode === 'N' && flags.overworldshuffle === 'N';

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
					
					if (items.bomb) {
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

				if (items.bomb) {
					//Big Key Chest - 2
					chests[13] = 'A';
					//Big Key Room - Left - 2
					chests[14] = 'A';
					//Big Key Room - Right - 2
					chests[15] = 'A';
				}
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
			
			if ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = 'A';
				//Mini Helmasaur Room - Right - 3
				chests[24] = 'A';
				if (items.bomb) {
					//Pre-Moldorm Chest - 3
					chests[25] = 'A';
					
					if (items.hookshot) {
						//Moldorm Chest
						chests[26] = 'A';
					}
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
					
					if (items.bomb) {
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

				if (items.bomb) {
					//Big Key Chest - 2
					chests[13] = 'A';
					//Big Key Room - Left - 2
					chests[14] = 'A';
					//Big Key Room - Right - 2
					chests[15] = 'A';
				}
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
			
			if ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = 'A';
				//Mini Helmasaur Room - Right - 3
				chests[24] = 'A';
				if (items.bomb) {
					//Pre-Moldorm Chest - 3
					chests[25] = 'A';
					
					if (items.hookshot) {
						//Moldorm Chest
						chests[26] = 'A';
					}
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
					
					if (items.smallkey10 > 0 && items.bomb) {
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

				if (items.bomb) {
					//Big Key Chest - 2
					chests[13] = 'A';
					//Big Key Room - Left - 2
					chests[14] = 'A';
					//Big Key Room - Right - 2
					chests[15] = 'A';
				}
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
			
			if ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod) && items.smallkey10 > 0 && items.bigkey10) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
				//Mini Helmasaur Room - Right - 3
				chests[24] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');

				if (items.bomb) {
					//Pre-Moldorm Chest - 3
					chests[25] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
					
					if (items.hookshot) {
						//Moldorm Chest - 3
						chests[26] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
					}
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
					
					if (items.bomb) {
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

				if (items.bomb) {
					//Big Key Chest - 2
					chests[13] = 'A';
					//Big Key Room - Left - 2
					chests[14] = 'A';
					//Big Key Room - Right - 2
					chests[15] = 'A';
				}
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
			
			if (items.bigkey10 && (items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = 'A';
				//Mini Helmasaur Room - Right - 3
				chests[24] = 'A';

				if (items.bomb) {
					//Pre-Moldorm Chest - 3
					chests[25] = 'A';
					
					if (items.hookshot) {
						//Moldorm Chest
						chests[26] = 'A';
					}
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
					
					if (items.smallkey10 > 0 && items.bomb) {
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

				if (items.bomb) {
					//Big Key Chest - 2
					chests[13] = 'A';
					//Big Key Room - Left - 2
					chests[14] = 'A';
					//Big Key Room - Right - 2
					chests[15] = 'A';
				}
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
			
			if ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod) && items.smallkey10 > 0 && items.bigkey10) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
				//Mini Helmasaur Room - Right - 3
				chests[24] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');

				if (items.bomb) {
					//Pre-Moldorm Chest - 3
					chests[25] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
					
					if (items.hookshot) {
						//Moldorm Chest - 3
						chests[26] = ((items.smallkey10 > 2 || flags.gametype == 'R') ? 'A' : 'P');
					}
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
					
					if (items.bomb) {
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

				if (items.bomb) {
					//Big Key Chest - 2
					chests[13] = 'A';
					//Big Key Room - Left - 2
					chests[14] = 'A';
					//Big Key Room - Right - 2
					chests[15] = 'A';
				}
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
			
			if ((items.bow > 1 || flags.enemyshuffle != 'N') && (items.lantern || items.firerod)) {
				//Mini Helmasaur Room - Left - 3
				chests[23] = 'A';
				//Mini Helmasaur Room - Right - 3
				chests[24] = 'A';
				if (items.bomb) {
					//Pre-Moldorm Chest - 3
					chests[25] = 'A';
					
					if (items.hookshot) {
						//Moldorm Chest
						chests[26] = 'A';
					}
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

	//front, back and sanc can be 'available', 'possible' or 'unavailable', at most two can be 'unavailable'
    window.HCChests = function(front = 'available',back = 'unavailable',sanc = 'unavailable') {
		var weapon = items.bomb || melee_bow() || items.firerod || cane();
		if (flags.gametype === 'S') {
			front = back = sanc = 'available';
			weapon = true;
		}
		//Walk from front to back
		if (front != 'unavailable' && back != 'available' && items.lantern && (weapon || items.icerod || flags.gametype === 'R')) {//Could consider dark room navigation
			if (flags.gametype === 'R') {
				back = front;
			} else {
				if (!flags.wildkeys) {
					back = 'possible';
				} else {
					if (items.smallkeyhalf0) {
						back = front;
					}
				}
			}
		}
		//Walk from back to sanc
		if (back != 'unavailable' && sanc != 'available') {
			sanc = back;
		}

		var chests = ['U','U','U','U','U','U','U','U'];

		if (front != 'unavailable') {
			chests[0] = front === 'available' ? 'A' : 'P';
			if (weapon) {
				chests[1] = front === 'available' ? 'A' : 'P';
				chests[2] = front === 'available' ? 'A' : 'P';
			}
			if (items.lantern || flags.gametype === 'S') {
				chests[3] = front === 'available' ? 'A' : 'P';
			} else {
				chests[3] = front === 'available' ? 'DA' : 'DP';
			}
		} else {
			if (back != 'unavailable' && (weapon || items.icerod)) {
				if (flags.gametype === 'R') {
					chests[3] = (items.lantern ? '' : 'D')+(back === 'available' ? 'A' : 'P');
				} else {
					if (!flags.wildkeys) {
						chests[3] = items.lantern ? 'P' : 'DP';
					} else {
						if (items.smallkeyhalf0) {
							chests[3] = (items.lantern ? '' : 'D')+(back === 'available' ? 'A' : 'P');
						}
					}
				}
			}
		}

		if (back != 'unavailable' && (items.bomb || items.boots)) {
			chests[4] = back === 'available' ? 'A' : 'P';
			chests[5] = back === 'available' ? 'A' : 'P';
			chests[6] = back === 'available' ? 'A' : 'P';
		}
		if (sanc != 'unavailable') {
			chests[7] = sanc === 'available' ? 'A' : 'P';
		}
		//Dark room navigation
		if (front != 'unavailable' && back === 'unavailable' && (weapon || items.icerod || flags.gametype === 'R') && (flags.gametype === 'R' || !flags.wildkeys || items.smallkeyhalf0) && (items.bomb || items.boots)) {
			chests[4] = front === 'available' && (flags.gametype === 'R' || (flags.wildkeys && items.smallkeyhalf0)) ? 'DA' : 'DP';
			chests[5] = front === 'available' && (flags.gametype === 'R' || (flags.wildkeys && items.smallkeyhalf0)) ? 'DA' : 'DP';
			chests[6] = front === 'available' && (flags.gametype === 'R' || (flags.wildkeys && items.smallkeyhalf0)) ? 'DA' : 'DP';
		}
		if (front != 'unavailable' && sanc === 'unavailable' && (weapon || items.icerod || flags.gametype === 'R') && (flags.gametype === 'R' || !flags.wildkeys || items.smallkeyhalf0)) {
			chests[7] = front === 'available' && (flags.gametype === 'R' || (flags.wildkeys && items.smallkeyhalf0)) ? 'DA' : 'DP';
		}
		if (!flags.wildkeys && flags.gametype != 'R') {
			if (flags.gametype === 'S') {
				chests[0] = 'K';
			} else {
				for (var k = 0; k < 8; k++) {//Small key could be anywhere. Temporary bad solution
					if (chests[k] === 'A') {
						chests[k] = 'P';
						break;
					}
				}
			}
		}

		return available_chests(11, chests, items.maxchest11, items.chest11);
	};

    window.CTChests = function() {
		if(!items.bomb && !melee_bow() && !cane() && !items.firerod) return 'unavailable';
		
		var chests = ['U','U'];

		if(flags.wildkeys || flags.gametype === 'R')
		{
			chests[0] = 'A';
			if(items.smallkeyhalf1 > 0)
				chests[1] = items.lantern ? 'A' : 'DA';
		}
		else
		{
			chests[0] = 'K';
			chests[1] = 'K';
		}

		return available_chests(12, chests, items.maxchest12, items.chest12);
	};

	function hasFoundLocation(x) {
		for (var i = 0; i < entrances.length; i++) {
			if (entrances[i].known_location === x) {
				return true;
			}
		}
		return false;
	}

}(window));
