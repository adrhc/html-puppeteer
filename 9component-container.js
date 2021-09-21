import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import {generateCats} from "./ro/go/adrhc/app/Generators.js";
import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";

$(() => {
    const parent = PUPPETEER.animate(addDebugger({debuggerElemIdOrJQuery: "parent-debugger"})
        .to({elemIdOrJQuery: "parent-component"}))
        .render({text: "here goes the parent state displayed by its view"});
    parent.create("cats", "simple",
        addDebugger({debuggerElemIdOrJQuery: "child-debugger"})
            .to({initialState: {cats: generateCats(5)}}));
});