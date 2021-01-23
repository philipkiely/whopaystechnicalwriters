import os
import subprocess
import sys
import time
from jinja2 import Environment, FileSystemLoader, select_autoescape
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

###############
# JINJA BUILD #
###############

def render_page(root, env, page):
    html = env.get_template(page).render()
    f = open(root+page, "w")
    f.write(html)
    f.close()
    return

def jinja():
    root = os.path.dirname(os.path.realpath(__file__))[:-5]
    env = Environment(
        loader=FileSystemLoader(
            [root+"src/"]),
        autoescape=select_autoescape(["html", "xml"]),
        auto_reload=True
    )
    render_page(root, env, "index.html")
    render_page(root, env, "form.html")
    print("Jinja Built")
    return


###############
# LIVE RELOAD #
###############

class Watcher:
    DIRECTORY_TO_WATCH = os.path.dirname(os.path.realpath(__file__))[:-5]


    def __init__(self):
        self.observer = Observer()

    def run(self):
        event_handler = Handler()
        self.observer.schedule(
            event_handler, self.DIRECTORY_TO_WATCH, recursive=True)
        self.observer.start()
        try:
            while True:
                time.sleep(1)
        except:
            self.observer.stop()
            print("Error")

        self.observer.join()


class Handler(FileSystemEventHandler):

    @staticmethod
    def on_any_event(event):
        if event.is_directory:
            return None
        elif event.event_type == 'modified' or event.event_type == 'created' or event.event_type == 'deleted':
            if "src" in event.src_path:
                jinja()


##################
# NETLIFY DEPLOY #
##################

def deploy():
    pass

if __name__ == '__main__':
    if sys.argv[1] == "--dev":
        print("Who Pays Technical Writers Development Environment Active")
        jinja()
        w = Watcher()
        w.run()
    elif sys.argv[1] == "--prod":
        deploy()
        print("Deployed Who Pays Technical Writers to Netlify")
    else:
        print("Accepted arguments: --dev, --prod")
