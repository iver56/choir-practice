# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import get_template

from songs.models import Song


def index(request):
    template = get_template('index.html')

    songs = Song.objects.all()

    context = {
        'songs': songs
    }
    html = template.render(context)
    return HttpResponse(html)


def player(request, song_id):
    song = get_object_or_404(Song, pk=song_id)
    template = get_template('player.html')
    context = {
        'song': {
            'id': song.id,
            'name': song.name,
            'midi_file': song.midi_file
        }
    }
    html = template.render(context)
    return HttpResponse(html)
