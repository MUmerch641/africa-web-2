class DeepAfricaSafaris {
    constructor() {
        this.galleryData = [];
        this.currentFilter = "all";
        this.currentPage = 1;
        this.itemsPerPage = 30;
        this.currentSearch = "";
        this.init();
    }

    init() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        this.setupLoader();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupHeroCarousel(); // New: Hero carousel setup
        this.setupGallery();
        this.setupModal();
        this.setupContactForm();
        this.setupAnimations();
    }

    // Hero Carousel Setup
    setupHeroCarousel() {
        const slides = document.querySelectorAll('.hero-slide');
        const totalSlides = slides.length;
        let currentSlide = 0;
        const slideInterval = 2000; // 5 seconds between slides

        // Function to show a specific slide
        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
            currentSlide = index;
        };

        // Function to go to the next slide
        const nextSlide = () => {
            const nextIndex = (currentSlide + 1) % totalSlides;
            showSlide(nextIndex);
        };

        // Function to go to the previous slide
        const prevSlide = () => {
            const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(prevIndex);
        };

        // Automatic slideshow
        let autoSlide = setInterval(nextSlide, slideInterval);

        // Pause on hover
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => clearInterval(autoSlide));
            heroSection.addEventListener('mouseleave', () => {
                autoSlide = setInterval(nextSlide, slideInterval);
            });
        }

        // Optional: Add navigation buttons (uncomment and add to HTML if needed)
        /*
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-nav next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-nav prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';

        const carousel = document.querySelector('.hero-carousel');
        carousel.appendChild(prevBtn);
        carousel.appendChild(nextBtn);

        nextBtn.addEventListener('click', () => {
            clearInterval(autoSlide);
            nextSlide();
            autoSlide = setInterval(nextSlide, slideInterval);
        });

        prevBtn.addEventListener('click', () => {
            clearInterval(autoSlide);
            prevSlide();
            autoSlide = setInterval(nextSlide, slideInterval);
        });
        */

        // Show first slide on load
        showSlide(0);
    }

    // Loading Screen
    setupLoader() {
        const loader = document.getElementById("loader");
        if (!loader) return;

        const progressBar = loader.querySelector(".progress-bar");
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loader.classList.add("hidden");
                    document.body.style.overflow = "visible";
                }, 500);
            }
            if (progressBar) {
                progressBar.style.width = progress + "%";
            }
        }, 200);
    }

    // Navigation
    setupNavigation() {
        const navbar = document.getElementById("navbar");
        const navToggle = document.getElementById("nav-toggle");
        const navMenu = document.getElementById("nav-menu");
        const navLinks = document.querySelectorAll(".nav-link");

        if (!navbar) return;

        let lastScrollTop = 0;
        window.addEventListener(
            "scroll",
            this.throttle(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > 50) {
                    navbar.classList.add("scrolled");
                } else {
                    navbar.classList.remove("scrolled");
                }

                if (window.innerWidth <= 768) {
                    if (scrollTop > lastScrollTop && scrollTop > 100) {
                        navbar.style.transform = "translateY(-100%)";
                    } else {
                        navbar.style.transform = "translateY(0)";
                    }
                }

                lastScrollTop = scrollTop;
            }, 100),
        );

        if (navToggle && navMenu) {
            navToggle.addEventListener("click", () => {
                navToggle.classList.toggle("active");
                navMenu.classList.toggle("active");
                document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
            });
        }

        navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (href && href.startsWith("#")) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({ top: offsetTop, behavior: "smooth" });
                    }
                }

                if (navToggle && navMenu) {
                    navToggle.classList.remove("active");
                    navMenu.classList.remove("active");
                    document.body.style.overflow = "";
                }
            });
        });

        this.setupActiveNavigation(navLinks);
    }

    setupActiveNavigation(navLinks) {
        const sections = document.querySelectorAll("section[id]");
        const observerOptions = {
            rootMargin: "-50% 0px -50% 0px",
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    navLinks.forEach((link) => {
                        link.classList.remove("active");
                        if (link.getAttribute("href") === `#${id}`) {
                            link.classList.add("active");
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach((section) => observer.observe(section));
    }

    // Scroll Effects
    setupScrollEffects() {
        const backToTop = document.getElementById("backToTop");

        if (backToTop) {
            window.addEventListener(
                "scroll",
                this.throttle(() => {
                    if (window.pageYOffset > 300) {
                        backToTop.classList.add("visible");
                    } else {
                        backToTop.classList.remove("visible");
                    }
                }, 100),
            );

            backToTop.addEventListener("click", () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute("href"));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: "smooth",
                    });
                }
            });
        });
    }

    // Gallery Setup
    setupGallery() {
        this.galleryData = this.loadMediaFromFolder();
        this.renderGallery();
        this.setupGalleryControls();
        this.setupExistingGalleryItems();
    }

    loadMediaFromFolder() {
        const mediaFiles = [
"WhatsApp Image 2026-01-08 at 10.37.11 AM (1).jpeg",
"WhatsApp Image 2026-01-08 at 10.37.11 AM (2).jpeg",
"WhatsApp Image 2026-01-08 at 10.37.11 AM.jpeg",
"WhatsApp Image 2026-01-08 at 10.37.12 AM (1).jpeg",
"WhatsApp Image 2026-01-08 at 10.37.12 AM (2).jpeg",
"WhatsApp Image 2026-01-08 at 10.37.12 AM.jpeg",
"WhatsApp Image 2026-01-08 at 10.37.13 AM (1).jpeg",
"WhatsApp Image 2026-01-08 at 10.37.13 AM (2).jpeg",
"WhatsApp Image 2026-01-08 at 10.37.13 AM.jpeg",
"WhatsApp Image 2026-01-08 at 10.37.14 AM (1).jpeg",
"WhatsApp Image 2026-01-08 at 10.37.14 AM (2).jpeg",
"WhatsApp Image 2026-01-08 at 10.37.14 AM.jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.54 AM (1).jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.54 AM.jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.55 AM (1).jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.55 AM (2).jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.55 AM.jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.56 AM (1).jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.56 AM (2).jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.56 AM.jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.57 AM (1).jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.57 AM (2).jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.57 AM.jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.58 AM (1).jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.58 AM.jpeg",
            // "WhatsApp Image 2025-07-26 at 4.04.59 AM.jpeg",
        ];

        return mediaFiles.map((filename) => ({
            src: `./media/${filename}`,
            type: filename.toLowerCase().endsWith(".mp4") ? "video" : "image",
            category: filename.toLowerCase().endsWith(".mp4") ? "videos" : "wildlife",
            title: `Safari Moment`,
            description: "An unforgettable experience in Botswana.",
        }));
    }

    setupExistingGalleryItems() {
        const existingItems = document.querySelectorAll(".gallery-item");

        existingItems.forEach((item) => {
            const viewBtn = item.querySelector(".view-btn");
            if (viewBtn) {
                viewBtn.addEventListener("click", () => {
                    const img = item.querySelector("img");
                    const title = item.querySelector("h4")?.textContent || "Safari Image";
                    const description = item.querySelector("p")?.textContent || "Beautiful safari moment";

                    this.openModalWithData(img.src, img.alt, title, description);
                });
            }
        });
    }

    setupGalleryControls() {
        const filterBtns = document.querySelectorAll(".filter-btn");

        filterBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const filter = btn.getAttribute("data-filter");

                filterBtns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");

                this.currentFilter = filter;
                this.currentPage = 1;
                this.renderGallery();
            });
        });

        const searchInput = document.getElementById("gallery-search");
        if (searchInput) {
            searchInput.addEventListener(
                "input",
                this.debounce((e) => {
                    this.currentSearch = e.target.value.toLowerCase();
                    this.currentPage = 1;
                    this.renderGallery();
                }, 300),
            );
        }

        const prevBtn = document.getElementById("prev-page");
        const nextBtn = document.getElementById("next-page");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderGallery();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                const totalPages = Math.ceil(this.getFilteredData().length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderGallery();
                }
            });
        }
    }

    getFilteredData() {
        return this.galleryData.filter(
            (item) =>
                (this.currentFilter === "all" || item.category === this.currentFilter) &&
                item.src.toLowerCase().includes(this.currentSearch),
        );
    }

    renderGallery() {
        const galleryGrid = document.getElementById("gallery-grid");
        if (!galleryGrid || this.galleryData.length === 0) return;

        const filteredData = this.getFilteredData();
        const totalPages = Math.ceil(filteredData.length / this.itemsPerPage);
        const pageData = filteredData.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage,
        );

        galleryGrid.innerHTML = ""; // Clear existing items

        pageData.forEach((item) => {
            const galleryItem = this.createGalleryItem(item);
            galleryGrid.appendChild(galleryItem);
        });

        this.updatePagination(filteredData.length, totalPages);
        this.updateFilterCounts();
    }

    createGalleryItem(item) {
        const galleryItem = document.createElement("div");
        galleryItem.className = "gallery-item";
        galleryItem.setAttribute("data-category", item.category);
        galleryItem.setAttribute("data-type", item.type);
        galleryItem.setAttribute("data-src", item.src);

        const mediaTag =
            item.type === "video"
                ? `<video src="${item.src}" muted playsinline loop preload="metadata"></video><div class="play-button"><i class="fas fa-play"></i></div>`
                : `<img src="${item.src}" alt="${item.title}" loading="lazy">`;

        galleryItem.innerHTML = `
            ${mediaTag}
            <div class="gallery-overlay">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <button class="view-btn">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        `;

        const viewBtn = galleryItem.querySelector(".view-btn");
        viewBtn.addEventListener("click", () => {
            this.openModalWithData(item.src, item.title, item.title, item.description);
        });

        return galleryItem;
    }

    updatePagination(totalItems, totalPages) {
        const currentPageEl = document.getElementById("current-page");
        const totalPagesEl = document.getElementById("total-pages");
        const showingCountEl = document.getElementById("showing-count");
        const prevBtn = document.getElementById("prev-page");
        const nextBtn = document.getElementById("next-page");

        if (currentPageEl) currentPageEl.textContent = this.currentPage;
        if (totalPagesEl) totalPagesEl.textContent = totalPages || 1;

        if (showingCountEl) {
            const start = Math.min((this.currentPage - 1) * this.itemsPerPage + 1, totalItems);
            const end = Math.min(this.currentPage * this.itemsPerPage, totalItems);
            showingCountEl.textContent = `Showing ${start}-${end} of ${totalItems} items`;
        }

        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }

    updateFilterCounts() {
        const countAll = document.getElementById("count-all");
        const countWildlife = document.getElementById("count-wildlife");
        const countVideos = document.getElementById("count-videos");

        if (countAll) countAll.textContent = this.galleryData.length;
        if (countWildlife)
            countWildlife.textContent = this.galleryData.filter((item) => item.category === "wildlife").length;
        if (countVideos) countVideos.textContent = this.galleryData.filter((item) => item.category === "videos").length;
    }

    setupModal() {
        const modal = document.getElementById("imageModal");
        const closeBtn = modal?.querySelector(".modal-close");

        if (!modal) return;

        if (closeBtn) {
            closeBtn.addEventListener("click", () => this.closeModal());
        }

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("active")) {
                this.closeModal();
            }
        });

        window.openModal = (button) => {
            const galleryItem = button.closest(".gallery-item");
            const img = galleryItem.querySelector("img");
            const title = galleryItem.querySelector("h4")?.textContent || "Safari Image";
            const description = galleryItem.querySelector("p")?.textContent || "Beautiful moment from our safari";

            this.openModalWithData(img.src, img.alt, title, description);
        };
    }

    openModalWithData(src, alt, title, description) {
        const modal = document.getElementById("imageModal");
        const modalImage = document.getElementById("modalImage");
        const modalTitle = document.getElementById("modalTitle");
        const modalDescription = document.getElementById("modalDescription");

        if (modal && modalImage && modalTitle && modalDescription) {
            modalImage.src = src;
            modalImage.alt = alt || title;
            modalTitle.textContent = title;
            modalDescription.textContent = description;

            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    closeModal() {
        const modal = document.getElementById("imageModal");
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    }

    setupContactForm() {
        const form = document.getElementById("inquiryForm");
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.disabled = true;
            form.classList.add("submitting");

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (response.ok) {
                    this.showFormStatus(
                        "success",
                        "Thank you! Your inquiry has been sent successfully. We'll get back to you soon.",
                    );
                    form.reset();
                } else {
                    throw new Error("Form submission failed");
                }
            } catch (error) {
                this.showFormStatus(
                    "error",
                    "Sorry, there was an error sending your message. Please try again or contact us directly.",
                );
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.classList.remove("submitting");
            }
        });
    }

    showFormStatus(type, message) {
        const form = document.getElementById("inquiryForm");
        const existingStatus = form.querySelector(".form-status");

        if (existingStatus) {
            existingStatus.remove();
        }

        const statusDiv = document.createElement("div");
        statusDiv.className = `form-status status-${type}`;
        statusDiv.innerHTML = `
            <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-triangle"}"></i>
            <span>${message}</span>
        `;

        form.appendChild(statusDiv);

        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.remove();
            }
        }, 5000);
    }

    setupAnimations() {
        const animationObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                        animationObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            },
        );

        document.querySelectorAll(".feature-item, .package-card, .rule-card, .gallery-item").forEach((el) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            animationObserver.observe(el);
        });

        const counters = document.querySelectorAll(".stat-number");
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = Number.parseInt(counter.textContent.replace(/\D/g, ""));
                    const increment = target / 100;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }

                        if (counter.textContent.includes("+")) {
                            counter.textContent = Math.floor(current) + "+";
                        } else if (counter.textContent.includes(".")) {
                            counter.textContent = (current / 10).toFixed(1);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, 20);

                    counterObserver.unobserve(counter);
                }
            });
        });

        counters.forEach((counter) => counterObserver.observe(counter));
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

new DeepAfricaSafaris();

window.addEventListener("error", (e) => {
    console.error("JavaScript error:", e.error);
});