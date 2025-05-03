function log(msg) {
  print(`VDOnPrimary: ${msg}`);
}
let busy = false;

function bindWindow(window) {
  if (
    window.specialWindow ||
    (window.normalWindow && window.skipTaskbar) ||
    !window.normalWindow ||
    !window.moveableAcrossScreens
  ) {
    return;
  }
  window.outputChanged.connect(window, updateWindow);
  log(`Window ${window.resourceName}:${window.internalId} has been bound`);
}

function getPrimaryScreen() {
  let primaryOutputName = readConfig("primaryOutputName", "");
  const numberOfScreens = readConfig("numberOfScreens", 2);
  if (workspace.screens.length < numberOfScreens) {
    log("Not all displays are present. Not updating");
    return null;
  }

  if (primaryOutputName === "") {
    const windows = workspace.windowList();
    for (let i = 0; i < windows.length; i++) {
      const w = windows[i];
      if (w.dock) {
        primaryOutputName = w.output.name;
        log(`Discovered primary output name: ${primaryOutputName}`);
        break;
      }
    }
  }

  for (let i = 0; i < workspace.screens.length; i++) {
    const screen = workspace.screens[i];
    log(`screen: ${JSON.stringify(screen)}`);
    if (screen.name === primaryOutputName) {
      return screen;
    }
  }

  console.error(`Primary screen "${primaryOutputName}" not found.`);
  return null;
}

function updateWindow(window) {
  window = window || this;

  if (
    window.specialWindow ||
    (window.normalWindow && window.skipTaskbar) ||
    !window.normalWindow ||
    !window.moveableAcrossScreens
  ) {
    return;
  }

  const primaryScreen = getPrimaryScreen();
  if (primaryScreen == null) {
    return;
  }
  const currentScreen = window.output;

  // noinspection EqualityComparisonWithCoercionJS
  if (currentScreen != primaryScreen) {
    window.onAllDesktops = true;
    log(`Window ${window.resourceName}:${window.internalId} has been pinned`);
  } else if (window.onAllDesktops) {
    window.onAllDesktops = false;
    log(`Window ${window.resourceName}:${window.internalId} has been unpinned`);
  }
}

function bindUpdate(window) {
  bindWindow(window);
  updateWindow(window);
}

function updateAll() {
  if (busy) return;
  busy = true;
  try {
    const primaryScreen = getPrimaryScreen();
    if (primaryScreen == null) {
      return;
    }
    workspace.windowList().forEach(updateWindow);
  } finally {
    busy = false;
  }
}

function update() {
  const timer = new QTimer();
  timer.interval = 100;
  timer.singleShot = true;
  timer.timeout.connect(updateAll);
  timer.start();
}

function main() {
  log("Starting");
  workspace.windowList().forEach(bindWindow);
  update();
  workspace.windowAdded.connect(bindUpdate);
  workspace.screensChanged.connect(update);
  workspace.desktopsChanged.connect(update);
  workspace.desktopLayoutChanged.connect(update);
}

main();
