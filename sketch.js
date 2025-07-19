let fontSize = 16;
let columns;
let drops = [];
let chars = "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチッヂヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let maxTrailLength = 30;
let changeRate = 8; // how many frames before symbol changes

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0); // Prevent initial white flash
  textFont("monospace");
  textSize(fontSize);
  columns = floor(width / fontSize); // ✅ FIX: initialize columns here

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
    let drop = drops[i];

    // Update trail characters only occasionally
    for (let j = 0; j < drop.trail.length; j++) {
      let symbol = drop.trail[j];
      symbol.life++;
      if (symbol.life >= changeRate) {
        symbol.char = chars.charAt(floor(random(chars.length)));
        symbol.life = 0;
      }
    }

    // Draw trail with RGB gradient
    let hueShift = frameCount * 0.2 + i * 10;
    for (let j = 0; j < drop.trail.length; j++) {
      let y = (drop.y - j) * fontSize;
      if (y > height || y < 0) continue;

      let r = sin((hueShift + j * 5) * 0.01) * 127 + 128;
      let g = sin((hueShift + j * 5 + 100) * 0.01) * 127 + 128;
      let b = sin((hueShift + j * 5 + 200) * 0.01) * 127 + 128;

      fill(r, g, b);
      text(drop.trail[j].char, x, y);
    }

    // Move strand downward
    drop.y += drop.speed;
    if (drop.y - drop.trail.length > height / fontSize || random() > 0.9995) {
      drop.y = random(-20, 0);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
}
