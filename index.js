const themes = ["light", "dark"];
let current_site_theme_id = Number(sessionStorage.getItem("site_theme_id")) || 0;



const theme_button = document.getElementById("theme_changer");
let theme_button_image = document.getElementById("theme_img");

if(current_site_theme_id == 0){
    theme_button_image.setAttribute("src", "assets/night_icon.png")
    theme_button_image.style.filter = "invert(100%)"
}else{
    theme_button_image.setAttribute("src", "assets/day_icon.png")
    theme_button_image.style.filter = "invert(0%)"
}

const countLabel = document.getElementById("bpm_value");
const tap_button = document.getElementById("tap_container");

let last_tap_time = Date.now();

const max_tap_time_samples = 20;
const tap_time_samples = new Array(max_tap_time_samples).fill(60000);
let current_sample_id = 0;
let sample_max_variation_error = 200;

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

    last_tap_time = Date.now();


    // Debug tool (will be removed on final version)
    let samples_beign_considered = 1;
    
    let samples_s = "";
    let sample_sum = tap_time_samples[current_sample_id];

    for(let i = (current_sample_id-1+max_tap_time_samples)%max_tap_time_samples; i != current_sample_id; i = (i-1+max_tap_time_samples)%max_tap_time_samples){
        console.debug(i);
        if(Math.abs(tap_time_samples[(i+1)%max_tap_time_samples] - tap_time_samples[i]) > sample_max_variation_error){break;}
        samples_beign_considered++;

        sample_sum += tap_time_samples[i];
    }
    avarage_sample_ms = sample_sum/samples_beign_considered;

    current_sample_id = (current_sample_id+1)%max_tap_time_samples;

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

    if(current_site_theme_id == 0){
        theme_button_image.setAttribute("src", "assets/night_icon.png")
        theme_button_image.style.filter = "invert(100%)"
    }else{
        theme_button_image.setAttribute("src", "assets/day_icon.png")
        theme_button_image.style.filter = "invert(0%)"
    }
}
theme_button.addEventListener("keydown", function(event) {
    theme_button.blur();
});


document.addEventListener("keydown", function(event) {
    Tap();
});