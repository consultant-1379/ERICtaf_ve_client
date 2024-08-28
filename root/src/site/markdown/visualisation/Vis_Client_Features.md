#Visualization Client Features
The visualization Engine comes equipped with the following views

>1. Flow view
>2. Pie view

Each view allows the user to create a query to select which Eiffel messages should be used as data in the view.

The user can add one or more views and save it as a dashboard. Views can be configured individually and the settings are automatically restored when a saved dashboard is loaded again.

![Visualization](../images/Visualisation.png)

##View selection screen
By clicking on the indicated area a view selection dialog will pop up letting the user select which view to create. 

![Ghost Region](../images/visGhostRegion.png)

The view is created by clicking OK after selecting the desired view in the select box.

![View Select Screen](../images/visSelectView.png)

##View settings
By hovering over the view and clicking the cogwheel the view settings can be reached. The settings dialog allows access to all the view settings. The settings differ between different views but some of the common settings are, view size, query, live or historical data selection and date ranges for data.

![Region Settings](../images/RegionSettings.png)

This is an example of the view settings dialog.

![Region Settings menu](../images/VisRegionSettings.jpg)

##Subscription
In the view settings dialog it is possible to specify which Eiffel messages the server will send to the client by entering a query. The basic query format is a key=value pair where key is an Eiffel message field name and value its corresponding value. eiffelMessageVersion should be omitted from the query. Eiffel message definitions can be found [here.](https://eiffel.lmera.ericsson.se/com.ericsson.duraci/messaging/mbmessages.html)

If the following query is entered the server will aggreagte data only from the "EffielJobFinishedEvent" it sees, all other Eiffel messages are discarded and not sent to the client.

	eventType=EffielJobFinishedEvent

More elaborate queries can be constructed by using the three Boolean operators available for queries, **AND** (&&), **OR** (||) and **NOT** (!).

	eventType=EiffelSCMChangedEvent&&eventData.changeSet.team=myteam

In this case we are only interested in receiving those messages that are related to commits (eventType=EiffelSCMChangedEvent) **AND** the team "myteam" (eventData.changeSet.team=myteam).

The previous example also shows how nested keys are targeted by the dot (.) operator.

	eventData.changeSet.team=myteam
	eventData.jobExecutionId=276

A variation to the key=value pattern is to use only a key as query. 

	eventType

Entering only a key means that all Eiffel messages containing this key regardless of its value will be aggregated by the server. 

*Note that all Eiffel messages have the key "eventType" so in this case the server will aggregate all messages it sees on the message bus. Be careful when using only key as query.* 

##Flow view
The flow view will display a series of connected events as a directed graph. If more than one graph can be created they will be displayed in different tabs.

![Flow Chart](../images/thumb_flowview.jpg)

##Pie view
The pie view shows distribution of events, grouped on certain event keys.

![Pie Chart](../images/thumb_pieview.jpg)