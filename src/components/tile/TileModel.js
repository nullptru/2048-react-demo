/**
 * Created by Burgess on 2017/7/14.
 */

export default class TileModel {
    static id = 0;
    constructor(value, row, column){
        this.value = value || 0;
        this.row = row || -1;
        this.col = column || -1;
        //status
        this.oldRow = -1;
        this.oldCol = -1;

        this.markForDeletion = false;
        this.mergedInto = null;
        this.id = TileModel.id++;
    }

    moveTo(row, col) {
        this.oldRow = this.row;
        this.oldCol = this.col;
        this.row = row;
        this.col = col;
    }

    isNew() {
        return this.oldRow == -1 && !this.mergedInto;
    }

    hasMoved() {
        return (this.fromRow() != -1 && (this.fromRow() != this.toRow() || this.fromCol() != this.toCol())) ||
            this.mergedInto;
    }

    fromRow() {
        return this.mergedInto ? this.row : this.oldRow;
    }

    fromCol() {
        return this.mergedInto ? this.col : this.oldCol;
    }

    toRow() {
        return this.mergedInto ? this.mergedInto.row : this.row;
    }
    toCol() {
        return this.mergedInto ? this.mergedInto.col : this.col;
    }
}