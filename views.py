#!/usr/bin/env python
# coding: utf-8

from django.views.generic.base import TemplateView

class ContactsView(TemplateView):
	template_name = 'contacts.html'