# Who Pays Technical Writers?

Who Pays Technical Writers is a project that aims to collect every good recurring opportunity to get paid to write technical content. The site lists publications, publishers, and agencies that pay for technical content and accept cold pitches.

To contribute a fix (dead link update, copy correction, etc) to the site, please open an issue or pull request. Do the same if you want to contribute a feature. To request a publication be added, you can use the form on the site itself, but pull requests and issues are also accepted.


## Setup

Develop Who Pays Technical Writers in N steps:

1. Clone the repository.
2. Make a Python virtual environment
3. Run `pip install -r requirements.txt`

That's it! You're all set up and ready to go.

If you want to submit the form in development, you'll need a [GitHub Token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) set as an environment variable `GITHUB_TOKEN`.

## Development

Who Pays Technical Writers is a static site that is generated from Jinja templates. It also relies on a Netlify function to forward submitted sites to Philip Kiely to review. (The previous sentence is not yet true)

Activate your virtual environment with `workon wptw`.

With the virtual environment active, run `python build.py --dev`. This will launch the live reload script and preview server (netlify dev) and will load the page.

You can quit the server with control-c.

If it did not automatically open, use a web browser to go to [http://127.0.0.1:8888](http://127.0.0.1:8888). But Netlify dev launches the page reliably. So if it doesn't pop up, there might be a bigger problem.

Make changes. Every time you save, the build script will update the website, and you can see the changes by reloading the webpage. Watch the terminal for server logs and any build script errors.

### Git

The branch `main` is the unified branch. The live site is served from `main`. All pull requests should come from a branch with a descriptive name.

All pull requests must be squashed into a single commit before rebasing on top of `main` and pushing. NEVER force-push `main`, if you're in a situation where that would be necessary that means you're trying to do something wrong.

### HTML

Do not edit `index.html` or `form.html` in the `dist` folder directly. Any such edits would be overwritten by the build script.

Instead, edit HTML in the `/src` folder. We use [Jinja](https://jinja.palletsprojects.com/en/2.11.x/) as a templating language. Put everything shared in `base.html` and the minimum necessary for each page in the page's own HTML file.

### CSS

We use [Bootstrap 5](https://getbootstrap.com) for CSS.

Bootstrap also gives us icons.

We get Bootstrap by CDN.

### Images

Any images go in `/img`.

### JavaScript - Client

We use vanilla JavaScript for a few basic operations:

* Submitting the form
* Searching the data
* Filtering the data
* Pagination

The functions can be found in the `/js` folder.

JavaScript for Bootstrap 5 is also loaded.

Data is stored in data.json and should be read into index.js.

Object Structure (Bold is required):

* **name**: the name of the site
* **type**: one of publication (they pay for articles), publisher (they make book deals), agency (they find technical content work on hourly or project basis)
* **link**: a URL to find out more information
* contact: an email address to submit pitches
* topics: an array of topics covered, at most 3. Try to stay standardized, but search is full-text. Good general options are:
  * Front-End Development
  * Back-End Development
  * Data Science
  * Infrastructure
* minRate: The minimum a publication or agency pays for an article (int)
* maxRate: The most a publication or agency pays for an article <3,000 words (int) (default if there's not a range)
* royaltyRate: A publisher's royalty structure (string)
* hourlyMinRate: An agency's hourly rate (min) (int)
* hourlyMaxRate: An agency's hourly rate (max) (int) (default if there is not a range)
* notes: A string of at most 140 characters.

The json file itself does not need to be alphabetized (it may be though) but the data should render in alpha order on the website by default.

### JavaScript - Functions

The `functions` directory has a Netlify function in it, deployed with the default configuration.

### Python

The script `build.py` is written in Python. Setup and usage instructions are above.

### Netlify

The `main` branch of this directory deploys to Netlify as configured by `netlify.toml`.

## About

Who Pays Technical Writers was developed by [Philip Kiely](https://philipkiely.com) and [Jeev Prayaga](https://jeev.me). It is open source under the MIT License.