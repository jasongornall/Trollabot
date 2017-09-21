
functions = require('firebase-functions');
admin = require('firebase-admin');
rawjs = require('raw.js')
async = require('async')
auth = require('basic-auth')
utils = require('./utils.js')

reddit = new rawjs('raw.js trollabot v:1.0.0')
admin.initializeApp(functions.config().firebase);

username = functions.config().reddit.username
password = functions.config().reddit.password
reddit.setupOAuth2 functions.config().reddit.oauth_key, functions.config().reddit.oauth_password

exports.trollabot = functions.https.onRequest (main_request, main_response) =>
  credentials = auth(main_request);
  if not credentials or credentials.name isnt functions.config().auth.name or credentials.pass isnt functions.config().auth.pass
    return main_response.send('hack attempt')

  rTime = (callback, logMsg = '') ->
    console.log logMsg if logMsg
    if reddit?.getRateLimitDetails
      console.log reddit.getRateLimitDetails()
    callback()

  redditFunny = """\                                      TROLLABOT4
  \                                  LIFETROLLABOT4LIF
  \                              ETROLLABOT4LIFETROLLABOT
  \                      4LIFETROLLABOT4           LIFETROL
  \                   LABOT4LIFETRO                  LLABOT4
  \                 LIFETROLLABOT4L                   IFETRO
  \                 LLABOT4LIFETROLL                   ABOT4
  \                 LIFETROLLAB OT4LIF    ETROLLABOT4  LIFET
  \                 ROLLABOT4LIFETROLLA BOT4LIFETROLLAB OT4L
  \                 IFETROLLABOT4LIFE  TROLLABOT4LIFETROLLAB
  \                OT4LI  FETROLLABOT  4LIFETROLLABOT4LIFETR
  \               OLLABOT4LIFETROLLABO T4LIFETROLL ABOT4LIFE
  \              TROLLABOT4LIFETROLL   ABOT4LIFETROLLABOT4LI
  \             FETROLLABOT4LIFETROLLABOT4LIFETROLLA  BOT4L
  \            IFETR          OLLABOT4LIFETROLLA     BOT4LI
  \           FETRO                      LLABOT4     LIFETR
  \          OLLABO                                 T4LIFE
  \         TROLLA                                 BOT4LI
  \        FETROL                                  LABOT4
  \        LIFET                      ROLL        ABOT4L
  \        IFET                      ROLLA BOT   4LIFET
  \        ROLL                      ABOT4LIFET  ROLLA                         BOT4LIFET
  \       ROLLA                      BOT4LIFET  ROLLA                        BOT4LIFETROL
  \       LABOT                     4LIFETROLL ABOT4                       LIFETR    OLLA
  \       BOT4L                     IFETROLLA  BOT4L                     IFETROL    LABOT
  \       4LIFE                    TROLLABOT  4LIFET                   ROLLABO     T4LIF
  \       ETROL                    LABOT4LI   FETROLLABOT4LIFETROL   LABOT4L     IFETR
  \        OLLA                   BOT4LIFE    TROLLABOT4LIFETROLLABOT4LIFE      TROLL
  \        ABOT                   4LIFETR     OLLAB   OT4LI   FETROLLABO      T4LIFE
  \        TROL                  LABOT4LI      FET   ROLLABOT4LIFETROL      LABOT4
  \        LIFET               ROLLA BOT4L         IFETROLLABOT4LIFET     ROLLABO
  \         T4LI             FETRO  LLABOT4         LIFETROLLABOT4LIFET   ROLLABOT
  \         4LIFE            TROLLABOT4LIFE                     TROLLABO    T4LIFETRO
  \          LLABO            T4LIFETROLLA              BOT4       LIFETR  OLLA BOT4L
  \          IFETRO              LLAB                   OT4L        IFETRO  LLABOT4L
  \           IFETRO                                LLA              BOT4L    IFET
  \            ROLLABOT                            4LIF              ETROL     LABO
  \               T4LIFET                          ROLL              ABOT4LIFETROLL
  \     ABO        T4LIFETROL                       LABO           T4LIFETROLLABOT
  \    4LIFETR    OLLABOT4LIFETROLL                  ABO         T4LIFET    R
  \    OLLABOT4LIFETR OLLABOT4LIFETROLLABOT           4LIF    ETROLLA
  \    BOT4 LIFETROLLABOT4    LIFETROLLABOT4L IFETROLLABOT4LIFETROL
  \     LABO  T4LIFETROL         LABOT4LIFET ROLLABOT4LIFETROLLA
  \      BOT4   LIFETR         OLLABOT4LIFE TROLL ABOT4LIFETR
  \       OLLABOT4LI           FETROLLABOT  4LIF
  \        ETROLLA              BOT4LIFE   TROL
  \          LAB                OT4LIF    ETRO
  \                              LLABOT  4LIF
  \                               ETROLLABOT
  \                                 4LIFETR
  \                                   OLL
  \
  """


  gradbRawData = (user, callback) =>
    getList = (func, totalData, args, callback_2, errorCount = 0) =>
      reddit[func] args, (e, data) ->
        if e
          console.log e, 'ERROR'
          if e.toString().indexOf('404') > -1 and errorCount is 0
            rTime (->
              getList func, totalData, args, callback_2, 1
            ), '404 trying again damnit'
          else if e.toString().indexOf('404') > -1 and errorCount > 0
            return callback('404')
          else if  e.toString().indexOf('503') > -1 and errorCount is 0
            rTime (->
              getList func, totalData, args, callback_2, 1
            ), '503 trying again damnit'
          else if e.toString().indexOf('403') > -1 and errorCount is 0
            return callback('404')
          else
            console.log e, 'ERROR ABORTING OUT'
            return process.exit();
        else
          childs = data.children or data.data.children
          totalData = totalData.concat childs
          if data.after
            args.after = data.after
            rTime (->
              getList func, totalData, args, callback_2
            ), 'next_page'
          else
            return callback_2 totalData


    async.series {
      timer_1: (next) -> rTime next, 'user'
      user: (next) -> reddit.user user, (e, data) -> next(e, data or {})
      timer_2: (next) -> rTime next, 'analyzing links'
      userLinks: (next) -> getList 'userLinks', [], {user: user, limit: 100}, (data) -> next(null, data or {})
      timer_3: (next) -> rTime next, 'comments'
      userComments: (next) -> getList 'userComments', [], {user: user, limit: 100}, (data) ->  next(null, data or {})

    }, (err, results) ->
      callback err, results


  secondsToData = (seconds) ->
    numyears = Math.floor(seconds / 31536000)
    numdays = Math.floor(seconds % 31536000 / 86400)
    numhours = Math.floor(seconds % 31536000 % 86400 / 3600)
    numminutes = Math.floor(seconds % 31536000 % 86400 % 3600 / 60)
    numseconds = seconds % 31536000 % 86400 % 3600 % 60
    return {
      years: numyears
      months: numdays / 30
      hours: numhours
      minutes: numminutes
      seconds: numseconds
    }

  # ---
  # generated by js2coffee 2.0.1
  formatScore = (data) ->

    posts_month_name = ''
    if data.posts_per_month < 3
      posts_month_name = '*^lurker*'
    else if data.posts_per_month > 30
      posts_month_name = '*^reddit ^is ^my ^personal ^facebook*'
    else if data.posts_per_month > 15
      posts_month_name = '*^power ^poster*'

    comments_month_name = ''
    if data.comments_per_month < 3
      comments_month_name = '*^I ^can ^read ^I ^Promise!*'
    else if data.comments_per_month > 30
      comments_month_name = '*^I ^have ^an ^opinion ^on ^everything*'
    else if data.comments_per_month > 15
      comments_month_name = '*^I ^help!*'


    year_name = ''
    if data.age.years < 0
      year_name ="*^just ^a ^baby!*"
    else if data.age.years > 2
      year_name = "*^old ^man*"

    trust_name = ''
    if data.trust_score > 90
      trust_name = "*^tell ^them ^your ^secrets!*"
    else if data.trust_score < 60
      trust_name = "*^Lies!! ^so ^many ^lies!*"

    data.sailor_mouth = Math.round(data.sailor_mouth * 1000) / 10

    sailor_name = ''
    if data.sailor_mouth > 2
      sailor_name = "*^I'm ^13 ^and ^bad ^words ^are ^cool*"
    else if data.sailor_mouth < 2
      sailor_name = "*^Gosh ^darnet ^gee ^wiz*"

    word_name = ''
    temp_words = []
    for fav_word in data.favorite_words
      temp_words.push fav_word.word
    word_name = temp_words.join(', ')
    format = """
      ***Analyzing #{data.user_name}***

      * comments per month: #{Math.round(data.comments_per_month * 10) / 10} #{comments_month_name}
      * posts per month: #{Math.round(data.posts_per_month * 10) / 10} #{posts_month_name}
      * favorite sub [#{data.favorite_subreddit.sub}](http://reddit.com/r/#{data.favorite_subreddit.sub})
      * favorite words: #{word_name}
      * age #{data.age.years} years #{data.age.months} months #{year_name}
      * profanity score #{data.sailor_mouth}% #{sailor_name}
      * trust score #{data.trust_score}% #{trust_name}
      \n\n
      [New Upvoting Bot! ](https://upvotes.infernalscoop.com/)
    """




    information_data = ''
    for info in data.information[0..10]
      information_data += "    * *\"#{info.trim()}\"*\n"
    if information_data
      format += """\n
        * Fun facts about #{data.user_name}
        #{information_data}
      """

    format = format.replace('reddit.com/r/','NP.reddit.com/r/')
    return format


  calculateUserScore = (user_name,  callback) ->
    if /trollabot/ig.test user_name
      return callback(redditFunny)


    words_data = {}
    subreddits_data = {}

    ###
      likes vs dislikes = hater or not
      posts per day
      comments per day
      age
      favorite word
      favorite sub
    ###


    # data to find
    reg_comments = 0
    favorite_subreddit = {sub:"*all I do is lurk...*", count: 0}
    favorite_words = [{word:"", count: 0},{word:"", count: 0},{word:"", count: 0}]
    born = ''
    comments_per_week = 0
    posts_per_week = 0





    gradbRawData user_name, (e, results) ->
      if e or not results?.userComments?.length
        console.log 'ERROR 404 deleted user'
        return callback('deleted or invisible user :/ (might be reddit.. try again in 10 seconds)')
      else
        {user, userLinks, userComments} = results

        reg_comments = userComments.length
        totalBody = ''
        for comment in userComments
          {subreddit, body} = comment.data
          totalBody += " #{body}"
          subreddits_data[subreddit] = (subreddits_data[subreddit] or 0) + 1
          if favorite_subreddit.count < subreddits_data[subreddit]
            favorite_subreddit.count = subreddits_data[subreddit]
            favorite_subreddit.sub = subreddit

          continue unless body
          words = body.trim().replace('\n',' ').split(' ')
          for word in words
            w_trim = word.trim()
            continue if w_trim is ''
            continue if utils.getUselessWords(w_trim)

            words_data[w_trim] = (words_data[w_trim] or 0) + 1
            for favorite_word in favorite_words
              if favorite_word.count < words_data[w_trim]
                favorite_word.count = words_data[w_trim]
                favorite_word.word = w_trim
                break

        if user?.data?.created
          born = secondsToData((Date.now() / 1000) - user.data.created)

          # zero out weird stuff
          born.years = Math.max(born.years, 0)
          if born.years
            born.months = Math.max(born.months, 0)
          else
            born.months = Math.max(born.months, 1)
          born.months = Math.floor(born.months)


          comments_per_month = userComments.length / (born.years * 12 + born.months)
          posts_per_month = userLinks.length / (born.years * 12 + born.months)

          {cusswords, regwords} = utils.getSwearCount(totalBody)
          information = utils.getMePhrases(totalBody)
          trust_score = utils.getTrustScore(totalBody)

          # super hard to track this down
          if isNaN(trust_score)
            console.log 'ERROR WTF'
            return process.exit();

          callback( formatScore {
            user_name
            comments_per_month
            comments: userComments.length
            links: userLinks.length
            posts_per_month
            information: information or []
            favorite_subreddit
            favorite_words
            age: {
              years: born.years
              months: born.months
            }
            sailor_mouth: cusswords / regwords
            trust_score
          })
        else
          callback('deleted or invisible user :/')

        #format phase


  console.time('script')
  console.log 'authenticating'
  reddit.auth {
    'username': username
    'password': password
  }, (err, response) ->
    if err
      console.log 'Unable to authenticate user: ' + err
    else
      rTime ->
        console.log 'grabbing inbox'
        reddit.unread {mark: false}, (e, data) ->
          console.log e if e

          #wait some time
          rTime ->
            arr = data?.children or []
            arr.reverse()
            async.eachLimit arr, 1, ((item, next) ->
              return next() unless item?.data?.was_comment
              user_name = /\/u\/TrollaBot +([A-Za-z0-9_-]+)/gi.exec(item?.data?.body)?[1]
              name = item?.data?.name
              return next() unless name and user_name

              console.log 'new /u found ', user_name

              # fire these guys off async style
              rTime ->
                console.log 'calculating score'
                calculateUserScore user_name, (template) ->
                  ##console.log JSON.stringify(template, null, 3)
                  ##return process.exit();
                  console.log 'commenting'
                  rTime ->

                    # debug stuff
                    reddit.comment name, template, (e, data) ->
                      if e
                        console.log e
                        if e.toString().indexOf('403') != -1
                          reddit.markRead [name], (e, data) ->
                            console.log '403 comment marked read'
                            return next()
                        else
                          return next()
                      else
                        console.log 'successful comment made'
                        console.log 'marking comment as read'
                        reddit.markRead [name], (e, data) ->
                          console.log 'comment marked read'
                          return next()
            ), (e, data) ->
              rTime ->
                console.timeEnd('script')
                return main_response.send('ok')
