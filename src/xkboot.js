if(document.domain!=='127.0.0.1' && document.domain!=='cms.rdfz.cn') {
  document.write('Please run the script in "cms.rdfz.cn" domain');
  throw 1;
}

(function() {
  var xkhead='<title>xkmod</title>\n<meta charset="utf-8">';
  var xkbody=decodeURIComponent(escape(window.atob('/*base_body*/'))); //utf-8 magic
  var xkscript='/*base_script*/';
  var htmlroot=document.getElementsByTagName('html')[0];

  var nw=window.open('/test'); //check popup blocker
  if(nw===undefined) {
    document.write('Please allow the pop-up');
    throw 1;
  } else { //well done
    nw.close();

    if(!document.head)
      htmlroot.appendChild(document.createElement('head'));
    if(!document.body)
      htmlroot.appendChild(document.createElement('body'));

    document.head.innerHTML=xkhead;
    document.body.innerHTML=xkbody;

    var jquery=document.createElement('script');
    jquery.src='http://libs.useso.com/js/jquery/2.1.1/jquery.min.js';
    document.head.appendChild(jquery);

    setTimeout(function() {
      var myscript=document.createElement('script');
      myscript.src='data:text/javascript;charset=utf-8;base64,'+xkscript;
      document.head.appendChild(myscript);
    },250);
  }
})();