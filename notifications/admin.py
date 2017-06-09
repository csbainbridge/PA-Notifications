from django.contrib import admin
from notifications.models import (
		Department,
		Contact,
		NotificationType,
		Notification,
		UserProfile,
	)
# not functional is meant to save the user who created notification
# class NotificationAdmin(admin.ModelAdmin):
# 	def save_model(self, request, obj, form, change):
# 		obj.user = request.user
# 		obj.save()
#
# 	def save_formset(self, request, form, formset, change):
# 		if formset.model == Comment:
# 			instances = formset.save(commit=False)
# 			for instance in instances:
# 				instance.user = request.user
# 				instance.save()
# 		else:
# 			formset.save()


#class NotificationAdmin(admin.ModelAdmin):
admin.site.site_title = "PA Notifications"
admin.site.site_header = "PA Notifications"
admin.site.register(Notification)
admin.site.register(Department)
admin.site.register(NotificationType)
admin.site.register(Contact)
admin.site.register(UserProfile)
