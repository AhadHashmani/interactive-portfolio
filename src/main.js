import {
  community,
  districts,
  education,
  experience,
  profile,
  projects,
  skillGroups,
} from "./content.js";

const DRIVE = {
  worldWidth: 2400,
  worldHeight: 1600,
  maxForwardSpeed: 285,
  maxReverseSpeed: 112,
  acceleration: 240,
  braking: 570,
  coast: 105,
  maxSteering: 2.35,
  offRoadSpeedRatio: 0.58,
  interactionRadius: 140,
  interactionExitRadius: 180,
  interactionSpeed: 52,
  cameraSmoothing: 7.5,
  fixedStep: 1 / 60,
};

const ROAD_SEGMENTS = [
  { x1: 0, y1: 770, x2: DRIVE.worldWidth, y2: 770 },
  { x1: 1180, y1: 0, x2: 1180, y2: DRIVE.worldHeight },
  { x1: 1180, y1: 1260, x2: DRIVE.worldWidth, y2: 1260 },
  { x1: 1850, y1: 770, x2: 1850, y2: 1260 },
];

const BUILDINGS = [
  { x: 940, y: 208, w: 145, h: 112, color: "#c9d6b0", label: "CAMPUS HALL" },
  { x: 1300, y: 260, w: 116, h: 88, color: "#b6c8a5", label: "STUDY HOUSE" },
  { x: 324, y: 560, w: 128, h: 103, color: "#d4c8a7", label: "RESEARCH LAB" },
  { x: 470, y: 518, w: 146, h: 104, color: "#c3d1ae", label: "DATA STUDIO" },
  { x: 1535, y: 561, w: 133, h: 112, color: "#d6d0b8", label: "OFFICE 01" },
  { x: 1717, y: 535, w: 138, h: 113, color: "#b8c8ad", label: "OFFICE 02" },
  { x: 943, y: 1322, w: 143, h: 94, color: "#dcc7a1", label: "WORKSHOP" },
  { x: 1286, y: 1350, w: 149, h: 93, color: "#c9b991", label: "TOOL SHED" },
  { x: 2005, y: 1307, w: 137, h: 110, color: "#c1d0b5", label: "PIT STOP" },
  { x: 2050, y: 946, w: 122, h: 98, color: "#c9d1b5", label: "COMMUNITY HALL" },
];

const canvas = document.querySelector("#worldCanvas");
const context = canvas.getContext("2d");
const driveView = document.querySelector("#driveView");
const portfolioView = document.querySelector("#portfolioView");
const welcomeCard = document.querySelector("#welcomeCard");
const driveHud = document.querySelector("#driveHud");
const driveHelp = document.querySelector("#driveHelp");
const dialog = document.querySelector("#contentDialog");
const dialogContent = document.querySelector("#dialogContent");
const dialogKicker = document.querySelector("#dialogKicker");
const announcer = document.querySelector("#announcer");

const game = {
  width: 0,
  height: 0,
  pixelRatio: 1,
  lastFrame: 0,
  accumulator: 0,
  running: false,
  driving: false,
  dialogOpen: false,
  previousView: "drive",
  previousHash: "#home",
  activePrompt: null,
  previousPrompt: null,
  district: null,
  car: { x: 1180, y: 770, heading: -Math.PI / 2, speed: 0 },
  camera: { x: 1180, y: 770 },
  keys: new Set(),
  pointers: new Map(),
  visited: new Set(),
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const isMobile = window.matchMedia("(max-width: 700px), (pointer: coarse)");
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const safeStorage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // The portfolio remains usable when storage is blocked.
    }
  },
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function makeTagRow(values) {
  const row = element("div", "tag-row");
  values.forEach((value) => row.append(element("span", "tag", value)));
  return row;
}

function renderExperience() {
  const list = document.querySelector("#experienceList");
  experience.forEach((item) => {
    const card = element("article", "experience-card");
    const meta = element("div", "experience-meta");
    meta.append(element("time", "", item.dates));
    if (item.location) meta.append(element("span", "", item.location));
    const main = element("div", "experience-main");
    main.append(element("h3", "", item.organization));
    main.append(element("p", "experience-role", item.role));
    main.append(element("p", "experience-summary", item.summary));
    const bullets = element("ul", "experience-bullets");
    item.contributions.forEach((contribution) => bullets.append(element("li", "", contribution)));
    main.append(bullets, makeTagRow(item.tools));
    card.append(meta, main);
    list.append(card);
  });
}

function renderEducation() {
  const list = document.querySelector("#educationList");
  education.forEach((item) => {
    const card = element("article", "education-card");
    card.append(
      element("time", "", item.dates),
      element("h3", "", item.institution),
      element("p", "degree", item.credential),
      element("p", "education-note", item.note),
    );
    list.append(card);
  });
}

