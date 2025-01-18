"use client"

import React from 'react'
import Image from 'next/image'
import CaretRight from '../../public/CaretRight.png'
import Delete from '../../public/X.png'
import {useAppSelector } from '@/redux/features/store'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/features/store';
import { updateCart } from '@/redux/features/cart-slice';

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

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const [CartItems, setCartItems] = useState<CartItem[]>([])

  const incrementCartItem = (index: number) => {
    const updatedCart = CartItems.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    dispatch(updateCart(updatedCart));
  };
  
  const decrementCartItem = (index: number) => {
    const updatedCart = CartItems.map((item, i) =>
      i === index && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    dispatch(updateCart(updatedCart));
  }

  const removeCartItem = (index: number) => {
    const updatedCart = CartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart); // this function update local state for this component
    dispatch(updateCart(updatedCart)); // this function update Redux state to reflect globally
  };

  const cartArray: CartItem[] = useAppSelector((state) => state.cartReducer)


  useEffect(() => {
    setCartItems(cartArray)
  }, [cartArray])
  
  return (
    <div className='bg-white min-h-screen'>
      <div className="bg-hero-image bg-cover bg-center h-80 w-full flex justify-center items-center mt-[30px]">
        <div className=''>
          <h1 className='text-white font-sans text-5xl font-bold'>Shopping Cart</h1>
          <div className='flex justify-center items-center'>
            <h2 className='text-white leading-[56px] text-inter'> Home </h2>
            <Image src={CaretRight} alt="icon" />
            <h2 className='text-primary'>Shopping cart</h2>
          </div>
        </div>
      </div>

      {CartItems.length === 0 ? <h1 className='text-2xl text-center font-sans mt-36'>Sorry! your cart is empty...</h1> : null}
      <div className='lg:mx-[150px]'>
        <div>
          {CartItems.length != 0 ?
            <div className='grid grid-cols-5 place-items-center font-bold mt-14'>
              <h1 className='mr-32'>Product</h1>
              <h1 className='hidden md:flex'>Price</h1>
              <h1>Quantity</h1>
              <h1>Total</h1>
              <h1>Remove</h1>
            </div> : null}

          {
            CartItems.map((item, index) => (
              <div key={item._id}>
                <div className='grid grid-cols-5 place-items-center mt-10'>
                  <div className='flex justify-start gap-3 w-[200px]'>
                    <Image src={item.image} alt={item.name} className='w-[100px]' width={200} height={200} />
                    <h3 className='font-bold'>{item.name}</h3>
                  </div>
                  <h3>${item.price}</h3>
                  <div className='flex justify-center items-center'>
                    <div className='flex justify-center items-center border gap-5 w-30 h-10 px-8 rounded-full'>
                      <button onClick={() => { decrementCartItem(index) }}>-</button>
                      <span>{item.quantity}</span>

                      <button onClick={() => { incrementCartItem(index) }}>+</button>
                    </div>
                  </div>
                  <h2 className='font-bold'>${item.price * item.quantity}</h2>
                  <div className=" hover:opacity-30 cursor-pointer">
                    <Image src={Delete} alt="image" onClick={() => { removeCartItem(index) }} />
                  </div>
                </div>
                <div className='border mt-5'></div>
              </div>
            ))
          }

        </div>
      </div>
    </div>
  )
}
