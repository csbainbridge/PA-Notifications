
// Select and Add Notification modules declarations
// @dependancies: ngCookies and ngMaterial
var selectNotification = angular.module('selectNotification', ['ngCookies', 'ngMaterial']);
var addNotification = angular.module('addNotification', ['ngCookies', 'ngMaterial']);

// Notification Type Service is used for storing and passing an Array of single or multiple notification types between controllers within the Select Notification application.
selectNotification.service('notificationTypesService', function() {
	var notificationTypes;
	var setNotificationTypeData = function(data) {
		notificationTypes = data;
	};
	var getNotificationTypeData = function() {
		return notificationTypes;
	};
	return {
		setNotificationTypeData: setNotificationTypeData,
		getNotificationTypeData: getNotificationTypeData

	};
});

// Notifications Service is used for storing and passing an Array of single or multiple notifications between controllers within the Select Notification application.
selectNotification.service('notificationsService', function() {
	var notifications;
	var setNotifications = function(data) {
		notifications = data;
	};
	var getNotifications = function() {
		return notifications;
	};
	return {
		setNotifications: setNotifications,
		getNotifications: getNotifications
	};
});

// Notification Service is used for storing and passing data related to a specific notification between controllers within the Select Notification application.
selectNotification.service('notificationService', function() {
	var departmentId;
	var notificationTitle;
	var subject;
	var notification;
	var id;
	var contacts = [];
	var notificationType;

	var setDepartmentId = function(data) {
		departmentId = data;
	};
	var getDepartmentId = function() {
		return departmentId;
	}
	var setNotificationTitle = function(data) {
		notificationTitle = data;
	};
	var getNotificationTitle = function() {
		return notificationTitle;
	};
	var setSubject = function(data) {
		subject = data;
	};
	var getSubject = function() {
		return subject;
	};
	var setNotification = function(data) {
		notification = data;
	};
	var getNotification = function() {
		return notification;
	};
	var setId = function(data) {
		id = data;
	};
	var getId = function() {
		return id;
	};
	var setContacts = function(data) {
		contacts = data;
	};
	var getContacts = function() {
		return contacts;
	};
	var setNotificationType = function(data) {
		notificationType = data;
	};
	var getNotificationType = function() {
		return notificationType;
	};
	return {
		setDepartmentId: setDepartmentId,
		getDepartmentId: getDepartmentId,
		setNotificationTitle: setNotificationTitle,
		getNotificationTitle: getNotificationTitle,
		setSubject: setSubject,
		getSubject: getSubject,
		setNotification: setNotification,
		getNotification: getNotification,
		setId: setId,
		getId: getId,
		setContacts: setContacts,
		getContacts: getContacts,
		setNotificationType: setNotificationType,
		getNotificationType: getNotificationType
	};
});

// Select Department Controller handles the change event on the Select Department input. The $http service is then used to get all of the Notification Types stored within the Notification Types model related to the Selected Department and uses these to populate the Notification Type select input.
selectNotification.controller('selectDepartmentCtlr', ['$scope', '$rootScope', '$http', 'notificationTypesService', 'notificationService',
	function($scope, $rootScope, $http, notificationTypesService, notificationService) {
		$rootScope.$on("setUpdateId", function() {
			$scope.setUpdateId();
		});
		$scope.setUpdateId = function() {
			var id = notificationService.getId();
			$scope.updateId = id;
		}
		$scope.getNotificationType = function() {
			var id = $scope.selectedDepartment;
			var notificationTypes = [];
			// notificationService.setDepartmentId(id);
			$http({
			  	method : "GET",
			  	url : "department/" + id
			  }).then(function success(response) {
					notificationTypesService.setNotificationTypeData(response.data);
					if (!response.data.length) {
						$scope.typesNotFound = "No related 'Notification Types' were found. Please select a different 'Department'.";
						$scope.notificationTypes = [];
					} else {
						$scope.typesNotFound = "";
						// USE THIS IF KEIRON WANTS CS TO HAVE ACCESS TO OPERATIONAL ADVISORIES
						// notificationService.setDepartmentId(response.data[0].fields.department[0]);
						console.log(response.data);
						$scope.notificationTypes = notificationTypesService.getNotificationTypeData();
						$rootScope.$emit("clearFormFields", {});
					}
			  }, function error(response) {
			  		var errorMessage = "Oops it looks like something went wrong. Please try again.";
			  		console.log(errorMessage)
			});
		};
	}
]);

