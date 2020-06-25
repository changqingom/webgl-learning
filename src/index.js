import "./styles.css";

const canvas = document.getElementById("canvas");

const gl = canvas.getContext("webgl");

canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;
gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

const vertexShaderScript = `
precision lowp float;
attribute vec3 a_v3Position;
void main(void){
  gl_Position=vec4(a_v3Position,1.0);
}
`;
const fragmentShaderScript = `
precision lowp float;
uniform   vec4 u_color;
void main(void){
  gl_FragColor=u_color;
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
colorIndex = gl.getUniformLocation(glProgram, "u_color");

gl.enableVertexAttribArray(positionsIndex);
gl.enableVertexAttribArray(colorIndex);

gl.uniform4f(colorIndex, 0, 1, 1, 1);

gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 7, 0);

gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
