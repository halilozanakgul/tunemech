from rest_framework import serializers
from tmechapi.models import Song
from tmechapi.models import List

class SongSerializer(serializers.ModelSerializer):
	class Meta:
		model = Song
		fields = ('title', 'artist', 'album', 'spotify_url', 'spotify_id', 'album_image')

class ListSerializer(serializers.ModelSerializer):
	class Meta:
		model = List
		fields = ['songs']
