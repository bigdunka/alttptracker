(function(window) {
    'use strict';

    var query = uri_query();
	var variation = query.variation;
	
	var keychestmod = variation === 'retro' ? 3 : 0;
	var keymod = variation === 'retro' ? 1 : 0;

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

        chest0: 3,
        chest1: 2,
        chest2: 2,
        chest3: 5,
        chest4: 6,
        chest5: 2,
        chest6: 4,
        chest7: 3,
        chest8: 2,
        chest9: 5,
		chest10: 27,

        keychest0: 6 - keychestmod,
        keychest1: 6 - keychestmod,
        keychest2: 6 - keychestmod,
        keychest3: 14 - keychestmod,
        keychest4: 10 - keychestmod,
        keychest5: 8 - keychestmod,
        keychest6: 8 - keychestmod,
        keychest7: 8 - keychestmod,
        keychest8: 8 - keychestmod,
        keychest9: 12 - keychestmod,
		keychest10: 27,

		bigkey0: false,
		bigkey1: false,
		bigkey2: false,
		bigkey3: false,
		bigkey4: false,
		bigkey5: false,
		bigkey6: false,
		bigkey7: false,
		bigkey8: false,
		bigkey9: false,
		bigkey10: false,

        smallkey0: 0,
        smallkey1: 0,
        smallkey2: 0,
        smallkey3: 0,
        smallkey4: 0,
        smallkey5: 0,
        smallkey6: 0,
        smallkey7: 0,
        smallkey8: 0,
        smallkey9: 0,
		smallkey10: 0,
		smallkeyhalf0: 0,
		smallkeyhalf1: 0,
		
        inc: limit(1, {
            tunic: { min: 1, max: 3 },
            sword: { max: 4 },
            shield: { max: 3 },
            bottle: { max: 4 },
            bow: { max: 3 },
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
			smallkeyhalf1: { min: 0, max: 2 }			
        }),
        dec: limit(-1, {
            chest0: { max: 3 },
            chest1: { max: 2 },
            chest2: { max: 2 },
            chest3: { max: 5 },
            chest4: { max: 6 },
            chest5: { max: 2 },
            chest6: { max: 4 },
            chest7: { max: 3 },
            chest8: { max: 2 },
            chest9: { max: 5 },
			keychest0: { max: 6 - keychestmod },
            keychest1: { max: 6 - keychestmod },
            keychest2: { max: 6 - keychestmod },
            keychest3: { max: 14 - keychestmod },
            keychest4: { max: 10 - keychestmod },
            keychest5: { max: 8 - keychestmod },
            keychest6: { max: 8 - keychestmod },
            keychest7: { max: 8 - keychestmod },
            keychest8: { max: 8 - keychestmod },
            keychest9: { max: 12 - keychestmod },
			keychest10: { max: 27 },
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
