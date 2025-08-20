from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('posts','0013_performanceobjective_rejection_comment'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='performanceobjective',
            index=models.Index(fields=['branch','subtitle','criteria'], name='objective_branch_subtitle_criteria_idx'),
        ),
    ]
