const langButtons = {
    tr: document.getElementById("lang-tr"),
    en: document.getElementById("lang-en")
};

const routeTitles = {
    "index.html": { en: "Emirhan Can", tr: "Emirhan Can" },
    "about.html": { en: "Emirhan Can | About", tr: "Emirhan Can | Hakkında" },
    "contact.html": { en: "Emirhan Can | Contact", tr: "Emirhan Can | İletişim" }
};

function getPageKey(pathname) {
    if (!pathname || pathname === "/") {
        return "index.html";
    }

    const cleanedPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const segments = cleanedPath.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "index.html";

    return lastSegment.toLowerCase() === "" ? "index.html" : lastSegment.toLowerCase();
}

function updatePageTitle(lang, pathname = window.location.pathname) {
    const key = getPageKey(pathname);
    const labels = routeTitles[key];
    if (!labels) {
        document.title = "Portfolio";
        return;
    }
    document.title = labels[lang] || labels.en;
}

function setLanguage(lang) {
    document.querySelectorAll("[data-tr]").forEach(el => {
        el.textContent = el.dataset[lang];
    });

    // Update form button text
    const submitBtn = document.querySelector(".contact-form button");
    if (submitBtn) {
        submitBtn.textContent = submitBtn.dataset[lang] || "Send Message";
    }

    // Update form input placeholders
    document.querySelectorAll("[data-placeholder-en]").forEach(el => {
        el.placeholder = el.dataset[`placeholder-${lang}`];
    });

    document.documentElement.setAttribute("data-lang", lang);
    localStorage.setItem("language", lang);
    updatePageTitle(lang);
}

window.setLanguage = setLanguage;

langButtons.tr.addEventListener("click", () => setLanguage("tr"));
langButtons.en.addEventListener("click", () => setLanguage("en"));

/* Load saved language - data-lang attribute already set in head, just apply content */
const savedLang = document.documentElement.getAttribute("data-lang") || "en";
setLanguage(savedLang);

// Set title before full-page navigation starts to avoid hostname/title flash.
document.querySelectorAll(".nav-links a, .navbar > a").forEach((link) => {
    link.addEventListener("click", () => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("#")) {
            return;
        }

        const nextUrl = new URL(href, window.location.href);
        if (nextUrl.origin !== window.location.origin) {
            return;
        }

        const activeLang = document.documentElement.getAttribute("data-lang") || "en";
        updatePageTitle(activeLang, nextUrl.pathname);
    });
});
