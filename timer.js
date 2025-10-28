// Time in seconds
let focusTime = 25 * 60;
let shortBreak = 5 * 60;
let longBreak = 15 * 60;

// Variables to keep track on what phase and condition
let currentTime = focusTime;   // Starts on 25 min focus 
let timer;                      // Used in setInterval()
let running = false;            // Checks if timer is running 
let phase = "focus";            // What phase
let focusCount = 0;                 // Counts all the focus cycles

// Get the elements from timer.html
let phaseEL = document.getElementById("phase");
let timeEl = document.getElementById("time");
let startBtn = document.getElementById("startBtn");
let pauseBtn = document.getElementById("pauseBtn");
let resetBtn = document.getElementById("resetBtn");
let skipBtn = document.getElementById("skipBtn");
let toBoardBtn = document.getElementById("toBoardBtn");

        /* Functions */
    
// Updates the text on screen
function updateDisplay() {
    // Calcs minutes and seconds
    let minutes = Math.floor(currentTime / 60);
    let seconds = currentTime % 60;

     if(seconds < 10) seconds = "0" + seconds; // Adds a 0 if seconds is below 10 seconds

     // Writes out time
     timeEl.textContent = minutes + ":" + seconds;
    
     // Shows what phase is running
     if (phase === "focus"){
        phaseEL.textContent = "Focus"
     } else if (phase === "short") {
        phaseEL.textContent = "Short Break";
     } else {
        phaseEL.textContent = "Long Break";
     }
}

// Runs every second when timer is running
function tick() {
    if(currentTime > 0) {
        currentTime--;      //Count down
        updateDisplay();    // Calls updateDisplay() to update screen
    } else {
        //When time is up, go to next phase
        clearInterval(timer);
        running = false;
        nextPhase();
    }
}

// Start timer
function startTimer() {
    if(!running) {          // only start if its not running
        running = true;
        timer = setInterval(tick, 1000);    //Runs tick() every second
    }
}
// Pause timer
function pauseTimer() {
    clearInterval(timer);
    running = false;
}
// Reset everything to beginning
function resetTimer() {
    clearInterval(timer);
    running = false;
    phase = "focus";
    currentTime = focusTime;
    focusCount = 0;
    updateDisplay();
}

// To the next phase
function nextPhase() {
    if (phase === "focus"){
        focusCount++;

        //After 4 focusphases - long break
        if(focusCount === 4) {
            phase = "long";
            currentTime = longBreak;
            focusCount = 0;     //Resets focusCount
        } else {
            phase = "short";
            currentTime = shortBreak;
        }

    } else {
        // After break - focus phase again
        phase = "focus";
        currentTime = focusTime;
    }

    updateDisplay();
}

//Go back to TrelloDoro-board
function goToBoard() {
    window.location.href = "home.html";
}

    /* Connect buttons to functions */

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
skipBtn.addEventListener("click", nextPhase);
toBoardBtn.addEventListener("click", goToBoard);

// Shows 25:00 and "Focus" when page is loaded
updateDisplay();