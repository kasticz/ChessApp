import { useState, useEffect } from "react";

import styles from "./Clock.module.css";
import { useSelector } from "react-redux";

export default function Clock(props) {
  const incr = useSelector((state) => state.board?.incr);
  const initialTime = useSelector((state) => state.board?.initialTime);
  const moves = useSelector((state) => state.board?.gameState?.moves);
  const gameState = useSelector((state)=>state.board?.gameState)
  const preGameTime = useSelector(state=>state.board?.gameTime)

  const [timeLeft, setTimeLeft] = useState(initialTime || preGameTime || 300);
  const [timePaused, setTimePaused] = useState(true);
  const [timer, setTimer] = useState();

 

  useEffect(()=>{
    if(!gameState && preGameTime){
      setTimeLeft(preGameTime)
    }
  },[preGameTime])

  useEffect(() => {
    const playerTimeActive =
      props.whoToMove === props?.playerColor && props?.side === "player";
    const oppositeTimeActive =
      props?.whoToMove !== props.playerColor && props?.side === "opposite";

    if (moves) {
      const movesLength = moves?.split(` `).length;
      if ((playerTimeActive || oppositeTimeActive) && movesLength >= 2) {

        const tServerPlayer = props.playerColor === 'white' ? gameState.wtime : gameState.btime
        const tServerOpp = props.playerColor === 'white' ? gameState.btime : gameState.wtime
        const serverTime = props.side === 'player' ? tServerPlayer : tServerOpp
        const t = timePaused ? serverTime : null
        setTimePaused(false);
        
        setTimer(
          setTimeout(() => {
            setTimeLeft((prevState) => t ? t - 1 : prevState - 1);
          }, 920)
        );
        
      } else if (!timePaused && movesLength >= 3) {
        if (timer) clearTimeout(timer);
        setTimePaused(true);
        setTimeLeft((prevState) => prevState + incr);
      }
    }
  }, [props.board, timeLeft,initialTime]);

  const minutes = Math.floor(timeLeft / 60);

  const seconds = Math.floor(timeLeft % 60);

  const strMinutes = +minutes < 10 ? `0${minutes}` : minutes;
  const strSeconds = +seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div
      className={`${styles[props.side]} ${
        !timePaused ? styles.timerActive : ""
      }`}
    >{`${strMinutes} : ${strSeconds}`}</div>
  );
}
