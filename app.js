const addTaskBtn = document.getElementById("addTaskBtn");
const todoUI = document.getElementById("task-todo");
const doingUI = document.getElementById("task-doing");
const doneUI = document.getElementById("task-done");

const todoCol = document.querySelector(".todo-list");
const doingCol = document.querySelector(".doing-list");
const doneCol = document.querySelector(".done-list");

const lists = {         //To refer to the lists
    todo: todoUI,
    doing: doingUI,
    done: doneUI,
};

const editDialog = document.getElementById("editDialog");
const editForm = document.getElementById("editForm");       //Get elements from html document
const editTitle = document.getElementById("editTitle");
const editDesc = document.getElementById("editDesc");
const editList = document.getElementById("editList");

//The li element that is edited in the dialog, acts as a pointer
let currentTask = null;

//Pointer to point to which card is being pulled
let draggedCard = null;

//Help-function to see what card is in what list
function parentOfList (li) {
    const pid = li?.parentElement?.id;
    if(pid === "task-todo") return "todo";
    if(pid === "task-doing") return "doing";
    if(pid == "task-done") return "done";
    return "todo";
}

//Function to make a card draggable
function makeDraggable (li){
    li.draggable = true;
    li.classList.add("task-card");

    li.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "move");
        e.dataTransfer.effectAllowed = "move";

        draggedCard = li;
        li.classList.add("dragging");
    })

    li.addEventListener("dragend", () => {
        draggedCard = null;
        li.classList.remove("dragging");
    })

    li.querySelectorAll("button").forEach(btn => {btn.draggable = false; })
}

//Allows to drop a card in a list
function setupDropTarget(targetEl, useCapture = false){
    if(!targetEl) return;
    const getListEl = (el) => {
        if(el.tagName === "ARTICLE") return el.querySelector("ul");
        return el;
    };

    const onDragOver = (e) => {
        e.preventDefault();         //IMPORTANT: becomes just a text-drop to the child if not there
        try {e.dataTransfer.dropEffect = "move"} catch {}
        targetEl.classList.add("drop-target");
    };

    const onDragLeave = () => {
        targetEl.classList.remove("drop-target");
    };

    const onDrop = (e) => {
        e.preventDefault();
        targetEl.classList.remove("drop-target");
        
        if(draggedCard) {
            const listEl = getListEl(targetEl);
            if(listEl) {
                listEl.appendChild(draggedCard);
                draggedCard.dataset.list = parentOfList(draggedCard);
                saveTasksToLocalStorage();
                
            }
        }
    };
    targetEl.addEventListener("dragover", onDragOver, useCapture);
    targetEl.addEventListener("dragleave", onDragLeave, useCapture);
    targetEl.addEventListener("drop", onDrop, useCapture);
}

//Activate drop on all lists
setupDropTarget(todoUI);
setupDropTarget(doingUI);
setupDropTarget(doneUI);

setupDropTarget(todoCol, true);
setupDropTarget(doingCol, true);
setupDropTarget(doneCol, true);




//Function to add task
function setEditor (li, title = "", desc = ""){
    li.innerHTML = "";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Title";
    titleInput.value= title;

    const descInput = document.createElement("textarea");
    descInput.rows = 3;
    descInput.placeholder = "Short description...";
    descInput.value = desc;

    const okBtn = document.createElement("button");
    okBtn.textContent = "Done";
    okBtn.classList.add("done-btn");

    const cancelInLineBtn = document.createElement("button");
    cancelInLineBtn.textContent = "Cancel";
    cancelInLineBtn.classList.add("cancel-btn")

    li.append(titleInput, descInput, okBtn, cancelInLineBtn);
    titleInput.focus();

    okBtn.addEventListener("click", () => {
        const t = titleInput.value.trim();
        const d = descInput.value.trim();
        if(!t) {
            titleInput.classList.add("field-error");
            titleInput.focus();
            return;
        }
        setLocked(li, t, d);
        saveTasksToLocalStorage();
        
    });

    cancelInLineBtn.addEventListener("click", () => {
        if(!title && !desc) {
            li.remove();
            
        } else {
            setLocked(li, title, desc)
        }
        saveTasksToLocalStorage();
    });

    titleInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            okBtn.click();
        }
    });
}

