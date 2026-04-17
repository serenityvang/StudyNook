import { supabase } from '../lib/supabase.js'
import { Navbar } from '../components/navbar.js'
import { SchoolCard, createAddCard } from '../components/schoolCard.js'

// init navbar
const navContainer = document.getElementById('navbar')
navContainer.appendChild(Navbar())

// load spots that are approved
async function loadSpotCounts() {
    const { data: spots, error } = await supabase
        .from("spots")
        .select("campus_id")
        .eq("status", "approved");

    if(error){
        console.error("Error loading spots:", error);
        return {};
    }

    const counts = {};

    spots.forEach((spot) => {
        counts[spot.campus_id] = (counts[spot.campus_id] || 0) + 1;
    });

    return counts;
}


//load campuses
async function loadCampuses() {
    const {data: campuses, error} = await supabase
        .from("campuses")
        .select("id, name, city, state, slug")
        .order("name", {ascending: true});

    if (error) {
        console.error(error)
        return;
    }

    if(!campuses || campuses.length === 0){
        console.log("No campuses found");
        return;
    }

    const spotCounts = await loadSpotCounts();

    renderSchoolCards(campuses, spotCounts);
}


// creates the different school cards
function renderSchoolCards(campuses, spotCounts) {
    const row = document.getElementById("schoolsRow");

    row.innerHTML = "";

    campuses.forEach(campus => {
        const count = spotCounts[campus.id] || 0;
        row.appendChild(SchoolCard(campus, count))
    });
    row.appendChild(createAddCard());
}


loadCampuses()
