import Cell from "./Cell";
import Colors from "./Colors";
import { Pawn } from "./Pawn";
import { Rook } from "./Rook";
import { Bishop } from "./Bishop";

export default class Board {
  constructor(cells, lastMoveStart, lastMoveEnd) {
    this.cells = cells;
    this.lastMoveStart = lastMoveStart;
    this.lastMoveEnd = lastMoveEnd;
  }

  fillBoard() {
    this.cells = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        const color = (i + j) % 2 === 1 ? Colors.white : Colors.black;
        row.push(new Cell(i, j, color, this));
      }
      this.cells.push(row);
    }
  }
  createFigures() {
    this.cells[6].forEach((item) => {
      item.placeFigure(new Pawn("white", item, true));
    });
    this.cells[1].forEach((item) => {
      item.placeFigure(new Pawn("black", item));
    });

    this.cells[7][0].placeFigure(new Rook(`white`,this.cells[7][0],true))
    this.cells[7][7].placeFigure(new Rook(`white`,this.cells[7][7],true))
    this.cells[0][0].placeFigure(new Rook(`black`,this.cells[0][0],true))
    this.cells[0][7].placeFigure(new Rook(`black`,this.cells[0][7],true))

    this.cells[5][2].placeFigure(new Bishop(`white`,this.cells[5][2],true))
    this.cells[5][5].placeFigure(new Bishop(`white`,this.cells[5][5],true))
    this.cells[2][2].placeFigure(new Bishop(`black`,this.cells[2][2],true))
    this.cells[2][5].placeFigure(new Bishop(`black`,this.cells[2][5],true))

    //    const white_rooks =  [this.cells[7][0],this.cells[7][7]]
    //    white_rooks.forEach(item=>item.placeContent('white_rook'))
    //    const black_rooks =  [this.cells[0][0],this.cells[0][7]]
    //    black_rooks.forEach(item=>item.placeContent('black_rook'))

    //    const white_bishops = [this.cells[0][2],this.cells[0][5]]
    //    white_bishops.forEach(item=>item.placeContent('white_bishop'))
    //    const black_bishops = [this.cells[7][2],this.cells[7][5]]
    //    black_bishops.forEach(item=>item.placeContent('black_bishop'))

    //    const white_knights = [this.cells[0][1],this.cells[0][6]]
    //    white_knights.forEach(item=>item.placeContent('white_knight'))
    //    const black_knights = [this.cells[7][1],this.cells[7][6]]
    //    black_knights.forEach(item=>item.placeContent('black_knight'))

    //    this.cells[0][3].placeContent('white_king')
    //    this.cells[7][3].placeContent('black_king')

    //    this.cells[0][4].placeContent('white_queen')
    //    this.cells[7][4].placeContent('black_queen')
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
}
