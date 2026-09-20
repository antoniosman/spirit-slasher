(() => {
  "use strict";

  const vertexColor = `
    attribute vec3 aPosition;
    uniform mat4 uMvp;
    void main() { gl_Position = uMvp * vec4(aPosition, 1.0); }
  `;
  const fragmentColor = `
    precision mediump float;
    uniform vec4 uColor;
    void main() { gl_FragColor = uColor; }
  `;
  const vertexTexture = `
    attribute vec3 aPosition;
    attribute vec2 aUv;
    uniform mat4 uMvp;
    varying vec2 vUv;
    void main() {
      gl_Position = uMvp * vec4(aPosition, 1.0);
      vUv = aUv;
    }
  `;
  const fragmentTexture = `
    precision mediump float;
    uniform sampler2D uTexture;
    uniform float uOpacity;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(uTexture, vUv);
      float vignette = smoothstep(0.0, .18, vUv.x) * smoothstep(0.0, .18, 1.0 - vUv.x);
      gl_FragColor = vec4(texel.rgb * vec3(.72, .78, .81), texel.a * vignette * uOpacity);
    }
  `;
  const vertexAtmosphere = `
    attribute vec3 aSeed;
    uniform float uTime;
    uniform float uAspect;
    void main() {
      float depth = mod(aSeed.z + uTime * (.035 + aSeed.x * .018), 1.0);
      float x = aSeed.x * 2.0 - 1.0 + sin(uTime * (.18 + aSeed.y) + aSeed.z * 12.0) * .08;
      float y = aSeed.y * 2.0 - 1.0 + cos(uTime * .13 + aSeed.x * 9.0) * .05;
      gl_Position = vec4(x / uAspect, y, depth * 1.8 - .9, 1.0);
      gl_PointSize = 1.5 + (1.0 - depth) * 7.0;
    }
  `;
  const fragmentAtmosphere = `
    precision mediump float;
    uniform vec3 uTint;
    void main() {
      vec2 centered = gl_PointCoord - .5;
      float alpha = smoothstep(.5, 0.0, length(centered)) * .34;
      gl_FragColor = vec4(uTint, alpha);
    }
  `;

  const cubeVertices = new Float32Array([
    -1,-1, 1, 1,-1, 1, 1, 1, 1, -1,-1, 1, 1, 1, 1, -1, 1, 1,
     1,-1,-1,-1,-1,-1,-1, 1,-1, 1,-1,-1,-1, 1,-1, 1, 1,-1,
    -1,-1,-1,-1,-1, 1,-1, 1, 1,-1,-1,-1,-1, 1, 1,-1, 1,-1,
     1,-1, 1, 1,-1,-1, 1, 1,-1, 1,-1, 1, 1, 1,-1, 1, 1, 1,
    -1, 1, 1, 1, 1, 1, 1, 1,-1,-1, 1, 1, 1, 1,-1,-1, 1,-1,
    -1,-1,-1, 1,-1,-1, 1,-1, 1,-1,-1,-1, 1,-1, 1,-1,-1, 1
  ]);
  const quadVertices = new Float32Array([
    -.5,-.5,0, 0,1,  .5,-.5,0, 1,1,  .5,.5,0, 1,0,
    -.5,-.5,0, 0,1,  .5,.5,0, 1,0,  -.5,.5,0, 0,0
  ]);

  function shader(gl, type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(result) || "WebGL shader error");
    return result;
  }

  function program(gl, vertex, fragment) {
    const result = gl.createProgram();
    gl.attachShader(result, shader(gl, gl.VERTEX_SHADER, vertex));
    gl.attachShader(result, shader(gl, gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(result);
    if (!gl.getProgramParameter(result, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(result) || "WebGL link error");
    return result;
  }

  function multiply(a, b) {
    const out = new Float32Array(16);
    for (let column = 0; column < 4; column += 1) {
      for (let row = 0; row < 4; row += 1) {
        out[column * 4 + row] =
          a[row] * b[column * 4] + a[4 + row] * b[column * 4 + 1] +
          a[8 + row] * b[column * 4 + 2] + a[12 + row] * b[column * 4 + 3];
      }
    }
    return out;
  }

  function perspective(fieldOfView, aspect, near, far) {
    const f = 1 / Math.tan(fieldOfView / 2);
    const range = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * range, -1,
      0, 0, 2 * far * near * range, 0
    ]);
  }

  function normalize(vector) {
    const length = Math.hypot(...vector) || 1;
    return vector.map(value => value / length);
  }

  function lookAt(eye, center, up) {
    const z = normalize([eye[0] - center[0], eye[1] - center[1], eye[2] - center[2]]);
    const x = normalize([up[1] * z[2] - up[2] * z[1], up[2] * z[0] - up[0] * z[2], up[0] * z[1] - up[1] * z[0]]);
    const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
    return new Float32Array([
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -(x[0] * eye[0] + x[1] * eye[1] + x[2] * eye[2]),
      -(y[0] * eye[0] + y[1] * eye[1] + y[2] * eye[2]),
      -(z[0] * eye[0] + z[1] * eye[1] + z[2] * eye[2]), 1
    ]);
  }

  function model(position, scale, yaw = 0) {
    const cosine = Math.cos(yaw);
    const sine = Math.sin(yaw);
    return new Float32Array([
      cosine * scale[0], 0, -sine * scale[0], 0,
      0, scale[1], 0, 0,
      sine * scale[2], 0, cosine * scale[2], 0,
      position[0], position[1], position[2], 1
    ]);
  }

  function texture(gl, source) {
    const result = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, result);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([25, 29, 32, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    const image = new Image();
    image.decoding = "async";
    image.addEventListener("load", () => {
      gl.bindTexture(gl.TEXTURE_2D, result);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    });
    image.src = source;
    return result;
  }

  function mount(canvas, options) {
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return () => {};
    let stopped = false;
    let frame = 0;
    let startedAt = performance.now();
    const colorProgram = program(gl, vertexColor, fragmentColor);
    const textureProgram = program(gl, vertexTexture, fragmentTexture);
    const cubeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
    const deadTexture = texture(gl, options.imageFor(options.deceased));
    const attendeeTextures = options.attendees.map(name => texture(gl, options.imageFor(name)));

    const drawCube = (vp, position, scale, color, yaw = 0) => {
      gl.useProgram(colorProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
      const attribute = gl.getAttribLocation(colorProgram, "aPosition");
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(gl.getUniformLocation(colorProgram, "uMvp"), false, multiply(vp, model(position, scale, yaw)));
      gl.uniform4fv(gl.getUniformLocation(colorProgram, "uColor"), color);
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    };

    const drawPortrait = (vp, portraitTexture, position, scale, opacity = 1) => {
      gl.useProgram(textureProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      const positionAttribute = gl.getAttribLocation(textureProgram, "aPosition");
      const uvAttribute = gl.getAttribLocation(textureProgram, "aUv");
      gl.enableVertexAttribArray(positionAttribute);
      gl.enableVertexAttribArray(uvAttribute);
      gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 20, 0);
      gl.vertexAttribPointer(uvAttribute, 2, gl.FLOAT, false, 20, 12);
      gl.uniformMatrix4fv(gl.getUniformLocation(textureProgram, "uMvp"), false, multiply(vp, model(position, scale)));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, portraitTexture);
      gl.uniform1i(gl.getUniformLocation(textureProgram, "uTexture"), 0);
      gl.uniform1f(gl.getUniformLocation(textureProgram, "uOpacity"), opacity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
    };

    const render = now => {
      if (stopped) return;
      resize();
      const elapsed = (now - startedAt) / 1000;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      const projection = perspective(Math.PI / 4.2, canvas.width / canvas.height, .1, 100);
      const cameraSway = Math.sin(elapsed * .22) * .28;
      const view = lookAt([cameraSway, 3.1, 11.8], [0, -.25, .2], [0, 1, 0]);
      const vp = multiply(projection, view);

      drawCube(vp, [0, -1.72, 0], [8.8, .08, 7.5], [.025, .035, .037, 1]);
      drawCube(vp, [0, -1.48, .3], [1.75, .2, 2.8], [.11, .095, .075, 1]);
      drawCube(vp, [0, -1.22, .35], [1.45, .25, 2.45], [.075, .065, .055, 1]);
      drawCube(vp, [0, -.25, 1.25], [1.24, 1.45, .18], [.16, .17, .16, 1]);
      drawCube(vp, [0, 1.15, 1.25], [.82, .18, .22], [.19, .20, .19, 1]);
      drawPortrait(vp, deadTexture, [0, -.02, 1.04], [1.72, 2.15, 1], .88);
      [[-1.85,-.92,.9], [1.85,-.92,.9], [-2.35,-1.08,-.55], [2.35,-1.08,-.55]].forEach((position, candleIndex) => {
        drawCube(vp, position, [.075, .34 + candleIndex * .025, .075], [.72, .65, .48, 1]);
        const flameHeight = .11 + Math.sin(elapsed * 7 + candleIndex) * .025;
        drawCube(vp, [position[0], position[1] + .42 + candleIndex * .025, position[2]], [.055, flameHeight, .045], [1, .56 + candleIndex * .04, .12, .92], Math.sin(elapsed * 5 + candleIndex) * .2);
      });

      const attendeeCount = options.attendees.length;
      options.attendees.forEach((name, index) => {
        const row = index % 2;
        const column = Math.floor(index / 2);
        const side = index % 4 < 2 ? -1 : 1;
        const lane = Math.floor(column / 2);
        const targetX = side * (2.25 + lane * .82);
        const targetZ = -.1 - row * 1.35 - lane * .22;
        const delay = index * .075;
        const walk = Math.max(0, Math.min(1, (elapsed - delay) / 1.75));
        const eased = 1 - Math.pow(1 - walk, 3);
        const startX = targetX + side * 4.8;
        const x = startX + (targetX - startX) * eased;
        const bob = walk < 1 ? Math.abs(Math.sin((elapsed + index) * 7)) * .08 : 0;
        const mourningBow = walk >= 1 ? Math.abs(Math.sin(elapsed * .72 + index)) * .055 : 0;
        drawPortrait(vp, attendeeTextures[index], [x, -.6 + bob - mourningBow, targetZ], [.78, 1.42, 1], Math.min(1, walk * 1.8));

        if (walk > .82) {
          const tearProgress = ((elapsed + index * .37) % 2.2) / 2.2;
          drawCube(vp, [x + side * .08, .05 - tearProgress * .72, targetZ - .035], [.018, .06, .018], [.28, .67, .92, .74]);
        }

        const throwStart = 2.1 + delay + (index % 5) * .18;
        const flowerProgress = ((elapsed - throwStart) % 4.6) / 1.45;
        if (flowerProgress >= 0 && flowerProgress <= 1) {
          const fx = x * (1 - flowerProgress);
          const fz = targetZ + (.25 - targetZ) * flowerProgress;
          const fy = .35 + (-1.02 - .35) * flowerProgress + Math.sin(flowerProgress * Math.PI) * 1.75;
          const color = index % 3 === 0 ? [.72, .035, .08, 1] : index % 3 === 1 ? [.88, .78, .72, 1] : [.42, .08, .16, 1];
          drawCube(vp, [fx, fy, fz], [.09, .035, .22], color, flowerProgress * 8 + index);
        }
      });

      for (let index = 0; index < 22; index += 1) {
        const angle = index * 2.399;
        const radius = .35 + (index % 7) * .18;
        drawCube(vp, [Math.cos(angle) * radius, -1.0 + (index % 3) * .018, .28 + Math.sin(angle) * radius], [.07, .025, .16], index % 2 ? [.55,.03,.08,1] : [.75,.68,.62,1], angle);
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      [deadTexture, ...attendeeTextures].forEach(item => gl.deleteTexture(item));
      gl.deleteBuffer(cubeBuffer);
      gl.deleteBuffer(quadBuffer);
      gl.deleteProgram(colorProgram);
      gl.deleteProgram(textureProgram);
    };
  }

  function mountSurvivors(canvas, options = {}) {
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return () => {};
    const survivors = Array.isArray(options.survivors) ? options.survivors : [];
    const imageFor = typeof options.imageFor === "function" ? options.imageFor : () => "";
    const getActiveIndex = typeof options.getActiveIndex === "function" ? options.getActiveIndex : () => 0;
    let stopped = false;
    let frame = 0;
    const startedAt = performance.now();
    const colorProgram = program(gl, vertexColor, fragmentColor);
    const textureProgram = program(gl, vertexTexture, fragmentTexture);
    const cubeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
    const avatarTextures = survivors.map(name => texture(gl, imageFor(name)));

    const drawCube = (vp, position, scale, color, yaw = 0) => {
      gl.useProgram(colorProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
      const attribute = gl.getAttribLocation(colorProgram, "aPosition");
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(gl.getUniformLocation(colorProgram, "uMvp"), false, multiply(vp, model(position, scale, yaw)));
      gl.uniform4fv(gl.getUniformLocation(colorProgram, "uColor"), color);
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    };

    const drawPortrait = (vp, portraitTexture, position, scale, opacity = 1, yaw = 0) => {
      gl.useProgram(textureProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      const positionAttribute = gl.getAttribLocation(textureProgram, "aPosition");
      const uvAttribute = gl.getAttribLocation(textureProgram, "aUv");
      gl.enableVertexAttribArray(positionAttribute);
      gl.enableVertexAttribArray(uvAttribute);
      gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 20, 0);
      gl.vertexAttribPointer(uvAttribute, 2, gl.FLOAT, false, 20, 12);
      gl.uniformMatrix4fv(gl.getUniformLocation(textureProgram, "uMvp"), false, multiply(vp, model(position, scale, yaw)));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, portraitTexture);
      gl.uniform1i(gl.getUniformLocation(textureProgram, "uTexture"), 0);
      gl.uniform1f(gl.getUniformLocation(textureProgram, "uOpacity"), opacity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
    };

    const drawDancer = (vp, index, elapsed, active) => {
      const phase = elapsed * (active ? 5.2 : 2.1) + index * 1.57;
      const unit = active ? 1.08 : .66;
      const lane = active ? 0 : (index % 2 ? 3.15 : -3.15) + Math.floor(index / 4) * (index % 2 ? .38 : -.38);
      const z = active ? .45 : -1.5 - Math.floor(index / 3) * .35;
      const bob = Math.abs(Math.sin(phase)) * (active ? .16 : .045);
      const sway = Math.sin(phase * .64) * (active ? .24 : .08);
      const kick = Math.sin(phase * 1.24);
      const alpha = active ? 1 : .4;
      const bodyColor = active ? [.14, .37, .43, 1] : [.075, .12, .15, alpha];
      const headColor = active ? [.24, .47, .51, 1] : [.11, .17, .19, alpha];
      const bodyY = -.34 + bob;
      const headY = 1.18 + bob;
      drawCube(vp, [lane, bodyY, z], [.8 * unit, .72 * unit, .48 * unit], bodyColor, sway * .22);
      drawCube(vp, [lane, headY, z], [.46 * unit, .46 * unit, .46 * unit], headColor, sway * .34);
      drawPortrait(vp, avatarTextures[index], [lane, headY, z + .47 * unit], [.68 * unit, .68 * unit, 1], active ? .98 : .46, sway * .34);

      const armWave = Math.sin(phase + .8) * (active ? .42 : .1);
      const armX = .9 * unit;
      drawCube(vp, [lane - armX, .03 + bob, z], [.13 * unit, .56 * unit, .13 * unit], bodyColor, -armWave);
      drawCube(vp, [lane + armX, .03 + bob, z], [.13 * unit, .56 * unit, .13 * unit], bodyColor, armWave);
      drawCube(vp, [lane - .28 * unit, -1.25 + bob, z + kick * .12], [.18 * unit, .54 * unit, .18 * unit], bodyColor, kick * .17);
      drawCube(vp, [lane + .28 * unit, -1.25 + bob, z - kick * .12], [.18 * unit, .54 * unit, .18 * unit], bodyColor, -kick * .17);
      drawCube(vp, [lane, -1.78, z], [1.03 * unit, .035 * unit, .72 * unit], active ? [.64, .29, .08, .52] : [.16, .09, .08, .22]);
    };

    const render = now => {
      if (stopped) return;
      resize();
      const elapsed = (now - startedAt) / 1000;
      const activeIndex = Math.max(0, Math.min(survivors.length - 1, Number(getActiveIndex()) || 0));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      const projection = perspective(Math.PI / 4.15, canvas.width / canvas.height, .1, 100);
      const sway = Math.sin(elapsed * .16) * .24;
      const view = lookAt([sway, 2.7, 11.5], [0, -.35, 0], [0, 1, 0]);
      const vp = multiply(projection, view);
      drawCube(vp, [0, -1.91, -.2], [8.8, .06, 7], [.008, .012, .016, 1]);
      drawCube(vp, [0, -1.65, .35], [4.75, .1, 2.75], [.08, .12, .14, .98]);
      drawCube(vp, [0, .65, -1.15], [2.3, 2.3, .05], [.15, .42, .48, .075]);
      survivors.forEach((_, index) => {
        if (index !== activeIndex) drawDancer(vp, index, elapsed, false);
      });
      drawDancer(vp, activeIndex, elapsed, true);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      avatarTextures.forEach(item => gl.deleteTexture(item));
      gl.deleteBuffer(cubeBuffer);
      gl.deleteBuffer(quadBuffer);
      gl.deleteProgram(colorProgram);
      gl.deleteProgram(textureProgram);
    };
  }

  function mountAtmosphere(canvas, mood = "cold") {
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return () => {};
    let stopped = false;
    let frame = 0;
    const atmosphereProgram = program(gl, vertexAtmosphere, fragmentAtmosphere);
    const particleBuffer = gl.createBuffer();
    const particles = new Float32Array(84 * 3);
    for (let index = 0; index < particles.length; index += 1) particles[index] = ((index * 73 + 19) % 101) / 101;
    gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particles, gl.STATIC_DRAW);
    const tint = mood.includes("red") ? [.95, .08, .13] : mood.includes("cold") ? [.42, .78, .86] : [.7, .72, .74];
    const startedAt = performance.now();

    const render = now => {
      if (stopped) return;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.useProgram(atmosphereProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
      const attribute = gl.getAttribLocation(atmosphereProgram, "aSeed");
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);
      gl.uniform1f(gl.getUniformLocation(atmosphereProgram, "uTime"), (now - startedAt) / 1000);
      gl.uniform1f(gl.getUniformLocation(atmosphereProgram, "uAspect"), width / height);
      gl.uniform3fv(gl.getUniformLocation(atmosphereProgram, "uTint"), tint);
      gl.drawArrays(gl.POINTS, 0, 84);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      gl.deleteBuffer(particleBuffer);
      gl.deleteProgram(atmosphereProgram);
    };
  }

  window.SpiritFuneral3D = { mount, mountAtmosphere, mountSurvivors };
})();
