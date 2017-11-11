# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class Song(models.Model):
    name = models.CharField(max_length=128)
    midi_file = models.FileField()
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False, null=True, blank=True)
    time_updated = models.DateTimeField(auto_now_add=False, auto_now=True, null=True, blank=True)
