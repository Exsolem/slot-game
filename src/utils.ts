export const getArr = (count: number):{arr:number[], matches:number[][]}=> {
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
            matchesArr.push(matches)
            matches = [];
        } else{
            matches = [];
        }
    }
    return matchesArr
}
export function getWinScore(arr:number[][]):number{
    console.log(arr);
    return arr.map((item,idx) => {
        const length = item.length;
        return item.reduce( acum =>  acum += length === 3 ? item[0] : length === 4 ? item[0] * 2 : length === 5 ? item[0] * 3 : 0, 0);
    }).reduce( (acum, cur) => acum+=cur, 0)
}

export interface Fruits{
    [fruit: string]: string
}
export const fruits: Fruits = {
    wild: 'wild',
    strawberry: 'strawberry',
    pineapple: 'pineapple',
    lemon: 'lemon',
    watermelon: 'watermelon',
    grape: 'grape'
};