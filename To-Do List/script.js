document.addEventListener('DOMContentLoaded', () => {
    let taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];

    function saveHistory() {
        localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
    }

    function addToHistory(task, action) {
        taskHistory.push({
            text: task.text,
            timestamp: task.timestamp,
            action: action,
            actionTime: new Date().toLocaleString()
        });
        saveHistory();
    }
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Render existing tasks
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
                <small class="timestamp">${task.timestamp || 'No date'}</small>
                <button class="delete-btn">Delete</button>
            `;

            if (task.completed) {
                li.classList.add('completed');
            }

            // Handle checkbox change
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                tasks[index].completed = checkbox.checked;
                addToHistory(tasks[index], checkbox.checked ? 'completed' : 'uncompleted');
                if (checkbox.checked) {
                    li.classList.add('completed');
                } else {
                    li.classList.remove('completed');
                }
                saveTasks();
            });

            // Handle delete button
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const deletedTask = tasks[index];
                addToHistory(deletedTask, 'deleted');
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            taskList.appendChild(li);
        });
    }

    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Add new task
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({
                text,
                completed: false,
                timestamp: new Date().toLocaleString()
            });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    }

    // Event listeners
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Render history
    function renderHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        taskHistory.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.text} - ${item.action} on ${item.actionTime}</span>
                <button class="delete-btn">Remove</button>
            `;

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                taskHistory.splice(index, 1);
                saveHistory();
                renderHistory();
            });

            historyList.appendChild(li);
        });
    }

    // Toggle history visibility
    const showHistoryBtn = document.getElementById('showHistory');
    const historyContainer = document.getElementById('historyContainer');
    showHistoryBtn.addEventListener('click', () => {
        const isHidden = historyContainer.style.display === 'none';
        historyContainer.style.display = isHidden ? 'block' : 'none';
        showHistoryBtn.textContent = isHidden ? 'Hide History' : 'Show History';
        if (isHidden) {
            renderHistory();
        }
    });

    // Clear history
    const clearHistoryBtn = document.getElementById('clearHistory');
    clearHistoryBtn.addEventListener('click', () => {
        taskHistory = [];
        saveHistory();
        renderHistory();
    });

    // Initial render
    renderTasks();
});
