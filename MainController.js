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
				title: 'Event 1',
				summary: 'Summary 1',
				body: 'Body 1'
			},
			{
				title: 'Event 2',
				summary: 'Summary 2',
				body: 'Body 2'
			},
			{
				title: 'Event 3',
				summary: 'Summary 3',
				body: 'Body 3'
			}
		]
	};

	$scope.Candidate = {
		firstName: "Jayaprakash",
		lastName: "Harikrishnan",
		sex: "Male",
		currentPosition: "Senior Software Engineer",
		currentCompany: "Athenahealth",
		currentLocation: "Chennai",
		email: "prakashjp.h@gmail.com",
		phone: "9677709330",
		educationHistory: [
			{
				degree: "B.Tech (Information Technology)",
				school: "Government College of Technology",
				location: "Coimbatore",
				startDate: "July, 2006",
				endDate: "May, 2010"
			},
			{
				degree: "HSC",
				school: "Vellayan Chettiyar Higher Secondary School",
				location: "Thiruvotriyur",
				startDate: "June, 2004",
				endDate: "April, 2006"
			},
			{
				degree: "SSLC",
				school: "Government Higher Secondary School",
				location: "Sunnambukulam",
				startDate: "June, 2003",
				endDate: "April, 2004"
			}
		],
		workHistory: [
			{
				position: "Senior Software Engineer",
				company: "Athenahealth",
				location: "Chennai",
				startDate: "March 2013",
				endDate: "To Date"
			},
			{
				position: "Software Engineer",
				company: "Athenahealth",
				location: "Chennai",
				startDate: "April, 2012",
				endDate: "February, 2013"
			},
			{
				position: "Programmer",
				company: "Athenahealth",
				location: "Chennai",
				startDate: "November, 2010",
				endDate: "March, 2012"
			}
		],
		skills: [
			{
				name: "Javascript"
			},
			{
				name: "HTML5"
			},
			{
				name: "CSS3"
			},
			{
				name: "Core Java"
			},
			{
				name: "Struts 2"
			},
			{
				name: "Perl"
			},
			{
				name: "Algorithms"
			}
		],
		projects: [
			{
				name: "TndRX",
				description: "File Search Utility for linux. It indexes the files as well as watch for the changes in filesystem."
			},
			{
				name: "Online Programming Judge",
				description: "Programming judge for the online programming competition conducted in the symposium 'Infoquest'."
			},
			{
				name: "Campus Recruitement Tool",
				description: "Tool developed for campus recruitement in Athenahealth. It includes coding module which is used to auto evaluate the programming round."
			},
			{
				name: "GitB",
				description: "Tool developed to access Git repositories via browser."
			},
		],
		events: {
			Items: [
				{
					title: 'Coimbatore Campus Interview - 2010',
					body: 'Cleared 0 round(s).'
				},
				{
					title: 'Walk-In Interview - 2010',
					body: 'Cleared all rounds and joined Athenahealth in November 9, 2010.'
				}
			]
		},
		summary: "A complete summary about the candidate."
	};
}

angular.module('fiApp', ['fi'])
	.controller('MainController', MainController);