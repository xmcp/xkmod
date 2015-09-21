if(document.domain!=='127.0.0.1' && document.domain!=='cms.rdfz.cn') {
  document.write('Please run the script in "cms.rdfz.cn" domain');
  throw 1;
}

(function() {
  var xkhead='<title>xkmod</title><meta charset="utf-8">';
  var xkbody='/*base_body*/';
  var xkscript="/*base_script*/";
  var htmlroot=document.getElementsByTagName('html')[0];

  function main() {
    if(window.$) {
      var myscript=document.createElement('script');
      myscript.src='data:text/javascript;charset=utf-8,'+encodeURIComponent(xkscript);
      document.head.appendChild(myscript);
    } else {
      setTimeout(main,100);
    }
  }

  var nw=window.open('/test'); //check popup blocker
  if(!nw) {
    document.write('Please disable pop-up blocker and refresh');
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

    main();
  }
})();