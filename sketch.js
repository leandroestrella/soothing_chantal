/**
 * "soothing chantal"
 * a generative lullaby
 * by leandro estrella
 * cargocollective.com/leandroestrella
 *
 * Migrated from Processing to p5.js
 */

const MAX_MOVIES = 6;
const VIDEO_SRC = "data/lala.oggtheora.ogv";

let isPlaying = true;
let rand;
let oldX = 0;
let oldY = 0;

let firstClipVideo;
let myVideos = [];
let videosPlaying = [];
let started = false;

function preload() {
  // Videos are created in setup after user interaction
}

function setup() {
  createCanvas(1100, 800);
  background(0);
  textFont("monospace");

  rand = floor(random(MAX_MOVIES));

  firstClipVideo = createVideo(VIDEO_SRC);
  firstClipVideo.hide(); // hide the default HTML element
  firstClipVideo.volume(0.5);

  for (let i = 0; i < MAX_MOVIES; i++) {
    myVideos[i] = createVideo(VIDEO_SRC);
    myVideos[i].hide();
    myVideos[i].volume(0);
  }

  videosPlaying.push(firstClipVideo);

  // Handle click-to-start (required by browser autoplay policies)
  let overlay = document.getElementById("start-overlay");
  if (overlay) {
    overlay.addEventListener("click", function () {
      startPlayback();
      overlay.style.display = "none";
    });
  }
}

function startPlayback() {
  if (started) return;
  started = true;
  firstClipVideo.loop();
}

function draw() {
  if (!started) {
    background(0);
    return;
  }

  // Draw and analyze the first clip
  let vidWidth = firstClipVideo.width;
  let vidHeight = firstClipVideo.height;

  if (vidWidth > 0 && vidHeight > 0) {
    tint(255, 50);
    image(firstClipVideo, 0, 0, width, height);

    // Search for the brightest pixel
    firstClipVideo.loadPixels();
    if (firstClipVideo.pixels.length > 0) {
      let brightestX = 0;
      let brightestY = 0;
      let brightestValue = 0;

      for (let y = 0; y < vidHeight; y++) {
        for (let x = 0; x < vidWidth; x++) {
          let index = (y * vidWidth + x) * 4;
          let r = firstClipVideo.pixels[index];
          let g = firstClipVideo.pixels[index + 1];
          let b = firstClipVideo.pixels[index + 2];
          let pixelBrightness = (r + g + b) / 3;

          if (pixelBrightness > brightestValue) {
            brightestValue = pixelBrightness;
            brightestY = y;
            brightestX = x;
          }
        }
      }
      oldX = brightestX;
      oldY = brightestY;
    }
  } else if (oldX <= 200) {
    // When video is not available and brightest X is low, add another video layer
    rand = floor(random(MAX_MOVIES));
    videosPlaying.push(myVideos[rand]);
    videosPlaying[videosPlaying.length - 1].loop();
  }

  // Draw all playing videos
  for (let i = 0; i < videosPlaying.length; i++) {
    let m = videosPlaying[i];
    if (m.width > 0 && m.height > 0) {
      tint(255, 50);
      image(m, 0, 0, width, height);
    }
  }

  // Main video speed (clamped to valid HTML5 range: 0.0625 to 16)
  let newSpeed = map(oldX, 0, width, 0.0625, 2);
  try {
    firstClipVideo.speed(newSpeed);
  } catch (e) {
    // Ignore speed errors from browser restrictions
  }

  // Main video volume (normalized to 0-1)
  let newVolume = constrain(map(oldX + oldY, 0, width, 0, 1), 0, 1);
  firstClipVideo.volume(newVolume);

  // Second+ video speed
  let newSpeedB = map(oldY, 0, height, 0.0625, 2);
  try {
    myVideos[rand].speed(newSpeedB);
  } catch (e) {
    // Ignore speed errors from browser restrictions
  }

  // Visualizers (HUD overlay)
  noTint();
  textAlign(CENTER, TOP);
  fill(255);
  textSize(10);
  text(nfc(newSpeed, 2) + " S", 30, 20);
  text(nfc(oldY, 2) + " Y", 570, 20);
  text(nfc(newSpeedB, 2) + " S", 1070, 20);
  text(nfc(frameRate(), 2) + " F", 30, 785);
  text(nfc(oldX, 2) + " X", 570, 785);
  text(nfc(newVolume, 2) + " V", 1070, 785);
}
