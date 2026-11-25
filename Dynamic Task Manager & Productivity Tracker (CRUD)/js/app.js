let tasks = [];
let filter = "all";
let query = "";
let editingId = null;

const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#title");
const categoryInput = document.querySelector("#category");
const dueInput = document.querySelector("#due");
const submitBtn = document.querySelector("#submit-btn");
const cancelBtn = document.querySelector("#cancel-edit");
const list = document.querySelector("#task-list");
const empty = document.querySelector("#empty");
const count = document.querySelector("#count");
const search = document.querySelector("#search");
const STORAGE_KEY = "datheon-task-manager";

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    tasks = Array.isArray(parsed) ? parsed : [];
  } catch {
    tasks = [];
  }
}

function todayStamp() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function visibleTasks() {
  return tasks.filter((task) => {
    const statusOk =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);
    const textOk = task.title.toLowerCase().includes(query);
    return statusOk && textOk;
  });
}

function render() {
  const shown = visibleTasks();
  const open = tasks.filter((task) => !task.completed).length;
  count.textContent = open === 1 ? "1 open" : `${open} open`;
  list.replaceChildren();

  const nothing = shown.length === 0;
  empty.classList.toggle("hidden", !nothing);
  empty.textContent = tasks.length === 0
    ? "No tasks yet. Add one above."
    : "Nothing matches this filter.";

  shown.forEach((task) => {
    const item = document.createElement("li");
    item.className = task.completed ? "task done" : "task";
    item.draggable = true;
    item.dataset.id = task.id;

    const handle = document.createElement("span");
    handle.className = "handle";
    handle.textContent = "⋮⋮";
    handle.title = "Drag to reorder";
    handle.setAttribute("aria-hidden", "true");

    const check = document.createElement("input");
    check.className = "check";
    check.type = "checkbox";
    check.checked = task.completed;
    check.setAttribute("aria-label", `Mark "${task.title}" ${task.completed ? "active" : "complete"}`);
    check.addEventListener("change", () => toggleComplete(task.id));

    const main = document.createElement("div");
    main.className = "task-main";
    const heading = document.createElement("p");
    heading.className = "task-title";
    heading.textContent = task.title;
    const meta = document.createElement("div");
    meta.className = "meta";
    const cat = document.createElement("span");
    cat.className = `cat ${task.category.toLowerCase()}`;
    cat.textContent = task.category;
    meta.append(cat);
    if (task.due) {
      const due = document.createElement("span");
      const late = !task.completed && task.due < todayStamp();
      due.className = late ? "due late" : "due";
      due.textContent = late ? `Due ${task.due} · overdue` : `Due ${task.due}`;
      meta.append(due);
    }
    main.append(heading, meta);

    const actions = document.createElement("div");
    actions.className = "actions";
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "icon-btn";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => startEdit(task.id));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "icon-btn danger";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => removeTask(task.id, item));
    actions.append(edit, remove);

    item.append(handle, check, main, actions);

    item.addEventListener("dragstart", () => {
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      const ids = [...list.children].map((el) => el.dataset.id);
      const rank = new Map(ids.map((id, index) => [id, index]));
      const visible = tasks.filter((entry) => rank.has(entry.id));
      visible.sort((a, b) => rank.get(a.id) - rank.get(b.id));
      let index = 0;
      tasks = tasks.map((entry) => (rank.has(entry.id) ? visible[index++] : entry));
      saveToLocalStorage();
    });
    item.addEventListener("dragover", (event) => {
      event.preventDefault();
      const dragging = list.querySelector(".dragging");
      if (!dragging || dragging === item) return;
      const after = event.clientY > item.getBoundingClientRect().top + item.offsetHeight / 2;
      list.insertBefore(dragging, after ? item.nextSibling : item);
    });

    list.append(item);
  });
}

function toggleComplete(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveToLocalStorage();
  render();
}

function startEdit(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  editingId = id;
  titleInput.value = task.title;
  categoryInput.value = task.category;
  dueInput.value = task.due || "";
  submitBtn.textContent = "Save changes";
  cancelBtn.classList.remove("hidden");
  titleInput.focus();
}

function resetForm() {
  editingId = null;
  form.reset();
  submitBtn.textContent = "Add task";
  cancelBtn.classList.add("hidden");
}

function removeTask(id, element) {
  element.classList.add("leaving");
  window.setTimeout(() => {
    tasks = tasks.filter((task) => task.id !== id);
    if (editingId === id) resetForm();
    saveToLocalStorage();
    render();
  }, 220);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  const payload = {
    title,
    category: categoryInput.value,
    due: dueInput.value,
  };

  if (editingId) {
    const task = tasks.find((item) => item.id === editingId);
    if (task) Object.assign(task, payload);
  } else {
    tasks.unshift({
      id: crypto.randomUUID(),
      ...payload,
      completed: false,
    });
  }

  saveToLocalStorage();
  resetForm();
  render();
});

cancelBtn.addEventListener("click", resetForm);

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((chip) => {
      chip.classList.toggle("is-on", chip === button);
    });
    render();
  });
});

search.addEventListener("input", () => {
  query = search.value.trim().toLowerCase();
  render();
});

loadFromLocalStorage();
render();
