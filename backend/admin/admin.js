document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const adminPasswordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const logoutButton = document.getElementById('logout-button');
    const navButtons = document.querySelectorAll('.nav-button');
    const dataSections = document.querySelectorAll('.data-section');

    const ADMIN_PASSWORD_KEY = 'admin_session_password';
    const API_BASE_URL = ''; // Base URL for the backend API

    // On page load, ensure the login view is shown by default
    loginContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = adminPasswordInput.value;

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/verify-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (response.ok) {
                localStorage.setItem(ADMIN_PASSWORD_KEY, password);
                loginError.textContent = '';
                
                // Show dashboard and hide login form
                loginContainer.style.display = 'none';
                dashboardContainer.style.display = 'flex';
                
                // Fetch initial data
                fetchData('callback-requests');
            } else {
                const errorText = await response.text();
                loginError.textContent = `Login failed: ${errorText}`;
            }
        } catch (error) {
            loginError.textContent = 'An error occurred during login.';
        }
    });

    // Handle Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem(ADMIN_PASSWORD_KEY);
        adminPasswordInput.value = ''; // Clear password field
        
        // Show login form and hide dashboard
        loginContainer.style.display = 'flex';
        dashboardContainer.style.display = 'none';
    });

    // Handle Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Hide all sections
            dataSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the target section
            const targetId = button.dataset.target;
            document.getElementById(targetId).style.display = 'block';
            
            fetchData(targetId); // Fetch data for the newly active section
        });
    });

    // Function to fetch and display data
    async function fetchData(endpoint) {
        const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
        if (!storedPassword) {
            // If password is gone, force back to login screen
            loginContainer.style.display = 'flex';
            dashboardContainer.style.display = 'none';
            return;
        }

        const currentSection = document.getElementById(endpoint);
        const tableContainer = currentSection.querySelector('.table-container');
        tableContainer.innerHTML = '<p>Loading data...</p>';

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/${endpoint}?password=${storedPassword}`);
            if (response.ok) {
                const data = await response.json();
                renderTable(data, tableContainer, endpoint);
            } else {
                const errorText = await response.text();
                tableContainer.innerHTML = `<p class="error-message">Error fetching data: ${errorText}</p>`;
                if (response.status === 401) {
                    // If auth fails, log out user
                    localStorage.removeItem(ADMIN_PASSWORD_KEY);
                    loginContainer.style.display = 'flex';
                    dashboardContainer.style.display = 'none';
                }
            }
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            tableContainer.innerHTML = `<p class="error-message">An error occurred while fetching data.</p>`;
        }
    }

    // Function to render data into a table
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
            th.textContent = headerText.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
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
