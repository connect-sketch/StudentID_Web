document.addEventListener('DOMContentLoaded', () => {
    const studentImage = document.getElementById('student-image');
    const studentName = document.getElementById('student-name');
    const studentLocation = document.getElementById('student-location');
    const testimonialText = document.getElementById('testimonial-text');
    const testimonialSwitcher = document.getElementById('testimonial-switcher');

    if (testimonialSwitcher) {
        function createSwitcherButtons() {
            testimonials.forEach((testimonial, index) => {
                const button = document.createElement('button');
                button.textContent = testimonial.name;
                button.addEventListener('click', () => switchTestimonial(index));
                testimonialSwitcher.appendChild(button);
            });
        }

        function switchTestimonial(index) {
            const testimonial = testimonials[index];
            studentImage.src = testimonial.image;
            studentName.textContent = testimonial.name;
            studentLocation.textContent = testimonial.location;
            testimonialText.textContent = testimonial.testimonial;

            // Update active button
            const buttons = testimonialSwitcher.querySelectorAll('button');
            buttons.forEach((button, i) => {
                if (i === index) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        }

        createSwitcherButtons();
        switchTestimonial(0); // Set initial testimonial
    }

    // Test Prep Tabs
    const testTabs = document.querySelectorAll('.test-tabs button');
    const testPanes = document.querySelectorAll('.test-pane');

    testTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all tabs and panes
            testTabs.forEach(t => t.classList.remove('active'));
            testPanes.forEach(p => p.classList.remove('active'));

            // Activate the clicked tab and corresponding pane
            tab.classList.add('active');
            const targetPaneId = tab.textContent.toLowerCase();
            const targetPane = document.getElementById(targetPaneId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Publication Logos Animation
    const logosTrack = document.querySelector('.publication-logos-track');
    if (logosTrack) {
        const logos = logosTrack.querySelectorAll('img');
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            logosTrack.appendChild(clone);
        });
    }

    // FAQ Countries button scroll to Benefits Card Section
    const faqCountriesButton = document.querySelector('.faq-tabs button:nth-child(2)'); // Selects the second button in .faq-tabs
    const benefitsCardSection = document.querySelector('.benefits-card-section');

    if (faqCountriesButton && benefitsCardSection) {
        faqCountriesButton.addEventListener('click', () => {
            benefitsCardSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Header Countries tab scroll to Benefits Card Section
    const headerCountriesLink = document.querySelector('header nav ul li:first-child a'); // Selects the first link in the header nav

    if (headerCountriesLink && benefitsCardSection) {
        headerCountriesLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            benefitsCardSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Header StudentID+ link show alert
    const studentIdPlusLink = document.querySelector('header nav ul li:nth-child(2) a'); // Selects the second link in the header nav

    if (studentIdPlusLink) {
        studentIdPlusLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            alert('Coming soon!! We will get back to you soon..');
        });
    }

    // Header Services link scroll to Footer Services Section
    const headerServicesLink = document.querySelector('header nav ul li:nth-child(3) a'); // Selects the third link in the header nav
    const footerServicesSection = document.getElementById('footer-services');

    if (headerServicesLink && footerServicesSection) {
        headerServicesLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            footerServicesSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Header Success Stories link scroll to Testimonials Section
    const headerSuccessStoriesLink = document.querySelector('header nav ul li:nth-child(5) a'); // Selects the fifth link in the header nav
    const testimonialsSection = document.querySelector('.testimonials');

    if (headerSuccessStoriesLink && testimonialsSection) {
        headerSuccessStoriesLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            testimonialsSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Modal functionality for Request Callback
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const callbackModal = document.getElementById('callbackModal');
    const closeModalBtn = document.querySelector('#callbackModal .close-button');

    if (openModalBtns.length > 0 && callbackModal && closeModalBtn) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                callbackModal.style.display = 'block';
            });
        });

        closeModalBtn.addEventListener('click', () => {
            callbackModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == callbackModal) {
                callbackModal.style.display = 'none';
            }
        });
    }

    // Handle Request Callback Form Submission
    const callbackForm = document.querySelector('#callbackModal form');
    if (callbackForm) {
        callbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = callbackForm.querySelector('input[placeholder="Your Name"]').value;
            const email = callbackForm.querySelector('input[placeholder="Your Email"]').value;
            const phone = callbackForm.querySelector('input[placeholder="Your Phone Number"]').value;
            const message = callbackForm.querySelector('textarea').value;

            const formData = { name, email, phone, message };

            try {
                const response = await fetch('/api/callback-requests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Success! We have received your request and will get back to you soon.');
                    callbackForm.reset();
                    callbackModal.style.display = 'none';
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Something went wrong. Please try again.'}`);
                }
            } catch (error) {
                console.error('Failed to send callback request:', error);
                alert('An error occurred while submitting your request. Please check your connection and try again.');
            }
        });
    }

    // Modal functionality for Check Eligibility
    const openEligibilityModalBtn = document.querySelector('.open-eligibility-modal-btn');
    const eligibilityModal = document.getElementById('eligibilityModal');
    const closeEligibilityModalBtn = document.querySelector('#eligibilityModal .close-button');

    if (openEligibilityModalBtn && eligibilityModal && closeEligibilityModalBtn) {
        openEligibilityModalBtn.addEventListener('click', () => {
            eligibilityModal.style.display = 'block';
        });

        closeEligibilityModalBtn.addEventListener('click', () => {
            eligibilityModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == eligibilityModal) {
                eligibilityModal.style.display = 'none';
            }
        });
    }

    // Handle Check Eligibility Form Submission
    const eligibilityForm = document.querySelector('#eligibilityModal form');
    if (eligibilityForm) {
        eligibilityForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = eligibilityForm.querySelector('input[placeholder="Your Name"]').value;
            const email = eligibilityForm.querySelector('input[placeholder="Your Email"]').value;
            const highestQualification = eligibilityForm.querySelector('input[placeholder="Highest Qualification"]').value;
            const overallMarksGPA = eligibilityForm.querySelector('input[placeholder="Overall Marks/GPA"]').value;
            const standardizedTestScores = eligibilityForm.querySelector('input[placeholder="Standardized Test Scores (e.g., IELTS, TOEFL)"]').value;

            const formData = { name, email, highestQualification, overallMarksGPA, standardizedTestScores };

            try {
                const response = await fetch('/api/eligibility-checks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Success! Your eligibility check request has been submitted.');
                    eligibilityForm.reset();
                    eligibilityModal.style.display = 'none';
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Something went wrong. Please try again.'}`);
                }
            } catch (error) {
                console.error('Failed to send eligibility check request:', error);
                alert('An error occurred while submitting your eligibility request. Please check your connection and try again.');
            }
        });
    }

    // --- Interaction Logging ---
    async function sendInteractionLog(eventType, source, details = {}) {
        try {
            const response = await fetch('/api/interactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventType, source, details })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to log interaction:', errorData.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error sending interaction log:', error);
        }
    }

    // --- Expert Request Modal ---
    const expertModal = document.getElementById('expertModal');
    if (expertModal) {
        const expertModalTitle = document.getElementById('expertModalTitle');
        const expertCountryInput = document.getElementById('expert-country-input');
        const closeExpertModalBtn = expertModal.querySelector('.close-button');
        const expertForm = expertModal.querySelector('form');
        const expertButtons = document.querySelectorAll('.expert-button');

        expertButtons.forEach(button => {
            button.addEventListener('click', () => {
                const country = button.textContent.replace('Talk to an ', '').replace(' expert', '').replace('a ', '');
                expertModalTitle.textContent = `Talk to a ${country} Expert`;
                expertCountryInput.value = country;
                expertModal.style.display = 'block';
            });
        });

        closeExpertModalBtn.addEventListener('click', () => {
            expertModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == expertModal) {
                expertModal.style.display = 'none';
            }
        });

        expertForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = expertForm.querySelector('input[placeholder="Your Name"]').value;
            const email = expertForm.querySelector('input[placeholder="Your Email"]').value;
            const phone = expertForm.querySelector('input[placeholder="Your Phone Number"]').value;
            const country = expertCountryInput.value;

            const formData = { name, email, phone, country };

            try {
                const response = await fetch('/api/expert-requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert(`Success! Your request to speak with an expert for ${country} has been received.`);
                    expertForm.reset();
                    expertModal.style.display = 'none';
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Something went wrong. Please try again.'}`);
                }
            } catch (error) {
                console.error('Error sending expert request:', error);
                alert('An error occurred while submitting your request.');
            }
        });
    }

    // --- Book Free Counselling Session Modal ---
    const counsellingModal = document.getElementById('counsellingModal');
    if (counsellingModal) {
        const openCounsellingModalBtn = document.querySelector('.gateway .counselling-button');
        const closeCounsellingModalBtn = counsellingModal.querySelector('.close-button');
        const counsellingForm = counsellingModal.querySelector('form');

        openCounsellingModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            counsellingModal.style.display = 'block';
        });

        closeCounsellingModalBtn.addEventListener('click', () => {
            counsellingModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == counsellingModal) {
                counsellingModal.style.display = 'none';
            }
        });

        counsellingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = counsellingForm.querySelector('input[placeholder="Your Name"]').value;
            const email = counsellingForm.querySelector('input[placeholder="Your Email"]').value;
            const phone = counsellingForm.querySelector('input[placeholder="Your Phone Number"]').value;
            const sessionDate = counsellingForm.querySelector('#session-date').value;
            const sessionSlot = counsellingForm.querySelector('#session-slot').value;

            const formData = { name, email, phone, sessionDate, sessionSlot };

            try {
                const response = await fetch('/api/counselling-sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Success! Your counselling session has been booked.');
                    counsellingForm.reset();
                    counsellingModal.style.display = 'none';
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Something went wrong. Please try again.'}`);
                }
            } catch (error) {
                console.error('Error booking counselling session:', error);
                alert('An error occurred while booking your session.');
            }
        });
    }

