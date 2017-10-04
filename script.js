
const POMODORO_STATES = {
    WORK: 'work',
    REST: 'rest'
};
const STATES = {
    STARTED: 'started',
    STOPPED: 'stopped',
    PAUSED: 'paused'
};

const WORKIN_TIME_LEN_IN_MIN = 1;
const RESTIN_TIME_LEN_IN_MIN = 5;

var data = {
      minute: WORKIN_TIME_LEN_IN_MIN,
        second: 0,
        pomodoroState: POMODORO_STATES,
        timestamp:0,
        state: STATES.STOPPED,
        lap_m :0,
        lap_s : 0,
        laps : [0],
        newlap : 0,
        tot_travelled : 0,
        laptimes: [{mins:'0',secs:'0'}]
};

Vue.component('title-component',
{
    data:function(){ return data;},
    computed:{
         title:function(){
            return this.pomodoroState=== POMODORO_STATES.WORK ? 'Work!' : 'Rest!'
         }    
    },
    template :`<h3 class="bg-info text-justify">{{title}}</h3>`


});

Vue.component('splittime-component',{
    data: function() { return data;
         },
         computed:{
        
        min: function () {
            if (this.minute < 10) {
                return '0' + this.minute;
                }
                return this.minute;
            },
        sec: function () {
            if (this.second < 10) {
                return '0' + this.second;
            }
            return this.second;
    }

    },
         methods:{
            start: function(){
            this.state= STATES.STARTED,
            this._tick();
            this.interval= setInterval(this._tick,1000);
        },
        pause: function () {
        this.state = STATES.PAUSED;
        clearInterval(this.interval);
    },
    stop:function(){
        this.state = STATES.STOPPED;
        clearInterval(this.interval);
        this.pomodoroState = POMODORO_STATES.WORK;
        this.minute = WORKIN_TIME_LEN_IN_MIN;
        this.second = 0;
        this.lap_m=0;
        this.lap_s=0;
        this.laptimes=[{mins:'0',secs:'0'}];
        this.laps=[0];
        this.tot_travelled=0;
    },
    split:function() {
        var lap_min;
        var lap_sec=this.laps.pop();
        
        lap_min = WORKIN_TIME_LEN_IN_MIN - this.min -1;
        if (lap_sec !==0) {
            lap_sec = 60 - this.second  - this.tot_travelled;
           
        }
        else lap_sec = 60 - this.second;
        this.tot_travelled+=lap_sec;

        this.laps.push(lap_sec);
        
        this.lap_m = lap_min;
        this.lap_s = lap_sec;
        this.laptimes.push({mins: this.lap_m, secs: this.lap_s});
    },
        _tick:function(){
            //if second is not 0, just decrement second
            if (this.second !== 0) {
                this.second--;
                return;
            }
            //if second is 0 and minute is not 0,
            //decrement minute and set second to 59
            if (this.minute !== 0) {
                this.minute--;
                this.second = 59;
                return;
            }
            //if second is 0 and minute is 0,
            //toggle working/resting intervals
                this.pomodoroState = this.pomodoroState ===
                POMODORO_STATES.WORK ? POMODORO_STATES.REST :
                POMODORO_STATES.WORK;
                if (this.pomodoroState === POMODORO_STATES.WORK) {
                    this.minute = WORKIN_TIME_LEN_IN_MIN;
                } else {
                    this.minute = RESTIN_TIME_LEN_IN_MIN;
                }
        }
         },
    template: `<div>
    <button class="btn btn-success" :disabled="state==='started'" @click="start()">
            <i class="glyphicon glyphicon-play"></i>
        </button>
        <button class="btn btn-warning" :disabled="state!=='started'" @click="pause()">
            <i class="glyphicon glyphicon-pause"></i>
        </button>
        <button class="btn btn-danger" :disabled="state!=='started' && state !== 'paused'" @click="stop()">
            <i class="glyphicon glyphicon-stop"></i>
        </button>
        <button class="btn btn-info" :disabled="state!=='started' && state !== 'paused'" @click="split()">
            <i class="glyphicon glyphicon-repeat"></i>
        </button>
    
    <div>
        <span>{{ min }}</span>:<span>{{ sec }}</span>
    </div>
    <div >
    <li class="bg-success text-primary" style="width:80px;
                                            height:20px;
                                            margin:5px;"
            v-for="timings in laptimes">  <span> {{timings.mins}}</span>: <span> {{timings.secs}}</span></li></div>
    </div>`
});




new Vue({
    el:'#app',
    data:data
});
