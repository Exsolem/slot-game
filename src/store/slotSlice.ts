import {createSlice} from '@reduxjs/toolkit';
import {Field, getArr, getFreeSpins, getLineScore, getWinScore, SlotState} from "../utils";
import { AppDispatch } from './store';


const initialState: SlotState = {
    isDone: false,
    field: {} as Field,
    freeSpins: 0,
    win: 0,
    balance: 1000,
    bet: 5,
    lineScore:[],
    isRequestPending: false,
    isPixiLoaded: false,
}

export const slotSlice = createSlice({
    name: 'slot',
    initialState,
    reducers: {
        setDoneTrue:(state) => {
            state.isDone = true
        },
        setPending:(state, action:{payload: boolean}) => {
            state.isRequestPending = action.payload;
        },
        setDoneFalse:(state) => {
            state.isDone = false
        },
        setField:(state, action) => {
            state.field = action.payload;
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
        },
        setIsPixiLoaded:(state) => {
            state.isPixiLoaded = true;
        }

    },
})

export const getFieldAsync = () => async (dispatch: AppDispatch) =>  {
    const options = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin', 
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    } as RequestInit

    dispatch(setPending(true))

    const response = await fetch('https://slot-server-exsolem.herokuapp.com/', options );
    const data = await response.json();

    dispatch(setField(data));
    dispatch(getLinesScore());
    dispatch(setPending(false))
}

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
    getLinesScore,
    setPending,
    setIsPixiLoaded,
} = slotSlice.actions

export default slotSlice.reducer