// --- Book a Free Demo Modal ---
    const demoModal = document.getElementById('demoModal');
    if (demoModal) {
        const demoModalTitle = document.getElementById('demoModalTitle');
        const demoTestTypeInput = document.getElementById('demo-test-type-input');
        const closeDemoModalBtn = demoModal.querySelector('.close-button');
        const demoForm = demoModal.querySelector('form');
        const demoButtons = document.querySelectorAll('.test-pane .counselling-button');

        demoButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const testPane = button.closest('.test-pane');
                let testType = 'Unknown';
                if (testPane && testPane.id) {
                    testType = testPane.id.toUpperCase();
                }
                
                demoModalTitle.textContent = `Book a Free ${testType} Demo`;
                demoTestTypeInput.value = testType;
                demoModal.style.display = 'block';
            });
        });

        closeDemoModalBtn.addEventListener('click', () => {
            demoModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == demoModal) {
                demoModal.style.display = 'none';
            }
        });

        demoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = demoForm.querySelector('input[placeholder="Your Name"]').value;
            const email = demoForm.querySelector('input[placeholder="Your Email"]').value;
            const phone = demoForm.querySelector('input[placeholder="Your Phone Number"]').value;
            const testType = demoTestTypeInput.value;

            const formData = { name, email, phone, testType };

            try {
                const response = await fetch('/api/demo-requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert(`Success! Your request for a ${testType} demo has been booked.`);
                    demoForm.reset();
                    demoModal.style.display = 'none';
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'Something went wrong. Please try again.'}`);
                }
            } catch (error) {
                console.error('Error booking demo session:', error);
                alert('An error occurred while booking your demo.');
            }
        });
    }

    // --- Connect With Team Mailto Link ---
    const connectButton = document.querySelector('.contact .btn-primary');
    if (connectButton) {
        connectButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'mailto:connect@thestudentid.com';
        });
    }

    // --- FAQ Accordion ---
    const faqIcons = document.querySelectorAll('.faq-question span');
    faqIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const faqItem = icon.closest('.faq-item');
            const currentlyActive = document.querySelector('.faq-item.active');

            if (currentlyActive && currentlyActive !== faqItem) {
                currentlyActive.classList.remove('active');
            }
            
            faqItem.classList.toggle('active');
        });
    });
});
