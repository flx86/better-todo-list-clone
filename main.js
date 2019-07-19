
// DOM elements //
const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form");
const newListInput = document.querySelector("[data-new-list-input]");

const todosContainer = document.querySelector("[data-todos-container]");
const todosBody = document.querySelector("[data-todos-body]")
const listTitle = document.querySelector("[data-list-title]");
const todosCounter = document.querySelector("[data-todos-count]");
const todoTemplate =  document.getElementById("todo-template")
const newTodoInput = document.querySelector("[data-new-todo-input]");
const newTodoForm = document.querySelector("[data-new-todo-form]");

// buttons 
const deleteListButton = document.querySelector("[data-delete-list-btn]");
const deleteCompletedTodosButton = document.querySelector("[data-delete-completed-todos]");

// Local storage keys //
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

// State
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

/* Event Listeners */

// Create a new list
newListForm.addEventListener("submit", e => {
  e.preventDefault();
  const listName =  newListInput.value;
  if (listName == null || listName === "")
    return
  else{
    const list = createList(listName);
    lists.push(list);
    newListInput.value = null;
    save();
    render();
  }
})

// Create a new todo in a specific list
newTodoForm.addEventListener("submit", e =>{
  e.preventDefault();
  const todoName = newTodoInput.value;
  if ( !selectedListId || todoName == null || todoName === "")
    return
  else{
    const selectedList = lists.find(list => list.id === selectedListId );
    const todo = createTodo(todoName);
    selectedList.todos.push(todo);
    newTodoInput.value = null;
    save();
    render();
  }
})

// Select a list
listsContainer.addEventListener("click", e =>{
  if (e.target.tagName.toLowerCase() === "li"){
    selectedListId = e.target.dataset.listId;
  }
  save();
  render();
})


// Check complete a specific todo
todosBody.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "input"){
    const selectedList = lists.find(list => list.id === selectedListId );
    const selectedTodo = selectedList.todos.find(todo => todo.id === e.target.id );
    selectedTodo.complete = e.target.checked;
    save();
    renderTodosCount(selectedList);
  }
})


// Delete a selected list
deleteListButton.addEventListener("click" , e => {
  lists = lists.filter( list => list.id !== selectedListId ); 
  selectedListId.todos = [];
  selectedListId = null;
  save();
  render();
})

// Delete all completed todos
deleteCompletedTodosButton.addEventListener("click", e => {
  const selectedList = lists.find(list => list.id === selectedListId );
  const todos = selectedList.todos.filter( todo => !todo.complete );

  console.log(todos);
  

  selectedList.todos = todos;
  save();
  render();

})


function createTodo(name){
  return { id: Date.now().toString() , name , complete: false }
}

function createList(name){
  return { id: Date.now().toString() , name , todos:[] }
}

function save (){
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}


function render (){
  clearElement(listsContainer);
  renderLists();
  const selectedList = lists.find(list => list.id === selectedListId);

  if (!selectedList){
    todosContainer.style.display = "none"
  }else{
    todosContainer.style.display = ""
    listTitle.innerText = firtsLetterToUpperCase(selectedList.name);
    renderTodosCount(selectedList);
    clearElement (todosBody)
    renderTodos(selectedList)
  }
}

function renderLists(){
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.classList.add('list-name');
    listElement.dataset.listId = list.id;
    if (list.id === selectedListId){
      listElement.classList.add('active');
    }
    listElement.innerText = firtsLetterToUpperCase(list.name)
    listsContainer.appendChild(listElement);
  })
}

function renderTodos(list){
  list.todos.forEach(todo => {
      const todoElement =  document.importNode(todoTemplate.content, true);
      const checkbox = todoElement.querySelector("input")
      checkbox.id = todo.id; 
      checkbox.checked = todo.complete
      const label = todoElement.querySelector("label")
      label.htmlFor = todo.id;
      label.append(firtsLetterToUpperCase(todo.name));
      todosBody.appendChild(todoElement);
  })
}

function clearElement(element){
  while(element.firstChild){
    element.removeChild(element.firstChild)
  }
}

function renderTodosCount (list){
  const incompleteTodosCount = list.todos.filter(todo => !todo.complete).length;
  const todoString = incompleteTodosCount === 1 ? "task" : "tasks";
  todosCounter.innerText = `${incompleteTodosCount} ${todoString} remaining`

}
function firtsLetterToUpperCase (string){
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
render();