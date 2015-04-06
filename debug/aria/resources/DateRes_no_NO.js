/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * DO NOT FORMAT
 * Aria resource object for dates no-NO
 */
Aria.resourcesDefinition({
    $classpath : 'aria.resources.DateRes',
    $resources : {
        day : [
            "s\u00F8ndag",
            "mandag",
            "tirsdag",
            "onsdag",
            "torsdag",
            "fredag",
            "l\u00F8rdag"
        ],
        // a false value for the following items mean: use substring
        // to generate the short versions of days or months
        dayShort : false,
        monthShort : false,
        month : [
            "januar",
            "februar",
            "mars",
            "april",
            "mai",
            "juni",
            "juli",
            "august",
            "september",
            "oktober",
            "november",
            "desember"
        ]
    }
});
