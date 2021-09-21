import EventsBinder from "../../../html-puppeteer/core/component/EventsBinder.js";
import {namedBtn} from "../../../html-puppeteer/util/SelectorUtils.js";

export default class Scenario6EventsBinder extends EventsBinder {
    attachEventHandlers() {
        const clock = /** @type {PeriodicallyStateChangingComponent} */ this.component;
        $(namedBtn("start")).on("click.Scenario6EventsBinder", () => clock.startClock());
        $(namedBtn("stop")).on("click.Scenario6EventsBinder", () => clock.stopClock());
        $(namedBtn("change")).on("click.Scenario6EventsBinder", () => {
            clock.clockStateProcessor.doWithState(clockState => {
                const json = $("input[name='clock-state']").val();
                if (!json.trim()) {
                    return;
                }
                const {interval, stopped} = JSON.parse(json);
                const newState = _.defaults({interval, stopped}, clockState.currentState)
                clockState.replace(newState);
            })
        });
    }

    detachEventHandlers() {
        $(namedBtn("start")).off(".Scenario6EventsBinder");
        $(namedBtn("stop")).off(".Scenario6EventsBinder");
    }
}