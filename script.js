// script.js

// Image sources (we use direct URLs so comparison is reliable)
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

let selectedEls = []; // currently selected tiles
let tiles = [];       // current tile elements

// Fisher-Yates shuffle (returns a shuffled copy)
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build array of 6 image objects: five unique + one duplicate (randomly chosen)
function buildImageArray() {
  const dupIndex = Math.floor(Math.random() * imageSources.length); // which to duplicate
  const arr = [];

  // push all five unique
  for (let i = 0; i < imageSources.length; i++) {
    arr.push({ src: imageSources[i], id: `img${i + 1}` });
  }

  // add duplicate of chosen one
  arr.push({ src: imageSources[dupIndex], id: `img${dupIndex + 1}` });

  // shuffle and return
  return shuffle(arr);
}

// Reset selection to initial state (no tiles selected).
// If hardReset === true, also reshuffle & rebuild the grid.
function resetSelection(hardReset = false) {
  // remove selected styling
  selectedEls.forEach(el => el.classList.remove("selected"));
  selectedEls = [];

  // hide buttons & clear messages
  verifyBtn.style.display = "none";
  resetBtn.style.display = "none";
  message.textContent = "";
  header.textContent = "Please click on the identical tiles to verify that you are not a robot.";

  if (hardReset) {
    populateGrid(); // rebuild with new duplicate & shuffle
  }
}

// Create tile <img> elements and attach click handlers
function populateGrid() {
  // clear previous
  grid.innerHTML = "";
  tiles = [];

  const images = buildImageArray();

  images.forEach((imgObj, idx) => {
    const img = document.createElement("img");
    img.dataset.tileId = imgObj.id; // identity (img1..img5)
    img.dataset.src = imgObj.src;   // store src for equality comparison
    img.src = imgObj.src;
    img.alt = `tile-${idx + 1}`;
    img.style.cursor = "pointer";

    // click handler for selection
    img.addEventListener("click", () => {
      // If verification already done (message shown) then ignore further clicks until Reset
      if (verifyBtn.style.display === "none" && message.textContent) return;

      // Prevent selecting same tile twice
      if (selectedEls.includes(img)) return;

      // Ignore clicks after two picks
      if (selectedEls.length >= 2) return;

      // Mark selection
      selectedEls.push(img);
      img.classList.add("selected");

      // Show Reset when at least one tile selected
      if (selectedEls.length >= 1) {
        resetBtn.style.display = "inline-block";
      }

      // Show Verify only when exactly two distinct tiles selected
      if (selectedEls.length === 2) {
        verifyBtn.style.display = "inline-block";
      }
    });

    grid.appendChild(img);
    tiles.push(img);
  });

  // Ensure both buttons hidden at initial render
  resetBtn.style.display = "none";
  verifyBtn.style.display = "none";
  message.textContent = "";
  header.textContent = "Please click on the identical tiles to verify that you are not a robot.";
}

// Verify button logic
verifyBtn.addEventListener("click", () => {
  if (selectedEls.length !== 2) return; // safety check

  // Hide verify after clicking (per acceptance criteria)
  verifyBtn.style.display = "none";

  const [a, b] = selectedEls;
  // Compare by data-src (duplicate will have same src)
  const same = a.dataset.src === b.dataset.src;

  if (same) {
    message.textContent = "You are a human. Congratulations!";
    header.textContent = "";
  } else {
    message.textContent = "We can't verify you as a human. You selected the non-identical tiles.";
    header.textContent = "";
  }
});

// Reset button logic: clear selection state and hide Reset (return to State 1)
// If you'd like Reset to reshuffle, change resetSelection() to resetSelection(true)
resetBtn.addEventListener("click", () => {
  resetSelection(); // pass true to reshuffle: resetSelection(true)
});

// Initialize the grid on page load
populateGrid();

/* ---------- Optional tweaks ----------
If you prefer the Reset button to reshuffle & rebuild tiles (instead of keeping same layout),
change the reset handler above to:
  resetBtn.addEventListener("click", () => resetSelection(true));
--------------------------------------*/
