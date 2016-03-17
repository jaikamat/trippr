var app = angular.module('trippr', ["ui.router"]);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider

  .state("home", {
    url: "/",
    templateUrl: "/frontend/states/home.state.html"
  })

  .state("trip", {
  url: "/trip",
  templateUrl: "/frontend/states/trip.state.html",
  controller: "MapController"
  })

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
})