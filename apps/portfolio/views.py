from django.contrib import messages
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render_to_response
from django.views.generic.list import ListView
from portfolio.models import MyProject
from portfolio.forms import ProjectAddForm

class PortfolioListView(ListView):
    model = MyProject
    template_name = 'portfolio_list.html'

def portfolio_add(request):
    if not request.user.is_authenticated():
        raise Http404
    form = ProjectAddForm(request.POST or None)
    if form.is_valid():
        cd = form.cleaned_data
        project = MyProject(
            name=cd['name'],
            title_image=cd['title_image'],
            description=cd['description']
        )
        project.save()
        messages.success(request, 'Project added.')
        return HttpResponseRedirect('/portfolio/')
    return direct_to_template(request, 'admin/add-edit-object.html',
        {'form': form,
         'object_name': 'project',
         'mode': 'add'}
    )

def portfolio_edit(request, id):
    if not request.user.is_authenticated():
        raise Http404
    project = get_object_or_404(MyProject, id=id)
    if request.POST:
        form = ProjectAddForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            project.name = cd['name']
            project.description = cd['description']
            project.title_image = cd['title_image']
            project.save()
            messages.success(request, 'Project edited successfully.')
            return HttpResponseRedirect('/portfolio/')
    form = ProjectAddForm(
        {'name': project.name,
         'description': project.description,
         'title_image': project.title_image}
    )
    friends = get_friends_list()
    return direct_to_template(request, 'admin/add-edit-object.html',
        {'form': form,
         'object_name': 'project',
         'mode': 'edit',
         'friends': friends}
    )

def portfolio_project(request, id):
    project = get_object_or_404(MyProject, id=id)
    return direct_to_template(request, 'portfolio-project.html',
        {'project': project}
    )
