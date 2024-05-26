var gl;
var shaderProgram;
var defaultVertexShaderSource = "#version 300 es\nin vec2 position;\n\nout vec2 uv;\n\nvoid main()\n{\n    uv = position;\n    gl_Position = vec4(position.xy, 0.0, 1.0);\n}";
function initializeWebGl(fragmentShaderSource) {
    var canvas = document.getElementById("renderCanvas");
    if (canvas == null) {
        console.error("Could not find canvas");
        return;
    }
    gl = canvas.getContext("webgl2");
    if (gl == null) {
        console.error("Could not create WebGL context");
        return;
    }
    createVertexArrayObject();
    compileShader(fragmentShaderSource);
    window.requestAnimationFrame(render);
}
function createVertexArrayObject() {
    var vertices = [
        -1.0, -1.0,
        -1.0, +1.0,
        +1.0, +1.0,
        +1.0, -1.0
    ];
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    var indices = [
        0, 1, 2,
        0, 2, 3
    ];
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}
function compileShader(fragmentShaderSource) {
    if (shaderProgram != null) {
        gl.useProgram(null);
        gl.deleteProgram(shaderProgram);
    }
    shaderProgram = gl.createProgram();
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, defaultVertexShaderSource);
    gl.compileShader(vertexShader);
    gl.attachShader(shaderProgram, vertexShader);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var fragmentShaderError = gl.getShaderInfoLog(fragmentShader);
        return fragmentShaderError;
    }
    gl.useProgram(shaderProgram);
    return null;
}
function render(timeStamp) {
    var canvas = document.getElementById("renderCanvas");
    if (canvas == null) {
        console.error("Could not find canvas");
        window.requestAnimationFrame(render);
        return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    var color = 30.0 / 255.0;
    gl.clearColor(color, color, color, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var location = gl.getUniformLocation(shaderProgram, "time");
    if (location != null) {
        gl.uniform1f(location, timeStamp);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    window.requestAnimationFrame(render);
}
//# sourceMappingURL=WebGl.js.map