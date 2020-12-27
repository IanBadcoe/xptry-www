"use strict";

class StateTicker {
    // states is an array of object such as
    // [
    //   {
    //     time: 200,
    //     fun: () => { ... },
    //   },
    //   {
    //     time: 300,
    //     fun: () => { ... },
    //   },
    // }
    //
    // it pauses for init_delay ms
    // then it runs through the states, launching each with a call to its fun and then staying in it for time ms
    // after the final state it calls reset, which is expected to clean up, and also returns a final delay before resetarting the whole cycle
    // (from states[0], the init_delay only takes place the first time...)
    constructor(init_delay, states, reset) {
        this.init_delay = init_delay;
        this.states = states;
        this.reset = reset;

        this.next_change = 0;
        this.state = 0;
    };

    Tick(tick, cycle_ms) {
        if (!this.next_change) {
            this.next_change = tick + Math.floor(this.init_delay / cycle_ms);
        } else if (tick >= this.next_change) {
            if (this.state < this.states.length) {
                let cur = this.states[this.state];
                cur.fun();
                this.state++;
                this.next_change = tick + Math.floor(cur.time / cycle_ms);
            } else {
                this.state = 0;
                let delay = this.reset();
                this.next_change = tick + Math.floor(delay / cycle_ms);
            }
        }
    };
}