function renderProjectCard(project) {
  const card = element("button", "project-card");
  card.type = "button";
  card.setAttribute("aria-label", `Read about ${project.title}`);
  card.addEventListener("click", () => openProject(project.id));
  const topline = element("div", "project-topline");
  topline.append(element("span", "project-category", project.category));
  topline.append(element("span", "project-link-mark", project.link ? "↗" : "＋"));
  card.append(
    topline,
    element("h3", "", project.title),
    element("p", "", project.summary),
    element("span", "project-status", project.status),
  );
  return card;
}

function renderProjects(showAll = false) {
  const list = document.querySelector("#projectList");
  list.replaceChildren();
  const visibleProjects = showAll ? projects : projects.filter((project) => project.featured);
  visibleProjects.forEach((project) => list.append(renderProjectCard(project)));
  if (!showAll) {
    const button = element("button", "project-card-more", `View all ${projects.length} project records ↓`);
    button.type = "button";
    button.addEventListener("click", () => {
      renderProjects(true);
    });
    list.append(button);
  } else {
    list.append(createCollapseProjectsButton());
  }
}

function createCollapseProjectsButton() {
  const button = element("button", "project-card-more", "Show selected projects ↑");
  button.type = "button";
  button.addEventListener("click", () => renderProjects(false));
  return button;
}

function renderSkills() {
  const list = document.querySelector("#skillsList");
  skillGroups.forEach((group) => {
    const card = element("article", "skill-card");
    card.append(element("h3", "", group.name), makeTagRow(group.skills), element("p", "", group.evidence));
    list.append(card);
  });
}

function renderCommunity() {
  const list = document.querySelector("#communityList");
  community.forEach((item) => {
    const card = element("article", "community-card");
    card.append(
      element("time", "", item.dates),
      element("h3", "", item.organization),
      element("p", "community-role", item.role),
      element("p", "", item.details),
    );
    list.append(card);
  });
}

function hydratePortfolioCopy() {
  document.querySelector(".about-copy").textContent = profile.about;
  document.querySelector(".portfolio-intro h1").firstChild.textContent = profile.name;
  document.querySelector(".portfolio-lede").textContent = `${profile.headline}—connecting thoughtful analysis with practical tools.`;
  renderExperience();
  renderEducation();
  renderProjects();
  renderSkills();
  renderCommunity();
}

function appendHeading(container, eyebrow, title, subtitle) {
  container.append(element("div", "eyebrow", eyebrow));
  container.append(element("h2", "", title));
  if (subtitle) container.append(element("p", "dialog-subtitle", subtitle));
}

function appendBullets(container, label, bullets) {
  container.append(element("h3", "", label));
  const list = element("ul", "");
  bullets.forEach((bullet) => list.append(element("li", "", bullet)));
  container.append(list);
}

function appendExternalLink(container, href, label) {
  if (!href) return;
  const link = element("a", "", label);
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.append(document.createTextNode(" ↗"));
  container.append(link);
}

function openDialog(contentId, title, render, route = contentId) {
  game.previousView = portfolioView.hidden ? "drive" : "portfolio";
  if (!game.dialogOpen) game.previousHash = window.location.hash || "#home";
  game.dialogOpen = true;
  game.previousPrompt = game.activePrompt;
  clearInput();
  dialogKicker.textContent = `${String(districts.find((item) => item.id === contentId)?.number ?? "00")} / ${contentId.toUpperCase()}`;
  dialogContent.replaceChildren();
  render(dialogContent);
  if (!dialog.open) dialog.showModal();
  const heading = dialogContent.querySelector("h2");
  dialog.setAttribute("aria-labelledby", heading ? "dialogTitle" : "dialogTitle");
  if (heading) {
    heading.id = "dialogTitle";
  } else {
    const fallbackHeading = element("h2", "screen-reader-only", title);
    fallbackHeading.id = "dialogTitle";
    dialogContent.prepend(fallbackHeading);
  }
  if (route) {
    const hash = route.startsWith("project/") ? `#${route}` : `#${route}`;
    if (window.location.hash !== hash) history.pushState({ portfolioDrive: true }, "", hash);
  }
  announce(`${title} opened`);
}

function appendDialogActions(container, actions) {
  if (!actions.length) return;
  const row = element("div", "dialog-actions");
  actions.forEach((action) => {
    if (action.kind === "drive") {
      const button = element("button", "", action.label);
      button.type = "button";
      button.addEventListener("click", () => {
        driveToDistrict(action.district);
        closeDialog();
      });
      row.append(button);
    } else {
      appendExternalLink(row, action.href, action.label);
    }
  });
  container.append(row);
}

function renderProjectDetail(container, project) {
  appendHeading(container, `${project.category} / PROJECT`, project.title, project.summary);
  const status = element("p", "dialog-note", `Status: ${project.status}. ${project.note}`);
  container.append(status);
  if (project.technologies.length) {
    container.append(element("h3", "", "Technologies"));
    container.append(makeTagRow(project.technologies));
  }
  if (project.link) {
    appendDialogActions(container, [{ kind: "link", href: project.link, label: "Open repository" }]);
  }
}

