var fi = {
	controller: {},
	directive: {},
	serviceFactory: {},
	filter: {}
};

var extend = angular.extend,
	forEach = angular.forEach,
	directiveDefaults = {
		restrict: 'EA',
		replace: true,
		scope: true,
		transclude: true
	};

fi.directive.fiButton = function () {
	var fiButtonDirective = extend({}, directiveDefaults);

	fiButtonDirective.template = '  <div class="normal-button" ng-transclude>' +
								 '  </div>';

	return fiButtonDirective;
};

fi.directive.fiMenuBar = function ($window) {
	var fiMenuBarDirective = extend({}, directiveDefaults);

	fiMenuBarDirective.template = '  <div class="menu-bar">' +
								  '    <ul ng-transclude>' +
								  '    </ul>' +
								  '  </div>';

	fiMenuBarDirective.controller = function () {
		var menuItems = [];

		this.gotSelected = function (selectedMenuItem) {
			forEach(menuItems, function (menuItem) {
				if (selectedMenuItem != menuItem) {
					menuItem.selectedMenu = false;
				} else {
					menuItem.selectedMenu = true;
				}
			});
		};

		this.addMenuItem = function (menuItem) {
			menuItems.push(menuItem);
		};
	};

	return fiMenuBarDirective;
};

fi.directive.fiMenuItem = function ($window) {
	var fiMenuItemDirective = extend({}, directiveDefaults);

	fiMenuItemDirective.require = '^?fiMenuBar';
	fiMenuItemDirective.scope = {
		menuItem: '=menuItem'
	};
	fiMenuItemDirective.template = '  <li class="menu-item" ng-click="selectMenuItem()" ng-transclude>' +
								   '  </li>';

	fiMenuItemDirective.link = function (scope, element, attrs, fiMenuBarController) {
		fiMenuBarController.addMenuItem(scope.menuItem);

		if (attrs.menuItemSeperator !== undefined) {
			element.addClass('menu-item-seperator');
		}

		scope.selectMenuItem = function () {
			fiMenuBarController.gotSelected(scope.menuItem);
		};
	};

	return fiMenuItemDirective;
};

angular.module('fi', [])
	.directive(fi.directive);