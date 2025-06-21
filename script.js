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