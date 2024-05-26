let gl: WebGL2RenderingContext;
let shaderProgram: WebGLProgram;

const defaultVertexShaderSource: string = `#version 300 es
in vec2 position;

out vec2 uv;

void main()
{
    uv = position;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

function initializeWebGl(fragmentShaderSource: string) {

    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

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

    const vertices: GLfloat[] = [
        -1.0, -1.0,
        -1.0, +1.0,
        +1.0, +1.0,
        +1.0, -1.0
    ];

    const vao: WebGLVertexArrayObject = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer: WebGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const indices: GLuint[] = [
        0, 1, 2,
        0, 2, 3
    ];

    const indexBuffer: WebGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}

function compileShader(fragmentShaderSource: string) {

    if (shaderProgram != null) {
        gl.useProgram(null);
        gl.deleteProgram(shaderProgram);
    }

    shaderProgram = gl.createProgram();

    const vertexShader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, defaultVertexShaderSource);
    gl.compileShader(vertexShader);
    gl.attachShader(shaderProgram, vertexShader);

    const fragmentShader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    gl.attachShader(shaderProgram, fragmentShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const fragmentShaderError: string = gl.getShaderInfoLog(fragmentShader)
        return fragmentShaderError;
    }

    gl.useProgram(shaderProgram);

    return null;
}

function render(timeStamp: DOMHighResTimeStamp) {

    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

    if (canvas == null) {
        console.error("Could not find canvas");
        window.requestAnimationFrame(render);
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    const color: number = 30.0 / 255.0;
    gl.clearColor(color, color, color, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const location = gl.getUniformLocation(shaderProgram, "time");
    if (location != null) {
        gl.uniform1f(location, timeStamp);
    }

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    window.requestAnimationFrame(render);
}
