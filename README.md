# Who Pays Technical Writers?

Who Pays Technical Writers is a project that aims to collect every good recurring opportunity to get paid to write technical content. The site lists publications, publishers, and agencies that pay for technical content and accept cold pitches.

To contribute a fix (dead link update, copy correction, etc) to the site, please open an issue or pull request. Do the same if you want to contribute a feature. To request a publication be added, you can use the form on the site itself, but pull requests and issues are also accepted.

TODO:

* Favicon
* Preview description, image, etc (twitter card, og:description, etc)
* Netlify Function
* Deploy/live
* Analytics (incl link to parametered philipkiely.com)


## Setup

Develop Who Pays Technical Writers in N steps:

1. Clone the repository.
2. Make a Python virtual environment
3. Run `pip install -r requirements.txt`

That's it! You're all set up and ready to go.

## Development

Who Pays Technical Writers is a static site that is generated from Jinja templates. It also relies on a Netlify function to forward submitted sites to Philip Kiely to review.

To develop, open two terminal tabs in this directory.

* In the first, run `python build/build.py --dev` (leave it running)
* In the second, run `sh build/build.sh` (again, leave it running)

You can quit these with control-c.

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

Make changes. Every time you save, the build script will update the website, and you can see the changes by reloading the webpage.

### Git

The branch `main` is the unified development branch. The live site is served from `prod`. All pull requests should come from a branch with a descriptive name.

All pull requests must be squashed into a single commit before rebasing on top of `main` and pushing. NEVER force-push `main`, if you're in a situation where that would be necessary that means you're trying to do something wrong.

### HTML

Do not edit `index.html` or `form.html` in the main folder directly. Any such edits would be overwritten by the build script.

Instead, edit HTML in the `/src` folder. We use [Jinja](https://jinja.palletsprojects.com/en/2.11.x/) as a templating language. Put everything shared in `base.html` and the minimum necessary for each page in the page's own HTML file.

### CSS

We use [Bootstrap 5](https://getbootstrap.com) for CSS.

Bootstrap also gives us icons.

We get Bootstrap by CDN.

### Images

Any images go in `/img`.

### JavaScript

We use vanilla JavaScript for a few basic operations:

* Submitting the form
* Searching the data
* Filtering the data
* Pagination

The functions can be found in the `/js` folder.

JavaScript for Bootstrap 5 is also loaded.

Data is stored in (json || javascript).

### Python

The script in `/build` is written in Python. Setup and usage instructions are above.

fns: TODO

### Netlify

TODO

## About

Who Pays Technical Writers was developed by [Philip Kiely](https://philipkiely.com) and [Jeev Prayaga](https://jeev.me). It is open source under the MIT License.