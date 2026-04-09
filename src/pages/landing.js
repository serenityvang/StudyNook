import { supabase } from '../lib/supabase.js'
import { Navbar } from '../components/navbar.js'
import { SchoolCard, createAddCard } from '../components/schoolCard.js'

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


// creates the different school cards
function renderSchoolCards(campuses) {
    const row = document.getElementById("schoolsRow");

    row.innerHTML = "";

    campuses.forEach(campus => {
        row.appendChild(SchoolCard(campus))
    });
    row.appendChild(createAddCard());
}


loadCampuses()
