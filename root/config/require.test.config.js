require = {
    baseUrl:        "../../src",
    resources:      "../../resources",
            
    paths: {
        jscore:     "../node_modules/jscore",
        text:       "../node_modules/jscore/require/text",
        styles:     "../node_modules/jscore/require/styles",
        template:   "../node_modules/jscore/require/template",
        
        app:        "VisualizationEngineApp",
        thirdparty: "../../thirdparty",

        base:       "../node_modules/jscore/base",
        widgets:    "../node_modules/widgets",
        chartlib:   "../node_modules/chartlib",
        jqueryui:   "../../thirdparty/jquery-ui-1.10.3/jqueryui"
    },

    map: {
        'app/VisualizationEngineApp': {
            'app/ext/regionFactory': '../test/mocks/regionFactoryMock'
        }
    }
};