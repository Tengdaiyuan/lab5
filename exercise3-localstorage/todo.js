/**
 * Lab 5 - Exercise 3: Local Storage - To-Do List
 * ---------------------------------------------
 * Tasks live in an array of { id, text } objects that is serialised to
 * localStorage on every change, so the list is restored after a reload or
 * after the browser has been closed.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'lab5.todo.tasks';

  var form = document.getElementById('taskForm');
  var input = document.getElementById('taskInput');
  var list = document.getElementById('taskList');
  var emptyState = document.getElementById('taskEmpty');
  var countLabel = document.getElementById('taskCount');
  var clearButton = document.getElementById('clearButton');

  var tasks = loadTasks();

  /* ---------------------------------------------------------------- *
   * Persistence
   * ---------------------------------------------------------------- */

  function loadTasks() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      // Keep only well-formed entries so a hand-edited value cannot break
      // the page.
      return parsed
        .filter(function (task) {
          return task && typeof task.text === 'string' && task.text.trim() !== '';
        })
        .map(function (task) {
          return { id: String(task.id || createId()), text: task.text };
        });
    } catch (error) {
      return [];
    }
  }

  function saveTasks() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      // Storage can be full or disabled (private mode); the list still
      // works for the current session.
    }
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'task-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  /* ---------------------------------------------------------------- *
   * Rendering
   * ---------------------------------------------------------------- */

  function render() {
    list.textContent = '';

    tasks.forEach(function (task) {
      var item = document.createElement('li');
      item.className = 'task-item';
      item.dataset.id = task.id;

      var label = document.createElement('span');
      label.className = 'task-text';
      label.textContent = task.text; // textContent keeps HTML in a task inert

      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'task-delete';
      remove.textContent = '\u00d7';
      remove.title = 'Remove task';
      remove.setAttribute('aria-label', 'Remove task: ' + task.text);
      remove.addEventListener('click', function () {
        removeTask(task.id);
      });

      item.appendChild(label);
      item.appendChild(remove);
      list.appendChild(item);
    });

    emptyState.hidden = tasks.length > 0;
    clearButton.disabled = tasks.length === 0;
    countLabel.textContent = tasks.length === 1 ? '1 task' : tasks.length + ' tasks';
  }

  /* ---------------------------------------------------------------- *
   * Actions
   * ---------------------------------------------------------------- */

  function addTask(text) {
    var value = text.trim();
    if (!value) {
      input.focus();
      return false;
    }
    tasks.push({ id: createId(), text: value });
    saveTasks();
    render();
    return true;
  }

  function removeTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveTasks();
    render();
  }

  function clearTasks() {
    if (tasks.length === 0) {
      return;
    }
    if (window.confirm('Remove all ' + tasks.length + ' task(s)?')) {
      tasks = [];
      saveTasks();
      render();
    }
  }

  /* ---------------------------------------------------------------- *
   * Wiring
   * ---------------------------------------------------------------- */

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // no page reload
    if (addTask(input.value)) {
      input.value = '';
      input.focus();
    }
  });

  clearButton.addEventListener('click', clearTasks);

  // Keep multiple open tabs in sync.
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) {
      tasks = loadTasks();
      render();
    }
  });

  render();
})();
