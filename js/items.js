(function(window) {
    'use strict';

    var query = uri_query();
    
    window.flags = {
        gametype: query.f.charAt(0),
        entrancemode: query.f.charAt(1),
        doorshuffle: query.f.charAt(2),
        overworldshuffle: query.f.charAt(3),        
        bossshuffle: query.f.charAt(4),
        enemyshuffle: query.f.charAt(5),
        unknown: query.f.charAt(6),
        glitches: query.f.charAt(7),
        wildmaps: (query.f.charAt(8) === '1' ? true : false),
        wildcompasses: (query.f.charAt(9) === '1' ? true : false),
        wildkeys: (query.f.charAt(10) === '1' ? true : false),
        wildbigkeys: (query.f.charAt(11) === '1' ? true : false),
        shopsanity: query.f.charAt(12),
        ambrosia: query.f.charAt(13),
        nonprogressivebows: (query.f.charAt(14) === 'Y' ? true : false),
        activatedflute: (query.f.charAt(15) === 'Y' ? true : false),
        goals: query.f.charAt(16),
        opentower: query.f.charAt(17),
        opentowercount: query.f.charAt(18),
        ganonvuln: query.f.charAt(19),
        ganonvulncount: query.f.charAt(20),
        swordmode: query.f.charAt(21),
        mapmode: query.d.charAt(0),
        spoilermode: query.d.charAt(1),
        spheresmode: query.d.charAt(2),
		autotracking: query.d.charAt(3),
		trackingport: query.d.charAt(4) + query.d.charAt(5) + query.d.charAt(6) + query.d.charAt(7),
		restreamingcode: query.d.charAt(8) + query.d.charAt(9) + query.d.charAt(10) + query.d.charAt(11) + query.d.charAt(12) + query.d.charAt(13),
		restreamer: query.d.charAt(14),
		restreamdelay: query.d.substr(15),
		startingitems: query.s,
        sprite: query.p.replace('#','').replace('!',''),
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

    var dungeonKeys = {
        ep: { chests: 0, pots: 2},
        dp: { chests: 1, pots: 3},
        th: { chests: 1, pots: 0},
        pd: { chests: 6, pots: 0},
        sp: { chests: 1, pots: 5},
        sw: { chests: 3, pots: 2},
        tt: { chests: 1, pots: 2},
        ip: { chests: 2, pots: 4},
        mm: { chests: 3, pots: 3},
        tr: { chests: 4, pots: 2},
        gt: { chests: 4, pots: 4},
        hc: { chests: 1, pots: 3},
        at: { chests: 2, pots: 2},
    };

    var keyCount = function(dungeonKeyInfo) { 
        if (flags.doorshuffle === 'C') { return 29; }
        return dungeonKeyInfo.chests + (flags.doorshuffle === 'P' ? dungeonKeyInfo.pots : 0);
    }

    var range = {
        tunic: { min: 1, max: 3 },
        sword: { min: 0, max: 4 },
        shield: { min: 0, max: 3 },
        bottle: { min: 0, max: 4 },
        bow: { min: 0, max: 3 },
        boomerang: { min: 0, max: 3 },
        glove: { min: 0, max: 2 },
        smallkey0: { min: 0, max: keyCount(dungeonKeys.ep) },
        smallkey1: { min: 0, max: keyCount(dungeonKeys.dp) },
        smallkey2: { min: 0, max: keyCount(dungeonKeys.th) },
        smallkey3: { min: 0, max: keyCount(dungeonKeys.pd) },
        smallkey4: { min: 0, max: keyCount(dungeonKeys.sp) },
        smallkey5: { min: 0, max: keyCount(dungeonKeys.sw) },
        smallkey6: { min: 0, max: keyCount(dungeonKeys.tt) },
        smallkey7: { min: 0, max: keyCount(dungeonKeys.ip) },
        smallkey8: { min: 0, max: keyCount(dungeonKeys.mm) },
        smallkey9: { min: 0, max: keyCount(dungeonKeys.tr) },
        smallkey10: { min: 0, max: keyCount(dungeonKeys.gt) },
        smallkeyhalf0: { min: 0, max: keyCount(dungeonKeys.hc) },
        smallkeyhalf1: { min: 0, max: keyCount(dungeonKeys.at) },
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
    };
    
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
        
        smallkey0: (flags.wildkeys ? 0 : range['smallkey0'].max),
        smallkey1: (flags.wildkeys ? 0 : range['smallkey1'].max),
        smallkey2: (flags.wildkeys ? 0 : range['smallkey2'].max),
        smallkey3: (flags.wildkeys ? 0 : range['smallkey3'].max),
        smallkey4: (flags.wildkeys ? 0 : range['smallkey4'].max),
        smallkey5: (flags.wildkeys ? 0 : range['smallkey5'].max),
        smallkey6: (flags.wildkeys ? 0 : range['smallkey6'].max),
        smallkey7: (flags.wildkeys ? 0 : range['smallkey7'].max),
        smallkey8: (flags.wildkeys ? 0 : range['smallkey8'].max),
        smallkey9: (flags.wildkeys ? 0 : range['smallkey9'].max),
        smallkey10: (flags.wildkeys ? 0 : range['smallkey10'].max),
        smallkeyhalf0: (flags.wildkeys ? 0 : range['smallkeyhalf0'].max),
        smallkeyhalf1: (flags.wildkeys ? 0 : range['smallkeyhalf1'].max),
        
        range: range,
        inc: limit(1, range),
        dec: limit(-1, range)
    };
	
	function getdelay() {
		s = '';
		;
		while (d.length > 0) {
			s 
		}
	}
	
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
