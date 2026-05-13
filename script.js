let tasks = [];
let currentUser = "";

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('register-tab').classList.add('active');
}

function getTaskStorageKey(username) {
    return `taskflow_tasks_${username}`;
}

function getRegisteredUsers() {
    return JSON.parse(localStorage.getItem('taskflow_users') || '{}');
}

function saveRegisteredUsers(users) {
    localStorage.setItem('taskflow_users', JSON.stringify(users));
}

function logout() {
    localStorage.removeItem('taskflow_logged_in');
    localStorage.removeItem('taskflow_username');
    currentUser = "";
    tasks = [];
    document.getElementById('username-display').textContent = '';
    document.getElementById('app-screen').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'flex';
    showLogin();
}

// Show specific view
function showView(view) {
    document.getElementById('all-tasks-section').style.display = view === 'all' ? 'block' : 'none';
    document.getElementById('pending-section').style.display = view === 'pending' ? 'block' : 'none';
    document.getElementById('completed-section').style.display = view === 'completed' ? 'block' : 'none';

    // Update active tab
    document.querySelectorAll('.view-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`tab-${view}`).classList.add('active');
}

function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!username || !password) return alert('Please enter both username and password.');

    const users = getRegisteredUsers();
    if (!users[username]) {
        return alert('Account not found. Please create an account first.');
    }
    if (users[username] !== password) {
        return alert('Incorrect password. Please try again.');
    }

    currentUser = username;
    document.getElementById('username-display').textContent = currentUser;

    localStorage.setItem('taskflow_logged_in', 'true');
    localStorage.setItem('taskflow_username', currentUser);

    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'flex';

    loadTasks();
    updateCurrentTime();
    showView('all'); // Default view
}

function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    if (!username || !password) return alert('Please enter both username and password.');

    const users = getRegisteredUsers();
    if (users[username]) return alert('This username already exists. Please choose another.');

    users[username] = password;
    saveRegisteredUsers(users);
    alert(`✓ Account created! You can now log in as ${username}.`);
    showLogin();
}

// Other functions (addTask, toggleComplete, etc.)
function updateCurrentTime() {
    const timeEl = document.getElementById('current-time');
    setInterval(() => {
        timeEl.textContent = new Date().toLocaleString('en-IN', {
            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }, 1000);
}

function addTask() {
    const title = document.getElementById('task-title').value.trim();
    if (!title) return alert("Please enter a task title!");

    tasks.unshift({
        id: Date.now(),
        title,
        description: document.getElementById('task-desc').value.trim(),
        dueDate: document.getElementById('task-due').value || null,
        completed: false,
        createdAt: new Date().toISOString()
    });

    saveTasks();
    renderAllTasks();
    clearForm();
}

function clearForm() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-due').value = '';
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
    saveTasks();
    renderAllTasks();
}

function deleteTask(id) {
    if (confirm("Delete this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderAllTasks();
    }
}

function formatDateTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

function isOverdue(due) {
    return due && new Date(due) < new Date();
}

function renderAllTasks() {
    const allList = document.getElementById('all-list');
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');

    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);

    // Update Stats
    document.getElementById('total-tasks').textContent = tasks.length;
    document.getElementById('pending-tasks').textContent = pending.length;
    document.getElementById('completed-tasks').textContent = completed.length;

    // All Tasks
    allList.innerHTML = tasks.map(task => createTaskHTML(task)).join('');

    // Pending Tasks
    pendingList.innerHTML = pending.map(task => createTaskHTML(task)).join('');

    // Completed Tasks
    completedList.innerHTML = completed.map(task => createTaskHTML(task, true)).join('');
}

function createTaskHTML(task, isCompleted = false) {
    return `
        <div class="task-item">
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
                <div class="task-datetime">
                    <span>Created: ${formatDateTime(task.createdAt)}</span>
                    ${task.dueDate ? `<span class="${isOverdue(task.dueDate) ? 'overdue' : ''}">Due: ${formatDateTime(task.dueDate)}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleComplete(${task.id})">
                    <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function saveTasks() {
    if (!currentUser) return;
    localStorage.setItem(getTaskStorageKey(currentUser), JSON.stringify(tasks));
}

function loadTasks() {
    if (!currentUser) {
        tasks = [];
        renderAllTasks();
        return;
    }

    const saved = localStorage.getItem(getTaskStorageKey(currentUser));
    tasks = saved ? JSON.parse(saved) : [];
    renderAllTasks();
}

// Auto Login
window.onload = () => {
    if (localStorage.getItem('taskflow_logged_in') === 'true') {
        currentUser = localStorage.getItem('taskflow_username') || "Prashanth";
        document.getElementById('username-display').textContent = currentUser;
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('app-screen').style.display = 'flex';
        loadTasks();
        updateCurrentTime();
        showView('all');
    }
};