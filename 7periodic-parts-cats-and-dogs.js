import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import COMPONENTS_FACTORY from "./ro/go/adrhc/html-puppeteer/core/ComponentsFactories.js";
import PeriodicallyStateChangingComponent
    from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingComponent.js";
import {generateDogsOrCats} from "./ro/go/adrhc/app/Generators.js";
import Scenario6EventsBinder from "./ro/go/adrhc/app/scenarios/6puppeteer+state-button/Scenario6EventsBinder.js";
import {addClockDebugger} from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingOptionsBuilder.js";

$(() => {
    COMPONENTS_FACTORY.registerComponentType("periodically-state-changing", (options) => new PeriodicallyStateChangingComponent(options));
    PUPPETEER.animate(addClockDebugger({debuggerElemIdOrJQuery: "clock-debugger"})
        .doPeriodicallyWithState((stateHolder, clockStateChange) => {
            if (stateHolder.currentState == null) {
                // set the initial state
                stateHolder.replace({interval: stateHolder.config.interval});
            } else {
                // replace receiver component "interval" state part
                const clockPreviousState = /** @type {ClockState} */ clockStateChange.previousState;
                const clockNewState = /** @type {ClockState} */ clockStateChange.newState;
                if (clockPreviousState?.interval !== clockNewState?.interval) {
                    stateHolder.replacePart(clockNewState?.interval, "interval");
                }
                // replace receiver component state part
                const part = generateDogsOrCats(3);
                stateHolder.replacePart(part.value, part.name);
            }
        })
        .addDebugger({debuggerElemIdOrJQuery: "component-debugger"})
        .to({
            eventsBinder: new Scenario6EventsBinder()
        }));
});