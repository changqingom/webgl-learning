// 正交投影  Orthographic projection
import "./styles.css";
const glMatrix = require("./lib/gl-matrix");

window.glMatrix = glMatrix;

function webGLStart() {
  init();
  tick();
}

let glProgram,
  gl,
  canvas,
  transform = -200;

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
uniform   float u_xTransform;
void main(void){
  gl_Position=u_proj*vec4(a_v3Position.xy+u_xTransform,a_v3Position.z,1.0);
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

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0,
      0,
      0,
      1.0,
      0,
      0,
      1.0,

      200,
      0,
      0,
      0,
      1.0,
      0,
      1.0,

      200,
      200,
      0,
      0,
      0,
      1.0,
      1.0,

      0,
      200,
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
}

function renderScene() {
  gl.clearColor(0, 0, 0, 1);

  gl.clear(gl.COLOR_BUFFER_BIT);
  let positionsIndex, colorIndex, projIndex, xTransformIndex;

  gl.bindAttribLocation(glProgram, positionsIndex, "a_v3Position");
  colorIndex = gl.getUniformLocation(glProgram, "u_color");
  projIndex = gl.getUniformLocation(glProgram, "u_proj");
  xTransformIndex = gl.getUniformLocation(glProgram, "u_xTransform");

  gl.enableVertexAttribArray(positionsIndex);

  gl.uniform4f(colorIndex, 1, 1, 0, 1);
  gl.uniform1f(xTransformIndex, transform);
  if (transform >= 600) {
    transform = -200;
  } else {
    transform += 1;
  }

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

  gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 7, 0);

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function tick() {
  renderScene();
  requestAnimationFrame(tick);
}

webGLStart();
