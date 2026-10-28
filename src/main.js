import {
  community,
  districts,
  education,
  exhibits,
  experience,
  profile,
  projects,
  skillGroups,
} from "./content.js";

const WORLD_SCALE = 1.65;
const DRIVE = {
  worldWidth: 1800 * WORLD_SCALE,
  worldHeight: 1200 * WORLD_SCALE,
  cameraDistance: 160 * WORLD_SCALE,
  cameraHeight: 125 * WORLD_SCALE,
  roadWidth: 156 * WORLD_SCALE,
  exhibitOffset: 96 * WORLD_SCALE,
  horizon: 0.28,
  focalLength: 0.72,
  maxForwardSpeed: 185,
  maxReverseSpeed: 72,
  acceleration: 420,
  braking: 600,
  coast: 190,
  maxSteering: 1.35,
  driftSteering: 1.7,
  offRoadSpeedRatio: 0.85,
  interactionRadius: 128 * WORLD_SCALE,
  interactionExitRadius: 160 * WORLD_SCALE,
  interactionSpeed: 48,
  cameraSmoothing: 8.5,
  fixedStep: 1 / 60,
};

const CHECKPOINT_ORDER = ["experience", "education", "projects", "skills", "contact"];
const CHECKPOINT_STORAGE_KEY = "portfolio-drive-checkpoints-v1";
const STICKER_STORAGE_KEY = "portfolio-drive-stickers-v1";

const STICKERS = [
  { id: "togetherwork", label: "Togetherwork", mark: "TW", color: "#b9e68a" },
  { id: "maxel-lab", label: "Maxel Lab", mark: "M", color: "#90d6bd" },
  { id: "fifa", label: "World Cup", mark: "🏆", color: "#e2c774", trophy: true },
  { id: "foodscope", label: "FoodScope", mark: "FS", color: "#e8a480" },
  { id: "axiom", label: "Axiom", mark: "AX", color: "#8bb8e7" },
  { id: "education", label: "UT Austin", mark: "UT", color: "#e39b75" },
  { id: "projects", label: "Projects", mark: "H₂O", color: "#8bd8e2" },
  { id: "skills", label: "Toolkit", mark: "</>", color: "#d4a5f5" },
  { id: "contact", label: "Contact", mark: "AH", color: "#8bd8e2" },
];

const ROAD_SEGMENTS = [
  { id: "projects", name: "PROJECT EXPRESSWAY", x1: 0, y1: 510, x2: 780, y2: 510, color: "#c4a4e5" },
  { id: "experience", name: "EXPERIENCE HIGHWAY", x1: 780, y1: 510, x2: 1740, y2: 510, color: "#b9e68a" },
  { id: "education", name: "EDUCATION AVENUE", x1: 780, y1: 0, x2: 780, y2: 510, color: "#8bd8ba" },
  { id: "skills", name: "SKILLS GARAGE ROAD", x1: 780, y1: 510, x2: 780, y2: 1200, color: "#efbd76" },
  { id: "contact-connector", name: "CONTACT WAY", x1: 780, y1: 700, x2: 1740, y2: 700, color: "#8bd8e2" },
];

const ROUTE_SIGNS = [
  { roadId: "experience", along: 82, side: 1 },
  { roadId: "projects", along: 700, side: -1 },
  { roadId: "education", along: 396, side: 1 },
  { roadId: "skills", along: 108, side: -1 },
  { roadId: "contact-connector", along: 130, side: 1 },
];

const BUILDINGS = [
  { x: 540, y: 62, w: 126, d: 100, h: 86, color: "#c9d6b0", label: "CAMPUS HALL" },
  { x: 888, y: 58, w: 112, d: 86, h: 72, color: "#b6c8a5", label: "STUDY HOUSE" },
  { x: 140, y: 270, w: 112, d: 88, h: 74, color: "#d4c8a7", label: "RESEARCH LAB" },
  { x: 330, y: 280, w: 128, d: 92, h: 82, color: "#c3d1ae", label: "DATA STUDIO" },
  { x: 1630, y: 250, w: 124, d: 92, h: 84, color: "#d6d0b8", label: "OFFICE 01" },
  { x: 1590, y: 890, w: 128, d: 100, h: 82, color: "#c1d0b5", label: "PIT STOP" },
  { x: 560, y: 966, w: 122, d: 92, h: 80, color: "#dcc7a1", label: "WORKSHOP" },
  { x: 870, y: 970, w: 128, d: 94, h: 78, color: "#c9b991", label: "TOOL SHED" },
  { x: 1110, y: 930, w: 116, d: 90, h: 76, color: "#c9d1b5", label: "COMMUNITY HALL" },
  { x: 80, y: 70, w: 130, d: 105, h: 90, color: "#c1c9a7", label: "GARDEN HOUSE" },
  { x: 285, y: 82, w: 105, d: 83, h: 68, color: "#b8caaa", label: "FIELD STATION" },
  { x: 1120, y: 55, w: 145, d: 112, h: 96, color: "#d5c9a6", label: "LIBRARY" },
  { x: 1420, y: 82, w: 114, d: 88, h: 72, color: "#b9c9b0", label: "CAMPUS CAFE" },
  { x: 70, y: 850, w: 138, d: 106, h: 88, color: "#c8d0b1", label: "MAKER SPACE" },
  { x: 260, y: 1010, w: 118, d: 94, h: 78, color: "#d7c6a5", label: "OBSERVATORY" },
  { x: 410, y: 880, w: 110, d: 84, h: 70, color: "#b9c6a9", label: "GREENHOUSE" },
  { x: 1320, y: 1000, w: 150, d: 112, h: 90, color: "#c9c5a9", label: "MARKET HALL" },
  { x: 1535, y: 1010, w: 116, d: 90, h: 76, color: "#c7d2b2", label: "GARDEN CAFE" },
  { x: 80, y: 340, w: 110, d: 84, h: 71, color: "#d4c8a7", label: "ARTS STUDIO" },
  { x: 340, y: 95, w: 128, d: 92, h: 80, color: "#d2c49f", label: "BOTANIC LAB" },
  { x: 1020, y: 880, w: 104, d: 82, h: 68, color: "#c5d0b1", label: "PICNIC PAVILION" },
  { x: 1690, y: 880, w: 124, d: 96, h: 79, color: "#d1c5a9", label: "MOTOR LODGE" },
  { x: 170, y: 1020, w: 118, d: 90, h: 74, color: "#c7c9a8", label: "WATER TOWER" },
  { x: 1520, y: 225, w: 134, d: 98, h: 82, color: "#d3d0b7", label: "CREATIVE HUB" },
];

const STADIUM = { x: 800, y: 30, w: 370, d: 260, h: 78 };
const FOUNTAIN = { x: 900, y: 850, radius: 34 };

function scaleWorldLayout() {
  ROAD_SEGMENTS.forEach((road) => {
    road.x1 *= WORLD_SCALE;
    road.y1 *= WORLD_SCALE;
    road.x2 *= WORLD_SCALE;
    road.y2 *= WORLD_SCALE;
  });
  ROUTE_SIGNS.forEach((sign) => { sign.along *= WORLD_SCALE; });
  BUILDINGS.forEach((building) => {
    building.x *= WORLD_SCALE;
    building.y *= WORLD_SCALE;
    building.w *= WORLD_SCALE;
    building.d *= WORLD_SCALE;
    building.h *= WORLD_SCALE;
  });
  [STADIUM, FOUNTAIN].forEach((landmark) => {
    Object.keys(landmark).forEach((key) => { landmark[key] *= WORLD_SCALE; });
  });
  districts.forEach((district) => {
    ["x", "y", "signX", "signY"].forEach((key) => { district[key] *= WORLD_SCALE; });
  });
  exhibits.forEach((exhibit) => {
    exhibit.x *= WORLD_SCALE;
    exhibit.y *= WORLD_SCALE;
  });
}

scaleWorldLayout();

