# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-11-11 11:57
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('songs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='time_created',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='song',
            name='time_updated',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]
