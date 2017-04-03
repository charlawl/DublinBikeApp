# DublinBikeApp

This is the documentation for DublinBikesApplication. Here you will find all the technologies used in the software. You will also find detailed steps to get the project running on your local machine. This document also details some housekeeping rules and a coding style guide that should be used when contributing.

### Code Styleguide
We are not strictly following any coding styleguide for this application but     we have agreed on a few rules:
    - keep variable names meaningful
    - avoid single letter variables unless when used in list comprehensions

### We use the following tools :

[Appear](https://appear.in/) - Video conferencing / Standup meetings
[GoogleDocs](https://www.google.com/docs/about/) - Standup logs / Documentation / Meeting Minutes
[Trello](https://trello.com/) - Project management / Kanban / Burndown Chart
[Slack](https://slack.com/) - Instant messaging
[Git](https://git-scm.com/) and [Github](https://github.com/) - Source code management / version control

### GitFlow - Branching model for Git

We will use a watered down version of GitFlow. The main branches are:
```development``` - Development branch
```master``` - Deployed version

Code is merged into the ```master``` branch at the end of the sprint. All pull requests are made to the development branch. Branch names start with initials. The following is an example of branch naming:
```nn_create_sql_database```
```ch_store_api_stream_to_database```
```gh_display_coordinates_on_map```
e.t.c

### Merge conflicts

Merge conflicts are to be fixed on personal branches before making a pull request. This is; before making a pull request, do a ```$git pull development``` on your branch to get changes on the development branch(if any).

As a general rule, we agreed that contributors should not merge their own work. We will tag the other collaborators on pull request for them to review the code and hopefully merge it.

### Github housekeeping
The person to merge a branch should delete the branch from GitHub.

### Running the application locally
* ###### Clone the repository (might need access)
 ```$ git clone https://github.com/charlawl/DublinBikeApp.git```
 * ###### Create virtual environment
 ```$ virtualenv bikes_env```
* ###### Source bikes_env
```$ source bikes_env/bin/activate```
* ###### Install the required packages
```$ pip install -r requirements.txt```
If new packages are used, they should be appended on to the requirements.txt file
* ###### Run the app
```$ python dublinbikeapp/__init__.py```

### Testing
We are using Python's [unittest](https://docs.python.org/3/library/unittest.html#module-unittest) testing framework for unit testing. The tests can be run with the following command :
```$ python test.py -v```