const canvas = document.querySelector("#worldCanvas");
const context = canvas.getContext("2d");
const driveView = document.querySelector("#driveView");
const portfolioView = document.querySelector("#portfolioView");
const welcomeCard = document.querySelector("#welcomeCard");
const driveHud = document.querySelector("#driveHud");
const driveHelp = document.querySelector("#driveHelp");
const mapLegend = document.querySelector("#mapLegend");
const dialog = document.querySelector("#contentDialog");
const dialogContent = document.querySelector("#dialogContent");
const dialogKicker = document.querySelector("#dialogKicker");
const announcer = document.querySelector("#announcer");
const stickerShelf = document.querySelector("#stickerShelf");

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
  checkpointIndex: 0,
  car: { x: 780 * WORLD_SCALE, y: 510 * WORLD_SCALE, heading: -Math.PI / 2, speed: 0, visualSteer: 0, braking: false, driftAngle: 0, boosting: false },
  camera: { x: 780 * WORLD_SCALE, y: 510 * WORLD_SCALE, heading: -Math.PI / 2 },
  keys: new Set(),
  pointers: new Map(),
  completedCheckpoints: new Set(),
  earnedStickers: new Set(),
  boostCharge: 100,
  effects: [],
};

const projection = {
  forwardX: 0,
  forwardY: -1,
  rightX: 1,
  rightY: 0,
  cameraX: 0,
  cameraY: 0,
  focal: 0,
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const isMobile = window.matchMedia("(max-width: 700px), (pointer: coarse)");
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, amount) => from + (to - from) * amount;
const lerpAngle = (from, to, amount) => from + Math.atan2(Math.sin(to - from), Math.cos(to - from)) * amount;
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

function updateStickerShelf() {
  if (!stickerShelf) return;
  const items = document.querySelector("#stickerItems");
  items.replaceChildren();
  STICKERS.filter((sticker) => game.earnedStickers.has(sticker.id)).forEach((sticker) => {
    const badge = element("span", "sticker-chip is-earned", sticker.mark);
    badge.title = `${sticker.label} sticker earned`;
    badge.setAttribute("aria-label", badge.title);
    badge.style.setProperty("--sticker-color", sticker.color);
    items.append(badge);
  });
  document.querySelector("#stickerCount").textContent = `${game.earnedStickers.size} / ${STICKERS.length}`;
  document.querySelector("#stickerEmpty").hidden = game.earnedStickers.size > 0;
  stickerShelf.hidden = !game.driving;
}

function awardSticker(id) {
  const sticker = STICKERS.find((item) => item.id === id);
  if (!sticker || game.earnedStickers.has(id)) return;
  game.earnedStickers.add(id);
  safeStorage.set(STICKER_STORAGE_KEY, [...game.earnedStickers].join(","));
  updateStickerShelf();
  announce(`${sticker.label} car sticker collected.`);
}

function exhibitWorldPoint(exhibit) {
  const road = ROAD_SEGMENTS.find((segment) => segment.id === exhibit.roadId);
  if (!road) return null;
  const dx = road.x2 - road.x1;
  const dy = road.y2 - road.y1;
  const length = Math.hypot(dx, dy);
  const along = (exhibit.x - road.x1) * (dx / length) + (exhibit.y - road.y1) * (dy / length);
  return roadPoint(road, along, exhibit.side * DRIVE.exhibitOffset);
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
    const logo = element("span", "job-logo", item.mark.replace("\n", " "));
    logo.setAttribute("role", "img");
    logo.setAttribute("aria-label", `${item.organization} mark`);
    logo.style.setProperty("--brand-color", item.brandColor);
    meta.append(logo);
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
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
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
      const button = element("button", "");
      button.type = "button";
      button.textContent = game.checkpointIndex >= CHECKPOINT_ORDER.length
        ? "Return to the drive"
        : game.driving ? "Continue to next checkpoint" : "Start guided route";
      button.addEventListener("click", resumeCheckpointRoute);
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
      appendDialogActions(container, [{ kind: "drive" }]);
    }, "projects");
    return;
  }
  openDialog("projects", project.title, (container) => renderProjectDetail(container, project), route);
}

