/**
    Wrapper around ModalDialog defining utility methods for creating and handling ModalDialog 
    content based on setting widgets.

    The following options are accepted
    header: a string used as a Dialog header. Default is 'Header'.
    buttons: an array used to define list of buttons.

    @class SettingsDialog
*/

define([
    'jscore/core',
    'jscore/ext/mvp',
    './SettingsDialogView',
    'jscore/ext/utils/base/underscore',
    'app/widgets/SettingsDialog/SettingsTab/SettingsTab',
    'widgets/Dialog',
    'widgets/Tabs'
], function (core, mvp, View, _, SettingsTab, Dialog, Tabs){ 
    'use strict';

    return core.Widget.extend({
        View: View,

        init: function () {
            this._state = {
                settingWidgets: [],
                model: new mvp.Model()
            };

            this._eventBus = new core.EventBus();

            this._eventBus.subscribe('setting:change', function (changeObj) {
                this.trigger('change', changeObj);
            }, this);

            this._dialog = new Dialog({
                header: this.options.header,
                buttons: this.options.buttons
            });
        },

        onViewReady: function () {
            this._dialog.setContent(this);
        },

        /**
        Update all settings from a model. Tries to read from the old typeSettings object
        to allow loading of settings stored in db with the old SettingsDialog

        @private
        @name SettingsDialog#_legacyUpdate
        @params {Object} model - settings model
        */
        _legacyUpdate: function (model) {
            var typeSettings = model.getAttribute('typeSettings');

            _.each(this._state.settingWidgets, function (setting) {
                if (model.getAttribute(setting.widget.getName()) === undefined && typeSettings) {
                    setting.widget.setValue(typeSettings[setting.widget.getName()]);
                } else {
                    setting.widget.setValue(model.getAttribute(setting.widget.getName()));
                }
            }, this);
        },

        /**
        Stores all setting widgets current values in the setting model.

        @private
        @name SettingsDialog#_storeCurrentSettings
        */
        _storeCurrentSettings: function () {
            _.each(this._state.settingWidgets, function (setting) {
                this._state.model.setAttribute(setting.widget.getName(), setting.widget.getValue());
            }, this);
        },

        /**
        Sets a new model and updates all settings. Is using _legacyUpdate to allow old models loaded from
        db to be used

        @private
        @name SettingsDialog#_createSettingsFromModel
        @params {Object} model - settings model
        */
        _createSettingsFromModel: function (model) {
            this._legacyUpdate(model);
            this._state.model = model;
        },

        /**
        Assigns a database id to the settings model.

        @private
        @name SettingsDialog#_assignId
        @params {Number} id - database id
        */
        _assignId: function (id) {
            this._state.model.setAttribute('_id', id);
        },

        // UI SDK Dialog API
        // =================

        /**
        Sets buttons with actions to the SettingDialog's action block

        @name SettingsDialog#setButtons
        @params {Array} buttons - An array used to define list of buttons.
        */
        setButtons: function (buttons) {
            this._dialog.setButtons(buttons);
        },

        getButtons: function () {
            return this._dialog.getButtons();
        },

        /**
        Sets header for the SettingsDialog.

        @name SettingsDialog#setHeader
        @params {String} headerText
        */
        setHeader: function (headerText) {
            this._dialog.setHeader(headerText);
        },

        /**
        Shows the dialog.

        @name SettingsDialog#showDialog
        */
        showDialog: function () {
            this._dialog.show();
        },

        /**
        Hides the dialog and updates each setting widget with the last committed settings.

        @name SettingsDialog#hideDialog
        */
        hideDialog: function () {
            this._dialog.hide();
            if (this._state.tabWidget) {
                this._state.tabWidget.setSelectedTab(0);
            }
            this._legacyUpdate(this._state.model);
        },

        // SettingsDialog API
        // ==================

        /**
        Adds a setting widget with name "widgetName" to tab "tabTitle" to this dialog.
        Calls to addSettingsWidget are chainable so it's possible to add more than one
        widget at a time.

        @example
            settingsDialog.addSettingWidget('Tab1', 'Widget1', widget1)
                          .addSettingWidget('Tab2', 'Widget2', widget2)
                          .addSettingWidget('Tab3', 'Widget3', widget3)
                          .build();

        @name SettingsDialog#addSettingWidget
        @params {String} tabTitle - Title of tab to add widget to.
                {Widget} widget - Settings widget.
        */
        addSettingWidget: function (tabTitle, widget) {
            widget.setEventBus(this._eventBus);
            this._state.settingWidgets.push({tab: tabTitle, widget: widget});

            return this;
        },

        /**
        Adds content to the tabs and attaches them to the DOM.
        Must be called after all widgets have been added to make them visible.

        @name SettingsDialog#build
        */
        build: function () {
            var tabContent = [];
            var tabs = _.groupBy(this._state.settingWidgets, function (widget) {
                return widget.tab;
            });

            _.each(tabs, function (settings, tab) {
                var w = [];
                
                _.each(settings, function (setting) {
                    w.push(setting.widget);
                });

                tabContent.push({
                    title: tab, 
                    content: new SettingsTab({
                        widgets: w
                    })
                });
            });

            this._state.tabWidget = new Tabs({tabs: tabContent});
            this._state.tabWidget.attachTo(this.getElement());

            this._createSettingsFromModel(new mvp.Model(this.options.initSettings));
            this._storeCurrentSettings();
        },

        /**
        Returns the settings widget identified by name.

        @name SettingsDialog#getSettingWidget
        @params {String} name - identifier for the widget to get
        @returns {Widget} the settings widget identified by "name" or undefined if not found
        */
        getSettingWidget: function (name) {
            var setting = _.find(this._state.settingWidgets, function (setting) {
                return setting.widget.getName() === name;
            });

            if (setting) {
                return setting.widget;
            } else {
                return undefined;
            }
        },

         /**
        Commits the current settings. If this method is not called the last committed
        settings will be rolled back when the dialog is hidden.

        @name SettingsDialog#commitSettings
        */
        commitSettings: function () {
            this._storeCurrentSettings();
        },

        /**
        Returns an object containing last committed settings.

        @name SettingsDialog#getSettings
        @returns {Object} last committed settings
        */
        getSettings: function () {
            return this._state.model.toJSON();
        },

        /**
        Returns an object containing last committed settings formatted to mimic RegionHandlers 
        getConfigurationData format.

        @name SettingsDialog#getLegacySettings
        @returns {Object} last committed settings
        */
        getLegacySettings: function () {
            var settingsObj = {
                typeSettings: {}
            };

            _.each(this._state.settingWidgets, function (setting) {
                switch (setting.widget.getName()) {
                    case 'subscription':
                        settingsObj.subscription = this._state.model.getAttribute('subscription');
                        break;
                    case 'span':
                        settingsObj.span = this._state.model.getAttribute('span');
                        break;
                    case 'aspectRatio':
                        settingsObj.aspectRatio = this._state.model.getAttribute('aspectRatio');
                        break;
                    case 'datePicker':
                        settingsObj.datePicker = this._state.model.getAttribute('datePicker');
                        break;
                    case 'updateInterval':
                        settingsObj.updateInterval = this._state.model.getAttribute('updateInterval');
                        break;
                    default:
                        settingsObj.typeSettings[setting.widget.getName()] = this._state.model.getAttribute(setting.widget.getName());
                        break;
                }
            }, this);

            return settingsObj;
        },

        /**
        Saves the settings to server.
        */
        // This is not sorted out yet.
        // saveSettingsToServer: function () {
        //     this._state.model.save();
        // }
    });
});