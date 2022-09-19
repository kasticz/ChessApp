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
import styles from "../src/board.module.css";

export default function Home() {
  const [board, setBoard] = useState(null);
  const dispatch = useDispatch();
  const boardRef = useRef();

  let startingCell=null

  useEffect(() => {
    if (!board) {
      const playingBoard = new Board();
      playingBoard.fillBoard();
      playingBoard.createFigures();
      setBoard(playingBoard);
    } else {
    
    }
  }, [board]);

  function onClickHandler(e, figure, cell) {
    // if (!figure.playerFigure) return;

    if(startingCell && startingCell.classList.contains(styles.greenblack)){
      startingCell.classList.remove(styles.greenblack)
    }
    if(startingCell && startingCell.classList.contains(styles.greenwhite)){
      startingCell.classList.remove(styles.greenwhite)
    }

    const currPiece = e.target;
    const startingCoords = { x: e.target.x, y: e.target.y };
     startingCell = document
      .elementFromPoint(e.clientX, e.clientY)
      .closest("[data-type = cell]");
      document.addEventListener(`mousemove`, onMouseMoveHandler);
    currPiece.addEventListener(`mouseup`, onMouseUpHandler);

    // console.log(startingCell)

    if(!startingCell.classList.contains(styles[`${cell.color}lastmove`])){
      startingCell.classList.add(styles[`green${cell.color}`]);
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
      );
      ghostPiece.elem.remove();
      currPiece.removeEventListener(`mouseup`, onMouseUpHandler);
      document.removeEventListener(`mousemove`, onMouseMoveHandler);
    }
  }



  return (
    <div className="App">
      <div ref={boardRef} className={styles.board}>
        <BoardComp fn={onClickHandler} board={board} />
      </div>
    </div>
  );
}
