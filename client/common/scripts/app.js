/**
 * Created by rohitk on 03-Feb-16.
 */

var app = angular.module('minesweeperApp', ['ui.router']);


app.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/minesweeper-play");
    //
    // Now set up the states
    $stateProvider
        .state('rules', {
            url: "/minesweeper-rules",
            templateUrl: "client/gamerules/minesweeper.html"
        })
        .state('play', {
            url: "/minesweeper-play",
            templateUrl: "client/gameplay/minesweeper.html",
            controller: "gameController"
        })
});