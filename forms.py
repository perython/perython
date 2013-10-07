from django import forms
from django.contrib.auth.forms import AuthenticationForm

class CustomAuthenticationForm(AuthenticationForm):

    username = forms.CharField(max_length=254, widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))

    def __init__(self, request=None, *args, **kwargs):
    	super(CustomAuthenticationForm, self).__init__(*args, **kwargs)

        self.fields['username'].label = ''
        self.fields['password'].label = ''
        
