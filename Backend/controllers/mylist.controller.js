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