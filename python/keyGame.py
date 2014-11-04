from kodemon import kodemon
import string
import random
import sys
import os


@kodemon
def funny(key):
	print '\aYou pressed: ' + key + ' not the right one'
	os.system('say "you pressed the wrong key"')

@kodemon
def notFunny(key):
	print 'Not ' + key + ' try again :p'
	os.system('say "Not this one, try again"')

@kodemon
def winner():
	os.system('say "ja, ja, halelujah"')
	os.system('say "Tou erdt sigurvegari"')

@kodemon
def mainFunction():
	print 'In this game you have to guess which letter'
	print string.letters
	rightKey = random.choice(string.letters)
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


mainFunction()