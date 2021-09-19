import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import COMPONENTS_FACTORY from "./ro/go/adrhc/html-puppeteer/core/ComponentsFactories.js";
import PeriodicallyStateChangingComponent
    from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingComponent.js";
import {generateAndAppendDogs} from "./ro/go/adrhc/app/Generators.js";
import Scenario6EventsBinder from "./ro/go/adrhc/app/scenarios/6puppeteer+state-button/Scenario6EventsBinder.js";
import {addClockDebugger} from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingOptionsBuilder.js";

$(() => {
    COMPONENTS_FACTORY.registerComponentType("periodically-state-changing", (options) => new PeriodicallyStateChangingComponent(options));
    PUPPETEER.animate(addClockDebugger({debuggerElemIdOrJQuery: "internal-clock-debugger"})
        .addDebugger({debuggerElemIdOrJQuery: "component-debugger"})
        .to({
            stateGeneratorFn: (componentConfig) => generateAndAppendDogs(5, {interval: componentConfig.interval}),
            eventsBinder: new Scenario6EventsBinder()
        }));
});