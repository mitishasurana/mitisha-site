/**
 * Wafer graphic.
 *
 * Draws a circular grid of cells inside the hero SVG. Each cell starts at a
 * randomised hue (uneven film thickness) and settles toward a much narrower
 * band of hues (uniform thickness), rippling outward from the wafer centre.
 *
 * Honours prefers-reduced-motion by rendering the settled state immediately.
 */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  // Geometry, in the SVG's own 360x360 coordinate space.
  var CENTER_X = 180;
  var CENTER_Y = 180;
  var RADIUS = 148;
  var GRID = 16;          // cells per side before the circular mask
  var GAP = 2;            // gap between neighbouring cells
  var EDGE_INSET = 3;     // keep cells clear of the wafer edge

  // Colour model: a base hue with a spread that shrinks as the film settles.
  var BASE_HUE = 220;
  var HUE_SPREAD = 150;
  var SETTLED_FACTOR = 0.42;  // >50% reduction in hue spread
  var SATURATION = 52;
  var LIGHTNESS = 58;

  var MAX_DELAY = 0.55;   // seconds, for the outermost cells
  var START_DELAY = 450;  // ms before the settling transition begins

  var svg = document.getElementById('waferSvg');
  if (!svg) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cellSize = (2 * RADIUS) / GRID;
  var gridOrigin = CENTER_X - RADIUS;
  var pendingCells = [];

  /** Deterministic pseudo-random value in [0, 1) for a given cell index. */
  function pseudoRandom(seed) {
    var x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  function hue(noise, factor) {
    return BASE_HUE + noise * HUE_SPREAD * factor;
  }

  function hsl(h) {
    return 'hsl(' + h.toFixed(1) + ', ' + SATURATION + '%, ' + LIGHTNESS + '%)';
  }

  function buildCells() {
    var group = document.createElementNS(SVG_NS, 'g');

    for (var row = 0; row < GRID; row++) {
      for (var col = 0; col < GRID; col++) {
        var px = gridOrigin + (col + 0.5) * cellSize;
        var py = gridOrigin + (row + 0.5) * cellSize;
        var distance = Math.hypot(px - CENTER_X, py - CENTER_Y);

        // Mask the square grid into a circle.
        if (distance > RADIUS - EDGE_INSET) continue;

        var noise = (pseudoRandom(row * GRID + col) * 2) - 1; // -1..1
        var startColor = hsl(hue(noise, 1));
        var settledColor = hsl(hue(noise, SETTLED_FACTOR));

        var rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttribute('x', (px - cellSize / 2 + GAP / 2).toFixed(2));
        rect.setAttribute('y', (py - cellSize / 2 + GAP / 2).toFixed(2));
        rect.setAttribute('width', (cellSize - GAP).toFixed(2));
        rect.setAttribute('height', (cellSize - GAP).toFixed(2));
        rect.setAttribute('rx', '1');
        rect.setAttribute('class', 'wafer-cell');

        if (prefersReducedMotion) {
          rect.style.fill = settledColor;
        } else {
          rect.style.fill = startColor;
          rect.style.transitionDelay = ((distance / RADIUS) * MAX_DELAY).toFixed(2) + 's';
          pendingCells.push({ el: rect, settled: settledColor });
        }

        group.appendChild(rect);
      }
    }

    svg.appendChild(group);
  }

  function buildEdgeRing() {
    var ring = document.createElementNS(SVG_NS, 'circle');
    ring.setAttribute('cx', CENTER_X);
    ring.setAttribute('cy', CENTER_Y);
    ring.setAttribute('r', RADIUS + 3);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', '#DADDD3');
    ring.setAttribute('stroke-width', '1.5');
    svg.appendChild(ring);
  }

  function settle() {
    setTimeout(function () {
      pendingCells.forEach(function (cell) {
        cell.el.style.fill = cell.settled;
      });
    }, START_DELAY);
  }

  buildCells();
  buildEdgeRing();
  if (!prefersReducedMotion) settle();
})();
