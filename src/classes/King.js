import { Figure } from "./Figure";
export class King extends Figure {
  constructor(color, cell, playerFigure, startingPosition, isChecked) {
    super("king", color, cell, `${color}_king`, startingPosition, isChecked);
    this.playerFigure = playerFigure;
    this.startingPosition = startingPosition;
    this.isChecked = isChecked;
  }

  validateMove(toPlaceCell, isForHighlight, isForLegality) {
    const board = this.cell.board.cells;

    const readyForCastle = this.startingPosition && !this.isChecked;

    const whiteCastling =
      readyForCastle &&
      this.color === "white" &&
      (toPlaceCell === board[7][2] ||
        toPlaceCell === board[7][6] ||
        toPlaceCell === board[7][7] ||
        toPlaceCell === board[7][0]);

    const blackCastling =
      readyForCastle &&
      this.color === "black" &&
      (toPlaceCell === board[0][2] ||
        toPlaceCell === board[0][6] ||
        toPlaceCell === board[0][7] ||
        toPlaceCell === board[0][0]);

    const castling = whiteCastling || blackCastling;



    const xDiff = Math.abs(toPlaceCell.x - this.cell.x);
    const yDiff = Math.abs(toPlaceCell.y - this.cell.y);
    if ((xDiff > 1 || yDiff > 1) && !castling) {
      return isForHighlight || isForLegality ? false : [false];
    }

    const possibleMove =
      (xDiff === 1 && yDiff < 2) || (yDiff === 1 && xDiff < 2 && !castling);

    const standartMove = possibleMove && !toPlaceCell.Figure;

    const takeMove =
      possibleMove &&
      toPlaceCell.figure &&
      toPlaceCell.figure.color !== this.color;

    const castlingMove = castling
      ? this.validateCastling(toPlaceCell, isForHighlight, isForLegality)
      : false;

    if (isForLegality) {
      return standartMove || takeMove || castlingMove.verdict;
    }
    const illegalmove = castlingMove
      ? false
      : this.cell.board.checkForIllegalMoves(toPlaceCell, this);

    if (isForHighlight) {
      return this.getHighlightVerdict(
        toPlaceCell,
        standartMove || castlingMove.standartCastling,
        takeMove || castlingMove.takeCastling,
        illegalmove
      );
    }

    return [
      (standartMove || takeMove || castlingMove.verdict) && !illegalmove,
      castlingMove,
    ];
  }

  validateCastling(toPlaceCell, isForHighlight, isForLegality) {
    let castlingMove = true;

    const board = this.cell.board.cells;

    const opposites = board
      .flat(1)
      .filter((item) => item.figure && item.figure.color !== this.color);

    const longCastle = toPlaceCell.y === 2 || toPlaceCell.y === 0;
    const shortCastle = toPlaceCell.y === 6 || toPlaceCell.y === 7;

    const row = toPlaceCell.x === 7 ? 7 : 0;

    if (longCastle) {
      mainLoop: for (let i = 1; i <= 3; i++) {
        for (let j = 0; j < opposites.length; j++) {
          const verdict = opposites[j].figure.validateMove(
            board[row][i],
            false,
            true
          );
          if (board[row][i].figure || verdict) {
            castlingMove = false;
            break mainLoop;
          }
        }
      }
    } else if (shortCastle) {
      mainLoop2: for (let i = 5; i <= 6; i++) {
        for (let j = 0; j < opposites.length; j++) {
          const verdict = opposites[j].figure.validateMove(
            board[row][i],
            false,
            true
          );
          if (board[row][i].figure || verdict) {
            castlingMove = false;
            break mainLoop2;
          }
        }
      }
    }

    const standartCastling = !toPlaceCell.figure && castlingMove;

    const takeCastling =
      toPlaceCell.figure &&
      toPlaceCell.figure.color === this.color &&
      castlingMove;

    const rookToCastle = shortCastle
      ? board[row][7].figure
      : board[row][0].figure;
    return {
      standartCastling,
      takeCastling,
      shortCastle,
      longCastle,
      rookToCastle,
      verdict: standartCastling || takeCastling,
    };
  }

  makeMove(toPlaceCell, startingCell, castling) {
    if (castling.verdict) {
      startingCell.placeFigure(null);
      const currX = this.color === "white" ? 7 : 0;

      const newToPlaceCell = castling.shortCastle
        ? this.cell.board.cells[currX][6]
        : this.cell.board.cells[currX][2];
      const cellForRook = castling.shortCastle
        ? this.cell.board.cells[currX][5]
        : this.cell.board.cells[currX][3];

      newToPlaceCell.placeFigure(this);
      cellForRook.placeFigure(castling.rookToCastle);
      castling.rookToCastle.cell.placeFigure(null);
      return { newToPlaceCell };
    } else {
      startingCell.placeFigure(null);
      this.cell = toPlaceCell;
      this.cell.placeFigure(this);
    }

    if (this.startingPosition) this.startingPosition = false;
  }
}
