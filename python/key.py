from kodemon import kodemon

@kodemon
def funny(key):
	print 'You pressed: ' + key


@kodemon
def mainFunction():
	while True:
		n = raw_input("press 'q' to quit:")
		if n.strip() == 'q':
			break
		else:
			funny(n)


mainFunction()