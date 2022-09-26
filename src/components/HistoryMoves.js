import { useSelector } from "react-redux";
import { createNotation } from "../store/createNotation";
import Board from "../classes/Board";
import styles from "./HistoryMoves.module.css";
import { Fragment, useEffect, useRef, useState } from "react";

export default function HistoryMoves(props) {
  const gameState = useSelector(state=>state.board.gameState)
  const gameId = useSelector(state=>state.board.gameId)
  const historyRef = useRef(null)
  
  let historyList = null;

  

  if (props.history && props.history.length > 0) {
    const hLength = Math.ceil(props.history.length / 2);
    historyList = [];
    for (let i = 0; i < hLength; i++) {
      historyList.push(i);
    }


    const hWhite = [];
    const hBlack = [];
    props.history.forEach((item, i) => {
      const result = createNotation(
        item.startCell,
        item.toPlaceCell,
        item.figure,
        item.promotionFigure
      );
      i % 2 === 0 ? hWhite.push(result) : hBlack.push(result);
    });

    historyList = historyList
      .map((item, i) => {
        item = [hWhite[i], hBlack[i]];
        return item;
      })
      .map((item, i) => {
        return (
          <div key={Math.random()} className={styles.notationLine}>
            <div className={styles.moveNumber}>{++i}.</div>
            <div className={styles.moveNotation}>
              <img src={item[0].pieceImg} alt="" />
              <div>{item[0].notation}</div>
              {item[0].promImg && <img src={item[0].promImg} alt="" />}
            </div>
            <div className={styles.moveNotation}>
              {item[1]?.pieceImg && <img src={item[1].pieceImg} alt="" />}
              <div>{item[1]?.notation || ""}</div>
              {item[1]?.promImg && <img src={item[1].promImg} alt="" />}
            </div>
          </div>
        );
      });    
      
      

  }

  async function resign(){
    const resp = await fetch("./api/resignGame", {
      method: "POST",
      body: JSON.stringify({gameId}),
      headers: {
        'Content-type': "application/json",
      },
    });
    const data = await resp.json()
    console.log(data)
    props.setBoard((prevState) => {
      const newBoard = new Board(
        prevState.cells,
        null,
        null,
        null,
        prevState.playerColor,
        null,
        null,
        prevState.historyMoves
      );
      newBoard.reapplyBoard();
      newBoard.checkForChecks(true);
      return newBoard;
    });
  }

  useEffect(()=>{
    setTimeout(() => {
      historyRef.current.scrollTo({top:100000,behavior: 'smooth'})  
    }, 70);
  },[props.history])

  

  return (
    <Fragment>
      <button onClick={resign}   className={`${!gameState ? styles.disabled: ''} ${styles.resign} `}>Сдаться</button>
    <div ref={historyRef} className={styles.historyWrapper}>      
      {historyList ? (
        historyList
      ) : (
        <div className={styles.notationLine}>
          <div className={styles.moveNumber}>{1}.</div>
          <div className={styles.moveNotation}>?</div>
          <div className={styles.moveNotation}>?</div>
        </div>
      )}
    </div>
    </Fragment>
  );
}
