#!/usr/bin/env python
# coding: utf-8

from django import forms
from notes.models import Post

class PostAddForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        super(PostAddForm, self).__init__(*args, **kwargs)
        self.fields['title'].label = ''
        self.fields['entry'].label = ''
        self.fields['tags'].label = ''

    class Meta:
        model = Post
        fields = ['title', 'tags', 'entry', 'visible']
        widgets = {
            'title': forms.TextInput(attrs={'placeholder': 'Title of the note'}),
            'entry': forms.Textarea(attrs={'placeholder': 'Content of the note'}),
            'tags': forms.TextInput(attrs={'placeholder': 'Tags'})
        }
