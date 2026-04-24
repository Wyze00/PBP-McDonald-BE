export interface PostProductRequest{
    name: string
    description: string
    imageUrl: string
    price: number
    categoryId: string
}

export interface PutProductRequest extends PostProductRequest {}