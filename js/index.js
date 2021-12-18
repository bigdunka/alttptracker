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
		if (c.indexOf('a-Y') > -1) {
			document.getElementById("autotrackingyes").checked = true;
			var p = c.substr(c.indexOf('a-Y') + 3);
			if (p.indexOf('|') > 0) {
				p = p.substr(0, p.indexOf('|'));
				document.getElementById("autotrackingport").value = p;
			}
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
	var door = document.querySelector('input[name="doorgroup"]:checked').value;	
	var overworld = document.querySelector('input[name="overworldgroup"]:checked').value;
	var enemy = document.querySelector('input[name="enemygroup"]:checked').value;
	var glitches = document.querySelector('input[name="glitchesgroup"]:checked').value;
	//var dungeon = document.querySelector('input[name="dungeongroup"]:checked').value;
	var item = "A";
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
	var autotracking = document.querySelector('input[name="autotrackinggroup"]:checked').value;
	var mystery = document.querySelector('input[name="mysterygroup"]:checked').value;
	var shuffledmaps = (document.getElementById("shuffledmaps").checked === true ? "1" : "0");
	var shuffledcompasses = (document.getElementById("shuffledcompasses").checked === true ? "1" : "0");
	var shuffledsmallkeys = (document.getElementById("shuffledsmallkeys").checked === true ? "1" : "0");
	var shuffledbigkeys = (document.getElementById("shuffledbigkeys").checked === true ? "1" : "0");
	var shopsanity = document.querySelector('input[name="shopsanitygroup"]:checked').value;
	var ambrosia = document.querySelector('input[name="ambrosiagroup"]:checked').value;
	var startingboots = document.querySelector('input[name="startingbootsgroup"]:checked').value;
	var startingflute = document.querySelector('input[name="startingflutegroup"]:checked').value;
	var startinghookshot = document.querySelector('input[name="startinghookshotgroup"]:checked').value;
	var startingicerod = document.querySelector('input[name="startingicerodgroup"]:checked').value;
	var trackingport = document.getElementById('autotrackingport').value;
	
	var width = map === "M" ? 1340 : 448;
	var height = sphere === "Y" ? map === "C" ? 988 : 744 : map === "C" ? 692 : 448;
	
	if (document.getElementById("remembersettings").checked == true) {
		var settings = "m-" + map + "|s-" + sphere + "|a-" + autotracking + trackingport + "|p-" + sprite;
		document.cookie = "settings=" + settings + "; expires=Sat, 1 Jan 2023 12:00:00 UTC";
	} else {
		document.cookie = "settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	}
	
	var trackerName = entrance === 'N' ? 'tracker' : 'entrancetracker';
	
	if (glitches === 'O' && type === "I") {
		alert('NOTICE: Inverted OWG is currently not supported for logic, all locations will be flagged as available.');
		glitches = 'M';
	}
	
	var trackerWindow = window.open('{tracker}.html?f={type}{entrance}{boss}{enemy}{glitches}{item}{goal}{tower}{towercrystals}{ganon}{ganoncrystals}{swords}0{map}{spoiler}{sphere}{mystery}{door}{shuffledmaps}{shuffledcompasses}{shuffledsmallkeys}{shuffledbigkeys}{ambrosia}{overworld}{shopsanity}{autotracking}{trackingport}&sprite={sprite}{compact}&starting={startingboots}{startingflute}{startinghookshot}{startingicerod}'
			.replace('{tracker}', trackerName)
			.replace('{type}', type)
			.replace('{entrance}', entrance)
			.replace('{boss}', boss)
			.replace('{enemy}', enemy)
			.replace('{glitches}', glitches)
			//.replace('{dungeon}', dungeon)
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
			.replace('{door}', door)
			.replace('{shuffledmaps}', shuffledmaps)
			.replace('{shuffledcompasses}', shuffledcompasses)
			.replace('{shuffledsmallkeys}', shuffledsmallkeys)
			.replace('{shuffledbigkeys}', shuffledbigkeys)
			.replace('{ambrosia}', ambrosia)
			.replace('{overworld}', overworld)
			.replace('{shopsanity}', shopsanity)
			.replace('{autotracking}', autotracking)
			.replace('{trackingport}', trackingport)
			.replace('{startingboots}', startingboots)
			.replace('{startingflute}', startingflute)
			.replace('{startinghookshot}', startinghookshot)
			.replace('{startingicerod}', startingicerod)
			.replace('{compact}', (map === "C" ? '&map=C' : '')),
		'',
		'width={width},height={height},titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
			.replace('{width}', width).replace('{height}', height));
}

function loadopenpreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonstandard").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadopenbootspreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonstandard").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("startingbootsyes").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadambrosiapreset() {
	document.getElementById("gametypestandard").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonstandard").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsassured").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiayes").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadmysterypreset(scroll = true) {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossshuffled").checked = true;
	document.getElementById("enemyshuffled").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonfullshuffle").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalrandom").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganonrandom").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryyes").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	if (scroll) window.scrollTo(0,document.body.scrollHeight);
}

function loadcrosskeyspreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancesimple").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonfullshuffle").checked = true;
	document.getElementById("goalfast").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadinvertedkeyspreset() {
	document.getElementById("gametypeinverted").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonfullshuffle").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadenemizerpreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossshuffled").checked = true;
	document.getElementById("enemyshuffled").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonstandard").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadbootspreset() {
	document.getElementById("gametypestandard").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonstandard").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsassured").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("startingbootsyes").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadopenkeyspreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonfullshuffle").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);	
}

function loadadkeyspreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonfullshuffle").checked = true;
	document.getElementById("goaldungeons").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);	
}

function loadreducedpreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonstandard").checked = true;
	document.getElementById("goalfast").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 6;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 6;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadinvrosiapreset() {
	document.getElementById("gametypeinverted").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonfullshuffle").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsassured").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiayes").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);		
	
}

function loadstandardpreset() {
	document.getElementById("gametypestandard").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonstandard").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadmcshufflepreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonmcshuffle").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadpotpourripreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossshuffled").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonstandard").checked = true;
	document.getElementById("goaldungeons").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteyes").checked = true;
	document.getElementById("startinghookshotyes").checked = true;
	document.getElementById("startingicerodyes").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadretrancepreset() {
	document.getElementById("gametyperetro").checked = true;
	document.getElementById("entrancesimple").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonfullshuffle").checked = true;
	document.getElementById("goalfast").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsassured").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadcswordlesspreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonmcshuffle").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsswordless").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadinvertedadkeyspreset() {
	document.getElementById("gametypeinverted").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonfullshuffle").checked = true;
	document.getElementById("goaldungeons").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("startingbootsno").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}

function loadgoldrushspreset() {
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldnone").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("dungeonstandard").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalother").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("mysteryno").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("startingbootsyes").checked = true;
	document.getElementById("startingfluteno").checked = true;
	document.getElementById("startinghookshotno").checked = true;
	document.getElementById("startingicerodno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
}



function importflags() {
	var i = document.getElementById("importflag").value;
	
	if (i.indexOf('/') > 1) {
		i = i.substr(i.lastIndexOf('/') + 1);
	}
	if (i.indexOf('#') > 1) {
		i = i.substr(0,i.indexOf('#'));
	}
	
	$.getJSON("https://alttpr-patch-data.s3.us-east-2.amazonaws.com/" + i + ".json", function(data) {
		var d = data.spoiler;
		
		if (d.meta.spoilers === "mystery") {
			loadmysterypreset(false);
		} else {
			document.getElementById("gametype" + d.meta.mode).checked = true;
			
			//Entrance flag
			if (d.meta.shuffle != null) {
				document.getElementById("entrancesimple").checked = true;
			} else {
				document.getElementById("entrancenone").checked = true;
			}
			
			document.getElementById("doornone").checked = true;
			document.getElementById("overworldnone").checked = true;
			document.getElementById("shopsanityno").checked = true;
			document.getElementById("ambrosiano").checked = true;
			
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
			
			//Glitches flag
			switch (d.meta.dungeon_items) {
				case "standard":
					document.getElementById("dungeonstandard").checked = true;
					document.getElementById("shuffledmaps").checked = false;
					document.getElementById("shuffledcompasses").checked = false;
					document.getElementById("shuffledsmallkeys").checked = false;
					document.getElementById("shuffledbigkeys").checked = false;
					break;
				case "mc":
					document.getElementById("dungeonmcshuffle").checked = true;
					document.getElementById("shuffledmaps").checked = true;
					document.getElementById("shuffledcompasses").checked = true;
					document.getElementById("shuffledsmallkeys").checked = false;
					document.getElementById("shuffledbigkeys").checked = false;
					break;
				case "mcs":
					document.getElementById("dungeonmcsshuffle").checked = true;
					document.getElementById("shuffledmaps").checked = true;
					document.getElementById("shuffledcompasses").checked = true;
					document.getElementById("shuffledsmallkeys").checked = true;
					document.getElementById("shuffledbigkeys").checked = false;
					break;
				case "full":
					document.getElementById("dungeonfullshuffle").checked = true;
					document.getElementById("shuffledmaps").checked = true;
					document.getElementById("shuffledcompasses").checked = true;
					document.getElementById("shuffledsmallkeys").checked = true;
					document.getElementById("shuffledbigkeys").checked = true;
					break;
			}
			//document.getElementById("placement" + d.meta.item_placement).checked = true;
			
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
		}
		
		window.scrollTo(0,document.body.scrollHeight);
		showToast();
	});
}

			
function showToast() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function setdungeonitems(x) {
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;

	if (x != "S") {
		document.getElementById("shuffledmaps").checked = true;
		document.getElementById("shuffledcompasses").checked = true;
		if (x === "K" || x === "F") {
			document.getElementById("shuffledsmallkeys").checked = true;
		}
		if (x === "F") {
			document.getElementById("shuffledbigkeys").checked = true;
		}
	}
	
	
}