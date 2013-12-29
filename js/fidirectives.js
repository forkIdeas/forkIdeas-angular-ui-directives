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
	serviceFactory: {}
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

fi.directive.fiAccordion = function ($window, $rootScope) {
	var fiAccordionDirective = extend({}, directiveDefaults);

	fiAccordionDirective.scope = {
		accordionType: '@accordionType'
	};

	fiAccordionDirective.template = '  <div class="accordion" ng-transclude>' +
									'  </div>';

	fiAccordionDirective.link = function (scope, element, attrs) {
		if (scope.accordionType === 'vertical') {
			element.addClass('vertical');
		} else {
			element.addClass('horizontal');
		}
	};

	fiAccordionDirective.controller = function ($scope, $element, $attrs) {
		var accordionItems = [],
			elementId = $element.attr('id');

		this.gotSelected = function (selectedAccordionItem) {
			forEach(accordionItems, function (accordionItem) {
				if (selectedAccordionItem != accordionItem) {
					accordionItem.selectedItem = false;
				}
			});

			$rootScope.$broadcast('event:accordionItemChanged' + (elementId ? '-' + elementId : ''));
		};

		this.addAccordionItem = function (accordionItem) {
			accordionItems.push(accordionItem);
		};
	};

	return fiAccordionDirective;
};

fi.directive.fiAccordionItem = function ($window, $compile) {
	var fiAccordionItemDirective = extend({}, directiveDefaults);

	fiAccordionItemDirective.require = '^?fiAccordion';
	fiAccordionItemDirective.scope = {
		title: '=accordionTitle',
		accordionItem: '=accordionItem'
	};

	fiAccordionItemDirective.template = '  <div class="accordion-item">' +
										'    <div class="accordion-item-head" ng-click="selectAccordionItem()">' +
										'      <div class="accordion-item-title" ng-class="{ expanded: accordionItem.selectedItem }">' +
										'        <span>{{ title }}</span>' +
										'      </div>' + 
										'      <div class="accordion-item-summary-view" ng-show="hasSummary">' +
										'      </div>' +
										'    </div>' +
										'    <div class="accordion-item-body" ng-show="accordionItem.selectedItem">' +
										'    </div>' +
										'    <span ng-transclude class="ng-hide">' +
										'    </span>' +
										'  </div>';

	fiAccordionItemDirective.link = function (scope, element, attrs, fiAccordionController) {
		var transcludedElements = element.find("span").children();
		var includedSummary = false;

		scope.hasSummary = false;
		scope.accordionItem.selectedItem = false;

		forEach(transcludedElements, function (transcludedElement) {
			transcludedElement = angular.element(transcludedElement);

			if (transcludedElement.hasClass("accordion-item-summary") && !includedSummary) {
				scope.hasSummary = true;
				includedSummary = true;
				var itemSummaryViewElement = angular.element(angular.element(element.children()[0]).children()[1]);
				itemSummaryViewElement.append(transcludedElement);
			} else if (!transcludedElement.hasClass("accordion-item-summary")) {
				var itemBodyElement = angular.element(element.children()[1]);
				itemBodyElement.append(transcludedElement);
			}
		});

		fiAccordionController.addAccordionItem(scope.accordionItem);

		scope.selectAccordionItem = function () {
			fiAccordionController.gotSelected(scope.accordionItem);
			scope.accordionItem.selectedItem = !scope.accordionItem.selectedItem;
		};
	};

	return fiAccordionItemDirective;
};

fi.directive.fiAccordionItemSummary = function ($window) {
	var fiAccordionItemSummaryDirective = extend({}, directiveDefaults);

	fiAccordionItemSummaryDirective.require = '^?fiAccordionItem';
	fiAccordionItemSummaryDirective.template = '  <div class="accordion-item-summary" ng-transclude>' +
											   '  </div>';

	return fiAccordionItemSummaryDirective;
};

fi.directive.fiViewBox = function () {
	var fiViewBoxDirective = extend({}, directiveDefaults);

	fiViewBoxDirective.scope = {
		height: '@boxHeight'
	};
	fiViewBoxDirective.template = '  <div class="view-box rounded-border shadow" ng-transclude>' +
								  '  </div>';

	fiViewBoxDirective.link = function (scope, element, attrs) {
		scope.height = scope.height ? scope.height : "auto";
		element.css("height", scope.height);
	}

	return fiViewBoxDirective;
};

fi.directive.fiUserImage = function () {
	var fiUserImageDirective = extend({}, directiveDefaults);

	fiUserImageDirective.scope = {
		imageURL: '@userImageUrl'
	};

	fiUserImageDirective.template = '  <div class="user-image">' +
									'    <div fi-view-box box-width="150px" box-height="150px">' +
									'      <div ng-show="hasImage">' +
									'        <img src="" width="150px" height="150px" />' +
									'      </div>' +
									'      <div ng-hide="hasImage">' +
									'        <i class="fa fa-user" style="font-size: 150px; color: #999999; padding-left: 16px; padding-right: 16px;"></i>' +
									'      </div>' +
									'    </div>' +
									'  </div>';

	fiUserImageDirective.link = function (scope, element, attrs) {
		scope.hasImage = (scope.imageURL ? true : false);
	};

	return fiUserImageDirective;
};

fi.directive.fiEmail = function () {
	var fiEmailDirective = extend({}, directiveDefaults);

	fiEmailDirective.template = '  <div>' +
								'    <i class="fa fa-envelope"></i> <span ng-transclude></span>' +
								'  </div>';

	return fiEmailDirective;
};

fi.directive.fiPhone = function () {
	var fiPhoneDirective = extend({}, directiveDefaults);

	fiPhoneDirective.template = '  <div>' +
								'    <i class="fa fa-phone"></i> <span ng-transclude></span>' +
								'  </div>';

	return fiPhoneDirective;
};

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
