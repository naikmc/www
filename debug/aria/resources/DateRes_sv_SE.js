/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * DO NOT FORMAT
 * Aria resource object for dates sv-SE
 */
Aria.resourcesDefinition({
    $classpath : 'aria.resources.DateRes',
    $resources : {
        day : [
            "s\u00F6ndag",
            "m\u00E5ndag",
            "tisdag",
            "onsdag",
            "torsdag",
            "fredag",
            "l\u00F6rdag"
        ],
        // a false value for the following items mean: use substring
        // to generate the short versions of days or months
        dayShort : false,
        monthShort : false,
        month : [
            "januari",
            "februari",
            "mars",
            "april",
            "maj",
            "juni",
            "juli",
            "augusti",
            "september",
            "oktober",
            "november",
            "december"
        ]
    }
});
