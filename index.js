
const countLabel = document.getElementById("count");
const tap_button = document.getElementById("tap_button");
const avarage_ms_label = document.getElementById("avarage_ms_label");
const time_samples_label = document.getElementById("tap_time_samples_list");

let last_tap_time = Date.now();

const max_tap_time_samples = 14;
const tap_time_samples = new Array(max_tap_time_samples).fill(60000);
let current_sample_id = 0;

let avarage_sample_ms = 0;

function Tap(){
    UpdateBPM();
    countLabel.textContent = CalculateBpm();

    
    avarage_ms_label.textContent = `avarage_tap_interval (ms): ${avarage_sample_ms}`;
}
tap_button.onclick = Tap;
 
function UpdateBPM(){
    const elapsedTime = Math.floor(Date.now() - last_tap_time);//for(int i)
    //console.log(`${tap_time_samples.length}`);
    tap_time_samples[current_sample_id] = elapsedTime;
    current_sample_id = (current_sample_id+1)%max_tap_time_samples;

    last_tap_time = Date.now();


    let samples_s = "";
    let sample_sum = 0;
    for(let i=0; i < max_tap_time_samples; i++){
        samples_s += `${tap_time_samples[i]} | `;
        sample_sum += tap_time_samples[i];
    }
    time_samples_label.textContent = samples_s;

    avarage_sample_ms = sample_sum/max_tap_time_samples;
}


function CalculateBpm(){
    
    //console.log(samples_s);
    return Math.ceil(60000/avarage_sample_ms);
}


document.addEventListener("keydown", function(event) {
    Tap();
    //console.log("Tecla pressionada:", event.key);
});