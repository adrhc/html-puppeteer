import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateCats} from "./ro/go/adrhc/app/Generators.js";

$(() => {
    const parent = PUPPETEER.animate(addDebugger({debuggerElemIdOrJQuery: "parent-debugger"})
        .to({
            elemIdOrJQuery: "parent-component",
            initialState: {text: "this is the parent state displayed by its view (below is the child component)"}
        }));
    parent.create("cats", "simple",
        addDebugger({debuggerElemIdOrJQuery: "child-debugger"})
            .to({initialState: {cats: generateCats(3)}}));
});