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
            if(payload.payload === null){
                state.gameState = null
                return
            }
            state.gameState = payload.payload   
            const allMoves = payload.payload.moves?.split(' ') || ''       
            state.gameState.lastMove = allMoves ?  allMoves[allMoves.length - 1]  : null
            if(!state.gameState.wtime){
                state.gameState.wtime = state.gameState.clock.initial
                state.gameState.btime = state.gameState.clock.initial
            }
            if(!state.incr){
                state.incr = state.gameState.clock.increment / 1000
                state.initialTime = state.gameState.clock.initial / 1000
            }
            if(!state.gameState.moves){
                state.gameState.moves = state.gameState.state.moves
            }
            state.gameState.wtime = Math.round(state.gameState.wtime / 1000) 
            state.gameState.btime = Math.round(state.gameState.btime / 1000) 
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