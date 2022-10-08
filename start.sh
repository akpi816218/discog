node build.js

runid=$(< ./run)
runid=$(($runid+1))
echo "Run ID: $runid"
echo $runid > ./run

node index.js
