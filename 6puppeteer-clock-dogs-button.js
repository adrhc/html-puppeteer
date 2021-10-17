import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {registerComponentType} from "./ro/go/adrhc/html-puppeteer/core/ComponentFactories.js";
import PeriodicallyStateChangingComponent
    from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingComponent.js";
import {generateAndAppendDogs} from "./ro/go/adrhc/app/Generators.js";
import Scenario6EventsBinder from "./ro/go/adrhc/app/scenarios/6puppeteer+state-button/Scenario6EventsBinder.js";
import {addClockDebugger} from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingOptionsBuilder.js";
import {getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";

$(() => {
    registerComponentType("periodically-state-changing",
        (options) => new PeriodicallyStateChangingComponent(options));

    animate(addClockDebugger({debuggerElemIdOrJQuery: "clock-debugger"})
        .addDebugger({debuggerElemIdOrJQuery: "component-debugger"})
        .to({
            stateGeneratorFn: (componentConfig, clockStateChange) => {
                setTimeout(() => {
                    $('textarea').height(0);
                    $('textarea').height(getTotalHeight);
                });
                return generateAndAppendDogs({
                    interval: (/** @type {ClockState} */ clockStateChange.newState)?.interval
                }, 2);
            },
            eventsBinderProvider: (component) => new Scenario6EventsBinder(component)
        }));
});