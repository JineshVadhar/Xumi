/**
 * XUMI ROBOTICS // FIRMWARE & INTERACTIVE TEST BENCH CONTROLLER
 * Handcrafted for Xumi Desktop Companion Robot
 * Creator: Yug Thakar (yugthakar1111@gmail.com)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SMOOTH SCROLLING & NAVIGATION
       ========================================================================== */
    const navLinksList = document.querySelectorAll('a[href^="#"]');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    navLinksList.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburgerBtn.classList.remove('active');
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    /* ==========================================================================
       2. INTERACTIVE TEST BENCH & OLED EMOTION ENGINE
       ========================================================================== */
    const xumiFace = document.getElementById('xumi-face');
    const readoutMood = document.getElementById('readout-mood');
    const telemetryLog = document.getElementById('telemetry-log');
    const deviceCasing = document.getElementById('device-casing');
    const moodBtns = document.querySelectorAll('.tactile-btn');
    const liveTelemetry = document.getElementById('live-telemetry-status');

    let currentMood = 'happy';
    let petTimeout = null;

    // Helper: Append log with real time
    function appendLog(message, type = '') {
        if (!telemetryLog) return;
        const now = new Date();
        const timeStr = `[${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}]`;
        
        const logLine = document.createElement('div');
        logLine.className = `log-row ${type}`;
        logLine.textContent = `${timeStr} ${message}`;
        telemetryLog.appendChild(logLine);
        telemetryLog.scrollTop = telemetryLog.scrollHeight;
    }

    // Set Mood State Function
    function setMood(moodName, triggerSource = 'btn') {
        if (!xumiFace) return;

        // Reset classes
        xumiFace.className = `pixel-face ${moodName}`;
        currentMood = moodName;

        if (readoutMood) {
            readoutMood.textContent = moodName.toUpperCase();
        }

        // Update active button
        moodBtns.forEach(btn => {
            if (btn.getAttribute('data-state') === moodName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Telemetry status update
        if (liveTelemetry) {
            const randLat = Math.floor(Math.random() * 8) + 8;
            liveTelemetry.innerHTML = `STATUS: <strong>${moodName.toUpperCase()}</strong> &bull; LATENCY: ${randLat}ms`;
        }

        // Add custom logs based on state
        switch(moodName) {
            case 'happy':
                appendLog('State transitioned -> HAPPY_IDLE. Tail wag hum active.', 'info');
                break;
            case 'curious':
                appendLog('State transitioned -> CURIOUS_OBSERVE. Eye-tracking gyro enabled.', 'event');
                break;
            case 'pet':
                appendLog('Event: Capacitive crown stroke registered. Endorphin level: 100%.', 'event');
                break;
            case 'hungry':
                appendLog('Event: Snack routine triggered. Virtual nom-nom animation running.', 'info');
                break;
            case 'coding':
                appendLog('State transitioned -> DEEP_FOCUS. Notification suppression active.', 'success');
                break;
            case 'sleeping':
                appendLog('State transitioned -> DEEP_SLEEP. Low-power 0.4mA sleep draw.', '');
                break;
        }
    }

    // Bind Tactile Mood Buttons
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const state = btn.getAttribute('data-state');
            setMood(state, 'button');
        });
    });

    // Tap/Pet the physical robot casing directly
    if (deviceCasing) {
        deviceCasing.addEventListener('click', (e) => {
            // Trigger temporary pet/love reaction
            clearTimeout(petTimeout);
            setMood('pet', 'touch');

            // Haptic visual vibration on casing
            deviceCasing.style.transform = 'scale(0.96)';
            setTimeout(() => {
                deviceCasing.style.transform = '';
            }, 150);

            // Return to previous or happy mood after 2.5 seconds
            petTimeout = setTimeout(() => {
                setMood('happy', 'auto');
            }, 2500);
        });
    }

    // Interactive Eye Tracking: Xumi's eyes subtly follow the cursor!
    const simulatorSection = document.getElementById('simulator');
    if (simulatorSection && xumiFace) {
        simulatorSection.addEventListener('mousemove', (e) => {
            if (currentMood === 'sleeping') return; // Don't track eyes during sleep

            const rect = simulatorSection.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
            const relY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

            // Max eye movement limit in pixels
            const maxOffset = 6;
            const eyeX = (relX * maxOffset * 2).toFixed(1);
            const eyeY = (relY * maxOffset * 2).toFixed(1);

            xumiFace.style.setProperty('--eye-x', `${eyeX}px`);
            xumiFace.style.setProperty('--eye-y', `${eyeY}px`);
        });

        simulatorSection.addEventListener('mouseleave', () => {
            xumiFace.style.setProperty('--eye-x', '0px');
            xumiFace.style.setProperty('--eye-y', '0px');
        });
    }

    /* ==========================================================================
       3. EMAIL INTEGRATION (yugthakar1111@gmail.com) & TOAST SYSTEM
       ========================================================================== */
    const targetEmail = 'yugthakar1111@gmail.com';
    const btnCopyEmail = document.getElementById('btn-copy-email');
    const copyBtnLabel = document.getElementById('copy-btn-label');
    const toast = document.getElementById('toast-notification');
    const quickInquiryForm = document.getElementById('quick-inquiry-form');
    const inquirySuccessNotice = document.getElementById('inquiry-success-notice');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3200);
    }

    // 1-Click Copy Email to Clipboard
    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(targetEmail);
                } else {
                    // Fallback
                    const tempInput = document.createElement('input');
                    tempInput.value = targetEmail;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }

                // Update Button Label
                if (copyBtnLabel) {
                    copyBtnLabel.textContent = '✓ Copied!';
                }
                showToast(`✓ Copied ${targetEmail} to clipboard!`);

                setTimeout(() => {
                    if (copyBtnLabel) copyBtnLabel.textContent = 'Copy Email';
                }, 2500);

            } catch (err) {
                console.error('Copy failed:', err);
                showToast(`Email: ${targetEmail}`);
            }
        });
    }

    // Direct Pre-order / Inquiry Note Form Submission
    if (quickInquiryForm) {
        quickInquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('inq-name').value.trim();
            const senderEmail = document.getElementById('inq-email').value.trim();
            const message = document.getElementById('inq-msg').value.trim();

            if (!name || !senderEmail || !message) return;

            // Prepare mailto link with encoded parameters
            const subject = encodeURIComponent(`Xumi Robot Pre-order / Inquiry from ${name}`);
            const body = encodeURIComponent(
                `Hi Yug,\n\nI came across Xumi and wanted to reach out:\n\n${message}\n\nFrom: ${name} (${senderEmail})\nSent via Xumi Workbench`
            );

            const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

            // Show success notice
            if (inquirySuccessNotice) {
                inquirySuccessNotice.style.display = 'block';
            }
            showToast('✓ Opening mail client to dispatch to Yug!');

            // Open user's email client
            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 600);
        });
    }

    /* ==========================================================================
       4. FAQ ACCORDION INTERACTIVITY
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const toggleIcon = item.querySelector('.faq-toggle');

        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.faq-toggle');
                    if (otherIcon) otherIcon.textContent = '+';
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    if (toggleIcon) toggleIcon.textContent = '-';
                } else {
                    item.classList.remove('active');
                    if (toggleIcon) toggleIcon.textContent = '+';
                }
            });
        }
    });

    /* ==========================================================================
       5. VIDEO DEMO MODAL
       ========================================================================== */
    const btnWatchVideo = document.getElementById('btn-watch-video');
    const videoModal = document.getElementById('video-modal');
    const btnCloseVideo = document.getElementById('btn-close-video');
    const videoModalOverlay = document.getElementById('video-modal-overlay');
    const mockPlayer = document.querySelector('.mock-player');
    const playerOverlay = document.getElementById('player-overlay');
    const mockVideoPlaying = document.getElementById('mock-video-playing');

    function openVideoModal() {
        if (!videoModal) return;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
        if (!videoModal) return;
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        if (playerOverlay && mockVideoPlaying) {
            playerOverlay.style.display = 'block';
            mockVideoPlaying.style.display = 'none';
        }
    }

    if (btnWatchVideo) btnWatchVideo.addEventListener('click', openVideoModal);
    if (btnCloseVideo) btnCloseVideo.addEventListener('click', closeVideoModal);
    if (videoModalOverlay) videoModalOverlay.addEventListener('click', closeVideoModal);

    if (mockPlayer) {
        mockPlayer.addEventListener('click', () => {
            if (playerOverlay && mockVideoPlaying) {
                playerOverlay.style.display = 'none';
                mockVideoPlaying.style.display = 'block';
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

});
