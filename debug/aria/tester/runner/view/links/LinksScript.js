/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
Aria.tplScriptDefinition({
    $classpath : 'aria.tester.runner.view.links.LinksScript',
    $prototype : {
        getDocumentationLinks : function () {
            return ([{
                        href : "http://ariatemplates.github.io/Test-Driven-Development",
                        title : "Test Driven Development Guide"
                    }, {
                        href : "http://ariatemplates.com/aria/guide/apps/apidocs",
                        title : "Aria Templates API Documentation"
                    }, {
                        href : "http://ariatemplates.com/usermanual/latest",
                        title : "Aria Templates User Manual"
                    }, {
                        href : "http://ariatemplates.com/samples",
                        title : "Aria Templates Samples"
                    }, {
                        href : "http://ariatemplates.com/usermanual/latest/logging_and_debugging",
                        title : "Aria Templates Logging and Debugging Guide"
                    }]);
        },
        getKeyboardShortcuts : function () {
            var shortcuts = [{
                        key : "F",
                        description : "fullscreen on/<b>off</b>",
                        callback : this.switchView
                    }, {
                        key : "R",
                        description : "Run/Reload the test",
                        callback : this.runTest
                    }, {
                        key : "E",
                        description : "Display End test report",
                        callback : this.navigateToReport
                    }];
            return shortcuts;
        },
        switchView : function () {
            this.moduleCtrl.switchView();
        },
        navigateToOptions : function () {
            this.flowCtrl.navigate(this.flowCtrl.STATES.OPTIONS);
        },
        navigateToReport : function () {
            this.flowCtrl.navigate(this.flowCtrl.STATES.REPORT);
        }
    }
});
