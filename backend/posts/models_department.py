from django.db import models

# Branch model replaces Department and Division
class Branch(models.Model):
    name = models.CharField(max_length=100, unique=True)
    head = models.CharField(max_length=100, blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='children', null=True, blank=True)

    def __str__(self):
        return self.name
