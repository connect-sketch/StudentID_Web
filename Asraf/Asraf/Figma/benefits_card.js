document.addEventListener('DOMContentLoaded', function () {
    const countryButtonsContainer = document.querySelector('.country-buttons');
    let activeButton = countryButtonsContainer.querySelector('.active');
    let activeCard = document.getElementById(`${activeButton.textContent.toLowerCase()}-card`);
    
    // Set initial card to be visible
    if (activeCard) {
        activeCard.classList.add('visible');
        activeCard.classList.remove('hidden');
    }

    countryButtonsContainer.addEventListener('click', (event) => {
        const targetButton = event.target;

        if (targetButton.classList.contains('country-btn') && targetButton !== activeButton) {
            // Deactivate old button and hide old card
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            if (activeCard) {
                activeCard.classList.remove('visible');
                activeCard.classList.add('hidden');
            }

            // Activate new button and show new card
            targetButton.classList.add('active');
            const country = targetButton.textContent.toLowerCase();
            const cardToShow = document.getElementById(`${country}-card`);
            
            setTimeout(() => {
                if (cardToShow) {
                    cardToShow.classList.remove('hidden');
                    cardToShow.classList.add('visible');
                    activeCard = cardToShow;
                }
            }, 500); // 500ms delay to match the transition duration

            activeButton = targetButton;
        }
    });
});