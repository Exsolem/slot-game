import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux'


import './App.css';
import { MyApp } from "./Pixi";
import { getField } from "./store/slotSlice";


const app = new MyApp();
function App() {

  const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const winRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const sumRef: MutableRefObject<HTMLDivElement | null> = useRef(null)

  const isDone = useSelector((state: any) => state.slot.isDone);
  const field = useSelector((state: any) => state.slot.field as { arr: number[], matches: number[][] });
  const dispatch = useDispatch();

  const [summa, setSumma] = useState(200);
  const [win, setWin] = useState(0);
  const [btnDis, setBtnDis] = useState(false)

  const spin = useCallback(() => {
    dispatch(getField());
    setWin(0);
    setBtnDis(true);
    setSumma(prev => prev - 5)
  }, [app]);

  useEffect(() => {
    if (btnDis) {
      app.setArr(field)
      app.startup();
    }
  }, [field])

  useEffect(() => {
    if (ref.current) {
      app.setArr(field)
      ref.current?.replaceChildren(app.view)
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
    setSumma(prev => prev += win);
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
  }, [summa])

  useEffect(() => {
    if (isDone) {
      const newWin = field.matches.map(item => {
        console.log(item)
        const length = item.length;
        return (field.arr[item[0]] + 1) * (length - 2) * length;
      }).flat()
        .reduce((acum, cur) => acum += cur, 0)

      setWin(newWin);
      setBtnDis(false);
    }

  }, [isDone])

  return (
    <div className="App">
      <div className={'slot-window'} ref={ref}></div>
      <div className={'buttons-container'}>
        <div className={'balance'} ref={sumRef}>
          <span>Balance:${summa}</span>
        </div>
        <button 
          onClick={spin} 
          disabled={btnDis}
        >
        {
          btnDis ? 
          <span className='spinner'/> :
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
