"use strict";

/* =========================================
   RAJ KUMAR PORTFOLIO
========================================= */


/* =========================================
   1. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

function closeMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
        const isOpen = navMenu.classList.toggle("open");

        document.body.classList.toggle("menu-open", isOpen);

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 850) {
            closeMenu();
        }
    });
}


/* =========================================
   2. ACTIVE NAVIGATION LINK
========================================= */

const pageSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                navLinks.forEach(function (link) {
                    const isActive =
                        link.getAttribute("href") === `#${currentId}`;

                    link.classList.toggle("active", isActive);
                });
            });
        },
        {
            rootMargin: "-30% 0px -60% 0px",
            threshold: 0
        }
    );

    pageSections.forEach(function (section) {
        navObserver.observe(section);
    });
}


/* =========================================
   3. PROJECT FILTERS
========================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        projectCards.forEach(function (card) {
            const categories = (card.dataset.category || "").split(" ");

            const shouldShow =
                selectedFilter === "all" ||
                categories.includes(selectedFilter);

            card.hidden = !shouldShow;
        });
    });
});


/* =========================================
   4. SCROLL REVEAL ANIMATIONS
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (
    "IntersectionObserver" in window &&
    !reduceMotion
) {
    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(function (element) {
        element.classList.add("visible");
    });
}


/* =========================================
   5. PROFILE IMAGE FALLBACK
========================================= */

const profileImage = document.getElementById("profileImage");
const profileFallback = document.getElementById("profileFallback");

function showProfileFallback() {
    if (profileImage) {
        profileImage.hidden = true;
    }

    if (profileFallback) {
        profileFallback.hidden = false;
    }
}

if (profileImage && profileFallback) {
    profileImage.addEventListener("error", showProfileFallback);

    if (
        profileImage.complete &&
        profileImage.naturalWidth === 0
    ) {
        showProfileFallback();
    }
}


/* =========================================
   6. CURRENT YEAR
========================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================
   7. TOAST NOTIFICATION
========================================= */

const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 4500);
}


/* =========================================
   8. ENQUIRY FORM VALIDATION
========================================= */

const enquiryForm = document.getElementById("enquiryForm");
const formStatus = document.getElementById("formStatus");

if (enquiryForm && formStatus) {
    enquiryForm.addEventListener("submit", function (event) {
        event.preventDefault();

        formStatus.textContent = "";
        formStatus.className = "form-status";

        if (!enquiryForm.reportValidity()) {
            return;
        }

        const formData = new FormData(enquiryForm);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const phone = String(formData.get("phone") || "").trim();
        const service = String(formData.get("service") || "").trim();
        const budget = String(formData.get("budget") || "Not specified").trim();
        const message = String(formData.get("message") || "").trim();

        if (name.length < 2) {
            showFormError("Please enter your full name.");
            return;
        }

        if (message.length < 10) {
            showFormError(
                "Please provide at least 10 characters describing your project."
            );
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showFormError("Please enter a valid email address.");
            return;
        }

        const subject = `Portfolio Enquiry - ${name}`;

        const body = [
            "NEW PORTFOLIO ENQUIRY",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "Not provided"}`,
            `Service: ${service}`,
            `Estimated Budget: ${budget}`,
            "",
            "PROJECT DETAILS:",
            message
        ].join("\n");

        const mailtoURL =
            "mailto:rajkush018a@gmail.com" +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);

        formStatus.textContent =
            "Your email application will open with the enquiry details. Send the email to complete your enquiry.";

        formStatus.classList.add("success");

        showToast(
            "Enquiry prepared. Please send the email from your email application."
        );

        /*
         * This opens an email draft.
         * It does NOT automatically send or store the enquiry.
         */
        window.location.href = mailtoURL;
    });
}

function showFormError(message) {
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = "form-status error";

    showToast(message);
}


/* =========================================
   9. PREVENT EMPTY PLACEHOLDER NAVIGATION
========================================= */

document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        showToast(
            "Add the actual project or certificate link before publishing."
        );
    });
});


/* =========================================
   10. CONSOLE MESSAGE
========================================= */

console.log(
    "%cRaj Kumar | DevOps Engineer",
    "color: #60a5fa; font-size: 18px; font-weight: bold;"
);

console.log(
    "Portfolio loaded successfully. Keep learning, building and automating!"
);