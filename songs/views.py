# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse
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


def player(request):
    template = get_template('player.html')
    context = {}
    html = template.render(context)
    return HttpResponse(html)
