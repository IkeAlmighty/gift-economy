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
- frequency of gift delivery ie "gift" velocity (which is similar to "exchange velocity" as described in market economics).

The idea is to start with basic and easy to meet needs like food, and push the user base towards vertically integrating other parts of industry over time.

## Data Models

Gift, Request, User, Project

```
Gift Model:
- owner: User._id
- description: String
- titleline: String
- type: "Food" | "Shelter" | "Labor" | "Transportation" | "Other"
- subtypes: [String]
- suggestedProjects: [Project]
```

```
Request Model:
- owner: User._id
- description: String
- titleline: String
- type: "Food" | "Shelter" | "Labor" | "Transportation" | "Other"
- subtypes: [String]
```

```
Project Model:
- owner: User._id
- requests: [Request]
- requestSuggestions: [Request]
- openToRequestSuggesions: Boolean
- giftSuggestions: [Gift]
- openToGiftSuggestions: Boolean
- type: "Food" | "Shelter" | "Labor" | "Transportation" | "Other"
- subtypes: [String]
```

```
User Model:
 - username: String
 - password: String
 - gifts: [Gift]
 - requests: [Request]
 - Projects: [Project]
 - connections: [User._id]
```

## User Interface

### Pages

/feed  
/profile

### Feed

A list of gifts, requests, and projects. Default sort order tbd, but should encourage users to make connections between the three.

Each item has a button for opening a chatroom with the owner of the list item.

At the top of the feed is a create button where the user can choose to create a new project, new gift, or new request.

_Creating a Gift | The Gift Component_  
A gift is something that someone is offering on the "market". Once created, the gift component displays its title, description, image, type, subtypes, and a button to open a chat room with the owner of the gift. Additionally, the gift can be suggested to a _Project_ by any user, which adds it to a the project's publically available gift suggestion list.

_Creating a Request_  
A request is something that someone is desiring to find on the "market". Once created, the request component displays its title, description, image, type, subtypes, and a button to open a chat room with the owner of the request.

_Creating a Project_
A project is a collection of gifts and requests depicting a larger whole. An example project might be titled "Pasta". Pasta requires flour, an hour of labor time, and water. So "flour" and "pasta making labor" might be listed under the requests for the project. Since water is fairly commonplace, the creator of the project wouldn't list it as a request. Additionally, if the creator of the request is open to gift suggestions, then other users can suggest gifts from their feeds to be used in the project. These go into the giftSuggestions. If the user is open to request suggestions, then users can create requests to be added to the project's request suggestions, and moved to the actual requests list at the project owner's discretion.

_Sort By Function_
Each list item (project, gift, and request) has a type and a subtype. These, along with creation timestamps and the model types of each item should be available to a sort by function.

_Search Bar_
Each list item contains a large amount of text and tags, and a search bar to look for specific listings would be helpful.

## Where to from Here?

This project needs to draw on knowledge and experience in economics and logistical planning. Studying internal systems built by Amazon and Walmart seem like a good start. Studying real life and real historical examples of gift economies is important. Ideas might come from these areas.

### Decentralization

The first iteration of this app is opensource, but it is not decentralized. After the MVP is working to some degree, the backend needs to be integrated with the frontend and refractored into a decentralized code base. Some thought will have to be had on the architecture and how to make this work without envinronmentally harmful blockchain technology.

## Where NOT to go

This project is a response to the climate crisis, to corporate greed, and to the coming economic depression(s) caused by poor governance and the ongoing death march of Capitalism. So it does not make sense to rely on blockchain technology (at least where it affects the environment), and it does not make since to rely on LLMs either (since LLMs are energy sappers and also are owned primarily by large corporate interests). These technologies can be learned from, but need to be alterted before being included in this project.
