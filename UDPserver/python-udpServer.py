import socket

UDPSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

listen_addr = ("localhost", 4000)
UDPSock.bind(listen_addr)


while True:
    data, addr = UDPSock.recvfrom(1024)
    print data.strip(), addr