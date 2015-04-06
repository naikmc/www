/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * DO NOT FORMAT
 * Aria resource object for dates et-EE (Estonian)
 */
Aria.resourcesDefinition({
    $classpath : 'aria.resources.DateRes',
    $resources : {
        day : [
            "pühapäev",
            "esmaspäev",
            "teisipäev",
            "kolmapäev",
            "neljapäev",
            "reede",
            "laupäev"
        ],
        // a false value for the following items mean: use substring
        // to generate the short versions of days or months
        dayShort : false,
        monthShort : false,
        month : [
            "jaanuar",
            "veebruar",
            "märts",
            "aprill",
            "mai",
            "juuni",
            "juuli",
            "august",
            "september",
            "oktoober",
            "november",
            "detsember"
        ]
    }
});
