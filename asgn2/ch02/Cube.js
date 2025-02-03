class Cube {
    constructor() {
      this.type='cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
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

      gl.uniform4f(u_FragColor, rgba[0]*.96, rgba[1]*.96, rgba[2]*.96, rgba[3]);      

      drawTriangle3D( [0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
      drawTriangle3D( [0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0]);
    
      gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);      

      drawTriangle3D( [1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0]);
      drawTriangle3D( [1.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,0.0]);

      gl.uniform4f(u_FragColor, rgba[0]*.94, rgba[1]*.94, rgba[2]*.94, rgba[3]);      

      drawTriangle3D( [0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0]);
      drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0]);
    
      gl.uniform4f(u_FragColor, rgba[0]*.85, rgba[1]*.85, rgba[2]*.85, rgba[3]);      

      drawTriangle3D( [0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0]);
      drawTriangle3D( [0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0]);

      gl.uniform4f(u_FragColor, rgba[0]*.90, rgba[1]*.90, rgba[2]*.90, rgba[3]);      

      drawTriangle3D( [0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
      drawTriangle3D( [0.0,0.0,1.0, 1.0,0.0,1.0, 1.0,1.0,1.0]);
      gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);

      console.log("drew cube")

    }
  }