// Select Notification Type Controller handles the change event on Select Notification Type select input. The $http service is then used to get all of the notifications stored within the Notification model and uses these to populate the Notifications Select input.
selectNotification.controller('selectNotificationTypeCtlr', ['$scope', '$rootScope', '$http', 'notificationTypesService', 'notificationsService', 'notificationService',
	function($scope, $rootScope, $http, notificationTypesService, notificationsService, notificationService) {
		$scope.getNotifications = function() {
			$rootScope.$emit("clearFormFields", {});
			$scope.notificationsNotFound = "";
			var id = $scope.selectedNotificationType;
			notificationTypes = notificationTypesService.getNotificationTypeData();
			angular.forEach(notificationTypes, function(notificationType, key) {
				if (notificationType.pk == id) {
					notificationService.setNotificationType(notificationType);
					angular.forEach(notificationType.fields.department, function(departmentId, key) {
						if (departmentId === 7) {
							notificationService.setDepartmentId(departmentId);
						} else {
							notificationService.setDepartmentId(departmentId);
						}
					});
				}
			});
			var notifications = [];
			$http({
				method : "GET",
				url : "notificationtype/" + id
			}).then(function success(response) {
				notificationsService.setNotifications(response.data);
				if (!response.data.length) {
					$scope.notficiationsNotFound = "No related 'Notifications' were found. Please select a different 'Notification Type'.";
					$scope.notifications = [];
				} else {
					$scope.notficiationsNotFound = "";
					$scope.notifications = notificationsService.getNotifications();
				}
			}, function error(response) {
					var errorMessage = "Oops it looks like something went wrong. Please try again.";
				// $scope.notifications = "";
				console.log(errorMessage);
			});
		};
}]);

// Select Notification Controller handles change event on Select Notification select input, it sets the values of Id, Subject, Notification and Contacts within the Notification Service to the values within the Notification object is equal to the ID of the selected Notification in the Select Notification input.
// This then calls the parent function within the Display Notification Controller using the $emit service on the $rootScope of the Select Notification Application.
selectNotification.controller('selectNotificationCtlr', ['$scope', '$rootScope', '$http', 'notificationsService', 'notificationService',
	function($scope, $rootScope, $http, notificationsService, notificationService) {
		// Used by scrollOnChange directive to get the target scroll location.
		$scope.toElement = function() {
			return angular.element(document.querySelector('.sub-button-container'));
		}

		$scope.fromElement = function() {
			return angular.element(document.querySelector('.notifications-card'));
		}
		
		$scope.getNotification = function() {
			var id = $scope.selectedNotification;
			notificationData = notificationsService.getNotifications();
			angular.forEach(notificationData, function(notification, key) {
				if (notification.pk == id && notification.pk != null) {
					//notificationService.setDepartment(notification.fields.)
					notificationService.setNotificationTitle(notification.fields.notification_title);
					notificationService.setSubject(notification.fields.notification_subject);
					notificationService.setNotification(notification.fields.notification_body);
					notificationService.setId(notification.pk);
					notificationService.setContacts(notification.fields.notification_contacts);
				}
			});
			$rootScope.$emit("showNotification", {});
		}
	}
]);

