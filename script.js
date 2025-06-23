// Habit Tracker JavaScript

const habitForm = document.getElementById("habit-form");
const habitInput = document.getElementById("habit-input");
const habitList = document.getElementById("habit-list");
const darkModeBtn = document.getElementById("toggle-dark-mode");
const editModal = document.getElementById("edit-modal");
const closeModalBtn = document.getElementById("close-modal");
const editHabitInput = document.getElementById("edit-habit-input");
const saveEditBtn = document.getElementById("save-edit-btn");
const timerDisplay = document.getElementById("timer-display");
const timerTaskName = document.getElementById("timer-task-name");
const streakDisplay = document.getElementById("streak-display");
const bestStreakDisplay = document.getElementById("best-streak-display");
const progressViewContainer = document.getElementById("progress-view-container");
const updateStreakBtn = document.getElementById("update-streak-btn");
const progressTabs = document.querySelectorAll(".progress-tab");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let editingIdx = null;
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

// Dark Mode Functionality
function setDarkMode(on) {
    document.body.classList.toggle("dark-mode", on);
    localStorage.setItem("darkMode", on ? "1" : "0");
}

darkModeBtn.onclick = () => setDarkMode(!document.body.classList.contains("dark-mode"));
if (localStorage.getItem("darkMode") === "1") setDarkMode(true);

// Habit Management Functions
function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

function renderHabits() {
    habitList.innerHTML = "";
    habits.forEach((habit, idx) => {
        const li = createHabitElement(habit, idx);
        habitList.appendChild(li);
    });
}

function createHabitElement(habit, idx) {
    const li = document.createElement("li");
    li.className = "habit-item" + (habit.done ? " habit-done" : "");

    const nameSpan = document.createElement("span");
    nameSpan.className = "habit-name";
    nameSpan.textContent = habit.name;
    nameSpan.title = "Click to edit inline";
    nameSpan.onclick = (e) => inlineEditHabit(e, idx, habit.name);

    const actionsDiv = createHabitActions(idx);
    li.appendChild(nameSpan);
    li.appendChild(actionsDiv);
    return li;
}

function createHabitActions(idx) {
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "habit-actions";

    const doneBtn = createButton(habits[idx].done ? "✓" : "○", "Mark as done", () => {
        habits[idx].done = !habits[idx].done;
        saveHabits();
        saveHabitCompletion();
        renderHabits();
    });

    const editBtn = createButton("✏️", "Edit habit (modal)", (e) => {
        e.stopPropagation();
        openEditModal(idx);
    });

    const delBtn = createButton("🗑", "Delete habit", () => {
        habits.splice(idx, 1);
        saveHabits();
        renderHabits();
    });

    actionsDiv.appendChild(doneBtn);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(delBtn);
    return actionsDiv;
}

function createButton(text, title, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.title = title;
    button.onclick = onClick;
    return button;
}

function inlineEditHabit(e, idx, currentName) {
    e.stopPropagation();
    const li = e.target.parentElement;
    if (li.querySelector(".inline-edit-input")) return;

    const input = document.createElement("input");
    input.type = "text";
    input.value = currentName;
    input.className = "inline-edit-input";
    input.onkeydown = (ev) => {
        if (ev.key === "Enter") saveInlineEdit(idx, input.value.trim());
        else if (ev.key === "Escape") cancelInlineEdit();
    };
    input.onblur = cancelInlineEdit;

    li.replaceChild(input, e.target);
    input.focus();
    input.select();
}

function saveInlineEdit(idx, newName) {
    if (newName) {
        habits[idx].name = newName;
        saveHabits();
        renderHabits();
    } else {
        cancelInlineEdit();
    }
}

function cancelInlineEdit() {
    renderHabits();
}

// Modal Edit Logic
function openEditModal(idx) {
    editingIdx = idx;
    editHabitInput.value = habits[idx].name;
    editModal.style.display = "flex";
    setTimeout(() => editHabitInput.focus(), 100);
}

function closeEditModal() {
    editModal.style.display = "none";
    editingIdx = null;
}

closeModalBtn.onclick = closeEditModal;
window.onclick = (event) => {
    if (event.target === editModal) closeEditModal();
};

