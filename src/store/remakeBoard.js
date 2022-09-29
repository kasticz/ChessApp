import Board from "../classes/Board"
import { decideAiMove } from "./decideAiMove"

export function remakeBoard(board,moves,setBoard){


    let newBoard = board;
    moves.forEach((item)=>{
        newBoard = decideAiMove(null,newBoard,null,Board,item.trim())

    })
    

    return newBoard



}