// Display Notification controller declares $scope models which are used to display the Notification Contacts, Subject and Body. This controller gets the values of Id, Subject, Notification and Contacts stored within the Notification Service.
// The $http service is then used to get all of the contacts stored within the Contacts model and uses these to populate the multiple select input.
selectNotification.controller('displayNotification', ['$scope', '$rootScope', '$http', 'notificationService',
	function($scope, $rootScope, $http, notificationService) {
		$scope.carbonCopyType = "Select Contacts"
		$rootScope.$on("showNotification", function() {
			$scope.showNotification();
		});
		$rootScope.$on("clearFormFields", function() {
			$scope.clearFormFields();
		});
		$scope.clearFormFields = function() {
			notificationService.setContacts($scope.selectedContacts = "");
			notificationService.setSubject($scope.subject = "");
			notificationService.setNotification($scope.body = "");
			notificationService.setId("");
			$rootScope.$emit("disableGenerateMailbtn", {});
			$rootScope.$emit("disableDeleteBtn", {});
			$rootScope.$emit("disableUpdateBtn", {});
		}
		$scope.showNotification = function() {
			console.log(notificationService.getDepartmentId());
			if (notificationService.getDepartmentId() == 7 || notificationService.getDepartmentId() == 8) {
				$scope.carbonCopyType = "Select BCC Contacts";
			} 
			else {
				$scope.carbonCopyType = "Select CC Contacts";
			}
			var id = notificationService.getId();
			var notificationContacts = notificationService.getContacts();
			var subject = notificationService.getSubject();
			var notification = notificationService.getNotification();
			//$scope.related = {};
			// ng-model - array representing selected contacts
			$scope.selectedContacts = notificationContacts;
			$scope.subject = subject;
			$scope.body = notification;
			if (!id) {
				$rootScope.$emit("disableGenerateMailbtn");
				$rootScope.$emit("disableDeleteBtn");
				$rootScope.$emit("disableUpdateBtn");
			} else {
   			$rootScope.$emit("enableGenerateMailbtn", {});
				$rootScope.$emit("enableDeleteBtn", {});
				$rootScope.$emit("enableUpdateBtn")
			}
			$http({
				method: "GET",
				url : "contacts/"
			}).then(function sucesss(response){
				$scope.contacts = response.data;
			}, function error(response) {
				var errorMessage = "Oops it looks like something went wrong. Please try again.";
				console.log(errorMessage);
			});
			$rootScope.$emit("setDeleteId", {});
			$rootScope.$emit("setUpdateId", {});
		}
		$scope.updateSelectedContacts = function() {
			notificationService.setContacts($scope.selectedContacts);
		}
		$scope.updateSubject = function() {
			notificationService.setSubject($scope.subject);
		}
		$scope.updateNotificationBody = function() {
			notificationService.setNotification($scope.body);
		}
	}
]);

