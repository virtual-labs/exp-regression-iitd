"use strict";
var _Mathsign = Math.sign,
    _MathPI = Math.PI,
    _NumberisInteger = Number.isInteger,
    _Mathabs = Math.abs,
    _Mathexp = Math.exp,
    _Mathlog = Math.log,
    _Mathsqrt = Math.sqrt,
    _Mathpow = Math.pow,
    _Mathround = Math.round,
    _Mathfloor = Math.floor,
    Statistics = function(o, l, u = {}) {
        (this.data = void 0),
        (this.columns = void 0),
        (this.valueMaps = void 0),
        (this.storedResults = void 0),
        (this.lastUpdated = void 0),
        (this.validScales = ["nominal", "ordinal", "interval", "metric"]),
        (this.zTable = void 0),
        (this.factorials = [
            1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800,
            479001600, 6227020800, 87178291200, 1307674368000, 20922789888000,
            355687428096000, 6402373705728000, 121645100408832000,
            2432902008176640000, 5109094217170944000,
        ]),
        (this.defaultOptions = {
            epsilon: 1e-5,
            excludeColumns: ["ID", "id"],
            incompleteBetaIterations: 40,
            incompleteGammaIterations: 80,
            maxBarnardsN: 200,
            spougeConstant: 40,
            suppressWarnings: !1,
            zTableIterations: 25,
        }),
        (this.init = function(M, S, T = {}) {
            for (var C in ("undefined" == typeof M &&
                    this.errorMessage("No data was supplied."),
                    this.defaultOptions)) {
                var N =
                    "object" == typeof T &&
                    this.has(T, C) &&
                    this.has(this.defaultOptions, C) ?
                    T[C] :
                    this.defaultOptions[C];
                Object.defineProperty(this, C, { value: N, writable: !1 });
            }
            return "undefined" != typeof M && this.updateData(M, S), this;
        }),
        (this.updateData = function(M, S) {
            this.addData(M),
                "object" == typeof S && this.assignValueMap(S),
                M.constructor === Array &&
                "object" != typeof S &&
                (this.errorMessage(
                        "It is strongly encouraged to initalise statistics.js with a variable table that defines the scale of measurement of each variable (e.g. nominal, metric.). All variables will be assumed as nominal and subsequent analyses will likely be flawed."
                    ),
                    g.apply(this));
        }),
        (this.addData = function(M) {
            try {
                let S = typeof M;
                if (("string" != S && "object" != S) || null === M)
                    throw (
                        "Input variable data is neither an object nor a JSON encoded string. The variable type is " +
                        S +
                        ". The data could not be properly imported."
                    );
                return (
                    "string" == S && (M = JSON.parse(M)),
                    (this.data = this.data ? this.data.concat(M) : M),
                    (this.lastUpdated = Date.now()), !0
                );
            } catch (S) {
                return this.errorMessage(S);
            }
        }),
        (this.addRow = function(M) {
            if ("undefined" == typeof M)
                return this.errorMessage("Add Row: No data was given.");
            let S = "undefined" == typeof this.data ? [] : this.data;
            return S.push(M), (this.data = S), (this.lastUpdated = Date.now()), !0;
        }),
        (this.removeRow = function(M, S = !1) {
            if ("undefined" == typeof M)
                return this.errorMessage("Remove row: No index was given.");
            let T = this.data,
                C = this.has(this.columns, "id") || this.has(this.columns, "ID");
            if (S && C) {
                let N = -1,
                    I = 0;
                for (; - 1 == N && I < T.length;)
                    ((this.has(T[I], "id") && T[I].id === S) ||
                        (this.has(T[I], "ID") && T[I].ID === S)) &&
                    (N = I);
                T.splice(I, 1);
            } else {
                if (
                    (S &&
                        !C &&
                        this.errorMessage(
                            'Remove row: There is no column "id" or "ID". The index ' +
                            M +
                            " will be treated as the number of the row, starting at 0."
                        ),
                        M > T.length - 1)
                )
                    return this.errorMessage(
                        "Remove row: The stored data has only " +
                        T.length +
                        " rows and index " +
                        M +
                        " is too large. Indexes start at 0."
                    );
                T.splice(M, 1);
            }
            return (this.data = T), (this.lastUpdated = Date.now()), !0;
        }),
        (this.reset = function() {
            try {
                return (
                    (this.data = void 0),
                    (this.storedResults = void 0),
                    (this.lastUpdated = Date.now()), !0
                );
            } catch (M) {
                this.errorMessage(M.message);
            }
        }),
        (this.assignValueMap = function(M) {
            let S = {},
                T = {};
            for (var C in M) {
                if (!this.has(M, C) || -1 < this.excludeColumns.indexOf(C)) continue;
                let V,
                    N = M[C],
                    I = N;
                if (
                    ("object" == typeof N &&
                        this.has(N, "scale") &&
                        (this.has(N, "valueMap") && (V = N.valueMap), (I = N.scale)),
                        "undefined" == typeof V &&
                        ("nominal" === I || "ordinal" === I) &&
                        (V = this.getUniqueValues(
                            this.data.map((D) => {
                                return D[C];
                            })
                        )),
                        "undefined" != typeof V && (T[C] = V), -1 < this.validScales.indexOf(I))
                )
                    S[C] = I;
                else {
                    S[C] = "nominal";
                    let D =
                        '"' +
                        I +
                        '" scale for variable "' +
                        C +
                        '" is invalid. It was assumed as nominal. Valid scales of measurement include: ' +
                        this.validScales.join(", ");
                    this.errorMessage(D);
                }
            }
            (this.columns = S), (this.valueMaps = T), this.sanitizeColumns();
        });
        var g = function() {
            let M = {},
                S = ["th", "st", "nd", "rd"];
            for (var T = 0; T < this.data.length; T++)
                if ("object" != typeof this.data[T]) {
                    let N = T % 100,
                        I = T + (S[(N - 20) % 10] || S[N] || S[0]);
                    this.errorMessage(
                        "The " + I + " row was ignored because it is not an object."
                    );
                } else
                    for (var C in Object.keys(this.data[T]))
                        !C in M && (M[C] = "nominal");
                (this.columns = M), (this.lastUpdated = Date.now());
        };
        (this.sanitizeColumns = function() {
            let M = this.columns,
                S = this.data;
            for (var T = 0; T < S.length; T++) {
                let N = S[T];
                for (var C in M) {
                    let I = N[C],
                        V = I;
                    switch (M[C]) {
                        case "metric":
                            V = this.isNumeric(I) ? I : NaN;
                            break;
                        case "interval":
                            V = this.isNumeric(I) ? I : NaN;
                            break;
                        case "ordinal":
                            if ("undefined" != typeof this.valueMaps) {
                                let D = this.valueMaps[C];
                                "undefined" != typeof D && (V = D.indexOf(I));
                            }
                            break;
                        default:
                    }
                    S[T][C] = V;
                }
            }
            (this.data = S), (this.lastUpdated = Date.now());
        }),
        (this.setScale = function(M, S) {
            return "undefined" == typeof S ?
                (this.errorMessage(
                    "This method needs to be called with valid values for both the variable and the scale of measurement to set."
                ), !1) :
                this.has(this.columns, M) ?
                -1 === this.validScales.indexOf(S) ?
                (this.errorMessage(
                    '"' +
                    S +
                    '" is not a valid scale of measurement. Valid scales include: ' +
                    this.validScales.join(", ")
                ), !1) :
                ((this.columns[M] = S), !0) :
                (this.errorMessage('There is no variable "' + M + '" defined.'), !1);
        }),
        (this.getScale = function(M) {
            if ("undefined" != typeof M && this.has(this.columns, M))
                return this.columns[M];
        }),
        (this.getValueMap = function(M) {
            if ("undefined" != typeof M && this.has(this.columns, M))
                return this.valueMaps[M];
        }),
        (this.applyValueMap = function(M, S) {
            let T = this.getValueMap(M);
            if ("ordinal" === this.getScale(M) && "undefined" != typeof T)
                return (
                    "undefined" === S && (S = this.getColumn(M)),
                    S.map((C) => {
                        return T[C];
                    })
                );
        }),
        (this.checkLastUpdated = function(M, S) {
            return (
                "" !== M &&
                this.has(this.columns, M) &&
                "undefined" != typeof M &&
                "undefined" != typeof S &&
                ("undefined" == typeof this.storedResults ||
                    "undefined" == typeof this.storedResults[M] ||
                    "undefined" == typeof this.storedResults[M][S] ||
                    "undefined" == typeof this.storedResults[M][S].lastUpdated ||
                    this.storedResults[M][S].lastUpdated < this.lastUpdated)
            );
        }),
        (this.updateStatistics = function(M, S, T) {
            if (
                "undefined" != typeof M &&
                "undefined" != typeof S &&
                "undefined" != typeof T
            ) {
                var C = { value: T, lastUpdated: Date.now() };
                "undefined" == typeof this.storedResults ?
                    (this.storedResults = { column: { parameter: C } }) :
                    "undefined" == typeof this.storedResults[M] ?
                    (this.storedResults[M] = { parameter: C }) :
                    (this.storedResults[M][S] = C);
            }
        }),
        (this.getStatistics = function(M, S) {
            return "undefined" != typeof M &&
                "undefined" != typeof S &&
                this.has(this.columns, M) &&
                "undefined" != typeof this.storedResults[M][S].value ?
                this.storedResults[M][S].value :
                void 0;
        }),
        (this.getColumn = function(M) {
            return "undefined" == typeof M ?
                this.errorMessage("Get column: No column to sort was specified.") :
                this.has(this.columns, M) ?
                this.data.map((S) => {
                    return S[M];
                }) :
                this.errorMessage(
                    'Get column: The column "' + M + '" was not found.'
                );
        }),
        (this.sortColumn = function(M, S = "asc") {
            return "undefined" == typeof M ?
                this.errorMessage("Sort column: No column to sort was specified.") :
                this.has(this.columns, M) ?
                this.sort(this.getColumn(M), S) :
                this.errorMessage(
                    'Sort column: The column "' + M + '" was not found.'
                );
        }),
        (this.sortDataByColumn = function(
            M, { data: S = this.data, order: T = "asc", changeOriginal: C = !1 } = {}
        ) {
            return S !== this.data ||
                ("undefined" != typeof M && this.has(this.columns, M)) ?
                S === this.data || this.has(S[0], M) ?
                (function(N, I, V, D) {
                    return I.sort(function(F, P) {
                        return D.isNumeric(F[N]) && D.isNumeric(P[N]) ?
                            ("asc" === V ? 1 : -1) * (F[N] - P[N]) :
                            0;
                    });
                })(M, C ? S : this.deepCopy(S), T, this) :
                this.errorMessage(
                    'Sort data by column: The column "' + M + '" does not exist.'
                ) :
                this.errorMessage(
                    "Sort data by column: No column was specified or this column does not exist."
                );
        }),
        (this.sort = function(M, S = "asc") {
            return "undefined" == typeof M ?
                this.errorMessage("Sort: No values given.") :
                M.constructor !== Array || 0 === M.length ?
                this.errorMessage(
                    "Sort: No array or an empty array of values was given."
                ) :
                (function(T, C, N) {
                    return T.sort((I, V) => {
                        return C.isNumeric(I) && C.isNumeric(V) ?
                            ("asc" === N ? 1 : -1) * (I - V) :
                            0;
                    });
                })(this.deepCopy(M), this, S);
        }),
        (this.getUniqueValues = function(M) {
            if ("undefined" == typeof M)
                return this.errorMessage("Get unique values: No values given.");
            let S = this.validateInput(M, "nominal", "get unique values");
            return !1 === S ?
                void 0 :
                this.sort(
                    S.data.filter((T, C) => {
                        return S.data.indexOf(T) === C;
                    })
                );
        }),
        (this.reduceToPairs = function(M, S) {
            if ("undefined" == typeof S || "undefined" == typeof M)
                return this.errorMessage(
                    "This method requires two variables to be compared."
                );
            let T = this.validateInput(M, "nominal");
            if (!1 !== T) {
                let C = this.validateInput(S, "nominal");
                if (!1 !== C) {
                    let N = T.length >= C.length ? T.length : C.length,
                        I = [],
                        V = [],
                        D = [],
                        F = "string" == typeof M ? M : "first",
                        P = "string" == typeof S ? S : "second";
                    for (var B = 0; B < N; B++) {
                        let U = T.data[B],
                            O = C.data[B];
                        if (
                            void 0 !== typeof U &&
                            void 0 !== typeof O &&
                            !isNaN(U) &&
                            !isNaN(O)
                        ) {
                            I.push(U), V.push(O);
                            let R = {};
                            (R[F] = U), (R[P] = O), D.push(R);
                        }
                    }
                    return {
                        length: I.length,
                        missings: N - I.length,
                        valuesFirst: I,
                        valuesSecond: V,
                        valuesCombined: D,
                    };
                }
            }
        }),
        (this.validateInput = function(M, S = "metric", T = "") {
            let C = {};
            if (
                "string" != typeof M &&
                (M.constructor !== Array ||
                    (M.constructor === Array && 0 == M.length))
            )
                return (
                    this.errorMessage(
                        "No properly formatted data was supplied. Specify a column by its name (string) or supply an array of values."
                    ), !1
                );
            if ("string" == typeof M && "" !== M)
                (C.data = this.getColumn(M)),
                (C.scale = this.getScale(M)),
                (C.length = C.data.length);
            else if (M.constructor === Array && 0 < M.length) {
                if (!1 === this.validateData(M, S)) return !1;
                (C.data = M), (C.scale = S), (C.length = C.data.length);
            } else return !1;
            if (0 == C.length)
                return (
                    this.errorMessage(
                        "The supplied data or the data of the supplied column contains no values."
                    ), !1
                );
            if (!h.apply(this, [C.scale, S])) {
                let N = this.validScales
                    .slice(this.validScales.indexOf(S))
                    .join(", "),
                    I =
                    "" === T ?
                    "This statistical method" :
                    T.charAt(0).toUpperCase() + T.slice(1);
                return (
                    (I +=
                        " is only defined for these scales of measurement: " +
                        N +
                        ". The scale of the supplied data is " +
                        C.scale +
                        "."),
                    this.errorMessage(I), !1
                );
            }
            return C;
        }),
        (this.validateData = function(M, S = "metric") {
            if ("undefined" == typeof M || o.constructor !== Array)
                return this.errorMessage(
                    "Validate data: Specify an array storing the values to be validated."
                );
            if ("nominal" === S) return !0;
            for (var T = 0; T < M.length; T++)
                if (!this.isNumeric(M[T]))
                    return (
                        this.errorMessage(
                            "Validate data: The supplied data contains non-numeric values: " +
                            M[T] +
                            " at index " +
                            T
                        ), !1
                    );
            return !0;
        }),
        (this.isNumeric = function(M) {
            return "undefined" == typeof M ?
                void 0 :
                !Array.isArray(M) && !isNaN(parseFloat(M)) && isFinite(M);
        });
        var h = function(M, S) {
            return this.validScales.indexOf(M) >= this.validScales.indexOf(S);
        };
        return (
            (this.errorMessage = function(M) {
                if (!this.suppressWarnings)
                    try {
                        throw new TypeError("string" == typeof M ? M : M.message);
                    } catch (S) {
                        console.error("statistics.js: " + S.message);
                    }
            }),
            (this.has = function(M, S) {
                var T = Object.prototype.hasOwnProperty;
                return T.call(M, S);
            }),
            (this.deepCopy = function(M) {
                let S = Array.isArray(M) ? [] : {};
                for (let T in M) {
                    let C = M[T];
                    S[T] = "object" == typeof C ? this.deepCopy(C) : C;
                }
                return S;
            }),
            (Statistics.prototype.assignRanks = function(
                M, {
                    data: S = this.data,
                    order: T = "asc",
                    handleTiedValues: C = "mean",
                    returnFrequencies: N = !1,
                } = {}
            ) {
                if ("undefined" == typeof M)
                    return this.errorMessage(
                        "Assign ranks: You need to specify a column to be ranked."
                    );
                let I = this.deepCopy(
                        this.sortDataByColumn(M, { data: S, order: T, changeOriginal: !1 })
                    ),
                    V = {};
                for (var D = 0; D < I.length; D++) {
                    let U = I[D][M];
                    V[U] = V[U] ? V[U] + 1 : 1;
                }
                let P = 0,
                    B = [];
                for (var D = 0; D < I.length; D++) {
                    let U = I[D][M],
                        O = D + 1;
                    1 === V[U] ?
                        (P = 0) :
                        "mean" === C ?
                        (P++, (O = D + V[U] / 2 - P + 1.5)) :
                        "random" === C &&
                        (0 === B.length &&
                            (B = Array.from(Array(V[U]), (G, A) => A + D + 1)),
                            (O = B[_Mathfloor(Math.random() * B.length)]),
                            B.splice(B.indexOf(O), 1)),
                        P == V[U] && (P = 0),
                        (I[D]["rank-" + M] = O);
                    _
                }
                return N ? { data: I, Sample_2: V } : I;
            }),
            (Statistics.prototype.contingencyTable = function(M, S) {
                if ("undefined" == typeof S)
                    return this.errorMessage(
                        "A contingency table requires two columns to analyze."
                    );
                if (!this.has(this.columns, M))
                    return this.errorMessage('There is no variable "' + M + '" defined.');
                if (!this.has(this.columns, S))
                    return this.errorMessage('There is no variable "' + S + '" defined.');
                let T = this.getScale(M),
                    C = this.getScale(S);
                if (
                    ("nominal" !== T && "ordinal" !== T) ||
                    ("nominal" !== C && "ordinal" !== C)
                )
                    return this.errorMessage(
                        "Both variables need to be nominal for. They are " +
                        T +
                        " and " +
                        C +
                        "."
                    );
                let N = this.getValueMap(M),
                    I = this.getValueMap(S);
                if ("undefined" == typeof N || "undefined" == typeof I)
                    return this.errorMessage(
                        "Contingency table: There are no valid values."
                    );
                let V = { total: { total: 0 } },
                    D = this.data;
                for (var F = 0; F < D.length; F++) {
                    let B = D[F][M],
                        U = D[F][S];
                    "undefined" == typeof V[B] && (V[B] = { total: 0 }),
                        (V[B][U] = "undefined" == typeof V[B][U] ? 1 : V[B][U] + 1),
                        (V.total[B] =
                            "undefined" == typeof V.total[B] ? 1 : V.total[B] + 1),
                        (V.total[U] =
                            "undefined" == typeof V.total[U] ? 1 : V.total[U] + 1),
                        V[B].total++,
                        V.total.total++;
                }
                let P = { detailled: V };
                return (
                    2 >= N.length &&
                    2 >= I.length &&
                    ((P.a = V[N[0]][I[0]] || 0),
                        (P.b = V[N[0]][I[1]] || 0),
                        (P.c = V[N[1]][I[0]] || 0),
                        (P.d = V[N[1]][I[1]] || 0)),
                    P
                );
            }),
            (this.showData = function(M) {
                if ("string" == typeof M && this.has(this.columns, M))
                    "ordinal" === this.getScale(M) ?
                    console.log(this.applyValueMap(M)) :
                    console.log(this.getColumn(M));
                else if ("undefined" == typeof M) {
                    let C = this.valueMaps,
                        N = this.data;
                    if ("undefined" != typeof C)
                        for (var S in C)
                            if (
                                this.has(C, S) &&
                                "undefined" != typeof C[S] &&
                                "ordinal" === this.getScale(S)
                            )
                                for (var T = 0; T < N.length; T++) N[T][S] = C[S][N[T][S]];
                    console.table(N);
                } else console.log(M);
            }),
            (this.scatterPlot = function(
                M = this.data, {
                    canvas: S = null,
                    xAxis: T = null,
                    yAxis: C = null,
                    width: N = null,
                    height: I = null,
                    dotRadius: V = 4,
                    showGrid: D = !1,
                    minNumberXMarks: F = 8,
                    minNumberYMarks: P = 8,
                    background: B = "#FFFFFF",
                    dotColor: U = "#000000",
                    gridColor: O = "#CCCCCC",
                    axisColor: R = "#000000",

                } = {}
            ) {
                if ("undefined" == typeof M)
                    return this.errorMessage("Scatter plot: No data given.");
                if (M.constructor !== Array || 0 === M.length)
                    return this.errorMessage(
                        "Scotter plot: Data is not an array or empty."
                    );
                if (0 >= F || 0 >= P)
                    return this.errorMessage(
                        "Scotter plot: The number of line to plot must be larger than 0."
                    );
                let G = typeof M[0];
                if ("object" == G && (!T || !C))
                    return this.errorMessage(
                        "Scatter plot: The variables for the x and y axes need to be supplied."
                    );
                let A = {},
                    L = Infinity,
                    E = -Infinity,
                    W = Infinity,
                    K = -Infinity,
                    Y = 0;
                for (var X = 0; X < M.length; X++) {
                    let me,
                        ce,
                        ue = [];
                    if ("number" == G || M[0].constructor === Array) {
                        if (!this.isNumeric(M[X])) continue;
                        (me = X), (ce = M[X]);
                    } else if ("object" == G) {
                        if (!this.has(M[X], T) ||
                            !this.has(M[X], C) ||
                            !this.isNumeric(M[X][T]) ||
                            !this.isNumeric(M[X][C])
                        )
                            continue;
                        (me = M[X][T]), (ce = M[X][C]);
                    }
                    this.has(A, me) ? (ue = A[me]) : (Y += 1),
                        ue.push(ce),
                        (A[me] = ue),
                        me > E && (E = me),
                        me < L && (L = me),
                        ce > K && (K = ce),
                        ce < W && (W = ce);
                }
                0.1 > L / E && (L = 0),
                    0.1 > W / K && (W = 0),
                    null === S && (S = document.createElement("canvas"));
                let Q = S.getContext("2d"),
                    H = N ? 0.1 * N : 0.1 * (E - L);
                for (var J in ((N = (N ? N - 2 * H : E - L) + 2 * V),
                        (I = (I ? I - 2 * H : K - W) + 2 * V),
                        400 > N && (N = 400),
                        400 > I && (I = 400),
                        40 > H && (H = 40),
                        (S.width = N),
                        (S.height = I),
                        (Q.fillStyle = "transparent"),
                        Q.fillRect(0, 0, N, I),
                        (Q.fillStyle = U),
                        A))
                    for (var Z = 0; Z < A[J].length; Z++) {
                        let ue = ((J - L) * (N - V)) / (E - L),
                            me = I - ((A[J][Z] - W) * (I - V)) / (K - W) - V;
                        Q.fillRect(ue, me, V, V);
                    }
                const $ = function(ue, me, ce, pe, ge, fe = R) {
                    (ue.strokeStyle = fe),
                    ue.beginPath(),
                        ue.moveTo(_Mathfloor(me), _Mathfloor(ce)),
                        ue.lineTo(_Mathfloor(pe), _Mathfloor(ge)),
                        ue.stroke(),
                        (ue.strokeStyle = R);
                };
                let _ = document.createElement("canvas"),
                    ee = _.getContext("2d"),
                    ae = N + 2 * H - 2 * V,
                    te = I + 2 * H - 2 * V;
                (_.width = ae),
                (_.height = te),
                (ee.fillStyle = B),
                ee.fillRect(0, 0, ae, te),
                    (ee.fillStyle = R),
                    (ee.font = 0.2 * H + "px Arial"),
                    (ee.textAlign = "center"),
                    (ee.textBaseline = "middle");
                let ie = _Mathround((E - L) / F),
                    ne =
                    1 <= ie ? _Mathpow(10, parseInt(ie).toString().length - 1) : 0.01;
                ie = _Mathround(ie / ne) * ne;
                let se = 0,
                    re = 0,
                    oe = 0;
                if (0 < ie)
                    for (var X = 0; X < F || (se <= E && re <= N - 2 * H); X++)
                        (se = _Mathround(L / ne) * ne + X * ie),
                        (re = 0.5 * H + ((se - L) * (N - V)) / (E - L)),
                        re > ae - 0.5 * H ||
                        re < 0.5 * H ||
                        ($(ee, re, te - 0.4 * H, re, te - 0.6 * H),
                            D && $(ee, re, te - 0.6 * H, re, 0.5 * H, O),
                            ee.fillText(se, re, te - 0.2 * H));
                let de = (K - W) / P,
                    le =
                    1 <= de ? _Mathpow(10, parseInt(de).toString().length - 1) : 0.01;
                if (((de = _Mathround(de / le) * le), (se = 0), 0 < de))
                    for (var X = 0; X < P || (se <= K && oe <= I - 2 * H); X++)
                        (se = _Mathround(W / le) * le + X * de),
                        (oe = 1.5 * H - 2 * V + I - ((se - W) * (I - V)) / (K - W)),
                        oe > te - 0.5 * H ||
                        oe < 0.5 * H ||
                        ($(ee, 0.4 * H, oe, 0.6 * H, oe),
                            D && $(ee, 0.6 * H, oe, N + H - 2 * V, oe, O),
                            ee.fillText(se, 0.2 * H, oe));
                return (
                    $(ee, 0.5 * H, te - 0.5 * H, ae - H, te - 0.5 * H),
                    $(ee, 0.5 * H, te - 0.5 * H, 0.5 * H, 0.5 * H),
                    ee.drawImage(S, 0.5 * H - 0.5 * V, 1.5 * H - 1.5 * V),
                    Q.drawImage(_, 0, 0, N, I),
                    S
                );
            }),
            this.init(o, l, u)
        );
    };
