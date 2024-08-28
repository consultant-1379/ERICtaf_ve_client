/**
Draws d3 nodes and blocks on screen
input:
               base - d3 object where node should be added
               nodeList - array list of objects that should be drawn should contain
                   id          - unique id number, used for id of node
                   title       - creates title
                   class        - a class that
                   textmatrix  - array of text to be displayed
               
               settings - json docs containing settings
                  fontSize
                  lineSpace
                  boxHeight
                  boxWidth
                  draggable
                  
                  /color scheme/
                  success  i.e. #89ba17
                  unknown
                  not_built
                  failure
                  _undefined
                  unstable
                  
                  /gradient/
                  colorGradient - changing this value will change gradient scheme ([+] value makes it ligther, [-] value makes it darker)
                  
@class d3Node
*/
define([
    'chartlib/base/d3'
], function (d3) {

    return {

        /** 
            drawNodes   Creates the d3 objects and appends to svg element specified      
            @name d3Node#drawNodes
            @param {Object} base - d3 svg element to draw from
            @param {Object} nodeList - list of node objects to draw
            @param {Object} settings - box settings used to draw on screen
            
            @returns {Object} existing - nodes that have been processed.
         */

        drawNodes: function (base, nodeList, settings) {
            var self = this;
            var count = 0;
            var fontSize = settings.fontSize ? settings.fontSize : 10;
            var lineSpace = settings.lineSpace ? settings.lineSpace : 1;
            var boxHeight = settings.boxHeight ? settings.boxHeight : 60;
            var boxWidth = settings.boxWidth ? settings.boxWidth : 225;
            var draggable = settings.node_draggable !== "undefined" ? settings.node_draggable: false;
            var columnCharSpace = Math.max(5,Math.round(boxWidth/2/(fontSize*0.65)));   // Number of characters that fit inside a column
            
            var success = settings.success ? settings.success : "#89ba17";
            var failure = settings.failure ? settings.failure : "#e32119";
            var _undefined = settings._undefined ? settings._undefined : "#fabb00";
            var not_built = settings.not_built ? settings.not_built : "#b1b3b4";
            var unknown = settings.unknown ? settings.unknown : "#00a9d4";
            var unstable = settings.unstable ? settings.unstable : "#fabb00";
            
            var colorGradient = settings.colorGradient ? settings.colorGradient : 100;  // changing this value will change gradient scheme (+ value makes it ligther, - value makes it darker)

            // if first run
            if (base.selectAll(".node").empty() === true) {
                base.append("clipPath")
                    .attr("id", "clipRect")
                    .append("rect")
                        .attr("width", boxWidth).attr("height", boxHeight)
                        .attr("x", -boxWidth/2).attr("y", -boxHeight/2)
                        .attr("rx", 6).attr("ry", 6);
                
                //add box-shadow        
                var defs = base.append("defs");
                
                var filter = defs.append("filter")
                    .attr("id", "drop-shadow")
                    .attr("height", "130%");

                filter.append("feGaussianBlur")
                    .attr("in", "SourceAlpha")
                    .attr("stdDeviation", 5)
                    .attr("result", "blur");

                filter.append("feOffset")
                    .attr("in", "blur")
                    .attr("dx", 5)
                    .attr("dy", 5)
                    .attr("result", "offsetBlur");
                
                var feSpecularLighting = filter.append("feSpecularLighting")
                                               .attr("in", "blur")
                                               .attr("surfaceScale", 5)
                                               .attr("specularConstant", 1)
                                               .attr("specularExponent", 10)
                                               .attr("lighting-color", "white")
                                               .attr("result", "specOut");
                                              
                feSpecularLighting.append("fePointLight")
                                  .attr("x",-5000)
                                  .attr("y",-10000)
                                  .attr("z",20000);
                
                
                filter.append("feComposite")
                    .attr("in", "specOut")
                    .attr("in2", "SourceAlpha")
                    .attr("operator", "in")
                    .attr("result", "specOut");
                
                filter.append("feComposite")
                    .attr("in", "SourceGraphic")
                    .attr("in2", "SourceAlpha")
                    .attr("operator", "arithmetic")
                    .attr("k1", 0)
                    .attr("k2", 1)
                    .attr("k3", 1)
                    .attr("k4", 0)
                    .attr("result", "litPaint");
                                 
                var feMerge = filter.append("feMerge");

                feMerge.append("feMergeNode")
                    .attr("in", "offsetBlur");
                feMerge.append("feMergeNode")
                    .attr("in", "SourceGraphic");
                    
                    
                 //add gradients for css
                var gradient_success = defs.append("svg:linearGradient")
                                    .attr("x1", "0%")
                                    .attr("y1", "0%")
                                    .attr("x2", "100%")
                                    .attr("y2", "100%")
                                    .attr("spreadMethod", "pad")
                                    .attr("id", "gradient_success");
                                    
                    
                gradient_success.append("stop").attr("offset", "40%").attr("stop-opacity",1).style("stop-color", success);
                gradient_success.append("stop").attr("offset", "98%").attr("stop-opacity",1).style("stop-color", this.getTintedColor(success,colorGradient));
                
                var gradient_failure = defs.append("svg:linearGradient")
                                    .attr("x1", "0%")
                                    .attr("y1", "0%")
                                    .attr("x2", "100%")
                                    .attr("y2", "100%")
                                    .attr("spreadMethod", "pad")
                                    .attr("id", "gradient_failure");
                                    
                    
                gradient_failure.append("stop").attr("offset", "40%").attr("stop-opacity",1).style("stop-color", failure);
                gradient_failure.append("stop").attr("offset", "98%").attr("stop-opacity",1).style("stop-color", this.getTintedColor(failure,colorGradient));
                
                var gradient_not_built = defs.append("svg:linearGradient")
                                    .attr("x1", "0%")
                                    .attr("y1", "0%")
                                    .attr("x2", "100%")
                                    .attr("y2", "100%")
                                    .attr("spreadMethod", "pad")
                                    .attr("id", "gradient_not_built");
                                    
                    
                gradient_not_built.append("stop").attr("offset", "40%").attr("stop-opacity",1).style("stop-color", not_built);
                gradient_not_built.append("stop").attr("offset", "98%").attr("stop-opacity",1).style("stop-color", this.getTintedColor(not_built,colorGradient));
                
                var gradient_unknown = defs.append("svg:linearGradient")
                                    .attr("x1", "0%")
                                    .attr("y1", "0%")
                                    .attr("x2", "100%")
                                    .attr("y2", "100%")
                                    .attr("spreadMethod", "pad")
                                    .attr("id", "gradient_unknown");
                                    
                    
                gradient_unknown.append("stop").attr("offset", "40%").attr("stop-opacity",1).style("stop-color", unknown);
                gradient_unknown.append("stop").attr("offset", "98%").attr("stop-opacity",1).style("stop-color", this.getTintedColor(unknown,colorGradient));
                
                var gradient_undefined = defs.append("svg:linearGradient")
                                    .attr("x1", "0%")
                                    .attr("y1", "0%")
                                    .attr("x2", "100%")
                                    .attr("y2", "100%")
                                    .attr("spreadMethod", "pad")
                                    .attr("id", "gradient_undefined");
                                    
                    
                gradient_undefined.append("stop").attr("offset", "40%").attr("stop-opacity",1).style("stop-color", _undefined);
                gradient_undefined.append("stop").attr("offset", "98%").attr("stop-opacity",1).style("stop-color", this.getTintedColor(_undefined,colorGradient));
                
                var gradient_unstable = defs.append("svg:linearGradient")
                                    .attr("x1", "0%")
                                    .attr("y1", "0%")
                                    .attr("x2", "100%")
                                    .attr("y2", "100%")
                                    .attr("spreadMethod", "pad")
                                    .attr("id", "gradient_unstable");
                                    
                    
                gradient_unstable.append("stop").attr("offset", "40%").attr("stop-opacity",1).style("stop-color", unstable);
                gradient_unstable.append("stop").attr("offset", "98%").attr("stop-opacity",1).style("stop-color", this.getTintedColor(unstable,colorGradient));
                          
            }
            //show each node with text
            var existingNodes = base.selectAll(".node").data(nodeList, function(d) {return d.eventId;});

            // select all the new items
            var newNodes = existingNodes.enter().append("g")          
            .attr("filter", "url(#drop-shadow)");
            

            //add title for hover
            newNodes.append("svg:title");

            //draw rectangle for all new items
            newNodes
                .attr("class", "node")
                .attr("id", function (d) {return "node-" + d.id;})
                .append("rect")
                .attr("class", function (d) {return "nodebox " + d.rate;})
                .attr("x", -boxWidth/2)                                         // move x and y-values
                .attr("y", -boxHeight/2)
                .attr("rx", 6)                                                  // round the corners
                .attr("ry", 6)
                .attr("width", boxWidth)                                        // set the width
                .attr("height", boxHeight);                                  // and height
             

            //node title constructor
            newNodes.append("text")
                .attr("class", "nodeTitle")
                .attr("x", -boxWidth/2)
                .attr("y", -boxHeight/2 + fontSize + 2*lineSpace);

            // allow dragging on the new objects
            if(draggable) {
                newNodes.call(d3.behavior.drag().origin(Object).on("drag", function (d) {
                    var coord = {x: d.y, y: d.x};
                    d3.select(this)
                    .attr("transform", "translate(" + (coord.x + d3.event.dx)+ ", " + (coord.y + d3.event.dy) + ")");

                    //update node's coord , then redraw affected edges
                    d.x = d.x + d3.event.dy;
                    d.y = d.y + d3.event.dx;

                    //redraw arrow paths if they exist
                    if (typeof self.drawPaths === "function") {
                    self.drawPaths(base, self.links, true);
                    }
                }));
            }

            // add body text
            newNodes.append("g")
                .attr("class", "textmatrix")
                .selectAll("g").data(function (d) {return d.textmatrix?d.textmatrix:[];})
                .enter().append("g")
                .attr("class", "rows")
                .attr("transform", function (d, i) { return "translate(" + (-25) + ", " + (-boxHeight/2 + (i + 3)*fontSize+(i + 4)*lineSpace) + ")"; })
                .selectAll("g").data(function (d) {return d;})
                .enter().append("g")
                .attr("class", "columns")
                .attr("transform", function (d, i) { return "translate(" + i*50 + ", 0)"; })
                .append("text")
                .attr("text-anchor", "middle")
                .attr("class", "nodeText");

            newNodes.select(".textmatrix")
                .selectAll(".rows")
                .data(function (d) {return d.textmatrix?d.textmatrix:[];})
                .selectAll(".columns") //rows
                .data(function (d) {return d;})
                .select("text")
                .text(function (d) {if(d.length && d.length>columnCharSpace) d=d.substring(0,columnCharSpace)+"..."; return d;});

            newNodes.select(".textmatrix").selectAll(".rows").selectAll(".columns").append("svg:title").text(function (d) {
                return d;
            });


            ///show text
            newNodes.select(".nodeTitle").text(function (d) {
                return d.title;
            });
            newNodes.select("title").text(function (d) {
                    return d.title;
                })
                .attr("id", function (d) {
                return d.title;
            });

            // allows all selected to be updated
            existingNodes.select("rect")
                .attr('class', function(d) { return "nodebox " + d.rate; });

            // update existing nodes' text and title
            existingNodes.select(".nodeTitle").text(function (d) {
                return d.title;
            });
            existingNodes.select("title").text(function (d) {
                return d.title;
            });

            //if there has come in more textmatrix lines
            existingNodes.selectAll(".textmatrix").remove();

            existingNodes.append("g")
                .attr("class", "textmatrix")
                .selectAll("g").data(function (d) {return d.textmatrix?d.textmatrix:[];})
                .enter().append("g")
                .attr("class", "rows")
                .attr("transform", function (d, i) { return "translate(" + (-boxWidth/2) + ", " + (-boxHeight/2 + (i + 3)*fontSize+(i + 4)*lineSpace) + ")"; })
                .selectAll("g").data(function (d) {return d;})
                .enter().append("g")
                .attr("class", "columns")
                .attr("transform", function (d, i) { return "translate(" + i*boxWidth/2 + ", 0)"; })
                .append("text")
                .attr("class", "nodeText");


            existingNodes.select(".textmatrix")
                .selectAll(".rows")
                .data(function (d) {return d.textmatrix?d.textmatrix:[];})
                .selectAll(".columns") //rows
                .data(function (d) {return d;})
                .select("text")
                .text(function (d) {if(d.length && d.length>columnCharSpace) d=d.substring(0,columnCharSpace)+"..."; return d;});

            existingNodes.select(".textmatrix").selectAll(".rows").selectAll(".columns").append("svg:title").text(function (d) {
                return d;
            });
            
            // set all existing nodes' position
            existingNodes
                .transition()
                .duration(500)
                .attr("transform", function (d) {
                    return "translate(" + d.y + ", " + d.x + ")"; });

            existingNodes.exit().remove();

            return existingNodes;
        },
        /**
        Returns a hex colour as a lighter shade when a positive value is add or a darker shade when a negative value is passed
        @name d3Node#getTintedColor
        @param color {String} hex colour i.e. #FFFFFF
        @param variance {int} variance between shades
        @return hex colour {String} 
        */        
        getTintedColor: function(color, variance) {
                if (color.length >6) { 
                    color= color.substring(1,color.length);
                }
                var rgb = parseInt(color, 16); 
                var r = Math.abs(((rgb >> 16) & 0xFF)+variance); if (r>255) r=r-(r-255);
                var g = Math.abs(((rgb >> 8) & 0xFF)+variance); if (g>255) g=g-(g-255);
                var b = Math.abs((rgb & 0xFF)+variance); if (b>255) b=b-(b-255);
                r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16); 
                if (r.length == 1) r = '0' + r;
                g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16); 
                if (g.length == 1) g = '0' + g;
                b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16); 
                if (b.length == 1) b = '0' + b;
                return "#" + r + g + b;
        }
    };
});
