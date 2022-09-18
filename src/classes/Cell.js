

export default class Cell{
    constructor(x,y,color,board){
        this.x = x
        this.y = y
        this.color = color
        this.board = board
    }
    placeFigure(figure){
        this.figure = figure
        this.content = figure?.image || null
    }


}