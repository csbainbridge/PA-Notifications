from __future__ import unicode_literals

from django.db import models
from django.db.models.signals import post_save
from django.utils import timezone
from django.contrib.auth.models import User
from django.dispatch import receiver

class Department(models.Model):
	department_name = models.CharField(max_length=200)

	def __str__(self):
		return "%s" % (self.department_name)

	class Meta:
		ordering = ("department_name",)

class UserProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	user_role = models.CharField(max_length=150)
	user_department = models.ForeignKey(Department, null=True)

	def __str__(self):
		return "%s" % (self.user)

	class Meta:
		ordering = ("user",)

# User profile will be automatticaly created when a user instance is created
def create_profile(sender, **kwargs):
	if kwargs["created"]:
		user_profile = UserProfile.objects.create(user=kwargs["instance"])

post_save.connect(create_profile, sender=User)

class NotificationType(models.Model):
	notification_type = models.CharField(max_length=200)
	department = models.ManyToManyField(Department)

	def __str__(self):
		return "%s" % (self.notification_type)

	class Meta:
		ordering = ("notification_type",)

class Contact(models.Model):
 	contact_name = models.CharField(max_length=200)
 	contact_email = models.EmailField()

 	def __str__(self):
 		return "%s" % (self.contact_email)

 	class Meta:
 		ordering = ("contact_email",)

class Notification(models.Model):
	notification_title = models.CharField(max_length=500, unique=True)
	notification_subject = models.CharField(max_length=750)
	notification_body = models.TextField(max_length=5000)
	notification_contacts = models.ManyToManyField(Contact)
	notification_type = models.ForeignKey(NotificationType, default="", on_delete=models.CASCADE)

	# Timestamps and whodid
	created_date = models.DateTimeField(default=timezone.now)
	updated_date = models.DateTimeField(default=timezone.now)
	# created_by = models.ForeignKey(User)#, related_name="created_by_user")
	# modified_by = models.ForeignKey(User)#, related_name="modified_by_user")

	# last_published_date = models.DateTimeField()
	# last_published_by = models.TextField(max_length=750)

	# When validating the instance data, change the notification_title data to lowercase so that the other notification instances with
	# the same name with captalization cannot be saved to the database.
	def clean(self, *args, **kwargs):
		self.notification_title = self.notification_title.upper()
		return super(Notification, self).clean(*args, **kwargs)

	# When the advisory is saved update timestamps and record which user did this.
	# TODO: This functionality does not yet work, sort this out before first release.
	def save(self, *args, **kwargs):
	  	if not self.id:
	  		self.created_date = timezone.now()
	#  		self.created_by = self.request.user
		else:
	  		self.updated_date = timezone.now()
	#  	self.modified_by = self.request.user
	  	return super(Notification, self).save(*args, **kwargs)



	# When the advisory is published update when the notification was last published and record which user did this.
	# def publish(self, *args, **kwargs):
	# 	self.last_published_date = timezone.now()
	# 	self.last_published_by = self.request.user
	# 	return super(Notification, self).publish(*args, **kwargs)

	def __str__(self):
		return "%s" % (self.notification_title)

	class Meta:
		ordering = ("notification_title",)
