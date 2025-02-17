function addTask(input, taskList) {
    if (input.value.trim() === "") return;

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    // 创建复选框
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // 创建任务文本
    const taskText = document.createElement("span");
    taskText.textContent = input.value;

    // 复选框勾选后划掉任务
    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            taskText.style.textDecoration = "line-through";
            taskText.style.color = "#777";
        } else {
            taskText.style.textDecoration = "none";
            taskText.style.color = "black";
        }
    });

    // 创建删除按钮
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "-";
    deleteButton.classList.add("del-btn");
    deleteButton.onclick = function () {
        taskList.removeChild(taskDiv);
    };

    // 组合元素
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskText);
    taskDiv.appendChild(deleteButton);
    taskList.appendChild(taskDiv);

    input.value = "";
}
