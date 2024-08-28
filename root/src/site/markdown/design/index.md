#Eiffel Visualization Engine Client

##Introduction

The main purpose of the Visualization engine is to display and visualize live data and statistics (in real time) and statistics of historical data. The architecture should allow the implementation of many different kinds of Visualization Configurations, such as Flow Visualization. Configs, Commito-meter Visualization and statistics.

##Overall Architecture

The Visualization engine component consist of two major parts, the server and the client. To be able to display data in real time the server must be connected to:


1.  The Message Bus (MB). 
2.  Event Repository  
3.  A Mongo database.
4.  Visualization Engine Client


![Visualization](../images/vis_engine_arch.jpeg)


##Client Architecture

The user is able to choose existing or create new visualization views. The user can customize these views by adding them on screen. The user is also  able to save particular visualization views and load or delete them.The client sends requests to the server to subscribe to events that the user has selected. It can also ask for historical data/statistics. The visualization engine can show live data, live data with historical data or purely historical data.

The client supports plugins therefore new views can be defined and installed.

The OSS Client SDK will be used to develop the Visualization Client Application. A description can be found here: https://arm1s11-eiffel004.eiffel.gic.ericsson.se:8443/nexus/content/sites/tor/uisdk/latest/clientSDK.html . The Client SDK is part of the OSS UI SDK. Other parts of the OSS UI SDK are the Help SDK and the REST SDK. Some additional free open source 3PP libraries have been added to handle other cases.

![Visualization](../images/ve_client_event_handling.jpg)

###Communication handler

Handles requests and asynchronous message using web sockets, sse,xhr- polling and long-polling.

###Collections and Models

Handles and possibly manipulate the data received from the server.
###Event Bus

Components send updates via the Event Bus to be picked up by subscribers (regions).
###Regions

Region instances manages specific areas of the screen.
###Widgets

Widgets are responsible for presenting the data.