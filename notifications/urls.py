from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.home_view, name="home"),
	url(r'^notification/$', views.notification_view, name="notification"),
	url(r'^notification/department/(?P<id>\d+)/$', views.get_notification_types, name="get_notification_types"),
	# On change causes a "domino" effect within the applications controllers, which subsequently causes a GET request with an undefined ID. To handle this bug I have added
	# regular expression that redirects to the notification view when this request is made.
	url(r'^notification/notificationtype/undefined/$', views.notificationtype_error_handler, name="notificationtype_error_handler"),
	url(r'^notification/notificationtype/(?P<id>\d+)/$', views.get_notifications, name="get_notifications"),
	url(r'^notification/contacts/$', views.get_contacts, name="get_notification"),
	url(r'^notification/delete/(?P<id>\d+|)$', views.delete_notification, name="delete_notification"),
	url(r'^notification/update/$', views.update_notification, name="update_notification"),
	url(r'^notification/add/$', views.add_notification, name="add_notification"),
]
