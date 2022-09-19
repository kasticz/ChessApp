import { Figure } from "./Figure";

export class Bishop extends Figure {
  constructor(color, cell, playerFigure) {
    super("bishop", color, cell, `${color}_bishop`);
    this.playerFigure = playerFigure;
  }

  validateMove(toPlaceCell, isForHighlight) {
    const xCoord = toPlaceCell.x;
    const yCoord = toPlaceCell.y;

    const board = this.cell.board.cells;

    if (
      this.cell.color !== toPlaceCell.color ||
      Math.abs(xCoord - this.cell.x) !== Math.abs(yCoord - this.cell.y) ||
      toPlaceCell === this.cell
    ) {
      return isForHighlight ? false : [false];
    }

    const minXCell = toPlaceCell.x > this.cell.x ? this.cell : toPlaceCell;
    const maxXCell = minXCell === toPlaceCell ? this.cell : toPlaceCell;
    const yDirection = minXCell.y > maxXCell.y ? "-" : "+";

    let noFiguresOnThePath = true;

    let count = 0;

    for (let i = minXCell.x; i <= maxXCell.x; i++) {
      const xToCheck = minXCell.x + count;
      const yToCheck =
        yDirection === "+" ? minXCell.y + count : minXCell.y - count;

      if (
        board[xToCheck][yToCheck].figure &&
        board[xToCheck][yToCheck] !== this.cell &&
        board[xToCheck][yToCheck] !== toPlaceCell
      ) {
        noFiguresOnThePath = false;
        break;
      }

      count++;
    }

    const standartMove = noFiguresOnThePath && !toPlaceCell.figure;

    const takeMove =
      noFiguresOnThePath &&
      toPlaceCell.figure &&
      toPlaceCell.figure.color !== this.color;

    if (isForHighlight) {
      return this.getHighlightVerdict(toPlaceCell, standartMove, takeMove);
    }

    return [standartMove || takeMove];
  }
}