"undefined" == typeof exports
    ?
    (window.Statistics = Statistics) :
    ("undefined" != typeof module &&
        module.exports &&
        (exports = module.exports = Statistics),
        (exports.Statistics = Statistics)),
    (Statistics.prototype.mean = function(o) {
        return "undefined" == typeof o ? void 0 : this.arithmeticMean(o);
    }),
    (Statistics.prototype.arithmeticMean = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Arithmetic mean: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "mean"))
            return this.getStatistics(o, "mean");
        let l = this.validateInput(o, "interval", "arithmetic mean");
        if (!1 !== l) {
            let u = this.sumExact(l.data) / l.length;
            return "string" == typeof o && this.updateStatistics(o, "mean", u), u;
        }
    }),
    (Statistics.prototype.geometricMean = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Geometric mean: No data was supplied.");
        if (
            "string" == typeof o &&
            !1 === this.checkLastUpdated(o, "geometricMean")
        )
            return this.getStatistics(o, "geometricMean");
        let l = this.validateInput(o, "metric", "geometric mean");
        if (!1 === l) return;
        let u,
            g = !1;
        return (
            (u = l.data.reduce((h, M) => {
                return 0 < M ? h * M : ((g = !0), h);
            }, 1)), !g && 0 < l.length ?
            (u = _Mathpow(u, 1 / l.length)) :
            (this.errorMessage(
                    "Geometric mean is not defined because the data contains non-positive values."
                ),
                (u = void 0)),
            "string" == typeof o && this.updateStatistics(o, "geometricMean", u),
            u
        );
    }),
    (Statistics.prototype.harmonicMean = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Harmonic mean: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "harmonicMean"))
            return this.getStatistics(o, "harmonicMean");
        let l = this.validateInput(o, "metric", "harmonicMean");
        if (!1 === l) return;
        let u = !1,
            g = !1,
            h = l.data.reduce((M, S) => {
                return 0 > S ? ((g = !0), 0) : 0 === S ? ((u = !0), 0) : M + 1 / S;
            }, 0);
        return (
            (h = u ? 0 : l.length / h),
            (h = g ? void 0 : h),
            "string" == typeof o && this.updateStatistics(o, "harmonicMean", h),
            h
        );
    }),
    (Statistics.prototype.rootMeanSquare = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Root mean square: No data was supplied.");
        if (
            "string" == typeof o &&
            !1 === this.checkLastUpdated(o, "rootMeanSquare")
        )
            return this.getStatistics(o, "rootMeanSquare");
        let l = this.validateInput(o, "interval", "root mean square");
        if (!1 !== l) {
            let u = _Mathsqrt(
                l.data.reduce((g, h) => {
                    return g + h * h;
                }, 0) / l.length
            );
            return (
                "string" == typeof o && this.updateStatistics(o, "rootMeanSquare", u), u
            );
        }
    }),
    (Statistics.prototype.cubicMean = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Cubic mean: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "cubicMean"))
            return this.getStatistics(o, "cubicMean");
        let l = this.validateInput(o, "interval", "cubic mean");
        if (!1 === l) return;
        let u = l.data.reduce((g, h) => {
            return g + h * h * h;
        }, 0);
        return (
            (u = 0 <= u && 0 < l.length ? _Mathpow(u / l.length, 1 / 3) : void 0),
            "string" == typeof o && this.updateStatistics(o, "cubicMean", u),
            u
        );
    }),
    (Statistics.prototype.winsorisedMean = function(o, l = 0.2) {
        if ("undefined" == typeof o)
            return this.errorMessage("Winsorised mean: No data was supplied.");
        if (0 > l || 0.5 < l)
            return this.errorMessage(
                "winsorisedMean should be called with a percentage value within the range of [0, 0.5]."
            );
        if (0.5 === l) return this.median(o);
        let u = this.validateInput(o, "interval", "Winsorised (truncated) mean");
        if (!1 === u) return;
        let g = _Mathfloor(u.length * l),
            h = this.sort(u.data).slice(g, u.length - g);
        h = Array(g)
            .fill(h[0])
            .concat(h)
            .concat(Array(g).fill(h[h.length - 1]));
        let M = this.sumExact(h) / u.length;
        return M;
    }),
    (Statistics.prototype.gastwirthCohenMean = function(
        o, { alpha: l = 0.25, lambda: u = 0.25 } = {}
    ) {
        if ("undefined" == typeof o)
            return this.errorMessage("Gastwirth-Cohen mean: No data was supplied.");
        let g = this.validateInput(o, "ordinal", "Gastwirth-Cohen Mean");
        if (!1 === g) return;
        if (!this.isNumeric(l) || 0 > l || 0.5 < l)
            return this.errorMessage(
                "Gastwirth-Cohen mean should be called with an alpha value within the range of [0, 0.5]."
            );
        if (!this.isNumeric(u) || 0 > u || 0.5 < u)
            return this.errorMessage(
                "Gastwirth-Cohen mean should be called with a lambda value within the range of [0, 0.5]."
            );
        let T,
            h = this.quantile(o, l),
            M = this.quantile(o, 1 - l),
            S = this.median(o);
        return (
            "undefined" != typeof h &&
            "undefined" != typeof M &&
            "undefined" != typeof S &&
            (T = u * (h + M) + (1 - 2 * u) * S),
            T
        );
    }),
    (Statistics.prototype.midRange = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Mid-range: No data was supplied.");
        let l = this.validateInput(o, "interval", "mid-range");
        if (!1 !== l) {
            let u = this.minimum(o),
                g = this.maximum(o);
            return "undefined" != typeof u && "undefined" != typeof g ?
                0.5 * (u + g) :
                void 0;
        }
    }),
    (Statistics.prototype.median = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Median: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "median"))
            return this.getStatistics(o, "median");
        let l = this.quantile(o, 0.5);
        return "string" == typeof o && this.updateStatistics(o, "median", l), l;
    }),
    (Statistics.prototype.mode = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Mode: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "mode"))
            return this.getStatistics(o, "mode");
        let l = this.validateInput(o, "nominal", "mode");
        if (!1 === l) return;
        let u = l.data,
            g = [],
            h = [u[0]],
            M = 1;
        for (var S = 1; S < l.length; S++) {
            let T = u[S];
            (g[T] = null == g[T] ? 1 : g[T] + 1),
            g[T] > M ? ((h = [T]), (M = g[T])) : g[T] === M && h.push(T);
        }
        return (
            1 === h.length && (h = h[0]),
            "string" == typeof o && this.updateStatistics(o, "mode", h),
            h
        );
    }),
    (Statistics.prototype.minimum = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Minimum: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "minimum"))
            return this.getStatistics(o, "minimum");
        let l = this.validateInput(o, "ordinal", "minimum");
        if (!1 === l) return;
        let u = Infinity,
            g = l.length;
        for (; g--;) l.data[g] < u && (u = l.data[g]);
        return "string" == typeof o && this.updateStatistics(o, "minimum", u), u;
    }),
    (Statistics.prototype.maximum = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Maximum: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "maximum"))
            return this.getStatistics(o, "maximum");
        let l = this.validateInput(o, "ordinal", "maximum");
        if (!1 === l) return;
        let u = -Infinity,
            g = l.length;
        for (; g--;) l.data[g] > u && (u = l.data[g]);
        return "string" == typeof o && this.updateStatistics(o, "maximum", u), u;
    }),
    (Statistics.prototype.range = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Range: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "range"))
            return this.getStatistics(o, "range");
        let l, u;
        if ("string" == typeof o && "nominal" === this.getScale(o)) {
            if (((l = this.validateInput(o, "nominal", "range")), !1 === l)) return;
            u = this.getUniqueValues(l.data);
        } else {
            if (((l = this.validateInput(o, "ordinal", "range")), !1 === l)) return;
            let g = this.sort(l.data);
            u = g[l.length - 1] - g[0];
        }
        return "string" == typeof o && this.updateStatistics(o, "range", u), u;
    }),
    (Statistics.prototype.variance = function(o, l = !0) {
        if ("undefined" == typeof o)
            return this.errorMessage("Variance: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "variance"))
            return this.getStatistics(o, "variance");
        let u = this.validateInput(o, "interval", "variance");
        if (!1 === u) return;
        if (2 > u.length)
            return this.errorMessage(
                "The data supplied to compute variance needs to contain at least two datasets."
            );
        let g = 0;
        if (this.isNumeric(l)) {
            for (var h = 0; h < u.length; h++) g += _Mathpow(l - u.data[h], 2);
            g /= u.length - 1;
        } else {
            let M = 0,
                S = 0;
            for (var h = 0; h < u.length; h++) {
                M += 1;
                let T = u.data[h] - S;
                S += T / M;
                let C = u.data[h] - S;
                g += T * C;
            }
            l && 1 < M ? (g /= M - 1) : !l && 0 < M ? (g /= M) : (g = void 0);
        }
        return "string" == typeof o && this.updateStatistics(o, "variance", g), g;
    }),
    (Statistics.prototype.standardDeviation = function(o, l = !0) {
        if ("undefined" == typeof o)
            return this.errorMessage("Standard deviation: No data was supplied.");
        if (
            "string" == typeof o &&
            !1 === this.checkLastUpdated(o, "standardDeviation")
        )
            return this.getStatistics(o, "standardDeviation");
        let u = this.validateInput(o, "interval", "standard deviation");
        if (!1 !== u) {
            if (2 > u.length)
                return this.errorMessage(
                    "The data supplied to compute standardDeviation needs to contain at least two datasets."
                );
            let g = _Mathsqrt(this.variance(o, l));
            return (
                "string" == typeof o &&
                this.updateStatistics(o, "standardDeviation", g),
                g
            );
        }
    }),
    (Statistics.prototype.coefficientOfVariation = function(o, l) {
        if ("undefined" == typeof o)
            return this.errorMessage(
                "Coefficient of variation: No data was supplied."
            );
        let u = this.validateInput(o, "interval", "coefficient of variation");
        if (!1 !== u) {
            let g = this.standardDeviation(u.data),
                h = "undefined" == typeof l ? this.mean(u.data) : l;
            return "undefined" != typeof g && "undefined" != typeof h && 0 !== h ?
                g / h :
                void 0;
        }
    }),
    (Statistics.prototype.indexOfDispersion = function(o, l) {
        if ("undefined" == typeof o)
            return this.errorMessage("Index of dispersion: No data was supplied.");
        let u = this.validateInput(o, "interval", "coefficient of variation");
        if (!1 !== u) {
            let g = this.variance(u.data),
                h = "undefined" == typeof l ? this.mean(u.data) : l;
            return "undefined" != typeof g && "undefined" != typeof h && 0 !== h ?
                g / h :
                void 0;
        }
    }),
    (Statistics.prototype.geometricStandardDeviation = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage(
                "Geomtric standard deviation: No data was supplied."
            );
        if (
            "string" == typeof o &&
            !1 === this.checkLastUpdated(o, "geometricStandardDeviation")
        )
            return this.getStatistics(o, "geometricStandardDeviation");
        let l = this.validateInput(o, "interval", "geometric standard deviation");
        if (!1 === l) return;
        let u = l.length,
            g = this.geometricMean(o),
            h = 0,
            M = !1;
        for (var S = 0; S < u; S++)
            0 >= l.data[S] ? (M = !0) : (h += _Mathpow(_Mathlog(l.data[S] / g), 2));
        return (
            (h = M ? void 0 : _Mathexp(_Mathsqrt(h / u))),
            "string" == typeof o &&
            this.updateStatistics(o, "geometricStandardDeviation", h),
            h
        );
    }),
    (Statistics.prototype.medianAbsoluteDeviation = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage(
                "Median absolute deviation: No data was supplied."
            );
        let l = this.validateInput(o, "interval", "median absolute deviation");
        if (!1 === l) return;
        let u = l.data,
            g = this.median(u);
        if ("undefined" != typeof g)
            return (
                (u = u.map((h) => {
                    return _Mathabs(h - g);
                })),
                this.median(u)
            );
    }),
    (Statistics.prototype.cumulativeFrequency = function(o, l) {
        if ("undefined" == typeof o)
            return this.errorMessage("Cumulative frequency: No data was supplied.");
        if ("undefined" == typeof l || !this.isNumeric(l))
            return void this.errorMessage(
                "You need to specify a boundary for the cumulative frequency analysis that is either an integer or a floating point number."
            );
        let u = this.validateInput(o, "ordinal", "cumulative frequency analysis");
        if (!1 !== u) {
            let g = this.sort(u.data),
                h = 0;
            for (; l >= g[h];) h++;
            return h;
        }
    }) _,
    (Statistics.prototype.Sample_2 = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Frequencies: No da_ta was supplied.");
        let l = this.validateInput(o, "nominal", "Sample_2");
        if (!1 === l) return;
        let u = l.data,
            g = {},
            h = [];
        for (var M = 0; M < l.length; M++) {
            let S = u[M];
            null == g[S] ? (h.push(S), (g[S] = 1)) : g[S]++;
        }
        return (
            (h = h.sort((S, T) => {
                return g[T] - g[S];
            })),
            (h = h.map((S) => {
                return { value: S, absolute: g[S], relative: g[S] / l.length };
            })),
            h
        );
    }),
    (Statistics.prototype.quantile = function(o, l = 0.5) {
        if ("undefined" == typeof o)
            return this.errorMessage("Quantile: No data was supplied.");
        if (!this.isNumeric(l) || 0 > l || 1 < l)
            return this.errorMessage(
                "Quantiles should be called with a percentage value within the range of [0, 1]."
            );
        let u = this.validateInput(o, "ordinal", "quantile");
        if (!1 !== u) {
            let g = l * u.length,
                h = this.sort(u.data);
            return 0 == g % 1 ? 0.5 * (h[g] + h[g - 1]) : h[_Mathfloor(g)];
        }
    }),
    (Statistics.prototype.quartiles = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Quartiles: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "quartiles"))
            return this.getStatistics(o, "quartiles");
        let l = [this.quantile(o, 0.25), this.quantile(o, 0.75)];
        return "undefined" != typeof l[0] && "undefined" != typeof l[1] ?
            (this.updateStatistics(o, "quartiles", l), l) :
            void 0;
    }),
    (Statistics.prototype.interQuartileRange = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Interquartile range: No data was supplied.");
        let l = this.validateInput(o, "interval", "interquartile range");
        if (!1 !== l) {
            let u = this.quartiles(l.data);
            return "undefined" == typeof u ? void 0 : u[1] - u[0];
        }
    }),
    (Statistics.prototype.skewness = function(o, l = !1) {
        if ("undefined" == typeof o)
            return this.errorMessage("Skewness: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "skewness"))
            return this.getStatistics(o, "skewness");
        let u = this.validateInput(o, "ordinal", "skewness");
        if (!1 === u) return;
        if (2 > u.length) return;
        let g = this.mean(o),
            h = this.standardDeviation(o, !1),
            M = 0;
        for (var S = 0; S < u.length; S++) M += _Mathpow(u.data[S] - g, 3);
        let T = M / _Mathpow(h, 3);
        return (
            (T *= l ? u.length / ((u.length - 1) * (u.length - 2)) : 1 / u.length),
            "string" == typeof o && this.updateStatistics(o, "skewness", T),
            T
        );
    }),
    (Statistics.prototype.kurtosis = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Kurtosis: No data was supplied.");
        if ("string" == typeof o && !1 === this.checkLastUpdated(o, "kurtosis"))
            return this.getStatistics(o, "kurtosis");
        let l = this.validateInput(o, "ordinal", "kurtosis");
        if (!1 === l) return;
        if (2 > l.length) return;
        let u = this.mean(o),
            g = this.standardDeviation(o),
            h = 0;
        for (var M = 0; M < l.length; M++) h += _Mathpow(l.data[M] - u, 4);
        let S = h / (l.length * _Mathpow(g, 4));
        return "string" == typeof o && this.updateStatistics(o, "kurtosis", S), S;
    }),
    (Statistics.prototype.excessKurtosis = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Excess kurtosis: No data was supplied.");
        let l = this.kurtosis(o);
        return "undefined" == typeof l ? void 0 : l - 3;
    }),
    (Statistics.prototype.sum = function(o) {
        return "undefined" == typeof o ?
            this.errorMessage("Sum: No data given.") :
            ("string" == typeof o &&
                this.has(this.columns, o) &&
                (o = this.getColumn(o)),
                0 == o.length ?
                void 0 :
                o.reduce((l, u) => {
                    return this.isNumeric(u) ? l + u : l;
                }, 0));
    }),
    (Statistics.prototype.sumExact = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Sum exact: No data given.");
        if (
            ("string" == typeof o &&
                this.has(this.columns, o) &&
                (o = this.getColumn(o)),
                0 == o.length)
        )
            return;
        let l = 0,
            u = 0;
        for (var g = 0; g < o.length; g++) {
            let h = this.isNumeric(o[g]) ? o[g] : 0;
            h -= u;
            let M = l + h;
            (u = M - l - h), (l = M);
        }
        return l;
    }),
    (Statistics.prototype.product = function(o) {
        return "undefined" == typeof o ?
            this.errorMessage("Product: No data given.") :
            ("string" == typeof o &&
                this.has(this.columns, o) &&
                (o = this.getColumn(o)),
                0 === o.length ?
                1 :
                o.reduce((l, u) => {
                    return this.isNumeric(u) ? l * u : l;
                }, 1));
    }),
    (Statistics.prototype.factorial = function(o) {
        return this.isNumeric(o) && !_NumberisInteger(o) ?
            this.gamma(o) :
            "undefined" == typeof this.factorials[o] ?
            this.computeFactorial(o) :
            this.factorials[o];
    }),
    (Statistics.prototype.computeFactorial = function(o) {
        if ("undefined" == typeof o || !this.isNumeric(o) || 0 > o) return;
        if ("undefined" != typeof this.factorials[o]) return this.factorials[o];
        if (!_NumberisInteger(o)) return this.gamma(o);
        let l = 1,
            u = 1;
        for (; o > u;)
            u++,
            (l *= u),
            "undefined" == typeof this.factorials[u] && (this.factorials[u] = l);
        return l;
    }),
    (Statistics.prototype.binomialCoefficient = function(o = 1, l = 1) {
        if (o < l || 0 > l)
            return this.errorMessage(
                "The binomial coefficient is only defined for n and k with n \u2265 k \u2265 0. N is " +
                o +
                " and k is " +
                l +
                "."
            );
        if (!_NumberisInteger(o) || !_NumberisInteger(l))
            return this.errorMessage(
                "The binomial coefficient is only defined for integers n and k."
            );
        let u = [];
        for (var g = 1; g <= l; g++) u.push((o + 1 - g) / g);
        return this.product(u);
    }),
    (Statistics.prototype.gamma = function(o, l = !1) {
        return "undefined" == typeof o || !this.isNumeric(o) || 0 > o ?
            void 0 :
            _NumberisInteger(o) && "undefined" != typeof this.factorials[o - 1] ?
            this.factorials[o - 1] :
            l ?
            this.gammaSpouge(o) :
            this.gammaStirling(o);
    }),
    (Statistics.prototype.gammaSpouge = function(o) {
        if ("undefined" == typeof o || !this.isNumeric(o) || 0 > o) return;
        if (_NumberisInteger(o) && "undefined" != typeof this.factorials[o - 1])
            return this.factorials[o - 1];
        const l = this.spougeConstant;
        let u = _Mathpow(o + l, o + 0.5),
            g = 1,
            h = 0,
            M = _Mathsqrt(2 * _MathPI);
        (u *= _Mathexp(-o - l)), (u /= o);
        for (var S = 1; S < l; S++)
            o++,
            (h = _Mathpow(l - S, S - 0.5)),
            (h *= _Mathexp(l - S)),
            (h /= g),
            (M += h / o),
            (g *= -S);
        return M * u;
    }),
    (Statistics.prototype.gammaStirling = function(o) {
        if ("undefined" == typeof o || !this.isNumeric(o) || 0 > o) return;
        if (_NumberisInteger(o) && "undefined" != typeof this.factorials[o - 1])
            return this.factorials[o - 1];
        let g = 1 / (10 * o);
        return (
            (g = 1 / (12 * o - g)),
            (g = (g + o) * 0.36787944117144233),
            (g = _Mathpow(g, o)),
            (g *= _Mathsqrt(6.283185307179586 / o)),
            g
        );
    }),
    (Statistics.prototype.incompleteGamma = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "The incomplete lower gamma function is only defined for two numeric variables s and x."
            );
        if (!this.isNumeric(o) || !this.isNumeric(l))
            return this.errorMessage(
                "The incomplete lower gamma function is only defined for numeric variables s and x."
            );
        if (0 > l)
            return this.errorMessage(
                "The incomplete lower gamma function is defined for x > 0."
            );
        let u = this.incompleteGammaIterations,
            g = 1;
        for (var h = 0; h < u; h++) {
            let M = u - h;
            g = l + (M - o) / (1 + M / g);
        }
        return this.gamma(o, !0) - (_Mathexp(-l) * _Mathpow(l, o)) / g;
    }),
    (Statistics.prototype.regularisedGamma = function(o, l) {
        return "undefined" == typeof l ?
            this.errorMessage(
                "The regularised lower gamma function is only defined for two numeric variables s and x."
            ) :
            this.isNumeric(o) && this.isNumeric(l) ?
            0 > l ?
            this.errorMessage(
                "The regularised lower gamma function is defined for x > 0."
            ) :
            this.incompleteGamma(o, l) / this.gamma(o, !0) :
            this.errorMessage(
                "The regularised lower gamma function is only defined for numeric variables s and x."
            );
    }),
    (Statistics.prototype.beta = function(o, l) {
        return "undefined" == typeof l ?
            this.errorMessage(
                "The beta function is only defined for two numeric variables a and b."
            ) :
            this.isNumeric(o) && this.isNumeric(l) ?
            0 >= o || 0 >= l ?
            this.errorMessage(
                "The beta function is defined for a and b with a > 0 and b > 0."
            ) :
            _NumberisInteger(o) && _NumberisInteger(l) && 0 < o && 0 < l ?
            (this.factorial(o - 1) * this.factorial(l - 1)) /
            this.factorial(o + l - 1) :
            (this.gamma(o, !0) * this.gamma(l, !0)) / this.gamma(o + l, !0) :
            this.errorMessage(
                "The beta function is only defined for numeric variables a and b."
            );
    }),
    (Statistics.prototype.incompleteBeta = function(o, l, u) {
        if ("undefined" == typeof u)
            return this.errorMessage(
                "The incomplete beta function is only defined for two numeric variables a and b."
            );
        if (!this.isNumeric(o) || !this.isNumeric(l) || !this.isNumeric(u))
            return this.errorMessage(
                "The incomplete beta function is only defined for numeric variables x, a and b."
            );
        if (0 > o || 1 < o)
            return this.errorMessage(
                "The incomplete beta function is defined for x \u2265 0 and x \u2266 1."
            );
        if (0 >= l || 0 >= u)
            return this.errorMessage(
                "The incomplete beta function is defined for a and b with a > 0 and b > 0."
            );
        if (1 == o) return this.beta(l, u);
        var g = function(N, I, V, D) {
            if (0 == N % 2) {
                let F = 0.5 * N;
                return (F * (V - F) * D) / ((I + 2 * F - 1) * (I + 2 * F));
            }
            let F = 0.5 * N - 0.5;
            return (-(I + F) * (I + V + F) * D) / ((I + 2 * F) * (I + 2 * F + 1));
        };
        let h = (_Mathpow(o, l) * _Mathpow(1 - o, u)) / l,
            M = this.incompleteBetaIterations,
            S = 1;
        for (var T = 0; T < M; T++) {
            let N = M - T;
            S = 1 + g(N, l, u, o) / S;
        }
        let C = h / S;
        return C;
    }),
    (Statistics.prototype.regularisedBeta = function(o, l, u) {
        if ("undefined" == typeof u)
            return this.errorMessage(
                "The regularised beta function is only defined for two numeric variables a and b."
            );
        if (!this.isNumeric(o) || !this.isNumeric(l) || !this.isNumeric(u))
            return this.errorMessage(
                "The regularised beta function is only defined for numeric variables x, a and b."
            );
        if (1 < o || 0 > o)
            return this.errorMessage(
                "The regularised beta function is defined for x \u2265 0 and x \u2266 1."
            );
        if (0 >= l || 0 >= u)
            return this.errorMessage(
                "The regularised beta function is defined for a and b with a > 0 and b > 0."
            );
        if (!_NumberisInteger(l) || !_NumberisInteger(u))
            return this.incompleteBeta(o, l, u) / this.beta(l, u);
        let g = this.epsilon + 1,
            h = l,
            M = 0;
        for (; g >= this.epsilon;)
            (g = this.binomialCoefficient(u + h - 1, h) * _Mathpow(o, h)),
            (M += g),
            h++;
        return M * _Mathpow(1 - o, u);
    }),
    (Statistics.prototype.covariance = function(o, l, u = !0) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Covariance requires two variables to be compared."
            );
        let g = this.validateInput(o, "interval", "covariance");
        if (!1 === g) return;
        let h = this.validateInput(l, "interval", "covariance");
        if (!1 === h) return;
        let M = this.reduceToPairs(g.data, h.data);
        if (0 === M.length) return;
        let S = this.mean(M.valuesFirst),
            T = this.mean(M.valuesSecond),
            C = 0;
        for (var N = 0; N < M.length; N++)
            C += (M.valuesFirst[N] - S) * (M.valuesSecond[N] - T);
        return (
            u && 1 < M.length ?
            (C /= M.length - 1) :
            !u && 0 < M.length ?
            (C /= M.length) :
            (C = void 0), { covariance: C, missings: M.missings }
        );
    }),
    (Statistics.prototype.correlationCoefficient = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Pearson correlation coefficient requires two variables to be compared."
            );
        let u = this.validateInput(
            o,
            "interval",
            "Pearson correlation coefficient"
        );
        if (!1 === u) return;
        let g = this.validateInput(
            l,
            "interval",
            "Pearson correlation coefficient"
        );
        if (!1 === g) return;
        let h = u.length >= g.length ? u.length : g.length,
            M = u.data,
            S = g.data,
            T = [],
            C = 0,
            N = 0;
        for (var I = 0; I < h; I++) {
            let U = M[I],
                O = S[I];
            void 0 === typeof U ||
                void 0 === typeof O ||
                isNaN(U) ||
                isNaN(O) ||
                ((C += U), (N += O), T.push([U, O]));
        }
        let V = h - T.length;
        if (((h = T.length), 0 === h)) return;
        (C /= h), (N /= h);
        let D = 0,
            F = 0,
            P = 0;
        for (var I = 0; I < h; I++) {
            let U = T[I][0] - C,
                O = T[I][1] - N;
            (D += U * O), (F += U * U), (P += O * O);
        }
        let B = 0 < F && 0 < P ? D / _Mathsqrt(F * P) : 0;
        return { correlationCoefficient: B, missings: V };
    }),
    (Statistics.prototype.spearmansRho = function(o, l, u = !1) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Spearman's Rho requires two variables to be compared."
            );
        let g = this.validateInput(o, "ordinal", "Spearman's Rho");
        if (!1 === g) return;
        let h = this.validateInput(l, "ordinal", "Spearman's Rho");
        if (!1 === h) return;
        let M = this.reduceToPairs(o, l),
            S = M.length;
        if (0 === S) return;
        let T = this.assignRanks(o, {
                data: M.valuesCombined,
                returnFrequencies: !0,
                order: "desc",
            }) _,
            C = T.Sample_2;
        T = this.assignRanks(l, {
            data: T.data,
            returnFrequencies: !0,
            order: "desc",
        }) _;
        let N = T.Sample_2;
        T = T.data;
        let I = T.reduce((O, R) => {
                return O + _Mathpow(R["rank-" + o] - R["rank-" + l], 2);
            }, 0),
            V = 6 * I;
        if (u) {
            let O = Object.values(C).reduce((L, E) => {
                    return L + _Mathpow(E, 3) - E;
                }),
                R = Object.values(N).reduce((L, E) => {
                    return L + _Mathpow(E, 3) - E;
                }),
                G = _Mathpow(S, 3) - S - 0.5 * O - 0.5 * R - V,
                A = _Mathsqrt((_Mathpow(S, 3) - S - O) * (_Mathpow(S, 3) - S - R));
            V = G / A;
        } else V = 1 - V / (_Mathpow(S, 3) - S);
        let D = S - 2,
            F = _Mathsqrt((D - 1) / 1.06) * this.fisherTransformation(V),
            P = 1 - this.normalCumulativeValue(_Mathabs(F)),
            B = V * _Mathsqrt(D / (1 - V * V)),
            U = 1 - this.studentsTCumulativeValue(_Mathabs(B), D);
        return {
            rho: V,
            significanceNormal: { zScore: F, pOneTailed: P, pTwoTailed: 2 * P },
            significanceStudent: {
                degreesOfFreedom: D,
                tStatistic: B,
                pOneTailed: U,
                pTwoTailed: 2 * U,
            },
            missings: M.missings,
        };
    }),
    (Statistics.prototype.kendallsTau = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Kendall's Tau requires two columns to analyze."
            );
        let u = this.validateInput(o, "ordinal", "Kendall's Tau");
        if (!1 === u) return;
        let g = this.validateInput(l, "ordinal", "Kendall's Tau");
        if (!1 === g) return;
        let h = this.reduceToPairs(o, l),
            M = h.length,
            S = h.valuesCombined,
            T = 0,
            C = 0,
            N = {},
            I = {},
            V = 0;
        for (var D = 0; D < M - 1; D++)
            for (var F = D + 1; F < M; F++) {
                let X = S[D][o],
                    Q = S[F][o],
                    H = S[D][l],
                    J = S[F][l];
                X === Q ?
                    H === J ?
                    (V += 1) :
                    (N[H] = this.has(N, H) ? N[H] + 1 : 1) :
                    H === J ?
                    (I[H] = this.has(I, H) ? I[H] + 1 : 1) :
                    _Mathsign(X - Q) === _Mathsign(H - J) ?
                    (T += 1) :
                    (C += 1);
            }
        let P = T - C,
            B =
            0 === Object.keys(N).length + Object.keys(I).length ?
            (2 * P) / (M * (M - 1)) :
            void 0,
            U = (3 * P) / _Mathsqrt(0.5 * M * (M - 1) * (2 * M + 5)),
            O = this.normalCumulativeValue(-_Mathabs(U)),
            R = 2 < h.length ? 2 : h.length,
            A = B,
            L = U,
            E = O;
        if ("undefined" == typeof B) {
            A =
                P /
                _Mathsqrt(
                    (T + C + Object.keys(N).length) * (T + C + Object.keys(I).length)
                );
            let X = 0,
                Q = 0,
                H = 0,
                J = 0,
                $ = 0;
            for (var W in N)
                (X += W * (W - 1) * (2 * W + 5)),
                (H += W * (W - 1)),
                (J += W * (W - 1) * (W - 2));
            for (var W in I)
                (Q += W * (W - 1) * (2 * W + 5)),
                (J += (W * (W - 1)) / (2 * M * (M - 1))),
                ($ += (W * (W - 1) * (W - 2)) / (9 * M * (M - 1) * (M - 2)));
            (L = M * (M - 1) * (2 * M + 5)),
            (L = (L - X - Q) / 18 + H * J + 0 * $),
            (L = P / _Mathsqrt(L)),
            (E = this.normalCumulativeValue(-_Mathabs(L)));
        }
        let K =
            "undefined" == typeof B ?
            void 0 : { tauA: B, z: U, pOneTailed: O, pTwoTailed: 2 * O },
            Y =
            "undefined" == typeof B ? { tauB: A, z: L, pOneTailed: E, pTwoTailed: 2 * E } : { tauB: B, z: U, pOneTailed: O, pTwoTailed: 2 * O };
        return {
            a: K,
            b: Y,
            c: { tauC: (2 * R * P) / (M * M * (R - 1)) },
            missings: h.missings,
        };
    }),
    (Statistics.prototype.goodmanKruskalsGamma = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Goodman and Kruskal's Gamma requires two columns to analyze."
            );
        let u = this.validateInput(o, "ordinal", "Goodman and Kruskal's Gamma");
        if (!1 === u) return;
        let g = this.validateInput(l, "ordinal", "Goodman and Kruskal's Gamma");
        if (!1 === g) return;
        let h = this.reduceToPairs(o, l),
            M = h.valuesCombined,
            S = h.length,
            T = 0,
            C = 0;
        for (var N = 0; N < S - 1; N++)
            for (var I = N + 1; I < S; I++) {
                let P = M[N][o],
                    B = M[I][o],
                    U = M[N][l],
                    O = M[I][l];
                P === B ||
                    U === O ||
                    (_Mathsign(P - B) === _Mathsign(U - O) ? (T += 1) : (C += 1));
            }
        let V = (T - C) / (T + C),
            D = V * _Mathsqrt((T + C) / (S * (1 - V * V))),
            F = 1 - this.studentsTCumulativeValue(_Mathabs(D), S - 2);
        return {
            gamma: V,
            tStatistic: D,
            pOneTailed: F,
            pTwoTailed: 2 * F,
            missings: h.missings,
        };
    }),
    (Statistics.prototype.fisherTransformation = function(o) {
        return "undefined" == typeof o || !this.isNumeric(o) || -1 > o || 1 < o ?
            this.errorMessage(
                "Fisher transformation is only defined for a Pearson correlation coefficient within the interval of [-1, 1]."
            ) :
            Math.atanh(o) || 0.5 * _Mathlog((1 + o) / (1 - o));
    }),
    (Statistics.prototype.linearRegression = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Linear regression requires two columns to compare."
            );
        let u = this.validateInput(o, "interval", "linear regression");
        if (!1 === u) return;
        let g = this.validateInput(l, "interval", "linear regression");
        if (!1 === g) return;
        let h = this.reduceToPairs(u.data, g.data),
            M = h.valuesFirst,
            S = h.valuesSecond,
            T = h.missings,
            C = h.length;
        if (0 === C) return;
        let N = this.mean(M),
            I = this.mean(S),
            V = 0,
            D = 0,
            F = 0;
        for (var P = 0; P < C; P++) {
            let W = M[P] - N,
                K = S[P] - I;
            (F += W * K), (V += W * W), (D += K * K);
        }
        if (0 == V || 0 == D) return;
        let B = F / V,
            U = F / D,
            G = F / _Mathsqrt(V * D),
            A = G * G,
            L = 2 < C ? 1 - ((1 - A) * (C - 1)) / (C - 2) : void 0,
            E = (180 * Math.acos(G)) / _MathPI;
        return (
            90 < E && (E = 180 - E), {
                regressionFirst: { beta1: I - B * N, beta2: B },
                regressionSecond: { beta1: N - U * I, beta2: U },
                coefficientOfDetermination: A,
                coefficientOfDeterminationCorrected: L,
                correlationCoefficient: G,
                phi: E,
            }
        );
    }),
    (Statistics.prototype.normalProbabilityDensity = function(o, l = 0, u = 1) {
        if ("undefined" == typeof o)
            return this.errorMessage("Normal probability density: no x is given.");
        if (0 >= u)
            return this.errorMessage(
                "Normal probability density: variance must be larger than 0."
            );
        let g = -_Mathpow(o - l, 2) / (2 * u);
        return _Mathexp(g) / _Mathsqrt(2 * _MathPI * u);
    }),
    (Statistics.prototype.normalDistribution = function(o = 0, l = 1) {
        if (0 >= l)
            return this.errorMessage(
                "Normal distribution: variance must be larger than 0."
            );
        let u = 0,
            g = 1,
            h = {};
        for (; g >= this.epsilon &&
            ((g = this.normalProbabilityDensity(o + u, o, l)), !(g < this.epsilon));

        )
            (h[(o + u).toFixed(2)] = g), (h[(o - u).toFixed(2)] = g), (u += 0.01);
        return h;
    }),
    (Statistics.prototype.normalCumulativeValue = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage("Normal cumulative value: no z is given.");
        let l = o,
            u = o;
        for (var g = 1; g < this.zTableIterations; g++)
            (u *= (o * o) / (2 * g + 1)), (l += u);
        return (
            _Mathround(
                1e5 * (0.5 + (l / _Mathsqrt(2 * _MathPI)) * _Mathexp(-0.5 * o * o))
            ) / 1e5
        );
    }),
    (Statistics.prototype.normalCumulativeDistribution = function() {
        let o = this.zTable;
        if ("undefined" == typeof o) {
            o = {};
            for (var l = 0; 4.09 >= l; l += 0.01) {
                let u = _Mathround(100 * l) / 100;
                o[u.toFixed(2)] = this.normalCumulativeValue(l);
            }
            this.zTable = o;
        }
        return o;
    }),
    (Statistics.prototype.binomialProbabilityMass = function(
        o,
        l = 10,
        u = 0.5
    ) {
        return "undefined" == typeof o ?
            this.errorMessage(
                "Binomial probability mass: the required argument k was not given."
            ) :
            0 > o || !_NumberisInteger(o) ?
            this.errorMessage(
                "Binomial probability mass: k must be a non-negative integer."
            ) :
            0 > l || !_NumberisInteger(l) ?
            this.errorMessage(
                "Binomial probability mass: n must be a non-negative integer."
            ) :
            0 > u || 1 < u ?
            this.errorMessage(
                "Binomial probability mass: The probability must lie within the range of [0, 1]."
            ) :
            this.binomialCoefficient(l, o) *
            _Mathpow(u, o) *
            _Mathpow(1 - u, l - o);
    }),
    (Statistics.prototype.binomialDistribution = function(o = 10, l = 0.5) {
        if (0 > o || !_NumberisInteger(o))
            return this.errorMessage(
                "Binomial distribution: n must be a non-negative integer."
            );
        if (0 > l || 1 < l)
            return this.errorMessage(
                "Binomial distribution: The probability must lie within the range of [0, 1]."
            );
        let u = 0,
            g = 0,
            h = 0,
            M = [],
            S = 1;
        for (; u <= o;)
            (g = S * _Mathpow(l, u) * _Mathpow(1 - l, o - u)),
            M.push(g),
            (h += g),
            u++,
            (S = (S * (o + 1 - u)) / u);
        return M;
    }),
    (Statistics.prototype.binomialCumulativeValue = function(
        o,
        l = 10,
        u = 0.5
    ) {
        return "undefined" == typeof o ?
            this.errorMessage(
                "Binomial cumulative distribution value: the required argument k was not given."
            ) :
            0 > o || !_NumberisInteger(o) ?
            this.errorMessage(
                "Binomial cumulative distribution value: k must be a non-negative integer."
            ) :
            0 > l || !_NumberisInteger(l) ?
            this.errorMessage(
                "Binomial cumulative distribution value: n must be a non-negative integer."
            ) :
            0 > u || 1 < u ?
            this.errorMessage(
                "Binomial cumulative distribution value: The probability must lie within the range of [0, 1]."
            ) :
            this.regularisedBeta(1 - u, l - o, o + 1);
    }),
    (Statistics.prototype.binomialCumulativeDistribution = function(
        o = 10,
        l = 0.5
    ) {
        if (0 > o || !_NumberisInteger(o))
            return this.errorMessage(
                "Binomial cumulative distribution: n must be a non-negative integer."
            );
        if (0 > l || 1 < l)
            return this.errorMessage(
                "Binomial cumulative distribution: The probability must lie within the range of [0, 1]."
            );
        let u = this.binomialDistribution(o, l),
            g = 0;
        return u.map(function(h) {
            return (g = this.sumExact([g, h])), g;
        }, this);
    }),
    (Statistics.prototype.poissonProbabilityMass = function(o, l = 1) {
        if ("undefined" == typeof o || !_NumberisInteger(o))
            return this.errorMessage(
                "Poisson probability mass: the required argument k must be an integer."
            );
        if (0 > o || 0 >= l)
            return this.errorMessage(
                "Poisson probability mass: Both k and lambda must be larger than 0."
            );
        if (10 < o) {
            let g = 1;
            for (var u = 1; u <= o; u++) g *= (l * _Mathexp(-l / o)) / u;
            return g;
        }
        return (_Mathexp(-l) * _Mathpow(l, o)) / this.factorial(o);
    }),
    (Statistics.prototype.poissonDistribution = function(o = 1) {
        if (0 >= o)
            return this.errorMessage(
                "Poisson distribution: Lambda must be larger than 0."
            );
        let l = 0,
            u = 0,
            g = [];
        for (; u < 1 - this.epsilon;) {
            let h = this.poissonProbabilityMass(l, o);
            g.push(h), (u += h), l++;
        }
        return g;
    }),
    (Statistics.prototype.poissonCumulativeValue = function(o, l = 1) {
        if ("undefined" == typeof o || !_NumberisInteger(o))
            return this.errorMessage(
                "Poisson cumulative distribution: The number of cumulative events k must be supplied."
            );
        if (0 > o || 0 >= l)
            return this.errorMessage(
                "Poisson distribution: Both k and lambda must be larger than 0."
            );
        let u = this.poissonDistribution(l);
        return o < u.length - 1 ? this.sumExact(u.slice(0, o + 1)) : 1;
    }),
    (Statistics.prototype.poissonCumulativeDistribution = function(o = 1) {
        if (0 >= o)
            return this.errorMessage(
                "Poisson distribution: lambda must be larger than 0."
            );
        let l = this.poissonDistribution(o),
            u = 0;
        return l.map(function(g) {
            return (u = this.sumExact([u, g])), u;
        }, this);
    }),
    (Statistics.prototype.studentsTProbabilityDensity = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Student's t-distribution probability density: no value for degrees of freedom (df) given."
            );
        if (0 >= l)
            return this.errorMessage(
                "Student's t-distribution probability density: degrees of freedom (df) must be larger than 0."
            );
        let u = _Mathpow(1 + (o * o) / l, -0.5 * (l + 1));
        return (u /= _Mathsqrt(l) * this.beta(0.5, 0.5 * l)), u;
    }),
    (Statistics.prototype.studentsTDistribution = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage(
                "Student's t-distribution: no value for degrees of freedom (df) given."
            );
        if (0 >= o)
            return this.errorMessage(
                "Student's t-distribution: degrees of freedom (df) must be larger than 0."
            );
        let l = 0,
            u = 1,
            g = {};
        for (; u >= this.epsilon &&
            ((u = this.studentsTProbabilityDensity(l, o)), !(u < this.epsilon));

        )
            (g[l.toFixed(2)] = u), (g[(-l).toFixed(2)] = u), (l += 0.01);
        return g;
    }),
    (Statistics.prototype.studentsTCumulativeValue = function(o, l) {
        return "undefined" == typeof l ?
            this.errorMessage(
                "Student's cumulative t-distribution value: no value for degrees of freedom (df) given."
            ) :
            0 >= l ?
            this.errorMessage(
                "Student's cumulative t-distribution value: degrees of freedom (df) must be larger than 0."
            ) :
            0 >= o ?
            0.5 * this.regularisedBeta(l / (o * o + l), 0.5 * l, 0.5) :
            0.5 + 0.5 * this.regularisedBeta((o * o) / (o * o + l), 0.5, 0.5 * l);
    }),
    (Statistics.prototype.studentsTCumulativeDistribution = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage(
                "Student's cumulative t-distribution: no value for degrees of freedom (df) given."
            );
        if (0 >= o)
            return this.errorMessage(
                "Student's cumulative t-distribution: degrees of freedom (df) must be larger than 0."
            );
        let l = 0,
            u = 0,
            g = -0.1,
            h = {};
        for (; u <= 1 - this.epsilon &&
            ((u = this.studentsTCumulativeValue(l, o)), !(g >= u));

        )
            (h[l.toFixed(2)] = u), (h[(-l).toFixed(2)] = u), (g = u), (l += 0.01);
        return h;
    }),
    (Statistics.prototype.chiSquaredProbabilityDensity = function(o, l) {
        return "undefined" == typeof l ?
            this.errorMessage(
                "Chi squared distribution probability density: no value for degrees of freedom (df) given."
            ) :
            0 >= l ?
            this.errorMessage(
                "Chi squared distribution probability density: degrees of freedom (df) must be larger than 0."
            ) :
            0 >= o ?
            0 :
            (_Mathpow(o, 0.5 * l - 1) * _Mathexp(-0.5 * o)) /
            (_Mathpow(2, 0.5 * l) * this.gamma(0.5 * l, !0));
    }),
    (Statistics.prototype.chiSquaredDistribution = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage(
                "Chi squared distribution: no value for degrees of freedom (df) given."
            );
        if (0 >= o)
            return this.errorMessage(
                "Chi squared distribution: degrees of freedom (df) must be larger than 0."
            );
        let l = 0.01,
            u = 1,
            g = { "0.00": 0 };
        for (;
            ((2 >= o && u >= this.epsilon) ||
                (2 < o && l <= o - 2) ||
                (2 < o && u >= this.epsilon)) &&
            ((u = this.chiSquaredProbabilityDensity(l, o)), !(u < this.epsilon && l >= o - 2 && 2 < o));

        )
            (g[l.toFixed(2)] = u), (l += 0.01);
        return g;
    }),
    (Statistics.prototype.chiSquaredCumulativeValue = function(o, l) {
        return "undefined" == typeof l ?
            this.errorMessage(
                "Chi squared cumulative distribution value: no value for degrees of freedom (df) given."
            ) :
            0 >= l ?
            this.errorMessage(
                "Chi squared cumulative distribution value: degrees of freedom (df) must be larger than 0."
            ) :
            0 >= o ?
            0 :
            this.regularisedGamma(0.5 * l, 0.5 * o);
    }),
    (Statistics.prototype.chiSquaredCumulativeDistribution = function(o) {
        if ("undefined" == typeof o)
            return this.errorMessage(
                "Chi squared cumulative distribution: no value for degrees of freedom (df) given."
            );
        if (0 >= o)
            return this.errorMessage(
                "Chi squared cumulative distribution: degrees of freedom (df) must be larger than 0."
            );
        let l = 0.01,
            u = 0,
            g = { "0.00": 0 };
        for (; u <= 1 - this.epsilon &&
            ((u = this.chiSquaredCumulativeValue(l, o)), !(u >= 1 - this.epsilon));

        )
            0 < u && (g[l.toFixed(2)] = u), (l += 0.01);
        return g;
    }),
    (Statistics.prototype.barnardsTest = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage("Barnard's test: No data was supplied.");
        let u = this.contingencyTable(o, l, "Barnard's test");
        if ("undefined" == typeof u) return;
        let { a: g, b: h, c: M, d: S } = u,
        T = g + h + M + S;
        if (T > this.maxBarnardsN)
            return this.errorMessage(
                "Barnard's test is a resource-intensive method, relative to the total number of datasets to analyze. There are " +
                T +
                " datasets in the supplied data, exceeding the maxinum of " +
                this.maxBarnardsN +
                '. You can change this number by changing the "maxBarnardsN" option (be cautious).'
            );
        var C = (g + h) / T;
        (C = C * (1 - C) * (1 / (g + M) + 1 / (h + S))),
        (C = (h / (h + S) - g / (g + M)) / _Mathsqrt(C)),
        isNaN(C) && (C = 0);
        let N = [];
        for (var I = 0; 1 > I; I = this.sumExact([I, 1e-3])) {
            let F = 0;
            for (var V = 0; V <= g + M; V++)
                for (var D = 0; D <= h + S; D++) {
                    let P = (V + D) / T;
                    if (
                        ((P = P * (1 - P) * (1 / (g + M) + 1 / (h + S))),
                            (P = (V / (g + M) - D / (h + S)) / _Mathsqrt(P)), !isNaN(P) && _Mathabs(P) >= _Mathabs(C))
                    ) {
                        let B =
                            this.binomialCoefficient(g + M, V) *
                            this.binomialCoefficient(h + S, D);
                        (B *= _Mathpow(I, V + D) * _Mathpow(1 - I, T - V - D)),
                        (F += isNaN(B) ? 0 : B);
                    }
                }
            N.push({ nuisance: I, significance: F });
        }
        return (
            (N = this.sortDataByColumn("significance", { data: N, order: "desc" })), {
                wald: C,
                nuisance: N[0].nuisance,
                pOneTailed: 0.5 * N[0].significance,
                pTwoTailed: N[0].significance,
            }
        );
    }),
    (Statistics.prototype.binomialTest = function(o, l, u = 0.5) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Binomial test requires the data to test and a value which is hypotethised to be observed with a probability of alpha."
            );
        if (0 > u || 1 < u)
            return this.errorMessage(
                "Binomial test is only defined for probabilities alpha with alpha \u2265 0 and alpha \u2266 1."
            );
        let g = this.getScale(o);
        if ("interval" === g || "metric" === g)
            return this.errorMessage(
                "Binomial test is only defined for data of nominal or ordinal dichotomic scale."
            );
        let h = this.validateInput(o, "nominal", "binomial test");
        if (!1 !== h) {
            let M = this.getUniqueValues(h.data);
            if (2 < M.length)
                return this.errorMessage(
                    "Binomial test is only defined for dichotomic data. The supplied data has " +
                    M.length +
                    " unique values."
                );
            if (2 === M.length && 0 > M.indexOf(l))
                return this.errorMessage(
                    'The value "' + l + '" was not found in the supplied data.'
                );
            let S = h.data.filter(function(I) {
                    return I === l;
                }).length,
                T = this.binomialProbabilityMass(S, h.length, u),
                C = this.binomialCumulativeValue(S - 1, h.length, u),
                N = 1 - C - T;
            return {
                pExactly: T,
                pFewer: C,
                pAtMost: C + T,
                pMore: N,
                pAtLeast: N + T,
            };
        }
    }),
    (Statistics.prototype.signTest = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage("Sign test: No data was supplied.");
        let u = this.validateInput(o, "ordinal", "sign test"),
            g = this.validateInput(l, "ordinal", "sign test");
        if (!1 === u || !1 === g) return;
        if (0 === u.length || 0 === g.length) return;
        let h = this.reduceToPairs(u.data, g.data),
            M = h.missings,
            S = h.length,
            T = h.valuesFirst,
            C = h.valuesSecond,
            N = 0;
        for (var I = 0; I < S; I++) T[I] > C[I] && (N += 1);
        let V = this.binomialProbabilityMass(N, S),
            D = this.binomialCumulativeValue(N - 1, S),
            F = 1 - D - V;
        return {
            positives: N,
            pExactly: V,
            pFewer: D,
            pAtMost: D + V,
            pMore: F,
            pAtLeast: F + V,
        };
    }),
    (Statistics.prototype.fishersExactTest = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Fisher's exact test requires two columns to analyze."
            );
        let u = this.contingencyTable(o, l, "Fisher's exact test");
        if ("undefined" != typeof u) {
            let { a: g, b: h, c: M, d: S } = u,
            T =
                (this.binomialCoefficient(g + h, g) *
                    this.binomialCoefficient(M + S, M)) /
                this.binomialCoefficient(g + h + M + S, g + M);
            return T;
        }
    }),
    (Statistics.prototype.mannWhitneyU = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Mann-Whitney-U test requires two columns to analyze."
            );
        let u = this.validateInput(o, "nominal", "Mann-Whitney-U test"),
            g = this.validateInput(l, "ordinal", "Mann-Whitney-U test");
        if (!1 === u || !1 === g) return;
        if (0 === u.length || 0 === g.length) return;
        let h = this.sort(g.data),
            M = this.getUniqueValues(u.data);
        if (2 !== M.length)
            return this.errorMessage(
                'The Mann-Whitney-U test requires the independent variable to have exactly two unique values. Variable "' +
                independentValue +
                '" has ' +
                M.length +
                " different values: " +
                u.data.join(", ")
            );
        let S = this.assignRanks(l),
            T = S.reduce((O, R) => {
                return R[o] === M[0] ? O + R["rank-" + l] : O;
            }, 0),
            C = S.reduce((O, R) => {
                return R[o] === M[0] ? O + 1 : O;
            }, 0),
            N = S.reduce((O, R) => {
                return R[o] === M[1] ? O + R["rank-" + l] : O;
            }, 0),
            I = S.reduce((O, R) => {
                return R[o] === M[1] ? O + 1 : O;
            }, 0),
            F = Math.min(C * (0.5 * C + I + 0.5) - T, I * (0.5 * I + C + 0.5) - N),
            P = (F - 0.5 * C * I) / _Mathsqrt((C * I * (C + I + 1)) / 12),
            B = 1 - this.normalCumulativeValue(_Mathabs(P));
        return { MannWhitneyU: F, zScore: P, pOneTailed: B, pTwoTailed: 2 * B };
    }),
    (Statistics.prototype.chiSquaredTest = function(o, l) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Chi Squared Test: You need to specify two variables, either of nominal or ordinal scale."
            );
        let u = this.getScale(o),
            g = this.getScale(l);
        if (
            ("ordinal" !== u && "nominal" !== u) ||
            ("ordinal" !== g && "nominal" !== g)
        )
            return this.errorMessage(
                "Chi Squared Test: Both variables need to be either of nominal or ordinal scale."
            );
        let h = this.contingencyTable(o, l);
        if ("undefined" == typeof h)
            return this.errorMessage(
                "Chi Squared Test: Failed to create a contingency table. Please make sure your data is prepared correctly."
            );
        h = h.detailled;
        let M = h.total.total,
            S = 0,
            T = Object.keys(h).length - 1;
        for (var C in ((T = (T - 1) * (Object.keys(h.total).length - T - 2)), h))
            if (this.has(h, C) && "total" != C) {
                let V = h[C].total;
                for (var N in h[C])
                    if (this.has(h[C], N) && "total" != N) {
                        let D = h.total[N],
                            F = (V * D) / M;
                        S += _Mathpow(h[C][N] - F, 2) / F;
                    }
            }
        let I;
        return (
            (I = 0 > S || 1 > T ? 0 : 1 - this.chiSquaredCumulativeValue(S, T)), { PearsonChiSquared: S, degreesOfFreedom: T, significance: I }
        );
    }),
    (Statistics.prototype.studentsTTestOneSample = function(o, l) {
        if ("undefined" == typeof l || !this.isNumeric(l))
            return this.errorMessage(
                "Student's t-test (one sample) requires data and the mean for which the null hypothesis should hold true."
            );
        let u = this.validateInput(o, "interval", "student's t-test (one sample)");
        if (!1 === u) return;
        if (0 === u.length) return;
        let g = this.mean(u.data),
            h = this.standardDeviation(u.data),
            M = (_Mathsqrt(u.length) * (g - l)) / h,
            S = u.length - 1,
            T = this.studentsTCumulativeValue(_Mathabs(M), S);
        return (
            0.5 < T && (T = 1 - T), { tStatistic: M, degreesOfFreedom: S, pOneSided: T, pTwoSided: 2 * T }
        );
    }),
    (Statistics.prototype.studentsTTestTwoSamples = function(
        o,
        l, { nullHypothesisDifference: u = 0, dependent: g = !1 } = {}
    ) {
        if ("undefined" == typeof l)
            return this.errorMessage(
                "Student's t-test (two sample) requires data for two columns and the difference of their means for which the null hypothesis should hold true."
            );
        let h = this.validateInput(o, "interval", "student's t-test (two sample)"),
            M = this.validateInput(l, "interval", "student's t-test (two sample)");
        if (!1 === h || !1 === M) return;
        let N,
            I,
            S = h.length,
            T = M.length,
            C = {};
        if (0 === S || 0 === T) return;
        if (g) {
            let F = this.reduceToPairs(h.data, M.data),
                P = F.valuesFirst,
                B = F.valuesSecond,
                U = 0,
                O = 0;
            for (var V = 0; V < F.length; V++) O += P[V] - B[V];
            O /= F.length;
            for (var V = 0; V < F.length; V++) U += _Mathpow(P[V] - B[V] - O, 2);
            (U = _Mathsqrt(U / (F.length - 1))),
            (N = (_Mathsqrt(S) * (O - u)) / U),
            (I = F.length - 1),
            (C = { tStatistic: N, degreesOfFreedom: I, missings: F.missings });
        } else {
            let F = this.mean(h.data),
                P = this.mean(M.data),
                B = this.variance(h.data),
                U = this.variance(M.data),
                O = _Mathsqrt(((S - 1) * B + (T - 1) * U) / (S + T - 2));
            (N = (F - P - u) / O),
            (N *= _Mathsqrt((S * T) / (S + T))),
            (I = S + T - 2),
            (C = { tStatistic: N, degreesOfFreedom: I });
        }
        let D = this.studentsTCumulativeValue(N, I);
        return 0.5 < D && (D = 1 - D), (C.pOneSided = D), (C.pTwoSided = 2 * D), C;
    }),
    (Statistics.prototype.gaussianError = function(o) {
        if ("undefined" == typeof o || !this.isNumeric(o))
            return this.errorMessage(
                "Gaussian Error Function: No valid value for x supplied. X needs to be numeric."
            );
        let l = 1 / (1 + 0.5 * _Mathabs(o)),
            u = -o * o -
            1.26551223 +
            1.00002368 * l +
            0.37409196 * l * l +
            0.09678418 * _Mathpow(l, 3) -
            0.18628806 * _Mathpow(l, 4) +
            0.27886807 * _Mathpow(l, 5) -
            1.13520398 * _Mathpow(l, 6) +
            1.48851587 * _Mathpow(l, 7) -
            0.82215223 * _Mathpow(l, 8) +
            0.17087277 * _Mathpow(l, 9);
        return (u = _Mathexp(u) * l), 0 <= o ? 1 - u : u - 1;
    }),
    (Statistics.prototype.inverseGaussianError = function(o) {
        if ("undefined" == typeof o || !this.isNumeric(o))
            return this.errorMessage(
                "Inverse Gaussian Error Function: No valid value for x supplied. X needs to be numeric."
            );
        if (1 < o)
            return this.errorMessage(
                "Inverse Gaussian Error Function: x can not be larger than 1."
            );
        if (-1 > o)
            return this.errorMessage(
                "Inverse Gaussian Error Function: x can not be smaller than -1."
            );
        var u,
            l = -_Mathlog((1 - o) * (1 + o));
        return (
            5 > l ?
            ((l -= 2.5),
                (u = +3.43273939e-7 + +2.81022636e-8 * l),
                (u = + -3.5233877e-6 + u * l),
                (u = + -4.39150654e-6 + u * l),
                (u = 2.1858087e-4 + u * l),
                (u = -0.00125372503 + u * l),
                (u = -0.00417768164 + u * l),
                (u = 0.246640727 + u * l),
                (u = 1.50140941 + u * l)) :
            ((l = _Mathsqrt(l) - 3),
                (u = 1.00950558e-4 - 2.00214257e-4 * l),
                (u = 0.00134934322 + u * l),
                (u = -0.00367342844 + u * l),
                (u = 0.00573950773 + u * l),
                (u = -0.0076224613 + u * l),
                (u = 0.00943887047 + u * l),
                (u = 1.00167406 + u * l),
                (u = 2.83297682 + u * l)),
            (u * o).toFixed(7)
        );
    }),
    (Statistics.prototype.probit = function(o) {
        return "undefined" != typeof o && this.isNumeric(o) ?
            0 > o || 1 < o ?
            this.errorMessage(
                "Probit is only defined for quantiles p with 1 \u2265 p \u2265 0."
            ) :
            0 === o ?
            -Infinity :
            1 === o ?
            Infinity :
            1.4142135623730951 * this.inverseGaussianError(2 * o - 1) :
            this.errorMessage(
                "Probit: No valid value for quantile supplied. quantile needs to be numeric."
            );
    }),
    (Statistics.prototype.fisherYatesShuffle = function(o, l = Math.random) {
        if ("undefined" == typeof o)
            return this.errorMessage("Fisher-Yates shuffle: No data given.");
        let u = this.validateInput(o, "nominal", "");
        if (!1 === u) return;
        let M,
            S,
            g = u.data,
            h = u.length;
        for (; h;)
            (S = _Mathfloor(l() * h--)), (M = g[h]), (g[h] = g[S]), (g[S] = M);
        return g;
    }),
    (Statistics.prototype.xorshift = function(o, l = 0) {
        if ("undefined" == typeof o || o.constructor !== Array || 4 !== o.length)
            return this.errorMessage(
                "Xorshift needs to be seeded with an array consisting of four Sample1."
            );
        if (!_NumberisInteger(l) || 0 > l)
            return this.errorMessage(
                "Xorshift: startIndex must be a non-negative integer."
            );
        const u = 4,
            g = 64;
        let h = 0,
            M = u,
            S = new Uint32Array(g);
        (S[0] = o[0]), (S[1] = o[1]), (S[2] = o[2]), (S[3] = o[3]);
        const T = function(I, V, D) {
            for (var F = V; F < D; F++) {
                let P = (I[0] ^ (I[0] << 11)) >>> 0;
                (I[0] = I[1]),
                (I[1] = I[2]),
                (I[2] = I[3]),
                (I[3] =
                    (((I[3] ^ (I[3] >>> 19)) >>> 0) ^ ((P ^ (P >>> 8)) >>> 0)) >>> 0),
                (I[F] = I[3]);
            }
            return I;
        };
        (this.next = function(I = !0) {
            let V = S[M];
            return (
                (h += 1), M++ >= g && ((M = u), T(S, u, g)), I ? V / 4294967296 : V
            );
        }),
        (S = T(S, u, g));
        for (var C = 0; C < l; C++) this.next();
    }),
    (Statistics.prototype.boxMuller = function(
        o = 0,
        l = 1, { randomSourceA: u = Math.random, randomSourceB: g = Math.random } = {}
    ) {
        let h = 0,
            M = 0,
            S = 0,
            T = 0;
        do(h = u()), (S += 1);
        while ((0 >= h || 1 <= h) && 50 > S);
        do(M = g()), (T += 1);
        while ((0 >= M || 1 <= M) && 50 > T);
        for (; 0 >= h || 1 <= h;) h = Math.random();
        for (; 0 >= M || 1 <= M;) M = Math.random();
        let C = _Mathsqrt(-2 * _Mathlog(h)) * Math.cos(2 * _MathPI * M);
        return C * l + o;
    }),
    (Statistics.prototype.ziggurat = function(o = 0, l = 1) {
        let u = 123456789,
            g = [128],
            h = [128],
            M = [128];
        const S = function(I, V) {
                let P,
                    B,
                    D = 3.442619855899,
                    F = 1 / D;
                for (;;) {
                    if (((P = I * g[V]), 0 === V)) {
                        for (P = -_Mathlog(C()) * F, B = -_Mathlog(C()); B + B < P * P;)
                            (P = -_Mathlog(C()) * F), (B = -_Mathlog(C()));
                        return 0 < I ? D + P : -D - P;
                    }
                    if (h[V] + C() * (h[V - 1] - h[V]) < _Mathexp(-0.5 * P * P)) return P;
                    if (((I = T()), (V = 127 & I), _Mathabs(I) < M[V])) return I * g[V];
                }
            },
            T = function() {
                let I = u,
                    V = u;
                return (
                    (V ^= V << 13), (V ^= V >>> 17), (V ^= V << 5), (u = V), 0 | (I + V)
                );
            },
            C = function() {
                return 0.5 * (1 + T() / -2147483648);
            };
        (function() {
            u ^= new Date().getTime();
            let I = 2147483648,
                V = 3.442619855899,
                D = V,
                F = 0.00991256303526217,
                P = F / _Mathexp(-0.5 * V * V);
            (M[0] = _Mathfloor((V * I) / P)),
            (M[1] = 0),
            (g[0] = P / I),
            (g[127] = V / I),
            (h[0] = 1),
            (h[127] = _Mathexp(-0.5 * V * V));
            for (var B = 126; 1 <= B; B--)
                (V = _Mathsqrt(-2 * _Mathlog(F / V + _Mathexp(-0.5 * V * V)))),
                (M[B + 1] = _Mathfloor((V * I) / D)),
                (D = V),
                (h[B] = _Mathexp(-0.5 * V * V)),
                (g[B] = V / I);
        })(),
        (this.next = function() {
            let I = T(),
                V = 127 & I,
                D = _Mathabs(I) < M[V] ? I * g[V] : S(I, V);
            return D * l + o;
        });
    });




