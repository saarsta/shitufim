jQuery.webshims.register("form-extend",function(a,b,m,j,t,h){m=m.Modernizr;t=m.inputtypes;if(m.formvalidation&&!b.bugs.bustedValidity){var f=b.inputTypes,s={};b.addInputType=function(c,a){f[c]=a};b.addValidityRule=function(c,a){s[c]=a};b.addValidityRule("typeMismatch",function(c,a,e,g){if(""===a)return!1;g=g.typeMismatch;if(!("type"in e))e.type=(c[0].getAttribute("type")||"").toLowerCase();f[e.type]&&f[e.type].mismatch&&(g=f[e.type].mismatch(a,c));return g});var o=h.overrideMessages,p=!t.number||
!t.time||!t.range||o,w="customError,typeMismatch,rangeUnderflow,rangeOverflow,stepMismatch,tooLong,patternMismatch,valueMissing,valid".split(","),h=o?["value","checked"]:["value"],n=[],i=function(c,g){if(c){var e=(c.getAttribute&&c.getAttribute("type")||c.type||"").toLowerCase();if(o||f[e])o&&!g&&"radio"==e&&c.name?a(j.getElementsByName(c.name)).each(function(){a.prop(this,"validity")}):a.prop(c,"validity")}},q={};["input","textarea","select"].forEach(function(c){var g=b.defineNodeNameProperty(c,
"setCustomValidity",{prop:{value:function(e){var e=e+"",v="input"==c?a(this).getNativeElement()[0]:this;g.prop._supvalue.call(v,e);b.bugs.validationMessage&&b.data(v,"customvalidationMessage",e);p&&(b.data(v,"hasCustomError",!!e),i(v))}}});q[c]=g.prop._supvalue});if(p||o)h.push("min"),h.push("max"),h.push("step"),n.push("input");o&&(h.push("required"),h.push("pattern"),n.push("select"),n.push("textarea"));if(p){var u;n.forEach(function(c){var g=b.defineNodeNameProperty(c,"validity",{prop:{get:function(){if(!u){var e=
"input"==c?a(this).getNativeElement()[0]:this,v=g.prop._supget.call(e);if(!v)return v;var d={};w.forEach(function(c){d[c]=v[c]});if(!a.prop(e,"willValidate"))return d;u=!0;var k=a(e),h={type:(e.getAttribute&&e.getAttribute("type")||"").toLowerCase(),nodeName:(e.nodeName||"").toLowerCase()},r=k.val(),y=!!b.data(e,"hasCustomError"),x;u=!1;d.customError=y;if(d.valid&&d.customError)d.valid=!1;else if(!d.valid){var i=!0;a.each(d,function(c,e){if(e)return i=!1});if(i)d.valid=!0}a.each(s,function(a,g){d[a]=
g(k,r,h,d);if(d[a]&&(d.valid||!x)&&(o||f[h.type]&&f[h.type].mismatch))q[c].call(e,b.createValidationMessage(e,a)),d.valid=!1,x=!0});d.valid?(q[c].call(e,""),b.data(e,"hasCustomError",!1)):o&&!x&&!y&&a.each(d,function(a,g){if("valid"!==a&&g)return q[c].call(e,b.createValidationMessage(e,a)),!1});return d}},writeable:!1}})});h.forEach(function(c){b.onNodeNamesPropertyModify(n,c,function(){i(this)})});if(j.addEventListener){var g,k=function(c){if("form"in c.target){var l=c.target.form;clearTimeout(g);
i(c.target);l&&o&&a("input",l).each(function(){"password"==this.type&&i(this)})}};j.addEventListener("change",k,!0);o&&(j.addEventListener("blur",k,!0),j.addEventListener("keydown",function(c){13==c.keyCode&&k(c)},!0));j.addEventListener("input",function(c){clearTimeout(g);g=setTimeout(function(){i(c.target)},290)},!0)}var d=n.join(",");b.addReady(function(c,g){a(d,c).add(g.filter(d)).each(function(){a.prop(this,"validity")})});o&&b.ready("DOM form-message",function(){b.activeLang({register:"form-core",
callback:function(){a("input, select, textarea").getNativeElement().each(function(){if(!b.data(this,"hasCustomError")){var c=this,g=a.prop(c,"validity")||{valid:!0},e;g.valid||(e=(c.nodeName||"").toLowerCase(),a.each(g,function(a,g){if("valid"!==a&&g)return q[e].call(c,b.createValidationMessage(c,a)),!1}))}})}})})}b.defineNodeNameProperty("input","type",{prop:{get:function(){var c=(this.getAttribute("type")||"").toLowerCase();return b.inputTypes[c]?c:this.type}}})}});
jQuery.webshims.register("form-number-date-api",function(a,b){var m,j,t;if(!b.getStep)b.getStep=function(g,b){var d=a.attr(g,"step");if("any"===d)return d;b=b||p(g);if(!f[b]||!f[b].step)return d;d=m.asNumber(d);return(!isNaN(d)&&0<d?d:f[b].step)*f[b].stepScaleFactor};if(!b.addMinMaxNumberToCache)b.addMinMaxNumberToCache=function(a,b,d){a+"AsNumber"in d||(d[a+"AsNumber"]=f[d.type].asNumber(b.attr(a)),isNaN(d[a+"AsNumber"])&&a+"Default"in f[d.type]&&(d[a+"AsNumber"]=f[d.type][a+"Default"]))};var h=
parseInt("NaN",10),f=b.inputTypes,s=function(a){return"number"==typeof a||a&&a==1*a},o=function(g){return a('<input type="'+g+'" />').prop("type")===g},p=function(a){return(a.getAttribute("type")||"").toLowerCase()},w=b.addMinMaxNumberToCache,n=function(a,b){for(var a=""+a,b=b-a.length,d=0;d<b;d++)a="0"+a;return a},i=b.bugs.valueAsNumberSet||b.bugs.bustedValidity;b.addValidityRule("stepMismatch",function(a,k,d,c){if(""===k)return!1;if(!("type"in d))d.type=p(a[0]);if("date"==d.type)return!1;c=(c||
{}).stepMismatch;if(f[d.type]&&f[d.type].step){if(!("step"in d))d.step=b.getStep(a[0],d.type);if("any"==d.step)return!1;if(!("valueAsNumber"in d))d.valueAsNumber=f[d.type].asNumber(k);if(isNaN(d.valueAsNumber))return!1;w("min",a,d);a=d.minAsNumber;isNaN(a)&&(a=f[d.type].stepBase||0);c=Math.abs((d.valueAsNumber-a)%d.step);c=!(1.0E-7>=c||1.0E-7>=Math.abs(c-d.step))}return c});[{name:"rangeOverflow",attr:"max",factor:1},{name:"rangeUnderflow",attr:"min",factor:-1}].forEach(function(a){b.addValidityRule(a.name,
function(b,d,c,l){l=(l||{})[a.name]||!1;if(""===d)return l;if(!("type"in c))c.type=p(b[0]);if(f[c.type]&&f[c.type].asNumber){if(!("valueAsNumber"in c))c.valueAsNumber=f[c.type].asNumber(d);if(isNaN(c.valueAsNumber))return!1;w(a.attr,b,c);if(isNaN(c[a.attr+"AsNumber"]))return l;l=c[a.attr+"AsNumber"]*a.factor<c.valueAsNumber*a.factor-1.0E-7}return l})});b.reflectProperties(["input"],["max","min","step"]);var q=b.defineNodeNameProperty("input","valueAsNumber",{prop:{get:function(){var b=p(this),b=f[b]&&
f[b].asNumber?f[b].asNumber(a.prop(this,"value")):q.prop._supget&&q.prop._supget.apply(this,arguments);null==b&&(b=h);return b},set:function(g){var k=p(this);f[k]&&f[k].numberToString?isNaN(g)?a.prop(this,"value",""):(k=f[k].numberToString(g),!1!==k?a.prop(this,"value",k):b.warn("INVALID_STATE_ERR: DOM Exception 11")):q.prop._supset&&q.prop._supset.apply(this,arguments)}}}),u=b.defineNodeNameProperty("input","valueAsDate",{prop:{get:function(){var b=p(this);return f[b]&&f[b].asDate&&!f[b].noAsDate?
f[b].asDate(a.prop(this,"value")):u.prop._supget&&u.prop._supget.call(this)||null},set:function(g){var k=p(this);if(f[k]&&f[k].dateToString&&!f[k].noAsDate){if(null===g)return a.prop(this,"value",""),"";k=f[k].dateToString(g);if(!1!==k)return a.prop(this,"value",k),k;b.warn("INVALID_STATE_ERR: DOM Exception 11")}else return u.prop._supset&&u.prop._supset.apply(this,arguments)||null}}});m={mismatch:function(a){return!s(a)},step:1,stepScaleFactor:1,asNumber:function(a){return s(a)?1*a:h},numberToString:function(a){return s(a)?
a:!1}};j={minDefault:0,maxDefault:100};t={mismatch:function(b){if(!b||!b.split||!/\d$/.test(b))return!0;var f=b.split(/\u002D/);if(3!==f.length)return!0;var d=!1;a.each(f,function(a,b){if(!(s(b)||b&&b=="0"+1*b))return d=!0,!1});if(d)return d;if(4!==f[0].length||2!=f[1].length||12<f[1]||2!=f[2].length||33<f[2])d=!0;return b!==this.dateToString(this.asDate(b,!0))},step:1,stepScaleFactor:864E5,asDate:function(a,b){return!b&&this.mismatch(a)?null:new Date(this.asNumber(a,!0))},asNumber:function(a,b){var d=
h;if(b||!this.mismatch(a))a=a.split(/\u002D/),d=Date.UTC(a[0],a[1]-1,a[2]);return d},numberToString:function(a){return s(a)?this.dateToString(new Date(1*a)):!1},dateToString:function(a){return a&&a.getFullYear?a.getUTCFullYear()+"-"+n(a.getUTCMonth()+1,2)+"-"+n(a.getUTCDate(),2):!1}};if(i||!o("range")||!o("time"))j=a.extend({},m,j);(i||!o("number"))&&b.addInputType("number",m);(i||!o("range"))&&b.addInputType("range",j);(i||!o("date"))&&b.addInputType("date",t)});
jQuery.webshims.register("form-number-date-ui",function(a,b,m,j,t,h){var f=b.triggerInlineForm,s=Modernizr.inputtypes,o=function(){var a={"padding-box":"innerWidth","border-box":"outerWidth","content-box":"width"},b=Modernizr.prefixed&&Modernizr.prefixed("boxSizing");return function(e,d){var f,g,h;g="width";b&&(g=a[e.css(b)]||g);f=e[g]();g="width"==g;if(f){var r=parseInt(d.css("marginLeft"),10)||0,i=d.outerWidth();(h=parseInt(e.css("marginRight"),10)||0)&&e.css("marginRight",0);r<=-1*i?(d.css("marginRight",
Math.floor(Math.abs(i+r-0.1)+h)),e.css("paddingRight",(parseInt(e.css("paddingRight"),10)||0)+Math.abs(r)),g&&e.css("width",Math.floor(f+r))):(d.css("marginRight",h),e.css("width",Math.floor(f-r-i-0.2)))}}}(),p={},w=a([]),n,i=function(c,l){a("input",c).add(l.filter("input")).each(function(){var c=a.prop(this,"type");if(i[c]&&!b.data(this,"shadowData"))i[c](a(this))})},q=function(c,b){if(h.lazyDate){var e=a.data(c[0],"setDateLazyTimer");e&&clearTimeout(e);a.data(c[0],"setDateLazyTimer",setTimeout(function(){c.datepicker("setDate",
b);a.removeData(c[0],"setDateLazyTimer");c=null},0))}else c.datepicker("setDate",b)};if(h.lazyDate===t)try{h.lazyDate=a.browser.msie&&9>b.browserVersion||500>a(m).width()&&500>a(m).height()}catch(u){}var g={tabindex:1,tabIndex:1,title:1,"aria-required":1,"aria-invalid":1};if(!h.copyAttrs)h.copyAttrs={};b.extendUNDEFProp(h.copyAttrs,g);var k=function(a){return h.calculateWidth?{css:{marginRight:a.css("marginRight"),marginLeft:a.css("marginLeft")},outerWidth:a.outerWidth()}:{}};i.common=function(c,
l,e){Modernizr.formvalidation&&c.bind("firstinvalid",function(a){(b.fromSubmit||!n)&&c.unbind("invalid.replacedwidgetbubble").bind("invalid.replacedwidgetbubble",function(e){!a.isInvalidUIPrevented()&&!e.isDefaultPrevented()&&(b.validityAlert.showFor(a.target),a.preventDefault(),e.preventDefault());c.unbind("invalid.replacedwidgetbubble")})});var d,f,i=a("input, span.ui-slider-handle",l),k=c[0].attributes;for(d in h.copyAttrs)if((f=k[d])&&f.specified)g[d]&&i[0]?i.attr(d,f.nodeValue):l[0].setAttribute(d,
f.nodeValue);d=(d=c.attr("id"))?a('label[for="'+d+'"]',c[0].form):w;l.addClass(c[0].className);b.addShadowDom(c,l,{data:e||{},shadowFocusElement:a("input.input-datetime-local-date, span.ui-slider-handle",l)[0],shadowChilds:i});c.after(l);c[0].form&&a(c[0].form).bind("reset",function(a){a.originalEvent&&!a.isDefaultPrevented()&&setTimeout(function(){c.prop("value",c.prop("value"))},0)});d[0]&&(l.getShadowFocusElement().attr("aria-labelledby",b.getID(d)),d.bind("click",function(){c.getShadowFocusElement().focus();
return!1}))};Modernizr.formvalidation&&["input","form"].forEach(function(a){var d=b.defineNodeNameProperty(a,"checkValidity",{prop:{value:function(){n=!0;var a=d.prop._supvalue.apply(this,arguments);n=!1;return a}}})});if(!s.date||h.replaceUI){var d=function(c,d,e,f){var g,i,k=function(){r.dpDiv.unbind("mousedown.webshimsmousedownhandler");i=g=!1},r=d.bind("focusin",function(){k();r.dpDiv.unbind("mousedown.webshimsmousedownhandler").bind("mousedown.webshimsmousedownhandler",function(){g=!0})}).bind("focusout blur",
function(a){g&&(i=!0,a.stopImmediatePropagation())}).datepicker(a.extend({onClose:function(){i&&d.not(":focus")?(k(),d.trigger("focusout"),d.triggerHandler("blur")):k()}},p,h.datepicker,c.data("datepicker"))).bind("change",e).data("datepicker");r.dpDiv.addClass("input-date-datepicker-control");f&&b.triggerDomUpdate(f[0]);"disabled,min,max,value,step,data-placeholder".split(",").forEach(function(a){var e=c.attr(a);e&&c.attr(a,e)});return r};i.date=function(c){if(a.fn.datepicker){var l=a('<input class="input-date" type="text" />'),
e;this.common(c,l,i.date.attrs);e=d(c,l,function(e){i.date.blockAttr=!0;var b;if(h.lazyDate){var d=a.data(l[0],"setDateLazyTimer");d&&(clearTimeout(d),a.removeData(l[0],"setDateLazyTimer"))}try{b=(b=a.datepicker.parseDate(l.datepicker("option","dateFormat"),l.prop("value")))?a.datepicker.formatDate("yy-mm-dd",b):l.prop("value")}catch(g){b=l.prop("value")}c.prop("value",b);i.date.blockAttr=!1;e.stopImmediatePropagation();f(c[0],"input");f(c[0],"change")});a(c).bind("updateshadowdom",function(){if(e.trigger[0]&&
(c.css({display:""}),c[0].offsetWidth||c[0].offsetHeight)){var a=k(c);a.css&&(l.css(a.css),a.outerWidth&&l.outerWidth(a.outerWidth),o(l,e.trigger))}c.css({display:"none"})}).triggerHandler("updateshadowdom");e.trigger[0]&&setTimeout(function(){b.ready("WINDOWLOAD",function(){a(c).triggerHandler("updateshadowdom")})},9)}};i.date.attrs={disabled:function(c,b,e){a.prop(b,"disabled",!!e)},min:function(c,b,e){try{e=a.datepicker.parseDate("yy-mm-dd",e)}catch(d){e=!1}e&&a(b).datepicker("option","minDate",
e)},max:function(c,b,e){try{e=a.datepicker.parseDate("yy-mm-dd",e)}catch(d){e=!1}e&&a(b).datepicker("option","maxDate",e)},"data-placeholder":function(c,b,e){c=(e||"").split("-");3==c.length&&(e=a(b).datepicker("option","dateFormat").replace("yy",c[0]).replace("mm",c[1]).replace("dd",c[2]));a.prop(b,"placeholder",e)},value:function(c,b,e){if(!i.date.blockAttr){try{var d=a.datepicker.parseDate("yy-mm-dd",e)}catch(f){d=!1}d?q(a(b),d):a.prop(b,"value",e)}}}}if(!s.range||h.replaceUI)i.range=function(c){if(a.fn.slider){var b=
a('<span class="input-range"><span class="ui-slider-handle" role="slider" tabindex="0" /></span>');this.common(c,b,i.range.attrs);c.bind("updateshadowdom",function(){c.css({display:""});if(c[0].offsetWidth||c[0].offsetHeight){var a=k(c);a.css&&(b.css(a.css),a.outerWidth&&b.outerWidth(a.outerWidth))}c.css({display:"none"})}).triggerHandler("updateshadowdom");b.slider(a.extend(!0,{},h.slider,c.data("slider"))).bind("slide",function(a,b){if(a.originalEvent)i.range.blockAttr=!0,c.prop("value",b.value),
i.range.blockAttr=!1,f(c[0],"input"),f(c[0],"change")});["disabled","min","max","step","value"].forEach(function(b){var d=c.prop(b),f;"value"==b&&!d&&(f=c.getShadowElement())&&(d=(a(f).slider("option","max")-a(f).slider("option","min"))/2);null!=d&&c.prop(b,d)})}},i.range.attrs={disabled:function(c,b,e){e=!!e;a(b).slider("option","disabled",e);a("span",b).attr({"aria-disabled":e+"",tabindex:e?"-1":"0"})},min:function(b,d,e){e=e?1*e||0:0;a(d).slider("option","min",e);a("span",d).attr({"aria-valuemin":e})},
max:function(b,d,e){e=e||0===e?1*e||100:100;a(d).slider("option","max",e);a("span",d).attr({"aria-valuemax":e})},value:function(b,d,e){e=a(b).prop("valueAsNumber");isNaN(e)||(i.range.blockAttr||a(d).slider("option","value",e),a("span",d).attr({"aria-valuenow":e,"aria-valuetext":e}))},step:function(b,d,e){e=e&&a.trim(e)?1*e||1:1;a(d).slider("option","step",e)}};if(!b.bugs.valueAsNumberSet&&(h.replaceUI||!Modernizr.inputtypes.date||!Modernizr.inputtypes.range))m=function(){b.data(this,"hasShadow")&&
a.prop(this,"value",a.prop(this,"value"))},b.onNodeNamesPropertyModify("input","valueAsNumber",m),b.onNodeNamesPropertyModify("input","valueAsDate",m);a.each("disabled,min,max,value,step,data-placeholder".split(","),function(a,d){b.onNodeNamesPropertyModify("input",d,function(a){var c=b.data(this,"shadowData");if(c&&c.data&&c.data[d]&&c.nativeElement===this)c.data[d](this,c.shadowElement,a)})});if(!h.availabeLangs)h.availabeLangs="af ar ar-DZ az bg bs ca cs da de el en-AU en-GB en-NZ eo es et eu fa fi fo fr fr-CH gl he hr hu hy id is it ja ko kz lt lv ml ms nl no pl pt-BR rm ro ru sk sl sq sr sr-SR sv ta th tr uk vi zh-CN zh-HK zh-TW".split(" ");
m=function(){a.datepicker&&(b.activeLang({langObj:a.datepicker.regional,module:"form-number-date-ui",callback:function(b){b=a.extend({},p,b,h.datepicker);b.dateFormat&&h.datepicker.dateFormat!=b.dateFormat&&a("input.hasDatepicker").filter(".input-date, .input-datetime-local-date").datepicker("option","dateFormat",b.dateFormat).getNativeElement().filter("[data-placeholder]").attr("data-placeholder",function(a,b){return b});a.datepicker.setDefaults(b)}}),a(j).unbind("jquery-uiReady.langchange input-widgetsReady.langchange"))};
a(j).bind("jquery-uiReady.langchange input-widgetsReady.langchange",m);m();(function(){var c=function(){var b={};return function(c){return c in b?b[c]:b[c]=a('<input type="'+c+'" />')[0].type===c}}();if(!c("number")){var d=b.cfg["forms-ext"],e=b.inputTypes,g=function(c,d,f){f=f||{};if(!("type"in f))f.type=a.prop(c,"type");if(!("step"in f))f.step=b.getStep(c,f.type);if(!("valueAsNumber"in f))f.valueAsNumber=e[f.type].asNumber(a.prop(c,"value"));var g="any"==f.step?e[f.type].step*e[f.type].stepScaleFactor:
f.step;b.addMinMaxNumberToCache("min",a(c),f);b.addMinMaxNumberToCache("max",a(c),f);if(isNaN(f.valueAsNumber))f.valueAsNumber=e[f.type].stepBase||0;if("any"!==f.step&&(c=Math.round(1E7*((f.valueAsNumber-(f.minAsnumber||0))%f.step))/1E7)&&Math.abs(c)!=f.step)f.valueAsNumber-=c;c=f.valueAsNumber+g*d;return c=!isNaN(f.minAsNumber)&&c<f.minAsNumber?f.valueAsNumber*d<f.minAsNumber?f.minAsNumber:isNaN(f.maxAsNumber)?f.valueAsNumber:f.maxAsNumber:!isNaN(f.maxAsNumber)&&c>f.maxAsNumber?f.valueAsNumber*d>
f.maxAsNumber?f.maxAsNumber:isNaN(f.minAsNumber)?f.valueAsNumber:f.minAsNumber:Math.round(1E7*c)/1E7};b.modules["form-number-date-ui"].getNextStep=g;var i=function(b,c,d){if(!b.disabled&&!b.readOnly&&!a(d).hasClass("step-controls")&&(a.prop(b,"value",e[c].numberToString(g(b,a(d).hasClass("step-up")?1:-1,{type:c}))),a(b).unbind("blur.stepeventshim"),f(b,"input"),j.activeElement)){if(j.activeElement!==b)try{b.focus()}catch(i){}setTimeout(function(){if(j.activeElement!==b)try{b.focus()}catch(c){}a(b).one("blur.stepeventshim",
function(){f(b,"change")})},0)}};if(d.stepArrows){var h={set:function(){var a=b.data(this,"step-controls");if(a)a[this.disabled||this.readonly?"addClass":"removeClass"]("disabled-step-control")}};b.onNodeNamesPropertyModify("input","disabled",h);b.onNodeNamesPropertyModify("input","readonly",a.extend({},h))}var k={38:1,40:-1};b.addReady(function(h,j){d.stepArrows&&a("input",h).add(j.filter("input")).each(function(){var h=a.prop(this,"type");if(e[h]&&e[h].asNumber&&d.stepArrows&&!(!0!==d.stepArrows&&
!d.stepArrows[h]||c(h)||a(j).hasClass("has-step-controls"))){var j=this,m=a('<span class="step-controls" unselectable="on"><span class="step-up" /><span class="step-down" /></span>').insertAfter(j).bind("selectstart dragstart",function(){return!1}).bind("mousedown mousepress",function(a){i(j,h,a.target);return!1}).bind("mousepressstart mousepressend",function(b){a(b.target)["mousepressstart"==b.type?"addClass":"removeClass"]("mousepress-ui")}),p=function(b,c){if(!j.disabled&&!j.readOnly)return a.prop(j,
"value",e[h].numberToString(g(j,c,{type:h}))),f(j,"input"),!1},n=a(j).addClass("has-step-controls").attr({readonly:j.readOnly,disabled:j.disabled,autocomplete:"off",role:"spinbutton"}).bind(a.browser.msie?"keydown":"keypress",function(b){if(!j.disabled&&!j.readOnly&&k[b.keyCode])return a.prop(j,"value",e[h].numberToString(g(j,k[b.keyCode],{type:h}))),f(j,"input"),!1});"number"==h&&n.bind("keypress",function(){return function(a){var b=String.fromCharCode(null==a.charCode?a.keyCode:a.charCode);return a.ctrlKey||
a.metaKey||" ">b||-1<"0123456789.".indexOf(b)}}());a.fn.mwheelIntent?n.add(m).bind("mwheelIntent",p):n.bind("focus",function(){n.add(m).unbind(".mwhellwebshims").bind("mousewheel.mwhellwebshims",p)}).bind("blur",function(){a(j).add(m).unbind(".mwhellwebshims")});b.data(j,"step-controls",m);if(d.calculateWidth){var q;n.bind("updateshadowdom",function(){if(!q&&(j.offsetWidth||j.offsetHeight))q=!0,o(n,m),m.css("marginTop",(n.outerHeight()-m.outerHeight())/2)}).triggerHandler("updateshadowdom")}}})})}})();
b.addReady(function(c,d){a(j).bind("jquery-uiReady.initinputui input-widgetsReady.initinputui",function(){if(a.datepicker||a.fn.slider){if(a.datepicker&&!p.dateFormat)p.dateFormat=a.datepicker._defaults.dateFormat;i(c,d)}a.datepicker&&a.fn.slider?a(j).unbind(".initinputui"):b.modules["input-widgets"].src||b.warn('jQuery UI Widget factory is already included, but not datepicker or slider. configure src of $.webshims.modules["input-widgets"].src')})})});