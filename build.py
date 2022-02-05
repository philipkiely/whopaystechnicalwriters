import os
import signal
import subprocess
import sys
import time
from jinja2 import Environment, FileSystemLoader, select_autoescape
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

###############
# JINJA BUILD #
###############

def render_page(env, page):
    html = env.get_template(page).render()
    f = open("dist/"+page, "w")
    f.write(html)
    f.close()

def jinja():
    env = Environment(
        loader=FileSystemLoader(
            ["src/"]),
        autoescape=select_autoescape(["html", "xml"]),
        auto_reload=True
    )
    render_page(env, "index.html")
    render_page(env, "form.html")
    print("Jinja Built")

def static():
    os.system("cp -r css dist/")
    os.system("cp -r js dist/")
    os.system("cp -r img dist/")
    print("Static Copied") 

def clean_dist():
    if os.path.exists("dist"):
        os.system("rm -r dist/*")
    else:
        os.makedirs("dist")

###############
# LIVE RELOAD #
###############

class Watcher:

    def __init__(self, directory=".", handler=FileSystemEventHandler()):
        self.observer = Observer()
        self.handler = handler
        self.directory = directory

    def run(self):
        self.observer.schedule(
            self.handler, self.directory, recursive=True)
        self.observer.start()
        print("Watcher Running in {}/".format(self.directory))
        try:
            while True:
                time.sleep(1)
        except:
            self.observer.stop()
        self.observer.join()
        print("\nWatcher Terminated")


class WPTWHandler(FileSystemEventHandler):

    def on_any_event(self, event):
        if event.is_directory or "/dist/" in event.src_path:
            return None
        if "/src/" in event.src_path:
            jinja()
        elif ("/css/" in event.src_path or "/js/" in event.src_path or "/img/" in event.src_path):
            static()


##################
# NETLIFY DEPLOY #
##################

def build_site():
    clean_dist()
    jinja()
    static()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: `python build.py --dev` or `python build.py --prod`")
        exit
    elif sys.argv[1] == "--prod":
        build_site()
        print("WPTW Built")
    elif sys.argv[1] == "--dev":
        print("Initializing WPTW")
        src_watcher = Watcher(".", WPTWHandler())
        build_site()
        server_proc = subprocess.Popen(["npx", "netlify", "dev"])
        src_watcher.run()
        if server_proc.pid:
            os.kill(server_proc.pid, signal.SIGTERM)
    else:
        print("Usage: `python build.py --dev` or `python build.py --prod`")
        exit
