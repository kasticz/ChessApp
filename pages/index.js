import { useDispatch, useSelector } from "react-redux";
import Head from 'next/head'
import Board from "../src/classes/Board";
import BoardComp from "../src/components/BoardComp";
import { useState, useEffect, useRef, Fragment } from "react";
import { piecesImgs } from "../src/PiecesImgs";
import { boardActions } from "../src/store/store";
import {
  endMoveHandler,
  makeGhostPiece,
  pieceMoveHandler,
} from "../src/store/interfaceLogic";
import blackWon from "../src/assets/UI/blackWon.webp";
import whiteWon from "../src/assets/UI/whiteWon.webp";
import draw from "../src/assets/UI/draw.jpg";
import styles from "../src/board.module.css";
import OptionsPanel from "../src/components/OptionsPanel";
import { decideAiMove } from "../src/store/decideAiMove";
import { allPieces } from "../src/classes/AllPieces";
import Clock from "../src/components/Clock";
import HistoryMoves from "../src/components/HistoryMoves.js";
import { useCookies } from "react-cookie";
import { remakeBoard } from "../src/store/remakeBoard";

export default function Home() {
  const [board, setBoard] = useState(null);
  const dispatch = useDispatch();
  const boardRef = useRef();
  const [gameEnd, setGameEnd] = useState(false);
  const [promotion, setPromotion] = useState();
  const gameState = useSelector((state) => state.board.gameState);
  const gameId = useSelector((state) => state.board.gameId);
  const gameEndRef = useRef();
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useCookies(["cookiesAccepted"]);

  const [cookiesAccepted2, setCookiesAccepted2] = useState(false);

  const [cookie, setCookie, removeCookie] = useCookies(["gameId"]);

  useEffect(() => {
    if (cookiesAccepted.cookiesAccepted) {
      setCookiesAccepted2(true);
    }
  }, [cookiesAccepted]);

  let startingCell = null;

  useEffect(() => {
    if (!board) {
      const playingBoard = new Board();
      playingBoard.fillBoard("white");
      playingBoard.createFigures();
      setBoard(playingBoard);
      if (cookie.gameId && !gameId) {
        dispatch(boardActions.setGameId(cookie.gameId));
      }
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

        const promotionFigure = board.promotionFigure
          ? board.promotionFigure === "knight"
            ? "n"
            : board.promotionFigure[0]
          : "";

        const resp = await fetch("./api/makeMove", {
          method: "POST",
          body: JSON.stringify({
            gameId: gameId,
            move: `${lastMoveStart}${lastMoveEnd}${promotionFigure}`,
          }),
          headers: {
            "Content-type": "application/json",
          },
        });
      }

      if (board?.lastMoveStart) makeMove();
      if (board?.gameEnd) {
        setGameEnd(board.gameEnd);
        const audio = new Audio("/end.mp3");
        audio.play();
      }

      async function playSound() {
        const audio =
          board.audio === "standard"
            ? new Audio("/standard.mp3")
            : new Audio("/take.mp3");
        audio.play();
      }
      if (board?.audio) {
        playSound();
      }
    }
  }, [board]);

  useEffect(() => {
    const shouldBeRemaked =
      board?.historyMoves.length === 0 &&
      (gameState?.moves.split(" ").length >= 2 ||
        (gameState?.moves.split(" ").length >= 1 &&
          board.playerColor !== "white"));

    if (shouldBeRemaked) {
      const playingBoard = new Board();
      const decideColor = gameState.black?.id?.includes("caocao")
        ? "black"
        : "white";
      playingBoard.fillBoard(decideColor);
      playingBoard.createFigures();
      const remakedBoard = remakeBoard(
        playingBoard,
        gameState.moves.split(" ")
      );
      setBoard(remakedBoard);
    }

    if (gameState && !shouldBeRemaked) {
      decideAiMove(gameState, board, setBoard, Board);
    }
    if (gameState?.winner && !gameEnd) {
      setGameEnd({ winner: gameState.winner === "white" ? "белые" : "чёрные" });
    }
  }, [gameState]);

  useEffect(() => {
    if (board?.whoToMove && gameEnd) {
      setBoard((prevState) => {
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
        newBoard.checkForChecks();
        return newBoard;
      });
    }
    if (gameEnd) {
      if (cookie.gameId) {
        removeCookie("gameId");
      }
      gameEndRef.current.focus();
    }
  }, [gameEnd]);

  function onClickHandler(e, figure, cell) {
    if (
      !figure.playerFigure ||
      board.whoToMove !== board.playerColor ||
      (!gameId && !cookie.gameId)
    )
      return;

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
      board.playerColor === promotion.figure.color
    );
    promotion.figure.makeMove(
      promotion.toPlaceCell,
      promotion.startCell,
      false,
      newFigure
    );

    setBoard((prevState) => {
      const newBoard = new Board(
        prevState.cells,
        promotion.startCell,
        promotion.toPlaceCell,
        promotion.figure.rank,
        prevState.playerColor,
        prevState.whoToMove === "white" ? "black" : "white",
        newFigure.rank || null,
        [
          ...prevState.historyMoves,
          {
            figure: {
              rank: promotion.figure.rank,
              color: promotion.figure.color,
            },
            toPlaceCell: promotion.toPlaceCell,
            startCell: promotion.startCell,
            promotionFigure: newFigure,
          },
        ],
        prevState
      );
      newBoard.reapplyBoard();
      newBoard.checkForChecks();
      return newBoard;
    });
    setPromotion(null);
  }

  useEffect(() => {
    if (gameId && !cookie.gameId && gameState?.clock?.initial) {
      const expirationDate = new Date(Date.now() + gameState.clock.initial * 2);
      setCookie("gameId", gameId, {
        path: "/",
        expires: expirationDate,
      });
    }
  }, [gameId, gameState]);

  return (
    <Fragment>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Шахматы</title>
      </Head>
      <div className={styles.app}>
        <div className={styles.appWrapper}>
          <OptionsPanel
            setSpinner={setSpinnerActive}
            Board={Board}
            setBoard={setBoard}
            cookiesAccepted2={cookiesAccepted2}
          />
          <div ref={boardRef} className={styles.board}>
            {promotion && board && (
              <div
                className={styles[`${board?.playerColor || "white"}Promotion`]}
              >
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

            {gameEnd && (
              <div
                ref={gameEndRef}
                tabIndex={5}
                onBlur={() => {
                  setGameEnd(false);
                }}
                className={styles.gameEnd}
              >
                Игра Окончена! <hr />{" "}
                {gameEnd.winner !== "Пат" && gameEnd.winner !== "Ничья"
                  ? `Выиграли ${gameEnd.winner}`
                  : `${gameEnd.winner}`}
                <img
                  src={
                    gameEnd.winner === "чёрные"
                      ? blackWon.src
                      : gameEnd.winner === "белые"
                      ? whiteWon.src
                      : draw.src
                  }
                  alt=""
                />
              </div>
            )}
          </div>
          <div className={styles.uiWrapper}>
            <Clock
              board={board}
              setGameEnd={setGameEnd}
              whoToMove={board?.whoToMove}
              playerColor={board?.playerColor}
              side={"opposite"}
              gameEnd={gameEnd}
            />
            <HistoryMoves
              setBoard={setBoard}
              history={board?.historyMoves || null}
            />
            <Clock
              board={board}
              setGameEnd={setGameEnd}
              whoToMove={board?.whoToMove}
              playerColor={board?.playerColor}
              side={"player"}
              gameEnd={gameEnd}
            />
          </div>
          {!cookiesAccepted2 && (
            <div className={styles.cookies}>
              <p>Для работы сайта используются Cookie файлы</p>
              <button
                onClick={() => {
                  setCookiesAccepted("cookiesAccepted", true);
                }}
              >
                Принять
              </button>
            </div>
          )}
        </div>
      </div>
      {spinnerActive && (
        <div className="spinnerWrapper">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
