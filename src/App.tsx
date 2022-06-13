import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'


import './App.css';
import { MyApp } from "./Pixi";
import { setField, getSpins, getWin, setBalance, setBet, makeBet, getLinesScore } from "./store/slotSlice";
import gearURL from "./assets/gear1.png"
import { RootState } from './store/store';
import { useAppDispatch } from './hooks';


const app = new MyApp();
function App() {

  const canvasRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const winRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const sumRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const dispatch = useAppDispatch();

  const isDone = useSelector(({ slot:{ isDone }}: RootState) => isDone);
  const field = useSelector(({ slot:{ field }}: RootState) => field);
  const freeSpins = useSelector(({ slot:{ freeSpins }}: RootState) => freeSpins);
  const win = useSelector(({ slot:{ win }}: RootState)  => win);
  const balance = useSelector(({ slot:{ balance }}: RootState) => balance);
  const bet = useSelector(({ slot:{ bet }}: RootState) => bet);
  const lineScore = useSelector(({ slot:{ lineScore }}: RootState) => lineScore);


  const [btnDis, setBtnDis] = useState(false)

  const spin = useCallback(() => {
    dispatch(setField());
    dispatch(getLinesScore());
    //setWin(0);
    setBtnDis(true);
    dispatch(makeBet())
  }, [app]);

  useEffect(() => {
    if (btnDis && field) {
      app.setArr(field, lineScore)
      app.startup();
    }
  }, [field, lineScore])

  useEffect(() => {
    if (canvasRef.current) {
      dispatch(setField());
      dispatch(getLinesScore());
      canvasRef.current?.replaceChildren(app.view);
      app.start();
    }
    window.addEventListener('resize', () => {
      app.drawBackground();
    })
    window.ondeviceorientation = () => {
      app.drawBackground();
    }
  }, [])
  useEffect(() => {
    //setSumma(prev => prev += win);
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
    if (isDone) {
      dispatch(getWin());
      dispatch(setBalance());
      dispatch(getSpins());
      setBtnDis(false);
    }
  }, [isDone])

  return (
    <div className="App">
      <div className={'slot-window'} ref={canvasRef}></div>
      <div className={'buttons-container'}>
        <div className={'balance'} ref={sumRef}>
          <span>Balance:${balance}</span>
        </div>
        <div className={'bet-container'}>
        { 
          freeSpins ? 
          <span>Free speens: {freeSpins}</span> : 
          <button className={'bet-btn'} onClick={() => dispatch(setBet())}>Bet:{bet}</button>
        }
        </div>
        <button 
          onClick={spin} 
          disabled={btnDis}
          className={'spin-btn'}
        >
        {
          btnDis ? 
          <img  className='spinner' src={gearURL} alt="gear"/> :
          'Spin'
        }
        </button>
        <div className={'win'} ref={winRef}>
          <span>Win:{win}</span>
        </div>
        
      </div>
    </div>
  );
}



export default App;
