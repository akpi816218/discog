node build.js

echo "Current Git Branch: $(git branch --show-current)"

runid=$(< ./run)
runid=$(($runid+1))
echo "Run ID: $runid"
echo $runid > ./run

node index.js
