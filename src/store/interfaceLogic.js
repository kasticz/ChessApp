import Board from "../classes/Board";
import { boardActions } from "./store";
import styles from '../board.module.css'

let lastCell = null;
export function pieceMoveHandler(
  e,
  startingCoords,
  currPiece,
  board,
) {
  if ( e.buttons === 1) {
    currPiece.style.transform = `translate( ${
      e.clientX - 45 - startingCoords.x
    }px, ${e.clientY - 45 - startingCoords.y}px)`;
    currPiece.style.zIndex = "1000";

    currPiece.style.display = "none";
    const cellUnder = document
      .elementFromPoint(e.clientX, e.clientY)
      ?.closest("[data-type = cell]");
    currPiece.style.display = "block";

    if (!lastCell) lastCell = cellUnder;

    if (cellUnder) {
      const cellUnderInBoard =
        board.cells[cellUnder?.dataset?.x][cellUnder?.dataset?.y];
      if (lastCell && lastCell !== cellUnder) {
        const lastCellInBoard =
          board.cells[lastCell.dataset.x][lastCell.dataset.y];

        if (lastCell.classList.contains(styles.dotHighlight)) {
          lastCell.classList.remove(styles.greenblack);
        }
        if (
          lastCell.classList.contains(styles[`green${lastCellInBoard.color}`])
        ) {
          lastCell.classList.remove(styles[`green${lastCellInBoard.color}`]);
          lastCell.classList.add(
            styles[`takeHighlight${lastCellInBoard.color}`]
          );
        }
        lastCell = cellUnder;
      } else {
        if (!lastCell) lastCell = cellUnder;
        if (lastCell.classList.contains(styles.dotHighlight)) {
          cellUnder.classList.add(styles.greenblack);
        }
        if (
          lastCell.classList.contains(
            styles[`takeHighlight${cellUnderInBoard.color}`]
          )
        ) {
          cellUnder.classList.remove(
            styles[`takeHighlight${cellUnderInBoard.color}`]
          );
          cellUnder.classList.add(styles[`green${cellUnderInBoard.color}`]);
        }
      }
    }
  }else{
    currPiece.style.zIndex = "100";
    currPiece.style.position = "static";
    currPiece.style.transform = "none";
  }
}

export function endMoveHandler(
  e,
  currPiece,
  board,
  figure,
  cell,
  setBoard,
  dispatch,
  boardRef,
  startingCell
) {
  currPiece.style.zIndex = "100";
  currPiece.style.position = "static";
  currPiece.style.transform = "none";

  currPiece.style.display = "none";
  const cellUnder = document
    .elementFromPoint(e.clientX, e.clientY)
    ?.closest("[data-type = cell]");
  currPiece.style.display = "block";
  if(!cellUnder) return
  const cellCoords = { x: +cellUnder.dataset.x, y: +cellUnder.dataset.y };

  const cellInBoard = board.cells[cellCoords.x][cellCoords.y];
  
  const validationResult = figure.validateMove(cellInBoard);

  
  

  if (validationResult[0]) {
    const castlingCheck = figure.makeMove(cellInBoard, cell,validationResult[1]); 
    dispatch(boardActions.setToHighlightCells([]));
    setBoard((prevState) => {
      const newBoard = new Board(prevState.cells,cell, castlingCheck?.newToPlaceCell || cellInBoard);
      newBoard.reapplyBoard()
      newBoard.checkForChecks()
      return newBoard;
    });
  }


  
  boardRef.current.addEventListener(`mousedown`,withoudDraggingHandler)
  

  function withoudDraggingHandler(e){
    boardRef.current.removeEventListener(`mousedown`,withoudDraggingHandler)
    const cell = e.target.closest("[data-type = cell]")?.classList;
    const isActive =
      cell.contains(styles.dotHighlight) ||
      cell.contains(styles.greenblack) ||
      cell.contains(styles.takeHighlightblack) ||
      cell.contains(styles.takeHighlightwhite);

      if(startingCell && startingCell.classList.contains(styles.selfHighlightblack)){
        startingCell.classList.remove(styles.selfHighlightblack)
      }
      if(startingCell && startingCell.classList.contains(styles.selfHighlightwhite)){
        startingCell.classList.remove(styles.selfHighlightwhite)
      }

    if(!isActive){

        dispatch(boardActions.setToHighlightCells([]))
    } else{
        endMoveWithoutDragging(e,figure,setBoard,figure.cell,dispatch)
    }

  }

  
}

export function makeGhostPiece(image, piecesImgs, ghostStyle) {
  const ghostPiece = new Image(100, 100);
  ghostPiece.src = piecesImgs[image];
  ghostPiece.classList.add(ghostStyle);
  ghostPiece.draggable = false;

  return { appended: false, elem: ghostPiece };
}

function endMoveWithoutDragging(e, figure, setBoard, startingCell, dispatch) {
  const cell = e.target?.closest("[data-type = cell]");
  const toPlaceCell = figure.cell.board.cells[cell.dataset.x][cell.dataset.y];

  const validation = figure.validateMove(toPlaceCell);

  if (validation[0]) {
    const castlingCheck = figure.makeMove(toPlaceCell, startingCell,validation[1]);
    console.log(castlingCheck)
    setBoard((prevState) => {
      const newBoard = new Board(prevState.cells,startingCell, castlingCheck?.newToPlaceCell || toPlaceCell);
      newBoard.reapplyBoard()
      newBoard.checkForChecks()
      return newBoard;
    });
  }
  dispatch(boardActions.setToHighlightCells([]))
}
