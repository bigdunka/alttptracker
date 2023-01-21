var startingitemstring = "00000000000000000000000000";

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

function toggle(x, y) {
	document.getElementById("starting" + x).classList.remove(x + startingitemstring.charAt(y));
	switch (y) {
		case 1:
		case 2:
			startingitemstring = startingitemstring.substring(0, y) + (startingitemstring.charAt(y) === "0" ? "1" : (startingitemstring.charAt(y) === "1" ? "2" : (startingitemstring.charAt(y) === "2" ? "3" : "0"))) + startingitemstring.substring(y + 1);
			break;
		case 23:
			startingitemstring = startingitemstring.substring(0, y) + (startingitemstring.charAt(y) === "0" ? "1" : (startingitemstring.charAt(y) === "1" ? "2" : "0")) + startingitemstring.substring(y + 1);
			break;
		default:
			startingitemstring = startingitemstring.substring(0, y) + (startingitemstring.charAt(y) === "0" ? "1" : "0") + startingitemstring.substring(y + 1);
			break;
	}
	document.getElementById("starting" + x).classList.add(x + startingitemstring.charAt(y));
	document.getElementById("starting" + x).style.opacity = (startingitemstring.charAt(y) === "0" ? "0.25" : "1.0");
}

function setstartingitem(x, y, z) {
	document.getElementById("starting" + x).classList.remove(x + startingitemstring.charAt(y));
	startingitemstring = startingitemstring.substring(0, y) + z + startingitemstring.substring(y + 1);
	document.getElementById("starting" + x).classList.add(x + startingitemstring.charAt(y));
	document.getElementById("starting" + x).style.opacity = (startingitemstring.charAt(y) === "0" ? "0.25" : "1.0");	
}

function resetallstartingitems() {
	setstartingitem("moonpearl",0,"0");
	setstartingitem("bow",1,"0");
	setstartingitem("boomerang",2,"0");
	setstartingitem("hookshot",3,"0");
	setstartingitem("mushroom",4,"0");
	setstartingitem("powder",5,"0");
	setstartingitem("firerod",6,"0");
	setstartingitem("icerod",7,"0");
	setstartingitem("bombos",8,"0");
	setstartingitem("ether",9,"0");
	setstartingitem("quake",10,"0");
	setstartingitem("lantern",11,"0");
	setstartingitem("hammer",12,"0");
	setstartingitem("shovel",13,"0");
	setstartingitem("flute",14,"0");
	setstartingitem("net",15,"0");
	setstartingitem("book",16,"0");
	setstartingitem("bottle",17,"0");
	setstartingitem("somaria",18,"0");
	setstartingitem("byrna",19,"0");
	setstartingitem("cape",20,"0");
	setstartingitem("mirror",21,"0");
	setstartingitem("boots",22,"0");
	setstartingitem("glove",23,"0");
	setstartingitem("flippers",24,"0");
	setstartingitem("magic",25,"0");
}

