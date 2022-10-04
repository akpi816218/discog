node build.js

runid=$(< ./run)
runid=$(($runid+1))
echo $runid
echo $runid > ./run

node index.js