from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from tmechapi import views

urlpatterns = [
	url(r'^songs/$', views.list_songs),
	url(r'^song/(?P<pk>[0-9]+)/$', views.song_detail),
	url(r'^addsong/$', views.add_song),
	url(r'^search_songs/$', views.search_songs),
	url(r'^get_rec/$', views.get_recommendations),
	url(r'^lists/$', views.list_lists),
	url(r'^add_list/$', views.add_list),
]
