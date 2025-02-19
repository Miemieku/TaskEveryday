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
        if (!taskList) return;
        if (input.value.trim() === "") return;
    
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.setAttribute("draggable", "true"); // ✅ 让任务可以拖拽
    
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
    
        const taskSpan = document.createElement("span"); // ✅ 直接创建任务文本
        taskSpan.textContent = input.value; // ✅ 直接赋值 input.value
        taskSpan.classList.add("editable");
    
        // ✅ 让任务支持修改
        taskSpan.addEventListener("click", function () {
            editTask(taskSpan);
        });
    
        checkbox.addEventListener("change", function () {
            taskSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";
            taskSpan.style.color = checkbox.checked ? "#777" : "black";
        });
    
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "-";
        deleteButton.classList.add("del-btn");
        deleteButton.onclick = function () {
            taskList.removeChild(taskDiv);
        };
    
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(taskSpan); // ✅ 正确添加任务文本
        taskDiv.appendChild(deleteButton);
        taskList.appendChild(taskDiv);
    
        input.value = "";
    
        // ✅ 让任务支持拖拽
        taskDiv.addEventListener("dragstart", handleDragStart);
        taskDiv.addEventListener("dragend", handleDragEnd);
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
       // 导出 Excel
    document.getElementById("exportExcel").addEventListener("click", function () {
        const wb = XLSX.utils.book_new();
        const ws_data = [["Datum", "Aufgabe", "Erledigt"]]; // ✅ 增加 "Erledigt" 列
    
        document.querySelectorAll(".task-column").forEach((column, index) => {
            const dateText = document.querySelectorAll(".dates div")[index].textContent;
            column.querySelectorAll(".task").forEach(task => {
                const taskText = task.querySelector("span").textContent;
                const isChecked = task.querySelector("input[type='checkbox']").checked ? "Ja" : "Nein"; // ✅ 记录任务是否完成
                ws_data.push([dateText, taskText, isChecked]);
            });
        });
    
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Aufgaben");
        
        const today = new Date().toISOString().split("T")[0]; // 📌 获取 YYYY-MM-DD 格式的日期
        const fileName = `Wochenaufgaben_${today}.xlsx`; // ✅ 生成文件名
        XLSX.writeFile(wb, fileName);        
        XLSX.writeFile(wb, "Wochenaufgaben.xlsx");
    });
    

    // 📥 导入 Excel
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
    
            // **🚨 清空所有任务**
            document.querySelectorAll(".task-list").forEach(list => {
                list.innerHTML = "";
            });
    
            tasks.slice(1).forEach(row => {
                const [date, taskText, completed] = row;
                if (!date || !taskText) return;
    
                document.querySelectorAll(".task-column").forEach((column, index) => {
                    const dateText = document.querySelectorAll(".dates div")[index].textContent;
                    if (dateText === date) {
                        addTaskToColumn(taskText, column, completed === "Ja"); // ✅ 传递完成状态
                    }
                });
            });
        };
        reader.readAsArrayBuffer(file);
    });
    

    function setupDragAndDrop() {
        document.querySelectorAll(".task-list").forEach(list => {
            list.addEventListener("dragover", function (event) {
                event.preventDefault();
            });
    
            list.addEventListener("drop", function (event) {
                event.preventDefault();
                
                let targetList = event.target.closest(".task-list"); // ✅ 获取正确的 `task-list`
                if (!targetList || !draggedTask) return;
                
                targetList.appendChild(draggedTask);
                draggedTask.classList.remove("dragging");
                draggedTask = null;
            });            
        });
    }

    renderCalendar();
    setupDragAndDrop(); // ✅ 确保拖拽事件在 DOM 生成后绑定
});

let draggedTask = null;

function handleDragStart(event) {
    draggedTask = event.target.closest(".task");; // 记录当前拖动的任务
    event.target.classList.add("dragging");
    event.dataTransfer.setData("text/plain", "task"); // ✅ 必须设置 dataTransfer
    event.dataTransfer.effectAllowed = "move"; // 显示拖拽为移动
}


function handleDragEnd(event) {
    event.target.classList.remove("dragging");
}


// 添加任务到列
function addTaskToColumn(taskText, column, isCompleted = false) {
    const taskList = column.querySelector(".task-list");
    if (!taskList) return;

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.setAttribute("draggable", "true");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted; // ✅ 任务完成状态
    if (isCompleted) {
        taskDiv.classList.add("completed"); // ✅ 添加划线样式
    }

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    taskSpan.classList.add("editable");

    // ✅ 让任务支持修改
    taskSpan.addEventListener("click", function () {
        editTask(taskSpan);
    });

    checkbox.addEventListener("change", function () {
        taskSpan.style.textDecoration = checkbox.checked ? "line-through" : "none";
        taskSpan.style.color = checkbox.checked ? "#777" : "black";
    });

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

        // ✅ 让任务支持拖拽
    taskDiv.addEventListener("dragstart", handleDragStart);
    taskDiv.addEventListener("dragend", handleDragEnd);

}


function editTask(taskSpan) {
    const oldText = taskSpan.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    input.classList.add("edit-input");

    // ✅ 按 Enter 或失去焦点时保存
    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            saveTaskEdit(input, taskSpan);
        }
    });

    input.addEventListener("blur", function () {
        saveTaskEdit(input, taskSpan);
    });

    taskSpan.replaceWith(input);
    input.focus();
}

function saveTaskEdit(input, taskSpan) {
    const newText = input.value.trim();
    if (newText === "") {
        newText = "Neue Aufgabe"; // ✅ 如果输入为空，默认值
    }

    taskSpan.textContent = newText;
    taskSpan.classList.add("editable");

    // ✅ 重新绑定点击事件
    taskSpan.addEventListener("click", function () {
        editTask(taskSpan);
    });

    input.replaceWith(taskSpan);
}
