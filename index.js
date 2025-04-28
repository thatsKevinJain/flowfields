vec.polute();
microcan.polute();

const ctx = document.getElementById("main").getContext('2d');
const w = 800;
const h = 800;

const n = 100;
const fieldSize = w / n;

const pn = 1000;
const maxLifetime = 100 * 5;
const randomColor = () => {
  return Math.abs(Math.random() * 255);
}
const particles = Array.from({
  length: pn
}, () => {
  return {
    position: [Math.random() * w, Math.random() * h],
    lifetime: Math.round(Math.random() * maxLifetime),
    color: randomColor()
  }
});

const clamp = (x, min, max) => Math.min(max, Math.max(x, min));
const vClamp = ([x, y], [min, max]) => [clamp(x, min, max), clamp(y, min, max)];

const vWindowToField = ([x, y]) => {
  const fv = [Math.floor(x / fieldSize), Math.floor(y / fieldSize)];
  return vClamp(fv, [0, n - 1]);
}

const vRandom = () => vAngle(Math.random() * Math.PI * 2);

// Function that returns a random flow field generator function
const getRandomFlowFieldGenerator = () => {
  const generators = [
    // Spiral pattern
    ([x, y]) => {
      const dist = Math.sqrt(x*x + y*y);
      return Math.sin(dist * 0.2) + Math.atan2(y, x);
    },
    
    // Wave interference pattern
    ([x, y]) => {
      return Math.sin(x * 0.1) * Math.sin(y * 0.1);
    },
    
    // Checkerboard with smooth transitions
    ([x, y]) => {
      return Math.sin(x * 0.2) * Math.sin(y * 0.2);
    },
    
    // Ripple effect
    ([x, y]) => {
      const dist = Math.sqrt(x*x + y*y);
      return Math.sin(dist * 0.3);
    },
    
    // Vortex pattern
    ([x, y]) => {
      const angle = Math.atan2(y, x);
      const dist = Math.sqrt(x*x + y*y);
      return Math.sin(angle * 3) * Math.cos(dist * 0.1);
    },
    
    // Perlin-like noise approximation
    ([x, y]) => {
      return Math.sin(x * 0.1) + Math.sin(x * 0.05) * Math.sin(y * 0.1) + Math.sin(y * 0.05);
    },
    
    // Moiré pattern
    ([x, y]) => {
      return Math.sin(x * 0.1) * Math.cos(y * 0.1) + Math.sin(x * 0.05) * Math.cos(y * 0.05);
    },
    
    // Hyperbolic pattern
    ([x, y]) => {
      return Math.sin(x * y * 0.01);
    },
    
    // Celtic knot inspiration
    ([x, y]) => {
      return Math.sin(x * 0.1) + Math.sin(y * 0.1) + Math.sin((x+y) * 0.1) + Math.sin((x-y) * 0.1);
    },
    
    // Ridge pattern
    ([x, y]) => {
      return Math.abs(Math.sin(x * 0.1)) * Math.abs(Math.sin(y * 0.1));
    }
  ];
  
  // Return a random generator from the array
  return generators[Math.floor(Math.random() * generators.length)];
};

// Get a random flow field generator
const flowFieldGenerator = getRandomFlowFieldGenerator();

const computeFieldValue = ([x, y]) => {
  const sins = [
    flowFieldGenerator([x, y])
  ]
  const avgSin = sins.reduce((a, b) => a+b, 0) / sins.length;
  return vAngle((avgSin / 5) * Math.PI * 2);
}

const field = Array.from({
  length: n
}, (_, y) => Array.from({
  length: n
}, (__, x) => {
  return computeFieldValue([x, y]);
}))

setCanvasSize("main", w, h);
background(ctx, 0, 0, 0, 1, w, h);

const draw = () => {
  // background(ctx, 0, 0, 0, 0.05, w, h);

  for (let i = 0; i < pn; i++) {
    const p = particles[i].position;
    const [fx, fy] = vWindowToField(p);
    const fv = field[fx][fy];
    particles[i].position = vAdd(p, fv);

    // stroke(ctx, 0, 255-particles[i].color, 255, 1);
    // fill(ctx, 255, 255, 255, 1);

    noStroke(ctx);
    fill(ctx, 0, 255-particles[i].color, 255, 0.3);
    ellipse(ctx, particles[i].position, 1);

    if(particles[i].lifetime-- <= 0) {
      particles[i].position = [Math.random() * w, Math.random() * h];
      particles[i].lifetime = Math.round(Math.random() * maxLifetime);
      particles[i].color = randomColor();
    } 
  }

  window.requestAnimationFrame(draw);
}

draw();
