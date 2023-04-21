npm run format >> /dev/null
npm run lint >> eslint.txt
if [[ -s eslint.txt ]] ; then
	echo 'ESLint returned (an) error(s). Check `eslint.txt`.'
	exit 1
else
	rm eslint.txt
	echo 'ESLint returned no errors.'
	exit 0
fi