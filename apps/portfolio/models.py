from django.db import models

class MyProject(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)


    def __unicode__(self):
        return self.name

    