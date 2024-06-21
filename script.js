let canvas=document.getElementById("canvas");
let ctx=canvas.getContext('2d');
let mover=document.getElementById("mover");
let c=mover.getContext('2d');
let x;
let y;
let zombies=[];
let obstacles=[];
let timer=document.getElementById("timer");
let button=document.getElementById("startbutton");
let rules=document.getElementById("rules");
let inst=document.getElementById("instructions");
let wave=document.getElementById("wave");
let gameover=document.getElementById("gameover");
let playagain_button=document.getElementById("playagain");
let ob=document.getElementById("obstacle");
let pause_button=document.getElementById("pause");
let cursor=document.getElementById("cursor");
var over=false;
var shooting=false;
var pause_flag=false;
let count=0;
let interval=8000;
let clear;
var time_running=false;
class Zombie{
    constructor(x,y,position){
        this.x=x;
        this.y=y;
        this.position=position;
        this.count=0;
        this.up=false;
        this.moving=false;
        this.reached=false;
    }
    draw(ctx){
        //zombie body
        ctx.beginPath();
        ctx.fillStyle='darkgreen';
        ctx.roundRect(this.x+50,this.y+50,50,75,10);
        ctx.fill();
        //hand1
        if(this.position=="left"){
            ctx.beginPath();
            ctx.fillStyle='black';
            ctx.fillRect(this.x+100,this.y+75,20,10);
            ctx.arc(this.x+120,this.y+80,5,0,Math.PI *2);
            ctx.fill();
        }
        //hand1
        else{
            ctx.beginPath();
            ctx.fillStyle='black';
            ctx.fillRect(this.x+80,this.y+85,20,10);
            ctx.arc(this.x+80,this.y+90,5,0,Math.PI *2);
            ctx.fill();
        }
        //hand2
        if(this.position=="left"){
            ctx.fillRect(this.x+50,this.y+85,20,10);
            ctx.arc(this.x+70,this.y+90,5,0,Math.PI *2);
            ctx.fill();
        }
        //hand2
        else{
            ctx.fillRect(this.x+30,this.y+75,20,10);
            ctx.arc(this.x+30,this.y+80,5,0,Math.PI *2);
            ctx.fill();
        }
        //leg 1
        ctx.beginPath();
        ctx.fillStyle='brown';
        ctx.fillRect(this.x+60,this.y+125,10,20);
        ctx.beginPath();
        ctx.fillStyle='black';
        ctx.fillRect(this.x+60,this.y+145,10,5);
        ctx.fill();
        //leg 2
        ctx.fillStyle='brown';
        ctx.fillRect(this.x+80,this.y+125,10,20);
        ctx.beginPath();
        ctx.fillStyle='black';
        ctx.fillRect(this.x+80,this.y+145,10,5);
        ctx.fill();
        //zombie face
        ctx.beginPath();
        ctx.fillStyle='maroon';
        ctx.arc(this.x+75,this.y+50,25,0,2*Math.PI,1);
        ctx.fill();
        //zombie mouth
        ctx.beginPath();
        ctx.fillStyle='black';
        ctx.strokeStyle='white';
        ctx.strokeRect(this.x+65,this.y+55,20,8);
        ctx.fillRect(this.x+65,this.y+55,20,8);
        ctx.beginPath();
        ctx.moveTo(this.x+65,this.y+55);
        ctx.lineTo(this.x+70,this.y+60);
        ctx.lineTo(this.x+75,this.y+55);
        ctx.lineTo(this.x+80,this.y+60);
        ctx.lineTo(this.x+85,this.y+55);
        ctx.strokeStyle='white';
        ctx.stroke();
        //zombie eyes
        ctx.beginPath();
        ctx.arc(this.x+65,this.y+42,5,0,2*Math.PI);
        ctx.arc(this.x+85,this.y+42,5,0,2*Math.PI);
        ctx.fill();
        //zombie life bar
        ctx.beginPath();
        ctx.fillStyle="lightgreen";
        ctx.fillRect(this.x+55,this.y+10,40-(20*this.count),5);
    }
    move(speed){
        if(this.position=="left" && this.x<500){
            this.x+=speed;
        }
        else if (this.position=="right" && this.x>500){
            this.x-=speed;
        }
    }
}
class obstacle{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.placed=false;
    }
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle='green';
        ctx.fillRect(this.x,this.y,80,80);
    }
}
class player{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    draw_player(c,count){
        if(count>=30){  
            over=true;
            gameover.innerHTML="OOPS!YOU LOST<br><button id='playagain'>PLAY AGAIN</button>";
            game_over();
        }
        if(!over){
            c.clearRect(this.x+120,this.y+70,30,30);
            c.beginPath();
            c.fillStyle='blue';
            c.fillRect(this.x+120,this.y+80,30,30);
            c.beginPath();
            c.strokeStyle='black';
            c.strokeRect(this.x+120,this.y+80,30,30);
            c.beginPath();
            c.fillStyle='lightgreen';
            c.fillRect(this.x+120,this.y+70,30-count,3);
        }
    }
}
class track{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}
let move_tracker=new track(0,0);
let pl=new player(0,0); //player
function create_obstacle(){
    let obs=new obstacle(50,170,80,80);
    obstacles.push(obs);
    obs.draw(ctx);
}
function move_obstacle(event){
    obstacles[obstacles.length-1].x=event.x;
    obstacles[obstacles.length-1].y=170;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    zombies.forEach(z=>z.draw(ctx));
    obstacles.forEach(obs=>obs.draw(ctx));
}
function tracker(event){
    c.clearRect(0, 0, canvas.width, canvas.height);
    pl.draw_player(c,count);
    x = event.clientX;
    y = event.clientY;
    let m=x/4;
    let n=y/4;
    console.log(x,y);
    //start point
    c.beginPath();
    c.arc(135+move_tracker.x, 50+move_tracker.y, 5, 0, Math.PI * 2);
    c.fillStyle = 'black';
    c.fill();
    //curved line
    c.beginPath();
    c.moveTo(135+move_tracker.x, 50+move_tracker.y);
    c.quadraticCurveTo(((135+m)/ 2)+(move_tracker.x/2), 40+move_tracker.y, m, n);
    c.strokeStyle = 'blue';
    c.lineWidth = 2;
    c.stroke();
    //end point
    c.beginPath();
    c.arc(m, n, 5, 0, Math.PI * 2);
    c.fillStyle = 'black';
    c.fill();
};
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function hit(z,p,q){
    //comparing positions of bullet and zombie
    var flag=false;
    if(z.y==100){
        if(q>=100 && q<=140)flag=true; //exact were 112 135
    }
    else{
        if(q>=80 &&q<=120)flag=true;  //exact were 88 117 
    }
    if(z.position=="left"){
        if(((10+(z.x)/4)-5<=p && ((10+(z.x)/4))+15>=p) &&flag){
            return true;
        }
    }
    else if(z.position=="right"){
        if(((140+((z.x-550)/4))-10<=p && (140+((z.x-550)/4))+15>=p) &&flag ){
            return true;
        }
    }
    return false;
}
async function shoot(x0,y0,x1,y1,x2,y2){
    mover.removeEventListener("mousemove",tracker);

    // //finding equation of path
    const Ax=(x0-(2*x1)+x2);
    const Bx=2*(x1-x0);
    const Cx=x0;
    const Ay=y0-(2*y1)+y2;
    const By=2*(y1-y0);
    const Cy=y0;
    let p;
    let q;
    // animating bullet at each coordinate
    for(let t=0;t<=1;t+=0.1){
        p=(Ax *t*t)+(Bx*t)+Cx;
        q=(Ay*t*t)+(By*t)+Cy;
        c.beginPath();
        c.fillStyle='brown';
        c.arc(p,q,3,0,2*Math.PI);
        c.fill();
        await delay(100);
        c.clearRect(0,0,mover.width,mover.height);
        pl.draw_player(c,count);
        //checking if bullet hits a zombie
        let flag=false;
        for(let i=0;i<zombies.length;i++){
            if(hit(zombies[i],p,q)){
                zombies[i].count++;
                flag=true;
                if (zombies[i].count == 2) {
                    zombies[i].reached="true";
                    zombies.splice(i, 1); // removing the zombie from the array
                }
                ctx.clearRect(0,0,canvas.width,canvas.height); //clearing and redrawing all zombies
                zombies.forEach(z=>z.draw(ctx));
                obstacles.forEach(obs=>obs.draw(ctx));
                break;
            }
        }
        if(flag)break;
    }
    mover.addEventListener("mousemove", tracker);
}
function spawn_zombies(){
    if(timer.innerText!='0' &&!over &&!pause_flag){
        let z1,z2;
        z1=new Zombie(0,100,"left");
        z2=new Zombie(1000,100,"right");
        zombies.push(z1);
        zombies.push(z2);
        move_zombie(z1);
        move_zombie(z2);
    }
}
async function move_zombie(z){
        while(!z.reached && !pause_flag ){
            if(over)break;
            jump_zombie();
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
            if(wave.innerText=='WAVE 1')z.move(5);
            else if(wave.innerText=='WAVE 2')z.move(10);
            else if(wave.innerText=='WAVE 3')z.move(15);
            zombies.forEach(zombie => zombie.draw(ctx)); // Redraw all zombies
            obstacles.forEach(obs=>obs.draw(ctx));
            await delay(500);
            if(pause_flag)break;
            if(z.position=="left" && ((10+(z.x)/4)-5<=pl.x+120 && ((10+(z.x)/4))+15>=pl.x+120)){
                function check(zombie){
                    return zombie!=z;
                }
                zombies=zombies.filter(check);
                count+=5;
                ctx.clearRect(0,0,canvas.width,canvas.height);
                zombies.forEach(z=>z.draw(ctx));
                pl.draw_player(c,count);
                break;
            }
            if(z.position=="right"&&((140+((z.x-550)/4))-35<=pl.x+120 && (140+((z.x-550)/4))-10>=pl.x+120)){
                function check(zombie){
                    return zombie!=z;
                }
                zombies=zombies.filter(check);
                count+=5;
                ctx.clearRect(0,0,canvas.width,canvas.height);
                zombies.forEach(z=>z.draw(ctx));
                pl.draw_player(c,count);
                break;
            }
        }
}
function spawn(){
    clear=setInterval(spawn_zombies,interval);
    spawn_zombies();
}
async function time(){
        while(!over && timer.innerText!='0'){
            await delay(1000);
            if(pause_flag)break;
            let number=Number(timer.innerText);
            number--;
            timer.innerText=number.toString();
            if(timer.innerText=='0'){
                zombies.forEach(z=>z.reached=true);
                zombies=[];
                if(wave.innerText=='WAVE 1'){
                    wave.innerText='WAVE 2';
                    interval=4000;
                    clearInterval(clear);
                    spawn();
                }
                else if(wave.innerText=='WAVE 2'){
                    wave.innerText='WAVE 3';
                    interval=3000;
                    clearInterval(clear);
                    spawn();
                }
                else if(wave.innerText=='WAVE 3'){
                    over=true;
                    gameover.innerHTML="YOU WON!<br><button id='playagain'>PLAY AGAIN</button>";
                    clearInterval(clear);
                    game_over();
                    return;
                }
                timer.innerText='60';
                ctx.clearRect(0,0,canvas.width,canvas.height);
                if(!over)spawn_zombies();
            }
        }
}
function game_over(){
    mover.removeEventListener("mousemove",tracker);
    mover.removeEventListener("click",call_shoot);
    document.removeEventListener('keydown', move_player);
    pause_button.removeEventListener("click",toggle_pause);
    ob.removeEventListener("click",obstacle_place);
    clearInterval(clear);
    gameover.style.zIndex=6;
    gameover.style.display='block';
    document.getElementById("playagain").onclick=()=>{
        over=false;
        reset();
        wave.innerText='WAVE 1';
        gameover.style.zIndex=0;
        start_game();
    }
}
function reset(){
    zombies=[];
    obstacles=[];
    timer.innerText='60';
    count=0;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    c.clearRect(0,0,mover.width,mover.height);
}
function toggle_pause(){
    if(pause_button.innerText=="PAUSE"){
        pause();
        pause_button.innerText="RESUME";
    }
    else{
        resume();
        pause_button.innerText="PAUSE";
    }
}
function check(){
    console.log("hi");
}
function start_game(){
    pl.x=0;
    pl.y=0;
    move_tracker.x=0;
    move_tracker.y=0;
    interval=8000;
    spawn();
    time();
    mover.zIndex=1;
    pl.draw_player(c,count);
    mover.addEventListener("mousemove", tracker);
    mover.addEventListener("click", call_shoot);
    button.style.display='none';
    rules.style.display='none';
    inst.style.display='none';
    playagain_button.style.display='none';
    document.getElementById("start").style.display='none';
    gameover.style.display='none';
    ob.addEventListener("click",obstacle_place);
    document.addEventListener('keydown', move_player);
    pause_button.addEventListener("click",toggle_pause);
    button.zIndex=0;
    playagain_button.zIndex=0;
}
button.onclick=start_game;
function obstacle_place(){
    create_obstacle();
    canvas.style.zIndex=1;
    canvas.addEventListener("mousemove",move_obstacle);
    canvas.addEventListener("click",()=>{
        obstacles[obstacles.length-1].placed=true;
        canvas.removeEventListener("mousemove",move_obstacle);
        canvas.style.zIndex=0;
    })
}
function call_shoot(){
    shoot(135+move_tracker.x, 50 +move_tracker.y, ((135+(x/4))/2) +(move_tracker.x/2), 40+move_tracker.y, (x/4), (y/4));
}
function pause(){
    mover.removeEventListener("mousemove",tracker);
    mover.removeEventListener("click",call_shoot);
    pause_flag=true;
    document.removeEventListener("keydown",move_player);
    ob.removeEventListener("click",obstacle_place);
    time_running=false;
}
function resume(){
    mover.addEventListener("mousemove",tracker);
    mover.addEventListener("click",call_shoot);
    pause_flag=false;
    document.addEventListener("keydown",move_player);
    ob.addEventListener("click",obstacle_place);
    time();
    //enabling movement
    zombies.forEach(z=>{
        move_zombie(z);
    });
}
function jump_zombie(){
    zombies.forEach(z=>{
        obstacles.forEach(obs=>{
            if(obs.placed){
                if(z.position=="right"&&z.x<=obs.x+25 &&z.x+15>=obs.x+25){
                    if(!z.up)z.y-=80;
                    z.up=true;
                }
                if(z.position=="left"&&z.x+15>=obs.x-80&&z.x<=obs.x-80){
                    if(!z.up)z.y-=80; 
                    z.up=true;
                }
                if(z.position=="right"&&z.x<=obs.x-90 &&z.x+15>=obs.x-90&&z.up){
                    if(z.up)z.y+=80;
                    z.up=false;
                }
                if(z.position=="left"&&z.x+15>=obs.x+40&&z.x<=obs.x+40){
                    if(z.up)z.y+=80; 
                    z.up=false;
                }
            }
        });
    });
}
function move_player(event){
    mover.removeEventListener("mousemove",tracker);
    const speed = 5;
    c.clearRect(0,0,mover.width,mover.height);
    switch (event.key) {
        case 'w':
            if(pl.y>0){
               pl.y -= speed;
               move_tracker.y-=speed;
            }
            break;
        case 'a':
            if(pl.x>-105){
                pl.x -= speed;
                move_tracker.x -= speed;
            }
            break;
        case 's':
            if(pl.y<30){
               pl.y += speed;
               move_tracker.y += speed;
            }
            break;
        case 'd':
            if(pl.x<110){
                pl.x += speed;
                move_tracker.x += speed;
            }
            break;
    }
    pl.draw_player(c, count);
    let m=x/4;
    let n=y/4;
    //start point
    c.beginPath();
    c.arc(135+move_tracker.x, 50+move_tracker.y, 5, 0, Math.PI * 2);
    c.fillStyle = 'black';
    c.fill();
    //curved line
    c.beginPath();
    c.moveTo(135+move_tracker.x, 50+move_tracker.y);
    c.quadraticCurveTo(((135+m)/ 2)+(move_tracker.x/2), 40+move_tracker.y, m, n);
    c.strokeStyle = 'blue';
    c.lineWidth = 2;
    c.stroke();
    //end point
    c.beginPath();
    c.arc(m, n, 5, 0, Math.PI * 2);
    c.fillStyle = 'black';
    c.fill();
    mover.addEventListener("mousemove",tracker);
}
