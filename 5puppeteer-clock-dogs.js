import PUPPETEER from "./ro/go/adrhc/html-puppeteer/util/Puppeteer.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/DebuggerOptionsBuilder.js";
import COMPONENTS_FACTORY from "./ro/go/adrhc/html-puppeteer/core/ComponentsFactories.js";
import PeriodicallyStateChangingComponent from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingComponent.js";
import {generateDogs} from "./ro/go/adrhc/app/Generators.js";

$(() => {
    COMPONENTS_FACTORY.registerType("periodically-state-changing", (options) => new PeriodicallyStateChangingComponent(options));
    PUPPETEER.animate(addDebugger().to({
        stateGeneratorFn: (component) => generateDogs(5, component.dataAttributes)
    }));
});