#Eiffel Visualization Engine (Client)

## Visualization URL attributes#
In this section the manipulation of the URL to change a saved dashboard's query submitted to a server can be changed. By adding the below values serperated by the "&" character to the url. The VE-Client will load a dashboard and then apply the changes to the query sent to the server. 

    http://localhost:8585/#main/dashboardId=5372358a39e97abb12b7f518&query=domainId=VEDomain1&startDate=10-12-2014,12:00&endDate=10-12-2014,14:00&liveData=false

Once a normal load has been selected then all values passed will be removed from the url and the VE-client will load the selected dashboard configuration that was originally saved.

All values are independent of each other so please be careful of how they are used. Please see examples below. But it is also possible to do other combinations of these attributes.


<table>
  <tbody>
    <tr>
      <th>URL Attributes</th>
      <th>Description</th>
    </tr>
    <tr>
      <td colspan="1">query=(query 1),(query 2) ...</td>
      <td colspan="1">Change the query string sent to the server. Multiple queries can be sent by adding a "," seperator</td>
    </tr>
    <tr>
      <td colspan="1">startDate=12-2-2014,11:00</td>
      <td colspan="1">Change the start date of the query to server.</td>
    </tr>
    <tr>
      <td colspan="1">endDate=12-2-2014,12:00</td>
      <td colspan="1">Change the end date of the query to server.</td>
    </tr>
    <tr>
      <td colspan="1">liveData=true | false</td>
      <td colspan="1">Change the livedata from true to false.</td>
    </tr>
    <tr>
      <td colspan="1">dashboardId=(dashboard identifier) | false</td>
      <td colspan="1">The stanadard dashboard identifier for each saved dashboard.</td>
    </tr>
  </tbody>
</table>


###Example of live Data query
     http://localhost:8585/#main/dashboardId=5372358a39e97abb12b7f518&query=domainId=VEDomain1&liveData=true

###Example of historical data query
	http://localhost:8585/#main/dashboardId=5372358a39e97abb12b7f518&query=domainId=VEDomain1&startDate=10-12-2014,12:00&endDate=10-12-2014,14:00&liveData=false

###Example of multiple queries
     http://localhost:8585/#main/dashboardId=5372358a39e97abb12b7f518&query=domainId=VEDomain1,eventType=EiffelJobFinishedEvent&liveData=true