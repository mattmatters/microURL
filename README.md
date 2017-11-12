# [Kinda Small Url](http://kindasmallurl.fun)
[![pipeline status](https://gitlab.com/mattmatters/microURL/badges/master/pipeline.svg)](https://gitlab.com/mattmatters/microURL/commits/master)
 [![Build Status](https://travis-ci.org/mattmatters/microURL.svg?branch=master)](https://travis-ci.org/mattmatters/microURL)

_Totally_ original service of generating a url that is sort of small.

Go tell your neighbors!

## Running

```bash
git clone https://github.com/mattmatters/microURL.git
cd microURL
docker pull mongo
docker run --name bad_db -p 27017:27017 -d mongo
npm install
npm start
```

Head to http://localhost:3000/ to see it in action.

## Acknowledgements
I made this a long time ago, upon browsing through my old legacy projects I found this one.

It has since been polished up, linked into a CI build, and deployed with a domain name.

However this is still an old project that was mainly used to learn Node.js and Express at the time.
