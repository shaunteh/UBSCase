var app = angular.module("UBSCase", ['ui.router', 'ngCookies']);


// For Application Routing
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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
app.run(function($rootScope, $location, $cookieStore) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
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
                
            } else if (isLoggedIn) {
                //console.log(isLoggedIn + " at 73");
                $rootScope.setCurrentUser($cookieStore.get("user"));
                $location.path("dashboard");
            }
        }
    });

});

// for CSRF
app.config(function($httpProvider) {
    //fancy random token
    function b(a) {
        return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e16] + 1e16).replace(/[01]/g, b)
    }
    ;

    $httpProvider.interceptors.push(function() {
        return {
            'request': function(config) {
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




