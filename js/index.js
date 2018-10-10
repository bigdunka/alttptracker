function launch_tracker() {
	var state = document.querySelector('input[name="stategroup"]:checked').value;
	var variation = document.querySelector('input[name="vargroup"]:checked').value;
	var swordless = document.querySelector('input[name="swordgroup"]:checked').value;
	var map = document.querySelector('input[name="mapgroup"]:checked').value === 'yes';
	
	var width = map ? 1340 : 448;

	open('tracker.html?state={state}&variation={variation}&swordless={swordless}&map={map}'
			.replace('{state}', state)
			.replace('{variation}', variation)
			.replace('{swordless}', swordless)
			.replace('{map}', map),
		'',
		'width={width},height=448,titlebar=0,menubar=0,toolbar=0,scrollbars=0,resizable=0'
			.replace('{width}', width));
	//setTimeout('window.close()', 5000);
}