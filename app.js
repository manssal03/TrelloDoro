    /* Gets the elements from the DOM */
const addTaskBtn = document.getElementById("addTaskBtn");  // Gets the "add task" button
const todoUI = document.getElementById("task-todo");       // Gets the ul-element for "To Do"
const doingUI = document.getElementById("task-doing");     //Gets the ul-element for "Doing"
const doneUI = document.getElementById("task-done");       //Gets the ul-element for "Done"

const todoCol = document.querySelector(".todo-list");      //Gets the article-element for "To Do"
const doingCol = document.querySelector(".doing-list");    //Gets the article-element for "Doing"
const doneCol = document.querySelector(".done-list");      //Get the article-element for "Done"

const lists = {         //To refer to the lists
    todo: todoUI,
    doing: doingUI,
    done: doneUI,
};

    /* Dialog & form to edit task */
const editDialog = document.getElementById("editDialog");
const editForm = document.getElementById("editForm");       //Get elements from html document
const editTitle = document.getElementById("editTitle");
const editDesc = document.getElementById("editDesc");
const editList = document.getElementById("editList");

//The li element that is edited in the dialog, acts as a pointer
let currentTask = null;

//Pointer to point to which card is being pulled
let draggedCard = null;

//Help-function to see what card (li-element) is in what list
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

    // When drag starts, mark and save the reference
    li.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "move");
        e.dataTransfer.effectAllowed = "move";

        draggedCard = li;
        li.classList.add("dragging");
    })

    // When drag stops, clean state
    li.addEventListener("dragend", () => {
        draggedCard = null;
        li.classList.remove("dragging");
    })

    // Makes it so that buttons cant be dragged
    li.querySelectorAll("button").forEach(btn => {btn.draggable = false; })
}

//Allows to drop a card in a list
function setupDropTarget(targetEl, useCapture = false){
    if(!targetEl) return;

    // If target is an article, get the inner ul-element, or else the element is used directly
    const getListEl = (el) => {
        if(el.tagName === "ARTICLE") return el.querySelector("ul");
        return el;
    };

    // Allows drop and shows visual feedback
    const onDragOver = (e) => {
        e.preventDefault();         //IMPORTANT: becomes just a text-drop to the child if not there
        try {e.dataTransfer.dropEffect = "move"} catch {}
        targetEl.classList.add("drop-target");
    };

    // Removes visual feedback when you leave a target
    const onDragLeave = () => {
        targetEl.classList.remove("drop-target");
    };

    //Handles drop, moves the card to correct ul-element and saves
    const onDrop = (e) => {
        e.preventDefault();
        targetEl.classList.remove("drop-target");
        
        if(draggedCard) {
            const listEl = getListEl(targetEl);
            if(listEl) {
                listEl.appendChild(draggedCard);    //Move the card
                draggedCard.dataset.list = parentOfList(draggedCard);   //Update data-attribute
                saveTasksToLocalStorage();          //Save the new order
                
            }
        }
    };
    // Connect event listeners
    targetEl.addEventListener("dragover", onDragOver, useCapture);
    targetEl.addEventListener("dragleave", onDragLeave, useCapture);
    targetEl.addEventListener("drop", onDrop, useCapture);
}

//Activate drop on all lists (ul)
setupDropTarget(todoUI);
setupDropTarget(doingUI);
setupDropTarget(doneUI);

// Activates drop on column (articles), and catches drop outside the ul-list
setupDropTarget(todoCol, true);
setupDropTarget(doingCol, true);
setupDropTarget(doneCol, true);




// Shows a card in "edit mode" directly in the list
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

    // Puts the inputs and buttons in li-element
    li.append(titleInput, descInput, okBtn, cancelInLineBtn);
    titleInput.focus();

    // Save, check if no title, lock the card and save to local storage
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

    // Cancel, remove new card or reset
    cancelInLineBtn.addEventListener("click", () => {
        if(!title && !desc) {
            li.remove();    // new card, remove
            
        } else {
            setLocked(li, title, desc)  // existing card, reset
        }
        saveTasksToLocalStorage();
    });

    // Enter in title = click "Done"
    titleInput.addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            okBtn.click();
        }
    });
}

// Changes a card to "locked mode", with edit and delete buttons
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

    // Opens dialog to edit card
    editBtn.addEventListener("click", () => {
        openEditDialog(li);
    })

    li.append(h3, delBtn, p, editBtn);

    //Makes card draggable
    if(!li.draggable) makeDraggable(li);

}

// Button to add new card in "To Do" and open inline-editor
addTaskBtn.addEventListener("click", () => {
    const li = document.createElement("li");
    li.dataset.list = "todo";             // Track a list
    li.classList.add("card-enter");       // Class for animation
    todoUI.appendChild(li);
    setEditor(li);                        // Open inline edit mode
    li.scrollIntoView({block: "nearest"}) // Scroll if needed
});

// Opens dialog box to edit the task choosen
function openEditDialog(taskItem) {
    currentTask = taskItem;     // Save pointer
    const title = taskItem.querySelector("h3")?.textContent ?? "";
    const desc = taskItem.querySelector("p")?.textContent ?? "";

    editTitle.value = title;
    editDesc.value = desc;
    editList.value = parentOfList(taskItem);

    //Shows dialog and focus title
    editDialog.showModal();

    editTitle.focus();
    editTitle.select?.();
}

// Handles "Save" in dialog
editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(!currentTask) {
        editDialog.close();
        return;
    }

    const newTitle = editTitle.value.trim();
    const newDesc = editDesc.value.trim();
    const newListKey = editList.value;

    // Simple validation of title
    if(!newTitle) {
        editTitle.focus();
        return;
    }

    // Update text on card
    currentTask.querySelector("h3").textContent = newTitle;
    currentTask.querySelector("p").textContent = newDesc;

    // Move card between lists if user changed list
    const currentKey = parentOfList(currentTask);
    if(newListKey !== currentKey) {
        lists[newListKey].appendChild(currentTask);
        currentTask.dataset.list = newListKey;
    }

    editDialog.close();
    currentTask = null;
    saveTasksToLocalStorage();  // Save changes

});

// Creates delete button for a card
function createDeleteBtn(li) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "delete-btn";
    btn.textContent = "X";
    btn.title = "Delete card";
    btn.addEventListener("click", (e) => {
        e.stopPropagation();    // Prevents other click-events happening
        animateRemove(li);      // Plays the remove-animation and deletes
    });
    btn.draggable = false;      // Button is not draggable
    return btn;
}

// Animation when card is removed
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

    //Get all task cards from the three lists (li-elements)
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

    // Put in localStorage as JSON string
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// Function to load tasks from localStorage
function loadTasksFromLocalStorage() {
    // Get save tasks from localStorage
    const savedTasks = localStorage.getItem("tasks"); // Get the data

    //If no tasks, cancel
    if(!savedTasks) return;

    //Convert JSON string back to array of objects
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
