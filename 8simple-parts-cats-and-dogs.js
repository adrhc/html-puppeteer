import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import {withPeriodicallyGenerateDogsOrCats} from "./ro/go/adrhc/app/Generators.js";

$(() => {
    // component creation and rendering
    const component = PUPPETEER.animate(withDebugger({debuggerElemIdOrJQuery: "component-debugger"}));

    // state changing actions (aka component's usage)
    withPeriodicallyGenerateDogsOrCats(part => component.replacePart(part.value, part.name));
});