"""
This file checks that links are valid by making sure they return 200.
It prints a list of all non-200 return codes.

You can also use validate with the --open option to open every resource link.
Please note that this requires a relatively powerful computer as it will attempt
to open over 100 webpages at once.
"""
import sys
import os
import json
import requests

def get_urls():
    with open("js/data.json", "r") as f:
        data = f.read()
    sites = json.loads(data)
    return [site["link"] for site in sites]

def check_404s():
    urls = get_urls()
    for url in urls:
        try:
            resp = requests.get(url)
            if resp.status_code != 200:
                print(f"{resp.status_code}: {url}")
        except:
            print(f"error: {url}")
    print("\n---DONE---\n")

def open_all():
    urls = get_urls()
    for url in urls:
        os.system(f"open {url}")

if __name__=="__main__":
    if len(sys.argv) == 2:
        open_all()
    else:
        check_404s()