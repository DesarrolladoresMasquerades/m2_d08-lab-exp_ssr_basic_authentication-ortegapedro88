const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const saltRound = 5;
const bcrypt = require('bcrypt');
const res = require('express/lib/response');


router.route("/signup", )
.get((req, res)=>{
    res.render("signup")
})
router.route('/signup', )
.get( (req, res) => {
	res.render('signup');
})
.post((req,res)=>{
	const username = req.body.username
	const password = req.body.password

	if(!username || !password) {
		res.render("signup", {errorMessage: "All filds are required"})
	//	return   o tmb se puede poner lo siguiente en un else, o sino un throw error
	throw new Error("Validation error")
	}
	


		User.findOne({username})
		.then((user)=>{
			if(user && user.username){
				res.render("signup", {errorMessage: "Username already taken"})
				throw new Error("Validation error")
			}
				
				

					const salt = bcrypt.genSaltSync(saltRound)
					const hashedPassword = bcrypt.hashSync(password, salt)
					User.create({username, password: hashedPassword})
					.then(()=>{
						res.redirect("/")
					})
					
				
					
			}).catch(error=>console.log(error))
		
})


router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.render("login", { errorMessage: "All filds are required" });
      throw new Error("Validation error");
    }

    User.findOne({ username })
      .then((user) => {
        if (!user) {
          res.render("login", { errorMessage: "Incorrect credentials!" });
          throw new Error("Validation error");
        }

        const isPwCorrect = bcrypt.compareSync(password, user.password);
        
        if (isPwCorrect) {
			req.session.currentUserId = user._id
          	res.redirect("/auth/main");
		
        } else {
          res.render("login", { errorMessage: "Incorrect credentials!" });
        }
      })
      .catch((error) => console.log(error));
  });


  router.get("/main", (req,res)=>{
    const id = req.session.currentUserId;
    console.log(id)
	if(id){

        User.findById(id)
        .then((user) => res.render("main", user))
        .catch(err=>console.log(err));
    }
    });

  router.get("/private", (req,res)=>{
    const id = req.session.currentUserId;
	if(id){

        User.findById(id)
        .then((user) => res.render("private", user))
        .catch(err=>console.log(err));
    }
    });



  router.get("/logout", (req,res)=>{
    req.session.destroy((err)=>res.redirect("/")
)})



module.exports = router