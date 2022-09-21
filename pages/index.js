import { useDispatch, useSelector } from "react-redux";
import Board from "../src/classes/Board";
import BoardComp from "../src/components/BoardComp";
import { useState, useEffect, useRef } from "react";
import { piecesImgs } from "../src/PiecesImgs";
import { boardActions } from "../src/store/store";
import {
  endMoveHandler,
  makeGhostPiece,
  pieceMoveHandler,
} from "../src/store/interfaceLogic";
import blackWon from "../src/assets/UI/blackWon.webp";
import whiteWon from "../src/assets/UI/whiteWon.webp";
import styles from "../src/board.module.css";

export default function Home() {
  const [board, setBoard] = useState(null);
  const dispatch = useDispatch();
  const boardRef = useRef();
  const [gameEnd, setGameEnd] = useState(false);

  let startingCell = null;

  useEffect(() => {
    if (!board) {
      const playingBoard = new Board();
      playingBoard.fillBoard();
      playingBoard.createFigures();
      setBoard(playingBoard);
    } else {
      if (board.gameEnd) {
        setGameEnd(board.gameEnd);
      }
    }
  }, [board]);

  function onClickHandler(e, figure, cell) {
    // if (!figure.playerFigure) return;

    if (
      startingCell &&
      startingCell.classList.contains(styles.selfHighlightblack)
    ) {
      startingCell.classList.remove(styles.selfHighlightblack);
    }
    if (
      startingCell &&
      startingCell.classList.contains(styles.selfHighlightwhite)
    ) {
      startingCell.classList.remove(styles.selfHighlightwhite);
    }

    const currPiece = e.target;
    const startingCoords = { x: e.target.x, y: e.target.y };
    startingCell = document
      .elementFromPoint(e.clientX, e.clientY)
      .closest("[data-type = cell]");
    document.addEventListener(`mousemove`, onMouseMoveHandler);
    currPiece.addEventListener(`mouseup`, onMouseUpHandler);

    if (!startingCell.classList.contains(styles[`${cell.color}lastmove`])) {
      startingCell.classList.add(styles[`selfHighlight${cell.color}`]);
    }

    const ghostPiece = makeGhostPiece(figure.image, piecesImgs, styles.ghost);
    startingCell.append(ghostPiece.elem);

    currPiece.style.transform = `translate( ${
      e.clientX - 45 - startingCoords.x
    }px, ${e.clientY - 45 - startingCoords.y}px)`;
    currPiece.style.zIndex = "1000";

    const toHighlight = figure.getHighlightedCells();
    dispatch(boardActions.setToHighlightCells(toHighlight));

    function onMouseMoveHandler(e) {
      pieceMoveHandler(e, startingCoords, currPiece, board);
    }

    function onMouseUpHandler(e) {
      endMoveHandler(
        e,
        currPiece,
        board,
        figure,
        cell,
        setBoard,
        dispatch,
        boardRef,
        startingCell
      );
      ghostPiece.elem.remove();
      currPiece.removeEventListener(`mouseup`, onMouseUpHandler);
      document.removeEventListener(`mousemove`, onMouseMoveHandler);
    }
  }

  return (
    <div className={styles.app}>
      <div ref={boardRef} className={styles.board}>
        <BoardComp fn={onClickHandler} board={board} />
      </div>
      {gameEnd && (
        <div className={styles.gameEnd}>
          Игра Окончена! <hr /> Выиграли {gameEnd.winner}{" "}
          <img
            src={gameEnd.winner === "чёрные" ? blackWon.src : whiteWon.src}
            alt=""
          />
        </div>
      )}
    </div>
  );
}
