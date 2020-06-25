import "./styles.css";

const canvas = document.getElementById("canvas");

const gl = canvas.getContext("webgl");

canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;
gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

gl.clearColor(0, 0, 0, 1);

gl.clear(gl.COLOR_BUFFER_BIT);

const vertexShaderScript = `
attribute vec2 a_v3Position;
void main(void){
gl_Position=vec4(a_v3Position,0.0,1.0);
}
`;
const fragmentShaderScript = `
void main(void){
gl_FragColor=vec4(1.0,0.0,0.0,1.0);
}
`;

const vertexShaderObj = gl.createShader(gl.VERTEX_SHADER);
const fragmentShaderObj = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShaderObj, vertexShaderScript);
gl.shaderSource(fragmentShaderObj, fragmentShaderScript);

gl.compileShader(vertexShaderObj);
gl.compileShader(fragmentShaderObj);

const glProgram = gl.createProgram();

gl.attachShader(glProgram, vertexShaderObj);
gl.attachShader(glProgram, fragmentShaderObj);

gl.linkProgram(glProgram);

let positionsIndex;
gl.bindAttribLocation(glProgram, positionsIndex, "a_v3Position");

gl.useProgram(glProgram);

const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -0.5,
    0.5,
    0,
    0,
    0.5,
    0.5,
    0,
    0,
    0.5,
    -0.5,
    0,
    0,
    0.5,
    -0.5,
    0,
    0,
    -0.5,
    -0.5,
    0,
    0,
    -0.5,
    0.5,
    0,
    0
  ]),
  gl.DYNAMIC_DRAW
);

gl.clearColor(0, 0, 0, 1);

gl.clear(gl.COLOR_BUFFER_BIT);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.enableVertexAttribArray(positionsIndex);

gl.vertexAttribPointer(positionsIndex, 2, gl.FLOAT, false, (32 / 8) * 4, 0);

// gl.drawArrays(gl.TRIANGLES, 0, 3)
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
