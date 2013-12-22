var MainController = function ($scope, $filter, fiAlertService) {
	// Button Control
	$scope.Button = {
		buttonClick: function () {
			fiAlertService.alert('You Clicked Me!');
		}
	};

	// Menu Bar Control
	$scope.MenuBar = {
		menuItems: [
			{
				displayName: 'Home',
				selectedMenu: true
			},
			{
				displayName: 'Docs'
			},
			{
				displayName: 'About'
			}
		]
	};

	$scope.$on('event:menuItemChanged', function () {
		var selectedMenuItem = $filter('filter')($scope.MenuBar.menuItems, { selectedMenu: true })[0];
		fiAlertService.alert('Clicked ' + selectedMenuItem.displayName);
	});

	// Alert Control
	$scope.Alert = {
		buttonClick: function () {
			fiAlertService.alert("You are alerted!");
		}
	};

	$scope.Accordion = {};

	$scope.Accordion.Vertical = {
		Items: [
			{
				title: 'Title 1',
				summary: 'Summary 1',
				body: 'Body 1'
			},
			{
				title: 'Title 2',
				summary: 'Summary 2',
				body: 'Body 2'
			},
			{
				title: 'Title 3',
				summary: 'Summary 3',
				body: 'Body 3'
			}
		]
	};
}

angular.module('fiApp', ['fi'])
	.controller('MainController', MainController);