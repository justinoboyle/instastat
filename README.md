# [instastat](https://npmjs.com/instastat)

An insights toolbox for Instagram. 🔧

![NPM Version](https://img.shields.io/npm/v/instastat.svg)

## Features

  * Export follower, like, and feed data.
  * Public or private API login
  * Output data into json or csv.
  * Scriptable

## Getting Started

#### Installation

```bash
$ npm i -G instastat
```

#### Authentication

You can get started by using the interactive utility to setup a session like so, and following the onscreen instructions.

```bash
$ istat init
```

This will output an `istat-auth.json` (or whatever you choose to name it) in the home directory (or wherever you choose to save it).

You can use this for authentication with instastat.

If you did not save your `istat-auth.json` in your home directory (`~/istat-auth.json`), you must specify this to instastat using the `ISTAT-AUTH` environment variable. You probably want to put this in your `.bashrc` or the like.

```bash
ISTAT-AUTH=~/auth/instagram.json
```

## Examples

Export a full list of followers to a .csv file:

```bash
$ istat --export followers --user @example --format csv > file.csv
$ cat file.csv
username,fullname,about,followercount,followingcount
@genericuser,"Generic User","I am a generic user",300,320
```