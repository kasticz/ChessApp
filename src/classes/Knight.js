import { Figure } from "./Figure";

export class Knight extends Figure {
  constructor(color, cell, playerFigure) {
    super("knight", color, cell, `${color}_knight`);
    this.playerFigure = playerFigure;
  }

  validateMove(toPlaceCell, isForHighlight, isForLegality) {
    if (toPlaceCell === this.cell) return [false];

    const xDiff = Math.abs(toPlaceCell.x - this.cell.x);
    const yDiff = Math.abs(toPlaceCell.y - this.cell.y);

    if (isForHighlight) {
      if (
        xDiff > 2 ||
        yDiff > 2 ||
        xDiff === 0 ||
        yDiff === 0 ||
        xDiff === yDiff
      )
        return false;
    }

    const possibleMove =
      (xDiff === 2 && yDiff === 1) || (xDiff === 1 && yDiff === 2);

    const standartMove = possibleMove && !toPlaceCell.figure;
    const takeMove =
      possibleMove &&
      toPlaceCell.figure &&
      toPlaceCell.figure.color !== this.color;

    if (isForLegality) {
      return standartMove || takeMove;
    }

    const illegalmove = this.cell.board.checkForIllegalMoves(toPlaceCell, this);

    if (isForHighlight) {
      return this.getHighlightVerdict(
        toPlaceCell,
        standartMove,
        takeMove,
        illegalmove
      );
    }

    return [(standartMove || takeMove) && !illegalmove];
  }
}
