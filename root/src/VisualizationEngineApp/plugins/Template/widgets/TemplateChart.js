define([
    'jscore/core',
    'app/plugins/Template/widgets/TemplateChartView',
    'chartlib/base/d3',
    'app/lib/utils/EventController',
    'jscore/ext/utils/base/underscore'
], function (core, View, d3, EventController, _) {
    'use strict';

    return core.Widget.extend({
        View: View,

        /**
        Initialisation of the TemplateChart
        */
        init: function () {  
                           
        },

          /**
        Method when view is ready create the chart and listens for events from the chart
        @Method onViewReady
        */
        onViewReady: function () {
              this.redraw();
        },   

        /**
        Method to redraw() graph, or draw circles in this case
        */
        redraw: function () {
           this.circles();
                                                        
        },
        
        circles: function() {
         var circleData = [ { "cx": 140, "cy": 20, "radius": 10, "color" : "green" },
                                { "cx": 150, "cy": 20, "radius": 10, "color" : "blue" },
                                { "cx": 160, "cy": 20, "radius": 10, "color" : "red" }];
                                              
            var svgContainer = d3.select(this.getElement().element).select('.eaVEApp-wTemplateChart-svgArea').append("svg")
                                      .attr("width",200)
                                      .attr("height",100);
            
           
            var Lines = svgContainer.append("svg:line")
                .attr("x1", 20)
                .attr("y1", 20)
                .attr("x2", 20)
                .attr("y2", 50)
                .style("stroke", "grey");
                
            var circles = svgContainer.selectAll("circle")
                           .data(circleData)
                           .enter()
                           .append("circle");
                          
            
            svgContainer.selectAll("circle").transition().duration(1000).delay(function(d, i) { return i / 3 * 500; }).attr("cx", 20);
        

            var circleAttr = circles
                       .attr("cx", function (d) { return d.cx; })
                       .attr("cy", function (d) { return d.cy; })
                       .attr("r", function (d) { return d.radius; })
                       .style("fill", function (d) { return d.color; });
                       
            
        },
                  
        /**
        Method to set the div element witha unique class tag for this plugin
        */
        getData: function () {
            return { id: _.uniqueId('template-chart-') };
        },
        /**
        Method to take the model and convert the json to s string to display in the view
        @param - model this is the modelled event sent from the server
        */
        addEventToScreen: function(model) {       
             this.getElement().element.innerHTML = EventController.showTooltip(model);
        }

  
    });
});