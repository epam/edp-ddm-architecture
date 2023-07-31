/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory)
    } else if (typeof exports === 'object') {
        /**
         * Node. Does not work with strict CommonJS, but
         * only CommonJS-like environments that support module.exports,
         * like Node.
         */
        module.exports = factory()
    } else {
        // Browser globals (root is window)
        factory()(root.lunr);
    }
}(this, function () {
    /**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */
    return function(lunr) {
        /* provides utilities for the included stemmers */
        lunr.stemmerSupport = {
            Among: function(s, substring_i, result, method) {
                this.toCharArray = function(s) {
                    var sLength = s.length, charArr = new Array(sLength);
                    for (var i = 0; i < sLength; i++)
                        charArr[i] = s.charCodeAt(i);
                    return charArr;
                };

                if ((!s && s != "") || (!substring_i && (substring_i != 0)) || !result)
                    throw ("Bad Among initialisation: s:" + s + ", substring_i: "
                        + substring_i + ", result: " + result);
                this.s_size = s.length;
                this.s = this.toCharArray(s);
                this.substring_i = substring_i;
                this.result = result;
                this.method = method;
            },
            SnowballProgram: function() {
                var current;
                return {
                    bra : 0,
                    ket : 0,
                    limit : 0,
                    cursor : 0,
                    limit_backward : 0,
                    setCurrent : function(word) {
                        current = word;
                        this.cursor = 0;
                        this.limit = word.length;
                        this.limit_backward = 0;
                        this.bra = this.cursor;
                        this.ket = this.limit;
                    },
                    getCurrent : function() {
                        var result = current;
                        current = null;
                        return result;
                    },
                    in_grouping : function(s, min, max) {
                        if (this.cursor < this.limit) {
                            var ch = current.charCodeAt(this.cursor);
                            if (ch <= max && ch >= min) {
                                ch -= min;
                                if (s[ch >> 3] & (0X1 << (ch & 0X7))) {
                                    this.cursor++;
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    in_grouping_b : function(s, min, max) {
                        if (this.cursor > this.limit_backward) {
                            var ch = current.charCodeAt(this.cursor - 1);
                            if (ch <= max && ch >= min) {
                                ch -= min;
                                if (s[ch >> 3] & (0X1 << (ch & 0X7))) {
                                    this.cursor--;
                                    return true;
                                }
                            }
                        }
                        return false;
                    },
                    out_grouping : function(s, min, max) {
                        if (this.cursor < this.limit) {
                            var ch = current.charCodeAt(this.cursor);
                            if (ch > max || ch < min) {
                                this.cursor++;
                                return true;
                            }
                            ch -= min;
                            if (!(s[ch >> 3] & (0X1 << (ch & 0X7)))) {
                                this.cursor++;
                                return true;
                            }
                        }
                        return false;
                    },
                    out_grouping_b : function(s, min, max) {
                        if (this.cursor > this.limit_backward) {
                            var ch = current.charCodeAt(this.cursor - 1);
                            if (ch > max || ch < min) {
                                this.cursor--;
                                return true;
                            }
                            ch -= min;
                            if (!(s[ch >> 3] & (0X1 << (ch & 0X7)))) {
                                this.cursor--;
                                return true;
                            }
                        }
                        return false;
                    },
                    eq_s : function(s_size, s) {
                        if (this.limit - this.cursor < s_size)
                            return false;
                        for (var i = 0; i < s_size; i++)
                            if (current.charCodeAt(this.cursor + i) != s.charCodeAt(i))
                                return false;
                        this.cursor += s_size;
                        return true;
                    },
                    eq_s_b : function(s_size, s) {
                        if (this.cursor - this.limit_backward < s_size)
                            return false;
                        for (var i = 0; i < s_size; i++)
                            if (current.charCodeAt(this.cursor - s_size + i) != s
                                .charCodeAt(i))
                                return false;
                        this.cursor -= s_size;
                        return true;
                    },
                    find_among : function(v, v_size) {
                        var i = 0, j = v_size, c = this.cursor, l = this.limit, common_i = 0, common_j = 0, first_key_inspected = false;
                        while (true) {
                            var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
                                ? common_i
                                : common_j, w = v[k];
                            for (var i2 = common; i2 < w.s_size; i2++) {
                                if (c + common == l) {
                                    diff = -1;
                                    break;
                                }
                                diff = current.charCodeAt(c + common) - w.s[i2];
                                if (diff)
                                    break;
                                common++;
                            }
                            if (diff < 0) {
                                j = k;
                                common_j = common;
                            } else {
                                i = k;
                                common_i = common;
                            }
                            if (j - i <= 1) {
                                if (i > 0 || j == i || first_key_inspected)
                                    break;
                                first_key_inspected = true;
                            }
                        }
                        while (true) {
                            var w = v[i];
                            if (common_i >= w.s_size) {
                                this.cursor = c + w.s_size;
                                if (!w.method)
                                    return w.result;
                                var res = w.method();
                                this.cursor = c + w.s_size;
                                if (res)
                                    return w.result;
                            }
                            i = w.substring_i;
                            if (i < 0)
                                return 0;
                        }
                    },
                    find_among_b : function(v, v_size) {
                        var i = 0, j = v_size, c = this.cursor, lb = this.limit_backward, common_i = 0, common_j = 0, first_key_inspected = false;
                        while (true) {
                            var k = i + ((j - i) >> 1), diff = 0, common = common_i < common_j
                                ? common_i
                                : common_j, w = v[k];
                            for (var i2 = w.s_size - 1 - common; i2 >= 0; i2--) {
                                if (c - common == lb) {
                                    diff = -1;
                                    break;
                                }
                                diff = current.charCodeAt(c - 1 - common) - w.s[i2];
                                if (diff)
                                    break;
                                common++;
                            }
                            if (diff < 0) {
                                j = k;
                                common_j = common;
                            } else {
                                i = k;
                                common_i = common;
                            }
                            if (j - i <= 1) {
                                if (i > 0 || j == i || first_key_inspected)
                                    break;
                                first_key_inspected = true;
                            }
                        }
                        while (true) {
                            var w = v[i];
                            if (common_i >= w.s_size) {
                                this.cursor = c - w.s_size;
                                if (!w.method)
                                    return w.result;
                                var res = w.method();
                                this.cursor = c - w.s_size;
                                if (res)
                                    return w.result;
                            }
                            i = w.substring_i;
                            if (i < 0)
                                return 0;
                        }
                    },
                    replace_s : function(c_bra, c_ket, s) {
                        var adjustment = s.length - (c_ket - c_bra), left = current
                            .substring(0, c_bra), right = current.substring(c_ket);
                        current = left + s + right;
                        this.limit += adjustment;
                        if (this.cursor >= c_ket)
                            this.cursor += adjustment;
                        else if (this.cursor > c_bra)
                            this.cursor = c_bra;
                        return adjustment;
                    },
                    slice_check : function() {
                        if (this.bra < 0 || this.bra > this.ket || this.ket > this.limit
                            || this.limit > current.length)
                            throw ("faulty slice operation");
                    },
                    slice_from : function(s) {
                        this.slice_check();
                        this.replace_s(this.bra, this.ket, s);
                    },
                    slice_del : function() {
                        this.slice_from("");
                    },
                    insert : function(c_bra, c_ket, s) {
                        var adjustment = this.replace_s(c_bra, c_ket, s);
                        if (c_bra <= this.bra)
                            this.bra += adjustment;
                        if (c_bra <= this.ket)
                            this.ket += adjustment;
                    },
                    slice_to : function() {
                        this.slice_check();
                        return current.substring(this.bra, this.ket);
                    },
                    eq_v_b : function(s) {
                        return this.eq_s_b(s.length, s);
                    }
                };
            }
        };

        lunr.trimmerSupport = {
            generateTrimmer: function(wordCharacters) {
                var startRegex = new RegExp("^[^" + wordCharacters + "]+")
                var endRegex = new RegExp("[^" + wordCharacters + "]+$")

                return function(token) {
                    // for lunr version 2
                    if (typeof token.update === "function") {
                        return token.update(function (s) {
                            return s
                                .replace(startRegex, '')
                                .replace(endRegex, '');
                        })
                    } else { // for lunr version 1
                        return token
                            .replace(startRegex, '')
                            .replace(endRegex, '');
                    }
                };
            }
        }
    }
}));
/*!
 * Lunr languages, `Russian` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else if (typeof exports === 'object') {
    /**
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    factory()(root.lunr);
  }
}(this, function() {
  /**
   * Just return a value to define the module export.
   * This example returns an object, but the module
   * can return a function as the exported value.
   */
  return function(lunr) {
    /* throw error if lunr is not yet included */
    if ('undefined' === typeof lunr) {
      throw new Error('Lunr is not present. Please include / require Lunr before this script.');
    }

    /* throw error if lunr stemmer support is not yet included */
    if ('undefined' === typeof lunr.stemmerSupport) {
      throw new Error('Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.');
    }

    /* register specific locale function */
    lunr.ru = function() {
      this.pipeline.reset();
      this.pipeline.add(
        lunr.ru.trimmer,
        lunr.ru.stopWordFilter,
        lunr.ru.stemmer
      );

      // for lunr version 2
      // this is necessary so that every searched word is also stemmed before
      // in lunr <= 1 this is not needed, as it is done using the normal pipeline
      if (this.searchPipeline) {
        this.searchPipeline.reset();
        this.searchPipeline.add(lunr.ru.stemmer)
      }
    };

    /* lunr trimmer function */
    lunr.ru.wordCharacters = "\u0400-\u0484\u0487-\u052F\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69F\uFE2E\uFE2F";
    lunr.ru.trimmer = lunr.trimmerSupport.generateTrimmer(lunr.ru.wordCharacters);

    lunr.Pipeline.registerFunction(lunr.ru.trimmer, 'trimmer-ru');

    /* lunr stemmer function */
    lunr.ru.stemmer = (function() {
      /* create the wrapped stemmer object */
      var Among = lunr.stemmerSupport.Among,
        SnowballProgram = lunr.stemmerSupport.SnowballProgram,
        st = new function RussianStemmer() {
          var a_0 = [new Among("\u0432", -1, 1), new Among("\u0438\u0432", 0, 2),
              new Among("\u044B\u0432", 0, 2),
              new Among("\u0432\u0448\u0438", -1, 1),
              new Among("\u0438\u0432\u0448\u0438", 3, 2),
              new Among("\u044B\u0432\u0448\u0438", 3, 2),
              new Among("\u0432\u0448\u0438\u0441\u044C", -1, 1),
              new Among("\u0438\u0432\u0448\u0438\u0441\u044C", 6, 2),
              new Among("\u044B\u0432\u0448\u0438\u0441\u044C", 6, 2)
            ],
            a_1 = [
              new Among("\u0435\u0435", -1, 1), new Among("\u0438\u0435", -1, 1),
              new Among("\u043E\u0435", -1, 1), new Among("\u044B\u0435", -1, 1),
              new Among("\u0438\u043C\u0438", -1, 1),
              new Among("\u044B\u043C\u0438", -1, 1),
              new Among("\u0435\u0439", -1, 1), new Among("\u0438\u0439", -1, 1),
              new Among("\u043E\u0439", -1, 1), new Among("\u044B\u0439", -1, 1),
              new Among("\u0435\u043C", -1, 1), new Among("\u0438\u043C", -1, 1),
              new Among("\u043E\u043C", -1, 1), new Among("\u044B\u043C", -1, 1),
              new Among("\u0435\u0433\u043E", -1, 1),
              new Among("\u043E\u0433\u043E", -1, 1),
              new Among("\u0435\u043C\u0443", -1, 1),
              new Among("\u043E\u043C\u0443", -1, 1),
              new Among("\u0438\u0445", -1, 1), new Among("\u044B\u0445", -1, 1),
              new Among("\u0435\u044E", -1, 1), new Among("\u043E\u044E", -1, 1),
              new Among("\u0443\u044E", -1, 1), new Among("\u044E\u044E", -1, 1),
              new Among("\u0430\u044F", -1, 1), new Among("\u044F\u044F", -1, 1)
            ],
            a_2 = [
              new Among("\u0435\u043C", -1, 1), new Among("\u043D\u043D", -1, 1),
              new Among("\u0432\u0448", -1, 1),
              new Among("\u0438\u0432\u0448", 2, 2),
              new Among("\u044B\u0432\u0448", 2, 2), new Among("\u0449", -1, 1),
              new Among("\u044E\u0449", 5, 1),
              new Among("\u0443\u044E\u0449", 6, 2)
            ],
            a_3 = [
              new Among("\u0441\u044C", -1, 1), new Among("\u0441\u044F", -1, 1)
            ],
            a_4 = [
              new Among("\u043B\u0430", -1, 1),
              new Among("\u0438\u043B\u0430", 0, 2),
              new Among("\u044B\u043B\u0430", 0, 2),
              new Among("\u043D\u0430", -1, 1),
              new Among("\u0435\u043D\u0430", 3, 2),
              new Among("\u0435\u0442\u0435", -1, 1),
              new Among("\u0438\u0442\u0435", -1, 2),
              new Among("\u0439\u0442\u0435", -1, 1),
              new Among("\u0435\u0439\u0442\u0435", 7, 2),
              new Among("\u0443\u0439\u0442\u0435", 7, 2),
              new Among("\u043B\u0438", -1, 1),
              new Among("\u0438\u043B\u0438", 10, 2),
              new Among("\u044B\u043B\u0438", 10, 2), new Among("\u0439", -1, 1),
              new Among("\u0435\u0439", 13, 2), new Among("\u0443\u0439", 13, 2),
              new Among("\u043B", -1, 1), new Among("\u0438\u043B", 16, 2),
              new Among("\u044B\u043B", 16, 2), new Among("\u0435\u043C", -1, 1),
              new Among("\u0438\u043C", -1, 2), new Among("\u044B\u043C", -1, 2),
              new Among("\u043D", -1, 1), new Among("\u0435\u043D", 22, 2),
              new Among("\u043B\u043E", -1, 1),
              new Among("\u0438\u043B\u043E", 24, 2),
              new Among("\u044B\u043B\u043E", 24, 2),
              new Among("\u043D\u043E", -1, 1),
              new Among("\u0435\u043D\u043E", 27, 2),
              new Among("\u043D\u043D\u043E", 27, 1),
              new Among("\u0435\u0442", -1, 1),
              new Among("\u0443\u0435\u0442", 30, 2),
              new Among("\u0438\u0442", -1, 2), new Among("\u044B\u0442", -1, 2),
              new Among("\u044E\u0442", -1, 1),
              new Among("\u0443\u044E\u0442", 34, 2),
              new Among("\u044F\u0442", -1, 2), new Among("\u043D\u044B", -1, 1),
              new Among("\u0435\u043D\u044B", 37, 2),
              new Among("\u0442\u044C", -1, 1),
              new Among("\u0438\u0442\u044C", 39, 2),
              new Among("\u044B\u0442\u044C", 39, 2),
              new Among("\u0435\u0448\u044C", -1, 1),
              new Among("\u0438\u0448\u044C", -1, 2), new Among("\u044E", -1, 2),
              new Among("\u0443\u044E", 44, 2)
            ],
            a_5 = [
              new Among("\u0430", -1, 1), new Among("\u0435\u0432", -1, 1),
              new Among("\u043E\u0432", -1, 1), new Among("\u0435", -1, 1),
              new Among("\u0438\u0435", 3, 1), new Among("\u044C\u0435", 3, 1),
              new Among("\u0438", -1, 1), new Among("\u0435\u0438", 6, 1),
              new Among("\u0438\u0438", 6, 1),
              new Among("\u0430\u043C\u0438", 6, 1),
              new Among("\u044F\u043C\u0438", 6, 1),
              new Among("\u0438\u044F\u043C\u0438", 10, 1),
              new Among("\u0439", -1, 1), new Among("\u0435\u0439", 12, 1),
              new Among("\u0438\u0435\u0439", 13, 1),
              new Among("\u0438\u0439", 12, 1), new Among("\u043E\u0439", 12, 1),
              new Among("\u0430\u043C", -1, 1), new Among("\u0435\u043C", -1, 1),
              new Among("\u0438\u0435\u043C", 18, 1),
              new Among("\u043E\u043C", -1, 1), new Among("\u044F\u043C", -1, 1),
              new Among("\u0438\u044F\u043C", 21, 1), new Among("\u043E", -1, 1),
              new Among("\u0443", -1, 1), new Among("\u0430\u0445", -1, 1),
              new Among("\u044F\u0445", -1, 1),
              new Among("\u0438\u044F\u0445", 26, 1), new Among("\u044B", -1, 1),
              new Among("\u044C", -1, 1), new Among("\u044E", -1, 1),
              new Among("\u0438\u044E", 30, 1), new Among("\u044C\u044E", 30, 1),
              new Among("\u044F", -1, 1), new Among("\u0438\u044F", 33, 1),
              new Among("\u044C\u044F", 33, 1)
            ],
            a_6 = [
              new Among("\u043E\u0441\u0442", -1, 1),
              new Among("\u043E\u0441\u0442\u044C", -1, 1)
            ],
            a_7 = [
              new Among("\u0435\u0439\u0448\u0435", -1, 1),
              new Among("\u043D", -1, 2), new Among("\u0435\u0439\u0448", -1, 1),
              new Among("\u044C", -1, 3)
            ],
            g_v = [33, 65, 8, 232],
            I_p2, I_pV, sbp = new SnowballProgram();
          this.setCurrent = function(word) {
            sbp.setCurrent(word);
          };
          this.getCurrent = function() {
            return sbp.getCurrent();
          };

          function habr3() {
            while (!sbp.in_grouping(g_v, 1072, 1103)) {
              if (sbp.cursor >= sbp.limit)
                return false;
              sbp.cursor++;
            }
            return true;
          }

          function habr4() {
            while (!sbp.out_grouping(g_v, 1072, 1103)) {
              if (sbp.cursor >= sbp.limit)
                return false;
              sbp.cursor++;
            }
            return true;
          }

          function r_mark_regions() {
            I_pV = sbp.limit;
            I_p2 = I_pV;
            if (habr3()) {
              I_pV = sbp.cursor;
              if (habr4())
                if (habr3())
                  if (habr4())
                    I_p2 = sbp.cursor;
            }
          }

          function r_R2() {
            return I_p2 <= sbp.cursor;
          }

          function habr2(a, n) {
            var among_var, v_1;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a, n);
            if (among_var) {
              sbp.bra = sbp.cursor;
              switch (among_var) {
                case 1:
                  v_1 = sbp.limit - sbp.cursor;
                  if (!sbp.eq_s_b(1, "\u0430")) {
                    sbp.cursor = sbp.limit - v_1;
                    if (!sbp.eq_s_b(1, "\u044F"))
                      return false;
                  }
                  case 2:
                    sbp.slice_del();
                    break;
              }
              return true;
            }
            return false;
          }

          function r_perfective_gerund() {
            return habr2(a_0, 9);
          }

          function habr1(a, n) {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a, n);
            if (among_var) {
              sbp.bra = sbp.cursor;
              if (among_var == 1)
                sbp.slice_del();
              return true;
            }
            return false;
          }

          function r_adjective() {
            return habr1(a_1, 26);
          }

          function r_adjectival() {
            var among_var;
            if (r_adjective()) {
              habr2(a_2, 8);
              return true;
            }
            return false;
          }

          function r_reflexive() {
            return habr1(a_3, 2);
          }

          function r_verb() {
            return habr2(a_4, 46);
          }

          function r_noun() {
            habr1(a_5, 36);
          }

          function r_derivational() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_6, 2);
            if (among_var) {
              sbp.bra = sbp.cursor;
              if (r_R2() && among_var == 1)
                sbp.slice_del();
            }
          }

          function r_tidy_up() {
            var among_var;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_7, 4);
            if (among_var) {
              sbp.bra = sbp.cursor;
              switch (among_var) {
                case 1:
                  sbp.slice_del();
                  sbp.ket = sbp.cursor;
                  if (!sbp.eq_s_b(1, "\u043D"))
                    break;
                  sbp.bra = sbp.cursor;
                case 2:
                  if (!sbp.eq_s_b(1, "\u043D"))
                    break;
                case 3:
                  sbp.slice_del();
                  break;
              }
            }
          }
          this.stem = function() {
            r_mark_regions();
            sbp.cursor = sbp.limit;
            if (sbp.cursor < I_pV)
              return false;
            sbp.limit_backward = I_pV;
            if (!r_perfective_gerund()) {
              sbp.cursor = sbp.limit;
              if (!r_reflexive())
                sbp.cursor = sbp.limit;
              if (!r_adjectival()) {
                sbp.cursor = sbp.limit;
                if (!r_verb()) {
                  sbp.cursor = sbp.limit;
                  r_noun();
                }
              }
            }
            sbp.cursor = sbp.limit;
            sbp.ket = sbp.cursor;
            if (sbp.eq_s_b(1, "\u0438")) {
              sbp.bra = sbp.cursor;
              sbp.slice_del();
            } else
              sbp.cursor = sbp.limit;
            r_derivational();
            sbp.cursor = sbp.limit;
            r_tidy_up();
            return true;
          }
        };

      /* and return a function that stems a word for the current locale */
      return function(token) {
        // for lunr version 2
        if (typeof token.update === "function") {
          return token.update(function(word) {
            st.setCurrent(word);
            st.stem();
            return st.getCurrent();
          })
        } else { // for lunr version <= 1
          st.setCurrent(token);
          st.stem();
          return st.getCurrent();
        }
      }
    })();

    lunr.Pipeline.registerFunction(lunr.ru.stemmer, 'stemmer-ru');

    lunr.ru.stopWordFilter = lunr.generateStopWordFilter('алло без близко более больше будем будет будете будешь будто буду будут будь бы бывает бывь был была были было быть в важная важное важные важный вам вами вас ваш ваша ваше ваши вверх вдали вдруг ведь везде весь вниз внизу во вокруг вон восемнадцатый восемнадцать восемь восьмой вот впрочем времени время все всегда всего всем всеми всему всех всею всю всюду вся всё второй вы г где говорил говорит год года году да давно даже далеко дальше даром два двадцатый двадцать две двенадцатый двенадцать двух девятнадцатый девятнадцать девятый девять действительно дел день десятый десять для до довольно долго должно другая другие других друго другое другой е его ее ей ему если есть еще ещё ею её ж же жизнь за занят занята занято заняты затем зато зачем здесь значит и из или им именно иметь ими имя иногда их к каждая каждое каждые каждый кажется как какая какой кем когда кого ком кому конечно которая которого которой которые который которых кроме кругом кто куда лет ли лишь лучше люди м мало между меля менее меньше меня миллионов мимо мира мне много многочисленная многочисленное многочисленные многочисленный мной мною мог могут мож может можно можхо мои мой мор мочь моя моё мы на наверху над надо назад наиболее наконец нам нами нас начала наш наша наше наши не него недавно недалеко нее ней нельзя нем немного нему непрерывно нередко несколько нет нею неё ни нибудь ниже низко никогда никуда ними них ничего но ну нужно нх о об оба обычно один одиннадцатый одиннадцать однажды однако одного одной около он она они оно опять особенно от отовсюду отсюда очень первый перед по под пожалуйста позже пока пор пора после посреди потом потому почему почти прекрасно при про просто против процентов пятнадцатый пятнадцать пятый пять раз разве рано раньше рядом с сам сама сами самим самими самих само самого самой самом самому саму свое своего своей свои своих свою сеаой себе себя сегодня седьмой сейчас семнадцатый семнадцать семь сих сказал сказала сказать сколько слишком сначала снова со собой собою совсем спасибо стал суть т та так такая также такие такое такой там твой твоя твоё те тебе тебя тем теми теперь тех то тобой тобою тогда того тоже только том тому тот тою третий три тринадцатый тринадцать ту туда тут ты тысяч у уж уже уметь хорошо хотеть хоть хотя хочешь часто чаще чего человек чем чему через четвертый четыре четырнадцатый четырнадцать что чтоб чтобы чуть шестнадцатый шестнадцать шестой шесть эта эти этим этими этих это этого этой этом этому этот эту я ﻿а'.split(' '));

    lunr.Pipeline.registerFunction(lunr.ru.stopWordFilter, 'stopWordFilter-ru');
  };
}))