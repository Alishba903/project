// Habit Tracker JavaScript

const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');

// Load habits from localStorage
let habits = JSON.parse(localStorage.getItem('habits')) || [];

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

function renderHabits() {
    habitList.innerHTML = '';
    habits.forEach((habit, idx) => {
        const li = document.createElement('li');
        li.className = 'habit-item' + (habit.done ? ' habit-done' : '');

        const nameSpan = document.createElement('span');
        nameSpan.className = 'habit-name';
        nameSpan.textContent = habit.name;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'habit-actions';

        const doneBtn = document.createElement('button');
        doneBtn.textContent = habit.done ? '✓' : '○';
        doneBtn.title = habit.done ? 'Mark as not done' : 'Mark as done';
        doneBtn.onclick = () => {
            habits[idx].done = !habits[idx].done;
            saveHabits();
            renderHabits();
        };

        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑';
        delBtn.title = 'Delete habit';
        delBtn.onclick = () => {
            habits.splice(idx, 1);
            saveHabits();
            renderHabits();
        };

        actionsDiv.appendChild(doneBtn);
        actionsDiv.appendChild(delBtn);

        li.appendChild(nameSpan);
        li.appendChild(actionsDiv);
        habitList.appendChild(li);
    });
}

habitForm.onsubmit = function(e) {
    e.preventDefault();
    const name = habitInput.value.trim();
    if (name) {
        habits.push({ name, done: false });
        saveHabits();
        renderHabits();
        habitInput.value = '';
    }
};

// Initial render
renderHabits();

// Timer functionality
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-timer');
const pauseBtn = document.getElementById('pause-timer');
const resetBtn = document.getElementById('reset-timer');
const timerTaskName = document.getElementById('timer-task-name');

function updateTimerDisplay() {
    const hrs = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(timerSeconds % 60).padStart(2, '0');
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

startBtn.onclick = startTimer;
pauseBtn.onclick = pauseTimer;
resetBtn.onclick = resetTimer;

// Optional: Set timer task name from selected habit
habitList.onclick = function(e) {
    const li = e.target.closest('.habit-item');
    if (li) {
        const name = li.querySelector('.habit-name').textContent;
        timerTaskName.textContent = `Current Task: ${name}`;
    }
};

updateTimerDisplay();

// --- Streak Functionality ---
const streakDisplay = document.getElementById('streak-display');
const bestStreakDisplay = document.getElementById('best-streak-display');

function getToday() {
    const now = new Date();
    return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getStreakData() {
    return JSON.parse(localStorage.getItem('streakData') || '{"current":0,"best":0,"lastDate":""}');
}

function setStreakData(data) {
    localStorage.setItem('streakData', JSON.stringify(data));
}

function updateStreakDisplay() {
    const streakData = getStreakData();
    streakDisplay.textContent = `Current Streak: ${streakData.current} day${streakData.current === 1 ? '' : 's'}`;
    bestStreakDisplay.textContent = `Best Streak: ${streakData.best} day${streakData.best === 1 ? '' : 's'}`;
}

function markStreakIfNeeded() {
    const streakData = getStreakData();
    const today = getToday();
    if (streakData.lastDate !== today) {
        // Only count as streak if at least one habit is done today
        if (habits.some(h => h.done)) {
            const lastDate = new Date(streakData.lastDate);
            const now = new Date(today);
            const diff = (now - lastDate) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                streakData.current += 1;
            } else {
                streakData.current = 1;
            }
            if (streakData.current > streakData.best) {
                streakData.best = streakData.current;
            }
            streakData.lastDate = today;
            setStreakData(streakData);
        }
    }
}

// When a habit is marked as done, check streak
habitList.addEventListener('click', function(e) {
    if (e.target && e.target.textContent === '✓') {
        markStreakIfNeeded();
        updateStreakDisplay();
    }
});

// On load, update streak display
updateStreakDisplay();

// Manual Update Streak Button
const updateStreakBtn = document.getElementById('update-streak-btn');
if (updateStreakBtn) {
    updateStreakBtn.onclick = function() {
        markStreakIfNeeded();
        updateStreakDisplay();
    };
}