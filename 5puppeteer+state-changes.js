import PUPPETEER from "./ro/go/adrhc/html-puppeteer/util/Puppeteer.js";
import {withDebugger} from "./ro/go/adrhc/html-puppeteer/util/DebuggingUtils.js";
import COMPONENTS_FACTORY from "./ro/go/adrhc/html-puppeteer/core/ComponentsFactories.js";
import ClockComponent from "./ro/go/adrhc/app/components/clock/ClockComponent.js";
import {generateDogs} from "./ro/go/adrhc/app/Generators.js";

$(() => {
    COMPONENTS_FACTORY.registerType("clock", (options) => new ClockComponent(options));
    PUPPETEER.animate(withDebugger({stateGeneratorFn: (date, dataAttributes) => generateDogs(5, dataAttributes)}));
});