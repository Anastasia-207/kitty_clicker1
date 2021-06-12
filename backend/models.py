from django.contrib.auth.models import User
from django.db import models


class MainCycle(models.Model):
    user = models.ForeignKey(User, related_name='cycle', null=False, on_delete=models.CASCADE)
    coins_count = models.IntegerField(default=0)
    auto_click_power = models.IntegerField(default=0)
    click_power = models.IntegerField(default=1)
    level = models.IntegerField(default=0)

    def save_main_cycle(self, coins_count):
        self.coins_count = coins_count
        return self.is_new_level()

    def is_new_level(self):
        if self.coins_count > (self.level ** 2 + 1) * 1000:
            self.level += 1
            boost_type = 1
            if self.level % 2 == 0:
                boost_type = 0
            boost = Boost(main_cycle=self, boost_type=boost_type, level=self.level)
            boost.save()
            return True
        return False


class Boost(models.Model):
    main_cycle = models.ForeignKey(MainCycle, related_name='boosts', null=False, on_delete=models.CASCADE)
    level = models.IntegerField(null=False)
    power = models.IntegerField(default=1)
    price = models.IntegerField(default=10)
    boost_type = models.IntegerField(default=1)

    def update(self):
        if self.main_cycle.coins_count >= self.price:
            self.main_cycle.coins_count -= self.price
            if self.boost_type == 1:
                self.main_cycle.click_power += self.power
                self.price *= 5
            else:
                self.main_cycle.auto_click_power += self.power
                self.price *= 10
            self.power *= 2
            self.main_cycle.save()
            self.save()
        return self.main_cycle, self.level, self.price, self.power
