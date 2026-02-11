// Sample Data
const courseData = [
    { name: "Introduction to Engineering", code: "ENG 101" },
    { name: "Digital Logic Design", code: "CSC 204" },
    { name: "Technical Communication", code: "GNS 102" },
    { name: "Applied Mathematics II", code: "MTH 202" }
];

const portalData = {
    admin: {
        role: "Administrator",
        menu: ["Dashboard", "Upload PDF", "Logs", "Settings"],
        tabs: [{i:"fa-house", t:"Home"}, {i:"fa-file-pdf", t:"Files"}, {i:"fa-gear", t:"Setup"}],
        homeHtml: `<h3>Admin Overview</h3><div class="role-card" style="display:block"><h4>System Status</h4><p class="text-muted">All servers are running normally. No pending flags.</p></div>`
    },
    student: {
        role: "Student",
        menu: ["Dashboard", "Course List", "Downloads"],
        tabs: [{i:"fa-house", t:"Home"}, {i:"fa-book", t:"Courses"}, {i:"fa-download", t:"Files"}],
        homeHtml: `<div style="background:var(--text-dark); color:white; padding:25px; border-radius:15px; margin-bottom:20px;"><h3>Welcome back!</h3><p>You have 3 new study materials available.</p></div>`
    },
    cr: {
        role: "Course Rep",
        menu: ["Dashboard", "Course List", "Uploads", "Downloads", "Broadcasts"],
        tabs: [{i:"fa-house", t:"Home"}, {i:"fa-upload", t:"Upload"}, {i:"fa-bullhorn", t:"Post"}],
        homeHtml: `<div class="role-card" style="display:block; border-color:var(--primary)"><h3>Class Bulletin</h3><p class="text-muted">Send alerts or reminders to the class list instantly.</p></div>`
    }
};

let activeRole = "";

// 1. Persistence: Check for session on load
window.onload = () => {
    const savedRole = localStorage.getItem('cram_session');
    if(savedRole) enterPortal(savedRole);
};

function enterPortal(role) {
    activeRole = role;
    localStorage.setItem('cram_session', role);
    
    const data = portalData[role];
    document.getElementById('userRole').innerText = data.role;
    document.getElementById('content').innerHTML = data.homeHtml;
    
    // Build Sidebar
    document.getElementById('menuList').innerHTML = data.menu.map((m, i) => 
        `<li class="${i===0?'active':''}" onclick="navigate('${m}', this)">${m}</li>`).join('');
    
    // Build Dock
    const dock = document.getElementById('bottomNav');
    if(dock) dock.innerHTML = data.tabs.map((tab, i) => 
        `<a href="#" class="dock-item ${i===0?'active':''}" onclick="navigate('${tab.t}', this, true)">
            <i class="fas ${tab.i}"></i><span>${tab.t}</span></a>`).join('');

    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('appShell').style.display = 'flex';
}

function navigate(view, el, isDock = false) {
    const content = document.getElementById('content');
    document.getElementById('pageTitle').innerText = view;
    
    // UI Active State
    document.querySelectorAll(isDock ? '.dock-item' : '.main-menu li').forEach(x => x.classList.remove('active'));
    el.classList.add('active');
    toggleDrawer(false);

    // View Routing
    if(view === "Dashboard" || view === "Home") {
        content.innerHTML = portalData[activeRole].homeHtml;
    } 
    else if(view.includes("Course List") || view === "Courses") {
        content.innerHTML = `<h3>My Course List</h3>` + courseData.map(c => `
            <div class="role-card" style="justify-content:space-between">
                <div><h4 style="margin:0">${c.name}</h4><span class="label text-muted">${c.code}</span></div>
                <i class="fas fa-check-circle" style="color:var(--secondary)"></i>
            </div>`).join('');
    }
    else if(view.includes("Upload")) {
        content.innerHTML = `<h3>Upload Center</h3>
            <div class="upload-box" onclick="document.getElementById('fileIn').click()">
                <i class="fas fa-cloud-arrow-up" style="font-size:40px; color:var(--primary); margin-bottom:10px"></i>
                <h4>Tap to select file</h4><p class="text-muted">PDF or Document formats preferred</p>
                <input type="file" id="fileIn" hidden onchange="alert('Uploaded: ' + this.files[0].name)">
            </div>`;
    }
    else if(view.includes("Download") || view === "Files") {
        content.innerHTML = `<h3>Downloads</h3>
            <div class="role-card" onclick="alert('Downloading...')">
                <i class="fas fa-file-pdf" style="color:var(--danger); font-size:24px"></i>
                <div style="flex:1"><h4>Module_01_Notes.pdf</h4><p class="text-muted">1.2 MB</p></div>
                <i class="fas fa-download" style="color:var(--primary)"></i>
            </div>`;
    }
    else {
        content.innerHTML = `<p class="text-muted">Interface for ${view} coming soon.</p>`;
    }
}

function logout() { localStorage.removeItem('cram_session'); location.reload(); }

function toggleDrawer(open) {
    document.getElementById('drawer').classList.toggle('active', open);
    document.getElementById('overlay').classList.toggle('active', open);
}

function syncPfp(input) {
    if (input.files && input.files[0]) {
        let r = new FileReader();
        r.onload = (e) => {
            let img = `<img src="${e.target.result}">`;
            document.getElementById('sidePfp').innerHTML = img;
            document.getElementById('headPfp').innerHTML = img;
        };
        r.readAsDataURL(input.files[0]);
    }
}