function openExperienceItem(experienceId, route = `experience/${experienceId}`) {
  const item = experience.find((entry) => entry.id === experienceId);
  if (!item) {
    openSection("experience", "experience");
    return;
  }
  openDialog("experience", item.organization, (container) => {
    appendHeading(
      container,
      "EXPERIENCE HIGHWAY / ROLE",
      item.organization,
      `${item.role} · ${item.dates}${item.location ? ` · ${item.location}` : ""}`,
    );
    container.append(element("p", "", item.summary));
    appendBullets(container, "Selected contributions", item.contributions);
    container.append(element("h3", "", "Tools & capabilities"), makeTagRow(item.tools));
  }, route);
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
      appendDialogActions(container, [{ kind: "drive" }]);
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
      appendDialogActions(container, [{ kind: "drive" }]);
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
      appendDialogActions(container, [{ kind: "drive" }]);
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
      appendDialogActions(container, [{ kind: "drive" }]);
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
        ...(district ? [{ kind: "drive" }] : []),
      ]);
    });
    return;
  }

  if (sectionId === "help") {
    openDialog("help", "Controls", (container) => {
      appendHeading(container, "DRIVING MANUAL", "Controls", "Follow the next checkpoint to tour each career area. Driving is optional; every section is also available from the navigation.");
      const rows = [
        ["W / ↑", "Accelerate"],
        ["S / ↓", "Brake, then reverse"],
        ["A / ← · D / →", "Steer"],
        ["Shift", "Boost while moving; charge refills when released"],
        ["Hold Space + steer", "Drift through turns and leave tire smoke"],
        ["E / Enter", "Open a nearby checkpoint or exhibit"],
        ["Checkpoints", "Collect a career sticker; role billboards have their own rewards"],
        ["Stadium", "Follow Experience Highway to the FIFA World Cup destination at NRG Stadium"],
        ["Route panel", "Follow the arrow to the next career checkpoint"],
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
  mapLegend.hidden = game.driving;
  updateTouchControls();
  updateCheckpointNavigation();
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
}

function resumeCheckpointRoute() {
  if (game.dialogOpen) closeDialog(true);
  showDrive(false);
  setDriving(true);
  history.pushState({ portfolioDrive: true }, "", "#home");
  const checkpoint = getNextCheckpoint();
  announce(checkpoint
    ? `Follow navigation to ${checkpoint.title}.`
    : "All career checkpoints are complete. Keep exploring the exhibits.");
}

function resetCar() {
  game.car.x = 780 * WORLD_SCALE;
  game.car.y = 510 * WORLD_SCALE;
  game.car.heading = -Math.PI / 2;
  game.car.speed = 0;
  game.car.visualSteer = 0;
  game.car.driftAngle = 0;
  game.car.boosting = false;
  game.boostCharge = 100;
  game.car.braking = false;
  game.camera.x = game.car.x;
  game.camera.y = game.car.y;
  game.camera.heading = game.car.heading;
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
    boost: has("shift") || pointerHas("boost"),
    drift: has(" ") || pointerHas("drift"),
  };
}

function accelerateTowardZero(speed, amount) {
  if (Math.abs(speed) <= amount) return 0;
  return speed - Math.sign(speed) * amount;
}

function updateCar(dt) {
  const controls = readControls();
  const car = game.car;
  const onRoad = ROAD_SEGMENTS.some((segment) => distanceToSegment(car.x, car.y, segment) < DRIVE.roadWidth * 0.57);
  const boosting = controls.boost && game.boostCharge > 0 && car.speed >= 0;
  car.boosting = boosting;
  if (boosting) game.boostCharge = Math.max(0, game.boostCharge - 58 * dt);
  else game.boostCharge = Math.min(100, game.boostCharge + 24 * dt);
  const limit = (onRoad ? DRIVE.maxForwardSpeed : DRIVE.maxForwardSpeed * DRIVE.offRoadSpeedRatio)
    * (boosting ? 1.42 : 1);
  const reverseLimit = onRoad ? DRIVE.maxReverseSpeed : DRIVE.maxReverseSpeed * DRIVE.offRoadSpeedRatio;

  if (controls.accelerate) {
    if (car.speed < 0) car.speed = accelerateTowardZero(car.speed, DRIVE.braking * dt);
    else car.speed = Math.min(limit, car.speed + DRIVE.acceleration * (boosting ? 2 : 1) * dt);
  } else if (boosting) {
    car.speed = Math.min(limit, car.speed + DRIVE.acceleration * 1.35 * dt);
  } else if (controls.brake) {
    if (car.speed > 0) car.speed = accelerateTowardZero(car.speed, DRIVE.braking * dt);
    else car.speed = Math.max(-reverseLimit, car.speed - DRIVE.acceleration * 0.7 * dt);
  } else {
    car.speed = accelerateTowardZero(car.speed, DRIVE.coast * dt);
  }

  if (!onRoad && Math.abs(car.speed) > limit) car.speed = Math.sign(car.speed) * limit;
  const steerInput = Number(controls.right) - Number(controls.left);
  car.visualSteer = steerInput;
  car.braking = controls.brake && car.speed > 0;
  if (steerInput && Math.abs(car.speed) > 1) {
    const speedFactor = 0.52 + 0.38 * Math.min(Math.abs(car.speed) / DRIVE.maxForwardSpeed, 1);
    const drifting = controls.drift && Math.abs(car.speed) > 28;
    car.heading += steerInput * (drifting ? DRIVE.driftSteering : DRIVE.maxSteering) * speedFactor * Math.sign(car.speed) * dt;
  }

  const drifting = controls.drift && Math.abs(car.speed) > 28 && Boolean(steerInput);
  car.driftAngle = lerp(car.driftAngle, drifting ? steerInput * 0.34 : 0, Math.min(1, (drifting ? 3.1 : 2.3) * dt));
  const movementHeading = car.heading + car.driftAngle;
  const dx = Math.cos(movementHeading) * car.speed * dt;
  const dy = Math.sin(movementHeading) * car.speed * dt;
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

  if (drifting && game.effects.length < 24 && Math.random() < dt * 30) {
    game.effects.push({
      x: car.x - Math.cos(car.heading) * 23,
      y: car.y - Math.sin(car.heading) * 23,
      life: 0.65,
      radius: 5 + Math.random() * 5,
    });
  }
  game.effects = game.effects
    .map((effect) => ({ ...effect, life: effect.life - dt, radius: effect.radius + dt * 13 }))
    .filter((effect) => effect.life > 0);

  const cameraBlend = reducedMotion.matches ? 1 : 1 - Math.exp(-DRIVE.cameraSmoothing * dt);
  game.camera.x = lerp(game.camera.x, car.x, cameraBlend);
  game.camera.y = lerp(game.camera.y, car.y, cameraBlend);
  game.camera.heading = lerpAngle(game.camera.heading, car.heading, cameraBlend);
  updateInteraction();
}

function collidingBuildings(x, y) {
  const radius = 13 * WORLD_SCALE;
  for (const building of BUILDINGS) {
    const hitX = x + radius > building.x && x - radius < building.x + building.w;
    const hitY = y + radius > building.y && y - radius < building.y + building.d;
    if (hitX && hitY) return true;
  }
  const stadiumHitX = x + radius > STADIUM.x && x - radius < STADIUM.x + STADIUM.w;
  const stadiumHitY = y + radius > STADIUM.y && y - radius < STADIUM.y + STADIUM.d;
  if (stadiumHitX && stadiumHitY) return true;
  if (Math.hypot(x - FOUNTAIN.x, y - FOUNTAIN.y) < FOUNTAIN.radius + radius) return true;
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
  const nextCheckpoint = getNextCheckpoint();
  const roadPositionedExhibits = exhibits.map((exhibit) => ({
    ...exhibit,
    ...exhibitWorldPoint(exhibit),
    targetType: "exhibit",
  }));
  const destinations = [
    ...(nextCheckpoint ? [{ ...nextCheckpoint, targetType: "checkpoint" }] : []),
    ...roadPositionedExhibits,
  ];
  const eligible = destinations
    .map((target) => ({ target, range: distance(game.car, target) }))
    .filter(({ target, range }) => range < (game.activePrompt?.id === target.id ? DRIVE.interactionExitRadius : DRIVE.interactionRadius))
    .sort((a, b) => a.range - b.range)[0];
  const next = eligible && Math.abs(game.car.speed) < DRIVE.interactionSpeed ? eligible.target : null;
  game.activePrompt = next;
  const prompt = document.querySelector("#interactionPrompt");
  prompt.hidden = !next;
  if (next) {
    document.querySelector("#promptTitle").textContent = next.targetType === "checkpoint"
      ? `Checkpoint: ${next.title}`
      : `Explore ${next.title}`;
    document.querySelector("#promptHint").textContent = isMobile.matches
      ? next.targetType === "checkpoint" ? "Tap E to explore this career area" : "Tap E to open"
      : next.targetType === "checkpoint" ? "Press E or Enter to explore this career area" : "Press E or Enter to open";
    document.querySelector("#promptOpen").innerHTML = next.targetType === "checkpoint"
      ? 'ARRIVE <span aria-hidden="true">↗</span>'
      : 'OPEN <span aria-hidden="true">↗</span>';
    if (game.previousPrompt !== next.id) {
      announce(isMobile.matches
        ? `${next.title} checkpoint nearby. Tap E to explore.`
        : `${next.title} checkpoint nearby. Press E or Enter to explore.`);
      game.previousPrompt = next.id;
    }
  } else {
    game.previousPrompt = null;
  }
}

function openActivePrompt() {
  if (!game.activePrompt) return;
  if (game.activePrompt.targetType === "checkpoint") {
    const checkpoint = game.activePrompt;
    const completedNumber = game.checkpointIndex + 1;
    game.checkpointIndex += 1;
    game.completedCheckpoints.add(checkpoint.id);
    safeStorage.set(CHECKPOINT_STORAGE_KEY, [...game.completedCheckpoints].join(","));
    awardSticker(checkpoint.id === "experience" ? "togetherwork" : checkpoint.id);
    const nextCheckpoint = getNextCheckpoint();
    game.activePrompt = null;
    game.previousPrompt = null;
    updateCheckpointNavigation();
    openSection(checkpoint.id);
    announce(nextCheckpoint
      ? `Checkpoint ${completedNumber} reached. Next: ${nextCheckpoint.shortTitle}.`
      : `All ${CHECKPOINT_ORDER.length} career checkpoints reached. Journey complete.`);
    return;
  }
  if (game.activePrompt.targetType === "exhibit") {
    awardSticker(game.activePrompt.contentId);
    if (game.activePrompt.type === "experience") openExperienceItem(game.activePrompt.contentId);
    else openProject(game.activePrompt.contentId);
    return;
  }
  openSection(game.activePrompt.id);
}

function getNextCheckpoint() {
  while (game.checkpointIndex < CHECKPOINT_ORDER.length
    && game.completedCheckpoints.has(CHECKPOINT_ORDER[game.checkpointIndex])) {
    game.checkpointIndex += 1;
  }
  const nextId = CHECKPOINT_ORDER[game.checkpointIndex];
  return districts.find((district) => district.id === nextId) ?? null;
}

function updateCheckpointNavigation() {
  const panel = document.querySelector("#checkpointNav");
  if (!panel) return;
  if (!game.driving) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  const checkpoint = getNextCheckpoint();
  const progress = document.querySelector("#checkpointProgress");
  const name = document.querySelector("#checkpointName");
  const distanceLabel = document.querySelector("#checkpointDistance");
  const directionLabel = document.querySelector("#checkpointDirection");
  const arrow = document.querySelector("#checkpointArrow");
  const fill = document.querySelector("#checkpointProgressFill");
  progress.textContent = `${String(Math.min(game.checkpointIndex + 1, CHECKPOINT_ORDER.length)).padStart(2, "0")} / ${String(CHECKPOINT_ORDER.length).padStart(2, "0")} CHECKPOINTS`;
  fill.style.width = `${(game.checkpointIndex / CHECKPOINT_ORDER.length) * 100}%`;
  if (!checkpoint) {
    name.textContent = "Career route complete";
    distanceLabel.textContent = "5 / 5";
    directionLabel.textContent = "ALL AREAS EXPLORED";
    arrow.hidden = true;
    return;
  }
  arrow.hidden = false;
  name.textContent = checkpoint.title;
  const deltaX = checkpoint.x - game.car.x;
  const deltaY = checkpoint.y - game.car.y;
  const remaining = Math.hypot(deltaX, deltaY);
  const bearing = Math.atan2(deltaY, deltaX);
  const relativeBearing = Math.atan2(
    Math.sin(bearing - game.car.heading),
    Math.cos(bearing - game.car.heading),
  );
  const angleDegrees = Math.abs(relativeBearing * 180 / Math.PI);
  directionLabel.textContent = remaining < DRIVE.interactionRadius
    ? Math.abs(game.car.speed) < DRIVE.interactionSpeed ? "PRESS E TO EXPLORE" : "SLOW DOWN TO ARRIVE"
    : angleDegrees < 22 ? "CONTINUE AHEAD" : relativeBearing > 0 ? "TURN RIGHT" : "TURN LEFT";
  distanceLabel.textContent = remaining < DRIVE.interactionRadius
    ? "NEARBY"
    : remaining >= 1000 ? `${(remaining / 1000).toFixed(1)} km` : `${Math.round(remaining)} m`;
  arrow.style.transform = `rotate(${remaining < 20 ? 0 : relativeBearing}rad)`;
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

function projectWorldPoint(x, y) {
  const relativeX = x - projection.cameraX;
  const relativeY = y - projection.cameraY;
  const depth = relativeX * projection.forwardX + relativeY * projection.forwardY;
  if (depth < 8 || depth > 1800 * WORLD_SCALE) return null;
  const lateral = relativeX * projection.rightX + relativeY * projection.rightY;
  const scale = projection.focal / depth;
  return {
    x: game.width / 2 + lateral * scale,
    y: game.height * DRIVE.horizon + projection.focal * DRIVE.cameraHeight / depth,
    depth,
    scale,
  };
}

function prepareProjection() {
  projection.forwardX = Math.cos(game.camera.heading);
  projection.forwardY = Math.sin(game.camera.heading);
  projection.rightX = -projection.forwardY;
  projection.rightY = projection.forwardX;
  projection.cameraX = game.camera.x - projection.forwardX * DRIVE.cameraDistance;
  projection.cameraY = game.camera.y - projection.forwardY * DRIVE.cameraDistance;
  projection.focal = game.height * DRIVE.focalLength;
}

function drawWorld() {
  const sky = context.createLinearGradient(0, 0, 0, game.height * .45);
  sky.addColorStop(0, "#d6d7bb");
  sky.addColorStop(1, "#91a77c");
  context.fillStyle = sky;
  context.fillRect(0, 0, game.width, game.height * .47);
  const ground = context.createLinearGradient(0, game.height * DRIVE.horizon, 0, game.height);
  ground.addColorStop(0, "#82986d");
  ground.addColorStop(1, "#637d5a");
  context.fillStyle = ground;
  context.fillRect(0, game.height * DRIVE.horizon, game.width, game.height * (1 - DRIVE.horizon));
  drawDistantLandscape();
  drawRoads();
  drawTrees();
  BUILDINGS.forEach(drawBuilding);
  drawFountain();
  drawNRGStadium();
  drawRouteSigns();
  exhibits
    .map((exhibit) => ({ exhibit, depth: (exhibit.x - projection.cameraX) * projection.forwardX + (exhibit.y - projection.cameraY) * projection.forwardY }))
    .sort((a, b) => b.depth - a.depth)
    .forEach(({ exhibit }) => drawExhibit(exhibit));
  districts.forEach(drawDistrict);
  drawCheckpointBeacon(getNextCheckpoint());
  drawCarEffects();
  drawPlayerCar();
}

function drawDistantLandscape() {
  const horizon = game.height * DRIVE.horizon;
  context.save();
  context.fillStyle = "rgba(96, 121, 80, .35)";
  context.beginPath();
  context.moveTo(0, horizon + 18);
  for (let x = 0; x <= game.width + 50; x += 55) {
    const y = horizon + 4 + Math.sin(x * .013) * 8 + Math.cos(x * .027) * 4;
    context.lineTo(x, y);
  }
  context.lineTo(game.width, horizon + 42);
  context.lineTo(0, horizon + 42);
  context.closePath();
  context.fill();
  context.restore();
}

function roadPoint(segment, along, offset = 0) {
  const dx = segment.x2 - segment.x1;
  const dy = segment.y2 - segment.y1;
  const length = Math.hypot(dx, dy);
  const normalX = -dy / length;
  const normalY = dx / length;
  return {
    x: segment.x1 + dx / length * along + normalX * offset,
    y: segment.y1 + dy / length * along + normalY * offset,
  };
}

function drawRoadRibbon(segment, halfWidth, color) {
  const dx = segment.x2 - segment.x1;
  const dy = segment.y2 - segment.y1;
  const length = Math.hypot(dx, dy);
  const startDepth = (segment.x1 - projection.cameraX) * projection.forwardX + (segment.y1 - projection.cameraY) * projection.forwardY;
  const endDepth = (segment.x2 - projection.cameraX) * projection.forwardX + (segment.y2 - projection.cameraY) * projection.forwardY;
  const depthDelta = endDepth - startDepth;
  let startAlong = 0;
  let endAlong = length;
  const nearDepth = DRIVE.roadWidth * .72;
  if (Math.abs(depthDelta) < .001) {
    if (startDepth < nearDepth || startDepth > 1700 * WORLD_SCALE) return;
  } else {
    const nearAlong = (nearDepth - startDepth) / depthDelta * length;
    const farAlong = (1700 * WORLD_SCALE - startDepth) / depthDelta * length;
    startAlong = Math.max(0, Math.min(nearAlong, farAlong));
    endAlong = Math.min(length, Math.max(nearAlong, farAlong));
    if (startAlong >= endAlong) return;
  }
  const leftStart = roadPoint(segment, startAlong, -halfWidth);
  const leftEnd = roadPoint(segment, endAlong, -halfWidth);
  const rightEnd = roadPoint(segment, endAlong, halfWidth);
  const rightStart = roadPoint(segment, startAlong, halfWidth);
  const points = [
    projectWorldPoint(leftStart.x, leftStart.y),
    projectWorldPoint(leftEnd.x, leftEnd.y),
    projectWorldPoint(rightEnd.x, rightEnd.y),
    projectWorldPoint(rightStart.x, rightStart.y),
  ];
  if (points.some((point) => !point)) return;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.closePath();
  context.fill();
}

function drawRoadMarkings() {
  for (const segment of ROAD_SEGMENTS) {
    const length = Math.hypot(segment.x2 - segment.x1, segment.y2 - segment.y1);
    for (let along = 0; along < length; along += 126 * WORLD_SCALE) {
      const dashEnd = Math.min(along + 48 * WORLD_SCALE, length);
      const centerStart = roadPoint(segment, along);
      const centerEnd = roadPoint(segment, dashEnd);
      const start = projectWorldPoint(centerStart.x, centerStart.y);
      const end = projectWorldPoint(centerEnd.x, centerEnd.y);
      if (!start || !end) continue;
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.strokeStyle = "rgba(224, 204, 133, .88)";
      context.lineWidth = clamp((start.scale + end.scale) * 1.3, 1, 7);
      context.stroke();

      for (const laneOffset of [-DRIVE.roadWidth * .35, DRIVE.roadWidth * .35]) {
        const laneStart = roadPoint(segment, along, laneOffset);
        const laneEnd = roadPoint(segment, dashEnd, laneOffset);
        const laneA = projectWorldPoint(laneStart.x, laneStart.y);
        const laneB = projectWorldPoint(laneEnd.x, laneEnd.y);
        if (!laneA || !laneB) continue;
        context.beginPath();
        context.moveTo(laneA.x, laneA.y);
        context.lineTo(laneB.x, laneB.y);
        context.strokeStyle = "rgba(238, 239, 219, .68)";
        context.lineWidth = clamp((laneA.scale + laneB.scale) * .8, .8, 5);
        context.stroke();
      }
    }
  }
}

function drawRoads() {
  context.save();
  for (const segment of ROAD_SEGMENTS) drawRoadRibbon(segment, DRIVE.roadWidth * .58, segment.color);
  for (const segment of ROAD_SEGMENTS) drawRoadRibbon(segment, DRIVE.roadWidth * .54, "#bcb598");
  for (const segment of ROAD_SEGMENTS) drawRoadRibbon(segment, DRIVE.roadWidth * .5, "#48544b");
  for (const segment of ROAD_SEGMENTS) drawRoadRibbon(segment, DRIVE.roadWidth * .45, "#505d52");
  drawRoadMarkings();
  context.restore();
}

function drawTrees() {
  for (let x = 45; x < DRIVE.worldWidth; x += 120) {
    for (let y = 40; y < DRIVE.worldHeight; y += 125) {
      const tx = x + Math.sin(x * .017 + y * .011) * 20;
      const ty = y + Math.cos(x * .013 - y * .015) * 18;
      if (ROAD_SEGMENTS.some((segment) => distanceToSegment(tx, ty, segment) < DRIVE.roadWidth * .65)) continue;
      if (BUILDINGS.some((building) => tx > building.x - 22 && tx < building.x + building.w + 22 && ty > building.y - 22 && ty < building.y + building.d + 22)) continue;
      drawTree(tx, ty, 10 + ((x + y) % 5));
    }
  }
}

function drawTree(x, y, radius) {
  const base = projectWorldPoint(x, y);
  if (!base || base.x < -70 || base.x > game.width + 70) return;
  const size = clamp(radius * base.scale, 2, 54);
  const trunk = clamp(size * 1.8, 3, 62);
  context.fillStyle = "rgba(29, 44, 27, .25)";
  context.beginPath();
  context.ellipse(base.x + size * .2, base.y, size * .9, size * .33, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#5e5740";
  context.fillRect(base.x - size * .12, base.y - trunk, size * .24, trunk);
  context.fillStyle = "#476b45";
  context.beginPath();
  context.ellipse(base.x, base.y - trunk, size, size * 1.1, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#87a36d";
  context.beginPath();
  context.ellipse(base.x - size * .2, base.y - trunk - size * .18, size * .63, size * .7, 0, 0, Math.PI * 2);
  context.fill();
}

function drawBuilding(building) {
  const corners = [
    [building.x, building.y],
    [building.x + building.w, building.y],
    [building.x + building.w, building.y + building.d],
    [building.x, building.y + building.d],
  ].map(([x, y]) => projectWorldPoint(x, y));
  if (corners.some((point) => !point || point.x < -170 || point.x > game.width + 170)) return;
  const height = building.h;
  const roof = corners.map((point) => ({ x: point.x, y: point.y - point.scale * height }));
  context.save();
  context.fillStyle = "rgba(24, 36, 25, .24)";
  context.beginPath();
  context.moveTo(corners[0].x + 5, corners[0].y + 5);
  corners.slice(1).forEach((point) => context.lineTo(point.x + 5, point.y + 5));
  context.closePath();
  context.fill();

  context.fillStyle = "#817d64";
  context.beginPath();
  context.moveTo(corners[3].x, corners[3].y);
  context.lineTo(corners[2].x, corners[2].y);
  context.lineTo(roof[2].x, roof[2].y);
  context.lineTo(roof[3].x, roof[3].y);
  context.closePath();
  context.fill();
  context.fillStyle = "#aab89b";
  context.beginPath();
  context.moveTo(corners[0].x, corners[0].y);
  context.lineTo(corners[3].x, corners[3].y);
  context.lineTo(roof[3].x, roof[3].y);
  context.lineTo(roof[0].x, roof[0].y);
  context.closePath();
  context.fill();
  context.fillStyle = building.color;
  context.beginPath();
  context.moveTo(roof[0].x, roof[0].y);
  roof.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.closePath();
  context.fill();
  context.strokeStyle = "rgba(248, 242, 211, .34)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(roof[0].x, roof[0].y);
  roof.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.closePath();
  context.stroke();
  const roofCenter = roof.reduce((center, point) => ({
    x: center.x + point.x / roof.length,
    y: center.y + point.y / roof.length,
  }), { x: 0, y: 0 });
  context.fillStyle = "rgba(35, 54, 41, .83)";
  context.font = `500 ${clamp(8 * corners[0].scale, 5, 9)}px 'DM Mono', monospace`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(building.label, roofCenter.x, roofCenter.y, Math.hypot(roof[1].x - roof[0].x, roof[1].y - roof[0].y) * .8);
  context.fillStyle = "#405748";
  for (let index = 1; index <= 3; index += 1) {
    const ratio = index / 4;
    const leftX = lerp(corners[3].x, corners[2].x, ratio);
    const leftY = lerp(corners[3].y, corners[2].y, ratio);
    const rightX = lerp(roof[3].x, roof[2].x, ratio);
    const rightY = lerp(roof[3].y, roof[2].y, ratio);
    const windowHeight = Math.max(2, (leftY - rightY) * .32);
    context.fillRect(leftX - 3, lerp(leftY, rightY, .42), 6, windowHeight);
  }
  context.restore();
}

function drawFountain() {
  const base = projectWorldPoint(FOUNTAIN.x, FOUNTAIN.y);
  if (!base || base.x < -140 || base.x > game.width + 140) return;
  const radius = FOUNTAIN.radius * base.scale;
  context.save();
  context.fillStyle = "rgba(27, 44, 31, .3)";
  context.beginPath();
  context.ellipse(base.x, base.y + radius * .12, radius * 1.65, radius * .58, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#b8b49a";
  context.beginPath();
  context.ellipse(base.x, base.y, radius * 1.55, radius * .58, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#eee2bd";
  context.lineWidth = Math.max(1, base.scale * 5);
  context.stroke();
  context.fillStyle = "#5ba8a1";
  context.beginPath();
  context.ellipse(base.x, base.y - radius * .04, radius * 1.28, radius * .43, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "rgba(219, 250, 231, .75)";
  context.lineWidth = Math.max(1, base.scale * 2);
  context.beginPath();
  context.ellipse(base.x, base.y - radius * .05, radius * .76, radius * .25, 0, Math.PI * .08, Math.PI * .88);
  context.stroke();
  context.fillStyle = "#ded4b6";
  context.beginPath();
  context.ellipse(base.x, base.y - radius * .15, radius * .32, radius * .15, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "rgba(224, 252, 240, .84)";
  context.lineWidth = Math.max(1, base.scale * 2);
  context.beginPath();
  context.moveTo(base.x, base.y - radius * .2);
  context.quadraticCurveTo(base.x - radius * .13, base.y - radius * 1.25, base.x, base.y - radius * 1.85);
  context.quadraticCurveTo(base.x + radius * .12, base.y - radius * 1.25, base.x, base.y - radius * .2);
  context.stroke();
  context.restore();
}

function drawNRGStadium() {
  const center = projectWorldPoint(STADIUM.x + STADIUM.w / 2, STADIUM.y + STADIUM.d / 2);
  if (!center || center.x < -STADIUM.w || center.x > game.width + STADIUM.w) return;
  const scale = clamp(center.scale, 0.28, 1.35);
  const rx = STADIUM.w * scale * 0.49;
  const ry = STADIUM.d * scale * 0.39;
  const height = STADIUM.h * scale;
  context.save();
  context.translate(center.x, center.y);
  context.fillStyle = "rgba(30, 43, 34, .35)";
  context.beginPath();
  context.ellipse(6 * scale, 4 * scale, rx * 1.12, ry * 1.17, 0, 0, Math.PI * 2);
  context.fill();

  const facade = context.createLinearGradient(0, -height * .2, 0, ry * .72);
  facade.addColorStop(0, "#adb6aa");
  facade.addColorStop(1, "#58685d");
  context.fillStyle = facade;
  context.beginPath();
  context.ellipse(0, height * .12, rx, ry, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#e8dcb9";
  context.lineWidth = Math.max(1, scale * 8);
  context.stroke();
  context.fillStyle = "#313e38";
  context.beginPath();
  context.ellipse(0, -height * .04, rx * .88, ry * .87, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#a8b7a5";
  context.beginPath();
  context.ellipse(0, -height * .12, rx * .78, ry * .72, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#385c43";
  context.beginPath();
  context.ellipse(0, -height * .13, rx * .51, ry * .4, 0, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "rgba(242, 244, 216, .8)";
  context.lineWidth = Math.max(1, scale * 2);
  context.beginPath();
  context.ellipse(0, -height * .13, rx * .42, ry * .3, 0, 0, Math.PI * 2);
  context.moveTo(-rx * .48, -height * .13);
  context.lineTo(rx * .48, -height * .13);
  context.stroke();

  const roof = context.createLinearGradient(-rx, -ry, rx, ry);
  roof.addColorStop(0, "#f1e4c4");
  roof.addColorStop(.4, "#c8c4ad");
  roof.addColorStop(1, "#8d9c8d");
  context.fillStyle = roof;
  context.beginPath();
  context.ellipse(0, -height * .26, rx, ry * .79, 0, 0, Math.PI * 2);
  context.ellipse(0, -height * .26, rx * .57, ry * .43, 0, 0, Math.PI * 2, true);
  context.fill("evenodd");
  context.strokeStyle = "#f3e7c7";
  context.lineWidth = Math.max(1, scale * 4);
  context.beginPath();
  context.ellipse(0, -height * .26, rx, ry * .79, 0, 0, Math.PI * 2);
  context.stroke();
  context.strokeStyle = "rgba(91, 107, 95, .72)";
  context.lineWidth = Math.max(1, scale * 2);
  for (let rib = -3; rib <= 3; rib += 1) {
    const offset = rib * rx * .2;
    context.beginPath();
    context.moveTo(offset, -height * .26 - ry * .78);
    context.lineTo(offset * .58, -height * .26 - ry * .38);
    context.stroke();
  }
  context.fillStyle = "#1a2921";
  context.fillRect(-rx * .34, -ry * .68 - height * .26, rx * .68, Math.max(20 * scale, 11));
  context.fillStyle = "#f0d98f";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `700 ${clamp(15 * scale, 8, 20)}px 'DM Mono', monospace`;
  context.fillText("NRG STADIUM", 0, -ry * .68 - height * .26 + Math.max(10 * scale, 6), rx * .64);
  context.restore();
}

function drawSign(district) {
  const base = projectWorldPoint(district.signX, district.signY);
  if (!base || base.x < -170 || base.x > game.width + 170) return;
  const scale = clamp(base.scale, .34, 1.45);
  const boardWidth = clamp(155 * scale, 54, 176);
  const boardHeight = clamp(55 * scale, 23, 52);
  const postHeight = clamp(66 * scale, 20, 70);
  const x = base.x;
  const y = base.y - postHeight;
  context.save();
  context.fillStyle = "rgba(25, 37, 28, .2)";
  context.fillRect(x - boardWidth * .47, base.y - 2, boardWidth * .94, Math.max(2, scale * 3));
  context.fillStyle = "#4b4a39";
  context.fillRect(x - boardWidth * .26, y + boardHeight * .72, Math.max(2, 3 * scale), postHeight * .32);
  context.fillRect(x + boardWidth * .23, y + boardHeight * .72, Math.max(2, 3 * scale), postHeight * .32);
  context.fillStyle = "#17241b";
  context.fillRect(x - boardWidth / 2, y, boardWidth, boardHeight);
  context.strokeStyle = district.color;
  context.lineWidth = Math.max(1, scale * 1.5);
  context.strokeRect(x - boardWidth / 2, y, boardWidth, boardHeight);
  context.fillStyle = district.color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `500 ${clamp(10 * scale, 7, 13)}px 'DM Mono', monospace`;
  context.fillText(`${district.number}  ${district.shortTitle.toUpperCase()}`, x, y + boardHeight * .43, boardWidth - 8);
  context.font = `400 ${clamp(7 * scale, 6, 9)}px 'DM Mono', monospace`;
  context.fillStyle = "#d5dece";
  context.fillText("E  TO EXPLORE", x, y + boardHeight * .74, boardWidth - 8);
  context.restore();
}

function drawRouteSigns() {
  for (const sign of ROUTE_SIGNS) {
    const segment = ROAD_SEGMENTS.find((road) => road.id === sign.roadId);
    if (!segment) continue;
    const destination = districts.find((district) => district.id === segment.id || segment.id.startsWith(`${district.id}-`));
    if (!destination) continue;
    const point = roadPoint(segment, sign.along, sign.side * (DRIVE.roadWidth * .78));
    const base = projectWorldPoint(point.x, point.y);
    if (!base || base.x < -180 || base.x > game.width + 180) continue;
    const scale = clamp(base.scale, .4, 1.35);
    const width = 178 * scale;
    const height = 49 * scale;
    const post = 76 * scale;
    const x = base.x;
    const y = base.y - post;
    context.save();
    context.fillStyle = "#464735";
    context.fillRect(x - width * .36, y + height * .62, 4 * scale, post * .4);
    context.fillRect(x + width * .31, y + height * .62, 4 * scale, post * .4);
    context.fillStyle = "#1a271d";
    context.fillRect(x - width / 2, y, width, height);
    context.strokeStyle = destination.color;
    context.lineWidth = Math.max(1, scale * 1.6);
    context.strokeRect(x - width / 2, y, width, height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = destination.color;
    context.font = `500 ${clamp(9 * scale, 7, 12)}px 'DM Mono', monospace`;
    const arrow = segment.id === "projects" ? "←" : segment.id === "education" ? "↑" : segment.id === "skills" ? "↓" : "→";
    context.fillText(`${destination.number}  ${destination.shortTitle.toUpperCase()} ${arrow}`, x, y + height * .38, width - 10);
    context.fillStyle = "#f3f0df";
    context.font = `400 ${clamp(7 * scale, 6, 9)}px 'DM Mono', monospace`;
    context.fillText(segment.name, x, y + height * .72, width - 10);
    context.restore();
  }
}

function drawBillboardArtwork(exhibit, x, y, width, height) {
  context.save();
  context.fillStyle = `${exhibit.color}26`;
  context.fillRect(x, y, width, height);
  context.strokeStyle = `${exhibit.color}88`;
  context.lineWidth = 1;
  context.strokeRect(x, y, width, height);
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  context.translate(centerX, centerY);
  const unit = Math.min(width, height) / 50;
  context.scale(unit, unit);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = exhibit.color;
  context.fillStyle = exhibit.color;

  switch (exhibit.visual) {
    case "dashboard":
      context.strokeStyle = "rgba(231, 239, 215, .8)";
      context.strokeRect(-20, -15, 40, 30);
      context.fillStyle = exhibit.color;
      context.fillRect(-15, 4, 6, 7);
      context.fillRect(-4, -3, 6, 14);
      context.fillRect(7, -10, 6, 21);
      context.beginPath();
      context.moveTo(-15, -7);
      context.lineTo(-4, -12);
      context.lineTo(5, -8);
      context.lineTo(15, -13);
      context.stroke();
      break;
    case "agent":
      context.beginPath();
      context.arc(0, -8, 7, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(-13, 17);
      context.quadraticCurveTo(-12, 1, 0, 1);
      context.quadraticCurveTo(12, 1, 13, 17);
      context.closePath();
      context.fill();
      context.strokeStyle = "#23352c";
      context.beginPath();
      context.moveTo(-3, -8);
      context.lineTo(0, -6);
      context.lineTo(3, -8);
      context.stroke();
      break;
    case "foodscope":
      context.beginPath();
      context.ellipse(0, 1, 17, 12, -.18, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(-1, 9);
      context.quadraticCurveTo(0, -13, 14, -18);
      context.quadraticCurveTo(15, -4, -1, 9);
      context.fill();
      context.strokeStyle = "#334438";
      context.beginPath();
      context.moveTo(1, 6);
      context.lineTo(10, -10);
      context.stroke();
      break;
    case "finance":
      context.beginPath();
      context.moveTo(-18, 14);
      context.lineTo(-18, -8);
      context.lineTo(-8, -8);
      context.lineTo(-8, 14);
      context.moveTo(-3, 14);
      context.lineTo(-3, -16);
      context.lineTo(7, -16);
      context.lineTo(7, 14);
      context.moveTo(12, 14);
      context.lineTo(12, -1);
      context.lineTo(22, -1);
      context.lineTo(22, 14);
      context.stroke();
      context.beginPath();
      context.moveTo(-18, -18);
      context.lineTo(-2, -22);
      context.lineTo(9, -15);
      context.lineTo(20, -24);
      context.stroke();
      break;
    case "water":
    case "flood":
      context.beginPath();
      context.moveTo(0, -22);
      context.bezierCurveTo(-6, -11, -17, 1, -17, 9);
      context.arc(0, 9, 17, Math.PI, 0);
      context.bezierCurveTo(17, 1, 6, -11, 0, -22);
      context.fill();
      context.strokeStyle = "#294a4a";
      context.beginPath();
      context.moveTo(-9, 8);
      context.quadraticCurveTo(-4, 2, 0, 8);
      context.quadraticCurveTo(5, 14, 10, 7);
      context.stroke();
      break;
    case "robot":
      context.strokeRect(-15, -15, 30, 27);
      context.fillRect(-10, -8, 5, 5);
      context.fillRect(5, -8, 5, 5);
      context.beginPath();
      context.moveTo(-5, 4);
      context.lineTo(5, 4);
      context.moveTo(0, -15);
      context.lineTo(0, -21);
      context.arc(0, -23, 2, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(-9, 12);
      context.lineTo(-12, 19);
      context.moveTo(9, 12);
      context.lineTo(12, 19);
      context.stroke();
      break;
    case "basketball":
      context.beginPath();
      context.arc(0, 0, 20, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#6f482d";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-19, -4);
      context.quadraticCurveTo(0, -12, 19, -4);
      context.moveTo(-19, 5);
      context.quadraticCurveTo(0, 13, 19, 5);
      context.moveTo(-5, -19);
      context.quadraticCurveTo(5, 0, -5, 19);
      context.moveTo(6, -19);
      context.quadraticCurveTo(-6, 0, 6, 19);
      context.stroke();
      break;
    case "world-cup-trophy":
      drawWorldCupTrophy(0, 0, .75);
      break;
    default:
      context.beginPath();
      context.arc(0, 0, 17, 0, Math.PI * 2);
      context.fill();
  }
  context.restore();
}

function drawWorldCupTrophy(x, y, scale = 1) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  const gold = context.createLinearGradient(-16, -22, 15, 22);
  gold.addColorStop(0, "#fff0a2");
  gold.addColorStop(.45, "#d5a83d");
  gold.addColorStop(1, "#94651d");
  context.fillStyle = gold;
  context.strokeStyle = "#ffe8a0";
  context.lineWidth = 1.7;
  context.beginPath();
  context.moveTo(-10, -22);
  context.bezierCurveTo(-19, -29, -18, -9, -5, -4);
  context.lineTo(-4, 8);
  context.quadraticCurveTo(-8, 14, -13, 18);
  context.lineTo(13, 18);
  context.quadraticCurveTo(8, 14, 4, 8);
  context.lineTo(5, -4);
  context.bezierCurveTo(18, -9, 19, -29, 10, -22);
  context.quadraticCurveTo(5, -19, 0, -19);
  context.quadraticCurveTo(-5, -19, -10, -22);
  context.closePath();
  context.fill();
  context.stroke();
  context.fillStyle = "#c19a37";
  context.fillRect(-5, 15, 10, 8);
  context.fillStyle = "#26392f";
  context.fillRect(-12, 22, 24, 6);
  context.fillStyle = "#efe2ae";
  context.beginPath();
  context.arc(0, -12, 4, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawExhibit(exhibit) {
  const basePoint = exhibitWorldPoint(exhibit);
  if (!basePoint) return;
  const base = projectWorldPoint(basePoint.x, basePoint.y);
  if (!base || base.x < -250 || base.x > game.width + 250) return;
  const scale = clamp(base.scale, .48, 1.55);
  const width = 180 * scale;
  const height = 104 * scale;
  const postHeight = 48 * scale;
  const x = base.x;
  const y = base.y - postHeight;
  const artWidth = width * .38;
  const titleFont = clamp(10 * scale, 7, 15);
  const kickerFont = clamp(6.5 * scale, 5, 9);
  context.save();
  context.fillStyle = "rgba(20, 31, 24, .25)";
  context.fillRect(x - width * .4, base.y - 1, width * .8, Math.max(2, scale * 3));
  context.fillStyle = "#4c4a38";
  context.fillRect(x - width * .34, y + height * .7, Math.max(2, 4 * scale), postHeight * .48);
  context.fillRect(x + width * .28, y + height * .7, Math.max(2, 4 * scale), postHeight * .48);
  context.fillStyle = "#18251c";
  context.fillRect(x - width / 2, y, width, height);
  context.fillStyle = exhibit.color;
  context.fillRect(x - width / 2, y, width, Math.max(3, 4 * scale));
  context.strokeStyle = `${exhibit.color}b8`;
  context.lineWidth = Math.max(1, scale);
  context.strokeRect(x - width / 2, y, width, height);
  drawBillboardArtwork(exhibit, x - width / 2 + 7 * scale, y + 11 * scale, artWidth, height - 20 * scale);
  const textX = x - width / 2 + artWidth + 15 * scale;
  const textWidth = width - artWidth - 22 * scale;
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.fillStyle = exhibit.color;
  context.font = `500 ${kickerFont}px 'DM Mono', monospace`;
  context.fillText(exhibit.kicker, textX, y + 20 * scale, textWidth);
  context.fillStyle = "#f4f0df";
  context.font = `600 ${titleFont}px 'DM Sans', sans-serif`;
  context.fillText(exhibit.title, textX, y + 43 * scale, textWidth);
  context.fillStyle = "#b8c5b5";
  context.font = `400 ${kickerFont}px 'DM Mono', monospace`;
  context.fillText("SLOW DOWN · E TO READ", textX, y + 72 * scale, textWidth);
  context.restore();

  if (exhibit.visual === "world-cup-trophy") {
    const trophyPoint = projectWorldPoint(
      basePoint.x,
    basePoint.y + exhibit.side * 58,
    );
    if (trophyPoint) {
      const trophyScale = clamp(trophyPoint.scale * 1.65, .48, 1.8);
      context.save();
      context.fillStyle = "rgba(29, 40, 26, .23)";
      context.beginPath();
      context.ellipse(trophyPoint.x, trophyPoint.y, 19 * trophyScale, 6 * trophyScale, 0, 0, Math.PI * 2);
      context.fill();
      drawWorldCupTrophy(trophyPoint.x, trophyPoint.y - 35 * trophyScale, trophyScale);
      context.restore();
    }
  }
}

function drawDistrict(district) {
  const point = projectWorldPoint(district.x, district.y);
  if (point && point.x > -50 && point.x < game.width + 50) {
    const radius = clamp(point.scale * 14, 3, 24);
    context.fillStyle = `${district.color}50`;
    context.beginPath();
    context.ellipse(point.x, point.y, radius * 1.6, radius * .55, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = district.color;
    context.beginPath();
    context.arc(point.x, point.y - radius, clamp(radius * .38, 2, 6), 0, Math.PI * 2);
    context.fill();
  }
  drawSign(district);
}

function drawCheckpointBeacon(checkpoint) {
  if (!checkpoint) return;
  const point = projectWorldPoint(checkpoint.x, checkpoint.y);
  if (!point || point.x < -90 || point.x > game.width + 90) return;
  const scale = clamp(point.scale, .55, 1.5);
  const radius = clamp(13 * scale, 7, 18);
  const beaconTop = point.y - 62 * scale;
  context.save();
  context.strokeStyle = "rgba(255, 232, 160, .5)";
  context.lineWidth = Math.max(1, scale);
  context.beginPath();
  context.moveTo(point.x, beaconTop);
  context.lineTo(point.x, point.y - radius);
  context.stroke();
  context.fillStyle = "rgba(255, 232, 160, .16)";
  context.beginPath();
  context.arc(point.x, point.y - radius, radius * 1.8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#f4d477";
  context.beginPath();
  context.arc(point.x, point.y - radius, radius, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#243326";
  context.font = `600 ${clamp(10 * scale, 7, 11)}px 'DM Mono', monospace`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(String(game.checkpointIndex + 1).padStart(2, "0"), point.x, point.y - radius);
  context.restore();
}

function drawCarEffects() {
  for (const effect of game.effects) {
    const point = projectWorldPoint(effect.x, effect.y);
    if (!point) continue;
    context.save();
    context.globalAlpha = clamp(effect.life / 0.65, 0, 0.52);
    context.fillStyle = "#e0e0d2";
    context.beginPath();
    context.ellipse(point.x, point.y, effect.radius * point.scale * 3, effect.radius * point.scale * 1.4, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

function drawPlayerCar() {
  const width = clamp(game.width * .052, 39, 70);
  const length = width * 1.72;
  const x = game.width / 2;
  const y = game.height * .82;
  context.save();
  context.translate(x, y);
  context.rotate(-game.car.visualSteer * .045 + game.car.driftAngle * .18);
  context.fillStyle = "rgba(16, 25, 19, .35)";
  context.beginPath();
  context.ellipse(3, length * .2, width * .63, length * .55, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#222d27";
  context.beginPath();
  context.moveTo(-width * .47, -length * .23);
  context.lineTo(-width * .53, -length * .07);
  context.lineTo(-width * .53, length * .31);
  context.lineTo(-width * .4, length * .4);
  context.lineTo(width * .4, length * .4);
  context.lineTo(width * .53, length * .31);
  context.lineTo(width * .53, -length * .07);
  context.lineTo(width * .47, -length * .23);
  context.closePath();
  context.fill();
  context.fillStyle = "#d9ed9f";
  context.beginPath();
  context.moveTo(-width * .39, -length * .3);
  context.lineTo(-width * .33, -length * .52);
  context.quadraticCurveTo(0, -length * .62, width * .33, -length * .52);
  context.lineTo(width * .39, -length * .3);
  context.lineTo(width * .48, length * .27);
  context.quadraticCurveTo(0, length * .43, -width * .48, length * .27);
  context.closePath();
  context.fill();
  context.fillStyle = "#354a3f";
  context.beginPath();
  context.moveTo(-width * .3, -length * .31);
  context.lineTo(-width * .24, -length * .49);
  context.quadraticCurveTo(0, -length * .55, width * .24, -length * .49);
  context.lineTo(width * .3, -length * .31);
  context.closePath();
  context.fill();
  context.fillStyle = "#748c78";
  context.beginPath();
  context.moveTo(-width * .28, -length * .24);
  context.lineTo(width * .28, -length * .24);
  context.lineTo(width * .34, length * .08);
  context.lineTo(-width * .34, length * .08);
  context.closePath();
  context.fill();
  context.fillStyle = game.car.braking ? "#ff7668" : "#b75b50";
  context.fillRect(-width * .42, length * .27, width * .2, length * .09);
  context.fillRect(width * .22, length * .27, width * .2, length * .09);
  if (game.car.boosting) {
    const flameLength = 0.5 + Math.sin(performance.now() * 0.025) * 0.06;
    context.fillStyle = "#f4d477";
    context.beginPath();
    context.moveTo(-width * .3, length * .34);
    context.lineTo(-width * .2, length * .34);
    context.lineTo(-width * .25, length * flameLength);
    context.closePath();
    context.fill();
    context.beginPath();
    context.moveTo(width * .2, length * .34);
    context.lineTo(width * .3, length * .34);
    context.lineTo(width * .25, length * flameLength);
    context.closePath();
    context.fill();
  }
  context.fillStyle = "#f2e4b8";
  context.fillRect(-width * .38, -length * .5, width * .14, length * .045);
  context.fillRect(width * .24, -length * .5, width * .14, length * .045);
  game.earnedStickers.forEach((id, index) => {
    const sticker = STICKERS.find((item) => item.id === id);
    if (!sticker) return;
    const column = index % 3;
    const row = Math.floor(index / 3);
    const stickerWidth = width * .19;
    const stickerHeight = length * .075;
    const stickerX = (column - 1) * width * .22;
    const stickerY = length * (.045 + row * .095);
    context.fillStyle = sticker.color;
    context.fillRect(stickerX - stickerWidth / 2, stickerY, stickerWidth, stickerHeight);
    context.strokeStyle = "#26352a";
    context.lineWidth = 0.7;
    context.strokeRect(stickerX - stickerWidth / 2, stickerY, stickerWidth, stickerHeight);
    if (sticker.trophy) {
      drawWorldCupTrophy(stickerX, stickerY + stickerHeight * .42, stickerHeight / 32);
    } else {
      context.fillStyle = "#203026";
      context.font = `700 ${clamp(stickerHeight * .8, 3, 5)}px 'DM Mono', monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(sticker.mark, stickerX, stickerY + stickerHeight * .52, stickerWidth);
    }
  });
  context.restore();
}

function render() {
  if (!context || !game.width || !game.height) return;
  prepareProjection();
  context.setTransform(game.pixelRatio, 0, 0, game.pixelRatio, 0, 0);
  context.clearRect(0, 0, game.width, game.height);
  drawWorld();
}

function frame(timestamp) {
  if (!game.running) return;
  if (document.hidden) {
    game.lastFrame = 0;
    clearInput();
    requestAnimationFrame(frame);
    return;
  }
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
    const boostPercent = Math.round(game.boostCharge);
    document.querySelector("#boostValue").textContent = `${boostPercent}%`;
    document.querySelector("#boostFill").style.width = `${boostPercent}%`;
    document.querySelector("#boostFill").classList.toggle("is-depleted", boostPercent === 0);
    const nearestDistrict = districts.map((district) => ({ district, range: distance(game.car, district) })).sort((a, b) => a.range - b.range)[0];
    game.district = nearestDistrict.range < DRIVE.interactionExitRadius * 1.7 ? nearestDistrict.district : null;
    document.querySelector("#currentDistrict").textContent = game.district?.shortTitle.toUpperCase() ?? "WELCOME PLAZA";
    document.querySelector("#drivingStatus").textContent = game.district ? `EXPLORING ${game.district.shortTitle.toUpperCase()}` : "CRUISING PORTFOLIO DRIVE";
    updateCheckpointNavigation();
  }
  if (!driveView.hidden && game.driving && !game.dialogOpen) render();
  requestAnimationFrame(frame);
}

function startLoop() {
  if (game.running) return;
  game.running = true;
  requestAnimationFrame(frame);
}

function setDriving(active) {
  game.driving = active;
  driveView.classList.toggle("is-driving", active);
  mapLegend.hidden = active;
  welcomeCard.hidden = active;
  driveHud.hidden = !active;
  driveHelp.hidden = !active;
  updateTouchControls();
  updateStickerShelf();
  updateCheckpointNavigation();
  if (active) {
    window.scrollTo({ top: 0, behavior: "auto" });
    game.lastFrame = 0;
    document.querySelector("#resetCar").focus({ preventScroll: true });
    announce(isMobile.matches
      ? "Driving started. Use the on-screen controls. Boost while moving; hold drift and steer."
      : "Driving started. Use WASD to drive, Shift to boost, and Space plus steering to drift.");
  }
}

function updateTouchControls() {
  const controls = document.querySelector("#touchControls");
  controls.hidden = !isMobile.matches || !game.driving;
  document.querySelector(".welcome-copy").textContent = isMobile.matches
    ? "Explore five career stops. Use touch controls to steer, boost, and drift."
    : "Explore five career stops. Hold Shift to boost, or Space + steer to drift.";
}

function handleKeyDown(event) {
  if (isEditableTarget(event.target)) return;
  const key = event.key.toLowerCase();
  const drivingKeys = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift", " "];
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
  updateTouchControls();
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
    updateTouchControls();
  });
}

function goToPortfolioSection(sectionId) {
  const valid = document.getElementById(sectionId);
  if (!valid || valid === driveView) return;
  if (game.dialogOpen) closeDialog(true);
  showPortfolio(sectionId);
  history.pushState({ portfolioDrive: true }, "", `#${sectionId}`);
  const heading = valid.querySelector("h1, h2");
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
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
  if (hash.startsWith("experience/")) {
    const experienceId = hash.slice("experience/".length);
    showPortfolio(false);
    openExperienceItem(experienceId, hash);
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
  document.querySelector(".skip-link").addEventListener("click", (event) => {
    event.preventDefault();
    goToPortfolioSection("about");
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
  const storedCheckpoints = safeStorage.get(CHECKPOINT_STORAGE_KEY);
  if (storedCheckpoints) {
    storedCheckpoints.split(",")
      .filter((id) => CHECKPOINT_ORDER.includes(id))
      .forEach((id) => game.completedCheckpoints.add(id));
  }
  const storedStickers = safeStorage.get(STICKER_STORAGE_KEY);
  if (storedStickers) {
    const validStickerIds = new Set(STICKERS.map((sticker) => sticker.id));
    storedStickers.split(",")
      .filter((id) => validStickerIds.has(id))
      .forEach((id) => game.earnedStickers.add(id));
  }
  if (game.completedCheckpoints.has("experience")) game.earnedStickers.add("togetherwork");
  ["education", "projects", "skills", "contact"].forEach((id) => {
    if (game.completedCheckpoints.has(id)) game.earnedStickers.add(id);
  });
  if (game.earnedStickers.size) safeStorage.set(STICKER_STORAGE_KEY, [...game.earnedStickers].join(","));
  getNextCheckpoint();
  hydratePortfolioCopy();
  configureTouchControls();
  installEvents();
  updateStickerShelf();
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
