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
window.Script1 = function()
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
    __ensureControls(context, canvasElement);
	
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
        __softenGuideLine(context, imageWidth, imageHeight);
    }
/*
    const clearElement = document.getElementById("clear");
    clearElement.onclick = () => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    };
*/
    let isDrawing;

// --- PATCH: تَحَقَّقْ + قفل الرسم حتى إِعَادَةُ الْبَدْءِ ---
let __locked = false;
let __points = [];
const __mode = "noCrossCorrect"; // noCrossCorrect | crossCorrect

function __softenGuideLine(ctx, w, h){
  try{
    const y = Math.round(h * 0.72);
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, y-3, w, 6);
    ctx.restore();
  }catch(e){}
}

function __ensureControls(context, canvasElement){
  if(document.getElementById("tehaggagBtn")) return;

  const host = (canvasClickArea && canvasClickArea.parentElement) ? canvasClickArea.parentElement : document.body;
  host.style.position = host.style.position || "relative";

  const fb = document.createElement("div");
  fb.id = "writeFeedback";
  fb.style.cssText = "position:absolute;left:50%;transform:translateX(-50%);bottom:66px;z-index:99999;font-family:'Scheherazade New',serif;font-size:26px;font-weight:800;padding:8px 14px;border-radius:16px;background:rgba(255,255,255,.92);display:none;pointer-events:none;";
  host.appendChild(fb);

  const bar = document.createElement("div");
  bar.id = "writeControlsBar";
  bar.style.cssText = "position:absolute;left:50%;transform:translateX(-50%);bottom:10px;display:flex;gap:10px;z-index:99999;pointer-events:auto;";
  host.appendChild(bar);

  const chk = document.createElement("button");
  chk.id = "tehaggagBtn";
  chk.type = "button";
  chk.textContent = "تَحَقَّقْ";
  chk.style.cssText = "font-family:'Scheherazade New',serif;font-size:22px;padding:10px 16px;border-radius:14px;border:0;min-height:44px;box-shadow:0 6px 16px rgba(0,0,0,.18);background:#ffffff;color:#111;";
  bar.appendChild(chk);

  const rst = document.createElement("button");
  rst.id = "iadetBtn";
  rst.type = "button";
  rst.textContent = "إِعَادَةُ الْبَدْءِ";
  rst.style.cssText = "font-family:'Scheherazade New',serif;font-size:22px;padding:10px 16px;border-radius:14px;border:0;min-height:44px;box-shadow:0 6px 16px rgba(0,0,0,.18);background:#ffffff;color:#111;";
  bar.appendChild(rst);

  function __setFb(text, ok){
    fb.textContent = text;
    fb.style.display = "block";
    fb.style.border = ok ? "2px solid rgba(0,160,80,.45)" : "2px solid rgba(220,40,40,.45)";
    clearTimeout(fb.__t);
    fb.__t = setTimeout(()=>{ fb.style.display="none"; }, 1400);
  }

  function __redrawBase(){
    try {
      context.clearRect(0,0,canvasElement.width,canvasElement.height);
      if (newImg && newImg.complete) {
        context.drawImage(newImg, 0, 0, canvasElement.width, canvasElement.height);
        __softenGuideLine(context, canvasElement.width, canvasElement.height);
      }
    } catch(e){}
  }

  rst.addEventListener("click", (ev)=>{
    ev.preventDefault(); ev.stopPropagation();
    __locked = false;
    __points = [];
    __redrawBase();
  }, {passive:false});

  chk.addEventListener("click", (ev)=>{
    ev.preventDefault(); ev.stopPropagation();
    if(__locked) return;
    const baselineY = canvasElement.height * 0.72;
    const crossed = __points.some(p => p.y < baselineY);
    const ok = (__mode === "noCrossCorrect") ? (!crossed && __points.length>5) : (crossed && __points.length>5);
    __locked = true; // لا يرسم ثانية إلا بعد إِعَادَةُ الْبَدْءِ
    __setFb(ok ? "أَحْسَنْتَ" : "حَاوِلْ مَرَّةً أُخْرَى", ok);
  }, {passive:false});
}


	
//		console.log("canvasElement",canvasElement);

    canvasClickArea.addEventListener('mousedown', function(e) {
        __ensureControls(context, canvasElement);
        if(__locked) return;
        __points = [];
        __points.push({x:e.offsetX,y:e.offsetY});
		
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
        if(__locked) return;
        if (isDrawing) { __points.push({x:e.offsetX,y:e.offsetY}); }
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

window.Script2 = function()
{
  var canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
var context = canvasElement.getContext("2d");

context.clearRect(0, 0, canvasElement.width, canvasElement.height);		

}

window.Script3 = function()
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
    __ensureControls(context, canvasElement);
	
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
        __softenGuideLine(context, imageWidth, imageHeight);
    }
/*
    const clearElement = document.getElementById("clear");
    clearElement.onclick = () => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    };
*/
    let isDrawing;

// --- PATCH: تَحَقَّقْ + قفل الرسم حتى إِعَادَةُ الْبَدْءِ ---
let __locked = false;
let __points = [];
const __mode = "noCrossCorrect"; // noCrossCorrect | crossCorrect

function __softenGuideLine(ctx, w, h){
  try{
    const y = Math.round(h * 0.72);
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, y-3, w, 6);
    ctx.restore();
  }catch(e){}
}

