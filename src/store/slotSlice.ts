import {createSlice} from '@reduxjs/toolkit';
import {getArr, getFreeSpins, getLineScore, getWinScore, SlotState} from "../utils";


const initialState: SlotState = {
    isDone: false,
    field: getArr(25),
    freeSpins: 0,
    win: 0,
    balance: 1000,
    bet: 5,
    lineScore:[]
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
        setField:(state) => {
            state.field = getArr(25);
        },
        getWin:(state) => {
            state.win = getWinScore(state.lineScore);
        },
        getLinesScore:(state) => {
            state.lineScore = getLineScore(state.field, state.bet)
        },
        getSpins:(state) => {
            state.freeSpins += getFreeSpins(state.field);
        },
        setBet:(state) => {
            if(state.bet === 25){
                state.bet = 5;
            }else{
                state.bet += 5;
            }
        },
        makeBet:(state) => {
            if(state.freeSpins === 0){
                state.balance -= state.bet
            }else{
                state.freeSpins -= 1;
            }
            
        },
        setBalance:(state) => {
            state.balance += state.win
        }

    },
})

// Action creators are generated for each case reducer function
export const { 
    setDoneTrue, 
    setDoneFalse, 
    setField, 
    getWin, 
    getSpins, 
    setBet, 
    setBalance, 
    makeBet, 
    getLinesScore
} = slotSlice.actions

export default slotSlice.reducer