import myListModel from "../models/myList.model";

export const addToMyListController = async(request,response) =>{
    try {
        const userId =request.userId //middleware
        const { productId,
                productTitle,
                image,
                rating, 
                price,
                oldPrice,
                brand,
                discount 
        }= request.body;


        const item = await myListModel.findOne({
            userId : userId,
            productId : productId
        })

        console.log(item);

        if(item){
            return response.status(400).json({
                message : "Item already in my list"
            })
        }

        const listItem =new myListModel({
            productId,
            productTitle,
            image,
            rating, 
            price,
            oldPrice,
            brand,
            discount,
            userId

        })
            
        const save = await myListModel.save();

        return response.status(200).json ({
            error : false,
            success : true,
            message : "The product added in the my list",
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    
    }
}
export const deleteToMyListController = async(request,response) =>{
    try {
         const myListItem = await myListModel.findById(request.params.id);

         if(!myListItem){
            return response.status(404).json({
                error : true,
                success : false,
                message :" the item with this given id was not found"
            })
         }


         const deletedItem = await myListModel.findByIdAndDelete(request.params.id);
         if(!deletedItem){
            return response.status(404).json({
                error : true,
                success : false,
                message :" the item is not deleted"
            })
        }

        return response.status (200).json({
            error: false,
            success: true,
            mesaage :"the item removed from my list"
        })


    } catch (error)
     {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        }) 
    }
}
export const getMyListController = async(request,response) =>{
    try {

         const userId = request.userId

        const myListItems= await myListModel.find({
            userId: userid
        })


        return response.status(200).json({
            error : false,
            success: true,
            data :myListItems
        })



    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }

}