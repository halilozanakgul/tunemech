from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from tmechapi import views

urlpatterns = [
	url(r'^songs/$', views.list_songs),
	url(r'^song/(?P<pk>[0-9]+)/$', views.song_detail),
	url(r'^newsong/$', views.new_song),
]
