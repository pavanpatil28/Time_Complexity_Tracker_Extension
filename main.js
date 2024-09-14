function loadFonts() {
  const fontLink1 = document.createElement("link");
  fontLink1.rel = "preconnect";
  fontLink1.href = "https://fonts.googleapis.com";
  const fontLink2 = document.createElement("link");
  fontLink2.rel = "preconnect";
  fontLink2.href = "https://fonts.gstatic.com";
  fontLink2.crossOrigin = "anonymous";
  const fontLink3 = document.createElement("link");
  fontLink3.rel = "stylesheet";
  fontLink3.href =
    "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";

  document.head.appendChild(fontLink1);
  document.head.appendChild(fontLink2);
  document.head.appendChild(fontLink3);
}

loadFonts();

// Function to create the button element
function createLogButton() {
  const button = document.createElement("button");
  button.innerText = "Analyze";
  button.style.position = "absolute";
  button.style.zIndex = 1000;
  button.style.padding = "5px 10px";
  button.style.fontSize = "14px";
  button.style.borderRadius = "5px";
  button.style.backgroundColor = "#007bff";
  button.style.color = "white";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  button.style.display = "none"; // Hidden by default
  document.body.appendChild(button);
  return button;
}

// Function to create a modal element
function createModal() {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.zIndex = 1000;
  modal.style.padding = "20px";
  modal.style.borderRadius = "10px";
  modal.style.backgroundColor = "white";
  modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  modal.style.display = "none"; // Hidden by default
  modal.style.width = "600px"; // Adjust width as needed
  modal.style.textAlign = "center";
  modal.style.color = "black"; // Set text color to black

  document.body.appendChild(modal);
  return modal;
}

// Function to create a loader element
function createLoader() {
  const loader = document.createElement("div");
  loader.style.position = "fixed";
  loader.style.top = "50%";
  loader.style.left = "50%";
  loader.style.transform = "translate(-50%, -50%)";
  loader.style.zIndex = 1001;
  loader.style.border = "7px solid #f3f3f3";
  loader.style.borderTop = "7px solid #007bff";
  loader.style.borderRadius = "50%";
  loader.style.width = "50px";
  loader.style.height = "50px";
  loader.style.animation = "spin 2s linear infinite";
  loader.style.display = "none"; // Hidden by default

  // Adding keyframes for spin animation
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(loader);
  return loader;
}

// Function to create an overlay element
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = 999;
  overlay.style.display = "none"; // Hidden by default

  document.body.appendChild(overlay);
  return overlay;
}

// Create the button
const logButton = createLogButton();

// Create the modal
const modal = createModal();

// Create the loader and overlay
const loader = createLoader();
const overlay = createOverlay();

// Store mouse position
let mouseX = 0;
let mouseY = 0;

// Update mouse position on movement
document.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// Function to handle selection changes
function handleSelectionChange() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Check if selection is within the LeetCode code editor
    const codeEditor = document.querySelector(".monaco-editor, .ace_editor"); // Adjust selector as necessary
    if (codeEditor && codeEditor.contains(range.commonAncestorContainer)) {
      // Position the button near the cursor position
      logButton.style.left = `${mouseX + window.scrollX + 10}px`;
      logButton.style.top = `${mouseY + window.scrollY + 10}px`;
    } else {
      // Position the button beside the selected text
      logButton.style.left = `${rect.right + window.scrollX + 10}px`;
      logButton.style.top = `${rect.top + window.scrollY}px`;
    }

    logButton.style.display = "block";
  } else {
    logButton.style.display = "none"; // Hide button if no text is selected
  }
}

// Event listener for selection changes
document.addEventListener("selectionchange", handleSelectionChange);

// Event listener for button click
logButton.addEventListener("click", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    // Show the loader and overlay
    loader.style.display = "block";
    overlay.style.display = "block";
    // https://analyzr-backend.vercel.app

    fetch("https://analyzr-backend.vercel.app/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: selectedText }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        showModal(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        loader.style.display = "none";
        overlay.style.display = "none";
      });
  }
  logButton.style.display = "none";
});

document.addEventListener("mousedown", (event) => {
  if (!logButton.contains(event.target)) {
    logButton.style.display = "none";
  }
});

function showModal(complexityData) {
  modal.innerHTML = `
    <h2 style="color: black; font-weight:600; font-size: 20px; font-family: Poppins";>Complexity Analysis</h2>
    <div style="display: flex; justify-content: space-between; padding: 10px; font-family: Poppins; padding-left: 30px; padding-right: 30px;">
      <div style="flex: 1; margin-right: 20px; text-align: center; margin-top: 30px;">
        <span style="font-family: Poppins"><strong>Time Complexity:</strong></span>
        <span style="font-family: Poppins">${complexityData?.timeComplexity}</span>
        <img src="${complexityData?.timeComplexityImage}" alt="Time Complexity Image" style="max-width: 100%; height: auto; margin-top: 20px; "/>
      </div>
      <div style="flex: 1; margin-left: 20px; text-align: center; font-family: Poppins;margin-top: 30px;">
        <span style="font-family: Poppins"><strong>Space Complexity:</strong></span>
        <span style="font-family: Poppins">${complexityData?.spaceComplexity}</span>
        <img src="${complexityData?.spaceComplexityImage}" alt="Space Complexity Image" style="max-width: 100%; height: auto; margin-top: 20px;"/>
      </div>
    </div>
  `;

  const closeButton = document.createElement("button");
  closeButton.innerText = "Close";
  closeButton.style.marginTop = "10px";
  closeButton.style.padding = "5px 10px";
  closeButton.style.fontSize = "14px";
  closeButton.style.borderRadius = "5px";
  closeButton.style.backgroundColor = "#007bff";
  closeButton.style.color = "white";
  closeButton.style.border = "none";
  closeButton.style.cursor = "pointer";
  closeButton.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  closeButton.style.fontFamily = "Poppins";

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.appendChild(closeButton);

  modal.style.display = "block";
}
