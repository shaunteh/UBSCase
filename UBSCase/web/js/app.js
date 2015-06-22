var app = angular.module("UBSCase", ['ui.router', 'ngCookies']);


// For Application Routing
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(true);
    console.log("Here");
    $stateProvider
            .state('/dashboard', {
                url: "/UBSCase/dashboard",
                controller: 'DashboardController',
                templateUrl: 'js/views/dashboard.html',
                data: {
                    requireLogin: true
                }
            })
            .state('/', {
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
        var isRefreshed = typeof $rootScope.currentUser === 'undefined';
        console.log("logging cookie!" + $cookieStore.get("user"));
        var isLoggedIn = $cookieStore.get("user") !== undefined;
        console.log(isRefreshed);

        if (isRefreshed && isLoggedIn) {
            console.log("Adding cookie details!");
            $rootScope.setCurrentUser($cookieStore.get("user"));
        }

        console.log($rootScope.currentUser);
        console.log($rootScope.currentUser === 'undefined');

        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
            event.preventDefault();
            // get me a login modal!
            console.log("redirected here");
            $location.path("/UBSCase");
        }
    });

});

// for CSRF
app.config(function($httpProvider) {
    //fancy random token
    function b(a) {
        return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e16] + 1e16).replace(/[01]/g, b)
    };

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




