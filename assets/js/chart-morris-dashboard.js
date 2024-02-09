/**
* @Package: Cryptonia - Bitcoin & Cryptocurrency trading Dashboard
* @Version: 1.0.0
*/
jQuery(function($) {
    'use strict';

    var CRYPTONIA_SETTINGS = window.CRYPTONIA_SETTINGS || {};
    var donut; // Declare the Morris chart variable

    /*--------------------------------
        Morris Chart
     --------------------------------*/
    // Initialize the Morris Donut chart once (outside of the function)
    var donutInitialized = false;
    var donutData = [
        { value: 0, label: '' },
        { value: 100, label: '' }
    ];

    if (!donutInitialized) {
        donut = Morris.Donut({
            element: 'morris_donut_graph',
            data: donutData,
            resize: true,
            redraw: true,
            backgroundColor: '#ffffff',
            labelColor: '#999999',
            colors: [
                "40-#ff9999-#ff3333:70-#ff3333-#cc0000",
                '#f7f7f7'
            ],
            formatter: function (value, data) {
                // Show the label and percentage for the 'Percentage' part
                if (data.label.includes("Percentage")) {
                    return value + '%';
                }
                return value + '%';
            }
        });
        donutInitialized = true;
    }

    // Function to update the data with animation, adding coin type
    CRYPTONIA_SETTINGS.chartMorris = function(percentage, coinType) {
        coinType = coinType || 'Unknown'; // Default coin type if not provided
        if ($("#morris_donut_graph").length) {
            var startValue = donutData[0].value;
            var endValue = percentage === '-' ? 0 : parseInt(percentage, 10); // Show 0% if percentage is '-'

            function animateDonut(timestamp) {
                if (!animateDonut.startTime) {
                    animateDonut.startTime = timestamp;
                }

                var progress = (timestamp - animateDonut.startTime) / 500; // Animation duration (in seconds)

                if (progress < 1) {
                    var newValue = Math.round(startValue + (endValue - startValue) * progress);
                    donut.setData([
                        { value: newValue, label: coinType },
                        { value: 100 - newValue, label: coinType }
                    ]);
                    requestAnimationFrame(animateDonut);
                } else {
                    // Set the final data and keep it fixed at the desired percentage
                    donutData[0].value = endValue;
                    donutData[1].value = 100 - endValue;
                    donut.setData([
                        { value: endValue, label: coinType },
                        { value: 100 - endValue, label: coinType }
                    ]);
                    animateDonut.startTime = null; // Reset the animation timer
                }
            }

            requestAnimationFrame(animateDonut);
        }
    };

    // Revised code for the click event to include coin type
    $('.data-row').on('click', function() {
        var coinType = $(this).find('td:nth-child(2)').text(); // Get the coin type
        var percentageText = $(this).find('td:last-child').text();
        var percentage = percentageText === '-' ? 0 : parseInt(percentageText, 10); // Convert '-' to 0
        CRYPTONIA_SETTINGS.chartMorris(percentage, coinType);
    });

    // Handle click events on the entire document
    $(document).on('click', function(event) {
        // Check if the click event target is not inside a .data-row
        if (!$(event.target).closest('.data-row').length) {
            // Restore the percentage to 100 and coin type to "Unknown"
            CRYPTONIA_SETTINGS.chartMorris(0, 'Unknown');
        }
    });

    /******************************
     initialize respective scripts 
     *****************************/
    $(document).ready(function() {
        var initialPercentage = 0; // Change this value to your desired initial percentage
        CRYPTONIA_SETTINGS.chartMorris(initialPercentage);
    });

    $(window).resize(function() {
        if (donut) {
            donut.redraw();
        }
    });
});
