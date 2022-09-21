import { Figure } from "./Figure";
import { Rook } from "./Rook";
import { Bishop } from "./Bishop";

export class Queen extends Figure {
  constructor(color, cell, playerFigure) {
    super("queen", color, cell, `${color}_queen`);
    this.playerFigure = playerFigure;
  }

  validateMove(toPlaceCell, isForHighlight,isForLegality) {
    const board = this.cell.board.cells;

    this.cell.placeFigure(
      new Bishop(this.color, board[this.cell.x][this.cell.y], true)
    );

    const bishopMovesVerdict = this.cell.figure.validateMove(
      toPlaceCell,
      isForHighlight,
      isForLegality
    );

    this.cell.placeFigure(
      new Rook(this.color, board[this.cell.x][this.cell.y], true)
    );

    const rookMovesVerdict = this.cell.figure.validateMove(
      toPlaceCell,
      isForHighlight,
      isForLegality
    );

    this.cell.placeFigure(
      new Queen(this.color, board[this.cell.x][this.cell.y], true)
    );

    if (isForLegality) {
      return bishopMovesVerdict || rookMovesVerdict;
    }

    const illegalmove = this.cell.board.checkForIllegalMoves(toPlaceCell, this);

    if (isForHighlight) return bishopMovesVerdict || rookMovesVerdict;
 

    return [(bishopMovesVerdict[0] || rookMovesVerdict[0]) && !illegalmove];
  }
}
