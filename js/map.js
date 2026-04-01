const A={'andaman & nicobar':'andaman and nicobar islands','nct of delhi':'delhi',
'national capital territory of delhi':'delhi','jammu & kashmir':'jammu and kashmir',
'union territory of puducherry':'puducherry','orissa':'odisha','uttaranchal':'uttarakhand',
'the dadra and nagar haveli and daman and diu':'dadra and nagar haveli and daman and diu'};
function N(n){if(!n)return'';var l=n.toLowerCase().trim();return A[l]||l;}
var VC={H:'#2b6cb0',D:'#c53030',X:'#6b46c1'};
var VN={H:'Hikvision',D:'Dahua',X:'XMEye'};
document.getElementById('s-total').textContent=DATA.total_cameras.toLocaleString();
document.getElementById('s-states').textContent=Object.keys(DATA.states).length;
function gc(c,m){
  if(!c)return'#e2e8f0';
  var r=Math.min(c/m,1);
  if(r<=.5){var t=r*2;return d3.rgb(226+(236-226)*t,232+(201-232)*t,240+(75-240)*t)+'';}
  var t2=(r-.5)*2;return d3.rgb(236+(220-236)*t2,201+(60-201)*t2,75+(40-75)*t2)+'';
}
function sC(n){if(DATA.states[n]!==undefined)return DATA.states[n];var k=N(n);for(var s in DATA.states)if(N(s)===k)return DATA.states[s];return 0;}
function sI(n){if(DATA.state_info[n])return DATA.state_info[n];var k=N(n);for(var s in DATA.state_info)if(N(s)===k)return DATA.state_info[s];return null;}
function sK(n){if(DATA.states[n]!==undefined)return n;var k=N(n);for(var s in DATA.states)if(N(s)===k)return s;return n;}
function mkBars(id,entries,max,color,click){
  var el=document.getElementById(id);
  entries.forEach(function(e){
    var pct=Math.max(e[1]/max*100,3),row=document.createElement('div');
    row.className='bar-row';
    row.innerHTML='<div class="bar-label">'+e[0]+'</div><div class="bar-track"><div class="bar-fill" style="width:'+pct+'%;background:'+color+'"></div></div><div class="bar-count">'+e[1]+'</div>';
    if(click)row.addEventListener('click',function(){click(e[0]);});
    el.appendChild(row);
  });
}
(function(){
  var e=Object.entries(DATA.states).sort(function(a,b){return b[1]-a[1];}).slice(0,15);
  mkBars('state-bars',e,e[0]?e[0][1]:1,'#2b6cb0',showModal);
})();
(function(){
  var e=Object.entries(DATA.cities).slice(0,12);
  mkBars('city-bars',e,e[0]?e[0][1]:1,'#d97706',showCityModal);
})();
(function(){
  var btn=document.getElementById('theme-toggle');
  var moon=document.getElementById('icon-moon');
  var sun=document.getElementById('icon-sun');
  var saved=localStorage.getItem('theme');
  if(saved==='dark'){document.documentElement.classList.add('dark');moon.style.display='none';sun.style.display='block';}
  btn.addEventListener('click',function(){
    var dark=document.documentElement.classList.toggle('dark');
    moon.style.display=dark?'none':'block';
    sun.style.display=dark?'block':'none';
    localStorage.setItem('theme',dark?'dark':'light');
  });
})();
var ttEl=document.getElementById('tooltip');
var isMobile='ontouchstart' in window;
function showTT(ev,h){
  ttEl.innerHTML=h;ttEl.style.display='block';
  moveTT(ev);
  if(isMobile)setTimeout(hideTT,3000);
}
function moveTT(ev){
  var x=ev.clientX||(ev.touches&&ev.touches[0]?ev.touches[0].clientX:0);
  var y=ev.clientY||(ev.touches&&ev.touches[0]?ev.touches[0].clientY:0);
  if(isMobile){
    ttEl.style.left='50%';ttEl.style.top='80px';
    ttEl.style.transform='translateX(-50%)';
  } else {
    ttEl.style.left=(x+16)+'px';ttEl.style.top=(y-12)+'px';
    ttEl.style.transform='none';
  }
}
function hideTT(){ttEl.style.display='none';}
function showModal(name){
  var si=sI(name);if(!si)return;
  var t=si.t,r=si.r,v=si.v,ci=si.ci,isp=si.is,po=si.po;
  var rPct=t?Math.round(r/t*100):0;
  var topVendor=Object.entries(v).sort(function(a,b){return b[1]-a[1];})[0];
  var topCity=Object.entries(ci).sort(function(a,b){return b[1]-a[1];})[0];
  var topISP=Object.entries(isp).sort(function(a,b){return b[1]-a[1];})[0];
  var cityCount=Object.keys(ci).length;
  var h='<button class="modal-close" onclick="closeModal()">\u00d7</button>';
  h+='<h2>'+name+'</h2>';
  h+='<p class="modal-lead">';
  h+='<strong>'+t+' Chinese surveillance cameras</strong> were found directly accessible from the internet in '+name+'. ';
  if(topVendor) h+=topVendor[0]+' is the most common brand with '+topVendor[1]+' devices ('+Math.round(topVendor[1]/t*100)+'%). ';
  if(r>0) h+='Of these, <strong>'+r+' cameras ('+rPct+'%)</strong> have live video streaming ports (RTSP) open, meaning their feeds could potentially be viewed remotely. ';
  if(topCity) h+='The highest concentration is in '+topCity[0]+' with '+topCity[1]+' cameras.';
  h+='</p>';
  h+='<div class="insight-row">';
  Object.entries(v).sort(function(a,b){return b[1]-a[1];}).forEach(function(e){
    var col=e[0]==='Hikvision'?VC.H:e[0]==='Dahua'?VC.D:VC.X;
    h+='<div class="insight"><div class="insight-num" style="color:'+col+'">'+e[1]+'</div><div class="insight-text">'+e[0]+' cameras ('+Math.round(e[1]/t*100)+'% of total)</div></div>';
  });
  h+='<div class="insight"><div class="insight-num" style="color:#d97706">'+r+'</div><div class="insight-text">cameras with live video streaming accessible (RTSP protocol)</div></div>';
  h+='<div class="insight"><div class="insight-num">'+cityCount+'</div><div class="insight-text">cities across '+name+' with exposed cameras</div></div>';
  h+='</div>';
  if(cityCount){
    h+='<div class="modal-sec"><h4>Where are they?</h4>';
    h+='<table class="m-table"><thead><tr><th>City</th><th style="text-align:right">Cameras</th></tr></thead><tbody>';
    Object.entries(ci).sort(function(a,b){return b[1]-a[1];}).forEach(function(e){
      h+='<tr><td>'+e[0]+'</td><td>'+e[1]+'</td></tr>';
    });
    h+='</tbody></table></div>';
  }
  if(Object.keys(isp).length){
    h+='<div class="modal-sec"><h4>Which networks are they on?</h4>';
    h+='<p style="font-size:.78rem;color:#64748b;margin-bottom:8px">These cameras are connected through the following internet service providers:</p>';
    h+='<table class="m-table"><thead><tr><th>Internet Provider</th><th style="text-align:right">Cameras</th></tr></thead><tbody>';
    Object.entries(isp).sort(function(a,b){return b[1]-a[1];}).forEach(function(e){
      h+='<tr><td>'+e[0]+'</td><td>'+e[1]+'</td></tr>';
    });
    h+='</tbody></table></div>';
  }
  document.getElementById('modal-card').innerHTML=h;
  document.getElementById('modal').classList.add('active');
}
function showCityModal(cityName){
  var ci=DATA.city_info[cityName];
  if(!ci)return;
  var t=ci.t,r=ci.r,v=ci.v,isp=ci.is,st=ci.st;
  var rPct=t?Math.round(r/t*100):0;
  var topV=Object.entries(v).sort(function(a,b){return b[1]-a[1];})[0];
  var h='<button class="modal-close" onclick="closeModal()">\u00d7</button>';
  h+='<h2>'+cityName+'</h2>';
  h+='<p class="modal-lead">';
  h+='<strong>'+t+' Chinese surveillance cameras</strong> were found internet-accessible in '+cityName+', '+st+'. ';
  if(topV)h+=topV[0]+' accounts for '+topV[1]+' of them ('+Math.round(topV[1]/t*100)+'%). ';
  if(r>0)h+='<strong>'+r+' ('+rPct+'%)</strong> have live video streaming ports open.';
  h+='</p>';
  h+='<div class="insight-row">';
  Object.entries(v).sort(function(a,b){return b[1]-a[1];}).forEach(function(e){
    var col=e[0]==='Hikvision'?VC.H:e[0]==='Dahua'?VC.D:VC.X;
    h+='<div class="insight"><div class="insight-num" style="color:'+col+'">'+e[1]+'</div><div class="insight-text">'+e[0]+' cameras</div></div>';
  });
  h+='<div class="insight"><div class="insight-num" style="color:#d97706">'+r+'</div><div class="insight-text">with live video streaming (RTSP)</div></div>';
  h+='</div>';
  if(Object.keys(isp).length){
    h+='<div class="modal-sec"><h4>Connected through</h4>';
    h+='<table class="m-table"><thead><tr><th>Internet Provider</th><th style="text-align:right">Cameras</th></tr></thead><tbody>';
    Object.entries(isp).sort(function(a,b){return b[1]-a[1];}).forEach(function(e){
      h+='<tr><td>'+e[0]+'</td><td>'+e[1]+'</td></tr>';
    });
    h+='</tbody></table></div>';
  }
  document.getElementById('modal-card').innerHTML=h;
  document.getElementById('modal').classList.add('active');
}
function closeModal(){document.getElementById('modal').classList.remove('active');}
document.getElementById('modal').addEventListener('click',function(e){if(e.target===this)closeModal();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});
(function(){
  var geo=GEODATA,w=880,ht=920;
  var maxC=Math.max.apply(null,Object.values(DATA.states))||1;
  var svg=d3.select('#map').append('svg').attr('viewBox','0 0 '+w+' '+ht).attr('preserveAspectRatio','xMidYMid meet');
  svg.append('rect').attr('width',w).attr('height',ht).attr('fill','#eef2f6').attr('rx',10);
  var proj=d3.geoMercator().center([82,23]).scale(1200).translate([w/2,ht/2]);
  var pth=d3.geoPath().projection(proj);
  svg.append('g').selectAll('path').data(geo.features).enter().append('path')
    .attr('d',pth).attr('class','state')
    .attr('fill',function(d){return gc(sC(d.properties.name||d.properties.NAME||''),maxC);})
    .on('mouseenter',function(ev,d){
      var n=d.properties.name||d.properties.NAME||'',c=sC(n),si=sI(n);
      var h='<div class="tt-name">'+n+'</div>';
      h+='<div class="tt-row"><span class="tt-lbl">Cameras</span><span class="tt-val" style="color:#fbbf24">'+c+'</span></div>';
      if(si){
        Object.entries(si.v).sort(function(a,b){return b[1]-a[1];}).forEach(function(e){
          var col=e[0]==='Hikvision'?VC.H:e[0]==='Dahua'?VC.D:VC.X;
          h+='<div class="tt-row"><span class="tt-lbl">'+e[0]+'</span><span class="tt-val" style="color:'+col+'">'+e[1]+'</span></div>';
        });
        if(si.r)h+='<div class="tt-row"><span class="tt-lbl">Live streams</span><span class="tt-val">'+si.r+'</span></div>';
      }
      h+='<div class="tt-hint">Click for full details</div>';
      showTT(ev,h);
    })
    .on('mousemove',moveTT).on('mouseleave',hideTT)
    .on('click',function(e,d){showModal(sK(d.properties.name||d.properties.NAME||''));});
  svg.append('g').selectAll('path').data(geo.features).enter().append('path')
    .attr('d',pth).attr('class','state-border');
  var dotG=svg.append('g');
  DATA.cameras.forEach(function(cam){
    var pt=proj([cam.o,cam.a]);if(!pt)return;
    var col=VC[cam.v]||'#999';
    dotG.append('circle').attr('cx',pt[0]).attr('cy',pt[1]).attr('r',3.5).attr('fill',col).attr('fill-opacity',.12).attr('class','cam-dot');
    dotG.append('circle').attr('cx',pt[0]).attr('cy',pt[1]).attr('r',1.8).attr('fill',col).attr('fill-opacity',.7).attr('class','cam-dot');
  });
  [{m:'lakshadweep',c:[72.8,10.5],r:30},{m:'andaman',c:[92.7,11.7],r:25},
   {m:'chandigarh',c:[76.78,30.73],r:14},{m:'goa',c:[74,15.4],r:14},
   {m:'puducherry',c:[79.8,11.9],r:12},{m:'dadra',c:[73,20.2],r:12},
   {m:'sikkim',c:[88.5,27.5],r:12},{m:'tripura',c:[91.7,23.9],r:12},
   {m:'mizoram',c:[92.7,23.2],r:12},{m:'nagaland',c:[94.5,26.1],r:12},
   {m:'manipur',c:[93.9,24.8],r:12},{m:'meghalaya',c:[91.3,25.5],r:12},
   {m:'delhi',c:[77.2,28.6],r:14}].forEach(function(ss){
    var feat=geo.features.find(function(f){return(f.properties.name||f.properties.NAME||'').toLowerCase().indexOf(ss.m)>=0;});
    if(!feat)return;var pt=proj(ss.c);if(!pt)return;
    var name=feat.properties.name||feat.properties.NAME||'';
    svg.append('circle').attr('cx',pt[0]).attr('cy',pt[1]).attr('r',ss.r).attr('fill','transparent').attr('class','hit-area')
      .on('mouseenter',function(ev){
        var c=sC(name),si=sI(name);
        var h='<div class="tt-name">'+name+'</div><div class="tt-row"><span class="tt-lbl">Cameras</span><span class="tt-val" style="color:#fbbf24">'+c+'</span></div>';
        if(si&&si.r)h+='<div class="tt-row"><span class="tt-lbl">Live streams</span><span class="tt-val">'+si.r+'</span></div>';
        h+='<div class="tt-hint">Click for details</div>';
        showTT(ev,h);
      }).on('mousemove',moveTT).on('mouseleave',hideTT)
      .on('click',function(){showModal(sK(name));});
  });
})();