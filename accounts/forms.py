from django import forms
from django.contrib.auth import authenticate

class UserLoginForm(forms.Form):
	username = forms.CharField(widget=forms.TextInput(attrs={'class':'mdl-textfield__input'}))
	password = forms.CharField(widget=forms.PasswordInput(attrs={'class':'mdl-textfield__input'}))

	def clean(self, *args, **kwargs):
		username = self.cleaned_data['username']
		password = self.cleaned_data['password']
		user = authenticate(username=username, password=password)
		if not user:
			raise forms.ValidationError("The username and password did not match. Please try again.")
		return super(UserLoginForm, self).clean(*args, **kwargs)
	
	def auth_user(self, *args, **kwargs):
		username = self.cleaned_data['username']
		password = self.cleaned_data['password']
		user = authenticate(username=username, password=password)
		return user