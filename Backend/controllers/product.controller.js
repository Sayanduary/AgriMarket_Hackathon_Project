// delete product 
export async function deleteProduct(request, response){
    const product = await product.findById(request.params.id).populate("catagory");

    if(!product){
        return response.status(404).json({
            message : "Product not found",
            error : true,
            success : false
        })
    }

    const images =product.images;

    let img ="";
    for(img of images){
        const imgUrl =img;
        const urlArr =imgUrl.split("/");
        const image = Url[urlArr.length - 1];

        const imageName = image.split(".")[0];

        if(imageName){
            cloudinary.uploader.destroy(imageName ,(error ,result)=>{
                //console.log(error ,result);
            })
        }
        
    }

    const deletedProduct =await productModel.findByIdAndDelete(request.params.id);

    if(!deletedProduct){
        response.status(404).json({
            message : "Product not found!",
            success : false,
            error : true
        });
    }

    return response.status(200).json({
        success : true,
        error : false,
        message : "product deleted!",
    });

}

//get product
export async function getProduct(request, response){
    try {
        const product = await productModel.findById(request.params.id).populate("catagory");

        if(!product){
            return response.status(404).json({
                message : " The product is not found!",
                error : true,
                success : false
            })
        }

          return response.status(200).json({
            error : false,
            success : true,
            product : product
          })

    } catch (error) {
       return response.status(500).json({
        message : error.message || error,
        error : true,
        success : false

       }) 
    }
}

//delete image
// export async function removeImageFromCloudinary(request,response){}



//update prosuct
export async function updateProduct(request, response){
try {
     const product = await productModel.findByIdAndUpdate(
        request.params.id,
        {
            name : request.body.name,
            subCat : request.body.subCat,
            description : request .body .description,
            images: request.body.images,
            brand : request.body.brand,
            price: request.body.price,
            oldPrice : request.body.oldPrice,
           catId : request.body.catId,
           catName : request.body. catName,
           subCat : request.body.subCat,
           category : request.body. category,
           thirdsubCatId: request.body.thirdsubCatId,
            countInStock: request.body.  countInStock,
            rating: request.body.  rating,
            isFeatured: request.body.  isFeatured,
            productRam: request.body.  productRam,
            size: request.body.  size,
            productWeight: request.body.  productWeight,
            
            


     },{
        new : true
     });

     if(!product){
        response.status(404).json({
            message : "the product can not be updated!",
            status : false,
        });
     }

     imagesArr =[];

     return response.status(200).json({
        message :"The product is updated",
        error : false,
        success:true,
     })
} catch (error) {
    return response.status(500).json({
        message : error.message || error,
        error : true,
        success : false

       }) 
}
}