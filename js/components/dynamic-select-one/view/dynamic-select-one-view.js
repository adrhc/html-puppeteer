class DynamicSelectOneView {
    /**
     * @param elemId {string}
     * @param placeholder {string}
     * @param optionsToShow {number}
     * @param tmplUrl {string}
     */
    constructor(elemId, {
        placeholder, optionsToShow = 10,
        tmplUrl = "js/components/dynamic-select-one/templates/dyna-sel-one.html"
    }) {
        this.elemId = elemId;
        this.tmpl = new CachedAjax(tmplUrl);
        this.placeholder = placeholder;
        this.optionsToShow = optionsToShow;
    }

    /**
     * @param data {DynamicSelectOneState}
     */
    init(data) {
        return this.updateView(data, true);
    }

    /**
     * @param data {DynamicSelectOneState}
     * @param focusOnSearchInput
     */
    updateView(data, focusOnSearchInput) {
        this._clearOnBlurHandlers();
        const viewModel = this._viewModelOf(data);
        return this._renderView(viewModel)
            .then(() => {
                this._applyCss(viewModel);
                if (focusOnSearchInput) {
                    this._focusOnSearchInput();
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
            .then(html => this.$component.html(html.trim()));
    }

    /**
     * @param viewModel {Object}
     */
    _applyCss(viewModel) {
        if (viewModel.options) {
            this.$selectElem.removeClass("removed");
            this.$descriptionElem.addClass("removed");
        } else {
            this.$selectElem.addClass("removed");
            this.$descriptionElem.removeClass("removed");
        }
    }

    _clearOnBlurHandlers() {
        this.$component.off("blur.dyna-sel-one");
        const $searchInputElem = this.$searchInputElem;
        if ($searchInputElem.length) {
            $searchInputElem[0].onblur = null;
        }
    }

    _focusOnSearchInput() {
        const searchInput = this.$searchInputElem;
        const value = searchInput.val();
        searchInput.focus().val("").val(value);
    }

    /**
     * @param state {DynamicSelectOneState}
     * @return {{placeholder: string, optionsToShow: number, title: string}}
     * @private
     */
    _viewModelOf(state) {
        const viewModel = {
            title: state.title,
            placeholder: this.placeholder,
            // 2: used to have the multiple select which know to handle click event on options
            optionsToShow: Math.min(Math.max(state.optionsLength, 2), this.optionsToShow)
        };
        if (state.selectedItem) {
            // showing selected item
            viewModel.description = state.selectedItem.description;
        } else if (state.isEnoughTextToSearch(state.title)) {
            // no item selected, showing empty search result
            viewModel.description = `Nu s-a găsit nimic deocamdată! s-a cautat <i>${state.title}</i>`;
        } else {
            // no item selected, showing char number required for searching
            viewModel.description = `Completați cel puțin ${state.minCharsToSearch} caractere pt a căuta (apasând ENTER).`;
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

    get $descriptionElem() {
        return $(`#${this.elemId} [data-name='description']`);
    }

    get $selectElem() {
        return $(`#${this.elemId} [name='options']`);
    }

    get $searchInputElem() {
        return $(`#${this.elemId} [name='title']`);
    }

    get $component() {
        return $(`#${this.elemId}`);
    }
}