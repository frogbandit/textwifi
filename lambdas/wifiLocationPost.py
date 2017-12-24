from elasticsearch import Elasticsearch
import certifi

def lambda_handler(event, context):
	host = 'https://search-textwifi-jhk6t4hsbrgwl4636zeyrabk74.us-east-1.es.amazonaws.com'
	es = Elasticsearch([host], ca_certs=certifi.where())
	loc = event[0]["location"]
	q = {
		"query": {
			"bool" : {
				"must" : {
					"match_all" : {}
				},
				"filter" : {
					"geo_distance" : {
						"distance" : "0.1km",
						"location" : loc
					}
				}
			}
		}
	}
	
	response = es.delete_by_query(index='wifi', doc_type='hotspot', body=q)
	print(response)
	
	for w in event:
		print(w)
		hotspot = {}
		hotspot["name"] = str(w["name"])
		hotspot["strength"] = int(w["strength"])
		hotspot["location"] = w["location"]
		hotspot["loc_type"] = str(w["loc_type"])
		response = es.index(index='wifi', doc_type='hotspot', body=hotspot)
		
	return response