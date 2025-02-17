console.log("JavaScript wurde geladen!"); // 确保 JS 文件被正确加载

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM ist geladen!"); // 确保 HTML 加载完毕

    const weekDays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);

    function renderCalendar() {
        console.log("Rendering calendar..."); // 确保 renderCalendar() 被调用
        renderWeek("weekdays", "dates", "task-container", startDate);
    }

    function renderWeek(weekdaysId, datesId, containerId, startOfWeek) {
        const weekdaysContainer = document.getElementById(weekdaysId);
        const datesContainer = document.getElementById(datesId);
        const taskContainer = document.getElementById(containerId);

        // 检查是否找到了正确的 HTML 元素
        if (!weekdaysContainer || !datesContainer || !taskContainer) {
            console.error("HTML-Struktur fehlt!");
            return;
        }

        weekdaysContainer.innerHTML = "";
        datesContainer.innerHTML = "";
        taskContainer.innerHTML = "";

        for (let i = 0; i < 7; i++) {
            let date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            let dateStr = date.toLocaleDateString("de-DE", { day: 'numeric', month: 'long' });

            const dayHeader = document.createElement("div");
            dayHeader.textContent = weekDays[i];
            weekdaysContainer.appendChild(dayHeader);

            const dateDiv = document.createElement("div");
            dateDiv.textContent = dateStr;
            datesContainer.appendChild(dateDiv);

            const column = document.createElement("div");
            column.classList.add("task-column");

            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                column.classList.add("today-column");
            }

            const taskList = document.createElement("div");
            taskList.classList.add("task-list");
            column.appendChild(taskList);

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Aufgabe hinzufügen";
            column.appendChild(input);

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

    document.getElementById("prevWeek").addEventListener("click", function () {
        startDate.setDate(startDate.getDate() - 7);
        render
