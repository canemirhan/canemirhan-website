function normalizePath(pathname) {
    if (!pathname || pathname === "/") {
        return "/index.html";
    }
    return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

async function navigateWithoutReload(url, pushState = true) {
    try {
        const response = await fetch(url, {
            headers: {
                "X-Requested-With": "fetch"
            }
        });

        if (!response.ok) {
            window.location.href = url;
            return;
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const nextContent = doc.querySelector(".page-content");
        const currentContent = document.querySelector(".page-content");

        if (!nextContent || !currentContent) {
            window.location.href = url;
            return;
        }

        document.title = doc.title || document.title;
        currentContent.replaceWith(nextContent);

        if (pushState) {
            history.pushState({}, "", url);
        }

        // Re-apply selected language to newly injected content.
        const activeLang = document.documentElement.getAttribute("data-lang") || "en";
        if (typeof window.setLanguage === "function") {
            window.setLanguage(activeLang);
        }
    } catch (_) {
        window.location.href = url;
    }
}

document.addEventListener("click", function (event) {
    const link = event.target.closest("a");
    if (!link) {
        return;
    }

    if (link.target === "_blank" || link.hasAttribute("download")) {
        return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
    }

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) {
        return;
    }

    const nextUrl = new URL(href, window.location.href);
    if (nextUrl.origin !== window.location.origin) {
        return;
    }

    const currentPath = normalizePath(window.location.pathname);
    const nextPath = normalizePath(nextUrl.pathname);

    if (nextPath === currentPath) {
        return;
    }

    event.preventDefault();
    navigateWithoutReload(nextUrl.pathname + nextUrl.search + nextUrl.hash, true);
});

window.addEventListener("popstate", function () {
    navigateWithoutReload(window.location.pathname + window.location.search + window.location.hash, false);
});
