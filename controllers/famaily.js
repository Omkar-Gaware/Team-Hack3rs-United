const Listing = require("../models/famaily");


  module.exports.createListing = async (req, res) => {
  
    let {name,relation,phone} = req.body;
    console.log(name);
    let newListing = new Listing(listing);
 
    await newListing.save();
    req.flash("success", "New Listing Saved"); //create flash for temporory message
    res.redirect("/listings");
  };