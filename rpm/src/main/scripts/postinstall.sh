DATE=`date '+%%-d %%b %%Y'`
FILE="/opt/ericsson/%installPath%/html/VisualizationEngineApp/help/appInfo.xml"
sed -e "s/{{installDate}}/$DATE/g"  $FILE > $FILE.temp
mv $FILE.temp $FILE