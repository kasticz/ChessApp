import { Figure } from "./Figure";

export class Pawn extends Figure {
  constructor(color, cell) {
    super("pawn", color, cell, `${color}_pawn`);
    this.startingPosition = true;
  }

  validateMove(toPlacecell, isForHighlight) {

    const verticalDiff = this.color === 'white' ? this.cell.x - toPlacecell.x :  toPlacecell.x - this.cell.x;
    const horizontalDiff = Math.abs(this.cell.y - toPlacecell.y);

    if(isForHighlight){      
      if(Math.abs(verticalDiff) > 2 || (horizontalDiff > 0 && Math.abs(verticalDiff) > 1) || horizontalDiff > 1 || verticalDiff <= 0){
        return null
      } 
    }
    const board = this.cell.board.cells



    let enPassantXCoord = toPlacecell.x - (this.color === 'white' ? -1 : 1)



    

    const standartMove =
      verticalDiff === 1 && horizontalDiff === 0 && !toPlacecell.figure;

    const takeMove =
      verticalDiff === 1 &&
      horizontalDiff === 1 &&
      toPlacecell.figure &&
      toPlacecell.figure.color !== this.color;


    const enPassantMove =
      toPlacecell.board.cells[enPassantXCoord][toPlacecell.y]?.figure
        ?.enPassant &&
      verticalDiff === 1 &&
      (toPlacecell.y - this.cell.y === 1 || this.cell.y - toPlacecell.y === 1);

    const twoCellsMove =
      verticalDiff === 2 && horizontalDiff === 0 && this.startingPosition;

    if (isForHighlight) {
      const coordsToHighlight = {
        x: toPlacecell.x,
        y: toPlacecell.y,
        type: null,
      };
      if (standartMove || twoCellsMove || enPassantMove) coordsToHighlight.type = "dotHighlight";
      if ( takeMove)
        coordsToHighlight.type = `takeHighlight${toPlacecell.color}`;

      return coordsToHighlight;
    }



    if (twoCellsMove && !isForHighlight) this.enPassant = true;

    if(enPassantMove) {
      board[toPlacecell.x - (this.color === 'white' ? -1 : 1)][toPlacecell.y].placeFigure(null)
    }
    if(takeMove){
      toPlacecell.placeFigure(null) }
      
    return standartMove || twoCellsMove || enPassantMove || takeMove
  }
  makeMove(toPlaceCell, startingCell) {
    this.cell = toPlaceCell;
    this.cell.placeFigure(this);
    this.cell.board.cells[+startingCell.x][+startingCell.y].placeFigure(null);

    if (this.startingPosition) this.startingPosition = false;
  }

  getHighlightedCells() {
    const allCells = this.cell.board.cells.flat(1);

    const toHighlight = [
      { x: this.cell.x, y: this.cell.y, type: "selfHighlight" },
    ];

    allCells.forEach((item) => {
      const verdict = this.validateMove(item, true);
      if (verdict?.type){
        toHighlight.push(verdict);
      } 
    });
    return toHighlight;
  }
}
