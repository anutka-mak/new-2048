import { Grid } from "./grid";
import { Tile } from "./tile";
import { Score } from "./score";
import { Cell } from "./cell";

const gameBoard = document.getElementById("game-board") as HTMLElement;
const resetButton = document.getElementById("button-reset") as HTMLElement;
const score = new Score();

const grid = new Grid(gameBoard, score);
grid.getRandomEmptyCell()!.linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell()!.linkTile(new Tile(gameBoard));
setupInputOnce();

window.onload = function (): void {
    checkAndPromptGameProgress();
}

function setupInputOnce(): void {
    window.addEventListener("keydown", handleInput, { once: true });
}

resetButton.addEventListener("click", (): void => {
    const confirmation = confirm("Are you sure you want to reset the game?");

    if (confirmation) {
        resetGame();
    }
});

async function handleInput(event: KeyboardEvent): Promise<void> {
    switch (event.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInputOnce();
                return;
            }
            await moveUp();
            break;
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInputOnce();
                return;
            }
            await moveDown();
            break;
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInputOnce();
                return;
            }
            await moveLeft();
            break;
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInputOnce();
                return;
            }
            await moveRight();
            break;
        default:
            setupInputOnce();
            return;
    }

    const newTile = new Tile(gameBoard);
    grid.getRandomEmptyCell()!.linkTile(newTile);
    saveGameProgress();

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd()
        alert("Game over!")
        localStorage.clear();
        return;
    }

    setupInputOnce();
}

function resetGame(): void {
    grid.clearGrid();

    score.resetScore();

    grid.getRandomEmptyCell()!.linkTile(new Tile(gameBoard));
    grid.getRandomEmptyCell()!.linkTile(new Tile(gameBoard));
}

async function moveUp() {
    await moveTiles(this.cellsGroupedByColumn);
}

async function moveDown() {
    await moveTiles(this.cellsGroupedByReversedColumn);
}

async function moveLeft() {
    await moveTiles(this.cellsGroupedByRow);
}

async function moveRight() {
    await moveTiles(this.cellsGroupedByReversedRow);
}

async function moveTiles(groupedCells: Record<number, Cell[]>): Promise<void> {
    const promises: Promise<void>[] = [];

    Object.values(groupedCells).forEach(group => moveTilesInGroup(group, promises));

    await Promise.all(promises);
    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles()
    });
}

function moveTilesInGroup(group: Cell[], promises: Promise<void>[]): void {
    for (let i = 1; i < group.length; i++) {
        if (group[i].isEmpty()) {
            continue;
        }

        const cellWithTile = group[i];

        let targetCell: Cell | undefined;
        let j = i - 1;
        while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
            targetCell = group[j];
            j--;
        }

        if (!targetCell) {
            continue;
        }

        promises.push(cellWithTile.linkedTile!.waitForTransitionEnd());

        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile!);
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile!);
        }

        cellWithTile.unlinkTile();
    }
}

function canMoveUp(): boolean {
    return canMove(this.cellsGroupedByColumn);
}

function canMoveDown(): boolean {
    return canMove(this.cellsGroupedByReversedColumn);
}

function canMoveLeft(): boolean {
    return canMove(this.cellsGroupedByRow);
}

function canMoveRight(): boolean {
    return canMove(this.cellsGroupedByReversedRow);
}

function canMove(groupedCells: Record<number, Cell[]>): boolean {
    return Object.values(groupedCells).some(group => canMoveInGroup(group));
}

function canMoveInGroup(group: Cell[]): boolean {
    return group.some((cell, index) => {
        if (index === 0) {
            return false;
        }

        if (cell.isEmpty()) {
            return false;
        }

        const targetCell = group[index - 1];

        return targetCell.canAccept(cell.linkedTile);
    });
}

function saveGameProgress(): void {
    const savedProgress: any[] = [];

    for (const cell of grid.cells) {
        const savedCell = {
            x: cell.x,
            y: cell.y,
            value: cell.linkedTile ? cell.linkedTile.value : null
        };
        savedProgress.push(savedCell);
    }

    savedProgress.push({ score: score.score });

    localStorage.setItem('savedProgress', JSON.stringify(savedProgress));
}

function restoreGameProgress(): void {
    const savedProgressJSON = localStorage.getItem('savedProgress');

    if (savedProgressJSON) {
        const savedProgress = JSON.parse(savedProgressJSON);

        grid.clearGrid();

        grid.cells.forEach(cell => {
            const savedCell = savedProgress.find((savedCell: any) => savedCell.x === cell.x && savedCell.y === cell.y);
            cell.unlinkTile();

            if (savedCell && savedCell.value !== null) {
                const newTile = new Tile(gameBoard);
                newTile.setValue(savedCell.value);
                cell.linkTile(newTile);
            }
        });

        score.score = savedProgress[savedProgress.length - 1].score;
        score.updateScoreDisplay();
    }
}

function checkAndPromptGameProgress(): void {
    const gameProgress = localStorage.getItem('savedProgress');

    if (gameProgress !== null) {
        const response = window.confirm('Restore the game progress?');

        if (response) {
            restoreGameProgress();
        } else {
            localStorage.clear();
        }
    }
}