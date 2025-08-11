document.addEventListener("DOMContentLoaded", () => {
    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle");
    let currentTheme = localStorage.getItem("theme") || "light";
    applyTheme(currentTheme);

    themeToggle.addEventListener("click", () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", currentTheme);
        applyTheme(currentTheme);
    });

    function applyTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        themeToggle.innerHTML = theme === "light"
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    }

    // Background toggle
    const bgToggle = document.getElementById("bg-toggle");
    let bgIndex = 0;
    const backgrounds = [
        "linear-gradient(135deg, #FCF1F6 0%, #FFD6E0 100%)",
        "linear-gradient(135deg, #AD1A72 0%, #FFD700 100%)",
        "linear-gradient(135deg, #2C2C34 0%, #6FCF97 100%)",
        "linear-gradient(135deg, #FFD700 0%, #FCF1F6 100%)"
    ];
    bgToggle.addEventListener("click", () => {
        bgIndex = (bgIndex + 1) % backgrounds.length;
        document.body.style.background = backgrounds[bgIndex];
    });

    // Text color picker
    const textColorPicker = document.getElementById("text-color-picker");
    textColorPicker.addEventListener("input", (e) => {
        document.body.style.color = e.target.value;
        document.querySelectorAll('.task-title').forEach(el => {
            el.style.color = e.target.value;
        });
    });

    // Task type toggle
    const toggleTaskTypeBtn = document.getElementById("toggle-task-type");
    const taskTypeIcon = document.getElementById("task-type-icon");
    let isSubtask = false;
    toggleTaskTypeBtn.addEventListener("click", () => {
        isSubtask = !isSubtask;
        taskTypeIcon.className = isSubtask ? "far fa-star" : "far fa-heart";
    });

    // To-Do List logic
    const addTaskBtn = document.getElementById("add-task");
    const taskTitleInput = document.getElementById("task-title-input");
    const todoListDiv = document.getElementById("todo-list");
    const taskTemplate = document.getElementById("task-template");

    let tasks = [];

    addTaskBtn.addEventListener("click", () => {
        const title = taskTitleInput.value.trim();
        if (!title) return;
        tasks.push({
            title,
            completed: false,
            type: isSubtask ? "subtask" : "main",
            due: "",
        });
        taskTitleInput.value = "";
        renderTasks();
    });

    function renderTasks() {
        todoListDiv.innerHTML = "";
        tasks.forEach((task, idx) => {
            const node = taskTemplate.content.cloneNode(true);
            const row = node.querySelector(".task-row");
            row.classList.toggle("subtask", task.type === "subtask");
            row.classList.toggle("completed", task.completed);

            // Icon
            const icon = row.querySelector(".task-icon");
            if (task.type === "main") {
                icon.className = task.completed ? "fas fa-heart" : "far fa-heart";
            } else {
                icon.className = task.completed ? "fas fa-star" : "far fa-star";
            }
            icon.addEventListener("click", () => {
                task.completed = !task.completed;
                renderTasks();
            });

            // Title
            const titleInput = row.querySelector(".task-title");
            titleInput.value = task.title;
            titleInput.readOnly = true;
            titleInput.style.color = textColorPicker.value;
            titleInput.addEventListener("dblclick", () => {
                titleInput.readOnly = false;
                titleInput.focus();
            });
            titleInput.addEventListener("blur", () => {
                titleInput.readOnly = true;
                task.title = titleInput.value;
            });
            titleInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    titleInput.blur();
                }
            });

            // Due date
            const dueDateSpan = row.querySelector(".task-due-date");
            const dueDateInput = row.querySelector(".due-date-input");
            dueDateInput.value = task.due;
            dueDateInput.addEventListener("change", () => {
                task.due = dueDateInput.value;
            });

            // Edit button
            row.querySelector(".edit-task").addEventListener("click", () => {
                titleInput.readOnly = false;
                titleInput.focus();
            });

            // Delete button
            row.querySelector(".delete-task").addEventListener("click", () => {
                tasks.splice(idx, 1);
                renderTasks();
            });

            // Drag & drop
            row.setAttribute("draggable", "true");
            row.addEventListener("dragstart", (e) => {
                e.dataTransfer.setData("text/plain", idx);
                row.classList.add("dragging");
            });
            row.addEventListener("dragend", () => {
                row.classList.remove("dragging");
            });
            row.addEventListener("dragover", (e) => {
                e.preventDefault();
                row.classList.add("drag-over");
            });
            row.addEventListener("dragleave", () => {
                row.classList.remove("drag-over");
            });
            row.addEventListener("drop", (e) => {
                e.preventDefault();
                row.classList.remove("drag-over");
                const fromIdx = Number(e.dataTransfer.getData("text/plain"));
                if (fromIdx !== idx) {
                    const moved = tasks.splice(fromIdx, 1)[0];
                    tasks.splice(idx, 0, moved);
                    renderTasks();
                }
            });

            todoListDiv.appendChild(row);
        });
    }

    // Initial render
    renderTasks();
});
