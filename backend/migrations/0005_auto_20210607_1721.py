# Generated by Django 3.2 on 2021-06-07 12:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_boost_boost_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='boost',
            old_name='mainCycle',
            new_name='main_cycle',
        ),
        migrations.RenameField(
            model_name='maincycle',
            old_name='autoClickPower',
            new_name='auto_click_power',
        ),
        migrations.RenameField(
            model_name='maincycle',
            old_name='clickPower',
            new_name='click_power',
        ),
        migrations.RenameField(
            model_name='maincycle',
            old_name='coinsCount',
            new_name='coins_count',
        ),
    ]
