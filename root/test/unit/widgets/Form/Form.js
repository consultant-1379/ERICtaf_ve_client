define([
    'app/widgets/Form/Form'
], function (Form) {
    'use strict';

    describe('Form', function () {

        before(function() {
            this.form = new Form([{placeholder: "input1", name: "input1", popupContent: "popup1"}, {placeholder: "input2", name: "input2", popupContent: "popup2"}]);
        });

        describe('Functionality', function () {

            var should = chai.should();

            it('should create input elements and append them to DOM', function() {
                this.form.getInputElement("input1").should.exist;
                this.form.getInputElement("input2").should.exist;
                this.form.inputs.length.should.equal(2);
            });

            it('should return the correct input value', function() {
                this.form.getValue("input1").should.equal("");
                this.form.getInputElement("input1").setValue("text");
                this.form.getValue("input1").should.equal("text");
            });

            it('should clear the form', function() {
                this.form.getInputElement("input1").setValue("text");
                this.form.getInputElement("input2").setValue("more text");
                this.form.getValue("input1").should.equal("text");
                this.form.getValue("input2").should.equal("more text");
                this.form.clearForm();
                this.form.getValue("input1").should.equal("");
                this.form.getValue("input2").should.equal("");
            });

            it('should set input error status', function() {
                this.form.setErrorStatus("input1");
                this.form.getElement().find(".ebInput_borderColor_red").getAttribute("placeholder").should.equal("input1");
            });

            it('should remove input error status', function() {
                this.form.setErrorStatus("input1");
                this.form.getElement().find(".ebInput_borderColor_red").getAttribute("placeholder").should.equal("input1");
                this.form.removeErrorStatus("input1");
                var inputsWithErrorStatus = this.form.getElement().find(".ebInput_borderColor_red");
                chai.expect(inputsWithErrorStatus).to.be.undefined;
            });

        });
    });
});