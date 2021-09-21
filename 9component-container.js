import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateCats} from "./ro/go/adrhc/app/Generators.js";
import {namedBtn} from "./ro/go/adrhc/html-puppeteer/util/SelectorUtils.js";
import {USE_HTML} from "./ro/go/adrhc/html-puppeteer/core/view/SimpleView.js";

function createSimpleComponentOptions() {
    return addDebugger({debuggerElemIdOrJQuery: "child-debugger"})
        .to({
            initialState: {cats: generateCats(2)},
            viewRemovalStrategy: USE_HTML,
            onRemoveViewHtml: "cats child component was removed!"
        });
}

$(() => {
    // puppeteer
    const parent = PUPPETEER.animate(addDebugger({debuggerElemIdOrJQuery: "parent-debugger"})
        .to({
            elemIdOrJQuery: "parent-component",
            initialState: {text: "this is the parent state displayed by its view (below is the child component)"}
        }));

    // buttons
    $(namedBtn("remove")).attr('disabled', 'disabled');
    $(namedBtn("create")).on("click", () => {
        parent.create("cats", "simple", createSimpleComponentOptions());
        $(namedBtn("create")).attr('disabled', 'disabled');
        $(namedBtn("remove")).removeAttr('disabled');
    });
    $(namedBtn("remove")).on("click", () => {
        parent.removeByName("cats");
        $(namedBtn("remove")).attr('disabled', 'disabled');
        $(namedBtn("create")).removeAttr('disabled');
    });
});