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
import OptionsPanel from "../src/components/OptionsPanel";
import { decideAiMove } from "../src/store/decideAiMove";
import { allPieces } from "../src/classes/AllPieces";

export default function Home() {
  const [board, setBoard] = useState(null);
  const dispatch = useDispatch();
  const boardRef = useRef();
  const [gameEnd, setGameEnd] = useState(false);
  const [promotion, setPromotion] = useState();
  const gameState = useSelector((state) => state.board.gameState);
  const gameId = useSelector((state) => state.board.gameId);

  

  let startingCell = null;

  useEffect(() => {
    if (!board) {
      const playingBoard = new Board();
      playingBoard.fillBoard("white");
      playingBoard.createFigures();
      setBoard(playingBoard);
    } else {
      async function makeMove() {
        const xCoords = "87654321";
        const yCoords = "abcdefgh";
        const lastMoveStart = `${yCoords[board.lastMoveStart.y]}${
          xCoords[board.lastMoveStart.x]
        }`;
        const lastMoveEnd = `${yCoords[board.lastMoveEnd.y]}${
          xCoords[board.lastMoveEnd.x]
        }`;

        const resp = await fetch("./api/makeMove", {
          method: "POST",
          body: JSON.stringify({
            gameId: gameId,
            move: `${lastMoveStart}${lastMoveEnd}`,
          }),
          headers: {
            "Content-type": "application/json",
          },
        });
      }
      if(board?.lastMoveStart) makeMove()
      if (board.gameEnd) {
        setGameEnd(board.gameEnd);
      }
    }
  }, [board]);


  useEffect(() => {
    decideAiMove(gameState,board,setBoard,Board)
  }, [gameState]);



  function onClickHandler(e, figure, cell) {
    if (!figure.playerFigure) return;

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
        startingCell,
        setPromotion
      );
      ghostPiece.elem.remove();
      currPiece.removeEventListener(`mouseup`, onMouseUpHandler);
      document.removeEventListener(`mousemove`, onMouseMoveHandler);
    }
  }

  function promote(piece) {
    const newFigure = new allPieces[piece](
      board.playerColor,
      board.cells[promotion.toPlaceCell.x][promotion.toPlaceCell.y],
      true,
      true
    );
    promotion.figure.makeMove(promotion.toPlaceCell,promotion.startCell,false,newFigure)

    setBoard((prevState) => {
      const newBoard = new Board(
        prevState.cells,
        promotion.startCell,
        promotion.toPlaceCell,
        promotion.figure.rank,
        prevState.playerColor
      );
      newBoard.reapplyBoard();
      newBoard.checkForChecks();
      return newBoard;
    });
    setPromotion(null)
  }


  return (
    <div className={styles.app}>
      <OptionsPanel Board={Board} setBoard={setBoard} />
      <div ref={boardRef} className={styles.board}>
        {promotion && board && (
          <div className={styles[`${board?.playerColor || "white"}Promotion`]}>
            <img
              onClick={() => {
                promote("queen");
              }}
              src={piecesImgs[`${board.playerColor}_queen`]}
              alt=""
            />
            <img
              onClick={() => {
                promote("knight");
              }}
              src={piecesImgs[`${board.playerColor}_knight`]}
              alt=""
            />
            <img
              onClick={() => {
                promote("rook");
              }}
              src={piecesImgs[`${board.playerColor}_rook`]}
              alt=""
            />
            <img
              onClick={() => {
                promote("bishop");
              }}
              src={piecesImgs[`${board.playerColor}_bishop`]}
              alt=""
            />
          </div>
        )}

        <BoardComp fn={onClickHandler} board={board} />
      </div>
      {gameEnd && (
        <div className={styles.gameEnd}>
          Игра Окончена! <hr /> Выиграли {gameEnd.winner}
          <img
            src={gameEnd.winner === "чёрные" ? blackWon.src : whiteWon.src}
            alt=""
          />
        </div>
      )}
    </div>
  );
}