//---------------------------------------------------------------------
// Start of function to clear field when 'Clear Data' button is pressed


function clearData() {
    document.getElementById("Sample_1").value = "";
    document.getElementById("Sample_2").value = "";
    document.getElementById("data-result-area").innerHTML = "";
    document.getElementById("myChart").innerHTML = "";


    const numSamples = parseInt(document.getElementById('numSamples').value);
    const sampleInputContainer = document.getElementById('sampleInputContainer');
    const sampleSelectionContainer = document.getElementById('sampleSelectionContainer');

    sampleInputContainer.innerHTML = '';
    sampleSelectionContainer.innerHTML = '';
    numSamples.innerHTML = '';
    var arrayInputDiv = document.getElementById("arrayInput");
    arrayInputDiv.innerHTML = "";

    var resultAreaDiv = document.getElementById("graph-result-area");
    resultAreaDiv.innerHTML = "";

    sessionStorage.clear();
}
// End of function to clear field when 'Clear Data' button is pressed
//---------------------------------------------------------------------




//---------------------------------------------------------------------
// Start of function to preserve field when 'Clear Data' button is pressed

document.addEventListener('DOMContentLoaded', function() {
    // your code here
    document.getElementById("Sample_1").value = sessionStorage.getItem("dataState");
    document.getElementById("Sample_2").value = sessionStorage.getItem("freqState");
    var numberObj = document.getElementById("Samp_le1");
    var freqObj = document.getElementById("Sample_2");

    numberObj.onchange = function() {
        let datastate = numberObj.value;
        sessionStorage.setItem("dataState", datastate)
        console.log(datastate)
    };

    freqObj.onchange = function() {
        let freqstate = freqObj.value;
        sessionStorage.setItem("freqState", freqstate)
    }

}, false);


