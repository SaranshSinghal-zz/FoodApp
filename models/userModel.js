const mongoose = require("mongoose");
const emailValidator = require("email-validator");
let { DB_LINK } = require("../secrets");

// connnection form
mongoose
  .connect(DB_LINK, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function () {
    console.log("connected to db");
  })
  .catch(function (err) {
    console.log("err", err);
  });

// syntax
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Kindly enter your name"] },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  age: { type: Number },
  password: { type: String, minlength: 7, required: true },
  confirmPassword: {
    type: String,
    minlength: 7,
    validate: function () {
      return this.password === this.confirmPassword;
    },
    required: true,
  },
  createdAt: { type: Date },
  token: { type: String },
  role: { type: String, enum: ["admin", "user", "manager"], default: "user" },
});

// remember order
// middleware
userSchema.pre("save", function () {
  // db confirm password will not be saved
  console.log("Hello");
  this.confirmPassword = undefined;
});

// // document method
// userSchema.methods.resetHandler = function (password, confirmPassword) {
//   this.password = password;
//   this.confirmPassword = confirmPassword;
//   // token reuse is not possible
//   this.token = undefined;
// };

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