function launch_tracker() {
	var world = document.querySelector('input[name="gametypegroup"]:checked').value;
	var entrance = document.querySelector('input[name="entrancegroup"]:checked').value;
	var door = document.querySelector('input[name="doorgroup"]:checked').value;	
	var overworld = document.querySelector('input[name="overworldgroup"]:checked').value;
	var boss = document.querySelector('input[name="bossgroup"]:checked').value;
	var enemy = document.querySelector('input[name="enemygroup"]:checked').value;
	var unknown = document.querySelector('input[name="unknowngroup"]:checked').value;
	var glitches = document.querySelector('input[name="glitchesgroup"]:checked').value;
	var shuffledmaps = (document.getElementById("shuffledmaps").checked === true ? "1" : "0");
	var shuffledcompasses = (document.getElementById("shuffledcompasses").checked === true ? "1" : "0");
	var shuffledsmallkeys = (document.getElementById("shuffledsmallkeys").checked === true ? "1" : "0");
	var shuffledbigkeys = (document.getElementById("shuffledbigkeys").checked === true ? "1" : "0");
	var shopsanity = document.querySelector('input[name="shopsanitygroup"]:checked').value;
	var ambrosia = document.querySelector('input[name="ambrosiagroup"]:checked').value;
	var nonprogressivebows = document.querySelector('input[name="nonprogressivebowsgroup"]:checked').value;
	var activatedflute = document.querySelector('input[name="activatedflutegroup"]:checked').value;
	var goal = document.querySelector('input[name="goalgroup"]:checked').value;
	var tower = document.querySelector('input[name="towergroup"]:checked').value;
	var towersel = document.getElementById("towerselect");
	var towercrystals = towersel.options[towersel.selectedIndex].value;
	var ganon = document.querySelector('input[name="ganongroup"]:checked').value;
	var ganonsel = document.getElementById("ganonselect");
	var ganoncrystals = ganonsel.options[ganonsel.selectedIndex].value;
	var swords = document.querySelector('input[name="swordsgroup"]:checked').value;
	var map = document.querySelector('input[name="mapgroup"]:checked').value;
	var spoiler = document.querySelector('input[name="spoilergroup"]:checked').value;
	var sphere = document.querySelector('input[name="spheregroup"]:checked').value;
	var autotracking = document.querySelector('input[name="autotrackinggroup"]:checked').value;
	var trackingport = document.getElementById('autotrackingport').value;
	var restreamingcode = document.getElementById('restreamingcode').value;
	var restreamer = document.querySelector('input[name="restreamgroup"]:checked').value;
	var restreamdelay = document.getElementById('restreamingdelay').value;
	var spritesel = document.getElementById("spriteselect");
	var sprite = spritesel.options[spritesel.selectedIndex].value;
	
	if (restreamingcode != "") {
		if (restreamingcode.length != 6) {
			alert("Restreaming codes require exactly 6 characters");
			return;
		} else {
			if (restreamer === "N") {
				restreamingcode = "000000";
			} else if (restreamer === "R") {
				map = "N";
			}
		}
	} else {
		restreamingcode = "000000";
	}
	
	var width = map === "M" ? 1340 : 448;
	var height = sphere === "Y" ? map === "C" ? 988 : 744 : map === "C" ? 692 : 448;
	
	if (document.getElementById("remembersettings").checked == true) {
		var settings = "m-" + map + "|s-" + sphere + "|a-" + autotracking + trackingport + "|p-" + sprite;
		document.cookie = "settings=" + settings + "; expires=Sat, 3 Jan 2026 12:00:00 UTC";
	} else {
		document.cookie = "settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	}
	
	if (glitches === 'O' && world === "I") {
		alert('NOTICE: Inverted OWG is currently not supported for logic, all locations will be flagged as available.');
		glitches = 'M';
	}
	
	var trackerWindow = window.open('tracker.html?f={world}{entrance}{door}{overworld}{boss}{enemy}{unknown}{glitches}{shuffledmaps}{shuffledcompasses}{shuffledsmallkeys}{shuffledbigkeys}{shopsanity}{ambrosia}{nonprogressivebows}{activatedflute}{goal}{tower}{towercrystals}{ganon}{ganoncrystals}{swords}&d={map}{spoiler}{sphere}{autotracking}{trackingport}{restreamingcode}{restreamer}{restreamdelay}&s={startingitemstring}&p={sprite}&r={epoch}'
			.replace('{world}', world)
			.replace('{entrance}', entrance)
			.replace('{door}', door)
			.replace('{overworld}', overworld)
			.replace('{boss}', boss)
			.replace('{enemy}', enemy)
			.replace('{unknown}', unknown)
			.replace('{glitches}', glitches)
			.replace('{shuffledmaps}', shuffledmaps)
			.replace('{shuffledcompasses}', shuffledcompasses)
			.replace('{shuffledsmallkeys}', shuffledsmallkeys)
			.replace('{shuffledbigkeys}', shuffledbigkeys)
			.replace('{shopsanity}', shopsanity)
			.replace('{ambrosia}', ambrosia)
			.replace('{nonprogressivebows}', nonprogressivebows)
			.replace('{activatedflute}', activatedflute)
			.replace('{goal}', goal)
			.replace('{tower}', tower)
			.replace('{towercrystals}', towercrystals)
			.replace('{ganon}', ganon)
			.replace('{ganoncrystals}', ganoncrystals)
			.replace('{swords}', swords)
			.replace('{map}', map)
			.replace('{spoiler}', spoiler)
			.replace('{sphere}', sphere)
			.replace('{autotracking}', autotracking)
			.replace('{trackingport}', trackingport)
			.replace('{restreamingcode}', restreamingcode)
			.replace('{restreamer}', restreamer)
			.replace('{restreamdelay}', restreamdelay)
			.replace('{startingitemstring}', startingitemstring)
			.replace('{sprite}', sprite)
			.replace('{epoch}', Date.now()),
			//.replace('{compact}', (map === "C" ? '&map=C' : '')),
		'',
		'width={width},height={height},titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
			.replace('{width}', width).replace('{height}', height));
}

function loadarchivepreset() {
	var archiveselect = document.getElementById("archivepresetselect");

	switch (archiveselect.options[archiveselect.selectedIndex].value) {
		case "ADKeysanity":
			loadadkeyspreset();
			break;
		case "Ambrosia":
			loadambrosiapreset();
			break;
		case "Ambroz1a":
			loadambroz1apreset();
			break;
		case "CasualBoots":
			loadbootspreset();
			break;
		case "ChampionsHunt":
			loadchuntpreset();
			break;
		case "ChampionsSwordless":
			loadcswordlesspreset();
			break;
		case "Crosskeys":
			loadcrosskeyspreset();
			break;
		case "Enemizer":
			loadenemizerpreset();
			break;
		case "GoldRush":
			loadgoldrushspreset();
			break;
		case "InvertedADKeysanity":
			loadinvertedadkeyspreset();
			break;
		case "InvertedCrosskeys":
			loadinvertedcrosskeyspreset();
			break;
		case "InvertedKeysanity":
			loadinvertedkeyspreset();
			break;
		case "Invrosia":
			loadinvrosiapreset();
			break;
		case "LudicrousSpeed":
			loadludicrouspreset();
			break;
		case "MCShuffle":
			loadmcshufflepreset();
			break;
		case "Open":
			loadopenpreset();
			break;
		case "OpenBoots":
			loadopenbootspreset();
			break;
		case "OpenKeysanity":
			loadopenkeyspreset();
			break;
		case "HardOpenPlus":
			loadhardopenpluspreset();
			break;
		case "Potpourri":
			loadpotpourripreset();
			break;
		case "ReducedCrystals":
			loadreducedpreset();
			break;
		case "Retrance":
			loadretrancepreset();
			break;
		case "Standard":
			loadstandardpreset();
			break;
		
	}
	
	
}

function loadopenpreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadopenbootspreset() {
	resetallstartingitems();
	setstartingitem("boots",22,"1");
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadambrosiapreset() {
	resetallstartingitems();
	document.getElementById("gametypestandard").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsassured").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiayes").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadmysterypreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossshuffled").checked = true;
	document.getElementById("enemyshuffled").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalrandom").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganonrandom").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownmystery").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadcrosskeyspreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancesimple").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalfast").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadinvertedkeyspreset() {
	resetallstartingitems();
	document.getElementById("gametypeinverted").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadenemizerpreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossshuffled").checked = true;
	document.getElementById("enemyshuffled").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadbootspreset() {
	resetallstartingitems();
	setstartingitem("boots",22,"1");
	document.getElementById("gametypestandard").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsassured").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadopenkeyspreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();	
}

function loadadkeyspreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goaldungeons").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();	
}

function loadreducedpreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalfast").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 6;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 6;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadinvrosiapreset() {
	resetallstartingitems();
	document.getElementById("gametypeinverted").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsassured").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiayes").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();		
	
}

function loadstandardpreset() {
	resetallstartingitems();
	document.getElementById("gametypestandard").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadmcshufflepreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadpotpourripreset() {
	resetallstartingitems();
	setstartingitem("hookshot",3,"1");
	setstartingitem("icerod",7,"1");
	setstartingitem("flute",14,"1");
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossshuffled").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goaldungeons").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteyes").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadretrancepreset() {
	resetallstartingitems();
	document.getElementById("gametyperetro").checked = true;
	document.getElementById("entrancesimple").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalfast").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsassured").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadcswordlesspreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsswordless").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadinvertedadkeyspreset() {
	resetallstartingitems();
	document.getElementById("gametypeinverted").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goaldungeons").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadgoldrushspreset() {
	resetallstartingitems();
	setstartingitem("boots",22,"1");
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalother").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadludicrouspreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goaldungeons").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadhardopenpluspreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsyes").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadinvertedspreset() {
	resetallstartingitems();
	document.getElementById("gametypeinverted").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadmcbosspreset() {
	resetallstartingitems();
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossshuffled").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadtinvertedkeyspreset() {
	resetallstartingitems();
	setstartingitem("flute",14,"1");
	document.getElementById("gametypeinverted").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalganon").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteyes").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadambroz1apreset() {
	resetallstartingitems();
	document.getElementById("gametyperetro").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalother").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiayes").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = false;
	document.getElementById("nonprogressivebowsyes").checked = true;
	document.getElementById("activatedfluteyes").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadinvertedcrosskeyspreset() {
	resetallstartingitems();
	document.getElementById("gametypeinverted").checked = true;
	document.getElementById("entrancesimple").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalfast").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 7;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsrandomized").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = true;
	document.getElementById("shuffledcompasses").checked = true;
	document.getElementById("shuffledsmallkeys").checked = true;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
}

