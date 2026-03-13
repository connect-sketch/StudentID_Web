document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navUl = document.querySelector('nav ul');
    const menuOverlay = document.querySelector('.menu-overlay');

    const toggleMenu = (force) => {
        navUl.classList.toggle('nav-active', force);
        menuOverlay.classList.toggle('active', force);
        document.body.classList.toggle('menu-is-open', force);
    };

    hamburgerMenu.addEventListener('click', () => {
        const isOpen = navUl.classList.contains('nav-active');
        toggleMenu(!isOpen);
    });

    menuOverlay.addEventListener('click', () => {
        toggleMenu(false);
    });

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navUl.classList.contains('nav-active')) {
                toggleMenu(false);
            }
        });
    });

    const studentImage = document.getElementById('student-image');
    const studentName = document.getElementById('student-name');
    const studentLocation = document.getElementById('student-location');
    const testimonialText = document.getElementById('testimonial-text');
    const testimonialSwitcher = document.getElementById('testimonial-switcher');

    // --- Referral/Influencer Tracking ---
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
        sessionStorage.setItem('influencer_ref', refCode);
    }
    const getRefCode = () => sessionStorage.getItem('influencer_ref') || 'Direct';

    const API_BASE_URL = ''; // Leave empty for relative paths in a single project

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

    // --- Helper for Modal Toggling & Scroll Locking ---
    function toggleModal(modal, show) {
        if (show) {
            modal.style.display = 'flex'; // Directly use flex, as defined in new CSS
            modal.classList.add('active'); // For extra CSS hook if needed
            document.body.classList.add('modal-locked');
        } else {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.classList.remove('modal-locked');
        }
    }

    // Modal functionality for Request Callback - Event Delegation
    const callbackModal = document.getElementById('callbackModal');
    
    // Bind to document to catch clicks bubbling up
    document.addEventListener('click', (e) => {
        if (e.target.matches('.open-modal-btn')) {
            e.preventDefault();
            if (callbackModal) {
                toggleModal(callbackModal, true);
            }
        }
    });

    if (callbackModal) {
        const closeModalBtn = callbackModal.querySelector('.close-btn-new');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                toggleModal(callbackModal, false);
            });
        }
        window.addEventListener('click', (event) => {
            if (event.target == callbackModal) {
                toggleModal(callbackModal, false);
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
            const referralCode = getRefCode();

            const formData = { name, email, phone, message, referralCode };

            try {
                const response = await fetch(`${API_BASE_URL}/api/callback-requests`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Success! We have received your request and will get back to you soon.');
                    callbackForm.reset();
                    toggleModal(callbackModal, false);
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

    // Modal functionality for Check Eligibility - Event Delegation
    const eligibilityModal = document.getElementById('eligibilityModal');

    document.addEventListener('click', (e) => {
        if (e.target.matches('.open-eligibility-modal-btn')) {
            e.preventDefault();
            if (eligibilityModal) {
                toggleModal(eligibilityModal, true);
            }
        }
    });

    if (eligibilityModal) {
        const closeEligibilityModalBtn = eligibilityModal.querySelector('.close-btn-new');

        if (closeEligibilityModalBtn) {
            closeEligibilityModalBtn.addEventListener('click', () => {
                toggleModal(eligibilityModal, false);
            });
        }

        window.addEventListener('click', (event) => {
            if (event.target == eligibilityModal) {
                toggleModal(eligibilityModal, false);
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
            const standardizedTestScores = eligibilityForm.querySelector('input[placeholder="Standardized Test Scores"]').value;
            const referralCode = getRefCode();

            const formData = { name, email, highestQualification, overallMarksGPA, standardizedTestScores, referralCode };

            try {
                const response = await fetch(`${API_BASE_URL}/api/eligibility-checks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Success! Your eligibility check request has been submitted.');
                    eligibilityForm.reset();
                    toggleModal(eligibilityModal, false);
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

    // --- Generic Carousel Initializer ---
    function initializeCarousel(carouselSelector, containerSelector, prevBtnSelector, nextBtnSelector, cardSelector) {
        const carousel = document.querySelector(carouselSelector);
        const container = document.querySelector(containerSelector);
        const prevBtn = document.querySelector(prevBtnSelector);
        const nextBtn = document.querySelector(nextBtnSelector);
        const cards = document.querySelectorAll(cardSelector);

        if (carousel && container && prevBtn && nextBtn && cards.length > 0) {
            let cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(container).gap);

            nextBtn.addEventListener('click', () => {
                container.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', () => {
                container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });

            window.addEventListener('resize', () => {
                cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(container).gap);
            });
        }
    }

    // Initialize both carousels
    initializeCarousel('.journey-carousel', '.journey-steps', '.journey-carousel .prev-btn', '.journey-carousel .next-btn', '.journey-steps .step');
    initializeCarousel('.guides-carousel', '.guides-container', '#guides-prev-btn', '#guides-next-btn', '.guide-card');

    // --- Interaction Logging ---
    async function sendInteractionLog(eventType, source, details = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/interactions`, {
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
        const closeExpertModalBtn = expertModal.querySelector('.close-btn-new');
        const expertForm = expertModal.querySelector('form');
        const expertButtons = document.querySelectorAll('.expert-button');

        expertButtons.forEach(button => {
            button.addEventListener('click', () => {
                const country = button.textContent.replace('Talk to an ', '').replace(' expert', '').replace('a ', '');
                expertModalTitle.textContent = `Talk to a ${country} Expert`;
                expertCountryInput.value = country;
                toggleModal(expertModal, true);
            });
        });

        closeExpertModalBtn.addEventListener('click', () => {
            toggleModal(expertModal, false);
        });

        window.addEventListener('click', (event) => {
            if (event.target == expertModal) {
                toggleModal(expertModal, false);
            }
        });

        expertForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = expertForm.querySelector('input[placeholder="Your Name"]').value;
            const email = expertForm.querySelector('input[placeholder="Your Email"]').value;
            const phone = expertForm.querySelector('input[placeholder="Your Phone Number"]').value;
            const country = expertCountryInput.value;
            const referralCode = getRefCode();

            const formData = { name, email, phone, country, referralCode };

            try {
                const response = await fetch(`${API_BASE_URL}/api/expert-requests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert(`Success! Your request to speak with an expert for ${country} has been received.`);
                    expertForm.reset();
                    toggleModal(expertModal, false);
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
        const closeCounsellingModalBtn = counsellingModal.querySelector('.close-btn-new');
        const counsellingForm = counsellingModal.querySelector('form');

        openCounsellingModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal(counsellingModal, true);
        });

        closeCounsellingModalBtn.addEventListener('click', () => {
            toggleModal(counsellingModal, false);
        });

        window.addEventListener('click', (event) => {
            if (event.target == counsellingModal) {
                toggleModal(counsellingModal, false);
            }
        });

        counsellingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = counsellingForm.querySelector('input[placeholder="Your Name"]').value;
            const email = counsellingForm.querySelector('input[placeholder="Your Email"]').value;
            const phone = counsellingForm.querySelector('input[placeholder="Your Phone Number"]').value;
            const sessionDate = counsellingForm.querySelector('#session-date').value;
            const sessionSlot = counsellingForm.querySelector('#session-slot').value;
            const referralCode = getRefCode();

            const formData = { name, email, phone, sessionDate, sessionSlot, referralCode };

            try {
                const response = await fetch(`${API_BASE_URL}/api/counselling-sessions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Success! Your counselling session has been booked.');
                    counsellingForm.reset();
                    toggleModal(counsellingModal, false);
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
        const closeDemoModalBtn = demoModal.querySelector('.close-btn-new');
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
                toggleModal(demoModal, true);
            });
        });

        closeDemoModalBtn.addEventListener('click', () => {
            toggleModal(demoModal, false);
        });

        window.addEventListener('click', (event) => {
            if (event.target == demoModal) {
                toggleModal(demoModal, false);
            }
        });

        demoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = demoForm.querySelector('input[placeholder="Your Name"]').value;
            const email = demoForm.querySelector('input[placeholder="Your Email"]').value;
            const phone = demoForm.querySelector('input[placeholder="Your Phone Number"]').value;
            const testType = demoTestTypeInput.value;
            const referralCode = getRefCode();

            const formData = { name, email, phone, testType, referralCode };

            try {
                const response = await fetch(`${API_BASE_URL}/api/demo-requests`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert(`Success! Your request for a ${testType} demo has been booked.`);
                    demoForm.reset();
                    toggleModal(demoModal, false);
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
