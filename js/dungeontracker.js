(function(window) {
	'use strict';
	let query = uri_query();
	window.doorshuffle = 'C';
	window.lobbyshuffle = true;
	window.excludesmallkeys = true;
	window.excludebigkeys = true;
	window.owshuffle = 'N';
	window.crossedow = false;
	window.similarow = false;
	window.entranceEnabled = false;

	let outstandingUpdate = false,currentDungeon = -1,currentPath = null,clickedPathIndex,currentlyEditing = false,editingIndex,globalHasBranch = false,visibleSidebar = true;
	let ownItems = {},reachableEdges = null,currentOWPath = null,currentOWScreen = null,fullOverworldMode = null,fullOWFixedEdge = null,fullOWSelectedScreen = null,fullOWSelectedEdge = null,fullOWConnectorStart = null,fullOWConnectorEnd = null,extraOWScreen = null,extraOWDirection = null,lastUnknownConnectorIndex = -1;
	let searchResults = new Map(),searchRegion = null,searchStartScreen = null,searchRegionChoiceVisible = false,clickedOverworldPathIndex,clickedOverworldPathListName,clickedOverworldPath = null,clickedConnectorIndex,drawDarkWorld = false,fullZoom = .8,fullZoomAuto = true;
	window.dungeonPaths = [];
	window.entranceConnectors = [];
	window.fixedStartRegions = [];
	window.customStartRegions = [];
	window.pinnedPaths = [];
	window.previousPaths = [];

	const dungeonNamesLong = ["Eastern Palace","Desert Palace","Tower of Hera","Palace of Darkness","Swamp Palace","Skull Woods","Thieves' Town","Ice Palace","Misery Mire","Turtle Rock","Ganon's Tower","Hyrule Castle","Castle Tower"];
	const dungeonNamesShort = ["EP","DP","ToH","PoD","SP","SW","TT","IP","MM","TR","GT","HC","CT"];
	const checkboxFlags = ["showmorerooms","splitpath","owsidebaredit","owsidebarnew","owsidebarsearch","itemsync","connectorsync","pinnedlinkshouse","pinnedsanctuary","pinnedoldman","pinnedpyramid","compactpinned","compactprevious","alwaysfollowmarked","compactsearchresults","zoomautoow","owsearchincludecommon"];
	const fullOWTitle = {"newpath":"Start a new path","continuepath":"Where does this transition lead to?","searchpath":"Select a target screen","searchpathtarget":"Select a new target screen","searchpathstart":"Select a starting screen","editedges":"Click on a transition or screen"};

	window.overworldScreens = new Map();
	window.entranceIndexToRegion = {};
	window.overworldEdgeToDirection = {};
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
		window.scrollTo(0,0);
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
	};

	window.hideSidebar = function()
	{
		document.getElementById("app").classList.remove("showsidebar");
		visibleSidebar = false;
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
	};

	window.updateKeys = function()
	{
		excludesmallkeys = document.getElementById("excludesmallkeys").checked;
		excludebigkeys = document.getElementById("excludebigkeys").checked;
		loadDungeonSummaries();
	};

	window.updateOverworldShuffle = function()
	{
		owshuffle = document.getElementById("selectowshuffle").value[0];
		crossedow = document.getElementById("crossedow").checked;
		similarow = document.getElementById("similarow").checked;
		entranceEnabled = document.getElementById("entranceenabled").checked;
		updateOverviewElements();
	};

	window.updateSidebarElements = function()
	{
		document.getElementById("sidebaredit").style.display = document.getElementById("owsidebaredit").checked ?"block" :"none";
		document.getElementById("sidebarnew").style.display = document.getElementById("owsidebarnew").checked ?"block" :"none";
		document.getElementById("sidebarsearch").style.display = document.getElementById("owsidebarsearch").checked ?"block" :"none";
	};

	window.updateOverviewElements = function()
	{
		document.getElementById("overviewtitle").innerHTML = doorshuffle === 'N' ?(owshuffle === 'N' ?"Please select a mode" :"Overworld Tracker") :(owshuffle === 'N' ?"Dungeon Tracker" :"Overworld and Dungeon Tracker");
		document.getElementById("overviewoverworld").style.display = owshuffle === 'N' ?"none" :"block";
		document.getElementById("overviewdungeons").style.display = doorshuffle === 'N' ?"none" :"block";
		document.getElementById("overworldoptions").style.display = owshuffle === 'N' ?"none" :"block";
		document.getElementById("dungeonoptions").style.display = doorshuffle === 'N' ?"none" :"block";
		document.getElementById("dungeonstats").style.display = doorshuffle === 'N' ?"none" :"block";
		document.getElementById("sidebaroverworld").style.display = owshuffle === 'N' ?"none" :"block";
		document.getElementById("sidebardungeons").style.display = doorshuffle === 'N' ?"none" :"block";
	};

	window.updateItemSync = function()
	{
		if(document.getElementById("itemsync").checked && window.opener && !window.opener.closed)
			window.opener.postMessage("ITEMS","*");
	};

	window.updateConnectorSync = function()
	{
		if(document.getElementById("connectorsync").checked && window.opener && !window.opener.closed)
			window.opener.postMessage("ITEMS","*");
		updateConnectorList();
	};

	window.receiveItemUpdate = function(newItems)
	{
		let changed = false;
		if(document.getElementById("itemsync").checked)
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
		}
		if(document.getElementById("connectorsync").checked)
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
				createEntranceConnector(entranceIndexToRegion[c[0]],entranceIndexToRegion[c[1]],"unknown",c[2]);
		}
		if(changed)
		{
			outstandingUpdate = true;
			updateReachableEdges();
			updateItemTracker();
			updateConnectorList();
			if(document.getElementById("fullowModal").style.display === "block")
				drawFullOverworldPanel(drawDarkWorld);
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
			if(event.data.dungeonPaths && event.data.dungeonPaths.length === 13)
			{
				if(loadAll(event.data))
				{
					loadOverview();
					if(document.getElementById("itemsync").checked || document.getElementById("connectorsync").checked)
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
		for(let [id,screen] of overworldScreens)
			for(let [edgeString,edge] of screen.edges)
				if(edge.out)
					all.overworldTransitions.push([id,edgeString,edge.out.screen.id,edge.out.string]);
		all.items = ownItems;
		all.entranceConnectors = entranceConnectors;
		all.overworldNotes = document.getElementById("owpathsnote").value;
		all.customStartRegions = [];
		for(let region of customStartRegions)
			all.customStartRegions.push([region.screen.id,region.name]);
		all.pinnedPaths = pinnedPaths;
		all.previousPaths = previousPaths;
		all.doorshuffle = doorshuffle;
		all.lobbyshuffle = lobbyshuffle;
		all.excludesmallkeys = excludesmallkeys;
		all.excludebigkeys = excludebigkeys;
		all.owshuffle = owshuffle;
		all.crossedow = crossedow;
		all.similarow = similarow;
		all.entranceEnabled = entranceEnabled;
		for(let checkboxFlag of checkboxFlags)
			all[checkboxFlag] = document.getElementById(checkboxFlag).checked;
		all.fullZoom = fullZoom;
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
		try
		{
			customStartRegions = [];
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
		pinnedPaths = newData.pinnedPaths;
		previousPaths = newData.previousPaths;
		crossedow = newData.crossedow;
		similarow = newData.similarow;
		entranceEnabled = newData.entranceEnabled;
		document.getElementById("selectdoorshuffle").value = ""+doorshuffle;
		document.getElementById("lobbyshuffle").checked = lobbyshuffle;
		document.getElementById("excludesmallkeys").checked = excludesmallkeys;
		document.getElementById("excludebigkeys").checked = excludebigkeys;
		document.getElementById("selectowshuffle").value = ""+owshuffle;
		document.getElementById("crossedow").checked = crossedow;
		document.getElementById("similarow").checked = similarow;
		document.getElementById("entranceenabled").checked = entranceEnabled;
		for(let checkboxFlag of checkboxFlags)
			document.getElementById(checkboxFlag).checked = newData[checkboxFlag];
		fullZoomAuto = document.getElementById("zoomautoow").checked;
		fullZoom = newData.fullZoom ?Math.max(.5,Math.min(newData.fullZoom,1.5)) :.8;
		updateOverviewElements();
		updateReachableEdges();
		updateSidebarElements();
		updateItemTracker();
		updateConnectorList();
		updateStartRegionList();
		updateMainPathLists();
		return true;
	};

	window.loadManual = function()
	{
		let data = JSON.parse(localStorage.getItem("dungeonData"));
		if(data && confirm("Load saved data from local storage?\nThis will replace all currently set dungeon paths, overworld transitions and notes.\n\nSaved at: "+data.timeString))
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
		if(data && confirm("Load auto-save data from local storage?\nThis will replace all currently set dungeon paths, overworld transitions and notes.\n\nSaved at: "+data.timeString))
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
			ownItems = {};
			clearEntranceConnectors();
			document.getElementById("owpathsnote").value = "";
			customStartRegions = [];
			pinnedPaths = [];
			previousPaths = [];
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
		if(query.entrance_shuffle && query.entrance_shuffle !== 'N' && query.entrance_shuffle !== 'n')
			entranceEnabled = true;
		document.getElementById("selectdoorshuffle").value = ""+doorshuffle;
		document.getElementById("lobbyshuffle").checked = lobbyshuffle;
		document.getElementById("excludesmallkeys").checked = excludesmallkeys;
		document.getElementById("excludebigkeys").checked = excludebigkeys;
		document.getElementById("selectowshuffle").value = ""+owshuffle;
		document.getElementById("crossedow").checked = false;
		document.getElementById("similarow").checked = false;
		document.getElementById("entranceenabled").checked = entranceEnabled;
		document.getElementById("showmorerooms").checked = false;
		document.getElementById("splitpath").checked = true;
		document.getElementById("owsidebaredit").checked = true;
		document.getElementById("owsidebarnew").checked = true;
		document.getElementById("owsidebarsearch").checked = true;
		document.getElementById("itemsync").checked = true;
		document.getElementById("connectortr").checked = false;
		document.getElementById("connectorhccsanc").checked = false;
		document.getElementById("connectorboesanc").checked = false;
		document.getElementById("connectorboehcb").checked = false;
		document.getElementById("connectorboehcc").checked = false;
		document.getElementById("connectorsanchcb").checked = false;
		document.getElementById("connectorsanchcc").checked = false;
		document.getElementById("connectorsync").checked = true;
		document.getElementById("owpathsnote").value = "";
		document.getElementById("pinnedlinkshouse").checked = true;
		document.getElementById("pinnedsanctuary").checked = false;
		document.getElementById("pinnedoldman").checked = false;
		document.getElementById("pinnedpyramid").checked = false;
		document.getElementById("compactpinned").checked = true;
		document.getElementById("compactprevious").checked = true;
		document.getElementById("alwaysfollowmarked").checked = true;
		document.getElementById("compactsearchresults").checked = true;
		document.getElementById("zoomautoow").checked = true;
		document.getElementById("owsearchincludecommon").checked = true;
		try
		{
			if(localStorage.getItem("dungeonData"))
				document.getElementById("loadmanual").classList.remove("disabled");
			if(localStorage.getItem("dungeonDataAutoSave"))
				document.getElementById("loadauto").classList.remove("disabled");
		}
		catch(error)
		{
		}
		initializeOverworldGraph();
		initializeRoomsAndSymbols();
		updateReachableEdges();
		loadOverview();
		updateOverviewElements();
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
		document.getElementById("dungeonconnectorsdefault").style.display = entranceEnabled ?"none" :"block";
		document.getElementById("dungeonconnectorsdoors").style.display = entranceEnabled || doorshuffle === 'N' ?"none" :"block";
		document.getElementById("owentrancecontainer").style.display = entranceEnabled ?"block" :"none";
		updateConnectorList();
		updateStartRegionList();
		updateMainPathLists();
		if(outstandingUpdate)
			sendUpdate();
		activeOverworld();
		switchScene("owmain");
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

	window.updateConnectorList = function()
	{
		document.getElementById("owconnectorlisttext").innerHTML = "Connector caves ("+entranceConnectors.length+")";
		if(document.getElementById("connectorsync").checked)
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
		if(entranceEnabled && fullOverworldMode === "editedges" && !fullOWSelectedScreen && !fullOWSelectedEdge && !fullOWConnectorStart)
			for(let k = entranceConnectors.length-1; k >= 0; k--)
				if(entranceConnectors[k].status === "unknown")
				{
					lastUnknownConnectorIndex = k;
					document.getElementById("fullowunknownconnectortext").innerHTML = connectorString(entranceConnectors[k]);
					document.getElementById("fullowunknownconnector").style.display = "block";
					return;
				}
		lastUnknownConnectorIndex = -1;
		document.getElementById("fullowunknownconnector").style.display = "none";
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
		}
		else
			if(entranceConnectors[index].status === "both")
			{
				makeEntranceConnectorUnidirectional(entranceConnectors[index]);
				outstandingUpdate = true;
				updateReachableEdges();
				updateConnectorList();
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
			drawFullOverworldPanel(drawDarkWorld);
		}
	};

	window.fullConnectorTwoWay = function()
	{
		fullCheckConnectorDetails();
		if(lastUnknownConnectorIndex !== -1)
		{
			unknownConnectorTwoWay(lastUnknownConnectorIndex);
			drawFullOverworldPanel(drawDarkWorld);
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
		}
		else
			if(entranceConnectors[clickedConnectorIndex].status === "both")
			{
				makeEntranceConnectorUnidirectional(entranceConnectors[clickedConnectorIndex]);
				entranceConnectors[clickedConnectorIndex].status = "unknown";
				outstandingUpdate = true;
				updateReachableEdges();
				updateConnectorList();
			}
	};

	window.deleteClickedConnector = function()
	{
		if(!document.getElementById("connectorsync").checked)
		{
			deleteEntranceConnector(clickedConnectorIndex,entranceConnectors[clickedConnectorIndex]);
			outstandingUpdate = true;
			updateReachableEdges();
			updateConnectorList();
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
	};

	window.updateDefaultStartRegions = function()
	{
		outstandingUpdate = true;
		updateReachableEdges();
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
		if(document.getElementById("itemsync").checked)
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
		}
	};

	window.toggleConnector = function(checkbox)
	{
		ownItems[checkbox.id] = checkbox.checked;
		outstandingUpdate = true;
		updateReachableEdges();
	};

	window.clickScreenFull = function(id)
	{
		switch(fullOverworldMode)
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
				searchOverworldPath(true);
				return;
			case "searchpathstart":
				searchStartScreen = overworldScreens.get(id);
				searchOverworldPath(false);
				return;
			case "editedges":
				updateClickScreenOptions(id);
				return;
		}
	};

	window.clickEdgeFull = function(screenID,edgeString)
	{
		if(fullOverworldMode === "editedges")
		{
			if(fullOWSelectedEdge)
			{
				let edge = overworldScreens.get(screenID).edges.get(edgeString);
				if(edge === fullOWSelectedEdge)
				{
					fullOWSelectedEdge = null;
					document.getElementById("fullowedgeactions").style.display = "none";
					fullCheckConnectorDetails();
				}
				else
				{
					if(edge.direction === opposite[fullOWSelectedEdge.direction] && edge.water === fullOWSelectedEdge.water)
					{
						connectSimilarParallel(fullOWSelectedEdge,edge);
						fullOWSelectedEdge = null;
						document.getElementById("fullowedgeactions").style.display = "none";
						fullCheckConnectorDetails();
						outstandingUpdate = true;
						updateReachableEdges();
					}
				}
			}
			else
			{
				fullOWSelectedEdge = overworldScreens.get(screenID).edges.get(edgeString);
				fullOWSelectedScreen = null;
				document.getElementById("fullowscreenactions").style.display = "none";
				document.getElementById("fullowedgeactions").style.display = "block";
				document.getElementById("fullowunknownconnector").style.display = "none";
				if(fullOWSelectedEdge.out || fullOWSelectedEdge.in)
				{
					document.getElementById("fullowedgetext").innerHTML = "This transition is already set. Clicking on another edge will replace the old connection.";
					document.getElementById("fullowedgedelete").classList.remove("disabled");
				}
				else
				{
					document.getElementById("fullowedgetext").innerHTML = "Click on another edge to set a screen transition.";
					document.getElementById("fullowedgedelete").classList.add("disabled");
				}
			}
			drawFullOverworldPanel(drawDarkWorld);
		}
	};

	window.updateClickScreenOptions = function(id)
	{
		let screen = overworldScreens.get(id);
		fullOWSelectedEdge = null;
		document.getElementById("fullowedgeactions").style.display = "none";
		if(fullOWConnectorStart)
		{
			if(screen.entranceRegions.length !== 0 && fullOWConnectorStart.entranceRegions.length !== 0)
			{
				fullOWConnectorEnd = screen;
				hideFullOverworldModal();
				showOverworldConnectorModal();
			}
		}
		else
		{
			if(screen === fullOWSelectedScreen)
			{
				fullOWSelectedScreen = null;
				document.getElementById("fullowscreenactions").style.display = "none";
				fullCheckConnectorDetails();
			}
			else
			{
				fullOWSelectedScreen = screen;
				if(screen.entranceRegions.length !== 0)
					document.getElementById("fullownewconnector").classList.remove("disabled");
				else
					document.getElementById("fullownewconnector").classList.add("disabled");
				document.getElementById("fullowscreenactions").style.display = "block";
				document.getElementById("fullowscreenname").innerHTML = screen.name;
				let s = "";
				for(let regionName of screen.regions.keys())
				{
					s += "<div class='buttonbox small' style='float: left; margin: 2px;' onclick='addStartRegion(this,\""+regionName+"\")'>"+regionName+"</div>";
				}
				document.getElementById("fullowregionlist").innerHTML = s;
				document.getElementById("fullowunknownconnector").style.display = "none";
			}
			drawFullOverworldPanel(drawDarkWorld);
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

	window.fullOverworldNewConnector = function()
	{
		if(fullOWSelectedScreen && fullOWSelectedScreen.entranceRegions.length !== 0)
		{
			fullOWConnectorStart = fullOWSelectedScreen;
			fullOWSelectedScreen = null;
			document.getElementById("fullowscreenactions").style.display = "none";
			document.getElementById("fullowconnectoractions").style.display = "block";
			drawFullOverworldPanel(drawDarkWorld);
		}
	};

	window.addStartRegion = function(button,regionName)
	{
		customStartRegions.push(fullOWSelectedScreen.regions.get(regionName));
		outstandingUpdate = true;
		updateReachableEdges();
		updateStartRegionList();
		drawFullOverworldPanel(drawDarkWorld);
		buttonFlash(button);
	};

	window.fullOverworldDeleteConnection = function()
	{
		if(fullOWSelectedEdge && (fullOWSelectedEdge.out || fullOWSelectedEdge.in))
		{
			if(fullOWSelectedEdge.out)
			{
				fullOWSelectedEdge.out.in = null;
				fullOWSelectedEdge.out = null;
			}
			if(fullOWSelectedEdge.in)
			{
				fullOWSelectedEdge.in.out = null;
				fullOWSelectedEdge.in = null;
			}
			if(owshuffle === 'P' && fullOWSelectedEdge.parallel)
			{
				if(fullOWSelectedEdge.parallel.out)
				{
					fullOWSelectedEdge.parallel.out.in = null;
					fullOWSelectedEdge.parallel.out = null;
				}
				if(fullOWSelectedEdge.parallel.in)
				{
					fullOWSelectedEdge.parallel.in.out = null;
					fullOWSelectedEdge.parallel.in = null;
				}
			}
			fullOWSelectedEdge = null;
			document.getElementById("fullowedgeactions").style.display = "none";
			outstandingUpdate = true;
			updateReachableEdges();
			drawFullOverworldPanel(drawDarkWorld);
		}
	};

	window.fullOverworldCancelConnector = function()
	{
		fullOWConnectorStart = null;
		document.getElementById("fullowconnectoractions").style.display = "none";
		drawFullOverworldPanel(drawDarkWorld);
	};

	window.fullOverworldCommonStarts = function()
	{
		searchStartScreen = null;
		searchOverworldPath(false);
	};

	window.startOverworldPath = function(id)
	{
		currentOWPath = [id];
		let screen = currentOWScreen = overworldScreens.get(id);
		document.getElementById("owcurrentpathheader").innerHTML = "Creating a new"+" overworld path";
		updateCurrentOverworldPath();
		drawDirectionsFromScreen(screen);
		hideFullOverworldModal();
		activeOverworld();
		switchScene("owpathedit");
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
				if(!crossedow)
					drawDarkWorld = currentOWScreen.darkWorld;
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
			appendTargetToOverworldPath(screen,validEdges[0]);
		}
		if(validEdges.length > 1)
		{
			document.getElementById("fullowModal").style.display = "none";
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
		drawFullOverworldPanel(drawDarkWorld);
		document.getElementById("fullowconnectoractions").style.display = "none";
		document.getElementById("owconnectorModal").style.display = "none";
		document.getElementById("fullowModal").style.display = "block";
	};

	window.updateCurrentOverworldPath = function()
	{
		let [drawn,width,] = drawOverworldPath(currentOWPath,true,false);
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

	window.drawOverworldPath = function(path,detailed,multiline,maxWidth = Infinity)
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
					s += "<div class='"+classes+"' style='left: "+left+"px; top: "+top+"px;'><img class='roomnodeimg' src='./images/overlay/"+file+".png' style='transform: translateX(-"+x+"px) translateY(-"+y+"px) scale("+scale+");'><span class='roomtt'><label class='ttlabel'>"+name+"</label></span></div>";
					if(k != 0 && path[k-1] != "PO" && path[k-1] != "MI" && path[k-1] != "CO")
					{
						let edge = screen.edges.get(path[k-1][0]+path[k-1][1]);
						let newX = left+edge.x2*128*scale,newY = top+edge.y2*128*scale;
						s += "<div class='owedgedot' style='left: "+(newX-4)+"px; top: "+(newY-4)+"px;'></div>";
						if(detailed || path.length <= 4)
						{
							let minX = Math.min(lastEdgeX,newX),maxX = Math.max(lastEdgeX,newX);
							let minY = Math.min(lastEdgeY,newY),maxY = Math.max(lastEdgeY,newY);
							s += "<div class='crossed"+(((lastEdgeY > newY) != (lastEdgeX > newX)) ?"left" :"right")+"' style='left: "+minX+"px; top: "+minY+"px; width: "+(maxX-minX)+"px; height: "+(maxY-minY)+"px;'></div>"
						}
					}
					if(k != path.length-1 && path[k+1] != "PO" && path[k+1] != "MI" && path[k+1] != "CO")
					{
						let edge = screen.edges.get(path[k+1][0]+path[k+1][1]);
						lastEdgeX = left+edge.x2*128*scale;
						lastEdgeY = top+edge.y2*128*scale;
						s += "<div class='owedgedot' style='left: "+(lastEdgeX-4)+"px; top: "+(lastEdgeY-4)+"px;'></div>";
					}
					left += 64;
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
			if(currentOWPath[k-2] != "PO" && currentOWPath[k-2] != "MI" && currentOWPath[k-2] != "CO")
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
		searchResults.clear();
		document.getElementById("owsearchresults").innerHTML = "";
		hideFullOverworldModal();
		activeOverworld();
		switchScene("owsearch");
		searchOverworldPath(true);
	};

	window.searchOverworldPath = function(resetRegions)
	{
		let screen = currentOWScreen;
		searchResults.clear();
		document.getElementById("owsearchtitle").innerHTML = "Paths to "+screen.name;
		document.getElementById("owsearchstarttext").innerHTML = "Starting from "+(searchStartScreen ?searchStartScreen.name :"common start locations");
		document.getElementById("owsearchresults").innerHTML = "";
		hideFullOverworldModal();
		let items = ownItems;
		let startRegions = searchStartScreen ?Array.from(searchStartScreen.regions.values()) :fixedStartRegions.concat(customStartRegions);
		if(searchStartScreen && document.getElementById("owsearchincludecommon").checked)
			startRegions = startRegions.concat(fixedStartRegions,customStartRegions);
		for(let region of screen.regions.values())
		{
			dijkstra(region,items);
			let pathsToRegion = [];
			for(let start of startRegions)
			{
				if(start.distance != Infinity)
				{
					let current = start;
					let path = [start.screen.id];
					while(current.distance > 0)
					{
						switch(current.nextEdgeType)
						{
							case "S":
								path.push(current.nextEdge.string,current.nextEdge.out.string,current.nextRegion.screen.id);
								break;
							case "P":
								path.push("PO","PO",current.nextRegion.screen.id);
								break;
							case "M":
								path.push("MI","MI",current.nextRegion.screen.id);
								break;
							case "C":
								path.push("CO","CO",current.nextRegion.screen.id);
						}
						current = current.nextRegion;
					}
					pathsToRegion.push(path);
				}
			}
			searchResults.set(region,pathsToRegion);
		}
		if(resetRegions)
		{
			if(searchRegionChoiceVisible = screen.regions.size != 1)
			{
				document.getElementById("owsearchregionchoicetext").style.display = "block";
				let s = "<div id='owanyregion' class='cell buttonbox' onclick='chooseSearchRegion(null)'>Any region</div>";
				for(let name of screen.regions.keys())
					s += "<div id='owregion"+name+"' class='cell buttonbox' onclick='chooseSearchRegion(\""+name+"\")'>"+name+"</div>";
				document.getElementById("owsearchregionchoice").innerHTML = s;
			}
			else
			{
				document.getElementById("owsearchregionchoicetext").style.display = "none";
				document.getElementById("owsearchregionchoice").innerHTML = "";
			}
			searchRegion = null;
		}
		updateSearchResults();
	};

	window.chooseSearchRegion = function(regionName)
	{
		searchRegion = regionName ?currentOWScreen.regions.get(regionName) :null;
		updateSearchResults();
	};

	window.updateSearchResults = function()
	{
		let paths = [],region = searchRegion;
		if(region)
		{
			for(let path of searchResults.get(region))
				paths.push(path);
			if(searchRegionChoiceVisible)
			{
				document.getElementById("owanyregion").classList.remove("disabled");
				for(let r of searchResults.keys())
					if(r === region)
						document.getElementById("owregion"+r.name).classList.add("disabled");
					else
						document.getElementById("owregion"+r.name).classList.remove("disabled");
			}
		}
		else
		{
			for(let list of searchResults.values())
				for(let path of list)
					paths.push(path);
			if(searchRegionChoiceVisible)
			{
				document.getElementById("owanyregion").classList.add("disabled");
				for(let r of searchResults.keys())
					document.getElementById("owregion"+r.name).classList.remove("disabled");
			}
		}
		for(let k = 0; k < paths.length-1; k++)
			for(let l = k+1; l < paths.length; l++)
				if(equalPaths(paths[k],paths[l]))
				{
					paths.splice(l,1);
					l--;
				}
		paths.sort((a,b)=>a.length-b.length);
		document.getElementById("owsearchresultstext").innerHTML = "Search results ("+paths.length+")";
		document.getElementById("owsearchresults").innerHTML = drawPathList(paths,document.getElementById("compactsearchresults").checked,"search");
	};

	window.drawPathList = function(paths,compact,listName)
	{
		let s = "";
		for(let k = 0; k < paths.length; k++)
			s += '<div class="row path" style="margin: 2px 0px;" onclick="showClickOverworldPathModal(event,'+k+',\''+listName+'\',\''+paths[k].join("|")+'\')">'+drawOverworldPath(paths[k],!compact,false)[0]+'</div>';
		return s;
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
		document.getElementById("owprevioustext").innerHTML = "Saved explored paths ("+previousPaths.length+")";
		document.getElementById("owpreviouspaths").innerHTML = drawPathList(previousPaths,document.getElementById("compactprevious").checked,"previous");
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
		for(let item of ["connectortr","connectorhccsanc","connectorboesanc","connectorboehcb","connectorboehcc","connectorsanchcb","connectorsanchcc"])
			document.getElementById(item).checked = ownItems[item];
	};

	window.drawFullOverworldPanel = function(dark)
	{
		document.getElementById("fullowpaneloverlay").innerHTML = "";
		let visitedScreenEdges = reachableEdges;
		let fixedScreen = fullOWConnectorStart ?fullOWConnectorStart :fullOWSelectedScreen;
		let fixedEdge = fullOverworldMode === "continuepath" ?fullOWFixedEdge :fullOWSelectedEdge;
		let s = "";
		for(let [id,screen] of overworldScreens)
		{
			if(screen.darkWorld != dark)
				continue;
			let scale = .5,classes = "owscreen full",onClick = "clickScreenFull("+id+")",valid = true;
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
			if(!valid)
				classes += " gray";
			let x = screen.special ?screen.x :id%8*128*scale;
			let y = screen.special ?screen.y :(id%0x40 >> 3)*128*scale;
			s += "<div class='"+classes+"' onclick='"+onClick+"' onmouseover='hoverScreen("+id+")' onmouseout='clearFullOverlay()' ";
			if(screen.special)
				s += "style='left: "+x+"px; top: "+y+"px; z-index: 1'><div class='specialshadow'><img class='roomnodeimg' src='./images/overlay/"+screen.file+".png' style='transform: scale("+scale+");'></div>";
			else
				s += "style='left: "+x+"px; top: "+y+"px;'><img class='roomnodeimg' src='./images/overlay/"+(dark ?"dark" :"light")+"world.png' style='transform: translateX(-"+x+"px) translateY(-"+y+"px) scale("+scale+");'>";
			s += "<span class='roomtt'><label class='ttlabel'"+(id ?"" :" style='line-height: 144px;'")+">"+screen.name+"</label></span></div>";
			if(!fullOWConnectorStart)
				for(let edge of screen.edges.values())
					if(!fixedEdge || edge === fixedEdge || edgesCompatible(edge,fixedEdge))
					{
						classes = "owedge";
						if(edge === fixedEdge || edge === fullOWSelectedEdge)
							classes += " active";
						if(visitedScreenEdges.has(edge))
							classes += edge.out ?" turqoise" :" green";
						else
							classes += edge.out ?" blue" :" red";
						s += "<div class='"+classes+"' style='left: "+(x+edge.x*128*scale-8)+"px; top: "+(y+edge.y*128*scale-8)+"px;"+(screen.special ?" z-index: 1;" :"")+"'";
						if(fullOverworldMode === "editedges")
							s += " onclick='clickEdgeFull("+id+",\""+edge.string+"\")' onmouseover='hoverEdge("+id+",\""+edge.string+"\")' onmouseout='clearFullOverlay()'";
						s += "></div>";
					}
		}
		document.getElementById("fullowpanelmain").innerHTML = s;
	};

	window.drawSingleOverworldScreen = function(screen,mode)
	{
		let visitedScreenEdges = reachableEdges;
		let s = "";
		let scale = 1,classes = "bigowscreen single";
		if(screen.big)
			scale = .5;
		let x = screen.special ?0 :screen.id%8*128*scale;
		let y = screen.special ?0 :(screen.id%0x40 >> 3)*128*scale;
		let file = screen.special ?screen.file :(screen.darkWorld ?"darkworld" :"lightworld");
		s += "<div class='"+classes+"' style='left: "+0+"px; top: "+0+"px;'><img class='bigroomnodeimg' src='./images/overlay/"+file+".png' style='transform: translateX(-"+x+"px) translateY(-"+y+"px) scale("+scale+");'></div>";
		if(mode !== "connector")
			for(let [edgeString,edge] of screen.edges)
				if(mode === "alledges" || (edge.direction === extraOWDirection && !edge.water))
				{
					classes = "bigowedge";
					if(visitedScreenEdges.has(edge))
						classes += edge.out ?" turqoise" :" green";
					else
						classes += edge.out ?" blue" :" red";
					let onClick = mode === "alledges" ?"appendToOverworldPath(\""+edgeString+"\")" :"selectTargetEdge("+edge.symbol+")";
					s += "<div class='"+classes+"' style='left: "+(edge.x2*128*scale-12)+"px; top: "+(edge.y2*128*scale-12)+"px;' onclick='"+onClick+"'></div>";
				}
		return s;
	};

	window.drawFullEdgeConnection = function(edge1,edge2,x1,y1,opacity)
	{
		let scale = .5;
		let lastEdgeX = x1+edge1.x*128*scale;
		let lastEdgeY = y1+edge1.y*128*scale;
		let newX = (edge2.screen.special ?edge2.screen.x :edge2.screen.id%8*128*scale)+edge2.x*128*scale;
		let newY = (edge2.screen.special ?edge2.screen.y :(edge2.screen.id%0x40 >> 3)*128*scale)+edge2.y*128*scale;
		let minX = Math.min(lastEdgeX,newX),maxX = Math.max(lastEdgeX,newX);
		let minY = Math.min(lastEdgeY,newY),maxY = Math.max(lastEdgeY,newY);
		return "<div class='crossed"+(((lastEdgeY > newY) != (lastEdgeX > newX)) ?"left" :"right")+"' style='left: "+minX+"px; top: "+minY+"px; width: "+(maxX-minX)+"px; height: "+(maxY-minY)+"px; opacity: "+opacity+";'></div>";
	};

	window.hoverScreen = function(id)
	{
		let screen = overworldScreens.get(id),s = "",scale = .5;
		let x = screen.special ?screen.x :id%8*128*scale;
		let y = screen.special ?screen.y :(id%0x40 >> 3)*128*scale;
		for(let edge of screen.edges.values())
			if(edge.out)
				s += drawFullEdgeConnection(edge,edge.out,x,y,screen.darkWorld === edge.out.screen.darkWorld ?1 :.5);
		document.getElementById("fullowpaneloverlay").innerHTML = s;
	};

	window.hoverEdge = function(id,edgeString)
	{
		let screen = overworldScreens.get(id),s = "",scale = .5;
		let edge = screen.edges.get(edgeString);
		if(edge.out)
		{
			let x = screen.special ?screen.x :id%8*128*scale;
			let y = screen.special ?screen.y :(id%0x40 >> 3)*128*scale;
			s += drawFullEdgeConnection(edge,edge.out,x,y,screen.darkWorld === edge.out.screen.darkWorld ?1 :.5);
		}
		document.getElementById("fullowpaneloverlay").innerHTML = s;
	};

	window.clearFullOverlay = function()
	{
		document.getElementById("fullowpaneloverlay").innerHTML = "";
	};

	window.showFullOverworldModal = function(mode)
	{
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
		document.getElementById("fullownewconnector").style.display = entranceEnabled && !document.getElementById("connectorsync").checked ?"block" :"none";
		document.getElementById("fullowedgeactions").style.display = "none";
		document.getElementById("fullowconnectoractions").style.display = "none";
		document.getElementById("fullowcommonstarts").style.display = mode === "searchpathstart" ?"block" :"none";
		fullCheckConnectorDetails();
		drawFullOverworldPanel(drawDarkWorld);
		document.getElementById("fullowModal").style.display = "block";
		if(fullZoomAuto)
			calculateFullZoom();
	};

	window.hideFullOverworldModal = function()
	{
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
		clickedOverworldPathIndex = pathIndex;
		clickedOverworldPathListName = listName;
		clickedOverworldPath = pathString.split("|");
		for(let k = 0; k < clickedOverworldPath.length; k += 3)
			clickedOverworldPath[k] = parseInt(clickedOverworldPath[k]);
		let [drawn,,height] = drawOverworldPath(clickedOverworldPath,true,true,352);
		document.getElementById("currentclickedowpath").style.height = height+"px";
		document.getElementById("currentclickedowpath").innerHTML = drawn;
		document.getElementById("saveowpath").style.display = listName === "pinned" ?"none" :"block";
		document.getElementById("deleteowpath").style.display = listName === "search" ?"none" :"block";
		document.getElementById("clickOWPathModalMain").style.left = (visibleSidebar ?"64" :"4")+"px";
		document.getElementById("clickOWPathModalMain").style.top = Math.min(event.clientY-20,window.innerHeight-height-48)+"px";
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
		document.getElementById("clickedconnectordelete").style.display = document.getElementById("connectorsync").checked ?"none" :"block";
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

	window.switchFullOverworld = function()
	{
		drawDarkWorld = !drawDarkWorld;
		drawFullOverworldPanel(drawDarkWorld);
	};

	window.zoomAutoFullOverworld = function(checkbox)
	{
		fullZoomAuto = checkbox.checked;
		if(fullZoomAuto)
			calculateFullZoom();
	};

	window.zoomOutFullOverworld = function()
	{
		fullZoomAuto = document.getElementById("zoomautoow").checked = false;
		if(fullZoom > .5)
		{
			fullZoom = Math.ceil(fullZoom*20-.0001)/20-.05;
			applyFullOverworldZoom(fullZoom);
			document.getElementById("zoominow").classList.remove("disabled");
			if(fullZoom <= .5)
				document.getElementById("zoomoutow").classList.add("disabled");
			else
				document.getElementById("zoomoutow").classList.remove("disabled");
		}
	};

	window.zoomInFullOverworld = function()
	{
		fullZoomAuto = document.getElementById("zoomautoow").checked = false;
		if(fullZoom < 1.5)
		{
			fullZoom = Math.floor(fullZoom*20+.0001)/20+.05;
			applyFullOverworldZoom(fullZoom);
			document.getElementById("zoomoutow").classList.remove("disabled");
			if(fullZoom >= 1.5)
				document.getElementById("zoominow").classList.add("disabled");
			else
				document.getElementById("zoominow").classList.remove("disabled");
		}
	};

	window.calculateFullZoom = function()
	{
		let maxWidth = document.body.clientWidth-14,maxHeight = window.innerHeight-240;
		let size = Math.max(256,Math.min(Math.min(maxWidth,maxHeight),768));
		fullZoom = size/512;
		applyFullOverworldZoom(fullZoom);
		if(fullZoom <= .5)
			document.getElementById("zoomoutow").classList.add("disabled");
		else
			document.getElementById("zoomoutow").classList.remove("disabled");
		if(fullZoom >= 1.5)
			document.getElementById("zoominow").classList.add("disabled");
		else
			document.getElementById("zoominow").classList.remove("disabled");
	};

	window.applyFullOverworldZoom = function(zoom)
	{
		document.getElementById("fullowpanel").style.width = document.getElementById("fullowpanelrow").style.height = 512*zoom+"px";
		document.getElementById("fullowpanel").style.transform = "scale("+zoom+")";
	};

	window.updateReachableEdges = function()
	{
		let items = ownItems;
		if(doorshuffle === 'N')
		{
			items.connectorboesanc = true;
			items.connectorboehcb = items.connectorboehcc = items.connectorsanchcb = items.connectorsanchcc = false;
		}
		if(!items.gloves)
		{
			items.connectorboesanc = items.connectorboehcb = items.connectorboehcc = false;
		}
		ownItems = items;
		fixedStartRegions = [];
		if(document.getElementById("pinnedlinkshouse").checked)
			fixedStartRegions.push(overworldScreens.get(0x2C).regions.get("Main"));
		if(document.getElementById("pinnedsanctuary").checked)
			fixedStartRegions.push(overworldScreens.get(0x13).regions.get("Main"));
		if(document.getElementById("pinnedoldman").checked)
			fixedStartRegions.push(overworldScreens.get(0x03).regions.get("Bottom"));
		if(document.getElementById("pinnedpyramid").checked)
			fixedStartRegions.push(overworldScreens.get(0x5B).regions.get("Main"));
		let visitedRegions = new Set(),visitedScreenEdges = new Set();
		if(items.flute)
		{
			if(!document.getElementById("pinnedoldman").checked)
				fixedStartRegions.push(overworldScreens.get(0x03).regions.get("Bottom"));
			fixedStartRegions.push(overworldScreens.get(0x16).regions.get("West"));
			fixedStartRegions.push(overworldScreens.get(0x18).regions.get("Main"));
			if(!document.getElementById("pinnedlinkshouse").checked)
				fixedStartRegions.push(overworldScreens.get(0x2C).regions.get("Main"));
			fixedStartRegions.push(overworldScreens.get(0x2F).regions.get("Main"));
			fixedStartRegions.push(overworldScreens.get(0x30).regions.get("Portal"));
			fixedStartRegions.push(overworldScreens.get(0x3B).regions.get("Main"));
			fixedStartRegions.push(overworldScreens.get(0x3F).regions.get("Main"));
		}
		let startRegions = fixedStartRegions.concat(customStartRegions);
		for(let start of startRegions)
			explore(start,items,visitedRegions,visitedScreenEdges);
		let c = 0;
		for(let edge of visitedScreenEdges)
			if(!edge.out)
				c++;
		document.getElementById("sidesummaryow").innerHTML = c;
		document.getElementById("summaryow").innerHTML = c;
		reachableEdges = visitedScreenEdges;
	};
}(window));