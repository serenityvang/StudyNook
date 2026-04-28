import { supabase } from '../lib/supabase.js'
import { Navbar } from '../components/navbar.js'
import { SpotCard } from '../components/spotCard.js'
// import { StarRating} from '../components/starRating.js'
// import { VerifiedBadge } from '../components/verifiedBadge.js'


const navContainer = document.getElementById('navbar');
navContainer.appendChild(Navbar());

//read URL parameters
const params = new URLSearchParams(window.location.search);
const spotId = params.get('id');

//check if id exists at all 
if(!spotId) {
    window.location.href = '/index.html';
}

if(!/^[a-z0-9]+$/.test(spotId)) {
    window.location.href = '/index.html';
}

const selectedStars = 0;
const currentUser = null;


async function loadSpotDetails() {
   
    const {data: spot, error} = await supabase
        .from("spots")
        .select("*")
        .eq("id", spotId)
        .eq("status", "approved")
        .single()

    if(error || !spot){
        window.location.href = '/index.html';
        return;
    }

    populateSpot(spot);
    await loadReviews(spot.id);
    await checkAuthState();

}

function populateSpot(spot) {
    document.title = `${spot.name} - StudyNook`;
   
    const colorMap = {
        library: "#dbeafe",
        cafe: "#fef3c7",
        outdoor: "#dcfce7",
        common_area: "#fce7f3"
    };
   
    const spotBanner = document.getElementById("spot-hero");
    spotBanner.style.backgroundColor = colorMap[spot.type] || "#f5f0e8";

    const emojiMap =  {
        library: "📚",
        cafe: "☕️",
        outdoor: "🌿",
        common_area: "🏛️" 
    }

    document.getElementById("spot-hero-emoji").textContent = emojiMap[spot.type] || "📍";

    //header
    document.getElementById("spot-name").textContent = spot.name;
    document.getElementById("spot-location").textContent = spot.location;

    // spot attributes
    document.getElementById("attr-noise").textContent = spot.noise_level || "Not listed";
    document.getElementById("attr-wifi").textContent = spot.wifi ? "Yes" : "No";
    document.getElementById("attr-outlets").textContent = spot.outlets ? "Yes" : "No";
    document.getElementById("attr-hours").textContent = spot.hours || "Not listed"

    // spot description
    document.getElementById("spot-description").textContent = spot.description;

}


loadSpotDetails()