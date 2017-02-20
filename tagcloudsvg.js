/* ===================================================================
   Author: Robin van Westrenen-Broekmans
   =================================================================== */

/* ===================================================================
   Code under this line are configuration variables.
   =================================================================== */

// Targeted number of frames per second for rendering.
var fps = 30;

// SVG cloud size (width & height) reference for projecting nodes.
var boundry = 1080;

// The interval in milliseconds for re-stacking the text elements.
var sortInterval = 1000;

/* ===================================================================
   Code under this line are global drawing and perspective values.
   =================================================================== */

// Initial Math.sin(zoom) Z-axis translation value.
var zoom = 0;

// Initial SVG node perspective variables; X, Y and Z rotation.
var rotx = roty = rotz = 0;

// Every sortInterval the sortPending will be set to true.
var sortPending = true;

// Keep track of laast animate()-call for FPS timing.
var lastAnimate = 0;

/* ===================================================================
   Code under this line are for fast access to data.
   =================================================================== */

// For easy access.
var cloud;


/* ===================================================================
   Code under this line are working functions.
   There should be no need to alter this code.
   =================================================================== */

// Add cloud[i].node to JSON data with [x,y,z] coordinates array.
function addNodesToTags() {

	// Create semi-equally spread nodes on a sphere for every tag in the cloud.
	var nodes = PointsOnSphere(cloud.length);

	for (var i = 0; i < cloud.length; i++) {
		cloud[i].node = nodes[i];
	}

}

// Return the rotated and zoomed perspective coordinates for a node.
function getPerspective(node) {

	var tmpy = [];
	var tmpx = [];
	var perspective = [];

	// Rotate around Y-axis
	tmpy[0] = node[2]*Math.sin(roty) - node[0]*Math.cos(roty);
	tmpy[1] = node[1];
	tmpy[2] = node[0]*Math.sin(roty) + node[2]*Math.cos(roty);

	// Rotate around X-axis
	tmpx[0] = tmpy[0];
	tmpx[1] = tmpy[2]*Math.sin(rotx) - tmpy[1]*Math.cos(rotx);
	tmpx[2] = tmpy[1]*Math.sin(rotx) + tmpy[2]*Math.cos(rotx);

	// Rotate around Z-axis
	perspective[0] = tmpx[1]*Math.sin(rotz) - tmpx[0]*Math.cos(rotz);
	perspective[1] = tmpx[0]*Math.sin(rotz) + tmpx[1]*Math.cos(rotz);

	// Translate Z-axis (zoom)
	perspective[2] = (Math.sin(zoom)/4) + tmpx[2];

	return perspective;
}

// Alter the perspective and projection of the SVG nodes.
// dx, dy, dz and dzoom are deltas.
// Math.sin(zoom) is used for X-axis translation.
function rotateAndZoom(dx,dy,dz,dzoom) {

	rotx += dx;
	roty += dy;
	rotz += dz;

	zoom += dzoom;

	// Reposition SVG nodes.
	for (var i = 0; i < cloud.length; i++) {

		var tag = cloud[i];
		var x = y = z = 0;

		// Tags with 'inanimate' tag will not change perspective.
		if (tag.class.indexOf('inanimate') > -1) {
			x = tag.node[0];
			y = tag.node[1];
			z = tag.node[2];
		} else {

			// Get the tag's coordinates, corrected for X,Y & Z-axis rotation and zoom.
			var tagPerspective = getPerspective(tag.node);

			// Short variable names for easier reading.
			x = tagPerspective[0];
			y = tagPerspective[1];
			z = tagPerspective[2];

		}

		// Convert z range [-1 ... 1] to custom perspective scaling between [0 ... 1].
		var scaling = 1+z/3;

		// Projected 2D coordinates
		var px = x*scaling*(boundry/2)+1920/2;
		var py = y*scaling*(boundry/2)+1080/2;

		// X & Y projection coordinate translation and Z projection scaling of tag
		tag.element.attr("transform", "translate(" + px + "," + py + "), scale(" + scaling + ")" );

		// Z-axis opacity
		tag.element.css("opacity", (z*2+5/2)/3);

	}

}

// Sort tags and stack SVG text elements accordingly for correct rendering.
function sortTags() {

	var sortedElements = $('#tagcloudsvg text.tag').sort(
		function(a, b) {
			// Use defined opacity; not the computer-calculated opacity.
			return $(a).get(0).style.opacity > $(b).get(0).style.opacity;
		}
	);

	// Remove all tags' text-elements and replace with ordered list.
	$('#tagcloudsvg').html(sortedElements);

}

// Add single SVG text element representing a tag to SVG representing the cloud.
function addTextToSVG(tag, hide = false) {

	// Insert element and update DOM.
	$('#tagcloudsvg').append(document.createElementNS("http://www.w3.org/2000/svg","text"));

	// Add the element to the tag in JSON.
	tag.element = $('#tagcloudsvg text').last();

	// Optional hiding of element to avoid it from popping up in the corder at position x=0, y=0.
	if (hide) {
		tag.element.css('visibility', 'hidden').css('opacity','0');
	}

	// Add label of the tag as HTML text.
	tag.element.html(tag.label ? tag.label : "");

	// Add all classes defined in JSON to the tag's SVG element.
	if (tag.class) {
		for (var i=0; i < tag.class.length; i++) {
			tag.element.addClass(tag.class[i]);
		}
	} else {
		// If tag.class does not exist in JSON, add empty Array for proper working of code.
		tag.class = [];
	}

	// Add default 'tag' class to all tag elements.
	tag.element.addClass('tag');

}

// Make tagcloud SVG
function makeTagCloudSVG(input) {

	cloud = input;

	// Generate node-coordinates for every tag and add these to cloud[i].node .
	addNodesToTags();

	// Iterate cloud tags and make nodes and SVG elements.
	for (var i = 0; i < cloud.length; i++) {
		addTextToSVG(cloud[i]);
	}

	// Initial placement, perspective and projection of tags.
	rotateAndZoom(0,0,0,0);

	// Periodically re-order the stacking of elements according to new perspective.
	setInterval(
		function () {
			sortPending = true;
		}
	,sortInterval);

	// Start infinite render-loop.
	nextFrame();

}

// Render next frame.
function nextFrame() {
	// Browser-optimization for rendering without delay (stutter) from sortTags().
	requestAnimationFrame(nextFrame);

	// See how long ago animate() is called last.
	var now = Date.now();
	var delta = now - lastAnimate;

	// Limit rendering to fps frames-per-second.
	if (delta > 1000/fps) {
		lastAnimate = now - (delta % 1000/fps);
		animate();
	}

	// Sort the SVG DOM-elements according to perspective Z-axis.
	if(sortPending) {
		sortTags();
		sortPending = false;
	}
}

/* ===================================================================
   Code under this line is a piece of altered code from TagCanvas 1.12
   Copyright (C) 2010-2011 Graham Breach
   For more information, please contact <graham@goat1000.com>
   =================================================================== */

function PointsOnSphere(n) {
	var i, y, r, phi, pts = [], inc = Math.PI * (3-Math.sqrt(5)), off = 2/n;
	for(i = 0; i < n; ++i) {
		y = i * off - 1 + (off / 2);
		r = Math.sqrt(1 - y*y);
		phi = i * inc;
		pts.push([Math.cos(phi)*r, y, Math.sin(phi)*r]);
	}
	return pts;
}
