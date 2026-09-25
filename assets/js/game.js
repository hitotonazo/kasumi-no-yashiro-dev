(() => {
  "use strict";

  const STORAGE_KEY = "hanasumi_arg_state_v1";
  const PAGE_GUARDS = {
    "record-fragment": "fragment",
    "record-longterm": "longterm",
    "support-selection": "selection",
    truth: "truth"
  };

  const makeState = (level = "PHASE0") => {
    const levels = {
      PHASE0: { phase: 0, discovered: [false, false, false], unlocked: [false, false, false, false] },
      PHASE1: { phase: 1, discovered: [true, false, false], unlocked: [true, false, false, false] },
      PHASE2: { phase: 2, discovered: [true, true, false], unlocked: [true, true, false, false] },
      PHASE3: { phase: 3, discovered: [true, true, true], unlocked: [true, true, true, false] },
      Truth: { phase: 3, discovered: [true, true, true], unlocked: [true, true, true, true] }
    };
    const source = levels[level] || levels.PHASE0;
    return {
      version: 1,
      phase: source.phase,
      discovered: {
        phase1: source.discovered[0],
        phase2: source.discovered[1],
        phase3: source.discovered[2]
      },
      unlocked: {
        fragment: source.unlocked[0],
        longterm: source.unlocked[1],
        selection: source.unlocked[2],
        truth: source.unlocked[3]
      }
    };
  };

  const sameState = (left, right) => JSON.stringify(left) === JSON.stringify(right);
  const normalizeState = (value) => {
    if (!value || typeof value !== "object" || value.version !== 1) return makeState();
    const booleans = [
      value.discovered?.phase1, value.discovered?.phase2, value.discovered?.phase3,
      value.unlocked?.fragment, value.unlocked?.longterm,
      value.unlocked?.selection, value.unlocked?.truth
    ];
    if (!Number.isInteger(value.phase) || value.phase < 0 || value.phase > 3 || booleans.some((item) => typeof item !== "boolean")) {
      return makeState();
    }
    const candidate = {
      version: 1,
      phase: value.phase,
      discovered: {
        phase1: value.discovered.phase1,
        phase2: value.discovered.phase2,
        phase3: value.discovered.phase3
      },
      unlocked: {
        fragment: value.unlocked.fragment,
        longterm: value.unlocked.longterm,
        selection: value.unlocked.selection,
        truth: value.unlocked.truth
      }
    };
    const validStates = [makeState("PHASE0"), makeState("PHASE1"), makeState("PHASE2"), makeState("PHASE3"), makeState("Truth")];
    return validStates.some((state) => sameState(candidate, state)) ? candidate : makeState();
  };

  const readState = () => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored === null ? makeState() : normalizeState(JSON.parse(stored));
    } catch {
      return makeState();
    }
  };
  const saveState = (state) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
    } catch {
      // 保存できない環境でも閲覧中のstateは維持する。
    }
  };
  const resetState = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // 保存領域へアクセスできない場合は遷移のみ行う。
    }
  };

  const loadScript = (src) => new Promise((resolve, reject) => {
    const existing = [...document.scripts].find((script) => script.getAttribute("src")?.startsWith(src));
    if (existing && (src.includes("site-alteration.js") ? window.SiteAlteration : window.SiteAlterationDebug)) {
      resolve();
      return;
    }
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.append(script);
  });

  const moduleAdapter = {
    playSiteModified() {
      if (!window.SiteAlteration?.play) return Promise.resolve(true);
      if (window.SiteAlteration.isPlaying()) return Promise.resolve(false);
      return window.SiteAlteration.play({ message: "サイトが改変されました" });
    },
    resetModuleState() {
      // 現在のmodulesにはreset APIが存在しない。
    },
    async connectDebug(getState, setDebugState) {
      let enabled = new URLSearchParams(window.location.search).get("debug") === "1";
      try {
        enabled ||= window.sessionStorage.getItem("hanasumiArgDebug") === "true";
      } catch {
        // sessionStorageが利用できない場合はURL指定だけを使う。
      }
      if (!enabled) return;
      if (!document.querySelector('link[href^="modules/site-alteration/site-alteration.css"]')) {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = "modules/site-alteration/site-alteration.css";
        document.head.append(stylesheet);
      }
      if (!window.SiteAlteration) await loadScript("modules/site-alteration/site-alteration.js");
      if (!window.SiteAlterationDebug) await loadScript("modules/site-alteration/debug-panel.js");
      const debug = window.SiteAlterationDebug.init({
        storagePrefix: "hanasumiArg",
        state: {
          phases: ["PHASE0", "PHASE1", "PHASE2", "PHASE3", "Truth"],
          getPhase: () => getState().unlocked.truth ? "Truth" : `PHASE${getState().phase}`,
          getDetails: () => {
            const state = getState();
            return {
              phase: state.phase,
              discovered: `${Number(state.discovered.phase1)}${Number(state.discovered.phase2)}${Number(state.discovered.phase3)}`,
              unlocked: `${Number(state.unlocked.fragment)}${Number(state.unlocked.longterm)}${Number(state.unlocked.selection)}${Number(state.unlocked.truth)}`
            };
          },
          setPhase: setDebugState
        }
      });
      debug.show();
    }
  };

  let state = readState();
  let initialized = false;
  let transitionLocked = false;

  const navigate = (destination) => window.location.assign(destination);
  const discover = async (phase, destination) => {
    if (transitionLocked) return;
    const key = `phase${phase}`;
    if (state.discovered[key]) {
      navigate(destination);
      return;
    }
    transitionLocked = true;
    state = makeState(`PHASE${phase}`);
    saveState(state);
    await moduleAdapter.playSiteModified();
    navigate(destination);
  };

  const guardPage = () => {
    const page = document.body?.dataset.page;
    const unlockKey = PAGE_GUARDS[page];
    if (!unlockKey || state.unlocked[unlockKey]) return true;
    window.location.replace("index.html");
    return false;
  };

  const connectReset = () => {
    document.querySelectorAll("[data-exploration-reset]").forEach((button) => {
      if (button.dataset.gameResetBound === "true") return;
      button.dataset.gameResetBound = "true";
      button.addEventListener("click", () => {
        if (!window.confirm("探索状況をリセットしますか？")) return;
        resetState();
        state = makeState();
        moduleAdapter.resetModuleState();
        navigate("index.html");
      });
    });
  };

  const connectTruthUnlock = () => {
    const trigger = document.querySelector('[data-truth-trigger], a[href="truth.html"]');
    if (!trigger || trigger.dataset.gameTruthBound === "true") return;
    trigger.dataset.gameTruthBound = "true";
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      if (transitionLocked) return;
      transitionLocked = true;
      state = makeState("Truth");
      saveState(state);
      navigate("truth.html");
    });
  };

  const connectPage = () => {
    const page = document.body?.dataset.page;
    const visuals = window.HanasumiVisuals;
    if (page === "news-keiroukai") {
      visuals?.initNewsAnomaly({ onActivate: () => discover(1, "record-fragment.html") });
    } else if (page === "care" && state.discovered.phase1) {
      visuals?.initCareAnomaly({ discovered: state.discovered.phase2, onActivate: () => discover(2, "record-longterm.html") });
    } else if (page === "support" && state.discovered.phase2) {
      visuals?.initSupportAnomaly({ discovered: state.discovered.phase3, onActivate: () => discover(3, "support-selection.html") });
    } else if (page === "support-selection") {
      connectTruthUnlock();
    }
  };

  const setDebugState = (level) => {
    const allowed = ["PHASE0", "PHASE1", "PHASE2", "PHASE3", "Truth"];
    if (!allowed.includes(level)) return;
    state = makeState(level);
    saveState(state);
    window.location.reload();
  };

  const init = () => {
    if (initialized) return;
    initialized = true;
    state = readState();
    saveState(state);
    if (!guardPage()) return;
    connectReset();
    connectPage();
    moduleAdapter.connectDebug(() => state, setDebugState).catch(() => {});
  };

  init();
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) window.location.reload();
  });
})();
