export interface PostOrderRequest {
    products: PostOrderProductRequest[]
    paymentMethod: string
}

export interface PostOrderProductRequest {
    product_id: string,
    quantity: number
}

