import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "../board.module.css";
import { piecesImgs } from "../PiecesImgs";
import Cell from "./Cell";

export default function BoardComp(props) {
  const store = useSelector((state) => state.board.toHighlight);

  const arr = props.board?.cells ? props.board.cells : null;
  const cellsArr = !arr
    ? null
    : (props.board.playerColor === "white" ? arr.flat(1) : arr.flat(1).reverse());

  const boardCells = useMemo(() => {
    return cellsArr ? (
      cellsArr.map((item) => {
        return <Cell key={Math.random()} fn={props.fn} item={item} />;
      })
    ) : (
      <div>123</div>
    );
  }, [props]);

  return <React.Fragment>{boardCells}</React.Fragment>;
}
