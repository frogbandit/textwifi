from twilio.rest import Client
import json

def lambda_handler(event, context):
		print(event)
		print(context)
		
		print(event["body"])
		print(type(event["body"]))
		data_string = event["body"].encode('utf-8')
		print(data_string)
		data = json.loads(data_string)
		print(data)
		print(type(data))
		
		phone = "(949)554-5535"
		wifi_string = "Here are your wifi hotspots!\n"

		print(data["items"])
		for i in range(0, len(data["items"])):
			wifi = data["items"][i]
			print(wifi)
			if "name" in wifi:
				wifi_name = wifi["name"]
				wifi_string += (str(wifi_name) + "\n")
			else:
				print("phone changed")
				phone = str(wifi["phone"])
	

		with open('twilio_auth.txt') as f:
			lines = f.read().splitlines() 
			
		account_sid = lines[0]
		auth_token = lines[1]

		client = Client(account_sid, auth_token)

		#message to client
		message = client.messages.create(to=phone, from_="(509)774-2976",
				body=wifi_string)
				
		response = {
				"statusCode": 200,
				"headers": {
				"Access-Control-Allow-Origin": "*"
				},
				"body": '{"success": "success"}'
		}
		
		return response
		# return 'Hello from Lambda'
