/*global define, describe, it, expect */
define([
    'app/widgets/ListBuilder/ListBuilder',
    'app/widgets/ListBuilder/ExistingListBuilderRow/ExistingListBuilderRow',
    'app/widgets/GenericSetting/GenericSetting',
    'jscore/core'
], function (ListBuilder, ExistingListBuilderRow, GenSetting, core) {
    'use strict';

    describe('List Builder Widget', function () {
    	var should = chai.should();

        describe('init', function () {
        	var lstBuilder = new ListBuilder();
            it('should by creating instance', function() {
            	lstBuilder.should.not.be.undefined;
            });
            
            it('verify initial default enabled property', function() {
            	lstBuilder.enableLB.should.equal(true);
            });
           
        });        

        describe('Set/Get Value - add a string to enabled (default) ListBuilder', function () {
            var lstBuilder = new ListBuilder({stringFilter: "^!?[^:(){},'\[\]\+\-]+$|[a-zA-Z0-9-_]+=[a-zA-Z0-9-_]+$" });

            it('Add one string', function() {
            	lstBuilder.getValue().length.should.equal(0);
            	lstBuilder.setValue("qaz=999");
            	lstBuilder.getValue().length.should.equal(1);
            	lstBuilder.getValue()[0].should.equal("qaz=999");
            });

            it('Clear list', function() {
            	lstBuilder.getValue().length.should.equal(1);
            	lstBuilder.clearList();
            	lstBuilder.getValue().length.should.equal(0);
            });

            it('Add one invalid string', function() {
            	lstBuilder.clearList();
            	lstBuilder.getValue().length.should.equal(0);
            	lstBuilder.setValue("qaz[1]=999");
            	lstBuilder.getValue().length.should.equal(0);
            }); 
            
            it('Add array of strings', function() {
            	lstBuilder.clearList();
            	lstBuilder.getValue().length.should.equal(0);
            	lstBuilder.setValue(["qaz=999", "too=much", "third=entry"]);
            	lstBuilder.getValue().length.should.equal(3);
            	lstBuilder.getValue()[0].should.equal("qaz=999");
            	lstBuilder.getValue()[1].should.equal("too=much");
            	lstBuilder.getValue()[2].should.equal("third=entry");
            	lstBuilder.clearList();
            	lstBuilder.getValue().length.should.equal(0);
            });
            
            
            it('ListBuilder duplicate string', function() {
            	lstBuilder.clearList();
            	lstBuilder.setValue(["qaz=999", "too=much", "third=entry"]);
            	lstBuilder.getValue().length.should.equal(3);
            	lstBuilder.setValue(["qaz=999", "bbc=789"]);
            	lstBuilder.getValue().length.should.equal(4);
            });
            
            
            it('ListBuilder complex string', function() {
            	lstBuilder.clearList();
            	lstBuilder.setValue(["qwerty=five", "&&plm=elk&&george&&another=more than 5&&bto=tcb", "||bbc=222||bbc=333||bbc=444"]);
            	lstBuilder.getValue().length.should.equal(3);
            	lstBuilder.getValue()[0].should.equal("qwerty=five");
            	lstBuilder.getValue()[1].should.equal("&&plm=elk&&george&&another=more than 5&&bto=tcb");
            	lstBuilder.getValue()[2].should.equal("||bbc=222||bbc=333||bbc=444");
            	lstBuilder.clearList();
            	lstBuilder.getValue().length.should.equal(0);
            });

        });

         describe('Set/Get Value - add a string to disabled ListBuilder', function () {
            var lstBuilder = new ListBuilder({enable: false, stringFilter: "^!?[^:(){},'\[\]\+\-]+$|[a-zA-Z0-9-_]+=[a-zA-Z0-9-_]+$"});

            it('ListBuilder optionally disabled for adding', function() {
                lstBuilder.getValue().length.should.equal(0);
                lstBuilder.setValue("qaz=999||bbc=789");
                lstBuilder.getValue().length.should.equal(0);
            }); 
            
            it('ListBuilder enable() for adding', function() {
            	lstBuilder.clearList();
                lstBuilder.getValue().length.should.equal(0);
                lstBuilder.enable();
                lstBuilder.setValue("qaz=999||bbc=789");
                lstBuilder.getValue().length.should.equal(1);
            });          

            it('ListBuilder disable(), add, enable() add', function() {
            	lstBuilder.clearList();
            	lstBuilder.setValue("qaz=999||bbc=789");
                lstBuilder.getValue().length.should.equal(1);
                lstBuilder.disable();
                lstBuilder.setValue("dean=great");
                lstBuilder.getValue().length.should.equal(1);
                lstBuilder.enable();
                lstBuilder.setValue("dean=great");
                lstBuilder.getValue().length.should.equal(2);
            });
                        
        });
        

        describe('Set/Get Value - duplicate string', function () {
            var lstBuilder = new ListBuilder({stringFilter: "^!?[^:(){},'\[\]\+\-]+$|[a-zA-Z0-9-_]+=[a-zA-Z0-9-_]+$"});

            it('ListBuilder enabled, add an existing string', function() {
                lstBuilder.getValue().length.should.equal(0);
                lstBuilder.setValue(["qaz=999", "bbc=789"]);
                lstBuilder.getValue().length.should.equal(2);
                lstBuilder.setValue(["qaz=999", "bbc=799"]);
                lstBuilder.getValue().length.should.equal(3);
            	lstBuilder.getValue()[0].should.equal("qaz=999");
            	lstBuilder.getValue()[1].should.equal("bbc=789");
            	lstBuilder.getValue()[2].should.equal("bbc=799");
            });
        });

        
        describe('String filtering', function () {

            it('Pass in a regex filter allowing lower|upper case and numbers', function() {
                var lstBuilder = new ListBuilder({stringFilter: "^!?[^:(){},'\[\]\+\-]+$|[a-zA-Z0-9-_]+=[a-zA-Z0-9-_]+$"});
                lstBuilder.getValue().length.should.equal(0);
                lstBuilder.setValue(["qaz=9t99", "bbc=a7T89"]);
                lstBuilder.getValue().length.should.equal(2);
            });

            it('Pass in a regex filter not allowing uppercase letters', function() {
                var lstBuilder = new ListBuilder({stringFilter: "^!?[^:(){},'\[\]\+\-]+$|[a-zA-Z0-9-_]+=[a-z0-9-_]+$"});
                lstBuilder.getValue().length.should.equal(0);
                lstBuilder.setValue(["qaz=9t99", "bbc=a7T89"]);
                lstBuilder.getValue().length.should.equal(1);
            });

            it('No regex filter', function() {
            	//do not allow [] and {} as part of string
                var lstBuilder = new ListBuilder({stringFilter: "^!?[^:(){},'\[\]\+\-]+$|[a-zA-Z0-9-_]+=[a-zA-Z0-9-_]+$"});
                lstBuilder.getValue().length.should.equal(0);
                lstBuilder.setValue(["qaz=[999]", "bbc={a7T89}"]);
                lstBuilder.getValue().length.should.equal(0);

                //allow [] and {} as part of string
                lstBuilder = new ListBuilder();
                lstBuilder.getValue().length.should.equal(0);
                lstBuilder.setValue(["qaz=[999]", "bbc={a7T89}"]);
                lstBuilder.getValue().length.should.equal(2);
            });

        });

        describe('Remove string', function () {
            var lstBuilder = new ListBuilder();
                it('add two strings, remove one string', function () {
                   var aStr = "Test=Test";
                   lstBuilder.addListBuilder(aStr);
                   lstBuilder.addListBuilder("the=end");
                   lstBuilder.getValue().length.should.equal(2);
                   var row = new ExistingListBuilderRow({name: aStr});
                   lstBuilder.removeListBuilder(row);
                   lstBuilder.getValue().length.should.equal(1);
                });
        });


       describe('Change trigger event when adding string', function () {
            var eventBus;
            var genSet;
            var eventCount = 0;
            var lstBuilder = new ListBuilder({stringFilter: "^!?[^:(){},'\[\]\+\-]+$|[a-zA-Z0-9-_]+=[a-zA-Z0-9-_]+$"});
            var aStr = "Test=Test";
            var row;
        	
            beforeEach(function () {
                eventBus = new core.EventBus();
                genSet = new GenSetting({ name: "Eve", content: lstBuilder }); 
                genSet.setEventBus(eventBus);
                genSet.setEventType('change');

            });

            it('trigger change event when adding a string', function() {
                eventBus.subscribe('setting:change', function (obj) {
                	eventCount++;
                    genSet.getValue().length.should.equal(eventCount);
                });

                genSet.setValue("bcm=969||bbc=two");
                genSet.getContent().addListBuilder(aStr);
                genSet.getValue().length.should.equal(2);
            });

        });

      

        describe('Change trigger event when removing string', function () {
            var eventBus;
            var genSetII;
            var eventCount = 0;
            var listB = new ListBuilder({stringFilter: "^!?[^:(){},'\[\]\+\-]+$|[a-zA-Z0-9-_]+=[a-zA-Z0-9-_]+$"});
            var aStr = "rem=moon";
            var row;
        	
            beforeEach(function () {
                eventBus = new core.EventBus();
                genSetII = new GenSetting({ name: "Eve", content: listB }); 
                genSetII.setEventBus(eventBus);
                genSetII.setEventType('change');

            });

            it('add two strings, remove one, trigger change event', function() {
               eventBus.subscribe('setting:change', function (obj) {
        	      	eventCount++;
        	      	genSetII.getValue().length.should.equal(1);
        	     });

                
                genSetII.content.stringList.push("hero sandwhich");
                genSetII.content.stringList.push(aStr);
                genSetII.getValue().length.should.equal(2);
                
                row = new ExistingListBuilderRow({name: aStr});
                genSetII.content.removeListBuilder(row);
                genSetII.getValue().length.should.equal(1);

            });

        });


        describe('No change trigger event fired when removing non-existing string', function () {
            var eventBus;
            var genSetII;
            var eventCount = 0;
            var listB = new ListBuilder({stringFilter: "^!?[^:(){},'\[\]\+\-]+$|[a-zA-Z0-9-_]+=[a-zA-Z0-9-_]+$"});
            var aStr = "rem=moon";
            var row;
        	
            beforeEach(function () {
                eventBus = new core.EventBus();
                genSetII = new GenSetting({ name: "Eve", content: listB }); 
                genSetII.setEventBus(eventBus);
                genSetII.setEventType('change');

            });

            it('add two strings, do not remove any', function() {
               eventBus.subscribe('setting:change', function (obj) {
        	      	eventCount++;
                    //Note: the following test will not be performed 
                    //      because no event was triggered.
        	      	genSetII.getValue().length.should.equal(999);
        	     });

                genSetII.content.stringList.push("hero sandwhich");
                genSetII.content.stringList.push(aStr);
                genSetII.getValue().length.should.equal(2);
                
                row = new ExistingListBuilderRow({name: "blabla"});
                genSetII.content.removeListBuilder(row);
                genSetII.getValue().length.should.equal(2);

            });

        });
    });
});