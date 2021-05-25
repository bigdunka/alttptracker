(function(window) {
	'use strict';
	window.opposite = {"N":"S","S":"N","W":"E","E":"W","Z":"Z"};

	window.initializeOverworldGraph = function()
	{
		createDoubleOverworldScreen(0x00,"Lost Woods","Skull Woods",true,["Southwest","South","Northeast","Southeast","Northwest","North","Divider"]);
		createDoubleOverworldScreen(0x02,"Lumberjacks","Dark Lumberjacks",false,null);
		createDoubleOverworldScreen(0x03,"West Death Mountain","West Dark Death Mountain",true,["Top","Spectacle Rock","Bottom"]);
		createDoubleOverworldScreen(0x05,"East Death Mountain","East Dark Death Mountain",true,["Top Main","Bottom Main","Top West","Bottom West","Island","Spiral","Mimic","Laser Bridge","Blocked Cave"]);
		createDoubleOverworldScreen(0x07,"Turtle Rock Pegs","Turtle Rock",false,["Main","Portal"]);
		createDoubleOverworldScreen(0x0A,"Death Mountain Entry","Bumper",false,["Main","Ledge","Bottom Cave"]);
		createDoubleOverworldScreen(0x0F,"Waterfall","Catfish",false,["Main","Waterfall"]);
		createDoubleOverworldScreen(0x10,"Kakariko Portal","Village Portal",false,["West","North","South","Portal"]);
		createDoubleOverworldScreen(0x11,"Kakariko Fortune Teller","Village Fortune Teller",false,null);
		createDoubleOverworldScreen(0x12,"Pond","Dark Pond",false,null);
		createDoubleOverworldScreen(0x13,"Sanctuary","Dark Chapel",false,["Main","Rocks"]);
		createDoubleOverworldScreen(0x14,"Graveyard","Dark Graveyard",false,["Main","Ledge","North","King Tomb"]);
		createDoubleOverworldScreen(0x15,"Houlihan Fairy","Dark Houlihan Fairy",false,["West","East","River"]);
		createDoubleOverworldScreen(0x16,"Potion Shop","Dark Potion Shop",false,["West","East","River"]);
		createDoubleOverworldScreen(0x17,"Zora Warning","Cafish Warning",false,["West","East","River"]);
		createDoubleOverworldScreen(0x18,"Kakariko","Village of Outcasts",true,["Main","Blocked House","Southwest"]);
		createDoubleOverworldScreen(0x1A,"Forgotten Forest","Curiosity Shop",false,null);
		createDoubleOverworldScreen(0x1B,"Hyrule Castle","Pyramid",true,["Main","East","South","Southwest","Courtyard","Balcony","Passage Exit"]);
		createDoubleOverworldScreen(0x1D,"Wooden Bridge","Broken Bridge",false,["West","Northeast","Southeast","River"]);
		createDoubleOverworldScreen(0x1E,"Eastern Palace","Palace of Darkness",true,null);
		createDoubleOverworldScreen(0x22,"Blacksmiths","Hammer Pegs",false,["West","Main","Northeast"]);
		createDoubleOverworldScreen(0x25,"Rock Field","Dark Rock Field",false,null);
		createDoubleOverworldScreen(0x28,"Maze Race","Digging Game",false,["Top","Bottom","Minigame"]);
		createDoubleOverworldScreen(0x29,"Library","Archery Game",false,["Top","Bottom"]);
		createDoubleOverworldScreen(0x2A,"Haunted Grove","Stumpy",false,["Main","Southwest"]);
		createDoubleOverworldScreen(0x2B,"Central Bonk Rocks","Dark Bonk Rocks",false,null);
		createDoubleOverworldScreen(0x2C,"Link's House","Bomb Shop",false,null);
		createDoubleOverworldScreen(0x2D,"Hobo's Bridge","Hammer Bridge",false,["North","South","River"]);
		createDoubleOverworldScreen(0x2E,"Tree Line","Dark Tree Line",false,["Main","River"]);
		createDoubleOverworldScreen(0x2F,"Eastern Portal","Darkness Portal",false,["Main","Portal"]);
		createDoubleOverworldScreen(0x30,"Desert","Misery Mire",true,["Main","Front","Ledge","Back","Tablet","Northeast","Portal"]);
		createDoubleOverworldScreen(0x32,"Cave 45","Bush Circle 45",false,["Main","North","Ledge"]);
		createDoubleOverworldScreen(0x33,"C Whirlpool","Dark C",false,["West","East","Portal"]);
		createDoubleOverworldScreen(0x34,"Hype Fairy","Hype Cave",false,null);
		createDoubleOverworldScreen(0x35,"Lake Hylia","Dark Lake Hylia",true,["Northwest","Northeast","Southwest","Southeast","Lake","Central Island","Small Island"]);
		createDoubleOverworldScreen(0x37,"Ice Cave","Dark Ice Cave",false,null);
		createDoubleOverworldScreen(0x3A,"Desert Thief","Dark Desert Thief",false,["Main","Southeast","Ledge"]);
		createDoubleOverworldScreen(0x3B,"Dam","Swamp Palace",false,null);
		createDoubleOverworldScreen(0x3C,"South Pass","Dark South Pass",false,null);
		createDoubleOverworldScreen(0x3F,"Octoballoon","Dark Octoballoon",false,["Main","Waterfall"]);
		let specialScreen = createOverworldScreen(0x80,"Pedestal",false,["Main"]);
		specialScreen.x = 32;
		specialScreen.y = 0;
		specialScreen.file = "pedestal";
		specialScreen = createOverworldScreen(0x81,"Zora's Domain",false,["Main","Southeast"]);
		specialScreen.x = 384;
		specialScreen.y = 32;
		specialScreen.file = "zora";
		specialScreen = createOverworldScreen(0x82,"Hobo",false,["Main"]);
		specialScreen.x = 384;
		specialScreen.y = 224;
		specialScreen.file = "hobo";
		let specialEdge = createOverworldEdge(0x00,"Northwest","N",1,1,false,.3);
		specialEdge.y = specialEdge.y2 = .35;
		createDoubleOverworldEdge(0x00,"Northeast","E",1,1,false,.3);
		createDoubleOverworldEdge(0x00,"Southwest","S",0,2,false,.2);
		createDoubleOverworldEdge(0x00,"South","S",1,2,false,.75);
		createDoubleOverworldEdge(0x00,"Southeast","S",2,1,false,1.8);
		createDoubleOverworldEdge(0x02,"Main","W",1,1,false,.3);
		createDoubleOverworldEdge(0x02,"Main","S",1,1,false,.4);
		createDoubleOverworldEdge(0x03,"Top","E",0,1,false,.25);
		createDoubleOverworldEdge(0x03,"Bottom","E",2,1,false,1.65);
		createDoubleOverworldEdge(0x05,"Top West","W",0,1,false,.25);
		createDoubleOverworldEdge(0x05,"Bottom West","W",2,1,false,1.65);
		createDoubleOverworldEdge(0x05,"Top Main","E",1,1,false,.25);
		createDoubleOverworldEdge(0x07,"Main","W",1,1,false,.25);
		createDoubleOverworldEdge(0x0A,"Main","N",1,1,false,.4);
		createDoubleOverworldEdge(0x0A,"Main","S",1,1,false,.55);
		createOverworldEdge(0x0F,"Main","N",1,1,false,.65);
		createDoubleOverworldEdge(0x0F,"Main","S",1,1,false,.75);
		createWhirlpool(0x0F,"Main",.25,.6);
		createDoubleOverworldEdge(0x10,"West","N",0,2,false,.2);
		createDoubleOverworldEdge(0x10,"North","N",2,2,false,.75);
		createDoubleOverworldEdge(0x10,"West","S",0,2,false,.3);
		createDoubleOverworldEdge(0x10,"South","S",2,2,false,.65);
		createDoubleOverworldEdge(0x11,"Main","N",1,1,false,.8);
		createDoubleOverworldEdge(0x11,"Main","E",0,2,false,.3);
		createDoubleOverworldEdge(0x11,"Main","E",2,2,false,.75);
		createDoubleOverworldEdge(0x11,"Main","S",1,1,false,.55);
		createDoubleOverworldEdge(0x12,"Main","N",1,1,false,.55);
		createDoubleOverworldEdge(0x12,"Main","W",0,2,false,.3);
		createDoubleOverworldEdge(0x12,"Main","W",2,2,false,.75);
		createDoubleOverworldEdge(0x12,"Main","E",0,2,false,.4);
		createDoubleOverworldEdge(0x12,"Main","E",2,2,false,.75);
		createDoubleOverworldEdge(0x12,"Main","S",0,2,false,.3);
		createDoubleOverworldEdge(0x12,"Main","S",2,2,false,.6);
		createWhirlpool(0x12,"Main",.5,.5);
		createDoubleOverworldEdge(0x13,"Rocks","W",0,2,false,.4);
		createDoubleOverworldEdge(0x13,"Main","W",2,2,false,.75);
		createDoubleOverworldEdge(0x13,"Main","E",1,1,false,.55);
		createDoubleOverworldEdge(0x14,"Main","W",1,1,false,.55);
		createDoubleOverworldEdge(0x14,"Main","E",1,1,false,.55);
		createDoubleOverworldEdge(0x15,"West","W",1,1,false,.55);
		createDoubleOverworldEdge(0x15,"River","E",0,1,true,.25);
		createDoubleOverworldEdge(0x15,"East","E",1,2,false,.45);
		createDoubleOverworldEdge(0x15,"East","E",2,2,false,.7);
		createDoubleOverworldEdge(0x15,"West","S",0,2,false,.3);
		createDoubleOverworldEdge(0x15,"River","S",1,1,true,.6);
		createDoubleOverworldEdge(0x15,"East","S",2,2,false,.8);
		createWhirlpool(0x15,"River",.55,.3);
		createWhirlpool(0x55,"River",.55,.3);
		createDoubleOverworldEdge(0x16,"River","W",0,1,true,.25);
		createDoubleOverworldEdge(0x16,"West","W",1,2,false,.45);
		createDoubleOverworldEdge(0x16,"West","W",2,2,false,.7);
		createDoubleOverworldEdge(0x16,"River","E",0,1,true,.15);
		createDoubleOverworldEdge(0x16,"East","E",2,1,false,.35);
		createDoubleOverworldEdge(0x17,"East","N",1,1,false,.75);
		createDoubleOverworldEdge(0x17,"River","W",0,1,true,.15);
		createDoubleOverworldEdge(0x17,"West","W",2,1,false,.35);
		createDoubleOverworldEdge(0x18,"Main","N",0,2,false,.3);
		createDoubleOverworldEdge(0x18,"Main","N",1,2,false,.65);
		createDoubleOverworldEdge(0x18,"Main","N",2,1,false,1.55);
		createDoubleOverworldEdge(0x18,"Main","E",1,1,false,1.6);
		createDoubleOverworldEdge(0x18,"Main","S",1,1,false,1.7);
		createDoubleOverworldEdge(0x1A,"Main","N",0,2,false,.3);
		createDoubleOverworldEdge(0x1A,"Main","N",2,2,false,.6);
		createOverworldEdge(0x1A,"Main","E",1,1,false,.6);
		createOverworldEdge(0x1B,"Main","W",1,1,false,.6);
		createDoubleOverworldEdge(0x1B,"East","E",1,1,false,1.3);
		createDoubleOverworldEdge(0x1B,"Southwest","S",0,1,false,.25);
		createDoubleOverworldEdge(0x1B,"South","S",2,1,false,1.6);
		createDoubleOverworldEdge(0x1D,"West","N",0,2,false,.3);
		createDoubleOverworldEdge(0x1D,"River","N",1,1,true,.6);
		createDoubleOverworldEdge(0x1D,"Northeast","N",2,2,false,.8);
		createDoubleOverworldEdge(0x1D,"Southeast","S",1,1,false,.35);
		createDoubleOverworldEdge(0x1E,"Main","S",0,1,false,.25);
		createDoubleOverworldEdge(0x1E,"Main","S",2,1,false,1.75);
		createDoubleOverworldEdge(0x22,"West","W",1,1,false,.6);
		createDoubleOverworldEdge(0x25,"Main","N",1,1,false,.35);
		createDoubleOverworldEdge(0x25,"Main","W",1,1,false,.3);
		createDoubleOverworldEdge(0x25,"Main","S",1,1,false,.45);
		let edge1 = createOverworldEdge(0x28,"Bottom","E",1,1,false,.9);
		createOverworldEdge(0x68,"Top","E",0,2,false,.7);
		let edge2 = createOverworldEdge(0x68,"Bottom","E",2,2,false,.9);
		edge1.parallel = edge2;
		edge2.parallel = edge1;
		createDoubleOverworldEdge(0x29,"Top","N",1,1,false,.7);
		edge1 = createOverworldEdge(0x29,"Bottom","W",1,1,false,.9);
		createOverworldEdge(0x69,"Bottom","W",0,2,false,.7);
		edge2 = createOverworldEdge(0x69,"Bottom","W",2,2,false,.9);
		edge1.parallel = edge2;
		edge2.parallel = edge1;
		createDoubleOverworldEdge(0x29,"Bottom","E",1,1,false,.7);
		createDoubleOverworldEdge(0x2A,"Southwest","W",1,1,false,.7);
		createDoubleOverworldEdge(0x2A,"Southwest","S",0,2,false,.15);
		createDoubleOverworldEdge(0x2A,"Main","S",2,2,false,.45);
		createDoubleOverworldEdge(0x2B,"Main","N",1,1,false,.25);
		createDoubleOverworldEdge(0x2B,"Main","E",0,3,false,.35);
		createDoubleOverworldEdge(0x2B,"Main","E",1,3,false,.6);
		createDoubleOverworldEdge(0x2B,"Main","E",2,3,false,.8);
		createDoubleOverworldEdge(0x2B,"Main","S",1,1,false,.3);
		createDoubleOverworldEdge(0x2C,"Main","N",1,1,false,.6);
		createDoubleOverworldEdge(0x2C,"Main","W",0,3,false,.35);
		createDoubleOverworldEdge(0x2C,"Main","W",1,3,false,.6);
		createDoubleOverworldEdge(0x2C,"Main","W",2,3,false,.8);
		createDoubleOverworldEdge(0x2C,"Main","S",1,1,false,.45);
		createDoubleOverworldEdge(0x2C,"Main","E",1,1,false,.8);
		createDoubleOverworldEdge(0x2D,"North","N",1,1,false,.45);
		specialEdge = createOverworldEdge(0x2D,"River","W",0,1,true,.6);
		specialEdge.x = specialEdge.x2 = .65;
		edge1 = createOverworldEdge(0x2D,"South","W",2,1,false,.8);
		edge2 = createOverworldEdge(0x6D,"South","W",1,1,false,.8);
		edge1.parallel = edge2;
		edge2.parallel = edge1;
		createDoubleOverworldEdge(0x2D,"North","E",0,1,false,.3);
		createDoubleOverworldEdge(0x2D,"River","E",2,1,true,.65);
		createDoubleOverworldEdge(0x2D,"South","S",1,1,false,.45);
		createDoubleOverworldEdge(0x2E,"Main","N",1,1,false,.25);
		createDoubleOverworldEdge(0x2E,"Main","W",0,1,false,.3);
		createDoubleOverworldEdge(0x2E,"River","W",2,1,true,.65);
		createDoubleOverworldEdge(0x2E,"River","S",0,1,true,.6);
		createDoubleOverworldEdge(0x2E,"Main","S",2,1,false,.85);
		createDoubleOverworldEdge(0x2F,"Main","N",1,1,false,.75);
		createOverworldEdge(0x30,"Tablet","E",0,2,false,1.5);
		createOverworldEdge(0x30,"Main","E",2,2,false,1.8);
		createDoubleOverworldEdge(0x32,"Main","N",0,2,false,.15);
		createDoubleOverworldEdge(0x32,"North","N",2,2,false,.45);
		createDoubleOverworldEdge(0x32,"Main","E",1,1,false,.5);
		createDoubleOverworldEdge(0x33,"West","N",1,1,false,.3);
		createDoubleOverworldEdge(0x33,"West","W",1,1,false,.5);
		createDoubleOverworldEdge(0x33,"East","E",0,2,false,.3);
		createDoubleOverworldEdge(0x33,"East","E",1,1,true,.55);
		createDoubleOverworldEdge(0x33,"East","E",2,2,false,.8);
		createDoubleOverworldEdge(0x33,"East","S",1,1,false,.6);
		createWhirlpool(0x33,"East",.65,.6);
		createDoubleOverworldEdge(0x34,"Main","N",1,1,false,.45);
		createDoubleOverworldEdge(0x34,"Main","W",0,2,false,.3);
		createDoubleOverworldEdge(0x34,"Main","W",1,1,true,.55);
		createDoubleOverworldEdge(0x34,"Main","W",2,2,false,.8);
		createDoubleOverworldEdge(0x34,"Main","S",1,1,false,.5);
		createDoubleOverworldEdge(0x35,"Northwest","N",0,1,false,.45);
		createDoubleOverworldEdge(0x35,"Lake","N",1,1,true,1.6);
		createDoubleOverworldEdge(0x35,"Northeast","N",2,1,false,1.85);
		createDoubleOverworldEdge(0x35,"Southwest","W",1,1,false,1.8);
		createDoubleOverworldEdge(0x35,"Lake","E",0,1,true,1.6);
		createDoubleOverworldEdge(0x35,"Southeast","E",2,1,false,1.85);
		createWhirlpool(0x35,"Lake",1.3,1.35);
		createDoubleOverworldEdge(0x37,"Main","S",0,1,true,.25);
		createDoubleOverworldEdge(0x37,"Main","S",2,1,false,.65);
		createOverworldEdge(0x3A,"Ledge","W",0,2,false,.5);
		createOverworldEdge(0x3A,"Main","W",2,2,false,.8);
		createDoubleOverworldEdge(0x3A,"Main","E",0,2,false,.6);
		createDoubleOverworldEdge(0x3A,"Southeast","E",2,2,false,.85);
		createDoubleOverworldEdge(0x3B,"Main","N",1,1,false,.6);
		createDoubleOverworldEdge(0x3B,"Main","W",0,2,false,.6);
		createDoubleOverworldEdge(0x3B,"Main","W",2,2,false,.85);
		createDoubleOverworldEdge(0x3B,"Main","E",1,1,false,.5);
		createDoubleOverworldEdge(0x3C,"Main","N",1,1,false,.5);
		createDoubleOverworldEdge(0x3C,"Main","W",1,1,false,.5);
		createDoubleOverworldEdge(0x3C,"Main","E",1,1,false,.8);
		createDoubleOverworldEdge(0x3F,"Waterfall","N",0,1,true,.25);
		createDoubleOverworldEdge(0x3F,"Main","N",2,1,false,.65);
		createDoubleOverworldEdge(0x3F,"Main","W",0,1,true,.6);
		createDoubleOverworldEdge(0x3F,"Main","W",2,1,false,.85);
		createWhirlpool(0x3F,"Main",.25,.4);
		createWhirlpool(0x7F,"Main",.25,.4);
		createOverworldEdge(0x80,"Main","S",1,1,false,.45);
		createOverworldEdge(0x81,"Main","S",1,1,false,.5);
		createOverworldEdge(0x82,"Main","E",1,1,true,.6);
		createSingleLogicEdge(0x00,"Southwest","South",null,true);
		createSingleLogicEdge(0x00,"Southwest","Northwest",null,true);
		createDoubleLogicEdge(0x00,"Northwest","North","bushes",true);
		createSingleLogicEdge(0x00,"Divider","North","bushes",true);
		createSingleLogicEdge(0x00,"Southeast","Divider",null,true);
		createSingleLogicEdge(0x00,"Southeast","Northeast",null,true);
		createSingleLogicEdge(0x40,"Southwest","Divider","bushes",true);
		createSingleLogicEdge(0x40,"Divider","Northeast",null,true);
		createSingleLogicEdge(0x40,"South","Southeast","gloves",true);
		createDoubleLogicEdge(0x03,"Top","Bottom",null,false);
		createSingleLogicEdge(0x03,"Spectacle Rock","Top",null,false);
		createDoubleLogicEdge(0x03,"Spectacle Rock","Bottom",null,false);
		createSingleLogicEdge(0x43,"Bottom","Spectacle Rock",null,false);
		createPortal(0x03,"Bottom",null);
		createDoubleLogicEdge(0x05,"Top Main","Bottom Main",null,false);
		createSingleLogicEdge(0x05,"Top West","Top Main","hammer",true);
		createSingleLogicEdge(0x45,"Top West","Top Main",null,true);
		createSingleLogicEdge(0x05,"Bottom West","Bottom Main","hookshot",true);
		createSingleLogicEdge(0x45,"Island","Top Main",null,false);
		createSingleLogicEdge(0x05,"Top Main","Spiral",null,false);
		createSingleLogicEdge(0x05,"Top Main","Laser Bridge",null,false);
		createSingleLogicEdge(0x05,"Laser Bridge","Blocked Cave",null,false);
		createSingleLogicEdge(0x05,"Spiral","Bottom Main",null,false);
		createSingleLogicEdge(0x45,"Spiral","Mimic",null,true);
		createDoubleLogicEdge(0x05,"Blocked Cave","Bottom Main",null,false);
		createSingleLogicEdge(0x05,"Bottom Main","Blocked Cave","mitts",false);
		createSingleLogicEdge(0x45,"Bottom Main","Blocked Cave","bushes",false);
		createPortal(0x05,"Bottom Main","mitts");
		createSingleLogicEdge(0x07,"Main","Portal","mitts",false);
		createDoubleLogicEdge(0x07,"Portal","Main",null,false);
		createPortal(0x07,"Portal","hammer");
		createDoubleLogicEdge(0x0A,"Main","Bottom Cave","gloves",false);
		createDoubleLogicEdge(0x0A,"Ledge","Main",null,false);
		createDoubleLogicEdge(0x0A,"Bottom Cave","Main",null,false);
		createDoubleLogicEdge(0x0F,"Main","Waterfall","flippers",true);
		createSingleLogicEdge(0x10,"North","Portal","hammer",true);
		createPortal(0x10,"Portal","gloves");
		createSingleLogicEdge(0x50,"North","Portal","bushes",true);
		createDoubleLogicEdge(0x10,"South","Portal","mitts",true);
		createSingleLogicEdge(0x50,"North","West","bushes",true);
		createSingleLogicEdge(0x13,"Rocks","Main",null,false);
		createSingleLogicEdge(0x53,"Rocks","Main",null,true);
		createSingleLogicEdge(0x14,"Main","King Tomb","mitts",true);
		createSingleLogicEdge(0x14,"North","King Tomb","mitts",true);
		createSingleLogicEdge(0x14,"Main","North","bushes",true);
		createSingleLogicEdge(0x14,"Ledge","North",null,false);
		createSingleLogicEdge(0x54,"Main","King Tomb","bushes",true);
		createSingleLogicEdge(0x54,"North","King Tomb","bushes",true);
		createSingleLogicEdge(0x54,"Ledge","North",null,true);
		createSingleLogicEdge(0x15,"West","River","flippers",true);
		createSingleLogicEdge(0x55,"West","River","flippers",false);
		createDoubleLogicEdge(0x15,"East","River","flippers",true);
		createDoubleLogicEdge(0x16,"West","River","flippers",false);
		createDoubleLogicEdge(0x16,"East","River","flippers",false);
		createDoubleLogicEdge(0x16,"West","East","gloves",true);
		setDoubleMirrorBlock(0x16,"River");
		createDoubleLogicEdge(0x17,"West","River","flippers",false);
		createDoubleLogicEdge(0x17,"West","East",null,true);
		setDoubleMirrorBlock(0x17,"River");
		createSingleLogicEdge(0x18,"Main","Blocked House","bushes",true);
		createSingleLogicEdge(0x58,"Main","Blocked House","hammer",true);
		createDoubleLogicEdge(0x18,"Main","Southwest","bushes",true);
		createSingleLogicEdge(0x1B,"Main","East","gloves",true);
		createSingleLogicEdge(0x5B,"Main","East",null,true);
		createSingleLogicEdge(0x1B,"Main","South",null,true);
		createSingleLogicEdge(0x1B,"South","Southwest","bushes",true);
		createSingleLogicEdge(0x5B,"South","Southwest",null,true);
		createSingleLogicEdge(0x5B,"Main","Courtyard",null,true);
		createSingleLogicEdge(0x5B,"Courtyard","Balcony",null,true);
		createSingleLogicEdge(0x1B,"Balcony","Courtyard",null,false);
		createSingleLogicEdge(0x1B,"Balcony","Main",null,false);
		createSingleLogicEdge(0x1B,"Courtyard","Passage Exit","bushes",true);
		createSingleLogicEdge(0x5B,"Courtyard","Passage Exit",null,true);
		createPortal(0x1B,"Main","agahnim");
		createPortal(0x1B,"Courtyard","agahnim");
		createSingleLogicEdge(0x1D,"West","Northeast","hookshot",false);
		createSingleLogicEdge(0x5D,"Northeast","West","hookshot",false);
		createSingleLogicEdge(0x1D,"West","Southeast",null,true);
		createDoubleLogicEdge(0x1D,"West","River","flippers",false);
		createDoubleLogicEdge(0x1D,"Northeast","River","flippers",false);
		createSingleLogicEdge(0x5D,"Southeast","River","flippers",false);
		createSingleLogicEdge(0x1D,"Northeast","Southeast","bushes",true);
		createSingleLogicEdge(0x5D,"Northeast","Southeast","hammer",true);
		createSingleLogicEdge(0x5D,"Northeast","Southeast","gloves",true);
		createSingleLogicEdge(0x22,"West","Main",null,true);
		createSingleLogicEdge(0x62,"West","Main","mitts",true);
		createSingleLogicEdge(0x22,"Main","Northeast","hammer",true);
		createSingleLogicEdge(0x62,"Main","Northeast",null,true);
		createSingleLogicEdge(0x28,"Minigame","Top","bushes",true);
		createSingleLogicEdge(0x28,"Minigame","Bottom",null,false);
		createDoubleLogicEdge(0x28,"Top","Bottom",null,false);
		createSingleLogicEdge(0x68,"Minigame","Top","mitts",false);
		createSingleLogicEdge(0x68,"Minigame","Bottom",null,true);
		createSingleLogicEdge(0x29,"Top","Bottom",null,true);
		createSingleLogicEdge(0x69,"Top","Bottom",null,false);
		createSingleLogicEdge(0x69,"Bottom","Top","mitts",false);
		createSingleLogicEdge(0x2D,"North","South",null,true);
		createSingleLogicEdge(0x6D,"North","South","hammer",true);
		createSingleLogicEdge(0x6D,"North","River","flippers",true);
		setDoubleMirrorBlock(0x2E,"River");
		createDoubleLogicEdge(0x2F,"Main","Portal","hammer",true);
		createPortal(0x2F,"Portal","gloves");
		createSingleLogicEdge(0x30,"Main","Front","book",false);
		createSingleLogicEdge(0x70,"Main","Front",null,true);
		createSingleLogicEdge(0x30,"Ledge","Main",null,false);
		createSingleLogicEdge(0x70,"Ledge","Main",null,true);
		createSingleLogicEdge(0x30,"Tablet","Main",null,false);
		createSingleLogicEdge(0x30,"Ledge","Back","gloves",true);
		createSingleLogicEdge(0x70,"Ledge","Back",null,true);
		createDoubleLogicEdge(0x30,"Portal","Main",null,false);
		createSingleLogicEdge(0x30,"Northeast","Main",null,false);
		createSingleLogicEdge(0x70,"Northeast","Main",null,true);
		createPortal(0x30,"Portal","mitts");
		createDoubleLogicEdge(0x32,"North","Main","bushes",true);
		createSingleLogicEdge(0x32,"Ledge","Main",null,false);
		createSingleLogicEdge(0x72,"Ledge","Main",null,true);
		createDoubleLogicEdge(0x33,"West","East","gloves",true);
		createDoubleLogicEdge(0x33,"East","Portal","hammer",true);
		createPortal(0x33,"Portal","gloves");
		createSingleLogicEdge(0x35,"Northwest","Lake","flippers",true);
		createSingleLogicEdge(0x75,"Northwest","Lake","flippers",false);
		createDoubleLogicEdge(0x35,"Northeast","Lake","flippers",true);
		createSingleLogicEdge(0x35,"Southwest","Southeast",null,true);
		createDoubleLogicEdge(0x35,"Southwest","Lake","flippers",false);
		createDoubleLogicEdge(0x35,"Southeast","Lake","flippers",false);
		createSingleLogicEdge(0x35,"Central Island","Lake","flippers",true);
		createSingleLogicEdge(0x35,"Small Island","Lake","flippers",false);
		createSingleLogicEdge(0x75,"Small Island","Lake","flippers",true);
		createPortal(0x35,"Central Island","mitts");
		createSingleLogicEdge(0x3A,"Ledge","Main",null,false);
		createSingleLogicEdge(0x7A,"Ledge","Main",null,true);
		createSingleLogicEdge(0x3A,"Southeast","Main","gloves",true);
		createSingleLogicEdge(0x7A,"Southeast","Main",null,true);
		createDoubleLogicEdge(0x3F,"Waterfall","Main","flippers",false);
		setDoubleMirrorBlock(0x3F,"Waterfall");
		createSingleLogicEdge(0x81,"Main","Southeast","flippers",true);
		createDefaultConnector(0x4A,"Ledge",0x4A,"Bottom Cave","cape",true);
		createDefaultConnector(0x0A,"Bottom Cave",0x03,"Bottom","lantern",false);
		createDefaultConnector(0x03,"Bottom",0x0A,"Ledge","lantern",true);
		createDefaultConnector(0x05,"Bottom Main",0x05,"Top Main",null,true);
		createDefaultConnector(0x45,"Bottom Main",0x45,"Top Main",null,false);
		createDefaultConnector(0x45,"Top Main",0x45,"Island","gloves",true);
		createDefaultConnector(0x47,"Portal",0x45,"Spiral","connectortr",false);
		createDefaultConnector(0x1B,"Main",0x1B,"Passage Exit","bushes",false);
		createDefaultConnector(0x1B,"Courtyard",0x13,"Main","connectorhccsanc",false);
		createDefaultConnector(0x14,"Main",0x13,"Main","connectorboesanc",false);
		createDefaultConnector(0x14,"Main",0x1B,"Balcony","connectorboehcb",false);
		createDefaultConnector(0x14,"Main",0x1B,"Courtyard","connectorboehcc",false);
		createDefaultConnector(0x13,"Main",0x1B,"Balcony","connectorsanchcb",false);
		createDefaultConnector(0x13,"Main",0x1B,"Courtyard","connectorsanchcc",false);
		createDefaultConnector(0x28,"Top",0x29,"Bottom","bushes",true);
        setEntranceRegion(0x00,"Northeast",[20]);
        setEntranceRegion(0x00,"Southeast",[21,22]);
        setEntranceRegion(0x40,"Southeast",[99,100,101,102,103]);
        setEntranceRegion(0x40,"Northwest",[96,97]);
        setEntranceRegion(0x40,"North",[98]);
        setEntranceRegion(0x02,"Main",[23,24,25]);
        setEntranceRegion(0x42,"Main",[104]);
        setEntranceRegion(0x03,"Top",[68]);
        setEntranceRegion(0x03,"Bottom",[69,70,71,72,73,75,76]);
        setEntranceRegion(0x43,"Top",[127]);
        setEntranceRegion(0x43,"Bottom",[128,130]);
        setEntranceRegion(0x05,"Top Main",[77]);
        setEntranceRegion(0x05,"Bottom Main",[78,79,81,82]);
        setEntranceRegion(0x05,"Spiral",[80]);
        setEntranceRegion(0x05,"Mimic",[85]);
        setEntranceRegion(0x05,"Laser Bridge",[83]);
        setEntranceRegion(0x05,"Blocked Cave",[84]);
        setEntranceRegion(0x45,"Top Main",[132,133]);
        setEntranceRegion(0x45,"Bottom Main",[134,135]);
        setEntranceRegion(0x45,"Island",[131]);
        setEntranceRegion(0x45,"Spiral",[138]);
        setEntranceRegion(0x45,"Mimic",[139]);
        setEntranceRegion(0x45,"Laser Bridge",[137]);
        setEntranceRegion(0x47,"Portal",[136]);
        setEntranceRegion(0x0A,"Ledge",[74]);
        setEntranceRegion(0x0A,"Bottom Cave",[26]);
        setEntranceRegion(0x4A,"Ledge",[129]);
        setEntranceRegion(0x4A,"Bottom Cave",[105]);
        setEntranceRegion(0x0F,"Waterfall",[5]);
        setEntranceRegion(0x11,"Main",[27]);
        setEntranceRegion(0x51,"Main",[106]);
        setEntranceRegion(0x13,"Main",[13]);
        setEntranceRegion(0x13,"Rocks",[14]);
        setEntranceRegion(0x53,"Main",[90]);
        setEntranceRegion(0x14,"Main",[15]);
        setEntranceRegion(0x14,"King Tomb",[17]);
        setEntranceRegion(0x14,"Ledge",[16]);
        setEntranceRegion(0x15,"West",[18,19]);
        setEntranceRegion(0x16,"West",[4]);
        setEntranceRegion(0x56,"West",[92]);
        setEntranceRegion(0x18,"Main",[28,29,30,31,32,33,34,35,36,39,40,41]);
        setEntranceRegion(0x18,"Blocked House",[37]);
        setEntranceRegion(0x18,"Southwest",[38]);
        setEntranceRegion(0x58,"Main",[107,108,109,111]);
        setEntranceRegion(0x58,"Blocked House",[110]);
        setEntranceRegion(0x5A,"Main",[91]);
        setEntranceRegion(0x1B,"Main",[12]);
        setEntranceRegion(0x1B,"Passage Exit",[11]);
        setEntranceRegion(0x1B,"Courtyard",[7]);
        setEntranceRegion(0x1B,"Balcony",[8,9,10]);
        setEntranceRegion(0x5B,"Main",[93,94,95]);
        setEntranceRegion(0x1E,"Main",[49,50]);
        setEntranceRegion(0x5E,"Main",[114,115]);
        setEntranceRegion(0x22,"Main",[42,43]);
        setEntranceRegion(0x22,"Northeast",[44]);
        setEntranceRegion(0x62,"Main",[112]);
        setEntranceRegion(0x28,"Top",[46]);
        setEntranceRegion(0x29,"Top",[45]);
        setEntranceRegion(0x29,"Bottom",[47,48]);
        setEntranceRegion(0x69,"Bottom",[113]);
        setEntranceRegion(0x2B,"Main",[1]);
        setEntranceRegion(0x6B,"Main",[87]);
        setEntranceRegion(0x2C,"Main",[0]);
        setEntranceRegion(0x6C,"Main",[86]);
        setEntranceRegion(0x2E,"Main",[51]);
        setEntranceRegion(0x6E,"Main",[116]);
        setEntranceRegion(0x2F,"Main",[52]);
        setEntranceRegion(0x6F,"Main",[117]);
        setEntranceRegion(0x30,"Main",[55,58]);
        setEntranceRegion(0x30,"Front",[53]);
        setEntranceRegion(0x30,"Ledge",[54]);
        setEntranceRegion(0x30,"Back",[56]);
        setEntranceRegion(0x30,"Northeast",[57]);
        setEntranceRegion(0x70,"Main",[124,125,126]);
        setEntranceRegion(0x70,"Front",[123]);
        setEntranceRegion(0x32,"Ledge",[3]);
        setEntranceRegion(0x34,"Main",[6]);
        setEntranceRegion(0x74,"Main",[88]);
        setEntranceRegion(0x35,"Northwest",[61,62]);
        setEntranceRegion(0x35,"Southwest",[63]);
        setEntranceRegion(0x35,"Central Island",[64]);
        setEntranceRegion(0x75,"Northwest",[119]);
        setEntranceRegion(0x75,"Central Island",[118]);
        setEntranceRegion(0x37,"Main",[65,66,67]);
        setEntranceRegion(0x77,"Main",[120,121,122]);
        setEntranceRegion(0x3A,"Main",[59,60]);
        setEntranceRegion(0x3B,"Main",[2]);
        setEntranceRegion(0x7B,"Main",[89]);
	};

	window.vanillaTransitionsMode = function(button)
	{
		if(owshuffle === 'P')
		{
			connectEdgesByKeys(0x2D,"W0",0x82,"E1",true);
			if(similarow)
			{
				connectEdgesByKeys(0x1A,"E1",0x1B,"W1",true);
				connectEdgesByKeys(0x28,"E1",0x29,"W1",true);
				connectEdgesByKeys(0x68,"E0",0x69,"W0",true);
				connectEdgesByKeys(0x68,"E2",0x69,"W2",true);
				connectEdgesByKeys(0x30,"E0",0x3A,"W0",true);
				connectEdgesByKeys(0x30,"E2",0x3A,"W2",true);
			}
			else
				if(!crossedow)
					connectEdgesByKeys(0x68,"E0",0x69,"W0",true);
		}
		if(similarow && !crossedow)
		{
			connectEdgesByKeys(0x2B,"E0",0x2C,"W0",true);
			connectEdgesByKeys(0x2B,"E1",0x2C,"W1",true);
			connectEdgesByKeys(0x2B,"E2",0x2C,"W2",true);
			connectEdgesByKeys(0x6B,"E0",0x6C,"W0",true);
			connectEdgesByKeys(0x6B,"E1",0x6C,"W1",true);
			connectEdgesByKeys(0x6B,"E2",0x6C,"W2",true);
		}
		if(!crossedow)
			connectEdgesByKeys(0x55,"ZW",0x7F,"ZW",true);
		sendUpdate();
		updateReachableEdges();
		buttonFlash(button);
	};

	window.vanillaWhirlpools = function(button)
	{
		connectEdgesByKeys(0x0F,"ZW",0x35,"ZW",true);
		connectEdgesByKeys(0x12,"ZW",0x3F,"ZW",true);
		connectEdgesByKeys(0x15,"ZW",0x33,"ZW",true);
		connectEdgesByKeys(0x55,"ZW",0x7F,"ZW",true);
		sendUpdate();
		updateReachableEdges();
		buttonFlash(button);
	};

	window.vanillaSpecialScreens = function(button)
	{
		connectEdgesByKeys(0x00,"N1",0x80,"S1",true);
		connectEdgesByKeys(0x0F,"N1",0x81,"S1",true);
		connectEdgesByKeys(0x2D,"W0",0x82,"E1",true);
		sendUpdate();
		updateReachableEdges();
		buttonFlash(button);
	};

	window.explore = function(current,items,visitedRegions,visitedScreenEdges)
	{
		visitedRegions.add(current);
		let edgesOut = current.logicEdgesOut.concat(entranceEnabled ?current.entranceConnectorsOut :current.defaultConnectorsOut);
		for(let edge of edgesOut)
		{
			if((!edge.rule || checkRule(edge.rule,items,current.darkWorld)) && !visitedRegions.has(edge.target))
			{
				explore(edge.target,items,visitedRegions,visitedScreenEdges);
			}
		}
		for(let edge of current.screenEdges)
		{
			if(!edge.water || checkRule("flippers",items,current.darkWorld))
			{
				visitedScreenEdges.add(edge);
				if(edge.out && !visitedRegions.has(edge.out.region))
				{
					explore(edge.out.region,items,visitedRegions,visitedScreenEdges);
				}
			}
		}
		if(current.portal && (!current.portal.rule || checkRule(current.portal.rule,items,current.darkWorld)) && !visitedRegions.has(current.parallel))
		{
			explore(current.parallel,items,visitedRegions,visitedScreenEdges);
		}
		if(current.darkWorld && !current.mirrorBlock && items.mirror && !visitedRegions.has(current.parallel))
		{
			explore(current.parallel,items,visitedRegions,visitedScreenEdges);
		}
	};

	window.dijkstra = function(goal,items)
	{
		let reachable = new Set();
		for(let screen of overworldScreens.values())
			for(let region of screen.regions.values())
			{
				region.distance = Infinity;
				region.nextRegion = [];
			}
		goal.distance = 0;
		reachable.add(goal);
		while(reachable.size != 0)
		{
			let min = Infinity,current;
			for(let region of reachable)
				if(region.distance < min)
				{
					min = region.distance;
					current = region;
				}
			reachable.delete(current);
			let edgesIn = current.logicEdgesIn.concat(entranceEnabled ?current.entranceConnectorsIn :current.defaultConnectorsIn);
			for(let edge of edgesIn)
			{
				let distance = current.distance+edge.weight;
				if((!edge.rule || checkRule(edge.rule,items,current.darkWorld)) && distance < edge.source.distance)
				{
					edge.source.distance = distance;
					edge.source.nextRegion = current;
					edge.source.nextEdgeType = edge.weight > 1 ?"C" :"L";
					edge.source.nextEdge = edge;
					reachable.add(edge.source);
				}
			}
			for(let edge of current.screenEdges)
			{
				let distance = current.distance+1;
				if(edge.in && (!edge.water || checkRule("flippers",items,edge.in.region.darkWorld)) && distance < edge.in.region.distance)
				{
					edge.in.region.distance = distance;
					edge.in.region.nextRegion = current;
					edge.in.region.nextEdgeType = "S";
					edge.in.region.nextEdge = edge.in;
					reachable.add(edge.in.region);
				}
			}
			if(current.parallel)
			{
				let distance = current.distance+1,parallel = current.parallel;
				if(parallel.portal && (!parallel.portal.rule || checkRule(parallel.portal.rule,items,parallel.darkWorld)) && distance < parallel.distance)
				{
					parallel.distance = distance;
					parallel.nextRegion = current;
					parallel.nextEdgeType = "P";
					reachable.add(parallel);
				}
				if(parallel.darkWorld && !parallel.mirrorBlock && items.mirror && distance < parallel.distance)
				{
					parallel.distance = distance;
					parallel.nextRegion = current;
					parallel.nextEdgeType = "M";
					reachable.add(parallel);
				}
			}
		}
	};

	window.checkRule = function(rule,items,darkWorld)
	{
		switch(rule)
		{
			case "bushes":
				return !darkWorld || items.moonpearl;
			case "mirror":
				return items.mirror;
			case "agahnim":
				return items.agahnim;
			default:
				return (!darkWorld || items.moonpearl) && items[rule];
		}
	};

	window.setEntranceRegion = function(screenID,regionName,entranceIndices)
	{
        let screen = overworldScreens.get(screenID),region = screen.regions.get(regionName);
        screen.entranceRegions.push(region);
        region.numberEntrances = entranceIndices.length;
		for(let k of entranceIndices)
			entranceIndexToRegion[k] = region;
    };

	window.createDefaultConnector = function(screenID1,regionName1,screenID2,regionName2,rule,bidirectional)
	{
		let edge = {},screen1 = overworldScreens.get(screenID1),screen2 = overworldScreens.get(screenID2);
		let region1 = screen1.regions.get(regionName1),region2 = screen2.regions.get(regionName2);
		edge.source = region1;
		edge.target = region2;
		edge.rule = rule;
		edge.weight = 3;
		region1.defaultConnectorsOut.push(edge);
		region2.defaultConnectorsIn.push(edge);
		if(bidirectional)
		{
			edge = {};
			edge.target = region1;
			edge.source = region2;
			edge.rule = rule;
			edge.weight = 3;
			region1.defaultConnectorsIn.push(edge);
			region2.defaultConnectorsOut.push(edge);
		}
	};

	window.setDoubleMirrorBlock = function(screenID,regionName)
	{
		let region = overworldScreens.get(screenID).regions.get(regionName);
		region.mirrorBlock = true;
		region.parallel.mirrorBlock = true;
	};

	window.createPortal = function(screenID,regionName,rule)
	{
		let screen = overworldScreens.get(screenID);
		screen.portal = {"rule":rule};
		screen.regions.get(regionName).portal = {"rule":rule};
	};

	window.createSingleLogicEdge = function(screenID,regionName1,regionName2,rule,bidirectional)
	{
		let edge = {},screen = overworldScreens.get(screenID);
		let region1 = screen.regions.get(regionName1),region2 = screen.regions.get(regionName2);
		edge.source = region1;
		edge.target = region2;
		edge.rule = rule;
		edge.weight = .1;
		region1.logicEdgesOut.push(edge);
		region2.logicEdgesIn.push(edge);
		if(bidirectional)
		{
			edge = {};
			edge.target = region1;
			edge.source = region2;
			edge.rule = rule;
			edge.weight = .1;
			region1.logicEdgesIn.push(edge);
			region2.logicEdgesOut.push(edge);
		}
	};

	window.createDoubleLogicEdge = function(screenID,regionName1,regionName2,rule,bidirectional)
	{
		createSingleLogicEdge(screenID,regionName1,regionName2,rule,bidirectional);
		createSingleLogicEdge(screenID+0x40,regionName1,regionName2,rule,bidirectional);
	};

	window.createWhirlpool = function(screenID,regionName,x,y)
	{
		let edge = {},screen = overworldScreens.get(screenID);
		edge.screen = screen;
		edge.region = screen.regions.get(regionName);
		edge.region.screenEdges.push(edge);
		edge.direction = "Z";
		edge.symbol = "W";
		edge.string = "ZW";
		edge.similarGroup = 1;
		edge.water = true;
		edge.x = edge.x2 = x;
		edge.y = edge.y2 = y;
		screen.edges.set("ZW",edge);
	};

	window.createOverworldEdge = function(screenID,regionName,direction,symbol,similarGroup,water,position)
	{
		let edge = {},screen = overworldScreens.get(screenID);
		edge.screen = screen;
		edge.region = screen.regions.get(regionName);
		edge.region.screenEdges.push(edge);
		edge.direction = direction;
		edge.symbol = symbol;
		edge.string = direction+symbol;
		edge.similarGroup = similarGroup;
		edge.water = water;
		edge.position = position;
		switch(edge.direction)
		{
			case "N":
				edge.x = edge.x2 = position;
				edge.y = .125;
				edge.y2 = screen.big ?.25 :.125;
				break;
			case "S":
				edge.x = edge.x2 = position;
				edge.y = screen.big ?1.875 :.875;
				edge.y2 = screen.big ?1.75 :.875;
				break;
			case "W":
				edge.x = .125;
				edge.x2 = screen.big ?.25 :.125;
				edge.y = edge.y2 = position;
				break;
			case "E":
				edge.x = screen.big ?1.875 :.875;
				edge.x2 = screen.big ?1.75 :.875;
				edge.y = edge.y2 = position;
		}
		screen.edges.set(edge.string,edge);
		return edge;
	};

	window.createDoubleOverworldEdge = function(screenID,region,direction,symbol,similarGroup,water,position)
	{
		let edge1 = createOverworldEdge(screenID,region,direction,symbol,similarGroup,water,position);
		let edge2 = createOverworldEdge(screenID+0x40,region,direction,symbol,similarGroup,water,position);
		edge1.parallel = edge2;
		edge2.parallel = edge1;
	};

	window.createOverworldScreen = function(screenID,name,big,regionNames)
	{
		let screen = {};
		screen.id = screenID;
		screen.darkWorld = screenID >= 0x40 && screenID < 0x80;
		screen.special = screenID >= 0x80;
		screen.name = name;
		screen.big = big;
		screen.edges = new Map();
		screen.regions = new Map();
        screen.entranceRegions = [];
		for(let regionName of regionNames)
		{
			let region = {};
			region.screen = screen;
			region.darkWorld = screen.darkWorld;
			region.special = screen.special;
			region.name = regionName;
			region.screenEdges = [];
			region.logicEdgesOut = [];
			region.logicEdgesIn = [];
			region.defaultConnectorsOut = [];
			region.defaultConnectorsIn = [];
			region.entranceConnectorsOut = [];
			region.entranceConnectorsIn = [];
			screen.regions.set(regionName,region);
		}
		overworldScreens.set(screenID,screen);
		return screen;
	};

	window.createDoubleOverworldScreen = function(screenID,nameLight,nameDark,big,regionNames)
	{
		if(!regionNames)
			regionNames = ["Main"];
		let screen1 = createOverworldScreen(screenID,nameLight,big,regionNames);
		let screen2 = createOverworldScreen(screenID+0x40,nameDark,big,regionNames);
		screen1.parallel = screen2;
		screen2.parallel = screen1;
		for(let regionName of regionNames)
		{
			let region1 = screen1.regions.get(regionName),region2 = screen2.regions.get(regionName);
			region1.parallel = region2;
			region2.parallel = region1;
		}
	};

	window.connectEdges = function(edge1,edge2,bidirectional)
	{
		if(edge1.out)
			edge1.out.in = null;
		if(edge2.in)
			edge2.in.out = null;
		edge1.out = edge2;
		edge2.in = edge1;
		if(bidirectional)
		{
			if(edge1.in)
				edge1.in.out = null;
			if(edge2.out)
				edge2.out.in = null;
			edge1.in = edge2;
			edge2.out = edge1;
		}
	};

	window.connectEdgesByKeys = function(screenID1,edgeID1,screenID2,edgeID2,bidirectional)
	{
		connectEdges(overworldScreens.get(screenID1).edges.get(edgeID1),overworldScreens.get(screenID2).edges.get(edgeID2),bidirectional);
	};

	window.edgesCompatible = function(edge1,edge2)
	{
		return edge1.direction === opposite[edge2.direction] && edge1.water === edge2.water && (crossedow || edge1.screen.darkWorld === edge2.screen.darkWorld) && (owshuffle !== 'P' || !edge1.parallel === !edge2.parallel) && checkSimilar(edge1,edge2);
	};

	window.checkSimilar = function(edge1,edge2)
	{
		if(!similarow)
			return true;
		if(edge1.water || edge2.water)
			return true;
		if(edge1.similarGroup !== edge2.similarGroup)
			return false;
		switch(edge1.similarGroup)
		{
			case 1:
				return true;
			case 2:
				return firstInSimilarPair(edge1) === firstInSimilarPair(edge2);
			case 3:
				return edge1.symbol === edge2.symbol;
		}
	};

	window.firstInSimilarPair = function(edge)
	{
		let edges = edge.screen.edges;
		for(let k = 0; k < 3; k++)
			if(edges.has(edge.direction+k) && edges.get(edge.direction+k).similarGroup === 2)
				return k === edge.symbol;
	};

	window.connectSimilarParallel = function(edge1,edge2)
	{
		if(similarow && edge1.similarGroup !== 1 && edge1.similarGroup === edge2.similarGroup)
		{
			let edges1 = edge1.screen.edges,edges2 = edge2.screen.edges;
			if(edge1.similarGroup === 3)
				for(let k = 0; k < 3; k++)
					connectParallel(edges1.get(edge1.direction+k),edges2.get(edge2.direction+k));
			else
			{
				let edgeList1 = [],edgeList2 = [];
				for(let k = 0; k < 3; k++)
				{
					if(edges1.has(edge1.direction+k) && edges1.get(edge1.direction+k).similarGroup === 2)
						edgeList1.push(edges1.get(edge1.direction+k));
					if(edges2.has(edge2.direction+k) && edges2.get(edge2.direction+k).similarGroup === 2)
						edgeList2.push(edges2.get(edge2.direction+k));
				}
				connectParallel(edgeList1[0],edgeList2[0]);
				connectParallel(edgeList1[1],edgeList2[1]);
			}
		}
		else
			connectParallel(edge1,edge2);
	};

	window.connectParallel = function(edge1,edge2)
	{
		connectEdges(edge1,edge2,true);
		if(owshuffle === 'P' && edge1.parallel && edge2.parallel)
			connectEdges(edge1.parallel,edge2.parallel,true);
	};

	window.clearOverworldTransitions = function()
	{
		for(let screen of overworldScreens.values())
			for(let edge of screen.edges.values())
				if(edge.out)
				{
					edge.out.in = null;
					edge.out = null;
				}
	};

	window.createEntranceConnectorEdge = function(regionStart,regionEnd)
	{
		if(!regionStart || !regionEnd)
			return;
		let edge = {};
		edge.source = regionStart;
		edge.target = regionEnd;
		edge.rule = null;
		edge.weight = 3;
		regionStart.entranceConnectorsOut.push(edge);
		regionEnd.entranceConnectorsIn.push(edge);
	};

	window.deleteEntranceConnectorEdge = function(regionStart,regionEnd)
	{
		if(!regionStart || !regionEnd)
			return;
		for(let k = 0; k < regionStart.entranceConnectorsOut.length; k++)
			if(regionStart.entranceConnectorsOut[k].target === regionEnd)
			{
				regionStart.entranceConnectorsOut.splice(k,1);
				break;
			}
		for(let k = 0; k < regionEnd.entranceConnectorsIn.length; k++)
			if(regionEnd.entranceConnectorsIn[k].source === regionStart)
			{
				regionEnd.entranceConnectorsIn.splice(k,1);
				break;
			}
	};

	window.createEntranceConnector = function(regionStart,regionEnd,status,id)
	{
		if(!regionStart || !regionEnd)
			return;
		if(status !== "single" && status !== "both" && status !== "unknown")
			status = "unknown";
		createEntranceConnectorEdge(regionStart,regionEnd);
		let connector = {};
		connector.data = [regionStart.screen.id,regionStart.name,regionEnd.screen.id,regionEnd.name];
		connector.status = status;
		connector.id = id;
		entranceConnectors.push(connector);
		if(status === "both")
			createEntranceConnectorEdge(regionEnd,regionStart);
	};

	window.makeEntranceConnectorUnidirectional = function(connector)
	{
		if(entranceConnectors.includes(connector) && connector.status === "both")
		{
			let regionStart = overworldScreens.get(connector.data[0]).regions.get(connector.data[1]),regionEnd = overworldScreens.get(connector.data[2]).regions.get(connector.data[3]);
			deleteEntranceConnectorEdge(regionEnd,regionStart);
			connector.status = "single";
		}
	};

	window.makeEntranceConnectorBidirectional = function(connector)
	{
		if(entranceConnectors.includes(connector) && connector.status !== "both")
		{
			let regionStart = overworldScreens.get(connector.data[0]).regions.get(connector.data[1]),regionEnd = overworldScreens.get(connector.data[2]).regions.get(connector.data[3]);
			createEntranceConnectorEdge(regionEnd,regionStart);
			connector.status = "both";
		}
	};

	window.deleteEntranceConnector = function(index,connector)
	{
		if(entranceConnectors[index] === connector)
		{
			let regionStart = overworldScreens.get(connector.data[0]).regions.get(connector.data[1]),regionEnd = overworldScreens.get(connector.data[2]).regions.get(connector.data[3]);
			deleteEntranceConnectorEdge(regionStart,regionEnd);
			if(connector.status === "both")
				deleteEntranceConnectorEdge(regionEnd,regionStart);
			entranceConnectors.splice(index,1);
		}
	};

	window.clearEntranceConnectors = function()
	{
		for(let screen of overworldScreens.values())
			for(let region of screen.regions.values())
			{
				region.entranceConnectorsOut = [];
				region.entranceConnectorsIn = [];
			}
		entranceConnectors = [];
	};

	window.initializeRoomsAndSymbols = function()
	{
		dungeonImportant.push({"dungeon":11,"name":"Lobby","supertile":0x61,"part":"full"});
		dungeonEntrances.push({"dungeon":0,"name":"Entrance","supertile":0xC9,"part":"full"});
		dungeonEntrances.push({"dungeon":1,"name":"Main","supertile":0x84,"part":"full"});
		dungeonEntrances.push({"dungeon":1,"name":"West","supertile":0x83,"part":"bottomleft"});
		dungeonEntrances.push({"dungeon":1,"name":"East","supertile":0x85,"part":"bottomright"});
		dungeonEntrances.push({"dungeon":1,"name":"Back","supertile":0x63,"part":"bottomleft"});
		dungeonImportant.push({"dungeon":1,"name":"Lobby","supertile":0x84,"part":"full"});
		dungeonEntrances.push({"dungeon":2,"name":"Entrance","supertile":0x77,"part":"full"});
		dungeonImportant.push({"dungeon":2,"name":"Lobby","supertile":0x77,"part":"full"});
		dungeonImportant.push({"dungeon":2,"name":"Big Key Door","supertile":0x31,"part":"full"});
		dungeonImportant.push({"dungeon":2,"name":"Big Chest Room","supertile":0x27,"part":"full"});
		dungeonImportant.push({"dungeon":2,"name":"Bumper Room","supertile":0x17,"part":"full"});
		dungeonEntrances.push({"dungeon":3,"name":"Entrance","supertile":0x4A,"part":"full"});
		dungeonImportant.push({"dungeon":3,"name":"Pit Room","supertile":0x3A,"part":"full"});
		dungeonImportant.push({"dungeon":3,"name":"Arena","supertile":0x2A,"part":"full"});
		dungeonImportant.push({"dungeon":3,"name":"Falling Bridge","supertile":0x1A,"part":"full"});
		dungeonEntrances.push({"dungeon":4,"name":"Entrance","supertile":0x28,"part":"full"});
		dungeonImportant.push({"dungeon":4,"name":"Drained Dam","supertile":0x28,"part":"full"});
		dungeonImportant.push({"dungeon":4,"name":"Hub","supertile":0x36,"part":"full"});
		dungeonEntrances.push({"dungeon":5,"name":"Front Main","supertile":0x58,"part":"bottomleft"});
		dungeonEntrances.push({"dungeon":5,"name":"Front West","supertile":0x67,"part":"topleft"});
		dungeonEntrances.push({"dungeon":5,"name":"Front Pinball","supertile":0x68,"part":"full"});
		dungeonEntrances.push({"dungeon":5,"name":"Front North","supertile":0x58,"part":"topright"});
		dungeonEntrances.push({"dungeon":5,"name":"Middle East","supertile":0x57,"part":"bottomleft"});
		dungeonEntrances.push({"dungeon":5,"name":"Middle West","supertile":0x56,"part":"bottomleft"});
		dungeonEntrances.push({"dungeon":5,"name":"Middle North","supertile":0x56,"part":"topright"});
		dungeonEntrances.push({"dungeon":5,"name":"Back","supertile":0x59,"part":"bottomleft"});
		dungeonEntrances.push({"dungeon":6,"name":"Entrance","supertile":0xDB,"part":"full"});
		dungeonEntrances.push({"dungeon":6,"name":"Blind's Cell","supertile":0x45,"part":"topright"});
		dungeonEntrances.push({"dungeon":6,"name":"Boss Room","supertile":0xAC,"part":"bottomright"});
		dungeonImportant.push({"dungeon":6,"name":"Lobby SW","supertile":0xDB,"part":"full"});
		dungeonImportant.push({"dungeon":6,"name":"Lobby NW","supertile":0xCB,"part":"full"});
		dungeonImportant.push({"dungeon":6,"name":"Lobby NE","supertile":0xCC,"part":"full"});
		dungeonImportant.push({"dungeon":6,"name":"Lobby SE","supertile":0xDC,"part":"full"});
		dungeonImportant.push({"dungeon":6,"name":"Attic","supertile":0x65,"part":"bottomright"});
		dungeonEntrances.push({"dungeon":7,"name":"Entrance","supertile":0x0E,"part":"bottomright"});
		dungeonImportant.push({"dungeon":7,"name":"Pushable Block","supertile":0x9E,"part":"bottomright"});
		dungeonEntrances.push({"dungeon":8,"name":"Entrance","supertile":0x98,"part":"bottomleft"});
		dungeonImportant.push({"dungeon":8,"name":"Hub","supertile":0xC2,"part":"full"});
		dungeonEntrances.push({"dungeon":9,"name":"Main","supertile":0xD6,"part":"bottomright"});
		dungeonEntrances.push({"dungeon":9,"name":"West","supertile":0x23,"part":"bottomright"});
		dungeonEntrances.push({"dungeon":9,"name":"East","supertile":0x24,"part":"bottomright"});
		dungeonEntrances.push({"dungeon":9,"name":"Back","supertile":0xD5,"part":"bottomleft"});
		dungeonImportant.push({"dungeon":9,"name":"Hub","supertile":0xC6,"part":"full"});
		dungeonEntrances.push({"dungeon":10,"name":"Entrance","supertile":0x0C,"part":"full"});
		dungeonImportant.push({"dungeon":10,"name":"Torch Area","supertile":0x8C,"part":"full"});
		dungeonEntrances.push({"dungeon":11,"name":"Main","supertile":0x61,"part":"full"});
		dungeonEntrances.push({"dungeon":11,"name":"West","supertile":0x60,"part":"full"});
		dungeonEntrances.push({"dungeon":11,"name":"East","supertile":0x62,"part":"full"});
		dungeonEntrances.push({"dungeon":11,"name":"Back","supertile":0x11,"part":"full"});
		dungeonEntrances.push({"dungeon":11,"name":"Sanctuary","supertile":0x12,"part":"full"});
		dungeonEntrances.push({"dungeon":11,"name":"Zelda's Cell","supertile":0x80,"part":"topright"});
		dungeonEntrances.push({"dungeon":12,"name":"Entrance","supertile":0x30,"part":"bottomleft"});
		lobbyEntrances.push({"name":"Entr- ance",file:"dungeonentrance0"});
		lobbyEntrances.push({"name":"Entr- ance 1",file:"dungeonentrance1"});
		lobbyEntrances.push({"name":"Entr- ance 2",file:"dungeonentrance2"});
		lobbyEntrances.push({"name":"Entr- ance 3",file:"dungeonentrance3"});
		lobbyEntrances.push({"name":"Entr- ance 4",file:"dungeonentrance4"});
		lobbySanctuary = {"dungeon":11,"name":"Sanctuary","supertile":0x12,"part":"full"};
		lobbySW.push({"dungeon":5,"name":"Front West Drop","supertile":0x67,"part":"topleft"});
		lobbySW.push({"dungeon":5,"name":"Front Pinball Drop","supertile":0x68,"part":"full"});
		lobbySW.push({"dungeon":5,"name":"Front North Drop","supertile":0x58,"part":"topright"});
		lobbySW.push({"dungeon":5,"name":"Middle North Drop","supertile":0x56,"part":"topright"});
		lobbyTT.push({"dungeon":6,"name":"Blind's Cell","supertile":0x45,"part":"topright"});
		lobbyTT.push({"dungeon":6,"name":"Boss Room","supertile":0xAC,"part":"bottomright"});
		lobbyHC.push({"dungeon":11,"name":"Back of Escape Drop","supertile":0x11,"part":"full"});
		lobbyHC.push({"dungeon":11,"name":"Zelda's Cell","supertile":0x80,"part":"topright"});
		for(let k = 0; k < dungeonEntrances.length; k++)
		{
			let id = "0"+k.toString(36);
			dungeonEntrances[k].id = id;
			roomMap[id] = dungeonEntrances[k];
		}
		for(let k = 0; k < dungeonImportant.length; k++)
		{
			let id = "1"+k.toString(36);
			dungeonImportant[k].id = id;
			roomMap[id] = dungeonImportant[k];
		}
		let lobbyAll = lobbyEntrances.concat(lobbySanctuary,lobbySW,lobbyTT,lobbyHC)
		for(let k = 0; k < lobbyAll.length; k++)
		{
			let id = "2"+k.toString(36);
			lobbyAll[k].id = id;
			roomMap[id] = lobbyAll[k];
		}
		directions.push({"folder":"dungeons","file":"arrowright","x":128,"y":64});
		directions.push({"folder":"dungeons","file":"arrowrightup","x":128,"y":32});
		directions.push({"folder":"dungeons","file":"arrowrightdown","x":128,"y":96});
		directions.push({"folder":"dungeons","file":"arrowright","rotate":90,"x":64,"y":128});
		directions.push({"folder":"dungeons","file":"arrowrightup","rotate":90,"x":96,"y":128});
		directions.push({"folder":"dungeons","file":"arrowrightdown","rotate":90,"x":32,"y":128});
		directions.push({"folder":"dungeons","file":"arrowright","rotate":180,"x":0,"y":64});
		directions.push({"folder":"dungeons","file":"arrowrightup","rotate":180,"x":0,"y":96});
		directions.push({"folder":"dungeons","file":"arrowrightdown","rotate":180,"x":0,"y":32});
		directions.push({"folder":"dungeons","file":"arrowright","rotate":270,"x":64,"y":0});
		directions.push({"folder":"dungeons","file":"arrowrightup","rotate":270,"x":32,"y":0});
		directions.push({"folder":"dungeons","file":"arrowrightdown","rotate":270,"x":96,"y":0});
		directions.push({"folder":"dungeons","file":"quadranttopleft","x":48,"y":48});
		directions.push({"folder":"dungeons","file":"quadranttopleft","rotate":90,"x":80,"y":48});
		directions.push({"folder":"dungeons","file":"quadranttopleft","rotate":270,"x":48,"y":80});
		directions.push({"folder":"dungeons","file":"quadranttopleft","rotate":180,"x":80,"y":80});
		overworldEdgeToDirection["N0"] = directions[10];
		overworldEdgeToDirection["N1"] = directions[9];
		overworldEdgeToDirection["N2"] = directions[11];
		overworldEdgeToDirection["S0"] = directions[5];
		overworldEdgeToDirection["S1"] = directions[3];
		overworldEdgeToDirection["S2"] = directions[4];
		overworldEdgeToDirection["W0"] = directions[8];
		overworldEdgeToDirection["W1"] = directions[6];
		overworldEdgeToDirection["W2"] = directions[7];
		overworldEdgeToDirection["E0"] = directions[1];
		overworldEdgeToDirection["E1"] = directions[0];
		overworldEdgeToDirection["E2"] = directions[2];
		overworldEdgeToDirection["ZW"] = {"folder":"interface","file":"whirlpool","x":48,"y":48};
		overworldEdgeToDirection["CO"] = {"folder":"interface","file":"connectorentrance","x":80,"y":48};
		overworldEdgeToDirection["PO"] = {"folder":"interface","file":"portal","x":48,"y":80};
		overworldEdgeToDirection["MI"] = {"folder":"items","file":"mirror","x":80,"y":80};
		objects.push({"folder":"dungeons","file":"trapdoor"});
		objects.push({"folder":"dungeons","file":"keychest0"});
		objects.push({"folder":"dungeons","file":"prize0"});
		switchobjects.push({"folder":"dungeons","file":"crystalswitch","basic":[2,3,4,6,7,8,9,10]});
		switchobjects.push({"folder":"dungeons","file":"orangedown","basic":[2,3,4,6,7,8,9,10]});
		switchobjects.push({"folder":"dungeons","file":"bluedown","basic":[2,3,4,6,7,8,9,10]});
		switchobjects.push({"folder":"dungeons","file":"lever","basic":[4]});
		switchobjects.push({"folder":"dungeons","file":"drain","basic":[4]});
		itemicons.push({"folder":"dungeons","file":"smallkey"});
		itemicons.push({"folder":"dungeons","file":"bigkey"});
		itemicons.push({"folder":"items","file":"bomb"});
		itemicons.push({"folder":"items","file":"somaria","basic":[7,8,9,10]});
		itemicons.push({"folder":"items","file":"firerod","basic":[5,9,10]});
		itemicons.push({"folder":"items","file":"lantern","basic":[0,3,8,9,11,12]});
		itemicons.push({"folder":"dungeons","file":"torch","basic":[1,2,8,10]});
		itemicons.push({"folder":"items","file":"flippers","basic":[4]});
		itemicons.push({"folder":"items","file":"hookshot","basic":[0,2,4,5,7,8,9,10]});
		itemicons.push({"folder":"items","file":"boots","basic":[1,3,5,8,9,10]});
		itemicons.push({"folder":"items","file":"bow1","basic":[0,3,10]});
		itemicons.push({"folder":"items","file":"hammer","basic":[3,4,6,7,10]});
		itemicons.push({"folder":"items","file":"sword1","basic":[5,12]});
		itemicons.push({"folder":"items","file":"glove1","basic":[1,6,7]});
		itemicons.push({"folder":"items","file":"shield3","basic":[9]});
		itemicons.push({"folder":"dungeons","file":"freezor","basic":[7]});
		itemicons.push({"folder":"dungeons","file":"wizzrobe","basic":[8,10]});
		itemicons.push({"folder":"items","file":"boomerang2"});
		itemicons.push({"folder":"items","file":"mirror","basic":[1,4,5,6,11]});
		itemicons.push({"folder":"items","file":"moonpearl"});
		itemicons.push({"folder":"dungeons","file":"spikefloor","basic":[7,8]});
		itemicons.push({"folder":"items","file":"magic"});
		itemicons.push({"folder":"dungeons","file":"smallchest"});
		itemicons.push({"folder":"dungeons","file":"bigchest","basic":[0,1,2,3,4,5,6,7,8,9,10]});
		itemicons.push({"folder":"dungeons","file":"talltorch","basic":[1,10]});
		itemicons.push({"folder":"dungeons","file":"keysteal"});
		itemicons.push({"folder":"dungeons","file":"map"});
		itemicons.push({"folder":"dungeons","file":"compass"});
		itemicons.push({"folder":"dungeons","file":"hinttile"});
		itemicons.push({"folder":"items","file":"heartcontainer"});
		bosses.push({"folder":"dungeons","file":"boss0"});
		bosses.push({"folder":"dungeons","file":"boss1"});
		bosses.push({"folder":"dungeons","file":"boss2"});
		bosses.push({"folder":"dungeons","file":"boss3"});
		bosses.push({"folder":"dungeons","file":"boss4"});
		bosses.push({"folder":"dungeons","file":"boss5"});
		bosses.push({"folder":"dungeons","file":"boss6"});
		bosses.push({"folder":"dungeons","file":"boss7"});
		bosses.push({"folder":"dungeons","file":"boss8"});
		bosses.push({"folder":"dungeons","file":"boss9"});
		bosses.push({"folder":"dungeons","file":"agahnim0"});
		initializeSymbols(directions,'d');
		initializeSymbols(objects,'o');
		initializeSymbols(switchobjects,'s');
		initializeSymbols(itemicons,'i');
		initializeSymbols(bosses,'b');
	};

	window.initializeSymbols = function(list,key)
	{
		for(let k = 0; k < list.length; k++)
		{
			let id = key+k.toString(36);
			list[k].id = id;
			symbolMap[id] = list[k];
		}
	};
}(window));