import "./styles.css";
import imagePath from "./asset/001.png";
const glMatrix = require("./lib/gl-matrix");

window.glMatrix = glMatrix;
let image;
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
attribute vec2 a_texCoord;
uniform   mat4 u_proj;
varying   vec2 v_texCoord;

void main(void){
  v_texCoord=a_texCoord;
  gl_Position=u_proj*vec4(a_v3Position,1.0);
}
`;
  const fragmentShaderScript = `
precision lowp float;
varying   vec2 v_texCoord;
uniform   sampler2D  u_image;
void main(void){
  gl_FragColor= texture2D(u_image, v_texCoord);
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
  let projIndex;

  projIndex = gl.getUniformLocation(glProgram, "u_proj");

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

  renderTriangleStrip();
}

function tick() {
  renderScene();
  // requestAnimationFrame(tick);
  // setTimeout(tick, 1000 / 10);
}

function renderTriangleStrip() {
  const positionBuffer = gl.createBuffer();
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.bindTexture(gl.TEXTURE_2D, null);

  const uniformTextureIndex = gl.getUniformLocation(glProgram, "u_image");

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(uniformTextureIndex, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      529.0,
      100.0,
      0,
      1.0,
      0,

      50.0,
      100.0,
      0,
      0,
      0,

      529.0,
      457.0,
      0,
      1.0,
      1.0,

      50.0,
      457.0,
      0,
      0,
      1.0
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

  let positionsIndex = 0,
    texCoordIndex = 1;

  gl.bindAttribLocation(glProgram, positionsIndex, "a_v3Position");
  gl.bindAttribLocation(glProgram, texCoordIndex, "a_texCoord");
  gl.enableVertexAttribArray(positionsIndex);
  gl.enableVertexAttribArray(texCoordIndex);

  gl.vertexAttribPointer(positionsIndex, 3, gl.FLOAT, false, (32 / 8) * 5, 0);
  gl.vertexAttribPointer(
    texCoordIndex,
    2,
    gl.FLOAT,
    false,
    (32 / 8) * 5,
    (32 / 8) * 3
  );

  gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);
}

function requestCORSIfNotSameOrigin(img, url) {
  if (new URL(url, window.location.href).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
}

(function getImage() {
  image = new Image();
  image.src = imagePath;
  requestCORSIfNotSameOrigin(image, imagePath);
  image.onload = () => {
    webGLStart();
  };
})();
