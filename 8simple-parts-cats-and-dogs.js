import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import {generateDogsOrCats} from "./ro/go/adrhc/app/Generators.js";

$(() => {
    const component = PUPPETEER.animate(withDebugger({debuggerElemIdOrJQuery: "component-debugger"}));
    setInterval(() => {
        component.doWithState(stateHolder => {
            const part = generateDogsOrCats(3);
            stateHolder.replacePart(part.value, part.name);
        })
    }, 1000);
});