let sections = document.querySelectorAll('section');
let nav_items = document.querySelectorAll('.nav-item')

function showSection(sectionId) {
    sections.forEach(section => {
      if (section.getAttribute("id") === sectionId) {
        section.classList.add('show');
        section.classList.remove('hide');
      } else {
        section.classList.add('hide');
        section.classList.remove('show');
      }
    });
  }

nav_items.forEach(nav_item => {
    nav_item.addEventListener('click', (e) => {
        let sectionId = nav_item.dataset.section;
        showSection(sectionId);
    })
});

// **************************** world-clock ****************************
function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}
function formatDate(timezone){
    dt = new Date();
    let convertedDate = convertTZ(dt, timezone);
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let htime = dateAndTimeFormat(convertedDate.getHours());
    let mtime = dateAndTimeFormat(convertedDate.getMinutes());
    let stime = dateAndTimeFormat(convertedDate.getSeconds());
    let dayofweek = days[convertedDate.getDay()];
    let date = dateAndTimeFormat(convertedDate.getDate());
    let month = months[convertedDate.getMonth()];
    let year = convertedDate.getFullYear();
    let formattedDate = htime + ":" + mtime + ":" + stime; 
    formattedDate += "<br>" + dayofweek + ", " + date + " " + month + " " + year;
    return formattedDate;
}
const update_time = () =>{
    let dt = new Date();
    
    let current_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById("india").innerHTML = formatDate(current_timezone);
    document.getElementById("australia").innerHTML = formatDate('Australia/Sydney')
    document.getElementById("england").innerHTML = formatDate('Europe/London')
}
setInterval(update_time, 1000);
function dateAndTimeFormat(time) {
    if (time < 10 && time.length != 2) {
        return '0' + time;
    }
    return time;
}

// **************************** alarm-clock ****************************
let audio = new Audio('alarm_audio.mp3');
audio.loop = true;
let alarmsList = []; 
let alarmsTimeouts = {};
let alarmsListContainer = document.querySelector('#alarmsListContainer');
let count = 0;
let isAlarmRinging = false;
let now_time = null;
function getFormattedTime(date){
    let hrs = dateAndTimeFormat(date.getHours());
    let mins = dateAndTimeFormat(date.getMinutes());
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let formattedTime = `${day}/${month}/${year} ${hrs}:${mins}`;
    return formattedTime
}
function setAlarm(){
    let alarm = document.getElementById("alarm").value;
    let alarmDate = new Date(alarm); 
    let currentDateTime = new Date();
    currentDateTime.setSeconds(0);
    currentDateTime.setMilliseconds(0);
    if(!isNaN(alarmDate)){
        alarmDate.setSeconds(0);
        alarmDate.setMilliseconds(0);
        if (alarmDate >= currentDateTime) {
            alarm_Time = getFormattedTime(alarmDate);
            if(!alarmsList.includes(alarm_Time)){
                alarmsList.push(alarm_Time);
                showNewAlarm(alarm_Time);
                document.getElementById("alarm").value = "";
                clearTimeout(alarmsTimeouts[alarm_Time]);
                alarmsTimeouts[alarm_Time] = setTimeout(() => {
                    startAlarm(alarm_Time);
                }, alarmDate.getTime() - Date.now());
            } 
            else{
                alert("Alarm for " + alarm_Time + " is already set!");
            }
        }
        else{
            alert("Please enter a future date and time for the alarm!");
        }
    } 
    else{
        alert("Invalid Time!")
    }     
}
function startAlarm(alarmTime) {
    audio.play();
    alert("The time is : " + alarmTime);
    isAlarmRinging = true;
    now_time = alarmTime;
}
function stopAlarm() {
    audio.pause();
    audio.currentTime = 0;
    if (isAlarmRinging) {
        clearTimeout(alarmsTimeouts[now_time]);
        isAlarmRinging = false;
        now_time = null;
        alert("Alarm Stopped!");
    }
}
alarmsListContainer.addEventListener('click', e=> {
    if(e.target.classList.contains("deleteAlarm")){
        let alarmTime = e.target.value;
        e.target.parentElement.remove();
        if (alarmTime === now_time && isAlarmRinging) {
            stopAlarm();
        }
        clearTimeout(alarmsTimeouts[alarmTime]);
        delete alarmsTimeouts[alarmTime];
    }    
})
function remove(value) {
    let newList = alarmsList.filter((time) => time != value);
    alarmsList.length = 0;
    alarmsList.push.apply(alarmsList, newList);
    if (value === now_time && isAlarmRinging) {
        stopAlarm();
    }
    clearTimeout(alarmsTimeouts[value]);
    delete alarmsTimeouts[value];
}
function showNewAlarm(newAlarm){
    let html = "<li>";
    html += "<span>" + newAlarm + "</span>";
    html += "<button class='deleteAlarm' id='delete-button[" + count + "]' onclick='remove(this.value)' value='" + newAlarm + "'>Delete Alarm</button>";       
    html += "</li>";
    count++;
    alarmsListContainer.innerHTML += html;
}

