// Keep all necessary files in scripts.js file

function timeLeft() {
    var today = new Date();

    // Create a Date object for October 31st, 2023
    var oct31st2023 = new Date("2023-10-31");

    // Calculate the time difference in milliseconds
    var timeDifference = oct31st2023 - today;
    var daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    var hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    var ele = document.getElementById("time-to-end")
    ele.textContent = `${daysLeft} Days, ${hoursLeft}:${minutesLeft} Hours`


}

function toggleUiMode() {
    var element = document.body;
    element.classList.toggle("light-ui-mode");  
    var header = document.getElementsByClassName("header-text")[0];
    header.classList.toggle("header-toggle");
    var toggleBtn = document.getElementsByClassName("toggle-btn")[0];
    if(toggleBtn.value === '☀️') {
        toggleBtn.textContent = "🌖";
        toggleBtn.value = "🌖";
    } else if (toggleBtn.value === '🌖'){
        toggleBtn.classList.toggle("toggle-icon-sun");
        toggleBtn.textContent = "☀️";
        toggleBtn.value = "☀️";
    }
}