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
  columns = floor(width / fontSize);

  drops = [];
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
  background(0, 70); // Fades previous frame for trailing effect

  for (let i = 0; i < columns; i++) {
    let x = i * fontSize;
    let drop = drops[i];

    // Update character lifespans
    for (let j = 0; j < drop.trail.length; j++) {
      let symbol = drop.trail[j];
      symbol.life++;
      if (symbol.life >= changeRate) {
        symbol.char = chars.charAt(floor(random(chars.length)));
        symbol.life = 0;
      }
    }

    // Draw characters
    let hueShift = frameCount * 0.2 + i * 10;
    for (let j = 0; j < drop.trail.length; j++) {
      let y = (drop.y - j) * fontSize;
      if (y > height || y < 0) continue;

      let r = sin((hueShift + j * 5) * 0.01) * 127 + 128;
      let g = sin((hueShift + j * 5 + 100) * 0.01) * 127 + 128;
      let b = sin((hueShift + j * 5 + 200) * 0.01) * 127 + 128;
      let alpha = isMobile ? 120 : 255;

      fill(r, g, b, alpha);
      text(drop.trail[j].char, x, y);
    }

    // Move strand down and reset if offscreen
    let trailEndY = (drop.y - drop.trail.length) * fontSize;
    drop.y += drop.speed;

    if (trailEndY > height + fontSize) {
      drop.y = -random(5, drop.trail.length);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}


