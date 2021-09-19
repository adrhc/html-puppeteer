import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import COMPONENTS_FACTORY from "./ro/go/adrhc/html-puppeteer/core/ComponentsFactories.js";
import PeriodicallyStateChangingComponent
    from "./ro/go/adrhc/app/components/periodically-state-changing/PeriodicallyStateChangingComponent.js";
import {generateAndAppendDogs} from "./ro/go/adrhc/app/Generators.js";

$(() => {
    COMPONENTS_FACTORY.registerComponentType("periodically-state-changing", (options) => new PeriodicallyStateChangingComponent(options));
    PUPPETEER.animate(addDebugger().to({
        stateGeneratorFn: (componentConfig) => generateAndAppendDogs(5, {interval: componentConfig.interval})
    }));
});