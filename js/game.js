/*
 * Copyright 2013
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 const width 	= 70;
 const height 	= 40;
 const seed 	= 14;
 const speed 	= 1000; // 1 second

var nextAlive 	= {};
var interval;
var intervalRunning = false;

function generateMap(){
	var content = $("#content");
	var row = 0;
	content.html("");
	for (var i=0; i<height; i++) {
		for (var j=0; j<width; j++) {
			content.append(getItem(row+"-"+j));
			if (j == 0) content.children().last().addClass("item-separator");
		};
		row++;
	};
}

function getItem(id){
	return "<div class='item' id='"+id+"'></div>";
}

function aliveToDead(isAlive, cell) {
	if (isAlive){
		cell.removeClass("cell-alive").addClass("cell-dead");
	}else{
		cell.removeClass("cell-dead").addClass("cell-alive");
	}
}

function generateRandomCells(){
	$('#content').children('div').each(function () {
		aliveToDead(Math.floor((Math.random()*100)+1) > seed, $(this));
	});
}

function clearCells(){
	$('#content').children('div').each(function () {
		aliveToDead(true, $(this));
	});
}

function iterateMap(){
	interval = setInterval(function(){reproduce()}, speed);
	intervalRunning = true;
}

function stopIterate(){
	window.clearInterval(interval);
	intervalRunning = false;
}

function toggleIterate(){
	var toggler = $("#toggler");
	if (intervalRunning){
		stopIterate();
		toggler.html("Start");
	}else{
		iterateMap();
		toggler.html("Stop");
	}

}

function getCell(x,y){
	if (x < 0 || y < 0) return false;
	if (x >= height || y >= width) return false;
	var cell = $("#"+x+"-"+y);
	return (cell.hasClass("cell-alive"));
}

function setCell(x,y){
	var aliveCounter = 0;
	var x = parseInt(x);
	var y = parseInt(y);
	if (getCell(x-1, y-1)) aliveCounter++;
	if (getCell(x-1, y)) aliveCounter++;
	if (getCell(x-1, y+1)) aliveCounter++;

	if (getCell(x, y-1)) aliveCounter++;
	if (getCell(x, y+1)) aliveCounter++;

	if (getCell(x+1, y-1)) aliveCounter++;
	if (getCell(x+1, y)) aliveCounter++;	
	if (getCell(x+1, y+1)) aliveCounter++;
	
	// Update cell
	var cell = $("#"+x+"-"+y);
	if 		(aliveCounter == 3) nextAlive[x+"-"+y] = 1;
	else if (aliveCounter == 2)	nextAlive[x+"-"+y] = getDeadStatus(cell);
	else 						nextAlive[x+"-"+y] = 0;
}

function getDeadStatus(cell){
	if (cell.hasClass("cell-alive"))
		return 1;
	return 0;
}

function reproduce(){
	nextAlive = {};
	$('#content').children('div').each(function () {
		var itemId = $(this).attr("id");
		var coord = itemId.split("-");
		var x = coord[0];
		var y = coord[1];
		setCell(x, y);
	});

	$('#content').children('div').each(function () {
		var itemId = $(this).attr("id");
		var item = nextAlive[itemId];

		aliveToDead(item != 1, $(this));
	});

}

function godsFinger(){
	$('#content').bind('click', function(event) {
		var cell = $("#"+event.target.id);
		aliveToDead(cell.hasClass("cell-alive"), cell);
	});
}

// Starts the magic
$(document).ready(function(){
	generateMap();
	generateRandomCells();
	iterateMap();

	godsFinger();
});
