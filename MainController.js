var MainController = function ($scope, $window) {
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
}

angular.module('fiApp', ['fi'])
	.controller('MainController', MainController);