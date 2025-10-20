const puzzleGrid = document.getElementById('puzzle-grid');
const resetButton = document.getElementById('reset-button');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');

const TILE_COUNT = 9;
const GRID_SIZE = 3;
const IMAGE_URL = 'panda.jpg';

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

        // This is the original, solved-state position. It never changes.
        tile.dataset.index = i;

        if (i === emptyTileIndex) {
            tile.classList.add('empty-tile');
        } else {
            const x = (i % GRID_SIZE) * 100;
            const y = Math.floor(i / GRID_SIZE) * 100;
            tile.style.backgroundImage = `url(${IMAGE_URL})`;
            tile.style.backgroundPosition = `-${x}px -${y}px`;

            const numberElement = document.createElement('div');
            numberElement.classList.add('tile-number');
            // The displayed number is based on the original index.
            numberElement.textContent = i + 1;
            tile.appendChild(numberElement);
        }

        tile.addEventListener('click', () => onTileClick(tile));
        puzzleGrid.appendChild(tile);
        tiles.push(tile);
    }
}

function onTileClick(clickedTile) {
    // Find the current visual index of the clicked tile and the empty tile.
    const clickedIndex = tiles.indexOf(clickedTile);
    const emptyIndex = tiles.findIndex(tile => tile.classList.contains('empty-tile'));

    if (isMoveable(clickedIndex, emptyIndex)) {
        swapTiles(clickedIndex, emptyIndex);
        if (isSolved()) {
            clearInterval(timer);
            messageDisplay.textContent = `You won in ${seconds} seconds!`;
        }
    }
}

function isMoveable(index1, index2) {
    const row1 = Math.floor(index1 / GRID_SIZE);
    const col1 = index1 % GRID_SIZE;
    const row2 = Math.floor(index2 / GRID_SIZE);
    const col2 = index2 % GRID_SIZE;

    return (
        (row1 === row2 && Math.abs(col1 - col2) === 1) ||
        (col1 === col2 && Math.abs(row1 - row2) === 1)
    );
}

function swapTiles(index1, index2) {
    // Simple swap of the tile elements in the `tiles` array.
    [tiles[index1], tiles[index2]] = [tiles[index2], tiles[index1]];

    // Re-render the grid based on the new `tiles` array order.
    renderGrid();
}


function renderGrid() {
    puzzleGrid.innerHTML = '';
    for(const tile of tiles) {
        puzzleGrid.appendChild(tile);
    }
}

function shuffleTiles() {
    let currentIndex = TILE_COUNT;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [tiles[currentIndex], tiles[randomIndex]] = [tiles[randomIndex], tiles[currentIndex]];
    }

    // Check for solvability - this is a simple check, not perfect for all puzzles
    // but good enough for this implementation.
    let inversions = 0;
    for (let i = 0; i < TILE_COUNT - 1; i++) {
        for (let j = i + 1; j < TILE_COUNT; j++) {
            const tileI = tiles[i];
            const tileJ = tiles[j];
            if (!tileI.classList.contains('empty-tile') &&
                !tileJ.classList.contains('empty-tile') &&
                parseInt(tileI.dataset.index) > parseInt(tileJ.dataset.index)) {
                inversions++;
            }
        }
    }

    if (inversions % 2 !== 0) {
        // Not solvable, shuffle again
        shuffleTiles();
    } else {
       renderGrid();
    }
}

function isSolved() {
    // Win condition: tiles are in reverse order (8, 7, ..., 1, empty)
    for (let i = 0; i < TILE_COUNT - 1; i++) {
        // Check the original index of the tile at the current position `i`.
        // Tile 8 has index 7, Tile 7 has index 6, etc.
        if (parseInt(tiles[i].dataset.index) !== (7 - i)) {
            return false;
        }
    }
    // Check that the last tile is the empty one (original index 8).
    return parseInt(tiles[TILE_COUNT - 1].dataset.index) === 8;
}

function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timerDisplay.textContent = 'Time: 0s';
    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `Time: ${seconds}s`;
    }, 1000);
}

function resetGame() {
    messageDisplay.textContent = '';
    createTiles(); // Re-creates the tiles in the initial, solved order.
    shuffleTiles();
    startTimer();
}

resetButton.addEventListener('click', resetGame);

// Initial game setup
resetGame();
