# Portfolio Drive

A responsive, resume-backed portfolio for Ahad Hashmani with an optional top-down driving layer and a conventional HTML portfolio. Built with HTML, CSS, Canvas 2D, and vanilla JavaScript modules; no framework or runtime dependency is required.

## Run locally

ES modules require an HTTP server; do not open `index.html` with `file://`.

- **VS Code:** open the folder and run `index.html` with Live Server.
- **Python:** from this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`.
- **Node:** use any static HTTP server that serves the folder root.

## Controls

- **W / ↑:** accelerate
- **S / ↓:** brake, then reverse
- **A / ←, D / →:** steer
- **E / Enter:** open the nearby destination
- **R:** reset to the plaza
- **Escape:** close the active panel
- On touch screens, use the on-screen pedals and steering buttons.

Every district is also available from the map destination list and the top navigation. Select **Portfolio view** to browse without driving.

## Edit the content

Edit [`src/content.js`](./src/content.js). This is the shared source for the destination interactions and the standard portfolio view.

- `experience`, `education`, and `community` contain resume-backed entries.
- `projects` contains the full 20-entry project inventory; status and verification notes are intentionally retained.
- `skillGroups` groups listed skills without unsupported proficiency ratings.
- `profile` contains public links and the introductory copy.

Project details and links are optional. Do not add a demo URL unless it is verified. Keep synthetic data, reported metrics, project status, fork status, and contribution limitations clear.

## Add a project

Add an object to `projects` in `src/content.js` with a unique `id`, `title`, factual `summary`, `status`, `category`, `technologies`, and (when available) a public `link`. Set `featured: true` to include it in the featured grid. The rest of the catalog remains available under **View all project records**. Project content is rendered into both the portfolio cards and the detail dialog from this same object.

## Move a landmark

Edit the matching district in `districts` in `src/content.js`. `x` and `y` are world coordinates. The road map and camera use world coordinates; keep a destination close enough to an access road for the car to reach its interaction radius.

## Tune driving

Change the `DRIVE` configuration at the top of `src/main.js`. It contains world dimensions, acceleration, braking, speed limits, steering, camera easing, and interaction thresholds. The world renderer and vehicle loop are in the same module to keep this small static release easy to run.

## Assets and deployment

The map is drawn from original Canvas primitives; there are no third-party images, fonts are loaded from Google Fonts with system fallbacks, and no external project screenshots are bundled. Deploy the project root to any static host that supports ES modules and serves `index.html` as the entry page. Keep all links relative to this root.

## Source and privacy notes

Portfolio facts were transcribed from the supplied master resume/reference, updated October 19, 2026. Historical repository review notes in that source were not rerun for this site. Labels call out prototype, synthetic, coursework, fork, unverified-result, and contribution-review status where applicable. See [`docs/content-checklist.md`](./docs/content-checklist.md) before publication.

The resume source includes a personal phone number and email. Neither is exposed in this website until the owner confirms those contact fields are intended to be public. A public resume download is likewise omitted until an approved public copy is provided. LinkedIn and GitHub links are included.

## Validation and known limitations

The static source is designed for modern browsers with Canvas 2D, ES modules, and native `<dialog>`. Driving and core navigation can be tested with keyboard, pointer, and touch controls. No browser matrix, mobile device, assistive technology, or performance benchmark has been claimed as tested by this initial implementation. The first release uses a compact illustrative map, simple obstacle collisions, and an optional driving layer; the full portfolio remains available without driving.
