const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//Index Route
module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
};


//New Route
module.exports.renderNewForm=(req,res)=>{
   res.render("listings/new.ejs")
};


//Show Route
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
        .populate({path:"reviews",
            populate:{
                path:"author",
            },
        })
        .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist! ");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

    
//Create Route

module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();
   

    let url=req.file.path;
    let filename=req.file.filename;

    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    newListing.geometry=response.body.features[0].geometry;

    let savedListing=await newListing.save();
    console.log(savedListing);

    req.flash("success","New Listing created! ");
    res.redirect("/listings");
};

//Edit Route

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist! ");
        res.redirect("/listings");
    }


    let originalImageUrl =listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl})

};

//Update Route
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
        // is using the spread operator (...) to create a shallow copy of the req.body.listing object. This ensures that the data being passed to findByIdAndUpdate is not directly mutating the original req.body.listing object, but rather a copy of it.
    
        //To update/edit image
        if(typeof req.file !== "undefined"){
            let url=req.file.path;
            let filename=req.file.filename;
            listing.image={url,filename};
            await listing.save();

        }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete Listing

module.exports.destroyListing=async(req,res)=>{
    let {id}= req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success","Listing Deleted!")
   res.redirect("/listings");
};