let fontSize = 16;
let columns;
let drops = [];
let chars = "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let maxTrailLength = 30;
let changeRate = 8;
let isMobile = false;
// ---- size-adaptive settings ----
let speedScale = 1;
let trailScale = 1;
let fadeAlpha = 70;
// ---- edge mode (?edges=1): middle band is rain-free BELOW the hero ----
let edgesOnly = false;
let heroLimit = 900;
const HERO_PAD  = 70;    // rain fades out this many px ABOVE the measured hero bottom
const SAFE_BAND = 1300;  // px width of protected middle — anchored to content, not screen %

function applySizeProfile() {
  isMobile = windowWidth < 768;
  let params = new URLSearchParams(window.location.search);
  edgesOnly = params.get('edges') === '1';
  heroLimit = max((parseInt(params.get('hero')) || 900) - HERO_PAD, 200);
  let h = windowHeight;
  if (isMobile) {
    speedScale = 1; trailScale = 1; fadeAlpha = 70;
  } else if (h <= 1200) {
    speedScale = 1; trailScale = 1; fadeAlpha = 70;
  } else if (h <= 3500) {
    speedScale = sqrt(h / 900); trailScale = 1.3; fadeAlpha = 70;
  } else {
    speedScale = min(sqrt(h / 900), 2.5); trailScale = 1.6; fadeAlpha = 55;
  }
}

function setup() {
  applySizeProfile();
  if (!isMobile) pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  background(0);
  textFont("monospace");
  textSize(fontSize);
  noStroke();
  columns = floor(width / fontSize);
  drops = [];
  // fixed-pixel protected band, centered — same clearance on every screen width.
  // if the window is narrower than the band, leave a minimum 60px rail each side.
  let gapL = max((width - SAFE_BAND) / 2, 60);
  let gapR = width - gapL;
  for (let i = 0; i < columns; i++) {
    let px = i * fontSize;
    let isMiddle = edgesOnly && px > gapL && px < gapR;
    let trailLength = floor(random(20, maxTrailLength) * trailScale);
    drops[i] = {
      y: random(-100, 0),
      speed: random(0.05, 0.1) * (isMiddle ? 1 : speedScale),
      maxY: isMiddle ? heroLimit : height,
      trail: Array(trailLength).fill("").map(() => ({
        char: chars.charAt(floor(random(chars.length))),
        life: floor(random(changeRate))
      }))
    };
  }
  frameRate(isMobile ? 60 : 30);
}

function draw() {
  // self-heal: if the iframe was resized and windowResized didn't fire
  if (abs(windowHeight - height) > 8 || abs(windowWidth - width) > 8) {
    resizeCanvas(windowWidth, windowHeight);
    setup();
    return;
  }
  background(0, fadeAlpha);
  for (let i = 0; i < columns; i++) {
    let drop = drops[i];
    let x = i * fontSize;
    for (let j = 0; j < drop.trail.length; j++) {
      let symbol = drop.trail[j];
      symbol.life++;
      if (symbol.life >= changeRate) {
        symbol.char = chars.charAt(floor(random(chars.length)));
        symbol.life = 0;
      }
    }
    let hueShift = frameCount * 0.2 + i * 10;
    for (let j = 0; j < drop.trail.length; j++) {
      let y = (drop.y - j) * fontSize;
      if (y > drop.maxY || y < 0) continue;
      let r = sin((hueShift + j * 5) * 0.01) * 127 + 128;
      let g = sin((hueShift + j * 5 + 100) * 0.01) * 127 + 128;
      let b = sin((hueShift + j * 5 + 200) * 0.01) * 127 + 128;
      let alpha = isMobile ? 120 : 255;
      let fadeZone = drop.maxY * 0.85;
      if (y > fadeZone) {
        alpha *= map(y, fadeZone, drop.maxY, 1, 0);
      }
      fill(r, g, b, alpha);
      text(drop.trail[j].char, x, y);
    }
    let trailEndY = (drop.y - drop.trail.length) * fontSize;
    drop.y += drop.speed;
    if (trailEndY > drop.maxY + fontSize || trailEndY > height + fontSize) {
      drop.y = -random(5, drop.trail.length);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}
