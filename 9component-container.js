import {addDebugger, withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateCats} from "./ro/go/adrhc/app/Generators.js";
import {namedBtn} from "./ro/go/adrhc/html-puppeteer/util/SelectorUtils.js";
import {getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";

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
            $('textarea').height(getTotalHeight);
        });
        $(namedBtn("remove")).on("click", () => {
            this.parent.removeByName("cats");
            $(namedBtn("remove")).attr('disabled', 'disabled');
            $(namedBtn("create")).removeAttr('disabled');
            $('#cats-debugger').height(0);
            $('#cats-debugger').height(getTotalHeight);
        });
        $('textarea').height(getTotalHeight);
    }
}

$(() => {
    // the puppeteer
    const component = animate(withDebugger({debuggerElemIdOrJQuery: "parent-debugger"}));

    // the application using the html-puppeteer
    new App(component).run();
});