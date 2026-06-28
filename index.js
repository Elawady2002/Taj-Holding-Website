// Taj Holding Website - Interactive Scripting

const init = () => {
    // --- 1. DOM Elements ---
    const loadingScreen = document.getElementById("loading-screen");
    const mainContent = document.getElementById("main-content");
    const holdButtonArea = document.getElementById("hold-button-area");
    const progressCircle = document.getElementById("progress-circle");
    const holdInstruction = document.getElementById("hold-instruction");
    
    const themeToggle = document.getElementById("theme-toggle");
    const langToggle = document.getElementById("lang-toggle");
    const menuToggle = document.getElementById("menu-toggle");
    const closeMenu = document.getElementById("close-menu");
    const navigationOverlay = document.getElementById("navigation-overlay");
    const heroBgImg = document.getElementById("hero-bg-img");
    const playBtn = document.getElementById("play-story-btn");

    console.log("Taj Holding Script Loaded.");

    // --- Dev/Skip Bypass Check ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("dev") || urlParams.has("skip") || urlParams.has("skipLoading")) {
        console.log("Bypass parameter detected, skipping loading screen.");
        if (loadingScreen) loadingScreen.style.display = "none";
        if (mainContent) mainContent.classList.remove("hidden");
        document.documentElement.classList.add("entered");
        document.body.classList.add("entered");
    }

    // --- 2. State Variables ---
    let currentLang = "en";
    let isLightMode = false;
    let holdTimer = null;
    let holdProgress = 0; // 0 to 100
    let holdStartTime = 0; // track click vs hold duration
    const holdDuration = 1500; // 1.5 seconds to enter
    let lastTime = 0;
    const circleCircumference = 477.52; // 2 * PI * r (76)

    // Set initial progress ring dashoffset
    if (progressCircle) {
        progressCircle.setAttribute("stroke-dashoffset", circleCircumference);
    }

    // --- 3. Click-and-Hold (Press-and-Hold) Interaction ---
    const startHold = (e) => {
        e.preventDefault();
        if (holdTimer) {
            cancelAnimationFrame(holdTimer);
            holdTimer = null;
        }
        if (holdButtonArea) holdButtonArea.classList.add("pressing");
        holdStartTime = performance.now();
        lastTime = performance.now();
        if (holdInstruction) holdInstruction.style.letterSpacing = "0.08em";
        
        const updateHold = () => {
            const now = performance.now();
            const delta = now - lastTime;
            lastTime = now;
            
            holdProgress += (delta / holdDuration) * 100;
            
            if (holdProgress >= 100) {
                holdProgress = 100;
                completeHold();
            } else {
                const offset = circleCircumference - (holdProgress / 100) * circleCircumference;
                if (progressCircle) progressCircle.setAttribute("stroke-dashoffset", offset);
                holdTimer = requestAnimationFrame(updateHold);
            }
        };
        holdTimer = requestAnimationFrame(updateHold);
    };

    const cancelHold = () => {
        if (!holdTimer) return;
        cancelAnimationFrame(holdTimer);
        holdTimer = null;
        if (holdButtonArea) holdButtonArea.classList.remove("pressing");
        
        const resetProgress = () => {
            if (holdProgress > 0) {
                holdProgress -= 5;
                if (holdProgress < 0) holdProgress = 0;
                const offset = circleCircumference - (holdProgress / 100) * circleCircumference;
                if (progressCircle) progressCircle.setAttribute("stroke-dashoffset", offset);
                holdTimer = requestAnimationFrame(resetProgress);
            } else {
                cancelAnimationFrame(holdTimer);
                holdTimer = null;
            }
        };
        holdTimer = requestAnimationFrame(resetProgress);
    };

    const completeHold = () => {
        cancelAnimationFrame(holdTimer);
        holdTimer = null;
        if (progressCircle) progressCircle.setAttribute("stroke-dashoffset", 0);
        
        if (loadingScreen) loadingScreen.classList.add("fade-out");
        if (mainContent) mainContent.classList.remove("hidden");
        document.documentElement.classList.add("entered");
        document.body.classList.add("entered");
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        setTimeout(() => {
            if (loadingScreen) loadingScreen.remove();
        }, 800);
    };

    if (holdButtonArea) {
        holdButtonArea.addEventListener("mousedown", startHold);
        holdButtonArea.addEventListener("touchstart", startHold, { passive: false });
        holdButtonArea.addEventListener("contextmenu", (e) => e.preventDefault());
        window.addEventListener("mouseup", cancelHold);
        window.addEventListener("touchend", cancelHold);
        window.addEventListener("touchcancel", cancelHold);
    }

    // --- 4. Section 1: Statement Scroll Reveal (Node 42:609) ---
    const setupScrollReveal = () => {
        const paragraph = document.getElementById("reveal-paragraph");
        if (!paragraph) return;
        
        const text = paragraph.getAttribute(`data-${currentLang}`) || paragraph.textContent;
        const words = text.trim().split(/\s+/);
        
        paragraph.innerHTML = words.map(w => `<span class="reveal-word">${w}</span>`).join(" ");
        
        const spans = paragraph.querySelectorAll(".reveal-word");
        
        const animateReveal = () => {
            const rect = paragraph.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            const start = viewportHeight * 0.9;
            const end = viewportHeight * 0.25;
            
            const progress = (start - rect.top) / (start - end);
            const cappedProgress = Math.max(0, Math.min(1, progress));
            
            const revealCount = Math.floor(cappedProgress * spans.length);
            spans.forEach((span, idx) => {
                if (idx < revealCount) {
                    span.classList.add("active");
                } else {
                    span.classList.remove("active");
                }
            });
        };
        
        window.removeEventListener("scroll", animateReveal);
        window.addEventListener("scroll", animateReveal);
        animateReveal();
    };

    // --- 5. Section 2: Slideshow System (Node 44:1422) ---
    const slidesData = [
        {
            tagEn: "SECTOR 01",
            tagAr: "القطاع 01",
            titleEn: "Energy & Petroleum.",
            titleAr: "الطاقة والبترول.",
            descEn: "Powering the future with sustainable and innovative energy solutions that drive global industrial progress.",
            descAr: "تزويد المستقبل بحلول طاقة مستدامة ومبتكرة تدفع عجلة التقدم الصناعي العالمي."
        },
        {
            tagEn: "SECTOR 02",
            tagAr: "القطاع 02",
            titleEn: "Real Estate & Infrastructure.",
            titleAr: "العقارات والبنية التحتية.",
            descEn: "Developing landmark properties and robust infrastructure that redefine modern living and commercial spaces.",
            descAr: "تطوير مشاريع عقارية رائدة وبنية تحتية قوية تعيد صياغة مفهوم مساحات المعيشة والأعمال الحديثة."
        },
        {
            tagEn: "SECTOR 03",
            tagAr: "القطاع 03",
            titleEn: "Technology & Innovation.",
            titleAr: "التكنولوجيا والابتكار.",
            descEn: "Investing in cutting-edge tech enterprises to accelerate digital transformation and build smart ecosystems.",
            descAr: "الاستثمار في مؤسسات التكنولوجيا المتقدمة لتسريع التحول الرقمي وبناء أنظمة بيئية ذكية."
        },
        {
            tagEn: "SECTOR 04",
            tagAr: "القطاع 04",
            titleEn: "Retail & Consumer Goods.",
            titleAr: "التجزئة والسلع الاستهلاكية.",
            descEn: "Creating exceptional consumer experiences through diverse retail brands that meet evolving market demands.",
            descAr: "خلق تجارب استهلاكية استثنائية من خلال علامات تجارية متنوعة تلبي متطلبات السوق المتطورة."
        },
        {
            tagEn: "SECTOR 05",
            tagAr: "القطاع 05",
            titleEn: "Food & Beverage.",
            titleAr: "الأغذية والمشروبات.",
            descEn: "Delivering high-quality, sustainable food products that cater to global tastes and nutritional needs.",
            descAr: "تقديم منتجات غذائية عالية الجودة ومستدامة تلبي الأذواق والاحتياجات الغذائية العالمية."
        },
        {
            tagEn: "SECTOR 06",
            tagAr: "القطاع 06",
            titleEn: "Defense & Security.",
            titleAr: "الدفاع والأمن.",
            descEn: "Advancing national and global security through strategic investments in advanced defense technologies.",
            descAr: "تعزيز الأمن الوطني والعالمي من خلال استثمارات استراتيجية في التقنيات الدفاعية المتقدمة."
        }
    ];

    let currentSlideIndex = 0;
    let lockedScrollY = 0;
    let lockCooldown = false;
    let isSwitching = false;
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

    const setSlide = (index) => {
        if (index < 0 || index > 5) return;
        if (index === currentSlideIndex) return;
        
        const images = document.querySelectorAll(".slide-img");
        const textBox = document.getElementById("slides-text-box");
        const tagElem = document.getElementById("slide-tag");
        const titleElem = document.getElementById("slide-title");
        const descElem = document.getElementById("slide-desc");
        const fill = document.getElementById("slideshow-progress-fill");
        
        if (images.length === 0) return;
        
        if (textBox) textBox.classList.add("switching");
        
        images.forEach((img, idx) => {
            if (idx === index) {
                img.classList.add("active");
            } else {
                img.classList.remove("active");
            }
        });
        
        setTimeout(() => {
            currentSlideIndex = index;
            const slide = slidesData[index];
            if (tagElem) {
                tagElem.setAttribute("data-en", slide.tagEn);
                tagElem.setAttribute("data-ar", slide.tagAr);
                tagElem.textContent = currentLang === "ar" ? slide.tagAr : slide.tagEn;
            }
            if (titleElem) {
                titleElem.setAttribute("data-en", slide.titleEn);
                titleElem.setAttribute("data-ar", slide.titleAr);
                titleElem.textContent = currentLang === "ar" ? slide.titleAr : slide.titleEn;
            }
            if (descElem) {
                descElem.setAttribute("data-en", slide.descEn);
                descElem.setAttribute("data-ar", slide.descAr);
                descElem.textContent = currentLang === "ar" ? slide.descAr : slide.descEn;
            }
            if (fill) {
                fill.style.width = `${(index / 5) * 100}%`;
            }
            
            if (textBox) textBox.classList.remove("switching");
        }, 300);
    };

    const setupSlideshowScroll = () => {
        const section = document.getElementById("slideshow-sec");
        const fill = document.getElementById("slideshow-progress-fill");
        if (!section || !fill) return;
        
        // IntersectionObserver for cinematic fade-to-black reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    section.classList.add("entered-active");
                } else {
                    const rect = entry.boundingClientRect;
                    if (rect.top > 0) {
                        section.classList.remove("entered-active");
                        section.classList.remove("locked");
                        document.documentElement.classList.remove("scroll-locked");
                        document.body.classList.remove("scroll-locked");
                    }
                }
            });
        }, {
            threshold: 0.15
        });
        
        observer.observe(section);
        
        // Scroll event listener to check and enforce lock
        const handleScroll = () => {
            const rect = section.getBoundingClientRect();
            const isLocked = section.classList.contains("locked");
            
            if (isLocked) return;
            
            const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
            const scrollingDown = currentScrollY > lastScrollY;
            lastScrollY = currentScrollY;
            
            // Engage lock if not locked, not in cooldown, and crossing the alignment boundary
            if (!isLocked && !lockCooldown) {
                if (scrollingDown && rect.top <= 50 && rect.bottom >= 200) {
                    lockedScrollY = currentScrollY + rect.top;
                    window.scrollTo({ top: lockedScrollY, behavior: 'auto' });
                    
                    section.classList.add("locked");
                    document.documentElement.classList.add("scroll-locked");
                    document.body.classList.add("scroll-locked");
                } else if (!scrollingDown && rect.top >= -50 && rect.top <= 50 && rect.bottom >= 200) {
                    lockedScrollY = currentScrollY + rect.top;
                    window.scrollTo({ top: lockedScrollY, behavior: 'auto' });
                    
                    section.classList.add("locked");
                    document.documentElement.classList.add("scroll-locked");
                    document.body.classList.add("scroll-locked");
                }
            }
        };
        
        window.addEventListener("scroll", handleScroll);
        
        const unlockSlideshow = () => {
            // Reset page scroll position to lockedScrollY to prevent any momentum drift jump
            window.scrollTo({ top: lockedScrollY, behavior: 'auto' });
            
            section.classList.remove("locked");
            document.documentElement.classList.remove("scroll-locked");
            document.body.classList.remove("scroll-locked");
            
            lockCooldown = true;
            setTimeout(() => {
                lockCooldown = false;
            }, 1000);
        };
        
        // Wheel listener for slide transitions inside locked mode
        window.addEventListener("wheel", (e) => {
            const isLocked = section.classList.contains("locked");
            
            if (isLocked) {
                e.preventDefault();
                
                if (e.deltaY > 0) {
                    // Scroll down
                    if (currentSlideIndex === 5) {
                        unlockSlideshow();
                    } else {
                        if (isSwitching) return;
                        isSwitching = true;
                        setTimeout(() => { isSwitching = false; }, 600);
                        setSlide(currentSlideIndex + 1);
                    }
                } else if (e.deltaY < 0) {
                    // Scroll up
                    if (currentSlideIndex === 0) {
                        unlockSlideshow();
                    } else {
                        if (isSwitching) return;
                        isSwitching = true;
                        setTimeout(() => { isSwitching = false; }, 600);
                        setSlide(currentSlideIndex - 1);
                    }
                }
            }
        }, { passive: false });
        
        // Mobile touch swipe handling inside locked mode
        let touchStartY = 0;
        window.addEventListener("touchstart", (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        window.addEventListener("touchmove", (e) => {
            const isLocked = section.classList.contains("locked");
            if (isLocked) {
                e.preventDefault();
                
                const touchEndY = e.touches[0].clientY;
                const diffY = touchStartY - touchEndY;
                
                if (Math.abs(diffY) > 50) { // 50px swipe threshold
                    if (diffY > 0) {
                        // Swipe up -> Scroll down
                        if (currentSlideIndex === 5) {
                            unlockSlideshow();
                        } else {
                            if (isSwitching) return;
                            isSwitching = true;
                            setTimeout(() => { isSwitching = false; }, 600);
                            setSlide(currentSlideIndex + 1);
                        }
                    } else {
                        // Swipe down -> Scroll up
                        if (currentSlideIndex === 0) {
                            unlockSlideshow();
                        } else {
                            if (isSwitching) return;
                            isSwitching = true;
                            setTimeout(() => { isSwitching = false; }, 600);
                            setSlide(currentSlideIndex - 1);
                        }
                    }
                    touchStartY = touchEndY; // Reset baseline
                }
            }
        }, { passive: false });
        
        if (fill) fill.style.width = "0%";
    };

    // --- 6. Section 3: Timeline & Web Audio Ticks (Node 42:700) ---
    const timelineData = [
        {
            year: 2008,
            titleEn: "The Foundation",
            titleAr: "التأسيس والانطلاق",
            descEn: "The journey begins with the establishment of TAJ Holding, laying the groundwork for a diversified portfolio, starting with strategic assets in the energy sector.",
            descAr: "بدأت رحلتنا بتأسيس مجموعة تاج القابضة، ووضع حجر الأساس لمحفظة استثمارية متنوعة، انطلاقاً من أصول استراتيجية قوية في قطاع الطاقة."
        },
        {
            year: 2011,
            titleEn: "Pioneering Real Estate",
            titleAr: "ريادة التطوير العقاري",
            descEn: "Expanding our footprint by entering the real estate and infrastructure market, developing landmark projects that redefine modern commercial spaces.",
            descAr: "توسيع بصمتنا الاستثمارية بدخول سوق العقارات والبنية التحتية، وتطوير مشاريع رائدة تعيد صياغة مفهوم المساحات التجارية الحديثة."
        },
        {
            year: 2015,
            titleEn: "Strategic Diversification",
            titleAr: "التنوع الاستراتيجي",
            descEn: "Broadening our reach across multiple vital industries, adding retail and consumer goods to our ecosystem to meet evolving market demands.",
            descAr: "توسيع نطاق أعمالنا ليشمل قطاعات حيوية متعددة، وإضافة قطاع التجزئة والسلع الاستهلاكية لتلبية متطلبات السوق المتطورة."
        },
        {
            year: 2018,
            titleEn: "Embracing Innovation",
            titleAr: "قيادة التحول الرقمي",
            descEn: "Making bold investments in the technology sector, partnering with cutting-edge tech enterprises to accelerate digital transformation.",
            descAr: "توجيه استثمارات جريئة نحو قطاع التكنولوجيا، وعقد شراكات مع مؤسسات تقنية متقدمة لتسريع وتيرة الابتكار والتحول الرقمي."
        },
        {
            year: 2020,
            titleEn: "Global Expansion",
            titleAr: "التوسع العالمي",
            descEn: "Scaling our operations internationally, achieving an active investment footprint across 4 continents and managing over 20 diverse portfolio entities.",
            descAr: "الانطلاق نحو العالمية والوصول إلى بصمة استثمارية نشطة في 4 قارات، مع إدارة محفظة تضم أكثر من 20 كياناً استثمارياً متنوعاً."
        },
        {
            year: 2022,
            titleEn: "Commitment to Sustainability",
            titleAr: "الالتزام بالاستدامة",
            descEn: "Integrating sustainable practices across all sectors, focusing on food security and green energy solutions to ensure long-term environmental impact.",
            descAr: "دمج ممارسات الاستدامة في جميع قطاعاتنا، مع التركيز على الأمن الغذائي وحلول الطاقة الخضراء لضمان تأثير بيئي إيجابي طويل الأمد."
        },
        {
            year: 2024,
            titleEn: "Scaling Ecosystems",
            titleAr: "توسيع المنظومة الاقتصادية",
            descEn: "Reaching a monumental milestone of building and scaling 50+ exceptional companies, solidifying our position as a dynamic investment powerhouse.",
            descAr: "تحقيق إنجاز استثنائي ببناء وتطوير أكثر من 50 شركة رائدة، مما رسخ مكانتنا كقوة استثمارية ديناميكية ومحرك رئيسي للنمو."
        },
        {
            year: 2026,
            titleEn: "Empowering the Future",
            titleAr: "تمكين المستقبل",
            descEn: "Fully aligned with Vision 2030, we continue to unleash potential through investments that drive national economic growth and shape tomorrow's leading enterprises.",
            descAr: "بتوافق تام مع رؤية المملكة 2030، نواصل إطلاق الإمكانات من خلال استثمارات تدفع عجلة النمو الاقتصادي وتصنع كبرى شركات الغد."
        }
    ];

    let audioCtx = null;
    let lastPlayedIdx = 0;
    const playTickSound = () => {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!audioCtx) {
                audioCtx = new AudioContextClass();
            }
            if (audioCtx.state === "suspended") {
                audioCtx.resume();
            }
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime); // 1.2kHz typewriter clean click
            gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03); // 30ms decay
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.03);
        } catch (err) {
            console.warn("AudioContext tick failed:", err);
        }
    };

    const renderTimelineCards = () => {
        const container = document.getElementById("timeline-cards-inner");
        if (!container) return;
        
        container.innerHTML = timelineData.map((item, idx) => `
            <div class="timeline-card ${idx === 0 ? 'active' : ''}" data-index="${idx}" id="card-${item.year}">
                <div class="timeline-card-header">
                    <span class="timeline-card-year">${item.year}</span>
                </div>
                <h4 class="timeline-card-title">${currentLang === "ar" ? item.titleAr : item.titleEn}</h4>
                <p class="timeline-card-desc">${currentLang === "ar" ? item.descAr : item.descEn}</p>
            </div>
        `).join("");
        
        const cards = container.querySelectorAll(".timeline-card");
        cards.forEach((card, idx) => {
            card.addEventListener("click", () => {
                updateTimeline(idx);
            });
        });
    };

    const updateTimeline = (index, forcePlaySound = true) => {
        const slider = document.getElementById("timeline-range-slider");
        const fill = document.getElementById("custom-slider-fill");
        const cardsContainer = document.getElementById("timeline-cards-inner");
        
        if (!slider) return;
        
        slider.value = index;
        
        if (index !== lastPlayedIdx && forcePlaySound) {
            playTickSound();
            lastPlayedIdx = index;
        }
        
        const percent = (index / 7) * 100;
        if (fill) fill.style.width = `${percent}%`;
        
        const labels = document.querySelectorAll(".timeline-year-label");
        labels.forEach(lbl => {
            const lblIdx = parseInt(lbl.getAttribute("data-index"));
            if (lblIdx === index) {
                lbl.classList.add("active");
            } else {
                lbl.classList.remove("active");
            }
        });
        
        const cards = document.querySelectorAll(".timeline-card");
        cards.forEach(card => {
            const cardIdx = parseInt(card.getAttribute("data-index"));
            if (cardIdx === index) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        });
        
        const cardWidth = 300;
        const gap = 24;
        const shiftAmount = index * (cardWidth + gap);
        
        if (cardsContainer) {
            const dirMultiplier = currentLang === "ar" ? 1 : -1;
            cardsContainer.style.transform = `translateX(${dirMultiplier * shiftAmount}px)`;
        }
    };

    const setupTimelineSlider = () => {
        const ticksContainer = document.getElementById("slider-ticks-container");
        const labelsContainer = document.getElementById("timeline-year-labels");
        const slider = document.getElementById("timeline-range-slider");
        const prevBtn = document.getElementById("slider-prev-btn");
        const nextBtn = document.getElementById("slider-next-btn");
        
        if (!slider) return;
        
        const totalYears = timelineData.length;
        
        if (ticksContainer) {
            ticksContainer.innerHTML = Array.from({ length: totalYears }).map(() => `
                <div class="timeline-tick-dot"></div>
            `).join("");
        }
        
        if (labelsContainer) {
            labelsContainer.innerHTML = timelineData.map((item, idx) => {
                return `<span class="timeline-year-label" data-index="${idx}">${item.year}</span>`;
            }).join("");
            
            const labels = labelsContainer.querySelectorAll(".timeline-year-label");
            labels.forEach(lbl => {
                lbl.addEventListener("click", () => {
                    const idx = parseInt(lbl.getAttribute("data-index"));
                    updateTimeline(idx);
                });
            });
        }
        
        slider.addEventListener("input", (e) => {
            const idx = parseInt(e.target.value);
            updateTimeline(idx);
        });
        
        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                const cur = parseInt(slider.value);
                if (cur > 0) {
                    updateTimeline(cur - 1);
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                const cur = parseInt(slider.value);
                if (cur < 7) {
                    updateTimeline(cur + 1);
                }
            });
        }
        
        updateTimeline(0, false);
    };

    // --- 7. Section 5: Premium Footer & Contact Form Handler (Node 44:1487) ---
    const setupContactForm = () => {
        const form = document.getElementById("contact-form");
        if (!form) return;
        
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector(".form-submit-btn");
            const submitText = form.querySelector(".submit-text");
            const submitArrow = form.querySelector(".submit-arrow");
            
            if (!submitBtn) return;
            
            submitBtn.style.pointerEvents = "none";
            if (submitText) submitText.textContent = currentLang === "ar" ? "جاري الإرسال..." : "Sending...";
            
            const originalArrow = submitArrow ? submitArrow.innerHTML : "→";
            if (submitArrow) {
                submitArrow.innerHTML = `<span class="spinner-circle" style="display:inline-block; width:14px; height:14px; border:2px solid #ffffff; border-top-color:transparent; border-radius:50%; animation: spin 0.8s linear infinite;"></span>`;
            }
            
            setTimeout(() => {
                if (submitText) submitText.textContent = currentLang === "ar" ? "تم الإرسال بنجاح!" : "Sent successfully!";
                if (submitArrow) {
                    submitArrow.innerHTML = "✓";
                    submitArrow.style.color = "#c5ab63";
                }
                
                setTimeout(() => {
                    form.reset();
                    if (submitText) submitText.textContent = currentLang === "ar" ? "إرسال الطلب" : "SEND INQUIRY";
                    if (submitArrow) {
                        submitArrow.innerHTML = originalArrow;
                        submitArrow.style.color = "";
                    }
                    submitBtn.style.pointerEvents = "auto";
                }, 3000);
            }, 1500);
        });
    };

    // Add spinner css keyframe dynamically if not present
    const addSpinnerKeyframes = () => {
        const styleId = "spinner-styles";
        if (document.getElementById(styleId)) return;
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    };

    // --- 8. Language Translation System ---
    const translateContent = (lang) => {
        currentLang = lang;
        const htmlElement = document.documentElement;
        
        if (lang === "ar") {
            htmlElement.setAttribute("dir", "rtl");
            htmlElement.setAttribute("lang", "ar");
        } else {
            htmlElement.setAttribute("dir", "ltr");
            htmlElement.setAttribute("lang", "en");
        }

        const translatableElements = document.querySelectorAll("[data-en]");
        translatableElements.forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation) {
                if (el.id === "hero-headline") {
                    const line1 = el.getAttribute(`data-${lang}-line1`) || (lang === "ar" ? "إرث من " : "A Legacy Of ");
                    const line2 = el.getAttribute(`data-${lang}-line2`) || (lang === "ar" ? "الرؤية والنمو" : "Vision & Growth");
                    el.innerHTML = `${line1}<br><span class="accent-text">${line2}</span>`;
                } else if (el.classList.contains("cta-text")) {
                    el.textContent = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Re-setup scroll reveal for the new language text
        setupScrollReveal();

        // Translate slide tags, titles, and descriptions currently shown
        const tagElem = document.getElementById("slide-tag");
        const titleElem = document.getElementById("slide-title");
        const descElem = document.getElementById("slide-desc");
        const slide = slidesData[currentSlideIndex];
        if (tagElem) tagElem.textContent = lang === "ar" ? slide.tagAr : slide.tagEn;
        if (titleElem) titleElem.textContent = lang === "ar" ? slide.titleAr : slide.titleEn;
        if (descElem) descElem.textContent = lang === "ar" ? slide.descAr : slide.descEn;

        // Re-render timeline cards with correct language
        renderTimelineCards();
        const slider = document.getElementById("timeline-range-slider");
        if (slider) {
            updateTimeline(parseInt(slider.value), false);
        }
    };

    if (langToggle) {
        langToggle.addEventListener("click", () => {
            const nextLang = currentLang === "en" ? "ar" : "en";
            const icon = langToggle.querySelector(".action-icon");
            if (icon) {
                icon.style.transform = "rotate(360deg)";
                setTimeout(() => {
                    icon.style.transform = "none";
                }, 400);
            }
            translateContent(nextLang);
        });
    }

    // --- 9. Theme Toggle System (Dark / Light Mode) ---
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            isLightMode = !isLightMode;
            const themeIcon = themeToggle.querySelector(".action-icon");
            if (themeIcon) {
                themeIcon.style.transform = isLightMode ? "rotate(180deg)" : "rotate(0deg)";
            }
            
            if (isLightMode) {
                document.body.classList.remove("dark-theme");
                document.body.classList.add("light-theme");
            } else {
                document.body.classList.remove("light-theme");
                document.body.classList.add("dark-theme");
            }
        });
    }

    // --- 10. Navigation Overlay Menu ---
    const toggleMenu = (show) => {
        if (!navigationOverlay) return;
        if (show) {
            navigationOverlay.classList.remove("hidden");
            const links = navigationOverlay.querySelectorAll(".nav-link");
            links.forEach((link, i) => {
                link.style.opacity = "0";
                link.style.transform = "translateY(20px)";
                setTimeout(() => {
                    link.style.transition = "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
                    link.style.opacity = "0.7";
                    link.style.transform = "translateY(0)";
                }, 100 + i * 80);
            });
        } else {
            navigationOverlay.classList.add("hidden");
        }
    };

    if (menuToggle) menuToggle.addEventListener("click", () => toggleMenu(true));
    if (closeMenu) closeMenu.addEventListener("click", () => toggleMenu(false));
    
    if (navigationOverlay) {
        const navLinks = navigationOverlay.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
                toggleMenu(false);
            });
        });
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navigationOverlay && !navigationOverlay.classList.contains("hidden")) {
            toggleMenu(false);
        }
    });

    // --- 11. Mouse Parallax Effect on Hero Background ---
    if (window.innerWidth > 768 && heroBgImg) {
        window.addEventListener("mousemove", (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            const moveX = mouseX * -15;
            const moveY = mouseY * -15;
            heroBgImg.style.transform = `scale(1.03) translate(${moveX}px, ${moveY}px)`;
        });
    }

    // --- 12. Watch Story Modal ---
    if (playBtn) {
        playBtn.addEventListener("click", () => {
            const alertBox = document.createElement("div");
            alertBox.style.position = "fixed";
            alertBox.style.bottom = "100px";
            alertBox.style.left = "50%";
            alertBox.style.transform = "translateX(-50%) translateY(20px)";
            alertBox.style.opacity = "0";
            alertBox.style.padding = "16px 28px";
            alertBox.style.background = "rgba(197, 171, 99, 0.95)";
            alertBox.style.color = "#ffffff";
            alertBox.style.borderRadius = "50px";
            alertBox.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
            alertBox.style.backdropFilter = "blur(10px)";
            alertBox.style.zIndex = "1001";
            alertBox.style.fontWeight = "500";
            alertBox.style.fontSize = "14px";
            alertBox.style.letterSpacing = "0.05em";
            alertBox.style.transition = "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            
            alertBox.textContent = currentLang === "en" ? "🎬 Streaming Taj Holding Story..." : "🎬 جاري عرض قصة تاج القابضة...";
            
            document.body.appendChild(alertBox);
            
            setTimeout(() => {
                alertBox.style.transform = "translateX(-50%) translateY(0)";
                alertBox.style.opacity = "1";
            }, 10);
            
            setTimeout(() => {
                alertBox.style.transform = "translateX(-50%) translateY(-20px)";
                alertBox.style.opacity = "0";
                setTimeout(() => {
                    alertBox.remove();
                }, 500);
            }, 3000);
        });
    }

    // --- 13. scroll explore scroll down ---
    const scrollExploreBtn = document.getElementById("scroll-explore-btn");
    if (scrollExploreBtn) {
        scrollExploreBtn.addEventListener("click", () => {
            const nextSec = document.getElementById("statement-sec");
            if (nextSec) {
                nextSec.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // --- 14. Scroll-Driven Hero Video Player ---
    const setupHeroVideoScroll = () => {
        const video = document.getElementById("hero-video");
        const container = document.getElementById("hero-scroll-container");
        const heroImg = document.getElementById("hero-bg-img");
        if (!video || !container) return;

        let targetTime = 0;
        let currentTime = 0;
        let isVideoReady = false;

        const updateVideoFrame = () => {
            if (!isVideoReady) return;
            
            const containerRect = container.getBoundingClientRect();
            const containerHeight = containerRect.height;
            const viewportHeight = window.innerHeight;
            
            const scrollRange = containerHeight - viewportHeight;
            if (scrollRange <= 0) return;

            // Scroll offset within the container
            const currentScroll = -containerRect.top;
            
            // Percentage of scroll within the hero section range
            let scrollFraction = Math.max(0, Math.min(1, currentScroll / scrollRange));
            
            targetTime = scrollFraction * video.duration;
        };

        const setVideoReady = () => {
            if (isVideoReady) return;
            isVideoReady = true;
            video.classList.add("ready");
            if (heroImg) {
                heroImg.classList.add("hidden");
            }
            updateVideoFrame();
        };

        // Listen for metadata and loading states
        video.addEventListener("loadedmetadata", setVideoReady);
        video.addEventListener("canplay", setVideoReady);
        video.addEventListener("canplaythrough", setVideoReady);

        // Force immediate video loading
        video.load();

        // Fallback if cached or preloaded
        if (video.readyState >= 1) {
            setVideoReady();
        }

        window.addEventListener("scroll", updateVideoFrame, { passive: true });
        window.addEventListener("resize", updateVideoFrame, { passive: true });

        // Animation loop for butter-smooth easing
        const animate = () => {
            if (isVideoReady && video.duration) {
                // Smoothly ease current time towards target time
                currentTime += (targetTime - currentTime) * 0.15;
                
                // Avoid redundant video updates if the change is sub-frame
                if (Math.abs(currentTime - video.currentTime) > 0.01) {
                    // Safe clamp just before duration end to avoid loop errors
                    video.currentTime = Math.max(0, Math.min(video.duration - 0.02, currentTime));
                }
            }
            requestAnimationFrame(animate);
        };
        
        animate();
    };

    // --- 15. Initialize Components ---
    setupScrollReveal();
    setupSlideshowScroll();
    renderTimelineCards();
    setupTimelineSlider();
    setupContactForm();
    addSpinnerKeyframes();
    setupHeroVideoScroll();
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
