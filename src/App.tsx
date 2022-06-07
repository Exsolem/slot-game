import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux'


import './App.css';
import {MyApp} from "./Pixi";
import {getField} from "./store/slotSlice";


const app = new MyApp();
function App() {

  const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const winRef:MutableRefObject<HTMLDivElement | null> = useRef(null);
  const sumRef:MutableRefObject<HTMLDivElement | null> = useRef(null)
    // const [app, setApp] = useState<MyApp>(new MyApp());
    const isDone = useSelector((state: any) => state.slot.isDone);
    const field = useSelector((state: any) => state.slot.field as {arr: number[], matches: number[][]});
    const dispatch = useDispatch();

  const [summa, setSumma] = useState(200);
  const [win, setWin] = useState(0);
  const [btnDis, setBtnDis] = useState(false)

    const prevSum = useRef(summa);
  const spin = useCallback(()=>{
      // const newArr = getArr(25);
      // setArr(getArr(25))
      //app.startup();
      //app.drawBackground();
      dispatch(getField());
      setWin(0);
      setBtnDis(true);
      setSumma( prev => prev - 5)
  },[app]);

  useEffect(()=>{
      if(btnDis){
          app.setArr(field)
          app.startup();
      }
  }, [field])

  useEffect(()=>{
      if(ref.current){
          app.setArr(field)
          ref.current?.replaceChildren(app.view)
          app.start();
      }
      window.addEventListener('resize', ()=>{
          const body = document.querySelector('body');
          app.drawBackground();
      })
  }, [])
  useEffect(()=>{
    setSumma(prev => prev+=win);
    if(win > 0){
        winRef.current?.classList.add('winAnim');
        sumRef.current?.classList.add('balanceAnim')
        setTimeout(()=>{
            sumRef.current?.classList.remove('balanceAnim')
        }, 1000)
    }else{
      winRef.current?.classList.remove('winAnim');
    }

  }, [win])

    useEffect(() => {
    }, [summa])

    useEffect(()=>{
        if(isDone) {
            const newWin = field.matches.map(item => {
              console.log(item)
                const length = item.length;
                return (field.arr[item[0]] +  1) * (length - 2) * length;
            }).flat()
                .reduce((acum, cur) => acum+=cur, 0)

            setWin(newWin);
            setBtnDis(false);
        }

    }, [isDone])

  return (
    <div className="App">
      <div className={'slot-window'} ref={ref} onClick={()=> console.log(isDone)}></div>
      <div className={'buttons-container'}>
        <div className={'balance'} ref={sumRef}>
          <span>Balance: ${summa}</span>
        </div>
        <button onClick={spin} disabled={btnDis}>Spin</button>
        <div className={'win'} ref={winRef} onMouseEnter={ e => e.currentTarget.classList.toggle('winAnim')}>
          <span>Win:{win}</span>
        </div>
      </div>
        {/*<span className={'line'}></span>*/}
    </div>
  );
}



export default App;
