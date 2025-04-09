(() => {
  var div = document.getElementById("particles"); // Select the target div
  var canvas = document.createElement("canvas");

  canvas.id = "canvas";
  canvas.width = 930;
  canvas.height = 649;
  canvas.style.position = "fixed";
  canvas.style.zIndex = "-1";
  // canvas.style.opacity = "0.5"; // Adjust transparency

  div.prepend(canvas);

  // Get the canvas and context
  // var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  // Resize the canvas to fill the window
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(window.innerHeight, window.innerHeight);
  }
  window.addEventListener("resize", resize);
  resize();

  // ----- Perlin Noise Implementation -----
  // (Based on the reference implementation by Ken Perlin)
  var permutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
    234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
    134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
    230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
    1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
    116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
    124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
    47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
    154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
    108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
    242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
    239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
    50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
    141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];
  var p = new Array(512);
  for (var i = 0; i < 256; i++) {
    p[i] = permutation[i];
    p[i + 256] = permutation[i];
  }

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(t, a, b) {
    return a + t * (b - a);
  }

  function grad(hash, x, y, z) {
    var h = hash & 15;
    var u = h < 8 ? x : y,
      v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  function noise(x, y, z) {
    var X = Math.floor(x) & 255;
    var Y = Math.floor(y) & 255;
    var Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    var u = fade(x);
    var v = fade(y);
    var w = fade(z);

    var A = p[X] + Y,
      AA = p[A] + Z,
      AB = p[A + 1] + Z;
    var B = p[X + 1] + Y,
      BA = p[B] + Z,
      BB = p[B + 1] + Z;

    return lerp(
      w,
      lerp(
        v,
        lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
        lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z)),
      ),
      lerp(
        v,
        lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
        lerp(
          u,
          grad(p[AB + 1], x, y - 1, z - 1),
          grad(p[BB + 1], x - 1, y - 1, z - 1),
        ),
      ),
    );
  }
  // ----- End of Perlin Noise Implementation -----

  // ----- Particle System Setup -----
  var particles = [];
  var numParticles = 400;
  var noiseScale = 0.01;
  var zOffset = 5;

  // Particle varructor
  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = 0.5 + Math.random() * 2;
    this.size = Math.random() * 2 + 0.1;
    this.hue = 100 + Math.random() * 200; // Full rainbow spectrum (0-360°)
    this.saturation = 80 + Math.random() * 20; // Vibrant colors (80-100%)
    this.lightness = 0.1 + Math.random() * 90; // Balanced pastel brightness (50-70%)
  }

  Particle.prototype.update = function () {
    var angle =
      noise(this.x * noiseScale, this.y * noiseScale, zOffset) * Math.PI * 4;
    var vx = Math.cos(angle) * this.speed;
    var vy = Math.sin(angle) * this.speed;

    this.x += vx;
    this.y += vy;

    // Reverse direction on hitting boundaries
    if (this.x >= canvas.width - 45 || this.x <= 0) {
      this.speed *= -1; // Reverse speed
    }
    if (this.y >= canvas.height || this.y <= 0) {
      this.speed *= -1; // Reverse speed
    }
  };

  Particle.prototype.draw = function () {
    ctx.fillStyle = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };

  for (var i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  // ----- Animation Loop -----
  function animate() {
    ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    zOffset += 0.005;
    requestAnimationFrame(animate);
  }
  animate();
})();
