import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {registerComponentType} from "./ro/go/adrhc/html-puppeteer/core/ComponentFactories.js";
import PeriodicallyStateChangingComponent
    from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingComponent.js";
import {generateDogsOrCats} from "./ro/go/adrhc/app/Generators.js";
import Scenario6EventsBinder from "./ro/go/adrhc/app/scenarios/6puppeteer+state-button/Scenario6EventsBinder.js";
import {addClockDebugger} from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingOptionsBuilder.js";
import {getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";

/**
 * Replaces the "interval" state portion on stateHolder with data from clockStateChange.
 *
 * @param {PartialStateHolder} stateHolder
 * @param {StateChange} clockStateChange
 */
function updateClockIntervalStatePart(stateHolder, clockStateChange) {
    const clockPreviousState = /** @type {ClockState} */ clockStateChange.previousState;
    const clockNewState = /** @type {ClockState} */ clockStateChange.newState;
    if (clockPreviousState?.interval !== clockNewState?.interval) {
        stateHolder.replacePart("interval", clockNewState?.interval);
    }
}

/**
 * @param {PartialStateHolder} stateHolder
 * @param {StateChange} clockStateChange
 */
function stateAndClockStateChangeConsumer(stateHolder, clockStateChange) {
    if (stateHolder.currentState == null) {
        // set the stateHolder initial value (i.e. the clock's interval)
        stateHolder.replace({interval: stateHolder.config.interval});
    } else {
        // replace receiver component's "interval" state portion
        updateClockIntervalStatePart(stateHolder, clockStateChange);
        // replace receiver component's "dogs" or "cats" state portion
        const part = generateDogsOrCats(1);
        stateHolder.replacePart(part.name, part.value);
    }
    setTimeout(() => {
        $('textarea').height(0);
        $('textarea').height(getTotalHeight);
    });
}

$(() => {
    registerComponentType("periodically-state-changing",
        (options) => new PeriodicallyStateChangingComponent(options));

    animate(addClockDebugger({debuggerElemIdOrJQuery: "clock-debugger"})
        .doPeriodicallyWithStateAndClock(stateAndClockStateChangeConsumer)
        .addDebugger({debuggerElemIdOrJQuery: "component-debugger"})
        .to({
            eventsBinder: new Scenario6EventsBinder()
        }));
});