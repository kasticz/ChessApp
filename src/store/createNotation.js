import { piecesImgs } from "../PiecesImgs";

export function createNotation(startingCell,endCell,figure,promotionFigure){
    const xCoords = "87654321";
    const yCoords = "abcdefgh";

  

    const pieceImg = piecesImgs[`${figure.color}_${figure.rank}`]

    const promImg = promotionFigure ? piecesImgs[`${promotionFigure.color}_${promotionFigure.rank}`] : null

    const start =`${yCoords[startingCell.y]}${xCoords[startingCell.x]}`

    const finish = `${yCoords[endCell.y]}${xCoords[endCell.x]}`


    
    const result = {notation: `${start}${finish}`, pieceImg,promImg }
  
    return result
}