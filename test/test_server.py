#coding=utf-8
import cherrypy
import random
import time

class Website:
    @cherrypy.expose()
    def mod(self,_):
        with open('../deploy/xkboot.min.js','r') as f:
            return f.read()

    @cherrypy.expose()
    def index(self):
        return '''<a href="javascript:document.write('<script src=/mod/'+(+new Date())+' ></script>')">Mod</a>'''

    @cherrypy.expose()
    def test(self):
        '''
        prob=random.random()
        if prob<.1:
            return 'OK'*1000
        elif prob<.4:
            return '呵呵，请不要使用非法URL...'+'blah'*500
        elif prob<.7:
            return '服务不可用。'
        elif prob<.9:
            time.sleep(30)
        else:
            return ''
        '''
        time.sleep(5)
        return ''

cherrypy.quickstart(Website(),'/',{
    'global': {
        'engine.autoreload.on':False,
        'server.socket_host':'0.0.0.0',
        'server.socket_port':23432,
    },
})