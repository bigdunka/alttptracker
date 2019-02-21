function load_cookie() {
	var c = document.cookie;
	
	if (c.indexOf('settings') > -1) {
		//alert('!');
		document.getElementById("remembersettings").checked = true;
		if (c.indexOf('m-yes') > -1) {
			document.getElementById("mapyes").checked = true;
		}
		if (c.indexOf('m-small') > -1) {
			document.getElementById("mapsmall").checked = true;
		}
		if (c.indexOf('s-yes') > -1) {
			document.getElementById("sphereyes").checked = true;
		}
	}
}

function launch_tracker() {
	var state = document.querySelector('input[name="stategroup"]:checked').value;
	var variation = document.querySelector('input[name="vargroup"]:checked').value;
	var swordless = document.querySelector('input[name="swordgroup"]:checked').value;
	var map = document.querySelector('input[name="mapgroup"]:checked').value;
	var sphere = document.querySelector('input[name="spheregroup"]:checked').value;
	var enemizer = document.querySelector('input[name="enemizergroup"]:checked').value;
	var spoiler = document.querySelector('input[name="spoilergroup"]:checked').value;
	
	var width = map === "yes" ? 1340 : 448;
	var height = sphere === "yes" ? map === "small" ? 988 : 744 : map === "small" ? 692 : 448;
	
	if (document.getElementById("remembersettings").checked == true) {
		var settings = "m-" + map + "|s-" + sphere;
		document.cookie = "settings=" + settings + "; expires=Sat, 1 Jan 2023 12:00:00 UTC";
	} else {
		document.cookie = "settings=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	}
	
	if (enemizer === "yes") {
		alert('NOTICE: Not all enemizer settings with maps have been verified and is still in testing');
	}
	
	if (spoiler === "yes") {
		alert('WARNING! This mode is not currently allowed in the current Spoiler Log Tourney! Do not use during a tourney match for risk of a DQ!');
	}
	
	var trackerWindow = window.open('tracker.html?state={state}&variation={variation}&swordless={swordless}&map={map}&sphere={sphere}&enemizer={enemizer}&spoiler={spoiler}'
			.replace('{state}', state)
			.replace('{variation}', variation)
			.replace('{swordless}', swordless)
			.replace('{map}', map)
			.replace('{sphere}', sphere)
			.replace('{enemizer}', enemizer)
			.replace('{spoiler}', spoiler),
		'',
		'width={width},height={height},titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
			.replace('{width}', width).replace('{height}', height));
}
