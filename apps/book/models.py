from django.conf import settings
from django.db import models

# status: (read_already, want_to_read, hidden )

class Book(models.Model):
    STATUS_CHOICES = (
        ('PL', 'Plans'),
        ('RN', 'In progress'),
        ('FN', 'Finished'),
        ('HD', 'Hidden'),
    )
    MARKS_CHOICES = (
        (1, 'Weakly'),
        (2, 'Not bad'),
        (3, 'Good'),
        (4, 'Very good'),
        (5, 'Masterpiece'),
    )
    author = models.CharField(max_length=200)
    title = models.CharField(max_length=300)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default='RN')
    img = models.ImageField(upload_to='books/')
    mark = models.IntegerField(choices=MARKS_CHOICES)

    date_read = models.DateField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u'[Book: "{0}" by {1}, status: {2}]'.format(self.title, self.author, self.status)

    def get_edit_url(self):
        return '/bookshelf/{0}/edit/'.format(self.id)

    def get_img_url(self):
        return '{0}{1}'.format(settings.MEDIA_URL, self.img)