function __ensureControls(context, canvasElement){
  if(document.getElementById("tehaggagBtn")) return;

  const host = (canvasClickArea && canvasClickArea.parentElement) ? canvasClickArea.parentElement : document.body;
  host.style.position = host.style.position || "relative";

  const fb = document.createElement("div");
  fb.id = "writeFeedback";
  fb.style.cssText = "position:absolute;left:50%;transform:translateX(-50%);bottom:66px;z-index:99999;font-family:'Scheherazade New',serif;font-size:26px;font-weight:800;padding:8px 14px;border-radius:16px;background:rgba(255,255,255,.92);display:none;pointer-events:none;";
  host.appendChild(fb);

  const bar = document.createElement("div");
  bar.id = "writeControlsBar";
  bar.style.cssText = "position:absolute;left:50%;transform:translateX(-50%);bottom:10px;display:flex;gap:10px;z-index:99999;pointer-events:auto;";
  host.appendChild(bar);

  const chk = document.createElement("button");
  chk.id = "tehaggagBtn";
  chk.type = "button";
  chk.textContent = "تَحَقَّقْ";
  chk.style.cssText = "font-family:'Scheherazade New',serif;font-size:22px;padding:10px 16px;border-radius:14px;border:0;min-height:44px;box-shadow:0 6px 16px rgba(0,0,0,.18);background:#ffffff;color:#111;";
  bar.appendChild(chk);

  const rst = document.createElement("button");
  rst.id = "iadetBtn";
  rst.type = "button";
  rst.textContent = "إِعَادَةُ الْبَدْءِ";
  rst.style.cssText = "font-family:'Scheherazade New',serif;font-size:22px;padding:10px 16px;border-radius:14px;border:0;min-height:44px;box-shadow:0 6px 16px rgba(0,0,0,.18);background:#ffffff;color:#111;";
  bar.appendChild(rst);

  function __setFb(text, ok){
    fb.textContent = text;
    fb.style.display = "block";
    fb.style.border = ok ? "2px solid rgba(0,160,80,.45)" : "2px solid rgba(220,40,40,.45)";
    clearTimeout(fb.__t);
    fb.__t = setTimeout(()=>{ fb.style.display="none"; }, 1400);
  }

  function __redrawBase(){
    try {
      context.clearRect(0,0,canvasElement.width,canvasElement.height);
      if (newImg && newImg.complete) {
        context.drawImage(newImg, 0, 0, canvasElement.width, canvasElement.height);
        __softenGuideLine(context, canvasElement.width, canvasElement.height);
      }
    } catch(e){}
  }

  rst.addEventListener("click", (ev)=>{
    ev.preventDefault(); ev.stopPropagation();
    __locked = false;
    __points = [];
    __redrawBase();
  }, {passive:false});

  chk.addEventListener("click", (ev)=>{
    ev.preventDefault(); ev.stopPropagation();
    if(__locked) return;
    const baselineY = canvasElement.height * 0.72;
    const crossed = __points.some(p => p.y < baselineY);
    const ok = (__mode === "noCrossCorrect") ? (!crossed && __points.length>5) : (crossed && __points.length>5);
    __locked = true; // لا يرسم ثانية إلا بعد إِعَادَةُ الْبَدْءِ
    __setFb(ok ? "أَحْسَنْتَ" : "حَاوِلْ مَرَّةً أُخْرَى", ok);
  }, {passive:false});
}


	
//		console.log("canvasElement",canvasElement);

    canvasClickArea.addEventListener('mousedown', function(e) {
        __ensureControls(context, canvasElement);
        if(__locked) return;
        __points = [];
        __points.push({x:e.offsetX,y:e.offsetY});
		
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
        if(__locked) return;
        if (isDrawing) { __points.push({x:e.offsetX,y:e.offsetY}); }
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

window.Script4 = function()
{
  var canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
var context = canvasElement.getContext("2d");

context.clearRect(0, 0, canvasElement.width, canvasElement.height);		

}

window.Script5 = function()
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
    __ensureControls(context, canvasElement);
	
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
        __softenGuideLine(context, imageWidth, imageHeight);
    }
/*
    const clearElement = document.getElementById("clear");
    clearElement.onclick = () => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    };
*/
    let isDrawing;

// --- PATCH: تَحَقَّقْ + قفل الرسم حتى إِعَادَةُ الْبَدْءِ ---
let __locked = false;
let __points = [];
const __mode = "crossCorrect"; // noCrossCorrect | crossCorrect

function __softenGuideLine(ctx, w, h){
  try{
    const y = Math.round(h * 0.72);
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, y-3, w, 6);
    ctx.restore();
  }catch(e){}
}

