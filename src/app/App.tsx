import React, { MutableRefObject, useEffect, useRef } from 'react';



import './App.css';
import { MyApp } from "../pixi/Pixi";
import { SlotWindow } from './slotWindow/SlotWindow';
import { UIOverlay } from './UIOverlay/UIOverlay';

const app = new MyApp();
const App: React.FunctionComponent = () => {
  useEffect(() => {
    window.addEventListener('resize', () => {
      app.drawBackground();
    })
    window.ondeviceorientation = () => {
      app.drawBackground();
    }
  }, [])

  return (
    <div className="App">
      <SlotWindow app={app} />
      <UIOverlay app={app} />
    </div>
  );
}



export default App;
