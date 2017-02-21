/* ===================================================================
   Author: Robin van Westrenen-Broekmans
   =================================================================== */

/* ===================================================================
   Code under this line are configuration variables.
   =================================================================== */

// Targeted number of frames per second for rendering.
var fps = 30;

// SVG cloud size (radius from center) reference for projecting nodes.
var boundry = 540;

// Fixed SVG font-size for stepless scaling.
var tagFontSize = 80;

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

// This variable will be updated to Date.now() before every rendered
// frame for timing a constant frame-rate.
var lastAnimate = 0;

/* ===================================================================
   Code under this line is for fast access to data and elements.
   =================================================================== */

// TagCloudSVG DOM-element.
var svg;

// TagCloud JSON-data.
var cloud;


/* ===================================================================
   Code under this line are working functions.
   There should be no need to alter this code.
   =================================================================== */

// Add 'node' array with [x,y,z] coordinates to all tags in JSON data.
function addNodesToTags() {

	// Create semi-equally spread points on a sphere for all tags in the cloud.
	var points = PointsOnSphere(cloud.length);

	// Bind these points as node-coordinates to the tags.
	for (var i = 0; i < cloud.length; i++) {
		cloud[i].node = points[i];
	}

}

// Return the rotated (rotx, roty, rotz) and zoomed (zoom) perspective coordinates for a node.
// A node is an array of tree coordinates: [x,y,z].
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
// The dx, dy, dz and dzoom parameters are deltas.
// Math.sin(zoom) is used for X-axis translation.
// A full 'wobble' with zoom: 2*Math.PI
// A full rotation around an axis: 2*Math.PI
function rotateAndZoom(dx,dy,dz,dzoom) {

	rotx += dx;
	roty += dy;
	rotz += dz;

	zoom += dzoom;

	// Reposition the tags' SVG text-nodes.
	for (var i = 0; i < cloud.length; i++) {

		var tag = cloud[i];

		var x = y = z = 0;

		// Tags with 'inanimate' tag will never change perspective.
		if (tag.class.indexOf('inanimate') > -1) {

			x = tag.node[0];
			y = tag.node[1];
			z = tag.node[2];

		} else {

			// Get the tag's coordinates, corrected for X,Y & Z-axis rotation and zoom.
			var tagPerspective = getPerspective(tag.node);

			// Short variable names for easier reading of formulas.
			x = tagPerspective[0];
			y = tagPerspective[1];
			z = tagPerspective[2];

		}

		// Convert z range [-1 ... 1] to custom perspective scaling between [0 ... 1].
		var scaling = 1+z/3;

		// Projected 2D coordinates.
		var px = x*scaling*boundry;
		var py = y*scaling*boundry;

		// X & Y projection coordinate translation and Z projection scaling of tag.
		tag.element.setAttribute("transform", "translate(" + px + "," + py + "), scale(" + scaling + ")" );

		// Change opacity based on distance (projected Z-axis).
		tag.element.style.opacity = (z*2+5/2)/3;

	}

}

// Sort the tags' SVG text-elements and restack them for correctly rendering overlapping tags.
function sortTags() {

	// Get the tags' SVG text-elements.
	var tags = Array.prototype.slice.call(document.getElementsByClassName('tag'));

	// Sort them by opacity; the opacity is in direct relation with the perspective's Z-axis distance.
	tags.sort(
		function(a, b) {
			// Use defined opacity; not the computer-calculated opacity.
			return a.style.opacity > b.style.opacity;
		}
	);

	// Re-append the tags' SVG text-elements in order. Appended DOM-nodes are not copied, but moved.
	for (var i=0; i<tags.length; i++) {
		svg.appendChild(tags[i]);
	}

}

// This function adds a single SVG text-element (representing a tag) to the SVG (representing the cloud).
function addTextToSVG(tag, hide = false) {

	// Insert text-element and update DOM.
	tag.element = svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","text"));

	// Optional hiding of element to avoid it from popping up in the corder at position x=0, y=0.
	if (hide) {
		tag.element.style.visibility = 'hidden';
		tag.element.style.opacity = 0;
	}

	// Add label of the tag as HTML text.
	tag.element.innerHTML = (tag.label ? tag.label : "");

	// Add ID defined in JSON to the tag's SVG element.
	if (tag.id) {
		tag.element.id = tag.id;
	}

	// Add all classes defined in JSON to the tag's SVG element.
	if (tag.class) {
		for (var i=0; i < tag.class.length; i++) {
			tag.element.classList.add(tag.class[i]);
		}
	} else {
		// If tag.class does not exist in JSON, add empty Array for proper working of code.
		tag.class = [];
	}

	// Add default 'tag' class to all tag elements.
	tag.element.classList.add('tag');
	tag.element.setAttribute('font-size', tagFontSize);

	// Check if the tag has a link
	if (tag.link) {

		// Create anchor-element.
		var anchor = svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg","a"));

		// Set link reference.
		anchor.setAttribute('href',tag.link);

		// Set class 'link' for text-element.
		tag.element.classList.add('link');

		// Move 'tag' class from text-element to a-element.
		tag.element.classList.remove('tag');
		anchor.classList.add('tag');

		// Wrap the anchor-element around the text-element.
		svg.replaceChild(anchor,tag.element);
		anchor.appendChild(tag.element);

		// The anchor-element is now the tag's main element.
		tag.element = anchor;
	}

}

// Make tagcloud SVG
function makeTagCloudSVG(input) {

	// Global variable name for JSON-data for fast access.
	cloud = input;

	// Global variable name for SVG-element for fast access.
	svg = document.getElementById('tagcloudsvg');

	// Set XML NameSpace to SVG standard.
	svg.setAttribute('xmlns','http://www.w3.org/2000/svg');

	// If no SVG viewbox is set, it will be set.
	if (!svg.hasAttribute('viewbox')) {
		svg.setAttribute('viewbox', '-960 -540 1920 1080');
	}

	// Generate node-coordinates for every tag and add these to the tags' JSON-data.
	addNodesToTags();

	// Create SVG text-elements for all tags.
	for (var i = 0; i < cloud.length; i++) {
		addTextToSVG(cloud[i]);
	}

	// Periodically call for re-ordering of the SVG text-elements to avoid rendering-mistakes of overlapping text.
	setInterval(
		function () {
			sortPending = true;
		}
	,sortInterval);

	// Start infinite loop.
	nextFrame();

}

// Render next frame.
function nextFrame() {

	// This is a special function-name to inform the browser that a frame is being rendered for fluid timing.
	requestAnimationFrame(nextFrame);

	// Calculate how long ago animate() is called last.
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
   Code under this line is supporting code to make your life easier.
   =================================================================== */

// Get JSON from an URL. The callback parameter is optional.
// The callback-function must have two parameters: error (null if there is no error) and the data (if there is an error).
// Without a provided callback, the JSON data is returned. If the retrieval fails, null is returned.
function getJSON(url, callback = null) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		if (status == 200) {
			if(callback) {
				callback(null, xhr.response);
			} else {
				return xhr.response;
			}
		} else {
			if(callback) {
				callback("JSON could not be retrieved.");
			} else {
				return null;
			}
		}
	};
	xhr.onerror = function() {
		callback("JSON could not be retrieved.");
		return null;
	}
	xhr.send();
};


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
