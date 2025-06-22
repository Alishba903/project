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
        nameSpan.title = 'Click to edit inline';
        // Inline edit on click
        nameSpan.onclick = function(e) {
            e.stopPropagation();
            if (li.querySelector('.inline-edit-input')) return;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = habit.name;
            input.className = 'inline-edit-input';
            input.onkeydown = function(ev) {
                if (ev.key === 'Enter') {
                    saveInlineEdit();
                } else if (ev.key === 'Escape') {
                    cancelInlineEdit();
                }
            };
            input.onblur = cancelInlineEdit;
            function saveInlineEdit() {
                const newName = input.value.trim();
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
            li.replaceChild(input, nameSpan);
            input.focus();
            input.select();
        };

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'habit-actions';

        const doneBtn = document.createElement('button');
        doneBtn.textContent = habit.done ? '✓' : '○';
        doneBtn.title = habit.done ? 'Mark as not done' : 'Mark as done';
        doneBtn.onclick = () => {
            habits[idx].done = !habits[idx].done;
            saveHabits();
            saveHabitCompletion();
            renderHabits();
        };

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.title = 'Edit habit (modal)';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            openEditModal(idx);
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
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(delBtn);

        li.appendChild(nameSpan);
        li.appendChild(actionsDiv);
        habitList.appendChild(li);
    });
}

// Modal edit logic
const editModal = document.getElementById('edit-modal');
const closeModalBtn = document.getElementById('close-modal');
const editHabitInput = document.getElementById('edit-habit-input');
const saveEditBtn = document.getElementById('save-edit-btn');
let editingIdx = null;

function openEditModal(idx) {
    editingIdx = idx;
    editHabitInput.value = habits[idx].name;
    editModal.style.display = 'flex';
    setTimeout(() => editHabitInput.focus(), 100);
}
function closeEditModal() {
    editModal.style.display = 'none';
    editingIdx = null;
}
closeModalBtn.onclick = closeEditModal;
window.onclick = function(event) {
    if (event.target === editModal) closeEditModal();
};
editHabitInput.onkeydown = function(e) {
    if (e.key === 'Enter') saveEditBtn.click();
    if (e.key === 'Escape') closeEditModal();
};
saveEditBtn.onclick = function() {
    const newName = editHabitInput.value.trim();
    if (newName && editingIdx !== null) {
        habits[editingIdx].name = newName;
        saveHabits();
        renderHabits();
        closeEditModal();
    }
};

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

// --- Progress View Logic ---
const progressTabs = document.querySelectorAll('.progress-tab');
const progressViewContainer = document.getElementById('progress-view-container');

progressTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelector('.progress-tab.active').classList.remove('active');
        tab.classList.add('active');
        renderProgressView(tab.dataset.view);
    });
});

function getHabitCompletionDates() {
    // Example: { '2025-06-21': true, '2025-06-22': false, ... }
    return JSON.parse(localStorage.getItem('habitCompletion') || '{}');
}

function renderProgressView(view) {
    if (view === 'daily') {
        renderDailyCalendar();
    } else if (view === 'weekly') {
        progressViewContainer.innerHTML = '<div style="color:#764ba2;font-weight:600;">Weekly chart coming soon!</div>';
    } else if (view === 'monthly') {
        progressViewContainer.innerHTML = '<div style="color:#764ba2;font-weight:600;">Monthly chart coming soon!</div>';
    }
}

function renderDailyCalendar() {
    // Show current month calendar, highlight days with any habit completed
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const completion = getHabitCompletionDates();
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let html = `<div class="calendar-header">${monthNames[month]} ${year}</div>`;
    html += '<table class="calendar-table"><thead><tr>';
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    days.forEach(d => html += `<th>${d}</th>`);
    html += '</tr></thead><tbody><tr>';
    for (let i = 0; i < startDay; i++) html += '<td></td>';
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const done = completion[dateStr];
        html += `<td class="calendar-cell${done ? ' calendar-done' : ''}">${d}</td>`;
        if ((startDay + d) % 7 === 0) html += '</tr><tr>';
    }
    html += '</tr></tbody></table>';
    progressViewContainer.innerHTML = html;
}

// Save completion data when any habit is marked done
function saveHabitCompletion() {
    const completion = getHabitCompletionDates();
    const today = new Date().toISOString().slice(0,10);
    completion[today] = habits.some(h => h.done);
    localStorage.setItem('habitCompletion', JSON.stringify(completion));
}

// Initial render for progress view
if (progressViewContainer) renderProgressView('daily');