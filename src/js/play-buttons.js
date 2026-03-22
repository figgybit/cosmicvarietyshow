(function() {
    var allAudios = document.querySelectorAll('audio');
    if (!allAudios.length) return;

    // Filter to only content audio (skip managed players and hidden audio)
    var audios = [];
    allAudios.forEach(function(audio) {
        if (audio.closest('.tier3-player') || audio.closest('.panel-player') || audio.closest('.tier3-body') || audio.closest('.mosaic-card')) return;
        if (!audio.closest('article, .post-body, section, main')) return;
        var container = audio.parentElement;
        if (!container) return;
        var heading = container.querySelector('h2, h3, h4');
        if (!heading) return;
        audios.push({ audio: audio, container: container, heading: heading });
    });

    if (!audios.length) return;

    // Create sticky player bar
    var bar = document.createElement('div');
    bar.className = 'site-player';
    bar.innerHTML = '<span class="site-player-title"></span><button class="site-player-btn" id="sp-pause">PAUSE</button><button class="site-player-btn" id="sp-stop">STOP</button>';
    document.body.appendChild(bar);

    var barTitle = bar.querySelector('.site-player-title');
    var pauseBtn = document.getElementById('sp-pause');
    var stopBtn = document.getElementById('sp-stop');
    var currentBtn = null;
    var currentAudio = null;

    var playSvg = '<svg viewBox="0 0 12 14" width="12" height="14"><polygon points="0,0 12,7 0,14" fill="#fff"/></svg>';
    var pauseSvg = '<svg viewBox="0 0 10 14" width="10" height="14"><rect x="0" y="0" width="3" height="14" fill="#fff"/><rect x="7" y="0" width="3" height="14" fill="#fff"/></svg>';

    function stopAll() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        if (currentBtn) {
            currentBtn.classList.remove('is-playing');
            currentBtn.innerHTML = playSvg;
        }
        bar.classList.remove('active');
        currentBtn = null;
        currentAudio = null;
    }

    audios.forEach(function(item) {
        var audio = item.audio;
        var heading = item.heading;
        var titleText = heading.textContent.trim();

        var btn = document.createElement('button');
        btn.className = 'play-btn';
        btn.setAttribute('aria-label', 'Play ' + titleText);
        btn.innerHTML = playSvg;
        heading.insertBefore(btn, heading.firstChild);

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (currentAudio === audio && !audio.paused) {
                audio.pause();
                return;
            }

            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            if (currentBtn && currentBtn !== btn) {
                currentBtn.classList.remove('is-playing');
                currentBtn.innerHTML = playSvg;
            }

            currentAudio = audio;
            currentBtn = btn;
            audio.play();
        });

        audio.addEventListener('play', function() {
            allAudios.forEach(function(other) {
                if (other !== audio && !other.paused) {
                    other.pause();
                    other.currentTime = 0;
                }
            });
            if (currentBtn && currentBtn !== btn) {
                currentBtn.classList.remove('is-playing');
                currentBtn.innerHTML = playSvg;
            }
            currentAudio = audio;
            currentBtn = btn;
            btn.classList.add('is-playing');
            btn.innerHTML = pauseSvg;
            barTitle.textContent = titleText;
            bar.classList.add('active');
            pauseBtn.textContent = 'PAUSE';
        });

        audio.addEventListener('pause', function() {
            if (currentBtn === btn) {
                btn.classList.remove('is-playing');
                btn.innerHTML = playSvg;
                if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
                    pauseBtn.textContent = 'PLAY';
                }
            }
        });

        audio.addEventListener('ended', function() {
            btn.classList.remove('is-playing');
            btn.innerHTML = playSvg;
            if (currentBtn === btn) {
                bar.classList.remove('active');
                currentBtn = null;
                currentAudio = null;
            }
        });
    });

    pauseBtn.addEventListener('click', function() {
        if (!currentAudio) return;
        if (currentAudio.paused) {
            currentAudio.play();
        } else {
            currentAudio.pause();
        }
    });

    stopBtn.addEventListener('click', stopAll);
})();
