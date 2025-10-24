const addTaskBtn = document.getElementById("addTaskBtn");
const todoUI = document.getElementById("task-todo");

const editDialog = document.getElementById("editDialog");
const editForm = document.getElementById("editForm");       //Get elements from html document
const editTitle = document.getElementById("editTitle");
const editDesc = document.getElementById("editDesc");

//The li element that is edited in the dialog, acts as a pointer
let currentTask = null;

//Function to add task
function setEditor (li, title = "", desc = ""){
    li.innerHTML = "";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Rubrik";
    titleInput.value= title;

    const descInput = document.createElement("textarea");
    descInput.rows = 3;
    descInput.placeholder = "Kort beskrivning";
    descInput.value = desc;

    const okBtn = document.createElement("button");
    okBtn.textContent = "Klar";

    const cancelInLineBtn = document.createElement("button");
    cancelInLineBtn.textContent = "Avbryt";

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
    });

    cancelInLineBtn.addEventListener("click", () => {
        if(!title && !desc) {
            li.remove();
        } else {
            setLocked(li, title, desc)
        }
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

    const p = document.createElement("p");
    p.textContent = desc;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
        openEditDialog(li);
    })

    li.append(h3, p, editBtn);

}

addTaskBtn.addEventListener("click", () => {
    const li = document.createElement("li");
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

    if(!newTitle) {
        editTitle.focus();
        return;
    }

    currentTask.querySelector("h3").textContent = newTitle;
    currentTask.querySelector("p").textContent = newDesc;

    editDialog.close();
    currentTask = null;
});
