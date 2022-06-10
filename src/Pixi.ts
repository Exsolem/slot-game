import * as PIXI from "pixi.js";

import bgUrl from './assets/background.jpg'
import wildUrl from './assets/SYM1.png';
import strawberryUrl from './assets/SYM3.png';
import pineappleUrl from './assets/SYM4.png';
import lemonUrl from './assets/SYM5.png';
import watermelonUrl from './assets/SYM6.png';
import grapeUrl from './assets/SYM7.png';
import bearUrl from './assets/spritesheet.png'
import pixiUrl from './assets/pixi.png'
import coinUrl from './assets/coin.png'
import bgPortraitUrl from './assets/background-portrait.jpg'

import { setDoneFalse, setDoneTrue } from './store/slotSlice'
import store from "./store/store";


import jsonUrl from './assets/spritesheet.json';
import pixiJson from './assets/pixi.json'
import coinJSON from './assets/coin.json'
import { GlowFilter, GodrayFilter } from "pixi-filters";
import { fruits } from "./utils";

export enum speed {
    idle = 0.02,
    accelerated = 0.08,
    step = (accelerated - idle) / 60,
}

export class MyApp extends PIXI.Application {
    arr: number[]
    matches: number[][]
    isLoad: boolean
    backgroundTime: number;
    background: PIXI.Sprite;
    backgroundTexture: {
        portrait: PIXI.Texture | undefined;
        landscape: PIXI.Texture | undefined;
    };
    bears: PIXI.Sprite[];
    fruits: MyModel[];
    coins: CoinSprite[];
    mainScale: number;
    container: PIXI.Container;
    resources: PIXI.utils.Dict<PIXI.LoaderResource>;
    coinsTexture: PIXI.Texture<PIXI.Resource>[];
    bearTexture: PIXI.Texture<PIXI.Resource>[];
    constructor() {
        super({
            resizeTo: window,
            backgroundColor: 0x5991c2
        });
        this.arr = []
        this.matches = []
        this.isLoad = false;
        this.backgroundTime = 0;
        this.background = new PIXI.Sprite();
        this.backgroundTexture = {
            portrait: {} as PIXI.Texture,
            landscape: {} as PIXI.Texture
        }
        this.bears = [];
        this.fruits = [];
        this.coins = [];
        this.container = new PIXI.Container();
        this.mainScale = 0.3;
        this.resources = {};
        this.coinsTexture = [];
        this.bearTexture = [];
        this.loader
            .add(fruits.wild, wildUrl)
            .add(fruits.strawberry, strawberryUrl)
            .add(fruits.pineapple, pineappleUrl)
            .add(fruits.lemon, lemonUrl)
            .add(fruits.watermelon, watermelonUrl)
            .add(fruits.grape, grapeUrl)
            .add('bg', bgUrl)
            .add('bgPortrait', bgPortraitUrl)
            .add('bear', bearUrl)
            .add('pixi', pixiUrl)
            .add('coin', coinUrl)
            .load((_, resources) => {
                this.resources = resources;
                this.onLoadHandler(resources);
            })
    }
    clearScene() {
        this.stage.removeChildren()
        this.container = new PIXI.Container();
        this.fruits = [];
        this.coins = [];
    }
    onLoadHandler(resources: PIXI.utils.Dict<PIXI.LoaderResource>) {
        this.createBackground(resources);
        this.drawBackground();
        this.createBears(resources)
        this.drawBears();
        this.addBackgroundAnimation();
        this.addFruitsAnimation();
    }
    createBackground(resources: PIXI.utils.Dict<PIXI.LoaderResource>) {
        this.isLoad = true
        this.background = new PIXI.Sprite(resources.bg.texture);
        this.backgroundTexture.portrait = new PIXI.Sprite(resources.bgPortrait.texture).texture;
        this.backgroundTexture.landscape = this.background.texture;
        this.stage.addChild(this.background);
        this.background.filters = [new GodrayFilter({ alpha: 0.7 })]
    }
    setBackgroundSize(){
        this.background.width = window.innerWidth;
        this.background.height = window.innerHeight;
    }
    setBackgroundTexture(){
        if (window.innerHeight > window.innerWidth) {
            if(this.backgroundTexture.portrait){
                this.background.texture = this.backgroundTexture.portrait;
            }
            this.bears.forEach((bear, idx) => {
                bear.y = window.innerHeight / 2.5 + 2 * idx + 10;
            })
        } else {
            if(this.backgroundTexture.landscape){
                this.background.texture = this.backgroundTexture.landscape;
            }
            this.bears.forEach((bear, idx) => {
                bear.y = window.innerHeight / 2 + idx;
            })
        }
    }
    drawBackground() {
        this.setBackgroundSize();
        this.setBackgroundTexture()
        this.container.x = window.innerWidth / 2;
        this.container.y = window.innerHeight / 2;
        if(this.fruits.length > 0){
            this.setContainerScale(0.2)
        }
    }
    setContainerScale(scale:number):null{
        this.container.scale.set(scale);
        scale+=0.1;
        
        if( this.isPortrait()){
            if(this.container.width <= window.innerWidth - 30 ) {
                this.setContainerScale(scale);
            }
        }else{
            if(this.container.width <= window.innerWidth / 2 ) {
                this.setContainerScale(scale);
            }
        }
        return null;
    }
    createBears(resources: PIXI.utils.Dict<PIXI.LoaderResource>) {
        if(this.bearTexture.length === 0){
            const bearSpritesheet = new PIXI.Spritesheet(resources.bear.texture as PIXI.Texture, jsonUrl);
            bearSpritesheet.parse(() => { });
            this.bearTexture = Object.keys(bearSpritesheet.textures).map(item => bearSpritesheet.textures[item])
        }


        for (let i = 0; i < 5; i++) {
            const bear = new PIXI.AnimatedSprite(this.bearTexture);

            bear.animationSpeed = 0.4;
            bear.zIndex = 0;
            bear.scale.set(0.02 * i);
            bear.x = this.renderer.width * Math.random();
            bear.y = this.renderer.height / 2 + i;

            bear.play();
            this.bears.push(bear);
        }
    }
    drawBears() {
        this.bears.forEach(bear => {
            this.stage.addChild(bear)
        });
    }
    addBackgroundAnimation() {
        this.ticker.add((delta) => {
            this.bears.forEach((bear, idx) => {
                if (bear.x < -50) {
                    bear.x = this.renderer.width;
                }
                bear.x -= 0.5 * idx * delta;
            });
            if (this.background.filters) {
                //(this.background.filters[0] as GodrayFilter).time += 0.01 * delta;
            }
        })
    }
    drawContainer(){
        
        this.addFruits();
        this.container.x = this.renderer.width / 2;
        this.container.y = this.renderer.height / 2;
        this.container.pivot.x = this.container.width / 2 + 20;
        this.container.pivot.y = this.container.height / 2;

        this.setContainerScale(0.2);
        this.container.sortableChildren = true;
        this.container.filters = [new PIXI.filters.BlurFilter(40, 20)]

        this.stage.addChild(this.container);
    }
    isPortrait(): boolean{
        return window.innerHeight > window.innerWidth
    }
    addFruits() {
        const fruitsKeys = Object.keys(fruits);
        this.arr.forEach((fruitType, idx) => {
            const fruit: MyModel = new MyModel(20, this.mainScale, this.resources[fruitsKeys[fruitType]].texture);
            fruit.anchor.set(0.5);
            fruit.scale.set(this.mainScale);
            const col = Math.floor(idx / 5)
            const row = Math.floor(idx % 5)

            fruit.x = row * (fruit.width + 5) + fruit.width / 2 + 20;
            fruit.y = col * fruit.height + fruit.height / 2;
            fruit.delay = row;
            fruit.startX = fruit.x;
            fruit.startY = fruit.y;
            fruit.zIndex = 10;
            this.container.addChild(fruit)
            this.fruits.push(fruit);
            this.addCoins(idx, fruit);

        });
    }
    setFruitsPosition(){
        if(this.fruits.length > 0){
            this.fruits.forEach( (fruit, idx) => {
                const col = Math.floor(idx / 5)
                const row = Math.floor(idx % 5)
    
                fruit.x = row * fruit.width;
                fruit.y = col * 50 + 30;
                fruit.delay = row;
                fruit.startX = fruit.x;
                fruit.startY = fruit.y;
            })
        }

    }
    addCoins(idx: number, fruit: MyModel) {
        
        if(this.coinsTexture.length === 0){
            const coinSheet = new PIXI.Spritesheet(this.resources.coin.texture as PIXI.Texture, coinJSON);
            coinSheet.parse(() => { });
            this.coinsTexture = Object.keys(coinSheet.textures).map(item => coinSheet.textures[item])
        }
        

        if (this.matches.flat().includes(idx)) {
            const coin = new CoinSprite(this.coinsTexture);

            coin.zIndex = 100;
            coin.play();
            coin.animationSpeed = 0.4;
            coin.scale.set(0.3);
            coin.x = fruit.x - 10;
            coin.y = fruit.y - 10;
            coin.alpha = 0;
            this.container.addChild(coin);
            this.coins.push(coin);
        }
    }
    addFruitsAnimation(){

        const coinsAnimation = (delta: number) => {
            this.coins.forEach(coin => {
                if (coin.y > -250) {
                    coin.y -= 0.05 * delta
                }else{
                    coin.alpha = 0;
                    coin.scale.set(0);
                }
                if(!coin.isVisible){
                    coin.alpha = 1;
                    coin.isVisible = true;
                }
                else if(coin.alpha > 0){
                    coin.alpha -= 0.0001 * delta;
                }
            })
        }

        const stage1 = (fruit: MyModel, delta: number) => {
            fruit.scale.set(fruit.shownScale)
            fruit.shownScale += 0.005 * delta;
            if (fruit.shownScale > fruit.mainScale) {
                this.container.filters = null;
                fruit.animationStage = 2;
            }
        }
        const stage2 = (fruit: MyModel, idx: number, delta: number) => {
            const isLandscape = window.innerHeight > window.innerWidth;
            const containerOffset = isLandscape ? 0 : 100;

            if(fruit.delay <= 0){
                
                if (fruit.y > fruit.containerHeight - containerOffset  && fruit.spins < 5) {
                    fruit.y = 0;
                    fruit.spins += 1;
                }
                if (fruit.spins === 5) {
                    if (fruit.y >= fruit.startY) {
                        fruit.y = fruit.startY;
                        fruit.startSpeed = 0;
                        fruit.animationStage = 3;
                        if (idx === this.fruits.length - 1) {
                            store.dispatch(setDoneTrue())
                        }
                    }
    
                }
                fruit.y += fruit.startSpeed * delta
                if (fruit.startSpeed > 8) {
                    fruit.startSpeed -= 0.2 * delta;
                }
            }else{
                fruit.delay -= 0.15;
            }

        }
        const stage3 = (fruit: MyModel, idx: number, delta: number) => {
            if (fruit.y === fruit.startY) {
                coinsAnimation(delta)
                if (this.matches.flat().includes(idx)) {
                    const glow = new GlowFilter({ color: 0xfcc705 })
                    fruit.filters = [glow]
                    if (fruit.filters !== null) {
                        const glow = new GlowFilter({ color: 0xfcc705 })
                        fruit.filters = [glow]
                    }
                    fruit.rotation += 0.01 * delta;
                }
            }
            else {
                fruit.filters = []
            }
        }
        const animation = (delta: number) => {
            this.fruits.forEach((fruit, idx) => {
                if (fruit.animationStage === 1) {
                    stage1(fruit, delta);
                }
                if (fruit.animationStage === 2) {
                    stage2(fruit, idx, delta)
                }
                if (fruit.animationStage === 3) {
                    stage3(fruit, idx, delta);
                }
            })
        }

        this.ticker.add(animation)
    }
    setArr(arr: { arr: number[], matches: number[][] }) {
        this.arr = arr.arr;
        this.matches = arr.matches;
    }
    startup() {
        this.clearScene();
        if (this.background) {
            this.stage.addChild(this.background);
        }
        this.drawBears();
        store.dispatch(setDoneFalse())
        this.drawContainer();
        this.fruits.forEach(fruit => {
            fruit.containerHeight = this.isPortrait() ? fruit.height * 4.5 : fruit.height * 7;
        });

        console.log(this.container.height)

    }
}


class MyModel extends PIXI.Sprite {
    containerHeight: number;
    startX: number;
    startY: number;
    startSpeed: number;
    isJumping: boolean;
    shownScale: number;
    mainScale: number;
    spins: number;
    animationStage: number;
    filterStrength: number;
    delta: number;
    delay: number;
    constructor(startSpeed: number, mainScale: number, texture?: PIXI.Texture) {
        super(texture);
        this.startX = 0;
        this.startY = 0;
        this.startSpeed = startSpeed;
        this.isJumping = false;
        this.shownScale = 0;
        this.mainScale = mainScale;
        this.containerHeight = 0;
        this.spins = 0;
        this.animationStage = 1;
        this.filterStrength = 0;
        this.delta = 0;
        this.delay = 0;

    }
}

class CoinSprite extends PIXI.AnimatedSprite{
    isVisible: boolean;
    constructor(texture: PIXI.Texture<PIXI.Resource>[]){
        super(texture)
        this.isVisible = false;
    }
}
