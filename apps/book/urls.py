from django.conf.urls import patterns, url
from book.views import BooksView, BookAddView, BookEditView

urlpatterns = patterns('book.views',
    url(r'^$', BooksView.as_view()),
    url(r'^add/$', BookAddView.as_view()),
    url(r'^(?P<pk>\d{1,10})/edit/$', BookEditView.as_view()),
)