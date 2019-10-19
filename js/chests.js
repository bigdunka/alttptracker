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
	function isdarkdm() { return !items.flute && !items.lantern; }
    function always() { return 'available'; }

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
				if (crystal_check() < flags.ganonvulncount || (crystal_check() < flags.opentowercount && flags.goals != 'F') || !canReachLightWorld()) return 'unavailable';
				if (flags.goals === 'F' && (items.sword > 1 || is_swordless && items.hammer) && (items.lantern || items.firerod)) return 'available';
				return window.GTBoss();			
			},
			can_get_chest: function() {
				if (crystal_check() < flags.opentowercount || !canReachLightWorld()) return 'unavailable';
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
						return (items.sword || items.hammer || (items.net && (items.somaria || items.byrna || items.firerod || items.bow > 0))) && (items.sword || (is_swordless && (items.hammer || items.net))) && (activeFlute() || items.glove) && (items.smallkeyhalf1 === 2 || flags.gametype == 'R') && agatowerweapon() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
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
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
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
					(items.moonpearl ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'unavailable') :
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
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
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
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
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
				return canReachLightWorld() ? (items.flippers ? 'available' : 'unavailable') : 'unavailable';
			}
		}, { // [30]
			caption: 'Ether Tablet {sword2}{book}',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.hammer && items.book && (activeFlute() || items.glove) && (items.hookshot || items.glove === 2) ?
					(items.sword >= 2 || (is_swordless && items.hammer) ? (items.lantern || activeFlute() ? 'available' : 'darkavailable') : 'information') :
					'unavailable';
			}
		}, { // [31]
			caption: 'Bombos Tablet {sword2}{book}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() && items.book ?
					(items.sword >= 2 || (is_swordless && items.hammer)) ? 'available' : 'information' :
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
				return 'unavailable';
			}
		}, { // [33]
			caption: 'King Zora: Pay 500 rupees',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? (items.flippers || items.glove ? 'available' : 'unavailable') : 'unavailable';
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
				return canReachLightWorldBunny() ? (items.agahnim && items.boots && items.moonpearl ? 'available' : 'information') : 'unavailable';
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
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'unavailable' : 'possible')) : 'unavailable';
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
				return canReachLightWorldBunny() ? (items.boots ? (items.moonpearl ? 'available' : 'information') : 'information') : 'unavailable';
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
					'information';
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
				return canReachLightWorldBunny() ? (items.book ? (items.moonpearl ? 'available' : 'information') : 'information') : 'unavailable';
			}
		}, { // [49]
			caption: 'Lake Hylia Island {flippers}',
			is_opened: false,
			is_available: function() {
				if(!canReachLightWorldBunny())
					return 'unavailable';
				return items.moonpearl ? (items.flippers ? 'available' : 'information') : 'information';
			}
		}, { // [50]
			caption: 'Bumper Cave {cape}{mirror}',
			is_opened: false,
			is_available: function() {
				return items.glove && items.cape && items.mirror && canReachLightWorld() ? 'available' : 'information';
			}
		}, { // [51]
			caption: 'Pyramid',
			is_opened: false,
			is_available: function() {
				if(canReachPyramid())
					return 'available';
				return 'unavailable';
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
				return 'information';
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
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
			}
		}, { // [58]
			caption: 'Sanctuary',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'unavailable') : 'unavailable';
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
				return items.book ? 'information' : 'unavailable';
			}
		}, { // [63]
			caption: 'Escape Sewer Dark Room {lantern}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() && items.moonpearl ? ((items.lantern || (is_advanced && items.firerod)) ? 'available' : 'darkavailable') : 'unavailable';
			}
		}, { // [64]
			caption: 'Waterfall of Wishing (2) {flippers}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? (items.flippers ? 'available' : 'unavailable') : 'unavailable';
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
					return (activeFlute() || items.glove) && (items.smallkeyhalf1 > 0 || flags.gametype == 'R') ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
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
				if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria || !canReachDarkWorld()) return 'unavailable';
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
				if (crystal_check() < flags.ganonvulncount || (crystal_check() < flags.opentowercount && flags.goals != 'F') || !canReachDarkWorld()) return 'unavailable';
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
						return (items.sword >= 2 || (items.cape && items.sword) || (is_swordless && (items.hammer || (items.cape && items.net)))) && (items.smallkeyhalf1 === 2 || flags.gametype == 'R') && agatowerweapon() ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
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

				if (flags.dungeonitems === 'F' || flags.dungeonitems === 'K') {
					return (items.smallkey9 <= 1 && flags.gametype != 'R') ? 'unavailable' : 'available';
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
				return items.agahnim && items.boots ? 'available' : 'information';
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
				return items.boots ? 'available' : 'information';
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
						'available' : 'information' :
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
		}, { // [55]
			caption: 'Escape Sewer Side Room (3) {bomb}/{boots}' + (is_standard ? '' : ' (yellow = need small key)'),
			is_opened: false,
			is_available: function() {
				if (is_standard) return 'available';
				if (flags.dungeonitems === 'F') {
					if (items.glove) return 'available';
					if (items.smallkeyhalf0 === 1 || flags.gametype == 'R') return items.lantern ? 'available' : 'darkavailable';
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
				return items.book ? 'information' : 'unavailable';
			}
		}, { // [63]
			caption: 'Escape Sewer Dark Room {lantern}',
			is_opened: is_standard,
			is_available: function() {
				return is_standard || (items.lantern || (is_advanced && items.firerod)) ? 'available' : 'darkavailable';
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
					return (items.sword >= 2 || (is_swordless && items.hammer) || items.cape) && (items.smallkeyhalf1 > 0 || flags.gametype == 'R') ? items.lantern ? 'available' : 'darkavailable' : 'unavailable';
				}
			}
		}];
	}	
}(window));
