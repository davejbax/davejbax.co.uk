---
layout: default
title: Portfolio &middot; Dave Baxter
---

## Portfolio

Here's some of the stuff that I've done over the years.

### Timeshare

[![Timeshare](/assets/img/timeshare.png){:class="img-small"}](/assets/img/timeshare.png){:target="_blank"}

Timeshare is a tiny web app that aims to be like [Splitwise](https://www.splitwise.com/) for on-call hours. There's nothing super fancy here: it's a web app built with [SvelteKit](https://svelte.dev/) and PostgreSQL. Mostly, I wanted to see what all of the hype was about with SvelteKit, and build something cool and practical for my colleagues in the process.

### Stonks

[![Stonks](/assets/img/stonks.png){:class="img-small"}](/assets/img/stonks.png){:target="_blank"}

For my final year University project, I embarked on a mission to scientifically determine whether the
collective minds of Twitter could be used to predict the stock market.

While this was something that had been assessed in the literature before, the analyses often focused on a small subset of tweets,
machine learning methods, or stock symbols. For my project, I decided to go big and looked at **9 million tweets** and **4,612 stock symbols**.

This involved large-scale data collection, aggregation, and preparation; feature engineering, selection, and scaling; and the application and tuning of several machine learning
and statistical models, including **neural network-based** (CNNs, RNNs), **ensemble** (random forests), and **conventional** (ARIMA, exponential smoothing) models.

If this sounds vaguely interesting, the paper is available [here](/assets/pdf/stonks.pdf).

### Advent of Code

Okay, this isn't really a portfolio item, but I couldn't resist mentioning it because it was so much fun.

In recent years, I got bored of doing the [Advent of Code](https://adventofcode.com/) in so-called 'sensible' languages.
So, in 2022, I decided to do it in [Google Sheets](https://github.com/davejbax/adventofcode2022) &mdash; without macros or anything fancier than a
few formulas. I had to stop on day 7, by which point I had started writing a compiler that would generate an Excel
spreadsheet from a sort of pseudocode, when I realised that it had been a while since I'd been outside.

In 2023, I tried to use [Terraform](https://github.com/davejbax/adventofcode2023). It may surprise you to know that
this actually wasn't much easier than Google Sheets, and I unfortunately only made it as far as day 5 before my free
time started to be eroded.

In 2024, I <del>ran out of ideas</del> decided to take a break. Watch this space to see what I'll cook up for 2025.

### LetMePass

[![LetMePass](/assets/img/letmepass-0.png){:class="img-small"}](/assets/img/letmepass-0.png){:target="_blank"}
[![LetMePass](/assets/img/letmepass-1.png){:class="img-small"}](/assets/img/letmepass-1.png){:target="_blank"}
[![LetMePass](/assets/img/letmepass-2.png){:class="img-small"}](/assets/img/letmepass-2.png){:target="_blank"}

LetMePass is a **password manager** for Android, developed as part of my A-Level
computer science coursework. The app features strong cryptography *(AES-256 w/ GCM, Argon2)*,
Google Drive cloud-sync, and password [breach checking](https://haveibeenpwned.com/Passwords).
It is also fully free and [open source](https://github.com/davejbax/letmepass).

&nbsp;

### DefianceCraft

DefianceCraft was an [award-winning](https://www.planetminecraft.com/blog/the-planet-awards-category-servers/) **Minecraft** server
that I operated with a colleague from 2011-2017.
I developed an array of **bespoke software** to run on the server and provide
unique features to players, boosting server popularity and revenue, and distinguishing DefianceCraft
from the competition.

To support the **hundreds of thousands** of unique players, I developed server-side software in Java;
websites, using a variety of technologies; and administered our MongoDB database and server fleet. I also dabbled in
protocol analysis (to support new game features before official APIs became available).

Some of the project's more recent codebase can be viewed on [Github](https://github.com/defiancecraft).
