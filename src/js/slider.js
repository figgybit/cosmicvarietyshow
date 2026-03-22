(function() {
    var slider = document.getElementById('announcementSlider');
    if (!slider) return;

    var slides = slider.querySelectorAll('.slider-slide');
    var dots = slider.querySelectorAll('.slider-dot');
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');
    var current = 0;
    var total = slides.length;
    var interval = null;
    var DELAY = 6000;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        dots[current].style.background = 'transparent';
        dots[current].style.borderColor = '#555';
        current = (index + total) % total;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        var c = dots[current].getAttribute('data-color') || '#c0392b';
        dots[current].style.background = c;
        dots[current].style.borderColor = c;
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
        stopAuto();
        interval = setInterval(next, DELAY);
    }

    function stopAuto() {
        if (interval) clearInterval(interval);
    }

    if (nextBtn) nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        next();
        startAuto();
    });

    if (prevBtn) prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        prev();
        startAuto();
    });

    dots.forEach(function(dot) {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            goTo(parseInt(this.getAttribute('data-slide')));
            startAuto();
        });
    });

    // Set initial dot color
    var initColor = dots[0].getAttribute('data-color') || '#c0392b';
    dots[0].style.background = initColor;
    dots[0].style.borderColor = initColor;

    startAuto();
})();
