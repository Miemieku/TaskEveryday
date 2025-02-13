document.addEventListener("DOMContentLoaded", function () {
    const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
    const taskContainer = document.querySelector(".task-container");

    // 生成每一天的任务列
    weekDays.forEach((day, index) => {
        const column = document.createElement("div");
        column.classList.add("task-column");

        const title = document.createElement("h3");
        title.textContent = day;
        column.appendChild(title);

        const taskList = document.createElement("div");
        taskList.classList.add("task-list");
        column.appendChild(taskList);

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "添加任务";
        column.appendChild(input);

        const addButton = document.createElement("button");
        addButton.textContent = "添加";
        addButton.onclick = function () {
            addTask(input, taskList, index);
        };
        column.appendChild(addButton);

        taskContainer.appendChild(column);
    });

    function addTask(input, taskList, dayIndex) {
        if (input.value.trim() === "") return;

        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.onchange = function () {
            if (checkbox.checked) {
                taskDiv.style.textDecoration = "line-through";
            } else {
                taskDiv.style.textDecoration = "none";
            }
        };

        const taskText = document.createElement("span");
        taskText.textContent = input.value;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "删除";
        deleteButton.onclick = function () {
            taskList.removeChild(taskDiv);
        };

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskText);
        taskDiv.appendChild(deleteButton);
        taskList.appendChild(taskDiv);

        input.value = "";
    }
});
