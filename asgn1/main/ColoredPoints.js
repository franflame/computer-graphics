// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() { 
    gl_Position = a_Position; 
    gl_PointSize = u_Size; 
  }`

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;' +
  'uniform vec4 u_FragColor;' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;' +
  '}';

  //Global variables 
let canvas;
let gl;
let a_position;
let u_FragColor;
let u_Size;

function setupWebGL() {
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const HEART = 3;
const FOX = 4;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_segmentCount = 10;

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addActionsForHtmlUI() {
  document.getElementById('green').onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red').onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
  document.getElementById('blue').onclick = function() { g_selectedColor = [0.0, 0.0, 1.0, 1.0]; };

  document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };

  document.getElementById('pointButton').onclick = function() { g_selectedType = POINT };
  document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE };
  document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE };
  document.getElementById('heartButton').onclick = function() { g_selectedType = HEART };
  document.getElementById('foxButton').onclick = function() { g_selectedType = FOX };

  document.getElementById('getPaintingButton').onclick = function() {
    paint();
    setupWebGL();
    connectVariablesToGLSL();
    addActionsForHtmlUI();
  };

  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value / 100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value / 100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value / 100; });

  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  document.getElementById('segmentsSlide').addEventListener('mouseup', function() { g_segmentCount = this.value; });

  document.getElementById('surpriseButton').onclick = function() {
    g_selectedColor = [getRandomFloat(0, 1), getRandomFloat(0, 1), getRandomFloat(0, 1), 1.0];

    g_selectedType = getRandomInt(POINT, FOX);

    g_selectedSize = getRandomInt(5, 40);

    g_segmentCount = getRandomInt(10, 100);
  };
}


function main() {
  setupWebGL();
  // Retrieve <canvas> element

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev)}};


  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } 
  else if (g_selectedType== HEART) {
    point = new Heart();
  } else if (g_selectedType == FOX) {
    point = new Fox();
  }
  else {
    point = new Circle();
    point.segments=g_segmentCount;

  }
  console.log(g_selectedType)

  point.position=[x, y];
  point.color=g_selectedColor.slice();
  point.size=g_selectedSize;
  g_shapesList.push(point);

  renderAllShapes();

}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x, y]);
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  
  for(var i = 0; i < len; i++) {

    g_shapesList[i].render();

  }
}

// function used to draw reference picture, sorry for the spaghetti code 

function paint() {
  canvas = document.getElementById("webgl");
  gl = canvas.getContext("webgl");

  if (!gl) {
      alert("WebGL is not supported in this browser!");
      throw new Error("WebGL not supported");
  }

  // Vertex shader
  vertexShaderSource = `
      attribute vec2 a_position;
      uniform vec2 u_resolution;

      void main() {
          // Convert the position from pixel space to clip space
          vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
          gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      }
  `;
  vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vertexShader));
      throw new Error("Failed to compile vertex shader");
  }

  // Fragment shader
  fragmentShaderSource = `
      precision mediump float;
      uniform vec4 u_color;

      void main() {
          gl_FragColor = u_color;
      }
  `;
  fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fragmentShader));
      throw new Error("Failed to compile fragment shader");
  }

  // Link shaders into a program
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      throw new Error("Failed to link program");
  }

  // Look up the location of the attributes and uniforms
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const colorLocation = gl.getUniformLocation(program, "u_color");

  // // Create a buffer to store triangle vertices
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Function to transform coordinates to WebGL's native coordinate system
  function transformToWebGLCoordinates(vertices) {
      const transformed = [];
      const halfWidth = canvas.width / 2;
      const halfHeight = canvas.height / 2;

      for (let i = 0; i < vertices.length; i += 2) {
          const x = vertices[i];
          const y = vertices[i + 1];

          // Transform to WebGL coordinates
          transformed.push(x + halfWidth, halfHeight - y);
      }

      return transformed;
  }

  // Function to draw a triangle
  function drawTriangle2(vertices, color) {
      // Transform coordinates
      const transformedVertices = transformToWebGLCoordinates(vertices);

      // Set triangle vertices
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(transformedVertices), gl.STATIC_DRAW);

      // Use the program
      gl.useProgram(program);

      //Set the resolution
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      //Set the color
      gl.uniform4fv(colorLocation, color);

      //Enable the attribute
      gl.enableVertexAttribArray(positionLocation);

      // Bind the position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      // Describe the attribute
      const size = 2; // 2 components per iteration (x, y)
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

      // Draw the triangle
      const primitiveType = gl.TRIANGLES;
      const count = 3; // 3 vertices
      gl.drawArrays(primitiveType, 0, count);
  }

  // Initial setup: Black background
  gl.clearColor(0, 0, 0, 1); // Black background
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Example: Add multiple triangles
  // upper left wing 
  drawTriangle2(
      [0, 0, -100, 0, -100, 100], 
      [0.380, 0.184, 0.0228, 1]   
  );
  drawTriangle2(
      [0, 0, 0, 40, -100, 100], 
      [0.380, 0.184, 0.0228, 1]   
  );

  // lower left wing
  drawTriangle2(
      [0, 0, -70, 0, -90, -100], 
      [0.380, 0.184, 0.0228, 1]   
  );
  drawTriangle2(
      [0, 0, 0, -60, -90, -100], 
      [0.380, 0.184, 0.0228, 1]   
  );

  // torso left
  drawTriangle2(
      [-10, 0, 0, 10, 0, -10], 
      [0.750, 0.746, 0.743, 1]   
  );

  drawTriangle2(
      [-10, 20, 0, 30, 0, 10], 
      [0.750, 0.746, 0.743, 1]   
  );

  drawTriangle2(
      [-10, 40, 0, 50, 0, 30], 
      [0.750, 0.746, 0.743, 1]   
  );

  // lower torso left
  drawTriangle2(
      [-10, -20, 0, -80, 0, -10], 
      [0.750, 0.746, 0.743, 1]   
  );

  // upper upper wing deco

  drawTriangle2(
      [-80, 75, -20, 20, -20, 40], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // upper lower wing deco

  drawTriangle2(
      [-95, 90, -95, 85, -85, 85], 
      [0.910, 0.430, 0.0364, 1]   
  );

  drawTriangle2(
      [-95, 75, -95, 80, -85, 80], 
      [0.910, 0.430, 0.0364, 1]   
  );

  drawTriangle2(
      [-95, 65, -85, 75, -85, 65], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // longer decos 

  drawTriangle2(
      [-95, 55, -85, 35, -45, 30], 
      [0.910, 0.430, 0.0364, 1]   
  );

  drawTriangle2(
      [-95, 10, -85, 25, -45, 30], 
      [0.910, 0.430, 0.0364, 1]   
  );

  drawTriangle2(
      [-95, 5, -45, 20, -10, 5], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // lower wing decos 
  // lower right 

  drawTriangle2(
      [-20, -40, -20, -60, -70, -80], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // middle 
  drawTriangle2(
      [-20, -30, -70, -50, -70, -65], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // upper

  drawTriangle2(
      [-10, -15, -60, -20, -65, -35], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // antennas left

  drawTriangle2(
      [-10, 60, 0, 50, -8, 55], 
      [0.750, 0.746, 0.743, 1]   
  );

  // upper right wing 
         drawTriangle2(
      [0, 0, 100, 0, 100, 100], 
      [0.380, 0.184, 0.0228, 1]   
  );
  drawTriangle2(
      [0, 0, 0, 40, 100, 100], 
      [0.380, 0.184, 0.0228, 1]   
  );

  // lower right wing
  drawTriangle2(
      [0, 0, 70, 0, 90, -100], 
      [0.380, 0.184, 0.0228, 1]   
  );
  drawTriangle2(
      [0, 0, 0, -60, 90, -100], 
      [0.380, 0.184, 0.0228, 1]   
  );

   // torso right
   drawTriangle2(
      [10, 0, 0, 10, 0, -10], 
      [0.750, 0.746, 0.743, 1]   
  );

  drawTriangle2(
      [10, 20, 0, 30, 0, 10], 
      [0.750, 0.746, 0.743, 1]   
  );

  drawTriangle2(
      [10, 40, 0, 50, 0, 30], 
      [0.750, 0.746, 0.743, 1]   
  );

  // lower torso left
  drawTriangle2(
      [10, -20, 0, -80, 0, -10], 
      [0.750, 0.746, 0.743, 1]   
  );

  // right antenna

  drawTriangle2(
      [10, 60, 0, 50, 8, 55], 
      [0.750, 0.746, 0.743, 1]   
  );

  // right side wing decos 

  drawTriangle2(
      [80, 75, 20, 20, 20, 40], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // upper lower wing deco

  drawTriangle2(
      [95, 90, 95, 85, 85, 85], 
      [0.910, 0.430, 0.0364, 1]   
  );

  drawTriangle2(
      [95, 75, 95, 80, 85, 80], 
      [0.910, 0.430, 0.0364, 1]   
  );

  drawTriangle2(
      [95, 65, 85, 75, 85, 65], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // longer decos 

  drawTriangle2(
      [95, 55, 85, 35, 45, 30], 
      [0.910, 0.430, 0.0364, 1]   
  );

  drawTriangle2(
      [95, 10, 85, 25, 45, 30], 
      [0.910, 0.430, 0.0364, 1]   
  );

  drawTriangle2(
      [95, 5, 45, 20, 10, 5], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // lower wing decos 
  // lower right 

  drawTriangle2(
      [20, -40, 20, -60, 70, -80], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // middle 
  drawTriangle2(
      [20, -30, 70, -50, 70, -65], 
      [0.910, 0.430, 0.0364, 1]   
  );

  // upper

  drawTriangle2(
      [10, -15, 60, -20, 65, -35], 
      [0.910, 0.430, 0.0364, 1]   
  );
}
