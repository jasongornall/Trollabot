// Generated by CoffeeScript 1.8.0
var admin, async, auth, functions, password, rawjs, reddit, username, utils;

functions = require('firebase-functions');

admin = require('firebase-admin');

rawjs = require('raw.js');

async = require('async');

auth = require('basic-auth');

utils = require('./utils.js');

reddit = new rawjs('raw.js trollabot v:1.0.0');

admin.initializeApp(functions.config().firebase);

username = functions.config().reddit.username;

password = functions.config().reddit.password;

reddit.setupOAuth2(functions.config().reddit.oauth_key, functions.config().reddit.oauth_password);

exports.trollabot = functions.https.onRequest((function(_this) {
  return function(main_request, main_response) {
    var calculateUserScore, credentials, formatScore, gradbRawData, rTime, redditFunny, secondsToData;
    credentials = auth(main_request);
    rTime = function(callback, logMsg) {
      if (logMsg == null) {
        logMsg = '';
      }
      if (logMsg) {
        console.log(logMsg);
      }
      if (reddit != null ? reddit.getRateLimitDetails : void 0) {
        console.log(reddit.getRateLimitDetails());
      }
      return callback();
    };
    redditFunny = "\                                      TROLLABOT4\n\                                  LIFETROLLABOT4LIF\n\                              ETROLLABOT4LIFETROLLABOT\n\                      4LIFETROLLABOT4           LIFETROL\n\                   LABOT4LIFETRO                  LLABOT4\n\                 LIFETROLLABOT4L                   IFETRO\n\                 LLABOT4LIFETROLL                   ABOT4\n\                 LIFETROLLAB OT4LIF    ETROLLABOT4  LIFET\n\                 ROLLABOT4LIFETROLLA BOT4LIFETROLLAB OT4L\n\                 IFETROLLABOT4LIFE  TROLLABOT4LIFETROLLAB\n\                OT4LI  FETROLLABOT  4LIFETROLLABOT4LIFETR\n\               OLLABOT4LIFETROLLABO T4LIFETROLL ABOT4LIFE\n\              TROLLABOT4LIFETROLL   ABOT4LIFETROLLABOT4LI\n\             FETROLLABOT4LIFETROLLABOT4LIFETROLLA  BOT4L\n\            IFETR          OLLABOT4LIFETROLLA     BOT4LI\n\           FETRO                      LLABOT4     LIFETR\n\          OLLABO                                 T4LIFE\n\         TROLLA                                 BOT4LI\n\        FETROL                                  LABOT4\n\        LIFET                      ROLL        ABOT4L\n\        IFET                      ROLLA BOT   4LIFET\n\        ROLL                      ABOT4LIFET  ROLLA                         BOT4LIFET\n\       ROLLA                      BOT4LIFET  ROLLA                        BOT4LIFETROL\n\       LABOT                     4LIFETROLL ABOT4                       LIFETR    OLLA\n\       BOT4L                     IFETROLLA  BOT4L                     IFETROL    LABOT\n\       4LIFE                    TROLLABOT  4LIFET                   ROLLABO     T4LIF\n\       ETROL                    LABOT4LI   FETROLLABOT4LIFETROL   LABOT4L     IFETR\n\        OLLA                   BOT4LIFE    TROLLABOT4LIFETROLLABOT4LIFE      TROLL\n\        ABOT                   4LIFETR     OLLAB   OT4LI   FETROLLABO      T4LIFE\n\        TROL                  LABOT4LI      FET   ROLLABOT4LIFETROL      LABOT4\n\        LIFET               ROLLA BOT4L         IFETROLLABOT4LIFET     ROLLABO\n\         T4LI             FETRO  LLABOT4         LIFETROLLABOT4LIFET   ROLLABOT\n\         4LIFE            TROLLABOT4LIFE                     TROLLABO    T4LIFETRO\n\          LLABO            T4LIFETROLLA              BOT4       LIFETR  OLLA BOT4L\n\          IFETRO              LLAB                   OT4L        IFETRO  LLABOT4L\n\           IFETRO                                LLA              BOT4L    IFET\n\            ROLLABOT                            4LIF              ETROL     LABO\n\               T4LIFET                          ROLL              ABOT4LIFETROLL\n\     ABO        T4LIFETROL                       LABO           T4LIFETROLLABOT\n\    4LIFETR    OLLABOT4LIFETROLL                  ABO         T4LIFET    R\n\    OLLABOT4LIFETR OLLABOT4LIFETROLLABOT           4LIF    ETROLLA\n\    BOT4 LIFETROLLABOT4    LIFETROLLABOT4L IFETROLLABOT4LIFETROL\n\     LABO  T4LIFETROL         LABOT4LIFET ROLLABOT4LIFETROLLA\n\      BOT4   LIFETR         OLLABOT4LIFE TROLL ABOT4LIFETR\n\       OLLABOT4LI           FETROLLABOT  4LIF\n\        ETROLLA              BOT4LIFE   TROL\n\          LAB                OT4LIF    ETRO\n\                              LLABOT  4LIF\n\                               ETROLLABOT\n\                                 4LIFETR\n\                                   OLL\n";
    gradbRawData = function(user, callback) {
      var getList;
      getList = function(func, totalData, args, callback_2, errorCount) {
        if (errorCount == null) {
          errorCount = 0;
        }
        return reddit[func](args, function(e, data) {
          var childs;
          if (e) {
            console.log(e, 'ERROR');
            if (e.toString().indexOf('404') > -1 && errorCount === 0) {
              return rTime((function() {
                return getList(func, totalData, args, callback_2, 1);
              }), '404 trying again damnit');
            } else if (e.toString().indexOf('404') > -1 && errorCount > 0) {
              return callback('404');
            } else if (e.toString().indexOf('503') > -1 && errorCount === 0) {
              return rTime((function() {
                return getList(func, totalData, args, callback_2, 1);
              }), '503 trying again damnit');
            } else if (e.toString().indexOf('403') > -1 && errorCount === 0) {
              return callback('404');
            } else {
              console.log(e, 'ERROR ABORTING OUT');
              return process.exit();
            }
          } else {
            childs = data.children || data.data.children;
            totalData = totalData.concat(childs);
            if (data.after) {
              args.after = data.after;
              return rTime((function() {
                return getList(func, totalData, args, callback_2);
              }), 'next_page');
            } else {
              return callback_2(totalData);
            }
          }
        });
      };
      return async.series({
        timer_1: function(next) {
          return rTime(next, 'user');
        },
        user: function(next) {
          return reddit.user(user, function(e, data) {
            return next(e, data || {});
          });
        },
        timer_2: function(next) {
          return rTime(next, 'analyzing links');
        },
        userLinks: function(next) {
          return getList('userLinks', [], {
            user: user,
            limit: 100
          }, function(data) {
            return next(null, data || {});
          });
        },
        timer_3: function(next) {
          return rTime(next, 'comments');
        },
        userComments: function(next) {
          return getList('userComments', [], {
            user: user,
            limit: 100
          }, function(data) {
            return next(null, data || {});
          });
        }
      }, function(err, results) {
        return callback(err, results);
      });
    };
    secondsToData = function(seconds) {
      var numdays, numhours, numminutes, numseconds, numyears;
      numyears = Math.floor(seconds / 31536000);
      numdays = Math.floor(seconds % 31536000 / 86400);
      numhours = Math.floor(seconds % 31536000 % 86400 / 3600);
      numminutes = Math.floor(seconds % 31536000 % 86400 % 3600 / 60);
      numseconds = seconds % 31536000 % 86400 % 3600 % 60;
      return {
        years: numyears,
        months: numdays / 30,
        hours: numhours,
        minutes: numminutes,
        seconds: numseconds
      };
    };
    formatScore = function(data) {
      var comments_month_name, fav_word, format, info, information_data, posts_month_name, sailor_name, temp_words, trust_name, word_name, year_name, _i, _j, _len, _len1, _ref, _ref1;
      posts_month_name = '';
      if (data.posts_per_month < 3) {
        posts_month_name = '*^lurker*';
      } else if (data.posts_per_month > 30) {
        posts_month_name = '*^reddit ^is ^my ^personal ^facebook*';
      } else if (data.posts_per_month > 15) {
        posts_month_name = '*^power ^poster*';
      }
      comments_month_name = '';
      if (data.comments_per_month < 3) {
        comments_month_name = '*^I ^can ^read ^I ^Promise!*';
      } else if (data.comments_per_month > 30) {
        comments_month_name = '*^I ^have ^an ^opinion ^on ^everything*';
      } else if (data.comments_per_month > 15) {
        comments_month_name = '*^I ^help!*';
      }
      year_name = '';
      if (data.age.years < 0) {
        year_name = "*^just ^a ^baby!*";
      } else if (data.age.years > 2) {
        year_name = "*^old ^man*";
      }
      trust_name = '';
      if (data.trust_score > 90) {
        trust_name = "*^tell ^them ^your ^secrets!*";
      } else if (data.trust_score < 60) {
        trust_name = "*^Lies!! ^so ^many ^lies!*";
      }
      data.sailor_mouth = Math.round(data.sailor_mouth * 1000) / 10;
      sailor_name = '';
      if (data.sailor_mouth > 2) {
        sailor_name = "*^I'm ^13 ^and ^bad ^words ^are ^cool*";
      } else if (data.sailor_mouth < 2) {
        sailor_name = "*^Gosh ^darnet ^gee ^wiz*";
      }
      word_name = '';
      temp_words = [];
      _ref = data.favorite_words;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fav_word = _ref[_i];
        temp_words.push(fav_word.word);
      }
      word_name = temp_words.join(', ');
      format = "***Analyzing " + data.user_name + "***\n\n* comments per month: " + (Math.round(data.comments_per_month * 10) / 10) + " " + comments_month_name + "\n* posts per month: " + (Math.round(data.posts_per_month * 10) / 10) + " " + posts_month_name + "\n* favorite sub [" + data.favorite_subreddit.sub + "](http://reddit.com/r/" + data.favorite_subreddit.sub + ")\n* favorite words: " + word_name + "\n* age " + data.age.years + " years " + data.age.months + " months " + year_name + "\n* profanity score " + data.sailor_mouth + "% " + sailor_name + "\n* trust score " + data.trust_score + "% " + trust_name + "\n\n\n\n[New Upvoting Bot! ](https://upvotes.infernalscoop.com/)";
      information_data = '';
      _ref1 = data.information.slice(0, 11);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        info = _ref1[_j];
        information_data += "    * *\"" + (info.trim()) + "\"*\n";
      }
      if (information_data) {
        format += "\n\n* Fun facts about " + data.user_name + "\n" + information_data;
      }
      format = format.replace('reddit.com/r/', 'NP.reddit.com/r/');
      return format;
    };
    calculateUserScore = function(user_name, callback) {
      var born, comments_per_week, favorite_subreddit, favorite_words, posts_per_week, reg_comments, subreddits_data, words_data;
      if (/trollabot/ig.test(user_name)) {
        return callback(redditFunny);
      }
      words_data = {};
      subreddits_data = {};

      /*
        likes vs dislikes = hater or not
        posts per day
        comments per day
        age
        favorite word
        favorite sub
       */
      reg_comments = 0;
      favorite_subreddit = {
        sub: "*all I do is lurk...*",
        count: 0
      };
      favorite_words = [
        {
          word: "",
          count: 0
        }, {
          word: "",
          count: 0
        }, {
          word: "",
          count: 0
        }
      ];
      born = '';
      comments_per_week = 0;
      posts_per_week = 0;
      return gradbRawData(user_name, function(e, results) {
        var body, comment, comments_per_month, cusswords, favorite_word, information, posts_per_month, regwords, subreddit, totalBody, trust_score, user, userComments, userLinks, w_trim, word, words, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
        if (e || !(results != null ? (_ref = results.userComments) != null ? _ref.length : void 0 : void 0)) {
          console.log('ERROR 404 deleted user');
          return callback('deleted or invisible user :/ (might be reddit.. try again in 10 seconds)');
        } else {
          user = results.user, userLinks = results.userLinks, userComments = results.userComments;
          reg_comments = userComments.length;
          totalBody = '';
          for (_i = 0, _len = userComments.length; _i < _len; _i++) {
            comment = userComments[_i];
            _ref1 = comment.data, subreddit = _ref1.subreddit, body = _ref1.body;
            totalBody += " " + body;
            subreddits_data[subreddit] = (subreddits_data[subreddit] || 0) + 1;
            if (favorite_subreddit.count < subreddits_data[subreddit]) {
              favorite_subreddit.count = subreddits_data[subreddit];
              favorite_subreddit.sub = subreddit;
            }
            if (!body) {
              continue;
            }
            words = body.trim().replace('\n', ' ').split(' ');
            for (_j = 0, _len1 = words.length; _j < _len1; _j++) {
              word = words[_j];
              w_trim = word.trim();
              if (w_trim === '') {
                continue;
              }
              if (utils.getUselessWords(w_trim)) {
                continue;
              }
              words_data[w_trim] = (words_data[w_trim] || 0) + 1;
              for (_k = 0, _len2 = favorite_words.length; _k < _len2; _k++) {
                favorite_word = favorite_words[_k];
                if (favorite_word.count < words_data[w_trim]) {
                  favorite_word.count = words_data[w_trim];
                  favorite_word.word = w_trim;
                  break;
                }
              }
            }
          }
          if (user != null ? (_ref2 = user.data) != null ? _ref2.created : void 0 : void 0) {
            born = secondsToData((Date.now() / 1000) - user.data.created);
            born.years = Math.max(born.years, 0);
            if (born.years) {
              born.months = Math.max(born.months, 0);
            } else {
              born.months = Math.max(born.months, 1);
            }
            born.months = Math.floor(born.months);
            comments_per_month = userComments.length / (born.years * 12 + born.months);
            posts_per_month = userLinks.length / (born.years * 12 + born.months);
            _ref3 = utils.getSwearCount(totalBody), cusswords = _ref3.cusswords, regwords = _ref3.regwords;
            information = utils.getMePhrases(totalBody);
            trust_score = utils.getTrustScore(totalBody);
            if (isNaN(trust_score)) {
              console.log('ERROR WTF');
              return process.exit();
            }
            return callback(formatScore({
              user_name: user_name,
              comments_per_month: comments_per_month,
              comments: userComments.length,
              links: userLinks.length,
              posts_per_month: posts_per_month,
              information: information || [],
              favorite_subreddit: favorite_subreddit,
              favorite_words: favorite_words,
              age: {
                years: born.years,
                months: born.months
              },
              sailor_mouth: cusswords / regwords,
              trust_score: trust_score
            }));
          } else {
            return callback('deleted or invisible user :/');
          }
        }
      });
    };
    console.time('script');
    console.log('authenticating');
    return reddit.auth({
      'username': username,
      'password': password
    }, function(err, response) {
      if (err) {
        return console.log('Unable to authenticate user: ' + err);
      } else {
        return rTime(function() {
          console.log('grabbing inbox');
          return reddit.unread({
            mark: false
          }, function(e, data) {
            if (e) {
              console.log(e);
            }
            return rTime(function() {
              var arr;
              arr = (data != null ? data.children : void 0) || [];
              arr.reverse();
              return async.eachLimit(arr, 1, (function(item, next) {
                var name, user_name, _ref, _ref1, _ref2, _ref3;
                if (!(item != null ? (_ref = item.data) != null ? _ref.was_comment : void 0 : void 0)) {
                  return next();
                }
                user_name = (_ref1 = /\/u\/TrollaBot +([A-Za-z0-9_-]+)/gi.exec(item != null ? (_ref2 = item.data) != null ? _ref2.body : void 0 : void 0)) != null ? _ref1[1] : void 0;
                name = item != null ? (_ref3 = item.data) != null ? _ref3.name : void 0 : void 0;
                if (!(name && user_name)) {
                  return next();
                }
                console.log('new /u found ', user_name);
                return rTime(function() {
                  console.log('calculating score');
                  return calculateUserScore(user_name, function(template) {
                    console.log('commenting');
                    return rTime(function() {
                      return reddit.comment(name, template, function(e, data) {
                        if (e) {
                          console.log(e);
                          if (e.toString().indexOf('403') !== -1) {
                            return reddit.markRead([name], function(e, data) {
                              console.log('403 comment marked read');
                              return next();
                            });
                          } else {
                            return next();
                          }
                        } else {
                          console.log('successful comment made');
                          console.log('marking comment as read');
                          return reddit.markRead([name], function(e, data) {
                            console.log('comment marked read');
                            return next();
                          });
                        }
                      });
                    });
                  });
                });
              }), function(e, data) {
                return rTime(function() {
                  console.timeEnd('script');
                  return main_response.send('ok');
                });
              });
            });
          });
        });
      }
    });
  };
})(this));
