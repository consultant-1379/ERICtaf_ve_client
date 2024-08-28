#Visualization Client Usage Instructions
The visualization engine comes equipped with the following views

>1. Flow view
>2. Pie view

Each view allows the user to create a query to select which Eiffel messages should be used as data in the view.

The user can add one or more views and save it as a dashboard. Views can be configured individually and the settings are automatically restored when a saved dashboard is loaded again.

![Visualization](../images/Visualisation.png)

##View selection screen
By clicking on the indicated area a view selection dialog will pop up letting the user select which view to create. 

![Add view](../images/visGhostRegion.png)

The view is created by clicking OK after selecting the desired view in the select box.

![View select screen](../images/visSelectView.png)

##View settings
When the view is first created the settings dialog will be shown to allow for an initial configuration of the view. To visit the settings after the view have been created hover over the view and click the cogwheel in the top right corner.  

![View settings](../images/RegionSettings.png)

The settings dialog allows access to all the view settings. See the settings descriptions for each individual view below to learn what each setting does.

![View settings menu](../images/VisRegionSettings.jpg)

##Making subscription queries
In the view settings dialog it is possible to specify which Eiffel messages the server will send to the client by entering a query. The basic query format is a key=value pair where key is an Eiffel message field name and value its corresponding value. eiffelMessageVersion should be omitted from the query. Eiffel message definitions can be found [here.](https://eiffel.lmera.ericsson.se/com.ericsson.duraci/messaging/mbmessages.html)

If the following query is entered the server will aggregate data only from the "EffielJobFinishedEvent" it sees, all other Eiffel messages are discarded and not sent to the client.

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

##Multiple queries

It is possible to enter several queries, as shown in the screenshot below.

![Multiple queries](../images/concatenated-queries.png)

*Note that these queries are concatenated by the OR (||) operator by default.*

##Flow view
The flow view will display a series of connected events as a directed graph. If more than one graph can be created from the data returned by the query they will be displayed in different tabs.

![Flow view](../images/thumb_flowview.jpg)

###Settings

**Subscriptions** - Subscribe to data as described in the "Making subscription queries" section.   
**Aggregate historical and live data** - When "Enable live data" is checked use the date input to enter a start date to optionally aggregate historical and live data. When "Enable live data" is unchecked use the date inputs to enter a start and end date for retreiving pure historical data.  
**Update interval** - Sets how frequently the server should send updates to the client. Only valid when "Enable live data" is checked.  
**Resize** - Sets the views width.   
**Aspect ratio** - Uncheck "Use Default" to control the height of the view.   
**Nodes to display** - Uncheck the checkbox to limit how many nodes to draw in the view. Default is to draw all nodes. Valid values are 1-200.  
**Node title** - Select which Eiffel event key should be displayed as the title of each node.  
**Node info** - Select which Eiffel event key(s) should be displayed as information in each node. Keys should be separated by comma. Default keys are domainId and eventData.resultCode.  
**Cluster base** - Select which Eiffel event key to group data on.  
**Max graphs** - Use to limit how many graphs will be visible at the same time.  
**Sort order** - Select if the graphs should be sorted in ascending or descending order. Default is descending.  
**Sort query** - Select which Eiffel event key should be used as base for sorting. Default is to sort on eventTime.

##Pie view
The pie view shows the distribution of events, grouped on certain event keys.

![Pie view](../images/thumb_pieview.jpg)

###Settings

**Subscriptions** - Subscribe to data as described in the "Making subscription queries" section.   
**Aggregate historical and live data** - When "Enable live data" is checked use the date input to enter a start date to optionally aggregate historical and live data. When "Enable live data" is unchecked use the date inputs to enter a start and end date for retreiving pure historical data.  
**Update interval** - Sets how frequently the server should send updates to the client. Only valid when "Enable live data" is checked.  
**Resize** - Sets the views width.   
**Aspect ratio** - Uncheck "Use Default" to control the height of the view.   
**Cluster base** - Select which Eiffel event key to group data on.