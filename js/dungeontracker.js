(function(window) {
	'use strict';
	let query = uri_query();
	window.doorshuffle = 'C';
	window.lobbyshuffle = true;
	window.excludesmallkeys = true;
	window.excludebigkeys = true;

	let currentDungeon,currentPath = null,clickedPathIndex,currentlyEditing = false,editingIndex,globalHasBranch = false;
	window.dungeonPaths = [];

	const dungeonNamesLong = ["Eastern Palace", "Desert Palace", "Tower of Hera", "Palace of Darkness", "Swamp Palace", "Skull Woods", "Thieves' Town", "Ice Palace", "Misery Mire", "Turtle Rock", "Ganon's Tower", "Hyrule Castle", "Castle Tower"];
	const dungeonNamesShort = ["EP", "DP", "ToH", "PoD", "SP", "SW", "TT", "IP", "MM", "TR", "GT", "HC", "CT"];

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
	window.items = [];
	window.bosses = [];
	window.symbolMap = [];

	window.loadOverview = function()
	{
		loadDungeonSummaries();
		updateStatistics();
		if(document.getElementById("pathlist").style.display != "none" || document.getElementById("pathedit").style.display != "none")
			switchScene('overview');
	};

	window.loadDungeonSummaries = function()
	{
		for(let k = 0; k < 13; k++)
		{
			if(dungeonPaths[k].completed)
			{
				document.getElementById("boss"+k).classList.add("completed");
				document.getElementById("summary"+k).innerHTML = "<div class='symbolnode' style='background-image: url("+"./images/dungeons/keychest0.png); left: 16px;'></div>";
			}
			else
			{
				document.getElementById("boss"+k).classList.remove("completed");
				let s = "",items = [];
				for(let path of dungeonPaths[k].paths)
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
				document.getElementById("summary"+k).innerHTML = s;
			}
		}
	};

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
		window.switchScene("pathlist");
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
		let notes = document.getElementById("dungeonpathsnote").value;
		if(notes != dungeonPaths[currentDungeon].notes)
		{
			dungeonPaths[currentDungeon].notes = notes;
			sendUpdate();
		}
		loadOverview();
	};

	window.markCompleted = function()
	{
		if(dungeonPaths[currentDungeon].completed)
		{
			dungeonPaths[currentDungeon].completed = false;
			document.getElementById("dungeonicon").classList.remove("completed");
			document.getElementById("completedbutton").innerHTML = "Mark dungeon completed";
			document.getElementById("completedbutton").classList.add("pointer");
		}
		else
		{
			dungeonPaths[currentDungeon].completed = true;
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
		return "<div class='"+classes+"' onClick='"+onClick+"'"+(left ?" style='left: "+left+"px;'" :"")+"><img class='roomnodeimg' src='./images/dungeons/"+file+".png' style='transform: scale("+scale+") translateX(-"+x+"px) translateY(-"+y+"px);'><span class='roomtt'><label class='ttlabel'>"+name+"</label></span></div>";
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
		window.switchScene("pathedit");
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
		switchScene('pathlist');
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
		switchScene('pathlist');
		currentPath = null;
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
			s += '<div class="row path" style="margin: 2px 0px;" onClick="showClickPathModal('+k+')">'+drawPath(dungeonPaths[currentDungeon].paths[k],false)+'</div>';
		document.getElementById("dungeonpaths").innerHTML = s;
		document.getElementById("dungeonpaths2").innerHTML = s;
	};

	window.drawAllSymbols = function()
	{
		drawSymbols(directions,"directionicons",'d');
		drawSymbols(objects,"objecticons",'o');
		drawSymbols(switchobjects,"switchicons",'s');
		drawSymbols(items,"itemicons",'i');
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
			s += "<div class='pathsymbol' style='"+style+"' onClick='appendToPath(\""+id+"\")'></div>";
		}
		document.getElementById(elementID).innerHTML = s;
	};

	window.switchScene = function(scene)
	{
		document.getElementById("overview").style.display = scene === "overview" ?"block" :"none";
		document.getElementById("pathlist").style.display = scene === "pathlist" ?"block" :"none";
		document.getElementById("pathedit").style.display = scene === "pathedit" ?"block" :"none";
		window.scrollTo(0,0);
	};

	window.sendUpdate = function()
	{
		try
		{
			saveAuto();
		}
		catch(error)
		{
		}
		if(window.opener && !window.opener.closed)
			window.opener.postMessage(allData(),"*");
	};

	window.showClickPathModal = function(index)
	{
		clickedPathIndex = index;
		document.getElementById("currentclickedpath").innerHTML = drawPath(dungeonPaths[currentDungeon].paths[index],true);
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
	};

	window.updateKeys = function()
	{
		excludesmallkeys = document.getElementById("excludesmallkeys").checked;
		excludebigkeys = document.getElementById("excludebigkeys").checked;
		loadDungeonSummaries();
	};

	window.keyDown = function(event)
	{
		if(event.target.tagName != "INPUT" && [32, 33, 34, 35, 36, 38, 40].indexOf(event.keyCode) != -1)
			event.preventDefault();
	};

	window.receiveMessage = function(event)
	{
		if(window.origin === event.origin)
		{
			if(event.data.dungeonPaths && event.data.dungeonPaths.length === 13)
			{
				if(loadAll(event.data))
					loadOverview();
				else
					console.log("Error while loading data from main tracker");
			}
		}
	};

	window.allData = function()
	{
		let all = {};
		all.dungeonPaths = dungeonPaths;
		all.doorshuffle = doorshuffle;
		all.lobbyshuffle = lobbyshuffle;
		all.excludesmallkeys = excludesmallkeys;
		all.excludebigkeys = excludebigkeys;
		all.showmorerooms = document.getElementById("showmorerooms").checked;
		all.splitpath = document.getElementById("splitpath").checked;
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
		document.getElementById("selectdoorshuffle").value = ""+doorshuffle;
		document.getElementById("lobbyshuffle").checked = lobbyshuffle;
		document.getElementById("excludesmallkeys").checked = excludesmallkeys;
		document.getElementById("excludebigkeys").checked = excludebigkeys;
		document.getElementById("showmorerooms").checked = newData.showmorerooms;
		document.getElementById("splitpath").checked = newData.splitpath;
		return true;
	};

	window.loadManual = function()
	{
		let data = JSON.parse(localStorage.getItem("dungeonData"));
		if(data && confirm("Load saved data from local storage?\nThis will replace all currently set dungeon paths and notes.\n\nSaved at: "+data.timeString))
			if(loadAll(data))
				loadOverview();
			else
				console.log("Error while loading data from manual save");
	};

	window.saveManual = function()
	{
		localStorage.setItem("dungeonData",JSON.stringify(allData()));
		document.getElementById("loadmanual").classList.remove("disabled");
	};

	window.loadAuto = function()
	{
		let data = JSON.parse(localStorage.getItem("dungeonDataAutoSave"));
		if(data && confirm("Load auto-save data from local storage?\nThis will replace all currently set dungeon paths and notes.\n\nSaved at: "+data.timeString))
			if(loadAll(data))
				loadOverview();
			else
				console.log("Error while loading data from auto-save");
	};

	window.saveAuto = function()
	{
		localStorage.setItem("dungeonDataAutoSave",JSON.stringify(allData()));
		document.getElementById("loadauto").classList.remove("disabled");
	};

	window.clearData = function()
	{
		if(confirm("Delete all currently loaded paths and notes for every dungeon?"))
		{
			dungeonPaths = [];
			for(let k = 0; k < 13; k++)
				dungeonPaths[k] = {"paths":[],"notes":"","completed":false};
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

	window.initializeSymbols = function(list,key)
	{
		for(let k = 0; k < list.length; k++)
		{
			let id = key+k.toString(36);
			list[k].id = id;
			symbolMap[id] = list[k];
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
        if((query.wild_keys+'').toLowerCase() === 'true' || query.world_state === 'R' || query.world_state === 'r')
            excludesmallkeys = false;
        if((query.wild_big_keys+'').toLowerCase() === 'true')
            excludebigkeys = false;
		document.getElementById("selectdoorshuffle").value = ""+doorshuffle;
		document.getElementById("lobbyshuffle").checked = lobbyshuffle;
		document.getElementById("excludesmallkeys").checked = excludesmallkeys;
		document.getElementById("excludebigkeys").checked = excludebigkeys;
		document.getElementById("showmorerooms").checked = false;
		document.getElementById("splitpath").checked = true;
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
		initializeRoomsAndSymbols();
		loadOverview();
		window.addEventListener("keydown",keyDown,false);
		if(query.request_update && window.opener && !window.opener.closed)
		{
			window.addEventListener("message",receiveMessage,false);
			window.opener.postMessage("UPDATE","*");
		}
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
		objects.push({"folder":"dungeons","file":"trapdoor"});
		objects.push({"folder":"dungeons","file":"keychest0"});
		objects.push({"folder":"dungeons","file":"prize0"});
		switchobjects.push({"folder":"dungeons","file":"crystalswitch","basic":[2,3,4,6,7,8,9,10]});
		switchobjects.push({"folder":"dungeons","file":"orangedown","basic":[2,3,4,6,7,8,9,10]});
		switchobjects.push({"folder":"dungeons","file":"bluedown","basic":[2,3,4,6,7,8,9,10]});
		switchobjects.push({"folder":"dungeons","file":"lever","basic":[4]});
		switchobjects.push({"folder":"dungeons","file":"drain","basic":[4]});
		items.push({"folder":"dungeons","file":"smallkey"});
		items.push({"folder":"dungeons","file":"bigkey"});
		items.push({"folder":"items","file":"bomb"});
		items.push({"folder":"items","file":"somaria","basic":[7,8,9,10]});
		items.push({"folder":"items","file":"firerod","basic":[5,9,10]});
		items.push({"folder":"items","file":"lantern","basic":[0,3,8,9,11,12]});
		items.push({"folder":"dungeons","file":"torch","basic":[1,2,8,10]});
		items.push({"folder":"items","file":"flippers","basic":[4]});
		items.push({"folder":"items","file":"hookshot","basic":[0,2,4,5,7,8,9,10]});
		items.push({"folder":"items","file":"boots","basic":[1,3,5,8,9,10]});
		items.push({"folder":"items","file":"bow1","basic":[0,3,10]});
		items.push({"folder":"items","file":"hammer","basic":[3,4,6,7,10]});
		items.push({"folder":"items","file":"sword1","basic":[5,12]});
		items.push({"folder":"items","file":"glove1","basic":[1,6,7]});
		items.push({"folder":"items","file":"shield3","basic":[9]});
		items.push({"folder":"dungeons","file":"freezor","basic":[7]});
		items.push({"folder":"dungeons","file":"wizzrobe","basic":[8,10]});
		items.push({"folder":"items","file":"boomerang2"});
		items.push({"folder":"items","file":"mirror","basic":[1,4,5,6,11]});
		items.push({"folder":"items","file":"moonpearl"});
		items.push({"folder":"dungeons","file":"spikefloor","basic":[7,8]});
		items.push({"folder":"items","file":"magic"});
		items.push({"folder":"dungeons","file":"smallchest"});
		items.push({"folder":"dungeons","file":"bigchest","basic":[0,1,2,3,4,5,6,7,8,9,10]});
		items.push({"folder":"dungeons","file":"talltorch","basic":[1,10]});
		items.push({"folder":"dungeons","file":"keysteal"});
		items.push({"folder":"dungeons","file":"map"});
		items.push({"folder":"dungeons","file":"compass"});
		items.push({"folder":"dungeons","file":"hinttile"});
		items.push({"folder":"items","file":"heartcontainer"});
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
		initializeSymbols(items,'i');
		initializeSymbols(bosses,'b');
	};
}(window));