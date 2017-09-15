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


new Vue({
    el:'#app',
    data:{
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
        

    },
    computed:{
        title:function(){
            return this.pomodoroState=== POMODORO_STATES.WORK ? 'Work!' : 'Rest!'
        },
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
    }
});