function openProject(projectId, route = `project/${projectId}`) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) {
    openDialog("projects", "Project not found", (container) => {
      appendHeading(container, "PROJECT ARCHIVE", "Project not found", "That project link does not match a project in this portfolio.");
      appendDialogActions(container, [{ kind: "drive", district: "projects", label: "Go to Project Expressway" }]);
    }, "projects");
    return;
  }
  openDialog("projects", project.title, (container) => renderProjectDetail(container, project), route);
}

function openSection(sectionId, route = sectionId) {
  const district = districts.find((item) => item.id === sectionId);
  if (sectionId === "about") {
    openDialog("about", "About Ahad", (container) => {
      appendHeading(container, "WELCOME PLAZA / ABOUT", profile.name, profile.headline);
      container.append(element("p", "", profile.about));
      container.append(element("p", "dialog-note", `Based in ${profile.location}.`));
      appendDialogActions(container, [
        { kind: "link", href: profile.linkedin, label: "Connect on LinkedIn" },
        { kind: "link", href: profile.github, label: "Explore GitHub" },
      ]);
    }, route);
    return;
  }

  if (sectionId === "experience") {
    openDialog(sectionId, "Experience", (container) => {
      appendHeading(container, "EXPERIENCE HIGHWAY", "Experience", "Professional roles recorded in the supplied master resume.");
      experience.forEach((item) => {
        const entry = element("div", "dialog-entry");
        entry.append(element("h3", "", item.organization));
        entry.append(element("p", "dialog-subtitle", `${item.role} · ${item.dates}${item.location ? ` · ${item.location}` : ""}`));
        entry.append(element("p", "", item.summary));
        appendBullets(entry, "Selected contributions", item.contributions);
        entry.append(makeTagRow(item.tools));
        container.append(entry);
      });
      appendDialogActions(container, [{ kind: "drive", district: "experience", label: "Drive to Experience Highway" }]);
    });
    return;
  }

  if (sectionId === "education") {
    openDialog(sectionId, "Education", (container) => {
      appendHeading(container, "EDUCATION AVENUE", "Education", "Two distinct degrees at The University of Texas at Austin.");
      education.forEach((item) => {
        const entry = element("div", "dialog-entry");
        entry.append(element("h3", "", item.credential));
        entry.append(element("p", "dialog-subtitle", `${item.institution} · ${item.dates}`));
        entry.append(element("p", "", item.note));
        container.append(entry);
      });
      container.append(element("p", "dialog-note", "LaunchCode appears in the original portfolio concept, but the supplied education records do not establish a program or credential."));
      appendDialogActions(container, [{ kind: "drive", district: "education", label: "Drive to Education Avenue" }]);
    });
    return;
  }

  if (sectionId === "projects") {
    openDialog(sectionId, "Project archive", (container) => {
      appendHeading(container, "PROJECT EXPRESSWAY", "Project archive", `${projects.length} project records. Descriptions preserve source limitations and contribution status.`);
      projects.forEach((project) => {
        const entry = element("article", "dialog-project-entry");
        const button = element("button", "dialog-project-link", project.title);
        button.type = "button";
        button.addEventListener("click", () => openProject(project.id));
        entry.append(button, element("p", "dialog-subtitle", `${project.status} · ${project.summary}`));
        container.append(entry);
      });
      appendDialogActions(container, [{ kind: "drive", district: "projects", label: "Drive to Project Expressway" }]);
    });
    return;
  }

  if (sectionId === "skills") {
    openDialog(sectionId, "Skills", (container) => {
      appendHeading(container, "SKILLS GARAGE", "Tools of the trade", "Grouped by practice, without unsupported proficiency scores.");
      skillGroups.forEach((group) => {
        const entry = element("div", "dialog-entry");
        entry.append(element("h3", "", group.name), makeTagRow(group.skills), element("p", "", group.evidence));
        container.append(entry);
      });
      appendDialogActions(container, [{ kind: "drive", district: "skills", label: "Drive to Skills Garage" }]);
    });
    return;
  }

  if (sectionId === "contact") {
    openDialog(sectionId, "Contact", (container) => {
      appendHeading(container, "CONTACT PIT STOP", "Let’s make something useful.", "For professional conversations, collaboration, or just to say hello.");
      container.append(element("p", "dialog-note", "Email and phone are not shown here until public-use preferences are confirmed."));
      appendDialogActions(container, [
        { kind: "link", href: profile.linkedin, label: "Connect on LinkedIn" },
        { kind: "link", href: profile.github, label: "Explore GitHub" },
        ...(district ? [{ kind: "drive", district: sectionId, label: "Drive to Contact Pit Stop" }] : []),
      ]);
    });
    return;
  }

  if (sectionId === "help") {
    openDialog("help", "Controls", (container) => {
      appendHeading(container, "DRIVING MANUAL", "Controls", "Driving is optional. Every section is available from the navigation.");
      const rows = [
        ["W / ↑", "Accelerate"],
        ["S / ↓", "Brake, then reverse"],
        ["A / ← · D / →", "Steer"],
        ["E / Enter", "Open the nearby destination"],
        ["R", "Reset car to Welcome Plaza"],
        ["Escape", "Close this panel"],
      ];
      rows.forEach(([keys, action]) => {
        const row = element("p", "control-row");
        row.append(element("strong", "", keys), element("span", "", action));
        container.append(row);
      });
    }, null);
  }
}

