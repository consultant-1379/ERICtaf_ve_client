/**
Create a d3 svg graphic that connects each object displayed on screen
@class d3Paths
*/
define([
    'chartlib/base/d3'
], function (d3) {

    return {

        /**
        DrawPaths connects each node with a line when displayed on screen
        @name d3Paths#drawPaths
        @param {Object} base - d3 object where path should be added
        @param {Object} nodelist - list of nodes to connect linked with attributes (target and source)
        @param {Object} settings - boolean to determine if the adding should be instant instead of transitioned
        @returns {Object} path - d3 elements link svg elements
        */

        drawPaths: function(base, nodeList, settings) {
            var diagonal = d3.svg.diagonal().projection(function (d) { return [d.y, d.x]; });

            var stoke_width = settings.stoke_width ? settings.stoke_width : 3;
            var instant = settings.instant ? settings.instant : true;

            var path = base.selectAll(".link").data(nodeList);
            var new_path = path.enter();

            // when path changes
            if (instant === true) {
                path.attr("d", diagonal);
            }
            else {
                path.transition().duration(500).attr("d", diagonal);
            }

            // when new path arrives
            new_path
                .insert("path", "defs")
                .attr("id", function (d) {
                        return "link" + d.source.id+ "-" + d.target.id;
                })
                .attr("class", function (d) {
                        return "link" + " link-" + d.source.id + " link-" + d.target.id;
                })
                .style("stroke-width", stoke_width)
                .attr("d", diagonal);

            // when path's removed
            path.exit().remove();

            return path;
        }
    };
});
