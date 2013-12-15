var MainController = function ($scope, $window, $filter) {
	// Button Control
	$scope.Button = {
		buttonClick: function () {
			$window.alert('You Clicked Me!');
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
		$window.alert('Clicked ' + selectedMenuItem.displayName);
	});
}

angular.module('fiApp', ['fi'])
	.controller('MainController', MainController);