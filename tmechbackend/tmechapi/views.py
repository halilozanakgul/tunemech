from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tmechapi.models import Song
from tmechapi.serializers import SongSerializer
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pprint

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
def search_songs(request):
	"""
		Search the song on Spotify
	"""
	client_credentials_manager = SpotifyClientCredentials()
	sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

	query = request.data["query"]

	response = sp.search(query, limit=10, type='track')

	songs = []
	print(query)

	for track in response["tracks"]["items"]:
		serializer = SongSerializer(data={"title":track["name"],
										  "artist":track["artists"][0]["name"],
										  "album":track["album"]["name"],
										  "spotify_url":track["external_urls"]["spotify"],
										  "album_image":track["album"]["images"][0]["url"],
										  "spotify_id":track["id"]})
		if serializer.is_valid():
			serializer.save()
		songs.append(serializer.data)

	return Response(songs, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_song(request):
	"""
		Create a new song.
		{
			"title":"Dynamite",
			"artist":"Taio Cruz",
			"album":"ROKSTARR",
			"spotify_url":"https://open.spotify.com/track/4lYKuF88iTBrppJoq03ujE",
			"spotify_id":"4lYKuF88iTBrppJoq03ujE"
		}
	"""

	serializer = SongSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
	return Response(serializer.data, status=status.HTTP_201_CREATED)
