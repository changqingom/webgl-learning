import "./styles.css";

const canvas = document.getElementById("canvas");

const gl = canvas.getContext("webgl");

canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;
gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

const vertexShaderScript = `
attribute vec3 a_v3Position;
attribute vec4 a_color;
varying   vec4 v_color;
void main(void){
  // v_color=vec4(a_v3Position,1.0);
  v_color=a_color;
  gl_Position=vec4(a_v3Position,1.0);
}
`;
const fragmentShaderScript = `
precision lowp float;
varying   vec4 v_color;
void main(void){
  gl_FragColor=v_color;
}
`;

const vertexShaderObj = gl.createShader(gl.VERTEX_SHADER);
const fragmentShaderObj = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShaderObj, vertexShaderScript);
gl.shaderSource(fragmentShaderObj, fragmentShaderScript);

gl.compileShader(vertexShaderObj);
gl.compileShader(fragmentShaderObj);

if (!gl.getShaderParameter(vertexShaderObj, gl.COMPILE_STATUS)) {
  console.log(gl.getShaderInfoLog(vertexShaderObj));
}
if (!gl.getShaderParameter(fragmentShaderObj, gl.COMPILE_STATUS)) {
  console.log(gl.getShaderInfoLog(fragmentShaderObj));
}

const glProgram = gl.createProgram();

gl.attachShader(glProgram, vertexShaderObj);
gl.attachShader(glProgram, fragmentShaderObj);

gl.linkProgram(glProgram);

gl.useProgram(glProgram);

const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -0.5,
    0.5,
    0,
    1.0,
    0,
    0,
    1.0,

    0.5,
    0.5,
    0,
    0,
    1.0,
    0,
    1.0,

    0.5,
    -0.5,
    0,
    0,
    0,
    1.0,
    1.0,

    -0.5,
    -0.5,
    0,
    1.0,
    1.0,
    0,
    1.0
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
let positionsIndex = 0,
  colorIndex = 1;

gl.bindAttribLocation(glProgram, positionsIndex, "a_v3Position");
gl.bindAttribLocation(glProgram, colorIndex, "a_color");

gl.enableVertexAttribArray(positionsIndex);
gl.enableVertexAttribArray(colorIndex);

gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 7, 0);
gl.vertexAttribPointer(
  colorIndex,
  4,
  gl.FLOAT,
  false,
  (32 / 8) * 7,
  (32 / 8) * 3
);

gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
