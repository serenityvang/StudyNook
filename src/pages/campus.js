import { supabase } from '../lib/supabase.js'
import { Navbar } from '../components/navbar.js'
// import { SpotCard } from '../components/spotCard.js'


// init navbar
const navContainer = document.getElementById('navbar')
navContainer.appendChild(Navbar())

//Read URL Parameters
const params = new URLSearchParams(window.location.serach);
const slug = params.get("school");

//Validating slug
if(!slug) {
    window.location.href = '/index.html';
}

if(!/^[a-z0-9-]+$/.test(slug)) {
    window.location.href = 'index.html';
}

let allSpots = [];

let activeFilters = {
    type: "all",
    wifi: false,
    outlets: false,
    noise: null
}

// load campuses
async function loadFunction() {

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


    


}

// load spots for campuses

//call supabase for data
const {data: spots, error} = await supabase
    .from("spots")
    .select("idd, name, location_description, type, noise_level, wifi, outlets, hours, description, photo_url")
    .eq("campus_id", campusId)
    .eq("status", "approved")
    .order("name", {ascending: true})
    .limit(100)