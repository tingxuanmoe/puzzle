const puzzleGrid = document.getElementById('puzzle-grid');
const resetButton = document.getElementById('reset-button');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');

const TILE_COUNT = 9;
const GRID_SIZE = 3;
const IMAGE_URL = 'https://assets.codepen.io/296057/panda.jpg';

let tiles = [];
let emptyTileIndex = 8;
let timer;
let seconds = 0;

function createTiles() {
    puzzleGrid.innerHTML = '';
    tiles = [];
    for (let i = 0; i < TILE_COUNT; i++) {
        const tile = document.createElement('div');
        tile.classList.add('puzzle-tile');
        if (i === emptyTileIndex) {
            tile.classList.add('empty-tile');
        } else {
            const x = (i % GRID_SIZE) * 100;
            const y = Math.floor(i / GRID_SIZE) * 100;
            tile.style.backgroundImage = `url(${IMAGE_URL})`;
            tile.style.backgroundPosition = `-${x}px -${y}px`;
        }
        tile.dataset.index = i;
        tile.addEventListener('click', () => onTileClick(i));
        puzzleGrid.appendChild(tile);
        tiles.push(tile);
    }
}

function onTileClick(index) {
    if (isMoveable(index)) {
        swapTiles(index, emptyTileIndex);
        emptyTileIndex = index;
        if (isSolved()) {
            clearInterval(timer);
            messageDisplay.textContent = `You won in ${seconds} seconds!`;
        }
    }
}

function isMoveable(index) {
    const emptyRow = Math.floor(emptyTileIndex / GRID_SIZE);
    const emptyCol = emptyTileIndex % GRID_SIZE;
    const tileRow = Math.floor(index / GRID_SIZE);
    const tileCol = index % GRID_SIZE;

    return (
        (emptyRow === tileRow && Math.abs(emptyCol - tileCol) === 1) ||
        (emptyCol === tileCol && Math.abs(emptyRow - tileRow) === 1)
    );
}

function swapTiles(index1, index2) {
    const tile1Content = tiles[index1].innerHTML;
    const tile1Style = tiles[index1].style.cssText;
    const tile1Classes = tiles[index1].className;

    tiles[index1].innerHTML = tiles[index2].innerHTML;
    tiles[index1].style.cssText = tiles[index2].style.cssText;
    tiles[index1].className = tiles[index2].className;

    tiles[index2].innerHTML = tile1Content;
    tiles[index2].style.cssText = tile1Style;
    tiles[index2].className = tile1Classes;

    const tempIndex = tiles[index1].dataset.index;
    tiles[index1].dataset.index = tiles[index2].dataset.index;
    tiles[index2].dataset.index = tempIndex;
}

function shuffleTiles() {
    for (let i = 0; i < 100; i++) {
        const moveableTiles = [];
        for (let j = 0; j < TILE_COUNT; j++) {
            if (isMoveable(j)) {
                moveableTiles.push(j);
            }
        }
        const randomIndex = moveableTiles[Math.floor(Math.random() * moveableTiles.length)];
        swapTiles(randomIndex, emptyTileIndex);
        emptyTileIndex = randomIndex;
    }
}

function isSolved() {
    for (let i = 0; i < TILE_COUNT; i++) {
        if (parseInt(tiles[i].dataset.index) !== i) {
            return false;
        }
    }
    return true;
}

function startTimer() {
    seconds = 0;
    timerDisplay.textContent = 'Time: 0s';
    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `Time: ${seconds}s`;
    }, 1000);
}

function resetGame() {
    clearInterval(timer);
    messageDisplay.textContent = '';
    emptyTileIndex = 8;
    createTiles();
    shuffleTiles();
    startTimer();
}

resetButton.addEventListener('click', resetGame);

resetGame();
