document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';

    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';

    const heading = document.createElement('h2');
    heading.textContent = 'Let us help you';
    heading.style.color = 'black';

    const featuresGrid = document.createElement('div');
    featuresGrid.className = 'features-grid';
    const features = [
        'No processing fee', 'Application fee waiver',
        'SOP Preparation', 'Loan Assistance',
        'Visa Assistance', 'Full-time job support'
    ];
    features.forEach(featureText => {
        const featureItem = document.createElement('div');
        featureItem.className = 'feature-item';
        featureItem.textContent = featureText;
        featureItem.style.color = 'black';
        featuresGrid.appendChild(featureItem);
    });

    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    const mobileInputContainer = document.createElement('div');
    mobileInputContainer.className = 'mobile-input-container';

    const countryCode = document.createElement('span');
    countryCode.className = 'country-code';
    countryCode.textContent = '+91';

    const mobileInput = document.createElement('input');
    mobileInput.className = 'mobile-input';
    mobileInput.type = 'tel';
    mobileInput.placeholder = 'Mobile number';
    mobileInput.required = true;

    mobileInputContainer.append(countryCode, mobileInput);

    const requestCallbackBtn = document.createElement('button');
    requestCallbackBtn.className = 'request-callback-btn';
    requestCallbackBtn.textContent = 'Request Callback';

    const terms = document.createElement('p');
    terms.className = 'terms';
    terms.textContent = 'I agree to studentid terms and conditions';

    formContainer.append(mobileInputContainer, requestCallbackBtn, terms);

    requestCallbackBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Using placeholder values for name and email as per user's request for simplified popup
        const name = 'Auto Popup User';
        const email = 'autopopup@example.com';
        const phone = mobileInput.value;

        if (!phone) {
            alert('Please enter your mobile number.');
            return;
        }

        const formData = { name, email, phone, message: 'From automatic popup' };

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
                mobileInput.value = '';
                closePopup();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Something went wrong. Please try again.'}`);
            }
        } catch (error) {
            console.error('Failed to send callback request:', error);
            alert('An error occurred while submitting your request. Please check your connection and try again.');
        }
    });


    const expertsSection = document.createElement('div');
    expertsSection.className = 'experts-section';
    const expertsCount = document.createElement('div');
    expertsCount.className = 'count';
    expertsCount.textContent = '50+';
    const expertsText = document.createElement('div');
    expertsText.className = 'text';
    expertsText.textContent = 'experts online and offline';
    expertsSection.append(expertsCount, expertsText);

    const popupImageContainer = document.createElement('div');
    popupImageContainer.className = 'popup-image-container';
    const popupImage = document.createElement('img');
    popupImage.src = 'images/bd956524f51d656fb7dc4e63891106877c995ac1.png';
    popupImageContainer.appendChild(popupImage);


    popupContent.append(closeBtn, heading, featuresGrid, formContainer, expertsSection, popupImageContainer);
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);

    const closePopup = () => {
        popupOverlay.style.display = 'none';
    };

    const openPopup = () => {
        popupOverlay.style.display = 'flex';
    };

    closeBtn.addEventListener('click', closePopup);

    setInterval(openPopup, 30000);
});
