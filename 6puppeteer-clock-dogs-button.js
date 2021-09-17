import PUPPETEER from "./ro/go/adrhc/html-puppeteer/util/Puppeteer.js";
import COMPONENTS_FACTORY from "./ro/go/adrhc/html-puppeteer/core/ComponentsFactories.js";
import ClockComponent, {addClockDebugger} from "./ro/go/adrhc/app/components/clock/ClockComponent.js";
import {generateDogs} from "./ro/go/adrhc/app/Generators.js";
import Scenario6EventsBinder from "./ro/go/adrhc/app/scenarios/6puppeteer+state-button/Scenario6EventsBinder.js";

$(() => {
    COMPONENTS_FACTORY.registerType("clock", (options) => new ClockComponent(options));
    PUPPETEER.animate(addClockDebugger({debuggerElemIdOrJQuery: "internal-clock-debugger"})
        .addDebugger({debuggerElemIdOrJQuery: "component-debugger"})
        .to({
            stateGeneratorFn: (component) => generateDogs(5, component.dataAttributes),
            eventsBinder: new Scenario6EventsBinder()
        }));
});