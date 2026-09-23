document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       COSMIC STARFIELD
       ===================================================== */

    const canvas = document.getElementById("stars");

    if (canvas) {
        const ctx = canvas.getContext("2d");

        let stars = [];
        let width = 0;
        let height = 0;
        let animationFrame;

        const STAR_COUNT = 180;

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;

            const ratio = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = width * ratio;
            canvas.height = height * ratio;

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

            createStars();
        }

        function createStars() {
            stars = [];

            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,

                    radius:
                        Math.random() < 0.85
                            ? Math.random() * 1.2 + 0.2
                            : Math.random() * 2 + 1,

                    speed:
                        Math.random() * 0.18 + 0.025,

                    drift:
                        (Math.random() - 0.5) * 0.08,

                    alpha:
                        Math.random() * 0.7 + 0.2,

                    twinkle:
                        Math.random() * Math.PI * 2,

                    twinkleSpeed:
                        Math.random() * 0.025 + 0.008
                });
            }
        }

        function drawStar(star) {
            star.twinkle += star.twinkleSpeed;

            const pulse =
                0.65 +
                Math.sin(star.twinkle) * 0.35;

            const alpha =
                Math.max(
                    0.05,
                    Math.min(1, star.alpha * pulse)
                );

            ctx.beginPath();

            ctx.arc(
                star.x,
                star.y,
                star.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(210,230,255,${alpha})`;

            ctx.fill();

            /* Tiny glow for brighter stars */

            if (star.radius > 1.4) {
                ctx.beginPath();

                ctx.arc(
                    star.x,
                    star.y,
                    star.radius * 3,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(116,229,255,${alpha * 0.08})`;

                ctx.fill();
            }
        }

        function animateStars() {
            ctx.clearRect(
                0,
                0,
                width,
                height
            );

            for (const star of stars) {

                star.y -= star.speed;
                star.x += star.drift;

                /* Wrap around screen */

                if (star.y < -5) {
                    star.y = height + 5;
                    star.x = Math.random() * width;
                }

                if (star.x < -5) {
                    star.x = width + 5;
                }

                if (star.x > width + 5) {
                    star.x = -5;
                }

                drawStar(star);
            }

            animationFrame =
                requestAnimationFrame(animateStars);
        }

        window.addEventListener(
            "resize",
            resizeCanvas
        );

        resizeCanvas();
        animateStars();

        window.addEventListener(
            "beforeunload",
            () => {
                cancelAnimationFrame(animationFrame);
            }
        );
    }


    /* =====================================================
       CURSOR GLOW
       ===================================================== */

    const cursorGlow =
        document.querySelector(".cursor-glow");

    if (cursorGlow) {

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let glowX = mouseX;
        let glowY = mouseY;

        window.addEventListener(
            "mousemove",
            (event) => {
                mouseX = event.clientX;
                mouseY = event.clientY;
            },
            { passive: true }
        );

        function animateCursor() {

            glowX +=
                (mouseX - glowX) * 0.12;

            glowY +=
                (mouseY - glowY) * 0.12;

            cursorGlow.style.left =
                `${glowX}px`;

            cursorGlow.style.top =
                `${glowY}px`;

            requestAnimationFrame(
                animateCursor
            );
        }

        animateCursor();
    }


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuToggle =
        document.querySelector(".menu-toggle");

    const nav =
        document.querySelector(".nav");

    if (menuToggle && nav) {

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    nav.classList.toggle("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

                document.body.style.overflow =
                    isOpen ? "hidden" : "";
            }
        );

        /* Close menu after clicking link */

        nav.querySelectorAll("a").forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        nav.classList.remove("open");

                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        document.body.style.overflow =
                            "";
                    }
                );
            }
        );

        /* Close with Escape */

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    nav.classList.contains("open")
                ) {

                    nav.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    document.body.style.overflow =
                        "";
                }
            }
        );
    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if (revealElements.length) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        revealElements.forEach(
            (element) => {
                revealObserver.observe(element);
            }
        );
    }


    /* =====================================================
       3D TILT EFFECT
       ===================================================== */

    const tiltElements =
        document.querySelectorAll(".tilt");

    tiltElements.forEach(
        (element) => {

            element.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        element.getBoundingClientRect();

                    const x =
                        event.clientX - rect.left;

                    const y =
                        event.clientY - rect.top;

                    const centerX =
                        rect.width / 2;

                    const centerY =
                        rect.height / 2;

                    const rotateX =
                        ((y - centerY) /
                            centerY) * -4;

                    const rotateY =
                        ((x - centerX) /
                            centerX) * 4;

                    element.style.transform =
                        `perspective(1000px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-3px)`;
                }
            );

            element.addEventListener(
                "mouseleave",
                () => {

                    element.style.transform =
                        "";
                }
            );
        }
    );


    /* =====================================================
       LIGHTBOX
       ===================================================== */

    const lightbox =
        document.querySelector(".lightbox");

    const lightboxImage =
        lightbox?.querySelector("img");

    const lightboxCaption =
        lightbox?.querySelector(
            ".lightbox-caption"
        );

    const lightboxClose =
        lightbox?.querySelector(
            ".lightbox-close"
        );

    const galleryImages =
        document.querySelectorAll(
            ".gallery-item img"
        );

    function openLightbox(image) {

        if (
            !lightbox ||
            !lightboxImage
        ) {
            return;
        }

        lightboxImage.src =
            image.currentSrc ||
            image.src;

        lightboxImage.alt =
            image.alt || "";

        if (lightboxCaption) {

            const caption =
                image.closest(
                    ".gallery-item"
                )?.querySelector(
                    "figcaption"
                );

            lightboxCaption.textContent =
                caption
                    ? caption.textContent.trim()
                    : image.alt || "";
        }

        lightbox.classList.add("open");

        document.body.style.overflow =
            "hidden";
    }

    function closeLightbox() {

        if (!lightbox) {
            return;
        }

        lightbox.classList.remove("open");

        document.body.style.overflow =
            "";
    }

    galleryImages.forEach(
        (image) => {

            image.addEventListener(
                "click",
                () => {
                    openLightbox(image);
                }
            );
        }
    );

    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );
    }

    if (lightbox) {

        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === lightbox
                ) {
                    closeLightbox();
                }
            }
        );
    }

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                lightbox?.classList.contains("open")
            ) {
                closeLightbox();
            }
        }
    );


    /* =====================================================
       NEBULA PARALLAX
       ===================================================== */

    const nebulaA =
        document.querySelector(".nebula-a");

    const nebulaB =
        document.querySelector(".nebula-b");

    const nebulaC =
        document.querySelector(".nebula-c");

    let ticking = false;

    function updateNebula() {

        const scrollY =
            window.scrollY;

        if (nebulaA) {
            nebulaA.style.transform =
                `translate3d(
                    ${scrollY * 0.015}px,
                    ${scrollY * -0.025}px,
                    0
                )`;
        }

        if (nebulaB) {
            nebulaB.style.transform =
                `translate3d(
                    ${scrollY * -0.012}px,
                    ${scrollY * 0.018}px,
                    0
                )`;
        }

        if (nebulaC) {
            nebulaC.style.transform =
                `translate3d(
                    0,
                    ${scrollY * -0.012}px,
                    0
                )`;
        }

        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateNebula
                );

                ticking = true;
            }
        },
        { passive: true }
    );


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const navLinks =
        document.querySelectorAll(
            ".nav a"
        );

    if (navLinks.length) {

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase() ||
            "index.html";

        navLinks.forEach(
            (link) => {

                const href =
                    link.getAttribute("href");

                if (!href) {
                    return;
                }

                const linkPage =
                    href
                        .split("/")
                        .pop()
                        .toLowerCase();

                if (
                    linkPage === currentPage
                ) {
                    link.classList.add(
                        "active"
                    );
                }
            }
        );
    }


    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    const header =
        document.querySelector(
            ".site-header"
        );

    if (header) {

        function updateHeader() {

            if (window.scrollY > 30) {

                header.style.background =
                    "rgba(2,5,15,0.92)";

                header.style.boxShadow =
                    "0 10px 40px rgba(0,0,0,0.22)";

            } else {

                header.style.background =
                    "linear-gradient(180deg, rgba(2,5,15,0.88), rgba(2,5,15,0.16))";

                header.style.boxShadow =
                    "none";
            }
        }

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );

        updateHeader();
    }


    /* =====================================================
       ORBIT HOVER BOOST
       ===================================================== */

    const portrait =
        document.querySelector(
            ".intergalactic-portrait"
        );

    if (portrait) {

        const orbitElements =
            portrait.querySelectorAll(
                ".orbit"
            );

        portrait.addEventListener(
            "mouseenter",
            () => {

                orbitElements.forEach(
                    (orbit) => {
                        orbit.style.filter =
                            "brightness(1.35)";
                    }
                );
            }
        );

        portrait.addEventListener(
            "mouseleave",
            () => {

                orbitElements.forEach(
                    (orbit) => {
                        orbit.style.filter =
                            "";
                    }
                );
            }
        );
    }


    /* =====================================================
       IMAGE ERROR HANDLING
       ===================================================== */

    document
        .querySelectorAll("img")
        .forEach((image) => {

            image.addEventListener(
                "error",
                () => {

                    console.warn(
                        "Image could not be loaded:",
                        image.src
                    );

                    image.classList.add(
                        "image-error"
                    );
                }
            );
        });


    /* =====================================================
       PAGE READY
       ===================================================== */

    document.body.classList.add(
        "page-ready"
    );

});