// Notification Actions controllers handles user interactions with the UI components Delete, Update and Generate within the application.
// Uses @$mdDialog service from @ngMaterial dependency for dialog prompts which are displayed following user interaction with the UI components within this controller.
// Further improvements use a single dialog and pass title and text contents for the dialog as parameters. Use data binding to set the ng-click attribute dynamically based on the user action.
selectNotification.controller('notificationActions', ['$scope', '$rootScope', 'notificationService', '$mdDialog',
	function($scope, $rootScope, notificationService, $mdDialog) {
		$scope.generateMailBtnStatus = true;
		$scope.deleteBtnStatus = true;
		$scope.updateBtnStatus = true;
		$rootScope.$on("setDeleteId", function() {
			$scope.setDeleteId();
		});
		$rootScope.$on("enableDeleteBtn", function() {
			$scope.enableDeleteBtn();
		});
		$rootScope.$on("disableDeleteBtn", function() {
			$scope.disableDeleteBtn();
		});
		$rootScope.$on("enableUpdateBtn", function() {
			$scope.enableUpdateBtn();
		});
		$rootScope.$on("disableUpdateBtn", function() {
			$scope.disableUpdateBtn();
		});
		$rootScope.$on("enableGenerateMailbtn", function() {
			$scope.enableGenerateMailbtn();
		});
		$rootScope.$on("disableGenerateMailbtn", function(){
			$scope.disableGenerateMailbtn();
		});
		$rootScope.$on("showSuccessDialog", function(){
			$scope.showSuccessDialog();
		});
		$rootScope.$on("showErrorDialog", function(){
			$scope.showErrorDialog();
		});
		$scope.enableDeleteBtn = function() {
			$scope.deleteBtnStatus = false;
		}
		$scope.disableDeleteBtn = function() {
			$scope.deleteBtnStatus = true;
		}
		$scope.enableUpdateBtn = function() {
			$scope.updateBtnStatus = false;
		}
		$scope.disableUpdateBtn = function() {
			$scope.updateBtnStatus = true;
		}
		$scope.enableGenerateMailbtn = function() {
			$scope.generateMailBtnStatus = false;
		}
		$scope.disableGenerateMailbtn = function() {
			$scope.generateMailBtnStatus = true;
		}
		$scope.setDeleteId = function() {
			var id = notificationService.getId();
			var notificationTitle = notificationService.getNotificationTitle();
			$scope.notificationTitle = notificationTitle;
			if (id != "") {
				$scope.deleteId = "delete/" + id;
			} else {
				$scope.deleteId = "";
			}
		}
		$scope.updateNotificationClick = function() {
			$scope.closeDeleteDialog();
			$rootScope.$emit("updateNotification", {});
		}
		$scope.showMailDialog = function() {
			$mdDialog.show({
				contentElement: '#generateMailDialog',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
		}
		$scope.confirmGenerateClick = function() {
			$mdDialog.hide();
			$rootScope.$emit("generateEmail", {});
		}
		$scope.showDeleteDialog = function() {
			$mdDialog.show({
				contentElement: '#deleteDialog',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
		}
		$scope.closeDeleteDialog = function() {
			$mdDialog.hide();
		}
		$scope.showUpdateDialog = function() {
			$mdDialog.show({
				contentElement: '#updateDialog',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
		}
		$scope.closeUpdateDialog = function() {
			$mdDialog.hide();
		}
		$scope.showSuccessDialog = function() {
			$mdDialog.show({
				contentElement: '#successDialog',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
		}
		$scope.closeSuccessDialog = function() {
			$mdDialog.hide();
		}
		$scope.showErrorDialog = function() {
			$mdDialog.show({
				contentElement: '#errorDialog',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
		}
		$scope.closeErrorDialog = function() {
			$mdDialog.hide();
		}
	}
]);

// Select Notification Form Controller is used to handle the events following user interaction with the UI components declared within the Notification Actions controller.
selectNotification.controller('selectNotificationFrmCtlr', ['$scope', '$rootScope', '$http', '$cookies', '$timeout', '$window', '$location', 'notificationTypesService', 'notificationsService', 'notificationService',
	function($scope, $rootScope, $http, $cookies, $timeout, $window, $location, notificationTypesService, notificationsService, notificationService) {
		$rootScope.$on("updateNotification", function() {
			$scope.updateNotification();
		});
		$rootScope.$on("generateEmail", function() {
			$scope.generateEmail();
		});
		// Update Notification uses the notificationService and $http to update the fields of the Notification displayed within the Select Notification Application
		$scope.updateNotification = function() {
			var notificationType = notificationService.getNotificationType().fields.notification_type;
			var notificationTitle = notificationService.getNotificationTitle();
			var contacts = notificationService.getContacts();
			var subject = notificationService.getSubject();
			var notification = notificationService.getNotification();
			var id = notificationService.getId();
			var form_data = {
				'notification_type': notificationType,
				'notification_name': notificationTitle,
				'notification_contacts': contacts,
				'subject': subject,
				'body': notification,
				'notification_id': id
				// 'csrfmiddlewaretoken': $cookies.csrftoken
			};
			$http({
				method: "POST",
				url: "update/",
				data: form_data,
				headers: { 'Content-Type': 'application/json' }
			}).then(function sucesss(response){
				$scope.alertMessage = false;
				// $timeout(function() {$scope.alertMessage = true;}, 3000);
				$rootScope.$emit("showSuccessDialog", {});
			}, function error(response) {
				// var errorMessage = "Oops it looks like something went wrong. Please try again.";
				// console.log(errorMessage);
				$rootScope.$emit("showErrorDialog", {});
			});
		}
		// Generare Email uses the notificationService and $window to send mailto: intent to the users default mail application.
		$scope.generateEmail = function() {
			var defaultEmail = "[PLEASE ENTER TO: EMAIL]";
			var subject = notificationService.getSubject();
			var notification = notificationService.getNotification();
			var notificationContacts = notificationService.getContacts();
			var allContacts = [];
			var contacts = "";
			$http({
				method: "GET",
				url: "contacts/"
			}).then(function success(response){
				allContacts = response.data;
				// Compares the ID of related notification contacts, against each contact object returned
				// from the server. If the IDs match then the email address is concatenated to cc field string.
				angular.forEach(allContacts, function(contact1, key) {
					angular.forEach(notificationContacts, function(contact2, key) {
						if (contact1.pk == contact2) {
							contacts += contact1.fields.contact_email + ";";
						}
					});
				});
				var departmentId = notificationService.getDepartmentId();
				console.log(departmentId);
				if (departmentId == 7) { // If the department is Racing Operations set the the carbon copy type to bcc. Racubg dara customer support has primary key of 7.
					carbonCopyType = "?bcc=";
					defaultEmail = "RacingAdvisories@pressassociation.com"
				} else if (departmentId == 8){
					carbonCopyType = "?bcc=";
					defaultEmail = "GreyhoundAdvisories@pressassociation.com"
				} else {
					carbonCopyType = "?cc=";
				}
				// Encodes mailto: string sending an intent to the users default mail application.
				var window = $window.open(encodeURI("mailto:" + defaultEmail + carbonCopyType + contacts + "&subject=" + subject + "&body=" + notification,"_blank"));
				$timeout(function() {window.close();}, 0);
			}, function error(response) {
				var errorMessage = "Oops it looks like something went wrong.";
				console.log(errorMessage);
			});
		}
	}
]);

// Select Notification Application templating and cookie configuration.
selectNotification.config(['$interpolateProvider', '$httpProvider',
	function($interpolateProvider, $httpProvider) {
		// Sets the csrftoken as cookie in all http requests
		$httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	    $interpolateProvider.startSymbol('{[{');
		$interpolateProvider.endSymbol('}]}');
	}
]);

addNotification.service('departmentService', function() {
	 var departmentId;
	 var setDepartmentId = function(data) {
	 	departmentId = data;
	 };
	 var getDepartmentId = function() {
	 	return departmentId;
	 };
	 return {
	 	setDepartmentId: setDepartmentId,
	 	getDepartmentId: getDepartmentId
	 };
});

// Notification Type Service used for transferring Notification Type data between controllers.
addNotification.service('notificationTypesService', function() {
	var notificationTypes;
	var setNotificationTypeData = function(data) {
		notificationTypes = data;
	};
	var getNotificationTypeData = function() {
		return notificationTypes;
	};
	return {
		setNotificationTypeData: setNotificationTypeData,
		getNotificationTypeData: getNotificationTypeData

	};
});

// Notification Server is used for transferring Notification data between controllers.
addNotification.service('notificationService', function() {
	var notificationType;
	var notificationName;
	var contacts = [];
	var subject;
	var body;
	var setNotificationType = function(data){
		notificationType = data;
	};
	var getNotificationType = function(data) {
		return notificationType;
	}
	var setNotificationName = function(data) {
		notificationName  = data;
	};
	var getNotificationName = function() {
		return notificationName;
	};
	var setContacts = function(data) {
		contacts = data;
	};
	var getContacts = function() {
		return contacts;
	};
	var setSubject = function(data) {
		subject = data;
	};
	var getSubject = function() {
		return subject;
	};
	var setBody = function(data) {
		body = data;
	};
	var getBody = function() {
		return body;
	};
	return {
		setNotificationType: setNotificationType,
		getNotificationType: getNotificationType,
		setContacts: setContacts,
		getContacts: getContacts,
		setNotificationName: setNotificationName,
		getNotificationName: getNotificationName,
		setSubject: setSubject,
		getSubject: getSubject,
		setBody: setBody,
		getBody: getBody
	};
});

// Add Department Controller
addNotification.controller('addDepartmentCtlr', ['$scope', '$rootScope', '$http', 'notificationTypesService', 'departmentService',
	function($scope, $rootScope, $http, notificationTypesService, departmentService) {
		$scope.getNotificationType2 = function() {
			var id = $scope.selectedDepartment;
			departmentService.setDepartmentId(id);
			$http({
			  	method : "GET",
			  	url : "department/" + id
			  }).then(function success(response) {
					notificationTypesService.setNotificationTypeData(response.data);
					if (!response.data.length) {
						// $scope.typesNotFound = "No related 'Notification Types' were found. Please select a different 'Department'.";
						$rootScope.$emit("clearFormFields", {});
					} else {
						// $scope.typesNotFound = "";
						$rootScope.$emit("populateNotificationTypes", {});
					}
			  }, function error(response) {
			  		var errorMessage = "Oops it looks like something went wrong. Please try again.";
			  		console.log(errorMessage)
			});
		};
	}
]);

// Select Notification Type Controller
addNotification.controller('selectNotificationTypeCtlr', ['$scope', '$rootScope', '$http', 'notificationTypesService', 'notificationService', 'departmentService',
	function($scope, $rootScope, $http, notificationTypesService, notificationService, departmentService) {
		$scope.carbonCopyType = "Select Contacts";
		$rootScope.$on("populateNotificationTypes", function() {
			$scope.populateNotificationTypes();
		});
		$rootScope.$on("clearFormFields", function() {
			$scope.clearFormFields();
		});
		$scope.populateNotificationTypes = function() {
			console.log("Called");
			var NotificationTypes = [];
			$scope.notificationTypes = notificationTypesService.getNotificationTypeData();
		}
		$scope.getNotificationType = function() {
			notificationService.setNotificationType($scope.selectedNotificationType);
			$rootScope.$emit("setContactsLabel");
		}
		$scope.clearFormFields = function() {
			console.log("Cleared");
			$scope.notificationTypes = [];
		}

	}
]);

// Notification Name Controller
addNotification.controller('notificationNameCtlr', ['$scope', '$rootScope', 'notificationService',
	function($scope, $rootScope, notificationService) {
		$scope.updateNotificationName = function() {
			notificationService.setNotificationName($scope.notificationName);
		}
		$rootScope.$on("clearFormFields", function() {
			$scope.clearFormFields();
		});
		$scope.clearFormFields = function () {
			$scope.notificationName = "";
		}
	}
]);

// Subject Controller
addNotification.controller('subjectCtlr', ['$scope', '$rootScope', 'notificationService',
	function($scope, $rootScope, notificationService) {
		$scope.updateSubject = function() {
			notificationService.setSubject($scope.subject);
		}
		$rootScope.$on("clearFormFields", function() {
			$scope.clearFormFields();
		});
		$scope.clearFormFields = function () {
			$scope.subject = "";
		}
	}
]);

// Body Controller
addNotification.controller('bodyCtlr', ['$scope', '$rootScope', 'notificationService',
	function($scope, $rootScope, notificationService) {
		$scope.updateBody = function() {
			notificationService.setBody($scope.body);
			// emit enable add button
		}
		$rootScope.$on("clearFormFields", function() {
			$scope.clearFormFields();
		});
		$scope.clearFormFields = function () {
			$scope.body = "";
		}
	}
]);

// Select Notification Contacts Controller
addNotification.controller('selectNotificationContactsCtlr', ['$scope', '$rootScope', '$http', 'notificationService', 'departmentService',
	function($scope, $rootScope, $http, notificationService, departmentService) {
		var notificationContacts;
		$scope.selectedContacts = notificationContacts; // May need to set this data in a service before posting this data to the server for processing.
		$scope.carbonCopyType = "Select Contacts";
		$http({
			method: "GET",
			url: "contacts/"
		}).then(function success(response){
				$scope.contacts = response.data;
		}, function error(response) {
			var errorMessage = "Oops it looks like something went wrong. Please try again.";
			console.log(errorMessage);
		});
		$scope.updateSelectedContacts = function() {
			notificationService.setContacts($scope.selectedContacts);
		}
		$rootScope.$on("clearFormFields", function() {
			$scope.clearFormFields();
		});
		$scope.clearFormFields = function () {
			$scope.selectedContacts = [];
		}
		$rootScope.$on("setContactsLabel", function() {
			$scope.setContactsLabel();
		});
		$scope.setContactsLabel = function() {
			if (departmentService.getDepartmentId() == 7 || departmentService.getDepartmentId() == 8) {
				$scope.carbonCopyType = "Select BCC Contacts";
			} 
			else {
				$scope.carbonCopyType = "Select CC Contacts";
			}
		}
	}
]);

// Add Notification Action Controller handles user click event on UI component Add. 
// Custom client side validation is used to check if data has been input by the user.
// Further improvements: Instead of using custom validation use angular form validation to raise any errors within the client.
addNotification.controller('addNotificationActionCtlr', ['$scope', '$rootScope', '$http', 'notificationService', '$mdDialog', '$timeout', '$window',
	function($scope, $rootScope, $http, notificationService, $mdDialog, $timeout, $window) {
		$scope.addNotification = function() {
			$scope.errorMessage = "";
			var null_flag = false;
			var notificationType = notificationService.getNotificationType();
			var notificationName = notificationService.getNotificationName();
			var contacts = notificationService.getContacts();
			var subject = notificationService.getSubject();
			var body = notificationService.getBody();
			var form_data = {
				'notification_type': notificationType,
				'notification_name': notificationName,
				'notification_contacts': contacts,
				'subject': subject,
				'body': body
			};
			// Checks each keys value within form data object, if any of the values within the object is empty, sets a flag to true.
			angular.forEach(form_data, function(value, key){
				if (value == "") {
					null_flag = true;
				}
			});
			// If the flag is false the form data object is posted to the server.
			// If the flag is true a Validation Error is displayed within the client.
			if (!null_flag){
				$http({
					method: "POST",
					url: "add/",
					data: form_data,
					headers: { 'Content-Type': 'application/json' }
				}).then(function success(response){
					title = "Success";
					successMessage = ' "'+ notificationName + '" has been successfully saved.'
					// notificationService.setNotificationType(""); TODO!!!!!
					notificationService.setNotificationName("");
					notificationService.setContacts("");
					notificationService.setSubject("");
					notificationService.setBody("");
					$rootScope.$emit("populateNotificationTypes", {});
					$rootScope.$emit("clearFormFields", {});
					$scope.addNotificationDialog(title, successMessage);
				}, function error(response) {
					// If key, values within the form data object are submitted to the server bypassing client side validation, the server will return error object, and a Validation Error will be displayed within the client. 
					title = "Validation Error";
					if (response.data.error == "Key Error") {
						errorMessage = "Please complete all form fields";
						$scope.addNotificationDialog(title, errorMessage);
					} else {
						errorMessage = "A notification with that name already exits. Please try again.";
						$scope.addNotificationDialog(title, errorMessage);
					}
					// var errorMessage = "Oops it looks like something went wrong. Either we wasn't able to add this notification as it already exists or there was another error";
					// console.log(errorMessage);
				});
			} else {
				$scope.addNotificationDialog("Validation Error", "Please complete all form fields.");
			}
		}
		$scope.addNotificationDialog = function(title, message) {
			$mdDialog.show({
				contentElement: '#addNotificationDialog',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
			$scope.promptTitle = title;
			$scope.message = message;
		}
		$scope.closeDialog = function() {
			$mdDialog.hide();
		}
	}
]);

// ScrollOnChange directive is can be used anywhere in the selectNotification module. 
// Directive uses toElement and fromElement functions from within the controllers scope that this directive have been applied in.
selectNotification.directive('scrollOnChange', function(){
	return {
		restrict: "A",
		link: function(scope, $elm) {
			var toElement = $(scope.toElement());
			var fromElement = $(scope.fromElement());              
			$elm.on('change', function() {
				var animation = fromElement.animate({
					scrollTop: toElement.offset().top,
				}, 1250);
				fromElement.on('wheel mousedown', function() {
					animation.stop();
				});
			});
		}
	};	
});

// Add Notification Application templating and csrftoken cookie configuration.
addNotification.config(['$interpolateProvider', '$httpProvider',
	function($interpolateProvider, $httpProvider){
		// Sets the csrftoken as cookie in all http requests
		$httpProvider.defaults.xsrfCookieName = 'csrftoken';
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
	    $interpolateProvider.startSymbol('{[{');
		$interpolateProvider.endSymbol('}]}');
	}
]);

// Bootstraps the Add Notification Application to the DOM element addNotification. Allowing two AngularJS applications to function within the same DOM
angular.bootstrap(document.getElementById("addNotificationModule"), ['addNotification']);

