(function() {
    var players = document.querySelectorAll('.archive-mini-player');
    if (!players.length) return;

    var currentAudio = null;
    var currentBtn = null;

    players.forEach(function(player) {
        var btn = player.querySelector('.archive-play-btn');
        var src = player.getAttribute('data-src');
        if (!btn || !src) return;

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // If clicking the same player that's is-playing, pause it
            if (currentAudio && currentBtn === btn) {
                currentAudio.pause();
                btn.classList.remove('is-playing');
                currentAudio = null;
                currentBtn = null;
                return;
            }

            // Stop any currently is-playing
            if (currentAudio) {
                currentAudio.pause();
                currentBtn.classList.remove('is-playing');
            }

            var audio = new Audio(src);
            audio.volume = 0.3;
            audio.play();
            btn.classList.add('is-playing');
            currentAudio = audio;
            currentBtn = btn;

            audio.addEventListener('ended', function() {
                btn.classList.remove('is-playing');
                currentAudio = null;
                currentBtn = null;
            });
        });
    });
})();
