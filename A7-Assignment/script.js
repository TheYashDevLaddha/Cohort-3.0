

const taskForm     = document.getElementById('taskForm');
const taskTitleEl  = document.getElementById('taskTitle');
const taskCategory = document.getElementById('taskCategory');
const taskList     = document.getElementById('taskList');
const emptyState   = document.getElementById('emptyState');

let taskCounter = 0; 

function createTaskCard(title, category) {
  taskCounter += 1;
  const id = `task-${taskCounter}`;

  const card = document.createElement('div');
  card.className = 'task-card';

  card.setAttribute('data-id', id);
  card.setAttribute('data-status', 'pending');
  card.setAttribute('data-category', category);

  const main = document.createElement('div');
  main.className = 'task-main';

  const titleEl = document.createElement('h3');
  titleEl.className = 'task-title';

  const titleText = document.createTextNode(title);
  titleEl.appendChild(titleText);

  const meta = document.createElement('div');
  meta.className = 'task-meta';
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.appendChild(document.createTextNode(category));
  meta.appendChild(badge);

  main.appendChild(titleEl);
  main.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'icon-btn';
  editBtn.type = 'button';
  editBtn.dataset.action = 'edit';            
  editBtn.appendChild(document.createTextNode('Edit'));

  const completeBtn = document.createElement('button');
  completeBtn.className = 'icon-btn';
  completeBtn.type = 'button';
  completeBtn.dataset.action = 'complete';
  completeBtn.appendChild(document.createTextNode('Complete'));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'icon-btn danger';
  deleteBtn.type = 'button';
  deleteBtn.dataset.action = 'delete';
  deleteBtn.appendChild(document.createTextNode('Delete'));

  actions.appendChild(editBtn);
  actions.appendChild(completeBtn);
  actions.appendChild(deleteBtn);

  card.append(main, actions);

  return card;
}

function refreshEmptyState() {
  const hasTasks = taskList.children.length > 0;
  emptyState.classList.toggle('is-hidden', hasTasks);
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault(); 

  const title = taskTitleEl.value.trim();
  if (!title) return;

  const category = taskCategory.value;
  const card = createTaskCard(title, category);

  taskList.prepend(card);

  taskForm.reset();
  taskTitleEl.focus();
  refreshEmptyState();
});

taskList.addEventListener('click', (event) => {
  const actionBtn = event.target.closest('[data-action]');
  if (!actionBtn) return; 

  const card = actionBtn.closest('.task-card');
  if (!card) return;

  const action = actionBtn.dataset.action; 

  if (action === 'delete') {
    deleteTask(card);
  } else if (action === 'complete') {
    completeTask(card);
  } else if (action === 'edit') {
    editTask(card);
  }
});

function deleteTask(card) {

  card.remove();
  refreshEmptyState();
}

function completeTask(card) {
  const isCompleted = card.getAttribute('data-status') === 'completed';
  const completeBtn = card.querySelector('[data-action="complete"]');

  if (isCompleted) {
    card.setAttribute('data-status', 'pending');
    if (completeBtn) completeBtn.textContent = 'Complete';
  } else {
    card.setAttribute('data-status', 'completed');
    if (completeBtn) completeBtn.textContent = 'Undo';

    const note = document.createElement('span');
    note.className = 'flash-note';
    note.textContent = 'Completed!';
    card.after(note); 

    setTimeout(() => note.remove(), 1400);
  }
}

function editTask(card) {
  const id       = card.getAttribute('data-id');
  const category = card.getAttribute('data-category');
  const titleEl  = card.querySelector('.task-title');
  const currentTitle = titleEl.textContent;

  const form = document.createElement('form');
  form.className = 'edit-form';

  const label = document.createElement('span');
  label.className = 'editing-badge';
  label.textContent = 'Editing task…';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'text-input';
  input.value = currentTitle;

  const saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.className = 'btn btn-solid';
  saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn-outline';
  cancelBtn.textContent = 'Cancel';

  form.append(label, input, saveBtn, cancelBtn);

  card.replaceWith(form);
  input.focus();
  input.select();

  cancelBtn.addEventListener('click', () => {
    form.replaceWith(card); 
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const newTitle = input.value.trim() || currentTitle;

    const status = card.getAttribute('data-status');
    const updatedCard = createTaskCard(newTitle, category);
    updatedCard.setAttribute('data-id', id);
    updatedCard.setAttribute('data-status', status);

    if (status === 'completed') {
      const btn = updatedCard.querySelector('[data-action="complete"]');
      if (btn) btn.textContent = 'Undo';
    }

    form.replaceWith(updatedCard);
  });
}

const root        = document.documentElement;
const themeToggle  = document.getElementById('themeToggle');
const toggleLabel  = themeToggle.querySelector('.toggle-label');

function applyTheme(theme) {

  root.setAttribute('data-theme', theme);

  root.dataset.theme = theme;

  root.classList.toggle('dark', theme === 'dark');

  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  toggleLabel.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
}

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

applyTheme('dark'); 

const grandparent = document.getElementById('grandparent');
const parent       = document.getElementById('parent');
const childBtn     = document.getElementById('childBtn');

function logStep(text) {
  console.log(text);
}

childBtn.addEventListener('click', () => logStep('Bubbling — Child'));
parent.addEventListener('click', () => logStep('Bubbling — Parent'));
grandparent.addEventListener('click', () => logStep('Bubbling — Grandparent'));

grandparent.addEventListener('click', () => logStep('Capturing — Grandparent'), { capture: true });
parent.addEventListener('click', () => logStep('Capturing — Parent'), { capture: true });
childBtn.addEventListener('click', () => logStep('Capturing — Child'), { capture: true });

refreshEmptyState();