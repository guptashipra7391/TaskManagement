/**
 * Created by ajayguptapnp on 29-04-2017.
 */
var App=angular.module('myApp',['ui.router','ngAria','ngAnimate','ngMessages','ngMaterial','ngDragDrop'])

angular.module('myApp').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'app/components/home/home.html',
            controller:'homeController'
        })



});

