const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this.field = field;
        this.currentRow = 0;
        this.currentColumn = 0;
        this.gameOver = false;
    }

    print() {
        for (let row of this.field) {
            console.log(row.join(''));
        }
    }

    promptMove() {
        const direction = prompt('Which way? (u=up, d=down, l=left, r=right): ');
        switch (direction.toLowerCase()) {
            case 'u':
                this.move(-1, 0);
                break;
            case 'd':
                this.move(1, 0);
                break;
            case 'l':
                this.move(0, -1);
                break;
            case 'r':
                this.move(0, 1);
                break;
            default:
                console.log('Invalid input. Please enter u, d, l, or r.');
        }
    }

    move(rowOffset, colOffset) {
        const newRow = this.currentRow + rowOffset;
        const newColumn = this.currentColumn + colOffset;
        if (newRow < 0 || newRow >= this.field.length || newColumn < 0 || newColumn >= this.field[0].length) {
            console.log('You moved outside the field. Game over!');
            this.gameOver = true;
        } else {
            const newPosition = this.field[newRow][newColumn];
            if (newPosition === hat) {
                console.log('Congratulations! You found your hat!');
                this.gameOver = true;
            } else if (newPosition === hole) {
                console.log('Oops! You fell into a hole. Game over!');
                this.gameOver = true;
            } else {
                this.field[this.currentRow][this.currentColumn] = pathCharacter;
                this.currentRow = newRow;
                this.currentColumn = newColumn;
                this.field[this.currentRow][this.currentColumn] = pathCharacter;
            }
        }
    }

    playGame() {
        while (!this.gameOver) {
            console.clear(); // Clear console for better visibility
            this.print();
            this.promptMove();
        }
    }

    static generateField(height, width, holePercentage) {
        const totalTiles = height * width;
        const field = new Array(height).fill().map(() => new Array(width).fill(fieldCharacter));
        let numHoles = Math.floor((totalTiles * holePercentage) / 100);
        field[0][0] = pathCharacter; // Start position
        while (numHoles > 0) {
            const randomRow = Math.floor(Math.random() * height);
            const randomCol = Math.floor(Math.random() * width);
            if (field[randomRow][randomCol] === fieldCharacter) {
                field[randomRow][randomCol] = hole;
                numHoles--;
            }
        }
        // Place the hat randomly
        let hatPlaced = false;
        while (!hatPlaced) {
            const randomRow = Math.floor(Math.random() * height);
            const randomCol = Math.floor(Math.random() * width);
            if (field[randomRow][randomCol] === fieldCharacter) {
                field[randomRow][randomCol] = hat;
                hatPlaced = true;
            }
        }
        return field;
    }
}

// Example usage
const fieldHeight = 5;
const fieldWidth = 5;
const holePercentage = 20;
const generatedField = Field.generateField(fieldHeight, fieldWidth, holePercentage);
console.log(generatedField);

// Initialize game
const myField = new Field(generatedField);
myField.playGame();
