/**
 * ============================================================================
 * A PINK DREAM OF LOVE — FOR BABY JULIE 💗
 * Interactive Romantic Logic & Audio Synthesizer
 * ============================================================================
 */

(function () {
  "use strict";

  // --- Configuration & Accepted Passcodes ---
  // Primary passcode is 1005 (October 5 - the day Julie said YES to courting)
  // Also accepts 2709 as fallback
  const ACCEPTED_PASSCODES = ["1005", "2709"];
  let currentPin = "";
  let isSoundOn = true;
  let heartCounter = 0;
  let surpriseIndex = 0;
  let currentSecretIndex = -1;
  let isTyping = false;
  let typingTimer = null;

  // --- DOM Elements ---
  const passcodeWrapper = document.getElementById("passcodeWrapper");
  const passcodeModalOverlay = document.getElementById("passcodeModalOverlay");
  const wrongPasscodeModal = document.getElementById("wrongPasscodeModal");
  const correctPasscodeModal = document.getElementById("correctPasscodeModal");
  const pinCells = [
    document.getElementById("pinCell0"),
    document.getElementById("pinCell1"),
    document.getElementById("pinCell2"),
    document.getElementById("pinCell3"),
  ];
  const keypadButtons = document.querySelectorAll(".key-btn");
  const btnRetryPasscode = document.getElementById("btnRetryPasscode");
  const btnProceedPasscode = document.getElementById("btnProceedPasscode");
  const btnRelock = document.getElementById("btnRelock");

  // Main UI Elements
  const mainSiteWrapper = document.getElementById("mainSiteWrapper");
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const heartCounterDisplay = document.getElementById("heartCounterDisplay");
  const heartCounterChip = document.getElementById("heartCounterChip");
  const toastRack = document.getElementById("toastRack");
  const particlesLayer = document.getElementById("particlesLayer");
  const petalsContainer = document.getElementById("petalsContainer");

  // Timeline Beginning Section
  const btnReliveMoment = document.getElementById("btnReliveMoment");
  const answerBadge = document.getElementById("answerBadge");

  // Love Letter Elements
  const envelopeInteractive = document.getElementById("envelopeInteractive");
  const envelopeFlap = document.getElementById("envelopeFlap");
  const letterDialogOverlay = document.getElementById("letterDialogOverlay");
  const btnCloseLetter = document.getElementById("btnCloseLetter");
  const btnSealLove = document.getElementById("btnSealLove");

  // Reason Cards
  const reasonCards = document.querySelectorAll(".reason-card");

  // Surprise Elements
  const surpriseTriggerBtn = document.getElementById("surpriseTriggerBtn");
  const surpriseDialogOverlay = document.getElementById(
    "surpriseDialogOverlay",
  );
  const btnCloseSurprise = document.getElementById("btnCloseSurprise");
  const surpriseMeterFill = document.getElementById("surpriseMeterFill");
  const surpriseQuoteBox = document.getElementById("surpriseQuoteBox");
  const btnNextSurprise = document.getElementById("btnNextSurprise");

  // Secret Notes Elements
  const whisperBtn = document.getElementById("whisperBtn");
  const hiddenNoteDisplay = document.getElementById("hiddenNoteDisplay");
  const typewriterContent = document.getElementById("typewriterContent");
  const btnNextSecret = document.getElementById("btnNextSecret");
  const beatingHeartWidget = document.getElementById("beatingHeartWidget");

  // Music Player Elements
  const localMusicAudio = document.getElementById("localMusicAudio");
  const btnMusicPlay = document.getElementById("btnMusicPlay");
  const musicPlayIcon = document.getElementById("musicPlayIcon");
  const vinylDiscPlate = document.getElementById("vinylDiscPlate");
  const musicSeekBar = document.getElementById("musicSeekBar");
  const musicSeekProgress = document.getElementById("musicSeekProgress");
  const musicCurrentTime = document.getElementById("musicCurrentTime");
  const musicTotalTime = document.getElementById("musicTotalTime");
  const musicVolumeSlider = document.getElementById("musicVolumeSlider");
  const floatingNotesBox = document.getElementById("floatingNotesBox");

  // ==========================================================================
  // 1. WEB AUDIO API ROMANTIC SYNTHESIZER (ZERO EXTERNAL ASSETS)
  // ==========================================================================
  let audioContext = null;

  function getAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    }
    return audioContext;
  }

  function playSynthTone(frequency, duration, type = "sine", gainStart = 0.14) {
    if (!isSoundOn) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(gainStart, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (err) {
      // Audio might be waiting for user interaction
    }
  }

  // Melodic Keypad Clicks
  function playKeyClickSound(num) {
    const scale = [
      523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66,
      1318.51,
    ];
    const freq = scale[num % scale.length] || 600;
    playSynthTone(freq, 0.12, "triangle", 0.16);
  }

  // Romantic Harp Arpeggio on Success
  function playRomanticFanfare() {
    if (!isSoundOn) return;
    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    chords.forEach((note, i) => {
      setTimeout(() => {
        playSynthTone(note, 0.5, "sine", 0.2);
      }, i * 85);
    });
  }

  // Soft Error Wobble
  function playSoftErrorSound() {
    if (!isSoundOn) return;
    playSynthTone(320, 0.18, "sawtooth", 0.14);
    setTimeout(() => {
      playSynthTone(260, 0.32, "sine", 0.16);
    }, 140);
  }

  // Heart Pop Sound
  function playHeartPop() {
    playSynthTone(880, 0.08, "sine", 0.1);
  }

  // Toggle Sound State
  soundToggleBtn.addEventListener("click", () => {
    isSoundOn = !isSoundOn;
    soundToggleBtn.innerHTML = isSoundOn
      ? "<span>🔊</span> Sound ON"
      : "<span>🔇</span> Sound OFF";
    showToastNotification(isSoundOn ? "Sound enabled ♫" : "Sound muted 🤫");
  });

  // ==========================================================================
  // 2. PASSCODE HANDLING & VALIDATION
  // ==========================================================================

  function refreshPinDisplay() {
    for (let i = 0; i < 4; i++) {
      const cell = pinCells[i];
      if (i < currentPin.length) {
        cell.classList.add("filled");
        cell.innerHTML = "♥";
      } else {
        cell.classList.remove("filled");
        cell.innerHTML = '<span class="pin-placeholder">♡</span>';
      }
    }
  }

  function handleInputDigit(digit) {
    getAudioContext();
    if (digit === "DEL" || digit === "Backspace") {
      if (currentPin.length > 0) {
        currentPin = currentPin.slice(0, -1);
        playSynthTone(440, 0.08, "sine", 0.12);
        refreshPinDisplay();
      }
    } else if (/^[0-9]$/.test(digit)) {
      if (currentPin.length < 4) {
        const val = parseInt(digit, 10);
        playKeyClickSound(val);
        currentPin += digit;
        refreshPinDisplay();

        if (currentPin.length === 4) {
          setTimeout(checkPasscode, 220);
        }
      }
    }
  }

  function checkPasscode() {
    if (ACCEPTED_PASSCODES.includes(currentPin)) {
      // SUCCESS: Correct passcode
      playRomanticFanfare();
      openPasscodeModal(correctPasscodeModal);
      burstCelebrationHearts();
      showToastNotification("Secret Unlocked! ♡");
    } else {
      // ERROR: Wrong passcode
      playSoftErrorSound();
      pinCells.forEach((cell) => cell.classList.add("pin-shake"));
      setTimeout(() => {
        pinCells.forEach((cell) => cell.classList.remove("pin-shake"));
      }, 500);

      setTimeout(() => {
        openPasscodeModal(wrongPasscodeModal);
      }, 300);
    }
  }

  function openPasscodeModal(modalEl) {
    passcodeModalOverlay.classList.add("active");
    modalEl.style.display = "block";
  }

  function closePasscodeModals() {
    passcodeModalOverlay.classList.remove("active");
    wrongPasscodeModal.style.display = "none";
    correctPasscodeModal.style.display = "none";
  }

  // Keypad Click Events
  keypadButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const keyVal = btn.getAttribute("data-key");
      if (keyVal === ".") {
        playHeartPop();
        spawnHeartNearElement(btn);
        return;
      }
      handleInputDigit(keyVal);
    });
  });

  // Physical Keyboard Support
  window.addEventListener("keydown", (e) => {
    if (!passcodeWrapper.classList.contains("hidden")) {
      if (e.key >= "0" && e.key <= "9") {
        handleInputDigit(e.key);
      } else if (e.key === "Backspace") {
        handleInputDigit("DEL");
      } else if (e.key === "Enter") {
        if (currentPin.length === 4) {
          checkPasscode();
        }
      }
    }
  });

  // Retry Button
  btnRetryPasscode.addEventListener("click", () => {
    playSynthTone(520, 0.12, "sine", 0.15);
    closePasscodeModals();
    currentPin = "";
    refreshPinDisplay();
  });

  // Proceed Button (Transitions into the main website)
  btnProceedPasscode.addEventListener("click", () => {
    playRomanticFanfare();
    closePasscodeModals();
    passcodeWrapper.classList.add("hidden");
    mainSiteWrapper.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToastNotification("Welcome to your world, Baby Julie! 💗");

    // Attempt gentle start of background music
    startMusicPlayback();
  });

  // Re-lock website button
  btnRelock.addEventListener("click", () => {
    currentPin = "";
    refreshPinDisplay();
    passcodeWrapper.classList.remove("hidden");
    showToastNotification("World locked with love 🔒");
  });

  // ==========================================================================
  // 3. SECTION: OUR BEGINNING (RELIVE THAT MOMENT)
  // ==========================================================================

  if (btnReliveMoment) {
    btnReliveMoment.addEventListener("click", () => {
      playRomanticFanfare();
      burstCelebrationHearts();
      if (answerBadge) {
        answerBadge.style.animation = "none";
        void answerBadge.offsetWidth;
        answerBadge.style.animation =
          "answerGlow 1.5s ease-in-out infinite alternate";
      }
      showToastNotification("The sweetest YES of my life ♡");
    });
  }

  // ==========================================================================
  // 4. SECTION: INTERACTIVE LOVE LETTER 💌
  // ==========================================================================

  function openEnvelopeLetter() {
    playSynthTone(660, 0.25, "sine", 0.18);
    setTimeout(playRomanticFanfare, 100);

    if (envelopeFlap) {
      envelopeFlap.style.transform = "rotateX(180deg)";
    }

    setTimeout(() => {
      letterDialogOverlay.classList.add("active");
      burstCelebrationHearts();
      showToastNotification("Reading your love letter... ♡");
    }, 450);
  }

  function closeEnvelopeLetter() {
    playSynthTone(580, 0.15, "sine", 0.15);
    letterDialogOverlay.classList.remove("active");
    if (envelopeFlap) {
      setTimeout(() => {
        envelopeFlap.style.transform = "rotateX(0deg)";
      }, 250);
    }
    showToastNotification("Sealed with endless love 💌");
  }

  if (envelopeInteractive) {
    envelopeInteractive.addEventListener("click", openEnvelopeLetter);
  }
  if (btnCloseLetter) {
    btnCloseLetter.addEventListener("click", closeEnvelopeLetter);
  }
  if (btnSealLove) {
    btnSealLove.addEventListener("click", closeEnvelopeLetter);
  }

  // ==========================================================================
  // 5. SECTION: LITTLE THINGS I LOVE ABOUT YOU (FLIP CARDS)
  // ==========================================================================

  reasonCards.forEach((card) => {
    card.addEventListener("click", () => {
      playHeartPop();
      card.classList.toggle("is-flipped");
      spawnHeartNearElement(card, 2);
    });
  });

  // ==========================================================================
  // 6. SECTION: A SURPRISE FOR MY BABY 🎁
  // ==========================================================================

  const SURPRISE_SEQUENCE = [
    "Baby Julie, you make ordinary days feel special.",
    "Your happiness matters to me more than you know.",
    "I thank God for allowing our paths to cross.",
    "I want to be someone who makes you feel safe, respected, and appreciated.",
    "I hope we create many more beautiful memories together.",
    "When I asked to court you and you said YES, you gave me a memory I will always treasure.",
    "If I could return to that moment, I would still ask you, because I would still want the chance to know and love you.",
  ];

  function openSurpriseModal() {
    playRomanticFanfare();
    surpriseIndex = 0;
    renderSurpriseStep();
    surpriseDialogOverlay.classList.add("active");
    burstCelebrationHearts();
  }

  function renderSurpriseStep() {
    const total = SURPRISE_SEQUENCE.length;
    const pct = ((surpriseIndex + 1) / total) * 100;

    if (surpriseMeterFill) {
      surpriseMeterFill.style.width = `${pct}%`;
    }

    if (surpriseIndex < total) {
      surpriseQuoteBox.innerHTML = `<p>${SURPRISE_SEQUENCE[surpriseIndex]}</p>`;
      btnNextSurprise.innerHTML =
        surpriseIndex === total - 1 ? "Final Message 💖" : "One More Message ♡";
    } else {
      // Grand Final Step
      playRomanticFanfare();
      surpriseQuoteBox.innerHTML = `
        <div class="celebration-grand-title">
          ♡ Thank You for Saying YES to Me, Baby Julie. ♡
        </div>
      `;
      btnNextSurprise.innerHTML = "Close with All My Love 💗";
      burstCelebrationHearts();
      showToastNotification("Forever grateful for you, Baby Julie ♡");
    }
  }

  function advanceSurpriseStep() {
    if (surpriseIndex < SURPRISE_SEQUENCE.length) {
      playHeartPop();
      surpriseIndex++;
      renderSurpriseStep();
      spawnHeartNearElement(btnNextSurprise);
    } else {
      playSynthTone(500, 0.15, "sine", 0.12);
      surpriseDialogOverlay.classList.remove("active");
    }
  }

  if (surpriseTriggerBtn) {
    surpriseTriggerBtn.addEventListener("click", openSurpriseModal);
  }
  if (btnCloseSurprise) {
    btnCloseSurprise.addEventListener("click", () => {
      surpriseDialogOverlay.classList.remove("active");
    });
  }
  if (btnNextSurprise) {
    btnNextSurprise.addEventListener("click", advanceSurpriseStep);
  }

  // ==========================================================================
  // 7. SECTION: HIDDEN MESSAGES FROM MY HEART 💝
  // ==========================================================================

  const SECRET_WHISPERS = [
    "My baby, even on the busiest days, I hope you know that someone is thinking of you and wishing you happiness. ♡",
    "I hope I can keep giving you little reasons to smile, every single day.",
    "You never have to be perfect to be precious to me. I love the real you.",
    "Thank you for giving me the chance to court you. I want to make that chance meaningful.",
    "I pray that God continues to guide us as we learn more about each other.",
    "Loving you is the easiest, sweetest choice my heart makes every morning.",
  ];

  function showSecretWhisper() {
    if (isTyping) return;
    playHeartPop();

    let next = Math.floor(Math.random() * SECRET_WHISPERS.length);
    while (next === currentSecretIndex && SECRET_WHISPERS.length > 1) {
      next = Math.floor(Math.random() * SECRET_WHISPERS.length);
    }
    currentSecretIndex = next;

    hiddenNoteDisplay.classList.add("active");
    runTypewriter(SECRET_WHISPERS[currentSecretIndex]);
    spawnHeartNearElement(whisperBtn);
  }

  function runTypewriter(text) {
    if (!typewriterContent) return;
    clearTimeout(typingTimer);
    isTyping = true;
    typewriterContent.textContent = "";
    let i = 0;

    function typeNext() {
      if (i < text.length) {
        typewriterContent.textContent += text.charAt(i);
        i++;
        typingTimer = setTimeout(typeNext, 22);
      } else {
        isTyping = false;
      }
    }
    typeNext();
  }

  if (whisperBtn) {
    whisperBtn.addEventListener("click", showSecretWhisper);
  }
  if (btnNextSecret) {
    btnNextSecret.addEventListener("click", showSecretWhisper);
  }

  // Interactive Beating Heart
  if (beatingHeartWidget) {
    beatingHeartWidget.addEventListener("click", () => {
      playHeartPop();
      spawnHeartNearElement(beatingHeartWidget, 3);
      incrementHeartCounter();
      showToastNotification("My heart beats for you, Julie ♡");
    });
  }

  // ==========================================================================
  // 8. SECTION: ROMANTIC MUSIC PLAYER (VINTAGE-MODERN PINK MUSIC BOX)
  // ==========================================================================

  let isAudioPlaying = false;

  function toggleMusicPlayback() {
    if (!localMusicAudio) return;
    getAudioContext();

    if (isAudioPlaying) {
      pauseMusicPlayback();
    } else {
      startMusicPlayback();
    }
  }

  function startMusicPlayback() {
    if (!localMusicAudio) return;
    const promise = localMusicAudio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          isAudioPlaying = true;
          syncMusicUI();
          showToastNotification("Playing our love song ♫");
        })
        .catch(() => {
          // Handled gracefully if browser blocks before user gesture
          isAudioPlaying = false;
          syncMusicUI();
        });
    }
  }

  function pauseMusicPlayback() {
    if (!localMusicAudio) return;
    localMusicAudio.pause();
    isAudioPlaying = false;
    syncMusicUI();
  }

  function syncMusicUI() {
    if (musicPlayIcon) {
      musicPlayIcon.textContent = isAudioPlaying ? "⏸" : "▶";
    }
    if (vinylDiscPlate) {
      vinylDiscPlate.classList.toggle("spinning", isAudioPlaying);
    }
    if (floatingNotesBox) {
      floatingNotesBox.style.display = isAudioPlaying ? "block" : "none";
    }
  }

  function formatAudioDuration(secs) {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  if (localMusicAudio) {
    localMusicAudio.addEventListener("timeupdate", () => {
      if (localMusicAudio.duration) {
        const ratio =
          (localMusicAudio.currentTime / localMusicAudio.duration) * 100;
        if (musicSeekProgress) musicSeekProgress.style.width = `${ratio}%`;
        if (musicCurrentTime)
          musicCurrentTime.textContent = formatAudioDuration(
            localMusicAudio.currentTime,
          );
        if (musicTotalTime)
          musicTotalTime.textContent = formatAudioDuration(
            localMusicAudio.duration,
          );
      }
    });

    localMusicAudio.addEventListener("loadedmetadata", () => {
      if (musicTotalTime)
        musicTotalTime.textContent = formatAudioDuration(
          localMusicAudio.duration,
        );
    });

    localMusicAudio.addEventListener("ended", () => {
      isAudioPlaying = false;
      syncMusicUI();
    });
  }

  if (btnMusicPlay) {
    btnMusicPlay.addEventListener("click", toggleMusicPlayback);
  }

  if (musicSeekBar) {
    musicSeekBar.addEventListener("click", (e) => {
      if (!localMusicAudio || !localMusicAudio.duration) return;
      const rect = musicSeekBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      localMusicAudio.currentTime = pos * localMusicAudio.duration;
    });
  }

  if (musicVolumeSlider && localMusicAudio) {
    musicVolumeSlider.addEventListener("input", (e) => {
      localMusicAudio.volume = parseFloat(e.target.value);
    });
  }

  // ==========================================================================
  // 9. SPECIAL BACKGROUND EFFECTS: ROSE PETALS & CLICK PARTICLES
  // ==========================================================================

  // Spawn Falling Rose Petals
  function initFallingPetals() {
    if (!petalsContainer) return;
    const PETAL_COUNT = 15;
    for (let i = 0; i < PETAL_COUNT; i++) {
      createPetal();
    }
  }

  function createPetal() {
    if (!petalsContainer) return;
    const petal = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    petal.setAttribute("class", "rose-petal");
    petal.setAttribute("viewBox", "0 0 30 30");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M 15,2 C 8,6 2,14 4,20 C 6,26 15,28 20,24 C 26,19 25,8 15,2 Z",
    );
    petal.appendChild(path);

    const size = 18 + Math.random() * 16;
    const startX = Math.random() * 100;
    const duration = 12 + Math.random() * 14;
    const delay = Math.random() * 15;

    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${startX}%`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `-${delay}s`;

    petalsContainer.appendChild(petal);
  }

  // Increment Global Heart Counter
  function incrementHeartCounter() {
    heartCounter++;
    if (heartCounterDisplay) {
      heartCounterDisplay.textContent = heartCounter;
    }
  }

  if (heartCounterChip) {
    heartCounterChip.addEventListener("click", (e) => {
      playHeartPop();
      incrementHeartCounter();
      spawnHeartSparkleAt(e.clientX, e.clientY);
      showToastNotification(`Sent ${heartCounter} hearts to Julie! 💖`);
    });
  }

  // Click Anywhere Background Particle Generator
  document.addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.closest(".key-btn")) return;
    playSynthTone(950, 0.04, "sine", 0.05);
    incrementHeartCounter();
    spawnHeartSparkleAt(e.clientX, e.clientY);
  });

  function spawnHeartSparkleAt(x, y) {
    if (!particlesLayer) return;
    const el = document.createElement("div");
    el.className = "click-heart-sparkle";
    const icons = ["♡", "♥", "💗", "💖", "💕", "🌷", "✨"];
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    particlesLayer.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 1500);
  }

  function spawnHeartNearElement(targetEl, qty = 1) {
    if (!targetEl) return;
    const bounds = targetEl.getBoundingClientRect();
    for (let i = 0; i < qty; i++) {
      const offX = (Math.random() - 0.5) * bounds.width * 0.7;
      const offY = (Math.random() - 0.5) * bounds.height * 0.7;
      spawnHeartSparkleAt(
        bounds.left + bounds.width / 2 + offX,
        bounds.top + bounds.height / 2 + offY,
      );
    }
  }

  function burstCelebrationHearts() {
    const count = 18;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const randX = Math.random() * window.innerWidth;
        const randY =
          window.innerHeight * 0.35 +
          Math.random() * (window.innerHeight * 0.4);
        spawnHeartSparkleAt(randX, randY);
      }, i * 70);
    }
  }

  // Toast System
  function showToastNotification(msg) {
    if (!toastRack) return;
    const toast = document.createElement("div");
    toast.className = "toast-bubble";
    toast.textContent = msg;
    toastRack.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3100);
  }

  // Initialize petals
  initFallingPetals();
})();