//Locked mode, shows edit button
function setLocked(li, title, desc) {
    li.innerHTML= "";

    const h3 = document.createElement("h3");
    h3.textContent = title;

    const delBtn = createDeleteBtn(li);

    const p = document.createElement("p");
    p.textContent = desc;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn")

    editBtn.addEventListener("click", () => {
        openEditDialog(li);
    })

    li.append(h3, delBtn, p, editBtn);

    //Makes card draggable
    if(!li.draggable) makeDraggable(li);

}

addTaskBtn.addEventListener("click", () => {
    const li = document.createElement("li");
    li.dataset.list = "todo";             //Track a list
    li.classList.add("card-enter");
    todoUI.appendChild(li);
    setEditor(li);
    li.scrollIntoView({block: "nearest"})
});

function openEditDialog(taskItem) {
    //Pointer
    currentTask = taskItem;
    const title = taskItem.querySelector("h3")?.textContent ?? "";
    const desc = taskItem.querySelector("p")?.textContent ?? "";

    editTitle.value = title;
    editDesc.value = desc;
    editList.value = parentOfList(taskItem);

    //Shows dialog
    editDialog.showModal();

    editTitle.focus();
    editTitle.select?.();
}

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(!currentTask) {
        editDialog.close();
        return;
    }

    const newTitle = editTitle.value.trim();
    const newDesc = editDesc.value.trim();
    const newListKey = editList.value;

    if(!newTitle) {
        editTitle.focus();
        return;
    }

    currentTask.querySelector("h3").textContent = newTitle;
    currentTask.querySelector("p").textContent = newDesc;

    const currentKey = parentOfList(currentTask);
    if(newListKey !== currentKey) {
        lists[newListKey].appendChild(currentTask);
        currentTask.dataset.list = newListKey;
    }

    editDialog.close();
    currentTask = null;
    saveTasksToLocalStorage();

});

function createDeleteBtn(li) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "delete-btn";
    btn.textContent = "X";
    btn.title = "Delete card";
    btn.addEventListener("click", (e) => {
        e.stopPropagation(); 
        animateRemove(li);
    });
    btn.draggable = false;
    return btn;
}

function animateRemove(li) {
    li.classList.add("card-delete");
    li.addEventListener("animationend", () =>  {
        li.remove(); 
        saveTasksToLocalStorage();
    }, {once: true});
}


    /* SAVING TO LOCAL STORAGE */

//Function to sava all tasks to localStorage
function saveTasksToLocalStorage() {
    //To store all tasks
    const allTasks = [];

    //Get all task cards from the three lists
    const todoTasks = document.querySelectorAll("#task-todo li");
    const doingTasks = document.querySelectorAll("#task-doing li");
    const doneTasks = document.querySelectorAll("#task-done li");

    //Save todo tasks
    todoTasks.forEach(task => {
        const title = task.querySelector("h3")?.textContent || "";
        const desc = task.querySelector("p")?.textContent || "";
        allTasks.push({
            title: title,
            desc: desc,
            list: "todo"
        });
    });

    //Save doing tasks
    doingTasks.forEach(task => {
        const title = task.querySelector("h3")?.textContent || "";
        const desc = task.querySelector("p")?.textContent || "";
        allTasks.push({
            title: title,
            desc: desc,
            list: "doing"
        });
    });

    //Save done tasks
    doneTasks.forEach(task => {
        const title = task.querySelector("h3")?.textContent || "";
        const desc = task.querySelector("p")?.textContent || "";
        allTasks.push({
            title: title,
            desc: desc,
            list: "done"
        });
    });

    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
    // Get save tasks from localStorage
    const savedTasks = localStorage.getItem("tasks");

    //If no tasks, do nothing
    if(!savedTasks) return;

    //Convert JSON string back to array
    const tasks = JSON.parse(savedTasks);

    // Add each task to the correct list
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.list = task.list;
        li.classList.add("card-enter");

        // Use setLocked function to display the task
        setLocked(li, task.title, task.desc);

        //Add to the correct list
        if (task.list === "todo") {
            todoUI.appendChild(li);
        } else if (task.list === "doing") {
            doingUI.appendChild(li);
        } else if (task.list === "done") {
            doneUI.appendChild(li);
        } 
    });
}

// Call load function when page loads
window.addEventListener("load", loadTasksFromLocalStorage);


// Opens the timer window
document.getElementById("startTimer")?.addEventListener("click", () => {
    window.location.href = "timer.html";
})
