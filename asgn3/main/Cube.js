// class Cube {
//     constructor() {
//       this.type='cube';
//       this.color = [1.0, 1.0, 1.0, 1.0];
//       this.matrix = new Matrix4();
//       this.textureNum = -1;
//       this.verts = [
//         // front
//           0, 0, 0, 1, 1, 0, 1, 0, 0,
//           0, 0, 0, 0, 1, 0, 1, 1, 0,
//           // top
//           0, 1, 0, 0, 1, 1, 1, 1, 1,
//           0, 1, 0, 1, 1, 1, 1, 1, 0,
//           // bottom
//           0, 1, 0, 0, 1, 1, 1, 1, 1,
//           0, 1, 0, 1, 1, 1, 1, 1, 0,
//           // left
//           1, 0, 0, 1, 1, 1, 1, 1, 0,
//           1, 0, 0, 1, 0, 1, 1, 1, 1,
//           // right 
//           0, 0, 0, 0, 1, 1, 0, 1, 0,
//           0, 0, 0, 0, 0, 1, 0, 1, 1,
//           // back
//           0, 0, 1, 1, 1, 1, 0, 1, 1,
//           0, 0, 1, 1, 0, 1, 1, 1, 1
//       ];
//       this.uvVerts = [
//           0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
//           0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
//           0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
//           0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
//           0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
//           0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1
//       ];
//     }
  
//     render() {
//       //var xy = this.position;
//       var rgba = this.color;
//       //var size = this.size;
//       gl.uniform1i(u_whichTexture, this.textureNum);

//       // Pass the color of a point to u_FragColor variable
//       gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

//       gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
//     //   drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);

//     //drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
//       drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [1,0, 0,1, 1,1]);

//       //drawTriangle3D( [0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);

//       drawTriangle3DUV( [0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], [0,0, 0,1, 1,1]);

//       gl.uniform4f(u_FragColor, rgba[0]*.96, rgba[1]*.96, rgba[2]*.96, rgba[3]);      

//       drawTriangle3DUV( [0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0], [1,0, 0,1, 1,1]);
//       drawTriangle3DUV( [0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0], [0,0, 0,1, 1,1]);
    
//       //gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);      

//       drawTriangle3DUV( [1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0], [1,0, 0,1, 1,1]);
//       drawTriangle3DUV( [1.0,0.0,1.0, 1.0,1.0,1.0, 1.0,0.0,0.0], [0,0, 0,1, 1,1]);

//       //gl.uniform4f(u_FragColor, rgba[0]*.94, rgba[1]*.94, rgba[2]*.94, rgba[3]);      

//       drawTriangle3DUV( [0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0], [1,0, 0,1, 1,1]);
//       drawTriangle3DUV( [0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0], [0,0, 0,1, 1,1]);
    
//       //gl.uniform4f(u_FragColor, rgba[0]*.85, rgba[1]*.85, rgba[2]*.85, rgba[3]);      

//       drawTriangle3DUV( [0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0], [1,0, 0,1, 1,1]);
//       drawTriangle3DUV( [0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,1.0], [0,0, 0,1, 1,1]);

//       //gl.uniform4f(u_FragColor, rgba[0]*.90, rgba[1]*.90, rgba[2]*.90, rgba[3]);      

//       drawTriangle3DUV( [0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0], [1,0, 0,1, 1,1]);
//       drawTriangle3DUV( [0.0,0.0,1.0, 1.0,0.0,1.0, 1.0,1.0,1.0], [0,0, 0,1, 1,1]);
//       //gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);

//       //console.log("drew cube")

//     }
    
//     renderfaster() {
//       var rgba = this.color;
      
//       gl.uniform1i(u_whichTexture, this.textureNum);
//       gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
//       gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
//       // Draw each triangle in the cube
//       for (let i = 0; i < this.verts.length; i += 9) {
//         let triangleVerts = this.verts.slice(i, i + 9);   // Get 9 values for one triangle (3 vertices, 3 coords each)
//         //console.log(triangleVerts);
//         let triangleUVs = this.uvVerts.slice(i, i + 6);    // Get 6 UVs for one triangle (2 UVs per vertex)
//         //console.log(triangleUVs);
        
//         drawTriangle3DUV(triangleVerts, triangleUVs);
//       }
//     }
    
//   }
// from fjtria
class Cube {
  constructor() {
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.textureNum = -1;
      this.verts = [
          // front
          0, 0, 0, 1, 1, 0, 1, 0, 0,
          0, 0, 0, 0, 1, 0, 1, 1, 0,
          // top
          0, 1, 0, 0, 1, 1, 1, 1, 1,
          0, 1, 0, 1, 1, 1, 1, 1, 0,
          // bottom
          0, 1, 0, 0, 1, 1, 1, 1, 1,
          0, 1, 0, 1, 1, 1, 1, 1, 0,
          // left
          1, 0, 0, 1, 1, 1, 1, 1, 0,
          1, 0, 0, 1, 0, 1, 1, 1, 1,
          // right 
          0, 0, 0, 0, 1, 1, 0, 1, 0,
          0, 0, 0, 0, 0, 1, 0, 1, 1,
          // back
          0, 0, 1, 1, 1, 1, 0, 1, 1,
          0, 0, 1, 1, 0, 1, 1, 1, 1
      ];
      this.uvVerts = [
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
          0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1
      ];
  }

  render() {
      var rgba = this.color;
  
      gl.uniform1i(u_whichTexture, this.textureNum);
  
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      drawTriangle3DUV([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0]);
      drawTriangle3DUV([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1]);
  
      drawTriangle3DUV([0, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0]);
      drawTriangle3DUV([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);
  
      drawTriangle3DUV([0, 0, 0, 1, 0, 1, 0, 0, 1], [0, 0, 1, 1, 1, 0]);
      drawTriangle3DUV([0, 0, 0, 1, 0, 0, 1, 0, 1], [0, 0, 0, 1, 1, 1]);
  
      drawTriangle3DUV([1, 0, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0]);
      drawTriangle3DUV([1, 0, 0, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);
  
      drawTriangle3DUV([0, 0, 0, 0, 1, 1, 0, 1, 0], [0, 0, 1, 1, 1, 0]);
      drawTriangle3DUV([0, 0, 0, 0, 0, 1, 0, 1, 1], [0, 0, 0, 1, 1, 1]);
  
      drawTriangle3DUV([0, 0, 1, 1, 1, 1, 0, 1, 1], [0, 0, 1, 1, 1, 0]);
      drawTriangle3DUV([0, 0, 1, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1]);
  }

  renderfaster() {
      var rgba = this.color;
  
      gl.uniform1i(u_whichTexture, this.textureNum);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      drawTriangle3DUV(this.verts, this.uvVerts);
  }  

}