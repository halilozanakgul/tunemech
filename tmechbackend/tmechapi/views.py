from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tmechapi.models import Song
from tmechapi.serializers import SongSerializer
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
	"""
	requests.post("https://private:286967b067503df6a9fb355aad718591@eu-north.suggestgrid.space/10716d32-555c-459d-a2b0-976104603401/v1/actions", data =
	'{ "type": "lists", "user_id": "6", "item_id":"' + request.data["current_list"][-1] + '" }'
	)
	recs= requests.post("https://private:286967b067503df6a9fb355aad718591@eu-north.suggestgrid.space/10716d32-555c-459d-a2b0-976104603401/v1/recommend/items", data =
	'{ "type": "lists", "user_id": "5"}'
	).content.decode("utf-8")
	recs = ast.literal_eval(recs)["items"]"""
	recSongs = []
	lists = [["6mICuAdrwEjh6Y6lroV2Kg", "3ZFTkvIE7kyPt6Nu3PEa7V", "2lnzGkdtDj5mtlcOW2yRtG", "1IaYWv32nFFMdljBIjMY5T", "1FKxKGONukVFXWVJxAKmlz"],
			 ["6mICuAdrwEjh6Y6lroV2Kg", "3ZFTkvIE7kyPt6Nu3PEa7V", "2lnzGkdtDj5mtlcOW2yRtG", "1FKxKGONukVFXWVJxAKmlz"],
			 ["6mICuAdrwEjh6Y6lroV2Kg", "3ZFTkvIE7kyPt6Nu3PEa7V", "2lnzGkdtDj5mtlcOW2yRtG", "1IaYWv32nFFMdljBIjMY5T"],
			 ["6mICuAdrwEjh6Y6lroV2Kg", "3ZFTkvIE7kyPt6Nu3PEa7V", "2lnzGkdtDj5mtlcOW2yRtG", "1IaYWv32nFFMdljBIjMY5T", "1FKxKGONukVFXWVJxAKmlz", "0Ji2g9AlYLVHAMG5PJoHPU"],
			 ["6mICuAdrwEjh6Y6lroV2Kg", "3ZFTkvIE7kyPt6Nu3PEa7V", "2lnzGkdtDj5mtlcOW2yRtG", "0Ji2g9AlYLVHAMG5PJoHPU"],
			 ["6mICuAdrwEjh6Y6lroV2Kg", "0Ji2g9AlYLVHAMG5PJoHPU"],
			 ["69RoAhDqFOiQb2pQvb24Ii", "1p8Po4X9rWvMOuGR2vhVI2", "2oLjhx7w8Hyd3gry9cCXr7", "29W4Yr3WWYRHgUjnvg2S8C"],
			 ["69RoAhDqFOiQb2pQvb24Ii", "1p8Po4X9rWvMOuGR2vhVI2", "29W4Yr3WWYRHgUjnvg2S8C"],
			 ["69RoAhDqFOiQb2pQvb24Ii", "1p8Po4X9rWvMOuGR2vhVI2", "2oLjhx7w8Hyd3gry9cCXr7", "29W4Yr3WWYRHgUjnvg2S8C", "4VSsmh2cHdqKhYZdRBqv3L"],
			 ["69RoAhDqFOiQb2pQvb24Ii", "1p8Po4X9rWvMOuGR2vhVI2", "1YIkJe2liZVGzSPyq6B6ij"],
			 ["69RoAhDqFOiQb2pQvb24Ii", "1p8Po4X9rWvMOuGR2vhVI2", "4VSsmh2cHdqKhYZdRBqv3L"]
			 ]
	asso = {}
	for list in lists:
		for id1 in list:
			for id2 in list:
				if id1 != id2:
					if not(id1 in asso):
						asso[id1]={}
					if not(id2 in asso[id1]):
						asso[id1][id2] = 0
					asso[id1][id2]=asso[id1][id2]+1
	recDict = {}
	for id in request.data["current_list"]:
		for rec in asso[id]:
			if not(rec in recDict):
				recDict[rec] = 0
			recDict[rec] += asso[id][rec]
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
	print(request.data)
	#requests.get("https://private:286967b067503df6a9fb355aad718591@eu-north.suggestgrid.space/10716d32-555c-459d-a2b0-976104603401")
	#requests.put("https://private:286967b067503df6a9fb355aad718591@eu-north.suggestgrid.space/10716d32-555c-459d-a2b0-976104603401/v1/types/lists")
	for song in request.data["list"]:
		print(requests.post("https://private:286967b067503df6a9fb355aad718591@eu-north.suggestgrid.space/10716d32-555c-459d-a2b0-976104603401/v1/actions", data =
		'{ "type": "lists", "user_id": "5", "item_id":"' + song + '" }'
		).content)
	return Response(status=status.HTTP_200_OK)
