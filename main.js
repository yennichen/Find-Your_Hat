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
        for (let i of this.field) {
            console.log(i.join(''));
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

    playGame(height, width, holePercentage) {
        // Generate field
        const generatedField = Field.generateField(height, width, holePercentage);

        // Initialize game
        this.field = generatedField;
        this.gameOver = false;
        this.currentRow = 0;
        this.currentColumn = 0;

        while (!this.gameOver) {
            console.clear(); // Clear console for better visibility
            this.print();
            this.promptMove();
        }
    }
    
    //在這個範例中，我們想要能夠直接從 Field 類別中生成場地，而不需要先建立一個 Field 物件。
    //因此，將 generateField 方法定義為靜態方法是合適的做法。
    //這使得我們可以透過 Field.generateField() 直接呼叫這個方法，而不需要先建立 Field 物件。
    static generateField(height, width, holePercentage) {
        const totalTiles = height * width;
        const field = new Array(height).fill().map(() => new Array(width).fill(fieldCharacter));
        let numHoles = Math.floor((totalTiles * holePercentage) / 100);
        
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
            //console.log(randomRow,randomCol);
            if (field[randomRow][randomCol] === fieldCharacter) {
                field[randomRow][randomCol] = hat;
                hatPlaced = true;
            }
        }

        field[0][0] = pathCharacter; // Start position
        // Place the starting point randomly
        /*
        let startingPlaced = false;
        while (!startingPlaced) {
            const randomRow = Math.floor(Math.random() * height);
            const randomCol = Math.floor(Math.random() * width);
            //console.log(randomRow,randomCol);
            if (field[randomRow][randomCol] === fieldCharacter) {
                field[randomRow][randomCol] = pathCharacter;
                startingPlaced = true;
            }
        } 
        */

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
//const myField = new Field(generatedField);
//myField.playGame();

// Initialize game
const myField = new Field();
myField.playGame(5, 6, 20);