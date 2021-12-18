(function(window) {
	'use strict';
	let query = uri_query();
	window.doorshuffle = 'C';
	window.lobbyshuffle = true;
	window.excludesmallkeys = true;
	window.excludebigkeys = true;
	window.owshuffle = 'N';
	window.crossedow = 'N';
	window.similarow = false;
	window.mixedow = false;
	window.fluteshuffle = false;
	window.worldState = 'O';
	window.entranceEnabled = false;

	let outstandingUpdate = false,awaitingNextUpdate = true,awaitingResponse = false,currentDungeon = -1,currentPath = null,clickedPathIndex,currentlyEditing = false,editingIndex,globalHasBranch = false,visibleSidebar = true,welcomeMode = true;
	let ownItems = {},reachableEdges = null,showOverworldModeSection = false,showFullMapMain = true,expandedMainTable = true,showChecklist = false,currentOWPath = null,currentOWScreen = null,fullOverworldMode = null,fullOWFixedEdge = null,fullOWSelectedScreen = null,fullOWSelectedEdge = null,fullOWConnectorStart = null,fullOWConnectorEnd = null,extraOWScreen = null,extraOWDirection = null,fullOWPath = null,hoveredPathNumber = -1,lastUnknownConnectorIndex = -1,useMain = true,backToMain = true;
	let searchResults = new Map(),searchStartRegion = null,searchTargetRegion = null,searchStartScreen = null,searchAddCommonStarts = false,searchSaveQuitFluteEdges = false,searchResultsLength = 0,clickedOverworldPathIndex,clickedOverworldPathListName,clickedOverworldPath = null,clickedConnectorIndex,drawDarkWorldMain = false,drawDarkWorldPopout = false,sideBySideMain = false,sideBySidePopout = false,fullZoomMain = .8,fullZoomPopout = .8,fullZoomAutoMain = true,fullZoomAutoPopout = true,pathZoom = 1,fullPathCompact = true;
	window.dungeonPaths = [];
	window.entranceConnectors = [];
	window.allStartRegions = [];
	window.fixedStartRegions = [];
	window.customStartRegions = [];
	window.fluteSpotRegions = [];
	window.customFluteSpots = [0x30];
	window.pinnedPaths = [];
	window.previousPaths = [];

	const dungeonNamesLong = ["Eastern Palace","Desert Palace","Tower of Hera","Palace of Darkness","Swamp Palace","Skull Woods","Thieves' Town","Ice Palace","Misery Mire","Turtle Rock","Ganon's Tower","Hyrule Castle","Castle Tower"];
	const dungeonNamesShort = ["EP","DP","ToH","PoD","SP","SW","TT","IP","MM","TR","GT","HC","CT"];
	const checkboxFlags = ["globalsync","showmorerooms","splitpath","owsidebaredit","owsidebarnew","owsidebarsearch","itemsync","activeflutebox","connectorsync","pinnedlinkshouse","pinnedsanctuary","pinnedoldman","pinnedpyramid","compactpinned","compactprevious","alwaysfollowmarked","compactsearchresults","mainsidebysideow","sidebysideow","mainzoomautoow","zoomautoow"];
	const fullOWTitle = {"newpath":"Start a new path","continuepath":"Where does this transition lead to?","searchpath":"Select a target screen or preset","searchpathtarget":"Select a new target screen","searchpathstart":"Select a starting screen","editedges":"Full overworld map","editflutespots":"Click on screens to toggle flute spots"};
	const reconnectHelpMessage = "In order to establish a new connection without losing any data, follow these steps:\nSave your data by going to \"Save and restore\" and clicking on \"Save data\".\nClose this window.\nFrom the main tracker window, open a new instance of this window by clicking on the map.\nNear the bottom of the page, click on \"Load manual save\".";

	window.overworldScreens = new Map();
	window.screenLinksGlobal = [];
	window.screenLinksLayout = [];
	window.screenLinksEntrance = [];
	window.entranceIndexToRegion = {};
	window.overworldEdgeToDirection = {};
	window.checkableScreens = new Set();
	window.maybeCheckableScreens = new Set();
	window.continueRegions = new Map();
	window.emptyMap = new Map();
	window.dungeonEntrances = [];
	window.lobbyEntrances = [];
	window.lobbySanctuary = null;
	window.lobbySW = [];
	window.lobbyTT = [];
	window.lobbyHC = [];
	window.dungeonImportant = [];
	window.roomMap = [];
	window.directions = [];
	window.objects = [];
	window.switchobjects = [];
	window.itemicons = [];
	window.bosses = [];
	window.symbolMap = [];

	window.loadOverview = function()
	{
		currentDungeon = -1;
		loadDungeonSummaries();
		updateStatistics();
		if(document.getElementById("pathlist").style.display != "none" || document.getElementById("pathedit").style.display != "none" || document.getElementById("owmain").style.display != "none" || document.getElementById("owpathedit").style.display != "none" || document.getElementById("owsearch").style.display != "none")
			switchScene("overview");
		if(!welcomeMode && document.getElementById("itemsync").checked || document.getElementById("connectorsync").checked || document.getElementById("globalsync").checked)
			testConnection(true);
	};

	window.loadDungeonSummaries = function()
	{
		for(let n = 0; n < 13; n++)
			loadDungeonSummary(n);
	};

	window.loadDungeonSummary = function(n)
	{
		if(dungeonPaths[n].completed)
		{
			document.getElementById("boss"+n).classList.add("completed");
			document.getElementById("summary"+n).innerHTML = "<div class='symbolnode' style='background-image: url("+"./images/dungeons/keychest0.png); left: 16px;'></div>";
			if(visibleSidebar)
				document.getElementById("sidesummary"+n).innerHTML = "<div class='symbolnode' style='background-image: url("+"./images/dungeons/keychest0.png);'></div>";
		}
		else
		{
			document.getElementById("boss"+n).classList.remove("completed");
			let s = "",side = "",items = [];
			for(let path of dungeonPaths[n].paths)
			{
				for(let l = 0; l < path.length-1; l += 2)
				{
					if(path[l] === 'i' || path[l] === 'b')
					{
						let id = path.substring(l,l+2);
						if((excludesmallkeys && id === "i0") || (excludebigkeys && id === "i1"))
							continue;
						if(!items.includes(id))
							items.push(id);
					}
				}
			}
			if(items.length <= 2)
			{
				for(let l = 0; l < items.length; l++)
					s += createSymbolNode(symbolMap[items[l]],l*32,0);
			}
			else
				if(items.length <= 5)
				{
					s += createSymbolNode(symbolMap[items[0]],0,0);
					for(let l = 1; l < 3; l++)
						s += createSymbolNode(symbolMap[items[l]],(l+1)*16,0,true);
					for(let l = 3; l < items.length; l++)
						s += createSymbolNode(symbolMap[items[l]],(l-1)*16,16,true);
				}
				else
				{
					for(let l = 0; l < 4; l++)
						s += createSymbolNode(symbolMap[items[l]],l*16,0,true);
					for(let l = 4; l < Math.min(items.length,8); l++)
						s += createSymbolNode(symbolMap[items[l]],(l-4)*16,16,true);
				}
			document.getElementById("summary"+n).innerHTML = s;
			if(visibleSidebar)
			{
				for(let l = 0; l < Math.min(items.length,2); l++)
					side += createSymbolNode(symbolMap[items[l]],l*16,0,true);
				for(let l = 2; l < Math.min(items.length,4); l++)
					side += createSymbolNode(symbolMap[items[l]],(l-2)*16,16,true);
				document.getElementById("sidesummary"+n).innerHTML = side;
			}
		}
	}

	window.loadDungeon = function(n)
	{
		currentDungeon = n;
		document.getElementById("dungeonicon").className = "boss boss"+n+(dungeonPaths[n].completed ?" completed" :"");
		document.getElementById("dungeonname").innerHTML = dungeonNamesLong[n];
		updateStartRooms();
		document.getElementById("completedbutton").innerHTML = dungeonPaths[n].completed ?"Dungeon not completed" :"Mark dungeon completed";
		if(dungeonPaths[n].completed)
			document.getElementById("completedbutton").classList.remove("pointer");
		else
			document.getElementById("completedbutton").classList.add("pointer");
		updatePathList();
		document.getElementById("dungeonpathsnote").value = dungeonPaths[n].notes;
		document.getElementById("sidebossow").classList.remove("activetab");
		document.getElementById("sidesummaryow").classList.remove("activetab");
		for(let k = 0; k < 13; k++)
			if(k == n)
			{
				document.getElementById("sideboss"+k).classList.add("activetab");
				document.getElementById("sidesummary"+k).classList.add("activetab");
			}
			else
			{
				document.getElementById("sideboss"+k).classList.remove("activetab");
				document.getElementById("sidesummary"+k).classList.remove("activetab");
			}
		if(outstandingUpdate)
			sendUpdate();
		switchScene("pathlist");
	};

	window.sideLoadDungeon = function(n)
	{
		currentPath = null;
		if(currentDungeon != -1)
			saveNotes();
		window.loadDungeon(n);
	};

	window.updateStartRooms = function()
	{
		let starts = createEntranceNodes(false,"startPath");
		document.getElementById("dungeonentrances").innerHTML = starts;
		starts = "";
		if(document.getElementById("showmorerooms").checked)
		{
			for(let k = 0; k < dungeonImportant.length; k++)
				if(doorshuffle === 'C' || dungeonImportant[k].dungeon === currentDungeon)
					starts += createRoomNode(dungeonImportant[k],doorshuffle === 'C',"startPath");
		}
		else
		{
			let items = [];
			for(let path of dungeonPaths[currentDungeon].paths)
			{
				for(let l = 0; l < path.length-1; l += 2)
				{
					if(path[l] === '1')
					{
						let id = path.substring(l,l+2);
						if(!items.includes(id))
							items.push(id);
					}
				}
			}
			items.sort();
			for(let id of items)
			{
				let room = roomMap[id];
				if(doorshuffle === 'C' || room.dungeon === currentDungeon)
					starts += createRoomNode(room,doorshuffle === 'C',"startPath");
			}
		}
		document.getElementById("dungeonimportant").innerHTML = starts;
	};

	window.closeDungeon = function()
	{
		saveNotes();
		loadOverview();
	};

	window.saveNotes = function()
	{
		let notes = document.getElementById("dungeonpathsnote").value;
		if(notes != dungeonPaths[currentDungeon].notes)
		{
			dungeonPaths[currentDungeon].notes = notes;
			sendUpdate();
		}
	};

	window.markCompleted = function()
	{
		if(dungeonPaths[currentDungeon].completed)
		{
			dungeonPaths[currentDungeon].completed = false;
			document.getElementById("dungeonicon").classList.remove("completed");
			document.getElementById("completedbutton").innerHTML = "Mark dungeon completed";
			document.getElementById("completedbutton").classList.add("pointer");
			loadDungeonSummary(currentDungeon);
		}
		else
		{
			dungeonPaths[currentDungeon].completed = true;
			saveNotes();
			loadOverview();
		}
		sendUpdate();
	};

	window.createRoomNode = function(room,showDungeonName = false,clickAction = "startPath",left = null)
	{
		let file,x,y,scale,classes = "roomnode",name;
		if(room.file)
		{
			file = room.file;
			x = y = 0;
			scale = 1;
			classes += " slim";
			name = room.name;
		}
		else
		{
			file = "eg1";
			x = room.supertile%16*128.5+.5;
			y = Math.floor(room.supertile/16)*128.5+.5;
			scale = .5;
			name = showDungeonName ?dungeonNamesShort[room.dungeon]+" "+room.name :room.name;
			switch(room.part)
			{
				case "topleft":
					scale = 1;
					break;
				case "topright":
					scale = 1;
					x += 64;
					break;
				case "bottomleft":
					scale = 1;
					y += 64;
					break;
				case "bottomright":
					scale = 1;
					x += 64;
					y += 64;
					break;
			}
		}
		let onClick = clickAction === "startPath" ?"startPath(\""+room.id+"\")" :(clickAction === "append" ?"appendToPath(\""+room.id+"\"); hideRoomModal()" :"");
		return "<div class='"+classes+"' onclick='"+onClick+"'"+(left ?" style='left: "+left+"px;'" :"")+"><img class='roomnodeimg' src='./images/dungeons/"+file+".png' style='transform: scale("+scale+") translateX(-"+x+"px) translateY(-"+y+"px);'><span class='roomtt'><label class='ttlabel'>"+name+"</label></span></div>";
	};

	window.createSymbolNode = function(symbol,left,top,small = false)
	{
		return "<div class='symbolnode"+(small ?" small" :"")+"' style='background-image: url("+"./images/"+symbol.folder+"/"+symbol.file+".png); left: "+left+"px; top: "+top+"px;"+(symbol.rotate ?" transform: rotate("+symbol.rotate+"deg);" :"")+"'></div>";
	};

	window.drawPath = function(path,markLastBranch = false)
	{
		let s = "",topEdge = 0,bottomEdge = 0,left,lastBranch = -1;
		globalHasBranch = false;
		for(let k = 0; k < path.length; k += 2)
		{
			if(path.length != k+1)
			{
				let id = path.substring(k,k+2);
				switch(id[0])
				{
				case '0'://Entrance room (no Lobby Shuffle)
				case '1'://Important room
				case '2'://Entrance (Lobby Shuffle)
					left = Math.max(topEdge,bottomEdge);
					s += createRoomNode(roomMap[id],doorshuffle === 'C',"nothing",left);
					topEdge = bottomEdge = left+(roomMap[id].file ?32 :64);
					break;
				case 'd'://Direction
					left = topEdge < bottomEdge ?bottomEdge-16 :topEdge;
					s += createSymbolNode(symbolMap[id],left,0);
					lastBranch = left;
					topEdge = left+32;
					break;
				case 'o'://Object or marker that affects routing
				case 's'://Switches and levers
				case 'i'://Item requirement
				case 'b'://Boss
					left = bottomEdge < topEdge ?topEdge-16 :bottomEdge;
					s += createSymbolNode(symbolMap[id],left,32);
					bottomEdge = left+32;
					break;
				default:
					console.log("Error while parsing path "+path);
					return s;
				}
			}
		}
		if(markLastBranch && lastBranch != -1)
		{
			globalHasBranch = true;
			s += "<div class='symbolnode' style='width: 16px; height: 64px; border-left: 2px dashed yellow; opacity: .75; left: "+lastBranch+"px;'></div>";
		}
		return s;
	};

	window.editPath = function()
	{
		editingIndex = clickedPathIndex;
		startPath(dungeonPaths[currentDungeon].paths[clickedPathIndex],true);
		hideClickPathModal();
	};

	window.duplicatePath = function()
	{
		startPath(dungeonPaths[currentDungeon].paths[clickedPathIndex]);
		hideClickPathModal();
	};

	window.forkExistingPath = function()
	{
		let path = dungeonPaths[currentDungeon].paths[clickedPathIndex];
		for(let k = Math.floor(path.length/2)*2; k >= 0; k -= 2)
		{
			if(path[k] == 'd')
			{
				startPath(path.substring(0,k));
				hideClickPathModal();
				return;
			}
		}
	};

	window.moveToTop = function()
	{
		let path = dungeonPaths[currentDungeon].paths[clickedPathIndex];
		dungeonPaths[currentDungeon].paths.splice(clickedPathIndex,1);
		dungeonPaths[currentDungeon].paths.unshift(path);
		updatePathList();
		if(currentPath != null && currentlyEditing)
		{
			if(clickedPathIndex === editingIndex)
				editingIndex = 0;
			else
			{
				if(clickedPathIndex > editingIndex)
					editingIndex++;
			}
			document.getElementById("dungeonpaths2").childNodes[editingIndex].classList.add("editing");
		}
		document.getElementById(currentPath === null ?"dungeonpaths" :"dungeonpaths2").childNodes[0].classList.add("newpath");
		loadDungeonSummary(currentDungeon);
		hideClickPathModal();
		sendUpdate();
	};

	window.moveToBottom = function()
	{
		let path = dungeonPaths[currentDungeon].paths[clickedPathIndex];
		dungeonPaths[currentDungeon].paths.splice(clickedPathIndex,1);
		dungeonPaths[currentDungeon].paths.push(path);
		updatePathList();
		if(currentPath != null && currentlyEditing)
		{
			if(clickedPathIndex === editingIndex)
				editingIndex = dungeonPaths[currentDungeon].paths.length-1;
			else
			{
				if(clickedPathIndex < editingIndex)
					editingIndex--;
			}
			document.getElementById("dungeonpaths2").childNodes[editingIndex].classList.add("editing");
		}
		document.getElementById(currentPath === null ?"dungeonpaths" :"dungeonpaths2").childNodes[dungeonPaths[currentDungeon].paths.length-1].classList.add("newpath");
		loadDungeonSummary(currentDungeon);
		hideClickPathModal();
		sendUpdate();
	};

	window.deletePath = function()
	{
		dungeonPaths[currentDungeon].paths.splice(clickedPathIndex,1);
		hideClickPathModal();
		updatePathList();
		if(currentPath != null && currentlyEditing)
		{
			if(clickedPathIndex === editingIndex)
				closePath();
			else
			{
				if(clickedPathIndex < editingIndex)
					editingIndex--;
				document.getElementById("dungeonpaths2").childNodes[editingIndex].classList.add("editing");
			}
		}
		loadDungeonSummary(currentDungeon);
		sendUpdate();
	};

	window.startPath = function(path,editing=false)
	{
		currentPath = path;
		document.getElementById("currentpathheader").innerHTML = (editing ?"Editing an existing" :"Creating a new")+" path in "+dungeonNamesShort[currentDungeon];
		document.getElementById("currentpath").innerHTML = drawPath(path,true);
		document.getElementById("deletebutton").classList.remove("disabled");
		if(path == "")
			document.getElementById("deletebutton").classList.add("disabled");
		document.getElementById("forkbutton").classList.remove("disabled");
		if(!globalHasBranch)
			document.getElementById("forkbutton").classList.add("disabled");
		currentlyEditing = editing;
		let pathNodes = document.getElementById("dungeonpaths2").childNodes;
		for(let k = 0; k < dungeonPaths[currentDungeon].paths.length; k++)
			if(editing && k == editingIndex)
				pathNodes[k].classList.add("editing");
			else
				pathNodes[k].classList.remove("editing");
		drawAllSymbols();
		switchScene("pathedit");
	};

	window.appendToPath = function(id)
	{
		currentPath += id;
		if((id[0] == '0' || id[0] == '1' || id[0] == '2') && document.getElementById("splitpath").checked)
		{
			let indexNew = currentlyEditing ?editingIndex :0;
			savePath();
			startPath(id);
			document.getElementById("dungeonpaths2").childNodes[indexNew].classList.add("newpath");
		}
		else
		{
			document.getElementById("currentpath").innerHTML = drawPath(currentPath,true);
			document.getElementById("deletebutton").classList.remove("disabled");
			document.getElementById("forkbutton").classList.remove("disabled");
			if(!globalHasBranch)
				document.getElementById("forkbutton").classList.add("disabled");
		}
	};

	window.removeLast = function()
	{
		if(currentPath.length > 1)
		{
			currentPath = currentPath.substring(0,currentPath.length-2);
			document.getElementById("currentpath").innerHTML = drawPath(currentPath,true);
			document.getElementById("deletebutton").classList.remove("disabled");
			if(currentPath == "")
				document.getElementById("deletebutton").classList.add("disabled");
			document.getElementById("forkbutton").classList.remove("disabled");
			if(!globalHasBranch)
				document.getElementById("forkbutton").classList.add("disabled");
		}
	};

	window.closePath = function()
	{
		updateStartRooms();
		for(let path of document.getElementById("dungeonpaths").childNodes)
			path.classList.remove("newpath");
		switchScene("pathlist");
		currentPath = null;
	};

	window.savePath = function()
	{
		if(currentlyEditing)
			dungeonPaths[currentDungeon].paths[editingIndex] = currentPath;
		else
			dungeonPaths[currentDungeon].paths.unshift(currentPath);
		updateStartRooms();
		updatePathList();
		document.getElementById("dungeonpaths").childNodes[currentlyEditing ?editingIndex :0].classList.add("newpath");
		switchScene("pathlist");
		currentPath = null;
		loadDungeonSummary(currentDungeon);
		sendUpdate();
	};

	window.forkPath = function()
	{
		for(let k = Math.floor(currentPath.length/2)*2; k >= 0; k -= 2)
		{
			if(currentPath[k] == 'd')
			{
				dungeonPaths[currentDungeon].paths.unshift(currentPath);
				updatePathList();
				document.getElementById("dungeonpaths2").childNodes[0].classList.add("newpath");
				if(currentlyEditing)
				{
					editingIndex++;
					document.getElementById("dungeonpaths2").childNodes[editingIndex].classList.add("editing");
				}
				currentPath = currentPath.substring(0,k);
				document.getElementById("currentpath").innerHTML = drawPath(currentPath,true);
				document.getElementById("deletebutton").classList.remove("disabled");
				if(currentPath == "")
					document.getElementById("deletebutton").classList.add("disabled");
				document.getElementById("forkbutton").classList.remove("disabled");
				if(!globalHasBranch)
					document.getElementById("forkbutton").classList.add("disabled");
				loadDungeonSummary(currentDungeon);
				sendUpdate();
				return;
			}
		}
	};

	window.updateStatistics = function()
	{
		let dungeonPathCount = 0,pathCount = 0,nodeCount = 0,noteCount = 0;
		for(let k = 0; k < 13; k++)
		{
			if(dungeonPaths[k].paths.length != 0)
			{
				dungeonPathCount++;
				pathCount += dungeonPaths[k].paths.length;
				for(let l = 0; l < dungeonPaths[k].paths.length; l++)
					nodeCount += Math.floor(dungeonPaths[k].paths[l].length/2);
			}
			if(dungeonPaths[k].notes.length != 0)
				noteCount++;
		}
		document.getElementById("totalpathdungeons").innerHTML = "Dungeons with paths: "+dungeonPathCount;
		document.getElementById("totalpaths").innerHTML = "Total paths: "+pathCount;
		document.getElementById("totalnodes").innerHTML = "Total nodes in paths: "+nodeCount;
		document.getElementById("totalnotes").innerHTML = "Dungeons with notes: "+noteCount;
	};

	window.updatePathList = function()
	{
		document.getElementById("dungeonpathsheader").innerHTML = "Your paths ("+dungeonPaths[currentDungeon].paths.length+")";
		document.getElementById("dungeonpaths2header").innerHTML = "Existing paths ("+dungeonPaths[currentDungeon].paths.length+")";
		let s = "";
		for(let k = 0; k < dungeonPaths[currentDungeon].paths.length; k++)
			s += '<div class="row path" style="margin: 2px 0px;" onclick="showClickPathModal(event,'+k+')">'+drawPath(dungeonPaths[currentDungeon].paths[k],false)+'</div>';
		document.getElementById("dungeonpaths").innerHTML = s;
		document.getElementById("dungeonpaths2").innerHTML = s;
	};

	window.drawAllSymbols = function()
	{
		drawSymbols(directions,"directionicons",'d');
		drawSymbols(objects,"objecticons",'o');
		drawSymbols(switchobjects,"switchicons",'s');
		drawSymbols(itemicons,"itemicons",'i');
		drawSymbols(bosses,"bossicons",'b');
	};

	window.drawSymbols = function(list,elementID,key)
	{
		let s = "";
		for(let k = 0; k < list.length; k++)
		{
			if(doorshuffle !== 'C' && list[k].basic && !list[k].basic.includes(currentDungeon))
				continue;
			let id = list[k].id;
			let style = "background-image: url("+"./images/"+list[k].folder+"/"+list[k].file+".png);"
			if(list[k].rotate)
				style += " transform: rotate("+list[k].rotate+"deg);";
			if(key === 'd')
				style += " position: absolute; left: "+list[k].x+"px; top: "+list[k].y+"px;";
			s += "<div class='pathsymbol' style='"+style+"' onclick='appendToPath(\""+id+"\")'></div>";
		}
		document.getElementById(elementID).innerHTML = s;
	};

	window.switchScene = function(scene)
	{
		document.getElementById("overview").style.display = scene === "overview" ?"block" :"none";
		document.getElementById("pathlist").style.display = scene === "pathlist" ?"block" :"none";
		document.getElementById("pathedit").style.display = scene === "pathedit" ?"block" :"none";
		document.getElementById("owmain").style.display = scene === "owmain" ?"block" :"none";
		document.getElementById("owpathedit").style.display = scene === "owpathedit" ?"block" :"none";
		document.getElementById("owsearch").style.display = scene === "owsearch" ?"block" :"none";
		scrollTo(0,0);
		if(scene === "overview")
		{
			document.getElementById("homebutton").classList.add("activetab");
			document.getElementById("sidebossow").classList.remove("activetab");
			document.getElementById("sidesummaryow").classList.remove("activetab");
			for(let k = 0; k < 13; k++)
			{
				document.getElementById("sideboss"+k).classList.remove("activetab");
				document.getElementById("sidesummary"+k).classList.remove("activetab");
			}
		}
		else
			document.getElementById("homebutton").classList.remove("activetab");
	};

	window.sendUpdate = function()
	{
		if(!welcomeMode)
		{
			outstandingUpdate = false;
			let data = allData();
			try
			{
				saveAuto(data);
			}
			catch(error)
			{
			}
			if(window.opener && !window.opener.closed)
				window.opener.postMessage(data,"*");
		}
	};

	window.home = function()
	{
		currentPath = currentOWPath = null;
		if(currentDungeon != -1)
		{
			saveNotes();
			currentDungeon = -1;
		}
		if(outstandingUpdate)
			sendUpdate();
		loadOverview();
	};

	window.showSidebar = function()
	{
		visibleSidebar = true;
		loadDungeonSummaries();
		document.getElementById("app").classList.add("showsidebar");
		resizeHandler();
	};

	window.hideSidebar = function()
	{
		document.getElementById("app").classList.remove("showsidebar");
		visibleSidebar = false;
		resizeHandler();
	};

	window.showClickPathModal = function(event,index)
	{
		clickedPathIndex = index;
		document.getElementById("currentclickedpath").innerHTML = drawPath(dungeonPaths[currentDungeon].paths[index],true);
		document.getElementById("clickPathModalMain").style.left = (visibleSidebar ?"64" :"4")+"px";
		document.getElementById("clickPathModalMain").style.top = Math.min(event.clientY-20,window.innerHeight-64-48)+"px";
		document.getElementById("forkbutton2").classList.remove("disabled");
		if(!globalHasBranch)
			document.getElementById("forkbutton2").classList.add("disabled");
		document.getElementById("clickPathModal").style.display = "block";
	};

	window.hideClickPathModal = function()
	{
		document.getElementById("clickPathModal").style.display = "none";
	};

	window.showHintModal = function()
	{
		document.getElementById("hintModal").style.display = "block";
	};

	window.hideHintModal = function()
	{
		document.getElementById("hintModal").style.display = "none";
	};

	window.createEntranceNodes = function(showDungeonName,clickAction)
	{
		let starts = "";
		if(lobbyshuffle)
		{
			switch(currentDungeon)
			{
				case 5:
					for(let k = 1; k < lobbyEntrances.length; k++)
						starts += createRoomNode(lobbyEntrances[k],showDungeonName,clickAction);
					for(let k = 0; k < lobbySW.length; k++)
						starts += createRoomNode(lobbySW[k],showDungeonName,clickAction);
					break;
				case 6:
					starts += createRoomNode(lobbyEntrances[0],showDungeonName,clickAction);
					for(let k = 0; k < lobbyTT.length; k++)
						starts += createRoomNode(lobbyTT[k],showDungeonName,clickAction);
					break;
				case 11:
					for(let k = 1; k < lobbyEntrances.length; k++)
						starts += createRoomNode(lobbyEntrances[k],showDungeonName,clickAction);
					for(let k = 0; k < lobbyHC.length; k++)
						starts += createRoomNode(lobbyHC[k],showDungeonName,clickAction);
					break;
				case 1:
				case 9:
					for(let k = 1; k < lobbyEntrances.length; k++)
						starts += createRoomNode(lobbyEntrances[k],showDungeonName,clickAction);
					break;
				default:
					starts += createRoomNode(lobbyEntrances[0],showDungeonName,clickAction);
			}
			if((doorshuffle !== 'C' || worldState !== 'I') && (currentDungeon === 11 || (doorshuffle === 'C' && worldState !== 'S')))
				starts += createRoomNode(lobbySanctuary,showDungeonName,clickAction);
		}
		else
		{
			for(let k = 0; k < dungeonEntrances.length; k++)
				if(dungeonEntrances[k].dungeon === currentDungeon)
					starts += createRoomNode(dungeonEntrances[k],showDungeonName,clickAction);
		}
		return starts;
	};

	window.showRoomModal = function()
	{
		let starts = createEntranceNodes(doorshuffle === 'C',"append");
		document.getElementById("dungeonentrancesmodal").innerHTML = starts;
		starts = "";
		for(let k = 0; k < dungeonImportant.length; k++)
			if(doorshuffle === 'C' || dungeonImportant[k].dungeon === currentDungeon)
				starts += createRoomNode(dungeonImportant[k],doorshuffle === 'C',"append");
		document.getElementById("dungeonimportantmodal").innerHTML = starts;
		document.getElementById("roomModal").style.display = "block";
	};

	window.hideRoomModal = function()
	{
		document.getElementById("roomModal").style.display = "none";
	};

	window.updateDoorShuffle = function()
	{
		doorshuffle = document.getElementById("selectdoorshuffle").value[0];
		lobbyshuffle = document.getElementById("lobbyshuffle").checked;
		updateOverviewElements();
		sendUpdate();
	};

	window.updateKeys = function()
	{
		excludesmallkeys = document.getElementById("excludesmallkeys").checked;
		excludebigkeys = document.getElementById("excludebigkeys").checked;
		loadDungeonSummaries();
	};

	window.updateOverworldShuffle = function(showVanillaOWBox)
	{
		owshuffle = document.getElementById("selectowshuffle").value[0];
		crossedow = document.getElementById("crossedow").value[0];
		similarow = document.getElementById("similarow").checked;
		mixedow = document.getElementById("mixedow").checked;
		fluteshuffle = document.getElementById("fluteshuffle").checked;
		worldState = document.getElementById("selectworldstate").value[0];
		entranceEnabled = document.getElementById("entranceenabled").checked;
		if(owshuffle === 'N' && crossedow === 'N' && !mixedow)
			document.getElementById("overworldoptionsfinalbox").style.display = "none";
		else
			if(showVanillaOWBox)
				document.getElementById("overworldoptionsfinalbox").style.display = "block";
		document.getElementById("vanillawelcome").style.display = owshuffle === 'N' && crossedow !== 'C' ?"none" :"block";
		updateOverviewElements();
		sendUpdate();
		updateReachableEdges();
	};

	window.updateSidebarElements = function()
	{
		document.getElementById("sidebaredit").style.display = document.getElementById("owsidebaredit").checked ?"block" :"none";
		document.getElementById("sidebarnew").style.display = owshuffle !== 'N' && document.getElementById("owsidebarnew").checked ?"block" :"none";
		document.getElementById("sidebarsearch").style.display = document.getElementById("owsidebarsearch").checked ?"block" :"none";
	};

	window.updateOverviewElements = function()
	{
		let noOverworld = owshuffle === 'N' && crossedow === 'N' && !mixedow && !fluteshuffle && !document.getElementById("globalsync").checked;
		document.getElementById("overviewtitle").innerHTML = doorshuffle === 'N' ?(noOverworld ?"Please select a mode" :"Overworld Tracker") :(noOverworld ?"Dungeon Tracker" :"Overworld and Dungeon Tracker");
		document.getElementById("overviewoverworld").style.display = noOverworld ?"none" :"block";
		document.getElementById("overviewownewpath").style.display = owshuffle === 'N' ?"none" :"block";
		document.getElementById("overviewdungeons").style.display = doorshuffle === 'N' ?"none" :"block";
		document.getElementById("dungeonoptions").style.display = doorshuffle === 'N' ?"none" :"block";
		document.getElementById("dungeonstats").style.display = doorshuffle === 'N' ?"none" :"block";
		document.getElementById("sidebaroverworld").style.display = noOverworld ?"none" :"block";
		document.getElementById("sidebardungeons").style.display = doorshuffle === 'N' ?"none" :"block";
		updateSidebarElements();
	};

	window.hideFinalBox = function()
	{
		document.getElementById("overworldoptionsfinalbox").style.display = "none";
	};

	window.testConnection = function(send)
	{
		awaitingResponse = true;
		if(send && window.opener && !window.opener.closed)
			window.opener.postMessage("PING","*");
		setTimeout(checkIfResponded,50);
	};

	window.checkIfResponded = function()
	{
		if(awaitingResponse && window.opener && !welcomeMode && (document.getElementById("itemsync").checked || document.getElementById("connectorsync").checked || document.getElementById("globalsync").checked))
		{
			document.getElementById("overworldsyncerror").style.display = "block";
		}
		else
			document.getElementById("overworldsyncerror").style.display = "none";
	};

	window.updateGlobalSync = function()
	{
		if(document.getElementById("globalsync").checked)
		{
			document.getElementById("itemsync").disabled = document.getElementById("connectorsync").disabled = true;
			document.getElementById("selectworldstate").disabled = document.getElementById("entranceenabled").disabled = true;
			awaitingNextUpdate = true;
			testConnection(false);
			if(window.opener && !window.opener.closed)
				window.opener.postMessage("ITEMS","*");
			updateConnectorList();
		}
		else
		{
			document.getElementById("itemsync").disabled = document.getElementById("connectorsync").disabled = false;
			document.getElementById("selectworldstate").disabled = document.getElementById("entranceenabled").disabled = false;
			awaitingNextUpdate = true;
			if(!document.getElementById("itemsync").checked && !document.getElementById("connectorsync").checked && !document.getElementById("globalsync").checked)
				document.getElementById("overworldsyncerror").style.display = "none";
			if(window.opener && !window.opener.closed)
				window.opener.postMessage("RESETLOGIC","*");
		}
		updateOverviewElements();
		sendUpdate();
	};

	window.updateItemSync = function()
	{
		if((document.getElementById("itemsync").checked || document.getElementById("globalsync").checked) && window.opener && !window.opener.closed)
		{
			testConnection(false);
			window.opener.postMessage("ITEMS","*");
		}
		if(!document.getElementById("itemsync").checked && !document.getElementById("connectorsync").checked && !document.getElementById("globalsync").checked)
			document.getElementById("overworldsyncerror").style.display = "none";
	};

	window.updateConnectorSync = function()
	{
		if((document.getElementById("connectorsync").checked || document.getElementById("globalsync").checked) && window.opener && !window.opener.closed)
		{
			testConnection(false);
			window.opener.postMessage("ITEMS","*");
		}
		if(!document.getElementById("itemsync").checked && !document.getElementById("connectorsync").checked && !document.getElementById("globalsync").checked)
			document.getElementById("overworldsyncerror").style.display = "none";
		updateConnectorList();
		if(showFullMapMain && document.getElementById("owmain").style.display === "block")
			loadFullOverworldMain();
	};

	window.showGlobalSyncInfo = function()
	{
		let s = "If this is enabled, the main tracker window logic takes Overworld Shuffle and everything tracked in this window into account.\n";
		s += "This only works if the full item tracker in the main window is used. The main window must also be in Overworld Shuffle mode. With Entrance Shuffle, connector caves also have to be set through the map tracker in the main window.\n";
		s += "Also, this window must have been opened from the main tracker window and the main tracker window cannot be reloaded or closed. If a new connection between this window and the main tracker window needs to be established, check out the instructions for information on how to keep your tracking progress.\n";
		s += "Before you start, make sure all mode settings are correctly set in the main tracker window and some form of Overworld Shuffle is enabled (otherwise you may have to go back to the tracker launcher). Only overworld-specific settings are still handled through this window.\n\n";
		s += "Current status: ";
		if(window.opener)
			if(window.opener.closed || awaitingResponse)
				s += "Disconnected from main tracker window, please save your progress, close this tracker window and then open it again from the main tracker window.";
			else
				s += "Connected to main tracker window, sync possible.";
		else
			s += "Not opened from main tracker window, please close this tracker window and open it from the main tracker window obtained through the Community Tracker launcher.";
		alert(s);
	};

	window.showSyncErrorInfo = function()
	{
		alert(reconnectHelpMessage);
	};

	window.receiveItemUpdate = function(newItems)
	{
		let changed = awaitingNextUpdate;
		awaitingNextUpdate = false;
		if(document.getElementById("globalsync").checked)
		{
			if(newItems.flags && newItems.flags.hasOwnProperty("gametype"))
			{
				let newState = newItems.flags.gametype;
				if(newState != worldState && (newState === 'S' || newState === 'O' || newState === 'I' || newState === 'R'))
				{
					worldState = newState;
					document.getElementById("selectworldstate").value = ""+worldState;
					if(owshuffle !== 'N' || crossedow !== 'N' || mixedow)
						document.getElementById("overworldoptionsfinalbox").style.display = "block";
					hideFullOverworldModal();
					if(document.getElementById("owmain").style.display === "block")
						loadOverworld();
					changed = true;
				}
			}
			if(newItems.flags && newItems.flags.hasOwnProperty("entrancemode"))
			{
				let newState = newItems.flags.entrancemode;
				if((newState === 'S') != entranceEnabled && (newState === 'N' || newState === 'S'))
				{
					entranceEnabled = newState === 'S';
					document.getElementById("entranceenabled").checked = entranceEnabled;
					if(owshuffle !== 'N' || crossedow !== 'N' || mixedow)
						document.getElementById("overworldoptionsfinalbox").style.display = "block";
					hideFullOverworldModal();
					if(document.getElementById("owmain").style.display === "block")
						loadOverworld();
					changed = true;
				}
			}
		}
		if(document.getElementById("itemsync").checked || document.getElementById("globalsync").checked)
		{
			for(let item of ["moonpearl","hammer","hookshot","flippers","mirror","flute","boots","book","lantern","agahnim"])
			{
				let newItem = !!newItems[item];
				if(ownItems[item] !== newItem)
				{
					ownItems[item] = newItem;
					changed = true;
				}
			}
			if(!newItems.glove)
			{
				if(ownItems.gloves || ownItems.mitts)
				{
					ownItems.gloves = ownItems.mitts = false;
					changed = true;
				}
			}
			else
				if(newItems.glove === 1)
				{
					if(!ownItems.gloves || ownItems.mitts)
					{
						ownItems.gloves = true;
						ownItems.mitts = false;
						changed = true;
					}
				}
				else
					if(!ownItems.gloves || !ownItems.mitts)
					{
						ownItems.gloves = ownItems.mitts = true;
						changed = true;
					}
			for(let item of Object.keys(newItems))
				if(!["moonpearl","hammer","hookshot","flippers","mirror","flute","boots","book","lantern","agahnim"].includes(item))
				{
					if(ownItems[item] != newItems[item])
					{
						ownItems[item] = newItems[item];
						changed = true;
					}
				}
		}
		if(document.getElementById("connectorsync").checked || document.getElementById("globalsync").checked)
		{
			let keepConnectors = new Set(),createConnectors = [];
			for(let k = 0; k < newItems.connectorOne.length; k++)
			{
				let id = newItems.connectorOne[k]+"|"+newItems.connectorTwo[k],createNew = true;
				for(let l = 0; l < entranceConnectors.length; l++)
				{
					if(entranceConnectors[l].id === id)
					{
						keepConnectors.add(entranceConnectors[l]);
						createNew = false;
						break;
					}
				}
				if(createNew)
				{
					createConnectors.push([newItems.connectorOne[k],newItems.connectorTwo[k],id]);
					changed = true;
				}
			}
			let deleted = false;
			for(let connector of entranceConnectors)
				if(!keepConnectors.has(connector))
				{
					deleted = changed = true;
				}
			if(deleted)
			{
				clearEntranceConnectors();
				for(let c of keepConnectors)
				{
					let [screenID1,regionName1,screenID2,regionName2] = c.data;
					createEntranceConnector(overworldScreens.get(screenID1).regions.get(regionName1),overworldScreens.get(screenID2).regions.get(regionName2),c.status,c.id);
				}
			}
			for(let c of createConnectors)
				createEntranceConnector(getEntranceRegionFromIndex(c[0]),getEntranceRegionFromIndex(c[1]),"unknown",c[2]);
		}
		if(changed)
		{
			outstandingUpdate = true;
			updateReachableEdges();
			updateItemTracker();
			updateConnectorList();
			drawFullOverworldPanels();
		}
	};

	window.keyDown = function(event)
	{
		if((event.target.tagName != "INPUT" || event.target.type != "text") && [32,33,34,35,36,38,40].indexOf(event.keyCode) != -1)
			event.preventDefault();
	};

	window.receiveMessage = function(event)
	{
		if(window.origin === event.origin)
		{
			if(awaitingResponse)
			{
				awaitingResponse = false;
				document.getElementById("overworldsyncerror").style.display = "none";
			}
			if(event.data === "MYSTERYRELOAD")
			{
				if(document.getElementById("itemsync").checked || document.getElementById("connectorsync").checked || document.getElementById("globalsync").checked)
				{
					testConnection(true);
					alert("The main tracker window has been refreshed and disconnected from this window as a consequence of changing certain mode settings.\n\n"+reconnectHelpMessage);
				}
			}
			else
				if(event.data.dungeonPaths && event.data.dungeonPaths.length === 13)
				{
					if(loadAll(event.data))
					{
						loadOverview();
						if(document.getElementById("itemsync").checked || document.getElementById("connectorsync").checked || document.getElementById("globalsync").checked)
							window.opener.postMessage("ITEMS","*");
					}
					else
						console.log("Error while loading data from main tracker");
				}
				else
					if(!isNaN(event.data.tunic))
						receiveItemUpdate(event.data);
		}
	};

	window.allData = function()
	{
		let all = {};
		all.dungeonPaths = dungeonPaths;
		all.overworldTransitions = [];
		all.mixedStates = [];
		for(let [id,screen] of overworldScreens)
		{
			for(let [edgeString,edge] of screen.edges)
				if(edge.out)
					all.overworldTransitions.push([id,edgeString,edge.out.screen.id,edge.out.string]);
			if(id < 0x40 || id >= 0x80)
				all.mixedStates.push([id,screen.mixedState]);
		}
		all.items = ownItems;
		all.entranceConnectors = entranceConnectors;
		all.overworldNotes = document.getElementById("owpathsnote").value;
		all.customStartRegions = [];
		for(let region of customStartRegions)
			all.customStartRegions.push([region.screen.id,region.name]);
		all.customFluteSpots = customFluteSpots;
		all.pinnedPaths = pinnedPaths;
		all.previousPaths = previousPaths;
		all.doorshuffle = doorshuffle;
		all.lobbyshuffle = lobbyshuffle;
		all.excludesmallkeys = excludesmallkeys;
		all.excludebigkeys = excludebigkeys;
		all.owshuffle = owshuffle;
		all.crossedow = crossedow;
		all.similarow = similarow;
		all.mixedow = mixedow;
		all.fluteshuffle = fluteshuffle;
		all.worldState = worldState;
		all.entranceEnabled = entranceEnabled;
		for(let checkboxFlag of checkboxFlags)
			all[checkboxFlag] = document.getElementById(checkboxFlag).checked;
		all.visibleSidebar = visibleSidebar;
		all.showOverworldModeSection = showOverworldModeSection;
		all.showFullMapMain = showFullMapMain;
		all.expandedMainTable = expandedMainTable;
		all.showChecklist = showChecklist;
		all.sideBySideMain = sideBySideMain;
		all.sideBySidePopout = sideBySidePopout;
		all.fullZoomMain = fullZoomMain;
		all.fullZoomPopout = fullZoomPopout;
		all.pathZoom = pathZoom;
		all.fullPathCompact = fullPathCompact;
		all.showOptionsFinalBox = document.getElementById("overworldoptionsfinalbox").style.display === "block";
		all.timeString = new Date().toLocaleString();
		return all;
	};

	window.loadAll = function(newData)
	{
		if(!newData)
			return false;
		let newDungeonPaths = newData.dungeonPaths;
		for(let k = 0; k < 13; k++)
			if(!(k in newDungeonPaths) || !Array.isArray(newDungeonPaths[k].paths) || !(typeof newDungeonPaths[k].notes === "string" || newDungeonPaths[k].notes instanceof String))
				return false;
		dungeonPaths = newDungeonPaths;
		doorshuffle = newData.doorshuffle;
		if(doorshuffle !== 'N' && doorshuffle !== 'B' && doorshuffle !== 'C')
			doorshuffle = 'C';
		lobbyshuffle = newData.lobbyshuffle;
		excludesmallkeys = newData.excludesmallkeys;
		excludebigkeys = newData.excludebigkeys;
		owshuffle = newData.owshuffle;
		if(owshuffle !== 'N' && owshuffle !== 'P' && owshuffle !== 'F')
			owshuffle = 'N';
		clearOverworldTransitions();
		try
		{
			let overworldTransitions = newData.overworldTransitions;
			if(overworldTransitions)
				for(let [screenID1,edgeID1,screenID2,edgeID2] of overworldTransitions)
					connectEdgesByKeys(screenID1,edgeID1,screenID2,edgeID2,true);
		}
		catch(error)
		{
			console.log(error);
		}
		clearMixedStates();
		try
		{
			let mixedStates = newData.mixedStates;
			if(mixedStates)
				for(let [id,state] of mixedStates)
				{
					if(["unknown","normal","swapped"].includes(""+state))
					{
						let screen = overworldScreens.get(id);
						screen.mixedState = ""+state;
						if(screen.parallel)
							screen.parallel.mixedState = ""+state;
						else
							if(id === 0x80 || id === 0x82)
								overworldScreens.get(0x102-id).mixedState = ""+state;
					}
				}
		}
		catch(error)
		{
			console.log(error);
		}
		clearEntranceConnectors();
		try
		{
			for(let connector of newData.entranceConnectors)
			{
				let [screenID1,regionName1,screenID2,regionName2] = connector.data;
				createEntranceConnector(overworldScreens.get(screenID1).regions.get(regionName1),overworldScreens.get(screenID2).regions.get(regionName2),connector.status,connector.id);
			}
		}
		catch(error)
		{
			console.log(error);
		}
		customStartRegions = [];
		try
		{
			for(let regionData of newData.customStartRegions)
				customStartRegions.push(overworldScreens.get(regionData[0]).regions.get(regionData[1]));
		}
		catch(error)
		{
			console.log(error);
		}
		ownItems = newData.items;
		if(!ownItems || typeof ownItems !== 'object')
			ownItems = {};
		let newOWNotes = newData.overworldNotes;
		document.getElementById("owpathsnote").value = typeof newOWNotes === "string" || newOWNotes instanceof String ?newOWNotes :"";
		customFluteSpots = [];
		try
		{
			if(newData.customFluteSpots)
				for(let id of newData.customFluteSpots)
					if(Number.isInteger(id) && id >= 0x00 && id < 0x80 && overworldScreens.has(id))
						customFluteSpots.push(id%0x40);
			else
				customFluteSpots = [0x30];
		}
		catch(error)
		{
			console.log(error);
		}
		customFluteSpots.sort((a,b)=>a-b);
		pinnedPaths = newData.pinnedPaths;
		previousPaths = newData.previousPaths;
		crossedow = newData.crossedow;
		if(crossedow === false)
			crossedow = 'N';
		if(crossedow === true)
			crossedow = 'C';
		if(crossedow !== 'N' && crossedow !== 'P' && crossedow !== 'C')
			crossedow = 'N';
		similarow = newData.similarow;
		mixedow = newData.mixedow;
		fluteshuffle = newData.fluteshuffle;
		document.getElementById("selectdoorshuffle").value = ""+doorshuffle;
		document.getElementById("lobbyshuffle").checked = lobbyshuffle;
		document.getElementById("excludesmallkeys").checked = excludesmallkeys;
		document.getElementById("excludebigkeys").checked = excludebigkeys;
		document.getElementById("selectowshuffle").value = ""+owshuffle;
		document.getElementById("crossedow").value = ""+crossedow;
		document.getElementById("similarow").checked = similarow;
		document.getElementById("mixedow").checked = mixedow;
		document.getElementById("fluteshuffle").checked = fluteshuffle;
		for(let checkboxFlag of checkboxFlags)
			document.getElementById(checkboxFlag).checked = newData[checkboxFlag];
		if(showOverworldModeSection !== newData.showOverworldModeSection)
			toggleOverworldModeSection();
		showFullMapMain = newData.showFullMapMain;
		document.getElementById("togglefullowmain").className = showFullMapMain ?"cell buttonsquare collapsesection" :"cell buttonsquare expandsection";
		document.getElementById("fullowmainpage").style.display = showFullMapMain ?"block" :"none";
		expandedMainTable = newData.expandedMainTable;
		document.getElementById("toggleowmaintable").className = expandedMainTable ?"cell buttonsquare collapsesection" :"cell buttonsquare expandsection";
		document.getElementById("owmaintable").style.display = expandedMainTable ?"block" :"none";
		document.getElementById("owmaintablemini").style.display = expandedMainTable ?"none" :"block";
		showChecklist = newData.showChecklist;
		document.getElementById("togglechecklist").className = showChecklist ?"cell buttonsquare collapsesection" :"cell buttonsquare expandsection";
		document.getElementById("checklist").style.display = showChecklist ?"block" :"none";
		sideBySideMain = document.getElementById("mainsidebysideow").checked;
		sideBySidePopout = document.getElementById("sidebysideow").checked;
		fullZoomAutoMain = document.getElementById("mainzoomautoow").checked;
		fullZoomAutoPopout = document.getElementById("zoomautoow").checked;
		fullZoomMain = newData.fullZoomMain ?Math.max(.5,Math.min(newData.fullZoomMain,1.5)) :.8;
		fullZoomPopout = newData.fullZoomPopout ?Math.max(.5,Math.min(newData.fullZoomPopout,1.5)) :.8;
		pathZoom = newData.pathZoom ?Math.max(.5,Math.min(newData.pathZoom,2)) :1;
		fullPathCompact = newData.fullPathCompact;
		document.getElementById("overworldoptionsfinalbox").style.display = newData.showOptionsFinalBox && (owshuffle !== 'N' || crossedow !== 'N' || mixedow) ?"block" :"none";
		if(document.getElementById("globalsync").checked)
		{
			document.getElementById("itemsync").disabled = document.getElementById("connectorsync").disabled = document.getElementById("selectworldstate").disabled = document.getElementById("entranceenabled").disabled = true;
		}
		else
		{
			document.getElementById("itemsync").disabled = document.getElementById("connectorsync").disabled = document.getElementById("selectworldstate").disabled = document.getElementById("entranceenabled").disabled = false;
			worldState = newData.worldState;
			if(worldState !== 'S' && worldState !== 'O' && worldState !== 'I' && worldState !== 'R')
				worldState = 'O';
			entranceEnabled = newData.entranceEnabled;
			document.getElementById("selectworldstate").value = ""+worldState;
			document.getElementById("entranceenabled").checked = entranceEnabled;
		}
		if(!document.getElementById("itemsync").checked && !document.getElementById("connectorsync").checked && !document.getElementById("globalsync").checked)
			document.getElementById("overworldsyncerror").style.display = "none";
		awaitingNextUpdate = true;
		setWelcomeMode(false);
		newData.visibleSidebar ?showSidebar() :hideSidebar();
		updateOverviewElements();
		updateReachableEdges();
		updateItemTracker();
		updateConnectorList();
		updateStartRegionList();
		updateMainPathLists();
		applyFullOverworldZoomMain();
		applyFullOverworldZoomPopout();
		applyOverworldPathZoom();
		return true;
	};

	window.loadManual = function()
	{
		let data = JSON.parse(localStorage.getItem("dungeonData"));
		let extra = welcomeMode ?"" :"\nThis will replace all currently set dungeon paths, overworld transitions and notes.";
		if(data && confirm("Load saved data from local storage?"+extra+"\n\nSaved at: "+data.timeString))
			if(loadAll(data))
				loadOverview();
			else
				console.log("Error while loading data from manual save");
	};

	window.saveManual = function(button)
	{
		localStorage.setItem("dungeonData",JSON.stringify(allData()));
		document.getElementById("loadmanual").classList.remove("disabled");
		buttonFlash(button);
	};

	window.loadAuto = function()
	{
		let data = JSON.parse(localStorage.getItem("dungeonDataAutoSave"));
		let extra = welcomeMode ?"" :"\nThis will replace all currently set dungeon paths, overworld transitions and notes.";
		if(data && confirm("Load auto-save data from local storage?"+extra+"\n\nSaved at: "+data.timeString))
			if(loadAll(data))
				loadOverview();
			else
				console.log("Error while loading data from auto-save");
	};

	window.saveAuto = function(data)
	{
		localStorage.setItem("dungeonDataAutoSave",JSON.stringify(data));
		document.getElementById("loadauto").classList.remove("disabled");
	};

	window.clearData = function()
	{
		if(confirm("Delete all currently loaded paths and notes for every dungeon and the overworld?"))
		{
			dungeonPaths = [];
			for(let k = 0; k < 13; k++)
				dungeonPaths[k] = {"paths":[],"notes":"","completed":false};
			clearOverworldTransitions();
			clearMixedStates();
			ownItems = {};
			document.getElementById("activeflutebox").checked = false;
			clearEntranceConnectors();
			document.getElementById("owpathsnote").value = "";
			customStartRegions = [];
			customFluteSpots = [0x30];
			pinnedPaths = [];
			previousPaths = [];
			document.getElementById("overworldoptionsfinalbox").style.display = owshuffle !== 'N' || crossedow !== 'N' || mixedow ?"block" :"none";
			updateOverviewElements();
			updateReachableEdges();
			updateItemTracker();
			updateConnectorList();
			updateStartRegionList();
			updateMainPathLists();
			loadOverview();
		}
	};

	window.clearLocalStorage = function()
	{
		if(confirm("Delete everything saved in local storage, both manual and auto-save?"))
		{
			localStorage.clear();
			document.getElementById("loadmanual").classList.add("disabled");
			document.getElementById("loadauto").classList.add("disabled");
		}
	};

	window.setWelcomeMode = function(enable)
	{
		welcomeMode = enable;
		if(enable)
			document.getElementById("app").classList.add("welcomemode");
		else
			document.getElementById("app").classList.remove("welcomemode");
	};

	window.welcomeStart = function(modeFinal)
	{
		setWelcomeMode(false);
		if(document.getElementById("vanillawhirlpoolswelcome").checked)
			vanillaWhirlpools(null);
		if(document.getElementById("vanillaspecialwelcome").checked)
			vanillaSpecialScreens(null);
		if(document.getElementById("globalsync").checked)
			testConnection(true);
		if(modeFinal)
			vanillaTransitionsMode(null);
		else
		{
			sendUpdate();
			updateReachableEdges();
		}
	};

	window.welcomeStartMystery = function()
	{
		document.getElementById("selectdoorshuffle").value = 'C';
		document.getElementById("lobbyshuffle").checked = true;
		document.getElementById("excludesmallkeys").checked = false;
		document.getElementById("excludebigkeys").checked = false;
		document.getElementById("selectowshuffle").value = 'F';
		document.getElementById("crossedow").value = 'C';
		document.getElementById("similarow").checked = false;
		document.getElementById("mixedow").checked = true;
		document.getElementById("fluteshuffle").checked = true;
		welcomeStart(false);
		updateDoorShuffle();
		updateKeys();
		updateOverworldShuffle(true);
	};

	window.start = function()
	{
		dungeonPaths = [];
		for(let k = 0; k < 13; k++)
			dungeonPaths[k] = {"paths":[],"notes":"","completed":false};
		if(query.door_shuffle)
			doorshuffle = query.door_shuffle[0];
		if(doorshuffle !== 'N' && doorshuffle !== 'B' && doorshuffle !== 'C')
			doorshuffle = 'C';
		if(query.overworld_shuffle)
			owshuffle = query.overworld_shuffle[0];
		if(owshuffle !== 'N' && owshuffle !== 'P' && owshuffle !== 'F')
			owshuffle = 'N';
        if((query.wild_keys+'').toLowerCase() === 'true' || query.world_state === 'R' || query.world_state === 'r')
            excludesmallkeys = false;
        if((query.wild_big_keys+'').toLowerCase() === 'true')
            excludebigkeys = false;
		if(query.world_state)
			worldState = query.world_state[0];
		if(worldState !== 'S' && worldState !== 'O' && worldState !== 'I' && worldState !== 'R')
			worldState = 'O';
		if(query.entrance_shuffle && query.entrance_shuffle !== 'N' && query.entrance_shuffle !== 'n')
			entranceEnabled = true;
		let sync = (query.init_sync+'').toLowerCase() === 'true';
		if(sync || owshuffle !== 'N')
			toggleOverworldModeSection();
		document.getElementById("vanillawhirlpoolswelcome").checked = false;
		document.getElementById("vanillaspecialwelcome").checked = false;
		document.getElementById("selectdoorshuffle").value = ""+doorshuffle;
		document.getElementById("lobbyshuffle").checked = lobbyshuffle;
		document.getElementById("excludesmallkeys").checked = excludesmallkeys;
		document.getElementById("excludebigkeys").checked = excludebigkeys;
		document.getElementById("selectowshuffle").value = ""+owshuffle;
		document.getElementById("crossedow").value = 'N';
		document.getElementById("similarow").checked = false;
		document.getElementById("mixedow").checked = false;
		document.getElementById("fluteshuffle").checked = false;
		document.getElementById("selectworldstate").value = ""+worldState;
		document.getElementById("entranceenabled").checked = entranceEnabled;
		document.getElementById("globalsync").checked = sync;
		document.getElementById("showmorerooms").checked = false;
		document.getElementById("splitpath").checked = true;
		document.getElementById("owsidebaredit").checked = true;
		document.getElementById("owsidebarnew").checked = true;
		document.getElementById("owsidebarsearch").checked = true;
		document.getElementById("itemsync").checked = false;
		document.getElementById("connectortr").checked = false;
		document.getElementById("connectorhccsanc").checked = false;
		document.getElementById("connectorhcchcb").checked = false;
		document.getElementById("connectorboesanc").checked = false;
		document.getElementById("connectorboehcb").checked = false;
		document.getElementById("connectorboehcc").checked = false;
		document.getElementById("connectorsanchcb").checked = false;
		document.getElementById("connectorsanchcc").checked = false;
		document.getElementById("connectorsync").checked = false;
		document.getElementById("owpathsnote").value = "";
		document.getElementById("pinnedlinkshouse").checked = true;
		document.getElementById("pinnedsanctuary").checked = false;
		document.getElementById("pinnedoldman").checked = false;
		document.getElementById("pinnedpyramid").checked = false;
		document.getElementById("compactpinned").checked = true;
		document.getElementById("compactprevious").checked = true;
		document.getElementById("alwaysfollowmarked").checked = true;
		document.getElementById("compactsearchresults").checked = true;
		document.getElementById("mainsidebysideow").checked = false;
		document.getElementById("sidebysideow").checked = false;
		document.getElementById("mainzoomautoow").checked = true;
		document.getElementById("zoomautoow").checked = true;
		setWelcomeMode(!query.request_update);
		document.getElementById("vanillawelcome").style.display = owshuffle === 'N' ?"none" :"block";
		if(sync)
			document.getElementById("itemsync").disabled = document.getElementById("connectorsync").disabled = document.getElementById("selectworldstate").disabled = document.getElementById("entranceenabled").disabled = true;
		if(!query.request_update && (owshuffle !== 'N' || crossedow !== 'N' || mixedow))
			document.getElementById("overworldoptionsfinalbox").style.display = "block";
		try
		{
			if(localStorage.getItem("dungeonData"))
			{
				document.getElementById("loadmanualwelcome").classList.remove("disabled");
				document.getElementById("loadmanual").classList.remove("disabled");
			}
			if(localStorage.getItem("dungeonDataAutoSave"))
			{
				document.getElementById("loadautowelcome").classList.remove("disabled");
				document.getElementById("loadauto").classList.remove("disabled");
			}
		}
		catch(error)
		{
		}
		initializeOverworldGraph();
		initializeRoomsAndSymbols();
		updateReachableEdges();
		loadOverview();
		updateOverviewElements();
		resizeHandler();
		window.addEventListener("resize",resizeHandler,false);
		window.addEventListener("keydown",keyDown,false);
		if(window.opener && !window.opener.closed)
		{
			window.addEventListener("message",receiveMessage,false);
			if(query.request_update)
				window.opener.postMessage("UPDATE","*");
			else
				window.opener.postMessage("ITEMS","*");
		}
	};

	window.loadOverworld = function()
	{
		currentDungeon = -1;
		currentOWPath = null;
		document.getElementById("owmaintablenewpath").style.display = owshuffle === 'N' ?"none" :"table-row";
		document.getElementById("owmaintablemininewpath").style.display = owshuffle === 'N' ?"none" :"";
		document.getElementById("pinnedlinkshouse").nextSibling.innerHTML = worldState === 'I' ?"Link's House" :"Link's House";
		document.getElementById("pinnedsanctuary").nextSibling.innerHTML = worldState === 'I' ?"Dark Chapel" :"Sanctuary";
		document.getElementById("pinnedoldman").nextSibling.innerHTML = worldState === 'I' ?"Dark Mountain" :"Mountain Cave";
		document.getElementById("pinnedpyramid").nextSibling.innerHTML = worldState === 'I' ?"Castle" :"Pyramid";
		document.getElementById("dungeonconnectorsdefault").style.display = entranceEnabled ?"none" :"block";
		document.getElementById("dungeonconnectorsdoors").style.display = entranceEnabled || doorshuffle === 'N' ?"none" :"block";
		document.getElementById("owentrancecontainer").style.display = entranceEnabled ?"block" :"none";
		document.getElementById("owfluteshufflerow").style.display = fluteshuffle ?"block" :"none";
		document.getElementById("owpreviouspathscontainer").style.display = owshuffle === 'N' ?"none" :"block";
		document.getElementById("owvanillatransitions").style.display = owshuffle === 'N' && crossedow !== 'C' ?"none" :"";
		updateConnectorList();
		updateStartRegionList();
		updateMainPathLists();
		if(outstandingUpdate)
			sendUpdate();
		activeOverworld();
		switchScene("owmain");
		if(showFullMapMain)
			loadFullOverworldMain();
	};

	window.sideLoadOverworld = function()
	{
		currentPath = null;
		if(currentDungeon != -1)
			saveNotes();
		loadOverworld();
	};

	window.activeOverworld = function()
	{
		document.getElementById("sidebossow").classList.add("activetab");
		document.getElementById("sidesummaryow").classList.add("activetab");
		for(let k = 0; k < 13; k++)
		{
			document.getElementById("sideboss"+k).classList.remove("activetab");
			document.getElementById("sidesummary"+k).classList.remove("activetab");
		}
	};

	window.loadFullOverworldMain = function()
	{
		fullOWSelectedScreen = fullOWSelectedEdge = fullOWConnectorStart = fullOWFixedEdge = null;
		document.getElementById("fullowmainscreenactions").style.display = "none";
		document.getElementById("fullowmainnewpath").style.display = owshuffle === 'N' ?"none" :"block";
		document.getElementById("fullowmainmixedactions").style.display = mixedow ?"block" :"none";
		document.getElementById("fullowmainswapscreenwithedges").style.display = (owshuffle !== 'N' || crossedow === 'C') ?"block" :"none";
		document.getElementById("fullowmainnewconnector").style.display = entranceEnabled && !document.getElementById("connectorsync").checked && !document.getElementById("globalsync").checked ?"block" :"none";
		document.getElementById("fullowmainedgeactions").style.display = "none";
		document.getElementById("fullowmainconnectoractions").style.display = "none";
		document.getElementById("fullowmainpathactions").style.display = fullOWPath ?"block" :"none";
		fullCheckConnectorDetails();
		drawFullOverworldPanel(true);
		if(fullZoomAutoMain)
			calculateFullZoomMain();
	};

	window.enableUseMain = function()
	{
		useMain = true;
		if(showFullMapMain && document.getElementById("owmain").style.display === "block")
			loadFullOverworldMain();
	};

	window.disableUseMain = function()
	{
		useMain = false;
		if(showFullMapMain && document.getElementById("owmain").style.display === "block")
		{
			document.getElementById("fullowmainscreenactions").style.display = "none";
			document.getElementById("fullowmainedgeactions").style.display = "none";
			document.getElementById("fullowmainconnectoractions").style.display = "none";
		}
	};

	window.toggleOverworldModeSection = function()
	{
		showOverworldModeSection = !showOverworldModeSection;
		document.getElementById("toggleowmodesection").className = showOverworldModeSection ?"buttonsquare collapsesection" :"buttonsquare expandsection";
		document.getElementById("overworldmodelayout").style.display = showOverworldModeSection ?"inline-block" :"none";
		document.getElementById("overworldmodesection").style.display = showOverworldModeSection ?"block" :"none";
	};

	window.toggleFullOverworldMain = function()
	{
		showFullMapMain = !showFullMapMain;
		document.getElementById("togglefullowmain").className = showFullMapMain ?"cell buttonsquare collapsesection" :"cell buttonsquare expandsection";
		document.getElementById("fullowmainpage").style.display = showFullMapMain ?"block" :"none";
		if(showFullMapMain)
			loadFullOverworldMain();
	};

	window.toggleOverworldMainTable = function()
	{
		expandedMainTable = !expandedMainTable;
		document.getElementById("toggleowmaintable").className = expandedMainTable ?"cell buttonsquare collapsesection" :"cell buttonsquare expandsection";
		document.getElementById("owmaintable").style.display = expandedMainTable ?"block" :"none";
		document.getElementById("owmaintablemini").style.display = expandedMainTable ?"none" :"block";
	};

	window.toggleChecklist = function()
	{
		showChecklist = !showChecklist;
		document.getElementById("togglechecklist").className = showChecklist ?"cell buttonsquare collapsesection" :"cell buttonsquare expandsection";
		document.getElementById("checklist").style.display = showChecklist ?"block" :"none";
	};

	window.updateConnectorList = function()
	{
		document.getElementById("owconnectorlisttext").innerHTML = "Connector caves ("+entranceConnectors.length+")";
		if(document.getElementById("connectorsync").checked || document.getElementById("globalsync").checked)
			document.getElementById("owmainaddconnector").classList.add("disabled");
		else
			document.getElementById("owmainaddconnector").classList.remove("disabled");
		let s = "";
		for(let k = 0; k < entranceConnectors.length; k++)
		{
			s += "<div class='connector'"+(entranceConnectors[k].status === "unknown" ?" style='border-left: 4px solid yellow; padding-left: 4px; margin: 2px 0;'" :"");
			s += "onclick='showClickConnectorModal(event,"+k+")'><div class='row' style='max-width: 400px;'><div style='display: inline-block;'>";
			s += "<h3 class='textrow'>"+connectorString(entranceConnectors[k])
			s += "</h3></div></div>";
			if(entranceConnectors[k].status === "unknown")
			{
				s += "<div class='row' style='max-width: 400px;'><div style='display: inline-block;'>";
				s += "<div class='cell' style='line-height: 34px; margin-right: 8px;'>Currently possible backwards?</div>"
				s += "<div class='cell buttonbox' onclick='unknownConnectorOneWay("+k+"); event.stopPropagation()'>No</div>";
				s += "<div class='cell buttonbox' onclick='unknownConnectorTwoWay("+k+"); event.stopPropagation()'>Yes</div></div></div>";
			}
			s += "</div>";
		}
		document.getElementById("owentranceconnectors").innerHTML = s;
		fullCheckConnectorDetails();
		hideClickConnectorModal();
	};

	window.fullCheckConnectorDetails = function()
	{
		if(entranceEnabled && (useMain || fullOverworldMode === "editedges") && !fullOWSelectedScreen && !fullOWSelectedEdge && !fullOWConnectorStart)
			for(let k = entranceConnectors.length-1; k >= 0; k--)
				if(entranceConnectors[k].status === "unknown")
				{
					lastUnknownConnectorIndex = k;
					document.getElementById(useMain ?"fullowmainunknownconnectortext" :"fullowunknownconnectortext").innerHTML = connectorString(entranceConnectors[k]);
					document.getElementById(useMain ?"fullowmainunknownconnector" :"fullowunknownconnector").style.display = "block";
					return;
				}
		lastUnknownConnectorIndex = -1;
		document.getElementById(useMain ?"fullowmainunknownconnector" :"fullowunknownconnector").style.display = "none";
	};

	window.connectorString = function(connector)
	{
		let regionStart = overworldScreens.get(connector.data[0]).regions.get(connector.data[1]),regionEnd = overworldScreens.get(connector.data[2]).regions.get(connector.data[3]);
		let s = regionStart.screen.name;
		if(regionStart.screen.entranceRegions.length != 1)
			s += " - "+regionStart.name;
		s += (connector.status === "both" ?" <=> " :(connector.status === "unknown" ?" ?=> " :" ==> "))+regionEnd.screen.name;
		if(regionEnd.screen.entranceRegions.length != 1)
			s += " - "+regionEnd.name;
		return s;
	};

	window.unknownConnectorOneWay = function(index)
	{
		if(entranceConnectors[index].status === "unknown")
		{
			entranceConnectors[index].status = "single";
			outstandingUpdate = true;
			updateConnectorList();
			drawFullOverworldPanels();
		}
		else
			if(entranceConnectors[index].status === "both")
			{
				makeEntranceConnectorUnidirectional(entranceConnectors[index]);
				outstandingUpdate = true;
				updateReachableEdges();
				updateConnectorList();
				drawFullOverworldPanels();
			}
	};

	window.unknownConnectorTwoWay = function(index)
	{
		if(entranceConnectors[index].status !== "both")
		{
			makeEntranceConnectorBidirectional(entranceConnectors[index]);
			outstandingUpdate = true;
			updateReachableEdges();
			updateConnectorList();
		}
	};

	window.fullConnectorOneWay = function()
	{
		fullCheckConnectorDetails();
		if(lastUnknownConnectorIndex !== -1)
		{
			unknownConnectorOneWay(lastUnknownConnectorIndex);
		}
	};

	window.fullConnectorTwoWay = function()
	{
		fullCheckConnectorDetails();
		if(lastUnknownConnectorIndex !== -1)
		{
			unknownConnectorTwoWay(lastUnknownConnectorIndex);
		}
	};

	window.clickedConnectorOneWay = function()
	{
		unknownConnectorOneWay(clickedConnectorIndex);
	};

	window.clickedConnectorTwoWay = function()
	{
		unknownConnectorTwoWay(clickedConnectorIndex);
	};

	window.clickedConnectorUnknown = function()
	{
		if(entranceConnectors[clickedConnectorIndex].status === "single")
		{
			entranceConnectors[clickedConnectorIndex].status = "unknown";
			outstandingUpdate = true;
			updateConnectorList();
			drawFullOverworldPanels();
		}
		else
			if(entranceConnectors[clickedConnectorIndex].status === "both")
			{
				makeEntranceConnectorUnidirectional(entranceConnectors[clickedConnectorIndex]);
				entranceConnectors[clickedConnectorIndex].status = "unknown";
				outstandingUpdate = true;
				updateReachableEdges();
				updateConnectorList();
				drawFullOverworldPanels();
			}
	};

	window.deleteClickedConnector = function()
	{
		if(!document.getElementById("connectorsync").checked && !document.getElementById("globalsync").checked)
		{
			deleteEntranceConnector(clickedConnectorIndex,entranceConnectors[clickedConnectorIndex]);
			outstandingUpdate = true;
			updateReachableEdges();
			updateConnectorList();
			drawFullOverworldPanels();
		}
	};

	window.updateStartRegionList = function()
	{
		let s = "";
		for(let k = 0; k < customStartRegions.length; k++)
		{
			let region = customStartRegions[k];
			s += "<div class='row' style='max-width: 400px;'><div style='display: inline-block;'>";
			s += "<h3 class='textrow'>"+region.screen.name;
			if(region.screen.regions.size != 1)
				s += " - "+region.name;
			s += "</h3></div><div class='rightalign'><div class='cell'>";
			s += "<div class='buttonsquare close' style='margin: 2px; border-color: rgb(255,128,128);' onclick='deleteStartRegion("+k+")'></div></div></div></div>";
		}
		document.getElementById("owstartregions").innerHTML = s;
	};

	window.deleteStartRegion = function(index)
	{
		customStartRegions.splice(index,1);
		outstandingUpdate = true;
		updateReachableEdges();
		updateStartRegionList();
		drawFullOverworldPanels();
		updateClickScreenCommonStarts();
	};

	window.updateDefaultStartRegions = function()
	{
		outstandingUpdate = true;
		updateReachableEdges();
		drawFullOverworldPanels();
		updateClickScreenCommonStarts();
	};

	window.updateOverworldNotes = function()
	{
		outstandingUpdate = true;
	};

	window.closeOverworld = function()
	{
		if(outstandingUpdate)
			sendUpdate();
		loadOverview();
	};

	window.toggleItem = function(item)
	{
		if(document.getElementById("itemsync").checked || document.getElementById("globalsync").checked)
		{
			if(window.opener && !window.opener.closed)
				window.opener.postMessage("TOGGLE "+(item === "gloves" ?"glove" :item),"*");
		}
		else
		{
			if(item === "gloves")
			{
				if(ownItems.mitts)
				{
					ownItems.gloves = ownItems.mitts = false;
					document.getElementById("item"+item).classList.remove("collected","mitts");
				}
				else
					if(ownItems.gloves)
					{
						ownItems.mitts = true;
						document.getElementById("item"+item).classList.add("collected","mitts");
					}
					else
					{
						ownItems.gloves = true;
						document.getElementById("item"+item).classList.add("collected");
					}
			}
			else
			{
				if(ownItems[item] = !ownItems[item])
					document.getElementById("item"+item).classList.add("collected");
				else
					document.getElementById("item"+item).classList.remove("collected");
			}
			outstandingUpdate = true;
			updateReachableEdges();
			drawFullOverworldPanels();
		}
	};

	window.toggleActiveFlute = function()
	{
		outstandingUpdate = true;
		updateReachableEdges();
		drawFullOverworldPanels();
	};

	window.clickFluteActivated = function()
	{
		document.getElementById("activeflutebox").checked = true;
		outstandingUpdate = true;
		updateReachableEdges();
		drawFullOverworldPanels();
	};

	window.clickSetFluteSpots = function()
	{
		if(fluteshuffle)
		{
			if(!sideBySidePopout)
				drawDarkWorldPopout = worldState === 'I';
			showFullOverworldModal("editflutespots");
		}
	};

	window.toggleConnector = function(checkbox)
	{
		ownItems[checkbox.id] = checkbox.checked;
		outstandingUpdate = true;
		updateReachableEdges();
		drawFullOverworldPanels();
	};

	window.clickScreenFull = function(event,id,main)
	{
		switch(main ?"editedges" :fullOverworldMode)
		{
			case "newpath":
				startOverworldPath(id);
				return;
			case "continuepath":
				selectTargetScreen(id);
				return;
			case "searchpath":
				startOverworldSearch(id);
				return;
			case "searchpathtarget":
				currentOWScreen = overworldScreens.get(id);
				searchOverworldPath(false,true);
				return;
			case "searchpathstart":
				searchStartScreen = overworldScreens.get(id);
				searchOverworldPath(true,false);
				return;
			case "editedges":
				if(!fullOWSelectedEdge || event.detail > 1)
					updateClickScreenOptions(id);
				return;
			case "editflutespots":
				if(customFluteSpots.includes(id%0x40))
					customFluteSpots.splice(customFluteSpots.indexOf(id%0x40),1);
				else
				{
					customFluteSpots.push(id%0x40);
					customFluteSpots.sort((a,b)=>a-b);
				}
				outstandingUpdate = true;
				updateReachableEdges();
				drawFullOverworldPanels();
		}
	};

	window.clickEdgeFull = function(screenID,edgeString,main)
	{
		if(main || fullOverworldMode === "editedges")
		{
			let mainString = main ?"fullowmain" :"fullow";
			if(fullOWSelectedEdge)
			{
				let edge = overworldScreens.get(screenID).edges.get(edgeString);
				if(edge === fullOWSelectedEdge)
				{
					fullOWSelectedEdge = null;
					document.getElementById(mainString+"edgeactions").style.display = "none";
					fullCheckConnectorDetails();
				}
				else
				{
					if(edge.direction === opposite[fullOWSelectedEdge.direction] && edge.water === fullOWSelectedEdge.water)
					{
						connectSimilarParallel(fullOWSelectedEdge,edge);
						fullOWSelectedEdge = null;
						document.getElementById(mainString+"edgeactions").style.display = "none";
						fullCheckConnectorDetails();
						outstandingUpdate = true;
						updateReachableEdges();
					}
				}
			}
			else
			{
				if(owshuffle === 'N')
				{
					let edge = overworldScreens.get(screenID).edges.get(edgeString);
					if(similarow && (screenID%0x40 === 0x28 || screenID%0x40 === 0x29) && (edge.vanilla.screen.id%0x40 === 0x28 || edge.vanilla.screen.id%0x40 === 0x29))
						edge = overworldScreens.get(0x68).edges.get("E0");
					let edgeVanilla = !edge.parallel || isDarkWorld(edge.screen) === isDarkWorld(edge.vanilla.screen) ?edge.vanilla :edge.parallel.vanilla;
					if(edge.out)
					{
						if(edge.out === edgeVanilla)
						{
							connectSimilarParallel(edge,edge.parallel ?edgeVanilla.parallel :edgeVanilla);
							outstandingUpdate = true;
							updateReachableEdges();
						}
						else
						{
							deleteSimilarParallel(edge);
							outstandingUpdate = true;
							updateReachableEdges();
						}
					}
					else
					{
						connectSimilarParallel(edge,edgeVanilla);
						outstandingUpdate = true;
						updateReachableEdges();
					}
				}
				else
				{
					fullOWSelectedEdge = overworldScreens.get(screenID).edges.get(edgeString);
					fullOWSelectedScreen = null;
					document.getElementById(mainString+"screenactions").style.display = "none";
					document.getElementById(mainString+"edgeactions").style.display = "block";
					document.getElementById(mainString+"unknownconnector").style.display = "none";
					if(fullOWSelectedEdge.out || fullOWSelectedEdge.in)
					{
						document.getElementById(mainString+"edgetext").innerHTML = "This transition is already set. Clicking on another edge will replace the old connection.";
						document.getElementById(mainString+"edgedelete").classList.remove("disabled");
					}
					else
					{
						document.getElementById(mainString+"edgetext").innerHTML = "Click on another edge to set a screen transition.";
						document.getElementById(mainString+"edgedelete").classList.add("disabled");
					}
				}
			}
			drawFullOverworldPanels();
		}
	};

	window.updateClickScreenOptions = function(id)
	{
		let screen = overworldScreens.get(id);
		let mainString = useMain ?"fullowmain" :"fullow";
		fullOWSelectedEdge = null;
		document.getElementById(mainString+"edgeactions").style.display = "none";
		if(fullOWConnectorStart)
		{
			if(screen.entranceRegions.length !== 0 && fullOWConnectorStart.entranceRegions.length !== 0)
			{
				fullOWConnectorEnd = screen;
				backToMain = useMain;
				let start = fullOWConnectorStart;
				hideFullOverworldModal();
				fullOWConnectorStart = start;
				showOverworldConnectorModal();
			}
		}
		else
		{
			if(screen === fullOWSelectedScreen)
			{
				fullOWSelectedScreen = null;
				document.getElementById(mainString+"screenactions").style.display = "none";
				fullCheckConnectorDetails();
			}
			else
			{
				fullOWSelectedScreen = screen;
				if(screen.entranceRegions.length !== 0)
					document.getElementById(mainString+"newconnector").classList.remove("disabled");
				else
					document.getElementById(mainString+"newconnector").classList.add("disabled");
				document.getElementById(mainString+"screenactions").style.display = "block";
				document.getElementById(mainString+"screenname").innerHTML = screen.name;
				document.getElementById(mainString+"mixedscreenstate").innerHTML = "Mixed state: "+screen.mixedState;
				updateClickScreenCommonStarts();
				document.getElementById(mainString+"unknownconnector").style.display = "none";
			}
			drawFullOverworldPanelCurrent();
		}
	};

	window.updateClickScreenCommonStarts = function()
	{
		if(fullOWSelectedScreen)
		{
			let mainString = useMain ?"fullowmain" :"fullow";
			let s = "<div class='cell textrow' style='line-height: 16px; margin: 4px;'>Add/remove common start:</div>";
			for(let [regionName,region] of fullOWSelectedScreen.regions)
				if(allStartRegions.includes(region))
					s += "<div class='buttonbox small redborder' style='float: left; margin: 2px;' onclick='removeStartRegion(this,\""+regionName+"\")'>"+regionName+"</div>";
				else
					s += "<div class='buttonbox small' style='float: left; margin: 2px;' onclick='addStartRegion(this,\""+regionName+"\")'>"+regionName+"</div>";
			document.getElementById(mainString+"regionlist").innerHTML = s;
		}
	};

	window.fullOverworldNewPath = function()
	{
		startOverworldPath(fullOWSelectedScreen.id);
	};

	window.fullOverworldSearch = function()
	{
		startOverworldSearch(fullOWSelectedScreen.id);
	};

	window.fullOverworldUnknownState = function()
	{
		setMixedScreen(fullOWSelectedScreen,"unknown");
		outstandingUpdate = true;
		fullOWSelectedScreen = null;
		document.getElementById(useMain ?"fullowmainscreenactions" :"fullowscreenactions").style.display = "none";
		fullCheckConnectorDetails();
		updateReachableEdges();
		drawFullOverworldPanels();
	};

	window.fullOverworldSwapScreen = function(button,includeEdges)
	{
		if(fullOWSelectedScreen.mixedState !== "unknown")
		{
			if(includeEdges)
			{
				let group = getScreenLinkGroup(fullOWSelectedScreen.id),gameLeft = fullOWSelectedScreen.id%0x40 === 0x28,gameRight = fullOWSelectedScreen.id%0x40 === 0x29;
				for(let edge of fullOWSelectedScreen.edges.values())
					if(edge.parallel && (!similarow || (!gameLeft && (!gameRight || edge.direction !== "W"))) && ((edge.out && !group.includes(edge.out.screen.id)) || (edge.parallel.out && !group.includes(edge.parallel.out.screen.id))))
					{
						let old = edge.out;
						if(edge.parallel.out)
							connectEdges(edge,edge.parallel.out,true);
						else
							deleteConnections(edge);
						if(old)
							connectEdges(edge.parallel,old,true);
						else
							deleteConnections(edge.parallel);
					}
			}
			setMixedScreen(fullOWSelectedScreen,fullOWSelectedScreen.mixedState === "normal" ?"swapped" :"normal");
			outstandingUpdate = true;
			buttonFlash(button);
			updateReachableEdges();
			drawFullOverworldPanels();
			document.getElementById(useMain ?"fullowmainmixedscreenstate" :"fullowmixedscreenstate").innerHTML = "Mixed state: "+fullOWSelectedScreen.mixedState;
		}
	};

	window.fullOverworldNewConnector = function()
	{
		if(fullOWSelectedScreen && fullOWSelectedScreen.entranceRegions.length !== 0)
		{
			fullOWConnectorStart = fullOWSelectedScreen;
			fullOWSelectedScreen = null;
			document.getElementById(useMain ?"fullowmainscreenactions" :"fullowscreenactions").style.display = "none";
			document.getElementById(useMain ?"fullowmainconnectoractions" :"fullowconnectoractions").style.display = "block";
			drawFullOverworldPanelCurrent();
		}
	};

	window.addStartRegion = function(button,regionName)
	{
		customStartRegions.push(fullOWSelectedScreen.regions.get(regionName));
		outstandingUpdate = true;
		updateReachableEdges();
		updateStartRegionList();
		drawFullOverworldPanels();
		buttonFlash(button);
		button.classList.add("redborder");
		button.setAttribute("onclick","removeStartRegion(this,'"+regionName+"')");
	};

	window.removeStartRegion = function(button,regionName)
	{
		let region = fullOWSelectedScreen.regions.get(regionName);
		if(fixedStartRegions.includes(region))
		{
			if(fullOWSelectedScreen.id%0x40 === 0x2C)
				document.getElementById("pinnedlinkshouse").checked = false;
			if(fullOWSelectedScreen.id%0x40 === 0x13)
				document.getElementById("pinnedsanctuary").checked = false;
			if(fullOWSelectedScreen.id%0x40 === 0x03)
				document.getElementById("pinnedoldman").checked = false;
			if(fullOWSelectedScreen.id%0x40 === 0x1B)
				document.getElementById("pinnedpyramid").checked = false;
		}
		for(let k = 0; k < customStartRegions.length; k++)
			if(customStartRegions[k] === region)
			{
				customStartRegions.splice(k,1);
				k--;
			}
		outstandingUpdate = true;
		updateReachableEdges();
		updateStartRegionList();
		drawFullOverworldPanels();
		buttonFlash(button);
		button.classList.remove("redborder");
		button.setAttribute("onclick","addStartRegion(this,'"+regionName+"')");
	};

	window.fullOverworldUnselectEdge = function()
	{
		fullOWSelectedEdge = null;
		document.getElementById(useMain ?"fullowmainedgeactions" :"fullowedgeactions").style.display = "none";
		fullCheckConnectorDetails();
		drawFullOverworldPanelCurrent();
	};

	window.fullOverworldDeleteConnection = function()
	{
		if(fullOWSelectedEdge && (fullOWSelectedEdge.out || fullOWSelectedEdge.in))
		{
			deleteSimilarParallel(fullOWSelectedEdge);
			fullOWSelectedEdge = null;
			document.getElementById(useMain ?"fullowmainedgeactions" :"fullowedgeactions").style.display = "none";
			outstandingUpdate = true;
			fullCheckConnectorDetails();
			updateReachableEdges();
			drawFullOverworldPanels();
		}
	};

	window.fullOverworldCancelConnector = function()
	{
		fullOWConnectorStart = null;
		document.getElementById(useMain ?"fullowmainconnectoractions" :"fullowconnectoractions").style.display = "none";
		drawFullOverworldPanelCurrent();
	};

	window.fullOverworldCommonStarts = function()
	{
		searchStartScreen = null;
		searchOverworldPath(true,false);
	};

	window.fullOverworldDisableFluteShuffle = function()
	{
		document.getElementById("fluteshuffle").checked = false;
		updateOverworldShuffle(false);
		showFullOverworldModal("editedges");
	};

	window.fullOverworldSavePath = function(button)
	{
		if(fullOWPath)
		{
			pinnedPaths.unshift(fullOWPath);
			outstandingUpdate = true;
			updateMainPathLists();
			buttonFlash(button);
		}
	};

	window.fullOverworldDeletePath = function()
	{
		document.getElementById("fullowmainpanelpathoverlay").innerHTML = document.getElementById("fullowpanelpathoverlay").innerHTML = "";
		document.getElementById("fullowmainpathactions").style.display = document.getElementById("fullowpathactions").style.display = "none";
		fullOWPath = null;
		document.getElementById("fullowmainhighlightedpath").innerHTML = document.getElementById("fullowhighlightedpath").innerHTML = "";
		drawFullOverworldPanels();
	};

	window.fullOverworldToggleCompactPath = function()
	{
		if(fullOWPath)
		{
			fullPathCompact = !fullPathCompact;
			clearPathNumber();
			document.getElementById("fullowmainhighlightedpath").innerHTML = document.getElementById("fullowhighlightedpath").innerHTML = drawOverworldPath(fullOWPath,!fullPathCompact,true,false)[0];
		}
	};

	window.startOverworldPath = function(id)
	{
		if(owshuffle !== 'N')
		{
			currentOWPath = [id];
			let screen = currentOWScreen = overworldScreens.get(id);
			document.getElementById("owcurrentpathheader").innerHTML = "Creating a new overworld path";
			updateCurrentOverworldPath();
			drawDirectionsFromScreen(screen);
			hideFullOverworldModal();
			activeOverworld();
			switchScene("owpathedit");
		}
	};

	window.drawDirectionsFromScreen = function(screen)
	{
		let s = "<div style='position: absolute; left: 192px; top: 16px;'>"+drawSingleOverworldScreen(screen,"alledges")+"</div>";
		for(let edgeString of screen.edges.keys())
		{
			let symbol = overworldEdgeToDirection[edgeString];
			s += drawDirectionFromSymbol(symbol,"appendToOverworldPath(\""+edgeString+"\")");
		}
		if(screen.portal)
			s += drawDirectionFromSymbol(overworldEdgeToDirection["PO"],"appendToOverworldPath(\"PO\")");
		if(screen.darkWorld)
			s += drawDirectionFromSymbol(overworldEdgeToDirection["MI"],"appendToOverworldPath(\"MI\")");
		document.getElementById("owdirectionicons").innerHTML = s;
	};

	window.drawDirectionFromSymbol = function(symbol,onClick)
	{
		let style = "background-image: url("+"./images/"+symbol.folder+"/"+symbol.file+".png);"
		if(symbol.rotate)
			style += " transform: rotate("+symbol.rotate+"deg);";
		style += " position: absolute; left: "+symbol.x+"px; top: "+symbol.y+"px;";
		return "<div class='pathsymbol' style='"+style+"' onclick='"+onClick+"'></div>";
	};

	window.appendToOverworldPath = function(edgeString)
	{
		currentOWPath.push(edgeString);
		if(edgeString == "PO" || edgeString == "MI")
		{
			currentOWScreen = currentOWScreen.parallel;
			currentOWPath.push(edgeString,currentOWScreen.id);
			updateCurrentOverworldPath();
			drawDirectionsFromScreen(currentOWScreen);
		}
		else
		{
			let edge = currentOWScreen.edges.get(edgeString);
			if(edge.out && document.getElementById("alwaysfollowmarked").checked)
			{
				currentOWScreen = edge.out.screen;
				currentOWPath.push(edge.out.string,currentOWScreen.id);
				updateCurrentOverworldPath();
				drawDirectionsFromScreen(currentOWScreen);
			}
			else
			{
				updateCurrentOverworldPath();
				fullOWFixedEdge = edge;
				if(!sideBySidePopout && crossedow === 'N')
					drawDarkWorldPopout = isDarkWorld(currentOWScreen);
				showFullOverworldModal("continuepath");
			}
		}
		document.getElementById("owdeletebutton").classList.remove("disabled");
		document.getElementById("owforkbutton").classList.remove("disabled");
	};

	window.appendTargetToOverworldPath = function(screen,edge)
	{
		currentOWPath.push(edge.string,screen.id);
		currentOWScreen = screen;
		drawDirectionsFromScreen(screen);
		updateCurrentOverworldPath();
	};

	window.selectTargetScreen = function(id)
	{
		let screen = overworldScreens.get(id),validEdges = [];
		extraOWDirection = opposite[fullOWFixedEdge.direction];
		for(let edge of screen.edges.values())
		{
			if(edgesCompatible(edge,fullOWFixedEdge))
			{
				validEdges.push(edge);
			}
		}
		if(validEdges.length === 1)
		{
			document.getElementById("fullowModal").style.display = "none";
			enableUseMain();
			appendTargetToOverworldPath(screen,validEdges[0]);
		}
		if(validEdges.length > 1)
		{
			document.getElementById("fullowModal").style.display = "none";
			enableUseMain();
			extraOWScreen = screen;
			let options = [false,false,false];
			for(let edge of validEdges)
				options[edge.symbol] = true;
			showOverworldExtraModal(options);
		}
	};

	window.selectTargetEdge = function(index)
	{
		let edge = extraOWScreen.edges.get(extraOWDirection+index);
		if(edge && edgesCompatible(edge,fullOWFixedEdge))
		{
			document.getElementById("owextraModal").style.display = "none";
			appendTargetToOverworldPath(extraOWScreen,edge);
		}
	};

	window.extraBackToFullOverworld = function()
	{
		document.getElementById("owextraModal").style.display = "none";
		document.getElementById("fullowModal").style.display = "block";
		disableUseMain();
	};

	window.editFluteSpots = function()
	{
		if(fluteshuffle)
		{
			if(!sideBySidePopout)
				drawDarkWorldPopout = worldState === 'I';
			showFullOverworldModal("editflutespots");
		}
	};

	window.saveConnector = function()
	{
		let radioStart = document.querySelector("input[name='connectorstartgroup']:checked"),radioEnd = document.querySelector("input[name='connectorendgroup']:checked");
		if(radioStart && radioEnd)
		{
			let regionStart = fullOWConnectorStart.regions.get(radioStart.value),regionEnd = fullOWConnectorEnd.regions.get(radioEnd.value);
			createEntranceConnector(regionStart,regionEnd,document.getElementById("connectorbidirectional").checked ?"both" :"single",null);
			sendUpdate();
			updateReachableEdges();
			updateConnectorList();
			connectorBackToFullOverworld();
		}
	};

	window.connectorBackToFullOverworld = function()
	{
		fullOWConnectorStart = null;
		useMain = backToMain;
		document.getElementById(useMain ?"fullowmainconnectoractions" :"fullowconnectoractions").style.display = "none";
		document.getElementById("owconnectorModal").style.display = "none";
		if(!useMain)
			document.getElementById("fullowModal").style.display = "block";
		drawFullOverworldPanels();
	};

	window.updateCurrentOverworldPath = function()
	{
		let [drawn,width,] = drawOverworldPath(currentOWPath,true,false,false);
		document.getElementById("owcurrentpath").innerHTML = drawn;
		if(width <= Math.max(256,document.getElementById("owcurrentpath").parentElement.offsetWidth))
		{
			document.getElementById("owcurrentpath").style.left = 0;
			document.getElementById("owfadeout").classList.remove("leftfadeout");
		}
		else
		{
			document.getElementById("owcurrentpath").style.left = document.getElementById("owcurrentpath").parentElement.offsetWidth-width+"px";
			document.getElementById("owfadeout").classList.add("leftfadeout");
		}
		if(currentOWPath.length > 1)
		{
			document.getElementById("owdeletebutton").classList.remove("disabled");
			document.getElementById("owforkbutton").classList.remove("disabled");
		}
		else
		{
			document.getElementById("owdeletebutton").classList.add("disabled");
			document.getElementById("owforkbutton").classList.add("disabled");
		}
	};

	window.drawOverworldPath = function(path,detailed,drawNumbers,multiline,maxWidth = Infinity)
	{
		let s = "",left = 0,top = 0,lastEdgeX,lastEdgeY;
		for(let k = 0; k < path.length; k++)
		{
			switch(k%3)
			{
			case 0://Overworld screen
				if(detailed || k == 0 || k == path.length-1)
				{
					if(left+64 > maxWidth && multiline)
					{
						left = 32;
						top += 64;
					}
					let screen = overworldScreens.get(path[k]);
					let name = screen.name,scale = .5,classes = "owscreen single";
					if(screen.big)
						scale = .25;
					let x = screen.special ?0 :screen.id%8*128*scale;
					let y = screen.special ?0 :(screen.id%0x40 >> 3)*128*scale;
					let file = screen.special ?screen.file :(screen.darkWorld ?"darkworld" :"lightworld");
					s += "<div class='"+classes+"' style='left: "+left+"px; top: "+top+"px;' onmouseover='hoverPathNumber("+path[k]+")' onmouseout='clearPathNumber()'><img class='roomnodeimg' src='./images/overlay/"+file+".png' style='transform: translateX(-"+x+"px) translateY(-"+y+"px) scale("+scale+");'><span class='roomtt'><label class='ttlabel'>"+name+"</label></span></div>";
					if(drawNumbers)
						s += "<div class='pathnumber' style='left: "+(left+24)+"px; top: "+(top+24)+"px;'>"+k/3+"</div>";
					if(k != 0 && !specialEdgeTypes.includes(path[k-1]))
					{
						let edge = screen.edges.get(path[k-1][0]+path[k-1][1]);
						let newX = left+edge.x2*128*scale,newY = top+edge.y2*128*scale;
						s += "<div class='owedgedot to' style='left: "+(newX-4)+"px; top: "+(newY-4)+"px;'></div>";
						if(detailed || path.length <= 4)
						{
							let minX = Math.min(lastEdgeX,newX),maxX = Math.max(lastEdgeX,newX);
							let minY = Math.min(lastEdgeY,newY),maxY = Math.max(lastEdgeY,newY);
							s += "<div class='crossed"+(((lastEdgeY > newY) != (lastEdgeX > newX)) ?"left" :"right")+"' style='left: "+minX+"px; top: "+minY+"px; width: "+(maxX-minX)+"px; height: "+(maxY-minY)+"px; z-index: -1;'></div>"
						}
					}
					if(k != path.length-1 && !specialEdgeTypes.includes(path[k+1]))
					{
						let edge = screen.edges.get(path[k+1]);
						lastEdgeX = left+edge.x2*128*scale;
						lastEdgeY = top+edge.y2*128*scale;
						s += "<div class='owedgedot' style='left: "+(lastEdgeX-4)+"px; top: "+(lastEdgeY-4)+"px;'></div>";
					}
					left += 64;
				}
				else
					if(drawNumbers)
					{
						if(left+16 > maxWidth && multiline)
						{
							left = 32;
							top += 64;
						}
						s += "<div class='pathnumber single' style='left: "+(left-8)+"px; top: "+(top+40)+"px;' onmouseover='hoverPathNumber("+path[k]+")' onmouseout='clearPathNumber()'>"+k/3+"</div>";
					}
				break;
			case 1://Edge from
				if(left+32 > maxWidth && multiline)
				{
					left = 32;
					top += 64;
				}
				s += createSymbolNode(overworldEdgeToDirection[path[k]],left,top);
				left += 32;
				break;
			case 2://Edge to
			}
		}
		return [s,left,top+64];
	};

	window.closeOverworldPath = function()
	{
		currentOWPath = null;
		if(outstandingUpdate)
			sendUpdate();
		loadOverworld();
	};

	window.saveOverworldPath = function()
	{
		saveCurrentOverworldPath();
		currentOWPath = null;
		loadOverworld();
	};

	window.saveCurrentOverworldPath = function()
	{
		for(let k = 3; k < currentOWPath.length; k += 3)
			if(!specialEdgeTypes.includes(currentOWPath[k-2]))
			{
				let screen1 = overworldScreens.get(currentOWPath[k-3]),screen2 = overworldScreens.get(currentOWPath[k]);
				let edge1 = screen1.edges.get(currentOWPath[k-2]),edge2 = screen2.edges.get(currentOWPath[k-1]);
				connectSimilarParallel(edge1,edge2);
			}
		previousPaths.unshift(currentOWPath);
		updateMainPathLists();
		sendUpdate();
		updateReachableEdges();
	};

	window.removeLastOverworld = function()
	{
		if(currentOWPath.length > 1)
		{
			do
			{
				currentOWPath.pop();
			}
			while(currentOWPath.length%3 != 1);
			fullOWFixedEdge = null;
			currentOWScreen = overworldScreens.get(currentOWPath[currentOWPath.length-1]);
			drawDirectionsFromScreen(currentOWScreen);
			updateCurrentOverworldPath();
		}
	};

	window.forkOverworldPath = function()
	{
		if(currentOWPath.length > 1)
		{
			saveCurrentOverworldPath();
			currentOWPath = currentOWPath.slice();
			do
			{
				currentOWPath.pop();
			}
			while(currentOWPath.length%3 != 1);
			fullOWFixedEdge = null;
			currentOWScreen = overworldScreens.get(currentOWPath[currentOWPath.length-1]);
			drawDirectionsFromScreen(currentOWScreen);
			updateCurrentOverworldPath();
		}
	};

	window.startOverworldSearch = function(id)
	{
		currentOWScreen = overworldScreens.get(id);
		searchStartScreen = null;
		searchOnlyStartScreen();
		document.getElementById("owsearchmirrorportals").checked = true;
		document.getElementById("owsearchfollower").value = "none";
		hideFullOverworldModal();
		activeOverworld();
		switchScene("owsearch");
		searchOverworldPath(true,true);
	};

	window.startOverworldSearchPreset = function(preset)
	{
		switch(preset)
		{
			case "activateflute":
				searchStartScreen = null;
				currentOWScreen = overworldScreens.get(0x18);
				searchTargetRegion = currentOWScreen.regions.get("Main");
				document.getElementById("owsearchfollower").value = "none";
				break;
			case "smith":
				searchStartScreen = overworldScreens.get(0x69);
				searchStartRegion = searchStartScreen.regions.get("Frog");
				currentOWScreen = overworldScreens.get(0x22);
				searchTargetRegion = currentOWScreen.regions.get("Main");
				document.getElementById("owsearchfollower").value = "smithfrog";
				break;
			case "purplechest":
				searchStartScreen = overworldScreens.get(0x62);
				searchStartRegion = searchStartScreen.regions.get("Main");
				currentOWScreen = overworldScreens.get(0x3A);
				searchTargetRegion = currentOWScreen.regions.get("Main");
				document.getElementById("owsearchfollower").value = "purplechest";
				break;
			case "redbomb":
				searchStartScreen = overworldScreens.get(worldState === 'I' ?0x2C :0x6C);
				searchStartRegion = searchStartScreen.regions.get("Main");
				currentOWScreen = overworldScreens.get(0x5B);
				searchTargetRegion = currentOWScreen.regions.get("Main");
				document.getElementById("owsearchfollower").value = "redbomb";
				break;
			default:
				return;
		}
		if(searchStartScreen && searchStartScreen.regions.size === 1)
			searchStartRegion = null;
		if(currentOWScreen.regions.size === 1)
			searchTargetRegion = null;
		searchOnlyStartScreen();
		document.getElementById("owsearchmirrorportals").checked = true;
		hideFullOverworldModal();
		activeOverworld();
		switchScene("owsearch");
		searchOverworldPath(false,false);
	};

	window.searchOverworldPath = function(resetStartRegions,resetTargetRegions)
	{
		let screen = currentOWScreen;
		searchResults.clear();
		document.getElementById("owsearchresults").innerHTML = "";
		document.getElementById("owsearchresults").style.height = "0";
		searchResultsLength = 0;
		document.getElementById("checklistedges").style.display = owshuffle !== 'N' || crossedow === 'C' ?"table-row" :"none";
		document.getElementById("checklistmixed").style.display = mixedow ?"table-row" :"none";
		document.getElementById("checklistflute").style.display = fluteshuffle ?"table-row" :"none";
		hideFullOverworldModal();
		let items = getModifiedOwnItems();
		if(document.getElementById("owsearchfollower").value !== "none")
			items.follower = document.getElementById("owsearchfollower").value;
		document.getElementById("owsearchmirrorportals").disabled = !items.mirror;
		let startRegions = searchStartScreen ?(searchStartRegion ?[searchStartRegion] :Array.from(searchStartScreen.regions.values())) :allStartRegions.concat(fluteSpotRegions);
		if(searchStartScreen && searchAddCommonStarts)
			startRegions = startRegions.concat(allStartRegions,fluteSpotRegions);
		let options = {};
		options.saveQuitEdges = searchStartScreen && searchSaveQuitFluteEdges;
		options.fluteEdges = searchStartScreen && searchSaveQuitFluteEdges;
		for(let region of screen.regions.values())
		{
			options.keepMirrorPortal = false;
			dijkstra(region,items,options);
			let pathsToRegion = [];
			for(let start of startRegions)
			{
				if(start.distance != Infinity)
				{
					pathsToRegion.push([buildPathFromSearch(start),start.distance]);
				}
				if(document.getElementById("owsearchmirrorportals").checked && items.mirror && isDarkWorld(start.screen) === (worldState === 'I') && start.parallel && !start.parallel.mirrorBlock && start.parallel.distance != Infinity)
				{
					let path = buildPathFromSearch(start.parallel);
					if(path.length === 1 || (path[1] !== "MI" && path[1] !== "SQ"))
					{
						path.unshift(start.screen.id,"MP","MP");
						pathsToRegion.push([path,start.parallel.distance+5]);
					}
				}
			}
			if(document.getElementById("owsearchmirrorportals").checked && items.mirror && isDarkWorld(screen) !== (worldState === 'I') && region.parallel && !region.mirrorBlock)
			{
				options.keepMirrorPortal = true;
				dijkstra(region.parallel,items,options);
				for(let start of startRegions)
				{
					if(start.distance != Infinity)
					{
						let path = buildPathFromSearch(start);
						path.push("MP","MP",screen.id);
						pathsToRegion.push([path,start.distance+8]);
					}
				}
			}
			searchResults.set(region,pathsToRegion);
		}
		if(resetStartRegions)
		{
			searchStartRegion = null;
		}
		document.getElementById("owsearchstartscreenname").innerHTML = "Start: "+(searchStartScreen ?searchStartScreen.name :"Common starting locations");
		document.getElementById("owsearchstartbutton").innerHTML = searchStartScreen ?"Change" :"Select screen";
		document.getElementById("owsearchstartpanel").innerHTML = searchStartScreen ?drawSingleOverworldScreen(searchStartScreen,"search") :"";
		document.getElementById("owsearchstartpanel").style.display = searchStartScreen ?"block" :"none";
		document.getElementById("owsearchstartcommonchoice").style.display = searchStartScreen ?"block" :"none";
		if(searchStartScreen && searchStartScreen.regions.size != 1)
		{
			let s = "<div id='owstartanyregion' class='cell buttonbox dense' onclick='setSearchStartRegion(null)'>Any region</div>";
			for(let name of searchStartScreen.regions.keys())
				s += "<div id='owstartregion"+name+"' class='cell buttonbox dense' onclick='setSearchStartRegion(\""+name+"\")'>"+name+"</div>";
			document.getElementById("owsearchstartregionchoice").innerHTML = s;
			document.getElementById(searchStartRegion ?"owstartregion"+searchStartRegion.name :"owstartanyregion").classList.add("selected");
		}
		else
		{
			document.getElementById("owsearchstartregionchoice").innerHTML = "";
		}
		document.getElementById("owsearchtargetscreenname").innerHTML = "Target: "+screen.name;
		document.getElementById("owsearchtargetpanel").innerHTML = drawSingleOverworldScreen(screen,"search");
		if(screen.regions.size != 1)
		{
			let s = "<div id='owanyregion' class='cell buttonbox dense' onclick='setSearchTargetRegion(null)'>Any region</div>";
			for(let name of screen.regions.keys())
				s += "<div id='owregion"+name+"' class='cell buttonbox dense' onclick='setSearchTargetRegion(\""+name+"\")'>"+name+"</div>";
			document.getElementById("owsearchtargetregionchoice").innerHTML = s;
		}
		else
		{
			document.getElementById("owsearchtargetregionchoice").innerHTML = "";
		}
		if(resetTargetRegions)
		{
			searchTargetRegion = null;
		}
		updateSearchResults();
	};

	window.buildPathFromSearch = function(start)
	{
		let path = [start.screen.id];
		for(let current = start; current.distance > 0; current = current.nextRegion)
		{
			switch(current.nextEdgeType)
			{
				case "S":
					path.push(current.nextEdge.string,getConnectedEdge(current.nextEdge,false).string,current.nextRegion.screen.id);
					break;
				case "P":
					path.push("PO","PO",current.nextRegion.screen.id);
					break;
				case "M":
					path.push("MI","MI",current.nextRegion.screen.id);
					break;
				case "C":
					path.push("CO","CO",current.nextRegion.screen.id);
					break;
				case "Q":
					path.push("SQ","SQ",current.nextRegion.screen.id);
					break;
				case "F":
					path.push("FL","FL",current.nextRegion.screen.id);
					break;
				case "R":
					path.push("FL","FL",current.nextRegion.screen.id);
			}
		}
		return path;
	};

	window.setSearchStartRegion = function(regionName)
	{
		searchStartRegion = regionName ?searchStartScreen.regions.get(regionName) :null;
		if(regionName)
		{
			document.getElementById("owstartanyregion").classList.remove("selected");
			for(let r of searchStartScreen.regions.values())
				if(r === searchStartRegion)
					document.getElementById("owstartregion"+r.name).classList.add("selected");
				else
					document.getElementById("owstartregion"+r.name).classList.remove("selected");
		}
		else
		{
			document.getElementById("owstartanyregion").classList.add("selected");
			for(let r of searchStartScreen.regions.values())
				document.getElementById("owstartregion"+r.name).classList.remove("selected");
		}
		searchOverworldPath(false,false);
	};

	window.setSearchTargetRegion = function(regionName)
	{
		searchTargetRegion = regionName ?currentOWScreen.regions.get(regionName) :null;
		updateSearchResults();
	};

	window.updateSearchResults = function()
	{
		let paths = [],region = searchTargetRegion;
		if(region)
		{
			for(let path of searchResults.get(region))
				paths.push(path);
			if(currentOWScreen.regions.size != 1)
			{
				document.getElementById("owanyregion").classList.remove("selected");
				for(let r of searchResults.keys())
					if(r === region)
						document.getElementById("owregion"+r.name).classList.add("selected");
					else
						document.getElementById("owregion"+r.name).classList.remove("selected");
			}
		}
		else
		{
			for(let list of searchResults.values())
				for(let path of list)
					paths.push(path);
			if(currentOWScreen.regions.size != 1)
			{
				document.getElementById("owanyregion").classList.add("selected");
				for(let r of searchResults.keys())
					document.getElementById("owregion"+r.name).classList.remove("selected");
			}
		}
		paths.sort((a,b)=>a[1]-b[1]);
		for(let k = 0; k < paths.length-1; k++)
			for(let l = k+1; l < paths.length; l++)
				if(equalPaths(paths[k][0],paths[l][0]))
				{
					paths.splice(l,1);
					l--;
				}
		searchResultsLength = paths.length;
		document.getElementById("owsearchresultstext").innerHTML = "Search results ("+searchResultsLength+")";
		document.getElementById("owsearchresults").innerHTML = drawPathList(paths.map(path=>path[0]),document.getElementById("compactsearchresults").checked,"search");
		document.getElementById("owsearchresults").style.height = (searchResultsLength*66-2)*pathZoom+"px";
	};

	window.searchCanStartCommon = function()
	{
		searchAddCommonStarts = true;
		searchSaveQuitFluteEdges = false;
		document.getElementById("owsearchcanstartcommon").classList.add("selected");
		document.getElementById("owsearchonlystartscreen").classList.remove("selected");
		document.getElementById("owsearchnoflutequit").classList.remove("selected");
	};

	window.searchOnlyStartScreen = function()
	{
		searchAddCommonStarts = false;
		searchSaveQuitFluteEdges = true;
		document.getElementById("owsearchcanstartcommon").classList.remove("selected");
		document.getElementById("owsearchonlystartscreen").classList.add("selected");
		document.getElementById("owsearchnoflutequit").classList.remove("selected");
	};

	window.searchNoFluteQuit = function()
	{
		searchAddCommonStarts = false;
		searchSaveQuitFluteEdges = false;
		document.getElementById("owsearchcanstartcommon").classList.remove("selected");
		document.getElementById("owsearchonlystartscreen").classList.remove("selected");
		document.getElementById("owsearchnoflutequit").classList.add("selected");
	};

	window.drawPathList = function(paths,compact,listName)
	{
		let s = "";
		for(let k = 0; k < paths.length; k++)
			s += '<div class="row path" style="margin: 2px 0px;" onclick="showClickOverworldPathModal(event,'+k+',\''+listName+'\',\''+paths[k].join("|")+'\')">'+drawOverworldPath(paths[k],!compact,false,false)[0]+'</div>';
		return s;
	};

	window.viewMapOverworldPath = function()
	{
		fullOWPath = clickedOverworldPath;
		document.getElementById("fullowmainhighlightedpath").innerHTML = document.getElementById("fullowhighlightedpath").innerHTML = drawOverworldPath(fullOWPath,!fullPathCompact,true,false)[0];
		hideClickOverworldPathModal();
		showFullOverworldModal("editedges");
	};

	window.pinOverworldPath = function(button)
	{
		pinnedPaths.unshift(clickedOverworldPath);
		outstandingUpdate = true;
		if(clickedOverworldPathListName !== "search")
			updateMainPathLists();
		buttonFlash(button);
	};

	window.deleteOverworldPath = function()
	{
		if(clickedOverworldPathListName === "pinned")
		{
			pinnedPaths.splice(clickedOverworldPathIndex,1);
			outstandingUpdate = true;
			updateMainPathLists();
			hideClickOverworldPathModal();
		}
		if(clickedOverworldPathListName === "previous")
		{
			previousPaths.splice(clickedOverworldPathIndex,1);
			outstandingUpdate = true;
			updateMainPathLists();
			hideClickOverworldPathModal();
		}
	};

	window.updateMainPathLists = function()
	{
		document.getElementById("owpinnedtext").innerHTML = "Pinned paths ("+pinnedPaths.length+")";
		document.getElementById("owpinnedpaths").innerHTML = drawPathList(pinnedPaths,document.getElementById("compactpinned").checked,"pinned");
		document.getElementById("owpinnedpaths").style.height = (pinnedPaths.length*66-2)*pathZoom+"px";
		document.getElementById("owprevioustext").innerHTML = "Saved explored paths ("+previousPaths.length+")";
		document.getElementById("owpreviouspaths").innerHTML = drawPathList(previousPaths,document.getElementById("compactprevious").checked,"previous");
		document.getElementById("owpreviouspaths").style.height = (previousPaths.length*66-2)*pathZoom+"px";
	};

	window.equalPaths = function(path1,path2)
	{
		if(path1.length != path2.length)
			return false;
		for(let k = 0; k < path1.length; k++)
			if(path1[k] != path2[k])
				return false;
		return true;
	};

	window.buttonFlash = function(button)
	{
		if(button && !button.classList.contains("buttonaction"))
		{
			button.classList.add("buttonaction");
			setTimeout(()=>button.classList.remove("buttonaction"),1000);
		}
	};

	window.updateItemTracker = function()
	{
		for(let item of ["moonpearl","hammer","hookshot","flippers","mirror","flute","boots","book","lantern","agahnim"])
			if(ownItems[item])
				document.getElementById("item"+item).classList.add("collected");
			else
				document.getElementById("item"+item).classList.remove("collected");
		if(ownItems.gloves)
			if(ownItems.mitts)
				document.getElementById("itemgloves").classList.add("collected","mitts");
			else
			{
				document.getElementById("itemgloves").classList.add("collected");
				document.getElementById("itemgloves").classList.remove("mitts");
			}
		else
		{
			ownItems.mitts = false;
			document.getElementById("itemgloves").classList.remove("collected","mitts");
		}
		for(let item of ["connectortr","connectorhccsanc","connectorhcchcb","connectorboesanc","connectorboehcb","connectorboehcc","connectorsanchcb","connectorsanchcc"])
			document.getElementById(item).checked = ownItems[item];
	};

	window.drawFullOverworldPanels = function()
	{
		if(showFullMapMain && document.getElementById("owmain").style.display === "block")
			drawFullOverworldPanel(true);
		if(!useMain)
			drawFullOverworldPanel(false);
	};

	window.drawFullOverworldPanelCurrent = function()
	{
		drawFullOverworldPanel(useMain);
	};

	window.drawFullOverworldPanel = function(main)
	{
		let drawDarkWorld = main ?drawDarkWorldMain :drawDarkWorldPopout;
		let sideBySide = main ?sideBySideMain :sideBySidePopout;
		let mainString = main ?"fullowmain" :"fullow";
		let mode = main ?"editedges" :fullOverworldMode;
		document.getElementById(mainString+"paneloverlay").innerHTML = "";
		document.getElementById(mainString+"panelpathoverlay").style.display = "block";
		let visitedScreenEdges = reachableEdges;
		let fixedScreen = fullOWConnectorStart ?fullOWConnectorStart :fullOWSelectedScreen;
		let fixedEdge = !main && mode === "continuepath" ?fullOWFixedEdge :fullOWSelectedEdge;
		let s = "";
		for(let [id,screen] of overworldScreens)
		{
			let darkWorld = isDarkWorld(screen);
			if((!sideBySide && darkWorld != drawDarkWorld) || (screen.special && mode === "editflutespots"))
				continue;
			let unknownScreen = mixedow && screen.mixedState === "unknown" && mode !== "editflutespots";
			let scale = .5,classes = "owscreen full",onClick = unknownScreen ?"" :"clickScreenFull(event,"+id+","+main+")",valid = true;
			if(screen.big)
				classes += " bigscreen";
			if(screen === fixedScreen)
				classes += " active";
			if(fullOWConnectorStart)
				valid = screen.entranceRegions.length;
			if(valid && fixedEdge)
			{
				valid = false;
				for(let edge of screen.edges.values())
					if(edgesCompatible(edge,fixedEdge))
					{
						valid = true;
						break;
					}
			}
			let indexInPath = -1;
			if(mode === "editedges" && !fullOWSelectedScreen && !fullOWSelectedEdge && !fullOWConnectorStart && fullOWPath)
			{
				indexInPath = fullOWPath.indexOf(id);
				if(indexInPath === -1)
					valid = false;
			}
			if(!valid)
				classes += " gray";
			if(unknownScreen)
				classes += " unknown";
			let x = screen.special ?screen.x :id%8*128*scale;
			let y = screen.special ?screen.y :(id%0x40 >> 3)*128*scale;
			if(sideBySide && darkWorld != drawDarkWorld)
				x += 1024*scale;
			s += "<div id='full"+(main ?"main" :"popout")+id+"' class='"+classes+"' onclick='"+onClick+(unknownScreen || (owshuffle === 'N' && crossedow !== 'C') ?"' " :"' onmouseover='hoverScreen("+id+","+main+")' onmouseout='clearFullOverlay("+main+")' ");
			if(screen.special)
				s += "style='left: "+x+"px; top: "+y+"px; z-index: 1'><div class='specialshadow'><img class='roomnodeimg' src='./images/overlay/"+screen.file+".png' style='transform: scale("+scale+");'></div>";
			else
				s += "style='left: "+x+"px; top: "+y+"px;'><img class='roomnodeimg' src='./images/overlay/"+(screen.darkWorld ?"dark" :"light")+"world.png' style='transform: translateX(-"+x%(1024*scale)+"px) translateY(-"+y+"px) scale("+scale+");'>";
			s += "<span class='roomtt'>";
			if(unknownScreen)
			{
				let left = getBigScreenSubareaX(screen),top = getBigScreenSubareaY(screen);
				s += "<span class='fullmixed normal' "+(top ?"style='left: "+(left+4)+"px; top: "+(top+4)+"px;' " :"")+"onclick='clickNormalScreen("+id+")'>Normal</span>";
				s += "<span class='fullmixed swapped' "+(top ?"style='left: "+(left+4)+"px; top: "+(top+34)+"px;' " :"")+"onclick='clickSwappedScreen("+id+")'>Swapped</span>";
				s += "</span><span class='questionmark"+(checkableScreens.has(id&0xBF) ?" greentext" :(maybeCheckableScreens.has(id&0xBF) ?" yellowtext" :""))+"'"+(top ?" style='left: "+left+"px; top: "+top+"px;' " :"")+">?";
			}
			else
				s += "<label class='ttlabel'"+(x+y ?"" :" style='line-height: 144px;'")+">"+screen.name+"</label>";
			s += "</span></div>";
			if((mode === "editflutespots" || (fluteshuffle && ownItems.flute && document.getElementById("activeflutebox").checked)) && darkWorld === (worldState === 'I') && customFluteSpots.includes(id%0x40))
				s += "<div class='flutesymbol' style='left: "+(x+getBigScreenSubareaX(screen)+16)+"px; top: "+(y+getBigScreenSubareaY(screen)+16)+"px; opacity: "+(mode === "editflutespots" ?1 :.75)+"'></div>";
			if(!fullOWConnectorStart && !unknownScreen && (mode !== "editflutespots") && (owshuffle !== 'N' || crossedow === 'C'))
				for(let edge of screen.edges.values())
					if(!fixedEdge || edge === fixedEdge || edgesCompatible(edge,fixedEdge))
					{
						classes = "owedge "+className[edge.direction];
						if(edge === fixedEdge || edge === fullOWSelectedEdge)
							classes += " active";
						if(edge.out && darkWorld !== isDarkWorld(edge.out.screen))
							classes += " owedgecrossed";
						if(visitedScreenEdges.has(edge))
							classes += edge.out ?" turqoise" :" green";
						else
							classes += edge.out ?" blue" :" red";
						s += "<div class='"+classes+"' style='left: "+(x+edge.x*128*scale-8)+"px; top: "+(y+edge.y*128*scale-8)+"px;"+(screen.special ?" z-index: 1;" :"")+"'";
						if(mode === "editedges")
							s += " onclick='clickEdgeFull("+id+",\""+edge.string+"\","+main+")' onmouseover='hoverEdge("+id+",\""+edge.string+"\","+main+")' onmouseout='clearFullOverlay("+main+")'";
						s += "></div>";
					}
			if((id === 0x18 || (id === 0x58 && !sideBySide)) && !fullOWConnectorStart && ownItems.flute && !document.getElementById("activeflutebox").checked)
				s += "<span class='activateflute"+(visitedScreenEdges.has(overworldScreens.get(0x18).edges.get("N0")) && (ownItems.moonpearl || (id === 0x18) === (darkWorld === (worldState === 'I'))) ?" green" :"")+"' style='left: "+(x+16)+"px; top: "+(y+26)+"px;' onclick='clickFluteActivated()'>Flute activated</span>";
			if(id%0x40 === 0x18 && (darkWorld === (worldState === 'I') || !sideBySide) && mode === "editedges" && !fullOWConnectorStart && fluteshuffle && customFluteSpots.length != 8 && ownItems.flute && document.getElementById("activeflutebox").checked)
				s += "<span class='activateflute"+(true ?" green" :"")+"' style='left: "+(x+16)+"px; top: "+(y+26)+"px;' onclick='clickSetFluteSpots()'>Set flute spots</span>";
			if(id%0x40 === 0x30 && mixedow && !darkWorld)
				s += "<div class='lightworldsymbol' style='left: "+(x+1)+"px; top: "+(y+47)+"px;'></div>";
			if(id%0x40 === 0x30 && mixedow && darkWorld)
				s += "<div class='darkworldsymbol' style='left: "+(x+1)+"px; top: "+(y+47)+"px;'></div>";
			if(indexInPath !== -1)
				s += "<div class='pathnumber' style='left: "+(x+getBigScreenSubareaX(screen)+24)+"px; top: "+(y+getBigScreenSubareaY(screen)+24)+"px;'>"+indexInPath/3+"</div>";
		}
		document.getElementById(mainString+"panelmain").innerHTML = s;
		if(mode === "editedges" && fullOWPath)
		{
			s = "";
			for(let k = 0; k < fullOWPath.length; k += 3)
			{
				if(k != 0 && !specialEdgeTypes.includes(fullOWPath[k-1]))
				{
					let screen1 = overworldScreens.get(fullOWPath[k-3]),screen2 = overworldScreens.get(fullOWPath[k]),scale = .5;
					let edge1 = screen1.edges.get(fullOWPath[k-2]),edge2 = screen2.edges.get(fullOWPath[k-1]);
					let x = screen1.special ?screen1.x :screen1.id%8*128*scale;
					let y = screen1.special ?screen1.y :(screen1.id%0x40 >> 3)*128*scale;
					if(sideBySide && isDarkWorld(screen1) != drawDarkWorld)
						x += 1024*scale;
					s += drawFullEdgeConnection(edge1,edge2,x,y,sideBySide || isDarkWorld(screen1) === isDarkWorld(screen2) ?1 :.5);
					s += "<div class='owedgedot' style='left: "+(x+edge1.x*128*scale-4)+"px; top: "+(y+edge1.y*128*scale-4)+"px;'></div>";
					x = screen2.special ?screen2.x :screen2.id%8*128*scale;
					y = screen2.special ?screen2.y :(screen2.id%0x40 >> 3)*128*scale;
					if(sideBySide && isDarkWorld(screen2) != drawDarkWorld)
						x += 1024*scale;
					s += "<div class='owedgedot to' style='left: "+(x+edge2.x*128*scale-4)+"px; top: "+(y+edge2.y*128*scale-4)+"px;'></div>";
				}
			}
			document.getElementById(mainString+"panelpathoverlay").innerHTML = s;
		}
		if(!main && mode === "editflutespots")
			document.getElementById(mainString+"flutespotstext").innerHTML = customFluteSpots.length+"/8 flute spots currently set";
	};

	window.getBigScreenSubareaX = function(screen)
	{
		return screen.big && screen.id%0x40 !== 0x05 ?(screen.id%0x40 === 0x1E || screen.id%0x40 === 0x30 ?64 :32) :0;
	};

	window.getBigScreenSubareaY = function(screen)
	{
		return screen.big ?(screen.id%0x40 === 0x00 || screen.id%0x40 === 0x18 ?64 :32) :0;
	};

	window.clickNormalScreen = function(id)
	{
		setMixedScreen(overworldScreens.get(id),"normal");
		outstandingUpdate = true;
		updateReachableEdges();
		drawFullOverworldPanels();
	};

	window.clickSwappedScreen = function(id)
	{
		setMixedScreen(overworldScreens.get(id),"swapped");
		outstandingUpdate = true;
		updateReachableEdges();
		drawFullOverworldPanels();
	};

	window.drawSingleOverworldScreen = function(screen,mode)
	{
		let visitedScreenEdges = reachableEdges;
		let s = "";
		let scale = 1,classes = mode === "search" ?"owscreen single" :"bigowscreen single";
		if(screen.big)
			scale = .5;
		if(mode === "search")
			scale /= 2;
		let x = screen.special ?0 :screen.id%8*128*scale;
		let y = screen.special ?0 :(screen.id%0x40 >> 3)*128*scale;
		let file = screen.special ?screen.file :(screen.darkWorld ?"darkworld" :"lightworld");
		s += "<div class='"+classes+"' style='left: "+0+"px; top: "+0+"px;'><img class='bigroomnodeimg' src='./images/overlay/"+file+".png' style='transform: translateX(-"+x+"px) translateY(-"+y+"px) scale("+scale+");'></div>";
		if(mode !== "connector" && mode !== "search")
			for(let [edgeString,edge] of screen.edges)
				if(mode === "alledges" || (edge.direction === extraOWDirection && !edge.water))
				{
					classes = "bigowedge "+className[edge.direction];
					if(visitedScreenEdges.has(edge))
						classes += edge.out ?" turqoise" :" green";
					else
						classes += edge.out ?" blue" :" red";
					let onClick = mode === "alledges" ?"appendToOverworldPath(\""+edgeString+"\")" :"selectTargetEdge("+edge.symbol+")";
					s += "<div class='"+classes+"' style='left: "+(edge.x2*128*scale-12)+"px; top: "+(edge.y2*128*scale-12)+"px;' onclick='"+onClick+"'></div>";
				}
		return s;
	};

	window.drawFullEdgeConnection = function(edge1,edge2,x1,y1,opacity,main)
	{
		let scale = .5;
		let lastEdgeX = x1+edge1.x*128*scale;
		let lastEdgeY = y1+edge1.y*128*scale;
		let newX = (edge2.screen.special ?edge2.screen.x :edge2.screen.id%8*128*scale)+edge2.x*128*scale;
		let newY = (edge2.screen.special ?edge2.screen.y :(edge2.screen.id%0x40 >> 3)*128*scale)+edge2.y*128*scale;
		if((main ?sideBySideMain :sideBySidePopout) && isDarkWorld(edge2.screen) != (main ?drawDarkWorldMain :drawDarkWorldPopout))
			newX += 1024*scale;
		let minX = Math.min(lastEdgeX,newX),maxX = Math.max(lastEdgeX,newX);
		let minY = Math.min(lastEdgeY,newY),maxY = Math.max(lastEdgeY,newY);
		return "<div class='crossed"+(((lastEdgeY > newY) != (lastEdgeX > newX)) ?"left" :"right")+"' style='left: "+minX+"px; top: "+minY+"px; width: "+(maxX-minX)+"px; height: "+(maxY-minY)+"px; opacity: "+opacity+";'></div>";
	};

	window.hoverScreen = function(id,main)
	{
		let screen = overworldScreens.get(id),s = "",scale = .5;
		let x = screen.special ?screen.x :id%8*128*scale;
		let y = screen.special ?screen.y :(id%0x40 >> 3)*128*scale;
		if((main ?sideBySideMain :sideBySidePopout) && isDarkWorld(screen) != (main ?drawDarkWorldMain :drawDarkWorldPopout))
			x += 1024*scale;
		for(let edge of screen.edges.values())
			if(edge.out)
				s += drawFullEdgeConnection(edge,edge.out,x,y,(main ?sideBySideMain :sideBySidePopout) || isDarkWorld(screen) === isDarkWorld(edge.out.screen) ?1 :.5,main);
		document.getElementById(main ?"fullowmainpaneloverlay" :"fullowpaneloverlay").innerHTML = s;
		document.getElementById(main ?"fullowmainpanelpathoverlay" :"fullowpanelpathoverlay").style.display = "none";
	};

	window.hoverEdge = function(id,edgeString,main)
	{
		let screen = overworldScreens.get(id),s = "",scale = .5;
		let edge = screen.edges.get(edgeString);
		if(edge.out)
		{
			let x = screen.special ?screen.x :id%8*128*scale;
			let y = screen.special ?screen.y :(id%0x40 >> 3)*128*scale;
			if((main ?sideBySideMain :sideBySidePopout) && isDarkWorld(screen) != (main ?drawDarkWorldMain :drawDarkWorldPopout))
				x += 1024*scale;
			s += drawFullEdgeConnection(edge,edge.out,x,y,(main ?sideBySideMain :sideBySidePopout) || isDarkWorld(screen) === isDarkWorld(edge.out.screen) ?1 :.5,main);
		}
		document.getElementById(main ?"fullowmainpaneloverlay" :"fullowpaneloverlay").innerHTML = s;
		document.getElementById(main ?"fullowmainpanelpathoverlay" :"fullowpanelpathoverlay").style.display = "none";
	};

	window.clearFullOverlay = function(main)
	{
		document.getElementById(main ?"fullowmainpaneloverlay" :"fullowpaneloverlay").innerHTML = "";
		document.getElementById(main ?"fullowmainpanelpathoverlay" :"fullowpanelpathoverlay").style.display = "block";
	};

	window.hoverPathNumber = function(id)
	{
		let element = document.getElementById("full"+(useMain ?"main" :"popout")+id);
		if(element)
			element.classList.add("highlighted");
		hoveredPathNumber = id;
	};

	window.clearPathNumber = function()
	{
		let element = document.getElementById("full"+(useMain ?"main" :"popout")+hoveredPathNumber);
		if(element)
			element.classList.remove("highlighted");
		hoveredPathNumber = -1;
	};

	window.showFullOverworldModal = function(mode)
	{
		disableUseMain();
		fullOverworldMode = mode;
		if(mode !== "continuepath")
		{
			fullOWFixedEdge = null;
			if(outstandingUpdate)
				sendUpdate();
		}
		document.getElementById("fullowtitle").innerHTML = fullOWTitle[mode];
		if(mode === "newpath" || mode === "searchpath")
			document.getElementById("fullowpanel").classList.add("pointer");
		else
			document.getElementById("fullowpanel").classList.remove("pointer");
		if(mode === "editedges")
			document.getElementById("fullowpanel").classList.add("clickedges");
		else
			document.getElementById("fullowpanel").classList.remove("clickedges");
		fullOWSelectedScreen = fullOWSelectedEdge = fullOWConnectorStart = null;
		document.getElementById("fullowscreenactions").style.display = "none";
		document.getElementById("fullownewpath").style.display = owshuffle === 'N' ?"none" :"block";
		document.getElementById("fullowmixedactions").style.display = mixedow ?"block" :"none";
		document.getElementById("fullowswapscreenwithedges").style.display = (owshuffle !== 'N' || crossedow === 'C') ?"block" :"none";
		document.getElementById("fullownewconnector").style.display = entranceEnabled && !document.getElementById("connectorsync").checked && !document.getElementById("globalsync").checked ?"block" :"none";
		document.getElementById("fullowedgeactions").style.display = "none";
		document.getElementById("fullowconnectoractions").style.display = "none";
		document.getElementById("fullowsearchpresets").style.display = mode === "searchpath" ?"block" :"none";
		document.getElementById("fullowcommonstarts").style.display = mode === "searchpathstart" ?"block" :"none";
		document.getElementById("fullowflutespots").style.display = mode === "editflutespots" ?"block" :"none";
		document.getElementById("fullowpathactions").style.display = mode === "editedges" && fullOWPath ?"block" :"none";
		fullCheckConnectorDetails();
		drawFullOverworldPanel(false);
		document.getElementById("fullowModal").style.display = "block";
		if(fullZoomAutoPopout)
			calculateFullZoomPopout();
	};

	window.hideFullOverworldModal = function()
	{
		enableUseMain();
		document.getElementById("fullowModal").style.display = "none";
		if(fullOWFixedEdge)
		{
			while(currentOWPath.length%3 > 1)
				currentOWPath.pop();
			updateCurrentOverworldPath();
		}
		if(outstandingUpdate)
			sendUpdate();
	};

	window.showOverworldConnectorModal = function()
	{
		document.getElementById("bigowscreenstartpanel").innerHTML = drawSingleOverworldScreen(fullOWConnectorStart,"connector");
		document.getElementById("bigowscreenendpanel").innerHTML = drawSingleOverworldScreen(fullOWConnectorEnd,"connector");
		document.getElementById("connectorstartscreenname").innerHTML = fullOWConnectorStart.name;
		document.getElementById("connectorendscreenname").innerHTML = fullOWConnectorEnd.name;
		let s = "";
		for(let region of fullOWConnectorStart.entranceRegions)
		{
			let id = "cstart"+region.name.replace(/\s+/g,"");			
			s += "<div><label><input type='radio' id='"+id+"' name='connectorstartgroup' value='"+region.name+"' onclick='updateConnectorButton()'>"+region.name+" ("+region.numberEntrances+")</label></div>";
		}
		document.getElementById("connectorstartregions").innerHTML = s;
		if(fullOWConnectorStart.entranceRegions.length === 1)
			document.getElementById("cstart"+fullOWConnectorStart.entranceRegions[0].name.replace(/\s+/g,"")).checked = true;
		s = "";
		for(let region of fullOWConnectorEnd.entranceRegions)
		{
			let id = "cend"+region.name.replace(/\s+/g,"");			
			s += "<div><label><input type='radio' id='"+id+"' name='connectorendgroup' value='"+region.name+"' onclick='updateConnectorButton()'>"+region.name+" ("+region.numberEntrances+")</label></div>";
		}
		document.getElementById("connectorendregions").innerHTML = s;
		if(fullOWConnectorEnd.entranceRegions.length === 1)
			document.getElementById("cend"+fullOWConnectorEnd.entranceRegions[0].name.replace(/\s+/g,"")).checked = true;
		document.getElementById("connectorbidirectional").checked = false;
		updateConnectorButton();
		document.getElementById("owconnectorModal").style.display = "block";
	};

	window.hideOverworldConnectorModal = function()
	{
		if(!backToMain)
			fullOWConnectorStart = fullOWConnectorEnd = null;
		if(showFullMapMain && document.getElementById("owmain").style.display === "block")
			loadFullOverworldMain();
		document.getElementById("owconnectorModal").style.display = "none";
	};

	window.showOverworldExtraModal = function(options)
	{
		document.getElementById("bigowscreenpanel").innerHTML = drawSingleOverworldScreen(extraOWScreen,"extra");
		for(let k = 0; k < 3; k++)
			if(options[k])
				document.getElementById("edgebutton"+k).classList.remove("disabled");
			else
				document.getElementById("edgebutton"+k).classList.add("disabled");
		if(extraOWDirection == "N" || extraOWDirection == "S")
		{
			document.getElementById("edgebutton0").innerHTML = "Left";
			document.getElementById("edgebutton2").innerHTML = "Right";
		}
		else
		{
			document.getElementById("edgebutton0").innerHTML = "Up";
			document.getElementById("edgebutton2").innerHTML = "Down";
		}
		document.getElementById("owextraModal").style.display = "block";
	};

	window.hideOverworldExtraModal = function()
	{
		document.getElementById("owextraModal").style.display = "none";
		if(fullOWFixedEdge)
		{
			while(currentOWPath.length%3 > 1)
				currentOWPath.pop();
			updateCurrentOverworldPath();
		}
	};

	window.showClickOverworldPathModal = function(event,pathIndex,listName,pathString)
	{
		let width = document.body.clientWidth-64;
		clickedOverworldPathIndex = pathIndex;
		clickedOverworldPathListName = listName;
		clickedOverworldPath = pathString.split("|");
		for(let k = 0; k < clickedOverworldPath.length; k += 3)
			clickedOverworldPath[k] = parseInt(clickedOverworldPath[k]);
		let [drawn,,height] = drawOverworldPath(clickedOverworldPath,true,false,true,(width-8)/pathZoom);
		height *= pathZoom;
		document.getElementById("currentclickedowpath").style.height = height+"px";
		document.getElementById("currentclickedowpath").innerHTML = drawn;
		document.getElementById("saveowpath").style.display = listName === "pinned" ?"none" :"block";
		document.getElementById("deleteowpath").style.display = listName === "search" ?"none" :"block";
		document.getElementById("clickOWPathModalMain").style.left = "40px";
		document.getElementById("clickOWPathModalMain").style.top = Math.min(event.clientY-20,window.innerHeight-height-48)+"px";
		document.getElementById("clickOWPathModalMain").style.width = width+"px";
		document.getElementById("clickOWPathModal").style.display = "block";
	};

	window.hideClickOverworldPathModal = function()
	{
		document.getElementById("clickOWPathModal").style.display = "none";
	};

	window.showClickConnectorModal = function(event,index)
	{
		clickedConnectorIndex = index;
		let connector = entranceConnectors[index];
		let regionStart = overworldScreens.get(connector.data[0]).regions.get(connector.data[1]),regionEnd = overworldScreens.get(connector.data[2]).regions.get(connector.data[3]);
		let s = regionStart.screen.name;
		if(regionStart.screen.entranceRegions.length != 1)
			s += " - "+regionStart.name;
		document.getElementById("currentclickedconnectorstart").innerHTML = "Start: "+s;
		s = regionEnd.screen.name;
		if(regionEnd.screen.entranceRegions.length != 1)
			s += " - "+regionEnd.name;
		document.getElementById("currentclickedconnectorend").innerHTML = "End: "+s;
		document.getElementById("currentclickedconnectordirections").innerHTML = "Direction(s): "+(connector.status === "both" ?"Both" :(connector.status === "unknown" ?"Unknown (treated as one)" :"One"));
		if(connector.status === "single")
			document.getElementById("clickedconnectorone").classList.add("disabled");
		else
			document.getElementById("clickedconnectorone").classList.remove("disabled");
		if(connector.status === "both")
			document.getElementById("clickedconnectortwo").classList.add("disabled");
		else
			document.getElementById("clickedconnectortwo").classList.remove("disabled");
		if(connector.status === "unknown")
			document.getElementById("clickedconnectorunknown").classList.add("disabled");
		else
			document.getElementById("clickedconnectorunknown").classList.remove("disabled");
		document.getElementById("clickedconnectordelete").style.display = document.getElementById("connectorsync").checked || document.getElementById("globalsync").checked ?"none" :"block";
		document.getElementById("clickconnectorModalMain").style.left = (visibleSidebar ?"64" :"4")+"px";
		document.getElementById("clickconnectorModalMain").style.top = Math.min(event.clientY-20,window.innerHeight-144)+"px";
		document.getElementById("clickconnectorModal").style.display = "block";
	};

	window.hideClickConnectorModal = function()
	{
		document.getElementById("clickconnectorModal").style.display = "none";
	};

	window.updateConnectorButton = function()
	{
		if(document.querySelector("input[name='connectorstartgroup']:checked") && document.querySelector("input[name='connectorendgroup']:checked"))
			document.getElementById("saveconnector").classList.remove("disabled");
		else
			document.getElementById("saveconnector").classList.add("disabled");
	};

	window.switchFullOverworldMain = function()
	{
		drawDarkWorldMain = !drawDarkWorldMain;
		drawFullOverworldPanel(true);
	};

	window.switchFullOverworldPopout = function()
	{
		drawDarkWorldPopout = !drawDarkWorldPopout;
		drawFullOverworldPanel(false);
	};

	window.toggleSideBySideMain = function()
	{
		sideBySideMain = !sideBySideMain;
		outstandingUpdate = true;
		if(fullZoomAutoMain)
			calculateFullZoomMain();
		drawFullOverworldPanel(true);
	};

	window.toggleSideBySidePopout = function()
	{
		sideBySidePopout = !sideBySidePopout;
		outstandingUpdate = true;
		if(fullZoomAutoPopout)
			calculateFullZoomPopout();
		drawFullOverworldPanel(false);
	};

	window.zoomAutoFullOverworldMain = function(checkbox)
	{
		fullZoomAutoMain = checkbox.checked;
		outstandingUpdate = true;
		if(fullZoomAutoMain)
			calculateFullZoomMain();
	};

	window.zoomAutoFullOverworldPopout = function(checkbox)
	{
		fullZoomAutoPopout = checkbox.checked;
		outstandingUpdate = true;
		if(fullZoomAutoPopout)
			calculateFullZoomPopout();
	};

	window.zoomOutFullOverworldMain = function()
	{
		fullZoomAutoMain = document.getElementById("mainzoomautoow").checked = false;
		outstandingUpdate = true;
		if(fullZoomMain > .5)
		{
			fullZoomMain = Math.ceil(fullZoomMain*20-.0001)/20-.05;
			applyFullOverworldZoomMain();
			document.getElementById("mainzoominow").classList.remove("disabled");
			if(fullZoomMain <= .5)
				document.getElementById("mainzoomoutow").classList.add("disabled");
			else
				document.getElementById("mainzoomoutow").classList.remove("disabled");
		}
	};

	window.zoomOutFullOverworldPopout = function()
	{
		fullZoomAutoPopout = document.getElementById("zoomautoow").checked = false;
		outstandingUpdate = true;
		if(fullZoomPopout > .5)
		{
			fullZoomPopout = Math.ceil(fullZoomPopout*20-.0001)/20-.05;
			applyFullOverworldZoomPopout();
			document.getElementById("zoominow").classList.remove("disabled");
			if(fullZoomPopout <= .5)
				document.getElementById("zoomoutow").classList.add("disabled");
			else
				document.getElementById("zoomoutow").classList.remove("disabled");
		}
	};

	window.zoomInFullOverworldMain = function()
	{
		fullZoomAutoMain = document.getElementById("mainzoomautoow").checked = false;
		outstandingUpdate = true;
		if(fullZoomMain < 1.5)
		{
			fullZoomMain = Math.floor(fullZoomMain*20+.0001)/20+.05;
			applyFullOverworldZoomMain();
			document.getElementById("mainzoomoutow").classList.remove("disabled");
			if(fullZoomMain >= 1.5)
				document.getElementById("mainzoominow").classList.add("disabled");
			else
				document.getElementById("mainzoominow").classList.remove("disabled");
		}
	};

	window.zoomInFullOverworldPopout = function()
	{
		fullZoomAutoPopout = document.getElementById("zoomautoow").checked = false;
		outstandingUpdate = true;
		if(fullZoomPopout < 1.5)
		{
			fullZoomPopout = Math.floor(fullZoomPopout*20+.0001)/20+.05;
			applyFullOverworldZoomPopout();
			document.getElementById("zoomoutow").classList.remove("disabled");
			if(fullZoomPopout >= 1.5)
				document.getElementById("zoominow").classList.add("disabled");
			else
				document.getElementById("zoominow").classList.remove("disabled");
		}
	};

	window.resizeHandler = function()
	{
		if(fullZoomAutoMain && showFullMapMain && document.getElementById("owmain").style.display === "block")
			calculateFullZoomMain();
		if(fullZoomAutoPopout && !useMain)
			calculateFullZoomPopout();
	};

	window.calculateFullZoomMain = function()
	{
		let maxWidth = document.body.clientWidth-(visibleSidebar ?72 :0),maxHeight = window.innerHeight-252;
		if(sideBySideMain)
			maxWidth /= 2;
		let size = Math.max(256,Math.min(Math.min(maxWidth,maxHeight),768));
		fullZoomMain = size/512;
		applyFullOverworldZoomMain();
		if(fullZoomMain <= .5)
			document.getElementById("mainzoomoutow").classList.add("disabled");
		else
			document.getElementById("mainzoomoutow").classList.remove("disabled");
		if(fullZoomMain >= 1.5)
			document.getElementById("mainzoominow").classList.add("disabled");
		else
			document.getElementById("mainzoominow").classList.remove("disabled");
	};

	window.calculateFullZoomPopout = function()
	{
		let maxWidth = document.body.clientWidth-14,maxHeight = window.innerHeight-212;
		if(sideBySidePopout)
			maxWidth /= 2;
		let size = Math.max(256,Math.min(Math.min(maxWidth,maxHeight),768));
		fullZoomPopout = size/512;
		applyFullOverworldZoomPopout();
		if(fullZoomPopout <= .5)
			document.getElementById("zoomoutow").classList.add("disabled");
		else
			document.getElementById("zoomoutow").classList.remove("disabled");
		if(fullZoomPopout >= 1.5)
			document.getElementById("zoominow").classList.add("disabled");
		else
			document.getElementById("zoominow").classList.remove("disabled");
	};

	window.applyFullOverworldZoomMain = function()
	{
		document.getElementById("fullowmainpanel").style.width = 512*(sideBySideMain ?2 :1)+"px";
		document.getElementById("fullowmainpanelrow").style.height = 512*fullZoomMain+"px";
		document.getElementById("fullowmainpanel").style.transform = "scale("+fullZoomMain+")";
	};

	window.applyFullOverworldZoomPopout = function()
	{
		document.getElementById("fullowpanel").style.width = 512*(sideBySidePopout ?2 :1)+"px";
		document.getElementById("fullowpanelrow").style.height = 512*fullZoomPopout+"px";
		document.getElementById("fullowpanel").style.transform = "scale("+fullZoomPopout+")";
	};

	window.zoomOutOverworldPath = function()
	{
		pathZoom = Math.max(.5,Math.ceil(pathZoom*8-.0001)/8-.125);
		outstandingUpdate = true;
		applyOverworldPathZoom();
	};

	window.zoomInOverworldPath = function()
	{
		pathZoom = Math.min(Math.floor(pathZoom*8+.0001)/8+.125,2);
		outstandingUpdate = true;
		applyOverworldPathZoom();
	};

	window.applyOverworldPathZoom = function()
	{
		document.getElementById("owpinnedpaths").style.transform = "scale("+pathZoom+")";
		document.getElementById("owpreviouspaths").style.transform = "scale("+pathZoom+")";
		document.getElementById("owsearchresults").style.transform = "scale("+pathZoom+")";
		document.getElementById("currentclickedowpath").style.transform = "scale("+pathZoom+")";
		document.getElementById("owpinnedpaths").style.height = (pinnedPaths.length*66-2)*pathZoom+"px";
		document.getElementById("owpreviouspaths").style.height = (previousPaths.length*66-2)*pathZoom+"px";
		document.getElementById("owsearchresults").style.height = (searchResultsLength*66-2)*pathZoom+"px";
		if(pathZoom <= .5)
		{
			document.getElementById("zoomoutowpathpinned").classList.add("disabled");
			document.getElementById("zoomoutowpathprevious").classList.add("disabled");
			document.getElementById("zoomoutowpathsearch").classList.add("disabled");
		}
		else
		{
			document.getElementById("zoomoutowpathpinned").classList.remove("disabled");
			document.getElementById("zoomoutowpathprevious").classList.remove("disabled");
			document.getElementById("zoomoutowpathsearch").classList.remove("disabled");
		}
		if(pathZoom >= 2)
		{
			document.getElementById("zoominowpathpinned").classList.add("disabled");
			document.getElementById("zoominowpathprevious").classList.add("disabled");
			document.getElementById("zoominowpathsearch").classList.add("disabled");
		}
		else
		{
			document.getElementById("zoominowpathpinned").classList.remove("disabled");
			document.getElementById("zoominowpathprevious").classList.remove("disabled");
			document.getElementById("zoominowpathsearch").classList.remove("disabled");
		}
	};

	window.getModifiedOwnItems = function()
	{
		let items = Object.assign({},ownItems);
		items.follower = null;
		if(!document.getElementById("activeflutebox").checked)
			items.flute = false;
		if(!document.getElementById("globalsync").checked && !document.getElementById("itemsync").checked)
		{
			items.bomb = true;
			items.cape = false;
		}
		if(doorshuffle === 'N')
		{
			items.connectorhcchcb = items.connectorboesanc = true;
			items.connectorboehcb = items.connectorboehcc = items.connectorsanchcb = items.connectorsanchcc = false;
		}
		if(!items.gloves)
		{
			items.connectorboesanc = items.connectorboehcb = items.connectorboehcc = false;
		}
		return items;
	};

	window.updateReachableEdges = function()
	{
		let items = getModifiedOwnItems();
		checkableScreens.clear();
		maybeCheckableScreens.clear();
		continueRegions.clear();
		fixedStartRegions = [];
		fluteSpotRegions = [];
		let maybeVisitedRegions = new Set(),evr = new Set(),mvrl = new Set(),mvrd = new Set();
		let visitedRegions = new Set(),visitedScreenEdges = new Set();
		if(document.getElementById("pinnedlinkshouse").checked)
			inspectStartRegion(0x2C,"Main",true);
		if(document.getElementById("pinnedsanctuary").checked)
			inspectStartRegion(0x13,"Main",true);
		if(document.getElementById("pinnedoldman").checked)
			inspectStartRegion(0x03,"Bottom",false);
		if(document.getElementById("pinnedpyramid").checked)
			inspectStartRegion(0x5B,"Balcony",false);
		if(items.flute)
			for(let id of fluteshuffle ?customFluteSpots :[0x03,0x16,0x18,0x2C,0x2F,0x30,0x3B,0x3F])
				inspectStartRegion(id,null,false);
		allStartRegions = fixedStartRegions.concat(customStartRegions);
		let startRegions = allStartRegions.concat(fluteSpotRegions);
		let options = {};
		for(let start of startRegions)
			if(!visitedRegions.has(start) && (!mixedow || start.screen.mixedState !== "unknown"))
				explore(start,items,options,visitedRegions,visitedScreenEdges,checkableScreens,continueRegions,emptyMap);
		if(mixedow && checkableScreens.size != 0)
		{//Find more checkable screens (bad algorithm, but works well enough to be useful)
			let assumedScreens = new Set();
			let nextScreens = checkableScreens;
			let cr = new Map(continueRegions);
			let mcr = new Map();
			let maybeMode = false;
			while(nextScreens.size != 0)
			{
				let cs = Array.from(nextScreens);
				nextScreens = new Set();
				for(let id of cs)
				{
					if(assumedScreens.has(id))
						continue;
					let assumptions = new Map();
					let regionsAssumeNormal = new Set(visitedRegions),regionsAssumeSwapped = new Set(visitedRegions);
					let edgesAssumeNormal = new Set(visitedScreenEdges),edgesAssumeSwapped = new Set(visitedScreenEdges);
					let checkableAssumeNormal = new Set(checkableScreens),checkableAssumeSwapped = new Set(checkableScreens);
					let continueAssumeNormal = new Map(),continueAssumeSwapped = new Map();
					let group = getScreenLinkGroup(id);
					for(let n of group)
						assumedScreens.add(n);
					for(let n of group)
						assumptions.set(n,"normal");
					for(let n of group)
						if(cr.has(n+" normal"))
							for(let start of cr.get(n+" normal"))
								explore(start,items,options,regionsAssumeNormal,edgesAssumeNormal,checkableAssumeNormal,continueAssumeNormal,assumptions);
					for(let n of group)
						assumptions.set(n,"swapped");
					for(let n of group)
						if(cr.has(n+" swapped"))
							for(let start of cr.get(n+" swapped"))
								explore(start,items,options,regionsAssumeSwapped,edgesAssumeSwapped,checkableAssumeSwapped,continueAssumeSwapped,assumptions);
					let diffNormal = setDifference(checkableAssumeNormal,new Set()),diffSwapped = setDifference(checkableAssumeSwapped,new Set());
					let commonCheckable = setIntersection(diffNormal,diffSwapped);
					let maybeCheckable = setUnion(checkableAssumeNormal,checkableAssumeSwapped);
					if(!maybeMode)
						for(let c of commonCheckable)
						{
							nextScreens.add(c);
							if(!cr.has(c+" normal"))
								cr.set(c+" normal",new Set());
							if(!cr.has(c+" swapped"))
								cr.set(c+" swapped",new Set());
							let crNormal = cr.get(c+" normal"),crSwapped = cr.get(c+" swapped");
							let normalSize = crNormal.size,swappedSize = crSwapped.size;
							let commonNormal = setIntersection(continueAssumeNormal.get(c+" normal"),continueAssumeSwapped.get(c+" normal"));
							for(let region of commonNormal)
								crNormal.add(region);
							let commonSwapped = setIntersection(continueAssumeNormal.get(c+" swapped"),continueAssumeSwapped.get(c+" swapped"));
							for(let region of commonSwapped)
								crSwapped.add(region);
							if(crNormal.size != normalSize || crSwapped.size != swappedSize)
								assumedScreens.delete(c);
						}
					for(let c of maybeCheckable)
					{
						(maybeMode ?nextScreens :maybeCheckableScreens).add(c);
						if(!mcr.has(c+" normal"))
							mcr.set(c+" normal",new Set());
						if(!mcr.has(c+" swapped"))
							mcr.set(c+" swapped",new Set());
						let crNormal = mcr.get(c+" normal"),crSwapped = mcr.get(c+" swapped");
						let normalSize = crNormal.size,swappedSize = crSwapped.size;
						let commonNormal = setUnion(continueAssumeNormal.get(c+" normal"),continueAssumeSwapped.get(c+" normal"));
						for(let region of commonNormal)
							crNormal.add(region);
						let commonSwapped = setUnion(continueAssumeNormal.get(c+" swapped"),continueAssumeSwapped.get(c+" swapped"));
						for(let region of commonSwapped)
							crSwapped.add(region);
						if(crNormal.size != normalSize || crSwapped.size != swappedSize)
							assumedScreens.delete(c);
					}
					let commonRegions = setIntersection(regionsAssumeNormal,regionsAssumeSwapped);
					let maybeRegions = setUnion(regionsAssumeNormal,regionsAssumeSwapped);
					if(!maybeMode)
					{
						for(let region of commonRegions)
						{
							evr.add(region);
						}
					}
					for(let region of maybeRegions)
					{
						maybeVisitedRegions.add(region);
					}
					for(let region of regionsAssumeNormal)
					{
						(region.screen.darkWorld ?mvrd :mvrl).add(region);
					}
					for(let region of regionsAssumeSwapped)
					{
						(region.screen.darkWorld ?mvrl :mvrd).add(region);
					}
				}
				if(nextScreens.size == 0)
				{
					if(maybeMode)
					{
						for(let n of assumedScreens)
							maybeCheckableScreens.add(n);
					}
					else
					{
						for(let n of assumedScreens)
							checkableScreens.add(n);
						assumedScreens.clear();
						cr = mcr;
						maybeMode = true;
						nextScreens = maybeCheckableScreens;
					}
				}
			}
		}
		visitedRegions = setUnion(visitedRegions,evr);
		let c = 0;
		for(let edge of visitedScreenEdges)
			if(!edge.out)
				c++;
		if(owshuffle !== 'N' || crossedow === 'C')
		{
			document.getElementById("sidesummaryow").innerHTML = c;
			document.getElementById("summaryow").innerHTML = c;
		}
		else
		{
			document.getElementById("sidesummaryow").innerHTML = "";
			document.getElementById("summaryow").innerHTML = "";
		}
		reachableEdges = visitedScreenEdges;
		if(!welcomeMode && document.getElementById("globalsync").checked && window.opener && !window.opener.closed)
		{
			window.opener.postMessage(determineLocationAvailability(visitedRegions,evr,mvrl,mvrd,items),"*");
		}
	};

	window.inspectStartRegion = function(screenID,regionName,ignoreSwaps)
	{
		let screen = overworldScreens.get(screenID);
		if(mixedow)
		{
			if(screen.mixedState === "unknown")
			{
				let id = screenID&0xBF;
				checkableScreens.add(id);
				let keyNormal = id+" normal",keySwapped = id+" swapped";
				if(!continueRegions.has(keyNormal))
					continueRegions.set(keyNormal,new Set());
				if(!continueRegions.has(keySwapped))
					continueRegions.set(keySwapped,new Set());
				let region = regionName ?screen.regions.get(regionName) :screen.fluteRegion;
				continueRegions.get(keyNormal).add(worldState !== 'I' ?region :region.parallel);
				continueRegions.get(keySwapped).add(ignoreSwaps !== (worldState === 'I') ?region :region.parallel);
			}
			else
			{
				let region = regionName ?screen.regions.get(regionName) :screen.fluteRegion;
				(regionName ?fixedStartRegions :fluteSpotRegions).push((ignoreSwaps || screen.mixedState === "normal") !== (worldState === 'I') ?region :region.parallel);
			}
		}
		else
		{
			let region = regionName ?screen.regions.get(regionName) :screen.fluteRegion;
			(regionName ?fixedStartRegions :fluteSpotRegions).push(worldState === 'I' ?region.parallel :region);
		}
	};
}(window));