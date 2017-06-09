from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, Http404, JsonResponse, HttpResponseNotFound
from django.core import serializers
from django.contrib.auth.decorators import login_required
from notifications.models import Department, UserProfile, NotificationType, Notification, Contact
from django.core.exceptions import ValidationError
from .forms import SelectNotificationForm, AddNotificationForm
from jsonmiddleware.middleware import JSONMiddleware
import json

# Decorators: @login_required
# Usage: Used to redirect the user to specified url if a user session does not exist.


# @url: /
# @decorator: login_required.
# Returns home webpage.
@login_required(login_url='/login/')
def home_view(request):
	context = {}
	template = 'notifications/home.html'
	return render(request, template, context)

# @url: notification/
# @decorator: login_required.
# Returns notification webpage with @Select and @Add @Notification forms.
@login_required(login_url='/login/')
def notification_view(request):
	select_form = SelectNotificationForm(request.POST or None, user=request.user) # initial={'notification_id':'{[{ updateId }]}'})
	add_form = AddNotificationForm(request.POST or None)
	# If the user is not an admin, set the department shown in the department field to the users department usinng department id session variable.
	if not request.user.is_superuser:
		select_form.fields['department'].queryset = Department.objects.filter(id=request.session['department_id'])
	context = {
		"select_form": select_form,
		"add_form": add_form
	}
	template = 'notifications/add_notification.html' #change name of add_notification.html template to base_notification.html
	return render(request, template, context)

# @url: notification/department/
# @decorator: login_required.
# Returns JSON object containing all @NotificationTypes associated to the @Department ID.
@login_required(login_url="/login/")
def get_notification_types(request, id):
	try:
		if request.method == "GET":
			department = Department.objects.get(id=id)
			notification_types = NotificationType.objects.filter(department=department.id)
			return HttpResponse(serializers.serialize('json', notification_types))
	except NotificationType.DoesNotExist:
		raise Http404("Oops something went wrong. It looks like the NotificationType you were trying to select does not exist.")

# Handles url notification/notificationtype/undefined
@login_required(login_url="/login/")
def notificationtype_error_handler(request):
	return HttpResponse(request)

# @url: notification/notificationtype/
# @decorator: login_required.
# Returns JSON object containing all @Notifications associated to the @NotificationType ID.
@login_required(login_url="/login/")
def get_notifications(request, id):
	try:
		if request.method == "GET":
			notification_type = NotificationType.objects.get(id=id)
			notifications = Notification.objects.filter(notification_type=notification_type.id)
			return HttpResponse(serializers.serialize('json', notifications))
	except Notification.DoesNotExist:
		raise Http404("Oops something went wrong. It looks like the Notification you were trying to select does not exist.")

# @url: notification/notification/
# @decorator: login_required.
# Returns JSON object containing all @Contacts.
@login_required(login_url="/login/")
def get_contacts(request):
	if request.method == "GET":
		contacts = Contact.objects.all()
		return HttpResponse(serializers.serialize('json', contacts))

# @url: notification/delete/
# @Decorator login_required
# If a notification has not been selected and the user clicks on the delete button redirect them to the notification_view.
# Temporary function that bypasses Http404. An alternative would be use client side validation displaying a modal.
@login_required(login_url="/login/")
def notification_not_selected(request):
	return redirect('notification')

# @url: notification/notification/
# @decorator: login_required.
# Returns JSON object containing all @Notification data associated to the @Notification ID.
@login_required(login_url="/login/")
def delete_notification(request, id):
	try:
		notification = Notification.objects.get(id=id)
		notification.delete()
	except Notification.DoesNotExist:
		raise Http404("Oops something went wrong. It looks like the notification that you were trying to delete does not exist.")
	return redirect('notification')

# @url: notification/update/
# @Classes: Uses @process_request of @JSONMiddleware to process the POST JSON object and create QueryDictionary.
# Saves changes to @Contacts, @Subject and @Body related to the @Notification currently selected.
@login_required(login_url="/login/")
def update_notification(request):
	try:
		form_data = JSONMiddleware()
		form_data.process_request(request)
		if request.method == "POST":
			notification_id = request.POST['notification_id']
			notification_instance = Notification.objects.get(id=notification_id) #get_object_or_404(Notification, id=notification_id)
			"""
			This works but is not clean, so create a class for iterating through the request.POST QueryDictionary.
			Something like the below.
				for (key, value) in my_data_dict.items():
		    setattr(obj, key, value)
			"""
			# if the user has failed to enter required form data return status 500
			try:
				notification_instance.notification_subject = request.POST['subject']
				notification_instance.notification_contacts = request.POST.getlist('notification_contacts')
				notification_instance.notification_body = request.POST['body']
				notification_instance.full_clean()
				notification_instance.save()
			except KeyError:
				return HttpResponse(status=500)
	except Notification.DoesNotExist:
		raise Http404("Oops something went wrong. It looks like the notification that you were trying to update does not exist.")
	return redirect('notification')

# @url: notification/add/
# @Classes: Uses @process_request of @JSONMiddleware to process the POST JSON object and create QueryDictionary.
# Validates and saves new @Notification.
@login_required(login_url="/login/")
def add_notification(request):
	if request.method == "POST":
		form_data = JSONMiddleware()
		form_data.process_request(request)
		notification_instance = Notification()
		# if the user has failed to enter required form data return Key Error as error and status 500
		try:
			notification_obj = NotificationType.objects.get(id=request.POST['notification_type'])
			notification_instance.notification_type = notification_obj
			notification_instance.notification_title = request.POST['notification_name']
			notification_instance.notification_subject = request.POST['subject']
			notification_instance.notification_body = request.POST['body']
			print notification_instance
		except (ValueError, KeyError):
			return HttpResponse(json.dumps({'error':'Key Error'}), status=500)
		# if the user input data fails validation return Validation Error as error and status 500
		try:
			notification_instance.full_clean()
			notification_instance.save()
			notification_contacts = request.POST.getlist('notification_contacts')
			notification_instance.notification_contacts.add(*notification_contacts)
		except ValidationError as error:
			return HttpResponse(json.dumps({'error':'Validation Error'}), status=500)
		return redirect('notification')
