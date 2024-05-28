# Github Actions Configuration Notes

- Github Actions deployment is set up as two jobs because the local installer build needs to be generated on a Windows Runner while the Linux based container build needs to be generated on a Linux runner.
- Unfortunately this means we can't get quite as smooth of an experience with Semantic Release, trust me, I tried this first. Not viable. This compromise isn't a big deal though.
- Note that because of some painful versioning issues, the Semantic Release github actions plugin has to run in a Node 14 context. I've probably lost hours in trying to make it behave in various projects, including here, and this is just the best way to do it. Note that we use the Node 18 context that NextJS requires to do the static build of the site, and since that static build is what is fed into the Tauri app, it does the job.
