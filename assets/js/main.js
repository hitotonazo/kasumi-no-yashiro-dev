(() => {
  "use strict";

  const initMenu = () => {
    const menuButton = document.querySelector("[data-menu-button]");
    const menu = document.querySelector("[data-menu]");
    if (!menuButton || !menu) return;

    const setMenu = (open, { restoreFocus = false } = {}) => {
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("is-menu-open", open);
      if (restoreFocus) menuButton.focus();
    };

    menuButton.addEventListener("click", () => {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false, { restoreFocus: true });
      }
    });
    window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
      if (event.matches) setMenu(false);
    });
  };

  const initHero = () => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;

    const slides = [...hero.querySelectorAll("[data-hero-slide]")];
    const dots = [...hero.querySelectorAll("[data-hero-dot]")];
    const previousButton = hero.querySelector("[data-hero-prev]");
    const nextButton = hero.querySelector("[data-hero-next]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = 0;
    let timer = null;

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === current;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === current;
        dot.classList.toggle("is-active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };

    const stop = () => {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
    };
    const start = () => {
      stop();
      if (!reduceMotion.matches) timer = window.setInterval(() => show(current + 1), 5500);
    };
    const select = (index) => {
      show(index);
      start();
    };

    previousButton?.addEventListener("click", () => select(current - 1));
    nextButton?.addEventListener("click", () => select(current + 1));
    dots.forEach((dot) => dot.addEventListener("click", () => select(Number(dot.dataset.heroDot))));
    reduceMotion.addEventListener("change", start);
    document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
    show(0);
    start();
  };

  const initResearchSample = () => {
    const trigger = document.querySelector("[data-sample-trigger]");
    const description = document.querySelector("[data-sample-description]");
    if (!trigger || !description) return;

    trigger.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") !== "true";
      trigger.setAttribute("aria-expanded", String(open));
      trigger.classList.toggle("is-open", open);
      description.hidden = !open;
      const label = trigger.querySelector("span");
      if (label) label.textContent = open ? "試料記録：開示済" : "試料記録";
    });
  };

  const activateSurface = (element, onActivate, label) => {
    if (element.dataset.anomalyBound === "true") return;
    element.dataset.anomalyBound = "true";
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    if (label) element.setAttribute("aria-label", label);
    element.addEventListener("click", onActivate);
    element.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onActivate();
    });
  };

  const initNewsAnomaly = ({ onActivate } = {}) => {
    const anomaly = document.querySelector("[data-news-anomaly]");
    if (!anomaly || anomaly.dataset.anomalyInitialized === "true") return;
    const trigger = anomaly.querySelector("[data-news-anomaly-trigger]");
    const normal = anomaly.querySelector("[data-news-normal]");
    const mri = anomaly.querySelector("[data-news-mri]");
    if (!trigger || !normal || !mri) return;
    anomaly.dataset.anomalyInitialized = "true";
    let mriVisible = false;
    let timer = null;
    const setInteractive = (active) => {
      if (active) {
        trigger.setAttribute("role", "button");
        trigger.setAttribute("tabindex", "0");
        trigger.setAttribute("aria-label", "MRI・CT記録を開く");
      } else {
        trigger.removeAttribute("role");
        trigger.removeAttribute("tabindex");
        trigger.setAttribute("aria-label", "敬老会の記録写真");
      }
    };
    const showMri = () => {
      anomaly.classList.add("is-noisy");
      window.setTimeout(() => {
        anomaly.classList.remove("is-noisy");
        anomaly.classList.add("is-mri");
        normal.classList.remove("is-active");
        normal.setAttribute("aria-hidden", "true");
        mri.classList.add("is-active");
        mri.removeAttribute("aria-hidden");
        mriVisible = true;
        setInteractive(true);
        timer = window.setTimeout(hideMri, 2500);
      }, 250);
    };
    const hideMri = () => {
      anomaly.classList.add("is-noisy");
      mriVisible = false;
      setInteractive(false);
      window.setTimeout(() => {
        anomaly.classList.remove("is-noisy", "is-mri");
        mri.classList.remove("is-active");
        mri.setAttribute("aria-hidden", "true");
        normal.classList.add("is-active");
        normal.removeAttribute("aria-hidden");
        timer = window.setTimeout(showMri, 4500);
      }, 250);
    };
    const openRecord = () => {
      if (mriVisible && typeof onActivate === "function") onActivate();
    };
    trigger.addEventListener("click", openRecord);
    trigger.addEventListener("keydown", (event) => {
      if (!mriVisible || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      openRecord();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && timer !== null) window.clearTimeout(timer);
    });
    timer = window.setTimeout(showMri, 3500);
  };

  const initCareAnomaly = ({ discovered = false, onActivate } = {}) => {
    const section = document.querySelector("[data-care-anomaly]");
    if (!section || section.dataset.anomalyInitialized === "true") return;
    section.dataset.anomalyInitialized = "true";
    const records = [...section.querySelectorAll("[data-care-record]")];
    let started = false;

    const revealRecord = (record) => {
      const content = record.querySelector("p");
      if (!content || record.classList.contains("is-altered")) return;
      record.classList.add("is-altered");
      if (record.dataset.careRecord === "marker") {
        content.textContent = "";
        const marker = document.createElement("span");
        marker.className = "care-timeline__marker";
        marker.textContent = "████████████████";
        activateSurface(marker, onActivate, "非公開記録を開く");
        content.append(marker);
      } else {
        content.textContent = record.dataset.careRecord;
      }
    };
    const reveal = (immediate = false) => {
      if (started) return;
      started = true;
      records.forEach((record, index) => {
        if (immediate) revealRecord(record);
        else window.setTimeout(() => revealRecord(record), index * 600);
      });
    };

    if (discovered) {
      reveal(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      reveal();
    }, { threshold: 0.2 });
    observer.observe(section);
  };

  const initSupportAnomaly = ({ discovered = false, onActivate } = {}) => {
    const anomaly = document.querySelector("[data-support-anomaly]");
    if (!anomaly || anomaly.dataset.anomalyInitialized === "true") return;
    const section = anomaly.closest(".support-photo") || anomaly;
    const trigger = anomaly.querySelector("[data-support-anomaly-trigger]");
    const scores = [...anomaly.querySelectorAll("[data-support-score]")];
    if (!trigger || !scores.length) return;
    anomaly.dataset.anomalyInitialized = "true";

    let started = false;
    const start = (immediate = false) => {
      if (started) return;
      started = true;
      scores.forEach((score, index) => {
        const show = () => {
          score.classList.add("is-visible");
          if (index === 0) {
            anomaly.classList.add("is-active");
            activateSurface(trigger, onActivate, "適合度記録を開く");
          }
          if (index === scores.length - 1) anomaly.classList.add("is-complete");
        };
        if (immediate) show();
        else window.setTimeout(show, 3000 + index * 2500);
      });
    };

    if (discovered) {
      start(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      start();
    }, { threshold: 0.2 });
    observer.observe(section);
  };

  const initTruthShare = () => {
    const shareButton = document.querySelector("[data-truth-share]");
    if (!shareButton) return;

    const shareText = `介護付有料老人ホーム「花澄の杜」を調査しました。
「その人らしい毎日を、いつまでも。」

#おかしなサイト
https://x.com/ARG_ObserverX`;

    shareButton.addEventListener("click", () => {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      const shareWindow = window.open(shareUrl, "_blank", "noopener,noreferrer");
      if (shareWindow) shareWindow.opener = null;
    });
  };

  initMenu();
  initHero();
  initResearchSample();
  initTruthShare();
  window.HanasumiVisuals = { initNewsAnomaly, initCareAnomaly, initSupportAnomaly };
})();
