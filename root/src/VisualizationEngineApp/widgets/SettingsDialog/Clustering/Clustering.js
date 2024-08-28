/**
Clustering widget for displaying options in a tree menu
@Class Clustering
*/
define([
    'jscore/core',
    './ClusteringView',
    'app/ext/flyoutMenu',
    'jscore/ext/utils/base/underscore',
    'app/lib/template/MessageBusTemplate',
    'jscore/base/jquery',
    'widgets/Button',
    'app/widgets/SettingsDialog/DefaultSettings/DefaultSettings',
    'widgets/InfoPopup',
    'app/config/config'
], function (core, View, menu, _, MessageBusTemplate, $, Button, Checkbox, Popup, config) {
    'use strict';

    return core.Widget.extend({

        View: View,

        init: function () {
            _.extend(this, menu);
            this.defineCallback(this.triggerClusterBaseEvent);
            this.keyObj = MessageBusTemplate.getDefaultOptions();
            this.settingsDialogOpen = false;

            this.refreshButton = new Button({
                caption: "Refresh menu"
            });
            this.refreshButton.setModifier('color', 'blue');
            this.refreshButton.addEventHandler("click", function() {
                this.updateMenu();
            }, this);

            this.oneNode = new Checkbox({
                checked: false, title: "Summarize into single node", onclickevent: function (e) {
                    var bool = this.oneNode.isChecked();
                    this.trigger('oneNodeModeEvent', bool);
                }.bind(this)
            });

            this.oneNodePopup = new Popup({
                content: '"Summarize into single node"<br /><br />Enable clustering of all boxes into one single summary box.<br /> The color is green (SUCCESS) if all summarized items are SUCCESS. <br />This option does not allow fading'
            });
        },

        onViewReady: function () {
            this.oneNode.attachTo(this.view.getOneNodeElement());
            this.oneNodePopup.attachTo(this.oneNode.element);
            this.updateMenu();
            this.refreshButton.attachTo(this.view.getRefreshButtonElement());
        },

        onDOMAttach: function () {
            var liItem = this.findLiItemByText(config.defaultClusteringOption),
                parents,
                subMenuId;

            _.each(liItem, function (node) {
                if (node.textContent === config.defaultClusteringOption) {
                    parents = this.getParentsUntil(node, '#menu');
                    this.setItemSelected(node.children[0]);
                    _.each(parents, function (parent) {
                        if (parent.nodeName === 'LI') {
                            this.setItemSelected(parent.children[0]);
                        }
                    }, this);
                    subMenuId = _.filter(parents, function (item) {
                        return item.nodeName === 'LI';
                    }).length;
                    this.setDefaultSelection(config.defaultClusteringOption, subMenuId);
                }
            }, this);
        },
        /**
        Method to toggle liveUpdate of widget
        @name Clustering#toggleLiveUpdate
        @param bool {boolean}     
        */
        toggleLiveUpdate: function(bool) {
            this.settingsDialogOpen = bool;
        },
        /**
        Method to toggle liveUpdate of widget
        @name Clustering#toggleLiveUpdate
        @param bool {boolean}     
        */
        receiveEvent: function(event) {
            event = _.omit(event, ["id"]);
            this.keyObj = $.extend(true, this.keyObj, event);
            if(!this.settingsDialogOpen) {
                this.updateMenu();
            }
        },
        /**
        Method to trigger the clusterbase update
        @name Clustering#triggerClusterBaseEvent
        @param clusterBase {String}     
        */
        triggerClusterBaseEvent: function(clusterBase) {
            this.trigger('clusterBaseEvent', clusterBase);
        },
        /**
        Method to get widget value
        @name Clustering#getValue
        @returns value (Object) {oneNode: true/false, typeId: <current selection>}       
        */
        getValue: function(){
            var result = {};
            result.oneNode = this.oneNode.isChecked();
            result.typeId = this.currentSelection.selection;
            return result;
        },        
        /**
        Method to set widget value
        @name Clustering#setValue
        @param value {String} 
        */
        setValue: function (value) {
            
            if(value && value.oneNode){
                this.oneNode.view.setCheckboxStatus(true);
            }
            else{
                this.oneNode.view.setCheckboxStatus(false);
            }            
            this.trigger('oneNodeModeEvent', this.oneNode.isChecked());

            var valueKey;
            if(value && value.typeId){
                valueKey = value.typeId;
            }
            else{
                valueKey = config.defaultClusteringOption;
            }

            var listItem = this.findLiItemByText(valueKey);
            if(listItem){
                this.setItemSelected(listItem);             // TODO: doesn't seem to work properly 
                this.trigger('clusterBaseEvent', valueKey); 
            }

        }
    });
});