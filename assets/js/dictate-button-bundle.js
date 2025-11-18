var Se = {}, Ae;
function ht() {
  if (Ae) return Se;
  Ae = 1;
  const l = (e, t) => e === t, m = {
    equals: l
  };
  let g = se;
  const p = 1, x = 2, E = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var c = null;
  let M = null, d = null, u = null, C = null, L = 0;
  function k(e, t) {
    const n = d, o = c, r = e.length === 0, s = t === void 0 ? o : t, a = r ? E : {
      owned: null,
      cleanups: null,
      context: s ? s.context : null,
      owner: s
    }, i = r ? e : () => e(() => J(() => F(a)));
    c = a, d = null;
    try {
      return q(i, !0);
    } finally {
      d = n, c = o;
    }
  }
  function A(e, t) {
    t = t ? Object.assign({}, m, t) : m;
    const n = {
      value: e,
      observers: null,
      observerSlots: null,
      comparator: t.equals || void 0
    }, o = (r) => (typeof r == "function" && (r = r(n.value)), ie(n, r));
    return [re.bind(n), o];
  }
  function B(e, t, n) {
    const o = Q(e, t, !1, p);
    z(o);
  }
  function Le(e, t, n) {
    g = Re;
    const o = Q(e, t, !1, p);
    o.user = !0, C ? C.push(o) : z(o);
  }
  function Oe(e, t, n) {
    n = n ? Object.assign({}, m, n) : m;
    const o = Q(e, t, !0, 0);
    return o.observers = null, o.observerSlots = null, o.comparator = n.equals || void 0, z(o), re.bind(o);
  }
  function J(e) {
    if (d === null) return e();
    const t = d;
    d = null;
    try {
      return e();
    } finally {
      d = t;
    }
  }
  function je(e) {
    return c === null || (c.cleanups === null ? c.cleanups = [e] : c.cleanups.push(e)), e;
  }
  function re() {
    if (this.sources && this.state)
      if (this.state === p) z(this);
      else {
        const e = u;
        u = null, q(() => V(this), !1), u = e;
      }
    if (d) {
      const e = this.observers ? this.observers.length : 0;
      d.sources ? (d.sources.push(this), d.sourceSlots.push(e)) : (d.sources = [this], d.sourceSlots = [e]), this.observers ? (this.observers.push(d), this.observerSlots.push(d.sources.length - 1)) : (this.observers = [d], this.observerSlots = [d.sources.length - 1]);
    }
    return this.value;
  }
  function ie(e, t, n) {
    let o = e.value;
    return (!e.comparator || !e.comparator(o, t)) && (e.value = t, e.observers && e.observers.length && q(() => {
      for (let r = 0; r < e.observers.length; r += 1) {
        const s = e.observers[r], a = M && M.running;
        a && M.disposed.has(s), (a ? !s.tState : !s.state) && (s.pure ? u.push(s) : C.push(s), s.observers && ae(s)), a || (s.state = p);
      }
      if (u.length > 1e6)
        throw u = [], new Error();
    }, !1)), t;
  }
  function z(e) {
    if (!e.fn) return;
    F(e);
    const t = L;
    Me(e, e.value, t);
  }
  function Me(e, t, n) {
    let o;
    const r = c, s = d;
    d = c = e;
    try {
      o = e.fn(t);
    } catch (a) {
      return e.pure && (e.state = p, e.owned && e.owned.forEach(F), e.owned = null), e.updatedAt = n + 1, le(a);
    } finally {
      d = s, c = r;
    }
    (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? ie(e, o) : e.value = o, e.updatedAt = n);
  }
  function Q(e, t, n, o = p, r) {
    const s = {
      fn: e,
      state: o,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: t,
      owner: c,
      context: c ? c.context : null,
      pure: n
    };
    return c === null || c !== E && (c.owned ? c.owned.push(s) : c.owned = [s]), s;
  }
  function Z(e) {
    if (e.state === 0) return;
    if (e.state === x) return V(e);
    if (e.suspense && J(e.suspense.inFallback)) return e.suspense.effects.push(e);
    const t = [e];
    for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < L); )
      e.state && t.push(e);
    for (let n = t.length - 1; n >= 0; n--)
      if (e = t[n], e.state === p)
        z(e);
      else if (e.state === x) {
        const o = u;
        u = null, q(() => V(e, t[0]), !1), u = o;
      }
  }
  function q(e, t) {
    if (u) return e();
    let n = !1;
    t || (u = []), C ? n = !0 : C = [], L++;
    try {
      const o = e();
      return Ne(n), o;
    } catch (o) {
      n || (C = null), u = null, le(o);
    }
  }
  function Ne(e) {
    if (u && (se(u), u = null), e) return;
    const t = C;
    C = null, t.length && q(() => g(t), !1);
  }
  function se(e) {
    for (let t = 0; t < e.length; t++) Z(e[t]);
  }
  function Re(e) {
    let t, n = 0;
    for (t = 0; t < e.length; t++) {
      const o = e[t];
      o.user ? e[n++] = o : Z(o);
    }
    for (t = 0; t < n; t++) Z(e[t]);
  }
  function V(e, t) {
    e.state = 0;
    for (let n = 0; n < e.sources.length; n += 1) {
      const o = e.sources[n];
      if (o.sources) {
        const r = o.state;
        r === p ? o !== t && (!o.updatedAt || o.updatedAt < L) && Z(o) : r === x && V(o, t);
      }
    }
  }
  function ae(e) {
    for (let t = 0; t < e.observers.length; t += 1) {
      const n = e.observers[t];
      n.state || (n.state = x, n.pure ? u.push(n) : C.push(n), n.observers && ae(n));
    }
  }
  function F(e) {
    let t;
    if (e.sources)
      for (; e.sources.length; ) {
        const n = e.sources.pop(), o = e.sourceSlots.pop(), r = n.observers;
        if (r && r.length) {
          const s = r.pop(), a = n.observerSlots.pop();
          o < r.length && (s.sourceSlots[a] = o, r[o] = s, n.observerSlots[o] = a);
        }
      }
    if (e.tOwned) {
      for (t = e.tOwned.length - 1; t >= 0; t--) F(e.tOwned[t]);
      delete e.tOwned;
    }
    if (e.owned) {
      for (t = e.owned.length - 1; t >= 0; t--) F(e.owned[t]);
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
  function le(e, t = c) {
    throw $e(e);
  }
  function W(e, t) {
    return J(() => e(t || {}));
  }
  const X = (e) => Oe(() => e());
  function Be(e, t, n) {
    let o = n.length, r = t.length, s = o, a = 0, i = 0, f = t[r - 1].nextSibling, h = null;
    for (; a < r || i < s; ) {
      if (t[a] === n[i]) {
        a++, i++;
        continue;
      }
      for (; t[r - 1] === n[s - 1]; )
        r--, s--;
      if (r === a) {
        const b = s < o ? i ? n[i - 1].nextSibling : n[s - i] : f;
        for (; i < s; ) e.insertBefore(n[i++], b);
      } else if (s === i)
        for (; a < r; )
          (!h || !h.has(t[a])) && t[a].remove(), a++;
      else if (t[a] === n[s - 1] && n[i] === t[r - 1]) {
        const b = t[--r].nextSibling;
        e.insertBefore(n[i++], t[a++].nextSibling), e.insertBefore(n[--s], b), t[r] = n[s];
      } else {
        if (!h) {
          h = /* @__PURE__ */ new Map();
          let T = i;
          for (; T < s; ) h.set(n[T], T++);
        }
        const b = h.get(t[a]);
        if (b != null)
          if (i < b && b < s) {
            let T = a, j = 1, _;
            for (; ++T < r && T < s && !((_ = h.get(t[T])) == null || _ !== b + j); )
              j++;
            if (j > b - i) {
              const ne = t[a];
              for (; i < b; ) e.insertBefore(n[i++], ne);
            } else e.replaceChild(n[i++], t[a++]);
          } else a++;
        else t[a++].remove();
      }
    }
  }
  function I(e, t, n, o) {
    let r;
    const s = () => {
      const i = document.createElement("template");
      return i.innerHTML = e, i.content.firstChild;
    }, a = () => (r || (r = s())).cloneNode(!0);
    return a.cloneNode = a, a;
  }
  function H(e, t, n) {
    n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
  }
  function Pe(e, t, n) {
    if (!t) return n ? H(e, "style") : t;
    const o = e.style;
    if (typeof t == "string") return o.cssText = t;
    typeof n == "string" && (o.cssText = n = void 0), n || (n = {}), t || (t = {});
    let r, s;
    for (s in n)
      t[s] == null && o.removeProperty(s), delete n[s];
    for (s in t)
      r = t[s], r !== n[s] && (o.setProperty(s, r), n[s] = r);
    return n;
  }
  function De(e, t, n) {
    return J(() => e(t, n));
  }
  function $(e, t, n, o) {
    if (n !== void 0 && !o && (o = []), typeof t != "function") return G(e, t, o, n);
    B((r) => G(e, t(), r, n), o);
  }
  function G(e, t, n, o, r) {
    for (; typeof n == "function"; ) n = n();
    if (t === n) return n;
    const s = typeof t, a = o !== void 0;
    if (e = a && n[0] && n[0].parentNode || e, s === "string" || s === "number") {
      if (s === "number" && (t = t.toString(), t === n))
        return n;
      if (a) {
        let i = n[0];
        i && i.nodeType === 3 ? i.data !== t && (i.data = t) : i = document.createTextNode(t), n = P(e, n, o, i);
      } else
        n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
    } else if (t == null || s === "boolean")
      n = P(e, n, o);
    else {
      if (s === "function")
        return B(() => {
          let i = t();
          for (; typeof i == "function"; ) i = i();
          n = G(e, i, n, o);
        }), () => n;
      if (Array.isArray(t)) {
        const i = [], f = n && Array.isArray(n);
        if (Y(i, t, n, r))
          return B(() => n = G(e, i, n, o, !0)), () => n;
        if (i.length === 0) {
          if (n = P(e, n, o), a) return n;
        } else f ? n.length === 0 ? ce(e, i, o) : Be(e, n, i) : (n && P(e), ce(e, i));
        n = i;
      } else if (t.nodeType) {
        if (Array.isArray(n)) {
          if (a) return n = P(e, n, o, t);
          P(e, n, null, t);
        } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
        n = t;
      }
    }
    return n;
  }
  function Y(e, t, n, o) {
    let r = !1;
    for (let s = 0, a = t.length; s < a; s++) {
      let i = t[s], f = n && n[e.length], h;
      if (!(i == null || i === !0 || i === !1)) if ((h = typeof i) == "object" && i.nodeType)
        e.push(i);
      else if (Array.isArray(i))
        r = Y(e, i, f) || r;
      else if (h === "function")
        if (o) {
          for (; typeof i == "function"; ) i = i();
          r = Y(e, Array.isArray(i) ? i : [i], Array.isArray(f) ? f : [f]) || r;
        } else
          e.push(i), r = !0;
      else {
        const b = String(i);
        f && f.nodeType === 3 && f.data === b ? e.push(f) : e.push(document.createTextNode(b));
      }
    }
    return r;
  }
  function ce(e, t, n = null) {
    for (let o = 0, r = t.length; o < r; o++) e.insertBefore(t[o], n);
  }
  function P(e, t, n, o) {
    if (n === void 0) return e.textContent = "";
    const r = o || document.createTextNode("");
    if (t.length) {
      let s = !1;
      for (let a = t.length - 1; a >= 0; a--) {
        const i = t[a];
        if (r !== i) {
          const f = i.parentNode === e;
          !s && !a ? f ? e.replaceChild(r, i) : e.insertBefore(r, n) : f && i.remove();
        } else s = !0;
      }
    } else e.insertBefore(r, n);
    return [r];
  }
  function ze(e) {
    return Object.keys(e).reduce((t, n) => {
      const o = e[n];
      return t[n] = Object.assign({}, o), pe(o.value) && !Ue(o.value) && !Array.isArray(o.value) && (t[n].value = Object.assign({}, o.value)), Array.isArray(o.value) && (t[n].value = o.value.slice(0)), t;
    }, {});
  }
  function qe(e) {
    return e ? Object.keys(e).reduce((t, n) => {
      const o = e[n];
      return t[n] = pe(o) && "value" in o ? o : {
        value: o
      }, t[n].attribute || (t[n].attribute = He(n)), t[n].parse = "parse" in t[n] ? t[n].parse : typeof t[n].value != "string", t;
    }, {}) : {};
  }
  function Fe(e) {
    return Object.keys(e).reduce((t, n) => (t[n] = e[n].value, t), {});
  }
  function Ie(e, t) {
    const n = ze(t);
    return Object.keys(t).forEach((o) => {
      const r = n[o], s = e.getAttribute(r.attribute), a = e[o];
      s != null && (r.value = r.parse ? ue(s) : s), a != null && (r.value = Array.isArray(a) ? a.slice(0) : a), r.reflect && de(e, r.attribute, r.value, !!r.parse), Object.defineProperty(e, o, {
        get() {
          return r.value;
        },
        set(i) {
          const f = r.value;
          r.value = i, r.reflect && de(this, r.attribute, r.value, !!r.parse);
          for (let h = 0, b = this.__propertyChangedCallbacks.length; h < b; h++)
            this.__propertyChangedCallbacks[h](o, i, f);
        },
        enumerable: !0,
        configurable: !0
      });
    }), n;
  }
  function ue(e) {
    if (e)
      try {
        return JSON.parse(e);
      } catch {
        return e;
      }
  }
  function de(e, t, n, o) {
    if (n == null || n === !1) return e.removeAttribute(t);
    let r = o ? JSON.stringify(n) : n;
    e.__updating[t] = !0, r === "true" && (r = ""), e.setAttribute(t, r), Promise.resolve().then(() => delete e.__updating[t]);
  }
  function He(e) {
    return e.replace(/\.?([A-Z]+)/g, (t, n) => "-" + n.toLowerCase()).replace("_", "-").replace(/^-/, "");
  }
  function pe(e) {
    return e != null && (typeof e == "object" || typeof e == "function");
  }
  function Ue(e) {
    return Object.prototype.toString.call(e) === "[object Function]";
  }
  function Je(e) {
    return typeof e == "function" && e.toString().indexOf("class") === 0;
  }
  let ee;
  function Ze(e, t) {
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
        this.__releaseCallbacks = [], this.__propertyChangedCallbacks = [], this.__updating = {}, this.props = Ie(this, t);
        const o = Fe(this.props), r = this.Component, s = ee;
        try {
          ee = this, this.__initialized = !0, Je(r) ? new r(o, {
            element: this
          }) : r(o, {
            element: this
          });
        } finally {
          ee = s;
        }
      }
      async disconnectedCallback() {
        if (await Promise.resolve(), this.isConnected) return;
        this.__propertyChangedCallbacks.length = 0;
        let o = null;
        for (; o = this.__releaseCallbacks.pop(); ) o(this);
        delete this.__initialized, this.__released = !0;
      }
      attributeChangedCallback(o, r, s) {
        if (this.__initialized && !this.__updating[o] && (o = this.lookupProp(o), o in t)) {
          if (s == null && !this[o]) return;
          this[o] = t[o].parse ? ue(s) : s;
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
  function Ve(e, t = {}, n = {}) {
    const {
      BaseElement: o = HTMLElement,
      extension: r,
      customElements: s = window.customElements
    } = n;
    return (a) => {
      let i = s.get(e);
      return i ? (i.prototype.Component = a, i) : (i = Ze(o, qe(t)), i.prototype.Component = a, i.prototype.registeredTag = e, s.define(e, i, r), i);
    };
  }
  function We(e) {
    const t = Object.keys(e), n = {};
    for (let o = 0; o < t.length; o++) {
      const [r, s] = A(e[t[o]]);
      Object.defineProperty(n, t[o], {
        get: r,
        set(a) {
          s(() => a);
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
      const { element: o } = n;
      return k((r) => {
        const s = We(t);
        o.addPropertyChangedCallback((i, f) => s[i] = f), o.addReleaseCallback(() => {
          o.renderRoot.textContent = "", r();
        });
        const a = e(s, n);
        return $(o.renderRoot, a);
      }, Xe(o));
    };
  }
  function Ke(e, t, n) {
    return arguments.length === 2 && (n = t, t = {}), Ve(e, t)(Ge(n));
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
  var Ye = /* @__PURE__ */ I('<div part=container class=dictate-button__container><style></style><div aria-live=polite class=dictate-button__status-announcer style="position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0"></div><button part=button class=dictate-button__button>'), et = /* @__PURE__ */ I('<svg part=icon class="dictate-button__icon dictate-button__icon--idle"fill=none viewBox="0 0 24 24"stroke-width=1.5 stroke=currentColor role=img aria-hidden=true><path stroke-linecap=round stroke-linejoin=round d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z">'), tt = /* @__PURE__ */ I('<svg part=icon class="dictate-button__icon dictate-button__icon--recording"viewBox="0 0 24 24"fill=currentColor role=img aria-hidden=true><circle cx=12 cy=12 r=10>'), nt = /* @__PURE__ */ I('<svg part=icon class="dictate-button__icon dictate-button__icon--processing"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=1.5 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9">'), ot = /* @__PURE__ */ I('<svg part=icon class="dictate-button__icon dictate-button__icon--error"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=4 stroke-linecap=round stroke-linejoin=round role=img aria-hidden=true><line x1=12 x2=12 y1=4 y2=14></line><line x1=12 x2=12.01 y1=20 y2=20>');
  console.debug("dictate-button version:", "1.9.0");
  const rt = "https://api.dictate-button.io/transcribe", R = "dictate-button.io", te = -70, fe = -10, ge = 0, it = 4, st = 0.25, at = 0.05;
  customElements.get("dictate-button") ? console.debug("dictate-button: We don't require importing the dictate-button component separately anymore, so you may remove the script tag which imports https://cdn.dictate-button.io/dictate-button.js from the HTML head.") : Ke("dictate-button", {
    size: 30,
    apiEndpoint: rt,
    language: void 0
  }, (e, {
    element: t
  }) => {
    console.debug("api", e.apiEndpoint);
    const [n, o] = A("idle");
    let r = null, s = null, a = [], i = null, f = null, h = null, b = null, T = !1, j = 0;
    const _ = (y) => y <= te ? 0 : y >= fe ? 1 : (y - te) / (fe - te), ne = (y) => {
      let S = 0;
      for (let O = 0; O < y.length; O++) {
        const v = (y[O] - 128) / 128;
        S += v * v;
      }
      return Math.sqrt(S / y.length);
    }, gt = (y) => 20 * Math.log10(Math.max(y, 1e-8)), be = (y) => {
      const S = t.shadowRoot.querySelector(".dictate-button__button");
      if (!S)
        return;
      const O = ge + y * (it - ge), v = 0 + y * 0.4;
      S.style.boxShadow = `0 0 0 ${O}px light-dark(rgba(0, 0, 0, ${v}), rgba(255, 255, 255, ${v}))`;
    }, ve = () => {
      if (!T || !h || !b) return;
      h.getByteTimeDomainData(b);
      const y = ne(b), S = gt(y), O = _(S), v = O > j ? st : at;
      j = v * O + (1 - v) * j, be(j), requestAnimationFrame(ve);
    }, ye = () => {
      r && r.state !== "inactive" && r.stop(), s && (s.getTracks().forEach((y) => y.stop()), s = null), a = [], i = null, T = !1, f && f.state !== "closed" && f.close(), f = null, h = null, b = null, j = 0, be(0);
    };
    t.addEventListener("disconnected", ye);
    const me = async (y) => {
      if (n() === "idle") {
        i = y;
        try {
          const S = await navigator.mediaDevices.getUserMedia({
            audio: !0
          });
          s = S, f = new (window.AudioContext || window.webkitAudioContext)();
          const O = f.createMediaStreamSource(S);
          h = f.createAnalyser(), h.fftSize = 2048, O.connect(h), b = new Uint8Array(h.fftSize), r = new MediaRecorder(S, {
            mimeType: "audio/webm"
          }), a = [], r.ondataavailable = (v) => {
            a.push(v.data);
          }, r.onstop = async () => {
            T = !1, o("processing"), D(t, "transcribing:started", "Started transcribing");
            const v = new Blob(a, {
              type: "audio/webm"
            });
            try {
              const N = new FormData();
              N.append("audio", v, "recording.webm"), N.append("origin", window?.location?.origin), e.language && N.append("language", e.language);
              const w = await fetch(e.apiEndpoint, {
                method: "POST",
                body: N
              });
              if (!w.ok) throw new Error("Failed to transcribe audio");
              const oe = await w.json();
              if (n() !== "processing") return;
              D(t, "transcribing:finished", oe.text), o("idle");
            } catch (N) {
              console.error("Failed to transcribe audio:", N), D(t, "transcribing:failed", "Failed to transcribe audio"), we();
            }
          }, r.start(), D(t, "recording:started", "Started recording"), T = !0, ve(), o("recording");
        } catch (S) {
          console.error("Failed to start recording:", S), D(t, "recording:failed", "Failed to start recording"), we();
        }
      }
    }, _e = () => {
      n() === "recording" && (D(t, "recording:stopped", "Stopped recording"), o("idle"), ye());
    }, we = () => {
      o("error"), setTimeout(() => o("idle"), 2e3);
    };
    let K;
    return Le(() => {
      if (!K) return;
      const y = ft(K, {
        onShortTap: () => {
          n() === "idle" ? me("short-tap") : n() === "recording" && i === "short-tap" && _e();
        },
        onLongPressStart: () => {
          n() === "idle" && me("long-press");
        },
        onLongPressEnd: () => {
          n() === "recording" && i === "long-press" && _e();
        }
      });
      je(y);
    }), (() => {
      var y = Ye(), S = y.firstChild, O = S.nextSibling, v = O.nextSibling;
      $(S, Qe), $(O, () => he(n()));
      var N = K;
      return typeof N == "function" ? De(N, v) : K = v, $(v, (() => {
        var w = X(() => n() === "idle");
        return () => w() && W(ct, {});
      })(), null), $(v, (() => {
        var w = X(() => n() === "recording");
        return () => w() && W(ut, {});
      })(), null), $(v, (() => {
        var w = X(() => n() === "processing");
        return () => w() && W(dt, {});
      })(), null), $(v, (() => {
        var w = X(() => n() === "error");
        return () => w() && W(pt, {});
      })(), null), B((w) => {
        var oe = `width:${e.size}px;height:${e.size}px"`, Ce = lt(n()), xe = he(n()), Ee = n() === "recording", ke = n() === "processing";
        return w.e = Pe(v, oe, w.e), Ce !== w.t && H(v, "title", w.t = Ce), xe !== w.a && H(v, "aria-label", w.a = xe), Ee !== w.o && H(v, "aria-pressed", w.o = Ee), ke !== w.i && H(v, "aria-busy", w.i = ke), w;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), y;
    })();
  });
  const lt = (e) => {
    switch (e) {
      case "idle":
        return `Start dictation (${R})`;
      case "recording":
        return `Stop dictation (${R})`;
      case "processing":
        return `Stop processing (${R})`;
      case "error":
        return `Click to reset (${R})`;
    }
  }, he = (e) => {
    switch (e) {
      case "idle":
        return `Start dictation (${R})`;
      case "recording":
        return `Dictation in progress. Click to stop it (${R})`;
      case "processing":
        return `Processing dictation. Click to cancel it (${R})`;
      case "error":
        return `Dictation error. Click to reset (${R})`;
    }
  }, D = (e, t, n) => {
    e.dispatchEvent(new CustomEvent(t, {
      detail: n,
      bubbles: !0,
      composed: !0
    }));
  }, ct = () => et(), ut = () => tt(), dt = () => nt(), pt = () => ot();
  function ft(e, {
    threshold: t = 500,
    preventScroll: n = !0,
    onShortTap: o,
    onLongPressStart: r,
    onLongPressEnd: s
  } = {}) {
    let a, i = !1;
    const f = (_) => _.preventDefault(), h = (_) => {
      a && clearTimeout(a), i = !1, _.preventDefault(), e.setPointerCapture(_.pointerId), a = window.setTimeout(() => {
        i = !0, r?.(_), e.dispatchEvent(new CustomEvent("longpress", {
          detail: _
        }));
      }, t);
    }, b = (_) => {
      a && clearTimeout(a), e.releasePointerCapture(_.pointerId), i ? (s?.(_), e.dispatchEvent(new CustomEvent("longpressend", {
        detail: _
      }))) : (o?.(_), e.dispatchEvent(new CustomEvent("shorttap", {
        detail: _
      })));
    }, T = (_) => {
      a && clearTimeout(a), e.releasePointerCapture(_.pointerId), i = !1;
    }, j = (_) => {
      _.preventDefault(), _.stopPropagation();
    };
    return n && (e.style.touchAction = "none", e.addEventListener("contextmenu", f)), e.addEventListener("pointerdown", h), e.addEventListener("pointerup", b), e.addEventListener("pointercancel", T), e.addEventListener("click", j), () => {
      n && e.removeEventListener("contextmenu", f), e.removeEventListener("pointerdown", h), e.removeEventListener("pointerup", b), e.removeEventListener("pointercancel", T), e.removeEventListener("click", j);
    };
  }
  return Se;
}
ht();
function Te(l, m = {}) {
  const { buttonSize: g = 30, verbose: p = !1, customApiEndpoint: x } = m, E = document.querySelectorAll(l);
  for (const c of E) {
    if (c.hasAttribute("data-dictate-button-enabled")) continue;
    const M = c.parentNode;
    if (!c.isConnected || !M) {
      p && console.debug("injectDictateButton: skipping detached field", c);
      continue;
    }
    c.setAttribute("data-dictate-button-enabled", "");
    const d = document.createElement("div");
    d.style.position = "relative";
    const u = getComputedStyle(c), C = u.display === "block";
    d.style.display = C ? "block" : "inline-block", d.style.width = C ? "100%" : "auto", d.style.color = "inherit", d.classList.add("dictate-button-wrapper"), M.insertBefore(d, c), d.appendChild(c), d.style.margin = u.margin, c.style.margin = "0", c.style.boxSizing = "border-box";
    const L = yt(u);
    c.style.paddingRight = `${g + L * 2}px`;
    const k = document.createElement("dictate-button");
    k.size = g, k.style.position = "absolute", k.style.right = "0", k.style.top = vt(
      d,
      u,
      c.tagName,
      g
    ) + "px", k.style.marginRight = k.style.marginLeft = `${L}px`, k.style.marginTop = "0", k.style.marginBottom = "0", x && (k.apiEndpoint = x), k.language = bt(), k.addEventListener("recording:started", (A) => {
      p && console.debug("recording:started", A);
    }), k.addEventListener("recording:stopped", (A) => {
      p && console.debug("recording:stopped", A);
    }), k.addEventListener("recording:failed", (A) => {
      p && console.debug("recording:failed", A), U(c);
    }), k.addEventListener("transcribing:started", (A) => {
      p && console.debug("transcribing:started", A);
    }), k.addEventListener("transcribing:finished", (A) => {
      p && console.debug("transcribing:finished", A);
      const B = A.detail;
      mt(c, B);
    }), k.addEventListener("transcribing:failed", (A) => {
      p && console.debug("transcribing:failed", A), U(c);
    }), d.appendChild(k);
  }
}
function bt() {
  const l = document.documentElement.lang;
  if (l && l.length >= 2)
    try {
      return (Intl?.Locale ? new Intl.Locale(l) : null)?.language ?? l.split(/[-_]/)[0].toLowerCase();
    } catch {
      return l.split(/[-_]/)[0].toLowerCase();
    }
}
function vt(l, m, g, p) {
  if (g.toLowerCase() === "textarea") {
    const E = parseFloat(m.paddingTop || "0");
    return Math.max(4, E);
  }
  const x = Math.round(l.clientHeight / 2 - p / 2);
  return Math.max(4, x);
}
function yt(l) {
  const m = parseFloat(l.paddingRight || "0");
  return Math.max(m, 4);
}
function mt(l, m) {
  const g = typeof m == "string" ? m.trim() : String(m ?? "").trim();
  g.length !== 0 && (_t(l) ? Ct(l, g) : wt(l, g), l.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), U(l));
}
function U(l) {
  try {
    l.focus({ preventScroll: !0 });
  } catch {
    l.focus();
  }
}
function _t(l) {
  return l.isContentEditable;
}
function wt(l, m) {
  const g = l.selectionStart ?? 0, p = l.selectionEnd ?? 0, x = g > 0 ? l.value.charAt(g - 1) : "", E = x && !/\s/.test(x), c = p < l.value.length ? l.value.charAt(p) : "", M = c && !/\s/.test(c), d = (E ? " " : "") + m + (M ? " " : ""), u = g + d.length, C = typeof l.scrollTop == "number" ? l.scrollTop : null;
  if (typeof l.setRangeText == "function")
    l.setRangeText(d, g, p, "end");
  else {
    l.value = l.value.substring(0, g) + d + l.value.substring(p);
    try {
      l.selectionStart = u, l.selectionEnd = u;
    } catch {
    }
  }
  C !== null && (l.scrollTop = C);
}
function Ct(l, m) {
  const g = window.getSelection();
  if (!(g && g.rangeCount > 0 && l.contains(g.getRangeAt(0).commonAncestorContainer))) {
    U(l);
    const x = document.createRange();
    x.selectNodeContents(l), x.collapse(!1), g?.removeAllRanges(), g?.addRange(x);
  }
  const p = g?.getRangeAt(0);
  if (p) {
    const x = p.cloneRange(), E = p.cloneRange();
    let c = !1;
    x.collapse(!0);
    try {
      x.setStart(p.startContainer, 0);
      const u = x.toString(), C = u.length > 0 ? u.charAt(u.length - 1) : "";
      c = C !== "" && !/\s/.test(C);
    } catch (u) {
      console.debug(
        "insertIntoContentEditable: Error checking text before cursor:",
        u
      );
    }
    let M = !1;
    E.collapse(!1);
    try {
      if (E.endContainer.nodeType === Node.TEXT_NODE) {
        const L = E.endContainer;
        E.setEnd(L, L.length);
      } else if (E.endContainer.nodeType === Node.ELEMENT_NODE) {
        const L = E.endContainer;
        L.childNodes.length > E.endOffset && E.setEnd(L, E.endOffset + 1);
      }
      const u = E.toString(), C = u.length > 0 ? u.charAt(0) : "";
      M = C !== "" && !/\s/.test(C);
    } catch (u) {
      console.debug(
        "insertIntoContentEditable: Error checking text after cursor:",
        u
      );
    }
    const d = (c ? " " : "") + m + (M ? " " : "");
    try {
      p.deleteContents();
      const u = document.createTextNode(d);
      p.insertNode(u), p.setStartAfter(u), p.setEndAfter(u), g?.removeAllRanges(), g?.addRange(p);
    } catch (u) {
      console.debug("insertIntoContentEditable: Error inserting text:", u), U(l), l.textContent = (l.textContent || "") + d;
    }
  }
}
function xt(l, m = {}) {
  const { watchDomChanges: g = !1 } = m, p = () => {
    Te(l, m), g && document.body && new MutationObserver(() => {
      Te(l, m);
    }).observe(document.body, { childList: !0, subtree: !0 });
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", p, { once: !0 }) : p();
}
const Et = 30, kt = !0, St = !1, At = [
  "textarea[data-dictate-button-on]:not([data-dictate-button-enabled])",
  'input[type="text"][data-dictate-button-on]:not([data-dictate-button-enabled])',
  'input[type="search"][data-dictate-button-on]:not([data-dictate-button-enabled])',
  "input[data-dictate-button-on]:not([type]):not([data-dictate-button-enabled])",
  "*[contenteditable][data-dictate-button-on]:not([data-dictate-button-enabled])"
].join(",");
xt(At, {
  buttonSize: Et,
  watchDomChanges: kt,
  verbose: St
});
