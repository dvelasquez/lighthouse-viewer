function k(){}function j(t){return t()}function S(){return Object.create(null)}function d(t){t.forEach(j)}function N(t){return typeof t=="function"}function L(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}function z(t){return Object.keys(t).length===0}function Q(t,n,e){t.insertBefore(n,e||null)}function A(t){t.parentNode.removeChild(t)}function R(t){return document.createElement(t)}function B(t){return Array.from(t.childNodes)}let i;function f(t){i=t}function F(){if(!i)throw new Error("Function called outside component initialization");return i}function T(t){F().$$.on_mount.push(t)}const l=[],O=[],_=[],C=[],P=Promise.resolve();let $=!1;function q(){$||($=!0,P.then(M))}function y(t){_.push(t)}const x=new Set;let h=0;function M(){const t=i;do{for(;h<l.length;){const n=l[h];h++,f(n),D(n.$$)}for(f(null),l.length=0,h=0;O.length;)O.pop()();for(let n=0;n<_.length;n+=1){const e=_[n];x.has(e)||(x.add(e),e())}_.length=0}while(l.length);for(;C.length;)C.pop()();$=!1,x.clear(),f(t)}function D(t){if(t.fragment!==null){t.update(),d(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(y)}}const m=new Set;let G;function H(t,n){t&&t.i&&(m.delete(t),t.i(n))}function U(t,n,e,r){if(t&&t.o){if(m.has(t))return;m.add(t),G.c.push(()=>{m.delete(t),r&&(e&&t.d(1),r())}),t.o(n)}}function V(t){t&&t.c()}function I(t,n,e,r){const{fragment:s,on_mount:g,on_destroy:a,after_update:p}=t.$$;s&&s.m(n,e),r||y(()=>{const c=g.map(j).filter(N);a?a.push(...c):d(c),t.$$.on_mount=[]}),p.forEach(y)}function J(t,n){const e=t.$$;e.fragment!==null&&(d(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function K(t,n){t.$$.dirty[0]===-1&&(l.push(t),q(),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function W(t,n,e,r,s,g,a,p=[-1]){const c=i;f(t);const o=t.$$={fragment:null,ctx:null,props:g,update:k,not_equal:s,bound:S(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(c?c.$$.context:[])),callbacks:S(),dirty:p,skip_bound:!1,root:n.target||c.$$.root};a&&a(o.root);let b=!1;if(o.ctx=e?e(t,n.props||{},(u,w,...E)=>{const v=E.length?E[0]:w;return o.ctx&&s(o.ctx[u],o.ctx[u]=v)&&(!o.skip_bound&&o.bound[u]&&o.bound[u](v),b&&K(t,u)),w}):[],o.update(),b=!0,d(o.before_update),o.fragment=r?r(o.ctx):!1,n.target){if(n.hydrate){const u=B(n.target);o.fragment&&o.fragment.l(u),u.forEach(A)}else o.fragment&&o.fragment.c();n.intro&&H(t.$$.fragment),I(t,n.target,n.anchor,n.customElement),M()}f(c)}class X{$destroy(){J(this,1),this.$destroy=k}$on(n,e){const r=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return r.push(e),()=>{const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}$set(n){this.$$set&&!z(n)&&(this.$$.skip_bound=!0,this.$$set(n),this.$$.skip_bound=!1)}}export{X as S,Q as a,O as b,V as c,A as d,R as e,U as f,J as g,W as i,I as m,k as n,T as o,L as s,H as t};
