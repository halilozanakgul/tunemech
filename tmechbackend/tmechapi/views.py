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
	client_credentials_manager = SpotifyClientCredentials(client_id='9c7ae6e5a6c749bc88b05df636651355', client_secret='d19a691541b7409380a1282a25a36364')
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


@api_view(['POST'])
def get_recommendations(request):
	"""
		Returns the recommendations for the songs
	"""
	recSongs = []
	lists = List.objects.all()
	asso = {}
	for list in lists:
		list1 = list.songs.all()
		list2 = list.songs.all()
		for song1 in list1:
			id1 = song1.spotify_id
			for song2 in list2:
				id2 = song2.spotify_id
				if id1 != id2:
					if not(id1 in asso):
						asso[id1]={}
					if not(id2 in asso[id1]):
						asso[id1][id2] = 0
					asso[id1][id2]=asso[id1][id2]+1
	recDict = {}
	print("--------")
	for id in request.data["current_list"]:
		for rec in asso[id]:
			if not(rec in recDict):
				recDict[rec] = 0
			recDict[rec] += asso[id][rec]
	for id in request.data["current_list"]:
		if id in recDict:
			del recDict[id]
	sortedDict = sorted(recDict.items(), key = operator.itemgetter(1))
	recs = []
	for tup in reversed(sortedDict):
		recs.append(tup[0])
	for song in recs:
		recSongs.append(Song.objects.get(pk=song))
	serializer = SongSerializer(recSongs, many=True)
	return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_list(request):
	"""
		Posts the list to recommendation database
	"""
	list = List()
	list.save()
	for id in request.data["list"]:
		song = Song.objects.get(pk=id)
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
