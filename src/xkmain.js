current_winid=0;
subwins={};
waiter={};
inspected={};
win_name={};
clog_cache={};
processing={};

result={};
refresh_count={};

URL_PATTERN='请不要使用'+'非法';
LOADING='L0ad1ng...xkm0d'+(+new Date())+'9323214785';
reload_timeout=250;

output=$('#output');
waiting_timeout=null;
blockshort=null;
blockurl=false;

function new_refresh(winid) {
  refresh_count[winid].text(parseInt(refresh_count[winid].text())+1);
}

function open_window(url,winid,use_win) {
  function open_new_win(url,winid) {
    var tmp=document.createElement('a');
    tmp.target=winid;
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
  setTimeout(function() {
    if(!subwins[winid])
      return;
    win=open_window(url,winid);
    new_refresh(winid);
    if(waiting_timeout)
      waiter[winid]=setTimeout(function(){reload(win,winid,'加载超时');},waiting_timeout);
  },reload_timeout);
}

function inspect(win,winid) {
  clog(winid,'加载完成');
  var txt=win.document.body.innerHTML;
  if(blockshort && txt.length===0)
    reload(win,winid,'内容为空');
  else if(blockshort && txt.length<1000)
    reload(win,winid,'内容过短');
  else if(blockurl && txt.indexOf(URL_PATTERN)!==-1)
    reload(win,winid,'非法URL提醒');
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
  $('#output_container').show();
  for(var _=0;_<wins;_++) {
    output.append(
      '<tr>'+
        '<td>'+current_winid+'</td>'+
        '<td id="refresh_count_'+current_winid+'">0</td>'+
        '<td id="result_'+current_winid+'">未上线</td>'+
        '<td>'+
          '<button onclick="locate('+current_winid+')">定位</button>'+
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
  setInterval(checker,250);
  $('.willfade').remove();
  $('.willshow').show();
}

function killall() {
  for(var id in subwins) {
    if(subwins.hasOwnProperty(id))
      closesub(id);
  }
}