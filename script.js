document.addEventListener("DOMContentLoaded", function () {
    const weekDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // 调整到本周一

    function renderCalendar() {
        renderWeek("weekdays1", "dates1", "task-container1", startDate);
        const nextWeekStart = new Date(startDate);
        nextWeekStart.setDate(startDate.getDate() + 7);
        renderWeek("weekdays2", "dates2", "task-container2", nextWeekStart);
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

            let dateStr = `${date.toLocaleDateString("de-DE", { day: 'numeric', month: 'long' })}`;

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

            // 如果是今天，添加绿色背景
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
