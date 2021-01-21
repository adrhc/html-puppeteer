/**
 * todo: adapt to AbstractView usage
 */
class DynamicSelectOneView extends AbstractView {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param tmplUrl {string}
     */
    constructor(elemIdOrJQuery, {
        tmplUrl = "js/ro/go/adrhc/jquery-widgets/components/dynamic-select-one/templates/dyna-sel-one.html"
    }) {
        super();
        this._setupElem(elemIdOrJQuery);
        this._setupOwner();
        this.tmpl = new CachedUrl(tmplUrl);
    }

    /**
     * @param data {DynaSelOneState}
     * @param [focusOnSearchInput] {boolean}
     * @return {Promise<jQuery>}
     */
    update(data, focusOnSearchInput) {
        const viewModel = this._viewModelOf(data);
        return this._renderView(viewModel)
            .then(() => {
                this._applyCss(viewModel);
                if (focusOnSearchInput) {
                    HtmlUtils.focus(this.$titleElem);
                }
                return viewModel;
            });
    }

    /**
     * @param viewModel {Object}
     * @return {Promise<jQuery>}
     */
    _renderView(viewModel) {
        return this.tmpl.cache
            .then(html => Mustache.render(html, viewModel))
            .then(html => this.$elem.html(html.trim()));
    }

    /**
     * @param viewModel {Object}
     */
    _applyCss(viewModel) {
        CssUtils.switchClasses([
            {$elem: this.$titleElem, classes: "selected-title", remove: !viewModel.description},
            {$elem: this.$selectionInfoElem, classes: "removed", remove: viewModel.description},
            {$elem: this.$optionsElem, classes: "removed", remove: viewModel.options},
            {$elem: this.$nothingFound, classes: "removed", remove: viewModel.nothingFound},
            {$elem: this.$tooMany, classes: "removed", remove: viewModel.tooMany},
            {$elem: this.$tooLessChars, classes: "removed", remove: viewModel.minCharsToSearch}
        ]);
    }

    /**
     * @param state {DynaSelOneState}
     * @return {{}}
     * @private
     */
    _viewModelOf(state) {
        const viewModel = {
            owner: this.owner,
            titleInputName: this.titleInputName,
            valueInputName: this.valueInputName,
            descriptionInputName: this.descriptionInputName,
            title: state.title,
            placeholder: this.placeholder,
            // 2: used to have the multiple select which know to handle click event on options
            optionsToShow: Math.min(Math.max(state.optionsLength, 2), this.optionsToShow)
        };
        if (state.selectedItem) {
            // search success: selected/found exactly 1 item
            viewModel.description = state.selectedItem.description;
            viewModel.id = state.selectedItem.id;
        } else if (state.isEnoughTextToSearch(state.title)) {
            viewModel.searchedTitle = state.title;
            if (state.optionsLength > 1) {
                // too many results
                viewModel.tooMany = true;
            } else if (state.optionsLength === 0) {
                // no search result
                viewModel.nothingFound = true;
            }
        } else {
            // search with too less characters
            viewModel.minCharsToSearch = state.minCharsToSearch;
        }
        if (state.optionsLength > 1 || state.optionsLength === 1 && !state.selectedItem) {
            // rendering options
            viewModel.options = state.options.map(o => {
                const option = {id: o.id, description: o.description, selected: ""};
                if (state.selectedItem && o.id === state.selectedItem.id) {
                    option.selected = "selected";
                }
                return option;
            });
        }
        return viewModel;
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $tooLessChars() {
        return this.$elem.find(`[data-name='too-less-chars']`);
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $nothingFound() {
        return this.$elem.find(`[data-name='nothing-found']`);
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $tooMany() {
        return this.$elem.find(`[data-name='too-many']`);
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $selectionInfoElem() {
        return this.$elem.find(`[data-name='selection-info']`);
    }

    /**
     * @returns {jQuery<HTMLSelectElement>}
     */
    get $optionsElem() {
        return this.$elem.find(`[name='options']`);
    }

    /**
     * this is the search box
     *
     * @return {jQuery<HTMLInputElement>}
     */
    get $titleElem() {
        return this.$elem.find(`[name='${this.titleInputName}']`);
    }

    get titleInputName() {
        return this.$elem.data("name");
    }

    get placeholder() {
        return this.$elem.data("placeholder");
    }

    get optionsToShow() {
        const optionsToShow = this.$elem.data("options-to-show");
        return optionsToShow ? +optionsToShow : 5;
    }

    get valueInputName() {
        const inputName = this.$elem.data("value");
        return inputName ? inputName : `${this.titleInputName}-value`;
    }

    get descriptionInputName() {
        const inputName = this.$elem.data("description");
        return inputName ? inputName : `${this.titleInputName}-description`;
    }
}