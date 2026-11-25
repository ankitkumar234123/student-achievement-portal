// Load saved data or start with an empty list
var achievements = JSON.parse(localStorage.getItem("myData")) || [];

// Save data to browser
function saveData() {
    localStorage.setItem("myData", JSON.stringify(achievements));
}

// Show success or error message
function showMsg(text, type) {
    var msg = document.getElementById("msg");
    msg.innerText = text;
    msg.className = type;
}

// 1. Add a new achievement when form is submitted
document.getElementById("myForm").addEventListener("submit", function(e) {
    e.preventDefault();

    var title = document.getElementById("title").value;
    var category = document.getElementById("category").value;
    var status = document.getElementById("status").value;
    var date = document.getElementById("date").value;

    // Input validation
    if (title == "" || category == "" || date == "") {
        showMsg("Please fill in all fields!", "error");
        return;
    }

    var item = {
        id: Date.now(),
        title: title,
        category: category,
        status: status,
        date: date
    };

    achievements.push(item);
    saveData();
    document.getElementById("myForm").reset();
    showMsg("Achievement added!", "success");
    showList();
});

// 2. Change status between In Progress and Completed
function toggleStatus(id) {
    for (var i = 0; i < achievements.length; i++) {
        if (achievements[i].id == id) {
            if (achievements[i].status == "Completed") {
                achievements[i].status = "In Progress";
            } else {
                achievements[i].status = "Completed";
            }
        }
    }
    saveData();
    showList();
}

// 3. Delete an achievement
function deleteItem(id) {
    for (var i = 0; i < achievements.length; i++) {
        if (achievements[i].id == id) {
            achievements.splice(i, 1);
            break;
        }
    }
    saveData();
    showList();
}

// 4. Display the filtered list on screen
function showList() {
    var search = document.getElementById("search").value.toLowerCase();
    var cat = document.getElementById("filterCat").value;
    var stat = document.getElementById("filterStat").value;
    var listDiv = document.getElementById("list");

    listDiv.innerHTML = "";

    for (var i = 0; i < achievements.length; i++) {
        var a = achievements[i];

        // Check search and filters
        var matchSearch = a.title.toLowerCase().indexOf(search) != -1;
        var matchCat = (cat == "All" || a.category == cat);
        var matchStat = (stat == "All" || a.status == stat);

        if (matchSearch && matchCat && matchStat) {
            listDiv.innerHTML +=
                "<div class='item'>" +
                "<h3>" + a.title + "</h3>" +
                "<p>Category: " + a.category + " | Status: <b>" + a.status + "</b> | Date: " + a.date + "</p>" +
                "<button class='btn-blue' onclick='toggleStatus(" + a.id + ")'>Change Status</button>" +
                "<button class='btn-red' onclick='deleteItem(" + a.id + ")'>Delete</button>" +
                "</div>";
        }
    }

    updateDashboard();
}

// 5. Update dashboard numbers and progress bar
function updateDashboard() {
    var total = achievements.length;
    var completed = 0;
    var acad = 0;
    var sport = 0;
    var extra = 0;

    for (var i = 0; i < total; i++) {
        if (achievements[i].status == "Completed") completed++;
        if (achievements[i].category == "Academic") acad++;
        if (achievements[i].category == "Sports") sport++;
        if (achievements[i].category == "Extracurricular") extra++;
    }

    var inProgress = total - completed;
    var rate = 0;
    if (total > 0) {
        rate = Math.round((completed / total) * 100);
    }

    document.getElementById("totalCount").innerText = total;
    document.getElementById("completedCount").innerText = completed;
    document.getElementById("progressCount").innerText = inProgress;
    document.getElementById("rateCount").innerText = rate + "%";

    document.getElementById("progressBar").value = rate;
    document.getElementById("progressText").innerText = completed + " of " + total + " completed";

    document.getElementById("acadCount").innerText = acad;
    document.getElementById("sportCount").innerText = sport;
    document.getElementById("extraCount").innerText = extra;
}

// Run when page opens
showList();