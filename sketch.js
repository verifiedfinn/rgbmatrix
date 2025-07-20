let fontSize = 16;
let columns;
let drops = [];
let chars = "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let maxTrailLength = 30;
let changeRate = 8;
let isMobile = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textFont("monospace");
  textSize(fontSize);
  isMobile = windowWidth < 768;

  columns = isMobile ? floor(width / (fontSize * 1.5)) : floor(width / fontSize);

  for (let i = 0; i < columns; i++) {
    let trailLength = floor(random(20, maxTrailLength));
    drops[i] = {
      y: random(-100, 0),
      speed: random(0.05, 0.1),
      trail: Array(trailLength).fill("").map(() => ({
        char: chars.charAt(floor(random(chars.length))),
        life: floor(random(changeRate))
      }))
    };
  }

  frameRate(60);
}

function draw() {
  background(0, 70);

  for (let i = 0; i < columns; i++) {
    let x = i * fontSize;

    // Skip strands in center on mobile
    if (isMobile) {
      let left = width * 0.25;
      let right = width * 0.75;
      if (x > left && x < right) continue;
    }

    let drop = drops[i];

    // Update characters
    for (let j = 0; j < drop.trail.length; j++) {
      let symbol = drop.trail[j];
      symbol.life++;
      if (symbol.life >= changeRate) {
        symbol.char = chars.charAt(floor(random(chars.length)));
        symbol.life = 0;
      }
    }

    // Draw characters with RGB and fading alpha
    let hueShift = frameCount * 0.2 + i * 10;
    for (let j = 0; j < drop.trail.length; j++) {
      let y = (drop.y - j) * fontSize;
      if (y > height || y < 0) continue;

      let r = sin((hueShift + j * 5) * 0.01) * 127 + 128;
      let g = sin((hueShift + j * 5 + 100) * 0.01) * 127 + 128;
      let b = sin((hueShift + j * 5 + 200) * 0.01) * 127 + 128;
      let fadeAlpha = map(j, 0, drop.trail.length, 255, 0);
      let alpha = isMobile ? fadeAlpha * 0.5 : fadeAlpha;

      fill(r, g, b, alpha);
      text(drop.trail[j].char, x, y);
    }

    // Move drop downward
    drop.y += drop.speed;

    // Loop strand cleanly from above screen
    if (drop.y - drop.trail.length > height / fontSize) {
      drop.y = -drop.trail.length;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup(); // Recalculate layout & mobile mode
}

