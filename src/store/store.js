import { configureStore, createSlice} from "@reduxjs/toolkit";
const board = createSlice({
    name: 'board',
    initialState:{
        toHighlight:[],
        gameState: null,
        gameId: ''
    },
    reducers:{
        setToHighlightCells(state,payload){
            state.toHighlight = payload.payload
        },
        setGameState(state,payload){
            state.gameState = payload.payload   
            const allMoves = payload.payload.moves?.split(' ') || ''       
            state.gameState.lastMove = allMoves ?  allMoves[allMoves.length - 1]  : null
        },
        setGameId(state,payload){
            state.gameId = payload.payload
        }
    }

})

export const boardActions = board.actions


const store = configureStore({
    reducer:{board:board.reducer}
})



export default store;