current_winid=0;
subwins={};
waiter={};
inspected={};
win_name={};
clog_cache={};
processing={};

result={};
refresh_count={};

URL_PATTERN={
  '请不要使用非法': true,
  'Server Error in': true,
  '服务器错误': true
};
LOADING='L0ad1ng...xkm0d'+(+new Date())+'9323214785';
RELOAD_TIMEOUT=200;

output=$('#output');
waiting_timeout=null;
blockshort=null;
blockurl=false;

function new_refresh(winid) {
  refresh_count[winid]
    .text(parseInt(refresh_count[winid].text())+1)
    .animate({paddingLeft: '18px'},75,'swing',function() {
      $(this).animate({paddingLeft: '8px'},75,'swing');
    });
}

function open_window(url,winid,use_win) {
  function open_new_win(url,winid) {
    var tmp=document.createElement('a');
    tmp.target=winid;
    tmp.href='about:blank';
    tmp.click(); // open window in tab instead of new window
    return window.open(url,winid); // get the handler of opened window
  }
    var win=
      use_win? use_win :
      open_new_win('about:blank',win_name[winid] || (win_name[winid]='xkm0d_W1ND0W_'+winid+'_'+Math.random()));
  try {
    win.document.write('<!--' + LOADING + '-->');
  } catch(e) { //cross-domain, probably http error
    setTimeout(function() {
      processing[winid]=true;
      open_window(url,winid,win);
      processing[winid]=false;
    },1);
    return subwins[winid]=win;
  }
  win.location.href=url;
  inspected[win]=false;
  return subwins[winid]=win;
}

function clog(winid,msg) {
  if(!clog_cache[winid] || msg!=clog_cache[winid])
    result[winid].text(clog_cache[winid]=msg);
}

function locate(winid) {
  if(subwins[winid])
    subwins[winid].alert('定位到 标签'+winid);
  else
    alert('标签已离线');
}

function closesub(winid) {
  clearTimeout(waiter[winid]);
  waiter[winid]=null;
  subwins[winid]=undefined;
  clog(winid,'已离线');
}

function reload(win,winid,reason) {
  clog(winid,reason+'（正重新载入）');
  new_refresh(winid);
  processing[winid]=true;
  setTimeout(function() {
    if(!subwins[winid])
      return;
    win=open_window(url,winid);
    inspected[winid]=false;
    processing[winid]=false;
    if(waiting_timeout)
      waiter[winid]=setTimeout(function(){reload(win,winid,'加载超时');},waiting_timeout);
  },RELOAD_TIMEOUT);
}

function inspect(win,winid) {
  function checkurl(txt) {
    for(var content in URL_PATTERN)
      if(URL_PATTERN.hasOwnProperty(content))
        if(txt.indexOf(content)!==-1)
          return true;
    return false;
  }
  clog(winid,'加载完成');
  var txt=win.document.body.innerHTML;
  if(blockshort && txt.length===0)
    reload(win,winid,'内容为空');
  else if(blockshort && txt.length<1000)
    reload(win,winid,'内容过短');
  else if(blockurl && checkurl(txt))
    reload(win,winid,'服务器错误');
  else {
    win.addEventListener('beforeunload', function() {
      win.document.body.innerHTML='<!--'+LOADING+'-->';
      inspected[win]=false;
    });
  }
}

function checker() {
  for(var winid in subwins) {
    if(!subwins.hasOwnProperty(winid) || !subwins[winid] || processing[winid])
      continue;
    var win=subwins[winid];
    if(win.closed) {
      closesub(winid);
      continue;
    }
    try {
      var still_loading = !win.document.body || win.document.body.innerHTML.indexOf(LOADING)!=-1
    } catch(e) { //cross-domain or http error
      reload(win,winid,'HTTP错误');
      continue;
    }
    if(still_loading) {
      clog(winid,'加载中');
    } else if(!inspected[winid]) {
      clearTimeout(waiter[winid]);
      inspect(win,winid);
      inspected[winid]=true;
    }
  }
}

function parsepage() {
  if(document.getElementById('timeout').checked) {
    window.waiting_timeout=parseInt($('#timeoutvalue').val());
    if(!waiting_timeout || waiting_timeout<1 || waiting_timeout>180) {
      alert('超时时间应在1到180秒之间');
      throw 1;
    }
    else
      window.waiting_timeout*=1000;
  } else {
    window.waiting_timeout=null;
    for(var id in waiter)
      if(waiter.hasOwnProperty(id)) {
        clearInterval(waiter[id]);
        waiter[id]=null;
      }
  }
  if(document.getElementById('blockshort').checked) {
    window.blockshort=parseInt($('#blockshortvalue').val());
    if(!blockshort || blockshort<1 || blockshort>10240) {
      alert('字节数应在1到10240之间');
      throw 1;
    }
  } else {
    window.blockshort=null;
  }
  window.blockurl=$('#blockurl').val();
}

function start() {
  var wins=parseInt($('#wincount').val());
  if(!wins || wins>10 || wins<1) {
    alert('标签数量应在1到10之间');
    return;
  }
  parsepage();
  window.url=$('#url').val();
  for(var _=0;_<wins;_++) {
    output.append(
      '<tr>'+
        '<td>'+current_winid+'</td>'+
        '<td id="refresh_count_'+current_winid+'">0</td>'+
        '<td id="result_'+current_winid+'">未上线</td>'+
        '<td>'+
          '<button onclick="locate('+current_winid+')">定位</button>&nbsp;'+
          '<button onclick="refresh('+current_winid+')">刷新</button>&nbsp;'+
          '<button onclick="closesub('+current_winid+')">下线</button>'+
      '</td>'+
      '</tr>'
    ); //todo: change to createElement
    result[current_winid]=$('#result_'+current_winid);
    refresh_count[current_winid]=$('#refresh_count_'+current_winid);
    var newwin=open_window(url,current_winid);
    (function(win,winid) {
      if(waiting_timeout)
        waiter[winid]=setTimeout(function(){reload(win,winid,'加载超时');},waiting_timeout);
      })(newwin,current_winid);
    subwins[current_winid++]=newwin;
    }
  alert('成功打开 '+wins+' 个标签页 用来加载\n'+url);
  $('.willfade').slideUp(500,function() {
    $('.willshow').slideDown(500);
  });
  setInterval(checker,250);
}

function killall() {
  for(var id in subwins) {
    if(subwins.hasOwnProperty(id))
      closesub(id);
  }
}

function refresh(winid) {
  if(subwins[winid])
    reload(subwins[winid],winid,'用户刷新');
  else
    alert('标签已离线');
}