function loadchuntpreset() {
	resetallstartingitems();
	setstartingitem("boots",22,"1");
	document.getElementById("gametypeopen").checked = true;
	document.getElementById("entrancenone").checked = true;
	document.getElementById("doornone").checked = true;
	document.getElementById("overworldno").checked = true;
	document.getElementById("bossnone").checked = true;
	document.getElementById("enemynone").checked = true;
	document.getElementById("glitchesnone").checked = true;
	document.getElementById("goalother").checked = true;
	document.getElementById("goalcrystal").checked = true;
	document.getElementById("towerselect").value = 5;
	document.getElementById("ganoncrystal").checked = true;
	document.getElementById("ganonselect").value = 7;
	document.getElementById("swordsassured").checked = true;
	document.getElementById("unknownnone").checked = true;
	document.getElementById("shopsanityno").checked = true;
	document.getElementById("ambrosiano").checked = true;
	document.getElementById("shuffledmaps").checked = false;
	document.getElementById("shuffledcompasses").checked = false;
	document.getElementById("shuffledsmallkeys").checked = false;
	document.getElementById("shuffledbigkeys").checked = true;
	document.getElementById("nonprogressivebowsno").checked = true;
	document.getElementById("activatedfluteno").checked = true;
	window.scrollTo(0,document.body.scrollHeight);
	showToast();
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
			document.getElementById("overworldno").checked = true;
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
					document.getElementById("shuffledmaps").checked = false;
					document.getElementById("shuffledcompasses").checked = false;
					document.getElementById("shuffledsmallkeys").checked = false;
					document.getElementById("shuffledbigkeys").checked = false;
					break;
				case "mc":
					document.getElementById("shuffledmaps").checked = true;
					document.getElementById("shuffledcompasses").checked = true;
					document.getElementById("shuffledsmallkeys").checked = false;
					document.getElementById("shuffledbigkeys").checked = false;
					break;
				case "mcs":
					document.getElementById("shuffledmaps").checked = true;
					document.getElementById("shuffledcompasses").checked = true;
					document.getElementById("shuffledsmallkeys").checked = true;
					document.getElementById("shuffledbigkeys").checked = false;
					break;
				case "full":
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

function togglediv(x) {
	var d = document.getElementById(x + "div");
	var a = document.getElementById(x + "arrow");
	
	if (d.style.display === "block") {
		d.style.display = "none";
		a.innerHTML = "&#9660;";
	} else {
		d.style.display = "block";
		a.innerHTML = "&#9650;";
	}
}

function togglereleasediv(x) {
	var d = document.getElementById("release" + x);
	var a = document.getElementById("arrow" + x);
	
	if (d.style.display === "block") {
		d.style.display = "none";
		a.innerHTML = "&#9660;";
	} else {
		d.style.display = "block";
		a.innerHTML = "&#9650;";
	}
}

function hideRestreaming() {
	if (window.location.href.indexOf("dunka.net") === -1) {
		document.getElementById("restreamingpresetdiv").style.display = "none";
		document.getElementById("importflagsdiv").style.display = "none";
	}
}

function validateRestreamCode() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://alttprtracker.dunka.net/api/v1/RestreamerAPI/ValidateCode?code=" + document.getElementById("restreamingcode").value, true);
	xhr.responseType = 'text';
	xhr.onload = function () {
		if (xhr.readyState === xhr.DONE) {
			if (xhr.status === 200) {
				var resp = xhr.response;
				coderesp = JSON.parse(resp);
				if (coderesp.role === "T") {
					document.getElementById("restreamingtrackerspan").style.display = "";
					document.getElementById("restreamingtracker").disabled = false;
					document.getElementById("restreamingtracker").checked = true;
				} else if (coderesp.role === "R") {
					document.getElementById("restreamingrestreamerspan").style.display = "";
					document.getElementById("restreamingrestreamer").disabled = false;
					document.getElementById("restreamingrestreamer").checked = true;
					document.getElementById("restreamingusedelayspan").style.display = "";
					document.getElementById("restreamingdelay").disabled = false;
				}
			} else {
				alert("Restreamer code is invalid");
			}
		}
	};

	xhr.send(null);
}