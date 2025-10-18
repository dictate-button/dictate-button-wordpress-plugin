const Se = (e, t) => e === t, D = {
  equals: Se
};
let he = _e;
const k = 1, F = 2, be = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var y = null;
let X = null, v = null, _ = null, x = null, J = 0;
function Ae(e, t) {
  const n = v, r = y, o = e.length === 0, i = t === void 0 ? r : t, a = o ? be : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, s = o ? e : () => e(() => Z(() => $(a)));
  y = a, v = null;
  try {
    return M(s, !0);
  } finally {
    v = n, y = r;
  }
}
function ve(e, t) {
  t = t ? Object.assign({}, D, t) : D;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (o) => (typeof o == "function" && (o = o(n.value)), me(n, o));
  return [ye.bind(n), r];
}
function q(e, t, n) {
  const r = W(e, t, !1, k);
  N(r);
}
function Te(e, t, n) {
  he = Ne;
  const r = W(e, t, !1, k);
  r.user = !0, x ? x.push(r) : N(r);
}
function Le(e, t, n) {
  n = n ? Object.assign({}, D, n) : D;
  const r = W(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, N(r), ye.bind(r);
}
function Z(e) {
  if (v === null) return e();
  const t = v;
  v = null;
  try {
    return e();
  } finally {
    v = t;
  }
}
function Oe(e) {
  return y === null || (y.cleanups === null ? y.cleanups = [e] : y.cleanups.push(e)), e;
}
function ye() {
  if (this.sources && this.state)
    if (this.state === k) N(this);
    else {
      const e = _;
      _ = null, M(() => H(this), !1), _ = e;
    }
  if (v) {
    const e = this.observers ? this.observers.length : 0;
    v.sources ? (v.sources.push(this), v.sourceSlots.push(e)) : (v.sources = [this], v.sourceSlots = [e]), this.observers ? (this.observers.push(v), this.observerSlots.push(v.sources.length - 1)) : (this.observers = [v], this.observerSlots = [v.sources.length - 1]);
  }
  return this.value;
}
function me(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && M(() => {
    for (let o = 0; o < e.observers.length; o += 1) {
      const i = e.observers[o], a = X && X.running;
      a && X.disposed.has(i), (a ? !i.tState : !i.state) && (i.pure ? _.push(i) : x.push(i), i.observers && we(i)), a || (i.state = k);
    }
    if (_.length > 1e6)
      throw _ = [], new Error();
  }, !1)), t;
}
function N(e) {
  if (!e.fn) return;
  $(e);
  const t = J;
  $e(e, e.value, t);
}
function $e(e, t, n) {
  let r;
  const o = y, i = v;
  v = y = e;
  try {
    r = e.fn(t);
  } catch (a) {
    return e.pure && (e.state = k, e.owned && e.owned.forEach($), e.owned = null), e.updatedAt = n + 1, Ce(a);
  } finally {
    v = i, y = o;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? me(e, r) : e.value = r, e.updatedAt = n);
}
function W(e, t, n, r = k, o) {
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
  return y === null || y !== be && (y.owned ? y.owned.push(i) : y.owned = [i]), i;
}
function I(e) {
  if (e.state === 0) return;
  if (e.state === F) return H(e);
  if (e.suspense && Z(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < J); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === k)
      N(e);
    else if (e.state === F) {
      const r = _;
      _ = null, M(() => H(e, t[0]), !1), _ = r;
    }
}
function M(e, t) {
  if (_) return e();
  let n = !1;
  t || (_ = []), x ? n = !0 : x = [], J++;
  try {
    const r = e();
    return je(n), r;
  } catch (r) {
    n || (x = null), _ = null, Ce(r);
  }
}
function je(e) {
  if (_ && (_e(_), _ = null), e) return;
  const t = x;
  x = null, t.length && M(() => he(t), !1);
}
function _e(e) {
  for (let t = 0; t < e.length; t++) I(e[t]);
}
function Ne(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : I(r);
  }
  for (t = 0; t < n; t++) I(e[t]);
}
function H(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const o = r.state;
      o === k ? r !== t && (!r.updatedAt || r.updatedAt < J) && I(r) : o === F && H(r, t);
    }
  }
}
function we(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = F, n.pure ? _.push(n) : x.push(n), n.observers && we(n));
  }
}
function $(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), o = n.observers;
      if (o && o.length) {
        const i = o.pop(), a = n.observerSlots.pop();
        r < o.length && (i.sourceSlots[a] = r, o[r] = i, n.observerSlots[r] = a);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) $(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) $(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Me(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function Ce(e, t = y) {
  throw Me(e);
}
function B(e, t) {
  return Z(() => e(t || {}));
}
const z = (e) => Le(() => e());
function Re(e, t, n) {
  let r = n.length, o = t.length, i = r, a = 0, s = 0, c = t[o - 1].nextSibling, l = null;
  for (; a < o || s < i; ) {
    if (t[a] === n[s]) {
      a++, s++;
      continue;
    }
    for (; t[o - 1] === n[i - 1]; )
      o--, i--;
    if (o === a) {
      const u = i < r ? s ? n[s - 1].nextSibling : n[i - s] : c;
      for (; s < i; ) e.insertBefore(n[s++], u);
    } else if (i === s)
      for (; a < o; )
        (!l || !l.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === n[i - 1] && n[s] === t[o - 1]) {
      const u = t[--o].nextSibling;
      e.insertBefore(n[s++], t[a++].nextSibling), e.insertBefore(n[--i], u), t[o] = n[i];
    } else {
      if (!l) {
        l = /* @__PURE__ */ new Map();
        let f = s;
        for (; f < i; ) l.set(n[f], f++);
      }
      const u = l.get(t[a]);
      if (u != null)
        if (s < u && u < i) {
          let f = a, p = 1, d;
          for (; ++f < o && f < i && !((d = l.get(t[f])) == null || d !== u + p); )
            p++;
          if (p > u - s) {
            const L = t[a];
            for (; s < u; ) e.insertBefore(n[s++], L);
          } else e.replaceChild(n[s++], t[a++]);
        } else a++;
      else t[a++].remove();
    }
  }
}
function R(e, t, n, r) {
  let o;
  const i = () => {
    const s = document.createElement("template");
    return s.innerHTML = e, s.content.firstChild;
  }, a = () => (o || (o = i())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function O(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function Pe(e, t, n) {
  if (!t) return n ? O(e, "style") : t;
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
function Be(e, t, n) {
  return Z(() => e(t, n));
}
function S(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return U(e, t, r, n);
  q((o) => U(e, t(), o, n), r);
}
function U(e, t, n, r, o) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const i = typeof t, a = r !== void 0;
  if (e = a && n[0] && n[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === n))
      return n;
    if (a) {
      let s = n[0];
      s && s.nodeType === 3 ? s.data !== t && (s.data = t) : s = document.createTextNode(t), n = A(e, n, r, s);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean")
    n = A(e, n, r);
  else {
    if (i === "function")
      return q(() => {
        let s = t();
        for (; typeof s == "function"; ) s = s();
        n = U(e, s, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const s = [], c = n && Array.isArray(n);
      if (Q(s, t, n, o))
        return q(() => n = U(e, s, n, r, !0)), () => n;
      if (s.length === 0) {
        if (n = A(e, n, r), a) return n;
      } else c ? n.length === 0 ? ce(e, s, r) : Re(e, n, s) : (n && A(e), ce(e, s));
      n = s;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (a) return n = A(e, n, r, t);
        A(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function Q(e, t, n, r) {
  let o = !1;
  for (let i = 0, a = t.length; i < a; i++) {
    let s = t[i], c = n && n[e.length], l;
    if (!(s == null || s === !0 || s === !1)) if ((l = typeof s) == "object" && s.nodeType)
      e.push(s);
    else if (Array.isArray(s))
      o = Q(e, s, c) || o;
    else if (l === "function")
      if (r) {
        for (; typeof s == "function"; ) s = s();
        o = Q(e, Array.isArray(s) ? s : [s], Array.isArray(c) ? c : [c]) || o;
      } else
        e.push(s), o = !0;
    else {
      const u = String(s);
      c && c.nodeType === 3 && c.data === u ? e.push(c) : e.push(document.createTextNode(u));
    }
  }
  return o;
}
function ce(e, t, n = null) {
  for (let r = 0, o = t.length; r < o; r++) e.insertBefore(t[r], n);
}
function A(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const o = r || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let a = t.length - 1; a >= 0; a--) {
      const s = t[a];
      if (o !== s) {
        const c = s.parentNode === e;
        !i && !a ? c ? e.replaceChild(o, s) : e.insertBefore(o, n) : c && s.remove();
      } else i = !0;
    }
  } else e.insertBefore(o, n);
  return [o];
}
function ze(e) {
  return Object.keys(e).reduce((t, n) => {
    const r = e[n];
    return t[n] = Object.assign({}, r), Ee(r.value) && !He(r.value) && !Array.isArray(r.value) && (t[n].value = Object.assign({}, r.value)), Array.isArray(r.value) && (t[n].value = r.value.slice(0)), t;
  }, {});
}
function De(e) {
  return e ? Object.keys(e).reduce((t, n) => {
    const r = e[n];
    return t[n] = Ee(r) && "value" in r ? r : {
      value: r
    }, t[n].attribute || (t[n].attribute = Ie(n)), t[n].parse = "parse" in t[n] ? t[n].parse : typeof t[n].value != "string", t;
  }, {}) : {};
}
function Fe(e) {
  return Object.keys(e).reduce((t, n) => (t[n] = e[n].value, t), {});
}
function qe(e, t) {
  const n = ze(t);
  return Object.keys(t).forEach((r) => {
    const o = n[r], i = e.getAttribute(o.attribute), a = e[r];
    i != null && (o.value = o.parse ? xe(i) : i), a != null && (o.value = Array.isArray(a) ? a.slice(0) : a), o.reflect && ue(e, o.attribute, o.value, !!o.parse), Object.defineProperty(e, r, {
      get() {
        return o.value;
      },
      set(s) {
        const c = o.value;
        o.value = s, o.reflect && ue(this, o.attribute, o.value, !!o.parse);
        for (let l = 0, u = this.__propertyChangedCallbacks.length; l < u; l++)
          this.__propertyChangedCallbacks[l](r, s, c);
      },
      enumerable: !0,
      configurable: !0
    });
  }), n;
}
function xe(e) {
  if (e)
    try {
      return JSON.parse(e);
    } catch {
      return e;
    }
}
function ue(e, t, n, r) {
  if (n == null || n === !1) return e.removeAttribute(t);
  let o = r ? JSON.stringify(n) : n;
  e.__updating[t] = !0, o === "true" && (o = ""), e.setAttribute(t, o), Promise.resolve().then(() => delete e.__updating[t]);
}
function Ie(e) {
  return e.replace(/\.?([A-Z]+)/g, (t, n) => "-" + n.toLowerCase()).replace("_", "-").replace(/^-/, "");
}
function Ee(e) {
  return e != null && (typeof e == "object" || typeof e == "function");
}
function He(e) {
  return Object.prototype.toString.call(e) === "[object Function]";
}
function Ue(e) {
  return typeof e == "function" && e.toString().indexOf("class") === 0;
}
let G;
function Je(e, t) {
  const n = Object.keys(t);
  return class extends e {
    static get observedAttributes() {
      return n.map((r) => t[r].attribute);
    }
    constructor() {
      super(), this.__initialized = !1, this.__released = !1, this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = {};
      for (let r of n)
        this[r] = void 0;
    }
    connectedCallback() {
      if (this.__initialized) return;
      this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = qe(this, t);
      const r = Fe(this.props), o = this.Component, i = G;
      try {
        G = this, this.__initialized = !0, Ue(o) ? new o(r, {
          element: this
        }) : o(r, {
          element: this
        });
      } finally {
        G = i;
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
        this[r] = t[r].parse ? xe(i) : i;
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
function Ze(e, t = {}, n = {}) {
  const {
    BaseElement: r = HTMLElement,
    extension: o,
    customElements: i = window.customElements
  } = n;
  return (a) => {
    let s = i.get(e);
    return s ? (s.prototype.Component = a, s) : (s = Je(r, De(t)), s.prototype.Component = a, s.prototype.registeredTag = e, i.define(e, s, o), s);
  };
}
function Ve(e) {
  const t = Object.keys(e), n = {};
  for (let r = 0; r < t.length; r++) {
    const [o, i] = ve(e[t[r]]);
    Object.defineProperty(n, t[r], {
      get: o,
      set(a) {
        i(() => a);
      }
    });
  }
  return n;
}
function Xe(e) {
  if (e.assignedSlot && e.assignedSlot._$owner) return e.assignedSlot._$owner;
  let t = e.parentNode;
  for (; t && !t._$owner && !(t.assignedSlot && t.assignedSlot._$owner); )
    t = t.parentNode;
  return t && t.assignedSlot ? t.assignedSlot._$owner : e._$owner;
}
function Ge(e) {
  return (t, n) => {
    const { element: r } = n;
    return Ae((o) => {
      const i = Ve(t);
      r.addPropertyChangedCallback((s, c) => i[s] = c), r.addReleaseCallback(() => {
        r.renderRoot.textContent = "", o();
      });
      const a = e(i, n);
      return S(r.renderRoot, a);
    }, Xe(r));
  };
}
function Ke(e, t, n) {
  return arguments.length === 2 && (n = t, t = {}), Ze(e, t)(Ge(n));
}
const Qe = `
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
var We = /* @__PURE__ */ R('<div part=container class=dictate-button__container><style></style><div aria-live=polite class=dictate-button__status-announcer style="position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0"></div><button part=button class=dictate-button__button>'), Ye = /* @__PURE__ */ R('<svg part=icon class="dictate-button__icon dictate-button__icon--idle"fill=none viewBox="0 0 24 24"stroke-width=1.5 stroke=currentColor role=img aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z">'), et = /* @__PURE__ */ R('<svg part=icon class="dictate-button__icon dictate-button__icon--recording"viewBox="0 0 24 24"fill=currentColor role=img aria-hidden=true><circle cx=12 cy=12 r=10>'), tt = /* @__PURE__ */ R('<svg part=icon class="dictate-button__icon dictate-button__icon--processing"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9">'), nt = /* @__PURE__ */ R('<svg part=icon class="dictate-button__icon dictate-button__icon--error"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=4 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><line x1=12 x2=12 y1=4 y2=14></line><line x1=12 x2=12.01 y1=20 y2=20>');
console.debug("dictate-button version:", "1.6.0");
const rt = "https://api.dictate-button.io/transcribe", E = "dictate-button.io", K = -70, de = -10, pe = 0, ot = 4, it = 0.25, st = 0.05;
Ke("dictate-button", {
  size: 30,
  apiEndpoint: rt,
  language: void 0
}, (e, {
  element: t
}) => {
  console.debug("api", e.apiEndpoint);
  const [n, r] = ve("idle");
  let o = null, i = null, a = [], s = null, c = null, l = null, u = null, f = !1, p = 0;
  const d = (h) => h <= K ? 0 : h >= de ? 1 : (h - K) / (de - K), L = (h) => {
    let m = 0;
    for (let w = 0; w < h.length; w++) {
      const g = (h[w] - 128) / 128;
      m += g * g;
    }
    return Math.sqrt(m / h.length);
  }, ke = (h) => 20 * Math.log10(Math.max(h, 1e-8)), Y = (h) => {
    const m = t.shadowRoot.querySelector(".dictate-button__button");
    if (!m)
      return;
    const w = pe + h * (ot - pe), g = 0 + h * 0.4;
    m.style.boxShadow = `0 0 0 ${w}px light-dark(rgba(0, 0, 0, ${g}), rgba(255, 255, 255, ${g}))`;
  }, ee = () => {
    if (!f || !l || !u) return;
    l.getByteTimeDomainData(u);
    const h = L(u), m = ke(h), w = d(m), g = w > p ? it : st;
    p = g * w + (1 - g) * p, Y(p), requestAnimationFrame(ee);
  }, te = () => {
    o && o.state !== "inactive" && o.stop(), i && (i.getTracks().forEach((h) => h.stop()), i = null), a = [], s = null, f = !1, c && c.state !== "closed" && c.close(), c = null, l = null, u = null, p = 0, Y(0);
  };
  t.addEventListener("disconnected", te);
  const ne = async (h) => {
    if (n() === "idle") {
      s = h;
      try {
        const m = await navigator.mediaDevices.getUserMedia({
          audio: !0
        });
        i = m, c = new (window.AudioContext || window.webkitAudioContext)();
        const w = c.createMediaStreamSource(m);
        l = c.createAnalyser(), l.fftSize = 2048, w.connect(l), u = new Uint8Array(l.fftSize), o = new MediaRecorder(m, {
          mimeType: "audio/webm"
        }), a = [], o.ondataavailable = (g) => {
          a.push(g.data);
        }, o.onstop = async () => {
          f = !1, r("processing"), T(t, "transcribing:started", "Started transcribing");
          const g = new Blob(a, {
            type: "audio/webm"
          });
          try {
            const C = new FormData();
            C.append("audio", g, "recording.webm"), C.append("origin", window?.location?.origin), e.language && C.append("language", e.language);
            const b = await fetch(e.apiEndpoint, {
              method: "POST",
              body: C
            });
            if (!b.ok) throw new Error("Failed to transcribe audio");
            const V = await b.json();
            if (n() !== "processing") return;
            T(t, "transcribing:finished", V.text), r("idle");
          } catch (C) {
            console.error("Failed to transcribe audio:", C), T(t, "transcribing:failed", "Failed to transcribe audio"), oe();
          }
        }, o.start(), T(t, "recording:started", "Started recording"), f = !0, ee(), r("recording");
      } catch (m) {
        console.error("Failed to start recording:", m), T(t, "recording:failed", "Failed to start recording"), oe();
      }
    }
  }, re = () => {
    n() === "recording" && (T(t, "recording:stopped", "Stopped recording"), r("idle"), te());
  }, oe = () => {
    r("error"), setTimeout(() => r("idle"), 2e3);
  };
  let P;
  return Te(() => {
    if (!P) return;
    const h = pt(P, {
      onShortTap: () => {
        n() === "idle" ? ne("short-tap") : n() === "recording" && s === "short-tap" && re();
      },
      onLongPressStart: () => {
        n() === "idle" && ne("long-press");
      },
      onLongPressEnd: () => {
        n() === "recording" && s === "long-press" && re();
      }
    });
    Oe(h);
  }), (() => {
    var h = We(), m = h.firstChild, w = m.nextSibling, g = w.nextSibling;
    S(m, Qe), S(w, () => fe(n()));
    var C = P;
    return typeof C == "function" ? Be(C, g) : P = g, S(g, (() => {
      var b = z(() => n() === "idle");
      return () => b() && B(lt, {});
    })(), null), S(g, (() => {
      var b = z(() => n() === "recording");
      return () => b() && B(ct, {});
    })(), null), S(g, (() => {
      var b = z(() => n() === "processing");
      return () => b() && B(ut, {});
    })(), null), S(g, (() => {
      var b = z(() => n() === "error");
      return () => b() && B(dt, {});
    })(), null), q((b) => {
      var V = `width:${e.size}px;height:${e.size}px"`, ie = at(n()), se = fe(n()), ae = n() === "recording", le = n() === "processing";
      return b.e = Pe(g, V, b.e), ie !== b.t && O(g, "title", b.t = ie), se !== b.a && O(g, "aria-label", b.a = se), ae !== b.o && O(g, "aria-pressed", b.o = ae), le !== b.i && O(g, "aria-busy", b.i = le), b;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), h;
  })();
});
const at = (e) => {
  switch (e) {
    case "idle":
      return `Start dictation (${E})`;
    case "recording":
      return `Stop dictation (${E})`;
    case "processing":
      return `Stop processing (${E})`;
    case "error":
      return `Click to reset (${E})`;
  }
}, fe = (e) => {
  switch (e) {
    case "idle":
      return `Start dictation (${E})`;
    case "recording":
      return `Dictation in progress. Click to stop it (${E})`;
    case "processing":
      return `Processing dictation. Click to cancel it (${E})`;
    case "error":
      return `Dictation error. Click to reset (${E})`;
  }
}, T = (e, t, n) => {
  e.dispatchEvent(new CustomEvent(t, {
    detail: n,
    bubbles: !0,
    composed: !0
  }));
}, lt = () => Ye(), ct = () => et(), ut = () => tt(), dt = () => nt();
function pt(e, {
  threshold: t = 500,
  preventScroll: n = !0,
  onShortTap: r,
  onLongPressStart: o,
  onLongPressEnd: i
} = {}) {
  let a, s = !1;
  const c = (d) => d.preventDefault(), l = (d) => {
    a && clearTimeout(a), s = !1, d.preventDefault(), e.setPointerCapture(d.pointerId), a = window.setTimeout(() => {
      s = !0, o?.(d), e.dispatchEvent(new CustomEvent("longpress", {
        detail: d
      }));
    }, t);
  }, u = (d) => {
    a && clearTimeout(a), e.releasePointerCapture(d.pointerId), s ? (i?.(d), e.dispatchEvent(new CustomEvent("longpressend", {
      detail: d
    }))) : (r?.(d), e.dispatchEvent(new CustomEvent("shorttap", {
      detail: d
    })));
  }, f = (d) => {
    a && clearTimeout(a), e.releasePointerCapture(d.pointerId), s = !1;
  }, p = (d) => {
    d.preventDefault(), d.stopPropagation();
  };
  return n && (e.style.touchAction = "none", e.addEventListener("contextmenu", c)), e.addEventListener("pointerdown", l), e.addEventListener("pointerup", u), e.addEventListener("pointercancel", f), e.addEventListener("click", p), () => {
    n && e.removeEventListener("contextmenu", c), e.removeEventListener("pointerdown", l), e.removeEventListener("pointerup", u), e.removeEventListener("pointercancel", f), e.removeEventListener("click", p);
  };
}
function ge(e, t = {}) {
  const { buttonSize: n = 30, verbose: r = !1, customApiEndpoint: o } = t, i = document.querySelectorAll(e);
  for (const a of i) {
    if (a.hasAttribute("data-dictate-button-enabled")) continue;
    const s = a.parentNode;
    if (!a.isConnected || !s) {
      r && console.debug("injectDictateButton: skipping detached field", a);
      continue;
    }
    a.setAttribute("data-dictate-button-enabled", "");
    const c = document.createElement("div");
    c.style.position = "relative";
    const l = getComputedStyle(a), u = l.display === "block";
    c.style.display = u ? "block" : "inline-block", c.style.width = u ? "100%" : "auto", c.style.color = "inherit", c.classList.add("dictate-button-wrapper"), s.insertBefore(c, a), c.appendChild(a), c.style.margin = l.margin, a.style.margin = "0", a.style.boxSizing = "border-box";
    const f = ht(l);
    a.style.paddingRight = `${n + f * 2}px`;
    const p = document.createElement("dictate-button");
    p.size = n, p.style.position = "absolute", p.style.right = "0", p.style.top = gt(
      c,
      l,
      a.tagName,
      n
    ) + "px", p.style.marginRight = p.style.marginLeft = `${f}px`, p.style.marginTop = "0", p.style.marginBottom = "0", o && (p.apiEndpoint = o), p.language = ft(), p.addEventListener("recording:started", (d) => {
      r && console.debug("recording:started", d);
    }), p.addEventListener("recording:stopped", (d) => {
      r && console.debug("recording:stopped", d);
    }), p.addEventListener("recording:failed", (d) => {
      r && console.debug("recording:failed", d), j(a);
    }), p.addEventListener("transcribing:started", (d) => {
      r && console.debug("transcribing:started", d);
    }), p.addEventListener("transcribing:finished", (d) => {
      r && console.debug("transcribing:finished", d);
      const L = d.detail;
      bt(a, L);
    }), p.addEventListener("transcribing:failed", (d) => {
      r && console.debug("transcribing:failed", d), j(a);
    }), c.appendChild(p);
  }
}
function ft() {
  const e = document.documentElement.lang;
  if (e && e.length >= 2)
    try {
      return (Intl?.Locale ? new Intl.Locale(e) : null)?.language ?? e.split(/[-_]/)[0].toLowerCase();
    } catch {
      return e.split(/[-_]/)[0].toLowerCase();
    }
}
function gt(e, t, n, r) {
  if (n.toLowerCase() === "textarea") {
    const i = parseFloat(t.paddingTop || "0");
    return Math.max(4, i);
  }
  const o = Math.round(e.clientHeight / 2 - r / 2);
  return Math.max(4, o);
}
function ht(e) {
  const t = parseFloat(e.paddingRight || "0");
  return Math.max(t, 4);
}
function bt(e, t) {
  const n = typeof t == "string" ? t.trim() : String(t ?? "").trim();
  n.length !== 0 && (vt(e) ? mt(e, n) : yt(e, n), e.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), j(e));
}
function j(e) {
  try {
    e.focus({ preventScroll: !0 });
  } catch {
    e.focus();
  }
}
function vt(e) {
  return e.isContentEditable;
}
function yt(e, t) {
  const n = e.selectionStart ?? 0, r = e.selectionEnd ?? 0, o = n > 0 ? e.value.charAt(n - 1) : "", i = o && !/\s/.test(o), a = r < e.value.length ? e.value.charAt(r) : "", s = a && !/\s/.test(a), c = (i ? " " : "") + t + (s ? " " : ""), l = n + c.length, u = typeof e.scrollTop == "number" ? e.scrollTop : null;
  if (typeof e.setRangeText == "function")
    e.setRangeText(c, n, r, "end");
  else {
    e.value = e.value.substring(0, n) + c + e.value.substring(r);
    try {
      e.selectionStart = l, e.selectionEnd = l;
    } catch {
    }
  }
  u !== null && (e.scrollTop = u);
}
function mt(e, t) {
  const n = window.getSelection();
  if (!(n && n.rangeCount > 0 && e.contains(n.getRangeAt(0).commonAncestorContainer))) {
    j(e);
    const o = document.createRange();
    o.selectNodeContents(e), o.collapse(!1), n?.removeAllRanges(), n?.addRange(o);
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
        const f = i.endContainer;
        i.setEnd(f, f.length);
      } else if (i.endContainer.nodeType === Node.ELEMENT_NODE) {
        const f = i.endContainer;
        f.childNodes.length > i.endOffset && i.setEnd(f, i.endOffset + 1);
      }
      const l = i.toString(), u = l.length > 0 ? l.charAt(0) : "";
      s = u !== "" && !/\s/.test(u);
    } catch (l) {
      console.debug(
        "insertIntoContentEditable: Error checking text after cursor:",
        l
      );
    }
    const c = (a ? " " : "") + t + (s ? " " : "");
    try {
      r.deleteContents();
      const l = document.createTextNode(c);
      r.insertNode(l), r.setStartAfter(l), r.setEndAfter(l), n?.removeAllRanges(), n?.addRange(r);
    } catch (l) {
      console.debug("insertIntoContentEditable: Error inserting text:", l), j(e), e.textContent = (e.textContent || "") + c;
    }
  }
}
function _t(e, t = {}) {
  const { watchDomChanges: n = !1 } = t, r = () => {
    ge(e, t), n && document.body && new MutationObserver(() => {
      ge(e, t);
    }).observe(document.body, { childList: !0, subtree: !0 });
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", r, { once: !0 }) : r();
}
const wt = 30, Ct = !0, xt = !1, Et = [
  "textarea[data-dictate-button-on]:not([data-dictate-button-enabled])",
  'input[type="text"][data-dictate-button-on]:not([data-dictate-button-enabled])',
  'input[type="search"][data-dictate-button-on]:not([data-dictate-button-enabled])',
  "input[data-dictate-button-on]:not([type]):not([data-dictate-button-enabled])",
  "*[contenteditable][data-dictate-button-on]:not([data-dictate-button-enabled])"
].join(",");
_t(Et, {
  buttonSize: wt,
  watchDomChanges: Ct,
  verbose: xt
});
