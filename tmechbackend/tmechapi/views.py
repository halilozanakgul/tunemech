from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tmechapi.models import Song, User
from tmechapi.serializers import SongSerializer, UserSerializer

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

@api_view(['GET'])	
def list_users(request):
	"""
		List all users.
	"""
	users = User.objects.all()
	serializer = UserSerializer(users, many=True)
	return Response(serializer.data)

@api_view(['GET'])
def user_detail(request, pk):
	"""
		Get user details.
	"""
	try:
		user = User.objects.get(pk=pk)
	except User.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	serializer = UserSerializer(user)
	return Response(serializer.data)

@api_view(['POST'])
def follow_song(request, pk):
	"""
		Add the song pk to the songs of request.userid.
	"""

	try:
		song = Song.objects.get(pk=pk)
		user = User.objects.get(pk=request.data['userid'])
	except User.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	except Song.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	user.songs.add(song)
	return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
def unfollow_song(request, pk):
	"""
		Remove the song pk to the songs of request.userid.
	"""

	try:
		song = Song.objects.get(pk=pk)
		user = User.objects.get(pk=request.data['userid'])
	except User.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	except Song.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	user.songs.remove(song)
	return Response(status=status.HTTP_200_OK)