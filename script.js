/* =========================================
   1. CONFIGURATION & DATA
   ========================================= */
const portalData = {
    admin: {
        role: "Administrator",
        menu: ["User Management", "System Health", "Audit Logs", "Settings"],
        tabs: [
            { i: "fa-house", t: "Home" },
            { i: "fa-chart-line", t: "Analytics" },
            { i: "fa-gear", t: "Setup" }
        ],
        // Using Design System Classes instead of Inline Styles
        html: `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:32px">
                <div class="role-card" style="flex-direction: column; align-items: flex-start; cursor: default;">
                    <h2 class="heading-page" style="color: var(--primary);">0</h2>
                    <p class="label text-muted" style="text-transform:uppercase; letter-spacing: 0.5px;">Students</p>
                </div>
                <div class="role-card" style="flex-direction: column; align-items: flex-start; cursor: default;">
                    <h2 class="heading-page" style="color: var(--secondary);">0</h2>
                    <p class="label text-muted" style="text-transform:uppercase; letter-spacing: 0.5px;">Faculties</p>
                </div>
            </div>
            
            <h3 class="heading-section" style="margin-bottom: 16px;">System Activity</h3>
            <div class="role-card" style="cursor: default; display: block;">
                <p class="body-large text-muted">All systems operational.</p>
            </div>
        `
    },
    student: {
        role: "Student",
        menu: ["My Courses", "Examination", "Results", "Fees"],
        tabs: [
            { i: "fa-house", t: "Home" },
            { i: "fa-book", t: "Courses" },
            { i: "fa-poll", t: "Results" }
        ],
        html: `
            <div style="background: var(--text-dark); color: white; padding: 24px; border-radius: var(--radius-card); margin-bottom: 24px; box-shadow: var(--shadow);">
                <h3 class="heading-sub" style="color: white; margin-bottom: 8px;">Welcome back!</h3>
                <p class="body-regular" style="opacity: 0.9;">You have 2 pending assignments to complete this week.</p>
            </div>
            
            <div class="role-card" style="cursor: default; display: block;">
                <h4 class="heading-sub" style="margin-bottom: 12px;">Recent Activity</h4>
                <p class="body-small text-muted">No new notifications at this time.</p>
            </div>
        `
    },
    cr: {
        role: "Course Rep",
        menu: ["Class List", "Attendance", "Broadcasts"],
        tabs: [
            { i: "fa-house", t: "Home" },
            { i: "fa-bullhorn", t: "Posts" },
            { i: "fa-calendar", t: "Schedule" }
        ],
        html: `
            <div class="role-card" style="cursor: default; display: block; border-color: var(--primary);">
                <h4 class="heading-sub" style="margin-bottom: 4px;">Quick Announcement</h4>
                <p class="body-small text-muted" style="margin-bottom: 16px;">This will be sent to all students in your class.</p>
                
                <textarea 
                    style="width:100%; padding:12px; border-radius:var(--radius-btn); border:1px solid #E5E7EB; background:var(--bg-light); font-family:inherit; outline:none; height:100px; resize: none; margin-bottom: 16px;" 
                    placeholder="Type your message here..."></textarea>
                
                <button class="btn btn-primary" style="width: 100%;">Post to Class Feed</button>
            </div>
        `
    }
};

/* =========================================
   2. CORE LOGIC (NAVIGATION)
   ========================================= */

/**
 * Transition from Landing Page to Main App
 * @param {string} type - 'admin', 'student', or 'cr'
 */
function enterPortal(type) {
    const data = portalData[type];
    
    // 1. Populate Text Data
    document.getElementById('userRole').innerText = data.role;
    // document.getElementById('pageTitle').innerText = data.role + " Portal"; // Uncomment if you have a page title element
    
    // 2. Inject HTML Content
    document.getElementById('content').innerHTML = data.html;
    
    // 3. Generate Sidebar Menu
    document.getElementById('menuList').innerHTML = data.menu
        .map((m, index) => `<li class="${index === 0 ? 'active' : ''}">${m}</li>`)
        .join('');
    
    // 4. Generate Mobile Bottom Dock
    const bottomNav = document.getElementById('bottomNav');
    if (bottomNav) {
        bottomNav.innerHTML = data.tabs.map((tab, i) => `
            <a href="#" class="dock-item ${i === 0 ? 'active' : ''}">
                <i class="fas ${tab.i}"></i>
                <span>${tab.t}</span>
            </a>
        `).join('');
    }
    
    // 5. Handle View Transition (Smooth Fade)
    const landing = document.getElementById('landingPage');
    const app = document.getElementById('appShell'); // Ensure your main div has this ID class="app-container"
    
    landing.style.opacity = '0';
    landing.style.pointerEvents = 'none'; // Prevent clicks during fade
    
    setTimeout(() => {
        landing.style.display = 'none';
        
        // Flex is required for the layout to work as defined in CSS
        app.style.display = 'flex'; 
        app.classList.add('fade-in'); // Optional: Add a CSS animation class here
    }, 300);
}

/**
 * Log out and return to landing page
 */
function logout() {
    const landing = document.getElementById('landingPage');
    const app = document.getElementById('appShell');

    app.style.display = 'none';
    landing.style.display = 'flex';
    
    // Small delay to allow display:flex to apply before changing opacity
    setTimeout(() => {
        landing.style.opacity = '1';
        landing.style.pointerEvents = 'all';
    }, 10);
    
    // Reset Drawer
    toggleDrawer(false);
}

/* =========================================
   3. UI INTERACTION & EVENTS
   ========================================= */

/**
 * Toggle Mobile Sidebar
 * @param {boolean} open - true to open, false to close
 */
function toggleDrawer(open) {
    const drawer = document.getElementById('drawer'); // Ensure sidebar has id="drawer"
    const overlay = document.getElementById('overlay');
    
    if (open) {
        drawer.classList.add('active');
        overlay.classList.add('active');
    } else {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
    }
}

/**
 * Synchronize Profile Picture Upload
 * @param {HTMLInputElement} input 
 */
function syncPfp(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const imgHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
            
            // Update Sidebar PFP
            const sidePfp = document.getElementById('sidePfp');
            if(sidePfp) sidePfp.innerHTML = imgHTML;
            
            // Update Header PFP
            const headPfp = document.getElementById('headPfp');
            if(headPfp) headPfp.innerHTML = imgHTML;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}