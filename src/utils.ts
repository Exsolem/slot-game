import { MyApp } from "./pixi/Pixi";

export interface Fruits{
    [fruit: string]: string
}
export interface Field{
    arr:number[],
    matches:number[][],
}
export interface SlotState{
    balance: number,
    isDone: boolean,
    field: Field,
    freeSpins: number,
    win: number,
    bet: number,
    lineScore: number[],
    isRequestPending: boolean,
    isPixiLoaded: boolean
}
export interface SlotProps{
    app: MyApp
} 


export const getArr = (count: number): Field => {
    const arr = []
    for(let i = 0; i < count; i++){
        arr.push(Math.floor(Math.random() * 6))
    }
    return {arr:arr,matches:getCombinations(arr)};
}
export const getCombinations = (arr: number[]): number[][] => {
    const matchesArr:number[][] = []
    let matches:number[] = [];
    for(let i = 1; i < arr.length; i++){
        const prev = arr[i - 1];
        const next = arr[i + 1];
        const cur = arr[i];
        const isMatch = (
            (prev === cur) &&
            (cur === next) &&
            Math.floor((i - 1) / 5) === Math.floor((i + 1) / 5)
        )
        if(isMatch){
            !matches.includes(i) && matches.push(i);
            !matches.includes(i - 1) && matches.push(i - 1);
            !matches.includes(i + 1) && matches.push(i + 1);
        }else if(matches.length > 2){
            matches.sort();
            matchesArr.push(matches);
            matches = [];
        } else{
            matches = [];
        }
    }
    return matchesArr
}
export function getWinScore(lineScore:number[]):number{
    return lineScore
        .reduce((acum, cur) => acum += cur, 0)
}
export function getLineScore(field: Field, bet: number): number[]{
    return field.matches.map(item => {
        const length = item.length;
        return field.arr[item[0]] * (bet / 5) * (length - 2) * length;
      }).flat()
}
export function getFreeSpins(field: Field):number{
    const spins = field.matches
        .filter(item => field.arr[item[0]]  === 0)
        .map( item => {
            const length = item.length;
            return (length - 2) * length; 
        })
        .flat()
        .reduce((acum, cur) => acum += cur, 0)
    return spins;
}

export const fruits: Fruits = {
    wild: 'wild',
    strawberry: 'strawberry',
    pineapple: 'pineapple',
    lemon: 'lemon',
    watermelon: 'watermelon',
    grape: 'grape'
};