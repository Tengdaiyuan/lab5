/**
 * Lab 5 - Exercise 1: The HTML5 Canvas
 * ------------------------------------
 * Recreates the reference figure with nothing but the Canvas 2D API:
 * a light-green board, a yellow smiley face (eyes, nose, smile) and a
 * dark-green caption that reads "The Canvas brought me to life!".
 *
 * All geometry is expressed in "logical" canvas units (600 x 560) and the
 * backing store is scaled by the device pixel ratio so the result stays
 * crisp on high-DPI screens.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('smileyFace');
  if (!canvas || !canvas.getContext) {
    return;
  }

  var ctx = canvas.getContext('2d');

  /* ---------------------------------------------------------------- *
   * Design constants (logical units, never device pixels)
   * ---------------------------------------------------------------- */
  var WIDTH = 600;
  var HEIGHT = 560;

  var COLORS = {
    board: '#90ee90',   // light green background
    face: '#ffff00',    // yellow face
    line: '#000000',    // eyes, nose, mouth and face outline
    caption: '#1f7a1f'  // dark green caption
  };

  var FACE = { cx: WIDTH / 2, cy: 250, r: 205 };

  var EYES = {
    radius: 17,
    left: { x: FACE.cx - 112, y: 235 },
    right: { x: FACE.cx + 112, y: 235 }
  };

  var NOSE = { x: FACE.cx, top: 268, bottom: 316 };

  var SMILE = {
    cx: FACE.cx,
    cy: 352,
    radius: 76,
    startAngle: 0.08 * Math.PI,
    endAngle: 0.92 * Math.PI
  };

  var CAPTION = {
    text: 'The Canvas brought me to life!',
    fontFamily: '"Segoe UI", Arial, Helvetica, sans-serif',
    maxWidth: WIDTH * 0.88,
    startSize: 46,
    minSize: 18,
    baseline: 517
  };

  /* ---------------------------------------------------------------- *
   * Drawing helpers
   * ---------------------------------------------------------------- */

  /**
   * Sizes the backing store for the current device pixel ratio and maps
   * the logical coordinate system onto it, so callers can keep thinking
   * in 600 x 560 units.
   */
  function prepareSurface() {
    var dpr = window.devicePixelRatio || 1;
    var pixelWidth = Math.round(WIDTH * dpr);
    var pixelHeight = Math.round(HEIGHT * dpr);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  function drawBoard() {
    ctx.fillStyle = COLORS.board;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  function drawFace() {
    ctx.beginPath();
    ctx.arc(FACE.cx, FACE.cy, FACE.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = COLORS.face;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = COLORS.line;
    ctx.stroke();
  }

  function drawEye(eye) {
    ctx.beginPath();
    ctx.arc(eye.x, eye.y, EYES.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = COLORS.line;
    ctx.fill();
  }

  function drawEyes() {
    drawEye(EYES.left);
    drawEye(EYES.right);
  }

  function drawNose() {
    ctx.beginPath();
    ctx.moveTo(NOSE.x, NOSE.top);
    ctx.lineTo(NOSE.x, NOSE.bottom);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = COLORS.line;
    ctx.stroke();
  }

  function drawSmile() {
    ctx.beginPath();
    // Angles run clockwise on a canvas, so 0.08π → 0.92π sweeps the
    // lower half of the circle and produces an upward-curving smile.
    ctx.arc(SMILE.cx, SMILE.cy, SMILE.radius, SMILE.startAngle, SMILE.endAngle);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = COLORS.line;
    ctx.stroke();
  }

  /**
   * Returns the largest font size (walking down from `startSize`) that
   * keeps the caption inside `maxWidth`, so the text always spans the
   * board the way it does in the reference picture.
   */
  function fitCaptionSize(text, fontFamily, maxWidth, startSize, minSize) {
    for (var size = startSize; size >= minSize; size -= 1) {
      ctx.font = 'bold ' + size + 'px ' + fontFamily;
      if (ctx.measureText(text).width <= maxWidth) {
        return size;
      }
    }
    return minSize;
  }

  function drawCaption() {
    var size = fitCaptionSize(
      CAPTION.text,
      CAPTION.fontFamily,
      CAPTION.maxWidth,
      CAPTION.startSize,
      CAPTION.minSize
    );

    ctx.font = 'bold ' + size + 'px ' + CAPTION.fontFamily;
    ctx.fillStyle = COLORS.caption;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(CAPTION.text, WIDTH / 2, CAPTION.baseline);
  }

  /* ---------------------------------------------------------------- *
   * Render
   * ---------------------------------------------------------------- */
  function draw() {
    prepareSurface();
    drawBoard();
    drawFace();
    drawEyes();
    drawNose();
    drawSmile();
    drawCaption();
  }

  draw();

  var redrawButton = document.getElementById('redrawButton');
  if (redrawButton) {
    redrawButton.addEventListener('click', draw);
  }

  // Re-render when the pixel ratio changes (e.g. the window moves to a
  // different monitor) so the canvas never ends up blurry.
  window.addEventListener('resize', draw);
})();
