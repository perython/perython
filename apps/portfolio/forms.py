from django import forms

class ProjectAddForm(forms.Form):
    name = forms.CharField(max_length=150)
    description = forms.CharField(widget=forms.Textarea)

    class Media:
        js = ('/static/admin/grappelli/tinymce/jscripts/tiny_mce/tiny_mce.js',
			  '/static/admin/grappelli/tinymce_setup/tinymce_setup.js',)
