(function() {
    // FLIP card transition: mosaic grid → tier3 page
    // On editor pages: store clicked card rect in sessionStorage
    // On tier3 pages: animate card from stored rect to final position

    var STORAGE_KEY = 'rsj-card-transition';

    // === EDITOR PAGES: capture card position on click ===
    var cards = document.querySelectorAll('.mosaic-card');
    if (cards.length) {
        cards.forEach(function(card) {
            card.addEventListener('click', function(e) {
                var img = card.querySelector('img');
                if (!img) return;
                var rect = img.getBoundingClientRect();
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                    top: rect.top + window.scrollY,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    time: Date.now()
                }));
            });
        });
    }

    // === TIER3 PAGES: animate card from stored position ===
    var tier3Card = document.querySelector('.tier3-card');
    if (!tier3Card) return;

    var stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    sessionStorage.removeItem(STORAGE_KEY);

    var from;
    try { from = JSON.parse(stored); } catch(e) { return; }

    // Only animate if click was recent (within 2 seconds)
    if (Date.now() - from.time > 2000) return;

    var to = tier3Card.getBoundingClientRect();
    var toTop = to.top + window.scrollY;

    // Calculate transform from source to destination
    var dx = from.left - to.left;
    var dy = (from.top) - toTop;
    var sx = from.width / to.width;
    var sy = from.height / to.height;

    // Apply initial transform (card appears at grid position)
    tier3Card.style.transformOrigin = 'top left';
    tier3Card.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(' + sx + ', ' + sy + ')';
    tier3Card.style.transition = 'none';
    tier3Card.style.zIndex = '1000';

    // Force reflow
    tier3Card.offsetHeight;

    // Animate to final position
    tier3Card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    tier3Card.style.transform = 'translate(0, 0) scale(1, 1)';

    tier3Card.addEventListener('transitionend', function() {
        tier3Card.style.transform = '';
        tier3Card.style.transition = '';
        tier3Card.style.transformOrigin = '';
        tier3Card.style.zIndex = '';
    }, { once: true });
})();
