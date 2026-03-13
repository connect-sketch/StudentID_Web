
const logosDiv = document.querySelector('.logos');

function checkScreenSize() {
    if (window.innerWidth < 768) {
        logosDiv.classList.add('mobile');
    } else {
        logosDiv.classList.remove('mobile');
    }
}

window.addEventListener('resize', checkScreenSize);
checkScreenSize();
