$(document).ready(function(){

	// When the add-contact-button is clicked append new add contact select box to form.
	// This will use an Ajax call to populate the newly created select box with all fields from contacts database.
	$('#add-contact-button-1').bind("click", function(event){
		event.preventDefault();
		var contactField = '<select class="input-element input-element__add-contact"></select>';
		$('#add-contact-notification-input-1').append(contactField);
	})

	// When the remove-contact-button is clicked remove the last select box from the form.
	$('#remove-contact-button-1').bind("click", function(event){
		event.preventDefault();
		var childCount = $('#add-contact-notification-input-1 select').length;
		// console.log(childCount);
		if (childCount > 1) {
			// console.log(childCount);
			$('.input-element__add-contact').last().remove();
		}
	})

	$('#add-contact-button-2').bind("click", function(event){
		event.preventDefault();
		var contactField = '<select class="input-element input-element__add-contact"></select>';
		$('#add-contact-notification-input-2').append(contactField);
	})

	// When the remove-contact-button is clicked remove the last select box from the form.
	$('#remove-contact-button-2').bind("click", function(event){
		event.preventDefault();
		var childCount = $('#add-contact-notification-input-2 select').length;
		if (childCount > 1) {
			$('.input-element__add-contact').last().remove();
		}
	})

	// When the close button is clicked close modal.
	$('.modal-close-button').bind("click", function(event){
		$('.modal').css("display", "none");
		$('#notification_name').val("");
		$('#notification_contacts').val("");
		$('#subject').val("");
		$('#body').val("");
	})

	var editUserModal = document.getElementById('edit-user-modal');
	var addUserModal = document.getElementById('add-user-modal');
	var notificationModal = document.getElementById('add-notification-modal');
	window.onclick = function(event) {
	    if (event.target == editUserModal) {
	        editUserModal.style.display = "none";

	    } else if (event.target == addUserModal) {
	    	addUserModal.style.display = "none";
	   	} else if (event.target == notificationModal) {
	   		notificationModal.style.display = "none";
	   	}
	}

	$('#update-user-button').bind("click", function(event){
		event.preventDefault();
		// post to update user url to save user details to the database.
	})

	$('#add-button').bind("click", function(event){
		event.preventDefault();
		// If the
		$(".add-modal").css("display", "block");
	})

	// Need to add this to a directive within Angular
	$('#id_notification_name').bind("change", function(event){
		$('.notifications-card').animate({
			scrollTop: $('.sub-button-container').offset().top
		}, 1250);
	})

});

// Initialize global variables - get navigation drawer element, get obsfuscator element, get close button element and set media query.
// var navigationDrawer = document.getElementById("drawer"); // Unable to use these as global variables as the element state is not updated? and therefore,
// var obsfuscator = document.getElementById("obsfuscator"); // when using in a different function, toggling the visibility of the obsfuscator does not work - resolve?
var closeButton = document.getElementById("close-button");
var mediaQuery = window.matchMedia("(min-width: 1000px)");

// Function - Handles user click event when the close button is clicked. Removes is-visible class from navigation drawer and obsfuscator elements.
function navigationCloseBtnHandler() {
	var navigationDrawer = document.getElementById("drawer");
	var obsfuscator = document.getElementById("obsfuscator");
	navigationDrawer.classList.remove("is-visible");
	obsfuscator.classList.remove("is-visible");
}

// Function - Handles screen size change event. Checks if mediaQuery is the size of window and if navigation drawer element contains is-visible class,
// if so adds is-visible class to obsfuscator element, otherwise removes this class from obsfuscator element.
function screenSizeChangeHandler(mediaQuery) {
	var navigationDrawer = document.getElementById("drawer");
	var obsfuscator = document.getElementById("obsfuscator");
	if (mediaQuery.matches && navigationDrawer.classList.contains("is-visible")) {
		obsfuscator.classList.add("is-visible");
	}
}

// Event listeners
// Add click event listener to the close button element.
closeButton.addEventListener("click", navigationCloseBtnHandler, false);

// Add listener to media query
if (matchMedia) {
	mediaQuery.addListener(screenSizeChangeHandler);
	screenSizeChangeHandler(mediaQuery);
}
