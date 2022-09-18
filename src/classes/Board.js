import Cell from "./Cell"
import Colors from "./Colors"
import { Pawn } from "./Pawn"


export default class Board{
    constructor(cells,lastCellMove){
        this.cells = cells
        this.lastCellMove = lastCellMove
    }

    fillBoard(){
        this.cells = []
        for(let i = 0; i < 8;i++){
            const row = []
            for(let j = 0; j <8;j++){
                const color = (i + j) % 2 === 1 ? Colors.white : Colors.black
                row.push(new Cell(i,j,color,this))
            }
            this.cells.push(row)
        }
    } 
    createFigures(){
        
        this.cells[6].forEach((item)=>{
            item.placeFigure(new Pawn('white',item))
        })
        this.cells[1].forEach((item)=>{
            item.placeFigure(new Pawn('black',item))
        })




    //    const white_rooks =  [this.cells[7][0],this.cells[7][7]]
    //    white_rooks.forEach(item=>item.placeContent('white_rook'))
    //    const black_rooks =  [this.cells[0][0],this.cells[0][7]]
    //    black_rooks.forEach(item=>item.placeContent('black_rook'))

    //    const white_bishops = [this.cells[0][2],this.cells[0][5]]
    //    white_bishops.forEach(item=>item.placeContent('white_bishop'))
    //    const black_bishops = [this.cells[7][2],this.cells[7][5]]
    //    black_bishops.forEach(item=>item.placeContent('black_bishop'))

    //    const white_knights = [this.cells[0][1],this.cells[0][6]]
    //    white_knights.forEach(item=>item.placeContent('white_knight'))
    //    const black_knights = [this.cells[7][1],this.cells[7][6]]
    //    black_knights.forEach(item=>item.placeContent('black_knight'))

    //    this.cells[0][3].placeContent('white_king')
    //    this.cells[7][3].placeContent('black_king')

    //    this.cells[0][4].placeContent('white_queen')
    //    this.cells[7][4].placeContent('black_queen')
    }

}