const blessed = require('blessed');

// Setup da tela
const screen = blessed.screen({ smartCSR: true });
const arena = blessed.box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: 40,
  height: 20,
  border: { type: 'line' },
  style: { border: { fg: 'white' } },
  tags: true
});

let snake = [{ x: 5, y: 5 }];
let direction = { x: 1, y: 0 };
let fruit = { x: 10, y: 10 };
let changingDirection = false;

// Captura de teclas
screen.key(['up', 'down', 'left', 'right', 'q', 'C-c'], (ch, key) => {
  if (key.name === 'q' || (key.ctrl && key.name === 'c')) process.exit(0);

  if (changingDirection) return;

  if (key.name === 'up' && direction.y === 0) { direction = { x: 0, y: -1 }; changingDirection = true; }
  if (key.name === 'down' && direction.y === 0) { direction = { x: 0, y: 1 }; changingDirection = true; }
  if (key.name === 'left' && direction.x === 0) { direction = { x: -1, y: 0 }; changingDirection = true; }
  if (key.name === 'right' && direction.x === 0) { direction = { x: 1, y: 0 }; changingDirection = true; }
});

function draw() {
  let content = "";
  // Lógica de desenho simplificada (renderizando linha por linha)
  for (let y = 0; y < 18; y++) {
    for (let x = 0; x < 38; x++) {
      const isSnake = snake.some(s => s.x === x && s.y === y);
      const isFruit = fruit.x === x && fruit.y === y;
      
      if (isSnake) content += '{green-fg}█{/green-fg}';
      else if (isFruit) content += '{red-fg}●{/red-fg}';
      else content += " ";
    }
    content += "\n";
  }
  arena.setContent(content);
  screen.render();
}

// Renderização inicial
draw();

// Loop principal
setInterval(() => {
  changingDirection = false;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  
  // Lógica de colisão com parede
  if (head.x < 0 || head.x >= 38 || head.y < 0 || head.y >= 18) process.exit(0);

  // Colisão com o próprio corpo
  if (snake.some(s => s.x === head.x && s.y === head.y)) process.exit(0);

  snake.unshift(head);
  if (head.x === fruit.x && head.y === fruit.y) {
    do {
      fruit = { x: Math.floor(Math.random() * 38), y: Math.floor(Math.random() * 18) };
    } while (snake.some(s => s.x === fruit.x && s.y === fruit.y));
  } else {
    snake.pop();
  }
  
  draw();
}, 150);