import styles from "../board.module.css";
import { useSelector, useDispatch } from "react-redux";
import { piecesImgs } from "../PiecesImgs";
import { boardActions } from "../store/store";

export default function Cell(props) {
  const store = useSelector((state) => state.board.toHighlight);

  const letters = "ABCDEFGH";
  const numbers = "87654321";

  const notationClassLetterWhite = props.item.x === 7 && props.item.board.playerColor === 'white' ? `notation${letters[props.item.y]}` : null;
  const notationClassNumberWhite = props.item.y === 7 && props.item.board.playerColor === 'white' ?  `notation${numbers[props.item.x]}` : null;

  const notationClassLetterBlack = props.item.x === 0 && props.item.board.playerColor === 'black' ? `notation${letters[props.item.y]}` : null;
  const notationClassNumberBlack = props.item.y === 0 && props.item.board.playerColor === 'black' ?  `notation${numbers[props.item.x]}` : null;

  const finalNotationLetters = notationClassLetterWhite ? notationClassLetterWhite : notationClassLetterBlack ? notationClassLetterBlack : null
  const finalNotationNumbers = notationClassNumberWhite ? notationClassNumberWhite : notationClassNumberBlack ? notationClassNumberBlack : null

 
  const typeOfHighlight = store.find(
    (item) => item.x === props.item.x && item.y === props.item.y
  )?.type;
  const isLastMoveEnd =
    props.item.board.lastMoveEnd?.x === props.item.x &&
    props.item.board.lastMoveEnd?.y === props.item.y;
  const isLastMoveStart =
    props.item.board.lastMoveStart?.x === props.item.x &&
    props.item.board.lastMoveStart?.y === props.item.y;

  const lastMoveClass =
    isLastMoveEnd || isLastMoveStart
      ? styles[`${props.item.color}lastmove`]
      : "";

  const classNames = [
    typeOfHighlight && styles[typeOfHighlight],
    lastMoveClass,
    styles.cell,
    styles[props.item.color],
    props.item?.figure &&
      props.item?.figure?.isChecked &&
      styles[`checked${props.item.color}`],
  ]
    .filter((item) => item)
    .join(` `);

  return (
    <div>
      <div
        data-type="cell"
        data-x={props.item.x}
        data-y={props.item.y}
        className={classNames}
      >
        {props.item.figure && (
          <img
            draggable={false}
            onMouseDown={(e) => {
              props.fn(e, props.item.figure, props.item);
            }}
            src={piecesImgs[props.item.content]}
            alt=""
          />
        )}
        {finalNotationLetters &&<div className={styles[finalNotationLetters]}></div>}
        {finalNotationNumbers &&<div className={styles[finalNotationNumbers]}></div>}
      </div>
    </div>
  );
}
