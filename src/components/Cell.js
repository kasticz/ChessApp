import styles from "../board.module.css";
import { useSelector } from "react-redux";
import { piecesImgs } from "../PiecesImgs";

export default function Cell(props) {
  const store = useSelector((state) => state.board.toHighlight);
  const typeOfHighlight = store.find(
    (item) => item.x === props.item.x && item.y === props.item.y
  )?.type;
  return (
    <div>
      <div
        data-type="cell"
        data-x={props.item.x}
        data-y={props.item.y}
        className={`${typeOfHighlight ? styles[typeOfHighlight] : ""} ${
          styles.cell
        }  ${styles[props.item.color]}`}
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
      </div>
    </div>
  );
}
