
// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() { 
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position; 
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
  uniform sampler2D u_Sampler7;
  uniform sampler2D u_Sampler8;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  uniform bool u_spotLightOn;
  uniform vec3 u_lightColor;

  void main() {
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    }
    else if (u_whichTexture == 2) {
      gl_FragColor = u_FragColor;

    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);

    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);

    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } 
      else if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }
      else if (u_whichTexture == 5) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    }
      else if (u_whichTexture == 6) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    }
      else if (u_whichTexture == 7) {
      gl_FragColor = texture2D(u_Sampler5, v_UV);
    }
      else if (u_whichTexture == 8) {
      gl_FragColor = texture2D(u_Sampler6, v_UV);
    }
      else if (u_whichTexture == 9) {
      gl_FragColor = texture2D(u_Sampler7, v_UV);
    }
      else if (u_whichTexture == 10) {
      gl_FragColor = texture2D(u_Sampler8, v_UV);
    }
    else {
      gl_FragColor = vec4(1,.2,.2,1);
    }
    
    vec3 lightVector = u_lightPos-vec3(v_VertPos);
    float r=length(lightVector);
    // if (r<1.0) {
    //   gl_FragColor = vec4(1,0,0,1);
    // }
    //   else if (r<2.0) {
    //   gl_FragColor = vec4(0,1,0,1);
    // }


    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    // I need to add D as the direction of the spotlight
    // exponent defines how hard the light falls off at edges 


    vec3 D = vec3(0, -1.0, 0);
    float spot_expo = 0.0;
    // Reflection
    vec3 R = reflect(-L, N);
    float spot_angle = dot(D, -L);

    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    float specular = pow(max(dot(E, R), 0.0), 10.0);

    vec3 diffuse = vec3(u_lightColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    //gl_FragColor = vec4(specular+diffuse+ambient, 1.0);

    if (u_spotLightOn && spot_angle > 0.5) {
      //gl_FragColor = vec4((specular+diffuse+ambient)*pow(dot(D, -L), spot_expo), 1.0)
      float spot_factor = pow(spot_angle,0.5);
      gl_FragColor = vec4((diffuse + ambient + specular) * spot_factor, 1.0);
      //gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
    }
      else if (u_spotLightOn && spot_angle < 0.5) {
      //gl_FragColor = vec4((specular+diffuse+ambient)*pow(dot(D, -L), spot_expo), 1.0)
      //float spot_factor = pow(spot_angle,-0.9);
      gl_FragColor = vec4(0,0,0, 1.0);
      //gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
    }

    if (u_lightOn) {
      if (u_whichTexture == 0) {
          gl_FragColor = vec4(diffuse+ambient, 1.0);
      }
      else {
          gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
      }
  }
    if (u_lightOn && u_spotLightOn) {
        if (spot_angle > 0.5) {
          float spot_factor = pow(spot_angle,-0.9);
          gl_FragColor = vec4((diffuse + ambient + specular) * spot_factor, 1.0);
          }
        else {
        gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
        }
    }
    
  

    
}`
let g_AngleX = 0;
let g_camSlider = 0;
let g_AngleY = 0;

let removed_special_blocks_count = 0;

let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_cameraPos;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_lightPos;
//let u_spotLightPos;
let u_lightOn;
let u_spotLightOn;
let u_lightColor;
let show_animal = false;

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

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
      console.log('Failed to get the storage location of a_UV');
      return;
    }
  
    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
      console.log('Failed to get the storage location of a_Normal');
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

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
    if (!u_lightPos) {
      console.log('Failed to get the storage location of u_lightPos');
      return;
    }

    // u_spotLightPos = gl.getUniformLocation(gl.program, 'u_spotLightPos');
    // if (!u_spotLightPos) {
    //   console.log('Failed to get the storage location of u_spotLightPos');
    //   return;
    // }
    u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
    if (!u_cameraPos) {
      console.log('Failed to get the storage location of u_cameraPos');
      return;
    }

    u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
    if (!u_lightOn) {
      console.log('Failed to get the storage location of u_lightOn');
      return;
    }

    u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
    if (!u_lightColor) {
      console.log('Failed to get the storage location of u_lightColor');
      return;
    }

    u_spotLightOn = gl.getUniformLocation(gl.program, 'u_spotLightOn');
    if (!u_spotLightOn) {
      console.log('Failed to get the storage location of u_spotLightOn');
      return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return false;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return false;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
      console.log('Failed to get the storage location of u_Sampler2');
      return false;
    }

    u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler3) {
      console.log('Failed to get the storage location of u_Sampler3');
      return false;
    }

    u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
    if (!u_Sampler4) {
      console.log('Failed to get the storage location of u_Sampler4');
      return false;
    }

    u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
    if (!u_Sampler5) {
      console.log('Failed to get the storage location of u_Sampler5');
      return false;
    }

    u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
    if (!u_Sampler6) {
      console.log('Failed to get the storage location of u_Sampler6');
      return false;
    }

    u_Sampler7 = gl.getUniformLocation(gl.program, 'u_Sampler7');
    if (!u_Sampler7) {
      console.log('Failed to get the storage location of u_Sampler7');
      return false;
    }

    u_Sampler8 = gl.getUniformLocation(gl.program, 'u_Sampler8');
    if (!u_Sampler8) {
      console.log('Failed to get the storage location of u_Sampler8');
      return false;
    }
    // u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
    // if (!u_Sampler4) {
    //   console.log('Failed to get the storage location of u_Sampler4');
    //   return false;
    // }
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }

}
// onload command

// create variable to tell if textures are loaded

// force rerender until textures are ready

let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_globalAngle = 0;
let g_frontUpLegAngle = 0;
let g_frontLowLegAngle = 0;
let g_backUpLegAngle = 0;
let g_backLowLegAngle = 0;
let g_neckAngle = 0;
let g_footAngle = 0;
let g_animation = false;
let special_animation = false;
let g_camera;
let isDragging = false;
var xyCoord = [0,0];
let g_normalOn = false;
let g_lightPos = [0, 1, -2];
//let g_spotLightPos = [1, 1, -1];
let g_lightOn = false;
let g_spotLightOn = false;
let g_lightColor = [0.6, 0.6, 0.6];

function addActionsForHtmlUI() {

  document.getElementById('normalOn').onclick = function() { g_normalOn = true;};
  document.getElementById('normalOff').onclick = function() { g_normalOn = false; };

  document.getElementById('lightOn').onclick = function() { g_lightOn = true;};  //g_spotLightOn = false;};
  document.getElementById('lightOff').onclick = function() { g_lightOn = false; };

  document.getElementById('spotLightOn').onclick = function() { g_spotLightOn = true;}; //g_lightOn = false;};
  document.getElementById('spotLightOff').onclick = function() { g_spotLightOn = false; };

  
  document.getElementById('redSlide').addEventListener('mousemove', function(ev) { if(ev.buttons==1) { g_lightColor[0] = this.value/100; renderScene();}});
  document.getElementById('greenSlide').addEventListener('mousemove', function(ev) { if(ev.buttons==1) { g_lightColor[1] = this.value/100; renderScene();}});
  document.getElementById('blueSlide').addEventListener('mousemove', function(ev) { if(ev.buttons==1) { g_lightColor[2] = this.value/100; renderScene();}});


  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) { if(ev.buttons==1) { g_lightPos[0] = this.value/100; console.log("new pos: " + this.value); renderScene();}});
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) { if(ev.buttons==1) { g_lightPos[1] = this.value/100; console.log("new pos: " + this.value); renderScene();}});
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) { if(ev.buttons==1) { g_lightPos[2] = this.value/100; console.log("new pos: " + this.value); renderScene();}});

  document.getElementById('lightSlideY').onclick = function() { g_normalOn = false; };
  //document.getElementById('angleSlide').addEventListener('mouseup', function() { g_globalAngle=this.value; renderScene(); });

}

function initTextures(gl, n) {

  // Get the storage location of u_Sampler0

  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTextureToTEXTURE0(image);};
  // Tell the browser to load an image

  image.src = '../resources/lights.jpg';

  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image2.onload = function(){ sendTextureToTEXTURE1(image2);};
  // Tell the browser to load an image
  image2.src = '../resources/gold.jpg';

  var image3 = new Image();  // Create the image object
  if (!image3) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image3.onload = function(){ sendTextureToTEXTURE2(image3);};
  // Tell the browser to load an image
  image3.src = '../resources/snowflakes.jpg';

  var image4 = new Image();  // Create the image object
  if (!image4) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image4.onload = function(){ sendTextureToTEXTURE3(image4);};
  // Tell the browser to load an image
  image4.src = '../resources/rocks.jpg';  
  
  var image5 = new Image();  // Create the image object
  if (!image5) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image5.onload = function(){ sendTextureToTEXTURE4(image5);};
  // Tell the browser to load an image
  image5.src = '../resources/bluesky.jpg';

  var image6 = new Image();  // Create the image object
  if (!image6) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image6.onload = function(){ sendTextureToTEXTURE5(image6);};
  // Tell the browser to load an image
  image6.src = '../resources/wisteria.jpg';  

  var image7 = new Image();  // Create the image object
  if (!image7) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image7.onload = function(){ sendTextureToTEXTURE6(image7);};
  // Tell the browser to load an image
  image7.src = '../resources/roses.jpg';

  var image8 = new Image();  // Create the image object
  if (!image8) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image8.onload = function(){ sendTextureToTEXTURE7(image8);};
  // Tell the browser to load an image
  image8.src = '../resources/volcanic.jpg';  

  var image9 = new Image();  // Create the image object
  if (!image9) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image9.onload = function(){ sendTextureToTEXTURE8(image9);};
  // Tell the browser to load an image
  image9.src = '../resources/purple_flowers.jpg';  
}

// make sure to call renderScene() after the texture is loaded 

function sendTextureToTEXTURE0(image) {
  console.log("loading image 0");
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  ///gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle

}

function sendTextureToTEXTURE1(image2) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
  
  ///gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendTextureToTEXTURE2(image3) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image3);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);
  
  ///gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendTextureToTEXTURE3(image4) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE3);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image4);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler3, 3)
  renderScene();
  
  ///gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendTextureToTEXTURE4(image5) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE4);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image5);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler4, 4)
  renderScene();
  
  ///gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendTextureToTEXTURE5(image6) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE5);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image6);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler5, 5)
  renderScene();
  
  ///gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendTextureToTEXTURE6(image7) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE6);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image7);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler6, 6)
  renderScene();
  
  ///gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendTextureToTEXTURE7(image8) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE7);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image8);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler7, 7)
  renderScene();
  
  ///gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function sendTextureToTEXTURE8(image9) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE8);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image9);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler8, 8)
  renderScene();
  
  ///gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Retrieve <canvas> element
  g_camera = new Camera();
  document.onkeydown = keydown;

  initTextures(gl, 0);
  
  // Specify the color for clearing <canvas>
  

  let lastMouseX = 0;
  let sensitivity = 0.2; // Adjust for smoother panning

  canvas.onmousedown = function(event) {
      isDragging = true;
      lastMouseX = event.clientX;
      click(event); // Preserve existing behavior
  };

  canvas.onmousemove = function(event) {
      if (event.buttons == 1) { 
          click(event, 1); // Preserve existing functionality
      } else {
          if (xyCoord[0] != 0) {
              xyCoord = [0, 0];
          }
      }

      // Handle camera panning when dragging
      if (isDragging) {
          let deltaX = event.clientX - lastMouseX;
          g_camera.pan(deltaX * sensitivity);
          lastMouseX = event.clientX;
          renderScene();
      }
  };

  canvas.onmouseup = function() {
      isDragging = false;
  };

  canvas.onmouseleave = function() {
      isDragging = false;
  };
  console.log("hi");
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
// var g_startTime = performance.now()/1000.0;
// // var g_seconds = performance.now()/1000.0-g_startTime;

// // function tick() {
// //     g_seconds=performance.now()/1000.0-g_startTime;
// //     console.log(performance.now());

// //     updateAnimationAngles();

// //     renderScene();

// //     requestAnimationFrame(tick);
// // }

// let time = 0;
// function tick() {
//     g_seconds = performance.now() / 1000.0 - g_startTime;
//     updateAnimationAngles();
//     renderScene();
//     requestAnimationFrame(tick);
// }

// function updateAnimationAngles() {
//   // if (g_yellowAnimation) {
//   //   g_yellowAngle = (45*Math.sin(g_seconds));
//   // }
//   // if (g_magentaAnimation) {
//   //   g_magentaAngle = (45*Math.sin(3*g_seconds));
//   // }
//   console.log("inside update animation angles");

//   g_lightPos[0] = Math.sin(g_seconds);
//   console.log(g_lightPos[0]);
// }

var g_shapesList = [];

function scroll(ev) {
  if (ev.deltaY > 0) {
      g_camera.forward(1);
  }
  else {
      g_camera.back(1);
  }
}

function click(ev, check) {
  if (isDragging) return; // Ignore clicks while dragging

  if (ev.shiftKey) {
      special_animation = true;
  }

  let [x, y] = convertCoordinatesEventToGL(ev);
  if (xyCoord[0] == 0) {
      xyCoord = [x, y];
  }
  g_AngleX += xyCoord[0] - x;
  g_AngleY += xyCoord[1] - y;
  if (Math.abs(g_AngleX / 360) > 1) {
      g_AngleX = 0;
  }
  if (Math.abs(g_AngleY / 360) > 1) {
      g_AngleY = 0;
  }
}

function getMapCoordinate(forward, range) {
  const x = Math.floor(g_camera.at.elements[0]+4); //+ range * forward.elements[0]);
  const y = Math.floor(g_camera.at.elements[2]+4); //+ range * forward.elements[2]);
  const z = Math.floor(g_camera.at.elements[1]); //+ range * forward.elements[1]);
  console.log("current position" + x + "," + y + "," + z);
  return {x, y, z};

}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x, y]);
}

//var g_camera = new Camera();


function keydown(ev) {
  if (ev.keyCode==68) {
    g_camera.eye.elements[0] += 0.2;
  } 
  else 
  if (ev.keyCode == 65) {
    // use WASD in assignment
    g_camera.eye.elements[0] -= 0.2;
  } 
  else if (ev.keyCode == 87) {
    g_camera.forward();
  } 

  else if (ev.keyCode == 83) {
    g_camera.back();
  }

  else if (ev.keyCode == 81) {
    g_camera.panLeft();
  }

  else if (ev.keyCode == 69) {
    g_camera.panRight();
  }

  else if (ev.keyCode == 67) {
    addCube();
  }

  else if (ev.keyCode == 88) {
    removeCube();
  }

  else if (ev.keyCode == 77) {
    show_animal = true;
  }

  
  console.log(ev.keyCode);
  console.log("eyes=" + g_camera.eye.elements[0] +  "," + g_camera.eye.elements[1] +  "," + g_camera.eye.elements[2]);
  console.log("at=" + g_camera.at.elements[0] +  "," + g_camera.at.elements[1] +  "," +g_camera.at.elements[2]);
  console.log("up=" + g_camera.up.elements[0] +  "," + g_camera.up.elements[1] +  "," +g_camera.up.elements[2]);
  renderScene();
  console.log("gmap is" + g_map);
}

// var g_eye = [0,0,3];
// var g_at = [0,0,-100];
// var g_up=[0,1,0];

function renderScene() {
  console.log("blah");
  var currentStartTime = performance.now();

  console.log("performance: " + performance.now());

  var projMat = new Matrix4();
  projMat.setPerspective(90, canvas.width/canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2], 
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2], 
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);//]0,0,2, 0,0,0, 0,1,0); // eye, at, up
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  //globalRotMat.rotate(g_camSlider, 0, 1, 0);
  //globalRotMat.rotate(g_AngleY, -1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //gl.clear(gl.COLOR_BUFFER_BIT);

    // var try1 = new Cube();
    // try1.color = [1.0, 0.3, 0.0, 1.0];
    // try1.render();
    // keep track of eye location to do collision dtection

    var floor = new Cube();
    
    floor.textureNum= 2;
    if (show_animal == false) {
      floor.color = [0.80,0.80,0.78,1.0];
    }
    else {
      floor.color = [0,0.85,0.2,1.0];
    }
    floor.matrix.translate(0, -.75, 0.0);
    floor.matrix.scale(10, 0, 10);
    floor.matrix.translate(-.5, 0, -0.5);
    floor.render();

    var sky = new Cube();
    sky.color = [0.8,0.2,0.7,1.0];
    sky.textureNum = 2;
    if (g_normalOn) {
      sky.textureNum = -3;
    }
    sky.matrix.scale(-10, -10, -10);
    sky.matrix.translate(-.5, -.5, -0.5);
    sky.render();

    
  
    //front right leg from animal's perspective
    var upperLeg1 = new Cube();
    upperLeg1.color = [1.0, 0.3, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    if (g_normalOn) {
      upperLeg1.textureNum = -3;
    }
    upperLeg1.matrix.setTranslate(-0.25, -0.50, 0.15);
    // upperLeg1.matrix.rotate(270, 0,0,1);  
    // upperLeg1.matrix.rotate(90, 0,1,0); 
    upperLeg1.matrix.scale(0.15,0.2,0.2); 
    upperLeg1.matrix.translate(0.05, -1.0, -0.6);
    
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

    // var lowerLeg1 = new Cube();
    // lowerLeg1.color = [1.0, 0.4, 0.0, 1.0];
    // if (g_normalOn) {
    //   lowerLeg1.textureNum = -3;
    // }
    // //body.matrix.rotate(-5, 1,0,0);
    // lowerLeg1.matrix = upperLeg1.matrix;
    // //lowerLeg1.matrix.rotate(90, 1,0,0);
    // lowerLeg1.matrix.translate(0.0, 0.0, 0.75);
    // //lowerLeg1.matrix.scale(1, 1.2, 1);
    // //lowerLeg1.matrix.rotate(g_frontLowLegAngle, 0,1,0);
    // if (g_animation && special_animation == false) {
    //   lowerLeg1.matrix.rotate(15*(Math.sin(g_seconds)-1), 0,1,0); // side to side
    // }
    // else {
    //   lowerLeg1.matrix.rotate(g_frontLowLegAngle, 0,1,0); // side to side
    // }
    // lowerLeg1.render();

    // var foot1 = new Cube();
    // foot1.color = [0.2, 0.2, 0.2, 1.0];
    // if (g_normalOn) {
    //   foot1.textureNum = -3;
    // }
    // foot1.matrix = lowerLeg1.matrix;
    // foot1.matrix.translate(0.0, 0.0, 1.0);
    // foot1.matrix.rotate(g_footAngle, 0, 1, 0);
    // foot1.render();
  
    // front left from animal's perspective
    var upperLeg2 = new Cube();
    upperLeg2.color = [1.0, 0.3, 0.0, 1.0];
    if (g_normalOn) {
      upperLeg2.textureNum = -3;
    }
    //body.matrix.rotate(-5, 1,0,0);
    upperLeg2.matrix.setTranslate(0.05, -0.50, 0.15);
    // upperLeg2.matrix.rotate(270, 0,0,1);  
    // upperLeg2.matrix.rotate(90, 0,1,0); 
    upperLeg2.matrix.scale(0.15,0.2,0.2); 
    
    upperLeg2.matrix.translate(0.1, -1.0, -0.6);

    if (g_animation && special_animation == false) {
      upperLeg2.matrix.rotate(70*Math.sin(g_seconds), 0,1,0); // side to side
    }
    else if (g_animation && special_animation == true) {
      upperLeg2.matrix.rotate(45*Math.sin(g_seconds) + 1, 1,0,0); 
    }
    else {
      upperLeg2.matrix.rotate(g_frontUpLegAngle, 0,1,0); // side to side
    }

    upperLeg2.render();

    // var lowerLeg2 = new Cube();
    // lowerLeg2.color = [1.0, 0.4, 0.0, 1.0];
    // if (g_normalOn) {
    //   lowerLeg2.textureNum = -3;
    // }
    // //body.matrix.rotate(-5, 1,0,0);
    // lowerLeg2.matrix = upperLeg2.matrix;
    // //lowerLeg1.matrix.rotate(90, 1,0,0);
    // lowerLeg2.matrix.translate(0.0, 0.0, 0.75);
    // //lowerLeg1.matrix.scale(1, 1.2, 1);
    // //lowerLeg2.matrix.rotate(g_frontLowLegAngle, 0,1,0);
    // if (g_animation && special_animation == false) {
    //   lowerLeg2.matrix.rotate(15*(Math.sin(g_seconds)-1), 0,1,0); // side to side
    // }
    // else {
    //   lowerLeg2.matrix.rotate(g_frontLowLegAngle, 0,1,0); // side to side
    // }
    // lowerLeg2.render();

    // var foot2 = new Cube();
    // foot2.color = [0.2, 0.2, 0.2, 1.0];
    // foot2.color = [1.0, 0.4, 0.0, 1.0];
    // if (g_normalOn) {
    //   foot2.textureNum = -3;
    // }
    // foot2.matrix = lowerLeg2.matrix;
    // foot2.matrix.translate(0.0, 0.0, 1.0);
    // foot2.matrix.rotate(g_footAngle, 0, 1, 0);
    // foot2.render();

    var upperLeg3 = new Cube();
    upperLeg3.color = [1.0, 0.3, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    if (g_normalOn) {
      upperLeg3.textureNum = -3;
    }
    upperLeg3.matrix.setTranslate(-0.25, -0.50, 0.60);
    upperLeg3.matrix.scale(0.15,0.2,0.2); 
    upperLeg3.matrix.translate(0.05, -1.0, -1.0);

    // 0, -1.0, -0.6
    // upperLeg2.matrix.translate(0.1, -1.0, -0.6);
    

    if (g_animation && special_animation == false) {
      upperLeg3.matrix.rotate(-60*Math.sin(g_seconds), 0,1,0); // side to side
    }
    else if (g_animation && special_animation == true) {
      upperLeg3.matrix.rotate(45*Math.sin(g_seconds) + 1, 1,0,0); 
    }
    else {
      upperLeg3.matrix.rotate(g_backUpLegAngle, 0,1,0); // side to side
    }
  

    upperLeg3.render();
  
    // var lowerLeg3 = new Cube();
    // lowerLeg3.color = [1.0, 0.4, 0.0, 1.0];
    // if (g_normalOn) {
    //   lowerLeg3.textureNum = -3;
    // }

    // lowerLeg3.matrix = upperLeg3.matrix;

    // lowerLeg3.matrix.translate(0.0, 0.0, 0.75);

    // if (g_animation && special_animation == false) {
    //   lowerLeg3.matrix.rotate(-15*(Math.sin(g_seconds)+1), 0,1,0); // side to side
    // }
    // else {
    //   lowerLeg3.matrix.rotate(g_backLowLegAngle, 0,1,0); // side to side
    // }
    // lowerLeg3.render();
  
    // var foot3 = new Cube();
    // foot3.color = [0.2, 0.2, 0.2, 1.0];
    // if (g_normalOn) {
    //   foot3.textureNum = -3;
    // }
    // foot3.matrix = lowerLeg3.matrix;
    // foot3.matrix.translate(0.0, 0.0, 1.0);
    // foot3.matrix.rotate(g_footAngle, 0, 1, 0);
    // foot3.render();

    var upperLeg4 = new Cube();
    upperLeg4.color = [1.0, 0.3, 0.0, 1.0];
    //body.matrix.rotate(-5, 1,0,0);
    if (g_normalOn) {
      upperLeg4.textureNum = -3;
    }
    upperLeg4.matrix.setTranslate(0.05, -0.50, 0.60);
    // upperLeg4.matrix.rotate(270, 0,0,1);  
    // upperLeg4.matrix.rotate(90, 0,1,0); 
    upperLeg4.matrix.scale(0.15,0.2,0.2); 
    
    upperLeg4.matrix.translate(0.1, -1.0, -1.0);
    

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
  
    // var lowerLeg4 = new Cube();
    // lowerLeg4.color = [1.0, 0.4, 0.0, 1.0];
    // if (g_normalOn) {
    //   lowerLeg4.textureNum = -3;
    // }
    // //body.matrix.rotate(-5, 1,0,0);
    // lowerLeg4.matrix = upperLeg4.matrix;
    // //lowerLeg1.matrix.rotate(90, 1,0,0);
    // lowerLeg4.matrix.translate(0.0, 0.0, 0.75);
    // //lowerLeg1.matrix.scale(1, 1.2, 1);
    // //lowerLeg4.matrix.rotate(g_backLowLegAngle, 0,1,0);
    // if (g_animation && special_animation == false) {
    //   lowerLeg4.matrix.rotate(-15*(Math.sin(g_seconds)+1), 0,1,0); // side to side
    // }
    // else {
    //   lowerLeg4.matrix.rotate(g_backLowLegAngle, 0,1,0); // side to side
    // }
    // lowerLeg4.render();
  
    // var foot4 = new Cube();
    // foot4.color = [0.2, 0.2, 0.2, 1.0];
    // //foot4.textureNum = -1;
    // if (g_normalOn) {
    //   foot4.textureNum = -3;
    // }
    // foot4.matrix = lowerLeg4.matrix;
    // foot4.matrix.translate(0.0, 0.0, 1.0);
    // foot4.matrix.rotate(g_footAngle, 0, 1, 0);
    // foot4.render();

    gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

    //gl.uniform3f(u_spotLightPos, g_spotLightOn[0], g_spotLightOn[1], g_spotLightOn[2]);
    gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);

    gl.uniform1i(u_lightOn, g_lightOn);
    gl.uniform1i(u_spotLightOn, g_spotLightOn);

    var light = new Cube();
    light.textureNum = 2;
    light.color = [2, 2, 0, 1];
    if (!g_spotLightOn || g_spotLightOn && g_lightOn) {
      g_lightPos[0] = Math.sin(g_seconds);
    }
    
    light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
    light.matrix.scale(-0.1, -0.1, -0.1);
    light.matrix.translate(-0.5, -0.5, -0.5);
    light.render();

    // var spotLight = new Cube();
    // spotLight.textureNum = 2;
    // spotLight.color = [2, 2, 0, 1];
    // spotLight.matrix.translate(3, 3, 2);
    // spotLight.matrix.scale(-0.1, -0.1, -0.1);
    // spotLight.matrix.translate(-0.5, -0.5, -0.5);
    // spotLight.render();

    var sp = new Sphere();
    if (g_normalOn) {
      sp.textureNum = -3;
    }
    sp.matrix.translate(2.0, 0, 2.0);

    sp.render();
    
    var body = new Cube();
    body.color = [1.0, 0.3, 0.0, 1.0];
    if (g_normalOn) {
      body.textureNum = -3;
    }

    //body.textureNum = -1;
    body.matrix.translate(-.25, -.55, 0.0);
    //body.matrix.rotate(-5, 1,0,0);
    body.matrix.scale(0.5,0.4,0.65);
    //body.matrix.translate(-.25, -.55, 0.0);
    if (g_animation && special_animation) {
      body.matrix.rotate(5*Math.sin(g_seconds), 0,1,0); // side to side
    }
    body.render();

    var neck = new Cube();
    neck.color = [0.9, 0.3, 0.0, 1.0];
    if (g_normalOn) {
      neck.textureNum = -3;
    }

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
    if (g_normalOn) {
      head.textureNum = -3;
    }
    head.matrix = neck.matrix;
    head.matrix.translate(-0.8, 1.0, -0.5);
    //body.matrix.rotate(-5, 1,0,0);
    head.matrix.scale(2.5,1.5,2.0);
    head.render();

    var right_ear = new Pyramid();
    if (g_normalOn) {
      right_ear.textureNum = -3;
    }
    right_ear.matrix.set(head.matrix);

    var left_ear = new Pyramid();
    if (g_normalOn) {
      left_ear.textureNum = -3;
    }
    var left_eye = new Cube();
    left_eye.color = [0.25, 0.25, 0.25, 1.0];
    if (g_normalOn) {
      left_eye.textureNum = -3;
    }
    left_eye.matrix.set(head.matrix);

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
    snout.color = [0.98, 0.3, 0.0, 1.0];
    snout.matrix = head.matrix;
    if (g_normalOn) {
      snout.textureNum = -3;
    }
    snout.matrix.rotate(270, 1, 0, 0);
    snout.matrix.translate(0.5,0.0, 0.5);
    // snout.matrix.rotate(270, 1, 0, 0);
    // snout.matrix.scale(0.25, 0.25, 0.25);
    snout.render();

    var puff = new Cube();
    if (g_normalOn) {
      puff.textureNum = -3;
    }
    puff.color = [1.0, 1.0, 1.0, 1.0];
    puff.matrix = tail.matrix;
    puff.matrix.translate(-0.5,-1.0,-0.5);
    puff.render();

    if (g_normalOn) {
      right_ear.textureNum = -3;
    }
    right_ear.matrix.scale(0.5, 0.5, 0.5);
    left_ear.matrix = right_ear.matrix;
    right_ear.matrix.translate(0.5,2,1);
    right_ear.render();
  

    //left_ear.matrix.scale(0.08, 0.08, 0.08);
    //left_ear.matrix.translate(1, 3.8,1.5);
    right_ear.matrix.translate(1,0,0);
    left_ear.render();

    
    left_eye.matrix.scale(0.15, 0.15, 0.15);
    left_eye.matrix.translate(0.5, 4, -2.5);
    left_eye.render();

    var right_eye = new Cube();
    right_eye.color = [0.25, 0.25, 0.25, 1.0];
    if (g_normalOn) {
      right_eye.textureNum = -3;
    }
    right_eye.matrix.set(left_eye.matrix);
    right_eye.matrix.translate(4.5, 0, 0);
    right_eye.render();

    var tip = new Cube();
    tip.color = [0.25, 0.25, 0.25, 1.0];
    if (g_normalOn) {
      tip.textureNum = -3;
    }
    tip.matrix.set(left_eye.matrix);
    tip.matrix.translate(2.25, -1.25, -4);
    tip.render();
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
    //drawMap();

    console.log("at end");
}
