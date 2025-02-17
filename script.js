document.addEventListener("DOMContentLoaded", function () {
    const weekDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // 设置为本周一

    function renderCalendar() {
        renderWeek("weekdays", "dates", "task-container", startDate);
    }

    function renderWeek(weekdaysId, datesId, containerId, startOfWeek) {
        const weekdaysContainer = document.getElementById(weekdaysId);
        const datesContainer = document.getElementById(datesId);
        const taskContainer = document.getElementById(containerId);

        weekdaysContainer.innerHTML = "";
        datesContainer.innerHTML = "";
        taskContainer.innerHTML = "";

        for (let i = 0; i < 7; i++) {
            let date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);

            let dateStr = date.toLocaleDateString("de-DE", { day: 'numeric', month: 'long' });

            // 添加星期标题
            const dayHeader = document.createElement("div");
            dayHeader.textContent = weekDays[i];
            weekdaysContainer.appendChild(dayHeader);

            // 添加日期
            const dateDiv = document.createElement("div");
            dateDiv.textContent = dateStr;
            datesContainer.appendChild(dateDiv);

            // 创建任务列
            const column = document.createElement("div");
            column.classList.add("task-column");

            // 如果是今天，添加蓝色背景
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                column.classList.add("today-column");
            }

            // 任务列表
            const taskList = document.createElement("div");
            taskList.classList.add("task-list");
            column.appendChild(taskList);

            // 输入框
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Aufgabe hinzufügen";
            column.appendChild(input);

            // 添加按钮（+）
            const addButton = document.createElement("button");
            addButton.textContent = "+";
            addButton.classList.add("add-btn");
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

        const taskText = document.createElement("span");
        taskText.textContent = input.value;

        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                taskText.style.textDecoration = "line-through";
                taskText.style.color = "#777";
            } else {
                taskText.style.textDecoration = "none";
                taskText.style.color = "black";
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "-";
        deleteButton.classList.add("del-btn");
        deleteButton.onclick = function () {
            taskList.removeChild(taskDiv);
        };

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskText);
        taskDiv.appendChild(deleteButton);
        taskList.appendChild(taskDiv);

        input.value = "";
    }

    // **修正前后跳转周的问题**
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
