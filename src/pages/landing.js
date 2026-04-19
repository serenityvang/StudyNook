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
    setSchoolSearch(campuses);
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


function renderSearchDropdown(matches, dropdown){

    dropdown.innerHTML = "";
    if(!matches.length){
        dropdown.style.display = "none";
        return;
    }

    matches.forEach((campus) => {
        const item = document.createElement("a");
        item.className = ("search-item");
        item.href = `/campus.html?school=${campus.slug}`;
        item.textContent = campus.name;

        dropdown.appendChild(item);
    });

    dropdown.style.display = "block";
}

function setSchoolSearch(campuses) {
    const input = document.getElementById("schoolSearch");
    const dropdown = document.getElementById("searchDropdown");
    const button = document.querySelector(".search-bar button");



    function runSearch() {
        const query = input.value.toLowerCase().trim();

        if(!query){
            return;
        }

        const matches = campuses.filter((campus) => campus.name.toLowerCase().includes(query));

        if(matches.length > 0){
            window.location.href = `/campus.html?school=${matches[0].slug}`;
        }
    }
    
    
    input.addEventListener("input", () => {
        const query = input.value.toLowerCase().trim();

        if(!query) {
            dropdown.style.display = "none";
            dropdown.innerHTML = "";
            return;
        }

        const matches = campuses.filter((campus) => campus.name.toLowerCase().includes(query));

        renderSearchDropdown(matches, dropdown);
    })

    button.addEventListener("click", () => {
        runSearch();
    });

    input.addEventListener("keydown", (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            runSearch();
        }
    });
}


const leftBtn = document.getElementById("arrowLeft");
const rightBtn = document.getElementById("arrowRight");
const schoolsRow = document.querySelector(".schools-row");

leftBtn.addEventListener("click", () =>{
    schoolsRow.scrollBy({
        left: -300,
        behavior: "smooth"
    });
});

rightBtn.addEventListener("click", () => {
    schoolsRow.scrollBy({
        left: 300,
        behavior:"smooth"
    });
});


loadCampuses()
