# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class Song(models.Model):
    midi_file = models.FileField()
    name = models.CharField(max_length=128)
    note_pdf_file = models.FileField(null=True, blank=True)
    time_created = models.DateTimeField(auto_now_add=True, auto_now=False, null=True, blank=True)
    time_updated = models.DateTimeField(auto_now_add=False, auto_now=True, null=True, blank=True)
