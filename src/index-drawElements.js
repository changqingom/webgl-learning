import "./styles.css";

const canvas = document.getElementById("canvas");

const gl = canvas.getContext("webgl");

canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;
gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

gl.clearColor(0, 0, 0, 1);

gl.clear(gl.COLOR_BUFFER_BIT);

const vertexShaderScript = `
attribute vec3 a_v3Position;
void main(void){
gl_Position=vec4(a_v3Position,1.0);
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
    -0.5,
    -0.5,
    0,
    0
  ]),
  gl.STATIC_DRAW
);

const indexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array([0, 1, 2, 0, 2, 3]),
  gl.STATIC_DRAW
);

gl.clearColor(0, 0, 0, 1);

gl.clear(gl.COLOR_BUFFER_BIT);

// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

gl.enableVertexAttribArray(positionsIndex);

gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 4, 0);

// gl.drawArrays(gl.TRIANGLES, 0, 3)

gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
