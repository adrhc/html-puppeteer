import {addDebugger, withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateCats} from "./ro/go/adrhc/app/Generators.js";
import {namedBtn} from "./ro/go/adrhc/html-puppeteer/util/SelectorUtils.js";
import {USE_HTML} from "./ro/go/adrhc/html-puppeteer/core/view/SimpleView.js";

class App {
    parent;

    constructor(parent) {
        this.parent = parent;
    }

    createSimpleComponentOptions() {
        return addDebugger({debuggerElemIdOrJQuery: "child-debugger"})
            .to({
                initialState: {cats: generateCats(2)},
                viewRemovalStrategy: USE_HTML,
                onRemoveViewHtml: "cats child component was removed!"
            });
    }

    run() {
        $(namedBtn("create")).on("click", () => {
            this.parent.create("cats", "simple", this.createSimpleComponentOptions());
            $(namedBtn("create")).attr('disabled', 'disabled');
            $(namedBtn("remove")).removeAttr('disabled');
        });
        $(namedBtn("remove")).on("click", () => {
            this.parent.removeByName("cats");
            $(namedBtn("remove")).attr('disabled', 'disabled');
            $(namedBtn("create")).removeAttr('disabled');
        });
    }
}

$(() => {
    // the puppeteer
    const component = PUPPETEER.animate(withDebugger());

    // the application using the html-puppeteer
    new App(component).run();
});