function __ensureControls(context, canvasElement){
  if(document.getElementById("tehaggagBtn")) return;

  const host = (canvasClickArea && canvasClickArea.parentElement) ? canvasClickArea.parentElement : document.body;
  host.style.position = host.style.position || "relative";

  const fb = document.createElement("div");
  fb.id = "writeFeedback";
  fb.style.cssText = "position:absolute;left:50%;transform:translateX(-50%);bottom:66px;z-index:99999;font-family:'Scheherazade New',serif;font-size:26px;font-weight:800;padding:8px 14px;border-radius:16px;background:rgba(255,255,255,.92);display:none;pointer-events:none;";
  host.appendChild(fb);

  const bar = document.createElement("div");
  bar.id = "writeControlsBar";
  bar.style.cssText = "position:absolute;left:50%;transform:translateX(-50%);bottom:10px;display:flex;gap:10px;z-index:99999;pointer-events:auto;";
  host.appendChild(bar);

  const chk = document.createElement("button");
  chk.id = "tehaggagBtn";
  chk.type = "button";
  chk.textContent = "تَحَقَّقْ";
  chk.style.cssText = "font-family:'Scheherazade New',serif;font-size:22px;padding:10px 16px;border-radius:14px;border:0;min-height:44px;box-shadow:0 6px 16px rgba(0,0,0,.18);background:#ffffff;color:#111;";
  bar.appendChild(chk);

  const rst = document.createElement("button");
  rst.id = "iadetBtn";
  rst.type = "button";
  rst.textContent = "إِعَادَةُ الْبَدْءِ";
  rst.style.cssText = "font-family:'Scheherazade New',serif;font-size:22px;padding:10px 16px;border-radius:14px;border:0;min-height:44px;box-shadow:0 6px 16px rgba(0,0,0,.18);background:#ffffff;color:#111;";
  bar.appendChild(rst);

  function __setFb(text, ok){
    fb.textContent = text;
    fb.style.display = "block";
    fb.style.border = ok ? "2px solid rgba(0,160,80,.45)" : "2px solid rgba(220,40,40,.45)";
    clearTimeout(fb.__t);
    fb.__t = setTimeout(()=>{ fb.style.display="none"; }, 1400);
  }

  function __redrawBase(){
    try {
      context.clearRect(0,0,canvasElement.width,canvasElement.height);
      if (newImg && newImg.complete) {
        context.drawImage(newImg, 0, 0, canvasElement.width, canvasElement.height);
        __softenGuideLine(context, canvasElement.width, canvasElement.height);
      }
    } catch(e){}
  }

  rst.addEventListener("click", (ev)=>{
    ev.preventDefault(); ev.stopPropagation();
    __locked = false;
    __points = [];
    __redrawBase();
  }, {passive:false});

  chk.addEventListener("click", (ev)=>{
    ev.preventDefault(); ev.stopPropagation();
    if(__locked) return;
    const baselineY = canvasElement.height * 0.72;
    const crossed = __points.some(p => p.y < baselineY);
    const ok = (__mode === "noCrossCorrect") ? (!crossed && __points.length>5) : (crossed && __points.length>5);
    __locked = true; // لا يرسم ثانية إلا بعد إِعَادَةُ الْبَدْءِ
    __setFb(ok ? "أَحْسَنْتَ" : "حَاوِلْ مَرَّةً أُخْرَى", ok);
  }, {passive:false});
}


	
//		console.log("canvasElement",canvasElement);

    canvasClickArea.addEventListener('mousedown', function(e) {
        __ensureControls(context, canvasElement);
        if(__locked) return;
        __points = [];
        __points.push({x:e.offsetX,y:e.offsetY});
		
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
        if(__locked) return;
        if (isDrawing) { __points.push({x:e.offsetX,y:e.offsetY}); }
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

window.Script6 = function()
{
  var canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
var context = canvasElement.getContext("2d");

context.clearRect(0, 0, canvasElement.width, canvasElement.height);		

}

window.Script7 = function()
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
    __ensureControls(context, canvasElement);
	
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
        __softenGuideLine(context, imageWidth, imageHeight);
    }
/*
    const clearElement = document.getElementById("clear");
    clearElement.onclick = () => {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    };
*/
    let isDrawing;

// --- PATCH: تَحَقَّقْ + قفل الرسم حتى إِعَادَةُ الْبَدْءِ ---
let __locked = false;
let __points = [];
const __mode = "crossCorrect"; // noCrossCorrect | crossCorrect

function __softenGuideLine(ctx, w, h){
  try{
    const y = Math.round(h * 0.72);
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, y-3, w, 6);
    ctx.restore();
  }catch(e){}
}

