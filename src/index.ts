import {App} from "./App";
import * as ko from 'knockout';
import * as $ from 'jquery';
import 'foundation-sites';

import './index.scss';


declare global {
    interface Window {
        App: App;
    }
}

/**
 * Start the application when all html elements are loaded.
 */
$(function () {
    App.start();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    $(document).foundation();

    $(".nav").off().on("click", function() {
        $('.nav').removeClass("activeNav");
        $(this).addClass("activeNav");
        $('.panel').removeClass("activePanel");
        $('.panel').addClass("hiddenPanel");
        if ($(this).attr("data-target") == "jobsPanel") {
            $(".minigame").removeClass("hiddenPanel");
        } else {
            $(".minigame").addClass("hiddenPanel");
        }
        $(`#${$(this).attr("data-target")}`).addClass("activePanel");
    })

    $(document).keydown(function(event) {

        switch (event.which) {
        case 37: // Key left.
            $("#balanceLeftBtn").click();  
            break;
        case 38: // Key up.
            $("#bugUpBtn").click();     
            break;
        case 39: // Key right.
            $("#balanceRightBtn").click();   
            break;
        case 40: // Key down
            $("#bugDownBtn").click();   
            break;
        }   
    });

    // Expose the App class to the window (and the console)
    if (process.env.DEBUG && typeof window !== undefined) {

        console.log('Exposing App to console');
        window.App = App;
    }


    ko.applyBindings(App.game, document.getElementById('body'));

    console.log("Launched");
});