editHabitInput.onkeydown = (e) => {
    if (e.key === "Enter") saveEditBtn.click();
    if (e.key === "Escape") closeEditModal();
};

saveEditBtn.onclick = () => {
    const newName = editHabitInput.value.trim();
    if (newName && editingIdx !== null) {
        habits[editingIdx].name = newName;
        saveHabits();
        renderHabits();
        closeEditModal();
    }
};

// Habit Form Submission
habitForm.onsubmit = (e) => {
    e.preventDefault();
    const name = habitInput.value.trim();
    if (name) {
        habits.push({ name, done: false });
        saveHabits();
        renderHabits();
        habitInput.value = "";
    }
};

// Timer Functionality
function updateTimerDisplay() {
    const hrs = String(Math.floor(timerSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(timerSeconds % 60).padStart(2, "0");
    timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
}

function startTimer() {
    if (!timerRunning) {
        timerRunning = true;
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    timerSeconds = 0;
    updateTimerDisplay();
}

document.getElementById("start-timer").onclick = startTimer;
document.getElementById("pause-timer").onclick = pauseTimer;
document.getElementById("reset-timer").onclick = resetTimer;

// Streak Functionality
function getToday() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function getStreakData() {
    return JSON.parse(localStorage.getItem("streakData") || '{"current":0,"best":0,"lastDate":""}');
}

function setStreakData(data) {
    localStorage.setItem("streakData", JSON.stringify(data));
}

function updateStreakDisplay() {
    const streakData = getStreakData();
    streakDisplay.textContent = `Current Streak: ${streakData.current} day${streakData.current === 1 ? "" : "s"}`;
    bestStreakDisplay.textContent = `Best Streak: ${streakData.best} day${streakData.best === 1 ? "" : "s"}`;
}

function markStreakIfNeeded() {
    const streakData = getStreakData();
    const today = getToday();
    if (streakData.lastDate !== today) {
        if (habits.some((h) => h.done)) {
            const lastDate = new Date(streakData.lastDate);
            const now = new Date(today);
            const diff = (now - lastDate) / (1000 * 60 * 60 * 24);
            streakData.current = (diff === 1) ? streakData.current + 1 : 1;
            if (streakData.current > streakData.best) {
                streakData.best = streakData.current;
            }
            streakData.lastDate = today;
            setStreakData(streakData);
        }
    }
}

habitList.addEventListener("click", (e) => {
    if (e.target && e.target.textContent === "✓") {
        markStreakIfNeeded();
        updateStreakDisplay();
    }
});

// Progress View Logic
progressTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelector(".progress-tab.active").classList.remove("active");
        tab.classList.add("active");
        renderProgressView(tab.dataset.view);
    });
});

function renderProgressView(view) {
    if (view === "daily") {
        renderDailyCalendar();
    } else {
        progressViewContainer.innerHTML = `<div style="color:#764ba2;font-weight:600;">${view.charAt(0).toUpperCase() + view.slice(1)} chart coming soon!</div>`;
    }
}

function renderDailyCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const completion = getHabitCompletionDates();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let html = `<div class="calendar-header">${monthNames[month]} ${year}</div>`;
    html += '<table class="calendar-table"><thead><tr>';
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(d => html += `<th>${d}</th>`);
    html += "</tr></thead><tbody><tr>";

    for (let i = 0; i < startDay; i++) html += "<td></td>";
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const done = completion[dateStr];
        html += `<td class="calendar-cell${done ? " calendar-done" : ""}">${d}</td>`;
        if ((startDay + d) % 7 === 0) html += "</tr><tr>";
    }
    html += "</tr></tbody></table>";
    progressViewContainer.innerHTML = html;
}

function getHabitCompletionDates() {
    return JSON.parse(localStorage.getItem("habitCompletion") || "{}");
}

function saveHabitCompletion() {
    const completion = getHabitCompletionDates();
    const today = new Date().toISOString().slice(0, 10);
    completion[today] = habits.some((h) => h.done);
    localStorage.setItem("habitCompletion", JSON.stringify(completion));
}

// Initial Render
renderHabits();
updateStreakDisplay();
if (progressViewContainer) renderProgressView("daily");
