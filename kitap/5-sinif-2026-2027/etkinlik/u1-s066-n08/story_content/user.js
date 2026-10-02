window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script11 = function()
{
  console.clear();

var canvasAnchor, canvasClickArea, img, rectDrawArea;
var newImg = new Image();

//----Setup resize observer Routine-------------------------------------------------------------------------------
//resize function
function resizeFunction() {
	console.log("Start resize");

	//resize canvas by replacing old with new sized to match updated base image
	createCanvas();

	console.log("End resize");
}

//---------------------------------------------------------------------------------------------------------------
//set up resize function
//reference to debounced resizing function
let doIt;

//set up resize observer for this cube
let ro = new ResizeObserver(entries => {
	
	document.getElementById("annotationCanvas").style.opacity = 0;
	
	//if multiple resizes, then reset the call to the resizing function (don't do multiple redraws)
	clearTimeout(doIt);
	
	//after a brief delay after the final resize, call the resizing function
	doIt = setTimeout(resizeFunction, 100);
});

//---------------------------------------------------------------------------------------------------------------

function createCanvas() {
	//the image to use as a base for the canvas (or use none to just record the annotations)
	var imgTag = GetPlayer().GetVar("baseCanvasImage2");
	var newDiv, canv, prevCanvas;
		
	//The drawing canvas is inserted below this object, so place just above the image to annotate
	canvasAnchor = document.querySelector("[data-acc-text='canvasAnchor']");
	
	//This is the area to wathc for mouse clicks, canvas should match size so drawing will be done
	canvasClickArea = document.querySelector("[data-acc-text='canvasClickArea']");
	
	//the image to use as a base for the canvas (or use none to just record the annotations)
	img = document.querySelector("[data-acc-text='" + imgTag + "']").querySelector("image");
	
	//get size of base image 
	rectDrawArea = img.getBoundingClientRect();

	//See if there is already an existing canvas setup
	prevCanvas = document.getElementById("annotationCanvas");
	
	// Adding the Canvas to a shape in Storyline.
	//Create a new <div> to hold the <canvas>
	newDiv = document.createElement('div'); 

	//Set attributes
	newDiv.className = "Annotations";
	canv = document.createElement('canvas');
	canv.id = 'annotationCanvas';
	canv.width = rectDrawArea.width;
	canv.height = rectDrawArea.height;
	canv.style = '_display: block; _box-sizing: border-box; height: ' + rectDrawArea.height + 'px; width: ' + rectDrawArea.width + 'px;';	
	
	//if no previous canvas, add new
	if (prevCanvas == null) {
		console.log("Create new canvas");
				
		//Add canvas to new div
		newDiv.appendChild(canv);
		
		//add div after the achor object (SVG rectangle)
		canvasAnchor.querySelector("svg").parentNode.appendChild(newDiv);
		
		//use initial image as the base for the canvas, copy source
		newImg.src = img.getAttribute("xlink:href");
		
		//draw base image on canvas
		drawOnImage();		
	}
	//else, replace with new
	else {
		console.log("Replace prev canvas");
		
		//extract image from pre-existing canvar, with our previous annotations
		prevCanvas.toBlob((blob) => {
			
			//create a temporary URL to assign to the updated canvas
			const url = URL.createObjectURL(blob);

			//after image is updated, replace existing canvas with new one and base image on canvas
			//this is delayed until after new src is assigned to image (below)
			newImg.onload = () => {
				// no longer need to read the blob so it's revoked
				//URL.revokeObjectURL(url);
				prevCanvas.replaceWith(canv);
				drawOnImage();
			};

			//assign new source to image
			newImg.src = url;
		});		
	}	
	
	//make canvas fully visible (hidden during resizing)
	canv.style.opacity = 1;
}

//---------------------------------------------------------------------------------------------
function drawOnImage() {
    const canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
	const canvasClickArea = document.querySelector("[data-acc-text='canvasClickArea']");
	
//	console.log("canvasElement",canvasElement);
	
    const context = canvasElement.getContext("2d");
	
    // if an image is present,
    // the image passed as parameter is drawn in the canvas
    if (true) {
        const imageWidth = img.getBoundingClientRect().width;
        const imageHeight = img.getBoundingClientRect().height;

        // rescaling the canvas element
        canvasElement.width = imageWidth;
        canvasElement.height = imageHeight;
		
//		console.log("Image Size", imageWidth, imageHeight);
		
		console.log("Canvas Img Src", newImg.src);
//		console.log("Canvas Img", image);
		//window.open(newImg.src);

        context.drawImage(newImg, 0, 0, imageWidth, imageHeight);
    }
/*
    const clearElement = document.getElementById("clear");
    clearElement.onclick = () => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
if(window.__resetTraceStats){window.__resetTraceStats();}
};
*/
    let isDrawing;
	
//		console.log("canvasElement",canvasElement);

    
// TRACE_GUARD_V5: pointer/touch + completion gating (mouse+touch drag)
(function(){
    // ---- trace stats ----
    const stats = {
        strokes: [],
        current: null,
        totalLen: 0,
        minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity,
        dotCount: 0
    };
    window.__traceStats = stats;

    function resetStats(){
        stats.strokes = [];
        stats.current = null;
        stats.totalLen = 0;
        stats.minX = Infinity; stats.minY = Infinity; stats.maxX = -Infinity; stats.maxY = -Infinity;
        stats.dotCount = 0;
    }
    resetStats();

    function updBounds(x,y){
        if(x<stats.minX) stats.minX=x;
        if(y<stats.minY) stats.minY=y;
        if(x>stats.maxX) stats.maxX=x;
        if(y>stats.maxY) stats.maxY=y;
    }

    function endStroke(canvasElement){
        const s = stats.current;
        stats.current = null;
        if(!s || s.points.length < 2) return;
        // classify dot stroke: short + small bbox
        const w = canvasElement.width || 1, h = canvasElement.height || 1;
        const minDim = Math.min(w,h);
        const dx = s.maxX - s.minX;
        const dy = s.maxY - s.minY;
        const isDot = (s.len < 0.10*minDim) && (dx < 0.08*minDim) && (dy < 0.08*minDim);
        if(isDot) stats.dotCount += 1;
        stats.strokes.push({len:s.len, minX:s.minX, minY:s.minY, maxX:s.maxX, maxY:s.maxY, isDot});
    }

    function traceComplete(canvasElement){
        const w = canvasElement.width || 1, h = canvasElement.height || 1;
        const minDim = Math.min(w,h);
        const bboxW = (stats.maxX - stats.minX);
        const bboxH = (stats.maxY - stats.minY);
        const hasInk = Number.isFinite(stats.minX) && stats.totalLen > 0;
        if(!hasInk) return {ok:false, why:"noink"};

        // 1) require enough length
        const lenOk = stats.totalLen >= (1.40 * minDim);

        // 2) require broad coverage (prevents tiny partial)
        const coverOk = (bboxW >= (0.35*w)) && (bboxH >= (0.35*h));

        // 3) tail check: if user ink reaches deep bottom, ok; otherwise still ok (tail letters will fail later)
        const tailOk = (stats.maxY >= (0.82*h)) || true;

        // 4) dotted letters: require at least 1 dot before allowing feedback
        const dotsOk = (stats.dotCount >= 1);

        return {ok: (lenOk && coverOk && tailOk && dotsOk), lenOk, coverOk, dotsOk, tailOk};
    }
    window.__traceComplete = traceComplete;

    // ---- UI gating: block check/next until traceComplete ----
    function isButton(el){
        if(!el) return false;
        const r = el.getAttribute && el.getAttribute("role");
        if(r==="button") return true;
        const tag = (el.tagName||"").toLowerCase();
        return tag==="button" || tag==="a" || tag==="div" || tag==="span";
    }
    function isLikelyAction(el){
        if(!el) return false;
        const aria = (el.getAttribute && (el.getAttribute("aria-label")||el.getAttribute("title")||"")) || "";
        const acc = (el.getAttribute && (el.getAttribute("data-acc-text")||"")) || "";
        const txt = (el.innerText||"") || "";
        const s = (aria+" "+acc+" "+txt).trim();
        // buttons used in Storyline navigation / submit
        return /تحقق|تحقّق|تم|التالي|Submit|Check|Next|Continue|إرسال/i.test(s);
    }

    document.addEventListener("click", function(ev){
        const canvasElement = document.getElementById("annotationCanvas");
        if(!canvasElement) return;
        // if click on action button, gate it
        let el = ev.target;
        for(let i=0;i<5 && el;i++){
            if(isButton(el) && isLikelyAction(el)) break;
            el = el.parentElement;
        }
        if(!el || !(isButton(el) && isLikelyAction(el))) return;

        const res = traceComplete(canvasElement);
        if(!res.ok){
            ev.preventDefault();
            ev.stopImmediatePropagation();
        }
    }, true);

    // ---- pointer input (mouse + touch drag) ----
    function getPos(e){
        const r = canvasClickArea.getBoundingClientRect();
        const cx = (e.clientX - r.left);
        const cy = (e.clientY - r.top);
        return {x: cx, y: cy};
    }

    function start(e){
        e.preventDefault();
        const canvasElement = document.getElementById("annotationCanvas");
        const context = canvasElement.getContext("2d");
        const p = getPos(e);
        isDrawing = true;
        context.beginPath();
        context.lineWidth = parseInt(GetPlayer().GetVar("brushSize"));
        context.strokeStyle = GetPlayer().GetVar("brushColor");
        context.lineJoin = "round";
        context.lineCap = "round";
        context.moveTo(p.x, p.y);

        stats.current = {points:[p], len:0, minX:p.x, minY:p.y, maxX:p.x, maxY:p.y};
        updBounds(p.x,p.y);
    }

    function move(e){
        if(!isDrawing) return;
        e.preventDefault();
        const canvasElement = document.getElementById("annotationCanvas");
        const context = canvasElement.getContext("2d");
        const p = getPos(e);
        const last = stats.current && stats.current.points[stats.current.points.length-1];
        if(last){
            const dx = p.x - last.x, dy = p.y - last.y;
            const d = Math.sqrt(dx*dx+dy*dy);
            stats.current.len += d;
            stats.totalLen += d;
        }
        if(stats.current){
            stats.current.points.push(p);
            if(p.x<stats.current.minX) stats.current.minX=p.x;
            if(p.y<stats.current.minY) stats.current.minY=p.y;
            if(p.x>stats.current.maxX) stats.current.maxX=p.x;
            if(p.y>stats.current.maxY) stats.current.maxY=p.y;
        }
        updBounds(p.x,p.y);

        context.lineTo(p.x, p.y);
        context.stroke();
    }

    function end(e){
        if(!isDrawing) return;
        e.preventDefault();
        isDrawing = false;
        const canvasElement = document.getElementById("annotationCanvas");
        const context = canvasElement.getContext("2d");
        context.closePath();
        endStroke(canvasElement);
    }

    // remove old mouse listeners by cloning node
    const old = canvasClickArea;
    const clone = old.cloneNode(true);
    old.parentNode.replaceChild(clone, old);
    canvasClickArea = clone;

    canvasClickArea.style.touchAction = "none";

    canvasClickArea.addEventListener("pointerdown", function(e){
        canvasClickArea.setPointerCapture && canvasClickArea.setPointerCapture(e.pointerId);
        start(e);
    });
    canvasClickArea.addEventListener("pointermove", move);
    canvasClickArea.addEventListener("pointerup", end);
    canvasClickArea.addEventListener("pointercancel", end);
    canvasClickArea.addEventListener("pointerleave", function(e){ if(isDrawing) end(e); });

    // expose reset for storyline clear buttons
    window.__resetTraceStats = resetStats;
})();


/////////////////////////////////////////////////////////////



 ////////////////////////////////////////////////////////////////

//Main routine----------------------------------------------------------------------------------

//create a new canvas, then draw base image
createCanvas();

//set up resize observer on the specifed shape (mask covering image on slide)
ro.observe(canvasClickArea);


}

window.Script12 = function()
{
  var canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
var context = canvasElement.getContext("2d");

context.clearRect(0, 0, canvasElement.width, canvasElement.height);		


if(window.__resetTraceStats){window.__resetTraceStats();}
}

window.Script13 = function()
{
  console.clear();

var canvasAnchor, canvasClickArea, img, rectDrawArea;
var newImg = new Image();

//----Setup resize observer Routine-------------------------------------------------------------------------------
//resize function
function resizeFunction() {
	console.log("Start resize");

	//resize canvas by replacing old with new sized to match updated base image
	createCanvas();

	console.log("End resize");
}

//---------------------------------------------------------------------------------------------------------------
//set up resize function
//reference to debounced resizing function
let doIt;

//set up resize observer for this cube
let ro = new ResizeObserver(entries => {
	
	document.getElementById("annotationCanvas").style.opacity = 0;
	
	//if multiple resizes, then reset the call to the resizing function (don't do multiple redraws)
	clearTimeout(doIt);
	
	//after a brief delay after the final resize, call the resizing function
	doIt = setTimeout(resizeFunction, 100);
});

//---------------------------------------------------------------------------------------------------------------

function createCanvas() {
	//the image to use as a base for the canvas (or use none to just record the annotations)
	var imgTag = GetPlayer().GetVar("baseCanvasImage2");
	var newDiv, canv, prevCanvas;
		
	//The drawing canvas is inserted below this object, so place just above the image to annotate
	canvasAnchor = document.querySelector("[data-acc-text='canvasAnchor']");
	
	//This is the area to wathc for mouse clicks, canvas should match size so drawing will be done
	canvasClickArea = document.querySelector("[data-acc-text='canvasClickArea']");
	
	//the image to use as a base for the canvas (or use none to just record the annotations)
	img = document.querySelector("[data-acc-text='" + imgTag + "']").querySelector("image");
	
	//get size of base image 
	rectDrawArea = img.getBoundingClientRect();

	//See if there is already an existing canvas setup
	prevCanvas = document.getElementById("annotationCanvas");
	
	// Adding the Canvas to a shape in Storyline.
	//Create a new <div> to hold the <canvas>
	newDiv = document.createElement('div'); 

	//Set attributes
	newDiv.className = "Annotations";
	canv = document.createElement('canvas');
	canv.id = 'annotationCanvas';
	canv.width = rectDrawArea.width;
	canv.height = rectDrawArea.height;
	canv.style = '_display: block; _box-sizing: border-box; height: ' + rectDrawArea.height + 'px; width: ' + rectDrawArea.width + 'px;';	
	
	//if no previous canvas, add new
	if (prevCanvas == null) {
		console.log("Create new canvas");
				
		//Add canvas to new div
		newDiv.appendChild(canv);
		
		//add div after the achor object (SVG rectangle)
		canvasAnchor.querySelector("svg").parentNode.appendChild(newDiv);
		
		//use initial image as the base for the canvas, copy source
		newImg.src = img.getAttribute("xlink:href");
		
		//draw base image on canvas
		drawOnImage();		
	}
	//else, replace with new
	else {
		console.log("Replace prev canvas");
		
		//extract image from pre-existing canvar, with our previous annotations
		prevCanvas.toBlob((blob) => {
			
			//create a temporary URL to assign to the updated canvas
			const url = URL.createObjectURL(blob);

			//after image is updated, replace existing canvas with new one and base image on canvas
			//this is delayed until after new src is assigned to image (below)
			newImg.onload = () => {
				// no longer need to read the blob so it's revoked
				//URL.revokeObjectURL(url);
				prevCanvas.replaceWith(canv);
				drawOnImage();
			};

			//assign new source to image
			newImg.src = url;
		});		
	}	
	
	//make canvas fully visible (hidden during resizing)
	canv.style.opacity = 1;
}

//---------------------------------------------------------------------------------------------
function drawOnImage() {
    const canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
	const canvasClickArea = document.querySelector("[data-acc-text='canvasClickArea']");
	
//	console.log("canvasElement",canvasElement);
	
    const context = canvasElement.getContext("2d");
	
    // if an image is present,
    // the image passed as parameter is drawn in the canvas
    if (true) {
        const imageWidth = img.getBoundingClientRect().width;
        const imageHeight = img.getBoundingClientRect().height;

        // rescaling the canvas element
        canvasElement.width = imageWidth;
        canvasElement.height = imageHeight;
		
//		console.log("Image Size", imageWidth, imageHeight);
		
		console.log("Canvas Img Src", newImg.src);
//		console.log("Canvas Img", image);
		//window.open(newImg.src);

        context.drawImage(newImg, 0, 0, imageWidth, imageHeight);
    }
/*
    const clearElement = document.getElementById("clear");
    clearElement.onclick = () => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
if(window.__resetTraceStats){window.__resetTraceStats();}
};
*/
    let isDrawing;
	
//		console.log("canvasElement",canvasElement);

    canvasClickArea.addEventListener('mousedown', function(e) {
		
	//	console.log("MouseDown", e.offsetX, e.offsetY);
		
		var color = GetPlayer().GetVar("brushColor");
		var size = GetPlayer().GetVar("brushSize");
		
        isDrawing = true;
        context.beginPath();
        context.lineWidth = size;
        context.strokeStyle = color;
        context.lineJoin = "round";
        context.lineCap = "round";
        context.moveTo(e.offsetX, e.offsetY);
    });

    canvasClickArea.addEventListener('mousemove', function(e) {
	//	console.log("MouseMove", e.offsetX, e.offsetY);
        if (isDrawing) {
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
        }
    });

    canvasClickArea.addEventListener('mouseup', function () {
//		console.log("MouseUp");
        isDrawing = false;
        context.closePath();
    });
    canvasClickArea.addEventListener('mouseleave', function () {
        if (isDrawing) {
            isDrawing = false;
            context.closePath();
        }
    });
}

/////////////////////////////////////////////////////////////



 ////////////////////////////////////////////////////////////////

//Main routine----------------------------------------------------------------------------------

//create a new canvas, then draw base image
createCanvas();

//set up resize observer on the specifed shape (mask covering image on slide)
ro.observe(canvasClickArea);


}

window.Script14 = function()
{
  var canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
var context = canvasElement.getContext("2d");

context.clearRect(0, 0, canvasElement.width, canvasElement.height);		


if(window.__resetTraceStats){window.__resetTraceStats();}
}

window.Script15 = function()
{
  console.clear();

var canvasAnchor, canvasClickArea, img, rectDrawArea;
var newImg = new Image();

//----Setup resize observer Routine-------------------------------------------------------------------------------
//resize function
function resizeFunction() {
	console.log("Start resize");

	//resize canvas by replacing old with new sized to match updated base image
	createCanvas();

	console.log("End resize");
}

//---------------------------------------------------------------------------------------------------------------
//set up resize function
//reference to debounced resizing function
let doIt;

//set up resize observer for this cube
let ro = new ResizeObserver(entries => {
	
	document.getElementById("annotationCanvas").style.opacity = 0;
	
	//if multiple resizes, then reset the call to the resizing function (don't do multiple redraws)
	clearTimeout(doIt);
	
	//after a brief delay after the final resize, call the resizing function
	doIt = setTimeout(resizeFunction, 100);
});

//---------------------------------------------------------------------------------------------------------------

function createCanvas() {
	//the image to use as a base for the canvas (or use none to just record the annotations)
	var imgTag = GetPlayer().GetVar("baseCanvasImage2");
	var newDiv, canv, prevCanvas;
		
	//The drawing canvas is inserted below this object, so place just above the image to annotate
	canvasAnchor = document.querySelector("[data-acc-text='canvasAnchor']");
	
	//This is the area to wathc for mouse clicks, canvas should match size so drawing will be done
	canvasClickArea = document.querySelector("[data-acc-text='canvasClickArea']");
	
	//the image to use as a base for the canvas (or use none to just record the annotations)
	img = document.querySelector("[data-acc-text='" + imgTag + "']").querySelector("image");
	
	//get size of base image 
	rectDrawArea = img.getBoundingClientRect();

	//See if there is already an existing canvas setup
	prevCanvas = document.getElementById("annotationCanvas");
	
	// Adding the Canvas to a shape in Storyline.
	//Create a new <div> to hold the <canvas>
	newDiv = document.createElement('div'); 

	//Set attributes
	newDiv.className = "Annotations";
	canv = document.createElement('canvas');
	canv.id = 'annotationCanvas';
	canv.width = rectDrawArea.width;
	canv.height = rectDrawArea.height;
	canv.style = '_display: block; _box-sizing: border-box; height: ' + rectDrawArea.height + 'px; width: ' + rectDrawArea.width + 'px;';	
	
	//if no previous canvas, add new
	if (prevCanvas == null) {
		console.log("Create new canvas");
				
		//Add canvas to new div
		newDiv.appendChild(canv);
		
		//add div after the achor object (SVG rectangle)
		canvasAnchor.querySelector("svg").parentNode.appendChild(newDiv);
		
		//use initial image as the base for the canvas, copy source
		newImg.src = img.getAttribute("xlink:href");
		
		//draw base image on canvas
		drawOnImage();		
	}
	//else, replace with new
	else {
		console.log("Replace prev canvas");
		
		//extract image from pre-existing canvar, with our previous annotations
		prevCanvas.toBlob((blob) => {
			
			//create a temporary URL to assign to the updated canvas
			const url = URL.createObjectURL(blob);

			//after image is updated, replace existing canvas with new one and base image on canvas
			//this is delayed until after new src is assigned to image (below)
			newImg.onload = () => {
				// no longer need to read the blob so it's revoked
				//URL.revokeObjectURL(url);
				prevCanvas.replaceWith(canv);
				drawOnImage();
			};

			//assign new source to image
			newImg.src = url;
		});		
	}	
	
	//make canvas fully visible (hidden during resizing)
	canv.style.opacity = 1;
}

//---------------------------------------------------------------------------------------------
function drawOnImage() {
    const canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
	const canvasClickArea = document.querySelector("[data-acc-text='canvasClickArea']");
	
//	console.log("canvasElement",canvasElement);
	
    const context = canvasElement.getContext("2d");
	
    // if an image is present,
    // the image passed as parameter is drawn in the canvas
    if (true) {
        const imageWidth = img.getBoundingClientRect().width;
        const imageHeight = img.getBoundingClientRect().height;

        // rescaling the canvas element
        canvasElement.width = imageWidth;
        canvasElement.height = imageHeight;
		
//		console.log("Image Size", imageWidth, imageHeight);
		
		console.log("Canvas Img Src", newImg.src);
//		console.log("Canvas Img", image);
		//window.open(newImg.src);

        context.drawImage(newImg, 0, 0, imageWidth, imageHeight);
    }
/*
    const clearElement = document.getElementById("clear");
    clearElement.onclick = () => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
if(window.__resetTraceStats){window.__resetTraceStats();}
};
*/
    let isDrawing;
	
//		console.log("canvasElement",canvasElement);

    canvasClickArea.addEventListener('mousedown', function(e) {
		
	//	console.log("MouseDown", e.offsetX, e.offsetY);
		
		var color = GetPlayer().GetVar("brushColor");
		var size = GetPlayer().GetVar("brushSize");
		
        isDrawing = true;
        context.beginPath();
        context.lineWidth = size;
        context.strokeStyle = color;
        context.lineJoin = "round";
        context.lineCap = "round";
        context.moveTo(e.offsetX, e.offsetY);
    });

    canvasClickArea.addEventListener('mousemove', function(e) {
	//	console.log("MouseMove", e.offsetX, e.offsetY);
        if (isDrawing) {
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
        }
    });

    canvasClickArea.addEventListener('mouseup', function () {
//		console.log("MouseUp");
        isDrawing = false;
        context.closePath();
    });
    canvasClickArea.addEventListener('mouseleave', function () {
        if (isDrawing) {
            isDrawing = false;
            context.closePath();
        }
    });
}

/////////////////////////////////////////////////////////////



 ////////////////////////////////////////////////////////////////

//Main routine----------------------------------------------------------------------------------

//create a new canvas, then draw base image
createCanvas();

//set up resize observer on the specifed shape (mask covering image on slide)
ro.observe(canvasClickArea);


}

window.Script16 = function()
{
  var canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
var context = canvasElement.getContext("2d");

context.clearRect(0, 0, canvasElement.width, canvasElement.height);		


if(window.__resetTraceStats){window.__resetTraceStats();}
}

window.Script17 = function()
{
  console.clear();

var canvasAnchor, canvasClickArea, img, rectDrawArea;
var newImg = new Image();

//----Setup resize observer Routine-------------------------------------------------------------------------------
//resize function
function resizeFunction() {
	console.log("Start resize");

	//resize canvas by replacing old with new sized to match updated base image
	createCanvas();

	console.log("End resize");
}

//---------------------------------------------------------------------------------------------------------------
//set up resize function
//reference to debounced resizing function
let doIt;

//set up resize observer for this cube
let ro = new ResizeObserver(entries => {
	
	document.getElementById("annotationCanvas").style.opacity = 0;
	
	//if multiple resizes, then reset the call to the resizing function (don't do multiple redraws)
	clearTimeout(doIt);
	
	//after a brief delay after the final resize, call the resizing function
	doIt = setTimeout(resizeFunction, 100);
});

//---------------------------------------------------------------------------------------------------------------

function createCanvas() {
	//the image to use as a base for the canvas (or use none to just record the annotations)
	var imgTag = GetPlayer().GetVar("baseCanvasImage2");
	var newDiv, canv, prevCanvas;
		
	//The drawing canvas is inserted below this object, so place just above the image to annotate
	canvasAnchor = document.querySelector("[data-acc-text='canvasAnchor']");
	
	//This is the area to wathc for mouse clicks, canvas should match size so drawing will be done
	canvasClickArea = document.querySelector("[data-acc-text='canvasClickArea']");
	
	//the image to use as a base for the canvas (or use none to just record the annotations)
	img = document.querySelector("[data-acc-text='" + imgTag + "']").querySelector("image");
	
	//get size of base image 
	rectDrawArea = img.getBoundingClientRect();

	//See if there is already an existing canvas setup
	prevCanvas = document.getElementById("annotationCanvas");
	
	// Adding the Canvas to a shape in Storyline.
	//Create a new <div> to hold the <canvas>
	newDiv = document.createElement('div'); 

	//Set attributes
	newDiv.className = "Annotations";
	canv = document.createElement('canvas');
	canv.id = 'annotationCanvas';
	canv.width = rectDrawArea.width;
	canv.height = rectDrawArea.height;
	canv.style = '_display: block; _box-sizing: border-box; height: ' + rectDrawArea.height + 'px; width: ' + rectDrawArea.width + 'px;';	
	
	//if no previous canvas, add new
	if (prevCanvas == null) {
		console.log("Create new canvas");
				
		//Add canvas to new div
		newDiv.appendChild(canv);
		
		//add div after the achor object (SVG rectangle)
		canvasAnchor.querySelector("svg").parentNode.appendChild(newDiv);
		
		//use initial image as the base for the canvas, copy source
		newImg.src = img.getAttribute("xlink:href");
		
		//draw base image on canvas
		drawOnImage();		
	}
	//else, replace with new
	else {
		console.log("Replace prev canvas");
		
		//extract image from pre-existing canvar, with our previous annotations
		prevCanvas.toBlob((blob) => {
			
			//create a temporary URL to assign to the updated canvas
			const url = URL.createObjectURL(blob);

			//after image is updated, replace existing canvas with new one and base image on canvas
			//this is delayed until after new src is assigned to image (below)
			newImg.onload = () => {
				// no longer need to read the blob so it's revoked
				//URL.revokeObjectURL(url);
				prevCanvas.replaceWith(canv);
				drawOnImage();
			};

			//assign new source to image
			newImg.src = url;
		});		
	}	
	
	//make canvas fully visible (hidden during resizing)
	canv.style.opacity = 1;
}

//---------------------------------------------------------------------------------------------
function drawOnImage() {
    const canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
	const canvasClickArea = document.querySelector("[data-acc-text='canvasClickArea']");
	
//	console.log("canvasElement",canvasElement);
	
    const context = canvasElement.getContext("2d");
	
    // if an image is present,
    // the image passed as parameter is drawn in the canvas
    if (true) {
        const imageWidth = img.getBoundingClientRect().width;
        const imageHeight = img.getBoundingClientRect().height;

        // rescaling the canvas element
        canvasElement.width = imageWidth;
        canvasElement.height = imageHeight;
		
//		console.log("Image Size", imageWidth, imageHeight);
		
		console.log("Canvas Img Src", newImg.src);
//		console.log("Canvas Img", image);
		//window.open(newImg.src);

        context.drawImage(newImg, 0, 0, imageWidth, imageHeight);
    }
/*
    const clearElement = document.getElementById("clear");
    clearElement.onclick = () => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
if(window.__resetTraceStats){window.__resetTraceStats();}
};
*/
    let isDrawing;
	
//		console.log("canvasElement",canvasElement);

    canvasClickArea.addEventListener('mousedown', function(e) {
		
	//	console.log("MouseDown", e.offsetX, e.offsetY);
		
		var color = GetPlayer().GetVar("brushColor");
		var size = GetPlayer().GetVar("brushSize");
		
        isDrawing = true;
        context.beginPath();
        context.lineWidth = size;
        context.strokeStyle = color;
        context.lineJoin = "round";
        context.lineCap = "round";
        context.moveTo(e.offsetX, e.offsetY);
    });

    canvasClickArea.addEventListener('mousemove', function(e) {
	//	console.log("MouseMove", e.offsetX, e.offsetY);
        if (isDrawing) {
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
        }
    });

    canvasClickArea.addEventListener('mouseup', function () {
//		console.log("MouseUp");
        isDrawing = false;
        context.closePath();
    });
    canvasClickArea.addEventListener('mouseleave', function () {
        if (isDrawing) {
            isDrawing = false;
            context.closePath();
        }
    });
}

/////////////////////////////////////////////////////////////



 ////////////////////////////////////////////////////////////////

//Main routine----------------------------------------------------------------------------------

//create a new canvas, then draw base image
createCanvas();

//set up resize observer on the specifed shape (mask covering image on slide)
ro.observe(canvasClickArea);


}

window.Script18 = function()
{
  var canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
var context = canvasElement.getContext("2d");

context.clearRect(0, 0, canvasElement.width, canvasElement.height);		


if(window.__resetTraceStats){window.__resetTraceStats();}
}

window.Script19 = function()
{
  console.clear();

var canvasAnchor, canvasClickArea, img, rectDrawArea;
var newImg = new Image();

//----Setup resize observer Routine-------------------------------------------------------------------------------
//resize function
function resizeFunction() {
	console.log("Start resize");

	//resize canvas by replacing old with new sized to match updated base image
	createCanvas();

	console.log("End resize");
}

//---------------------------------------------------------------------------------------------------------------
//set up resize function
//reference to debounced resizing function
let doIt;

//set up resize observer for this cube
let ro = new ResizeObserver(entries => {
	
	document.getElementById("annotationCanvas").style.opacity = 0;
	
	//if multiple resizes, then reset the call to the resizing function (don't do multiple redraws)
	clearTimeout(doIt);
	
	//after a brief delay after the final resize, call the resizing function
	doIt = setTimeout(resizeFunction, 100);
});

//---------------------------------------------------------------------------------------------------------------

function createCanvas() {
	//the image to use as a base for the canvas (or use none to just record the annotations)
	var imgTag = GetPlayer().GetVar("baseCanvasImage2");
	var newDiv, canv, prevCanvas;
		
	//The drawing canvas is inserted below this object, so place just above the image to annotate
	canvasAnchor = document.querySelector("[data-acc-text='canvasAnchor']");
	
	//This is the area to wathc for mouse clicks, canvas should match size so drawing will be done
	canvasClickArea = document.querySelector("[data-acc-text='canvasClickArea']");
	
	//the image to use as a base for the canvas (or use none to just record the annotations)
	img = document.querySelector("[data-acc-text='" + imgTag + "']").querySelector("image");
	
	//get size of base image 
	rectDrawArea = img.getBoundingClientRect();

	//See if there is already an existing canvas setup
	prevCanvas = document.getElementById("annotationCanvas");
	
	// Adding the Canvas to a shape in Storyline.
	//Create a new <div> to hold the <canvas>
	newDiv = document.createElement('div'); 

	//Set attributes
	newDiv.className = "Annotations";
	canv = document.createElement('canvas');
	canv.id = 'annotationCanvas';
	canv.width = rectDrawArea.width;
	canv.height = rectDrawArea.height;
	canv.style = '_display: block; _box-sizing: border-box; height: ' + rectDrawArea.height + 'px; width: ' + rectDrawArea.width + 'px;';	
	
	//if no previous canvas, add new
	if (prevCanvas == null) {
		console.log("Create new canvas");
				
		//Add canvas to new div
		newDiv.appendChild(canv);
		
		//add div after the achor object (SVG rectangle)
		canvasAnchor.querySelector("svg").parentNode.appendChild(newDiv);
		
		//use initial image as the base for the canvas, copy source
		newImg.src = img.getAttribute("xlink:href");
		
		//draw base image on canvas
		drawOnImage();		
	}
	//else, replace with new
	else {
		console.log("Replace prev canvas");
		
		//extract image from pre-existing canvar, with our previous annotations
		prevCanvas.toBlob((blob) => {
			
			//create a temporary URL to assign to the updated canvas
			const url = URL.createObjectURL(blob);

			//after image is updated, replace existing canvas with new one and base image on canvas
			//this is delayed until after new src is assigned to image (below)
			newImg.onload = () => {
				// no longer need to read the blob so it's revoked
				//URL.revokeObjectURL(url);
				prevCanvas.replaceWith(canv);
				drawOnImage();
			};

			//assign new source to image
			newImg.src = url;
		});		
	}	
	
	//make canvas fully visible (hidden during resizing)
	canv.style.opacity = 1;
}

//---------------------------------------------------------------------------------------------
function drawOnImage() {
    const canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
	const canvasClickArea = document.querySelector("[data-acc-text='canvasClickArea']");
	
//	console.log("canvasElement",canvasElement);
	
    const context = canvasElement.getContext("2d");
	
    // if an image is present,
    // the image passed as parameter is drawn in the canvas
    if (true) {
        const imageWidth = img.getBoundingClientRect().width;
        const imageHeight = img.getBoundingClientRect().height;

        // rescaling the canvas element
        canvasElement.width = imageWidth;
        canvasElement.height = imageHeight;
		
//		console.log("Image Size", imageWidth, imageHeight);
		
		console.log("Canvas Img Src", newImg.src);
//		console.log("Canvas Img", image);
		//window.open(newImg.src);

        context.drawImage(newImg, 0, 0, imageWidth, imageHeight);
    }
/*
    const clearElement = document.getElementById("clear");
    clearElement.onclick = () => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
if(window.__resetTraceStats){window.__resetTraceStats();}
};
*/
    let isDrawing;
	
//		console.log("canvasElement",canvasElement);

    canvasClickArea.addEventListener('mousedown', function(e) {
		
	//	console.log("MouseDown", e.offsetX, e.offsetY);
		
		var color = GetPlayer().GetVar("brushColor");
		var size = GetPlayer().GetVar("brushSize");
		
        isDrawing = true;
        context.beginPath();
        context.lineWidth = size;
        context.strokeStyle = color;
        context.lineJoin = "round";
        context.lineCap = "round";
        context.moveTo(e.offsetX, e.offsetY);
    });

    canvasClickArea.addEventListener('mousemove', function(e) {
	//	console.log("MouseMove", e.offsetX, e.offsetY);
        if (isDrawing) {
            context.lineTo(e.offsetX, e.offsetY);
            context.stroke();
        }
    });

    canvasClickArea.addEventListener('mouseup', function () {
//		console.log("MouseUp");
        isDrawing = false;
        context.closePath();
    });
    canvasClickArea.addEventListener('mouseleave', function () {
        if (isDrawing) {
            isDrawing = false;
            context.closePath();
        }
    });
}

/////////////////////////////////////////////////////////////



 ////////////////////////////////////////////////////////////////

//Main routine----------------------------------------------------------------------------------

//create a new canvas, then draw base image
createCanvas();

//set up resize observer on the specifed shape (mask covering image on slide)
ro.observe(canvasClickArea);


}

window.Script20 = function()
{
  var canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
var context = canvasElement.getContext("2d");

context.clearRect(0, 0, canvasElement.width, canvasElement.height);		


if(window.__resetTraceStats){window.__resetTraceStats();}
}

};