function closeDialog(fromHistory = false) {
  if (!game.dialogOpen) return;
  game.dialogOpen = false;
  if (dialog.open) dialog.close();
  if (!fromHistory) {
    const targetHash = game.previousView === "portfolio" ? "#portfolio" : "#home";
    history.replaceState(history.state, "", `${window.location.pathname}${window.location.search}${targetHash}`);
  }
  game.activePrompt = null;
  if (game.previousView === "portfolio") showPortfolio(false);
  else if (!game.driving) welcomeCard.hidden = false;
  announce("Details closed");
}

function announce(message) {
  announcer.textContent = "";
  window.setTimeout(() => {
    announcer.textContent = message;
  }, 20);
}

function showPortfolio(scrollToId = false) {
  driveView.hidden = true;
  portfolioView.hidden = false;
  clearInput();
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
  if (scrollToId) {
    requestAnimationFrame(() => {
      document.getElementById(scrollToId)?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
    });
  }
}

function showDrive(showWelcome = false) {
  portfolioView.hidden = true;
  driveView.hidden = false;
  if (showWelcome) {
    game.driving = false;
    welcomeCard.hidden = false;
    driveHud.hidden = true;
    driveHelp.hidden = true;
  }
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
}

function driveToDistrict(districtId) {
  const district = districts.find((item) => item.id === districtId);
  if (!district) return;
  showDrive(false);
  game.car.x = district.x;
  game.car.y = district.y;
  game.car.speed = 0;
  game.car.heading = -Math.PI / 2;
  game.camera.x = district.x;
  game.camera.y = district.y;
  game.driving = true;
  welcomeCard.hidden = true;
  driveHud.hidden = false;
  driveHelp.hidden = false;
  game.visited.add(districtId);
  safeStorage.set("portfolio-drive-visited", [...game.visited].join(","));
  clearInput();
  announce(`Driving to ${district.title}`);
}

function resetCar() {
  game.car.x = 1180;
  game.car.y = 770;
  game.car.heading = -Math.PI / 2;
  game.car.speed = 0;
  game.camera.x = game.car.x;
  game.camera.y = game.car.y;
  game.activePrompt = null;
  clearInput();
  if (game.driving) announce("Car reset to Welcome Plaza");
}

function clearInput() {
  game.keys.clear();
  game.pointers.clear();
}

