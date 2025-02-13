document.addEventListener("DOMContentLoaded", function () {
    const weekDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    let startDate = new Date(); // 以今天为起点
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // 调整到本周一

    const weekdaysContainer = document.getElementById("weekdays");
    const taskContainer = document.getElementById("task-container");

    function renderCalendar() {
        weekdaysContainer.innerHTML = "";
        taskContainer.innerHTML = "";

        for (let i = 0; i < 14; i++) {
            let date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            let dateStr = `${weekDays[i % 7]} - ${date.toLocaleDateString("de-DE", { day: 'numeric', month: 'long' })}`;

            // 添加星期标题
            const dayHeader = document.createElement("div");
            dayHeader.textContent = weekDays[i % 7];
            weekdaysContainer.appendChild(dayHeader);

            // 创建任务列
            const column = document.createElement("div");
            column.classList.add("task-column");

            // 如果是今天，添加绿色背景
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                column.classList.add("today-column");
            }

            // 显示日期
            const title = document.createElement("h3");
            title.textContent = dateStr;
            column.appendChild(title);

            // 任务列表
            const taskList = document.createElement("div");
            taskList.classList.add("task-list");
            column.appendChild(taskList);

            // 输入框
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Aufgabe hinzufügen";
            column.appendChild(input);

            // 添加按钮
            const addButton = document.createElement("button");
            addButton.textContent = "Hinzufügen";
            addButton.onclick = function () {
                addTask(input, taskList);
            };
            column.appendChild(addButton);

            taskContainer.appendChild(column);
        }
    }

    function addTask(input, taskList) {
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
        deleteButton.textContent = "Löschen";
        deleteButton.onclick = function () {
            taskList.removeChild(taskDiv);
        };

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskText);
        taskDiv.appendChild(deleteButton);
        taskList.appendChild(taskDiv);

        input.value = "";
    }

    document.getElementById("prevWeek").addEventListener("click", function () {
        startDate.setDate(startDate.getDate() - 7);
        renderCalendar();
    });

    document.getElementById("nextWeek").addEventListener("click", function () {
        startDate.setDate(startDate.getDate() + 7);
        renderCalendar();
    });

    document.getElementById("todayButton").addEventListener("click", function () {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
        renderCalendar();
    });

    renderCalendar();
});
