const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const taskTitleInput = document.getElementById('task-title');
const submitButton = taskForm.querySelector('button'); // Get the button
let currentEditTaskId = null; // Declare the edit task ID variable

// Fetch and display all tasks
async function fetchTasks() {
    try {
        const response = await fetch('/tasks'); 
        const tasks = await response.json();

        // Clear the task list
        taskList.innerHTML = '';

        // Display the tasks
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
                <button onclick="editTask(${task.id}, '${task.title}')" class="edit">Edit</button>
                <button onclick="deleteTask(${task.id})" class="delete">Delete</button>
            `;
            taskList.appendChild(taskItem);
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Add or Update a task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newTask = {
        title: taskTitleInput.value,
        completed: false
    };

    try {
        if (currentEditTaskId !== null) {
            // Update existing task
            await fetch(`/tasks/${currentEditTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask)
            });

            // Reset button and task input after editing
            submitButton.textContent = 'Add Task';
            currentEditTaskId = null;
        } else {
            // Add new task
            await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask)
            });
        }

        taskTitleInput.value = ''; // Clear input
        fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error('Error saving task:', error);
    }
});

// Edit a task
function editTask(id, title) {
    currentEditTaskId = id; // Store the task ID for editing
    taskTitleInput.value = title; // Populate input with task title
    submitButton.textContent = 'Update Task'; // Change button text to "Update Task"
}

// Delete a task
async function deleteTask(id) {
    try {
        await fetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
        fetchTasks(); // Refresh the task list
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Initial fetch of tasks
fetchTasks();
