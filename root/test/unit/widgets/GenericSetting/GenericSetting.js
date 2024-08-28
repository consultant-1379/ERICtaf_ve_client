/*global define, describe, it, expect */
define([
    'app/widgets/GenericSetting/GenericSetting',
    'app/widgets/SettingsDialog/Subscription/Subscription',
    'app/widgets/SettingsDialog/EiffelSpinner/EiffelSpinner',
    'app/lib/utils/MBAttributes',
    'jscore/core'
], function (GenSetting, Subscriber, EiffelSpinner, MBAttributes, core) {
    'use strict';

    describe('Generic Setting', function () {
    	var should = chai.should();

        describe('init - empty instance, no options (default values), no content', function () {
        	var genSettings = new GenSetting();
            it('should by creating instance', function() {
                genSettings.should.not.be.undefined;
            });
            
            it('should have set up initial values properly', function() {
                genSettings.getTitle().should.equal("");
                genSettings.getName().should.equal("");
                should.not.exist(genSettings.content);
                should.not.exist(genSettings.info);
            });
            
        });        

        describe('init - with options, but no content', function () {
        	var genSettings = new GenSetting({title: 'fakeTitle', enabled: false, info: "psa: chill", name: "pink martini"});
            
            it('should have set up initial values properly', function() {
                genSettings.getTitle().should.equal("fakeTitle");
                genSettings.getName().should.equal("pink martini");
                genSettings.getInfo().should.equal("psa: chill");
            });
            
        }); 

        describe('init - with a widget content only', function () {
        	var tSub = new Subscriber();
        	var genSettings = new GenSetting({content: tSub});
           
            it('should contain a widget', function() {
            	should.exist(genSettings.content);
            });
          
        });        

        describe('set methods - modify name, title, enabled and info', function () {
        	var tSub = new Subscriber();
        	var genSettings = new GenSetting({ title: 'generic', enabled: false, info: "this helps?", name: "Veyron", content: tSub});

            it('empty, default values', function() {
                genSettings.setTitle("Fringe");
                genSettings.getTitle().should.equal("Fringe");
                
                genSettings.setName("ford gt");
                genSettings.getName().should.equal("ford gt");
                
                genSettings.setInfo("not really:(");
                genSettings.getInfo().should.equal("not really:(");
                
                genSettings.getContentState().should.equal(false);
                genSettings.setEnabled(true);
                genSettings.getContentState().should.equal(true);
                
            });
            
        });  


        describe('set method - content', function () {
        	var tSub = new Subscriber();
        	var genSettings = new GenSetting({ title: 'generic', enabled: false, info: "this helps?", name: "Veyron", content: tSub});

            it('initial content exists', function() {
                should.exist(genSettings.getElement().find('.eaVEApp-wSubscription-title'));
            });
            
            it('change content with a different one', function() {
                var columnset = MBAttributes.getDefaultCollection();
                var spinner = new EiffelSpinner({
                                                 title: "Event keys:",
                                                 dataset: columnset,
                                                 singleSelection: true,
                                                 enabled: false,
                                                 defaultGroupOn: 'eventType',
                                                 info: "selector info: just not so random text"
                });	
            
                genSettings = new GenSetting({ title: 'generic', enabled: false, info: "this helps?", name: "Veyron", content: spinner});
                
                should.not.exist(genSettings.getElement().find('.eaVEApp-wSubscription-title'));
                should.exist(genSettings.getElement().find('.eaVEApp-wVEEiffelSpinner'));
            });
            
        });

        describe('value methods - manipulating an html element value, a string in content', function () {
        	var strSelect = '<select><option value="zero"  selected="selected">Please select a name</option><option value="one">One</option><option value="two">Two</option></select>';            	   
        	var genSettings = new GenSetting({ title: 'generic', enabled: false, info: "this helps?", name: "Veyron", content: strSelect});

            it('change the contents value - add two criteria', function() {
            	chai.expect(genSettings.getValue()).to.be.null;
            	genSettings.setValue("two");
            	chai.expect(genSettings.getValue()).to.be.null;
            });       
        });        

        describe('value methods - manipulating core.Element value', function () {
        	var strSelect = '<select><option value="zero"  selected="selected">Please select a name</option><option value="one">One</option><option value="two">Two</option></select>';            	   
            var coreSelect = core.Element.parse(strSelect);
        	var genSettings = new GenSetting({ title: 'generic', enabled: false, info: "this helps?", name: "Veyron", content: coreSelect});

            it('change the contents value - add two criteria', function() {
            	genSettings.getValue().should.equal("zero");
            	genSettings.setValue("two");
            	genSettings.getValue().should.equal("two");
            });       
        });        


        describe('set method - manipulating subscriptions value', function () {
        	var tSub = new Subscriber();
        	var genSettings = new GenSetting({ title: 'generic', enabled: false, info: "this helps?", name: "Veyron", content: tSub});

            it('change the contents value - add two criteria', function() {
            	genSettings.getValue().length.should.equal(0);
                genSettings.setValue("qaz=999||bbc=789");
                genSettings.getValue().length.should.equal(2);
                genSettings.getValue()[0].should.equal("qaz=999");
                genSettings.getValue()[1].should.equal("bbc=789");
            });       
        });

        
        describe('set method - manipulating contents value when content undefined', function () {
        	var tSub = new Subscriber();
        	var genSettings = new GenSetting({ title: 'generic', enabled: false, info: "this helps?", name: "zoomzoom"});

            it('change the undefined contents value - add criteria, get value', function() {
            	chai.expect(genSettings.getValue()).to.be.null;
                genSettings.setValue("qaz=999||bbc=789");
                chai.expect(genSettings.getValue()).to.be.null;
            });       
        });

        describe('Event Bus - handling change event', function () {
            var eventBus = new core.EventBus();
            var tmpSub = new Subscriber();
            tmpSub.setValue("abc=123||bbc=987");
            var genSet = new GenSetting({ name: "ericsson", content: tmpSub, eventType:'change'});
            genSet.setEventBus(eventBus);

            it('trigger expected event', function() {
                eventBus.subscribe('setting:change', function (obj) {
                    expect(obj.newVal[0]).to.equal('abc=123');
                    expect(obj.newVal[1]).to.equal('bbc=987');
                    expect(obj.name).to.equal('ericsson');
                });
                genSet.trigger('change', 'a_param'); 
               
            });   
            
        });

   
        describe('Event Bus - User defined custom event', function () {
            var eventBus;
            var coreEl;
            var genSet;
        	
            beforeEach(function () {
                eventBus = new core.EventBus();
                coreEl = core.Element.parse("<input type='text' name='lname'>");
                coreEl.setValue("jBieber");
                genSet = new GenSetting({ name: "dna", content: coreEl, eventType:'changemind'});
                genSet.setEventBus(eventBus);

            });


            it(' trigger user defined event ', function(done) {
                eventBus.subscribe('setting:change', function (obj) {
                    expect(obj.newVal).to.equal('jBieber');
                    expect(obj.name).to.equal('dna');
                    done();
                });
                genSet.content.trigger('changemind', 'a_param'); 
               
            });   
            
        });        
        
 
        describe('Event Bus - change the event type', function () {
            var eventBus;
            var coreEl;
            var genSet;
        	
            beforeEach(function () {
                eventBus = new core.EventBus();
                coreEl = core.Element.parse("<input type='text' name='lname'>");
                coreEl.setValue("helloKitty");
                genSet = new GenSetting({ name: "Eve", content: coreEl, eventType:'click' }); 
                genSet.setEventBus(eventBus);
                genSet.setEventType('yahoo');

            });

            it(' trigger different event ', function(done) {
                eventBus.subscribe('setting:change', function (obj) {
                    expect(obj.newVal).to.equal('helloKitty');
                    expect(obj.name).to.equal('Eve');
                    done();
                });
                /** Note: while testing this case i encountered timeout issues.
                 * this test case changes the event type, so the generic settings content first removes
                 * the event handler then adds a new one with with the new event type. 
                 *  i found that having the two trigger statements below resolved the timing issue.
                 */ 
                genSet.content.trigger('click', 'qwerty'); 
                genSet.content.trigger('yahoo', 'a_param'); 
               
            });   
            
        });

    });
});