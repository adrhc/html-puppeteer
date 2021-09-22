import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {registerComponentType} from "./ro/go/adrhc/html-puppeteer/core/ComponentsFactories.js";
import PeriodicallyStateChangingComponent
    from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingComponent.js";
import {generateAndAppendDogs} from "./ro/go/adrhc/app/Generators.js";
import Scenario6EventsBinder from "./ro/go/adrhc/app/scenarios/6puppeteer+state-button/Scenario6EventsBinder.js";
import {addClockDebugger} from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingOptionsBuilder.js";

$(() => {
    registerComponentType("periodically-state-changing",
        (options) => new PeriodicallyStateChangingComponent(options));

    animate(addClockDebugger({debuggerElemIdOrJQuery: "clock-debugger"})
        .addDebugger({debuggerElemIdOrJQuery: "component-debugger"})
        .to({
            stateGeneratorFn: (componentConfig, clockStateChange) =>
                generateAndAppendDogs({
                    interval: (/** @type {ClockState} */ clockStateChange.newState)?.interval
                }),
            eventsBinder: new Scenario6EventsBinder()
        }));
});