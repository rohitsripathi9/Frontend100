// ===== Spotify Clone - Interactive Script =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== GREETING =====
    const greetingEl = document.getElementById('greeting-text');
    if (greetingEl) {
        const h = new Date().getHours();
        greetingEl.textContent = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    }

    // ===== SONG DATA =====
    const songs = {
        'tum-hi-ho': { name: 'Tum Hi Ho', artist: 'Arijit Singh', duration: '4:22', img: 'card2img.jpeg' },
        'channa-mereya': { name: 'Channa Mereya', artist: 'Arijit Singh', duration: '4:49', img: 'card3img.jpeg' },
        'apna-bana-le': { name: 'Apna Bana Le', artist: 'Arijit Singh', duration: '3:55', img: 'card1img.jpeg' },
        'top-global': { name: 'Top 50 - Global', artist: 'Various Artists', duration: '5:00', img: 'card5img.jpeg' },
        'hi-nanna': { name: 'Hi Nanna OST', artist: 'Hesham Abdul Wahab', duration: '4:10', img: 'card5img.jpeg' },
        'best-2024': { name: 'Best of 2024', artist: 'Various Artists', duration: '4:00', img: 'card1img.jpeg' },
        'aaradhya': { name: 'Aaradhya', artist: 'Armaan Malik', duration: '3:45', img: 'card6img.jpeg' },
        'tum-saath-ho': { name: 'Tum Saath Ho', artist: 'Arijit Singh', duration: '5:12', img: 'card3img.jpeg' },
        'tere-sang-yaara': { name: 'Tere Sang Yaara', artist: 'Arijit Singh', duration: '3:33', img: 'card1img.jpeg' },
        'kesariya': { name: 'Kesariya', artist: 'Arijit Singh', duration: '4:28', img: 'card4img.jpeg' },
        'raataan-lambiyan': { name: 'Raataan Lambiyan', artist: 'Jubin Nautiyal', duration: '3:50', img: 'card5img.jpeg' },
        'ae-dil-hai-mushkil': { name: 'Ae Dil Hai Mushkil', artist: 'Arijit Singh', duration: '4:29', img: 'card6img.jpeg' },
        'kalank-title': { name: 'Kalank', artist: 'Arijit Singh', duration: '5:08', img: 'card2img.jpeg' },
        'top-india': { name: 'Top Songs - India', artist: 'Various Artists', duration: '4:15', img: 'card6img.jpeg' },
        'viral-50': { name: 'Viral 50 - India', artist: 'Various Artists', duration: '3:40', img: 'card1img.jpeg' },
        'bollywood-hits': { name: 'Bollywood Hits', artist: 'Various Artists', duration: '4:05', img: 'card3img.jpeg' },
        'indie-mix': { name: 'Indie India Mix', artist: 'Various Artists', duration: '3:48', img: 'card4img.jpeg' },
    };

    // ===== PLAYER STATE =====
    let currentSong = 'tere-sang-yaara';
    let isPlaying = false;
    let progress = 0;
    let volume = 70;
    let isShuffle = false;
    let isRepeat = false;
    let isLiked = false;
    let progressInterval = null;

    const songKeys = Object.keys(songs);
    const els = {
        songName: document.getElementById('song-name'),
        artistName: document.getElementById('artist-name'),
        albumArt: document.getElementById('album-art'),
        playIcon: document.getElementById('play-icon'),
        playPauseBtn: document.getElementById('play-pause-btn'),
        currentTime: document.getElementById('current-time'),
        totalTime: document.getElementById('total-time'),
        progressFill: document.getElementById('progress-fill'),
        progressThumb: document.getElementById('progress-thumb'),
        progressWrapper: document.getElementById('progress-wrapper'),
        volumeFill: document.getElementById('volume-fill'),
        volumeThumb: document.getElementById('volume-thumb'),
        volumeWrapper: document.getElementById('volume-wrapper'),
        volumeIcon: document.getElementById('volume-icon'),
        volumeBtn: document.getElementById('volume-btn'),
        shuffleBtn: document.getElementById('shuffle-btn'),
        repeatBtn: document.getElementById('repeat-btn'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        likeBtn: document.getElementById('like-btn'),
    };

    // ===== HELPERS =====
    function parseDuration(str) {
        const [m, s] = str.split(':').map(Number);
        return m * 60 + s;
    }
    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    // ===== LOAD SONG =====
    function loadSong(key) {
        const song = songs[key];
        if (!song) return;
        currentSong = key;
        els.songName.textContent = song.name;
        els.artistName.textContent = song.artist;
        els.albumArt.src = song.img;
        els.totalTime.textContent = song.duration;
        progress = 0;
        updateProgress();
    }

    // ===== PLAY/PAUSE =====
    function togglePlay() {
        isPlaying = !isPlaying;
        els.playIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        els.playPauseBtn.title = isPlaying ? 'Pause' : 'Play';
        if (isPlaying) startProgress(); else stopProgress();
    }

    function startProgress() {
        stopProgress();
        const total = parseDuration(songs[currentSong].duration);
        progressInterval = setInterval(() => {
            progress += 0.5;
            if (progress >= total) {
                progress = 0;
                if (isRepeat) { updateProgress(); }
                else { nextSong(); }
            }
            updateProgress();
        }, 500);
    }

    function stopProgress() {
        if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
    }

    function updateProgress() {
        const total = parseDuration(songs[currentSong].duration);
        const pct = (progress / total) * 100;
        els.progressFill.style.width = pct + '%';
        els.progressThumb.style.left = pct + '%';
        els.currentTime.textContent = formatTime(progress);
    }

    // ===== NEXT/PREV =====
    function nextSong() {
        let idx = songKeys.indexOf(currentSong);
        idx = isShuffle ? Math.floor(Math.random() * songKeys.length) : (idx + 1) % songKeys.length;
        loadSong(songKeys[idx]);
        if (isPlaying) startProgress();
    }

    function prevSong() {
        if (progress > 3) { progress = 0; updateProgress(); if (isPlaying) startProgress(); return; }
        let idx = songKeys.indexOf(currentSong);
        idx = (idx - 1 + songKeys.length) % songKeys.length;
        loadSong(songKeys[idx]);
        if (isPlaying) startProgress();
    }

    // ===== EVENT LISTENERS =====
    els.playPauseBtn.addEventListener('click', togglePlay);
    els.nextBtn.addEventListener('click', nextSong);
    els.prevBtn.addEventListener('click', prevSong);

    els.shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        els.shuffleBtn.classList.toggle('active', isShuffle);
    });

    els.repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        els.repeatBtn.classList.toggle('active', isRepeat);
    });

    els.likeBtn.addEventListener('click', () => {
        isLiked = !isLiked;
        els.likeBtn.querySelector('i').className = isLiked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        els.likeBtn.classList.toggle('active', isLiked);
    });

    // Progress bar click
    els.progressWrapper.addEventListener('click', (e) => {
        const rect = els.progressWrapper.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        const total = parseDuration(songs[currentSong].duration);
        progress = pct * total;
        updateProgress();
        if (isPlaying) startProgress();
    });

    // Volume
    function setVolume(pct) {
        volume = Math.max(0, Math.min(100, pct));
        els.volumeFill.style.width = volume + '%';
        els.volumeThumb.style.left = volume + '%';
        const icon = els.volumeIcon;
        icon.className = volume === 0 ? 'fa-solid fa-volume-xmark' : volume < 50 ? 'fa-solid fa-volume-low' : 'fa-solid fa-volume-high';
    }

    els.volumeWrapper.addEventListener('click', (e) => {
        const rect = els.volumeWrapper.getBoundingClientRect();
        setVolume(((e.clientX - rect.left) / rect.width) * 100);
    });

    let prevVolume = 70;
    els.volumeBtn.addEventListener('click', () => {
        if (volume > 0) { prevVolume = volume; setVolume(0); }
        else { setVolume(prevVolume); }
    });

    // ===== CARD CLICKS =====
    document.querySelectorAll('.card[data-song], .quick-card[data-song]').forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.song;
            if (songs[key]) {
                loadSong(key);
                if (!isPlaying) togglePlay();
                else startProgress();
            }
        });
    });

    // ===== NAV ACTIVE STATE =====
    document.querySelectorAll('.nav-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.nav-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
        });
    });

    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') { e.preventDefault(); togglePlay(); }
        if (e.code === 'ArrowRight' && e.ctrlKey) nextSong();
        if (e.code === 'ArrowLeft' && e.ctrlKey) prevSong();
    });

    // Init
    loadSong(currentSong);
    setVolume(70);
});
