export function SchoolCard(campus){
    const card = document.createElement("div");
    card.className = "school-card";
    card.addEventListener("click", () => {
        window.location.href = `/campus.html?school=${campus.slug}`
    })

    const top = document.createElement("div");
    top.className = "school-card-top";

    // const logoWrap = document.createElement("div");
    // logoWrap.className = "school-logo-wrap";

    const logoWrap = document.createElement('div')
    logoWrap.className = 'school-logo-wrap'
    logoWrap.textContent = '🏫'

    const img = document.createElement("img");
    img.className = "school-logo";
    img.src = campus.logo_url || "/logos/fallback.png";
    img.alt = `${campus.name} logo`
    img.addEventListener("error", () => {
        img.style.display = "none";
        // img.src = "/logos/fallback.png"
    })

    const spotsEl = document.createElement("span");
    spotsEl.className = "school-spots";
    spotsEl.id = `spots=$campus.id`;
    spotsEl.textContent = "- spots";

    const nameEl = document.createElement("div");
    nameEl.className = "school-name";
    nameEl.textContent = campus.name;

    const metaEl = document.createElement("div");
    metaEl.className = "school-meta";
    metaEl.textContent = `${campus.city}, ${campus.state}`;

    logoWrap.appendChild(img);
    top.appendChild(logoWrap);
    top.appendChild(spotsEl);
    card.appendChild(top);
    card.appendChild(nameEl);
    card.appendChild(metaEl);

  return card
}

export function createAddCard() {
    const card = document.createElement("div");
    card.className = "school-card-add";

    const icon = document.createElement("span");
    icon.textContent = "➕";

    const text = document.createElement("span");
    text.textContent = "Add your campus";

    card.append(icon, text);

    return card;
}