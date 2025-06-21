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