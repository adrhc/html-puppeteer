import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import {generateDogsOrCats} from "./ro/go/adrhc/app/Generators.js";

$(() => {
    // component creation and rendering
    const component = PUPPETEER.animate(withDebugger({debuggerElemIdOrJQuery: "component-debugger"}));
    // see state changing actions (aka component's usage) below
    setInterval(() => {
        const part = generateDogsOrCats(3);
        component.replacePart(part.value, part.name)
    }, 1000);
});