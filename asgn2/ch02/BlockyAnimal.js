// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() { 
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position; 
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
}`

  //Global variables 
//from fjtria
let g_AngleX = 0;
let g_camSlider = 0;
let g_AngleY = 0;

let canvas;
let gl;
let a_position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }
  
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_segmentCount = 10;
let g_globalAngle = 0;
let g_frontUpLegAngle = 0;
let g_frontLowLegAngle = 0;
let g_backUpLegAngle = 0;
let g_backLowLegAngle = 0;
let g_neckAngle = 0;
let g_footAngle = 0;
let g_animation = false;
let special_animation = false;
var xyCoord = [0,0];

function addActionsForHtmlUI() {

  document.getElementById('animationOnButton').onclick = function() { g_animation=true };
  document.getElementById('animationOffButton').onclick = function() { g_animation=false; special_animation=false; };

  document.getElementById('angleSlide').addEventListener('mouseup', function() { g_camSlider=this.value; renderScene(); });
  document.getElementById('frontUpLegSlide').addEventListener('mouseup', function() { g_frontUpLegAngle=this.value; renderScene(); });
  document.getElementById('frontLowLegSlide').addEventListener('mouseup', function() { g_frontLowLegAngle=this.value; renderScene(); });
  document.getElementById('backUpLegSlide').addEventListener('mouseup', function() { g_backUpLegAngle=this.value; renderScene(); });
  document.getElementById('backLowLegSlide').addEventListener('mouseup', function() { g_backLowLegAngle=this.value; renderScene(); });
  document.getElementById('footSlide').addEventListener('mouseup', function() { g_footAngle=this.value; renderScene(); });
  document.getElementById('neckSlide').addEventListener('mouseup', function() { g_neckAngle=this.value; renderScene(); });

}

function main() {
  setupWebGL();
  // Retrieve <canvas> element

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev, 1)}
  else {
    if (xyCoord[0] != 0){
        xyCoord = [0,0];
    }}
  };


  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);


  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick() {
    g_seconds=performance.now()/1000.0-g_startTime;
    console.log(performance.now());

    renderScene();

    requestAnimationFrame(tick);
}

var g_shapesList = [];

function click(ev, check){
  // referenced from fjtria 
  if(ev.shiftKey){
      special_animation = true;
  } 

  let [x, y] = convertCoordinatesEventToGL(ev);
  if (xyCoord[0] == 0){
      xyCoord = [x, y];
  }
  g_AngleX += xyCoord[0]-x;
  g_AngleY += xyCoord[1]-y;
  if (Math.abs(g_AngleX / 360) > 1){
      g_AngleX = 0;
  }
  if (Math.abs(g_AngleY / 360) > 1){
      g_AngleY = 0;
  }
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x, y]);
}

function renderScene() {
  var currentStartTime = performance.now();

  
  var globalRotMat = new Matrix4().rotate(g_AngleX, 0, 1, 0);
  globalRotMat.rotate(g_camSlider, 0, 1, 0);
  globalRotMat.rotate(g_AngleY, -1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.clear(gl.COLOR_BUFFER_BIT);

  
    //front right leg from animal's perspective
    var upperLeg1 = new Cube();
    upperLeg1.color = [1.0, 0.3, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    upperLeg1.matrix.setTranslate(-0.25, -0.50, 0.15);
    upperLeg1.matrix.rotate(270, 0,0,1);  
    upperLeg1.matrix.rotate(90, 0,1,0); 
    upperLeg1.matrix.scale(0.1,0.18,0.15); 
    
    // upperLeg1.matrix.scale(0.1,0.20,0.2);
    // upperLeg1.matrix.rotate(180, 1,0,0);
    //upperLeg1.matrix.rotate(g_frontUpLegAngle, 0,1,0);
    if (g_animation && special_animation == false) {
      upperLeg1.matrix.rotate(70*Math.sin(g_seconds), 0,1,0); // side to side
    }
    else if (g_animation && special_animation == true) {
      upperLeg1.matrix.rotate(45*Math.sin(g_seconds) + 1, 1,0,0); 
    }
    else {
      upperLeg1.matrix.rotate(g_frontUpLegAngle, 0,1,0); // side to side
    }

    // upperLeg1.matrix.scale(0.1,0.19,0.12);
    // upperLeg1.matrix.setTranslate(-2.25, -3.75, 1.0);
    //upperLeg1.matrix.scale(0.5,1.0,1.0);
    upperLeg1.render();

    var lowerLeg1 = new Cube();
    lowerLeg1.color = [1.0, 0.4, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    lowerLeg1.matrix = upperLeg1.matrix;
    //lowerLeg1.matrix.rotate(90, 1,0,0);
    lowerLeg1.matrix.translate(0.0, 0.0, 0.75);
    //lowerLeg1.matrix.scale(1, 1.2, 1);
    //lowerLeg1.matrix.rotate(g_frontLowLegAngle, 0,1,0);
    if (g_animation && special_animation == false) {
      lowerLeg1.matrix.rotate(15*(Math.sin(g_seconds)-1), 0,1,0); // side to side
    }
    else {
      lowerLeg1.matrix.rotate(g_frontLowLegAngle, 0,1,0); // side to side
    }
    lowerLeg1.render();

    var foot1 = new Cube();
    foot1.color = [0.2, 0.2, 0.2, 1.0];
    foot1.matrix = lowerLeg1.matrix;
    foot1.matrix.translate(0.0, 0.0, 1.0);
    foot1.matrix.rotate(g_footAngle, 0, 1, 0);
    foot1.render();
  
    // front left from animal's perspective
    var upperLeg2 = new Cube();
    upperLeg2.color = [1.0, 0.3, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    upperLeg2.matrix.setTranslate(0.05, -0.50, 0.15);
    upperLeg2.matrix.rotate(270, 0,0,1);  
    upperLeg2.matrix.rotate(90, 0,1,0); 
    upperLeg2.matrix.scale(0.1,0.18,0.15); 
    
    if (g_animation && special_animation == false) {
      upperLeg2.matrix.rotate(70*Math.sin(g_seconds), 0,1,0); // side to side
    }
    else if (g_animation && special_animation == true) {
      upperLeg2.matrix.rotate(45*Math.sin(g_seconds) + 1, 1,0,0); 
    }
    else {
      upperLeg2.matrix.rotate(g_frontUpLegAngle, 0,1,0); // side to side
    }
    // upperLeg1.matrix.scale(0.1,0.19,0.12);
    // upperLeg1.matrix.setTranslate(-2.25, -3.75, 1.0);
    //upperLeg1.matrix.scale(0.5,1.0,1.0);
    upperLeg2.render();

    var lowerLeg2 = new Cube();
    lowerLeg2.color = [1.0, 0.4, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    lowerLeg2.matrix = upperLeg2.matrix;
    //lowerLeg1.matrix.rotate(90, 1,0,0);
    lowerLeg2.matrix.translate(0.0, 0.0, 0.75);
    //lowerLeg1.matrix.scale(1, 1.2, 1);
    //lowerLeg2.matrix.rotate(g_frontLowLegAngle, 0,1,0);
    if (g_animation && special_animation == false) {
      lowerLeg2.matrix.rotate(15*(Math.sin(g_seconds)-1), 0,1,0); // side to side
    }
    else {
      lowerLeg2.matrix.rotate(g_frontLowLegAngle, 0,1,0); // side to side
    }
    lowerLeg2.render();

    var foot2 = new Cube();
    foot2.color = [0.2, 0.2, 0.2, 1.0];
    foot2.matrix = lowerLeg2.matrix;
    foot2.matrix.translate(0.0, 0.0, 1.0);
    foot2.matrix.rotate(g_footAngle, 0, 1, 0);
    foot2.render();

    var upperLeg3 = new Cube();
    upperLeg3.color = [1.0, 0.3, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    upperLeg3.matrix.setTranslate(-0.25, -0.50, 0.60);
    upperLeg3.matrix.rotate(270, 0,0,1);  
    upperLeg3.matrix.rotate(90, 0,1,0); 
    upperLeg3.matrix.scale(0.1,0.18,0.15); 
    

    if (g_animation && special_animation == false) {
      upperLeg3.matrix.rotate(-60*Math.sin(g_seconds), 0,1,0); // side to side
    }
    else if (g_animation && special_animation == true) {
      upperLeg3.matrix.rotate(45*Math.sin(g_seconds) + 1, 1,0,0); 
    }
    else {
      upperLeg3.matrix.rotate(g_backUpLegAngle, 0,1,0); // side to side
    }
  
    // upperLeg1.matrix.scale(0.1,0.19,0.12);
    // upperLeg1.matrix.setTranslate(-3.25, -3.75, 1.0);
    //upperLeg1.matrix.scale(0.5,1.0,1.0);
    upperLeg3.render();
  
    var lowerLeg3 = new Cube();
    lowerLeg3.color = [1.0, 0.4, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    lowerLeg3.matrix = upperLeg3.matrix;
    //lowerLeg1.matrix.rotate(90, 1,0,0);
    lowerLeg3.matrix.translate(0.0, 0.0, 0.75);
    //lowerLeg1.matrix.scale(1, 1.2, 1);
    //lowerLeg3.matrix.rotate(g_backLowLegAngle, 0,1,0);
    if (g_animation && special_animation == false) {
      lowerLeg3.matrix.rotate(-15*(Math.sin(g_seconds)+1), 0,1,0); // side to side
    }
    else {
      lowerLeg3.matrix.rotate(g_backLowLegAngle, 0,1,0); // side to side
    }
    lowerLeg3.render();
  
    var foot3 = new Cube();
    foot3.color = [0.2, 0.2, 0.2, 1.0];
    foot3.matrix = lowerLeg3.matrix;
    foot3.matrix.translate(0.0, 0.0, 1.0);
    foot3.matrix.rotate(g_footAngle, 0, 1, 0);
    foot3.render();

    var upperLeg4 = new Cube();
    upperLeg4.color = [1.0, 0.3, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    upperLeg4.matrix.setTranslate(0.05, -0.50, 0.60);
    upperLeg4.matrix.rotate(270, 0,0,1);  
    upperLeg4.matrix.rotate(90, 0,1,0); 
    upperLeg4.matrix.scale(0.1,0.18,0.15); 
    

    if (g_animation && special_animation == false) {
      upperLeg4.matrix.rotate(-60*Math.sin(g_seconds), 0,1,0); // side to side
    }
    else if (g_animation && special_animation == true) {
      upperLeg4.matrix.rotate(45*Math.sin(g_seconds) + 1, 1,0,0); 
    }
    else {
      upperLeg4.matrix.rotate(g_backUpLegAngle, 0,1,0); // side to side
    }
  
    // upperLeg1.matrix.scale(0.1,0.19,0.12);
    // upperLeg1.matrix.setTranslate(-4.25, -4.75, 1.0);
    //upperLeg1.matrix.scale(0.5,1.0,1.0);
    upperLeg4.render();
  
    var lowerLeg4 = new Cube();
    lowerLeg4.color = [1.0, 0.4, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    lowerLeg4.matrix = upperLeg4.matrix;
    //lowerLeg1.matrix.rotate(90, 1,0,0);
    lowerLeg4.matrix.translate(0.0, 0.0, 0.75);
    //lowerLeg1.matrix.scale(1, 1.2, 1);
    //lowerLeg4.matrix.rotate(g_backLowLegAngle, 0,1,0);
    if (g_animation && special_animation == false) {
      lowerLeg4.matrix.rotate(-15*(Math.sin(g_seconds)+1), 0,1,0); // side to side
    }
    else {
      lowerLeg4.matrix.rotate(g_backLowLegAngle, 0,1,0); // side to side
    }
    lowerLeg4.render();
  
    var foot4 = new Cube();
    foot4.color = [0.2, 0.2, 0.2, 1.0];
    foot4.matrix = lowerLeg4.matrix;
    foot4.matrix.translate(0.0, 0.0, 1.0);
    foot4.matrix.rotate(g_footAngle, 0, 1, 0);
    foot4.render();

    var body = new Cube();
    body.color = [0.8, 0.3, 0.0, 1.0];
    body.matrix.translate(-.25, -.55, 0.0);
    //body.matrix.rotate(-5, 1,0,0);
    body.matrix.scale(0.5,0.4,0.65);
    //body.matrix.translate(-.25, -.55, 0.0);
    if (g_animation && special_animation) {
      body.matrix.rotate(5*Math.sin(g_seconds), 0,1,0); // side to side
    }
    body.render();

    var neck = new Cube();
    neck.color = [0.8, 0.3, 0.0, 1.0];
    neck.matrix.translate(-0.05, -.2, 0.10);
    //body.matrix.rotate(-5, 1,0,0);
    neck.matrix.scale(0.1,0.20,0.1);
    //neck.matrix.rotate(g_neckAngle, 0,1,0); // side to side
    if (g_animation && special_animation) {
        neck.matrix.rotate(45*Math.sin(g_seconds), 0,1,0); // side to side
    }
    else if (g_animation && special_animation == false) {
      neck.matrix.rotate(-10*Math.sin(g_seconds), 1,0,0);
    }
    else {
        neck.matrix.rotate(g_neckAngle, 0,1,0); // side to side
    }
    
    //neck.matrix.rotate(g_neckAngle, 1,0,0); // front and back
    neck.render();

    var head = new Cube();
    head.color = [0.95, 0.3, 0.0, 1.0];
    head.matrix = neck.matrix;
    head.matrix.translate(-0.8, 1.0, -0.5);
    //body.matrix.rotate(-5, 1,0,0);
    head.matrix.scale(2.5,1.5,2.0);
    head.render();

    var right_ear = new Pyramid();
    right_ear.matrix.set(head.matrix);

    var left_ear = new Pyramid();
    

    var tail = new Pyramid();
    tail.color = [0.95, 0.3, 0.0, 1.0];
    tail.matrix.scale(0.15, -0.25, 0.15);
    tail.matrix.translate(0, 1.0, 5.25)
    tail.matrix.rotate(270, 1, 0, 0);
    
    if (g_animation) {
      tail.matrix.rotate(45*Math.sin(g_seconds), 0,1,0); // side to side
    }
    tail.render();

    var snout = new Pyramid();
    snout.color = [0.95, 0.3, 0.0, 1.0];
    snout.matrix = head.matrix;
    snout.matrix.rotate(270, 1, 0, 0);
    snout.matrix.translate(0.5,0.0, 0.5);
    // snout.matrix.rotate(270, 1, 0, 0);
    // snout.matrix.scale(0.25, 0.25, 0.25);
    snout.render();

    var puff = new Cube();
    puff.color = [1.0, 1.0, 1.0, 1.0];
    puff.matrix = tail.matrix;
    puff.matrix.translate(-0.5,-1.0,-0.5);
    puff.render();

    
    right_ear.matrix.scale(0.5, 0.5, 0.5);
    left_ear.matrix = right_ear.matrix;
    right_ear.matrix.translate(0.5,2,1);
    right_ear.render();
  

    //left_ear.matrix.scale(0.08, 0.08, 0.08);
    //left_ear.matrix.translate(1, 3.8,1.5);
    right_ear.matrix.translate(1,0,0);
    left_ear.render();

    // taken from fjtria
    var duration = performance.now() - currentStartTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "performance");
    }

    function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

