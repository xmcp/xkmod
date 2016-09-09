(function() {
  if(['cms.rdfz.cn','cms2.rdfz.cn'].indexOf(document.domain)===-1) 
    return document.write('Please run the script in cms.rdfz.cn domain');

  var xkbody=decodeURIComponent(escape(window.atob('/*base_body*/'))), //utf-8 magic
    xkscript="/*base_script*/",
    htmlroot=document.getElementsByTagName('html')[0];

  function main() {
    if(window.$ && $(document).on) {
      var myscript=document.createElement('script');
      myscript.src='data:text/javascript;charset=utf-8;base64,'+encodeURIComponent(xkscript);
      document.head.appendChild(myscript);
    } else {
      setTimeout(main,100);
    }
  }

  var nw=window.open('/test'); //check popup blocker
  if(!nw)
    return document.write('Please disable pop-up blocker and then refresh');
  else { //well done
    nw.close();
    document.close();
    
    if(!document.head)
      htmlroot.appendChild(document.createElement('head'));
    if(!document.body)
      htmlroot.appendChild(document.createElement('body'));

    document.head.innerHTML='<title>xkmod</title><meta charset=utf-8 >';
    document.body.innerHTML=xkbody;
    
    var jquery=document.createElement('script');
    jquery.src='http://libs.useso.com/js/jquery/2.1.1/jquery.min.js';
    document.head.appendChild(jquery);

    main();
  }
})();