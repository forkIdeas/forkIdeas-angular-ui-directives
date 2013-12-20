/*
 * Copyright 2013 forkIdeas.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var fi = {
	directive: {},
	serviceFactory: {},
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

	fiButtonDirective.template = '  <div class="normal-button" tabindex="100" ng-transclude>' +
								 '  </div>';

	return fiButtonDirective;
};

fi.directive.fiMenuBar = function ($window, $rootScope) {
	var fiMenuBarDirective = extend({}, directiveDefaults);

	fiMenuBarDirective.template = '  <div class="menu-bar">' +
								  '    <ul ng-transclude>' +
								  '    </ul>' +
								  '  </div>';

	fiMenuBarDirective.controller = function ($scope, $element, $attrs) {
		var menuItems = [],
			elementId = $element.attr('id');

		this.gotSelected = function (selectedMenuItem) {
			forEach(menuItems, function (menuItem) {
				if (selectedMenuItem != menuItem) {
					menuItem.selectedMenu = false;
				} else {
					menuItem.selectedMenu = true;
				}
			});

			$rootScope.$broadcast('event:menuItemChanged' + (elementId ? '-' + elementId : ''));
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

fi.directive.fiAlertBox = function ($window, fiAlertService) {
	var fiAlertBoxDirective = extend({}, directiveDefaults);

	fiAlertBoxDirective.template = '  <div class="alert-box">' +
								   '    <div class="alert-header">' +
								   '      <i class="fa fa-exclamation-triangle small-icon"></i> <span>Alert Message</span>' +
								   '    </div>' +
								   '    <div class="alert-info">' +
								   '      <div class="message" ng-transclude>' +
								   '      </div>' +
								   '    </div>' +
								   '    <div class="alert-acceptor">' +
								   '      <div fi-button ng-click="done()">OK</div>' +
								   '    </div>' +
								   '  </div>';

	fiAlertBoxDirective.link = function (scope, element, attrs) {
		scope.done = function () {
			fiAlertService.clearAlert(attrs.id);
		};
	};

	return fiAlertBoxDirective;
};

fi.directive.fiHideScreen = function () {
	var fiHideScreenDirective = extend({}, directiveDefaults);

	fiHideScreenDirective.template = '<div class="hide-screen"></div>';

	return fiHideScreenDirective;
}

// Hide Screen Directive's Service.
fi.serviceFactory.fiHideScreenService = function ($window, dynamicViewService) {
	var hideScreenService = {};

	hideScreenService.hideCount = 0;
	hideScreenService.hideScreenFlag = false;

	hideScreenService.hideScreen = function () {
		if (hideScreenService.hideScreenFlag) {
			hideScreenService.hideCount++;
			return;
		}

		var hideScreenElement = '<div id="hideScreen" fi-hide-screen></div>';
		dynamicViewService.createElement(angular.element(hideScreenElement), angular.element($window.document.body));
		hideScreenService.hideScreenFlag = true;
		hideScreenService.hideCount = 1;
	};

	hideScreenService.showScreen = function () {
		if (hideScreenService.hideScreenFlag && hideScreenService.hideCount > 1) {
			hideScreenService.hideCount--;
			return;
		}

		if (hideScreenService.hideScreenFlag) {
			dynamicViewService.removeElementById("hideScreen");
			hideScreenService.hideScreenFlag = false;
			hideScreenService.hideCount = 0;
		}

		return;
	}

	return hideScreenService;
};

// Alert Box Directive's Service.
fi.serviceFactory.fiAlertService = function ($window, md5Service, dynamicViewService, fiHideScreenService) {
	var alertService = {};

	alertService.pendingAlerts = [];
	alertService.alerting = false;

	alertService.alert = function (message) {
		var alertElement,
			uniqueId = md5Service.createHash((new Date()).toString() + ':' + message);

		alertElement = '<div id="' + uniqueId + '" fi-alert-box>' + message + '</div>';
		alertService.pendingAlerts.push({
			id: uniqueId,
			element: alertElement
		});
		alertService.fireAlert();
	};

	alertService.fireAlert = function () {
		if (alertService.pendingAlerts.length === 0 || alertService.alerting)
			return;

		alertService.alerting = true;
		var alertObject = alertService.pendingAlerts.shift();
		fiHideScreenService.hideScreen();
		dynamicViewService.createElement(angular.element(alertObject.element), angular.element($window.document.body));
	};

	alertService.clearAlert = function (id) {
		dynamicViewService.removeElementById(id);
		fiHideScreenService.showScreen();
		alertService.alerting = false;
		alertService.fireAlert();
	};

	return alertService;
};

angular.module('fi', [])
	.directive(fi.directive)
	.factory(fi.serviceFactory);
