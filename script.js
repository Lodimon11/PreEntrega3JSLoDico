// ELEMENTOS
const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
const todosListEl = document.getElementById('todos-list');
const notificationEl = document.querySelector('.notification');

// VARIABLES
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

// RENDERS
renderTodos();

// FORMULARIO
form.addEventListener('submit', function (event) {
  event.preventDefault();

  saveTodo();
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
});

// GUARDAR TODO
function saveTodo() {
  const todoValue = todoInput.value;

  // REVISAR SI EL TODO ESTA VACIO
  const isEmpty = todoValue === '';

  // REVISAR TODO DUPLICADOS
  const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

  if (isEmpty) {
    showNotification("La lista esta vacia");
  } else if (isDuplicate) {
    showNotification('Esa tarea ya existe!');
  } else {
    if (EditTodoId >= 0) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? todoValue : todo.value,
      }));
      EditTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      });
    }

    todoInput.value = '';
  }
}


function renderTodos() {
  if (todos.length === 0) {
    todosListEl.innerHTML = '<center>No tenes tarea en tu lista!</center>';
    return;
  }


  todosListEl.innerHTML = '';


  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `
    <div class="todo" id=${index}>
      <i 
        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
        style="color : ${todo.color}"
        data-action="check"
      ></i>
      <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
      <i class="bi bi-pencil-square" data-action="edit"></i>
      <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
  });
}

// EVENT LISTENER PARA TODOS LOS TODO
todosListEl.addEventListener('click', (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== 'todo') return;

  // TODO ID
  const todo = parentElement;
  const todoId = Number(todo.id);


  const action = target.dataset.action;

  action === 'check' && checkTodo(todoId);
  action === 'edit' && editTodo(todoId);
  action === 'delete' && deleteTodo(todoId);
});

// CHECK TODO
function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));

  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// EDITAR TODO
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

// BORRAR TODO
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;

  // VOLVER A MOSTRAR
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// MOSTRAR NOTIFICACION
function showNotification(msg) {
  // CAMBIAR EL MENSAJE
  notificationEl.innerHTML = msg;

  // NOTIFICACION DE ENTRADA
  notificationEl.classList.add('notif-enter');

  // NOTIFICACION DE SALIDA
  setTimeout(() => {
    notificationEl.classList.remove('notif-enter');
  }, 2000);
}
