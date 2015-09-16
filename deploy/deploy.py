#coding=utf-8
import base64
import slimit

print('-- 1/4 Compressing xkmain.html')
with open('../src/xkmain.html','r',encoding='utf-8') as f:
    main_content='\n'.join((x.lstrip() for x in f.read().split('\n'))).replace('\n\n','\n')

print('-- 2/4 Compressing xkmain.js')
with open('../src/xkmain.js','r',encoding='utf-8') as f:
    main_script=slimit.minify(f.read(),True,False)

print('-- 3/4 Connecting xkboot.js')
with open('../src/xkboot.js','r',encoding='utf-8') as f:
    boot_content=f.read().replace('/*base_body*/',base64.b64encode(main_content.encode('utf-8')).decode())\
                         .replace('/*base_script*/',base64.b64encode(main_script.encode('utf-8')).decode())

print('-- 4/4 Compressing xkboot.js')
with open('xkboot.min.js','w') as f:
    f.write('// THIS CODE IS AUTO GENERATED. DO NOT CHANGE HERE.\n// SOURCE: https://github.com/xmcp/xkmod\n\n')
    f.write(slimit.minify(boot_content,True,True))