// End of function to clear field when 'Clear Data' button is pressed
//---------------------------------------------------------------------



//myfunction starts here


function getInputData() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    // Validate the number of checkboxes selected
    if (checkboxes.length !== 2) {
        alert("Please select exactly two samples for plotting.");
        return;
    }

    // Get the sample IDs from the checkboxes
    const sampleIds = Array.from(checkboxes).map(checkbox => checkbox.value);

    // Getting data for the selected samples
    const lowerLimits = [];
    const upperLimits = [];

    sampleIds.forEach(sampleId => {
        const input = document.getElementById(sampleId);
        const rangeValues = input.value.trim().split(' ');

        rangeValues.forEach(range => {
            const [lower, upper] = range.split('-').map(Number);
            lowerLimits.push(lower);
            upperLimits.push(upper);
        });
    });

}




//---------------------------------------------------------------------
// Start of function to sanitizeData taken from input fields 
// this functions outputs a 2D array with inner array containing data-freqency pairs
function sanitizeData() {
    // extacting data points into an array from the string of Sample1
    let dataString = document.getElementById("Sample_1").value;
    let freqString = document.getElementById("Sample_2").value;

    // removing extra space char at the bigginnig and end of inputed data
    dataString = dataString.trim();
    freqString = freqString.trim();


    // removing extra space in-between the data values in the data strings
    dataString = dataString.replace(/\s+/g, ' ');
    freqString = freqString.replace(/\s+/g, ' ');

    // defining a test to check whether the data in class data or not
    let classtest = /\d+[-]\d+/

    // testing data string for classinput
    //if is is class data data we will return classdatafreq array if not we will return normal freqdataAray
    if (classtest.test(dataString)) {
        let dataArrayString = "";
        dataArrayString = dataString.split(" ");
        console.log(dataArrayString);
    }

    // making an num array from the string of point data 
    let dataArray = dataString.split(" ");
    for (let x = 0; x < dataArray.length; x++) { dataArray[x] = +dataArray[x]; };

    // making an num array from the string of freq data 
    let freqArray = freqString.split(" ");
    for (let x = 0; x < freqArray.length; x++) { freqArray[x] = +freqArray[x]; };

    // the variable defied below will be returned
    let freqDataArray = []
    _

    // checking if user has not inputed same number of data and Sample_2
    if (freqArray.length !== dataArray.length) {
        alert("number of data and freqencies don't match");
    } else {
        for (let k = 0; k < dataArray.length; k++) {
            let tempArray = []
            for (let i = freqArray[k]; i > 0; i--) {
                tempArray.push(dataArray[k]);
            }
            // tempArray.push(freqArray[k]);
            freqDataArray.push(tempArray);
        }
    }

    freqDataArray = freqDataArray.flat();
    // console.log(freqDataArray)
    return freqDataArray;
}
// End of function to sanitizeData taken from input fields 

//---------------------------------------------------------------------

// var Statistics = require('/path/to/statistics.js');


//---------------------------------------------------------------------
/////////////////////////
function getArray(id) {
    var dataInString = document.getElementById(id).value;
    var array = dataInString.split(' ');
    var result = array.map(str => parseInt(str, 10));
    return result;
}



function generateTableRows() {

    let table = document.getElementById("inputTable");

    let row = table.insertRow(4);

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);


    let x = table.rows.length;
    console.log(x)
    cell1.innerHTML = `<input type="text" class="datainput"> <input type="text" class="datainput">`;
    cell2.innerHTML = `<input type="text" class="freqinput">`;
}






var arraySize = 0;
var dataArray = [];

function splitInput(input) {
    var ranges = input.split(' ');
    var numOfRanges = ranges.length;

    ranges = ranges.map(function(range) {
        return range.split('-').map(Number);
    });

    return {
        ranges: ranges,
        numOfRanges: numOfRanges
    };
}