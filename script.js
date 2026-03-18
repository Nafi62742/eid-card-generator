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
  }
}

function updateCardPreview() {
  const card = document.getElementById("card");
  if (!uploadedImage) return;

  // Update card aspect ratio to match the image
  card.style.aspectRatio = imageAspectRatio;

  const sender = document.getElementById("sender").value || "Your Name";
  const receiver = document.getElementById("receiver").value || "Recipient";
  const message = document.getElementById("message").value || "Wishing you a blessed Eid filled with joy and prosperity.";
  const fontChoice = document.getElementById("fontChoice")?.value || "serif";

  // Map choices to actual font family names
  const fontMap = {
    'serif': "'Playfair Display', serif",
    'script': "'Great Vibes', cursive",
    'classic': "'Cormorant Garamond', serif",
    'elegant': "'Cinzel', serif",
    'whimsical': "'Dancing Script', cursive",
    'sans': "'Poppins', sans-serif"
  };
  const activeFont = fontMap[fontChoice] || fontMap['serif'];

  card.innerHTML = `
    <!-- Ambient Blurred Background -->
    <img src="${uploadedImage}" class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 select-none pointer-events-none" />
    
    <!-- Centered Main Image -->
    <div class="absolute inset-0 flex items-center justify-center p-8 z-10">
      <img src="${uploadedImage}" class="max-w-full max-h-full rounded-xl shadow-2xl border border-white/10 shrink-0" />
    </div>
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-20"></div>
    
    <!-- Content Overlay -->
    <div class="absolute inset-0 z-30 flex flex-col justify-end p-8 md:p-12 text-left" style="font-family: ${activeFont};">
      <h2 class="text-3xl md:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-100 mb-2 drop-shadow-2xl">
        Eid Mubarak 🌙
      </h2>
      <p id="cardMessage" class="text-slate-100 text-sm md:text-xl lg:text-2xl font-light max-w-2xl leading-relaxed drop-shadow-lg">
        Dear ${receiver}, <br class="hidden md:block"/> ${message}
      </p>
      <div class="h-1 w-24 bg-gold-500/70 my-4 rounded-full"></div>
      <p id="cardFrom" class="text-gold-300 font-semibold tracking-[0.2em] uppercase text-xs md:text-sm lg:text-base drop-shadow-lg" style="font-family: 'Poppins', sans-serif;">
        With Love, ${sender}
      </p>
    </div>
  `;
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
  const downloadBtn = event.currentTarget;
  const originalText = downloadBtn.innerText;
  
  downloadBtn.innerText = "Generating...";
  downloadBtn.disabled = true;

  // Temporary modifications to make html2canvas more stable
  const ambientLayer = card.querySelector('img[class*="blur"]');
  const goldHead = card.querySelector('h2');
  
  // Store original styles to restore them later
  const originalAmbientOpacity = ambientLayer ? ambientLayer.style.opacity : "0.4";
  const originalHeadingStyle = goldHead ? goldHead.style.cssText : "";

  if (ambientLayer) ambientLayer.style.opacity = "0"; // Hide blur layer to avoid rendering issues
  if (goldHead) {
    // Replace gradient with solid gold for capture stability
    goldHead.style.background = "none";
    goldHead.style.webkitTextFillColor = "#D4AF37";
    goldHead.style.color = "#D4AF37";
  }

  setTimeout(() => {
    html2canvas(card, {
      scale: 1.5, // Reduced scale for better stability
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#0a0a0a",
      logging: true, // Enable logging for debugging if needed
    }).then(canvas => {
      const link = document.createElement("a");
      link.download = `Eid-Mubarak-Card-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 0.9);
      link.click();
    }).catch(err => {
      console.error("Capture Error:", err);
      alert("Something went wrong while drawing the card. Try again or use a smaller photo.");
    }).finally(() => {
      // Restore styles for the user's view
      if (ambientLayer) ambientLayer.style.opacity = originalAmbientOpacity;
      if (goldHead) goldHead.style.cssText = originalHeadingStyle;
      downloadBtn.innerText = originalText;
      downloadBtn.disabled = false;
    });
  }, 150);
}