import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { 
    getSpins, 
    getWin, 
    setBalance, 
    setBet, 
    makeBet,
    getFieldAsync
 } from "../../store/slotSlice";
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../hooks';
import { SlotProps } from '../../utils';
import gearURL from "../../assets/gear1.png";
import loaderUrl from "../../assets/loader.gif"



export const UIOverlay: React.FC<SlotProps> = ({ app }) => {
    const winRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const sumRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const betContainerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

    const dispatch = useAppDispatch();

    const isDone = useSelector(({ slot: { isDone } }: RootState) => isDone);
    const field = useSelector(({ slot: { field } }: RootState) => field);
    const freeSpins = useSelector(({ slot: { freeSpins } }: RootState) => freeSpins);
    const win = useSelector(({ slot: { win } }: RootState) => win);
    const balance = useSelector(({ slot: { balance } }: RootState) => balance);
    const bet = useSelector(({ slot: { bet } }: RootState) => bet);
    const lineScore = useSelector(({ slot: { lineScore } }: RootState) => lineScore);
    const isPending = useSelector(({ slot: { isRequestPending } }: RootState) => isRequestPending);
    const isLoaded = useSelector(({ slot: { isPixiLoaded } }: RootState) => isPixiLoaded);

    const [btnDis, setBtnDis] = useState(false)

    const spin = useCallback(() => {
        dispatch(getFieldAsync());
        setBtnDis(true);
        dispatch(makeBet())
    }, [app]);

    useEffect(() => {
        if (win > 0) {
            winRef.current?.classList.add('winAnim');
            sumRef.current?.classList.add('balanceAnim')
            setTimeout(() => {
                sumRef.current?.classList.remove('balanceAnim')
            }, 1000)
        } else {
            winRef.current?.classList.remove('winAnim');
        }
    }, [win])

    useEffect(() => {
        if (btnDis && field) {
            app.setArr(field, lineScore)
            app.startup();
        }
    }, [field, lineScore])

    useEffect(()=>{
        if(freeSpins > 0){
            betContainerRef.current?.classList.add('scaleAnimation')
        }else{
            betContainerRef.current?.classList.remove('scaleAnimation');
        }
    },[freeSpins])


    useEffect(() => {
        if (isDone) {
            dispatch(getWin());
            dispatch(setBalance());
            dispatch(getSpins());
            setBtnDis(false);
        }
    }, [isDone])

    return (
        <div className={'buttons-container'}>
            <div className={'balance'} ref={sumRef}>
                <span>Balance:${balance}</span>
            </div>
            <div className={'bet-container'} ref={betContainerRef}>
                {
                    freeSpins ?
                        <span className={'free-spins'}>Free spins: {freeSpins}</span> :
                        <button className={'bet-btn'} onClick={() => dispatch(setBet())}>Bet:{bet}</button>
                }
            </div>
            <button
                onClick={ spin }
                disabled={ btnDis }
                className={ 'spin-btn' }
            >
                {
                    btnDis ?
                        <img className='spinner' src={gearURL} alt="gear" /> :
                        'Spin'
                }
            </button>
            <div className={'win'} ref={winRef}>
                <span>Win:{win}</span>
            </div>
            {
              (isPending || !isLoaded) && 
                <div className='loader'>
                    <img src={loaderUrl} alt="loader" />
                 </div>
            }
            
        </div>
    )
}