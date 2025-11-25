document.addEventListener("DOMContentLoaded", function() {
    const journeySteps = document.querySelector(".journey-steps");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const steps = document.querySelectorAll(".step");
    const journeyCarousel = document.querySelector('.journey-carousel');

    const cardsToShow = 3;
    const numCards = steps.length;
    const totalPages = Math.ceil(numCards / cardsToShow);
    let currentPage = 0;
    const cardGap = parseInt(getComputedStyle(journeySteps).gap);
    let cardWidth = steps[0].offsetWidth + cardGap;

    journeySteps.style.width = `${numCards * cardWidth}px`;

    function updateCarousel() {
        const offset = -currentPage * cardsToShow * cardWidth;
        journeySteps.style.transform = `translateX(${offset}px)`;

        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage >= totalPages - 1;
    }

    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage--;
            updateCarousel();
        }
    });

    window.addEventListener('resize', () => {
        cardWidth = steps[0].offsetWidth + cardGap;
        journeySteps.style.width = `${numCards * cardWidth}px`;
        updateCarousel();
    });

    // Initial setup
    updateCarousel();

    journeyCarousel.addEventListener('mouseenter', () => {
        prevBtn.classList.add('visible');
        nextBtn.classList.add('visible');
    });

    journeyCarousel.addEventListener('mouseleave', () => {
        prevBtn.classList.remove('visible');
        nextBtn.classList.remove('visible');
    });
});
