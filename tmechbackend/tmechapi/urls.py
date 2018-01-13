from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from tmechapi import views

urlpatterns = [
	url(r'^songs/$', views.song_list),
	url(r'^song/(?P<pk>[0-9]+)$', views.song_detail),
]

urlpatterns = format_suffix_patterns(urlpatterns)