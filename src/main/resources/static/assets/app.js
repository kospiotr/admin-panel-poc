var app = angular.module('adminApp', ['ngRoute', 'ngMaterial', 'ngMdIcons']);
app.factory('userDataService', ['$http', function ($http) {
    return {
        getAll: function () {
            return $http.get('rest/user/all');
        },
        getById: function (id) {
            return $http.get('rest/user/' + id);
        },
        getCurrent: function () {
            return $http.get('rest/user/current');
        }
    };
}]);
app.constant('sectionsConfig',
    new Section({
        id: 'app',
        label: 'Administration Panel',
        hash: '/',
        template: '<section ng-repeat="section in sections">' +
        '<md-subheader class="md-primary">{{section.label}}</md-subheader>' +
        '<md-list layout-padding>' +
        '<md-button class="md-raised" ng-repeat="subsection in section.items" ng-click="go(subsection)">' +
        '<md-tooltip ng-show="subsection.description">{{subsection.description}}</md-tooltip>' +
        '{{subsection.label}}' +
        '</md-button>' +
        '</md-list>',
        controller: ['$scope', 'sectionsConfig', function ($scope, sectionsConfig) {
            $scope.sections = sectionsConfig.items;
        }],
        items: [
            new Section({
                label: 'Entitlements',
                hash: '/entitlements',
                items: [
                    new Section({
                        label: 'Entitlements for current user',
                        description: 'View demonstrates displaying data on load from the AJAX Request',
                        hash: '/user_current',
                        template: '' +
                        '<p>Current user is: {{userName}}</p>' +
                        '<p>Entitlements:</p>' +
                        '<p ng-repeat="permission in permissions">- {{permission.name}}</p>',
                        controller: ['$scope', 'userDataService', function ($scope, userDataService) {
                            userDataService.getCurrent().then(function (response) {
                                var data = response.data;
                                $scope.userName = data.name;
                                $scope.permissions = data.permissions;
                            });
                        }]
                    }),
                    new Section({
                        label: 'Entitlements for user',
                        description: 'View demonstrates choosing data from dynamic picker and displaying data from the AJAX Request',
                        hash: '/user',
                        template: '' +
                        '<md-input-container>' +
                        '<md-select placeholder="Select user" ng-model="user" md-on-open="loadUsers()">' +
                        '<md-option ng-value="user" ng-repeat="user in users">{{user.name}}</md-option>' +
                        '</md-select>' +
                        '</md-input-container>' +
                        '<md-button ng-disabled="user == null" ng-click="loadEntitlementsForUser(user)">Process</md-button>' +
                        '<div ng-show="entitlements != null">' +
                        '<p>Entitlements:</p>' +
                        '<p ng-repeat="permission in entitlements">- {{permission.name}}</p>' +
                        '</div>',
                        controller: ['$scope', 'userDataService', function ($scope, userDataService) {
                            $scope.loadUsers = function () {
                                userDataService.getAll().then(function (resp) {
                                    $scope.users = resp.data;
                                });
                            };
                            $scope.loadEntitlementsForUser = function (user) {
                                userDataService.getById(user.id).then(function (resp) {
                                    $scope.entitlements = resp.data.permissions;
                                });
                            }
                        }]
                    })
                ]
            }),
            new Section({
                label: 'Users',
                hash: '/users',
                items: [
                    new Section({
                        label: 'Current user info',
                        description: 'View demonstrates displaying data from the AJAX Request into dialog',
                        hash: '/current_info',
                        template: '<md-button ng-click="showCurrentUserDetails()">Process</md-button>',
                        controller: ['$scope', 'userDataService', '$mdDialog', function ($scope, userDataService, $mdDialog) {
                            $scope.showCurrentUserDetails = function () {
                                userDataService.getCurrent().then(function (resp) {
                                    var data = resp.data;
                                    var dialog = $mdDialog.alert()
                                        .title('Current user info')
                                        .textContent('Id: ' + data.id + ", Name: " + data.name)
                                        .ok('OK');
                                    $mdDialog.show(dialog);
                                });
                            }
                        }]
                    }),
                    new Section({
                        label: 'List all users',
                        description: 'View demonstrates displaying data from the AJAX Request into dialog after confirming request',
                        hash: '/list',
                        template: '<md-button ng-click="process()">Process</md-button>',
                        controller: ['$scope', 'userDataService', '$mdDialog', function ($scope, userDataService, $mdDialog) {
                            $scope.process = function () {
                                var confirm = $mdDialog.confirm()
                                    .title('Heavy processing')
                                    .textContent('Would you like to get information about all Users?')
                                    .ok('OK')
                                    .cancel('Cancel');
                                $mdDialog.show(confirm).then(function () {
                                    userDataService.getAll().then(function (resp) {
                                        var data = resp.data;

                                        var dialog = $mdDialog.alert()
                                            .title('All users JSON')
                                            .textContent(JSON.stringify(data))
                                            .ok('OK');
                                        $mdDialog.show(dialog);
                                    });
                                }, function () {
                                });
                            }
                        }]
                    }),
                    new Section({
                        label: 'Mock',
                        description: 'Mock content',
                        hash: '/mock',
                        template: '<p>Mock content</p>'
                    })
                ]
            }),
            new Section({
                label: 'Accounts',
                hash: '/accounts',
                template: '<p>Accounts</p>',
                items: [
                    new Section({
                        label: 'Mock',
                        description: 'Mock content',
                        hash: '/mock',
                        template: '<p>Mock content</p>'
                    }),
                    new Section({
                        label: 'Mock',
                        description: 'Mock content',
                        hash: '/mock',
                        template: '<p>Mock content</p>'
                    })
                ]
            })
        ]
    })
);
app.constant('viewDecorator', {
        asCard: function (template, config) {
            var header = '<md-card-header>' +
                '<md-card-header-text>' +
                (config && config.label ? '<span class="md-title">' + config.label + '</span>' : '') +
                (config && config.description ? '<span class="md-subhead">' + config.description + '</span>' : '' ) +
                '</md-card-header-text>' +
                '</md-card-header>' +
                '<md-divider></md-divider>';

            var content = '<md-card-content>' + template + '</md-card-content>';
            var actions = (config && config.actions ? '<md-card-actions>' + config.actions + '</md-card-actions>' : '');
            return '<ui-view layout="column" flex md-scroll-y layout-padding style="background-color: #eeeeee">' +
                '<md-card>' + header + content + actions + '</md-card>' +
                '</ui-view>';
        }
    }
);
app.config(['$routeProvider', 'sectionsConfig', 'viewDecorator',
    function ($routeProvider, sectionsConfig, viewDecorator) {
        function sectionToRoute(section) {
            var config = {};
            angular.merge(config, section);
            config.template = viewDecorator.asCard(config.template, config);
            $routeProvider.when(section.path, config);
        }

        angular.forEach(sectionsConfig.getFlatItemList(), sectionToRoute);
        $routeProvider.when('/search', {
            template: viewDecorator.asCard('<section ng-repeat="section in sections">' +
                '<md-subheader class="md-primary">{{section.label}}</md-subheader>' +
                '<md-list layout-padding>' +
                '<md-button class="md-raised" ng-repeat="subsection in section.items | filter: phrase" ng-click="go(subsection)">' +
                '<md-tooltip ng-show="subsection.description">{{subsection.description}}</md-tooltip>' +
                '{{subsection.label}}' +
                '</md-button>' +
                '</md-list>', {label: 'Search results', description: 'For phrase: "{{phrase}}"'}),
            controller: ['$scope', '$routeParams', '$rootScope', function ($scope, $routeParams, $rootScope) {
                $scope.phrase = $routeParams.phrase || '';
                $rootScope.searchPhrase = $scope.phrase;
                $rootScope.showSearch = true;

            }]
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }]
);
app.controller('appController', ['$scope', '$location', 'sectionsConfig', '$rootScope', function ($scope, $location, sectionsConfig, $rootScope) {
    $scope.app = sectionsConfig;
    $scope.sections = sectionsConfig.items;
    $scope.go = function (section) {
        $location.url(section.path);
    };
    $scope.doSearch = function () {
        var phrase = $rootScope.searchPhrase;
        $location.path('/search').search({phrase: phrase});
    }
}]);

function Section(args) {
    var me = this;
    angular.merge(me, args);
    this.toString = function () {
        return this.id;
    };

    this.setPath = function (path) {
        var me = this;
        me.path = path;
        angular.forEach(me.items, function (item) {
            var newVar = me.path + item.hash;
            var path2 = (newVar).replace(/\/\//g, '\/');
            item.setPath(path2);
        });
    };

    this.getFlatItemList = function () {
        var out = [this];
        angular.forEach(this.items, function (item) {
            out = out.concat(item.getFlatItemList());
        });
        return out;
    };

    //init
    this.setPath(me.hash);

}
