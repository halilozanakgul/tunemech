from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tmechapi.models import Song
from tmechapi.serializers import SongSerializer

@api_view(['GET', 'POST'])
def song_list(request, format=None):
	"""
		List all songs or create a new one.
	"""
	if request.method == 'GET':
		songs = Song.objects.all()
		serializer = SongSerializer(songs, many=True)
		return Response(serializer.data)
	elif request.method == 'POST':
		serializer = SongSerializer(data=request.data)
		if serializer.is_valid():
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def song_detail(request, pk, format=None):
	"""
		Get, put or delete song.
	"""
	try:
		song = Song.objects.get(pk=pk)
	except Song.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = SongSerializer(song)
		return Response(serializer.data)

	elif request.method == 'PUT':
		serializer = SongSerializer(song, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	elif request.method == 'DELETE':
		song.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)		