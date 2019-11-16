(function(window) {
    'use strict';

    var query = uri_query();
	
	window.flags = {
        gametype: query.f.charAt(0),
        entrancemode: query.f.charAt(1),
        bossshuffle: query.f.charAt(2),
        enemyshuffle: query.f.charAt(3),
        glitches: query.f.charAt(4),
        dungeonitems: query.f.charAt(5),
        itemplacement: query.f.charAt(6),
        goals: query.f.charAt(7),
        opentower: query.f.charAt(8),
        opentowercount: query.f.charAt(9),
        ganonvuln: query.f.charAt(10),
        ganonvulncount: query.f.charAt(11),
        swordmode: query.f.charAt(12),
        mapmode: query.f.charAt(13),
        spoilermode: query.f.charAt(14),
        spheresmode: query.f.charAt(15),
        sprite: query.sprite
    };
	
	var chestmod = 0;
	
	if (flags.dungeonitems === 'S') {
		chestmod = 0;
	} else if (flags.dungeonitems === 'M' || flags.dungeonitems === 'K') {
		chestmod = 2;
	} else if (flags.dungeonitems === 'F') {
		chestmod = 3;
	}
	
	var chests0 = 3 + chestmod;
	var chests1 = 2 + chestmod + ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K' || flags.gametype === 'R') ? 1 : 0);
	var chests2 = 2 + chestmod + ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K' || flags.gametype === 'R') ? 1 : 0);
	var chests3 = 5 + chestmod + ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K' || flags.gametype === 'R') ? 6 : 0);
	var chests4 = 6 + chestmod + ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K' || flags.gametype === 'R') ? 1 : 0);
	var chests5 = 2 + chestmod + ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K' || flags.gametype === 'R') ? 3 : 0);
	var chests6 = 4 + chestmod + ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K' || flags.gametype === 'R') ? 1 : 0);
	var chests7 = 3 + chestmod + ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K' || flags.gametype === 'R') ? 2 : 0);
	var chests8 = 2 + chestmod + ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K' || flags.gametype === 'R') ? 3 : 0);
	var chests9 = 5 + chestmod + ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K' || flags.gametype === 'R') ? 4 : 0);
	var chests10 = 20 + chestmod + ((flags.dungeonitems === 'F' || flags.dungeonitems === 'K' || flags.gametype === 'R') ? 4 : 0);
	
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
		
        maxchest0: chests0,
        maxchest1: chests1,
        maxchest2: chests2,
        maxchest3: chests3,
        maxchest4: chests4,
        maxchest5: chests5,
        maxchest6: chests6,
        maxchest7: chests7,
        maxchest8: chests8,
        maxchest9: chests9,
		maxchest10: chests10,

		bigkey0: (flags.dungeonitems === 'F' ? false : true),
		bigkey1: (flags.dungeonitems === 'F' ? false : true),
		bigkey2: (flags.dungeonitems === 'F' ? false : true),
		bigkey3: (flags.dungeonitems === 'F' ? false : true),
		bigkey4: (flags.dungeonitems === 'F' ? false : true),
		bigkey5: (flags.dungeonitems === 'F' ? false : true),
		bigkey6: (flags.dungeonitems === 'F' ? false : true),
		bigkey7: (flags.dungeonitems === 'F' ? false : true),
		bigkey8: (flags.dungeonitems === 'F' ? false : true),
		bigkey9: (flags.dungeonitems === 'F' ? false : true),
		bigkey10: (flags.dungeonitems === 'F' ? false : true),

        smallkey0: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 0),
        smallkey1: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 1),
        smallkey2: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 1),
        smallkey3: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 6),
        smallkey4: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 1),
        smallkey5: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 3),
        smallkey6: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 1),
        smallkey7: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 2),
        smallkey8: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 3),
        smallkey9: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 4),
		smallkey10: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 4),
		smallkeyhalf0: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 1),
		smallkeyhalf1: (flags.dungeonitems === 'K' || flags.dungeonitems === 'F' ? 0 : 2),
		
        inc: limit(1, {
            tunic: { min: 1, max: 3 },
            sword: { max: 4 },
            shield: { max: 3 },
            bottle: { max: 4 },
            bow: { max: 2 },
            boomerang: { max: 3 },
            glove: { max: 2 },
			smallkey0: { min: 0, max: 0 },
            smallkey1: { min: 0, max: 1 },
            smallkey2: { min: 0, max: 1 },
            smallkey3: { min: 0, max: 6 },
            smallkey4: { min: 0, max: 1 },
            smallkey5: { min: 0, max: 3 },
            smallkey6: { min: 0, max: 1 },
            smallkey7: { min: 0, max: 2 },
            smallkey8: { min: 0, max: 3 },
            smallkey9: { min: 0, max: 4 },
			smallkey10: { min: 0, max: 4 },
			smallkeyhalf0: { min: 0, max: 1 },
			smallkeyhalf1: { min: 0, max: 2 },
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
        }),
        dec: limit(-1, {
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
			smallkey0: { max: 0 },
            smallkey1: { max: 1 },
            smallkey2: { max: 1 },
            smallkey3: { max: 6 },
            smallkey4: { max: 1 },
            smallkey5: { max: 3 },
            smallkey6: { max: 1 },
            smallkey7: { max: 2 },
            smallkey8: { max: 3 },
            smallkey9: { max: 4 },
			smallkey10: { max: 4 },
			smallkeyhalf0: { max: 1 },
			smallkeyhalf1: { max: 2 }
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
