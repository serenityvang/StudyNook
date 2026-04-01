import { supabase } from '../lib/supabase.js'
import { Navbar } from '../components/navbar.js'
import { SchoolCard } from '../components/schoolCard.js'

// init navbar
const navContainer = document.getElementById('navbar')
navContainer.appendChild(Navbar())


//load campuses
async function loadCampuses() {
    const {data: campuses, error} = await supabase
        .from("campuses")
        .select("id, name, city, state, slug")
        .order("name", {ascending: true})

    if (error) {
        console.error(error)
        return;
    }

    if(!campuses || campuses.length === 0){
        console.log("No campuses found");
        return;
    }

    renderSchoolCards(campuses);
}

function renderSchoolCards(campuses) {
    const row = document.getElementById("schoolsRow");

    campuses.forEach(campus => {
        row.appendChild(SchoolCard(campus))
    });
}

loadCampuses()
