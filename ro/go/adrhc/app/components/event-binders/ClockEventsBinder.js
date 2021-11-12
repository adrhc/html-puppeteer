import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";
import {eventsBinder} from "../../../html-puppeteer/helper/events-handling/EventsBinderBuilder.js";

export default class ClockEventsBinder extends EventsBinder {
    /**
     * @return {PeriodicallyStateChangingComponent}
     */
    get clock() {
        return /** @type {PeriodicallyStateChangingComponent} */ this._component;
    }

    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        this._eventsHandlerDetachFn = eventsBinder()
            .whenEvents("click.ClockEventsBinder")
            .occurOnBtn("start")
            .do(() => this.clock.startClock())
            .and()
            .whenEvents("click.ClockEventsBinder")
            .occurOnBtn("stop")
            .do(() => this.clock.stopClock())
            .and()
            .whenEvents("click.ClockEventsBinder")
            .occurOnBtn("change")
            .do(() => {
                const json = $("input[name='clock-state']").val();
                if (!json.trim()) {
                    return;
                }
                const {interval, stopped} = JSON.parse(json);
                this.clock.clockStateProcessor.doWithState(clockState => {
                    const newState = _.defaults({interval, stopped}, clockState.stateCopy)
                    clockState.replace(newState);
                })
            })
            .and()
            .buildDetachEventsHandlersFn();
    }
}