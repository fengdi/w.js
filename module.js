//W.js by tangoboy[https://github.com/fengdi/w.js][Apache license]
;(function(G, S, U){
var P = 'prototype',
	D = document,
	DOM = S.DOM,
	Anim = S.Anim,
	Event = S.Event,
	UA = S.UA,
	IO = S.io,
	GUID = 0,
	NOOP = function(){},
	mix = function(a,b){
		for(var i in b){
			a[i] = b[i];
		}
		return a;
	},
	type = function(obj, type) {
		var ts = {}.toString,
			t = obj===null ? 'null' :
			(obj===undefined && 'undefined' || ts.call(obj).slice(8,-1).toLowerCase());
		return type ? t===type : t;
	},
	log = function(){
		if(UA.chrome || UA.firefox || UA.opera){
			console.log.apply(console, arguments);
		}
	},
	trim = function(str){
		return "".trim ? "".trim.call(str) : 
		(str+"").replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, "");
	},
	camelize = function(str) {
		// 连接号-转驼峰命名法
		return str.replace(/-+(.)?/g, function(match, chr) {
			return chr ? chr.toUpperCase() : '';
		});
	},
	eachWords = function(words, callback){
		var ret = [];
		(words+"").replace(/[^,\s]+/g, function(word){
			ret.push(callback(word));
		});
		return ret;
	},
	CSS = function(elem, name, val){
		var arg = arguments;
		if(arg.length == 3){
			elem.style[camelize(name)] = val;
		}else if(arg.length == 2){
			if(type(name, "object")){
				for(var k in name){
					elem.style[camelize(k)] = name[k];
				}
			}else{
				return elem.style[camelize(name)];
			}
		}
	},
	find = function(s, c){
		return (c||S).all(s).c_getDOMNodes()||U;
	};
	function W(selector, context){
		return new W.fn.init(selector, context);
	}
	W.fn  = W[P] = {
		init:function(s, c){
			if (!s ) {
				return this;
			}
			if( s.nodeType ) {
				return this.setArray([s]);
			}
			if(W.type(s,'string')) {
				return this.setArray( s === "body" ? [D.body] : find(s, c));
			}
			if(s.length && s[0] && ('nodeType' in s[0])){
				return this.setArray(s);
			}
			return this;
		},
		makeArray:function(o){
			if('length' in o){
				var ret = [];
				for (var i = 0,l = o.length; i < l; i++) {
					ret[i] = o[i];
				}
				return ret;
			}
			return [];
		},
		setArray:function(arr) {
			this.initArray();
			[].push.apply(this, arr);
			return this;
		},
		initArray:function(){
			//清空数组
			//this.length = 0;
			//设置类数组长度为0 在虚拟机中无效 只能逐个删除
			for(var i=this.length;i>0;i--){
				this.shift();
			}
		},
		length: 0,
		splice: [].splice,
		shift: [].shift,
		push: [].push,
		pop: [].pop,
		slice: [].slice,
		unshift: [].unshift,
		concat: [].concat,
		toA:function(){
			return this.makeArray(this);
		},
		index:function(el){
			var idx = -1;
			if(el===U){
				var n = this[0],i=0;
				while(n && (n = n.previousSibling)){
					if ( n.nodeType === 1 ) {
						i++;
					}
				}
				idx = i;
			}else{
				this.each(function(e,d){
					if(e===el){
						idx = d;
					}
				});
			}
			return idx;
		},
		eq:function( i ) {
			return W(i === -1 ? this.slice( i ) :this.slice( i, +i + 1 ));
		},
		each:function(cb){
			var s = this,i=0;
			for(;i<s.length;i++){
				cb.call(s[i],s[i],i);
			}
			return this;
		},
		find:function(selector){
			return W(selector,this);
		},
		html:function(html){
			if(html !== U){
				this.each(function(){
					this.innerHTML = html;
				});
				return this;
			}else{
				return this[0]?this[0].innerHTML:U;
			}
		},
		css:function(name,val){
			if(val !== U){
				this.each(function(elem){
					CSS(elem,name,val);
				});
				return this;
			}else{
				return CSS(this[0],name);
			}
		}
	};
	eachWords("c_getDOMNodes,end,equals,c_add,item,slice,scrollTop,scrollLeft,height,width," +
	"c_appendTo,c_prependTo,c_insertBefore,c_insertAfter,c_animate,stop,run,pause," +
	"resume,isRunning,isPaused,show,hide,toggle,fadeIn,fadeOut,fadeToggle,slideDown," +
	"slideUp,slideToggle,c_filter,test,clone,empty,replaceWith,parent,hasClass," +
	"c_addClass,removeClass,replaceClass,toggleClass,val,text,toggle,offset," +
	"scrollIntoView,c_next,c_prev,c_first,c_last,c_siblings,c_children,contains," +
	"remove,contains,innerWidth,innerHeight,outerWidth,outerHeight,c_on,c_detach," +
	"fire,all,c_delegate,c_attr,c_hasAttr,c_removeAttr,c_data,c_hasData,c_removeData,len", function(word){
			var base = word.replace(/^c_/,"");
			W.fn[base] = W[P][base] = function(){
				var elems = S.all(this.toA());
				var re = elems[word].apply(elems, arguments);
				if(elems==re){
					return this;
				}else if(re && re.c_getDOMNodes){
					return W(re.c_getDOMNodes());
				}else{
					return re;
				}
			};
	});
	W.fn.init[P] = W.fn;
	mix(W, {
		version:"2.0",
		noop:NOOP,
		toString:function(){
			return 'W.js v'+W.version+' by tangoboy.';
		},
		extend:function(e){
			return mix(this, e);
		},
		mix:mix,
		guid:function(p){
			return (p||'') + GUID++;
		},
		trim:trim,
		ua:UA,
		log:log,
		css:CSS,
		Anim:Anim,
		type:type,
		io:IO,
		tpl:S.substitute,
		camelize:camelize
	});


	G.$ = W;
})(this, KISSY);


//=\\=//=\\=//=\\=//=\\= W.js End //=\\=//=\\=//=\\=//=\\=

(function(f){
	try{f()}catch(e){$.log(e+"")}
})(function(){

	//这里开始写代码！！！！！


});
