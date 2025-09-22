const we = (e, t) => e === t, z = {
  equals: we
};
let Se = he;
const x = 1, R = 2, ce = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var y = null;
let J = null, g = null, b = null, C = null, q = 0;
function ke(e, t) {
  const n = g, r = y, o = e.length === 0, i = t === void 0 ? r : t, l = o ? ce : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, s = o ? e : () => e(() => K(() => T(l)));
  y = l, g = null;
  try {
    return j(s, !0);
  } finally {
    g = n, y = r;
  }
}
function ue(e, t) {
  t = t ? Object.assign({}, z, t) : z;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (o) => (typeof o == "function" && (o = o(n.value)), fe(n, o));
  return [de.bind(n), r];
}
function B(e, t, n) {
  const r = pe(e, t, !1, x);
  I(r);
}
function Ce(e, t, n) {
  n = n ? Object.assign({}, z, n) : z;
  const r = pe(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, I(r), de.bind(r);
}
function K(e) {
  if (g === null) return e();
  const t = g;
  g = null;
  try {
    return e();
  } finally {
    g = t;
  }
}
function de() {
  if (this.sources && this.state)
    if (this.state === x) I(this);
    else {
      const e = b;
      b = null, j(() => D(this), !1), b = e;
    }
  if (g) {
    const e = this.observers ? this.observers.length : 0;
    g.sources ? (g.sources.push(this), g.sourceSlots.push(e)) : (g.sources = [this], g.sourceSlots = [e]), this.observers ? (this.observers.push(g), this.observerSlots.push(g.sources.length - 1)) : (this.observers = [g], this.observerSlots = [g.sources.length - 1]);
  }
  return this.value;
}
function fe(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && j(() => {
    for (let o = 0; o < e.observers.length; o += 1) {
      const i = e.observers[o], l = J && J.running;
      l && J.disposed.has(i), (l ? !i.tState : !i.state) && (i.pure ? b.push(i) : C.push(i), i.observers && be(i)), l || (i.state = x);
    }
    if (b.length > 1e6)
      throw b = [], new Error();
  }, !1)), t;
}
function I(e) {
  if (!e.fn) return;
  T(e);
  const t = q;
  xe(e, e.value, t);
}
function xe(e, t, n) {
  let r;
  const o = y, i = g;
  g = y = e;
  try {
    r = e.fn(t);
  } catch (l) {
    return e.pure && (e.state = x, e.owned && e.owned.forEach(T), e.owned = null), e.updatedAt = n + 1, ve(l);
  } finally {
    g = i, y = o;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? fe(e, r) : e.value = r, e.updatedAt = n);
}
function pe(e, t, n, r = x, o) {
  const i = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: y,
    context: y ? y.context : null,
    pure: n
  };
  return y === null || y !== ce && (y.owned ? y.owned.push(i) : y.owned = [i]), i;
}
function ge(e) {
  if (e.state === 0) return;
  if (e.state === R) return D(e);
  if (e.suspense && K(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < q); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === x)
      I(e);
    else if (e.state === R) {
      const r = b;
      b = null, j(() => D(e, t[0]), !1), b = r;
    }
}
function j(e, t) {
  if (b) return e();
  let n = !1;
  t || (b = []), C ? n = !0 : C = [], q++;
  try {
    const r = e();
    return Ae(n), r;
  } catch (r) {
    n || (C = null), b = null, ve(r);
  }
}
function Ae(e) {
  if (b && (he(b), b = null), e) return;
  const t = C;
  C = null, t.length && j(() => Se(t), !1);
}
function he(e) {
  for (let t = 0; t < e.length; t++) ge(e[t]);
}
function D(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const o = r.state;
      o === x ? r !== t && (!r.updatedAt || r.updatedAt < q) && ge(r) : o === R && D(r, t);
    }
  }
}
function be(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = R, n.pure ? b.push(n) : C.push(n), n.observers && be(n));
  }
}
function T(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), o = n.observers;
      if (o && o.length) {
        const i = o.pop(), l = n.observerSlots.pop();
        r < o.length && (i.sourceSlots[l] = r, o[r] = i, n.observerSlots[r] = l);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) T(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) T(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Ee(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function ve(e, t = y) {
  throw Ee(e);
}
function P(e, t) {
  return K(() => e(t || {}));
}
const M = (e) => Ce(() => e());
function $e(e, t, n) {
  let r = n.length, o = t.length, i = r, l = 0, s = 0, a = t[o - 1].nextSibling, c = null;
  for (; l < o || s < i; ) {
    if (t[l] === n[s]) {
      l++, s++;
      continue;
    }
    for (; t[o - 1] === n[i - 1]; )
      o--, i--;
    if (o === l) {
      const d = i < r ? s ? n[s - 1].nextSibling : n[i - s] : a;
      for (; s < i; ) e.insertBefore(n[s++], d);
    } else if (i === s)
      for (; l < o; )
        (!c || !c.has(t[l])) && t[l].remove(), l++;
    else if (t[l] === n[i - 1] && n[s] === t[o - 1]) {
      const d = t[--o].nextSibling;
      e.insertBefore(n[s++], t[l++].nextSibling), e.insertBefore(n[--i], d), t[o] = n[i];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let m = s;
        for (; m < i; ) c.set(n[m], m++);
      }
      const d = c.get(t[l]);
      if (d != null)
        if (s < d && d < i) {
          let m = l, w = 1, O;
          for (; ++m < o && m < i && !((O = c.get(t[m])) == null || O !== d + w); )
            w++;
          if (w > d - s) {
            const N = t[l];
            for (; s < d; ) e.insertBefore(n[s++], N);
          } else e.replaceChild(n[s++], t[l++]);
        } else l++;
      else t[l++].remove();
    }
  }
}
const re = "_$DX_DELEGATE";
function L(e, t, n, r) {
  let o;
  const i = () => {
    const s = document.createElement("template");
    return s.innerHTML = e, s.content.firstChild;
  }, l = () => (o || (o = i())).cloneNode(!0);
  return l.cloneNode = l, l;
}
function Te(e, t = window.document) {
  const n = t[re] || (t[re] = /* @__PURE__ */ new Set());
  for (let r = 0, o = e.length; r < o; r++) {
    const i = e[r];
    n.has(i) || (n.add(i), t.addEventListener(i, Le));
  }
}
function $(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function je(e, t, n) {
  if (!t) return n ? $(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let o, i;
  for (i in n)
    t[i] == null && r.removeProperty(i), delete n[i];
  for (i in t)
    o = t[i], o !== n[i] && (r.setProperty(i, o), n[i] = o);
  return n;
}
function k(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return F(e, t, r, n);
  B((o) => F(e, t(), o, n), r);
}
function Le(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, o = e.currentTarget, i = (a) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: a
  }), l = () => {
    const a = t[n];
    if (a && !t.disabled) {
      const c = t[`${n}Data`];
      if (c !== void 0 ? a.call(t, c, e) : a.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, s = () => {
    for (; l() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const a = e.composedPath();
    i(a[0]);
    for (let c = 0; c < a.length - 2 && (t = a[c], !!l()); c++) {
      if (t._$host) {
        t = t._$host, s();
        break;
      }
      if (t.parentNode === o)
        break;
    }
  } else s();
  i(r);
}
function F(e, t, n, r, o) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const i = typeof t, l = r !== void 0;
  if (e = l && n[0] && n[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === n))
      return n;
    if (l) {
      let s = n[0];
      s && s.nodeType === 3 ? s.data !== t && (s.data = t) : s = document.createTextNode(t), n = A(e, n, r, s);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean")
    n = A(e, n, r);
  else {
    if (i === "function")
      return B(() => {
        let s = t();
        for (; typeof s == "function"; ) s = s();
        n = F(e, s, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const s = [], a = n && Array.isArray(n);
      if (G(s, t, n, o))
        return B(() => n = F(e, s, n, r, !0)), () => n;
      if (s.length === 0) {
        if (n = A(e, n, r), l) return n;
      } else a ? n.length === 0 ? oe(e, s, r) : $e(e, n, s) : (n && A(e), oe(e, s));
      n = s;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (l) return n = A(e, n, r, t);
        A(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function G(e, t, n, r) {
  let o = !1;
  for (let i = 0, l = t.length; i < l; i++) {
    let s = t[i], a = n && n[e.length], c;
    if (!(s == null || s === !0 || s === !1)) if ((c = typeof s) == "object" && s.nodeType)
      e.push(s);
    else if (Array.isArray(s))
      o = G(e, s, a) || o;
    else if (c === "function")
      if (r) {
        for (; typeof s == "function"; ) s = s();
        o = G(e, Array.isArray(s) ? s : [s], Array.isArray(a) ? a : [a]) || o;
      } else
        e.push(s), o = !0;
    else {
      const d = String(s);
      a && a.nodeType === 3 && a.data === d ? e.push(a) : e.push(document.createTextNode(d));
    }
  }
  return o;
}
function oe(e, t, n = null) {
  for (let r = 0, o = t.length; r < o; r++) e.insertBefore(t[r], n);
}
function A(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const o = r || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let l = t.length - 1; l >= 0; l--) {
      const s = t[l];
      if (o !== s) {
        const a = s.parentNode === e;
        !i && !l ? a ? e.replaceChild(o, s) : e.insertBefore(o, n) : a && s.remove();
      } else i = !0;
    }
  } else e.insertBefore(o, n);
  return [o];
}
function Oe(e) {
  return Object.keys(e).reduce((t, n) => {
    const r = e[n];
    return t[n] = Object.assign({}, r), me(r.value) && !Re(r.value) && !Array.isArray(r.value) && (t[n].value = Object.assign({}, r.value)), Array.isArray(r.value) && (t[n].value = r.value.slice(0)), t;
  }, {});
}
function Ne(e) {
  return e ? Object.keys(e).reduce((t, n) => {
    const r = e[n];
    return t[n] = me(r) && "value" in r ? r : {
      value: r
    }, t[n].attribute || (t[n].attribute = ze(n)), t[n].parse = "parse" in t[n] ? t[n].parse : typeof t[n].value != "string", t;
  }, {}) : {};
}
function Pe(e) {
  return Object.keys(e).reduce((t, n) => (t[n] = e[n].value, t), {});
}
function Me(e, t) {
  const n = Oe(t);
  return Object.keys(t).forEach((r) => {
    const o = n[r], i = e.getAttribute(o.attribute), l = e[r];
    i != null && (o.value = o.parse ? ye(i) : i), l != null && (o.value = Array.isArray(l) ? l.slice(0) : l), o.reflect && ie(e, o.attribute, o.value, !!o.parse), Object.defineProperty(e, r, {
      get() {
        return o.value;
      },
      set(s) {
        const a = o.value;
        o.value = s, o.reflect && ie(this, o.attribute, o.value, !!o.parse);
        for (let c = 0, d = this.__propertyChangedCallbacks.length; c < d; c++)
          this.__propertyChangedCallbacks[c](r, s, a);
      },
      enumerable: !0,
      configurable: !0
    });
  }), n;
}
function ye(e) {
  if (e)
    try {
      return JSON.parse(e);
    } catch {
      return e;
    }
}
function ie(e, t, n, r) {
  if (n == null || n === !1) return e.removeAttribute(t);
  let o = r ? JSON.stringify(n) : n;
  e.__updating[t] = !0, o === "true" && (o = ""), e.setAttribute(t, o), Promise.resolve().then(() => delete e.__updating[t]);
}
function ze(e) {
  return e.replace(/\.?([A-Z]+)/g, (t, n) => "-" + n.toLowerCase()).replace("_", "-").replace(/^-/, "");
}
function me(e) {
  return e != null && (typeof e == "object" || typeof e == "function");
}
function Re(e) {
  return Object.prototype.toString.call(e) === "[object Function]";
}
function Be(e) {
  return typeof e == "function" && e.toString().indexOf("class") === 0;
}
let X;
function De(e, t) {
  const n = Object.keys(t);
  return class extends e {
    static get observedAttributes() {
      return n.map((r) => t[r].attribute);
    }
    constructor() {
      super(), this.__initialized = !1, this.__released = !1, this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = {};
    }
    connectedCallback() {
      if (this.__initialized) return;
      this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = Me(this, t);
      const r = Pe(this.props), o = this.Component, i = X;
      try {
        X = this, this.__initialized = !0, Be(o) ? new o(r, {
          element: this
        }) : o(r, {
          element: this
        });
      } finally {
        X = i;
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
      if (this.__initialized && !this.__updating[r] && (r = this.lookupProp(r), r in t)) {
        if (i == null && !this[r]) return;
        this[r] = t[r].parse ? ye(i) : i;
      }
    }
    lookupProp(r) {
      if (t)
        return n.find((o) => r === o || r === t[o].attribute);
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
function Fe(e, t = {}, n = {}) {
  const {
    BaseElement: r = HTMLElement,
    extension: o,
    customElements: i = window.customElements
  } = n;
  return (l) => {
    let s = i.get(e);
    return s ? (s.prototype.Component = l, s) : (s = De(r, Ne(t)), s.prototype.Component = l, s.prototype.registeredTag = e, i.define(e, s, o), s);
  };
}
function qe(e) {
  const t = Object.keys(e), n = {};
  for (let r = 0; r < t.length; r++) {
    const [o, i] = ue(e[t[r]]);
    Object.defineProperty(n, t[r], {
      get: o,
      set(l) {
        i(() => l);
      }
    });
  }
  return n;
}
function Ie(e) {
  if (e.assignedSlot && e.assignedSlot._$owner) return e.assignedSlot._$owner;
  let t = e.parentNode;
  for (; t && !t._$owner && !(t.assignedSlot && t.assignedSlot._$owner); )
    t = t.parentNode;
  return t && t.assignedSlot ? t.assignedSlot._$owner : e._$owner;
}
function Ue(e) {
  return (t, n) => {
    const { element: r } = n;
    return ke((o) => {
      const i = qe(t);
      r.addPropertyChangedCallback((s, a) => i[s] = a), r.addReleaseCallback(() => {
        r.renderRoot.textContent = "", o();
      });
      const l = e(i, n);
      return k(r.renderRoot, l);
    }, Ie(r));
  };
}
function He(e, t, n) {
  return arguments.length === 2 && (n = t, t = {}), Fe(e, t)(Ue(n));
}
const Je = `
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
var Xe = /* @__PURE__ */ L("<div part=container class=dictate-button__container><style></style><div aria-live=polite class=dictate-button__status-announcer></div><button part=button class=dictate-button__button>"), Ze = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--idle"fill=none viewBox="0 0 24 24"stroke-width=1.5 stroke=currentColor role=img aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z">'), Ge = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--recording"viewBox="0 0 24 24"fill=currentColor role=img aria-hidden=true><circle cx=12 cy=12 r=10>'), Ve = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--processing"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9">'), Ke = /* @__PURE__ */ L('<svg part=icon class="dictate-button__icon dictate-button__icon--error"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=4 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><line x1=12 x2=12 y1=4 y2=14></line><line x1=12 x2=12.01 y1=20 y2=20>');
console.debug("dictate-button version:", "1.4.7");
const Qe = "https://api.dictate-button.io/transcribe", S = "dictate-button.io", Z = -70, se = -10, le = 0, We = 4, Ye = 0.25, et = 0.05;
He("dictate-button", {
  size: 30,
  apiEndpoint: Qe,
  language: void 0
}, (e, {
  element: t
}) => {
  console.debug("api", e.apiEndpoint);
  const [n, r] = ue("idle");
  let o = null, i = [], l = null, s = null, a = null, c = !1, d = 0;
  const m = (f) => f <= Z ? 0 : f >= se ? 1 : (f - Z) / (se - Z), w = (f) => {
    let _ = 0;
    for (let v = 0; v < f.length; v++) {
      const u = (f[v] - 128) / 128;
      _ += u * u;
    }
    return Math.sqrt(_ / f.length);
  }, O = (f) => 20 * Math.log10(Math.max(f, 1e-8)), N = (f) => {
    const _ = t.shadowRoot.querySelector(".dictate-button__button");
    if (!_)
      return;
    const v = le + f * (We - le), u = 0 + f * 0.4;
    _.style.boxShadow = `0 0 0 ${v}px light-dark(rgba(0, 0, 0, ${u}), rgba(255, 255, 255, ${u}))`;
  }, Q = () => {
    if (!c || !s || !a) return;
    s.getByteTimeDomainData(a);
    const f = w(a), _ = O(f), v = m(_), u = v > d ? Ye : et;
    d = u * v + (1 - u) * d, N(d), requestAnimationFrame(Q);
  }, U = () => {
    o && o.state !== "inactive" && o.stop(), i = [], c = !1, l && l.state !== "closed" && l.close(), l = null, s = null, a = null, d = 0, N(0);
  };
  t.addEventListener("disconnected", U);
  const _e = async () => {
    if (U(), n() === "idle")
      try {
        const f = await navigator.mediaDevices.getUserMedia({
          audio: !0
        });
        l = new (window.AudioContext || window.webkitAudioContext)();
        const _ = l.createMediaStreamSource(f);
        s = l.createAnalyser(), s.fftSize = 2048, _.connect(s), a = new Uint8Array(s.fftSize), o = new MediaRecorder(f, {
          mimeType: "audio/webm"
        }), i = [], o.ondataavailable = (v) => {
          i.push(v.data);
        }, o.onstop = async () => {
          c = !1, r("processing"), E(t, "transcribing:started", "Started transcribing");
          const v = new Blob(i, {
            type: "audio/webm"
          });
          try {
            const u = new FormData();
            u.append("audio", v, "recording.webm"), u.append("origin", window?.location?.origin), e.language && u.append("language", e.language);
            const p = await fetch(e.apiEndpoint, {
              method: "POST",
              body: u
            });
            if (!p.ok) throw new Error("Failed to transcribe audio");
            const H = await p.json();
            if (n() !== "processing") return;
            E(t, "transcribing:finished", H.text), r("idle");
          } catch (u) {
            console.error("Failed to transcribe audio:", u), E(t, "transcribing:failed", "Failed to transcribe audio"), W();
          }
        }, o.start(), E(t, "recording:started", "Started recording"), c = !0, Q(), r("recording");
      } catch (f) {
        console.error("Failed to start recording:", f), E(t, "recording:failed", "Failed to start recording"), W();
      }
    else
      E(t, "recording:stopped", "Stopped recording"), r("idle"), U();
  }, W = () => {
    r("error"), setTimeout(() => r("idle"), 2e3);
  };
  return (() => {
    var f = Xe(), _ = f.firstChild, v = _.nextSibling, u = v.nextSibling;
    return k(_, Je), k(v, () => ae(n())), u.$$click = _e, k(u, (() => {
      var p = M(() => n() === "idle");
      return () => p() && P(nt, {});
    })(), null), k(u, (() => {
      var p = M(() => n() === "recording");
      return () => p() && P(rt, {});
    })(), null), k(u, (() => {
      var p = M(() => n() === "processing");
      return () => p() && P(ot, {});
    })(), null), k(u, (() => {
      var p = M(() => n() === "error");
      return () => p() && P(it, {});
    })(), null), B((p) => {
      var H = `width:${e.size}px;height:${e.size}px"`, Y = tt(n()), ee = ae(n()), te = n() === "recording", ne = n() === "processing";
      return p.e = je(u, H, p.e), Y !== p.t && $(u, "title", p.t = Y), ee !== p.a && $(u, "aria-label", p.a = ee), te !== p.o && $(u, "aria-pressed", p.o = te), ne !== p.i && $(u, "aria-busy", p.i = ne), p;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), f;
  })();
});
const tt = (e) => {
  switch (e) {
    case "idle":
      return `Start dictation (${S})`;
    case "recording":
      return `Stop dictation (${S})`;
    case "processing":
      return `Stop processing (${S})`;
    case "error":
      return `Click to reset (${S})`;
  }
}, ae = (e) => {
  switch (e) {
    case "idle":
      return `Start dictation (${S})`;
    case "recording":
      return `Dictation in progress. Click to stop it (${S})`;
    case "processing":
      return `Processing dictation. Click to cancel it (${S})`;
    case "error":
      return `Dictation error. Click to reset (${S})`;
  }
}, E = (e, t, n) => {
  e.dispatchEvent(new CustomEvent(t, {
    detail: n,
    bubbles: !0,
    composed: !0
  }));
}, nt = () => Ze(), rt = () => Ge(), ot = () => Ve(), it = () => Ke();
Te(["click"]);
let h = null;
st({
  buttonSize: 50,
  verbose: !0
});
function st(e = {}) {
  const t = () => {
    lt(), ct(e);
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t, { once: !0 }) : t();
}
function lt() {
  document.addEventListener("focusin", (e) => {
    const t = e.target;
    if (at(t)) {
      const n = t;
      let r, o;
      "selectionStart" in n && "selectionEnd" in n && (r = n.selectionStart ?? 0, o = n.selectionEnd ?? 0), h = {
        element: n,
        selectionStart: r,
        selectionEnd: o
      }, n.setAttribute("data-dictate-button-on", "true"), console.debug("Focus tracked on text field:", n);
    }
  }), document.addEventListener("selectionchange", () => {
    if (h && "selectionStart" in h.element) {
      const e = h.element;
      h.selectionStart = e.selectionStart ?? 0, h.selectionEnd = e.selectionEnd ?? 0;
    }
  });
}
function at(e) {
  if (!e) return !1;
  const t = e.tagName.toLowerCase();
  if (t === "textarea") return !0;
  if (t === "input") {
    const r = e.type.toLowerCase();
    return ["text", "search"].includes(r) || !r;
  }
  const n = e.getAttribute("contenteditable");
  return n === "true" || n === "";
}
function ct(e) {
  const { buttonSize: t = 50, verbose: n = !1, customApiEndpoint: r } = e;
  if (document.querySelector("#floating-dictate-button"))
    return;
  const o = document.createElement("dictate-button");
  o.id = "floating-dictate-button", o.size = t, o.style.position = "fixed", o.style.left = "50%", o.style.bottom = "20px", o.style.transform = "translateX(-50%)", o.style.zIndex = "10000", r && (o.apiEndpoint = r), o.language = ut(), o.addEventListener(
    "click",
    (i) => {
      if (!h) {
        i.preventDefault(), i.stopPropagation(), alert("Select a target text field first");
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
    const l = i.detail;
    dt(l);
  }), o.addEventListener("transcribing:failed", (i) => {
    n && console.debug("transcribing:failed", i), V();
  }), document.body.appendChild(o);
}
function ut() {
  const e = document.documentElement.lang;
  if (e && e.length >= 2)
    try {
      return (Intl?.Locale ? new Intl.Locale(e) : null)?.language ?? e.split(/[-_]/)[0].toLowerCase();
    } catch {
      return e.split(/[-_]/)[0].toLowerCase();
    }
}
function dt(e) {
  if (!h) {
    console.debug("No last focused field to insert text into");
    return;
  }
  const t = typeof e == "string" ? e.trim() : String(e ?? "").trim();
  if (t.length === 0)
    return;
  const n = h.element;
  if (n.getAttribute("contenteditable")) {
    ft(n, t);
    return;
  }
  if ("value" in n) {
    const r = n, o = h.selectionStart ?? 0, i = h.selectionEnd ?? 0, l = o > 0 ? r.value.charAt(o - 1) : "", s = l && !/\s/.test(l), a = i < r.value.length ? r.value.charAt(i) : "", c = a && !/\s/.test(a), d = (s ? " " : "") + t + (c ? " " : ""), m = o + d.length, w = typeof r.scrollTop == "number" ? r.scrollTop : null;
    if (typeof r.setRangeText == "function")
      r.setRangeText(d, o, i, "end");
    else {
      r.value = r.value.substring(0, o) + d + r.value.substring(i);
      try {
        r.selectionStart = m, r.selectionEnd = m, h.selectionStart = m, h.selectionEnd = m;
      } catch {
      }
    }
    w !== null && (r.scrollTop = w), r.dispatchEvent(
      new Event("input", { bubbles: !0, composed: !0 })
    );
  }
  V();
}
function ft(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0) {
    e.focus();
    const o = document.createRange();
    o.selectNodeContents(e), o.collapse(!1), n?.removeAllRanges(), n?.addRange(o);
  }
  const r = n?.getRangeAt(0);
  if (r) {
    r.deleteContents();
    const o = document.createTextNode(t);
    r.insertNode(o), r.setStartAfter(o), r.setEndAfter(o), n?.removeAllRanges(), n?.addRange(r);
  }
  e.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 }));
}
function V() {
  if (h?.element)
    try {
      h.element.focus({ preventScroll: !0 });
    } catch {
      h.element.focus();
    }
}
console.log("inject-floating2");
