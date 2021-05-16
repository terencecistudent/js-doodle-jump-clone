const grid = document.querySelector(".grid");
const doodler = document.querySelector(".doodler");

let doodlerLeftSpace = 50;
let startingPoint = 150;
let doodlerBottomSpace = startingPoint;
let numOfPlatforms = 5;
let platformsArray = [];
let isGameOver = false;
let upTimer;
let downTimer;
let isJumping = true;
let score = 0;
let doodlerGoingLeft = false;
let doodlerGoingRight = false;
let rightTimer;
let leftTimer;

const positionDoodler = () => {
  doodlerLeftSpace = platformsArray[0].left;
  doodler.style.left = doodlerLeftSpace + "px";
  doodler.style.bottom = doodlerBottomSpace + "px";
};

class Platform {
  constructor(newPlatformBottom) {
    this.bottom = newPlatformBottom;
    this.left = Math.random() * 315;
    this.platformVisual = document.createElement("div");

    const platformVisual = this.platformVisual;
    platformVisual.classList.add("platform");
    platformVisual.style.left = this.left + "px";
    platformVisual.style.bottom = this.bottom + "px";
    grid.appendChild(platformVisual);
  }
}

const createPlatforms = () => {
  for (let i = 0; i < numOfPlatforms; i += 1) {
    let platformSpacing = 600 / numOfPlatforms;
    let newPlatformBottom = 100 + i * platformSpacing;
    let newPlatform = new Platform(newPlatformBottom);
    platformsArray.push(newPlatform);
    console.log(platformsArray);
  }
};

const movePlatforms = () => {
  if (doodlerBottomSpace > 200) {
    platformsArray.forEach((platform) => {
      platform.bottom -= 4;
      let platformVisual = platform.platformVisual;
      platformVisual.style.bottom = platform.bottom + "px";

      if (platform.bottom < 10) {
        let firstPlatform = platformsArray[0].platformVisual;
        firstPlatform.classList.remove("platform");
        platformsArray.shift();
        console.log(platformsArray);

        score += 1;
        console.log(score);

        let newTopPlatform = new Platform(600);
        platformsArray.push(newTopPlatform);
      }
    });
  }
};

const doodlerJump = () => {
  clearInterval(downTimer);
  isJumping = true;
  upTimer = setInterval(() => {
    doodlerBottomSpace += 20;
    doodler.style.bottom = doodlerBottomSpace + "px";

    if (doodlerBottomSpace > startingPoint + 200) {
      doodlerFall();
    }
  }, 20);
};

const doodlerFall = () => {
  clearInterval(upTimer);
  isJumping = false;
  downTimer = setInterval(() => {
    doodlerBottomSpace -= 5;
    doodler.style.bottom = doodlerBottomSpace + "px";

    if (doodlerBottomSpace <= 0) {
      gameOver();
    }

    platformsArray.forEach((platform) => {
      if (
        doodlerBottomSpace >= platform.bottom &&
        doodlerBottomSpace <= platform.bottom + 15 &&
        doodlerLeftSpace + 60 >= platform.left &&
        doodlerLeftSpace <= platform.left + 85 &&
        !isJumping
      ) {
        console.log("landed");
        startingPoint = doodlerBottomSpace;
        doodlerJump();
      }
    });
  }, 20);
};

const gameOver = () => {
  console.log("game over");
  isGameOver = true;

  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }

  grid.innerHTML = score;

  clearInterval(upTimer);
  clearInterval(downTimer);
  clearInterval(leftTimer);
  clearInterval(rightTimer);
};

const controlDoodler = (e) => {
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  } else if (e.key === "ArrowUp") {
    moveStraight();
  }
};

const moveLeft = () => {
  if (doodlerGoingRight) {
    clearInterval(rightTimer);
    doodlerGoingRight = false;
  }

  doodlerGoingLeft = true;
  leftTimer = setInterval(() => {
    if (doodlerLeftSpace >= 0) {
      doodlerLeftSpace -= 5;
      doodler.style.left = doodlerLeftSpace + "px";
    } else moveRight();
  }, 20);
};

const moveRight = () => {
  if (doodlerGoingLeft) {
    clearInterval(leftTimer);
    doodlerGoingLeft = false;
  }
  doodlerGoingRight = true;
  rightTimer = setInterval(() => {
    if (doodlerLeftSpace <= 340) {
      doodlerLeftSpace += 5;
      doodler.style.left = doodlerLeftSpace + "px";
    }
  }, 20);
};

const moveStraight = () => {
  doodlerGoingLeft = false;
  doodlerGoingRight = false;
  clearInterval(leftTimer);
  clearInterval(rightTimer);
};

const start = () => {
  createPlatforms();
  positionDoodler();
  setInterval(movePlatforms, 30);
  doodlerJump();
  document.addEventListener("keyup", controlDoodler);
};
start();
