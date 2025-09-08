const wt = (t, e) => t === e, P = {
  equals: wt
};
let kt = gt;
const S = 1, z = 2, ct = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var _ = null;
let I = null, g = null, y = null, x = null, F = 0;
function Ct(t, e) {
  const n = g, r = _, o = t.length === 0, i = e === void 0 ? r : e, a = o ? ct : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, s = o ? t : () => t(() => X(() => j(a)));
  _ = a, g = null;
  try {
    return O(s, !0);
  } finally {
    g = n, _ = r;
  }
}
function ut(t, e) {
  e = e ? Object.assign({}, P, e) : P;
  const n = {
    value: t,
    observers: null,
    observerSlots: null,
    comparator: e.equals || void 0
  }, r = (o) => (typeof o == "function" && (o = o(n.value)), pt(n, o));
  return [dt.bind(n), r];
}
function N(t, e, n) {
  const r = ft(t, e, !1, S);
  q(r);
}
function xt(t, e, n) {
  n = n ? Object.assign({}, P, n) : P;
  const r = ft(t, e, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, q(r), dt.bind(r);
}
function X(t) {
  if (g === null) return t();
  const e = g;
  g = null;
  try {
    return t();
  } finally {
    g = e;
  }
}
function dt() {
  if (this.sources && this.state)
    if (this.state === S) q(this);
    else {
      const t = y;
      y = null, O(() => D(this), !1), y = t;
    }
  if (g) {
    const t = this.observers ? this.observers.length : 0;
    g.sources ? (g.sources.push(this), g.sourceSlots.push(t)) : (g.sources = [this], g.sourceSlots = [t]), this.observers ? (this.observers.push(g), this.observerSlots.push(g.sources.length - 1)) : (this.observers = [g], this.observerSlots = [g.sources.length - 1]);
  }
  return this.value;
}
function pt(t, e, n) {
  let r = t.value;
  return (!t.comparator || !t.comparator(r, e)) && (t.value = e, t.observers && t.observers.length && O(() => {
    for (let o = 0; o < t.observers.length; o += 1) {
      const i = t.observers[o], a = I && I.running;
      a && I.disposed.has(i), (a ? !i.tState : !i.state) && (i.pure ? y.push(i) : x.push(i), i.observers && bt(i)), a || (i.state = S);
    }
    if (y.length > 1e6)
      throw y = [], new Error();
  }, !1)), e;
}
function q(t) {
  if (!t.fn) return;
  j(t);
  const e = F;
  St(t, t.value, e);
}
function St(t, e, n) {
  let r;
  const o = _, i = g;
  g = _ = t;
  try {
    r = t.fn(e);
  } catch (a) {
    return t.pure && (t.state = S, t.owned && t.owned.forEach(j), t.owned = null), t.updatedAt = n + 1, yt(a);
  } finally {
    g = i, _ = o;
  }
  (!t.updatedAt || t.updatedAt <= n) && (t.updatedAt != null && "observers" in t ? pt(t, r) : t.value = r, t.updatedAt = n);
}
function ft(t, e, n, r = S, o) {
  const i = {
    fn: t,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: e,
    owner: _,
    context: _ ? _.context : null,
    pure: n
  };
  return _ === null || _ !== ct && (_.owned ? _.owned.push(i) : _.owned = [i]), i;
}
function ht(t) {
  if (t.state === 0) return;
  if (t.state === z) return D(t);
  if (t.suspense && X(t.suspense.inFallback)) return t.suspense.effects.push(t);
  const e = [t];
  for (; (t = t.owner) && (!t.updatedAt || t.updatedAt < F); )
    t.state && e.push(t);
  for (let n = e.length - 1; n >= 0; n--)
    if (t = e[n], t.state === S)
      q(t);
    else if (t.state === z) {
      const r = y;
      y = null, O(() => D(t, e[0]), !1), y = r;
    }
}
function O(t, e) {
  if (y) return t();
  let n = !1;
  e || (y = []), x ? n = !0 : x = [], F++;
  try {
    const r = t();
    return At(n), r;
  } catch (r) {
    n || (x = null), y = null, yt(r);
  }
}
function At(t) {
  if (y && (gt(y), y = null), t) return;
  const e = x;
  x = null, e.length && O(() => kt(e), !1);
}
function gt(t) {
  for (let e = 0; e < t.length; e++) ht(t[e]);
}
function D(t, e) {
  t.state = 0;
  for (let n = 0; n < t.sources.length; n += 1) {
    const r = t.sources[n];
    if (r.sources) {
      const o = r.state;
      o === S ? r !== e && (!r.updatedAt || r.updatedAt < F) && ht(r) : o === z && D(r, e);
    }
  }
}
function bt(t) {
  for (let e = 0; e < t.observers.length; e += 1) {
    const n = t.observers[e];
    n.state || (n.state = z, n.pure ? y.push(n) : x.push(n), n.observers && bt(n));
  }
}
function j(t) {
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
    for (e = t.tOwned.length - 1; e >= 0; e--) j(t.tOwned[e]);
    delete t.tOwned;
  }
  if (t.owned) {
    for (e = t.owned.length - 1; e >= 0; e--) j(t.owned[e]);
    t.owned = null;
  }
  if (t.cleanups) {
    for (e = t.cleanups.length - 1; e >= 0; e--) t.cleanups[e]();
    t.cleanups = null;
  }
  t.state = 0;
}
function Et(t) {
  return t instanceof Error ? t : new Error(typeof t == "string" ? t : "Unknown error", {
    cause: t
  });
}
function yt(t, e = _) {
  throw Et(t);
}
function M(t, e) {
  return X(() => t(e || {}));
}
const B = (t) => xt(() => t());
function $t(t, e, n) {
  let r = n.length, o = e.length, i = r, a = 0, s = 0, l = e[o - 1].nextSibling, c = null;
  for (; a < o || s < i; ) {
    if (e[a] === n[s]) {
      a++, s++;
      continue;
    }
    for (; e[o - 1] === n[i - 1]; )
      o--, i--;
    if (o === a) {
      const u = i < r ? s ? n[s - 1].nextSibling : n[i - s] : l;
      for (; s < i; ) t.insertBefore(n[s++], u);
    } else if (i === s)
      for (; a < o; )
        (!c || !c.has(e[a])) && e[a].remove(), a++;
    else if (e[a] === n[i - 1] && n[s] === e[o - 1]) {
      const u = e[--o].nextSibling;
      t.insertBefore(n[s++], e[a++].nextSibling), t.insertBefore(n[--i], u), e[o] = n[i];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let v = s;
        for (; v < i; ) c.set(n[v], v++);
      }
      const u = c.get(e[a]);
      if (u != null)
        if (s < u && u < i) {
          let v = a, p = 1, b;
          for (; ++v < o && v < i && !((b = c.get(e[v])) == null || b !== u + p); )
            p++;
          if (p > u - s) {
            const A = e[a];
            for (; s < u; ) t.insertBefore(n[s++], A);
          } else t.replaceChild(n[s++], e[a++]);
        } else a++;
      else e[a++].remove();
    }
  }
}
const nt = "_$DX_DELEGATE";
function L(t, e, n, r) {
  let o;
  const i = () => {
    const s = document.createElement("template");
    return s.innerHTML = t, s.content.firstChild;
  }, a = () => (o || (o = i())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function Tt(t, e = window.document) {
  const n = e[nt] || (e[nt] = /* @__PURE__ */ new Set());
  for (let r = 0, o = t.length; r < o; r++) {
    const i = t[r];
    n.has(i) || (n.add(i), e.addEventListener(i, Ot));
  }
}
function T(t, e, n) {
  n == null ? t.removeAttribute(e) : t.setAttribute(e, n);
}
function jt(t, e, n) {
  if (!e) return n ? T(t, "style") : e;
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
  if (n !== void 0 && !r && (r = []), typeof e != "function") return R(t, e, r, n);
  N((o) => R(t, e(), o, n), r);
}
function Ot(t) {
  let e = t.target;
  const n = `$$${t.type}`, r = t.target, o = t.currentTarget, i = (l) => Object.defineProperty(t, "target", {
    configurable: !0,
    value: l
  }), a = () => {
    const l = e[n];
    if (l && !e.disabled) {
      const c = e[`${n}Data`];
      if (c !== void 0 ? l.call(e, c, t) : l.call(e, t), t.cancelBubble) return;
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
    const l = t.composedPath();
    i(l[0]);
    for (let c = 0; c < l.length - 2 && (e = l[c], !!a()); c++) {
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
function R(t, e, n, r, o) {
  for (; typeof n == "function"; ) n = n();
  if (e === n) return n;
  const i = typeof e, a = r !== void 0;
  if (t = a && n[0] && n[0].parentNode || t, i === "string" || i === "number") {
    if (i === "number" && (e = e.toString(), e === n))
      return n;
    if (a) {
      let s = n[0];
      s && s.nodeType === 3 ? s.data !== e && (s.data = e) : s = document.createTextNode(e), n = E(t, n, r, s);
    } else
      n !== "" && typeof n == "string" ? n = t.firstChild.data = e : n = t.textContent = e;
  } else if (e == null || i === "boolean")
    n = E(t, n, r);
  else {
    if (i === "function")
      return N(() => {
        let s = e();
        for (; typeof s == "function"; ) s = s();
        n = R(t, s, n, r);
      }), () => n;
    if (Array.isArray(e)) {
      const s = [], l = n && Array.isArray(n);
      if (G(s, e, n, o))
        return N(() => n = R(t, s, n, r, !0)), () => n;
      if (s.length === 0) {
        if (n = E(t, n, r), a) return n;
      } else l ? n.length === 0 ? rt(t, s, r) : $t(t, n, s) : (n && E(t), rt(t, s));
      n = s;
    } else if (e.nodeType) {
      if (Array.isArray(n)) {
        if (a) return n = E(t, n, r, e);
        E(t, n, null, e);
      } else n == null || n === "" || !t.firstChild ? t.appendChild(e) : t.replaceChild(e, t.firstChild);
      n = e;
    }
  }
  return n;
}
function G(t, e, n, r) {
  let o = !1;
  for (let i = 0, a = e.length; i < a; i++) {
    let s = e[i], l = n && n[t.length], c;
    if (!(s == null || s === !0 || s === !1)) if ((c = typeof s) == "object" && s.nodeType)
      t.push(s);
    else if (Array.isArray(s))
      o = G(t, s, l) || o;
    else if (c === "function")
      if (r) {
        for (; typeof s == "function"; ) s = s();
        o = G(t, Array.isArray(s) ? s : [s], Array.isArray(l) ? l : [l]) || o;
      } else
        t.push(s), o = !0;
    else {
      const u = String(s);
      l && l.nodeType === 3 && l.data === u ? t.push(l) : t.push(document.createTextNode(u));
    }
  }
  return o;
}
function rt(t, e, n = null) {
  for (let r = 0, o = e.length; r < o; r++) t.insertBefore(e[r], n);
}
function E(t, e, n, r) {
  if (n === void 0) return t.textContent = "";
  const o = r || document.createTextNode("");
  if (e.length) {
    let i = !1;
    for (let a = e.length - 1; a >= 0; a--) {
      const s = e[a];
      if (o !== s) {
        const l = s.parentNode === t;
        !i && !a ? l ? t.replaceChild(o, s) : t.insertBefore(o, n) : l && s.remove();
      } else i = !0;
    }
  } else t.insertBefore(o, n);
  return [o];
}
function Lt(t) {
  return Object.keys(t).reduce((e, n) => {
    const r = t[n];
    return e[n] = Object.assign({}, r), mt(r.value) && !Nt(r.value) && !Array.isArray(r.value) && (e[n].value = Object.assign({}, r.value)), Array.isArray(r.value) && (e[n].value = r.value.slice(0)), e;
  }, {});
}
function Mt(t) {
  return t ? Object.keys(t).reduce((e, n) => {
    const r = t[n];
    return e[n] = mt(r) && "value" in r ? r : {
      value: r
    }, e[n].attribute || (e[n].attribute = zt(n)), e[n].parse = "parse" in e[n] ? e[n].parse : typeof e[n].value != "string", e;
  }, {}) : {};
}
function Bt(t) {
  return Object.keys(t).reduce((e, n) => (e[n] = t[n].value, e), {});
}
function Pt(t, e) {
  const n = Lt(e);
  return Object.keys(e).forEach((r) => {
    const o = n[r], i = t.getAttribute(o.attribute), a = t[r];
    i != null && (o.value = o.parse ? vt(i) : i), a != null && (o.value = Array.isArray(a) ? a.slice(0) : a), o.reflect && ot(t, o.attribute, o.value, !!o.parse), Object.defineProperty(t, r, {
      get() {
        return o.value;
      },
      set(s) {
        const l = o.value;
        o.value = s, o.reflect && ot(this, o.attribute, o.value, !!o.parse);
        for (let c = 0, u = this.__propertyChangedCallbacks.length; c < u; c++)
          this.__propertyChangedCallbacks[c](r, s, l);
      },
      enumerable: !0,
      configurable: !0
    });
  }), n;
}
function vt(t) {
  if (t)
    try {
      return JSON.parse(t);
    } catch {
      return t;
    }
}
function ot(t, e, n, r) {
  if (n == null || n === !1) return t.removeAttribute(e);
  let o = r ? JSON.stringify(n) : n;
  t.__updating[e] = !0, o === "true" && (o = ""), t.setAttribute(e, o), Promise.resolve().then(() => delete t.__updating[e]);
}
function zt(t) {
  return t.replace(/\.?([A-Z]+)/g, (e, n) => "-" + n.toLowerCase()).replace("_", "-").replace(/^-/, "");
}
function mt(t) {
  return t != null && (typeof t == "object" || typeof t == "function");
}
function Nt(t) {
  return Object.prototype.toString.call(t) === "[object Function]";
}
function Dt(t) {
  return typeof t == "function" && t.toString().indexOf("class") === 0;
}
let J;
function Rt(t, e) {
  const n = Object.keys(e);
  return class extends t {
    static get observedAttributes() {
      return n.map((r) => e[r].attribute);
    }
    constructor() {
      super(), this.__initialized = !1, this.__released = !1, this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = {};
    }
    connectedCallback() {
      if (this.__initialized) return;
      this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = Pt(this, e);
      const r = Bt(this.props), o = this.Component, i = J;
      try {
        J = this, this.__initialized = !0, Dt(o) ? new o(r, {
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
        this[r] = e[r].parse ? vt(i) : i;
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
function Ft(t, e = {}, n = {}) {
  const {
    BaseElement: r = HTMLElement,
    extension: o,
    customElements: i = window.customElements
  } = n;
  return (a) => {
    let s = i.get(t);
    return s ? (s.prototype.Component = a, s) : (s = Rt(r, Mt(e)), s.prototype.Component = a, s.prototype.registeredTag = t, i.define(t, s, o), s);
  };
}
function qt(t) {
  const e = Object.keys(t), n = {};
  for (let r = 0; r < e.length; r++) {
    const [o, i] = ut(t[e[r]]);
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
function Ut(t) {
  return (e, n) => {
    const { element: r } = n;
    return Ct((o) => {
      const i = qt(e);
      r.addPropertyChangedCallback((s, l) => i[s] = l), r.addReleaseCallback(() => {
        r.renderRoot.textContent = "", o();
      });
      const a = t(i, n);
      return C(r.renderRoot, a);
    }, Ht(r));
  };
}
function It(t, e, n) {
  return arguments.length === 2 && (n = e, e = {}), Ft(t, e)(Ut(n));
}
const Jt = `
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
var Zt = /* @__PURE__ */ L('<div part=container class=dictate-button__container><style></style><div aria-live=polite class=dictate-button__status-announcer style="position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0"></div><button part=button class=dictate-button__button>'), Gt = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--idle"fill=none viewBox="0 0 24 24"stroke-width=1.5 stroke=currentColor role=img aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z">'), Vt = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--recording"viewBox="0 0 24 24"fill=currentColor role=img aria-hidden=true><circle cx=12 cy=12 r=10>'), Xt = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--processing"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9">'), Kt = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--error"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=4 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><line x1=12 x2=12 y1=4 y2=14></line><line x1=12 x2=12.01 y1=20 y2=20>');
console.debug("dictate-button version:", "1.4.1");
const Qt = "https://api.dictate-button.io/transcribe", k = "dictate-button.io", Z = -70, it = -10, st = 0, Wt = 4, Yt = 0.25, te = 0.05;
It("dictate-button", {
  size: 30,
  apiEndpoint: Qt,
  language: void 0
}, (t, {
  element: e
}) => {
  console.debug("api", t.apiEndpoint);
  const [n, r] = ut("idle");
  let o = null, i = [], a = null, s = null, l = null, c = !1, u = 0;
  const v = (f) => f <= Z ? 0 : f >= it ? 1 : (f - Z) / (it - Z), p = (f) => {
    let w = 0;
    for (let m = 0; m < f.length; m++) {
      const d = (f[m] - 128) / 128;
      w += d * d;
    }
    return Math.sqrt(w / f.length);
  }, b = (f) => 20 * Math.log10(Math.max(f, 1e-8)), A = (f) => {
    const w = e.shadowRoot.querySelector(".dictate-button__button");
    if (!w)
      return;
    const m = st + f * (Wt - st), d = 0 + f * 0.4;
    w.style.boxShadow = `0 0 0 ${m}px light-dark(rgba(0, 0, 0, ${d}), rgba(255, 255, 255, ${d}))`;
  }, K = () => {
    if (!c || !s || !l) return;
    s.getByteTimeDomainData(l);
    const f = p(l), w = b(f), m = v(w), d = m > u ? Yt : te;
    u = d * m + (1 - d) * u, A(u), requestAnimationFrame(K);
  }, H = () => {
    o && o.state !== "inactive" && o.stop(), i = [], c = !1, a && a.state !== "closed" && a.close(), a = null, s = null, l = null, u = 0, A(0);
  };
  e.addEventListener("disconnected", H);
  const _t = async () => {
    if (H(), n() === "idle")
      try {
        const f = await navigator.mediaDevices.getUserMedia({
          audio: !0
        });
        a = new (window.AudioContext || window.webkitAudioContext)();
        const w = a.createMediaStreamSource(f);
        s = a.createAnalyser(), s.fftSize = 2048, w.connect(s), l = new Uint8Array(s.fftSize), o = new MediaRecorder(f, {
          mimeType: "audio/webm"
        }), i = [], o.ondataavailable = (m) => {
          i.push(m.data);
        }, o.onstop = async () => {
          c = !1, r("processing"), $(e, "transcribing:started", "Started transcribing");
          const m = new Blob(i, {
            type: "audio/webm"
          });
          try {
            const d = new FormData();
            d.append("audio", m, "recording.webm"), d.append("origin", window?.location?.origin), t.language && d.append("language", t.language);
            const h = await fetch(t.apiEndpoint, {
              method: "POST",
              body: d
            });
            if (!h.ok) throw new Error("Failed to transcribe audio");
            const U = await h.json();
            if (n() !== "processing") return;
            $(e, "transcribing:finished", U.text), r("idle");
          } catch (d) {
            console.error("Failed to transcribe audio:", d), $(e, "transcribing:failed", "Failed to transcribe audio"), Q();
          }
        }, o.start(), $(e, "recording:started", "Started recording"), c = !0, K(), r("recording");
      } catch (f) {
        console.error("Failed to start recording:", f), $(e, "recording:failed", "Failed to start recording"), Q();
      }
    else
      $(e, "recording:stopped", "Stopped recording"), r("idle"), H();
  }, Q = () => {
    r("error"), setTimeout(() => r("idle"), 2e3);
  };
  return (() => {
    var f = Zt(), w = f.firstChild, m = w.nextSibling, d = m.nextSibling;
    return C(w, Jt), C(m, () => at(n())), d.$$click = _t, C(d, (() => {
      var h = B(() => n() === "idle");
      return () => h() && M(ne, {});
    })(), null), C(d, (() => {
      var h = B(() => n() === "recording");
      return () => h() && M(re, {});
    })(), null), C(d, (() => {
      var h = B(() => n() === "processing");
      return () => h() && M(oe, {});
    })(), null), C(d, (() => {
      var h = B(() => n() === "error");
      return () => h() && M(ie, {});
    })(), null), N((h) => {
      var U = `width:${t.size}px;height:${t.size}px"`, W = ee(n()), Y = at(n()), tt = n() === "recording", et = n() === "processing";
      return h.e = jt(d, U, h.e), W !== h.t && T(d, "title", h.t = W), Y !== h.a && T(d, "aria-label", h.a = Y), tt !== h.o && T(d, "aria-pressed", h.o = tt), et !== h.i && T(d, "aria-busy", h.i = et), h;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), f;
  })();
});
const ee = (t) => {
  switch (t) {
    case "idle":
      return `Start dictation (${k})`;
    case "recording":
      return `Stop dictation (${k})`;
    case "processing":
      return `Stop processing (${k})`;
    case "error":
      return `Click to reset (${k})`;
  }
}, at = (t) => {
  switch (t) {
    case "idle":
      return `Start dictation (${k})`;
    case "recording":
      return `Dictation in progress. Click to stop it (${k})`;
    case "processing":
      return `Processing dictation. Click to cancel it (${k})`;
    case "error":
      return `Dictation error. Click to reset (${k})`;
  }
}, $ = (t, e, n) => {
  t.dispatchEvent(new CustomEvent(e, {
    detail: n,
    bubbles: !0,
    composed: !0
  }));
}, ne = () => Gt(), re = () => Vt(), oe = () => Xt(), ie = () => Kt();
Tt(["click"]);
function lt(t, e = {}) {
  const { buttonSize: n = 30, verbose: r = !1, customApiEndpoint: o } = e, i = document.querySelectorAll(t);
  for (const a of i) {
    if (a.hasAttribute("data-dictate-button-enabled")) continue;
    const s = a.parentNode;
    if (!a.isConnected || !s) {
      r && console.debug("injectDictateButton: skipping detached field", a);
      continue;
    }
    a.setAttribute("data-dictate-button-enabled", "");
    const l = document.createElement("div");
    l.style.position = "relative";
    const c = getComputedStyle(a), u = c.display === "block";
    l.style.display = u ? "block" : "inline-block", l.style.width = u ? "100%" : "auto", l.style.color = "inherit", l.classList.add("dictate-button-wrapper"), s.insertBefore(l, a), l.appendChild(a), l.style.margin = c.margin, a.style.margin = "0", a.style.boxSizing = "border-box";
    const v = le(c);
    a.style.paddingRight = `${n + v * 2}px`;
    const p = document.createElement("dictate-button");
    p.size = n, p.style.position = "absolute", p.style.right = "0", p.style.top = ae(
      l,
      c,
      a.tagName,
      n
    ) + "px", p.style.marginRight = p.style.marginLeft = `${v}px`, p.style.marginTop = "0", p.style.marginBottom = "0", o && (p.apiEndpoint = o), p.language = se(), p.addEventListener("recording:started", (b) => {
      r && console.debug("recording:started", b);
    }), p.addEventListener("recording:stopped", (b) => {
      r && console.debug("recording:stopped", b);
    }), p.addEventListener("recording:failed", (b) => {
      r && console.debug("recording:failed", b), V(a);
    }), p.addEventListener("transcribing:started", (b) => {
      r && console.debug("transcribing:started", b);
    }), p.addEventListener("transcribing:finished", (b) => {
      r && console.debug("transcribing:finished", b);
      const A = b.detail;
      ce(a, A);
    }), p.addEventListener("transcribing:failed", (b) => {
      r && console.debug("transcribing:failed", b), V(a);
    }), l.appendChild(p);
  }
}
function se() {
  const t = document.documentElement.lang;
  if (t && t.length >= 2)
    try {
      return (Intl?.Locale ? new Intl.Locale(t) : null)?.language ?? t.split(/[-_]/)[0].toLowerCase();
    } catch {
      return t.split(/[-_]/)[0].toLowerCase();
    }
}
function ae(t, e, n, r) {
  if (n.toLowerCase() === "textarea") {
    const i = parseFloat(e.paddingTop || "0");
    return Math.max(4, i);
  }
  const o = Math.round(t.clientHeight / 2 - r / 2);
  return Math.max(4, o);
}
function le(t) {
  const e = parseFloat(t.paddingRight || "0");
  return Math.max(e, 4);
}
function ce(t, e) {
  const n = typeof e == "string" ? e.trim() : String(e ?? "").trim();
  if (n.length === 0)
    return;
  const r = t.selectionStart ?? 0, o = t.selectionEnd ?? 0, i = r > 0 ? t.value.charAt(r - 1) : "", a = i && !/\s/.test(i), s = o < t.value.length ? t.value.charAt(o) : "", l = s && !/\s/.test(s), c = (a ? " " : "") + n + (l ? " " : ""), u = r + c.length, v = typeof t.scrollTop == "number" ? t.scrollTop : null;
  if (typeof t.setRangeText == "function")
    t.setRangeText(c, r, o, "end");
  else {
    t.value = t.value.substring(0, r) + c + t.value.substring(o);
    try {
      t.selectionStart = u, t.selectionEnd = u;
    } catch {
    }
  }
  v !== null && (t.scrollTop = v), t.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), V(t);
}
function V(t) {
  try {
    t.focus({ preventScroll: !0 });
  } catch {
    t.focus();
  }
}
function ue(t, e = {}) {
  const { watchDomChanges: n = !1 } = e, r = () => {
    lt(t, e), n && document.body && new MutationObserver(() => {
      lt(t, e);
    }).observe(document.body, { childList: !0, subtree: !0 });
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r, { once: !0 }) : r();
}
const de = 30, pe = !0, fe = !1, he = [
  "textarea[data-dictate-button-on]:not([data-dictate-button-enabled])",
  'input[type="text"][data-dictate-button-on]:not([data-dictate-button-enabled])',
  'input[type="search"][data-dictate-button-on]:not([data-dictate-button-enabled])',
  "input[data-dictate-button-on]:not([type]):not([data-dictate-button-enabled])"
].join(",");
ue(he, {
  buttonSize: de,
  watchDomChanges: pe,
  verbose: fe
});
