from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from .models import Statistic
from users.models import Profile

class DashboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connection')
        username = self.scope['url_route']['kwargs']['owner']

        self.username = username
        # self.username = username

        await self.channel_layer.group_add(self.username, self.channel_name)
        await self.accept()
 
   
    async def disconnect(self, close_code):
        print('disconnecting', close_code)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        # extramessage = text_data_json['extramessage']
        sender = text_data_json['sender']

        print(text_data_json['message'])
        username = self.username

        await self.save_data_item(sender, message, username)
        # qs = await self.read_data_item(username)

        await self.channel_layer.group_send(self.username, {
                'type' : 'statistics_message',
                'message': message,
                'sender': sender
            })
        

    async def statistics_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))

    @database_sync_to_async
    def create_data_item(self, sender, message, username):
        profile = Profile.objects.filter(user__username=username).first()
        result = (int(message)/100 * int(profile.balance))
        newbalance = float(profile.balance) + result
        profile.balance = newbalance
        profile.save()
        if profile.balance < 1:
            self.disconnect(self)
        # print(result, profile.balance)
        return Statistic.objects.create(owner=profile,result=result)

    async def save_data_item(self, sender, message, username):
        await self.create_data_item(sender, message, username)

    @database_sync_to_async
    def read_data_item(self, username):
        profile = Profile.objects.filter(user__username=username).first()
        statistic = Statistic.objects.filter(owner=profile).all()
        message = [x.result for x in statistic]
        return message

    async def show_data_item(self, username):
        await self.read_data_item(username)