// Portfolio Dropdown & Horizontal Scroll Functionality

document.addEventListener('DOMContentLoaded', function() {
    const portfolioContainer = document.querySelector('.portfolio-container');
    const seeMoreButtons = document.querySelectorAll('.see-more-btn');
    const closeButtons = document.querySelectorAll('.details-close');

    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse wheel horizontal scrolling
    portfolioContainer.addEventListener('wheel', function(e) {
        if (e.deltaY !== 0) {
            e.preventDefault();
            portfolioContainer.scrollLeft += e.deltaY;
        }
    });

    // Mouse drag scrolling
    portfolioContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        portfolioContainer.style.cursor = 'grabbing';
        startX = e.pageX - portfolioContainer.offsetLeft;
        scrollLeft = portfolioContainer.scrollLeft;
    });

    portfolioContainer.addEventListener('mouseleave', () => {
        isDown = false;
        portfolioContainer.style.cursor = 'grab';
    });

    portfolioContainer.addEventListener('mouseup', () => {
        isDown = false;
        portfolioContainer.style.cursor = 'grab';
    });

    portfolioContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - portfolioContainer.offsetLeft;
        const walk = (x - startX) * 2.5;
        portfolioContainer.scrollLeft = scrollLeft - walk;
    });

    // Open details on button click
    seeMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.portfolio-card');
            const details = card.querySelector('.card-details');
            details.classList.remove('hidden');
        });
    });

    // Close details on X click
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const details = this.closest('.card-details');
            details.classList.add('hidden');
        });
    });

    // Close details when clicking outside the card
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.portfolio-card')) {
            const openDetails = document.querySelectorAll('.card-details:not(.hidden)');
            openDetails.forEach(detail => {
                detail.classList.add('hidden');
            });
        }
    });

    // Close details when clicking elsewhere on the card
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        const cardContent = card.querySelector('.card-content');
        cardContent.addEventListener('click', function(e) {
            if (!e.target.closest('.see-more-btn')) {
                const details = card.querySelector('.card-details');
                if (!details.classList.contains('hidden')) {
                    e.stopPropagation();
                }
            }
        });
    });
});