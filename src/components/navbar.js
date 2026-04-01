export function Navbar(){
    const nav = document.createElement("nav");
    nav.className = "navbar";

    const logo = document.createElement("a");
    logo.href= "/index.html";
    logo.className = "logo";
    logo.append("Study");

    const logoSpan = document.createElement("span");
    logoSpan.textContent = "Nook";
    logo.appendChild(logoSpan);

    const navLinks = document.createElement("div");
    navLinks.className = "nav-links";

    const aboutLink = document.createElement("a");
    aboutLink.href = "/index.html";
    aboutLink.textContent = "About";

    const campusLink = document.createElement("a");
    campusLink.href = "/request-campus.html";
    campusLink.textContent = "Add your campus";

    navLinks.appendChild(aboutLink);
    navLinks.appendChild(campusLink);

    nav.appendChild(logo);
    nav.appendChild(navLinks);

    return nav;
}