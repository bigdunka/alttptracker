function launch_tracker() {
	var state = document.querySelector('input[name="stategroup"]:checked').value;
	var variation = document.querySelector('input[name="vargroup"]:checked').value;
	var swordless = document.querySelector('input[name="swordgroup"]:checked').value;
	var map = document.querySelector('input[name="mapgroup"]:checked').value;
	var sphere = document.querySelector('input[name="spheregroup"]:checked').value;
	
	var width = map === "yes" ? 1340 : 448;
	var height = sphere === "yes" ? 744 : map === "small" ? 692 : 448;
	
	if (map === "small" && sphere === "yes") 
	{
		alert ('Spheres and the Compact map are incompatible, please change your preferences');
		return;
	}
	
open('tracker.html?state={state}&variation={variation}&swordless={swordless}&map={map}&sphere={sphere}'
			.replace('{state}', state)
			.replace('{variation}', variation)
			.replace('{swordless}', swordless)
			.replace('{map}', map)
			.replace('{sphere}', sphere),
		'',
		'width={width},height={height},titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
			.replace('{width}', width).replace('{height}', height));
	//setTimeout('window.close()', 5000);
}