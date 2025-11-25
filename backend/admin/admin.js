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

    const ADMIN_AUTH_TOKEN_KEY = 'admin_auth_token'; // Will store a token in the future
    const API_BASE_URL = 'https://student-id-web.vercel.app';

    // --- Check Login on Page Load ---
    function checkLogin() {
        const storedToken = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
        if (storedToken) {
            loginContainer.style.display = 'none';
            dashboardContainer.style.display = 'flex';
            fetchData('callback-requests');
        } else {
            loginContainer.style.display = 'flex';
            dashboardContainer.style.display = 'none';
        }
    }

    checkLogin();

    // Handle Login
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
                // For now, we'll store the password as the 'token'. This should be replaced with a real JWT.
                localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, password);
                loginError.textContent = '';
                checkLogin(); // Re-run checkLogin to show dashboard and fetch data
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
        checkLogin(); // Re-run checkLogin to show the login screen
    });

    // Forgot Password Link
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Forgot Password functionality will be implemented in the next phase.');
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

        const currentSection = document.getElementById(endpoint);
        const tableContainer = currentSection.querySelector('.table-container');
        tableContainer.innerHTML = '<p>Loading data...</p>';

        try {
            // The password is sent as a query param for now, matching the backend middleware
            const response = await fetch(`${API_BASE_URL}/api/admin/${endpoint}?password=${storedToken}`);
            if (response.ok) {
                const data = await response.json();
                renderTable(data, tableContainer, endpoint);
            } else {
                const errorText = await response.text();
                tableContainer.innerHTML = `<p class="error-message">Error fetching data: ${errorText}</p>`;
                if (response.status === 401) {
                    logoutButton.click(); // Force logout if unauthorized
                }
            }
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            tableContainer.innerHTML = `<p class="error-message">An error occurred while fetching data.</p>`;
        }
    }
    
    // Function to render data into a table (assuming this function exists and is correct)
    function renderTable(data, container, endpoint) {
        if (!data || data.length === 0) {
            container.innerHTML = '<p>No data available.</p>';
            return;
        }

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headers = Object.keys(data[0]).filter(key => key !== '_id' && key !== '__v');

        if (endpoint === 'interaction-logs' && headers.includes('details')) {
            headers.splice(headers.indexOf('details'), 1, 'details');
        }
        if (endpoint === 'eligibility-checks' && headers.includes('standardizedTestScores')) {
            headers.splice(headers.indexOf('standardizedTestScores'), 1, 'Standardized Test Score');
        }
        if (endpoint === 'callback-requests' && headers.includes('message')) {
            headers.splice(headers.indexOf('message'), 1, 'Message');
        }

        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText.replace(/([A-Z])/g, ' ').replace(/^./, str => str.toUpperCase());
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
                } else if (header === 'details' && typeof cellContent === 'object' && cellContent !== null) {
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
});
