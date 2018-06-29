# Generated by Django 2.2.dev20180628151426 on 2018-06-29 00:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Song',
            fields=[
                ('title', models.CharField(max_length=50)),
                ('artist', models.CharField(max_length=50)),
                ('album', models.CharField(max_length=50)),
                ('spotify_url', models.URLField()),
                ('album_image', models.URLField()),
                ('spotify_id', models.CharField(max_length=50, primary_key=True, serialize=False)),
            ],
            options={
                'ordering': ('title',),
            },
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('songs', models.ManyToManyField(related_name='tags', to='tmechapi.Song')),
            ],
            options={
                'ordering': ('title',),
            },
        ),
    ]
