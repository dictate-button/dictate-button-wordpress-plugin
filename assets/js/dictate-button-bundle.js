const kt = (t, e) => t === e, P = {
  equals: kt
};
let xt = vt;
const k = 1, z = 2, dt = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var y = null;
let H = null, g = null, h = null, S = null, q = 0;
function Et(t, e) {
  const n = g, r = y, o = t.length === 0, i = e === void 0 ? r : e, a = o ? dt : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, s = o ? t : () => t(() => Q(() => T(a)));
  y = a, g = null;
  try {
    return O(s, !0);
  } finally {
    g = n, y = r;
  }
}
function ft(t, e) {
  e = e ? Object.assign({}, P, e) : P;
  const n = {
    value: t,
    observers: null,
    observerSlots: null,
    comparator: e.equals || void 0
  }, r = (o) => (typeof o == "function" && (o = o(n.value)), gt(n, o));
  return [pt.bind(n), r];
}
function B(t, e, n) {
  const r = ht(t, e, !1, k);
  I(r);
}
function At(t, e, n) {
  n = n ? Object.assign({}, P, n) : P;
  const r = ht(t, e, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, I(r), pt.bind(r);
}
function Q(t) {
  if (g === null) return t();
  const e = g;
  g = null;
  try {
    return t();
  } finally {
    g = e;
  }
}
function pt() {
  if (this.sources && this.state)
    if (this.state === k) I(this);
    else {
      const t = h;
      h = null, O(() => D(this), !1), h = t;
    }
  if (g) {
    const t = this.observers ? this.observers.length : 0;
    g.sources ? (g.sources.push(this), g.sourceSlots.push(t)) : (g.sources = [this], g.sourceSlots = [t]), this.observers ? (this.observers.push(g), this.observerSlots.push(g.sources.length - 1)) : (this.observers = [g], this.observerSlots = [g.sources.length - 1]);
  }
  return this.value;
}
function gt(t, e, n) {
  let r = t.value;
  return (!t.comparator || !t.comparator(r, e)) && (t.value = e, t.observers && t.observers.length && O(() => {
    for (let o = 0; o < t.observers.length; o += 1) {
      const i = t.observers[o], a = H && H.running;
      a && H.disposed.has(i), (a ? !i.tState : !i.state) && (i.pure ? h.push(i) : S.push(i), i.observers && yt(i)), a || (i.state = k);
    }
    if (h.length > 1e6)
      throw h = [], new Error();
  }, !1)), e;
}
function I(t) {
  if (!t.fn) return;
  T(t);
  const e = q;
  $t(t, t.value, e);
}
function $t(t, e, n) {
  let r;
  const o = y, i = g;
  g = y = t;
  try {
    r = t.fn(e);
  } catch (a) {
    return t.pure && (t.state = k, t.owned && t.owned.forEach(T), t.owned = null), t.updatedAt = n + 1, mt(a);
  } finally {
    g = i, y = o;
  }
  (!t.updatedAt || t.updatedAt <= n) && (t.updatedAt != null && "observers" in t ? gt(t, r) : t.value = r, t.updatedAt = n);
}
function ht(t, e, n, r = k, o) {
  const i = {
    fn: t,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: e,
    owner: y,
    context: y ? y.context : null,
    pure: n
  };
  return y === null || y !== dt && (y.owned ? y.owned.push(i) : y.owned = [i]), i;
}
function bt(t) {
  if (t.state === 0) return;
  if (t.state === z) return D(t);
  if (t.suspense && Q(t.suspense.inFallback)) return t.suspense.effects.push(t);
  const e = [t];
  for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < q); )
    t.state && e.push(t);
  for (let n = e.length - 1; n >= 0; n--)
    if (t = e[n], t.state === k)
      I(t);
    else if (t.state === z) {
      const r = h;
      h = null, O(() => D(t, e[0]), !1), h = r;
    }
}
function O(t, e) {
  if (h) return t();
  let n = !1;
  e || (h = []), S ? n = !0 : S = [], q++;
  try {
    const r = t();
    return Tt(n), r;
  } catch (r) {
    n || (S = null), h = null, mt(r);
  }
}
function Tt(t) {
  if (h && (vt(h), h = null), t) return;
  const e = S;
  S = null, e.length && O(() => xt(e), !1);
}
function vt(t) {
  for (let e = 0; e < t.length; e++) bt(t[e]);
}
function D(t, e) {
  t.state = 0;
  for (let n = 0; n < t.sources.length; n += 1) {
    const r = t.sources[n];
    if (r.sources) {
      const o = r.state;
      o === k ? r !== e && (!r.updatedAt || r.updatedAt < q) && bt(r) : o === z && D(r, e);
    }
  }
}
function yt(t) {
  for (let e = 0; e < t.observers.length; e += 1) {
    const n = t.observers[e];
    n.state || (n.state = z, n.pure ? h.push(n) : S.push(n), n.observers && yt(n));
  }
}
function T(t) {
  let e;
  if (t.sources)
    for (; t.sources.length; ) {
      const n = t.sources.pop(), r = t.sourceSlots.pop(), o = n.observers;
      if (o && o.length) {
        const i = o.pop(), a = n.observerSlots.pop();
        r < o.length && (i.sourceSlots[a] = r, o[r] = i, n.observerSlots[r] = a);
      }
    }
  if (t.tOwned) {
    for (e = t.tOwned.length - 1; e >= 0; e--) T(t.tOwned[e]);
    delete t.tOwned;
  }
  if (t.owned) {
    for (e = t.owned.length - 1; e >= 0; e--) T(t.owned[e]);
    t.owned = null;
  }
  if (t.cleanups) {
    for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
    t.cleanups = null;
  }
  t.state = 0;
}
function Ot(t) {
  return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
    cause: t
  });
}
function mt(t, e = y) {
  throw Ot(t);
}
function R(t, e) {
  return Q(() => t(e || {}));
}
const M = (t) => At(() => t());
function Lt(t, e, n) {
  let r = n.length, o = e.length, i = r, a = 0, s = 0, c = e[o - 1].nextSibling, l = null;
  for (; a < o || s < i; ) {
    if (e[a] === n[s]) {
      a++, s++;
      continue;
    }
    for (; e[o - 1] === n[i - 1]; )
      o--, i--;
    if (o === a) {
      const u = i < r ? s ? n[s - 1].nextSibling : n[i - s] : c;
      for (; s < i; ) t.insertBefore(n[s++], u);
    } else if (i === s)
      for (; a < o; )
        (!l || !l.has(e[a])) && e[a].remove(), a++;
    else if (e[a] === n[i - 1] && n[s] === e[o - 1]) {
      const u = e[--o].nextSibling;
      t.insertBefore(n[s++], e[a++].nextSibling), t.insertBefore(n[--i], u), e[o] = n[i];
    } else {
      if (!l) {
        l = /* @__PURE__ */ new Map();
        let b = s;
        for (; b < i; ) l.set(n[b], b++);
      }
      const u = l.get(e[a]);
      if (u != null)
        if (s < u && u < i) {
          let b = a, A = 1, N;
          for (; ++b < o && b < i && !((N = l.get(e[b])) == null || N !== u + A); )
            A++;
          if (A > u - s) {
            const j = e[a];
            for (; s < u; ) t.insertBefore(n[s++], j);
          } else t.replaceChild(n[s++], e[a++]);
        } else a++;
      else e[a++].remove();
    }
  }
}
const ot = "_$DX_DELEGATE";
function L(t, e, n, r) {
  let o;
  const i = () => {
    const s = document.createElement("template");
    return s.innerHTML = t, s.content.firstChild;
  }, a = () => (o || (o = i())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function Nt(t, e = window.document) {
  const n = e[ot] || (e[ot] = /* @__PURE__ */ new Set());
  for (let r = 0, o = t.length; r < o; r++) {
    const i = t[r];
    n.has(i) || (n.add(i), e.addEventListener(i, Rt));
  }
}
function $(t, e, n) {
  n == null ? t.removeAttribute(e) : t.setAttribute(e, n);
}
function jt(t, e, n) {
  if (!e) return n ? $(t, "style") : e;
  const r = t.style;
  if (typeof e == "string") return r.cssText = e;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), e || (e = {});
  let o, i;
  for (i in n)
    e[i] == null && r.removeProperty(i), delete n[i];
  for (i in e)
    o = e[i], o !== n[i] && (r.setProperty(i, o), n[i] = o);
  return n;
}
function C(t, e, n, r) {
  if (n !== void 0 && !r && (r = []), typeof e != "function") return F(t, e, r, n);
  B((o) => F(t, e(), o, n), r);
}
function Rt(t) {
  let e = t.target;
  const n = `$$${t.type}`, r = t.target, o = t.currentTarget, i = (c) => Object.defineProperty(t, "target", {
    configurable: !0,
    value: c
  }), a = () => {
    const c = e[n];
    if (c && !e.disabled) {
      const l = e[`${n}Data`];
      if (l !== void 0 ? c.call(e, l, t) : c.call(e, t), t.cancelBubble) return;
    }
    return e.host && typeof e.host != "string" && !e.host._$host && e.contains(t.target) && i(e.host), !0;
  }, s = () => {
    for (; a() && (e = e._$host || e.parentNode || e.host); ) ;
  };
  if (Object.defineProperty(t, "currentTarget", {
    configurable: !0,
    get() {
      return e || document;
    }
  }), t.composedPath) {
    const c = t.composedPath();
    i(c[0]);
    for (let l = 0; l < c.length - 2 && (e = c[l], !!a()); l++) {
      if (e._$host) {
        e = e._$host, s();
        break;
      }
      if (e.parentNode === o)
        break;
    }
  } else s();
  i(r);
}
function F(t, e, n, r, o) {
  for (; typeof n == "function"; ) n = n();
  if (e === n) return n;
  const i = typeof e, a = r !== void 0;
  if (t = a && n[0] && n[0].parentNode || t, i === "string" || i === "number") {
    if (i === "number" && (e = e.toString(), e === n))
      return n;
    if (a) {
      let s = n[0];
      s && s.nodeType === 3 ? s.data !== e && (s.data = e) : s = document.createTextNode(e), n = x(t, n, r, s);
    } else
      n !== "" && typeof n == "string" ? n = t.firstChild.data = e : n = t.textContent = e;
  } else if (e == null || i === "boolean")
    n = x(t, n, r);
  else {
    if (i === "function")
      return B(() => {
        let s = e();
        for (; typeof s == "function"; ) s = s();
        n = F(t, s, n, r);
      }), () => n;
    if (Array.isArray(e)) {
      const s = [], c = n && Array.isArray(n);
      if (G(s, e, n, o))
        return B(() => n = F(t, s, n, r, !0)), () => n;
      if (s.length === 0) {
        if (n = x(t, n, r), a) return n;
      } else c ? n.length === 0 ? it(t, s, r) : Lt(t, n, s) : (n && x(t), it(t, s));
      n = s;
    } else if (e.nodeType) {
      if (Array.isArray(n)) {
        if (a) return n = x(t, n, r, e);
        x(t, n, null, e);
      } else n == null || n === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
      n = e;
    }
  }
  return n;
}
function G(t, e, n, r) {
  let o = !1;
  for (let i = 0, a = e.length; i < a; i++) {
    let s = e[i], c = n && n[t.length], l;
    if (!(s == null || s === !0 || s === !1)) if ((l = typeof s) == "object" && s.nodeType)
      t.push(s);
    else if (Array.isArray(s))
      o = G(t, s, c) || o;
    else if (l === "function")
      if (r) {
        for (; typeof s == "function"; ) s = s();
        o = G(t, Array.isArray(s) ? s : [s], Array.isArray(c) ? c : [c]) || o;
      } else
        t.push(s), o = !0;
    else {
      const u = String(s);
      c && c.nodeType === 3 && c.data === u ? t.push(c) : t.push(document.createTextNode(u));
    }
  }
  return o;
}
function it(t, e, n = null) {
  for (let r = 0, o = e.length; r < o; r++) t.insertBefore(e[r], n);
}
function x(t, e, n, r) {
  if (n === void 0) return t.textContent = "";
  const o = r || document.createTextNode("");
  if (e.length) {
    let i = !1;
    for (let a = e.length - 1; a >= 0; a--) {
      const s = e[a];
      if (o !== s) {
        const c = s.parentNode === t;
        !i && !a ? c ? t.replaceChild(o, s) : t.insertBefore(o, n) : c && s.remove();
      } else i = !0;
    }
  } else t.insertBefore(o, n);
  return [o];
}
function Mt(t) {
  return Object.keys(t).reduce((e, n) => {
    const r = t[n];
    return e[n] = Object.assign({}, r), wt(r.value) && !Ft(r.value) && !Array.isArray(r.value) && (e[n].value = Object.assign({}, r.value)), Array.isArray(r.value) && (e[n].value = r.value.slice(0)), e;
  }, {});
}
function Pt(t) {
  return t ? Object.keys(t).reduce((e, n) => {
    const r = t[n];
    return e[n] = wt(r) && "value" in r ? r : {
      value: r
    }, e[n].attribute || (e[n].attribute = Dt(n)), e[n].parse = "parse" in e[n] ? e[n].parse : typeof e[n].value != "string", e;
  }, {}) : {};
}
function zt(t) {
  return Object.keys(t).reduce((e, n) => (e[n] = t[n].value, e), {});
}
function Bt(t, e) {
  const n = Mt(e);
  return Object.keys(e).forEach((r) => {
    const o = n[r], i = t.getAttribute(o.attribute), a = t[r];
    i != null && (o.value = o.parse ? _t(i) : i), a != null && (o.value = Array.isArray(a) ? a.slice(0) : a), o.reflect && st(t, o.attribute, o.value, !!o.parse), Object.defineProperty(t, r, {
      get() {
        return o.value;
      },
      set(s) {
        const c = o.value;
        o.value = s, o.reflect && st(this, o.attribute, o.value, !!o.parse);
        for (let l = 0, u = this.__propertyChangedCallbacks.length; l < u; l++)
          this.__propertyChangedCallbacks[l](r, s, c);
      },
      enumerable: !0,
      configurable: !0
    });
  }), n;
}
function _t(t) {
  if (t)
    try {
      return JSON.parse(t);
    } catch {
      return t;
    }
}
function st(t, e, n, r) {
  if (n == null || n === !1) return t.removeAttribute(e);
  let o = r ? JSON.stringify(n) : n;
  t.__updating[e] = !0, o === "true" && (o = ""), t.setAttribute(e, o), Promise.resolve().then(() => delete t.__updating[e]);
}
function Dt(t) {
  return t.replace(/\.?([A-Z]+)/g, (e, n) => "-" + n.toLowerCase()).replace("_", "-").replace(/^-/, "");
}
function wt(t) {
  return t != null && (typeof t == "object" || typeof t == "function");
}
function Ft(t) {
  return Object.prototype.toString.call(t) === "[object Function]";
}
function qt(t) {
  return typeof t == "function" && t.toString().indexOf("class") === 0;
}
let J;
function It(t, e) {
  const n = Object.keys(e);
  return class extends t {
    static get observedAttributes() {
      return n.map((r) => e[r].attribute);
    }
    constructor() {
      super(), this.__initialized = !1, this.__released = !1, this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = {};
      for (let r of n)
        this[r] = void 0;
    }
    connectedCallback() {
      if (this.__initialized) return;
      this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = Bt(this, e);
      const r = zt(this.props), o = this.Component, i = J;
      try {
        J = this, this.__initialized = !0, qt(o) ? new o(r, {
          element: this
        }) : o(r, {
          element: this
        });
      } finally {
        J = i;
      }
    }
    async disconnectedCallback() {
      if (await Promise.resolve(), this.isConnected) return;
      this.__propertyChangedCallbacks.length = 0;
      let r = null;
      for (; r = this.__releaseCallbacks.pop(); ) r(this);
      delete this.__initialized, this.__released = !0;
    }
    attributeChangedCallback(r, o, i) {
      if (this.__initialized && !this.__updating[r] && (r = this.lookupProp(r), r in e)) {
        if (i == null && !this[r]) return;
        this[r] = e[r].parse ? _t(i) : i;
      }
    }
    lookupProp(r) {
      if (e)
        return n.find((o) => r === o || r === e[o].attribute);
    }
    get renderRoot() {
      return this.shadowRoot || this.attachShadow({
        mode: "open"
      });
    }
    addReleaseCallback(r) {
      this.__releaseCallbacks.push(r);
    }
    addPropertyChangedCallback(r) {
      this.__propertyChangedCallbacks.push(r);
    }
  };
}
function Ut(t, e = {}, n = {}) {
  const {
    BaseElement: r = HTMLElement,
    extension: o,
    customElements: i = window.customElements
  } = n;
  return (a) => {
    let s = i.get(t);
    return s ? (s.prototype.Component = a, s) : (s = It(r, Pt(e)), s.prototype.Component = a, s.prototype.registeredTag = t, i.define(t, s, o), s);
  };
}
function Xt(t) {
  const e = Object.keys(t), n = {};
  for (let r = 0; r < e.length; r++) {
    const [o, i] = ft(t[e[r]]);
    Object.defineProperty(n, e[r], {
      get: o,
      set(a) {
        i(() => a);
      }
    });
  }
  return n;
}
function Ht(t) {
  if (t.assignedSlot && t.assignedSlot._$owner) return t.assignedSlot._$owner;
  let e = t.parentNode;
  for (; e && !e._$owner && !(e.assignedSlot && e.assignedSlot._$owner); )
    e = e.parentNode;
  return e && e.assignedSlot ? e.assignedSlot._$owner : t._$owner;
}
function Jt(t) {
  return (e, n) => {
    const { element: r } = n;
    return Et((o) => {
      const i = Xt(e);
      r.addPropertyChangedCallback((s, c) => i[s] = c), r.addReleaseCallback(() => {
        r.renderRoot.textContent = "", o();
      });
      const a = t(i, n);
      return C(r.renderRoot, a);
    }, Ht(r));
  };
}
function Zt(t, e, n) {
  return arguments.length === 2 && (n = e, e = {}), Ut(t, e)(Jt(n));
}
const Gt = `
:host([theme="dark"]) {
  color-scheme: only dark;
}
:host([theme="light"]) {
  color-scheme: only light;
}

:host .dictate-button__status-announcer {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
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
var Vt = /* @__PURE__ */ L("<div part=container class=dictate-button__container><style></style><div aria-live=polite class=dictate-button__status-announcer></div><button part=button class=dictate-button__button>"), Kt = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--idle"fill=none viewBox="0 0 24 24"stroke-width=1.5 stroke=currentColor role=img aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z">'), Qt = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--recording"viewBox="0 0 24 24"fill=currentColor role=img aria-hidden=true><circle cx=12 cy=12 r=10>'), Wt = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--processing"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9">'), Yt = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--error"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=4 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><line x1=12 x2=12 y1=4 y2=14></line><line x1=12 x2=12.01 y1=20 y2=20>');
console.debug("dictate-button version:", "1.5.1");
const te = "https://api.dictate-button.io/transcribe", w = "dictate-button.io", Z = -70, at = -10, lt = 0, ee = 4, ne = 0.25, re = 0.05;
Zt("dictate-button", {
  size: 30,
  apiEndpoint: te,
  language: void 0
}, (t, {
  element: e
}) => {
  console.debug("api", t.apiEndpoint);
  const [n, r] = ft("idle");
  let o = null, i = [], a = null, s = null, c = null, l = !1, u = 0;
  const b = (f) => f <= Z ? 0 : f >= at ? 1 : (f - Z) / (at - Z), A = (f) => {
    let _ = 0;
    for (let v = 0; v < f.length; v++) {
      const d = (f[v] - 128) / 128;
      _ += d * d;
    }
    return Math.sqrt(_ / f.length);
  }, N = (f) => 20 * Math.log10(Math.max(f, 1e-8)), j = (f) => {
    const _ = e.shadowRoot.querySelector(".dictate-button__button");
    if (!_)
      return;
    const v = lt + f * (ee - lt), d = 0 + f * 0.4;
    _.style.boxShadow = `0 0 0 ${v}px light-dark(rgba(0, 0, 0, ${d}), rgba(255, 255, 255, ${d}))`;
  }, W = () => {
    if (!l || !s || !c) return;
    s.getByteTimeDomainData(c);
    const f = A(c), _ = N(f), v = b(_), d = v > u ? ne : re;
    u = d * v + (1 - d) * u, j(u), requestAnimationFrame(W);
  }, U = () => {
    o && o.state !== "inactive" && o.stop(), i = [], l = !1, a && a.state !== "closed" && a.close(), a = null, s = null, c = null, u = 0, j(0);
  };
  e.addEventListener("disconnected", U);
  const St = async () => {
    if (U(), n() === "idle")
      try {
        const f = await navigator.mediaDevices.getUserMedia({
          audio: !0
        });
        a = new (window.AudioContext || window.webkitAudioContext)();
        const _ = a.createMediaStreamSource(f);
        s = a.createAnalyser(), s.fftSize = 2048, _.connect(s), c = new Uint8Array(s.fftSize), o = new MediaRecorder(f, {
          mimeType: "audio/webm"
        }), i = [], o.ondataavailable = (v) => {
          i.push(v.data);
        }, o.onstop = async () => {
          l = !1, r("processing"), E(e, "transcribing:started", "Started transcribing");
          const v = new Blob(i, {
            type: "audio/webm"
          });
          try {
            const d = new FormData();
            d.append("audio", v, "recording.webm"), d.append("origin", window?.location?.origin), t.language && d.append("language", t.language);
            const p = await fetch(t.apiEndpoint, {
              method: "POST",
              body: d
            });
            if (!p.ok) throw new Error("Failed to transcribe audio");
            const X = await p.json();
            if (n() !== "processing") return;
            E(e, "transcribing:finished", X.text), r("idle");
          } catch (d) {
            console.error("Failed to transcribe audio:", d), E(e, "transcribing:failed", "Failed to transcribe audio"), Y();
          }
        }, o.start(), E(e, "recording:started", "Started recording"), l = !0, W(), r("recording");
      } catch (f) {
        console.error("Failed to start recording:", f), E(e, "recording:failed", "Failed to start recording"), Y();
      }
    else
      E(e, "recording:stopped", "Stopped recording"), r("idle"), U();
  }, Y = () => {
    r("error"), setTimeout(() => r("idle"), 2e3);
  };
  return (() => {
    var f = Vt(), _ = f.firstChild, v = _.nextSibling, d = v.nextSibling;
    return C(_, Gt), C(v, () => ct(n())), d.$$click = St, C(d, (() => {
      var p = M(() => n() === "idle");
      return () => p() && R(ie, {});
    })(), null), C(d, (() => {
      var p = M(() => n() === "recording");
      return () => p() && R(se, {});
    })(), null), C(d, (() => {
      var p = M(() => n() === "processing");
      return () => p() && R(ae, {});
    })(), null), C(d, (() => {
      var p = M(() => n() === "error");
      return () => p() && R(le, {});
    })(), null), B((p) => {
      var X = `width:${t.size}px;height:${t.size}px"`, tt = oe(n()), et = ct(n()), nt = n() === "recording", rt = n() === "processing";
      return p.e = jt(d, X, p.e), tt !== p.t && $(d, "title", p.t = tt), et !== p.a && $(d, "aria-label", p.a = et), nt !== p.o && $(d, "aria-pressed", p.o = nt), rt !== p.i && $(d, "aria-busy", p.i = rt), p;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), f;
  })();
});
const oe = (t) => {
  switch (t) {
    case "idle":
      return `Start dictation (${w})`;
    case "recording":
      return `Stop dictation (${w})`;
    case "processing":
      return `Stop processing (${w})`;
    case "error":
      return `Click to reset (${w})`;
  }
}, ct = (t) => {
  switch (t) {
    case "idle":
      return `Start dictation (${w})`;
    case "recording":
      return `Dictation in progress. Click to stop it (${w})`;
    case "processing":
      return `Processing dictation. Click to cancel it (${w})`;
    case "error":
      return `Dictation error. Click to reset (${w})`;
  }
}, E = (t, e, n) => {
  t.dispatchEvent(new CustomEvent(e, {
    detail: n,
    bubbles: !0,
    composed: !0
  }));
}, ie = () => Kt(), se = () => Qt(), ae = () => Wt(), le = () => Yt();
Nt(["click"]);
let m = null;
ce({
  buttonSize: 50,
  verbose: !0
});
function ce(t = {}) {
  const e = () => {
    ue(), de(t);
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", e, { once: !0 }) : e();
}
function ue() {
  document.addEventListener("focusin", (t) => {
    const e = t.target;
    if (console.log("setupFocusTracking", e, ut(e)), ut(e)) {
      const n = e;
      let r, o;
      "selectionStart" in n && "selectionEnd" in n && (r = n.selectionStart ?? 0, o = n.selectionEnd ?? 0), m = {
        element: n,
        selectionStart: r,
        selectionEnd: o
      }, n.setAttribute("data-dictate-button-on", "true"), console.debug("Focus tracked on text field:", n);
    }
  }), document.addEventListener("selectionchange", () => {
    if (m && "selectionStart" in m.element) {
      const t = m.element;
      m.selectionStart = t.selectionStart ?? 0, m.selectionEnd = t.selectionEnd ?? 0;
    }
  });
}
function ut(t) {
  if (!t) return !1;
  const e = t.tagName.toLowerCase();
  if (e === "textarea") return !0;
  if (e === "input") {
    const n = t.type.toLowerCase();
    return ["text", "search"].includes(n) || !n;
  }
  return Ct(t);
}
function de(t) {
  const { buttonSize: e = 50, verbose: n = !1, customApiEndpoint: r } = t;
  if (document.querySelector("#floating-dictate-button"))
    return;
  const o = document.createElement("dictate-button");
  o.id = "floating-dictate-button", o.size = e, o.style.position = "fixed", o.style.left = "50%", o.style.bottom = "20px", o.style.transform = "translateX(-50%)", o.style.zIndex = "10000", r && (o.apiEndpoint = r), o.language = fe(), o.addEventListener(
    "click",
    (i) => {
      if (!m) {
        i.preventDefault(), i.stopPropagation(), alert("Select a target text field first please");
        return;
      }
    },
    { capture: !0 }
  ), o.addEventListener("recording:started", (i) => {
    n && console.debug("recording:started", i);
  }), o.addEventListener("recording:stopped", (i) => {
    n && console.debug("recording:stopped", i);
  }), o.addEventListener("recording:failed", (i) => {
    n && console.debug("recording:failed", i), V();
  }), o.addEventListener("transcribing:started", (i) => {
    n && console.debug("transcribing:started", i);
  }), o.addEventListener("transcribing:finished", (i) => {
    n && console.debug("transcribing:finished", i);
    const a = i.detail;
    pe(a);
  }), o.addEventListener("transcribing:failed", (i) => {
    n && console.debug("transcribing:failed", i), V();
  }), document.body.appendChild(o);
}
function fe() {
  const t = document.documentElement.lang;
  if (t && t.length >= 2)
    try {
      return (Intl?.Locale ? new Intl.Locale(t) : null)?.language ?? t.split(/[-_]/)[0].toLowerCase();
    } catch {
      return t.split(/[-_]/)[0].toLowerCase();
    }
}
function pe(t) {
  if (!m) {
    console.debug("No last focused field to insert text into");
    return;
  }
  const e = typeof t == "string" ? t.trim() : String(t ?? "").trim();
  if (e.length === 0)
    return;
  const n = m.element;
  Ct(n) ? he(n, e) : "value" in n && (ge(
    n,
    e
  ), m.selectionStart = n.selectionStart ?? 0, m.selectionEnd = n.selectionEnd ?? 0), n.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), V();
}
function V() {
  m?.element && K(m.element);
}
function K(t) {
  try {
    t.focus({ preventScroll: !0 });
  } catch {
    t.focus();
  }
}
function Ct(t) {
  return t.isContentEditable;
}
function ge(t, e) {
  const n = t.selectionStart ?? 0, r = t.selectionEnd ?? 0, o = n > 0 ? t.value.charAt(n - 1) : "", i = o && !/\s/.test(o), a = r < t.value.length ? t.value.charAt(r) : "", s = a && !/\s/.test(a), c = (i ? " " : "") + e + (s ? " " : ""), l = n + c.length, u = typeof t.scrollTop == "number" ? t.scrollTop : null;
  if (typeof t.setRangeText == "function")
    t.setRangeText(c, n, r, "end");
  else {
    t.value = t.value.substring(0, n) + c + t.value.substring(r);
    try {
      t.selectionStart = l, t.selectionEnd = l;
    } catch {
    }
  }
  u !== null && (t.scrollTop = u);
}
function he(t, e) {
  const n = window.getSelection();
  if (!(n && n.rangeCount > 0 && t.contains(n.getRangeAt(0).commonAncestorContainer))) {
    K(t);
    const o = document.createRange();
    o.selectNodeContents(t), o.collapse(!1), n?.removeAllRanges(), n?.addRange(o);
  }
  const r = n?.getRangeAt(0);
  if (r) {
    const o = r.cloneRange(), i = r.cloneRange();
    let a = !1;
    o.collapse(!0);
    try {
      o.setStart(r.startContainer, 0);
      const l = o.toString(), u = l.length > 0 ? l.charAt(l.length - 1) : "";
      a = u !== "" && !/\s/.test(u);
    } catch (l) {
      console.debug(
        "insertIntoContentEditable: Error checking text before cursor:",
        l
      );
    }
    let s = !1;
    i.collapse(!1);
    try {
      if (i.endContainer.nodeType === Node.TEXT_NODE) {
        const b = i.endContainer;
        i.setEnd(b, b.length);
      } else if (i.endContainer.nodeType === Node.ELEMENT_NODE) {
        const b = i.endContainer;
        b.childNodes.length > i.endOffset && i.setEnd(b, i.endOffset + 1);
      }
      const l = i.toString(), u = l.length > 0 ? l.charAt(0) : "";
      s = u !== "" && !/\s/.test(u);
    } catch (l) {
      console.debug(
        "insertIntoContentEditable: Error checking text after cursor:",
        l
      );
    }
    const c = (a ? " " : "") + e + (s ? " " : "");
    try {
      r.deleteContents();
      const l = document.createTextNode(c);
      r.insertNode(l), r.setStartAfter(l), r.setEndAfter(l), n?.removeAllRanges(), n?.addRange(r);
    } catch (l) {
      console.debug("insertIntoContentEditable: Error inserting text:", l), K(t), t.textContent = (t.textContent || "") + c;
    }
  }
}
