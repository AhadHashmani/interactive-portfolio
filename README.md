# Portfolio Drive

A responsive, resume-backed portfolio for Ahad Hashmani with an optional behind-the-car driving view and a conventional HTML portfolio. The expanded illustrated map has five named, color-accented routes, additional buildings, a central fountain, and an original NRG Stadium landmark for the FIFA World Cup destination. Follow the on-screen navigation through Experience, Education, Projects, Skills, and Contact checkpoints; each checkpoint opens its matching career area and awards a collectible car sticker. The Experience Highway has an illustrated billboard for every role, including a custom World Cup trophy scene at FIFA; nearby role exhibits award additional stickers. The Project Expressway has illustrated project landmarks. Each exhibit opens its matching resume-backed detail panel when approached slowly. The same destinations remain available from the interface. Built with HTML, CSS, Canvas 2D, and vanilla JavaScript modules; no framework or runtime dependency is required.

The driving scene uses a longer perspective view, sprite-cached trees, roadside lighting, detailed building facades, smooth camera interpolation, and a low-resolution WebGL atmosphere shader over the Canvas 2D map. Buildings, trees, streetlights, signs, and exhibits are depth-sorted together so nearby scenery correctly occludes distant objects while driving. The original coupe is rendered as a lit low-poly 3D model with animated steering, suspension, headlights, and boost lighting; a Canvas version is retained when WebGL is unavailable. The map shader falls back to a CSS glow and respects reduced-motion preferences. Scene objects are reused between frames, and touch screens use a lower canvas pixel ratio to keep the view responsive. The coupe has a comic-supercar silhouette and animated twin-turbine boost plumes; it does not use Batman, Batmobile, or other franchise artwork. Career billboards include custom employer wordmarks and monograms, rather than copied official logo artwork. The FIFA reward uses a more detailed, stylized globe-and-figures trophy silhouette.

The driving view uses a compact, game-like overlay inspired by immersive city explorers, with selectable golden-hour, midday, blue-hour, and night color grades. The destination panel and interface can be hidden independently; the portfolio and controls remain available on desktop and touch screens.

The interface uses lightweight CSS motion for status, route prompts, card interactions, and portfolio section reveals. Reduced-motion preferences disable those effects.

## Run locally

ES modules require an HTTP server; do not open `index.html` with `file://`.

- **VS Code:** open the folder and run `index.html` with Live Server.
- **Python:** from this folder, run `python3 -m http.server 8000`, then open `http://localhost:8000`.
- **Node:** use any static HTTP server that serves the folder root.

## Controls

- **W / ↑:** accelerate
- **S / ↓:** brake, then reverse
- **A / ←, D / →:** steer
- **Hold Shift while moving:** boost for about 8 seconds from a full charge; charge refills when released
- Boost draws animated, twin-turbine flame trails behind the car.
- **Hold Space + steer:** drift through turns and leave tire smoke
- **E / Enter:** open the nearby destination
- **R:** reset to the plaza
- Signs, trees, and billboards are non-solid. If the car remains blocked by a building, it is returned to the nearest clear road.
- **Escape:** close the active panel
- On touch screens, use the on-screen pedals, steering, boost, and drift buttons. Boost works independently while moving; hold drift as you steer.
- Follow the checkpoint arrow and turn cue. Stop near each numbered checkpoint, then open it to reveal that career area and receive the next route. Progress is saved in this browser.
- Checkpoints and role billboards award original, stylized car stickers. Checkpoint and sticker progress are saved separately in this browser.

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

Change the `DRIVE` configuration at the top of `src/main.js`. It contains world dimensions, acceleration, braking, speed limits, steering, camera easing, interaction thresholds, and boost drain/recharge. `RENDER_DISTANCE` controls the world view range. `CHECKPOINT_ORDER` controls the guided career route; `STICKERS`, `STADIUM`, and `FOUNTAIN` define collectible rewards and major landmarks. The world renderer and vehicle loop are in the same module to keep this small static release easy to run.

## Assets and deployment

The map, billboards, employer wordmarks, NRG Stadium, fountain, trophy, stickers, and project illustrations are original Canvas/CSS drawings; employer wordmarks are portfolio identifiers, not official logo reproductions. There are no third-party images and no external project screenshots are bundled. Fonts are loaded from Google Fonts with system fallbacks. Deploy the project root to any static host that supports ES modules and serves `index.html` as the entry page. Keep all links relative to this root.

## Source and privacy notes

Portfolio facts were transcribed from the supplied master resume/reference, updated October 19, 2026. Historical repository review notes in that source were not rerun for this site. Labels call out prototype, synthetic, coursework, fork, unverified-result, and contribution-review status where applicable. See [`docs/content-checklist.md`](./docs/content-checklist.md) before publication.

The resume source includes a personal phone number and email. Neither is exposed in this website until the owner confirms those contact fields are intended to be public. A public resume download is likewise omitted until an approved public copy is provided. LinkedIn and GitHub links are included.

## Validation and known limitations

Verified in the integrated Chromium browser at 1440×900 and 390×844: portfolio navigation, project archive and detail links, keyboard acceleration, touch-pointer acceleration, district prompts, and the compact behind-the-car scene. The renderer catches frame errors, reports the problem, preserves the animation loop, and displays a recovery car scene. The animation loop sampled about 60 FPS at both viewport sizes in prior checks; this is a quick implementation check, not a formal performance benchmark. Firefox, Safari, physical mobile devices, and assistive technology were not tested. The world is illustrative and uses simple obstacle collisions; all professional content remains available without driving.
