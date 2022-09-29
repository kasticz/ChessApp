import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

import styles from "./Clock.module.css";
import { useSelector } from "react-redux";

export default function Clock(props) {
  const incr = useSelector((state) => state.board?.incr);
  const moves = useSelector((state) => state.board?.gameState?.moves);
  const gameState = useSelector((state) => state.board?.gameState);
  const preGameTime = useSelector((state) => state.board?.gameTime);
  const [id] = useCookies(["gameId"]);

  const tServerPlayer =
    props.playerColor === "white" ? gameState?.wtime : gameState?.btime;
  const tServerOpp =
    props.playerColor === "white" ? gameState?.btime : gameState?.wtime;
  const serverTime = props.side === "player" ? tServerPlayer : tServerOpp;

  const [timeLeft, setTimeLeft] = useState(serverTime || preGameTime || 300);
  const [timePaused, setTimePaused] = useState(true);
  const [timer, setTimer] = useState();

  useEffect(() => {
    if (!gameState && preGameTime && !id.gameId) {
      setTimeLeft(preGameTime);
    }
  }, [preGameTime]);

  useEffect(() => {
    const playerTimeActive =
      props.whoToMove === props?.playerColor && props?.side === "player";
    const oppositeTimeActive =
      props?.whoToMove !== props.playerColor && props?.side === "opposite";

    if (moves) {
      const movesLength = moves?.split(` `).length;
      if ((playerTimeActive || oppositeTimeActive) && movesLength >= 2) {
        if (timer) clearTimeout(timer);

        const tServerPlayer =
          props.playerColor === "white" ? gameState.wtime : gameState.btime;
        const tServerOpp =
          props.playerColor === "white" ? gameState.btime : gameState.wtime;
        const serverTime = props.side === "player" ? tServerPlayer : tServerOpp;
        const t = timePaused ? serverTime : null;
        setTimePaused(false);

        setTimer(
          setTimeout(() => {
            setTimeLeft((prevState) => (t ? t - 1 : prevState - 1));
          }, 920)
        );
      } else if (!timePaused && movesLength >= 3) {
        if (timer) clearTimeout(timer);
        setTimePaused(true);
        setTimeLeft((prevState) => prevState + incr);
      }
    }
  }, [props.board, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);

  const seconds = Math.floor(timeLeft % 60);

  const strMinutes = +minutes < 10 ? `0${minutes}` : minutes;
  const strSeconds = +seconds < 10 ? `0${seconds}` : seconds;

  const tShouldBeActive =
    (props.whoToMove === props.playerColor && props.side === "player") ||
    (props.whoToMove !== props.playerColor && props.side === "opposite");

  return (
    <div
      className={`${styles[props.side]} ${
        tShouldBeActive ? styles.timerActive : ""
      }`}
    >{`${strMinutes} : ${strSeconds}`}</div>
  );
}
