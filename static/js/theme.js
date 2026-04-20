const toggle = document.getElementById("theme-toggle");
const html = document.documentElement;

toggle.addEventListener("click", () => {
    const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});
