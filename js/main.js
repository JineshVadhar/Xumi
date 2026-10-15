/**
 * VELQORA ROBOTICS // FIRMWARE & INTERACTIVE TEST BENCH CONTROLLER
 * Handcrafted for Xumi Desktop Companion Robot
 * Maker: Velqora Labs (yugthakar1111@gmail.com | +91 8238337734)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SMOOTH SCROLLING & RESPONSIVE NAVIGATION DRAWER
       ========================================================================== */
    const navLinksList = document.querySelectorAll('a[href^="#"]');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const navOverlay = document.getElementById('nav-overlay');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');

    function openMobileDrawer() {
        if (mobileDrawer) mobileDrawer.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        if (hamburgerBtn) {
            hamburgerBtn.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
        if (mobileDrawer) mobileDrawer.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        if (hamburgerBtn) {
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            if (mobileDrawer && mobileDrawer.classList.contains('active')) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        });
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', closeMobileDrawer);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileDrawer);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
            closeMobileDrawer();
        }
    });

    navLinksList.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                closeMobileDrawer();

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

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
       3. CONTACT INTEGRATION (+91 8238337734) & EMAIL CONFIRMATION SYSTEM
       ========================================================================== */
    const targetEmail = 'yugthakar1111@gmail.com';
    const targetPhone = '+918238337734';
    const btnCopyEmail = document.getElementById('btn-copy-email');
    const copyBtnLabel = document.getElementById('copy-btn-label');
    const btnCopyPhone = document.getElementById('btn-copy-phone');
    const copyPhoneLabel = document.getElementById('copy-phone-label');
    const toast = document.getElementById('toast-notification');
    
    // Inquiry Form & Confirmation Elements
    const quickInquiryForm = document.getElementById('quick-inquiry-form');
    const inquiryConfCard = document.getElementById('inquiry-confirmation-card');
    const btnSubmitInquiry = document.getElementById('btn-submit-inquiry');
    const btnResetInquiry = document.getElementById('btn-reset-inquiry');
    
    const confRefId = document.getElementById('conf-ref-id');
    const confValName = document.getElementById('conf-val-name');
    const confValEmail = document.getElementById('conf-val-email');
    const btnConfWhatsapp = document.getElementById('btn-conf-whatsapp');
    const btnConfGmail = document.getElementById('btn-conf-gmail');
    const btnConfMailto = document.getElementById('btn-conf-mailto');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3400);
    }

    // Generic Clipboard Helper
    async function copyToClipboard(text, successMsg, labelElement, originalText) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const tempInput = document.createElement('input');
                tempInput.value = text;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
            }

            if (labelElement) {
                labelElement.textContent = '✓ Copied!';
                setTimeout(() => {
                    labelElement.textContent = originalText;
                }, 2400);
            }
            showToast(successMsg);
        } catch (err) {
            console.error('Clipboard copy failed:', err);
            showToast(`Copy: ${text}`);
        }
    }

    // 1-Click Copy Phone (+91 8238337734)
    if (btnCopyPhone) {
        btnCopyPhone.addEventListener('click', () => {
            copyToClipboard(targetPhone, '✓ Copied +91 8238337734 to clipboard!', copyPhoneLabel, 'Copy');
        });
    }

    // 1-Click Copy Email to Clipboard
    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', () => {
            copyToClipboard(targetEmail, `✓ Copied ${targetEmail} to clipboard!`, copyBtnLabel, 'Copy Email');
        });
    }

    // Direct Pre-order / Inquiry Note Form Submission with Verified Confirmation
    if (quickInquiryForm) {
        quickInquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('inq-name').value.trim();
            const senderEmail = document.getElementById('inq-email').value.trim();
            const senderPhone = document.getElementById('inq-phone') ? document.getElementById('inq-phone').value.trim() : '';
            const interest = document.getElementById('inq-interest') ? document.getElementById('inq-interest').value : 'Batch 01 Pre-order Reservation';
            const message = document.getElementById('inq-msg').value.trim();

            if (!name || !senderEmail || !message) {
                showToast('Please fill out all required fields.');
                return;
            }

            // Generate unique verifiable reservation code
            const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
            const ticketId = `#VELQ-8238-${randomCode}`;

            // Provide visual feedback on submit button
            if (btnSubmitInquiry) {
                btnSubmitInquiry.disabled = true;
                const submitTextEl = btnSubmitInquiry.querySelector('.submit-text');
                if (submitTextEl) submitTextEl.textContent = 'Transmitting Reservation...';
            }

            // Prepare email subject and message body
            const subject = `[Velqora Xumi] ${interest} from ${name} (${ticketId})`;
            const body = 
`Hello Velqora Team,

I would like to submit the following inquiry / pre-order reservation for Xumi:

- Reservation Code: ${ticketId}
- Topic: ${interest}
- Message:
${message}

Sender Details:
- Name: ${name}
- Email: ${senderEmail}
- Mobile/WhatsApp: ${senderPhone || 'Not provided'}

Submitted via Velqora Interactive Workbench`;

            // Setup multi-channel dispatch links
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(body);

            // WhatsApp link to +91 8238337734
            const whatsappUrl = `https://wa.me/918238337734?text=${encodeURIComponent(
                `*New Xumi Reservation [${ticketId}]*\nName: ${name}\nEmail: ${senderEmail}\nPhone: ${senderPhone || 'N/A'}\nInterest: ${interest}\n\n*Note:* ${message}`
            )}`;

            // Web Gmail URL (opens directly in browser without desktop mail client requirement)
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodedSubject}&body=${encodedBody}`;

            // Mailto fallback
            const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;

            // Update Confirmation Card Details
            if (confRefId) confRefId.textContent = ticketId;
            if (confValName) confValName.textContent = name;
            if (confValEmail) confValEmail.textContent = senderEmail;

            if (btnConfWhatsapp) btnConfWhatsapp.href = whatsappUrl;
            if (btnConfGmail) btnConfGmail.href = gmailUrl;
            if (btnConfMailto) btnConfMailto.href = mailtoUrl;

            // Attempt cloud dispatch via FormSubmit endpoint with automatic client confirmation
            try {
                fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `New Xumi Pre-order Reservation (${ticketId}) from ${name}`,
                        name: name,
                        email: senderEmail,
                        phone: senderPhone || 'Not provided',
                        interest: interest,
                        ticket_id: ticketId,
                        message: message,
                        _replyto: senderEmail,
                        _autoresponse: `Thank you for reaching out to Velqora regarding Xumi! Your inquiry and reservation reference ticket is ${ticketId}. Our hardware engineering team has logged your note and will get back to you within 12 hours. For immediate contact, call or WhatsApp us at +91 8238337734.`
                    })
                }).catch(err => {
                    console.log('Background form dispatch notice:', err);
                });
            } catch (err) {
                console.log('Direct dispatch caught:', err);
            }

            // Immediately display Verified Confirmation Card
            setTimeout(() => {
                quickInquiryForm.style.display = 'none';
                if (inquiryConfCard) {
                    inquiryConfCard.style.display = 'block';
                    inquiryConfCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                showToast(`✓ Confirmation logged! Ticket: ${ticketId}`);

                if (btnSubmitInquiry) {
                    btnSubmitInquiry.disabled = false;
                    const submitTextEl = btnSubmitInquiry.querySelector('.submit-text');
                    if (submitTextEl) submitTextEl.textContent = 'Submit Inquiry & Reserve Spot';
                }
            }, 450);
        });
    }

    // Reset button to submit another inquiry note
    if (btnResetInquiry) {
        btnResetInquiry.addEventListener('click', () => {
            if (inquiryConfCard) inquiryConfCard.style.display = 'none';
            if (quickInquiryForm) {
                quickInquiryForm.reset();
                quickInquiryForm.style.display = 'flex';
                quickInquiryForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
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
