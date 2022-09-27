import Cell from "./Cell";
import Colors from "./Colors";
import { Pawn } from "./Pawn";
import { Rook } from "./Rook";
import { Bishop } from "./Bishop";
import { Queen } from "./Queen";
import { Knight } from "./Knight";
import { King } from "./King";
import { allPieces } from "./AllPieces";

export default class Board {
  constructor(cells, lastMoveStart, lastMoveEnd, figureRank,playerColor,whoToMove,promotionFigure,historyMoves,prevBoard) {
    this.cells = cells;
    this.lastMoveStart = lastMoveStart;
    this.lastMoveEnd = lastMoveEnd;
    this.figureRank = figureRank;
    this.playerColor = playerColor || null,
    this.whoToMove = whoToMove
    this.promotionFigure = promotionFigure
    this.historyMoves = historyMoves,
    this.audio = prevBoard?.audio || null
  }

  fillBoard(playerColor) {
    this.cells = [];
    this.playerColor = playerColor
    this.whoToMove = playerColor === 'white' ? 'white' : 'black'
    this.historyMoves = []

    if (this.playerColor === "white") {
      for (let i = 0; i < 8; i++) {
        const row = [];
        for (let j = 0; j < 8; j++) {
          const color = (i + j) % 2 === 0 ? Colors.white : Colors.black;
          row.push(new Cell(i, j, color, this));
        }
        this.cells.push(row);
      }
    }
    if (this.playerColor === "black") {
      for (let i = 0; i < 8; i++) {
        const row = [];
        for (let j = 0; j < 8; j++) {
          const color = (i + j) % 2 === 0 ? Colors.white : Colors.black;
          row.push(new Cell(i, j, color, this));
        }
        this.cells.push(row);
      }
    }
  }
  createFigures() {
    const isPlayingWhite = this.playerColor === "white";
    const isPlayingBlack = this.playerColor === "black";
    this.cells[6].forEach((item) => {
      item.placeFigure(new Pawn("white", item, isPlayingWhite, true));
    });
    this.cells[1].forEach((item) => {
      item.placeFigure(new Pawn("black", item, isPlayingBlack, true));
    });



    this.cells[7][0].placeFigure(
      new Rook("white", this.cells[7][0], isPlayingWhite, true)
    );
    this.cells[7][7].placeFigure(
      new Rook(`white`, this.cells[7][7], isPlayingWhite, true)
    );
    this.cells[0][0].placeFigure(
      new Rook(`black`, this.cells[0][0], isPlayingBlack, true)
    );
    this.cells[0][7].placeFigure(
      new Rook(`black`, this.cells[0][7], isPlayingBlack, true)
    );

    this.cells[7][2].placeFigure(
      new Bishop(`white`, this.cells[7][2], isPlayingWhite)
    );
    this.cells[7][5].placeFigure(
      new Bishop(`white`, this.cells[7][5], isPlayingWhite)
    );
    this.cells[0][2].placeFigure(
      new Bishop(`black`, this.cells[0][2], isPlayingBlack)
    );
    this.cells[0][5].placeFigure(
      new Bishop(`black`, this.cells[0][5], isPlayingBlack)
    );

    this.cells[0][3].placeFigure(
      new Queen(`black`, this.cells[0][3], isPlayingBlack)
    );
    this.cells[7][3].placeFigure(
      new Queen(`white`, this.cells[7][3], isPlayingWhite)
    );

    this.cells[7][1].placeFigure(
      new Knight(`white`, this.cells[7][1], isPlayingWhite)
    );
    this.cells[7][6].placeFigure(
      new Knight(`white`, this.cells[7][6], isPlayingWhite)
    );
    this.cells[0][1].placeFigure(
      new Knight(`black`, this.cells[0][1], isPlayingBlack)
    );
    this.cells[0][6].placeFigure(
      new Knight(`black`, this.cells[0][6], isPlayingBlack)
    );

    this.cells[0][4].placeFigure(
      new King(`black`, this.cells[0][4], isPlayingBlack, true, false)
    );
    this.cells[7][4].placeFigure(
      new King(`white`, this.cells[7][4], isPlayingWhite, true, false)
    );
  }

  reapplyBoard() {
    this.cells.forEach((item) => {
      item.forEach((i) => {
        i.board = this;
        if (i.figure?.enPassantLastMove) {
          i.figure.enPassantLastMove = null;
          i.figure.enPassant = null;
        }
        if (i.figure?.enPassant) i.figure.enPassantLastMove = true;
      });
    });
  }

  checkForIllegalMoves(toPlaceCell, figure) {
    if (
      figure.cell === toPlaceCell ||
      (toPlaceCell.figure && toPlaceCell.figure.color === figure.color)
    )
      return true;

    const cells = figure.cell.board.cells;

    const opposite = cells
      .flat(1)
      .filter((item) => item.figure && item.figure.color !== figure.color);

    const newFigure = new allPieces[figure.rank](
      figure.color,
      this.cells[figure.cell.x][figure.cell.y],
      figure.cell.board.playerColor === figure.color,
      figure.startingPosition,
      figure.isChecked
    );

    const presentFigure = toPlaceCell.figure;

    figure.cell.placeFigure(null);
    toPlaceCell.placeFigure(newFigure);

    const king = cells
      .flat(1)
      .find(
        (item) =>
          item.figure &&
          item.figure.color === figure.color &&
          item.figure.rank === "king"
      );

    let illegalMove = false;

    for (let i = 0; i < opposite.length; i++) {
      const verdict = opposite[i].figure.validateMove(king, false, true);

      if (verdict) {
        illegalMove = true;
        break;
      }
    }

    figure.cell.placeFigure(newFigure);
    toPlaceCell.placeFigure(presentFigure || null);

    return illegalMove;
  }

  checkForChecks(isResign) {
    if(isResign){
      this.gameEnd = {winner:this.playerColor === "white" ? "чёрные" : "белые" }
    }
    const kings = this.cells
      .flat(1)
      .filter((item) => item.figure && item.figure.rank === "king");

    for (let i = 0; i < kings.length; i++) {
      const opposites = this.cells
        .flat(1)
        .filter(
          (item) => item.figure && item.figure.color !== kings[i].figure.color
        );
      subLoop1: for (let j = 0; j < opposites.length; j++) {
        const isInDanger = opposites[j].figure.validateMove(
          kings[i],
          false,
          true
        );
        if (isInDanger) {
          kings[i].figure.isChecked = true;
          break subLoop1;
        }
        kings[i].figure.isChecked = false;
      }
      let hasAnyMove = false
      if (!hasAnyMove) {
        const allCells = this.cells.flat(1);
        const allAlliedFigures = allCells.filter(
          (item) => item.figure && item.figure.color === kings[i].figure.color
        );
        

        subLoop2: for (let n = 0; n < allCells.length; n++) {
          for (let k = 0; k < allAlliedFigures.length; k++) {
            const verdict = allAlliedFigures[k].figure.validateMove(
              allCells[n]
            );
            if (verdict[0]) {             
              hasAnyMove = true;
              break subLoop2;
            }
          }
        }

        if (!hasAnyMove) {
          if(kings[i].figure.isChecked){
            this.gameEnd = {
              winner: kings[i].figure.color === "white" ? "чёрные" : "белые",
            };
            break;
          }else{
            this.gameEnd = {
              winner: 'Пат'
            };

          }

        }
      }
    }
  }
}
