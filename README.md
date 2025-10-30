# Gift Economy Logistics Application

## Table of Contents

- [Local Setup](#local-setup)
- [Project Overview](#project-overview)
- [Contribution Guide](#contribution-guide)
- [Development Roadmap](#development-roadmap)

## Local Setup

1. Ensure that you have npm and node installed.
2. Run `cp ./server/.env_EXAMPLE ./server/.env`
3. Ensure that you have a MongoDb server installed locally, or go to `./server/.env` and enter your own connection string.
4. Generate a secret and assign it to the `JWT_SECRET` env variable in `./server/.env`.
5. Run `npm i` to install depedencies.
6. Run `npm run dev` to start the web client and the web server.

## Project Overview

The cycle of money to commodities to money again is one that encourages lower hourly wages, increases the divide between rich and poor, rewards greed over environmental and community well-being, and ultimately allows those with power to retain power despite any social costs.

Gift Economies, as well as debt systems, were primarily used before the introduction of money into human society. If you've ever started a communal chest in minecraft, given someone clothes you no longer want, or bummed a cigarette you've participated in one. At its simplest, individuals in a gift economy ask for what they need from others and give excess of whatever they produce to whoever needs it.

Gift economies are built on abundance, whereas market economies are built on scarcity (often times artifically created). The invention of money has many advantages within market economies compared to gift economies powered by word of mouth. Money is somewhat regulatable by governmental entities, allows for supply and demand to be regulated in a decentralized manner through pricing, and facilitates enormous supply chains across the globe. On the other hand, word of mouth powered gift economies have very little comparative digital infrastructure built around them, and require a more direct analysis of supply and demand.

A application that utilizes supply/demand analysis, encourages communities to unite to meet these problems, facilitates the gifting and requesting of labor and resources, and eschews money entirely could possibly help us build stronger communities that are not reliant on the corporate giants of the world - who have shown their tendency to create brittle, centralized infrastructure and disregard social impact in favor of profit. The success of this project relies on several ideas:

- Decentralized facilitation of trade (to avoid power grabs that could corrupt the intent of the gift economy system).
- 'Project based' supply chain planning that spans across industry.
- Bootstrapping the maintenance and service of the project through the gift economy it supports.
- Meeting the basic needs (primarily sustenance, shelter) of those using the project's system, through the system.
- Frequency of gift delivery ie "gift" velocity (which is similar to "exchange velocity" as described in market economics).
- Analysis of demand and supply without the use of market pricing.

The idea is to start with basic and easy to meet needs like food, and push the user base towards integrating other industry supply chains over time.

## Contribution Guide

1. Install a [Matrix chat client](https://element.io/download) and join [the project's matrix page](https://matrix.to/#/#gift-economy:matrix.org)
2. DM [@ikeyates:matrix.org](@ikeyates:matrix.org) to be given repository and github project permissions.
3. Follow the [Local Setup](#local-setup) guide to run the app locally in development mode.
4. Go to [the project's kanban board](https://github.com/users/ikealmighty/projects/9), choose a task that hasn't been started, move it to the "In Progress" column, assign yourself to the task, and `create a branch` locally.
5. Create a PR when you're ready for review.

More horizontal administration will be set up as the project grows as well as a schedule for virtual standup meetings. You are welcome to DM [ikeyates:matrix.org](ikeyates:matrix.org) with inqueries in the meantime.

## Development Roadmap

After the proof of concept has been developed, the aim is to start replacing centralized architecture with a decentralized one that can be ran independently of a central server.

This project is a response to the climate crisis and to corporate greed's disregard for social costs of profit driven economies. So it does not make sense to rely on technologies that require large, centralized architectures in the long run, such as:

- Blockchain
- Large Language Models
- Centralized Servers

There of course are aspects of these technologies that can be learned from, but need to be altered before being included in this project.
