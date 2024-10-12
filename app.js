"use strict";
// interface Todo {
//     text: string;
//     completed: boolean;
//   }
const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');
let allTodos = getTodos();
updateTodoList();
// Event listener for form submission
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
});
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false,
        };
        allTodos.push(todoObject);
        updateTodoList();
        saveTodos();
        todoInput.value = '';
    }
}
function updateTodoList() {
    todoListUL.innerHTML = '';
    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex);
        todoListUL.append(todoItem);
    });
}
function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
}
function saveTodos() {
    const todoJson = JSON.stringify(allTodos);
    localStorage.setItem('todo', todoJson);
}
function getTodos() {
    const todos = localStorage.getItem('todo');
    return todos ? JSON.parse(todos) : [];
}
function createTodoItem(todo, todoIndex) {
    const todoId = `todo-${todoIndex}`;
    const todoLI = document.createElement('li');
    todoLI.className = 'todo';
    todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}" ${todo.completed ? 'checked' : ''}>
    <label class="custom-checkbox" for="${todoId}">
      <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
      </svg>
    </label>
    <label for="${todoId}" class="todo-text">${todo.text}</label>
    <button class="edit-button">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
      </svg>
    </button>
    <button class="delete-button">
      <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
      </svg>
    </button>
  `;
    const checkbox = todoLI.querySelector('input[type="checkbox"]');
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => {
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
        updateTodoList();
    });
    const deleteButton = todoLI.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        deleteTodoItem(todoIndex);
    });
    const editButton = todoLI.querySelector('.edit-button');
    editButton.addEventListener('click', () => {
        if (!checkbox.checked) {
            const todoTextLabel = todoLI.querySelector('.todo-text');
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = todo.text;
            editInput.className = 'edit-input';
            editInput.addEventListener('blur', () => {
                allTodos[todoIndex].text = editInput.value;
                saveTodos();
                updateTodoList();
            });
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    editInput.blur();
                }
            });
            todoLI.replaceChild(editInput, todoTextLabel);
            editInput.focus();
        }
        else {
            alert("Uncheck the item before editing.");
        }
    });
    return todoLI;
}
