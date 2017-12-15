from Ryuretic import coupler

import string, random
from datetime import datetime
import os

class Ryuretic_coupler(coupler):
    def __init__(self, *args, **kwargs):
        super(Ryuretic_coupler, self).__init__(*args, **kwargs)

        self.netView = {}

    def get_proactive_rules(self, dp, parser, ofproto):
        return None, None

    def handle_icmp(self,pkt):

        currentDirectory = os.path.dirname(os.path.abspath(__file__))
        file = open(currentDirectory+'/hosts.txt','r')
        aux = file.readlines()
        file.close()
        allowed_hosts = []
        for line in aux:
            allowed_hosts.append(line.rstrip('\n'))

        if(pkt['srcmac'] not in allowed_hosts):
            log = open(currentDirectory + '/log.txt', 'a')
            log.write(datetime.now().strftime('%d/%m/%Y %H:%M:%S') + ' O host ' + pkt['srcmac'] + ' nao eh autorizado.' + os.linesep)
            log.close()
            fields, ops = self.my_Field_Ops(pkt)
        else:
            fields, ops = self.default_Field_Ops(pkt)
        self.install_field_ops(pkt,fields,ops)

    def handle_icmp6(self,pkt): #New Additions
        currentDirectory = os.path.dirname(os.path.abspath(__file__))
        file = open(currentDirectory+'/hosts.txt','r')
        aux = file.readlines()
        file.close()
        allowed_hosts = []
        for line in aux:
            allowed_hosts.append(line.rstrip('\n'))

        if(pkt['srcmac'] not in allowed_hosts):
            log = open(currentDirectory + '/log.txt', 'a')
            log.write(datetime.now().strftime('%d/%m/%Y %H:%M:%S') + ' O host ' + pkt['srcmac'] + ' nao eh autorizado.' + os.linesep)
            log.close()
            fields, ops = self.my_Field_Ops(pkt)
        else:
            fields, ops = self.default_Field_Ops(pkt)
        self.install_field_ops(pkt,fields,ops)