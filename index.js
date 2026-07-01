/**
 * Taj Holding Group - Premium Interactive Landing Page Script
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const canvas = document.getElementById("bg-canvas");
    const mouseGlow = document.getElementById("mouse-glow");
    const themeToggle = document.getElementById("theme-toggle");
    const langToggle = document.getElementById("lang-toggle");
    const langLabel = document.getElementById("lang-label");
    const logoBox = document.querySelector(".logo-box");
    const embossedLogo = document.querySelector(".embossed-logo");
    
    // Dialog Menu Elements
    const menuDialog = document.getElementById("menu-dialog");
    const menuToggle = document.getElementById("menu-toggle");
    const menuClose = document.getElementById("menu-close");
    const dialogLinks = document.querySelectorAll(".dialog-link");

    // --- State Variables ---
    let currentLang = "en";
    let isLightMode = true;
    if (themeToggle) {
        themeToggle.classList.add("active");
    }
    let mouse = { x: 0, y: 0, active: false };

    // --- Three.js WebGL Setup ---
    if (canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Generate the high-resolution bump map canvas dynamically
        const generateBumpCanvas = () => {
            const bumpCanvas = document.createElement('canvas');
            bumpCanvas.width = 2048;
            bumpCanvas.height = 2048;
            const bctx = bumpCanvas.getContext('2d');
            
            // 1. Fill base neutral grey
            bctx.fillStyle = '#808080';
            bctx.fillRect(0, 0, 2048, 2048);
            
            // 2. High-density horizontal micro-grain lines for concrete/plaster bump texture (very soft)
            for (let i = 0; i < 2500; i++) {
                const y = Math.random() * 2048;
                const h = Math.random() * 1.0 + 0.2;
                const isLight = Math.random() > 0.5;
                bctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.015)';
                bctx.fillRect(0, y, 2048, h);
            }
            
            // 3. Draw 144 radiating grooves
            const cx = 1024, cy = 1024;
            const numLines = 144;
            const innerGap = 220; // Expanded to clear the logo nicely
            const outerRadius = 1400;
            
            for (let i = 0; i < numLines; i++) {
                const angle = (i / numLines) * Math.PI * 2;
                const startX = cx + Math.cos(angle) * innerGap;
                const startY = cy + Math.sin(angle) * innerGap;
                const endX = cx + Math.cos(angle) * outerRadius;
                const endY = cy + Math.sin(angle) * outerRadius;
                
                // Dark groove (recessed slot)
                bctx.strokeStyle = '#4e4e4e';
                bctx.lineWidth = 4.5;
                bctx.beginPath();
                bctx.moveTo(startX, startY);
                bctx.lineTo(endX, endY);
                bctx.stroke();
                
                // Highlight edge (raised edge catch)
                bctx.strokeStyle = '#aeaeae';
                bctx.lineWidth = 1.8;
                bctx.beginPath();
                bctx.moveTo(startX + 1.2, startY + 1.2);
                bctx.lineTo(endX + 1.2, endY + 1.2);
                bctx.stroke();
            }
            
            // 4. Soft mask: smooth back to flat grey at center and corners
            const coverGrad = bctx.createRadialGradient(cx, cy, 215, cx, cy, 750);
            coverGrad.addColorStop(0, 'rgba(128,128,128,1)');
            coverGrad.addColorStop(0.12, 'rgba(128,128,128,1)');
            coverGrad.addColorStop(0.22, 'rgba(128,128,128,0)');
            coverGrad.addColorStop(0.68, 'rgba(128,128,128,0)');
            coverGrad.addColorStop(0.85, 'rgba(128,128,128,1)');
            coverGrad.addColorStop(1, 'rgba(128,128,128,1)');
            
            bctx.fillStyle = coverGrad;
            bctx.fillRect(0, 0, 2048, 2048);
            
            return bumpCanvas;
        };

        const bumpCanvas = generateBumpCanvas();
        const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
        bumpTexture.wrapS = THREE.RepeatWrapping;
        bumpTexture.wrapT = THREE.RepeatWrapping;

        const stoneColor = isLightMode ? 0xdddfdf : 0x0f1010;
        const stoneMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(stoneColor),
            roughness: 0.88,
            metalness: 0.05,
            bumpMap: bumpTexture,
            bumpScale: 0.015 // Softer physical bump mapping prevents black grid artifacts
        });

        // Set up the responsive stone plane mesh (perfect square prevents aspect-ratio stretching)
        let planeGeometry = new THREE.PlaneGeometry(1, 1);
        const planeMesh = new THREE.Mesh(planeGeometry, stoneMaterial);
        scene.add(planeMesh);

        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, isLightMode ? 0.35 : 0.08);
        scene.add(ambientLight);

        // Point Light tracking cursor (specular reflections in chiseled grooves)
        const pointLight = new THREE.PointLight(0xffffff, isLightMode ? 1.6 : 2.0, 15);
        pointLight.position.set(0, 0, 1.8);
        scene.add(pointLight);

        // Spotlight tracking cursor
        const spotlight = new THREE.SpotLight(0xffffff, isLightMode ? 2.5 : 4.0, 20, Math.PI / 3.5, 0.6, 1.2);
        spotlight.position.set(0, 0, 3.5);
        scene.add(spotlight);
        scene.add(spotlight.target);

        // Responsive viewport plane calculation
        const getVisibleSize = (depth) => {
            const cameraOffset = camera.position.z;
            if (depth >= cameraOffset) return { width: 0, height: 0 };
            const vFOV = (camera.fov * Math.PI) / 180;
            const height = 2 * Math.tan(vFOV / 2) * (cameraOffset - depth);
            const width = height * camera.aspect;
            return { width, height };
        };

        const updatePlaneSize = () => {
            const size = getVisibleSize(0);
            if (planeGeometry) planeGeometry.dispose();
            // Square geometry ensures a uniform aspect ratio for the bump map canvas
            const maxSide = Math.max(size.width, size.height) * 1.35;
            planeGeometry = new THREE.PlaneGeometry(maxSide, maxSide);
            if (planeMesh) planeMesh.geometry = planeGeometry;
        };

        const resizeWebGL = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            updatePlaneSize();
        };
        window.addEventListener("resize", resizeWebGL);
        resizeWebGL();

        // Interactive Mouse Move Easing
        let easedMouse = { x: 0, y: 0 };

        const tick = () => {
            const targetX = mouse.active ? (mouse.x / window.innerWidth - 0.5) * 8 : 0;
            const targetY = mouse.active ? -(mouse.y / window.innerHeight - 0.5) * 4.5 : 0;
            
            easedMouse.x += (targetX - easedMouse.x) * 0.06;
            easedMouse.y += (targetY - easedMouse.y) * 0.06;
            
            spotlight.position.x = easedMouse.x;
            spotlight.position.y = easedMouse.y;
            spotlight.target.position.set(easedMouse.x * 0.7, easedMouse.y * 0.7, 0);
            
            pointLight.position.x = easedMouse.x;
            pointLight.position.y = easedMouse.y;
            
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        };
        tick();

        // Mouse events
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
            
            if (mouseGlow) {
                mouseGlow.style.opacity = "1";
                mouseGlow.style.left = `${e.clientX}px`;
                mouseGlow.style.top = `${e.clientY}px`;
            }
        });

        window.addEventListener("mouseleave", () => {
            mouse.active = false;
            if (mouseGlow) {
                mouseGlow.style.opacity = "0";
            }
        });

        // Theme transition logic inside WebGL context
        if (themeToggle) {
            themeToggle.addEventListener("click", () => {
                isLightMode = !isLightMode;
                themeToggle.classList.toggle("active");
                
                const targetColor = isLightMode ? new THREE.Color(0xdadcdc) : new THREE.Color(0x0e0f0f);
                const targetAmbient = isLightMode ? 0.45 : 0.08;
                const targetSpot = isLightMode ? 1.5 : 4.0;
                const targetPoint = isLightMode ? 0.8 : 2.0;
                
                let progress = 0;
                const duration = 40;
                const startColor = stoneMaterial.color.clone();
                const startAmbient = ambientLight.intensity;
                const startSpot = spotlight.intensity;
                const startPoint = pointLight.intensity;
                
                const fadeTheme = () => {
                    progress++;
                    const t = progress / duration;
                    const ease = 1 - Math.pow(1 - t, 3);
                    
                    stoneMaterial.color.lerpColors(startColor, targetColor, ease);
                    ambientLight.intensity = startAmbient + (targetAmbient - startAmbient) * ease;
                    spotlight.intensity = startSpot + (targetSpot - startSpot) * ease;
                    pointLight.intensity = startPoint + (targetPoint - startPoint) * ease;
                    
                    if (progress < duration) {
                        requestAnimationFrame(fadeTheme);
                    }
                };
                fadeTheme();
                
                if (isLightMode) {
                    document.body.classList.remove("dark-theme");
                    document.body.classList.add("light-theme");
                } else {
                    document.body.classList.remove("light-theme");
                    document.body.classList.add("dark-theme");
                }
            });
        }
    }

    // --- Language Translation & RTL Toggle System ---
    const translatePage = (lang) => {
        currentLang = lang;
        const htmlElement = document.documentElement;
        
        if (lang === "ar") {
            htmlElement.setAttribute("dir", "rtl");
            htmlElement.setAttribute("lang", "ar");
            if (langLabel) langLabel.textContent = "EN";
        } else {
            htmlElement.setAttribute("dir", "ltr");
            htmlElement.setAttribute("lang", "en");
            if (langLabel) langLabel.textContent = "AR";
        }

        // Search for data translations
        const translatable = document.querySelectorAll("[data-en]");
        translatable.forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation) {
                el.textContent = translation;
            }
        });
    };

    if (langToggle) {
        langToggle.addEventListener("click", () => {
            const nextLang = currentLang === "en" ? "ar" : "en";
            translatePage(nextLang);
        });
    }

    // --- Navigation Dialog Modal Controls ---
    if (menuToggle && menuDialog) {
        menuToggle.addEventListener("click", () => {
            menuDialog.showModal();
        });
    }

    const closeMenuModal = () => {
        if (!menuDialog) return;
        
        // Add fade out animation helper to backdrop
        menuDialog.classList.add("fade-out");
        
        // Close native dialog
        menuDialog.close();
        menuDialog.classList.remove("fade-out");
    };

    if (menuClose) {
        menuClose.addEventListener("click", closeMenuModal);
    }

    // Light dismiss dialog pattern (click outside content closes it)
    if (menuDialog) {
        menuDialog.addEventListener("click", (e) => {
            const rect = menuDialog.getBoundingClientRect();
            const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                                rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
            
            // Check if user clicked on overlay background rather than links inside
            if (!isInDialog || e.target === menuDialog) {
                closeMenuModal();
            }
        });
    }

    // Set active link and close menu on click
    dialogLinks.forEach(link => {
        link.addEventListener("click", () => {
            dialogLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            closeMenuModal();
        });
    });
});
