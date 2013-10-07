from django.conf.urls import patterns, url
from portfolio.views import PortfolioListView

urlpatterns = patterns('portfolio.views',
    url(r'^$', PortfolioListView.as_view()),
    url(r'^add-project/$', 'portfolio_add'),
    url(r'^(?P<id>\d{1,3})/$', 'portfolio_project'),
    url(r'^(?P<id>\d{1,3})/edit/$', 'portfolio_edit'),
    #    (r'^portfolio/(?P<project>[^/]+)/(?P<app>[^/]+)/$', 'portfolio'),
)