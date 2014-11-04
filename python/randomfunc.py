import random
import time
from kodemon import kodemon


@kodemon
def zero():
	time.sleep(random.uniform(.2, .6))

@kodemon
def one():
	print("Random is 1.\n")
	time.sleep(random.uniform(.1, .3))


@kodemon
def two():
	print("Random is 2.\n")
	time.sleep(random.uniform(.1, .9))

@kodemon
def three():
	print("Random is 3.\n")
	time.sleep(random.uniform(.5, .9))

@kodemon
def four():
	print("Random is 4.\n")
	time.sleep(random.uniform(.3, .7))

@kodemon
def five():
	print("five\n")
	time.sleep(random.random())



@kodemon
def main():
	while True:
		zero()
		one()
		two()
		three()
		four()
		five()
'''
		n = random.randint(0, 5)
		if n == 0:
			zero()
		elif n == 1:
			one()
		elif n == 2:
			two()
		elif n==3:
			three()
		elif n==4:
			four()
		elif n==5:
			five()
		time.sleep(.5)
'''

main()