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

import { setDoneFalse, setDoneTrue } from './store/slotSlice'
import store from "./store/store";


import jsonUrl from './assets/spritesheet.json';
import pixiJson from './assets/pixi.json'
import coinJSON from './assets/coin.json'
import {GlowFilter, GodrayFilter} from "pixi-filters";
import {fruits} from "./utils";


export enum speed{
    idle = 0.02,
    accelerated = 0.08,
    step = (accelerated - idle) / 60,
}

export class MyApp extends PIXI.Application{
    arr: number[]
    matches: number[][]
    isLoad: boolean
    backgroundTime: number;
    background: PIXI.Sprite;
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
        this.loader
            .add(fruits.wild, wildUrl)
            .add(fruits.strawberry, strawberryUrl)
            .add(fruits.pineapple, pineappleUrl)
            .add(fruits.lemon, lemonUrl)
            .add(fruits.watermelon, watermelonUrl)
            .add(fruits.grape, grapeUrl)
            .add('bg', bgUrl)
            .add( 'bear',  bearUrl)
            .add('pixi', pixiUrl)
            .add('coin', coinUrl)
            .load((loader, resources) => {
                this.isLoad = true
                this.background = new PIXI.Sprite(resources.bg.texture);
                this.background.width = this.renderer.width;
                this.background.height = this.renderer.height;
                this.stage.addChild(this.background);
                this.background.filters = [new GodrayFilter({ alpha: 0.5})]
                console.log('loading...')
            })

    }
    clearScene(){
        this.stage.removeChildren()
    }
    drawBackground(){
        this.background.width = window.innerWidth;
        this.background.height = window.innerHeight;
    }
    setArr(arr:{arr:number[], matches: number[][]}){
        this.arr = arr.arr;
        this.matches = arr.matches;
    }
    getThis(): MyApp{
        return this;
    }
     startup() {
        this.clearScene();
        store.dispatch(setDoneFalse())

        const mainScale = 0.3;
        
        const resources = this.loader.resources;
        const matches = this.matches;

        const sheet = new PIXI.Spritesheet(resources.bear.texture as PIXI.Texture, jsonUrl);
        const coin = new PIXI.Spritesheet(resources.coin.texture as PIXI.Texture, coinJSON);
        //const pixi = new PIXI.Spritesheet(resources.pixi.texture as PIXI.Texture, pixiJson);

        // const background = PIXI.Sprite.from(bgUrl);
        // background.width = this.renderer.width;
        // background.height = this.renderer.height;
        
         if(this.background){
             this.stage.addChild(this.background);
         }




        //const sheet = new PIXI.Spritesheet(app.loader.resources.bear.texture, spritesheetData);

        //const sheet = app.loader.resources.bear;
        //const w = new PIXI.Sprite(sheet)

        // let sheet = app.loader.resources[url.href].spritesheet;
        //app.stage.addChild(w)

        sheet.parse(() => {});
        coin.parse(() => {});
        // })
        // pixi.parse(() => {
        // })
        // const animetion = new PIXI.AnimatedSprite(sheet.textures)


        // initialize background sprite
        // const background = new PIXI.Sprite(app.loader.resources.bear);
        // background.width = app.renderer.width;
        // background.height = app.renderer.height;

        // add it to the stage


        //const somebear = new PIXI.Sprite(sheet.textures['Slice1'])

        const container = new PIXI.Container();


         //container.filters = [new PIXI.filters.BlurFilter(40, 10)]
         container.x = this.renderer.width / 2;
         container.y = this.renderer.height / 2;

         //figure.beginFill(0x650A5A, 0.2);

        const fruitsKeys = Object.keys(fruits);
        const bears:PIXI.Sprite[] = [];
        const coins: PIXI.Sprite[] = [];

        for(let i = 0; i < 5; i++){
            const bearTexture = Object.keys(sheet.textures).map( item => sheet.textures[item])
            const bear = new PIXI.AnimatedSprite(bearTexture);
            this.stage.addChild(bear);
            bear.play();
            bear.animationSpeed = 0.4;
            bear.zIndex = 0;
            bear.scale.set(0.02 * i);
            bear.x = this.renderer.width * Math.random();
            bear.y = this.renderer.height / 2 + 2 * i;
            bears.push(bear)
        }


        const bunnys = this.arr.map( (item, idx) => {
            //const bunny = new PIXI.Spritesheet(app.loader.resources.bear.texture, './assets/bear-spritesheet.json')
            //const some = Object.keys(pixi.textures).map( item => pixi.textures[item])

            //const bunny = new PIXI.AnimatedSprite(some);
            //bunny.play();
            //bunny.animationSpeed = 0.3;
            //bunny.scale.set(1)
            const bunny: MyModel = new MyModel(30, mainScale, this.loader.resources[fruitsKeys[item]].texture);
            // Center the sprite's anchor point
            bunny.anchor.set(0.5);
            bunny.scale.set(mainScale);
            const col = Math.floor(idx / 5)
            const row = Math.floor(idx % 5)



            // Move the sprite to the center of the screen
            bunny.x = row * 80 + 55;
            bunny.y = col * 60 + 30;
            bunny.startX = bunny.x;
            bunny.startY = bunny.y;
            bunny.zIndex = 10;
            container.addChild(bunny)
            // Listen for animate update
            if(matches.flat().includes(idx)){
                const coinTexture = Object.keys(coin.textures).map( item => coin.textures[item])
                const bear = new PIXI.AnimatedSprite(coinTexture);

                bear.zIndex = 100;
                bear.play();
                bear.animationSpeed = 0.4;
                bear.scale.set(0.3);
                bear.x = bunny.x - 10;
                bear.y = bunny.y - 10;
                bear.alpha = 0;
                container.addChild(bear);
                coins.push(bear);
            }

            return bunny;
        });
        bunnys.forEach( bunny => {
            bunny.containerHeight = container.height;
        })
         //container.width+=20;
         container.pivot.x = container.width / 2 + 20;
         container.pivot.y = container.height / 2;

         const figure = new PIXI.Graphics();
         figure.lineStyle(30, 0x000000, 0.5);
         figure.beginFill(0x000000, 0.2);
         figure.drawRect(-5,-15, container.width + 50, container.height + 50)
         figure.filters = [new PIXI.filters.BlurFilter(10,10)]
         figure.zIndex = 0;
         //container.addChild(figure)
         container.scale.set(this.renderer.height > this.renderer.width ? 1 : 1.3);
         container.sortableChildren = true;
         container.filters = [new PIXI.filters.BlurFilter(40, 20)]




         this.stage.addChild(container);

        

         let filter = 20;

         const animation = (delta: number)=>{
            bears.forEach((bear,idx) => {
                if(bear.x < -50){
                    bear.x = this.renderer.width;
                }
                bear.x -= 0.5 * idx;
            })

            bunnys.forEach((bunny, idx) => {
                if(bunny.animationStage === 1){
                    stage1(bunny, delta);
                }
                if( bunny.animationStage === 2) {
                   stage2(bunny, idx, delta)
                }
                if(bunny.animationStage === 3) {
                    stage3(bunny, idx, delta);
                }
            })
            if(this.background.filters){
                //this.background.filters = [new GodrayFilter({time: this.backgroundTime, alpha: 0.5})]
                //(this.background.filters[0] as GodrayFilter).time += 0.01 * delta;
            };
        }

         this.ticker.add(animation)


         const stage1 = (bunny: MyModel, delta: number) => {
             bunny.scale.set(bunny.shownScale)
             bunny.shownScale+=0.005 * delta;
             if(bunny.shownScale > bunny.mainScale){
                 bunny.animationStage = 2;
             }
         }
         const stage2 = (bunny:MyModel,idx:number, delta: number) => {
             if (bunny.y > bunny.containerHeight) {
                 bunny.y = -10;
                 bunny.spins += 1;
                 if(filter >= 0){
                     container.filters = [new PIXI.filters.BlurFilter(filter - bunny.spins * 4, 20)]
                 }
             }
             if(bunny.spins === 5) {
                 if (bunny.y >= bunny.startY) {
                     bunny.y = bunny.startY;
                     bunny.startSpeed = 0;
                     bunny.animationStage = 3;
                     if (idx === bunnys.length - 1) {
                         store.dispatch(setDoneTrue())
                     }
                 }

             }
             bunny.y += bunny.startSpeed * delta
             if(bunny.startSpeed > 10){
                 bunny.startSpeed-= 0.2 * delta;
             }
         }
         const stage3 = (bunny:MyModel,idx:number, delta: number) => {
             const isMobile = this.renderer.width < this.renderer.height;
             if(bunny.y === bunny.startY){
                 coins.forEach( coin => {
                     const x = isMobile ? coin.x : -70;
                     if(coin.x > x){
                         coin.x-=0.2 * delta;
                     }
                     if(coin.y > -250){
                         coin.y -= 0.2 * delta
                     }
                     if(coin.x < x + 1 && coin.y < -249){
                         coin.alpha = 0;
                         coin.scale.set(0);
                     }
                     if(coin.alpha < 1){
                         coin.alpha += 0.01 * delta;
                     }
                 })
                 if(matches.flat().includes(idx)){

                         //const wave = new ShockwaveFilter([0.5, 0.5],{speed: 10, radius: 1}, this.backgroundTime)
                     if(this.background.filters){
                         //this.background.filters[1] = glow
                     }
                     if(!bunny.filters){
                         const glow = new GlowFilter({color: 0xfcc705})
                         //this.backgroundTime+= 0.01 * delta;
                         bunny.filters = [glow]
                     }

                     //bunny.play();
                    bunny.rotation+= 0.01 * delta;

                     if(bunny.x > this.renderer.width){
                         bunny.x = 0;
                     }
                 }else{
                     if(bunny.mainScale > 0){
                         bunny.mainScale -= 0.0025 * delta
                         bunny.scale.set(bunny.mainScale);
                         bunny.alpha -= 0.02 * delta;
                     }else{
                         bunny.alpha = 0;
                         bunny.filters = []
                     }
                 }
             }
             else{
                  bunny.filters = []
             }
         }


        // bunnys.forEach( (bunny, idx) => {
        //     let i = 30;
        //     let filter = 20;
        //     let speens = 0;
        //     let reverse = false;
        //     let scale = mainScale;
        //     let shownScale = 0;
        //     const startY = bunny.y;
        //     const startX = bunny.x;
        //     const height = container.height;
        //     let isJumping = false;
        //     this.ticker.add( (delta) =>
        //     {
        //         if(!isJumping){
        //             bunny.scale.set(shownScale)
        //             shownScale+=0.005;
        //             if(shownScale > scale){
        //                 isJumping = true;
        //             }
        //         }else{
        //             if(bunny.y > height){
        //                 bunny.y = 0;
        //                 speens+=1;
        //                 container.filters = [new PIXI.filters.BlurFilter(filter - speens * 4, 20)]
        //             }
        //             bunny.y += i * delta
        //             if(speens === 5){
        //                 if( bunny.y >= startY){
        //                     bunny.y = startY;
        //                     i=0;
        //                 }
        //                 if(bunny.y === startY){
        //                     if(matches.flat().includes(idx)){
        //                         bunny.filters = [new GlowFilter({color: 0xfcc705})]
        //                         //bunny.play();
        //                         //container.rotation += 0.01  * delta;
        //                         bunny.rotation -= 0.02 * delta
        //
        //
        //                         if(bunny.x > this.renderer.width){
        //                             bunny.x = 0;
        //                         }
        //
        //
        //                         // if(reverse){
        //                         //     bunny.y += 0.3 * delta;
        //                         // }else{
        //                         //
        //                         // }
        //                         // if(bunny.y <= startY - 15 || bunny.y >= startY){
        //                         //     reverse = !reverse
        //                         // }
        //                         // if(reverse){
        //                         //     scale-=0.005 * delta
        //                         //     bunny.scale.set(scale);
        //                         // }else{
        //                         //     scale+=0.005 * delta
        //                         //     bunny.scale.set(scale);
        //                         // }
        //                         // if(scale > 1.1 || scale < 0.9){
        //                         //     reverse = !reverse
        //                         // }
        //                     }else{
        //                         if(scale > 0){
        //                             scale -= 0.01 * delta
        //                             bunny.scale.set(scale);
        //                         }else{
        //                             bunny.alpha = 0;
        //                         }
        //
        //
        //                     }
        //                     if(idx === bunnys.length - 1){
        //                         this.isStop = true;
        //                     }
        //                 }
        //                 else{
        //                     bunny.filters = []
        //                 }
        //             }
        //             if(i > 5.1){
        //                 i-= 0.23 * delta;
        //             }
        //         }
        //     });
        //
        // })

    }
}


class MyModel extends PIXI.Sprite{
    containerHeight: number;
    startX: number;
    startY: number;
    startSpeed: number;
    isJumping: boolean;
    shownScale: number;
    mainScale: number;
    spins: number;
    animationStage: number;
    filterStrength:number;
    delta: number;
    constructor(startSpeed: number,mainScale:number,  texture?: PIXI.Texture) {
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

    }
}