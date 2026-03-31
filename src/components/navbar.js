export function Navbar(){
    const nav = document.createElement("nav");
    nav.className = "navbar";
    nav.innerHTML = `
        <a href=/index.html class="logo">Study<span>Nook</span></a>
        <div class="nav-links">
            <a href="/index.html">About</a>
            <a href="/request-campus.html">Add your campus</a>
        </div>
    `

    return nav;
}