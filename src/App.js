import Board from "./classes/Board";
import styles from "./board.module.css";

import React, { useEffect, useState } from "react";
import BoardComp from "./components/BoardComp";
import "./App.css";
import { useDispatch } from "react-redux";
import { boardActions } from "./store/store";
import { piecesImgs } from "./PiecesImgs";

function App() {
  const [board, setBoard] = useState(null);
  const dispatch = useDispatch()



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
    const currPiece = e.target;
    const startingCoords = { x: e.target.x, y: e.target.y };
    const startingCell = document
    .elementFromPoint(e.clientX, e.clientY)
    .closest("[data-type = cell]");
    currPiece.style.display = 'block'

    let ghostImgAppended = false
    const ghostPiece = new Image(100,100)    
    ghostPiece.src = piecesImgs[figure.image]
    ghostPiece.classList.add(styles.ghost)
    ghostPiece.draggable = false
    
    

    

    const toHighlight = figure.getHighlightedCells()
    dispatch(boardActions.setToHighlightCells(toHighlight))

    





    
    let lastCell

    function onMouseMoveHandler(e) {
      if(!ghostImgAppended) startingCell.append(ghostPiece)
      if (e.target === currPiece && e.buttons === 1) {
        currPiece.style.transform = `translate( ${
          e.clientX - 45 - startingCoords.x
        }px, ${e.clientY - 45 - startingCoords.y}px)`;        
        currPiece.style.zIndex = "1000";


        currPiece.style.display = 'none'
        const cellUnder = document
        .elementFromPoint(e.clientX, e.clientY)
        .closest("[data-type = cell]");
        currPiece.style.display = 'block'

        const cellUnderInBoard = board.cells[cellUnder.dataset.x][cellUnder.dataset.y];
    


        if (lastCell && lastCell !== cellUnder){
          const lastCellInBoard = board.cells[lastCell.dataset.x][lastCell.dataset.y]
      
          if(lastCell.classList.contains(styles.dotHighlight)){
            lastCell.classList.remove(styles[`greenblack`])
          }
          if(lastCell.classList.contains(styles[`green${lastCellInBoard.color}`])){
            lastCell.classList.remove(styles[`green${lastCellInBoard.color}`])
            lastCell.classList.add(styles[`takeHighlight${lastCellInBoard.color}`])
          }
          lastCell = cellUnder          
        }else{
            if(!lastCell) lastCell = cellUnder           
          if(lastCell.classList.contains(styles.dotHighlight)){
            cellUnder.classList.add(styles[`greenblack`])
          }
          if(lastCell.classList.contains(styles[`takeHighlight${cellUnderInBoard.color}`])){            
            cellUnder.classList.remove(styles[`takeHighlight${cellUnderInBoard.color}`])
            cellUnder.classList.add(styles[`green${cellUnderInBoard.color}`])
          }
        }      
      }      
    }

    function onMouseUpHandler(e) {
      currPiece.style.zIndex = "100";
      currPiece.style.position = "static";
      currPiece.style.transform = "none";

      currPiece.style.display = "none";
      const cellUnder = document
        .elementFromPoint(e.clientX, e.clientY)
        .closest("[data-type = cell]");
      currPiece.style.display = "block";
      const cellCoords = { x: +cellUnder.dataset.x, y: +cellUnder.dataset.y };

      const cellInBoard = board.cells[cellCoords.x][cellCoords.y];

      const validationResult = figure.validateMove(cellInBoard);
     

      if (validationResult) {        
        figure.makeMove(cellInBoard, cell);
        dispatch(boardActions.setToHighlightCells([]))
        setBoard((prevState) => {
          const newState = prevState;
          newState.lastCellСoords = { x: cell.x, y: cell.y };
          newState.changedCellCoords = { x: cellInBoard.x, y: cellInBoard.y };
          const newBoard = new Board(newState.cells, newState.lastCellСoords);
          return newBoard;
        });
      }
      
      ghostPiece.remove()
      currPiece.removeEventListener(`mouseup`, onMouseUpHandler);
      currPiece.removeEventListener(`mousemove`, onMouseMoveHandler);
    }
    currPiece.addEventListener(`mousemove`, onMouseMoveHandler);
    currPiece.addEventListener(`mouseup`, onMouseUpHandler);
  }



  return (
    <div className="App">
      <div className={styles.board}><BoardComp fn={onClickHandler} board={board}/></div>
    </div>
  );
}

export default App;
