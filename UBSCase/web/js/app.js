var app = angular.module("UBSCase", ['ui.router', 'ngCookies', 'ui.bootstrap']);


// For Application Routing
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/UBSCase/");
    $locationProvider.html5Mode(true);
    $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                controller: 'DashboardController',
                templateUrl: 'js/views/dashboard.html',
                data: {
                    requireLogin: true
                }
            })
            .state('register', {
                url: '/register',
                controller: "RegistrationController",
                templateUrl: "js/views/register.html",
                data: {
                    requireLogin: false
                }
            })
            .state('portfolio', {
                url: '/portfolio',
                controller: 'DashboardController',
                templateUrl: "js/views/portfolio.html",
                data: {
                    requireLogin: false
                }
            })
            .state('/UBSCase/', {
                url: '/',
                controller: "LoginController",
                templateUrl: "js/views/login.html",
                data: {
                    requireLogin: false
                }
            })
            .state('/logout', {
                url: '/',
                controller: "LoginController",
                templateUrl: "js/views/login.html",
                data: {
                    requireLogin: false
                }
            });

});


// For managing state changes
app.run(function ($rootScope, $location, $cookieStore) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        //var isRefreshed = typeof $rootScope.currentUser === 'undefined';
        //console.log("logging cookie!" + $cookieStore.get("user"));
        var isLoggedIn = typeof $cookieStore.get("user") !== 'undefined';
        //console.log("is logged in at 60?" + isLoggedIn);
        if (requireLogin && !isLoggedIn) {
            //console.log("line 63");
            event.preventDefault();
            // get me a login modal!
            $location.path("/");
        } else if (!requireLogin) {
            //console.log(toState.data.url);
            //console.log("is logged in at 69?" +isLoggedIn);
            if (toState.data.url === '/logout') {
                //console.log("Resetting rootScope user");

            } else if (isLoggedIn && toState.url === '/') {
                //console.log(isLoggedIn + " at 73");\
                $rootScope.setCurrentUser($cookieStore.get("user"));
                $location.path("dashboard");
            }
        }
    });

});

// for CSRF
app.config(function ($httpProvider) {
    //fancy random token
    function b(a) {
        return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e16] + 1e16).replace(/[01]/g, b)
    }
    ;

    $httpProvider.interceptors.push(function () {
        return {
            'request': function (config) {
                // put a new random secret into our CSRF-TOKEN Cookie after each response
                document.cookie = 'CSRF-TOKEN=' + b();
                return config;
            }
        };
    });
});

app.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    editor: 'editor',
    guest: 'guest'
});

app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});

app.directive('performanceChart', function () {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        link: function (scope, element, attrs) {
            console.log(2);
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    zoomType: 'x'
                },
                title: {
                    text: 'My Portfolio Performance'
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats:
                            {
                                day: '%e. %b',
                                month: '%b \ %y',
                                year: '%Y'
                            }
                },
                yAxis: {
                    title: {
                        text: 'Value in USD'
                    }
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<i>' + Highcharts.dateFormat('%b %Y', new Date(this.x)) + '</i><br/>' +
                                '<b>' + this.series.name + '</b>:' + (this.y / 1000000).toFixed(2) + 'M';
                    }
                },
                series: [{
                        type: 'area',
                        name: 'Value',
                        data: scope.data
                    }]
            });
            scope.$watch('data', function (newValue) {
                chart.series[0].setData(newValue, true);
            }, true);
        },
        template: '<div id="container">Error</div>'
    };
});


