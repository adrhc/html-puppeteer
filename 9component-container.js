import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import PUPPETEER from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateCats} from "./ro/go/adrhc/app/Generators.js";
import {namedBtn} from "./ro/go/adrhc/html-puppeteer/util/SelectorUtils.js";

class App {
    parent;

    constructor(parent) {
        this.parent = parent;
    }

    createCatsChild() {
        return this.parent.create("cats", "simple",
            addDebugger({debuggerElemIdOrJQuery: "cats-debugger"})
                .to({initialState: {cats: generateCats(2)}}));
    }

    run() {
        $(namedBtn("create")).on("click", () => {
            this.createCatsChild();
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
    // const component = PUPPETEER.animate(withDebugger({debuggerElemIdOrJQuery: "parent-debugger"}));
    const component = PUPPETEER.animate();

    // the application using the html-puppeteer
    new App(component).run();
});