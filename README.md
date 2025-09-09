# Gift Economy Logistics Application

## Idea

Capitalism rewards those who already have money. The cycle of money to commodities to money again is one that encourages lower hourly wages, increases the divide between rich and poor, rewards greed over environmental and community well-being, and ultimately allows those with power to retain power despite any social costs.

Gift Economies were primarily used before the introduction of money into human society, and if you've ever played Minecraft with some friends you've probably participated in one. At its simplest, individuals in a gift economy ask for what they need from others and give excess of whatever they produce to whoever needs it (the communal chest for all you crafters).

Problems arise when demand for a certain item is higher than the supply. In Soviet Russia, the state oversaw the economy to avoid this kind of crisis when possible. In more modern times, Walmart and Amazon have utilized supply and demand analysis, taking into account the bullwhip effect, to create efficient internal logistical systems to make sure their stores are stocked at all times to meet the demand of consumers.

A application that utilizes supply/demand analysis, encourages communities to unite to meet these problems, facilitates the gifting and requesting of labor and resources, and eschews money entirely could possibly help us build stronger communities that are not reliant on the corporate giants of the world. The success of this project relies on several ideas:

- decentralized facilitation of trade (to avoid power grabs)
- vertical production lines (to reduce reliance on capital based systems)
- bootstrapping the maintenance and service of the project.
- meeting the basic needs (sustenance, shelter) of those using the project's system.
- speed of delivery ie "gift" velocity (which is mostly the same as exchange velocity).

The idea is to start with basic and easy to meet needs like food, and push the user base towards vertically integrating other parts of industry over time.

## Data Models

Gift, Request, User, Project

```
Gift Model:
- owner: User._id
- description: String
- titleline: String
- suggestedProjects: [Project]
```

```
Request Model:
- owner: User._id
- description: String
- titleline: String
```

```
Project Model:
- owner: User._id
- requests: [Request]
- requestSuggestions: [Request]
```

## User Interface

### Pages

/feed  
/profile

### Feed

A list of gifts, requests, and projects. Sort order tbd, but should encourage users to make connections between the three.

Each item has a button for opening a chatroom with the owner of the list item.

At the top of the feed is a create button where the user can choose to create a new project, new gift, or new request.

_Creating a Gift | The Gift Component_  
A gift is something that someone is offering on the "market". Once created, the gift component displays its title, description, image, and a button to open a chat room with the owner of the gift. Additionally, the gift can be

_Creating a Request_  
Requests need a description and a title, and they can have an optional image.
