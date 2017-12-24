from elasticsearch import Elasticsearch
import certifi
import json

def lambda_handler(event, context):
	print(event)
	host = 'https://search-textwifi-jhk6t4hsbrgwl4636zeyrabk74.us-east-1.es.amazonaws.com'
	es = Elasticsearch([host], ca_certs=certifi.where())
	#data_string = json.dumps(event["queryStringParameters"]["getDataString"])
	data_string = event["queryStringParameters"]["getDataString"].encode('utf-8')
	data = json.loads(data_string)
	loc = data["location"]
	loc_type = data["loc_type"]
	print(loc)
	print(loc_type)
	if loc_type:
		q = {
			"query": {
				"bool" : {
					"must" : {
						"match" : {"loc_type": loc_type}
					},
					"filter" : {
						"geo_distance" : {
							"distance" : "5km",
							"location" : loc
						}
					}
				}
			}
		}
	else:
		q = {
			"query": {
				"bool" : {
					"must" : {
						"match_all" : {}
					},
					"filter" : {
						"geo_distance" : {
							"distance" : "2km",
							"location" : loc
						}
					}
				}
			}
		}
		
	response = es.search(index="wifi", doc_type="hotspot", body=q) 
	print(response)
	json_response = {
		"statusCode": 200,
		"headers":{
				"Access-Control-Allow-Origin": "*"
		},
		"body": json.dumps(response)
	}
	return json_response