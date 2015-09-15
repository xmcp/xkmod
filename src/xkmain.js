current_winid=0;
subwins={};
waiter={};
inspected={};

LOADING='loading2378'+'9323214785';
reload_timeout=250;

output=$('#output');
waiting_timeout=null;
blockshort=null;
blockurl=false;

window.addEventListener('message', function(e) {
  if (e.data == 'bye') {
    console.log(e);
  }
}, true);

function open_window(url,winid) {
  var win=window.open('about:blank',winid);
  win.document.write('<!--'+LOADING+'-->');
  win.location.href=url;
  inspected[win]=false;
  return subwins[winid]=win;
}

function clog(winid,msg) {
  $('#result_'+winid).text(msg);
}

function locate(winid) {
  subwins[winid].alert('定位到 窗口'+winid);
}

function close(winid) {
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
    if(waiting_timeout)
      waiter[winid]=setTimeout(function(){reload(win,winid,'加载超时');},waiting_timeout);
  },reload_timeout);
}

function inspect(win,winid) {
  clog(winid,'加载完成');
  var txt=win.document.body.innerHTML;
  if(blockshort && txt.length<1000)
    reload(win,winid,'内容过短');
  else if(blockurl && txt.indexOf('请不要使用'+'非法')!==-1)
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
    if(!subwins.hasOwnProperty(winid) || !subwins[winid])
      continue;
    var win=subwins[winid];
    if(win.closed) {
      close(winid);
      continue;
    }
    if(!win.document.body || win.document.body.innerHTML.indexOf(LOADING)!=-1) {
      clog(winid,'加载中');
    } else if(!inspected[win]) {
      clearTimeout(waiter[winid]);
      inspect(win,winid);
      inspected[winid]=true;
    }
  }
}

function start() {
  var wins=parseInt($('#wincount').val());
  if(!wins || wins>10 || wins<1) {
    alert('窗口数量应在1到10之间');
    return;
  }
  if(document.getElementById('timeout').checked) {
    window.waiting_timeout=parseInt($('#timeoutvalue').val());
    if(!waiting_timeout || waiting_timeout<1 || waiting_timeout>180) {
      alert('超时时间应在1到180秒之间');
      return;
    }
    else
    window.waiting_timeout*=1000;
  }
  if(document.getElementById('blockshort').checked) {
    window.blockshort=parseInt($('#blockshortvalue').val());
    if(!blockshort || blockshort<1 || blockshort>10240) {
      alert('字节数应在1到10240之间');
      return;
    }
  }
  window.blockurl=$('#blockurl').val();
  window.url=$('#url').val();
  for(var _=0;_<wins;_++) {
    output.append(
      '<tr>'+
        '<td>'+current_winid+'</td>'+
        '<td id="result_'+current_winid+'">未上线</td>'+
        '<td><button onclick="locate('+current_winid+')">定位</button></td>'+
      '</tr>'
    );
    var newwin=open_window(url,current_winid);
    (function(win,winid) {
      if(waiting_timeout)
        waiter[winid]=setTimeout(function(){reload(win,winid,'加载超时');},waiting_timeout);
      })(newwin,current_winid);
        subwins[current_winid++]=newwin;
    }
  setInterval(checker,250);
  $('#config_panel').remove();
}