// **************************** timer ****************************
let timer = null, isTimerStart = false;
function setTimer(time_input) {
    if(time_input !== "" && isTimerStart){
        let user_date = new Date(time_input);
        let now = new Date();
        let diff = (user_date - now)/1000; // in seconds
        if(diff < 0) return;
        let days = Math.floor(diff/(60 * 60 * 24));
        diff %= 60 * 60 * 24;
        let hours = Math.floor(diff/(60 * 60));
        diff %= 60 * 60;
        let minutes = Math.floor(diff/60);
        let seconds = Math.floor(diff % 60);
        document.getElementById("days").value = days;
        document.getElementById("hours").value = hours;
        document.getElementById("minutes").value = minutes;
        document.getElementById("seconds").value = seconds;
    }
}
function startTimer(){
    if(timer != null){
        clearInterval(timer);
    }
    isTimerStart = true;
    let time_input = document.getElementById("countdown-timer").value;
    if(time_input !== ""){
        document.getElementById("countdown-timer").disabled = true;
        document.getElementById("time-input-label").hidden = true;
        document.getElementById("timer-start-btn").hidden = true;
        document.getElementById("timer-stop-btn").hidden = false;
        timer = setInterval(
            () => {
                setTimer(time_input)
            },
            1000
        )
    }
}
function stopTimer(){
    clearInterval(timer);
    isTimerStart = false;
    timer = null;
    document.getElementById("countdown-timer").disabled = false;
    document.getElementById("time-input-label").hidden = false;
    document.getElementById("timer-start-btn").hidden = false;
    document.getElementById("timer-stop-btn").hidden = true;

    document.getElementById("countdown-timer").value = "";
    document.getElementById("days").value = 0;
    document.getElementById("hours").value = 0;
    document.getElementById("minutes").value = 0;
    document.getElementById("seconds").value = 0;
}

// **************************** stopwatch ****************************
let stopwatch = null;
let hrs = 0, mins = 0, secs = 0;
function setStopwatch(){
    secs++;
    if(secs == 60){
        secs = 0;
        mins++;
        if(mins == 60){
            mins = 0;
            hrs++;
        }
    }
    document.getElementById("hrs").value = hrs;
    document.getElementById("mins").value = mins;
    document.getElementById("secs").value = secs;
}
function startStopwatch(){
    if(stopwatch != null){
        clearInterval(stopwatch);
    }
    stopwatch = setInterval(setStopwatch,1000)
}
function stopStopwatch(){
    clearInterval(stopwatch);
    stopwatch = null;
}
function resetStopwatch(){
    clearInterval(stopwatch);
    stopwatch = null;
    hrs = 0, mins = 0, secs = 0;
    document.getElementById("hrs").value = 0;
    document.getElementById("mins").value = 0;
    document.getElementById("secs").value = 0;
}