/* Mosaic Player — Homepage card audio/video controls */
(function() {
    var MUTED_SVG = '<svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
    var UNMUTED_SVG = '<svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    var PLAY_SVG = '<svg viewBox="0 0 24 24" fill="white" width="32" height="32"><path d="M8 5v14l11-7z"/></svg>';
    var LINK_SVG = '<svg viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>';
    var HEART_OUTLINE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    var HEART_FILLED_SVG = '<svg viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" stroke-width="1" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

    // Card slug lookup — derives from URL
    var cardSlugs = {};

    // Hearts: load from localStorage
    var heartLikes = JSON.parse(localStorage.getItem('cvs-hearts') || '{}');
    var heartCounts = {};

    // Fetch heart counts from server
    function fetchHeartCounts() {
        fetch('/api/hearts').then(function(r) { return r.json(); }).then(function(data) {
            heartCounts = data.counts || {};
            updateAllHeartCounts();
        }).catch(function() {});
    }

    function updateAllHeartCounts() {
        document.querySelectorAll('.mosaic-heart-btn').forEach(function(btn) {
            var slug = btn.dataset.slug;
            var countEl = btn.querySelector('.mosaic-heart-count');
            if (countEl && heartCounts[slug]) {
                countEl.textContent = heartCounts[slug];
            }
        });
    }

    function likeCard(slug, btn) {
        if (heartLikes[slug]) return; // already liked in this browser
        heartLikes[slug] = true;
        localStorage.setItem('cvs-hearts', JSON.stringify(heartLikes));
        var optimistic = (heartCounts[slug] || 0) + 1;
        heartCounts[slug] = optimistic;
        btn.innerHTML = HEART_FILLED_SVG + '<span class="mosaic-heart-count">' + optimistic + '</span>';
        btn.classList.add('liked');
        // Send to server
        fetch('/api/hearts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: slug })
        }).then(function(r) { return r.json(); }).then(function(data) {
            if (data.count !== undefined) {
                heartCounts[slug] = data.count;
                var countEl = btn.querySelector('.mosaic-heart-count');
                if (countEl) countEl.textContent = data.count;
            }
        }).catch(function() {});
    }

    // Load heart counts on page load
    fetchHeartCounts();

    var audioCtx = null;

    var badgeColors = {
        'mosaic-badge-bucky': '#D4AF37',
        'mosaic-badge-feynman': '#ff6f00',
        'mosaic-badge-sagan': '#6ba3d6'
    };

    function getCardColor(card) {
        var badge = card.querySelector('.mosaic-badge');
        if (!badge) return '#c0392b';
        for (var cls in badgeColors) {
            if (badge.classList.contains(cls)) return badgeColors[cls];
        }
        return '#c0392b';
    }

    function closeAllSliders(except) {
        document.querySelectorAll('.mosaic-volume-wrap').forEach(function(w) {
            if (w !== except) w.style.display = 'none';
        });
    }

    function stopAllAudioExcept(exceptCard) {
        document.querySelectorAll('.mosaic-card').forEach(function(c) {
            if (c === exceptCard) return;
            var a = c.querySelector('audio.mosaic-audio');
            if (a && !a.paused) {
                a.pause();
                a.currentTime = 0;
                var sp = c.querySelector('.mosaic-speaker-btn');
                if (sp) { sp.classList.remove('active'); sp.innerHTML = MUTED_SVG; }
                var pb = c.querySelector('.mosaic-play-btn');
                if (pb) pb.style.display = '';
                var viz = c.querySelector('.mosaic-visualizer');
                if (viz) viz.style.display = 'none';
            }
        });
    }

    function drawVisualizer(canvas, analyser, color, animId) {
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        var bufLen = analyser.frequencyBinCount;
        var data = new Uint8Array(bufLen);
        var barCount = 7;
        var barGap = 3;
        var totalGap = barGap * (barCount - 1);
        var barW = Math.floor((w - totalGap) / barCount);
        var cx = Math.floor((w - (barW * barCount + totalGap)) / 2);

        function draw() {
            animId.value = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(data);
            ctx.clearRect(0, 0, w, h);

            for (var i = 0; i < barCount; i++) {
                var idx = Math.floor(i * bufLen / barCount);
                var val = data[idx] / 255;
                var barH = Math.max(4, val * h * 0.85);
                var x = cx + i * (barW + barGap);
                var y = (h - barH) / 2;
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.7 + val * 0.3;
                ctx.beginPath();
                ctx.roundRect(x, y, barW, barH, 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        draw();
    }

    function initCards() {
    var cards = document.querySelectorAll('.mosaic-card:not([data-mosaic-init])');
    cards.forEach(function(card) {
        card.setAttribute('data-mosaic-init', '1');
        var video = card.querySelector('video');
        var audioSrc = card.dataset.audio;
        var isVideo = !!video;
        var isAudio = !!audioSrc;
        var isTikTok = !!card.querySelector('.mosaic-badge-tiktok');
        var isVimeo = card.classList.contains('mosaic-vimeo-card');
        var isInteractive = (isVideo || isAudio || isVimeo) && !isTikTok;
        var cardColor = getCardColor(card);

        // --- Link icon + Heart button (all cards) ---
        var cardHrefForSlug = card.getAttribute('href');
        var slug = cardSlugs[cardHrefForSlug];
        // For non-card posts, derive slug from URL path
        if (!slug && cardHrefForSlug) {
            slug = cardHrefForSlug.replace(/^\/posts\//, '').replace(/\//g, '').replace(/^\//, '');
        }
        if (slug) {
            // Determine share URL — card page if it exists, otherwise post URL
            var hasCard = !!cardSlugs[cardHrefForSlug];
            var shareUrl = hasCard ? (window.location.origin + '/card/' + slug + '/') : (window.location.origin + cardHrefForSlug);

            // Link icon — inside the pill, far right
            var badge = card.querySelector('.mosaic-badge');
            var linkBtn = document.createElement('button');
            linkBtn.className = 'mosaic-link-btn';
            linkBtn.setAttribute('aria-label', 'Copy link');
            linkBtn.innerHTML = LINK_SVG;
            if (badge) badge.appendChild(linkBtn);
            else card.appendChild(linkBtn);
            linkBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl);
                }
                // Toast popup
                var toast = document.createElement('div');
                toast.className = 'mosaic-link-toast';
                toast.textContent = 'Link Copied';
                card.appendChild(toast);
                // Green border
                card.classList.add('link-copied');
                // Fade after 1 second
                setTimeout(function() {
                    toast.classList.add('fade');
                    card.classList.remove('link-copied');
                    card.classList.add('link-fade');
                    setTimeout(function() {
                        toast.remove();
                        card.classList.remove('link-fade');
                    }, 500);
                }, 1000);
            });

            // Heart button — bottom right, pinned
            var heartBtn = document.createElement('button');
            heartBtn.className = 'mosaic-heart-btn';
            heartBtn.dataset.slug = slug;
            heartBtn.setAttribute('aria-label', 'Like');
            var isLiked = !!heartLikes[slug];
            var countDisplay = heartCounts[slug] || '';
            heartBtn.innerHTML = (isLiked ? HEART_FILLED_SVG : HEART_OUTLINE_SVG) + '<span class="mosaic-heart-count">' + countDisplay + '</span>';
            if (isLiked) heartBtn.classList.add('liked');
            card.appendChild(heartBtn);
            heartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                likeCard(slug, heartBtn);
            });
        }

        // TikTok cards: no player controls at all
        if (isTikTok) return;

        // --- Vimeo cards: click to embed player ---
        if (isVimeo) {
            var vimeoId = card.dataset.vimeo;
            var vimeoPlaying = false;
            var vimeoPlayBtn = document.createElement('button');
            vimeoPlayBtn.className = 'mosaic-play-btn mosaic-vimeo-play';
            vimeoPlayBtn.innerHTML = PLAY_SVG;
            card.appendChild(vimeoPlayBtn);

            function launchVimeo(e) {
                if (e.target.closest('.mosaic-title')) return;
                if (e.target.closest('.mosaic-more-btn')) return;
                e.preventDefault();
                e.stopPropagation();
                if (vimeoPlaying) return;
                vimeoPlaying = true;
                var iframe = document.createElement('iframe');
                iframe.src = 'https://player.vimeo.com/video/' + vimeoId + '?autoplay=1&title=0&byline=0&portrait=0&badge=0&pip=0&texttrack=false';
                iframe.className = 'mosaic-vimeo-iframe';
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'autoplay; fullscreen');
                iframe.setAttribute('allowfullscreen', '');
                card.querySelector('img').style.display = 'none';
                vimeoPlayBtn.style.display = 'none';
                card.insertBefore(iframe, card.querySelector('.mosaic-badge'));
                // Default Vimeo volume to 25%
                iframe.addEventListener('load', function() {
                    vimeoPostMsg(iframe, 'setVolume', 0.8);
                });
            }

            vimeoPlayBtn.addEventListener('click', launchVimeo);
            card.addEventListener('click', function(e) {
                if (e.target.closest('.mosaic-title')) return;
                if (e.target.closest('.mosaic-more-btn')) return;
                if (e.target.closest('.mosaic-speaker-btn')) return;
                if (e.target.closest('.mosaic-volume-wrap')) return;
                if (e.target.closest('.mosaic-link-btn')) return;
                if (e.target.closest('.mosaic-heart-btn')) return;
                if (!vimeoPlaying) launchVimeo(e);
            });

            // Title navigation for Vimeo cards
            var vTitleEl = card.querySelector('.mosaic-title');
            var vCardHref = card.getAttribute('href');
            if (vTitleEl && vCardHref) {
                var vArrow = document.createElement('span');
                vArrow.className = 'mosaic-title-arrow';
                vArrow.innerHTML = ' <svg viewBox="0 0 10 12" width="8" height="10" fill="white" style="vertical-align:middle;opacity:0.7;"><polygon points="0,0 10,6 0,12"/></svg>';
                vTitleEl.appendChild(vArrow);
                vTitleEl.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = vCardHref;
                });
                vTitleEl.style.cursor = 'pointer';
            }
            // MORE link for Vimeo cards
            var vOverlay = card.querySelector('.mosaic-overlay');
            if (vOverlay && vCardHref && !vOverlay.querySelector('.mosaic-more-btn, .mosaic-more')) {
                var vMore = document.createElement('span');
                vMore.className = 'mosaic-more-btn';
                vMore.textContent = 'MORE \u203A';
                vMore.style.color = cardColor;
                vMore.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = vCardHref;
                });
                vOverlay.appendChild(vMore);
            }

            // --- Vimeo speaker button + volume slider ---
            var vSpeaker = document.createElement('button');
            vSpeaker.className = 'mosaic-speaker-btn';
            vSpeaker.setAttribute('aria-label', 'Volume');
            vSpeaker.innerHTML = MUTED_SVG;
            card.appendChild(vSpeaker);

            var vSliderWrap = document.createElement('div');
            vSliderWrap.className = 'mosaic-volume-wrap';
            vSliderWrap.style.display = 'none';
            var vSlider = document.createElement('input');
            vSlider.type = 'range';
            vSlider.className = 'mosaic-volume-slider';
            vSlider.min = '0';
            vSlider.max = '1';
            vSlider.step = '0.05';
            vSlider.value = '0.8';
            vSliderWrap.appendChild(vSlider);
            card.appendChild(vSliderWrap);

            var vSliderTimeout = null;
            function vAutoClose() {
                if (vSliderTimeout) clearTimeout(vSliderTimeout);
                vSliderTimeout = setTimeout(function() { vSliderWrap.style.display = 'none'; }, 3000);
            }

            function vimeoPostMsg(iframe, method, value) {
                var data = { method: method };
                if (value !== undefined) data.value = value;
                iframe.contentWindow.postMessage(JSON.stringify(data), '*');
            }

            // Update speaker icon when Vimeo starts playing
            var origLaunch = launchVimeo;
            launchVimeo = function(e) {
                origLaunch(e);
                if (vimeoPlaying) {
                    vSpeaker.innerHTML = UNMUTED_SVG;
                    vSpeaker.classList.add('active');
                }
            };
            // Re-bind the play button and card click
            vimeoPlayBtn.removeEventListener('click', origLaunch);
            vimeoPlayBtn.addEventListener('click', launchVimeo);
            card.removeEventListener('click', arguments.callee);
            card.addEventListener('click', function(e) {
                if (e.target.closest('.mosaic-title')) return;
                if (e.target.closest('.mosaic-more-btn')) return;
                if (e.target.closest('.mosaic-speaker-btn')) return;
                if (e.target.closest('.mosaic-volume-wrap')) return;
                if (e.target.closest('.mosaic-link-btn')) return;
                if (e.target.closest('.mosaic-heart-btn')) return;
                if (!vimeoPlaying) launchVimeo(e);
            });

            vSpeaker.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var iframe = card.querySelector('.mosaic-vimeo-iframe');
                if (!iframe) return;
                if (vSliderWrap.style.display === 'none') {
                    closeAllSliders(vSliderWrap);
                    vSliderWrap.style.display = 'block';
                    vAutoClose();
                } else {
                    vSliderWrap.style.display = 'none';
                    if (vSliderTimeout) clearTimeout(vSliderTimeout);
                }
            });

            vSlider.addEventListener('input', function(e) {
                e.stopPropagation();
                var vol = parseFloat(this.value);
                var iframe = card.querySelector('.mosaic-vimeo-iframe');
                if (iframe) vimeoPostMsg(iframe, 'setVolume', vol);
                vSpeaker.innerHTML = vol === 0 ? MUTED_SVG : UNMUTED_SVG;
                if (vol > 0) vSpeaker.classList.add('active');
                else vSpeaker.classList.remove('active');
                vAutoClose();
            });
            vSlider.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); });

            return;
        }

        // Remove existing inline mute buttons
        var oldMute = card.querySelector('.mosaic-mute-btn');
        if (oldMute) oldMute.remove();

        // --- Speaker button (interactive cards only) ---
        var speaker = null;
        if (isInteractive) {
            speaker = document.createElement('button');
            speaker.className = 'mosaic-speaker-btn';
            speaker.setAttribute('aria-label', 'Volume');
            speaker.innerHTML = MUTED_SVG;
            card.appendChild(speaker);
        }

        // --- Center play button (audio and video cards) ---
        var playBtn = null;
        if (isAudio || isVideo) {
            playBtn = document.createElement('button');
            playBtn.className = 'mosaic-play-btn';
            playBtn.innerHTML = PLAY_SVG;
            card.appendChild(playBtn);
            // Video cards: hide play button if already autoplaying
            if (isVideo && video.autoplay && !video.paused) {
                playBtn.style.display = 'none';
            }
        }

        // --- Visualizer canvas for audio cards ---
        var vizCanvas = null;
        var analyser = null;
        var sourceNode = null;
        var gainNode = null;
        var animId = { value: null };

        if (isAudio) {
            vizCanvas = document.createElement('canvas');
            vizCanvas.className = 'mosaic-visualizer';
            vizCanvas.width = 112;
            vizCanvas.height = 112;
            vizCanvas.style.display = 'none';
            card.appendChild(vizCanvas);

            // Click visualizer to stop
            vizCanvas.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (audio && !audio.paused) {
                    audio.pause();
                    vizCanvas.style.display = 'none';
                    if (playBtn) playBtn.style.display = '';
                    speaker.classList.remove('active');
                    speaker.innerHTML = MUTED_SVG;
                    if (animId.value) { cancelAnimationFrame(animId.value); animId.value = null; }
                }
            });
        }

        var cardHref = card.getAttribute('href');
        var cardTarget = card.getAttribute('target');

        if (playBtn) playBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isAudio && audio) {
                if (audio.paused) {
                    stopAllAudioExcept(card);
                    audio.play();
                    // Show visualizer, hide play button
                    if (playBtn) playBtn.style.display = 'none';
                    if (vizCanvas) vizCanvas.style.display = '';
                    speaker.classList.add('active');
                    speaker.innerHTML = UNMUTED_SVG;
                    // Set up Web Audio analyser
                    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    if (!sourceNode) {
                        sourceNode = audioCtx.createMediaElementSource(audio);
                        analyser = audioCtx.createAnalyser();
                        analyser.fftSize = 64;
                        gainNode = audioCtx.createGain();
                        gainNode.gain.value = audio.volume;
                        sourceNode.connect(gainNode);
                        gainNode.connect(analyser);
                        analyser.connect(audioCtx.destination);
                    }
                    drawVisualizer(vizCanvas, analyser, cardColor, animId);
                } else {
                    audio.pause();
                    if (vizCanvas) vizCanvas.style.display = 'none';
                    if (playBtn) playBtn.style.display = '';
                    speaker.classList.remove('active');
                    speaker.innerHTML = MUTED_SVG;
                    if (animId.value) { cancelAnimationFrame(animId.value); animId.value = null; }
                }
            } else if (isVideo && video) {
                if (video.paused) {
                    video.muted = false;
                    video.volume = parseFloat(slider.value);
                    speaker.innerHTML = UNMUTED_SVG;
                    speaker.classList.add('active');
                    video.play();
                    if (playBtn) playBtn.style.display = 'none';
                } else {
                    video.pause();
                    if (playBtn) playBtn.style.display = '';
                }
            } else if (cardHref) {
                if (cardTarget === '_blank') {
                    window.open(cardHref, '_blank', 'noopener');
                } else {
                    window.location.href = cardHref;
                }
            }
        });

        // --- Volume slider (interactive cards only) ---
        var sliderWrap = document.createElement('div');
        sliderWrap.className = 'mosaic-volume-wrap';
        sliderWrap.style.display = 'none';
        var slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'mosaic-volume-slider';
        slider.min = '0';
        slider.max = '1';
        slider.step = '0.05';
        slider.value = '0.8';
        sliderWrap.appendChild(slider);
        if (isInteractive) card.appendChild(sliderWrap);

        // --- Audio element for audio cards ---
        var audio;
        if (isAudio) {
            audio = document.createElement('audio');
            audio.className = 'mosaic-audio';
            audio.src = audioSrc;
            audio.preload = 'none';
            audio.volume = 0.8;
            card.appendChild(audio);

            audio.addEventListener('ended', function() {
                speaker.classList.remove('active');
                speaker.innerHTML = MUTED_SVG;
                if (vizCanvas) vizCanvas.style.display = 'none';
                if (playBtn) playBtn.style.display = '';
                if (animId.value) { cancelAnimationFrame(animId.value); animId.value = null; }
            });

            // Prevent card navigation on click (except More button and title)
            card.addEventListener('click', function(e) {
                if (e.target.closest('.mosaic-more-btn')) return;
                if (e.target.closest('.mosaic-more')) return;
                if (e.target.closest('.mosaic-title')) return;
                if (e.target.closest('.mosaic-speaker-btn')) return;
                if (e.target.closest('.mosaic-volume-wrap')) return;
                if (e.target.closest('.mosaic-play-btn')) return;
                if (e.target.closest('.mosaic-visualizer')) return;
                if (e.target.closest('.mosaic-link-btn')) return;
                if (e.target.closest('.mosaic-heart-btn')) return;
                e.preventDefault();
            });
        }

        // --- Video: click anywhere to pause/play ---
        if (isVideo) {
            card.addEventListener('click', function(e) {
                if (e.target.closest('.mosaic-speaker-btn')) return;
                if (e.target.closest('.mosaic-volume-wrap')) return;
                if (e.target.closest('.mosaic-more-btn')) return;
                if (e.target.closest('.mosaic-more')) return;
                if (e.target.closest('.mosaic-title')) return;
                if (e.target.closest('.mosaic-link-btn')) return;
                if (e.target.closest('.mosaic-heart-btn')) return;
                e.preventDefault();
                if (video.paused) {
                    video.muted = false;
                    video.volume = parseFloat(slider.value);
                    speaker.innerHTML = UNMUTED_SVG;
                    speaker.classList.add('active');
                    video.play();
                    if (playBtn) playBtn.style.display = 'none';
                } else {
                    video.pause();
                    if (playBtn) playBtn.style.display = '';
                }
            });
            // Show play button when video ends
            video.addEventListener('ended', function() {
                if (playBtn) playBtn.style.display = '';
            });
            // Show play button when video pauses (e.g. browser pause)
            video.addEventListener('pause', function() {
                if (playBtn) playBtn.style.display = '';
            });
            // Hide play button when video plays
            video.addEventListener('play', function() {
                if (playBtn) playBtn.style.display = 'none';
            });
        }

        // --- Speaker click + volume slider (interactive cards only) ---
        if (isInteractive) {
            var sliderTimeout = null;
            function autoCloseSlider() {
                if (sliderTimeout) clearTimeout(sliderTimeout);
                sliderTimeout = setTimeout(function() {
                    sliderWrap.style.display = 'none';
                }, 3000);
            }

            speaker.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (sliderWrap.style.display === 'none') {
                    closeAllSliders(sliderWrap);
                    sliderWrap.style.display = 'block';
                    if (isVideo && video.muted) {
                        video.muted = false;
                        video.volume = parseFloat(slider.value);
                        speaker.innerHTML = UNMUTED_SVG;
                        speaker.classList.add('active');
                    }
                    autoCloseSlider();
                } else {
                    sliderWrap.style.display = 'none';
                    if (sliderTimeout) clearTimeout(sliderTimeout);
                }
            });

            slider.addEventListener('input', function(e) {
                e.stopPropagation();
                var vol = parseFloat(this.value);
                if (isVideo) { video.volume = vol; video.muted = vol === 0; }
                if (isAudio && audio) { audio.volume = vol; audio.muted = vol === 0; if (gainNode) gainNode.gain.value = vol; }
                speaker.innerHTML = vol === 0 ? MUTED_SVG : UNMUTED_SVG;
                if (vol > 0) speaker.classList.add('active');
                else speaker.classList.remove('active');
                autoCloseSlider();
            });
            slider.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); });
        }

        // --- Title click → navigate to post (audio and video cards) ---
        var titleEl = card.querySelector('.mosaic-title');
        if (titleEl && cardHref) {
            // Add small white triangle indicator
            var arrow = document.createElement('span');
            arrow.className = 'mosaic-title-arrow';
            arrow.innerHTML = ' <svg viewBox="0 0 10 12" width="8" height="10" fill="white" style="vertical-align:middle;opacity:0.7;"><polygon points="0,0 10,6 0,12"/></svg>';
            titleEl.appendChild(arrow);
            // Active click handler — navigates on normal tap
            titleEl.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (cardTarget === '_blank') {
                    window.open(cardHref, '_blank', 'noopener');
                } else {
                    window.location.href = cardHref;
                }
            });
            titleEl.style.cursor = 'pointer';
        }

        // --- "MORE" link on ALL cards, colored to match badge ---
        var href = card.getAttribute('href');
        var target = card.getAttribute('target');
        var overlay = card.querySelector('.mosaic-overlay');
        if (overlay && href && !overlay.querySelector('.mosaic-more-btn, .mosaic-more')) {
            var moreSpan = document.createElement('span');
            moreSpan.className = 'mosaic-more-btn';
            moreSpan.textContent = 'MORE \u203A';
            moreSpan.style.color = cardColor;
            moreSpan.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (target === '_blank') {
                    window.open(href, '_blank', 'noopener');
                } else {
                    window.location.href = href;
                }
            });
            overlay.appendChild(moreSpan);
        }
    });
    } // end initCards

    // Run on initial load
    initCards();

    // Expose for dynamic card injection (mosaic-randomizer.js)
    window.initMosaicCards = initCards;

    // Close sliders when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mosaic-speaker-btn') && !e.target.closest('.mosaic-volume-wrap')) {
            closeAllSliders(null);
        }
    });
})();
