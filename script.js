const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("count");
const empty = document.getElementById("empty");
const clearBtn = document.getElementById("clear-done");
const filterButtons = document.querySelectorAll(".filter");

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks", error);
  }
}

function visibleTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.done);
  if (currentFilter === "done") return tasks.filter((t) => t.done);
  return tasks;
}

function render() {
  list.innerHTML = "";

  visibleTasks().forEach((task) => {
    const item = document.createElement("li");
    item.className = "task" + (task.done ? " done" : "");
    item.dataset.id = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark task as done");

    const text = document.createElement("span");
    text.textContent = task.text;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.textContent = "Delete";

    item.append(checkbox, text, remove);
    list.append(item);
  });

  const remaining = tasks.filter((t) => !t.done).length;
  count.textContent = remaining + (remaining === 1 ? " task left" : " tasks left");
  empty.hidden = visibleTasks().length > 0;
  clearBtn.hidden = !tasks.some((t) => t.done);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ id: Date.now(), text: text, done: false });
  input.value = "";
  saveTasks();
  render();
});

list.addEventListener("click", (event) => {
  const item = event.target.closest(".task");
  if (!item) return;
  const id = Number(item.dataset.id);

  if (event.target.classList.contains("delete")) {
    tasks = tasks.filter((t) => t.id !== id);
  } else if (event.target.type === "checkbox") {
    const task = tasks.find((t) => t.id === id);
    task.done = !task.done;
  } else {
    return;
  }

  saveTasks();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle("active", b === button));
    render();
  });
});

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  render();
});

render();