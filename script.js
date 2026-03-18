let uploadedImage = null;
let uploadedSticker = null;
let imageAspectRatio = 16 / 9; // Default

// Main Photo Upload
document.getElementById("imageUpload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      imageAspectRatio = img.width / img.height;
      uploadedImage = event.target.result;
      updateCardPreview();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Sticker Upload
document.getElementById("stickerUpload")?.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    uploadedSticker = event.target.result;
    updateCardPreview();
  };
  reader.readAsDataURL(file);
});

function applyPreset() {
  const preset = document.getElementById("preset").value;
  if (preset) {
    document.getElementById("message").value = preset;
    updateCardPreview();
  }
}

function updateCardPreview() {
  const card = document.getElementById("card");
  const showQR = document.getElementById("showQR").checked;
  const qrInputContainer = document.getElementById("qrInputContainer");
  const cardColor = document.getElementById("cardColor")?.value || "#0a0a0a";
  const textColor = document.getElementById("textColor")?.value || "#f8fafc";

  if (showQR) {
    qrInputContainer.classList.remove("hidden");
  } else {
    qrInputContainer.classList.add("hidden");
  }

  const phone = document.getElementById("phone").value;
  const qrData = document.getElementById("qrData").value;

  // Decide what data goes into the QR
  let qrFinalContent = window.location.href; // Fallback
  if (phone) {
    qrFinalContent = `tel:${phone}`;
  } else if (qrData) {
    qrFinalContent = qrData;
  }

  const sender = document.getElementById("sender").value || "Your Name";
  const receiver = document.getElementById("receiver").value || "Recipient";
  const message = document.getElementById("message").value || "Wishing you a blessed Eid filled with joy and prosperity.";
  const fontChoice = document.getElementById("fontChoice")?.value || "serif";

  const fontMap = {
    'serif': "'Playfair Display', serif",
    'script': "'Great Vibes', cursive",
    'classic': "'Cormorant Garamond', serif",
    'elegant': "'Cinzel', serif",
    'whimsical': "'Dancing Script', cursive",
    'sans': "'Poppins', sans-serif"
  };
  const activeFont = fontMap[fontChoice] || fontMap['serif'];

  // Update card inner structure
  card.style.aspectRatio = "auto";
  card.style.backgroundColor = cardColor;
  card.style.color = textColor;

  if (uploadedImage) {
    card.className = "relative w-full max-w-[800px] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(245,176,2,0.15)] flex flex-col border border-white/5";
    card.innerHTML = `
      <!-- Top Image Container -->
      <div class="relative w-full bg-black/20 overflow-hidden" id="cardImageContainer">
        <img src="${uploadedImage}" class="w-full h-auto block" />
        
        <!-- Optional QR Code (Top Right) -->
        ${showQR ? `
          <div class="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-xl z-50">
            <div id="qrcode"></div>
          </div>
        ` : ''}
      </div>
      
      <!-- Bottom Text Content Area -->
      <div class="p-8 md:p-10 border-t border-white/5 relative flex gap-8 items-center" style="font-family: ${activeFont};">
        ${uploadedSticker ? `
          <div class="hidden md:block w-32 shrink-0">
            <img src="${uploadedSticker}" class="w-full h-auto drop-shadow-2xl" style="filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5));" />
          </div>
        ` : ''}
        
        <div class="flex-1">
          <h2 class="text-3xl md:text-5xl font-bold gold-text mb-4 pt-4 md:pt-6">
            Eid Mubarak 🌙
          </h2>
          <div id="cardMessage" class="text-sm md:text-lg lg:text-xl font-light leading-relaxed mb-6" style="color: ${textColor};">
            <span class="text-gold-400 font-semibold block mb-2">Dear ${receiver},</span>
            ${message.replace(/\n/g, '<br>')}
          </div>
          <div class="h-[1px] w-full bg-gradient-to-r from-gold-500/50 to-transparent mb-6"></div>
          <p id="cardFrom" class="font-semibold tracking-[0.2em] uppercase text-xs md:text-sm" style="color: ${textColor};">
            With Love, ${sender}
          </p>
        </div>
      </div>
    `;
  } else {
    // Normal Eid Card (No Image)
    card.className = "relative w-full max-w-[800px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(245,176,2,0.15)] flex items-center justify-center border border-white/5 p-8 md:p-12 text-center";
    card.innerHTML = `
      <!-- Decorative background elements -->
      <div class="absolute inset-0 opacity-20 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-500/30 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-600/30 rounded-full blur-[120px]"></div>
      </div>
      
      <!-- Ornamental Border -->
      <div class="absolute inset-4 border border-gold-500/20 rounded-xl pointer-events-none"></div>
      <div class="absolute inset-6 border border-gold-500/10 rounded-lg pointer-events-none"></div>

      <div class="relative z-10 w-full flex flex-col md:flex-row items-center gap-8 md:gap-12" style="font-family: ${activeFont};">
        
        ${uploadedSticker ? `
          <div class="w-32 md:w-48 shrink-0">
            <img src="${uploadedSticker}" class="w-full h-auto drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]" />
          </div>
        ` : ''}

        <div class="flex-1 text-center md:text-left">
          <!-- Optional QR Code (Absolute positioned relative to container) -->
          ${showQR ? `
            <div class="absolute -top-4 -right-4 p-2 bg-white rounded-lg shadow-xl z-50">
              <div id="qrcode"></div>
            </div>
          ` : ''}

          <div class="mb-8 pt-4 md:pt-8">
            <span class="text-5xl md:text-7xl block mb-2 opacity-80">🌙</span>
            <h2 class="text-4xl md:text-6xl font-bold gold-text">
              Eid Mubarak
            </h2>
          </div>
          
          <div id="cardMessage" class="text-lg md:text-2xl font-light leading-relaxed mb-10" style="color: ${textColor};">
            <span class="text-gold-400 font-semibold block mb-2">Dear ${receiver},</span>
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <div class="flex items-center justify-center md:justify-start gap-4 mb-8">
            <div class="h-[1px] w-12 bg-gold-500/30"></div>
            <span class="text-gold-500 text-xl md:text-2xl">✨</span>
            <div class="h-[1px] w-12 bg-gold-500/30"></div>
          </div>
          
          <p id="cardFrom" class="font-semibold tracking-[0.3em] uppercase text-sm md:text-base" style="color: ${textColor};">
            With Love, ${sender}
          </p>
        </div>
      </div>
    `;
  }

  // Generate QR Code if enabled
  if (showQR) {
    setTimeout(() => {
      const qrElement = document.getElementById("qrcode");
      if (qrElement) {
        qrElement.innerHTML = "";
        new QRCode(qrElement, {
          text: qrFinalContent,
          width: 80,
          height: 80,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    }, 0);
  }
}

function generateCard() {
  updateCardPreview();
}

function downloadCard(event) {
  if (typeof html2canvas === "undefined") {
    alert("Still loading resources... please wait a second and try again! ✨");
    return;
  }

  const card = document.getElementById("card");
  // Check if it's the default placeholder
  if (card.querySelector('.text-center.p-8')) {
    alert("Please generate your card first! ✨");
    return;
  }

  const downloadBtn = document.getElementById("downloadBtn");
  const originalText = downloadBtn.innerText;

  downloadBtn.innerText = "Generating...";
  downloadBtn.disabled = true;

  // Final touches for capture
  const goldHead = card.querySelector('h2');
  const originalHeadingStyle = goldHead ? goldHead.style.cssText : "";

  if (goldHead) {
    goldHead.style.background = "none";
    goldHead.style.webkitTextFillColor = "#D4AF37";
    goldHead.style.color = "#D4AF37";
    goldHead.style.backgroundClip = "none";
  }

  setTimeout(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const captureScale = isMobile ? 1.5 : 2.5; // Slightly higher scale for better quality

    html2canvas(card, {
      scale: captureScale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: card.style.backgroundColor || "#0a0a0a",
      logging: false,
    }).then(async canvas => {
      const dataUrl = canvas.toDataURL("image/png", 1.0);

      if (isMobile && navigator.share) {
        try {
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          const file = new File([blob], `Eid-Mubarak-Card.png`, { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Eid Mubarak Card',
              text: 'Generated with Luxury Eid Card Generator'
            });
            return;
          }
        } catch (err) {
          console.error("Share error:", err);
        }
      }

      const link = document.createElement("a");
      link.download = `Eid-Mubarak-Card-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const newWindow = window.open();
        newWindow.document.write('<p>Long press the image below to save it to your photos ✨</p>');
        newWindow.document.write(`<img src="${dataUrl}" style="max-width: 100%; height: auto;"/>`);
        newWindow.document.close();
      }

    }).catch(err => {
      console.error("Capture Error:", err);
      alert("Something went wrong while drawing the card.");
    }).finally(() => {
      if (goldHead) goldHead.style.cssText = originalHeadingStyle;
      downloadBtn.innerText = originalText;
      downloadBtn.disabled = false;
    });
  }, 400); // Slightly longer delay for high-quality rendering
}