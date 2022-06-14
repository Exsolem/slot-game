import { render, fireEvent, act } from "@testing-library/react";
import App from "./App";
import React from "react";

describe('App',()=>{
    it("should render start button", () => {
        
        console.log(render(<App/>))
        //getByTestId('some-text')
    
        //expect(getByTestId("start-timer").textContent).toEqual("Start!");
      });
})