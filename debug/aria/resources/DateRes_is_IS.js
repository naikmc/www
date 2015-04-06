/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * DO NOT FORMAT
 * Aria resource object for dates en-US
 */
Aria.resourcesDefinition({
    $classpath : 'aria.resources.DateRes',
    $resources : {
        day : [
            "sunnudagur",
            "m\u00E1nudagur",
            "\u00FEri\u00F0judagur",
            "mi\u00F0vikudagur",
            "fimmtudagur",
            "f\u00F6studagur",
            "laugardagur"
        ],
        // a false value for the following items mean: use substring
        // to generate the short versions of days or months
        dayShort : false,
        monthShort : false,
        month : [
            "jan\u00FAar",
            "febr\u00FAar",
            "mars",
            "apr\u00EDl",
            "ma\u00ED",
            "j\u00FAn\u00ED",
            "j\u00FAl\u00ED",
            "\u00E1g\u00FAst",
            "september",
            "okt\u00F3ber",
            "n\u00F3vember",
            "desember"
        ]
    }
});
