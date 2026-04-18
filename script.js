document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil nama tamu dari URL Parameter (Misal: ?to=Budi)
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    if (guestName) {
        document.getElementById('guest-name').innerText = guestName;
    }

    // 2. Logika Buka Undangan & Musik
    const openBtn = document.getElementById('open-invitation-btn');
    const openingScreen = document.getElementById('opening-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    let isPlaying = false;

    openBtn.addEventListener('click', () => {
        openingScreen.classList.add('slide-up-hide');
        setTimeout(() => {
            openingScreen.style.display = 'none';
        }, 1000); // Sesuaikan dengan durasi CSS transition
        
        mainContent.classList.remove('hidden');
        document.body.style.overflow = 'auto'; // Mengembalikan scroll
        
        // Putar musik
        bgMusic.play().catch(error => console.log("Autoplay blocked:", error));
        isPlaying = true;
    });

    // Toggle Musik
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerText = '🔇';
        } else {
            bgMusic.play();
            musicBtn.innerText = '🎵';
        }
        isPlaying = !isPlaying;
    });

    // 3. Scroll Animation (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animasi hanya berjalan 1x
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // 4. Countdown Timer
    // Set Tanggal Pernikahan (Tahun, Bulan-1, Tanggal, Jam, Menit)
    const weddingDate = new Date(2026, 11, 25, 8, 0, 0).getTime(); // 25 Des 2026

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days < 10 ? '0' + days : days;
        document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);

    // 5. RSVP via WhatsApp
    const rsvpForm = document.getElementById('rsvp-form');
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('nama').value;
        const kehadiran = document.getElementById('kehadiran').value;
        const pesan = document.getElementById('pesan').value;
        
        // Ganti nomor WhatsApp tujuan di bawah ini (Gunakan kode negara, ex: 62)
        const waNumber = "6285783979309";
        
        const textMessage = `Halo, saya ${nama}.\n\nTerkait undangan pernikahan, saya mengkonfirmasi: *${kehadiran}*.\n\nPesan: ${pesan}`;
        const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(textMessage)}`;
        
        window.open(waLink, '_blank');
    });

    // 6. Share Button (Web Share API)
    const shareBtn = document.getElementById('share-btn');
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Undangan Pernikahan Romeo & Juliet',
                    text: 'Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di acara pernikahan kami.',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Gagal membagikan: ', err);
            }
        } else {
            alert('Fitur share tidak didukung di browser ini. Silakan copy link URL secara manual.');
        }
    });
});
