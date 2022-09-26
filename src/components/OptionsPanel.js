import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { boardActions } from "../store/store";
import whiteKing from "../assets/pieces/white_king.svg";
import halfKing from "../assets/pieces/halfKing.svg";
import blackKing from "../assets/pieces/black_king.svg";
import styles from "./OptionsPanel.module.css";

export default function OptionsPanel(props) {
  const [aiExpanded, setAiExpanded] = useState(false);
  const [side, setSide] = useState(null);
  const [diff, seDiff] = useState(null);
  const [timeStart, setTimeStart] = useState(null);
  const [timeIncr, setTimeIncr] = useState(null);

  const gameId = useSelector((state) => state.board.gameId);

  const dispatch = useDispatch();



  async function startGame() {
    const resp = await fetch("./api/startGame", {
      method: "POST",
      body: JSON.stringify({
        level: diff ? diff : 3,
        clock: {
          limit: timeStart ? timeStart * 60 : 300,
          increment: timeIncr !== null ? timeIncr : 3,
        },
        color: side ? side : "random",
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await resp.json();

    dispatch(boardActions.setGameId(data.id));

 
    const playingBoard = new props.Board();
    playingBoard.fillBoard(side || "white");
    playingBoard.createFigures();
    props.setBoard(playingBoard);
  }

  useEffect(()=>{
    async function startGameStream(){
      const response = fetch(
        `https://lichess.org/api/bot/game/stream/${gameId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer lip_iv6D0kHd9JYpjZFICZXJ",
          },
        }
      );
  
      const readStream = (processLine) => (response) => {
        const stream = response.body.getReader();
        const matcher = /\r?\n/;
        const decoder = new TextDecoder();
        let buf = "";
  
        const loop = () =>
          stream.read().then(({ done, value }) => {
            if (done) {
              if (buf.length > 0) processLine(JSON.parse(buf));
            } else {
              const chunk = decoder.decode(value, {
                stream: true,
              });
              buf += chunk;
  
              const parts = buf.split(matcher);
              buf = parts.pop();
              for (const i of parts.filter((p) => p)) processLine(JSON.parse(i));
              return loop();
            }
          });
  
        return loop();
      };
      const onMessage = (obj) => dispatch(boardActions.setGameState(obj));
      const onComplete = () =>{
        dispatch(boardActions.setGameState(null))
        dispatch(boardActions.setGameId(null))

      } ;
  
      response.then(readStream(onMessage)).then(onComplete);
    }
    if(gameId) startGameStream()

    

  },[gameId])

  useEffect(()=>{
    dispatch(boardActions.setGameTime(timeStart))
  },[timeStart])

  return (
    <div className={styles.optionsPanel}>
      <div
        style={{ height: `${aiExpanded ? 760 : 60}px` }}
        className={styles.gameWithAi}
      >
        <button
          onClick={() => {
            setAiExpanded(!aiExpanded);
          }}
          className={styles.expandButton}
        >
          Игра с компьютером
        </button>
        <Fragment>
          <div className={styles.optionsBlock}>
            <div className={styles.optionsTitle}>Я хочу играть </div>
            <div className={styles.sideOptions}>
              <button
                onClick={() => {
                  setSide("white");
                }}
                className={`${styles.sideOption} ${
                  side === "white" ? styles.sideOptionPicked : ""
                }`}
              >
                <img src={whiteKing.src} alt="" />
                <div className={styles.siteSubtitle}>Белыми</div>
              </button>
              <button
                onClick={() => {
                  setSide("random");
                }}
                className={`${styles.sideOption} ${
                  side === "random" ? styles.sideOptionPicked : ""
                }`}
              >
                <img src={halfKing.src} alt="" />
                <div className={styles.siteSubtitle}>Случайными</div>
              </button>
              <button
                onClick={() => {
                  setSide("black");
                }}
                className={`${styles.sideOption} ${
                  side === "black" ? styles.sideOptionPicked : ""
                }`}
              >
                <img src={blackKing.src} alt="" />
                <div className={styles.siteSubtitle}>Чёрными</div>
              </button>
            </div>
          </div>
          <div className={styles.optionsBlock}>
            <div className={styles.optionsTitle}>Выберите сложность</div>
            <div className={styles.difficulties}>
              <button
                onClick={() => {
                  seDiff(1);
                }}
                className={`${styles.difficulty} ${
                  diff === 1 ? styles.diffPicked : ""
                }`}
              >
                1
              </button>
              <button
                onClick={() => {
                  seDiff(2);
                }}
                className={`${styles.difficulty} ${
                  diff === 2 ? styles.diffPicked : ""
                }`}
              >
                2
              </button>
              <button
                onClick={() => {
                  seDiff(3);
                }}
                className={`${styles.difficulty} ${
                  diff === 3 ? styles.diffPicked : ""
                }`}
              >
                3
              </button>
              <button
                onClick={() => {
                  seDiff(4);
                }}
                className={`${styles.difficulty} ${
                  diff === 4 ? styles.diffPicked : ""
                }`}
              >
                4
              </button>
              <button
                onClick={() => {
                  seDiff(5);
                }}
                className={`${styles.difficulty} ${
                  diff === 5 ? styles.diffPicked : ""
                }`}
              >
                5
              </button>
              <button
                onClick={() => {
                  seDiff(6);
                }}
                className={`${styles.difficulty} ${
                  diff === 6 ? styles.diffPicked : ""
                }`}
              >
                6
              </button>
              <button
                onClick={() => {
                  seDiff(7);
                }}
                className={`${styles.difficulty} ${
                  diff === 7 ? styles.diffPicked : ""
                }`}
              >
                7
              </button>
              <button
                onClick={() => {
                  seDiff(8);
                }}
                className={`${styles.difficulty} ${
                  diff === 8 ? styles.diffPicked : ""
                }`}
              >
                8
              </button>
            </div>
          </div>
          <div className={styles.optionsBlock}>
            <div className={styles.optionsTitle}>Выберите контроль времени</div>
            <div className={styles.timeOptions}>
              <div className={styles.timeStart}>
                <div className={styles.timeStartTitle}>
                  Начальное время (мин.)
                </div>
                <div className={styles.timeStartOptions}>
                  <button
                    onClick={() => {
                      setTimeStart(3);
                    }}
                    className={`${styles.timeStartOption} ${
                      timeStart === 3 ? styles.timePicked : ""
                    }`}
                  >
                    3
                  </button>
                  <button
                    onClick={() => {
                      setTimeStart(5);
                    }}
                    className={`${styles.timeStartOption} ${
                      timeStart === 5 ? styles.timePicked : ""
                    }`}
                  >
                    5
                  </button>
                  <button
                    onClick={() => {
                      setTimeStart(10);
                    }}
                    className={`${styles.timeStartOption} ${
                      timeStart === 10 ? styles.timePicked : ""
                    }`}
                  >
                    10
                  </button>
                </div>
              </div>
              <div className={styles.timeIncr}>
                <div className={styles.timeIncrTitle}>
                  Добавление за каждый ход (с.)
                </div>
                <div className={styles.timeIncrOptions}>
                  <button
                    onClick={() => {
                      setTimeIncr(0);
                    }}
                    className={`${styles.timeIncrOption} ${
                      timeIncr === 0 ? styles.timePicked : ""
                    }`}
                  >
                    0
                  </button>
                  <button
                    onClick={() => {
                      setTimeIncr(1);
                    }}
                    className={`${styles.timeIncrOption} ${
                      timeIncr === 1 ? styles.timePicked : ""
                    }`}
                  >
                    1
                  </button>
                  <button
                    onClick={() => {
                      setTimeIncr(3);
                    }}
                    className={`${styles.timeIncrOption} ${
                      timeIncr === 3 ? styles.timePicked : ""
                    }`}
                  >
                    3
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
        <button onClick={startGame} className={styles.beginGame}>
          Начать игру
        </button>
      </div>
    </div>
  );
}
