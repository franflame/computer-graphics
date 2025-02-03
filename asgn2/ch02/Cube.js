// reference from: https://github.com/fjtria/cse160/blob/main/asg2/Cube.js

class Cube {
    constructor() {
      this.type='cube';
    //   this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      //this.size = 5.0;
      this.matrix = new Matrix4();
      //this.matrix = mat4.create(); // different from tutorial
    }
  
    render() {
      //var xy = this.position;
      var rgba = this.color;
      //var size = this.size;

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    //   drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);

    //   drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
      drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);

      drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);

      gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);      

      drawTriangle3D( [0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
      drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0]);
    
      gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);      

      drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0]);
      drawTriangle3D( [1.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,0.0]);

      gl.uniform4f(u_FragColor, rgba[0]*.65, rgba[1]*.65, rgba[2]*.65, rgba[3]);      

      drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0]);
      drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0]);
    
      gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);      

      drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0]);
      drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0]);

      gl.uniform4f(u_FragColor, rgba[0]*.75, rgba[1]*.75, rgba[2]*.75, rgba[3]);      

      drawTriangle3D( [0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
      drawTriangle3D( [0.0,0.0,1.0, 1.0,0.0,1.0, 1.0,1.0,1.0]);
      gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);

      //   drawTriangle3D( [0.0,0.0,0.0, 0.1,0.1,0.0, 0.1,0.0,0.0]);
      
      //   drawTriangle3D( [0.0,0.0,0.0, 0.1,0.1,0.0, 0.1,0.0,0.0]);
      // drawTriangle3D( [0.0,0.0,0.0, 0.1,0.1,0.0, 0.1,0.0,0.0]);
      
      // drawTriangle3D( [0.0,0.0,0.0, 0.0,0.1,0.0, 0.1,0.1,0.0]);
      
      
      // drawTriangle3D( [0.0,0.1,0.0, 0.0,0.1,0.1, 0.1,0.1,0.1]);
      // drawTriangle3D( [0.0,0.1,0.0, 0.1,0.1,0.1, 0.1,0.1,0.0]);
      
      
      // drawTriangle3D( [0.1,0.0,0.0, 0.1,0.1,0.0, 0.1,0.1,0.1]);
      // drawTriangle3D( [0.1,0.0,0.1, 0.1,0.1,0.1, 0.1,0.0,0.0]);
      
      
      // drawTriangle3D( [0.0,0.0,0.0, 0.1,0.0,0.0, 0.1,0.0,0.1]);
      // drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,0.1, 0.1,0.0,0.1]);
      
      
      // drawTriangle3D( [0.0,0.0,0.0, 0.0,0.1,0.0, 0.0,0.1,0.1]);
      // drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,0.1, 0.0,0.1,0.1]);
      
      
      // drawTriangle3D( [0.0,0.0,0.1, 0.0,0.1,0.1, 0.1,0.1,0.1]);
      // drawTriangle3D( [0.0,0.0,0.1, 0.1,0.0,0.1, 0.1,0.1,0.1]);
      // Draw
      //gl.uniform1f(u_Size, size);
  
      //gl.drawArrays(gl.POINTS, 0, 1);

      //var d = this.size/200.0;

    //   drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
    //   drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
      console.log("drew cube")

    }
  }
