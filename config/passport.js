var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
module.exports = function (compound) {
  compound.passport = passport;
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, function (email, password, done) {
    compound.models.User.findOne({
      where: {
        email: email
      }
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    });
  }));
  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function (req, email, password, done) {
      var role = req.body.role;
      // asynchronous
      // User.findOne wont fire unless data is sent back
      if(password.length<=5) {
        return done(null, false, {
              message: 'Password is too short(min 6 characters)'
            });
      }
      process.nextTick(function () {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        compound.models.User.findOne({ where:
          {email: email}
        }, function (err, user) {
          // if there are any errors, return the error
          if (err)
            return done(err);
          // check to see if theres already a user with that email
          if (user) {
            return done(null, false, {
              message: 'That email is already taken'
            });
          } else {
            // if there is no user with that email
            // create the user
            var newUser = new compound.models.User();
            // set the user's local credentials
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.role = role;
            // Check validity
            newUser.save(function (err) {
              if (err)
                throw err;
              console.log(newUser);
              return done(null, req.user);
            });
          }
        });
      });
    }));
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    compound.models.User.find(parseInt(id), function (err, user) {
      done(err, user);
    });
  });
}
