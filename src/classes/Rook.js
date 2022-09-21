import { Figure } from "./Figure";

export class Rook extends Figure {
  constructor(color, cell, playerFigure,startingPosition) {
    super("rook", color, cell, `${color}_rook`);
    this.playerFigure = playerFigure;
    this.startingPosition = startingPosition
  }

  validateMove(toPlaceCell, isForHighlight, isForLegality) {
    const xCoord = toPlaceCell.x;
    const yCoord = toPlaceCell.y;

    if (isForHighlight && xCoord !== this.cell.x && yCoord !== this.cell.y)
      return false;

    let xDirection = true;
    let yDirection = true;

    const direction =
      this.cell.x === toPlaceCell.x ? "x" : this.cell.y === yCoord ? "y" : false;
    if (!isForHighlight && !isForLegality) {
      if (!direction || (xCoord === this.cell.x && yCoord === this.cell.y))
        return [false];
    }

    if (direction === "y") {
      yDirection = false;

      let count = xCoord > this.cell.x ? this.cell.x : xCoord;
      const endCount = count === xCoord ? this.cell.x : xCoord;

      for (let i = count + 1; i < endCount; i++) {
        if (this.cell.board.cells[i][this.cell.y].figure) {
          xDirection = false;
          break;
        }
      }
    }

    if (direction === "x") {
      xDirection = false;

      let count = yCoord > this.cell.y ? this.cell.y : yCoord;
      const endCount = count === yCoord ? this.cell.y : yCoord;

      for (let i = count + 1; i < endCount; i++) {
        if (this.cell.board.cells[this.cell.x][i].figure) {
          yDirection = false;
          break;
        }
      }
    }
    if (!direction) {
      xDirection = false;
      yDirection = false;
    }

    const standartMove = (xDirection || yDirection) && !toPlaceCell.figure;
    const takeMove =
      (xDirection || yDirection) &&
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
