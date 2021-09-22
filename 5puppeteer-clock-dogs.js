import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import {registerComponentType} from "./ro/go/adrhc/html-puppeteer/core/ComponentsFactories.js";
import PeriodicallyStateChangingComponent
    from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingComponent.js";
import {generateAndAppendDogs} from "./ro/go/adrhc/app/Generators.js";

$(() => {
    registerComponentType("periodically-state-changing",
        (options) => new PeriodicallyStateChangingComponent(options));

    animate(addDebugger().to({
        stateGeneratorFn: (componentConfig, clockStateChange) =>
            generateAndAppendDogs({
                interval: (/** @type {ClockState} */ clockStateChange.newState)?.interval
            })
    }));
});