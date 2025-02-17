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


document.getElementById("exportExcel").addEventListener("click", function () {
    const wb = XLSX.utils.book_new(); // 创建新的 Excel 工作簿
    const ws_data = [["日期", "任务"]]; // Excel 头部

    // 遍历任务列
    document.querySelectorAll(".task-column").forEach((column, index) => {
        const dateText = document.querySelectorAll(".dates div")[index].textContent;
        column.querySelectorAll(".task span").forEach(task => {
            ws_data.push([dateText, task.textContent]); // 添加任务
        });
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data); // 转换数据到 Sheet
    XLSX.utils.book_append_sheet(wb, ws, "Tasks"); // 添加 Sheet 到 Workbook

    XLSX.writeFile(wb, "Wochenaufgaben.xlsx"); // 下载 Excel 文件
});

document.getElementById("importExcelBtn").addEventListener("click", function () {
    document.getElementById("importExcel").click();
});

document.getElementById("importExcel").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const tasks = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        tasks.slice(1).forEach(row => {
            const [date, taskText] = row;
            if (!date || !taskText) return;

            document.querySelectorAll(".task-column").forEach((column, index) => {
                const dateText = document.querySelectorAll(".dates div")[index].textContent;
                if (dateText === date) {
                    addTaskToColumn(taskText, column);
                }
            });
        });
    };
    reader.readAsArrayBuffer(file);
});

// 添加任务到列
function addTaskToColumn(taskText, column) {
    const taskList = column.querySelector(".task-list");
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "-";
    deleteButton.classList.add("del-btn");
    deleteButton.onclick = function () {
        taskList.removeChild(taskDiv);
    };

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskSpan);
    taskDiv.appendChild(deleteButton);
    taskList.appendChild(taskDiv);
}
