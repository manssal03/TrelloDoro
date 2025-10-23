//Function to add task

const addTaskBtn = document.getElementById("addTaskBtn");
const todoUI = document.getElementById("task-todo");

function setEditor (li, title = " ", desc = " "){
    li.innerHtml = "";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Rubrik";
    titleInput.value= title;

    const descInput = document.createElement("textarea");
    descInput.rows = 3;
    descInput.placeholder = "Kort beskrivning";
    descInput.value = desc;

    const okBtn = document.createElement("button");
    okBtn.textContent("Klar");

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent("Avbryt");

    li.append(titleInput, descInput, okBtn, cancelBtn);
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

    cancelBtn.addEventListener("click", () => {
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

function setLocked(li, title, desc) {
    li.innerHtml= "";

    const h3 = document.createElement("h3");
    h3.textContent = title;

    const p = document.createElement("p");
    p.textContent = desc;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    li.append(h3, p, editBtn);

}

addTaskBtn.addEventListener("click", () => {
    const li = document.createElement("li");
    todoUI.appendChild(li);
    setEditor(li);
    li.scrollIntoView({block: "nearest"})
})