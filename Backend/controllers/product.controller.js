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