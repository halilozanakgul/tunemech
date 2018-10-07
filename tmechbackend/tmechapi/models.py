from django.db import models

class Song(models.Model):
	"""
		The song object that the users will create.
	"""

	title = models.CharField(max_length=200)
	artist = models.CharField(max_length=200)
	album = models.CharField(max_length=200)
	spotify_url = models.URLField()
	album_image = models.URLField()
	spotify_id = models.CharField(max_length=200, primary_key=True)

	class Meta:
		ordering = ('title',)

class List(models.Model):
	"""
		The list object that the songs will be collected.
	"""
	songs = models.ManyToManyField(Song, related_name="lists")
