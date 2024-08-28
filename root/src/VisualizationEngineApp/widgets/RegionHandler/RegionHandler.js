/**
RegionHandler holds the generic region settings and loading and setting a dashboard configuration
@class RegionHandler
*/
define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    './RegionHandlerView',
    'app/widgets/Icon/Icon',
    'widgets/InfoPopup',
    'widgets/Tooltip',
    'app/config/config'
], function(core, _, View, Icon, Popup, Tooltip, config) {
    'use strict';

    var ENTER_KEY = 13;

    return core.Widget.extend({
        View: View,

        init: function() {

            this.logoIcon = new Icon({
                icon: "ebIcon_eLogo"
            });

            this.settingsIcon = new Icon({
                icon: "ebIcon_settings",
                text: "settings",
                onclickevent: function() {
                    this.trigger("settingClicked");
                }.bind(this)
            });

            this.removeIcon = new Icon({
                icon: "ebIcon_close", 
                text: "remove", 
                onclickevent: function() { 
                    this.trigger("removeClicked");
                }.bind(this)
            });

        },

        onViewReady: function() {
            this.logoIcon.attachTo(this.view.getIconElement());
            this.settingsIcon.attachTo(this.view.getSettingsElement());
            this.removeIcon.attachTo(this.view.getSettingsElement());
            this.prepareTitleArea();
        },

        onDOMAttach: function() {
            this.view.setMinimize();
        },

        /**
        Initialises the widgets and elements needed to provide view naming functionality.
        @name RegionHandler#prepareTitleArea
        **/
        prepareTitleArea: function() {
            this.titleElement = this.view.getTitleElement();
            this.titleTextElement = this.view.getTitleTextElement();
            this.titleInputElement = this.view.getTitleInputElement();
            this.editIconElement = this.view.getEditIconElement();

            this.titleTextElement.addEventHandler("click", function() {
                this.showInputField();
            }.bind(this));

            this.editTitleIcon = new Icon({icon: "ebIcon_edit", text: "edit", onclickevent: function(e) { this.showInputField(); }.bind(this) });

            this.input = core.Element.parse("<input type='text' class='ebInput' placeholder='Title'/>");

            var inputTooltip = new Tooltip({
                parent: this.input,
                contentText: 'Title must be alphanumeric, containing spaces, hyphens or underscores'
            });

            inputTooltip.attachTo(this.titleElement);

            this.input.addEventHandler("keyup", function(e) {
                if (e.originalEvent.keyCode === ENTER_KEY) {
                    var text = this.input.getValue();
                    this.validateInput(text);
                }
            }.bind(this));
        },

        /**
        Displays input field used to name view.
        @name RegionHandler#showInputField
        **/
        showInputField: function() {
            this.titleInputElement.append(this.input);
            this.titleElement.append(this.titleInputElement);
            this.editTitleIcon.detach();
            this.titleTextElement.detach();
        },

        /**
        Sets and displays view name text.
        @name RegionHandler#showTitleText
        @param text {string}
        */
        showTitleText: function(text) {
            this.titleInputElement.detach();
            this.titleTextElement.setText(text);
            this.titleElement.append(this.titleTextElement);
        },

        /**
        Validates user input.
        @name RegionHandler#validateInput
        @param text {String}
        **/
        validateInput: function(text) {
            var pattern  = /^[a-z\d\-_\s]+$/i;
            text = text.trim();
            if(text.length === 0) {
                this.showTitleText("Click to name view");
            }
            else if(!pattern.test(text)) {
                this.input.setModifier("borderColor_red");
            }
            else {
                this.title = text;
                this.input.removeModifier("borderColor_red");
                this.showTitleText(text);
                this.editTitleIcon.attachTo(this.editIconElement);
            }
        },

        /**
        Returns the view title.
        @name RegionHandler#getTitle
        @returns title {String}
        **/
        getTitle: function () {
            return this.title;
        },

        /**
        Sets the view title.
        @name RegionHandler#setTitle
        @params title {String}
        **/
        setTitle: function (title) {
            this.validateInput(title);
            this.title = title;
            this.showTitleText(title);
            this.validateInput(title);
        },

        getData: function() {            
            var title         = (this.options.configurationData && this.options.configurationData.type        )  ? this.options.configurationData.type        : "";
            return {title: title};
        },
    });
});
