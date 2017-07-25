/**
 * Created by Burgess on 2017/7/14.
 */
import TileModel from '../tile/TileModel'

export default class BoardModel {
    static size = 4;
    static fourProbability = 0.1;

    static deltaX = [-1, 0, 1, 0];
    static deltaY = [0, -1, 0, 1];

    constructor(){
        this.tiles = [];
        this.cells = [];

        //填充cells
        for(let i = 0; i < BoardModel.size; ++i){
            this.cells[i] = [this.addTile(), this.addTile(), this.addTile(), this.addTile()];
        }
        this.addRandomTile();
        this.setPositions();
        this.won = false;
    }

    addTile(){
        let tile = new TileModel();
        TileModel.apply(tile, arguments);
        this.tiles.push(tile);
        return tile;
    }

    setPositions(){
        this.cells.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                tile.oldRow = tile.row;
                tile.oldCol = tile.col;
                tile.row = rowIndex;
                tile.col = colIndex;
                tile.markForDeletion = false;
            });
        });
    }

    addRandomTile() {
        let emptyCells = [];
        for (let r = 0; r < BoardModel.size; ++r) {
            for (let c = 0; c < BoardModel.size; ++c) {
                if (this.cells[r][c].value == 0) {
                    emptyCells.push({r: r, c: c});
                }
            }
        }
        let index = ~~(Math.random() * emptyCells.length);
        let cell = emptyCells[index];
        let newValue = Math.random() < BoardModel.fourProbability ? 4 : 2;
        this.cells[cell.r][cell.c] = this.addTile(newValue);
    }

    move(direction) {
        // 0 -> left, 1 -> up, 2 -> right, 3 -> down
        this.clearOldTiles();
        //旋转以进行向左操作
        for (let i = 0; i < direction; ++i) {
            this.cells = rotateLeft(this.cells);
        }
        let hasChanged = this.moveLeft();
        //旋转回原来的方向
        for (let i = direction; i < 4; ++i) {
            this.cells = rotateLeft(this.cells);
        }
        //如果有合并等操作，产生新tile
        if (hasChanged) {
            this.addRandomTile();
        }
        this.setPositions();
        return this;
    }

    moveLeft(){
        let hasChanged = false;
        for (let row = 0; row < BoardModel.size; ++row) {
            let currentRow = this.cells[row].filter(tile => tile.value != 0);//获取每行数据
            let resultRow = [];

            for (let target = 0; target < BoardModel.size; ++target) {
                let targetTile = currentRow.length ? currentRow.shift() : this.addTile();
                if (currentRow.length > 0 && currentRow[0].value == targetTile.value) {
                    let tile1 = targetTile;
                    targetTile = this.addTile(targetTile.value);
                    tile1.mergedInto = targetTile;
                    let tile2 = currentRow.shift();
                    tile2.mergedInto = targetTile;
                    targetTile.value += tile2.value;
                }
                resultRow[target] = targetTile;
                this.won |= (targetTile.value == 2048);
                hasChanged |= (targetTile.value != this.cells[row][target].value);
            }
            this.cells[row] = resultRow;
        }
        return hasChanged;
    }

    clearOldTiles() {
        this.tiles = this.tiles.filter(tile => tile.markForDeletion == false);
        this.tiles.forEach(tile => { tile.markForDeletion = true; });
    }

    hasWon() {
        return this.won;
    };

    hasLost() {
        let canMove = false;
        for (let row = 0; row < BoardModel.size; ++row) {
            for (let col = 0; col < BoardModel.size; ++col) {
                canMove |= (this.cells[row][col].value == 0);
                for (let dir = 0; dir < 4; ++dir) {
                    let newRow = row + BoardModel.deltaX[dir];
                    let newCol = col + BoardModel.deltaY[dir];
                    if (newRow < 0 || newRow >= BoardModel.size || newCol < 0 || newCol >= BoardModel.size) {
                        continue;
                    }
                    canMove |= (this.cells[row][col].value == this.cells[newRow][newCol].value);
                }
            }
        }
        return !canMove;
    }
}

//设置左转矩阵使得moveLeft可以通用各个方向
let rotateLeft = function (matrix) {
    let rows = matrix.length;
    let cols = matrix[0].length;
    let res = [];
    for (let row = 0; row < rows; ++row) {
        res.push([]);
        for (let col = 0; col < cols; ++col) {
            res[row][col] = matrix[col][cols - row - 1];
        }
    }
    return res;
};