export class Score {
    score: number;
    scoreElement: HTMLElement | null;

    constructor() {
        this.score = 0;
        this.scoreElement = document.getElementById('score');
        this.updateDisplay();
    }

    public addScore(points: number): void {
        this.score += points;
        this.updateDisplay();
    }

    public updateDisplay(): void {
        if (this.scoreElement) {
            this.scoreElement.textContent = this.score.toString();
        }
    }

    public resetScore(): void {
        this.score = 0;
        this.updateDisplay();
    }
}
