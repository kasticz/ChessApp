import { Figure } from "./Figure";

export class Rook extends Figure {
  constructor(color, cell, playerFigure) {
    super("rook", color, cell, `${color}_rook`);
    this.startingPosition = true;
    this.playerFigure = playerFigure;
  }

  validateMove(toPlaceCell, isForHighlight) {
    const xCoord = toPlaceCell.x;
    const yCoord = toPlaceCell.y;

    if (isForHighlight && xCoord !== this.cell.x && yCoord !== this.cell.y)
      return null;

    let xDirection = true;
    let yDirection = true;

    const direction =
      this.cell.x === toPlaceCell.x ? "x" : this.cell.y === yCoord ? "y" : null;
    if (!isForHighlight) {
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
      xDirection = null;
      yDirection = null;
    }

    const standartMove = (xDirection || yDirection) && !toPlaceCell.figure;
    const takeMove =
      (xDirection || yDirection) &&
      toPlaceCell.figure &&
      toPlaceCell.figure.color !== this.color;

    if (isForHighlight) {
      return this.getHighlightVerdict(toPlaceCell, standartMove, takeMove);
    }

    return [standartMove || takeMove];
  }
}
