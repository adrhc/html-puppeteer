import EventsBinder from "../../../html-puppeteer/core/component/events-binder/EventsBinder.js";
import {btnSelectorOf} from "../../../html-puppeteer/util/SelectorUtils.js";

export default class Scenario6EventsBinder extends EventsBinder {
    /**
     * attach DOM event handlers
     */
    attachEventHandlers() {
        const clock = /** @type {PeriodicallyStateChangingComponent} */ this._component;
        $(btnSelectorOf("start")).on("click.Scenario6EventsBinder", () => clock.startClock());
        $(btnSelectorOf("stop")).on("click.Scenario6EventsBinder", () => clock.stopClock());
        $(btnSelectorOf("change")).on("click.Scenario6EventsBinder", () => {
            const json = $("input[name='clock-state']").val();
            if (!json.trim()) {
                return;
            }
            const {interval, stopped} = JSON.parse(json);
            clock.clockStateProcessor.doWithState(clockState => {
                const newState = _.defaults({interval, stopped}, clockState.stateCopy)
                clockState.replace(newState);
            })
        });
    }

    /**
     * detach DOM event handlers
     */
    detachEventHandlers() {
        $(btnSelectorOf("start")).off(".Scenario6EventsBinder");
        $(btnSelectorOf("stop")).off(".Scenario6EventsBinder");
    }
}