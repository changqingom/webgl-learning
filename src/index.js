import "./styles.css";
const glMatrix = require("./lib/gl-matrix");

window.glMatrix = glMatrix;

function webGLStart() {
  init();
  tick();
}

let glProgram, gl, canvas;

function init() {
  canvas = document.getElementById("canvas");

  gl = canvas.getContext("webgl");

  canvas.height = canvas.clientHeight;
  canvas.width = canvas.clientWidth;
  gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

  const vertexShaderScript = `
precision lowp float;
attribute vec3 a_v3Position;
uniform   mat4 u_proj;
void main(void){
  gl_Position=u_proj*vec4(a_v3Position,1.0);
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

  glProgram = gl.createProgram();

  gl.attachShader(glProgram, vertexShaderObj);
  gl.attachShader(glProgram, fragmentShaderObj);

  gl.linkProgram(glProgram);

  gl.useProgram(glProgram);
}

function renderScene() {
  gl.clearColor(0, 0, 0, 1);

  gl.clear(gl.COLOR_BUFFER_BIT);
  let colorIndex, projIndex;

  colorIndex = gl.getUniformLocation(glProgram, "u_color");
  projIndex = gl.getUniformLocation(glProgram, "u_proj");

  gl.uniform4f(colorIndex, 1, 1, 0, 1);

  //function ortho(out, left, right, bottom, top, near, far)
  // 当前正交投影矩阵  canvas 左上角 为零起点
  gl.uniformMatrix4fv(
    projIndex,
    false,
    glMatrix.mat4.ortho(
      glMatrix.mat4.create(),
      0,
      canvas.width,
      canvas.height,
      0,
      -10,
      10
    )
  );

  gl.useProgram(glProgram);

  renderLines();

  renderLineLoop();

  renderLineStrip();

  renderTriangles();

  renderTriangleStrip();

  renderTriangleFan();
}

function tick() {
  renderScene();
  requestAnimationFrame(tick);
}

webGLStart();

function renderLines() {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      10,
      10,
      0,
      1.0,
      0,
      0,
      1.0,

      200,
      10,
      0,
      0,
      1.0,
      0,
      1.0,

      250,
      50,
      0,
      0,
      0,
      1.0,
      1.0,

      150,
      50,
      0,
      1.0,
      1.0,
      0,
      1.0,
    ]),
    gl.STATIC_DRAW
  );

  const indexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 3]),
    gl.STATIC_DRAW
  );

  let positionsIndex;

  gl.bindAttribLocation(glProgram, positionsIndex, "a_v3Position");

  gl.enableVertexAttribArray(positionsIndex);

  gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 7, 0);

  gl.drawElements(gl.LINES, 4, gl.UNSIGNED_SHORT, 0);
}

function renderLineLoop() {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      10,
      110,
      0,
      1.0,
      0,
      0,
      1.0,

      200,
      110,
      0,
      0,
      1.0,
      0,
      1.0,

      250,
      150,
      0,
      0,
      0,
      1.0,
      1.0,

      150,
      150,
      0,
      1.0,
      1.0,
      0,
      1.0,
    ]),
    gl.STATIC_DRAW
  );

  const indexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 3]),
    gl.STATIC_DRAW
  );

  let positionsIndex;

  gl.bindAttribLocation(glProgram, positionsIndex, "a_v3Position");

  gl.enableVertexAttribArray(positionsIndex);

  gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 7, 0);

  gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_SHORT, 0);
}

function renderLineStrip() {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      10,
      210,
      0,
      1.0,
      0,
      0,
      1.0,

      200,
      210,
      0,
      0,
      1.0,
      0,
      1.0,

      250,
      250,
      0,
      0,
      0,
      1.0,
      1.0,

      150,
      250,
      0,
      1.0,
      1.0,
      0,
      1.0,
    ]),
    gl.STATIC_DRAW
  );

  const indexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 3]),
    gl.STATIC_DRAW
  );

  let positionsIndex;

  gl.bindAttribLocation(glProgram, positionsIndex, "a_v3Position");

  gl.enableVertexAttribArray(positionsIndex);

  gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 7, 0);

  gl.drawElements(gl.LINE_STRIP, 4, gl.UNSIGNED_SHORT, 0);
}

function renderTriangles() {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      310,
      10,
      0,
      1.0,
      0,
      0,
      1.0,

      500,
      10,
      0,
      0,
      1.0,
      0,
      1.0,

      550,
      50,
      0,
      0,
      0,
      1.0,
      1.0,

      450,
      50,
      0,
      1.0,
      1.0,
      0,
      1.0,
    ]),
    gl.STATIC_DRAW
  );

  const indexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2]),
    gl.STATIC_DRAW
  );

  let positionsIndex;

  gl.bindAttribLocation(glProgram, positionsIndex, "a_v3Position");

  gl.enableVertexAttribArray(positionsIndex);

  gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 7, 0);

  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
}

function renderTriangleStrip() {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      310,
      110,
      0,
      1.0,
      0,
      0,
      1.0,

      510,
      110,
      0,
      0,
      1.0,
      0,
      1.0,

      310,
      160,
      0,
      0,
      0,
      1.0,
      1.0,

      510,
      160,
      0,
      1.0,
      1.0,
      0,
      1.0,
    ]),
    gl.STATIC_DRAW
  );

  const indexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 3]),
    gl.STATIC_DRAW
  );

  let positionsIndex;

  gl.bindAttribLocation(glProgram, positionsIndex, "a_v3Position");

  gl.enableVertexAttribArray(positionsIndex);

  gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 7, 0);

  gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);
}
let count = 3,
  add = true;
function renderTriangleFan() {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const center = [450, 450],
    radius = 100;

  const vertexArray = new Float32Array(3 * (count + 2));
  //起始点 圆心坐标
  vertexArray[0] = 450;
  vertexArray[1] = 450;
  vertexArray[2] = 0;
  const perRadian = (Math.PI * 2) / count;
  for (let index = 1; index <= count; index++) {
    let radian = (index - 1) * perRadian;
    vertexArray[3 * index + 0] = center[0] + Math.cos(radian) * radius;
    vertexArray[3 * index + 1] = center[1] + Math.sin(radian) * radius;
    vertexArray[3 * index + 2] = 0;
  }
  vertexArray[3 * (count + 1) + 0] = vertexArray[3];
  vertexArray[3 * (count + 1) + 1] = vertexArray[4];
  vertexArray[3 * (count + 1) + 2] = 0;

  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

  let positionsIndex;
  gl.bindAttribLocation(glProgram, positionsIndex, "a_v3Position");
  gl.enableVertexAttribArray(positionsIndex);

  gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 3, 0);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, count + 2);
  count += add ? 1 : -1;
  if (count > 60) {
    add = false;
  } else if (count < 3) {
    add = true;
  }
}
