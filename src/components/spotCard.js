import { supabase } from '../lib/supabase.js'

export function SpotCard(spot) {

    // card wrapper
    const card = document.createElement("div");
    card.className = "spot-card";
    card.addEventListener("click", () => {
        window.location.href = `/spot.html?id=${spot.id}`;
    });

    // Banner top section
    const banner = document.createElement("div");
    banner.className = `spot-banner spot-banner--${spot.type}`;

    // Emoji in banner depending on spot type
    const bannerEmoji = document.createElement("span");
    bannerEmoji.className = "spot-banner-emoji";

    //map each type to an emoji
    const emojiMap =  {
        library: "📚",
        cafe: "☕️",
        outdoor: "🌿",
        common_area: "🏛️"
    }
    
    bannerEmoji.textContent = emojiMap[spot.type] || "📍";
    banner.appendChild(bannerEmoji);

    //card body
    const cardBody = document.createElement("div");
    cardBody.className = ("spot-card-body");



    // Type badge
    const typeBadge = document.createElement("span");
    typeBadge.className = "spot-type-badge";

    const typeLabels  = {
        library: "Library",
        cafe: "Cafe",
        outdoor: "Outdoor",
        common_area: "Common Area"
    }

    typeBadge.textContent = typeLabels[spot.type] || spot.type;

    //Spot Name 
    const name = document.createElement("h3");
    name.className = "spot-name";
    name.textContent = spot.name;

    // Location
    const location = document.createElement("p");
    location.className = "spot-location";
    location.textContent = spot.location_description;

    // Tags
    // holds noise level, wifi, outlet tags
    const tags = document.createElement("div");
    tags.className = "spot-tags";

    //noise-level show - only if it exists
    if(spot.noise_level) {
        const noiseTag = document.createElement("span");
        noiseTag.className = `spot-tag spot-tag--${spot.noise_level}`;

        const noiseLabels = {
            quiet: "Quiet",
            moderate: "Moderate",
            lively: "Lively",
        }

        noiseTag.textContent = noiseLabels[spot.noise_level] || spot.noise_level;
        tags.appendChild(noiseTag);
    }

    //Wifi- tag -- only if it exists
    if(spot.wifi) {
        const wifiTag = document.createElement("span");
        wifiTag.className = `spot-tag spot-tag--wifi`;
        wifiTag.textContent = "WiFi";
        tags.appendChild(wifiTag);
    }

    // outlets tag -- only if it exists
    if(spot.outlets) {
        const outletsTag = document.createElement("span");
        outletsTag.className = `spot-tag spot-tag--outlets`;
        outletsTag.textContent = "Outlets";
        tags.appendChild(outletsTag);
    }

    // Ratings row
    // shows average star rating and total count
    const ratingRow = document.createElement("div");
    ratingRow.className = "spot-rating-row";
    ratingRow.id = `rating-${spot.id}`;

    // placeholder while we fetch rating
    const ratingPlaceholder = document.createElement("span");
    ratingPlaceholder.className = "spot-rating-placeholder";
    ratingPlaceholder.textContent = "No ratings yet";
    ratingRow.appendChild(ratingPlaceholder);

    cardBody.appendChild(typeBadge);
    cardBody.appendChild(name);
    cardBody.appendChild(location);
    cardBody.appendChild(tags);
    cardBody.appendChild(ratingRow);

    card.appendChild(banner);
    card.appendChild(cardBody);

    fetchRating(spot.id);

    return card;
}

async function fetchRating(spotId) {
    const {data: reviews, error} = await supabase
        .from("reviews")
        .select("stars")
        .eq("spot_id", spotId)
        .eq("status", "approved")
        .limit(200);

        // if error or no reviews leave placeholder as is
        if(error || !reviews || reviews.length === 0){
            return;
        }

        // calculate average
        const total = reviews.reduce((sum, review) => sum + review.stars, 0);
        const average = (total / reviews.length).toFixed(1);

        // find the rating row for this specific spot
        const ratingRow = document.getElementById(`rating-${spotId}`);
        if (!ratingRow) {
            return;
        }

        // clear the placeholder
        ratingRow.innerHTML = "";

        //Display the stars
        const stars = document.createElement("span");
        stars.className = "spot-stars";
        stars.textContent = getStarDisplay(parseFloat(average));

        const avgText = document.createElement("span");
        avgText.className = "spot-avg";
        avgText.textContent = average;

        const countText = document.createElement("span");
        countText.className = "spot-count";
        countText.textContent = `(${reviews.length})`;

        ratingRow.appendChild(stars);
        ratingRow.appendChild(avgText);
        ratingRow.appendChild(countText);
}


// Star Display
function getStarDisplay(average){
    const full = Math.floor(average);
    const half = average % 1 >= 0.5 ? 1 : 0 // 1 if there's a half star
    const empty = 5 - full - half;

    return "★".repeat(full) + (half ? "½" : "" ) + '☆'.repeat(empty);
}


