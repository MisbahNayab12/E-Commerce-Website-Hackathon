"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import CaretRight from '../../public/CaretRight.png'
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/features/store'
import { updateCart } from '@/redux/features/cart-slice'
import { client } from "@/sanity/lib/client"
import { useState } from 'react'

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    originalPrice: number;
    tags: string;
    image: string,
    description: string,
    available: boolean
}

interface CartItem {
    _id: string;
    name: string;
    category: string;
    price: number;
    originalPrice: number;
    tags: string;
    image: string,
    description: string,
    available: boolean,
    quantity: number
}

const getData = async (): Promise<Product[]> => {
    const res = await client.fetch(`
      *[_type == "food"]{
        _id,
        name,
        category,
        price,
        originalPrice,
        tags,
        "image": image.asset-> url,
        description,
        available,
        quantity,
      }
    `);
    return res;
  };

const Page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const cartArray: CartItem[] = useAppSelector((state) => state.cartReducer)


    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const data = await getData();
            console.log("Fetched Products:", data);
            setProducts(data);
          } catch (error) {
            console.error("Error fetching products:", error); 
          }
        };
        fetchProducts();
      }, []);

    const addToCart = (product: Product) => {
        const itemIndex = cartArray.findIndex((item) => item._id === product._id)

        if (itemIndex !== -1) {
            const updatedCart = cartArray.map((item, index) =>
                index === itemIndex ? { ...item, quantity: item.quantity + 1 } : item
            )

            dispatch(updateCart(updatedCart))
        }

        else {
            const newCartItem = {
                _id: product._id,
                name: product.name,
                category: product.category,
                price: product.price,
                originalPrice: product.originalPrice,
                tags: product.tags,
                image: product.image,
                description: product.description,
                available: product.available,
                quantity: 1
            };

            const updatedCart = [...cartArray, newCartItem];
            dispatch(updateCart(updatedCart));
        }
    }

    useEffect(() => {
        console.log("cartArray", cartArray);
    }, [cartArray])


    return (
        <div className='bg-white pb-12'>
            <div className="bg-hero-image bg-cover bg-center h-80 w-full flex justify-center items-center mt-[30px]">
                <div className=''>
                    <h1 className='text-white font-sans text-5xl font-bold '>Our Shop</h1>
                    <div className='flex justify-center items-center'>
                        <h2 className='text-white leading-[56px] text-inter'> Home </h2>
                        <Image src={CaretRight} alt="icon" />
                        <h2 className='text-primary'>Shop</h2>
                    </div>
                </div>
            </div>

            <div className='flex justify-center gap-10 mt-20 lg:mx-8 xl:mx-[150px] flex-wrap'>
                {products.length > 0 ? (
                    
                    products.map((product: Product) => (
                        <div key={product._id}>
                            <Image src={product.image} alt="image" width={300} height={300} />
                            <div>
                                <h2 className='font-bold'>{product.name}</h2>
                                <p className='text-primary'>Price: {product.price}</p>
                            </div>
                            <div>
                                <button onClick={() => addToCart(product)} className='w-36 h-10 bg-primary text-white hover:bg-amber-400'> Add to Cart </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p> Loading Products...</p>
                )
                }
            </div>

        </div>
    )
}

export default Page
