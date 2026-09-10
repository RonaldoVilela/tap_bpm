const themes = ["light", "dark"];
let current_site_theme_id = Number(sessionStorage.getItem("site_theme_id")) || 0;

const theme_button = document.getElementById("theme_changer");

const countLabel = document.getElementById("bpm_value");
const tap_button = document.getElementById("tap_container");
const avarage_ms_label = document.getElementById("avarage_ms_label");
const time_samples_label = document.getElementById("tap_time_samples_list");

let last_tap_time = Date.now();

const max_tap_time_samples = 12;
const tap_time_samples = new Array(max_tap_time_samples).fill(60000);
let current_sample_id = 0;

let avarage_sample_ms = 0;

document.documentElement.setAttribute("data-bs-theme", themes[current_site_theme_id]);

window.addEventListener('keydown', function event(e){ 
    if (e.code === 'Space' && e.target.nodeName !== 'INPUT' && e.target.nodeName !== 'TEXTAREA') {
        e.preventDefault();
    }
})

function Tap(){
    UpdateBPM();
    countLabel.textContent = CalculateBpm();
    tap_button.style.backgroundColor = "blueviolet";
    tap_button.style.transition = "";
    setTimeout(function(){
        tap_button.style.backgroundColor = "var(--bs-tertiary-bg)";
        tap_button.style.transition = "background-color 0.4s ease";
    
    },0)

    
    avarage_ms_label.textContent = `avarage_tap_interval (ms): ${avarage_sample_ms}`;
}
 
function UpdateBPM(){
    const elapsedTime = Math.floor(Date.now() - last_tap_time);

    tap_time_samples[current_sample_id] = elapsedTime;
    current_sample_id = (current_sample_id+1)%max_tap_time_samples;

    last_tap_time = Date.now();


    // Debug tool (will be removed on final version)
    
    let samples_s = "";
    let sample_sum = 0;
    for(let i=0; i < max_tap_time_samples; i++){
        samples_s += `${tap_time_samples[i]} | `;
        sample_sum += tap_time_samples[i];
    }
    time_samples_label.textContent = samples_s;

    avarage_sample_ms = sample_sum/max_tap_time_samples;

    // -------------------------------------------
}


function CalculateBpm(){
    return Math.ceil(60000/avarage_sample_ms);
}

theme_button.onclick = function toggleTheme(){
    current_site_theme_id = (current_site_theme_id+1)%themes.length;~
    sessionStorage.setItem("site_theme_id", current_site_theme_id);
    sessionStorage.setItem("site_theme", themes[current_site_theme_id]);
    document.documentElement.setAttribute("data-bs-theme", themes[current_site_theme_id]);
}
theme_button.addEventListener("keydown", function(event) {
    theme_button.blur();
});


document.addEventListener("keydown", function(event) {
    Tap();
});