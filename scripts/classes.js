function makeElem(x,y,w,h,img){
    elem = document.createElement("img");
    elem.style.position = "absolute";
    elem.src = img;
    elem.style.width = `${w/lenx*100}%`;
    elem.style.height = `${h/leny*100}%`;
    elem.style.left = `${x/lenx*100}%`;
    elem.style.top =  `${y/leny*100}%`;
    elem.style.filter = "sepia(0.5)";
    elem.style.imageRendering = "pixelated";
    return elem;
}

/* turtle character */

class turtle{
    constructor(x,y,parent){
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.elem = makeElem(x,y,1,1,"assets/turtle.png");
        this.elem.style.transition = "left 0.4s, top 0.4s";
        this.elem.style.zIndex = '999';
        this.elem.style.animation = "hover 1s linear infinite";
        //this.elem.style.transitionTimingFunction = "linear";
        this.parent.elem.appendChild(this.elem);
    }
    locationClear(x,y){
        // does it hit the panel edges?
        if (x<0 || x>=lenx){
            return false;
        }
        if (y<0 || y>=leny){
            return false;
        }        
        // does it hit the panelBlank?
        let b = this.parent.blank;
        if (x>=b.x && x<b.x+b.w){
            if (y>=b.y && y<b.y+b.h){
                return false;
            }
        }
        // does it hit any walls?
        for (let w of this.parent.walls){
            if (w.x==x && w.y==y){
                return false;
            }
        }
        return true;
    }
    updatePosition(){
        this.elem.style.left = `${this.x/lenx*100}%`;
        this.elem.style.top = `${this.y/leny*100}%`;
    }
    pressButton(){
        this.parent.power.detect();
        this.parent.left.detect();
        this.parent.right.detect();
        this.parent.up.detect();
        this.parent.down.detect();
    }
    moveRight(){
        if (this.locationClear(this.x+1,this.y)){
            this.x += 1;
            this.updatePosition();
            this.pressButton();
            //setTimeout(this.pressButton.bind(this),300);
        }
        this.elem.src = "assets/turtle2.png";
    }
    moveLeft(){
        if (this.locationClear(this.x-1,this.y)){
            this.x -= 1;
            this.updatePosition();
            this.pressButton();
            //setTimeout(this.pressButton.bind(this),300);
        }
        this.elem.src = "assets/turtle.png";
    }
    moveUp(){
        if (this.locationClear(this.x,this.y-1)){
            this.y -= 1;
            this.updatePosition();
            this.pressButton();
            //setTimeout(this.pressButton.bind(this),300);
        }
    }
    moveDown(){
        if (this.locationClear(this.x,this.y+1)){
            this.y += 1;
            this.updatePosition();
            this.pressButton();
            //setTimeout(this.pressButton.bind(this),300);
        }
    }
}

/* static elements */

class wall{
    constructor(x,y,parent){
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.elem = makeElem(x,y,1,1,'assets/wall.png');
        this.elem.style.filter = `sepia(${Math.random()/2+0.3})`;
        this.parent.elem.appendChild(this.elem);
    }
}

/* panels */

class panel{
    constructor(x,y,w,h,parent){
        this.x = x;
        this.y = y;
        this.w = w;
        this.parent = parent;
        this.elemwrapper = document.createElement("div");
        this.elemwrapper.style.cssText = `
            position:absolute;
            width:${w/lenx*100-2}%; /* -2 is to make the edges a tiny bit smaller to reduce border conflicts */
            left:${x/lenx*100}%;
            top:${y/leny*100}%;
        `;
        this.elem = document.createElement("div");
        this.elem.style.cssText = `
            padding-top:${h/w*100-2}%;
            background-image:url("assets/panel.png");
            /*background-repeat:repeat;*/
            background-size:cover;
            border-radius:5px;
            image-rendering:pixelated;
            border: 2px solid #c5b6a4;
        `;
        this.cover = document.createElement("div");
        this.cover.style.cssText = `
            position:absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
            border-radius:5px;
            background-color:rgba(0,0,0,${Math.random()/8});
        `
        this.elem.appendChild(this.cover);
        this.elemwrapper.appendChild(this.elem);
        if (parent){
            this.parent.elem.appendChild(this.elemwrapper);
        }
        else{
            document.getElementById("main").appendChild(this.elemwrapper);
        }
    }
}

class panelBlank{
    // placeholder for the child screen when power key has not yet been pressed
    constructor(x,y,w,parent){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = w/lenx*leny;
        this.parent = parent;

        this.elem = makeElem(x,y,w-0.2,this.h-0.2,"assets/water.png"); // -0.2 to reduce border conflicts
        this.elem.style.borderRadius = "5px";
        this.elem.style.border = "2px solid #5b7a99";
        
        this.elem2 = makeElem(x,y,w-0.2,this.h-0.2,"assets/water2.png"); // for water fading effect
        this.elem2.style.cssText += "border-radius:5px;border:2px solid #5b7a99;animation:water 2s infinite;";
        
        parent.elem.appendChild(this.elem);
        parent.elem.appendChild(this.elem2);
    }
    activate(){
        this.elem.style.display = "none";
        this.elem2.style.display = "none";
        newPanel = new panel(this.x,this.y,this.w,this.h,this.parent);
        console.log(this.h,leny);
        makepanel(maps[lvl],newPanel);
        panels.push(newPanel);
        this.parent.child = newPanel;
    }
}

/* controls */

class button{
    constructor(img,x,y,parent){
        this.img = img;
        this.x = x;
        this.y = y;
        this.parent = parent;

        this.elem = makeElem(x,y,1,1,this.img);
        this.elem.style.transition = "opacity 0.2s";
        this.parent.elem.appendChild(this.elem);
    }
    detect(){
        let p = this.parent.player;
        if (p.x == this.x && p.y == this.y){
            if (!this.hidden){
                this.press();
            }   
        }
    }
}

class power extends button{
    constructor(x,y,parent){
        super("assets/power.png",x,y,parent);
        this.hidden = false;
    }
    press(){
        console.log("power key pressed");
        // show the keyboard buttons
        this.parent.left.show();
        this.parent.right.show();
        this.parent.up.show();
        this.parent.down.show();
        // make a new child panel
        this.parent.blank.activate();
        // hide the button
        this.hidden = true;
        this.elem.style.opacity = 0;
    }
}

class left extends button{
    constructor(x,y,parent){
        super("assets/left.png",x,y,parent);
        this.elem.style.opacity = 0;
        this.hidden = true;
    }
    press(){
        this.parent.child.player.moveLeft();
    }
    show(){
        this.hidden = false;
        this.elem.style.opacity = 1;
    }
}

class right extends button{
    constructor(x,y,parent){
        super("assets/right.png",x,y,parent);
        this.elem.style.opacity = 0;
        this.hidden = true;
    }
    press(){
        this.parent.child.player.moveRight();
    }
    show(){
        this.hidden = false;
        this.elem.style.opacity = 1;
    }
}

class up extends button{
    constructor(x,y,parent){
        super("assets/up.png",x,y,parent);
        this.elem.style.opacity = 0;
        this.hidden = true;
    }
    press(){
        this.parent.child.player.moveUp();
    }
    show(){
        this.hidden = false;
        this.elem.style.opacity = 1;
    }
}

class down extends button{
    constructor(x,y,parent){
        super("assets/down.png",x,y,parent);
        this.elem.style.opacity = 0;
        this.hidden = true;
    }
    press(){
        this.parent.child.player.moveDown();
    }
    show(){
        this.hidden = false;
        this.elem.style.opacity = 1;
    }
}