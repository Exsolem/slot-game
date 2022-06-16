import React, { MutableRefObject, useEffect, useRef } from 'react';

import { getFieldAsync } from "../../store/slotSlice";
import { useAppDispatch } from '../../hooks';
import { SlotProps } from '../../utils';


export const SlotWindow: React.FC<SlotProps> = ({ app }) => {
    const canvasRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const thisCanvasRef = canvasRef
        if (thisCanvasRef.current) {
            dispatch(getFieldAsync());
            canvasRef.current?.appendChild(app.view);
            app.start();
        }
        return () => {
            thisCanvasRef.current?.removeChild(app.view);
        }
    }, [])
    return <div className={'slot-window'} ref={canvasRef} />
}