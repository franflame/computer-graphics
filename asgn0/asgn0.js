var canvas;
var ctx;

function main() {
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function handleDrawEvent() {
    let v1_x = document.getElementById("x_v1").value;
    let v1_y = document.getElementById("y_v1").value;
    vec_1 = new Vector3([v1_x, v1_y, 0])

    let v2_x = document.getElementById("x_v2").value;
    let v2_y = document.getElementById("y_v2").value;
    vec_2 = new Vector3([v2_x, v2_y, 0])


    drawVector(vec_1, 'red');
    drawVector(vec_2, 'blue');
}

function handleDrawOperationEvent() {
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let v1_x = document.getElementById("x_v1").value;
    let v1_y = document.getElementById("y_v1").value;
    let v1_orig = new Vector3([v1_x, v1_y, 0]);
    let vec_1 = new Vector3([v1_x, v1_y, 0]);

    let v2_x = document.getElementById("x_v2").value;
    let v2_y = document.getElementById("y_v2").value;
    let v2_orig = new Vector3([v2_x, v2_y, 0]);
    let vec_2= new Vector3([v2_x, v2_y, 0]);

    let scalar_val = document.getElementById("scalar").value;
    const operation = document.getElementById("op-select").value;
    if (!operation) {
        alert("Please select an operation.");
        return;
    }
    let result;
    let result_2;


    drawVector(v1_orig, 'red');
    drawVector(v2_orig, 'blue');

    switch (operation) {
        case "add":
            result = vec_1.add(vec_2);
            //console.log("Result of addition:", result.elements);
            drawVector(result, 'green');
            break;
        case "sub":
            result = vec_1.sub(vec_2);
            //console.log("Result of subtraction:", result.elements);
            drawVector(result, 'green');
            break;
        case "div":
            result = vec_1.div(scalar_val);
            result_2 = vec_2.div(scalar_val);
            drawVector(result, 'green');
            drawVector(result_2, 'green');
            //console.log("Result of division:", result.elements);
            break;
        case "mul":
            result = vec_1.mul(scalar_val);
            result_2 = vec_2.mul(scalar_val);
            drawVector(result, 'green');
            drawVector(result_2, 'green');
            //console.log("Result of multiplication:", result.elements);
            break;
        case "angle_between":
            console.log("Angle: " + angleBetween(vec_1, vec_2));
            break;
        case "area":
            console.log("Area of the triangle: " + areaTriangle(vec_1, vec_2));
            break;
        case "magnitude":
            result = vec_1.magnitude();
            result_2 = vec_2.magnitude();

            console.log("Magnitude v1: ", result);
            console.log("Magnitude v2: ", result_2);

            break;
        case "normalize":
            result = vec_1.normalize();
            result_2 = vec_2.normalize();
            //console.log("Normalized vec_1:", result.elements);
            drawVector(result, 'green');
            drawVector(result_2, 'green');
            break;
        default:
            alert("Unknown operation.");
    }


    //console.log(v1);


    //drawVector(result, 'green');


}


function drawVector(vec, color) {
    // red vector
    // let v1 = new Vector3(2.25, 2.25, 0)

    ctx.strokeStyle = color;
    let cx = canvas.width / 2;
    let cy = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + vec.elements[0] * 20, cy - vec.elements[1] * 20);
    ctx.stroke();
}

function angleBetween(v1, v2) {
    if (!(v1 instanceof Vector3) || !(v2 instanceof Vector3)) {
        throw new Error("Both parameters must be instances of Vector3.");
    }

    let dotProduct = Vector3.dot(v1, v2);

    let magnitude1 = v1.magnitude();
    let magnitude2 = v2.magnitude();

    if (magnitude1 === 0 || magnitude2 === 0) {
        throw new Error("Cannot compute angle with a zero-magnitude vector.");
    }

    let cosTheta = dotProduct / (magnitude1 * magnitude2);

    return Math.acos(cosTheta) * (180 / Math.PI);;

}

function areaTriangle(v1, v2) {
    if (!(v1 instanceof Vector3) || !(v2 instanceof Vector3)) {
        throw new Error("Both parameters must be instances of Vector3.");
    }

    const crossProduct = Vector3.cross(v1, v2);
    const crossMagnitude = crossProduct.magnitude();

    return 0.5 * crossMagnitude;
}