function __ensureControls(context, canvasElement){
  if(document.getElementById("tehaggagBtn")) return;

  const host = (canvasClickArea && canvasClickArea.parentElement) ? canvasClickArea.parentElement : document.body;
  host.style.position = host.style.position || "relative";

  const fb = document.createElement("div");
  fb.id = "writeFeedback";
  fb.style.cssText = "position:absolute;left:50%;transform:translateX(-50%);bottom:66px;z-index:99999;font-family:'Scheherazade New',serif;font-size:26px;font-weight:800;padding:8px 14px;border-radius:16px;background:rgba(255,255,255,.92);display:none;pointer-events:none;";
  host.appendChild(fb);

  const bar = document.createElement("div");
  bar.id = "writeControlsBar";
  bar.style.cssText = "position:absolute;left:50%;transform:translateX(-50%);bottom:10px;display:flex;gap:10px;z-index:99999;pointer-events:auto;";
  host.appendChild(bar);

  const chk = document.createElement("button");
  chk.id = "tehaggagBtn";
  chk.type = "button";
  chk.textContent = "تَحَقَّقْ";
  chk.style.cssText = "font-family:'Scheherazade New',serif;font-size:22px;padding:10px 16px;border-radius:14px;border:0;min-height:44px;box-shadow:0 6px 16px rgba(0,0,0,.18);background:#ffffff;color:#111;";
  bar.appendChild(chk);

  const rst = document.createElement("button");
  rst.id = "iadetBtn";
  rst.type = "button";
  rst.textContent = "إِعَادَةُ الْبَدْءِ";
  rst.style.cssText = "font-family:'Scheherazade New',serif;font-size:22px;padding:10px 16px;border-radius:14px;border:0;min-height:44px;box-shadow:0 6px 16px rgba(0,0,0,.18);background:#ffffff;color:#111;";
  bar.appendChild(rst);

  function __setFb(text, ok){
    fb.textContent = text;
    fb.style.display = "block";
    fb.style.border = ok ? "2px solid rgba(0,160,80,.45)" : "2px solid rgba(220,40,40,.45)";
    clearTimeout(fb.__t);
    fb.__t = setTimeout(()=>{ fb.style.display="none"; }, 1400);
  }

  function __redrawBase(){
    try {
      context.clearRect(0,0,canvasElement.width,canvasElement.height);
      if (newImg && newImg.complete) {
        context.drawImage(newImg, 0, 0, canvasElement.width, canvasElement.height);
        __softenGuideLine(context, canvasElement.width, canvasElement.height);
      }
    } catch(e){}
  }

  rst.addEventListener("click", (ev)=>{
    ev.preventDefault(); ev.stopPropagation();
    __locked = false;
    __points = [];
    __redrawBase();
  }, {passive:false});

  chk.addEventListener("click", (ev)=>{
    ev.preventDefault(); ev.stopPropagation();
    if(__locked) return;
    const baselineY = canvasElement.height * 0.72;
    const crossed = __points.some(p => p.y < baselineY);
    const ok = (__mode === "noCrossCorrect") ? (!crossed && __points.length>5) : (crossed && __points.length>5);
    __locked = true; // لا يرسم ثانية إلا بعد إِعَادَةُ الْبَدْءِ
    __setFb(ok ? "أَحْسَنْتَ" : "حَاوِلْ مَرَّةً أُخْرَى", ok);
  }, {passive:false});
}


	
//		console.log("canvasElement",canvasElement);

    canvasClickArea.addEventListener('mousedown', function(e) {
        __ensureControls(context, canvasElement);
        if(__locked) return;
        __points = [];
        __points.push({x:e.offsetX,y:e.offsetY});
		
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
        if(__locked) return;
        if (isDrawing) { __points.push({x:e.offsetX,y:e.offsetY}); }
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

window.Script8 = function()
{
  var canvasElement = document.getElementById("annotationCanvas");//document.getElementById("annotationCanvas");
	
var context = canvasElement.getContext("2d");

context.clearRect(0, 0, canvasElement.width, canvasElement.height);		

}

};
