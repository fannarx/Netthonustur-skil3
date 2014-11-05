from kodemon import kodemon
import string
import random
import sys
import os



@kodemon
def funny(key):
	print '\aYou pressed: ' + key + ' Only use letters not numbers'
	if (sound):
		os.system('say "you pressed the wrong key, use letters not numbers"')

@kodemon
def notFunny(key):
	print 'Not ' + key + ' try again :p'
	if (sound):
		os.system('say "Not this one, try again"')

@kodemon
def winner():
	if (sound):
		os.system('say "Frabaert"')
		os.system('say "Tou erdt sigurvegari"')

@kodemon
def mainFunction():
	print 'Guess GAME\nSelect one of the following letters'
	print 'If you select the right one you win one MILLION dollers'
	print string.letters
	rightKey = random.choice(string.letters)
	if (showKey):
		print rightKey
	while True:
		n = raw_input("Guess what letter to quit :) ")
		i = n.strip()
		if i == '$' or i == rightKey :
			winner()
			break
		else :
			if i.isdigit():
				funny(i)
			else:
				notFunny(i)

showKey = False
sound = True
if (len(sys.argv) >= 2):
	if (sys.argv[1] == 'nosound'):
		sound = False
	elif (sys.argv[1] == 'showkey'):
		showKey = True


mainFunction()