class Heart {
    constructor() {
        this.type = 'heart';
        this.position = [0.0, 0.0];
        this.color = [1.0, 0.0, 0.0, 1.0]; // Red by default
        this.size = 5.0;
    }

    render() {
        const xy = this.position;
        const rgba = this.color;
        const size = this.size / 100.0;

        // Pass color to the shader
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Define vertices for a heart shape
        const vertices = [];
        const n = 100; // Number of triangles to approximate the shape
        for (let i = 0; i <= n; i++) {
            const angle = (i / n) * 2 * Math.PI;
            const x = Math.pow(Math.sin(angle), 3);
            const y = (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) / 16;
            vertices.push(size * x + xy[0], size * y + xy[1]);
        }

        // Draw heart shape using a triangle fan
        drawTriangleFan(vertices);
    }
}

function drawTriangleFan(vertices) {
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
}
