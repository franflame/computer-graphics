class Fox {
    constructor() {
        this.type = 'fox';
        this.position = [0.0, 0.0]; // Center of the star
        this.color = [1.0, 1.0, 0.0, 1.0]; // Default color: Yellow
        this.size = 5.0; // Size of the star
        this.numPoints = 5; // Number of points (5 for a pentagram, 7 for a heptagram, etc.)
    }

    render() {
        const xy = this.position; // Center position of the star
        const rgba = this.color; // Color (RGBA)
        const size = this.size / 100.0; // Normalize size to fit the canvas
        const numPoints = this.numPoints; // Number of points for the star

        // Pass the color to the shader
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Generate star vertices
        const vertices = [];
        const angleStep = (Math.PI * 2) / numPoints; // Step between points

        const outerRadius = size;
        const innerRadius = size * 0.5; // Inner radius of the star

        // Generate the star's outer and inner points
        for (let i = 0; i < numPoints; i++) {
            // Outer points (even indices)
            const outerAngle = i * angleStep - Math.PI / 2; // Rotate the star to start at the top
            const outerX = xy[0] + outerRadius * Math.cos(outerAngle);
            const outerY = xy[1] + outerRadius * Math.sin(outerAngle);
            vertices.push(outerX, outerY);

            // Inner points (odd indices)
            const innerAngle = (i + 0.5) * angleStep - Math.PI / 2; // Half step for inner points
            const innerX = xy[0] + innerRadius * Math.cos(innerAngle);
            const innerY = xy[1] + innerRadius * Math.sin(innerAngle);
            vertices.push(innerX, innerY);
        }

        // Draw star using a triangle fan
        drawTriangleFan(vertices);
    }
}

function drawTriangleFan(vertices) {
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('Failed to create the buffer object');
        return;
    }

    // Bind and load vertex data into the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Link buffer to shader attribute
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Draw the shape as a triangle fan
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
}
