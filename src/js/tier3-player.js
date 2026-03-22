(function() {
    var players = document.querySelectorAll('.tier3-player');
    if (!players.length) return;

    players.forEach(function(player) {
        var audio = player.querySelector('audio');
        var playBtn = player.querySelector('.panel-play-btn');
        var playIcon = player.querySelector('.panel-play-icon');
        var pauseIcon = player.querySelector('.panel-pause-icon');
        var volumeWrap = player.querySelector('.panel-volume');
        var volumeSliderWrap = player.querySelector('.panel-volume-slider');
        var volumeSlider = player.querySelector('.panel-volume-slider input');
        var spectrum = player.querySelector('.panel-spectrum');
        var bars = player.querySelectorAll('.panel-spectrum-bar');
        var progressBar = player.querySelector('.tier3-progress-bar');
        var progressFill = player.querySelector('.tier3-progress-fill');
        var timeCurrent = player.querySelector('.tier3-time-current');
        var timeTotal = player.querySelector('.tier3-time-total');
        var ctx, analyser, source, gainNode, connected = false;
        var sliderTimeout = null;
        var sliderOpen = false;

        audio.volume = 0.8;

        function formatTime(s) {
            var m = Math.floor(s / 60);
            var sec = Math.floor(s % 60);
            return m + ':' + (sec < 10 ? '0' : '') + sec;
        }

        audio.addEventListener('loadedmetadata', function() {
            if (audio.duration && isFinite(audio.duration)) {
                timeTotal.textContent = formatTime(audio.duration);
            }
        });

        audio.addEventListener('timeupdate', function() {
            if (!audio.duration) return;
            var pct = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = pct + '%';
            timeCurrent.textContent = formatTime(audio.currentTime);
        });

        if (progressBar) {
            progressBar.addEventListener('click', function(e) {
                if (!audio.duration) return;
                var rect = progressBar.getBoundingClientRect();
                var pct = (e.clientX - rect.left) / rect.width;
                audio.currentTime = pct * audio.duration;
            });
        }

        playBtn.addEventListener('click', function() {
            if (audio.paused) {
                audio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                playBtn.classList.add('playing');
                spectrum.classList.add('active');

                if (!connected && window.AudioContext) {
                    try {
                        ctx = new (window.AudioContext || window.webkitAudioContext)();
                        source = ctx.createMediaElementSource(audio);
                        analyser = ctx.createAnalyser();
                        analyser.fftSize = 32;
                        gainNode = ctx.createGain();
                        gainNode.gain.value = audio.volume;
                        source.connect(gainNode);
                        gainNode.connect(analyser);
                        analyser.connect(ctx.destination);
                        connected = true;
                        animateSpectrum();
                    } catch(e) {}
                } else if (connected) {
                    animateSpectrum();
                }
            } else {
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                playBtn.classList.remove('playing');
                spectrum.classList.remove('active');
            }
        });

        function openSlider() {
            sliderOpen = true;
            volumeSliderWrap.style.display = 'flex';
            clearTimeout(sliderTimeout);
            sliderTimeout = setTimeout(closeSlider, 5000);
        }

        function closeSlider() {
            sliderOpen = false;
            volumeSliderWrap.style.display = 'none';
            clearTimeout(sliderTimeout);
        }

        volumeWrap.addEventListener('click', function(e) {
            e.stopPropagation();
            if (sliderOpen) closeSlider();
            else openSlider();
        });

        volumeSlider.addEventListener('input', function(e) {
            e.stopPropagation();
            var vol = this.value / 100;
            audio.volume = vol;
            if (gainNode) gainNode.gain.value = vol;
            clearTimeout(sliderTimeout);
            sliderTimeout = setTimeout(closeSlider, 5000);
        });

        volumeSlider.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        volumeSliderWrap.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        document.addEventListener('click', function() {
            if (sliderOpen) closeSlider();
        });

        audio.addEventListener('ended', function() {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            playBtn.classList.remove('playing');
            spectrum.classList.remove('active');
            bars.forEach(function(bar) { bar.style.height = '4px'; });
            progressFill.style.width = '0%';
            timeCurrent.textContent = '0:00';
        });

        function animateSpectrum() {
            if (audio.paused || !analyser) return;
            var data = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(data);
            for (var i = 0; i < bars.length; i++) {
                var val = data[i] || 0;
                var h = Math.max(4, (val / 255) * 20);
                bars[i].style.height = h + 'px';
            }
            requestAnimationFrame(animateSpectrum);
        }
    });
})();
