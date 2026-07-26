/* =========================================================================
   TRISARA — main.js
   Cursor · Loader · Lenis smooth scroll · GSAP/ScrollTrigger reveals ·
   the marigold "thread" motif · Three.js hero atmosphere · Barba transitions
   ========================================================================= */

(function () {
  "use strict";

  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COARSE_POINTER = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* --------------------------------------------------------- cursor --- */
  function initCursorGlobal() {
    if (COARSE_POINTER || !window.gsap) return;
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });

    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    });
  }

  function bindCursorTargets() {
    if (COARSE_POINTER) return;
    const ring = document.querySelector(".cursor-ring");
    if (!ring) return;
    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.classList.add("is-hover");
        ring.classList.toggle("is-dark", el.dataset.cursor === "dark");
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("is-hover");
        ring.classList.remove("is-dark");
      });
    });
  }

  /* ---------------------------------------------------- smooth scroll -- */
  let lenis;
  function initSmoothScroll() {
    if (REDUCED_MOTION || !window.Lenis || !window.gsap) return;
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: -40 });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }

  /* --------------------------------------------------------------- nav - */
  function initNavScroll() {
    const nav = document.querySelector(".nav");
    if (!nav || !window.ScrollTrigger) return;
    let lastY = window.scrollY;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: () => {
        const y = window.scrollY;
        nav.classList.toggle("is-scrolled", y > 40);
        if (y > lastY && y > 240) nav.classList.add("is-hidden");
        else nav.classList.remove("is-hidden");
        lastY = y;
      },
    });
  }

  function initMobileNav() {
    const toggle = document.querySelector(".nav__toggle");
    const drawer = document.querySelector(".nav-drawer");
    if (!toggle || !drawer) return;
    toggle.addEventListener("click", () => {
      drawer.classList.toggle("is-open");
      toggle.classList.toggle("is-open");
    });
    drawer.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        drawer.classList.remove("is-open");
        toggle.classList.remove("is-open");
      })
    );
  }

  function setActiveNavLink() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__links a, .nav-drawer a").forEach((a) => {
      const href = a.getAttribute("href");
      a.classList.toggle("is-active", href === path);
    });
  }

  /* ------------------------------------------------------- thread motif */
  function initThreads() {
    document.querySelectorAll(".thread path").forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      if (!window.ScrollTrigger) { path.style.strokeDashoffset = 0; return; }
      ScrollTrigger.create({
        trigger: path.closest(".thread"),
        start: "top 88%",
        onEnter: () => gsap.to(path, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }),
        once: true,
      });
    });
    document.querySelectorAll(".thread-underline path").forEach((path) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = 0;
    });
  }

  /* -------------------------------------------------------- reveals --- */
  function initReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 44, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    });

    gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
      const items = group.querySelectorAll("[data-reveal-item]");
      if (!items.length) return;
      gsap.fromTo(
        items,
        { y: 34, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 85%" },
        }
      );
    });
  }

  function playHeroIntro() {
    if (!window.gsap) return;
    const lines = document.querySelectorAll(".hero [data-reveal-line] > span");
    const fades = document.querySelectorAll(".hero [data-reveal-fade]");
    if (lines.length) {
      gsap.set(lines, { yPercent: 120 });
      gsap.to(lines, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.12, delay: 0.1 });
    }
    if (fades.length) {
      gsap.fromTo(
        fades,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.65 }
      );
    }
  }

  /* --------------------------------------------------------- loader --- */
  function initLoader(onDone) {
    const loader = document.querySelector(".loader");
    if (!loader || !window.gsap) { onDone && onDone(); return; }
    const countEl = loader.querySelector(".loader__count-val");
    const path = loader.querySelector(".loader__thread path");
    let len = 0;
    if (path) {
      len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    }
    const progress = { v: 0 };
    gsap.to(progress, {
      v: 100,
      duration: REDUCED_MOTION ? 0.4 : 1.7,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countEl) countEl.textContent = Math.floor(progress.v);
        if (path) path.style.strokeDashoffset = len - (len * progress.v) / 100;
      },
      onComplete: () => {
        gsap.timeline({
          delay: 0.2,
          onComplete: () => {
            loader.style.display = "none";
            onDone && onDone();
          },
        }).to(loader, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" });
      },
    });
  }

  /* ---------------------------------------------- three.js hero dust --- */
  function initHeroParticles() {
    const container = document.querySelector(".hero__particles");
    if (!container || !window.THREE || REDUCED_MOTION || COARSE_POINTER) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 12;

    const COUNT = 200;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      speeds[i] = 0.12 + Math.random() * 0.3;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(220,192,139,0.95)");
    grad.addColorStop(1, "rgba(220,192,139,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(spriteCanvas);

    const mat = new THREE.PointsMaterial({
      size: 0.22,
      map: tex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.7,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    function resize() {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let rafId;
    function tick() {
      const t = clock.getElapsedTime();
      const arr = geo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3 + 1] += speeds[i] * 0.01;
        if (arr[i * 3 + 1] > 8) arr[i * 3 + 1] = -8;
        arr[i * 3] += Math.sin(t * 0.25 + i) * 0.0016;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.y = t * 0.015;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }
    tick();

    document.addEventListener("trisara:teardown-particles", () => cancelAnimationFrame(rafId), { once: true });
  }

  /* ---------------------------------------------------------- reel video */
  function initReelSound() {
    const btn = document.querySelector(".reel__sound");
    const video = document.querySelector(".reel__video");
    if (!btn || !video) return;
    btn.addEventListener("click", () => {
      video.muted = !video.muted;
      btn.querySelector(".icon-mute").style.display = video.muted ? "" : "none";
      btn.querySelector(".icon-unmute").style.display = video.muted ? "none" : "";
      if (!video.muted) video.play().catch(() => {});
    });
  }

  /* ---------------------------------------------------- gallery filter - */
  function initGalleryFilters() {
    const buttons = document.querySelectorAll(".gallery-filters button");
    const items = document.querySelectorAll(".gallery-grid__item");
    if (!buttons.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const f = btn.dataset.filter;
        items.forEach((item) => {
          const show = f === "all" || item.dataset.category === f;
          item.classList.toggle("is-hidden", !show);
        });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      });
    });
  }

  /* -------------------------------------------------- in-page scroll --- */
  function initScrollCues() {
    document.querySelectorAll("[data-scroll-to]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToTarget(el.getAttribute("data-scroll-to"));
      });
    });
  }

  /* ------------------------------------------------------- page init --- */
  function initPage() {
    bindCursorTargets();
    initThreads();
    initReveals();
    initGalleryFilters();
    initReelSound();
    initScrollCues();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  /* ------------------------------------------------------------ barba - */
  function initBarba() {
    if (!window.barba || !window.gsap) return;

    document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"], a[target="_blank"]').forEach((a) => {
      a.setAttribute("data-barba-prevent", "self");
    });

    try {
      barba.init({
        preventRunning: true,
        transitions: [
          {
            name: "thread-wipe",
            leave(data) {
              const tl = gsap.timeline();
              tl.to([".cursor-ring", ".cursor-dot"], { autoAlpha: 0, duration: 0.2 }, 0);
              tl.to(data.current.container, { autoAlpha: 0, y: -18, duration: 0.5, ease: "power2.inOut" }, 0);
              tl.fromTo(
                ".page-transition",
                { scaleY: 0 },
                { scaleY: 1, duration: 0.6, ease: "power3.inOut", transformOrigin: "bottom" },
                0.12
              );
              return tl;
            },
            enter(data) {
              window.scrollTo(0, 0);
              if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
              const tl = gsap.timeline();
              tl.to(
                ".page-transition",
                { scaleY: 0, duration: 0.7, ease: "power3.inOut", transformOrigin: "top" },
                0.05
              );
              tl.fromTo(
                data.next.container,
                { autoAlpha: 0, y: 18 },
                { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
                0.2
              );
              tl.to([".cursor-ring", ".cursor-dot"], { autoAlpha: 1, duration: 0.3 }, 0.5);
              return tl;
            },
          },
        ],
      });

      barba.hooks.after(() => {
        setActiveNavLink();
        initPage();
        document.querySelector(".nav")?.classList.remove("is-hidden");
      });
    } catch (err) {
      /* Barba needs http(s) hosting to fetch pages; fails silently on file:// */
      console.warn("Barba transitions unavailable:", err.message);
    }
  }

  /* -------------------------------------------------------- bootstrap - */
  document.addEventListener("DOMContentLoaded", () => {
    initCursorGlobal();
    initSmoothScroll();
    initNavScroll();
    initMobileNav();
    setActiveNavLink();
    initHeroParticles();
    initPage();
    initBarba();
    initLoader(() => playHeroIntro());
  });
})();
