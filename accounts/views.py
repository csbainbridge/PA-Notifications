from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from .forms import UserLoginForm
from notifications.models import UserProfile

# Returns html form to be rendered in web browser allowing the user to log in. If a user session already exists redirects them to site homepage.
def login_view(request):
	form = UserLoginForm(request.POST or None)
	if request.user.is_authenticated():
		return redirect('home')
	else:
		if form.is_valid():
			user = form.auth_user(request)
			if user:
				print user.id
				if not user.is_superuser:
					user_profile = UserProfile.objects.get(id=user.id)
					print user_profile.user_department.id
					request.session['department_id'] = user_profile.user_department.id
					request.session['department'] = user_profile.user_department.department_name
				login(request, user)
				return redirect('home')
		context = {
			"form": form
		}
		template = "accounts/user_login.html"
		return render(request, template, context)

# Ends the users session and redirects them to login page.
def logout_view(request):
 	logout(request)
 	return redirect('login')
