(this.webpackJsonpExpenditures=this.webpackJsonpExpenditures||[]).push([[8],{54:function(e,n,t){e.exports=t(78)},60:function(e,n,t){var a={"./ion-action-sheet-controller_8.entry.js":[84,43],"./ion-action-sheet-ios.entry.js":[85,44],"./ion-action-sheet-md.entry.js":[86,45],"./ion-alert-ios.entry.js":[87,24],"./ion-alert-md.entry.js":[88,25],"./ion-app_8-ios.entry.js":[89,11],"./ion-app_8-md.entry.js":[90,12],"./ion-avatar_3-ios.entry.js":[91,46],"./ion-avatar_3-md.entry.js":[92,47],"./ion-back-button-ios.entry.js":[93,48],"./ion-back-button-md.entry.js":[94,49],"./ion-backdrop-ios.entry.js":[95,81],"./ion-backdrop-md.entry.js":[96,82],"./ion-button_2-ios.entry.js":[97,50],"./ion-button_2-md.entry.js":[98,51],"./ion-card_5-ios.entry.js":[99,52],"./ion-card_5-md.entry.js":[100,53],"./ion-checkbox-ios.entry.js":[101,54],"./ion-checkbox-md.entry.js":[102,55],"./ion-chip-ios.entry.js":[103,56],"./ion-chip-md.entry.js":[104,57],"./ion-col_3.entry.js":[105,83],"./ion-datetime_3-ios.entry.js":[106,20],"./ion-datetime_3-md.entry.js":[107,21],"./ion-fab_3-ios.entry.js":[108,58],"./ion-fab_3-md.entry.js":[109,59],"./ion-img.entry.js":[110,84],"./ion-infinite-scroll_2-ios.entry.js":[111,39],"./ion-infinite-scroll_2-md.entry.js":[112,40],"./ion-input-ios.entry.js":[113,60],"./ion-input-md.entry.js":[114,61],"./ion-item-option_3-ios.entry.js":[115,62],"./ion-item-option_3-md.entry.js":[116,63],"./ion-item_8-ios.entry.js":[117,64],"./ion-item_8-md.entry.js":[118,65],"./ion-loading-ios.entry.js":[119,26],"./ion-loading-md.entry.js":[120,27],"./ion-menu_4-ios.entry.js":[121,18],"./ion-menu_4-md.entry.js":[122,19],"./ion-modal-ios.entry.js":[123,14],"./ion-modal-md.entry.js":[124,15],"./ion-nav_5.entry.js":[125,13],"./ion-popover-ios.entry.js":[126,16],"./ion-popover-md.entry.js":[127,17],"./ion-progress-bar-ios.entry.js":[128,66],"./ion-progress-bar-md.entry.js":[129,67],"./ion-radio_2-ios.entry.js":[130,32],"./ion-radio_2-md.entry.js":[131,33],"./ion-range-ios.entry.js":[132,68],"./ion-range-md.entry.js":[133,69],"./ion-refresher_2-ios.entry.js":[134,41],"./ion-refresher_2-md.entry.js":[135,42],"./ion-reorder_2-ios.entry.js":[136,37],"./ion-reorder_2-md.entry.js":[137,38],"./ion-ripple-effect.entry.js":[138,85],"./ion-route_4.entry.js":[139,70],"./ion-searchbar-ios.entry.js":[140,28],"./ion-searchbar-md.entry.js":[141,29],"./ion-segment_2-ios.entry.js":[142,71],"./ion-segment_2-md.entry.js":[143,72],"./ion-select_3-ios.entry.js":[144,34],"./ion-select_3-md.entry.js":[145,35],"./ion-slide_2-ios.entry.js":[146,86],"./ion-slide_2-md.entry.js":[147,87],"./ion-spinner.entry.js":[148,73],"./ion-split-pane-ios.entry.js":[149,88],"./ion-split-pane-md.entry.js":[150,89],"./ion-tab-bar_2-ios.entry.js":[151,74],"./ion-tab-bar_2-md.entry.js":[152,75],"./ion-tab_2.entry.js":[153,36],"./ion-text.entry.js":[154,76],"./ion-textarea-ios.entry.js":[155,77],"./ion-textarea-md.entry.js":[156,78],"./ion-toast-ios.entry.js":[157,30],"./ion-toast-md.entry.js":[158,31],"./ion-toggle-ios.entry.js":[159,22],"./ion-toggle-md.entry.js":[160,23],"./ion-virtual-scroll.entry.js":[161,90]};function r(e){if(!t.o(a,e))return Promise.resolve().then((function(){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=a[e],r=n[0];return t.e(n[1]).then((function(){return t(r)}))}r.keys=function(){return Object.keys(a)},r.id=60,e.exports=r},61:function(e,n,t){var a={"./ion-icon.entry.js":[165,98]};function r(e){if(!t.o(a,e))return Promise.resolve().then((function(){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=a[e],r=n[0];return t.e(n[1]).then((function(){return t(r)}))}r.keys=function(){return Object.keys(a)},r.id=61,e.exports=r},77:function(e,n,t){},78:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),o=t(23),i=t.n(o),s=t(3),c=t(4),l=t(8),u=t(7),m=t(9),d=t(12),h=t(2),y=t(50),j=t(5),p=function e(){Object(s.a)(this,e),this.username="n/a",this.amount=0,this.reason="n/a",this.id=-1},f=function(e){function n(e){var t;return Object(s.a)(this,n),(t=Object(l.a)(this,Object(u.a)(n).call(this,e))).state={expenditures:Array(),showModal:!1,newItem:new p,userName:t.getUsername(),userNameIsSet:void 0!==t.getUsername(),balance:0},t.handleSubmit=t.handleSubmit.bind(Object(j.a)(t)),t.handleChangeAmount=t.handleChangeAmount.bind(Object(j.a)(t)),t.handleChangeReason=t.handleChangeReason.bind(Object(j.a)(t)),t.handleSubmitUsername=t.handleSubmitUsername.bind(Object(j.a)(t)),t.handleChangeUsername=t.handleChangeUsername.bind(Object(j.a)(t)),t}return Object(m.a)(n,e),Object(c.a)(n,[{key:"componentDidMount",value:function(){this.doRefresh()}},{key:"deleteExpenditure",value:function(e){var n=this;fetch("/api/expenditures/".concat(e.id),{method:"DELETE"}).then((function(t){var a=n.state.expenditures.filter((function(n){return n.id!==e.id}));n.setState({expenditures:a})})).catch(console.log)}},{key:"addExpenditure",value:function(e){var n=this,t={amount:(100*e.amount).toFixed(0),reason:e.reason,username:e.username};return fetch("/api/expenditures",{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify(t)}).then((function(e){n.doRefresh()})).catch(console.log)}},{key:"saveUsername",value:function(e){document.cookie="username=".concat(e)}},{key:"getUsername",value:function(){return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/,"$1")}},{key:"doRefresh",value:function(e){var n=this;fetch("/api/expenditures?limit=20").then((function(e){return e.json()})).then((function(t){n.setState({expenditures:t.map((function(e){return e.amount=e.amount/100,e}))}),e&&e.detail.complete()})).catch(console.log),fetch("/api/current-status").then((function(e){return e.json()})).then((function(e){var t=e.find((function(e){return e[0]===n.state.userName})),a=e.find((function(e){return e[0]!==n.state.userName})),r=t[1]-a[1];n.setState({balance:r/100})})).catch(console.log)}},{key:"handleChangeAmount",value:function(e){this.setState({newItem:{reason:this.state.newItem.reason,amount:e.detail.value}})}},{key:"handleChangeReason",value:function(e){this.setState({newItem:{amount:this.state.newItem.amount,reason:e.detail.value}})}},{key:"handleChangeUsername",value:function(e){this.setState({userName:e.detail.value})}},{key:"handleSubmit",value:function(e){var n=this;e.preventDefault();var t=this.state.newItem;t.username=this.state.userName,this.addExpenditure(t).then((function(){return n.setState({showModal:!1})}))}},{key:"handleSubmitUsername",value:function(e){e.preventDefault(),this.saveUsername(this.state.userName),this.setState({userNameIsSet:!0})}},{key:"render",value:function(){var e=this;return r.a.createElement(h.r,null,r.a.createElement(h.g,null,r.a.createElement(h.w,null,r.a.createElement(h.v,null,"Letzte Ausgaben"),r.a.createElement(h.n,{slot:"end"},"Status:"),r.a.createElement(h.n,{slot:"end",color:this.state.balance<0?"warning":"success"},this.state.balance," \u20ac"))),r.a.createElement(h.d,{className:"ion-padding"},r.a.createElement(h.s,{slot:"fixed",onIonRefresh:function(n){return e.doRefresh(n)}},r.a.createElement(h.t,null)),r.a.createElement(h.p,null,this.state.expenditures.map((function(n){return r.a.createElement(h.m,{key:n.id.toString()},r.a.createElement(h.j,null,r.a.createElement(h.n,null,n.reason),r.a.createElement(h.n,null,n.username),r.a.createElement(h.n,{slot:"end",color:"success"},n.amount,"\u20ac")),r.a.createElement(h.l,{side:"end"},r.a.createElement(h.k,{color:"danger",onClick:function(){e.deleteExpenditure(n)}},"L\xf6schen")))}))),r.a.createElement(h.e,{vertical:"bottom",horizontal:"end",slot:"fixed"},r.a.createElement(h.f,{onClick:function(){return e.setState({showModal:!0})}},r.a.createElement(h.h,{name:"add"})))),r.a.createElement(h.q,{isOpen:this.state.showModal},r.a.createElement("form",{onSubmit:this.handleSubmit},r.a.createElement(h.j,null,r.a.createElement(h.n,null,"Betrag"),r.a.createElement(h.i,{inputMode:"decimal",pattern:"^[0-9]+(\\.[0-9]{1,2})?$",required:!0,onIonChange:this.handleChangeAmount,placeholder:"0.00"})," \u20ac"),r.a.createElement(h.j,null,r.a.createElement(h.n,null,"Grund"),r.a.createElement(h.i,{required:!0,onIonChange:this.handleChangeReason,placeholder:"Shop oder Zweck"})),r.a.createElement(h.c,{color:"primary",type:"submit"},"Speichern"),r.a.createElement(h.c,{color:"light",onClick:function(){return e.setState({showModal:!1})}},"Abbrechen"))),r.a.createElement(h.q,{isOpen:!this.state.userNameIsSet},r.a.createElement("form",{onSubmit:this.handleSubmitUsername},r.a.createElement(h.j,null,r.a.createElement(h.n,null,"Nutzer"),r.a.createElement(h.i,{required:!0,onIonChange:this.handleChangeUsername})),r.a.createElement(h.c,{color:"primary",type:"submit"},"Speichern"))))}}]),n}(r.a.Component),b=(t(67),t(68),t(69),t(70),t(71),t(72),t(73),t(74),t(75),t(76),t(77),function(e){function n(){return Object(s.a)(this,n),Object(l.a)(this,Object(u.a)(n).apply(this,arguments))}return Object(m.a)(n,e),Object(c.a)(n,[{key:"render",value:function(){return r.a.createElement(h.b,null,r.a.createElement(y.a,null,r.a.createElement(h.u,null,r.a.createElement(d.b,{path:"/home",component:f,exact:!0}),r.a.createElement(d.b,{exact:!0,path:"/",render:function(){return r.a.createElement(d.a,{to:"/home"})}}))))}}]),n}(r.a.Component));i.a.render(r.a.createElement(b,null),document.getElementById("root"))}},[[54,9,10]]]);
//# sourceMappingURL=main.6c0afa5b.chunk.js.map