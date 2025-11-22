export function formatTime(ms = 0) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
    return `${min}:${sec}`;
}

export function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites") || "[]").map(String);
}

export function toggleFavorite(id) {
    let favs = getFavorites();
    id = String(id);

    if (favs.includes(id))
        favs = favs.filter(f => f !== id);
    else
        favs.push(id);
    localStorage.setItem("favorites", JSON.stringify(Array.from(new Set(favs))));
}

export function updateFavoriteButtons() {
    const favorites = getFavorites();
    document.querySelectorAll(".btn-fav").forEach(btn => {
        const active = favorites.includes(String(btn.dataset.id));
        btn.style.backgroundColor = active ? "#09e0f4ff" : "#128138";
        btn.style.color = "#fff";
        btn.textContent = active ? "⭐" : "☆";
    });
}

export function detectLongTitles(selectorSpan = ".song-title span") {
    const spans = document.querySelectorAll(selectorSpan);
    spans.forEach((span, index) => {
        if (span.dataset.marqueeSet === "1")
            return;
        const parent = span.parentElement;
        if (!parent)
            return;
        const fullWidth = span.scrollWidth;
        const visibleWidth = parent.clientWidth;

        if (fullWidth > visibleWidth + 2) {
            parent.classList.add("long");
            const distance = fullWidth - visibleWidth;
            const scrollTime = (distance / 20).toFixed(1) + "s";
            const animName = `marquee_${Date.now()}_${index}`;
            const style = document.createElement("style");

            style.type = "text/css";
            style.dataset.marqueestyle = animName;
            style.innerHTML = `
                @keyframes ${animName} {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${distance}px); }
                }
            `;
            document.head.appendChild(style);
            span.style.setProperty("--scroll-name", animName);
            span.style.setProperty("--scroll-time", scrollTime);
            span.dataset.marqueeSet = "1";
        }
    });
}
