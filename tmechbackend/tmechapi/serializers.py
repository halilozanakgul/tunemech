from rest_framework import serializers
from tmechapi.models import Song, User

class SongSerializer(serializers.ModelSerializer):
	class Meta:
		model = Song
		fields = ('title', 'artist', 'album', 'spotify_url', 'listeners')

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('username', 'songs')