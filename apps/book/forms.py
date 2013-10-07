from django import forms
from django.utils.safestring import mark_safe
from book.models import Book

class AdminImageWidget(forms.FileInput):

    def __init__(self, attrs={}):
        super(AdminImageWidget, self).__init__(attrs)

    def render(self, name, value, attrs=None):
        output = []
        if value and hasattr(value, "url"):
            output.append(('<a target="_blank" href="%s">%s<img src="%s" alt=""></a>' % (value.url, value.url.split('/')[-1], value.url)))
        output.append(super(AdminImageWidget, self).render(name, value, attrs))
        return mark_safe(u''.join(output)) 

class BookAddForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(BookAddForm, self).__init__(*args, **kwargs)
        self.fields['author'].label = ''
        self.fields['title'].label = ''
        self.fields['notes'].label = ''

    class Meta:
        model = Book
        fields = ('author', 'title', 'notes', 'mark', 'status', 'date_read', 'img')
        widgets = {
            'author': forms.TextInput(attrs={'placeholder': 'Author of the book'}),
            'title': forms.TextInput(attrs={'placeholder': 'Title of the book'}),
            'notes': forms.Textarea(attrs={'placeholder': 'Notes, remarks, comments, whatever', 'rows': 4}),
            'status': forms.RadioSelect(),
            'date_read': forms.TextInput(attrs={'placeholder': 'When'}),
            'img': AdminImageWidget()
        }

    def clean(self):
        cleaned_data = self.cleaned_data
        author = cleaned_data.get('author')
        title = cleaned_data.get('title')

        if author and author.strip() == '':
            raise forms.ValidationError("'Author' is required.")
        if title and title.strip() == '':
            raise forms.ValidationError("'Title' is required.")

        return cleaned_data