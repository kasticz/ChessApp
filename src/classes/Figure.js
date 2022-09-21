export class Figure {
  constructor(rank, color, cell, image) {
    this.rank = rank;
    this.color = color;
    this.cell = cell;
    this.avaliable = true;
    this.image = image;
  }

  getHighlightedCells() {
    const allCells = this.cell.board.cells.flat(1);

    const toHighlight = [
      { x: this.cell.x, y: this.cell.y, type: "selfHighlight" },
    ];

    allCells.forEach((item) => {
      const verdict = this.validateMove(item, true);
      if (verdict?.type) {
        toHighlight.push(verdict);
      }
    });
    return toHighlight;
  }

  makeMove(toPlaceCell, startingCell) {
    startingCell.placeFigure(null);
    this.cell = toPlaceCell;
    this.cell.placeFigure(this);
    

    if (this.startingPosition) this.startingPosition = false;
  }

  getHighlightVerdict(
    toPlaceCell,
    dotHighlightCondition,
    takeHighlightCondition,
    checkIllegal
  ) {
    const coordsToHighlight = {
      x: toPlaceCell.x,
      y: toPlaceCell.y,
      type: null,
    };


    if (dotHighlightCondition && !checkIllegal) coordsToHighlight.type = "dotHighlight";
    if (takeHighlightCondition && !checkIllegal) coordsToHighlight.type = `takeHighlight${toPlaceCell.color}`;

    return coordsToHighlight;
  }



}
