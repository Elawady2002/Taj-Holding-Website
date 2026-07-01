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
    let isLightMode = false;
    
    // Mouse tracking variables with easing (lerp)
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    
    // Center point of screen
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;

    // --- Window Resize Handler ---
    const resizeCanvas = () => {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cx = window.innerWidth / 2;
        cy = window.innerHeight / 2;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // --- Canvas Line Animation Logic ---
    const ctx = canvas ? canvas.getContext("2d") : null;
    const numLines = 144; // Premium line density
    let time = 0;
    
    const animateLines = () => {
        if (!canvas || !ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Easing mouse coordinates
        if (mouse.active) {
            mouse.x += (mouse.targetX - mouse.x) * 0.08;
            mouse.y += (mouse.targetY - mouse.y) * 0.08;
        } else {
            // Smoothly ease back to center when mouse leaves
            mouse.x += (cx - mouse.x) * 0.08;
            mouse.y += (cy - mouse.y) * 0.08;
        }
        
        time += 0.003; // Smooth breathing speed
        
        const baseRadius = Math.max(canvas.width, canvas.height) * 0.85;
        const innerGap = window.innerWidth < 768 ? 100 : 160; // Clean area for logo
        
        // Calculated mouse relative coordinates
        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const mouseDist = Math.hypot(dx, dy);
        const mouseAngle = Math.atan2(dy, dx);
        
        // Drawing lines
        for (let i = 0; i < numLines; i++) {
            const angle = (i / numLines) * Math.PI * 2;
            
            // Calculate angular difference to mouse
            let diff = Math.abs(angle - mouseAngle);
            if (diff > Math.PI) diff = Math.PI * 2 - diff;
            
            // Subtle 3D warp bending lines towards mouse cursor
            const proximity = Math.max(0, 1 - mouseDist / 600); // Effect fades with distance
            const angleWarp = Math.sin(angle - mouseAngle) * 0.05 * proximity * Math.max(0, 1 - diff / 1.5);
            const finalAngle = angle - angleWarp;
            
            // Pulse wave calculation
            const wave = Math.sin(time * 2.0 + i * 0.15) * 8;
            
            // Start and end points of lines (leaving a clean space in center)
            const startR = innerGap + Math.cos(time * 3 + i * 0.08) * 4;
            const endR = baseRadius + wave;
            
            const startX = cx + Math.cos(finalAngle) * startR;
            const startY = cy + Math.sin(finalAngle) * startR;
            const endX = cx + Math.cos(finalAngle) * endR;
            const endY = cy + Math.sin(finalAngle) * endR;
            
            // Base opacities for shadow and highlight to look like subtle stone cracks
            const shadowAlpha = isLightMode ? 0.08 : 0.45;
            const highlightAlpha = isLightMode ? 0.45 : 0.06;
            
            const baseWidth = i % 6 === 0 ? 1.2 : 0.6;
            
            // Draw Shadow Stroke (Offset top-left)
            ctx.beginPath();
            ctx.moveTo(startX - 0.5, startY - 0.5);
            ctx.lineTo(endX - 0.5, endY - 0.5);
            ctx.strokeStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
            ctx.lineWidth = baseWidth;
            ctx.stroke();
            
            // Draw Highlight Stroke (Offset bottom-right)
            ctx.beginPath();
            ctx.moveTo(startX + 0.5, startY + 0.5);
            ctx.lineTo(endX + 0.5, endY + 0.5);
            ctx.strokeStyle = `rgba(255, 255, 255, ${highlightAlpha})`;
            ctx.lineWidth = baseWidth;
            ctx.stroke();
        }
        
        requestAnimationFrame(animateLines);
    };
    
    if (canvas && ctx) {
        animateLines();
    }

    // --- Interactive Mouse Movement Events ---
    window.addEventListener("mousemove", (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        mouse.active = true;
        
        // Spotlight Glow Positioning
        if (mouseGlow) {
            mouseGlow.style.opacity = "1";
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        }
        
        // 3D Logo Rotation Card Effect
        if (logoBox && embossedLogo) {
            const rx = -(e.clientY - cy) / cy * 8; // Max 8 degrees pitch
            const ry = (e.clientX - cx) / cx * 8;  // Max 8 degrees yaw
            
            embossedLogo.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
        }
    });

    window.addEventListener("mouseleave", () => {
        mouse.active = false;
        
        if (mouseGlow) {
            mouseGlow.style.opacity = "0";
        }
        
        // Smoothly reset logo box position
        if (embossedLogo) {
            embossedLogo.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
        }
    });

    // --- Theme Toggle System ---
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            isLightMode = !isLightMode;
            
            // Apply theme toggle animation
            themeToggle.classList.toggle("active");
            
            if (isLightMode) {
                document.body.classList.remove("dark-theme");
                document.body.classList.add("light-theme");
            } else {
                document.body.classList.remove("light-theme");
                document.body.classList.add("dark-theme");
            }
        });
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
