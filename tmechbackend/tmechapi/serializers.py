from rest_framework import serializers
from tmechapi.models import Song

class SongSerializer(serializers.ModelSerializer):
	class Meta:
		model = Song
		fields = ('title', 'artist', 'album', 'spotify_url')
