function load_cookie() {
	var c = document.cookie;
	
	if (c.indexOf('settings') > -1) {
		document.getElementById("remembersettings").checked = true;
		if (c.indexOf('m-M') > -1) {
			document.getElementById("mapyes").checked = true;
		}
		if (c.indexOf('m-C') > -1) {
			document.getElementById("mapsmall").checked = true;
		}
		if (c.indexOf('s-Y') > -1) {
			document.getElementById("sphereyes").checked = true;
		}
		if (c.indexOf('p-') > -1) {
			var sprite = c.substr(c.indexOf('p-') + 2);
			if (sprite.indexOf(';') > -1) {
				sprite = sprite.substr(0, sprite.indexOf(';'));
			}
			document.getElementById("spriteselect").value = sprite;
		}	
	}
}

function launch_tracker() {
	var type = document.querySelector('input[name="gametypegroup"]:checked').value;
	var entrance = document.querySelector('input[name="entrancegroup"]:checked').value;
	var boss = document.querySelector('input[name="bossgroup"]:checked').value;
	var enemy = document.querySelector('input[name="enemygroup"]:checked').value;
	var glitches = document.querySelector('input[name="glitchesgroup"]:checked').value;
	var dungeon = document.querySelector('input[name="dungeongroup"]:checked').value;
	var item = document.querySelector('input[name="placementgroup"]:checked').value;
	var goal = document.querySelector('input[name="goalgroup"]:checked').value;
	var tower = document.querySelector('input[name="towergroup"]:checked').value;
	var ganon = document.querySelector('input[name="ganongroup"]:checked').value;
	var towersel = document.getElementById("towerselect");
	var towercrystals = towersel.options[towersel.selectedIndex].value;
	var ganonsel = document.getElementById("ganonselect");
	var ganoncrystals = ganonsel.options[ganonsel.selectedIndex].value;
	var swords = document.querySelector('input[name="swordsgroup"]:checked').value;
	var spritesel = document.getElementById("spriteselect");
	var sprite = spritesel.options[spritesel.selectedIndex].value;
	var map = document.querySelector('input[name="mapgroup"]:checked').value;
	var spoiler = document.querySelector('input[name="spoilergroup"]:checked').value;
	var sphere = document.querySelector('input[name="spheregroup"]:checked').value;
	var mystery = document.querySelector('input[name="mysterygroup"]:checked').value;
	
	var width = map === "M" ? 1340 : 448;
	var height = sphere === "Y" ? map === "C" ? 988 : 744 : map === "C" ? 692 : 448;
	
	if (document.getElementById("remembersettings").checked == true) {
		var settings = "m-" + map + "|s-" + sphere + "|p-" + sprite;
		document.cookie = "settings=" + settings + "; expires=Sat, 1 Jan 2023 12:00:00 UTC";
	} else {
		document.cookie = "settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	}
	
	var trackerName = entrance === 'N' ? 'tracker' : 'entrancetracker';
	
	
	if (entrance != 'N' && type === "I") {
		alert('NOTICE: There is currently no logic implemented in Inverted Entrance, all locations will be flagged as available.');
	}
	
	var trackerWindow = window.open('{tracker}.html?f={type}{entrance}{boss}{enemy}{glitches}{dungeon}{item}{goal}{tower}{towercrystals}{ganon}{ganoncrystals}{swords}{map}{spoiler}{sphere}{mystery}&sprite={sprite}{compact}'
			.replace('{tracker}', trackerName)
			.replace('{type}', type)
			.replace('{entrance}', entrance)
			.replace('{boss}', boss)
			.replace('{enemy}', enemy)
			.replace('{glitches}', glitches)
			.replace('{dungeon}', dungeon)
			.replace('{item}', item)
			.replace('{goal}', goal)
			.replace('{tower}', tower)
			.replace('{towercrystals}', towercrystals)
			.replace('{ganon}', ganon)
			.replace('{ganoncrystals}', ganoncrystals)
			.replace('{swords}', swords)
			.replace('{map}', map)
			.replace('{spoiler}', spoiler)
			.replace('{sphere}', sphere)
			.replace('{sprite}', sprite)
			.replace('{mystery}', mystery)
			.replace('{compact}', (map === "C" ? '&map=C' : '')),
		'',
		'width={width},height={height},titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
			.replace('{width}', width).replace('{height}', height));
}

function load2019preset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonstandard").checked = true;
	document.getElementById("placementadvanced").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadmysterypreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("bossshuffled").checked = true;
	document.getElementById("enemyshuffled").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonfullshuffle").checked = true;
	document.getElementById("placementadvanced").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalrandom").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganonrandom").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryyes").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function importflags() {
	$.getJSON("https://s3.us-east-2.amazonaws.com/alttpr-patches/" + document.getElementById("importflag").value + ".json", function(data) {
	var d = data.spoiler;
	
	document.getElementById("gametype" + d.meta.mode).checked = true;
	
	//Entrance flag
	if (d.meta.shuffle != null) {
		document.getElementById("entrancesimple").checked = true;
	} else {
		document.getElementById("entrancenone").checked = true;
	}
	
	if (data.spoiler.meta["enemizer.enemy_shuffle"] === "none") {
		document.getElementById("enemynone").checked = true;
	} else {
		document.getElementById("enemyshuffled").checked = true;
	}
	if (data.spoiler.meta["enemizer.boss_shuffle"] === "none") {
		document.getElementById("bossnone").checked = true;
	} else {
		document.getElementById("bossshuffled").checked = true;
	}
	
	document.getElementById("enemynone").checked = true;
	//Glitches flag
	switch (d.meta.dungeon_items) {
		case "standard":
			document.getElementById("dungeonstandard").checked = true;
			break;
		case "mc":
			document.getElementById("dungeonmcshuffle").checked = true;
			break;
		case "mcs":
			document.getElementById("dungeonmcsshuffle").checked = true;
			break;
		case "full":
			document.getElementById("dungeonfullshuffle").checked = true;
			break;
	}
	document.getElementById("placement" + d.meta.item_placement).checked = true;
	
	switch (d.meta.goal) {
		case "ganon":
			document.getElementById("goalganon").checked = true;
			break;
		case "fast_ganon":
			document.getElementById("goalfast").checked = true;
			break;
		case "dungeons":
			document.getElementById("goaldungeons").checked = true;
			break;
		case "pedestal":
			document.getElementById("goalpedestal").checked = true;
			break;
		default:
			document.getElementById("goalother").checked = true;
			break;
		
	}
	
	if (d.meta.entry_crystals_tower === 'random') {
		document.getElementById("goalrandom").checked = true;
		document.getElementById("towerselect").value = 7;
	} else {
		document.getElementById("goalcrystal").checked = true;
		document.getElementById("towerselect").value = d.meta.entry_crystals_tower;
	}

	if (d.meta.entry_crystals_ganon === 'random') {
		document.getElementById("ganonrandom").checked = true;
		document.getElementById("ganonselect").value = 7;
	} else {
		document.getElementById("ganoncrystal").checked = true;
		document.getElementById("ganonselect").value = d.meta.entry_crystals_ganon;
	}
	
	document.getElementById("swords" + d.meta.weapons).checked = true;
	});
}