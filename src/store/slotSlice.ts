import {createSlice} from '@reduxjs/toolkit';
import {getArr} from "../utils";

interface InitialState{
    isDone: boolean,
    field: {
        arr:number[],
        matches:number[][]
    }
}
const initialState: InitialState = {
    isDone: false,
    field: getArr(25)
}

export const slotSlice = createSlice({
    name: 'slot',
    initialState,
    reducers: {
        setDoneTrue:(state) => {
            state.isDone = true
        },
        setDoneFalse:(state) => {
            state.isDone = false
        },
        getField:(state) => {
            state.field = getArr(25)
        }
    },
})

// Action creators are generated for each case reducer function
export const { setDoneTrue, setDoneFalse, getField } = slotSlice.actions

export default slotSlice.reducer