import { configureStore, createSlice} from "@reduxjs/toolkit";
const board = createSlice({
    name: 'board',
    initialState:{
        toHighlight:[]
    },
    reducers:{
        setToHighlightCells(state,payload){
            state.toHighlight = payload.payload
        }
    }

})

export const boardActions = board.actions


const store = configureStore({
    reducer:{board:board.reducer}
})



export default store;