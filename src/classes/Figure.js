

export class Figure{
    constructor(rank,color,cell,image){
        this.rank = rank
        this.color = color
        this.cell = cell
        this.avaliable = true
        this.image = image
    }
    makeMove(cell){
        this.cell = cell 
    }
    delete(){
        this.avaliable = false
    }

}