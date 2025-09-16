//your code here
// script.js

// Image sources (these match CSS .img1.. etc but we use direct URLs so comparison is reliable)
const imageSources = [
  "https://picsum.photos/id/237/200/300",       // img1
  "https://picsum.photos/seed/picsum/200/300",  // img2
  "https://picsum.photos/200/300?grayscale",    // img3
  "https://picsum.photos/200/300/",             // img4
  "https://picsum.photos/200/300.jpg"           // img5
];

const grid = document.getElementById("grid");
const resetBtn = document.getElementById("reset");
const verifyBtn = document.getElementById("verify");
const message = document.getElementById("para");
const header = document.getElementById("h");

let selectedEls = []; // store DOM elements of selected tiles
let tiles = []; // store current tile elements (for cleanup if needed)

// Utility: Fisher-Yates shuffle
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build the 6-image array with one random duplicate
function buildImageArray() {
  // pick one index to duplicate
  const dupIndex = Math.floor(Math.random() * imageSources.length);
  const arr = [];

  // push all five unique
  for (let i = 0; i < imageSources.length; i++) {
    arr.push({ src: imageSources[i], id: `img${i + 1}` });
  }

  // add the duplicate copy of chosen one
  arr.push({ src: imageSources[dupIndex], id: `img${dupIndex + 1}` });

  // shuffle and return
  return shuffle(arr);
}

function resetSelection(hardReset = false) {
  // Remove selected class
  selectedEls.forEach(el => el.classList.remove("selected"));
  selectedEls = [];
  message.textContent = "";
  verifyBtn.style.display = "none";
  resetBtn.style.display = "none";
  header.textContent = "Please click on the identical tiles to verify that you are not a robot.";

  if (hardReset) {
    // Rebuild tiles (new shuffle & duplicate)
    populateGrid();
  }
}

function populateGrid() {
  // Clear previous
  grid.innerHTML = "";
  tiles = [];

  const images = buildImageArray();

  images.forEach((imgObj, idx) => {
    const img = document.createElement("img");
    // store data attributes for identity comparison
    img.dataset.tileId = imgObj.id; // e.g., img1..img5
    img.dataset.src = imgObj.src;   // store src also
    img.src = imgObj.src;
    img.alt = `tile-${idx+1}`;
    img.style.cursor = "pointer";

    // click handler
    img.addEventListener("click", () => {
      // If verify already clicked and result shown, ignore further clicks until reset
      if (verifyBtn.style.display === "none" && message.textContent) {
        // do nothing — user must RESET to try again
        return;
      }

      // prevent selecting same tile twice
      if (selectedEls.includes(img)) return;

      // if already two selected, ignore additional clicks
      if (selectedEls.length >= 2) return;

      // add selection
      selectedEls.push(img);
      img.classList.add("selected");

      // show reset button if at least one
      if (selectedEls.length >= 1) {
        resetBtn.style.display = "inline-block";
      }

      // show verify button only when exactly two distinct tiles selected
      if (selectedEls.length === 2) {
        verifyBtn.style.display = "inline-block";
      }
    });

    grid.appendChild(img);
    tiles.push(img);
  });

  // ensure Reset & Verify hidden initially
  resetBtn.style.display = "none";
  verifyBtn.style.display = "none";
  message.textContent = "";
}

// Verify button logic
verifyBtn.addEventListener("click", () => {
  if (selectedEls.length !== 2) return; // safety

  // Hide verify after click
  verifyBtn.style.display = "none";

  const [a, b] = selectedEls;
  // compare by data-src or data-tileId (since duplicate has same src & same tileId)
  const same = a.dataset.src === b.dataset.src;

  if (same) {
    message.textContent = "You are a human. Congratulations!";
    header.textContent = "";
  } else {
    message.textContent = "We can't verify you as a human. You selected the non-identical tiles.";
    header.textContent = "";
  }
});

// Reset button logic
resetBtn.addEventListener("click", () => {
  resetSelection(); // return to State 1 (keeps same tiles by default)
});

// initialize on load
populateGrid();

// Optional: allow hard reset (reshuffle) when user double-clicks header
// Not required by acceptance criteria; commented out.
// header.addEventListener('dblclick', () => populateGrid());
