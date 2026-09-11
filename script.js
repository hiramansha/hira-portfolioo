// ===============================
// CONTACT FORM
// ===============================

const contactForm = document.querySelector("#contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const nameInput = document.querySelector("#name");
        const formMessage = document.querySelector("#form-message");

        const name = nameInput ? nameInput.value.trim() : "there";

        // Show success message
        if (formMessage) {
            formMessage.textContent =
                "Thank you, " + name + "! Your message has been received.";
            formMessage.classList.add("show");
        } else {
            alert(
                "Thank you, " +
                name +
                "! Your message has been received."
            );
        }

        // Clear form
        contactForm.reset();

    });

}


// ===============================
// MOBILE NAVIGATION
// ===============================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    // Open / close mobile menu
    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        const isOpen = navLinks.classList.contains("active");

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );

    });


    // Close menu when a navigation link is clicked
    const navigationLinks =
        document.querySelectorAll(".nav-links a");

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            menuToggle.setAttribute(
                "aria-label",
                "Open menu"
            );

        });

    });

}


// ===============================
// SCROLL REVEAL ANIMATION
// ===============================

const revealElements = document.querySelectorAll(
    ".section, .project-card, .skill-card, .education-card, .about-box"
);

function revealOnScroll() {

    revealElements.forEach(function (element) {

        const elementTop =
            element.getBoundingClientRect().top;

        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {

            element.classList.add("show");

        }

    });

}


// Run when page loads
window.addEventListener("load", revealOnScroll);

// Run while scrolling
window.addEventListener("scroll", revealOnScroll);


// ===============================
// NAVBAR SHADOW ON SCROLL
// ===============================

const navbar = document.querySelector("nav");

function updateNavbar() {

    if (!navbar) {
        return;
    }

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

}

window.addEventListener("scroll", updateNavbar);
window.addEventListener("load", updateNavbar);


// ===============================
// SCROLL TO TOP BUTTON
// ===============================

const topButton = document.querySelector("#scroll-top");

if (topButton) {

    function updateScrollButton() {

        if (window.scrollY > 400) {

            topButton.classList.add("show");

        } else {

            topButton.classList.remove("show");

        }

    }


    window.addEventListener(
        "scroll",
        updateScrollButton
    );

    window.addEventListener(
        "load",
        updateScrollButton
    );


    // Scroll to top
    topButton.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


// ===============================
// DARK / LIGHT MODE
// ===============================

const themeToggle =
    document.querySelector("#theme-toggle");

if (themeToggle) {

    // Check previously saved theme
    const savedTheme =
        localStorage.getItem("theme");


    // Apply saved dark mode
    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeToggle.textContent = "☀";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    } else {

        themeToggle.textContent = "☾";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );

    }


    // Toggle theme
    themeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");


        if (
            document.body.classList.contains("dark-mode")
        ) {

            // Dark mode
            themeToggle.textContent = "☀";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            // Light mode
            themeToggle.textContent = "☾";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    });

}