export class Score {
    score: number;
    scoreElement: HTMLElement | null;

    constructor() {
        this.score = 0;
        this.scoreElement = document.getElementById('score');
        this.updateScoreDisplay();
    }

    addScore(points: number): void {
        this.score += points;
        this.updateScoreDisplay();
    }

    updateScoreDisplay(): void {
        if (this.scoreElement) {
            this.scoreElement.textContent = this.score.toString();
        }
    }

    resetScore(): void {
        this.score = 0;
        this.updateScoreDisplay();
    }
}
