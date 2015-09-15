#coding=utf-8
import base64

with open('../src/xkmain.html','r',encoding='utf-8') as f:
    main_content='\n'.join((x.lstrip() for x in f.read().split('\n'))).replace('\n\n','\n')

with open('../src/xkmain.js','r',encoding='utf-8') as f:
    main_script='\n'.join((x.lstrip() for x in f.read().split('\n'))).replace('\n\n','\n')

with open('../src/xkboot.js','r',encoding='utf-8') as f:
    boot_content='\n'.join((x.lstrip() for x in f.read().split('\n'))).replace('\n\n','\n')

boot_content=boot_content.replace('/*base_body*/',base64.b64encode(main_content.encode('utf-8')).decode())\
                         .replace('/*base_script*/',base64.b64encode(main_script.encode('utf-8')).decode())

with open('xkboot.min.js','w') as f:
    f.write('// THIS CODE IS AUTO GENERATED. DO NOT CHANGE HERE.\n')
    f.write(boot_content)