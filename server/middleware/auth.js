
function isAuthenticated(req, res, next) {
    console.log("**** isAuthenticated Session")
    console.log(req.session)
    if(req.session.user) {
    //   console.log("Already logged in")
      next()
    }
    else {
      console.log("Redirecting to login");
      res.json({redirectURL : '/user/login'});
    }
  }