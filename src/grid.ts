import { Score } from "./score";
import { Cell } from "./cell";

export class Grid {
    gridSize: number = 4;
    cellsCount: number = 16;
    cells: Cell[];
    cellsGroupedByColumn: Record<number, Cell[]>;
    cellsGroupedByReversedColumn: Record<number, Cell[]>;
    cellsGroupedByRow: Record<number, Cell[]>;
    cellsGroupedByReversedRow: Record<number, Cell[]>;

    constructor(gridElement: HTMLElement, score: Score) {
        this.cells = [];

        for (let i = 0; i < this.cellsCount; i++) {
            this.cells.push(
                new Cell(gridElement, i % this.gridSize, Math.floor(i / this.gridSize), score)
            );
        }

        this.cellsGroupedByColumn = this.groupCellsByColumn();
        this.cellsGroupedByReversedColumn = {};
        this.cellsGroupedByRow = this.groupCellsByRow();
        this.cellsGroupedByReversedRow = {};

        for (const [key , column] of Object.entries(this.cellsGroupedByColumn)) {
            this.cellsGroupedByReversedColumn[key] = [...column].reverse();
        }

        for (const [key, row] of Object.entries(this.cellsGroupedByRow))  {
            this.cellsGroupedByReversedRow[key] = [...row].reverse();
        }

    }

    public clearGrid(): void {
        this.cells.forEach(cell => {
            cell.removeLinkedTile();
        });
    }

    public getRandomEmptyCell(): Cell | null {
        const emptyCells  = this.cells.filter(cell => cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length);

        return emptyCells[randomIndex] || null;
    }

    public groupCellsByColumn(): Record<number, Cell[]> {
        return this.cells.reduce((groupedCells: Record<number, Cell[]>, cell: Cell) => {
            groupedCells[cell.x] = groupedCells[cell.x] || [];
            groupedCells[cell.x][cell.y] = cell;

            return groupedCells;
        }, {});
    }

    public groupCellsByRow(): Record<number, Cell[]> {
        return this.cells.reduce((groupedCells: Record<number, Cell[]>, cell: Cell) => {
            groupedCells[cell.y] = groupedCells[cell.y] || [];
            groupedCells[cell.y][cell.x] = cell;

            return groupedCells;
        }, {});
    }
}

