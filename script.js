document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero-section');
    const movieCards = document.querySelectorAll('.movie-card');
    const watchPage = document.getElementById('watch-page');
    const backButton = document.querySelector('.back-button');
    const vimeoPlayerContainer = document.getElementById('vimeo-player');
    let currentVimeoPlayer = null; // เก็บ instance ของ Vimeo Player

    // --- 1. เปลี่ยนสี Navbar เมื่อ Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // เมื่อเลื่อนลงมาเกิน 50px
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. จัดการการคลิกที่ Movie Card เพื่อเปิด Watch Page ---
    movieCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.dataset.movieId; // ดึง ID วิดีโอจาก data-movie-id
            if (videoId) {
                loadAndPlayVideo(videoId);
                watchPage.classList.remove('hidden'); // แสดงหน้า Watch Page
                document.body.style.overflow = 'hidden'; // ปิด scrollbar หลัก
            } else {
                alert('ยังไม่มี Video ID สำหรับภาพยนตร์นี้!');
            }
        });
    });

    // --- 3. ฟังก์ชันสำหรับโหลดและเล่นวิดีโอ Vimeo ---
    function loadAndPlayVideo(videoId) {
        // ลบ player เก่าถ้ามี
        if (currentVimeoPlayer) {
            currentVimeoPlayer.destroy().then(function() {
                // Player ถูกทำลายแล้ว
            }).catch(function(error) {
                console.error("Error destroying old player:", error);
            });
            vimeoPlayerContainer.innerHTML = ''; // ลบ iframe เก่า
        }

        // สร้าง iframe ใหม่สำหรับ Vimeo player
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://player.vimeo.com/video/${videoId}?autoplay=1&api=1&player_id=mainVimeoPlayer`);
        iframe.setAttribute('id', 'mainVimeoPlayer');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '100%');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        
        vimeoPlayerContainer.appendChild(iframe);

        // สร้าง Vimeo Player instance ใหม่
        currentVimeoPlayer = new Vimeo.Player(iframe);

        currentVimeoPlayer.on('ready', () => {
            console.log(`Vimeo Player for video ${videoId} is ready!`);
            currentVimeoPlayer.play().catch(function(error) {
                // Catch error if autoplay is blocked by browser
                console.warn("Autoplay was prevented:", error.name);
                alert("เบราว์เซอร์อาจบล็อกการเล่นอัตโนมัติ กรุณากดเล่นด้วยตนเอง");
            });
        });

        currentVimeoPlayer.on('ended', () => {
            console.log('Video ended!');
            // กลับไปหน้าหลักเมื่อวิดีโอจบ
            closeWatchPage();
        });
    }

    // --- 4. ปุ่ม "กลับ" บนหน้า Watch Page ---
    backButton.addEventListener('click', () => {
        closeWatchPage();
    });

    function closeWatchPage() {
        if (currentVimeoPlayer) {
            currentVimeoPlayer.pause(); // หยุดวิดีโอเมื่อกลับ
            currentVimeoPlayer.destroy().then(() => {
                console.log('Player destroyed on back.');
                vimeoPlayerContainer.innerHTML = ''; // ลบ iframe
                currentVimeoPlayer = null;
            }).catch(function(error) {
                console.error("Error destroying player on back:", error);
            });
        }
        watchPage.classList.add('hidden'); // ซ่อนหน้า Watch Page
        document.body.style.overflow = 'auto'; // เปิด scrollbar หลัก
    }

    // --- 5. ฟังก์ชันสำหรับปุ่มเล่นใน Hero Section (ชั่วคราว) ---
    const heroPlayButton = document.querySelector('.hero-buttons .play-button');
    heroPlayButton.addEventListener('click', () => {
        const heroVideoId = "881267676"; // ใช้ Video ID ของวิดีโอหลักของคุณ
        loadAndPlayVideo(heroVideoId);
        watchPage.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
});