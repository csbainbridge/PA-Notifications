from django import forms
from notifications.models import Department
from notifications.models import NotificationType
from notifications.models import Notification


class SelectNotificationForm(forms.Form):
	department = forms.ModelChoiceField(queryset=Department.objects.all(), widget=forms.Select(attrs={'class':'input-element', 'ng-change':'getNotificationType()', 'ng-model':'selectedDepartment'}))
	notification_type = forms.ChoiceField(widget=forms.Select(attrs={'class':'input-element', 'ng-change':'getNotifications()', 'ng-options':'type.pk as type.fields.notification_type for type in notificationTypes', 'ng-model':'selectedNotificationType'}))
	notification_name = forms.ChoiceField(widget=forms.Select(attrs={'class':'input-element', 'ng-change':'getNotification()', 'ng-options':'notification.pk as notification.fields.notification_title for notification in notifications', 'ng-model':'selectedNotification', 'scroll-on-change':''}))
	notification_contacts = forms.MultipleChoiceField(widget=forms.SelectMultiple(attrs={'class':'input-element', 'ng-model':'selectedContacts', 'ng-change': 'updateSelectedContacts()', 'ng-options':'contact.pk as contact.fields.contact_email for contact in contacts'}))
	subject = forms.CharField(widget=forms.TextInput(attrs={'class':'input-element', 'ng-model':'subject', 'ng-change':'updateSubject()'}))
	body = forms.CharField(widget=forms.Textarea(attrs={'class': 'input-text-area', 'ng-model':'body', 'ng-change':'updateNotificationBody()'}))
	notification_id = forms.CharField(widget=forms.HiddenInput(attrs={'ng-model':'setUpdateId'}))

	def __init__(self, *args, **kwargs):
		self.user = kwargs.pop('user')
		super(SelectNotificationForm, self).__init__(*args, **kwargs)
		print self.user.is_superuser
		if not self.user.is_superuser:
			self.fields['notification_contacts'].widget.attrs['disabled'] = True
	 	
		# if not user.is_superuser:
		# 	


class AddNotificationForm(forms.Form):
	department = forms.ModelChoiceField(queryset=Department.objects.all(), widget=forms.Select(attrs={'class':'modal-input-element notification-modal-input', 'ng-change':'getNotificationType2()', 'ng-model':'selectedDepartment'}))
	notification_type = forms.ChoiceField(widget=forms.Select(attrs={'id':'notification_type','class':'modal-input-element notification-modal-input', 'ng-options':'type.pk as type.fields.notification_type for type in notificationTypes', 'ng-model':'selectedNotificationType', 'ng-change':'getNotificationType()'}))
	notification_name = forms.CharField(widget=forms.TextInput(attrs={'id':'notification_name','class':'modal-input-element notification-modal-input', 'ng-model':'notificationName', 'ng-change':'updateNotificationName()'}))
	notification_contacts = forms.MultipleChoiceField(widget=forms.SelectMultiple(attrs={'id':'notification_contacts','class':'modal-input-element notification-modal-input', 'ng-change':'updateSelectedContacts()', 'ng-model':'selectedContacts', 'ng-options':'contact.pk as contact.fields.contact_email for contact in contacts'}))
	subject = forms.CharField(widget=forms.TextInput(attrs={'id':'subject','class':'modal-input-element notification-modal-input', 'ng-model':'subject', 'ng-change':'updateSubject()'}))
	body = forms.CharField(widget=forms.Textarea(attrs={'id':'body','class':'modal-text-area modal-input-element notification-modal-input', 'ng-model':'body', 'ng-change':'updateBody()'}))
