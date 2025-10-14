const Ce = (e, t) => e === t, B = {
  equals: Ce
};
let xe = be;
const S = 1, P = 2, ue = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var _ = null;
let J = null, b = null, v = null, k = null, q = 0;
function ke(e, t) {
  const n = b, o = _, r = e.length === 0, i = t === void 0 ? o : t, a = r ? ue : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, s = r ? e : () => e(() => K(() => O(a)));
  _ = a, b = null;
  try {
    return N(s, !0);
  } finally {
    b = n, _ = o;
  }
}
function de(e, t) {
  t = t ? Object.assign({}, B, t) : B;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, o = (r) => (typeof r == "function" && (r = r(n.value)), pe(n, r));
  return [fe.bind(n), o];
}
function z(e, t, n) {
  const o = ge(e, t, !1, S);
  I(o);
}
function Se(e, t, n) {
  n = n ? Object.assign({}, B, n) : B;
  const o = ge(e, t, !0, 0);
  return o.observers = null, o.observerSlots = null, o.comparator = n.equals || void 0, I(o), fe.bind(o);
}
function K(e) {
  if (b === null) return e();
  const t = b;
  b = null;
  try {
    return e();
  } finally {
    b = t;
  }
}
function fe() {
  if (this.sources && this.state)
    if (this.state === S) I(this);
    else {
      const e = v;
      v = null, N(() => D(this), !1), v = e;
    }
  if (b) {
    const e = this.observers ? this.observers.length : 0;
    b.sources ? (b.sources.push(this), b.sourceSlots.push(e)) : (b.sources = [this], b.sourceSlots = [e]), this.observers ? (this.observers.push(b), this.observerSlots.push(b.sources.length - 1)) : (this.observers = [b], this.observerSlots = [b.sources.length - 1]);
  }
  return this.value;
}
function pe(e, t, n) {
  let o = e.value;
  return (!e.comparator || !e.comparator(o, t)) && (e.value = t, e.observers && e.observers.length && N(() => {
    for (let r = 0; r < e.observers.length; r += 1) {
      const i = e.observers[r], a = J && J.running;
      a && J.disposed.has(i), (a ? !i.tState : !i.state) && (i.pure ? v.push(i) : k.push(i), i.observers && ye(i)), a || (i.state = S);
    }
    if (v.length > 1e6)
      throw v = [], new Error();
  }, !1)), t;
}
function I(e) {
  if (!e.fn) return;
  O(e);
  const t = q;
  Ae(e, e.value, t);
}
function Ae(e, t, n) {
  let o;
  const r = _, i = b;
  b = _ = e;
  try {
    o = e.fn(t);
  } catch (a) {
    return e.pure && (e.state = S, e.owned && e.owned.forEach(O), e.owned = null), e.updatedAt = n + 1, ve(a);
  } finally {
    b = i, _ = r;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? pe(e, o) : e.value = o, e.updatedAt = n);
}
function ge(e, t, n, o = S, r) {
  const i = {
    fn: e,
    state: o,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: _,
    context: _ ? _.context : null,
    pure: n
  };
  return _ === null || _ !== ue && (_.owned ? _.owned.push(i) : _.owned = [i]), i;
}
function he(e) {
  if (e.state === 0) return;
  if (e.state === P) return D(e);
  if (e.suspense && K(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < q); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === S)
      I(e);
    else if (e.state === P) {
      const o = v;
      v = null, N(() => D(e, t[0]), !1), v = o;
    }
}
function N(e, t) {
  if (v) return e();
  let n = !1;
  t || (v = []), k ? n = !0 : k = [], q++;
  try {
    const o = e();
    return Ee(n), o;
  } catch (o) {
    n || (k = null), v = null, ve(o);
  }
}
function Ee(e) {
  if (v && (be(v), v = null), e) return;
  const t = k;
  k = null, t.length && N(() => xe(t), !1);
}
function be(e) {
  for (let t = 0; t < e.length; t++) he(e[t]);
}
function D(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const o = e.sources[n];
    if (o.sources) {
      const r = o.state;
      r === S ? o !== t && (!o.updatedAt || o.updatedAt < q) && he(o) : r === P && D(o, t);
    }
  }
}
function ye(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = P, n.pure ? v.push(n) : k.push(n), n.observers && ye(n));
  }
}
function O(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), o = e.sourceSlots.pop(), r = n.observers;
      if (r && r.length) {
        const i = r.pop(), a = n.observerSlots.pop();
        o < r.length && (i.sourceSlots[a] = o, r[o] = i, n.observerSlots[o] = a);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) O(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) O(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function $e(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function ve(e, t = _) {
  throw $e(e);
}
function M(e, t) {
  return K(() => e(t || {}));
}
const R = (e) => Se(() => e());
function Te(e, t, n) {
  let o = n.length, r = t.length, i = o, a = 0, s = 0, l = t[r - 1].nextSibling, c = null;
  for (; a < r || s < i; ) {
    if (t[a] === n[s]) {
      a++, s++;
      continue;
    }
    for (; t[r - 1] === n[i - 1]; )
      r--, i--;
    if (r === a) {
      const u = i < o ? s ? n[s - 1].nextSibling : n[i - s] : l;
      for (; s < i; ) e.insertBefore(n[s++], u);
    } else if (i === s)
      for (; a < r; )
        (!c || !c.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === n[i - 1] && n[s] === t[r - 1]) {
      const u = t[--r].nextSibling;
      e.insertBefore(n[s++], t[a++].nextSibling), e.insertBefore(n[--i], u), t[r] = n[i];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let g = s;
        for (; g < i; ) c.set(n[g], g++);
      }
      const u = c.get(t[a]);
      if (u != null)
        if (s < u && u < i) {
          let g = a, p = 1, y;
          for (; ++g < r && g < i && !((y = c.get(t[g])) == null || y !== u + p); )
            p++;
          if (p > u - s) {
            const $ = t[a];
            for (; s < u; ) e.insertBefore(n[s++], $);
          } else e.replaceChild(n[s++], t[a++]);
        } else a++;
      else t[a++].remove();
    }
  }
}
const oe = "_$DX_DELEGATE";
function L(e, t, n, o) {
  let r;
  const i = () => {
    const s = document.createElement("template");
    return s.innerHTML = e, s.content.firstChild;
  }, a = () => (r || (r = i())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function Oe(e, t = window.document) {
  const n = t[oe] || (t[oe] = /* @__PURE__ */ new Set());
  for (let o = 0, r = e.length; o < r; o++) {
    const i = e[o];
    n.has(i) || (n.add(i), t.addEventListener(i, Ne));
  }
}
function T(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function je(e, t, n) {
  if (!t) return n ? T(e, "style") : t;
  const o = e.style;
  if (typeof t == "string") return o.cssText = t;
  typeof n == "string" && (o.cssText = n = void 0), n || (n = {}), t || (t = {});
  let r, i;
  for (i in n)
    t[i] == null && o.removeProperty(i), delete n[i];
  for (i in t)
    r = t[i], r !== n[i] && (o.setProperty(i, r), n[i] = r);
  return n;
}
function x(e, t, n, o) {
  if (n !== void 0 && !o && (o = []), typeof t != "function") return F(e, t, o, n);
  z((r) => F(e, t(), r, n), o);
}
function Ne(e) {
  let t = e.target;
  const n = `$$${e.type}`, o = e.target, r = e.currentTarget, i = (l) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: l
  }), a = () => {
    const l = t[n];
    if (l && !t.disabled) {
      const c = t[`${n}Data`];
      if (c !== void 0 ? l.call(t, c, e) : l.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, s = () => {
    for (; a() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const l = e.composedPath();
    i(l[0]);
    for (let c = 0; c < l.length - 2 && (t = l[c], !!a()); c++) {
      if (t._$host) {
        t = t._$host, s();
        break;
      }
      if (t.parentNode === r)
        break;
    }
  } else s();
  i(o);
}
function F(e, t, n, o, r) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const i = typeof t, a = o !== void 0;
  if (e = a && n[0] && n[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === n))
      return n;
    if (a) {
      let s = n[0];
      s && s.nodeType === 3 ? s.data !== t && (s.data = t) : s = document.createTextNode(t), n = A(e, n, o, s);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean")
    n = A(e, n, o);
  else {
    if (i === "function")
      return z(() => {
        let s = t();
        for (; typeof s == "function"; ) s = s();
        n = F(e, s, n, o);
      }), () => n;
    if (Array.isArray(t)) {
      const s = [], l = n && Array.isArray(n);
      if (G(s, t, n, r))
        return z(() => n = F(e, s, n, o, !0)), () => n;
      if (s.length === 0) {
        if (n = A(e, n, o), a) return n;
      } else l ? n.length === 0 ? re(e, s, o) : Te(e, n, s) : (n && A(e), re(e, s));
      n = s;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (a) return n = A(e, n, o, t);
        A(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function G(e, t, n, o) {
  let r = !1;
  for (let i = 0, a = t.length; i < a; i++) {
    let s = t[i], l = n && n[e.length], c;
    if (!(s == null || s === !0 || s === !1)) if ((c = typeof s) == "object" && s.nodeType)
      e.push(s);
    else if (Array.isArray(s))
      r = G(e, s, l) || r;
    else if (c === "function")
      if (o) {
        for (; typeof s == "function"; ) s = s();
        r = G(e, Array.isArray(s) ? s : [s], Array.isArray(l) ? l : [l]) || r;
      } else
        e.push(s), r = !0;
    else {
      const u = String(s);
      l && l.nodeType === 3 && l.data === u ? e.push(l) : e.push(document.createTextNode(u));
    }
  }
  return r;
}
function re(e, t, n = null) {
  for (let o = 0, r = t.length; o < r; o++) e.insertBefore(t[o], n);
}
function A(e, t, n, o) {
  if (n === void 0) return e.textContent = "";
  const r = o || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let a = t.length - 1; a >= 0; a--) {
      const s = t[a];
      if (r !== s) {
        const l = s.parentNode === e;
        !i && !a ? l ? e.replaceChild(r, s) : e.insertBefore(r, n) : l && s.remove();
      } else i = !0;
    }
  } else e.insertBefore(r, n);
  return [r];
}
function Le(e) {
  return Object.keys(e).reduce((t, n) => {
    const o = e[n];
    return t[n] = Object.assign({}, o), _e(o.value) && !ze(o.value) && !Array.isArray(o.value) && (t[n].value = Object.assign({}, o.value)), Array.isArray(o.value) && (t[n].value = o.value.slice(0)), t;
  }, {});
}
function Me(e) {
  return e ? Object.keys(e).reduce((t, n) => {
    const o = e[n];
    return t[n] = _e(o) && "value" in o ? o : {
      value: o
    }, t[n].attribute || (t[n].attribute = Pe(n)), t[n].parse = "parse" in t[n] ? t[n].parse : typeof t[n].value != "string", t;
  }, {}) : {};
}
function Re(e) {
  return Object.keys(e).reduce((t, n) => (t[n] = e[n].value, t), {});
}
function Be(e, t) {
  const n = Le(t);
  return Object.keys(t).forEach((o) => {
    const r = n[o], i = e.getAttribute(r.attribute), a = e[o];
    i != null && (r.value = r.parse ? me(i) : i), a != null && (r.value = Array.isArray(a) ? a.slice(0) : a), r.reflect && ie(e, r.attribute, r.value, !!r.parse), Object.defineProperty(e, o, {
      get() {
        return r.value;
      },
      set(s) {
        const l = r.value;
        r.value = s, r.reflect && ie(this, r.attribute, r.value, !!r.parse);
        for (let c = 0, u = this.__propertyChangedCallbacks.length; c < u; c++)
          this.__propertyChangedCallbacks[c](o, s, l);
      },
      enumerable: !0,
      configurable: !0
    });
  }), n;
}
function me(e) {
  if (e)
    try {
      return JSON.parse(e);
    } catch {
      return e;
    }
}
function ie(e, t, n, o) {
  if (n == null || n === !1) return e.removeAttribute(t);
  let r = o ? JSON.stringify(n) : n;
  e.__updating[t] = !0, r === "true" && (r = ""), e.setAttribute(t, r), Promise.resolve().then(() => delete e.__updating[t]);
}
function Pe(e) {
  return e.replace(/\.?([A-Z]+)/g, (t, n) => "-" + n.toLowerCase()).replace("_", "-").replace(/^-/, "");
}
function _e(e) {
  return e != null && (typeof e == "object" || typeof e == "function");
}
function ze(e) {
  return Object.prototype.toString.call(e) === "[object Function]";
}
function De(e) {
  return typeof e == "function" && e.toString().indexOf("class") === 0;
}
let X;
function Fe(e, t) {
  const n = Object.keys(t);
  return class extends e {
    static get observedAttributes() {
      return n.map((o) => t[o].attribute);
    }
    constructor() {
      super(), this.__initialized = !1, this.__released = !1, this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = {};
      for (let o of n)
        this[o] = void 0;
    }
    connectedCallback() {
      if (this.__initialized) return;
      this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = Be(this, t);
      const o = Re(this.props), r = this.Component, i = X;
      try {
        X = this, this.__initialized = !0, De(r) ? new r(o, {
          element: this
        }) : r(o, {
          element: this
        });
      } finally {
        X = i;
      }
    }
    async disconnectedCallback() {
      if (await Promise.resolve(), this.isConnected) return;
      this.__propertyChangedCallbacks.length = 0;
      let o = null;
      for (; o = this.__releaseCallbacks.pop(); ) o(this);
      delete this.__initialized, this.__released = !0;
    }
    attributeChangedCallback(o, r, i) {
      if (this.__initialized && !this.__updating[o] && (o = this.lookupProp(o), o in t)) {
        if (i == null && !this[o]) return;
        this[o] = t[o].parse ? me(i) : i;
      }
    }
    lookupProp(o) {
      if (t)
        return n.find((r) => o === r || o === t[r].attribute);
    }
    get renderRoot() {
      return this.shadowRoot || this.attachShadow({
        mode: "open"
      });
    }
    addReleaseCallback(o) {
      this.__releaseCallbacks.push(o);
    }
    addPropertyChangedCallback(o) {
      this.__propertyChangedCallbacks.push(o);
    }
  };
}
function qe(e, t = {}, n = {}) {
  const {
    BaseElement: o = HTMLElement,
    extension: r,
    customElements: i = window.customElements
  } = n;
  return (a) => {
    let s = i.get(e);
    return s ? (s.prototype.Component = a, s) : (s = Fe(o, Me(t)), s.prototype.Component = a, s.prototype.registeredTag = e, i.define(e, s, r), s);
  };
}
function Ie(e) {
  const t = Object.keys(e), n = {};
  for (let o = 0; o < t.length; o++) {
    const [r, i] = de(e[t[o]]);
    Object.defineProperty(n, t[o], {
      get: r,
      set(a) {
        i(() => a);
      }
    });
  }
  return n;
}
function He(e) {
  if (e.assignedSlot && e.assignedSlot._$owner) return e.assignedSlot._$owner;
  let t = e.parentNode;
  for (; t && !t._$owner && !(t.assignedSlot && t.assignedSlot._$owner); )
    t = t.parentNode;
  return t && t.assignedSlot ? t.assignedSlot._$owner : e._$owner;
}
function Ue(e) {
  return (t, n) => {
    const { element: o } = n;
    return ke((r) => {
      const i = Ie(t);
      o.addPropertyChangedCallback((s, l) => i[s] = l), o.addReleaseCallback(() => {
        o.renderRoot.textContent = "", r();
      });
      const a = e(i, n);
      return x(o.renderRoot, a);
    }, He(o));
  };
}
function Je(e, t, n) {
  return arguments.length === 2 && (n = t, t = {}), qe(e, t)(Ue(n));
}
const Xe = `
:host([theme="dark"]) {
  color-scheme: only dark;
}
:host([theme="light"]) {
  color-scheme: only light;
}

:host .dictate-button__button {
  cursor: pointer;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: light-dark(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 1));
  background-color: light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.85));
  border-radius: 50%;
  border: none;
  transition: box-shadow 0.05s linear, background-color 0.2s ease;
  box-sizing: border-box;
}
:host .dictate-button__button:hover {
  background-color: light-dark(rgba(0, 0, 0, 0.15), rgba(255, 255, 255, 0.7));
}

:host .dictate-button__button:focus {
  background-color: light-dark(rgba(0, 0, 0, 0.15), rgba(255, 255, 255, 0.7));
  outline: none;
}

:host .dictate-button__button:focus-visible {
  outline: 2px solid light-dark(rgba(0, 0, 0, 0.8), rgba(255, 255, 255, 0.8));
  outline-offset: 2px;
}

:host .dictate-button__button .dictate-button__icon {
  width: 100%;
  height: 100%;
}

:host .dictate-button__button .dictate-button__icon.dictate-button__icon--processing {
  animation: dictate-button-rotate 1s linear infinite;
}

@keyframes dictate-button-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (forced-colors: active) {
  :host .dictate-button__button {
    border: 1px solid currentColor;
  }
  :host .dictate-button__button:focus-visible {
    outline: 3px solid currentColor;
  }
}
`;
var Ze = /* @__PURE__ */ L('<div part=container class=dictate-button__container><style></style><div aria-live=polite class=dictate-button__status-announcer style="position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0"></div><button part=button class=dictate-button__button>'), Ge = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--idle"fill=none viewBox="0 0 24 24"stroke-width=1.5 stroke=currentColor role=img aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z">'), Ke = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--recording"viewBox="0 0 24 24"fill=currentColor role=img aria-hidden=true><circle cx=12 cy=12 r=10>'), Ve = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--processing"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9">'), Qe = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--error"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=4 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><line x1=12 x2=12 y1=4 y2=14></line><line x1=12 x2=12.01 y1=20 y2=20>');
console.debug("dictate-button version:", "1.5.1");
const We = "https://api.dictate-button.io/transcribe", C = "dictate-button.io", Z = -70, se = -10, ae = 0, Ye = 4, et = 0.25, tt = 0.05;
Je("dictate-button", {
  size: 30,
  apiEndpoint: We,
  language: void 0
}, (e, {
  element: t
}) => {
  console.debug("api", e.apiEndpoint);
  const [n, o] = de("idle");
  let r = null, i = null, a = [], s = null, l = null, c = null, u = !1, g = 0;
  const p = (f) => f <= Z ? 0 : f >= se ? 1 : (f - Z) / (se - Z), y = (f) => {
    let w = 0;
    for (let m = 0; m < f.length; m++) {
      const d = (f[m] - 128) / 128;
      w += d * d;
    }
    return Math.sqrt(w / f.length);
  }, $ = (f) => 20 * Math.log10(Math.max(f, 1e-8)), V = (f) => {
    const w = t.shadowRoot.querySelector(".dictate-button__button");
    if (!w)
      return;
    const m = ae + f * (Ye - ae), d = 0 + f * 0.4;
    w.style.boxShadow = `0 0 0 ${m}px light-dark(rgba(0, 0, 0, ${d}), rgba(255, 255, 255, ${d}))`;
  }, Q = () => {
    if (!u || !l || !c) return;
    l.getByteTimeDomainData(c);
    const f = y(c), w = $(f), m = p(w), d = m > g ? et : tt;
    g = d * m + (1 - d) * g, V(g), requestAnimationFrame(Q);
  }, H = () => {
    r && r.state !== "inactive" && r.stop(), i && (i.getTracks().forEach((f) => f.stop()), i = null), a = [], u = !1, s && s.state !== "closed" && s.close(), s = null, l = null, c = null, g = 0, V(0);
  };
  t.addEventListener("disconnected", H);
  const we = async () => {
    if (H(), n() === "idle")
      try {
        const f = await navigator.mediaDevices.getUserMedia({
          audio: !0
        });
        i = f, s = new (window.AudioContext || window.webkitAudioContext)();
        const w = s.createMediaStreamSource(f);
        l = s.createAnalyser(), l.fftSize = 2048, w.connect(l), c = new Uint8Array(l.fftSize), r = new MediaRecorder(f, {
          mimeType: "audio/webm"
        }), a = [], r.ondataavailable = (m) => {
          a.push(m.data);
        }, r.onstop = async () => {
          u = !1, o("processing"), E(t, "transcribing:started", "Started transcribing");
          const m = new Blob(a, {
            type: "audio/webm"
          });
          try {
            const d = new FormData();
            d.append("audio", m, "recording.webm"), d.append("origin", window?.location?.origin), e.language && d.append("language", e.language);
            const h = await fetch(e.apiEndpoint, {
              method: "POST",
              body: d
            });
            if (!h.ok) throw new Error("Failed to transcribe audio");
            const U = await h.json();
            if (n() !== "processing") return;
            E(t, "transcribing:finished", U.text), o("idle");
          } catch (d) {
            console.error("Failed to transcribe audio:", d), E(t, "transcribing:failed", "Failed to transcribe audio"), W();
          }
        }, r.start(), E(t, "recording:started", "Started recording"), u = !0, Q(), o("recording");
      } catch (f) {
        console.error("Failed to start recording:", f), E(t, "recording:failed", "Failed to start recording"), W();
      }
    else
      E(t, "recording:stopped", "Stopped recording"), o("idle"), H();
  }, W = () => {
    o("error"), setTimeout(() => o("idle"), 2e3);
  };
  return (() => {
    var f = Ze(), w = f.firstChild, m = w.nextSibling, d = m.nextSibling;
    return x(w, Xe), x(m, () => le(n())), d.$$click = we, x(d, (() => {
      var h = R(() => n() === "idle");
      return () => h() && M(ot, {});
    })(), null), x(d, (() => {
      var h = R(() => n() === "recording");
      return () => h() && M(rt, {});
    })(), null), x(d, (() => {
      var h = R(() => n() === "processing");
      return () => h() && M(it, {});
    })(), null), x(d, (() => {
      var h = R(() => n() === "error");
      return () => h() && M(st, {});
    })(), null), z((h) => {
      var U = `width:${e.size}px;height:${e.size}px"`, Y = nt(n()), ee = le(n()), te = n() === "recording", ne = n() === "processing";
      return h.e = je(d, U, h.e), Y !== h.t && T(d, "title", h.t = Y), ee !== h.a && T(d, "aria-label", h.a = ee), te !== h.o && T(d, "aria-pressed", h.o = te), ne !== h.i && T(d, "aria-busy", h.i = ne), h;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), f;
  })();
});
const nt = (e) => {
  switch (e) {
    case "idle":
      return `Start dictation (${C})`;
    case "recording":
      return `Stop dictation (${C})`;
    case "processing":
      return `Stop processing (${C})`;
    case "error":
      return `Click to reset (${C})`;
  }
}, le = (e) => {
  switch (e) {
    case "idle":
      return `Start dictation (${C})`;
    case "recording":
      return `Dictation in progress. Click to stop it (${C})`;
    case "processing":
      return `Processing dictation. Click to cancel it (${C})`;
    case "error":
      return `Dictation error. Click to reset (${C})`;
  }
}, E = (e, t, n) => {
  e.dispatchEvent(new CustomEvent(t, {
    detail: n,
    bubbles: !0,
    composed: !0
  }));
}, ot = () => Ge(), rt = () => Ke(), it = () => Ve(), st = () => Qe();
Oe(["click"]);
function ce(e, t = {}) {
  const { buttonSize: n = 30, verbose: o = !1, customApiEndpoint: r } = t, i = document.querySelectorAll(e);
  for (const a of i) {
    if (a.hasAttribute("data-dictate-button-enabled")) continue;
    const s = a.parentNode;
    if (!a.isConnected || !s) {
      o && console.debug("injectDictateButton: skipping detached field", a);
      continue;
    }
    a.setAttribute("data-dictate-button-enabled", "");
    const l = document.createElement("div");
    l.style.position = "relative";
    const c = getComputedStyle(a), u = c.display === "block";
    l.style.display = u ? "block" : "inline-block", l.style.width = u ? "100%" : "auto", l.style.color = "inherit", l.classList.add("dictate-button-wrapper"), s.insertBefore(l, a), l.appendChild(a), l.style.margin = c.margin, a.style.margin = "0", a.style.boxSizing = "border-box";
    const g = ct(c);
    a.style.paddingRight = `${n + g * 2}px`;
    const p = document.createElement("dictate-button");
    p.size = n, p.style.position = "absolute", p.style.right = "0", p.style.top = lt(
      l,
      c,
      a.tagName,
      n
    ) + "px", p.style.marginRight = p.style.marginLeft = `${g}px`, p.style.marginTop = "0", p.style.marginBottom = "0", r && (p.apiEndpoint = r), p.language = at(), p.addEventListener("recording:started", (y) => {
      o && console.debug("recording:started", y);
    }), p.addEventListener("recording:stopped", (y) => {
      o && console.debug("recording:stopped", y);
    }), p.addEventListener("recording:failed", (y) => {
      o && console.debug("recording:failed", y), j(a);
    }), p.addEventListener("transcribing:started", (y) => {
      o && console.debug("transcribing:started", y);
    }), p.addEventListener("transcribing:finished", (y) => {
      o && console.debug("transcribing:finished", y);
      const $ = y.detail;
      ut(a, $);
    }), p.addEventListener("transcribing:failed", (y) => {
      o && console.debug("transcribing:failed", y), j(a);
    }), l.appendChild(p);
  }
}
function at() {
  const e = document.documentElement.lang;
  if (e && e.length >= 2)
    try {
      return (Intl?.Locale ? new Intl.Locale(e) : null)?.language ?? e.split(/[-_]/)[0].toLowerCase();
    } catch {
      return e.split(/[-_]/)[0].toLowerCase();
    }
}
function lt(e, t, n, o) {
  if (n.toLowerCase() === "textarea") {
    const i = parseFloat(t.paddingTop || "0");
    return Math.max(4, i);
  }
  const r = Math.round(e.clientHeight / 2 - o / 2);
  return Math.max(4, r);
}
function ct(e) {
  const t = parseFloat(e.paddingRight || "0");
  return Math.max(t, 4);
}
function ut(e, t) {
  const n = typeof t == "string" ? t.trim() : String(t ?? "").trim();
  n.length !== 0 && (dt(e) ? pt(e, n) : ft(e, n), e.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), j(e));
}
function j(e) {
  try {
    e.focus({ preventScroll: !0 });
  } catch {
    e.focus();
  }
}
function dt(e) {
  return e.isContentEditable;
}
function ft(e, t) {
  const n = e.selectionStart ?? 0, o = e.selectionEnd ?? 0, r = n > 0 ? e.value.charAt(n - 1) : "", i = r && !/\s/.test(r), a = o < e.value.length ? e.value.charAt(o) : "", s = a && !/\s/.test(a), l = (i ? " " : "") + t + (s ? " " : ""), c = n + l.length, u = typeof e.scrollTop == "number" ? e.scrollTop : null;
  if (typeof e.setRangeText == "function")
    e.setRangeText(l, n, o, "end");
  else {
    e.value = e.value.substring(0, n) + l + e.value.substring(o);
    try {
      e.selectionStart = c, e.selectionEnd = c;
    } catch {
    }
  }
  u !== null && (e.scrollTop = u);
}
function pt(e, t) {
  const n = window.getSelection();
  if (!(n && n.rangeCount > 0 && e.contains(n.getRangeAt(0).commonAncestorContainer))) {
    j(e);
    const r = document.createRange();
    r.selectNodeContents(e), r.collapse(!1), n?.removeAllRanges(), n?.addRange(r);
  }
  const o = n?.getRangeAt(0);
  if (o) {
    const r = o.cloneRange(), i = o.cloneRange();
    let a = !1;
    r.collapse(!0);
    try {
      r.setStart(o.startContainer, 0);
      const c = r.toString(), u = c.length > 0 ? c.charAt(c.length - 1) : "";
      a = u !== "" && !/\s/.test(u);
    } catch (c) {
      console.debug(
        "insertIntoContentEditable: Error checking text before cursor:",
        c
      );
    }
    let s = !1;
    i.collapse(!1);
    try {
      if (i.endContainer.nodeType === Node.TEXT_NODE) {
        const g = i.endContainer;
        i.setEnd(g, g.length);
      } else if (i.endContainer.nodeType === Node.ELEMENT_NODE) {
        const g = i.endContainer;
        g.childNodes.length > i.endOffset && i.setEnd(g, i.endOffset + 1);
      }
      const c = i.toString(), u = c.length > 0 ? c.charAt(0) : "";
      s = u !== "" && !/\s/.test(u);
    } catch (c) {
      console.debug(
        "insertIntoContentEditable: Error checking text after cursor:",
        c
      );
    }
    const l = (a ? " " : "") + t + (s ? " " : "");
    try {
      o.deleteContents();
      const c = document.createTextNode(l);
      o.insertNode(c), o.setStartAfter(c), o.setEndAfter(c), n?.removeAllRanges(), n?.addRange(o);
    } catch (c) {
      console.debug("insertIntoContentEditable: Error inserting text:", c), j(e), e.textContent = (e.textContent || "") + l;
    }
  }
}
function gt(e, t = {}) {
  const { watchDomChanges: n = !1 } = t, o = () => {
    ce(e, t), n && document.body && new MutationObserver(() => {
      ce(e, t);
    }).observe(document.body, { childList: !0, subtree: !0 });
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", o, { once: !0 }) : o();
}
const ht = 30, bt = !0, yt = !1, vt = [
  "textarea[data-dictate-button-on]:not([data-dictate-button-enabled])",
  'input[type="text"][data-dictate-button-on]:not([data-dictate-button-enabled])',
  'input[type="search"][data-dictate-button-on]:not([data-dictate-button-enabled])',
  "input[data-dictate-button-on]:not([type]):not([data-dictate-button-enabled])",
  "*[contenteditable][data-dictate-button-on]:not([data-dictate-button-enabled])"
].join(",");
gt(vt, {
  buttonSize: ht,
  watchDomChanges: bt,
  verbose: yt
});
