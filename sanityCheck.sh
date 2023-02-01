npm run lint
npm run compile >> /dev/null
if [[ -s eslint.txt ]] ; then
	echo 'ESLint returned (an) error(s). Check `eslint.txt`.'
	exit 1
else
	echo 'ESLint returned no errors.'
	exit 0
fi