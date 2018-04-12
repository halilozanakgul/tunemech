from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tmechapi.models import Song
from tmechapi.serializers import SongSerializer

@api_view(['GET'])
def list_songs(request):
	"""
		List all songs.
	"""
	songs = Song.objects.all()
	serializer = SongSerializer(songs, many=True)
	return Response(serializer.data)

@api_view(['GET'])
def song_detail(request, pk):
	"""
		Get song details.
	"""
	try:
		song = Song.objects.get(pk=pk)
	except Song.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	serializer = SongSerializer(song)
	return Response(serializer.data)

@api_view(['POST'])
def new_song(request):
	"""
		Create a new song.
		{
			"title":"FRIENDS",
			"artist":"Anne-Marie",
			"album":"FRIENDS",
			"spotify_url":"https://open.spotify.com/track/08bNPGLD8AhKpnnERrAc6G?context=spotify%3Auser%3Aspotify%3Aplaylist%3A37i9dQZF1DXcBWIGoYBM5M"
		}
	"""
	serializer = SongSerializer(data=request.data)
	print("ozan")
	print(serializer.is_valid())
	print(serializer)
	if serializer.is_valid():
		serializer.save()
		print("akgul")
	return Response(serializer.data, status=status.HTTP_201_CREATED)
