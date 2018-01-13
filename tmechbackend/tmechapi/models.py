from django.db import models

class Song(models.Model):
	"""
		The song object that the users will create.
	"""

	title = models.CharField(max_length=50)
	artist = models.CharField(max_length=50)
	album = models.CharField(max_length=50)
	spotify_url = models.URLField()

	class Meta:
		ordering = ('title',)
		
