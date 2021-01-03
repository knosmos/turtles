var urlParams = new URLSearchParams(window.location.search);
var lvl = urlParams.get('l');
if (!lvl){lvl=0;} // not in query string
lvl = parseInt(lvl);
if (lvl<0){lvl=0;}
if (lvl>=maps.length){lvl=maps.length-1;}

lenx = maps[lvl][0].length;
leny = maps[lvl].length;

function makepanel(map,newPanel){
    walls = [];
    for (let y=0; y<map.length; y++){
        for (let x=0; x<map[0].length; x++){
            if (map[y][x] == '.'){
                walls.push(new wall(x,y,newPanel));
            }
            else if (map[y][x] == 'o'){
                player = new turtle(x,y,newPanel);
            }
            else if (map[y][x] == 'p'){
                powerButton = new power(x,y,newPanel);
            }
            else if (map[y][x] == '<'){
                leftButton = new left(x,y,newPanel);
            }
            else if (map[y][x] == '>'){
                rightButton = new right(x,y,newPanel);
            }
            else if (map[y][x] == '^'){
                upButton = new up(x,y,newPanel);
            }
            else if (map[y][x] == 'v'){
                downButton = new down(x,y,newPanel);
            }
            else if (!isNaN(parseFloat(map[y][x]))){
                blank = new panelBlank(x,y,parseInt(map[y][x]),newPanel);
            }
        }
    }
    newPanel.walls = walls;
    newPanel.player = player;
    newPanel.blank = blank;
    newPanel.power = powerButton;
    newPanel.left = leftButton;
    newPanel.right = rightButton;
    newPanel.up = upButton;
    newPanel.down = downButton;
}

// stops arrow-key page scrolling
// https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
document.body.onkeydown = function (e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.view.event.preventDefault();
    }
}

newPanel = new panel(0,0,lenx,leny,0);
makepanel(maps[lvl],newPanel);
panels = [newPanel];

document.body.addEventListener("keydown",movePlayer);
function movePlayer(key){
    if (key.code == "ArrowLeft"){
        panels[0].player.moveLeft();
    }
    if (key.code == "ArrowRight"){
        panels[0].player.moveRight();
    }
    if (key.code == "ArrowUp"){
        panels[0].player.moveUp();
    }
    if (key.code == "ArrowDown"){
        panels[0].player.moveDown();
    }
}

// add next/prev level buttons
document.getElementById("lvl").innerHTML = lvl+1;
document.getElementById("prev").href = `?l=${lvl-1}`;
document.getElementById("next").href = `?l=${lvl+1}`;

// set the height of the main div so that text below it is correctly positioned
document.getElementById("main").style.paddingBottom = `${leny/lenx*100}%`;

// replace instruction text with arrow buttons on mobile
// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
    document.getElementById("controlText").style.display = "none"; // hide instructions
    document.getElementById("controls").style.display = "block"; // show controls
}

//play music upon user interaction
document.addEventListener('keydown', musicPlay);
document.addEventListener('click', musicPlay);
function musicPlay() {
    document.getElementById('playAudio').play();
    document.getElementById('playAudio').volume = 0.2;
    document.removeEventListener('keydown', musicPlay);
    document.removeEventListener('click', musicPlay);
}
function toggleMusic(){
    let a = document.getElementById("playAudio");
    if (a.paused){ a.play() }
    else {a.pause()}
}

// click/levelup sounds
function clickSound(){
    document.getElementById('click').play();
}
function levelUpSound(){
    document.getElementById('levelUp').play();
}