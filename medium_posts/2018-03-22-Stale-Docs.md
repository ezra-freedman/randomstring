---
title: Stale Docs
author: Ezra Freedman
date: 2018-03-22T16:53:58.520Z
url: https://medium.com/random-string/stale-docs-61fdef8c1653
subtitle: Documentation and tutorials are an important part of your customers’ experience. Give them the attention they deserve.
---

![](./medium_posts/images/Stale-Docs/1_8TOisNOT5lvUHhASp2jhwg.jpg)

Amazon Web Services (AWS) is an industry-defining and dynamic business. In their most recent quarter (Q4 2017), AWS alone reported $5.1B in revenue. They launched 1430 “significant new services” in 2017 — that’s almost 4 per day! While clearly there’s some subjectivity as to what constitutes a “significant new service,” that still represents a lot of new offerings.

I applaud and appreciate AWS for their innovation, compliance offerings, robust featureset, availability of computing resources, and many other things. I wish, however, that they would put more care into their documentation, tutorials and UI.

### 10-Minute Tutorials

In this post, I will focus on their [10-Minute Tutorials](https://aws.amazon.com/getting-started/tutorials/), which are presented   
above the fold on the Amazon Web Services home page.
![](./medium_posts/images/Stale-Docs/0_GFdE4AF_AnquAsMd.png)
I picked two tutorials to follow: “Create and Connect to a PostgreSQL Database with Amazon RDS” and “Launch a Linux Virtual Machine with Amazon EC2” to see if they are current and correct.

Right off the bat, I noticed inconsistencies. For the PostgreSQL tutorial, the first step is to “Enter the RDS Console”.

![](./medium_posts/images/Stale-Docs/0_2ayR5KzUYCm6i6Su.png)

The problem?: **There’s no mention of RDS on the console**

Luckily, I’m reasonably familiar with AWS, and know that the acronym RDS stands for **R** elational **D** atabase _something_ so I locate and select “Relational Database Service” from the menu.

As I worked through the tutorial, every single screenshot, though presented with red boxes to annotate the intended action, was out of date. As an example, on the screenshot, the “Launch DB Instance” button is blue and on the left. On the current console, it’s orange and on the right.

![](./medium_posts/images/Stale-Docs/0_TAvZlRJWxRg8BcIY.png)

![](./medium_posts/images/Stale-Docs/0_MC8EDAHhvnZuJzVD.png)

Additionally, outdated copy abounds. I am instructed to “Leave the default value of `default.postgres9.4`” for DB parameter group. There is no such option (it’s now “`default.postgres9.6`”). Similarly, for DB option group, I am instructed to select “`default.postgres-9.4`”. In this case, neither the format nor version match the UI — I am only given the option of “`default:postgres-9.6`”.

The EC2 tutorial had similar issues. On step 2, I am instructed to save a key pair as `~/.ssh/MyKeyPair.pem`, but then in step 3, to execute `chmod 400 ~/.ssh/mykeypair.pem` (note the difference in capitalization). While the filesystem on my Mac, APFS, is case-insensitive (so this command works), many filesystems are case-sensitive, including ext4, which means that the prescribed command fails on my Linux box.

## Why does it matter?

While these errata may seem minor, I think they should be fixed, for the following reasons:

  1. Stale docs can indicate a broader institutional problem. **If they can’t keep their docs in order, why should I trust them with my data?**
  2. Stale docs can serve as a deterrent to customer adoption. **Are potential customers getting frustrated and giving up?**
  3. Stale docs are often easy to fix. **It’s not rocket science.**

## Is anyone doing it right?

I recently explored [Heroku’s Platform as a Service offering](https://www.heroku.com/platform), and it quickly became apparent that this is a company that’s paying a lot of attention to docs. In addition to the tutorials I followed being well-written and current, there are two interesting things to highlight:

  * Note the “Last updated” date in the following screenshot. What an elegant way to show that you’re either maintaining (or not maintaining) your documentation._(In addition to the presence of the dates, I found them to be quite current)._

![](./medium_posts/images/Stale-Docs/1_e3p4cn1QvKGjuFe1Zf4dyg.png)

  * Note the “Report a problem” link. Present on each step of their “Getting Started” tutorials, this gives you an easy way to provide feedback. _(I can’t vouch as to how responsive they are to the feedback collected here, but this seems like a smart idea)._

![](./medium_posts/images/Stale-Docs/1_iR4KJcnz8F9qYzdPswak5A.png)

### Strategies to avoid this problem
* **Open-source the docs.** There may be members of the community who would be glad to help keep your tutorials in order. Why not open-source them, allow users to submit bugs and pull requests to help out?
* **Build doc review into the release process.** Don’t let them get out of date in the first place.
* **Only use screenshots when necessary.** Having less to update makes it easier to stay current.

## Summary
Documentation and tutorials are an important part of your customers’ experience. Give them the attention they deserve.