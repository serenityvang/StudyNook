import { supabase } from '../lib/supabase.js'
import { Navbar } from '../components/navbar.js'
import { SpotCard } from '../components/spotCard.js'


// init navbar
const navContainer = document.getElementById('navbar')
navContainer.appendChild(Navbar())

//Read URL Parameters
const params = new URLSearchParams(window.location.search);
const slug = params.get("school");

//Validating slug
if(!slug) {
    window.location.href = '/index.html';
}

if(!/^[a-z0-9-]+$/.test(slug)) {
    window.location.href = '/index.html';
}

// load campuses
async function loadCampus() {

    //query campuses table
    const {data: campus, error} = await supabase
        .from("campuses")
        .select("id, name, city, state")
        .eq("slug", slug)
        .single();

    // If supabase returned an error or found no campuses
    // log the error for debugging and redirct to landing page
    if(error || !campus) {
        console.error("Campus not found", error);
        window.location.href = "/index.html"
        return;
    }

    // populate breadcrumb
    const breadcrumb = document.getElementById('breadcrumb');

    const breadcrumbHome = document.createElement("a");
    breadcrumbHome.href = "/index.html";
    breadcrumbHome.textContent = "All Campuses"

    const seperator = document.createElement("span");
    seperator.textContent = " > ";

    //current campus name
    const breadcrumbCurrent = document.createElement("span");
    breadcrumbCurrent.textContent = campus.name;

    breadcrumb.appendChild(breadcrumbHome);
    breadcrumb.appendChild(seperator);
    breadcrumb.appendChild(breadcrumbCurrent);
    

    // populate campus name
    const campusName = document.getElementById("campus-name");
    campusName.textContent = campus.name;

    // populate campus location
    const campusMeta = document.getElementById("campus-meta");
    campusMeta.textContent = `${campus.city}, ${campus.state}`;

    await loadSpots(campus.id);

}


// load spots for campuses
async function loadSpots(campusId){

    //show a loading message while we wait for supabase
    //only fetch aprpoved spots - pending/rejected not shown to the public
    const grid = document.querySelector(".spots-grid");
    const loadingEl = document.createElement("p");
    loadingEl.className = "loading-message";
    loadingEl.id = "loading-mesage";
    loadingEl.textContent = "loading spots...";
    grid.appendChild(loadingEl);

    // fetch spots from our database
    const {data: spots, error} = await supabase
        .from("spots")
        .select("id, name, location_description, type, noise_level, wifi, outlets, hours, description, photo_url")
        .eq("campus_id", campusId)
        .eq("status", "approved")
        .order("name", {ascending: true})
        .limit(100)

    // remove the loading mesage depending if we succeeded or failed
    const loading = document.getElementById("loading-message");
    if(loading){
        loading.remove();
    }

    // if supabase returned an error show a mesage to the user, so the user won't see a blank page.

    if(error) {
        const errEl = document.createElement("p");
        errEl.className = "error-message";
        errEl.textContent = "Something went wrong loading spots. Please try again.";
        grid.appendChild(errEl);
        return;
    }

    allSpots = [...spots];

    renderSpots(allSpots);

    updateSpotCount(allSpots.length);
}

// Render the spots
function renderSpots(spots) {
    const grid = document.querySelector(".spots-grid");

    grid.innerHTML = "";

    //if no spots match the current filter show a helpful message
    if(spots.length === 0) {
        const empty = document.createElement("p");
        empty.className = "spots-empty";
        empty.textContent = "No spots found for this filter.";
        grid.appendChild(empty);
        return;
    }

    // loop through every spot and append a SpotCard for each one 
    // SpotCard() is a funciton that takes a spot object and returns a DOM element

    spots.forEach(spots => {
        grid.appendChild(SpotCard(spots))
    });
}

// Update the spot count
function updateSpotCount(count) {
    const countEl = document.getElementById("campus-count");
    countEl.textContent = `${count} spot${count !== 1 ? "s" : ""}`;
}

let allSpots = []; // local memory for spots

let activeFilters = {
    type: "all",
    wifi: false,
    outlets: false,
    noise: null
}

// Filter logic
function filterSpots() {
    let filtered = [...allSpots];

    // type filter
    if(activeFilters.type !== "all"){
        filtered = filtered.filter(spot => spot.type === activeFilters.type);
    }

    // wifi filter
    if(activeFilters.wifi){
        filtered = filtered.filter(spot => spot.wifi === true);
    }

    // outlets filter
    if(activeFilters.outlets) {
        filtered = filtered.filter(spot => spot.outlets === true);
    }

    // noise filter
    if(activeFilters.noise){
        filtered = filtered.filter(spot => spot.noise_level === activeFilters.noise);
    }

    renderSpots(filtered);

    //update the count to show how many spots match the current filters
    updateSpotCount(filtered.length);
}

// Filter Chips
const chips = document.querySelectorAll(".filter-chip");

chips.forEach(chip => {
    chip.addEventListener("click", () => {
        const filter = chip.dataset.filter; // data-filter in html 

        // handle type filters
        if(["all", "library", "cafe", "outdoor", "common_area",]. includes(filter)){
            document.querySelectorAll(".filter-chips .filter-chip[data-filter]").forEach(c => {
                if(["all", "library", "cafe", "outdoor", "common_area"].includes(c.dataset.filter)){
                        c.classList.remove("active");
                    }
                });
            chip.classList.add("active");
            activeFilters.type = filter;
        }
        // handle wifi toggle
        if(filter === "wifi"){
            activeFilters.wifi = !activeFilters.wifi;
            chip.classList.toggle("active");
        }

        // handle outlet toggle
        if(filter === "outlets"){
            activeFilters.outlets = !activeFilters.outlets;
            chip.classList.toggle("active");
        }

        // handle noise toggle
        if(["quiet", "moderate", "lively"].includes(filter)){
            const noiseChips = document.querySelectorAll(
                `[data-filter="quiet"], [data-filter="moderate"], [data-filter="lively]`
            );

            if(activeFilters.noise === filter){
                activeFilters.noise = null;
                chip.classList.remove("active");
            } else {
                noiseChips.forEach( c => c.classList.remove("active"));
                activeFilters.noise = filter;
                chip.classList.add("active");
            }
        }

        filterSpots();
    })
})

loadCampus();