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
            if(payload.payload.type ==='opponentGone'){
                return;
            }
            state.gameState = payload.payload   
            if(!state.gameState.winner){
                const allMoves = payload.payload.moves?.split(' ') || payload.payload.state.moves?.split(' ')       
                state.gameState.lastMove = allMoves ?  allMoves[allMoves.length - 1]  : null
                if(!state.gameState.wtime){
                    state.gameState.wtime = state.gameState.state.wtime
                    state.gameState.btime = state.gameState.state.btime
                }
                if(!state.incr && state.gameState.clock?.increment){
                    state.incr = state.gameState.clock.increment / 1000                
                }
                if(!state?.initialTime && state.gameState?.clock?.initial){
                    state.initialTime = state.gameState.clock.initial / 1000
                }
    
                if(!state.gameState.moves){
                    state.gameState.moves = state.gameState.state.moves
                }
                state.gameState.wtime = Math.round(state.gameState.wtime / 1000) 
                state.gameState.btime = Math.round(state.gameState.btime / 1000) 
            }

        },
        setGameId(state,payload){
            state.gameId = payload.payload
        },
        setGameTime(state,payload){
            state.gameTime = payload.payload * 60
        }
    }

})

export const boardActions = board.actions


const store = configureStore({
    reducer:{board:board.reducer}
})



export default store;