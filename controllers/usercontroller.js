const router = require("express").Router();
const { UserModel } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//                    REGISTER/SIGNUP
router.post('/signup', async (req, res) => {
  let { username, password } = req.body
  try {
    let User = await UserModel.create({
      username,
      password: bcrypt.hashSync(password, 7),
    });

    let token = jwt.sign({id:User.id}, process.env.JWT_SECRET, {expiresIn: '1d'});

    res.status(201).json({
      message: "User signup successful",
      user: User,
      sessionToken: token
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "username already in use"
      });
    } else {
      res.status(500).json({
        message: "Signup Failed"
      });
    }
  }
});




//                LOGIN
router.post('/login', async (req, res) => {
  let { username, password } = req.body;

try {
    let loginUser = await UserModel.findOne({
      where:{
        username: username,
      },
    });
if (loginUser){

  let passwordComparison = await bcrypt.compare(password, loginUser.password);

  if (passwordComparison) {
    let token=jwt.sign({id:loginUser.id}, process.env.JWT_SECRET, {expiresIn: '1d'});
    
      res.status(200).json({
        user: loginUser,
        message: "user login successful!",
        sessionToken: token
      });
    } else {
      res.status(401).json({
        message:"Incorrect email or password"
      })
    }
} else {
  res.status(401).json({
    message:"Login failed!"
  })
}
} catch(error) {
  res.status(500).json({
    message: "Failed to log user in"
  })
  }
});


module.exports = router;