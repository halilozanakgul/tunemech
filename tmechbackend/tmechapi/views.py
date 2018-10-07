from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tmechapi.models import Song
from tmechapi.models import List
from tmechapi.serializers import SongSerializer
from tmechapi.serializers import ListSerializer
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pprint
import requests
import ast
import operator

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
	client_credentials_manager = SpotifyClientCredentials(client_id='<your client id here>', client_secret='<your client secret here>')
	sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

	query = request.data["query"]

	response = sp.search(query, limit=10, type='track')

	songs = []

	for track in response["tracks"]["items"]:
		song={"title":track["name"],
		  	  "artist":track["artists"][0]["name"],
		 	  "album":track["album"]["name"],
			  "spotify_url":track["external_urls"]["spotify"],
			  "album_image":track["album"]["images"][0]["url"],
			  "spotify_id":track["id"]}
		songs.append(song);

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


@api_view(['POST'])
def get_recommendations(request):
	"""
		Returns the recommendations for the songs
	"""
	print("znnn");
	rec = {}
	for song in request.data["current_list"]:
		try:
			song = Song.objects.get(pk = song["spotify_id"])
		except Song.DoesNotExist:
			print("no song")
			continue
		lists = song.lists.all()
		for list in lists:
			for relSong in list.songs.all():
				if relSong.spotify_id != song.spotify_id:
					if not(relSong in rec):
						rec[relSong] = 0
					rec[relSong] += relSong.lists.count() / List.objects.count()
	for song in request.data["current_list"]:
		print(song)
		try:
			relSong = Song.objects.get(pk = song["spotify_id"])
		except Song.DoesNotExist:
			continue
		if relSong in rec:
			del rec[relSong]
	if len(rec) ==	 0:
		return Response([], status=status.HTTP_200_OK)
	sortedRec = sorted(rec.items(), key=operator.itemgetter(1))[::-1]
	sortedRec = sortedRec[:10]
	res = []
	normal = 100 / sortedRec[0][1]
	for topRec in sortedRec:
		song = SongSerializer(topRec[0]).data
		song["mech"] = int(topRec[1] * normal)
		res.append(song)
	return Response(res, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_list(request):
	"""
		Posts the list to recommendation database
	"""
	list = List()
	list.save()
	for song in request.data["list"]:
		print("song =", song)
		serializer = SongSerializer(data=song)
		print("serializer = ",serializer)
		if serializer.is_valid():
			print("??? validd")
			serializer.save()
		song = Song.objects.get(pk = song["spotify_id"])
		list.songs.add(song)
	return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def list_lists(request):
	"""
		List all lists.
	"""
	lists = List.objects.all()
	serializer = ListSerializer(lists, many=True)
	return Response(serializer.data)

@api_view(['POST'])
def reset(request):
	"""
		Delete all of the database
	"""
	Song.objects.all().delete()
	List.objects.all().delete()
	return Response(status=status.HTTP_200_OK)
