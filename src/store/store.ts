import { configureStore } from '@reduxjs/toolkit'
import slotSlice from "./slotSlice";


export default configureStore({
    reducer: {
        slot: slotSlice,
    },
})