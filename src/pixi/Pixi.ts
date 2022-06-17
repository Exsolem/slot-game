import * as PIXI from "pixi.js";

import bgUrl from '../assets/background.jpg'
import wildUrl from '../assets/SYM1.png';
import strawberryUrl from '../assets/SYM3.png';
import pineappleUrl from '../assets/SYM4.png';
import lemonUrl from '../assets/SYM5.png';
import watermelonUrl from '../assets/SYM6.png';
import grapeUrl from '../assets/SYM7.png';
import bearUrl from '../assets/spritesheet.png'
import coinUrl from '../assets/coin.png'
import bgPortraitUrl from '../assets/background-portrait.jpg'
import leafUrl from '../assets/leave.png'

import { setDoneFalse, setDoneTrue, setIsPixiLoaded } from '../store/slotSlice'
import { store } from "../store/store";


import jsonUrl from '../assets/spritesheet.json';
import coinJSON from '../assets/coin.json'
import { GlowFilter, GodrayFilter } from "pixi-filters";
import { fruits } from "../utils";


export class MyApp extends PIXI.Application {
    arr: number[]
    matches: number[][]
    lineScore: number[]
    isLoad: boolean
    backgroundTime: number;
    background: PIXI.Sprite;
    backgroundTexture: {
        portrait: PIXI.Texture | undefined;
        landscape: PIXI.Texture | undefined;
    };
    text: PIXI.Text[]
    bears: PIXI.Sprite[];
    fruits: MyModel[];
    coins: CoinSprite[];
    ground: PIXI.Graphics[]
    mainScale: number;
    container: PIXI.Container;
    resources: PIXI.utils.Dict<PIXI.LoaderResource>;
    coinsTexture: PIXI.Texture<PIXI.Resource>[];
    bearTexture: PIXI.Texture<PIXI.Resource>[];
    isBgAnimation: boolean;
    containerFilterStrength: number;
    leaves: PIXI.Sprite[]
    constructor() {
        super({
            resizeTo: window,
            resolution: PIXI.settings.RESOLUTION || 1,
        });
        this.isBgAnimation = true
        this.arr = []
        this.matches = []
        this.lineScore = []
        this.isLoad = false;
        this.backgroundTime = 0;
        this.background = new PIXI.Sprite();
        this.leaves = [];
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
        this.text = [];
        this.ground = [];
        this.containerFilterStrength = 40;
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
            .add('coin', coinUrl)
            .add('leaf', leafUrl)
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
        this.text = [];
        this.ground = [];
        this.containerFilterStrength = 40;
    }
    onLoadHandler(resources: PIXI.utils.Dict<PIXI.LoaderResource>) {
        this.createBackground(resources);
        this.drawBackground();
        this.createBears(resources)
        this.drawBears();
        this.addLeaves();

        this.addBackgroundAnimation();
        this.addFruitsAnimation();
        store.dispatch(setIsPixiLoaded())

        // let time = performance.now();
        // const animation = () => {
        //     let now = performance.now();
        //     const delta = Math.min(1, (now - time));
        //     time = now;
        //     this.addBackgroundAnimation(delta);
        //     this.addFruitsAnimation(delta);
        //     requestAnimationFrame(animation);
        // }
        // animation()

    }
    createBackground(resources: PIXI.utils.Dict<PIXI.LoaderResource>) {
        this.isLoad = true
        this.background = new PIXI.Sprite(resources.bg.texture);
        this.backgroundTexture.portrait = new PIXI.Sprite(resources.bgPortrait.texture).texture;
        this.backgroundTexture.landscape = this.background.texture;
        this.stage.addChild(this.background);
        // @ts-ignore
        this.background.filters = [new GodrayFilter({alpha: 0.7})]
    }
    setBackgroundSize() {
        this.background.width = window.innerWidth;
        this.background.height = window.innerHeight;
    }
    setBackgroundTexture() {
        if (window.innerHeight > window.innerWidth) {
            if (this.backgroundTexture.portrait) {
                this.background.texture = this.backgroundTexture.portrait;
            }
            this.bears.forEach((bear, idx) => {
                bear.y = window.innerHeight / 2.5 + 2 * idx + 10;
            })
        } else {
            if (this.backgroundTexture.landscape) {
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
        if (this.fruits.length > 0) {
            this.setContainerScale(0)
        }
    }
    setContainerScale(scale: number) {
        this.container.scale.set(scale);
        scale += 0.05;

        const cWidth = this.container.width;
        const cHeight = this.container.height;
        const wHeight = window.innerHeight;
        const wWidth = window.innerWidth;

        if (this.isPortrait()) {
            if (cWidth <= wWidth - 30) {
                this.setContainerScale(scale);
            }
        } else {
            if (cWidth <= wWidth / 2 && cHeight <= wHeight - 30) {
                this.setContainerScale(scale);
            }
        }
        return ;
    }
    addLeaves(){
        if(this.leaves.length > 0){
            this.leaves.forEach( leaf => {
                this.stage.addChild(leaf);
            })
            return 
        }
        const leafTexture = this.resources.leaf.texture;
        for(let i = 1; i < 20; i++){
            const leaf = new PIXI.Sprite(leafTexture);
            leaf.scale.set(0.002 * i);
            leaf.anchor.set(0.5)
            leaf.x = window.innerWidth * Math.random();
            leaf.y = window.innerHeight * Math.random();
            this.stage.addChild(leaf);
            this.leaves.push(leaf);
            const velocityX = Math.random();
            const velocityY = Math.random()

            this.ticker.add((delta)=>{
                leaf.rotation += 0.01 * delta;
                leaf.x -= 5 * velocityX *  delta;
                leaf.y += 5 * velocityY *  delta;
                if(leaf.x < -100){
                    leaf.x = window.innerWidth  + 100;
                }
                if(leaf.y > window.innerHeight + 100){
                    leaf.y = -100;
                }
            })
        }
    }
    createBears(resources: PIXI.utils.Dict<PIXI.LoaderResource>) {
        if (this.bearTexture.length === 0) {
            const bearSpritesheet = new PIXI.Spritesheet(resources.bear.texture as PIXI.Texture, jsonUrl);
            bearSpritesheet.parse(() => { });
            this.bearTexture = Object
                .keys(bearSpritesheet.textures)
                .map(item => bearSpritesheet.textures[item])
        }

        for (let i = 0; i < 5; i++) {
            const bear = new PIXI.AnimatedSprite(this.bearTexture);

            bear.animationSpeed = 0.4;
            bear.zIndex = 0;
            bear.scale.set(0.02 * i);
            bear.x = this.renderer.width * Math.random();
            bear.y = this.renderer.height / 2 + i;
            bear.roundPixels = true;
            bear.interactive = true;
            bear.buttonMode = true;

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
            if (this.background.filters && this.isBgAnimation) {
                // @ts-ignore
                (this.background.filters[0] as GodrayFilter).time += 0.01 * delta;
            }
        })
        // this.bears.forEach((bear, idx) => {
        //     if (bear.x < -50) {
        //         bear.x = this.renderer.width;
        //     }
        //     bear.x -= 0.5 * idx * delta;
        // });
        // if (this.background.filters) {
        //     //(this.background.filters[0] as GodrayFilter).time += 0.01 * delta;
        // }
    }
    drawContainer() {

        this.addFruits();
        this.container.x = this.renderer.width / 2;
        this.container.y = this.renderer.height / 2;
        this.container.pivot.x = this.container.width / 2 + 20;
        this.container.pivot.y = this.container.height / 2;

        this.setContainerScale(0.2);
        this.container.sortableChildren = true;
        this.container.filters = [new PIXI.filters.BlurFilter(this.containerFilterStrength, 10)]

        this.stage.addChild(this.container);
    }
    isPortrait(): boolean {
        return window.innerHeight > window.innerWidth
    }
    addFruits() {
        const fruitsKeys = Object.keys(fruits);
        this.arr.forEach((fruitType, idx) => {
            const texture = this.resources[fruitsKeys[fruitType]].texture;
            const fruit = new MyModel(20, this.mainScale, texture);

            const col = Math.floor(idx / 5)
            const row = Math.floor(idx % 5)

            fruit.anchor.set(0.5);
            fruit.scale.set(this.mainScale);

            fruit.x = row * (fruit.width + 5) + fruit.width / 2 + 20;
            fruit.y = col * fruit.height + fruit.height / 2;
            fruit.delay = row;
            fruit.startX = fruit.x;
            fruit.startY = fruit.y;
            fruit.zIndex = 10;
            fruit.roundPixels = true;

            this.container.addChild(fruit)
            this.fruits.push(fruit);
            if (this.matches.flat().includes(idx)) {
                this.addCoins(idx, fruit);
            }
            this.matches.forEach((match, index) => {
                if (idx !== match[0]) {
                    return
                }
                const isFreeSpin = this.lineScore[index] === 0;
                const score = (match.length - 2) * match.length;

                const text = isFreeSpin ?
                    `spins:${score}` :
                    this.lineScore[index].toString();

                this.addGround(
                    fruit.startX, 
                    fruit.startY, 
                    match.length * fruit.width, 
                    fruit.height, 
                    fruit.width
                );

                this.addText(
                    fruit.x,
                    fruit.y,
                    text,
                    fruit.width * match.length,
                    isFreeSpin
                )
            })


        });

    }
    addGround(x: number, y: number, width: number, height: number, fruitWidth: number) {
        // const texture = this.resources.vine.texture;
        // const vine = new PIXI.Sprite(texture);

        const figure = new PIXI.Graphics()
        figure.beginFill(0x0f0317, 0.5);
        figure.drawRect(x - fruitWidth / 2 + 5, y, width, height);
        figure.zIndex = 8;
        figure.pivot.y = height / 2;
        figure.alpha = 0;
        // vine.x = x - fruitWidth / 2 + 5;
        // vine.y = y;
        // vine.width = width;
        // vine.height = height;
        // vine.pivot.y = height * 7;
        // vine.zIndex = 14;

        this.container.addChild(figure);
        this.ground.push(figure);
    }
    groundAnimation(delta: number) {
        this.ground.forEach(ground => {
            if (ground.alpha < 1) {
                ground.alpha += 0.0005 * delta;
            }
        })
    }
    setFruitsPosition() {
        if (this.fruits.length > 0) {
            this.fruits.forEach((fruit, idx) => {
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

        if (this.coinsTexture.length === 0) {
            this.addCoinsTexture()
        }

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
    addCoinsTexture() {
        const coinSheet = new PIXI.Spritesheet(this.resources.coin.texture as PIXI.Texture, coinJSON);
        coinSheet.parse(() => { });
        this.coinsTexture = Object.keys(coinSheet.textures).map(item => coinSheet.textures[item])
    }
    coinsAnimation(delta: number) {
        this.coins.forEach(coin => {
            if (coin.y > -250) {
                coin.y -= 0.05 * delta
            } else {
                coin.alpha = 0;
                coin.scale.set(0);
            }
            if (!coin.isVisible) {
                coin.alpha = 1;
                coin.isVisible = true;
            }
            else if (coin.alpha > 0) {
                coin.alpha -= 0.0001 * delta;
            }
        })
    }
    addText(x: number, y: number, text: string, width: number, isFreeSpin: boolean) {
        const style = new PIXI.TextStyle({
            fontSize: 100,
            fill: [
                "#2fbe05",
                "#1aabb7"
            ],
            fontFamily: "\"Lucida Console\", Monaco, monospace",
            stroke: "#0a0a0a",
            strokeThickness: 3
        });

        const score = new PIXI.Text(text, style);
        score.x = isFreeSpin ? x + width / 6 : x + width / 2;
        score.y = y - 20;
        score.zIndex = 12;
        score.scale.set(0.4);
        score.pivot.x = width / 2;
        score.alpha = 0;

        this.container.addChild(score)
        this.text.push(score);
    }
    textAnimation(delta: number) {
        this.text.forEach(text => {
            if (text.alpha < 1) {
                text.alpha += 0.0005 * delta;
            }
        })
    }
    addFruitsAnimation() {
        const animation = (delta: number) => {
            this.fruits.forEach((fruit, idx) => {
                if (fruit.animationStage === 1) {
                    this.stage1(fruit, delta);
                } else if (fruit.animationStage === 2) {
                    this.stage2(fruit, idx, delta)
                } else if (fruit.animationStage === 3) {
                    this.stage3(fruit, idx, delta);
                }
            })
        }
        //animation(delta)
        this.ticker.add(animation)
    }
    stage1(fruit: MyModel, delta: number) {
        fruit.scale.set(fruit.shownScale)
        fruit.shownScale += 0.005 * delta;
        if (fruit.shownScale > fruit.mainScale) {
            fruit.animationStage = 2;
        }
    }
    stage2(fruit: MyModel, idx: number, delta: number) {
        if (fruit.delay > 0) {
            fruit.delay -= 0.15;
            return
        }
        if(this.containerFilterStrength > 0){
            this.containerFilterStrength -= 0.03;
            this.container.filters = [new PIXI.filters.BlurFilter(this.containerFilterStrength, 10)]

        }
        if (fruit.y > fruit.containerHeight && fruit.spins < 5) {
            fruit.y = 0;
            fruit.spins += 1;
        }
        fruit.y += fruit.startSpeed * delta
        if (fruit.startSpeed > 8) {
            fruit.startSpeed -= 0.2 * delta;
        }
        if (fruit.spins < 5) {
            return 
        }
        if (fruit.y >= fruit.startY) {
            fruit.y = fruit.startY;
            fruit.startSpeed = 0;
            fruit.animationStage = 3;

            if (idx === this.fruits.length - 1) {
                store.dispatch(setDoneTrue())
            }
        }
        
    }
    stage3(fruit: MyModel, idx: number, delta: number) {
        if (fruit.y === fruit.startY) {
            this.coinsAnimation(delta);
            this.textAnimation(delta);
            this.groundAnimation(delta);
            if (!this.matches.flat().includes(idx)) {
                return 
            }
            if (!fruit.filters) {
                const glow = new GlowFilter({ color: 0xfcc705 })
                // @ts-ignore
                fruit.filters = [glow]
            }
            fruit.rotation += 0.01 * delta;
        }
        else {
            fruit.filters = null;
        }
    }
    setArr(arr: { arr: number[], matches: number[][] }, lineScore: number[]) {
        this.arr = arr.arr;
        this.matches = arr.matches;
        this.lineScore = lineScore;
    }
    startup() {
        store.dispatch(setDoneFalse())
        this.clearScene();
        if (this.background) {
            this.stage.addChild(this.background);
        }
        this.drawBears();
        this.addLeaves();
        
        this.drawContainer();
        this.fruits.forEach(fruit => {
            fruit.containerHeight = this.isPortrait() ? fruit.height * 4.5 : fruit.height * 7;
            fruit.containerHeight = fruit.height * 4.5;
        });
    }
}


class MyModel extends PIXI.Sprite {
    containerHeight: number;
    startX: number;
    startY: number;
    startSpeed: number;
    shownScale: number;
    mainScale: number;
    spins: number;
    animationStage: number;
    delta: number;
    delay: number;
    constructor(startSpeed: number, mainScale: number, texture?: PIXI.Texture) {
        super(texture);
        this.startX = 0;
        this.startY = 0;
        this.startSpeed = startSpeed;
        this.shownScale = 0;
        this.mainScale = mainScale;
        this.containerHeight = 0;
        this.spins = 0;
        this.animationStage = 1;
        this.delta = 0;
        this.delay = 0;
    }
}

class CoinSprite extends PIXI.AnimatedSprite {
    isVisible: boolean;
    constructor(texture: PIXI.Texture<PIXI.Resource>[]) {
        super(texture)
        this.isVisible = false;
    }
}
