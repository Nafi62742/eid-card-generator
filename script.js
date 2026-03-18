let uploadedImage = null;
let imageAspectRatio = 16 / 9; // Default

document.getElementById("imageUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      imageAspectRatio = img.width / img.height;
      uploadedImage = event.target.result;
      updateCardPreview();
    };
    img.src = event.target.result;
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
  
  if (showQR) {
    qrInputContainer.classList.remove("hidden");
  } else {
    qrInputContainer.classList.add("hidden");
  }

  if (!uploadedImage) return;

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
  card.className = "relative w-full max-w-[800px] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(245,176,2,0.15)] bg-luxury flex flex-col border border-white/5";

  card.innerHTML = `
    <!-- Top Image Container -->
    <div class="relative w-full bg-[#0a0a0a] overflow-hidden" id="cardImageContainer">
      <img src="${uploadedImage}" class="w-full h-auto block" />
      
      <!-- Optional QR Code (Top Right) -->
      ${showQR ? `
        <div class="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-xl z-50">
          <div id="qrcode"></div>
        </div>
      ` : ''}
    </div>
    
    <!-- Bottom Text Content -->
    <div class="p-8 md:p-10 bg-luxury border-t border-white/5" style="font-family: ${activeFont};">
      <h2 class="text-3xl md:text-5xl font-bold gold-text mb-4">
        Eid Mubarak 🌙
      </h2>
      <div id="cardMessage" class="text-slate-100 text-sm md:text-lg lg:text-xl font-light leading-relaxed mb-6">
        <span class="text-gold-400 font-semibold block mb-2">Dear ${receiver},</span>
        ${message.replace(/\n/g, '<br>')}
      </div>
      <div class="h-[1px] w-full bg-gradient-to-r from-gold-500/50 to-transparent mb-6"></div>
      <p id="cardFrom" class="text-gold-300 font-semibold tracking-[0.2em] uppercase text-xs md:text-sm" style="font-family: 'Poppins', sans-serif;">
        With Love, ${sender}
      </p>
    </div>
  `;

  // Generate QR Code if enabled
  if (showQR) {
    new QRCode(document.getElementById("qrcode"), {
      text: qrFinalContent,
      width: 80,
      height: 80,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }
}

function generateCard() {
  if (!uploadedImage) {
    alert("Please upload a photo first ✨");
    return;
  }
  updateCardPreview();
}

function downloadCard(event) {
  if (typeof html2canvas === "undefined") {
    alert("Still loading resources... please wait a second and try again! ✨");
    return;
  }

  if (!uploadedImage) {
    alert("Please upload a photo and generate your card first! ✨");
    return;
  }

  const card = document.getElementById("card");
  const downloadBtn = document.getElementById("downloadBtn");
  const originalText = downloadBtn.innerText;
  
  downloadBtn.innerText = "Generating...";
  downloadBtn.disabled = true;

  // Temporary modifications to make html2canvas more stable
  const goldHead = card.querySelector('h2');
  const originalHeadingStyle = goldHead ? goldHead.style.cssText : "";

  if (goldHead) {
    // Replace gradient with solid gold for capture stability
    goldHead.style.background = "none";
    goldHead.style.webkitTextFillColor = "#D4AF37";
    goldHead.style.color = "#D4AF37";
    goldHead.style.backgroundClip = "none";
  }

  // Use a slight delay to ensure everything is rendered
  setTimeout(() => {
    // Dynamic scale for stability (lower on mobile to prevent crashes)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const captureScale = isMobile ? 1.5 : 2;

    html2canvas(card, {
      scale: captureScale, 
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#0a0a0a",
      logging: false,
    }).then(async canvas => {
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      
      // Mobile Share or Save check
      if (isMobile && navigator.share) {
        try {
          // Convert to blob more reliably for sharing
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          const file = new File([blob], `Eid-Mubarak-Card.png`, { type: 'image/png' });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Eid Mubarak Card',
              text: 'Generated with Luxury Eid Card Generator'
            });
            return; // Exit if share was successful
          }
        } catch (err) {
          console.error("Share error:", err);
          // Continue to fallback if share fails
        }
      }

      // Default Download for Web/PC or fallback for mobile
      const link = document.createElement("a");
      link.download = `Eid-Mubarak-Card-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
      // If none of above worked well for mobile (e.g. Safari), 
      // maybe open in new tab as fallback
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
  }, 300);
}