function isEditableTarget(target) {
  return target instanceof Element && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function readControls() {
  const has = (...names) => names.some((name) => game.keys.has(name));
  const pointerHas = (name) => [...game.pointers.values()].includes(name);
  return {
    accelerate: has("w", "arrowup") || pointerHas("accelerate"),
    brake: has("s", "arrowdown") || pointerHas("brake"),
    left: has("a", "arrowleft") || pointerHas("left"),
    right: has("d", "arrowright") || pointerHas("right"),
  };
}

function accelerateTowardZero(speed, amount) {
  if (Math.abs(speed) <= amount) return 0;
  return speed - Math.sign(speed) * amount;
}

function updateCar(dt) {
  const controls = readControls();
  const car = game.car;
  const onRoad = ROAD_SEGMENTS.some((segment) => distanceToSegment(car.x, car.y, segment) < 92);
  const limit = onRoad ? DRIVE.maxForwardSpeed : DRIVE.maxForwardSpeed * DRIVE.offRoadSpeedRatio;
  const reverseLimit = onRoad ? DRIVE.maxReverseSpeed : DRIVE.maxReverseSpeed * DRIVE.offRoadSpeedRatio;

  if (controls.accelerate) {
    if (car.speed < 0) car.speed = accelerateTowardZero(car.speed, DRIVE.braking * dt);
    else car.speed = Math.min(limit, car.speed + DRIVE.acceleration * dt);
  } else if (controls.brake) {
    if (car.speed > 0) car.speed = accelerateTowardZero(car.speed, DRIVE.braking * dt);
    else car.speed = Math.max(-reverseLimit, car.speed - DRIVE.acceleration * 0.7 * dt);
  } else {
    car.speed = accelerateTowardZero(car.speed, DRIVE.coast * dt);
  }

  if (!onRoad && Math.abs(car.speed) > limit) car.speed = Math.sign(car.speed) * limit;
  const steerInput = Number(controls.right) - Number(controls.left);
  if (steerInput && Math.abs(car.speed) > 5) {
    const speedFactor = 0.24 + 0.76 * Math.min(Math.abs(car.speed) / 150, 1);
    car.heading += steerInput * DRIVE.maxSteering * speedFactor * Math.sign(car.speed) * dt;
  }

  const dx = Math.cos(car.heading) * car.speed * dt;
  const dy = Math.sin(car.heading) * car.speed * dt;
  const nextX = clamp(car.x + dx, 22, DRIVE.worldWidth - 22);
  const nextY = clamp(car.y + dy, 22, DRIVE.worldHeight - 22);
  if (collidingBuildings(nextX, car.y)) {
    car.speed *= 0.25;
  } else {
    car.x = nextX;
  }
  if (collidingBuildings(car.x, nextY)) {
    car.speed *= 0.25;
  } else {
    car.y = nextY;
  }

  game.camera.x = lerp(game.camera.x, car.x, reducedMotion.matches ? 1 : 1 - Math.exp(-DRIVE.cameraSmoothing * dt));
  game.camera.y = lerp(game.camera.y, car.y, reducedMotion.matches ? 1 : 1 - Math.exp(-DRIVE.cameraSmoothing * dt));
  updateInteraction();
}

function collidingBuildings(x, y) {
  const radius = 13;
  for (const building of BUILDINGS) {
    const hitX = x + radius > building.x && x - radius < building.x + building.w;
    const hitY = y + radius > building.y && y - radius < building.y + building.h;
    if (hitX && hitY) return true;
  }
  return false;
}

function distanceToSegment(x, y, segment) {
  const dx = segment.x2 - segment.x1;
  const dy = segment.y2 - segment.y1;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared ? clamp(((x - segment.x1) * dx + (y - segment.y1) * dy) / lengthSquared, 0, 1) : 0;
  return Math.hypot(x - (segment.x1 + t * dx), y - (segment.y1 + t * dy));
}

function updateInteraction() {
  if (!game.driving || game.dialogOpen) return;
  const eligible = districts
    .map((district) => ({ district, range: distance(game.car, district) }))
    .filter(({ district, range }) => range < (game.activePrompt?.id === district.id ? DRIVE.interactionExitRadius : DRIVE.interactionRadius))
    .sort((a, b) => a.range - b.range)[0];
  const next = eligible && Math.abs(game.car.speed) < DRIVE.interactionSpeed ? eligible.district : null;
  game.activePrompt = next;
  const prompt = document.querySelector("#interactionPrompt");
  prompt.hidden = !next;
  if (next) {
    document.querySelector("#promptTitle").textContent = next.title;
    if (game.previousPrompt !== next.id) {
      announce(`${next.title} nearby. Press E or Enter to explore.`);
      game.previousPrompt = next.id;
    }
  } else {
    game.previousPrompt = null;
  }
}

function openActivePrompt() {
  if (!game.activePrompt) return;
  game.visited.add(game.activePrompt.id);
  safeStorage.set("portfolio-drive-visited", [...game.visited].join(","));
  openSection(game.activePrompt.id);
}

function resizeCanvas() {
  const bounds = driveView.getBoundingClientRect();
  game.width = Math.max(1, bounds.width);
  game.height = Math.max(1, bounds.height);
  game.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(game.width * game.pixelRatio);
  canvas.height = Math.round(game.height * game.pixelRatio);
  canvas.style.width = `${game.width}px`;
  canvas.style.height = `${game.height}px`;
  context?.setTransform(game.pixelRatio, 0, 0, game.pixelRatio, 0, 0);
  render();
}

function worldToScreen(x, y) {
  return {
    x: x - game.camera.x + game.width / 2,
    y: y - game.camera.y + game.height / 2,
  };
}

function visible(x, y, margin = 200) {
  const point = worldToScreen(x, y);
  return point.x > -margin && point.x < game.width + margin && point.y > -margin && point.y < game.height + margin;
}

function drawWorld() {
  context.fillStyle = "#718d67";
  context.fillRect(0, 0, game.width, game.height);
  drawGroundPatches();
  drawRoads();
  drawCrossings();
  drawTrees();
  BUILDINGS.forEach(drawBuilding);
  districts.forEach(drawDistrict);
  drawPlayerCar();
}

function drawGroundPatches() {
  context.save();
  const patches = [
    [280, 280, 205, 115, "#80976d"],
    [720, 1080, 220, 170, "#657f5d"],
    [2100, 310, 230, 150, "#819871"],
    [2090, 1110, 185, 170, "#69845d"],
    [620, 250, 170, 100, "#778f68"],
    [1550, 1040, 210, 130, "#7d946b"],
    [1480, 230, 155, 110, "#657e5e"],
  ];
  for (const [x, y, rx, ry, color] of patches) {
    if (!visible(x, y, Math.max(rx, ry))) continue;
    const point = worldToScreen(x, y);
    context.fillStyle = color;
    context.beginPath();
    context.ellipse(point.x, point.y, rx, ry, 0, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function drawRoads() {
  context.save();
  context.lineCap = "round";
  for (const segment of ROAD_SEGMENTS) {
    const start = worldToScreen(segment.x1, segment.y1);
    const end = worldToScreen(segment.x2, segment.y2);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.strokeStyle = "#c8bea0";
    context.lineWidth = 190;
    context.stroke();
    context.strokeStyle = "#4a554a";
    context.lineWidth = 174;
    context.stroke();
    context.strokeStyle = "#53604f";
    context.lineWidth = 156;
    context.stroke();
    context.setLineDash([16, 17]);
    context.lineWidth = 2;
    context.strokeStyle = "rgba(232, 233, 211, .43)";
    context.stroke();
    context.setLineDash([]);
    context.lineWidth = 2;
    context.strokeStyle = "rgba(223, 202, 129, .48)";
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    if (segment.y1 === segment.y2) {
      context.moveTo(start.x, start.y - 70);
      context.lineTo(end.x, end.y - 70);
      context.moveTo(start.x, start.y + 70);
      context.lineTo(end.x, end.y + 70);
    } else {
      context.moveTo(start.x - 70, start.y);
      context.lineTo(end.x - 70, end.y);
      context.moveTo(start.x + 70, start.y);
      context.lineTo(end.x + 70, end.y);
    }
    context.stroke();
  }
  context.restore();
}

function drawCrossings() {
  context.save();
  const crossings = [
    [1180, 770],
    [1850, 770],
    [1180, 1260],
    [1850, 1260],
  ];
  for (const [x, y] of crossings) {
    const point = worldToScreen(x, y);
    if (!visible(x, y, 120)) continue;
    context.fillStyle = "rgba(240, 236, 211, .66)";
    for (let stripe = -3; stripe <= 3; stripe += 1) {
      context.fillRect(point.x - 84 + stripe * 24, point.y - 91, 12, 12);
      context.fillRect(point.x - 84 + stripe * 24, point.y + 78, 12, 12);
    }
  }
  context.restore();
}

function drawTrees() {
  context.save();
  for (let x = 85; x < DRIVE.worldWidth; x += 95) {
    for (let y = 85; y < DRIVE.worldHeight; y += 103) {
      const offsetX = Math.sin(x * 0.017 + y * 0.011) * 25;
      const offsetY = Math.cos(x * 0.013 - y * 0.015) * 22;
      const tx = x + offsetX;
      const ty = y + offsetY;
      if (ROAD_SEGMENTS.some((segment) => distanceToSegment(tx, ty, segment) < 135)) continue;
      if (BUILDINGS.some((building) => tx > building.x - 30 && tx < building.x + building.w + 30 && ty > building.y - 35 && ty < building.y + building.h + 35)) continue;
      if (!visible(tx, ty, 30)) continue;
      drawTree(tx, ty, 8 + ((x + y) % 5));
    }
  }
  context.restore();
}

function drawTree(x, y, radius) {
  const point = worldToScreen(x, y);
  context.fillStyle = "rgba(22, 38, 23, .23)";
  context.beginPath();
  context.ellipse(point.x + 4, point.y + 6, radius * 1.25, radius, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#506f48";
  context.beginPath();
  context.arc(point.x, point.y, radius + 2, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#829b68";
  context.beginPath();
  context.arc(point.x - 2, point.y - 3, radius * .69, 0, Math.PI * 2);
  context.fill();
}

function drawBuilding(building) {
  const point = worldToScreen(building.x, building.y);
  if (point.x + building.w < -30 || point.x > game.width + 30 || point.y + building.h < -30 || point.y > game.height + 30) return;
  context.save();
  context.fillStyle = "rgba(22, 32, 21, .25)";
  context.fillRect(point.x + 8, point.y + 10, building.w, building.h);
  context.fillStyle = "#b2a885";
  context.fillRect(point.x - 5, point.y + building.h - 5, building.w + 10, 9);
  context.fillStyle = building.color;
  context.fillRect(point.x, point.y, building.w, building.h);
  context.fillStyle = "#e6e0c9";
  context.fillRect(point.x + 6, point.y + 6, building.w - 12, 6);
  context.fillStyle = "rgba(67, 87, 66, .68)";
  for (let wx = point.x + 17; wx < point.x + building.w - 10; wx += 25) {
    for (let wy = point.y + 25; wy < point.y + building.h - 17; wy += 25) {
      context.fillRect(wx, wy, 10, 12);
    }
  }
  context.fillStyle = "#8a7858";
  context.fillRect(point.x + building.w / 2 - 9, point.y + building.h - 23, 18, 23);
  context.fillStyle = "rgba(38, 52, 37, .8)";
  context.font = "7px 'DM Mono', monospace";
  context.textAlign = "center";
  context.fillText(building.label, point.x + building.w / 2, point.y + building.h + 20);
  context.restore();
}

function drawDistrict(district) {
  const point = worldToScreen(district.x, district.y);
  if (!visible(district.x, district.y, 100)) return;
  const pulse = reducedMotion.matches ? 0 : Math.sin(performance.now() / 550) * 2;
  context.save();
  context.fillStyle = "rgba(21, 36, 22, .2)";
  context.beginPath();
  context.ellipse(point.x + 2, point.y + 17, 28, 9, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = `${district.color}35`;
  context.beginPath();
  context.arc(point.x, point.y, 25 + pulse, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = district.color;
  context.beginPath();
  context.arc(point.x, point.y, 16, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#253128";
  context.beginPath();
  context.arc(point.x, point.y, 11, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = district.color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "9px 'DM Mono', monospace";
  context.fillText(district.number, point.x, point.y);
  context.textBaseline = "alphabetic";
  context.font = "8px 'DM Mono', monospace";
  context.fillStyle = "#f7f4e8";
  context.fillText(district.title.toUpperCase(), point.x, point.y + 43);
  context.restore();
}

function drawPlayerCar() {
  const point = worldToScreen(game.car.x, game.car.y);
  context.save();
  context.translate(point.x, point.y);
  context.rotate(game.car.heading + Math.PI / 2);
  context.fillStyle = "rgba(19, 27, 20, .42)";
  context.beginPath();
  context.ellipse(2, 5, 16, 24, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#26352d";
  context.fillRect(-14, -13, 5, 12);
  context.fillRect(9, -13, 5, 12);
  context.fillRect(-14, 7, 5, 12);
  context.fillRect(9, 7, 5, 12);
  context.fillStyle = "#d9ed9f";
  context.beginPath();
  context.roundRect(-11, -22, 22, 43, 6);
  context.fill();
  context.fillStyle = "#52675a";
  context.beginPath();
  context.roundRect(-8, -12, 16, 12, 3);
  context.fill();
  context.fillStyle = "#758b77";
  context.beginPath();
  context.roundRect(-8, 3, 16, 9, 2);
  context.fill();
  context.fillStyle = "#fff5d4";
  context.fillRect(-8, -22, 5, 3);
  context.fillRect(3, -22, 5, 3);
  context.fillStyle = Math.abs(game.car.speed) > 20 && game.car.speed > 0 ? "#f07a64" : "#8a584d";
  context.fillRect(-8, 17, 5, 3);
  context.fillRect(3, 17, 5, 3);
  context.restore();
}

function render() {
  if (!context || !game.width || !game.height) return;
  context.setTransform(game.pixelRatio, 0, 0, game.pixelRatio, 0, 0);
  context.clearRect(0, 0, game.width, game.height);
  drawWorld();
}

function frame(timestamp) {
  if (!game.running) return;
  if (!game.lastFrame) game.lastFrame = timestamp;
  const elapsed = Math.min((timestamp - game.lastFrame) / 1000, 0.1);
  game.lastFrame = timestamp;
  if (game.driving && !game.dialogOpen && portfolioView.hidden) {
    game.accumulator += elapsed;
    while (game.accumulator >= DRIVE.fixedStep) {
      updateCar(DRIVE.fixedStep);
      game.accumulator -= DRIVE.fixedStep;
    }
  }
  if (game.driving) {
    document.querySelector("#speedValue").textContent = String(Math.round(Math.abs(game.car.speed) * .36)).padStart(3, "0");
    const nearestDistrict = districts.map((district) => ({ district, range: distance(game.car, district) })).sort((a, b) => a.range - b.range)[0];
    game.district = nearestDistrict.range < 360 ? nearestDistrict.district : null;
    document.querySelector("#currentDistrict").textContent = game.district?.shortTitle.toUpperCase() ?? "WELCOME PLAZA";
    document.querySelector("#drivingStatus").textContent = game.district ? `EXPLORING ${game.district.shortTitle.toUpperCase()}` : "CRUISING PORTFOLIO DRIVE";
  }
  render();
  requestAnimationFrame(frame);
}

function startLoop() {
  if (game.running) return;
  game.running = true;
  requestAnimationFrame(frame);
}

function setDriving(active) {
  game.driving = active;
  welcomeCard.hidden = active;
  driveHud.hidden = !active;
  driveHelp.hidden = !active;
  if (active) {
    game.lastFrame = 0;
    document.querySelector("#resetCar").focus({ preventScroll: true });
    announce("Driving started. Use WASD or the arrow keys.");
  }
}

function handleKeyDown(event) {
  if (isEditableTarget(event.target)) return;
  const key = event.key.toLowerCase();
  const drivingKeys = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];
  if (drivingKeys.includes(key) && game.driving && !game.dialogOpen && portfolioView.hidden) {
    event.preventDefault();
    game.keys.add(key);
    return;
  }
  if (event.repeat) return;
  if (key === "escape" && game.dialogOpen) {
    event.preventDefault();
    closeDialog();
  } else if ((key === "e" || key === "enter") && game.driving && game.activePrompt && !game.dialogOpen) {
    event.preventDefault();
    openActivePrompt();
  } else if (key === "r" && game.driving && !game.dialogOpen) {
    event.preventDefault();
    resetCar();
  }
}

function handleKeyUp(event) {
  game.keys.delete(event.key.toLowerCase());
}

function configureTouchControls() {
  const controls = document.querySelector("#touchControls");
  controls.hidden = !isMobile.matches;
  controls.querySelectorAll("[data-control]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      if (!game.driving || game.dialogOpen) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      game.pointers.set(event.pointerId, button.dataset.control);
    });
    const release = (event) => game.pointers.delete(event.pointerId);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
  });
  isMobile.addEventListener("change", () => {
    controls.hidden = !isMobile.matches;
  });
}

function goToPortfolioSection(sectionId) {
  const valid = document.getElementById(sectionId);
  if (!valid || valid === driveView) return;
  if (game.dialogOpen) closeDialog(true);
  showPortfolio(sectionId);
  history.pushState({ portfolioDrive: true }, "", `#${sectionId}`);
  announce(`${valid.querySelector("h1, h2")?.textContent ?? sectionId} section`);
}

function handleRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash || hash === "home") {
    showDrive(hash === "home" && game.driving === false);
    return;
  }
  if (hash === "portfolio") {
    showPortfolio(false);
    return;
  }
  if (hash.startsWith("project/")) {
    const projectId = hash.slice("project/".length);
    showPortfolio(false);
    openProject(projectId, hash);
    return;
  }
  if (["experience", "education", "projects", "skills", "contact"].includes(hash)) {
    showPortfolio(false);
    document.getElementById(hash)?.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }
  if (["about", "help"].includes(hash)) {
    showDrive(false);
    openSection(hash, null);
    return;
  }
  showDrive(false);
  openDialog("about", "Page not found", (container) => {
    appendHeading(container, "PORTFOLIO DRIVE", "That destination is not on the map.", "Choose a section from the navigation to continue.");
  }, null);
}

function installEvents() {
  document.querySelector("#startDriving").addEventListener("click", () => {
    setDriving(true);
    welcomeCard.hidden = true;
    driveHud.hidden = false;
    driveHelp.hidden = false;
  });
  document.querySelector("#welcomePortfolio").addEventListener("click", () => {
    showPortfolio(false);
    history.pushState({ portfolioDrive: true }, "", "#portfolio");
  });
  document.querySelector("#portfolioToggle").addEventListener("click", () => {
    if (portfolioView.hidden) {
      showPortfolio(false);
      history.pushState({ portfolioDrive: true }, "", "#portfolio");
    } else {
      showDrive(false);
      history.pushState({ portfolioDrive: true }, "", "#home");
    }
  });
  document.querySelector("#backToMap").addEventListener("click", () => {
    showDrive(false);
    history.pushState({ portfolioDrive: true }, "", "#home");
  });
  document.querySelector("#resetCar").addEventListener("click", resetCar);
  document.querySelector("#promptOpen").addEventListener("click", openActivePrompt);
  document.querySelector("#touchInteract").addEventListener("click", openActivePrompt);
  document.querySelector("#helpButton").addEventListener("click", () => openSection("help", null));
  document.querySelector("#dialogClose").addEventListener("click", () => closeDialog());
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    game.dialogOpen = false;
    clearInput();
  });
  document.querySelectorAll("[data-open-section]").forEach((button) => {
    button.addEventListener("click", () => openSection(button.dataset.openSection));
  });
  document.querySelectorAll('.primary-nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const section = link.getAttribute("href").slice(1);
      if (section === "home") {
        event.preventDefault();
        showDrive(true);
        history.pushState({ portfolioDrive: true }, "", "#home");
      } else {
        event.preventDefault();
        goToPortfolioSection(section);
      }
    });
  });
  document.querySelectorAll('.social-links [data-open-section]').forEach((button) => {
    button.addEventListener("click", () => openSection(button.dataset.openSection));
  });
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", clearInput);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInput();
      game.lastFrame = 0;
    }
  });
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("popstate", () => {
    if (game.dialogOpen) closeDialog(true);
    handleRoute();
  });
  window.addEventListener("hashchange", handleRoute);
}

function initialize() {
  const storedVisits = safeStorage.get("portfolio-drive-visited");
  if (storedVisits) storedVisits.split(",").filter(Boolean).forEach((id) => game.visited.add(id));
  hydratePortfolioCopy();
  configureTouchControls();
  installEvents();
  if (!context) {
    document.querySelector("#startDriving").disabled = true;
    document.querySelector("#startDriving").textContent = "Canvas unavailable";
    document.querySelector("#drivingStatus").textContent = "CANVAS UNAVAILABLE · BROWSE THE PORTFOLIO";
  }
  resizeCanvas();
  startLoop();
  if (window.location.hash) handleRoute();
}

initialize();
