import sys
import csv
from elasticsearch import Elasticsearch

def main():
	es = Elasticsearch(['https://search-textwifi-jhk6t4hsbrgwl4636zeyrabk74.us-east-1.es.amazonaws.com'])

	with open(sys.argv[1], 'rb') as f:
		freader = csv.reader(f)
		next(freader, None)
		for row in freader:
			hotspot = {}
			hotspot["name"] = row[1] + " Starbucks"
			hotspot["strength"] = "0"
			hotspot["location"] = {
				"lat": float(row[15]),
				"lon": float(row[16])
			}
			hotspot["loc_type"] = "coffee"
			print(hotspot)
			response = es.index(index='wifi', doc_type='hotspot', body=hotspot)
			print(response)

main()