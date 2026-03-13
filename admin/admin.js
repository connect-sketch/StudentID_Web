document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const adminEmailInput = document.getElementById('admin-email');
    const adminPasswordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const logoutButton = document.getElementById('logout-button');
    const navButtons = document.querySelectorAll('.nav-button');
    const dataSections = document.querySelectorAll('.data-section');
    const forgotPasswordLink = document.getElementById('forgot-password-link');

    const ADMIN_AUTH_TOKEN_KEY = 'admin_auth_token';
    const API_BASE_URL = ''; // Relative path for single project setup
    const GOOGLE_CLIENT_ID = '329586274471-bb5c6v0g2qlpli5njldko1iu41950u8o.apps.googleusercontent.com';

    // --- Check Login on Page Load ---
    function checkLogin() {
        const storedToken = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
        if (storedToken) {
            loginContainer.style.display = 'none';
            dashboardContainer.style.display = 'flex';
            // Load home stats by default after login
            document.querySelector('.nav-button[data-target="home"]').click();
        } else {
            loginContainer.style.display = 'flex';
            dashboardContainer.style.display = 'none';
            initializeGoogleSignIn();
        }
    }

    // --- Initialize Google Sign-In ---
    function initializeGoogleSignIn() {
        if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleLoginCallback
            });
            google.accounts.id.renderButton(
                document.getElementById('google-login-btn'),
                { theme: 'outline', size: 'large', width: 280 }
            );
        } else {
            // Retry after a short delay if script hasn't loaded yet
            setTimeout(initializeGoogleSignIn, 500);
        }
    }

    // --- Handle Google Login Callback ---
    async function handleGoogleLoginCallback(response) {
        const idToken = response.credential;

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, data.token);
                loginError.textContent = '';
                checkLogin();
            } else {
                const errorText = await res.text();
                loginError.textContent = `Login failed: ${errorText}`;
            }
        } catch (error) {
            console.error('Google login error:', error);
            loginError.textContent = 'An error occurred during Google authentication.';
        }
    }

    checkLogin();

    // Handle Manual Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = adminEmailInput.value;
        const password = adminPasswordInput.value;

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, data.token);
                loginError.textContent = '';
                checkLogin();
            } else {
                loginError.textContent = 'Login failed: Invalid email or password.';
            }
        } catch (error) {
            loginError.textContent = 'An error occurred during login.';
        }
    });

    // Handle Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
        adminEmailInput.value = '';
        adminPasswordInput.value = '';
        checkLogin();
    });

    // Forgot Password Link
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Standard password reset is not supported when using Google login. Please use your Google account to log in.');
    });

    // Handle Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const targetId = button.dataset.target;
            dataSections.forEach(section => section.style.display = 'none');
            document.getElementById(targetId).style.display = 'block';
            
            fetchData(targetId);
        });
    });

    // Function to fetch and display data
    async function fetchData(endpoint) {
        const storedToken = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
        if (!storedToken) {
            checkLogin();
            return;
        }

        const headers = {
            'Authorization': `Bearer ${storedToken}`
        };

        if (endpoint === 'home') {
            const statsEndpoints = {
                callbacks: 'callback-requests',
                eligibility: 'eligibility-checks',
                expert: 'expert-requests',
                counselling: 'counselling-sessions'
            };
            
            for (const key in statsEndpoints) {
                const statNumberEl = document.getElementById(`stats-${key}`);
                if (statNumberEl) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/admin/${statsEndpoints[key]}`, { headers });
                        if (response.ok) {
                            const data = await response.json();
                            statNumberEl.textContent = data.length;
                        } else {
                            statNumberEl.textContent = 'N/A';
                        }
                    } catch (error) {
                        statNumberEl.textContent = 'Error';
                    }
                }
            }
            return;
        }

        const currentSection = document.getElementById(endpoint);
        const tableContainer = currentSection.querySelector('.table-container');
        tableContainer.innerHTML = '<p>Loading data...</p>';

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/${endpoint}`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderTable(data, tableContainer, endpoint);
            } else {
                const errorText = await response.text();
                tableContainer.innerHTML = `<p class="error-message">Error fetching data: ${errorText}</p>`;
                if (response.status === 401) {
                    logoutButton.click();
                }
            }
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            tableContainer.innerHTML = `<p class="error-message">An error occurred while fetching data.</p>`;
        }
    }
    
    function renderTable(data, container, endpoint) {
        if (!data || data.length === 0) {
            container.innerHTML = '<p>No data available.</p>';
            return;
        }

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const HEADER_MAP = {
            name: 'Name',
            email: 'Email',
            phone: 'Phone Number',
            message: 'Message',
            highestQualification: 'Highest Qualification',
            overallMarksGPA: 'Overall Marks/GPA',
            standardizedTestScores: 'Test Scores',
            country: 'Country',
            sessionDate: 'Session Date',
            sessionSlot: 'Time Slot',
            testType: 'Test Type',
            eventType: 'Event Type',
            source: 'Source',
            details: 'Details',
            referralCode: 'Referral Code',
            createdAt: 'Submission Date',
            updatedAt: 'Last Updated'
        };

        const headers = Object.keys(data[0]).filter(key => key !== '_id' && key !== '__v');

        const headerRow = document.createElement('tr');
        headers.forEach(headerKey => {
            const th = document.createElement('th');
            th.textContent = HEADER_MAP[headerKey] || headerKey;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        data.forEach(item => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                let cellContent = item[header];

                if (header === 'createdAt' || header === 'updatedAt' || header === 'timestamp') {
                    cellContent = new Date(cellContent).toLocaleString();
                } else if (typeof cellContent === 'object' && cellContent !== null) {
                    cellContent = JSON.stringify(cellContent);
                }
                
                td.textContent = cellContent;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        container.innerHTML = '';
        container.appendChild(table);
    }

    function downloadAsCSV(targetTableId) {
        const section = document.getElementById(targetTableId);
        const table = section.querySelector('table');
        if (!table) {
            alert('No data table found to export.');
            return;
        }

        const headers = Array.from(table.querySelectorAll('thead th')).map(th => `"${th.textContent.replace(/"/g, '""')}"`);
        let csvRows = [headers.join(',')];

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowData = Array.from(row.querySelectorAll('td')).map(td => {
                const data = (td.textContent || '').replace(/"/g, '""');
                return `"${data}"`;
            });
            csvRows.push(rowData.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${targetTableId}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    document.addEventListener('click', (e) => {
        if (e.target.matches('.download-csv-btn')) {
            const targetTable = e.target.dataset.targetTable;
            downloadAsCSV(targetTable);
        }
    });

    // --- Table Filtering Logic ---
    document.addEventListener('input', (e) => {
        if (e.target.matches('.table-filter')) {
            const searchTerm = e.target.value.toLowerCase();
            const targetId = e.target.dataset.target;
            const section = document.getElementById(targetId);
            const rows = section.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        }
    });
});
