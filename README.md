# Mitisha Surana — personal site

Static site, no build step. Plain HTML, CSS, and one vanilla JS file.

## Structure

```
.
├── index.html        All page content
├── css/styles.css    All styles, organised by page section
├── js/wafer.js       Hero wafer graphic
├── favicon.svg       Browser tab icon
└── .nojekyll         Tells GitHub Pages to serve files as-is
```

## Editing

- **Text changes** — edit `index.html`.
- **Colours, spacing, fonts** — edit `css/styles.css`. The palette lives in the
  `:root` block at the top; changing a value there updates the whole site.
- **Hero animation** — edit the constants at the top of `js/wafer.js`.

## Previewing locally

Open `index.html` in a browser. That's it — no server required.

## Deploying

Hosted on GitHub Pages from the `main` branch, root folder.
Push to `main` and the live site updates within a minute or two.
