(function(window) {
    'use strict';

    var query = uri_query();
	
	window.flags = {
        gametype: query.f.charAt(0),
        entrancemode: query.f.charAt(1),
        bossshuffle: query.f.charAt(2),
        enemyshuffle: query.f.charAt(3),
        glitches: query.f.charAt(4),
        //dungeonitems: query.f.charAt(5),
        itemplacement: query.f.charAt(5),
        goals: query.f.charAt(6),
        opentower: query.f.charAt(7),
        opentowercount: query.f.charAt(8),
        ganonvuln: query.f.charAt(9),
        ganonvulncount: query.f.charAt(10),
        swordmode: query.f.charAt(11),
        mapmode: query.f.charAt(12),
        spoilermode: query.f.charAt(13),
        spheresmode: query.f.charAt(14),
		mystery: query.f.charAt(15),
		doorshuffle: query.f.charAt(16),
		wildmaps: (query.f.charAt(17) === '1' ? true : false),
		wildcompasses: (query.f.charAt(18) === '1' ? true : false),
		wildkeys: (query.f.charAt(19) === '1' ? true : false),
		wildbigkeys: (query.f.charAt(20) === '1' ? true : false),
		ambrosia: query.f.charAt(21),
		autotracking: query.f.charAt(22),
		trackingport: query.f.charAt(23) + query.f.charAt(24) + query.f.charAt(25) + query.f.charAt(26),
        sprite: query.sprite
    };
	
	window.maptype = query.map;
	
	window.startingitems = query.starting;
	
	var chestmod = 0;
	
	if (flags.wildmaps) {
		chestmod++;
	}
	
	if (flags.wildcompasses) {
		chestmod++;
	}
	
	var chestmodcrossed = chestmod;
	
	if (flags.wildbigkeys) {
		chestmod++;
		if (flags.wildkeys || flags.gametype === 'R') {
			chestmodcrossed++;
		}		
	}
	
	var chests0 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 3 + chestmod;
	var chests1 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 2 + chestmod + ((flags.wildkeys || flags.gametype === 'R') ? 1 : 0);
	var chests2 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 2 + chestmod + ((flags.wildkeys || flags.gametype === 'R') ? 1 : 0);
	var chests3 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 5 + chestmod + ((flags.wildkeys || flags.gametype === 'R') ? 6 : 0);
	var chests4 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 6 + chestmod + ((flags.wildkeys || flags.gametype === 'R') ? 1 : 0);
	var chests5 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 2 + chestmod + ((flags.wildkeys || flags.gametype === 'R') ? 3 : 0);
	var chests6 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 4 + chestmod + ((flags.wildkeys || flags.gametype === 'R') ? 1 : 0);
	var chests7 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 3 + chestmod + ((flags.wildkeys || flags.gametype === 'R') ? 2 : 0);
	var chests8 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 2 + chestmod + ((flags.wildkeys || flags.gametype === 'R') ? 3 : 0);
	var chests9 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 5 + chestmod + ((flags.wildkeys || flags.gametype === 'R') ? 4 : 0);
	var chests10 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 20 + chestmod + ((flags.wildkeys || flags.gametype === 'R') ? 4 : 0);
	var chests11 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : 6 + (flags.wildmaps ? 1 : 0) + ((flags.wildkeys || flags.gametype === 'R') ? 1 : 0);
	var chests12 = flags.doorshuffle === 'C' ? 3 + chestmodcrossed : ((flags.wildkeys || flags.gametype === 'R') ? 2 : 0);
		
    var maxchests0 = flags.doorshuffle === 'C' ? 32 : chests0;
    var maxchests1 = flags.doorshuffle === 'C' ? 32 : chests1;
    var maxchests2 = flags.doorshuffle === 'C' ? 32 : chests2;
    var maxchests3 = flags.doorshuffle === 'C' ? 32 : chests3;
    var maxchests4 = flags.doorshuffle === 'C' ? 32 : chests4;
    var maxchests5 = flags.doorshuffle === 'C' ? 32 : chests5;
    var maxchests6 = flags.doorshuffle === 'C' ? 32 : chests6;
    var maxchests7 = flags.doorshuffle === 'C' ? 32 : chests7;
    var maxchests8 = flags.doorshuffle === 'C' ? 32 : chests8;
    var maxchests9 = flags.doorshuffle === 'C' ? 32 : chests9;
    var maxchests10 = flags.doorshuffle === 'C' ? 32 : chests10;
    var maxchests11 = flags.doorshuffle === 'C' ? 32 : chests11;
    var maxchests12 = flags.doorshuffle === 'C' ? 32 : chests12;
	
    window.items = {
        tunic: 1,
        sword: 0,
        shield: 0,
        moonpearl: false,

        bow: 0,
        boomerang: 0,
        hookshot: false,
        mushroom: false,
        powder: false,

        firerod: false,
        icerod: false,
        bombos: false,
        ether: false,
        quake: false,

        lantern: false,
        hammer: false,
        shovel: false,
        net: false,
        book: false,

        bottle: 0,
        somaria: false,
        byrna: false,
        cape: false,
        mirror: false,

        boots: false,
        glove: 0,
        flippers: false,
        flute: false,
        agahnim: false,
        agahnim2: false,
		bomb: false,
		magic: false,
		bombfloor: false,

        boss0: false,
        boss1: false,
        boss2: false,
        boss3: false,
        boss4: false,
        boss5: false,
        boss6: false,
        boss7: false,
        boss8: false,
        boss9: false,
		
        chest0: chests0,
        chest1: chests1,
        chest2: chests2,
        chest3: chests3,
        chest4: chests4,
        chest5: chests5,
        chest6: chests6,
        chest7: chests7,
        chest8: chests8,
        chest9: chests9,
		chest10: chests10,
		chest11: chests11,
		chest12: chests12,
		
        maxchest0: maxchests0,
        maxchest1: maxchests1,
        maxchest2: maxchests2,
        maxchest3: maxchests3,
        maxchest4: maxchests4,
        maxchest5: maxchests5,
        maxchest6: maxchests6,
        maxchest7: maxchests7,
        maxchest8: maxchests8,
        maxchest9: maxchests9,
		maxchest10: maxchests10,
		maxchest11: maxchests11,
		maxchest12: maxchests12,

        chestknown0: false,
        chestknown1: false,
        chestknown2: false,
        chestknown3: false,
        chestknown4: false,
        chestknown5: false,
        chestknown6: false,
        chestknown7: false,
        chestknown8: false,
        chestknown9: false,
        chestknown10: false,
        chestknown11: false,
        chestknown12: false,

		bigkey0: !flags.wildbigkeys,
		bigkey1: !flags.wildbigkeys,
		bigkey2: !flags.wildbigkeys,
		bigkey3: !flags.wildbigkeys,
		bigkey4: !flags.wildbigkeys,
		bigkey5: !flags.wildbigkeys,
		bigkey6: !flags.wildbigkeys,
		bigkey7: !flags.wildbigkeys,
		bigkey8: !flags.wildbigkeys,
		bigkey9: !flags.wildbigkeys,
		bigkey10: !flags.wildbigkeys,
		bigkeyhalf0: !flags.wildbigkeys,
		bigkeyhalf1: !flags.wildbigkeys,
		
        smallkey0: (flags.wildkeys ? 0 : 0),
        smallkey1: (flags.wildkeys ? 0 : 1),
        smallkey2: (flags.wildkeys ? 0 : 1),
        smallkey3: (flags.wildkeys ? 0 : 6),
        smallkey4: (flags.wildkeys ? 0 : 1),
        smallkey5: (flags.wildkeys ? 0 : 3),
        smallkey6: (flags.wildkeys ? 0 : 1),
        smallkey7: (flags.wildkeys ? 0 : 2),
        smallkey8: (flags.wildkeys ? 0 : 3),
        smallkey9: (flags.wildkeys ? 0 : 4),
		smallkey10: (flags.wildkeys ? 0 : 4),
		smallkeyhalf0: (flags.wildkeys ? 0 : 1),
		smallkeyhalf1: (flags.wildkeys ? 0 : 2),
		
        inc: limit(1, {
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
			chest0: { min: 0, max: maxchests0 },
			chest1: { min: 0, max: maxchests1 },
			chest2: { min: 0, max: maxchests2 },
			chest3: { min: 0, max: maxchests3 },
			chest4: { min: 0, max: maxchests4 },
			chest5: { min: 0, max: maxchests5 },
			chest6: { min: 0, max: maxchests6 },
			chest7: { min: 0, max: maxchests7 },
			chest8: { min: 0, max: maxchests8 },
			chest9: { min: 0, max: maxchests9 },
			chest10: { min: 0, max: maxchests10 },
			chest11: { min: 0, max: maxchests11 },
			chest12: { min: 0, max: maxchests12 }
        }),
        dec: limit(-1, {
			chest0: { max: maxchests0 },
            chest1: { max: maxchests1 },
            chest2: { max: maxchests2 },
            chest3: { max: maxchests3 },
            chest4: { max: maxchests4 },
            chest5: { max: maxchests5 },
            chest6: { max: maxchests6 },
            chest7: { max: maxchests7 },
            chest8: { max: maxchests8 },
            chest9: { max: maxchests9 },
			chest10: { max: maxchests10 },
            chest11: { max: maxchests11 },
			chest12: { max: maxchests12 },
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
        })
    };
	
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
}(window));
