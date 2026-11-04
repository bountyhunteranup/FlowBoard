// =====================================
// FLOWBOARD - KANBAN WIP MANAGEMENT
// =====================================

// Application state
// Application state
let tasks = JSON.parse(localStorage.getItem("flowboardTasks")) || [];

const savedWipLimit = Number(localStorage.getItem("flowboardLimit"));

const activeTasks = tasks.filter(task => task.status === "progress").length;

let wipLimit =
    Number.isInteger(savedWipLimit) &&
    savedWipLimit >= Math.max(1, activeTasks)
        ? savedWipLimit
        : Math.max(3, activeTasks);

// DOM elements
const todoList = document.getElementById("todoList");
const progressList = document.getElementById("progressList");
const doneList = document.getElementById("doneList");

const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const doneCount = document.getElementById("doneCount");

const wipInput = document.getElementById("wipLimit");
const wipMessage = document.getElementById("wipMessage");
const addTaskButton = document.getElementById("addTask");

// Save application data
function saveData() {
    localStorage.setItem("flowboardTasks", JSON.stringify(tasks));
    localStorage.setItem("flowboardLimit", wipLimit);
}

// Count tasks in a particular status
function countTasks(status) {
    return tasks.filter(task => task.status === status).length;
}

// Render the complete board
function renderBoard() {

    todoList.innerHTML = "";
    progressList.innerHTML = "";
    doneList.innerHTML = "";

    const todoTasks = tasks.filter(task => task.status === "todo");
    const progressTasks = tasks.filter(task => task.status === "progress");
    const doneTasks = tasks.filter(task => task.status === "done");

    todoTasks.forEach(task => createTaskCard(task, todoList));
    progressTasks.forEach(task => createTaskCard(task, progressList));
    doneTasks.forEach(task => createTaskCard(task, doneList));

    // Update counters
    todoCount.textContent = todoTasks.length;
    progressCount.textContent = `${progressTasks.length} / ${wipLimit}`;
    doneCount.textContent = doneTasks.length;

    // Update WIP warning
    if (progressTasks.length >= wipLimit) {
        wipMessage.textContent = "WIP LIMIT REACHED! Complete a task before starting another.";
        wipMessage.classList.add("warning");
    } else {
        wipMessage.textContent = "Work capacity available";
        wipMessage.classList.remove("warning");
    }

    wipInput.value = wipLimit;

    saveData();
}

// Create individual task cards
function createTaskCard(task, container) {

    const card = document.createElement("div");
    card.className = "task-card";

    const title = document.createElement("h3");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.textContent = task.description || "No description provided.";

    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Move task between columns
    if (task.status === "todo") {
        addActionButton(actions, "Start Task", () => {
            moveTask(task.id, "progress");
        });
    }

    if (task.status === "progress") {
        addActionButton(actions, "Move to Done", () => {
            moveTask(task.id, "done");
        });

        addActionButton(actions, "Back to To Do", () => {
            moveTask(task.id, "todo");
        });
    }

    if (task.status === "done") {
        addActionButton(actions, "Reopen Task", () => {
            moveTask(task.id, "progress");
        });
    }

    addActionButton(actions, "Delete", () => {
        deleteTask(task.id);
    });

    card.append(title, description, actions);
    container.appendChild(card);
}

// Create action buttons
function addActionButton(container, label, callback) {

    const button = document.createElement("button");

    button.textContent = label;
    button.addEventListener("click", callback);

    container.appendChild(button);
}

// Add a new task
function addTask() {

    const title = prompt("Enter task title:");

    if (!title || !title.trim()) {
        return;
    }

    const description = prompt("Enter task description:") || "";

    const newTask = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        title: title.trim(),
        description: description.trim(),
        status: "todo"
    };

    tasks.push(newTask);

    renderBoard();
}

// Move task between columns with WIP enforcement
function moveTask(taskId, newStatus) {

    const task = tasks.find(item => item.id === taskId);

    if (!task) return;

    // Check WIP limit before entering In Progress
    if (newStatus === "progress" && task.status !== "progress") {

        const currentWIP = countTasks("progress");

        if (currentWIP >= wipLimit) {

            alert(
                `WIP LIMIT EXCEEDED!\n\n` +
                `Maximum allowed tasks: ${wipLimit}\n` +
                `Currently in progress: ${currentWIP}\n\n` +
                `Complete an existing task before starting another.`
            );

            return;
        }
    }

    task.status = newStatus;

    renderBoard();
}

// Delete task
function deleteTask(taskId) {

    const confirmed = confirm("Are you sure you want to delete this task?");

    if (!confirmed) return;

    tasks = tasks.filter(task => task.id !== taskId);

    renderBoard();
}

// Change WIP limit
wipInput.addEventListener("change", () => {

    const newLimit = Number(wipInput.value);
    const currentWIP = countTasks("progress");

    if (!Number.isInteger(newLimit) || newLimit < 1) {
        alert("WIP limit must be a positive whole number.");
        wipInput.value = wipLimit;
        return;
    }

    // Prevent setting a limit below current active work
    if (newLimit < currentWIP) {
        alert(
            `INVALID WIP LIMIT!\n\n` +
            `Currently in progress: ${currentWIP}\n` +
            `New limit: ${newLimit}\n\n` +
            `Complete or move tasks out of In Progress first.`
        );

        wipInput.value = wipLimit;
        return;
    }

    wipLimit = newLimit;

    renderBoard();
});

//Add task button
addTaskButton.addEventListener("click", addTask);

// Initial board rendering
renderBoard();
