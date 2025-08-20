from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('posts', '0012_performanceobjective_quarterlyprogress'),
    ]

    operations = [
        migrations.AddField(
            model_name='performanceobjective',
            name='rejection_comment',
            field=models.TextField(blank=True, null=True, help_text='Admin provided reason when objective is rejected.'),
        ),
    ]
