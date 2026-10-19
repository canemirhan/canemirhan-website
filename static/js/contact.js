document.addEventListener("submit", async (event) => {
    const form = event.target.closest(".contact-form");
    if (!form) {
        return;
    }

    event.preventDefault();

    const button = form.querySelector("button[type='submit']");
    const status = form.querySelector(".form-status");
    const lang = document.documentElement.getAttribute("data-lang") || "en";

    if (!button || !status) {
        return;
    }

    button.disabled = true;
    status.hidden = true;
    status.className = "form-status";

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Form submission failed with status ${response.status}`);
        }

        form.reset();
        status.textContent =
            status.getAttribute(`data-success-${lang}`) ||
            status.getAttribute("data-success-en");
        status.classList.add("success");
    } catch (error) {
        console.error("Contact form submission failed:", error);
        status.textContent =
            status.getAttribute(`data-error-${lang}`) ||
            status.getAttribute("data-error-en");
        status.classList.add("error");
    } finally {
        status.hidden = false;
        button.disabled = false;
    }
});
