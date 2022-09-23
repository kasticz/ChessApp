export function decideAiMove(gameState, board, setBoard, Board) {
  if (board?.lastMoveStart || board?.playerColor === 'black') {
    const xCoords = "87654321";
    const yCoords = "abcdefgh";
    const lastMoveStart = board.lastMoveStart ? `${yCoords[board.lastMoveStart.y]}${
      xCoords[board.lastMoveStart.x]
    }` : "";
    const lastMoveEnd = board.lastMoveStart ? `${yCoords[board.lastMoveEnd.y]}${
      xCoords[board.lastMoveEnd.x]
    }` : "";
    const lastMove = `${lastMoveStart}${lastMoveEnd}`;

    const gameLastMove = gameState.lastMove || gameState.state.moves


    if (gameLastMove && gameLastMove !== lastMove) {
      const startingCell = gameLastMove.slice(0, 2);
      const endCell = gameLastMove.slice(2);

      const startingCellInBoard =
        board.cells[Math.abs(+startingCell[1] - 8)][
          +yCoords.indexOf(startingCell[0])
        ];
      const endCellInBoard =
        board.cells[Math.abs(+endCell[1] - 8)][+yCoords.indexOf(endCell[0])];
      const figureRank = startingCellInBoard.figure.rank;

      let specialMoveCheck =
        figureRank === "king"
          ? startingCellInBoard.figure.validateMove(endCellInBoard)
          : figureRank === "pawn"
          ? startingCellInBoard.figure.validateMove(endCellInBoard)
          : null;



      const castlingCheck = startingCellInBoard.figure.makeMove(
        endCellInBoard,
        startingCellInBoard,
        specialMoveCheck &&  specialMoveCheck[1] ? specialMoveCheck[1] : undefined
      );

      setBoard((prevState) => {
        const newBoard = new Board(
          prevState.cells,
          startingCellInBoard,
          castlingCheck?.newToPlaceCell || endCellInBoard ,
          figureRank,
          prevState.playerColor
        );
        newBoard.reapplyBoard();
        newBoard.checkForChecks();
        return newBoard;
      });
    }
  }
}
