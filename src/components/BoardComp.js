import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "../board.module.css"
import { piecesImgs } from "../PiecesImgs";
import Cell from "./Cell";


export default function BoardComp(props) {

  const store = useSelector(state=>state.board.toHighlight)


  

  const boardComp = useMemo(() => {
    return props.board?.cells ? (
      props.board.cells.flat(1).map((item) => {
        return <Cell key={Math.random()} fn={props.fn} item={item}/>

      })
    ) : (
      <div>123</div>
    );
  }, [props]);

  return <React.Fragment>{boardComp}</React.Fragment>;
}
