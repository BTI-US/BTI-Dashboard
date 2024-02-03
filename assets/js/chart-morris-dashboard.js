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
        { value: 0, label: 'Dogecoin' },
        { value: 100, label: 'Others' }
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
            ]
        });
        donutInitialized = true;
    }

    // Function to update the data with animation
    CRYPTONIA_SETTINGS.chartMorris = function(percentage) {
        if ($("#morris_donut_graph").length) {
            if (percentage === 100) {
                // If the desired percentage is 100%, set the final data without animation
                donutData[0].value = percentage;
                donutData[1].value = 0;
                donut.setData(donutData
                     );
            } else {
                var startValue = donutData[0].value;
                var endValue = percentage;

                function animateDonut(timestamp) {
                    if (!animateDonut.startTime) {
                        animateDonut.startTime = timestamp;
                    }

                    var progress = (timestamp - animateDonut.startTime) / 500; // Animation duration (in seconds)

                    if (progress < 1) {
                        var newValue = Math.round(startValue + (endValue - startValue) * progress);
                        donut.setData([
                            { value: newValue, label: 'Dogecoin' },
                            { value: 100 - newValue, label: 'Dogecoin' }
                        ]);
                        requestAnimationFrame(animateDonut);
                    } else {
                        // Set the final data and keep it fixed at the desired percentage
                        donutData[0].value = endValue;
                        donutData[1].value = 100 - endValue;
                        donut.setData(donutData);
                    }
                }

                requestAnimationFrame(animateDonut);
            }
        }
    };


    // Additional code for the mouseover event
    $('.data-row').on('mouseover', function() {
        var percentageText = $(this).find('td:last-child').text();
        var percentage = parseInt(percentageText, 10);
        CRYPTONIA_SETTINGS.chartMorris(percentage);
    });

    // Reset the chart when the mouse leaves the row
    $('.data-row').on('mouseleave', function() {
        CRYPTONIA_SETTINGS.chartMorris(0); // Reset to 0%
    });

    /******************************
     initialize respective scripts 
     *****************************/
    $(document).ready(function() {
        // Specify the initial percentage value
        var initialPercentage = 0; // Change this value to your desired initial percentage
        CRYPTONIA_SETTINGS.chartMorris(initialPercentage);
    });

    $(window).resize(function() {
        // Handle window resize events if needed
    });

    $(window).load(function() {
        // Handle window load events if needed
    });

});
