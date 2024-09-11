import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Context from "../context";
import displayCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { loadStripe } from '@stripe/stripe-js';
import ConfirmationDialog from "../components/ConfirmationDialog";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const context = useContext(Context);
  const loadingCart = new Array(context.cartProductCount).fill(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/view-cart-product`,
        {
          withCredentials: true,
        }
      );
      console.log("API Response:", response.data);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoading = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  useEffect(() => {
    handleLoading();
  }, []);

  const increaseQuantity = async (id, qty) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/update-cart-product`,
        {
          _id: id,
          quantity: qty + 1,
        },
        {
          withCredentials: true,
        }
      );
      fetchData();
      console.log('Quantity updated', response);
    } catch (error) {
      console.error('Error updating quantity', error);
    }
  };

  const decreaseQuantity = async (id, qty) => {
    if (qty >= 2) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/update-cart-product`,
          {
            _id: id,
            quantity: qty - 1,
          },
          {
            withCredentials: true,
          }
        );
        fetchData();
        console.log('Quantity updated', response);
      } catch (error) {
        console.error('Error updating quantity', error);
      }
    }
  };

  const deleteProduct = async () => {
    if (productToDelete) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/delete-cart-product`,
          {
            _id: productToDelete,
          },
          {
            withCredentials: true,
          }
        );
        fetchData();
        context.fetchUserAddToCart();
        console.log('Product deleted', response);
      } catch (error) {
        console.error('Error deleting product', error);
      } finally {
        setShowConfirm(false);
        setProductToDelete(null);
      }
    }
  };

  const handleConfirmDelete = () => {
    deleteProduct();
  };

  const handleCancelDeleteProduct = () => {
    setShowConfirm(false);
    setProductToDelete(null);
  };

  const totalQuantity = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
  const totalPrice = data.reduce((prev, curr) => prev + (curr.quantity) * curr?.productId?.sellingPrice, 0);

  const handlePayment = async () => {
    const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/checkout`,
        {
          cartItems: data
        },
        {
          withCredentials: true,
        }
      );
      console.log("payment response:", response.data);

      if (response?.data?.data?.id) {
        stripePromise.redirectToCheckout({ sessionId: response?.data?.data?.id });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto font-serif px-5">
      <div className="text-center text-lg my-3 font-bold">
        {data.length === 0 && !loading && (
          <p className="py-5">No product in the cart</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
        {/* View product */}
        <div className="w-full max-w-3xl">
          {loading
            ? loadingCart.map((el, index) => (
              <div
                className="w-full bg-purple-100 h-32 my-2 border border-purple-100 animate-pulse"
                key={el + "Add to cart loading" + index}
              ></div>
            ))
            : data.map((product, index) => (
              <div
                className="w-full bg-white h-32 my-2 border border-purple-300 rounded grid grid-cols-[128px,1fr]"
                key={product?._id + "Add to cart loading"}
              >
                <div className="w-32 h-32 bg-purple-100">
                  <img
                    src={product?.productId?.productImage[0]}
                    className="w-full h-full object-scale-down mix-blend-multiply"
                    alt="product"
                  />
                </div>
                <div className="px-4 py-2 relative">
                  {/* Delete add to cart product */}
                  <div className="absolute right-0 text-red-600 rounded-full p-1 text-lg hover:bg-red-600 hover:text-white cursor-pointer"
                    onClick={() => {
                      setProductToDelete(product?._id);
                      setShowConfirm(true);
                    }}
                  >
                    <MdDelete />
                  </div>
                  {/* Product name, category, price */}
                  <h2 className="text-lg lg:text-lg text-ellipsis line-clamp-1">
                    {product?.productId?.productName}
                  </h2>
                  <p className="text-green-600 capitalize">
                    {product?.productId?.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-style text-sm">
                      {displayCurrency(product?.productId?.sellingPrice)}
                    </p>
                    <p className="text-style text-sm text-green-600 font-semibold">
                      {displayCurrency(product?.productId?.sellingPrice * product?.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button className="border border-purple-400 text-purple-600 w-6 h-6 flex justify-center items-center rounded-full hover:bg-purple-700 hover:text-white"
                      onClick={() => decreaseQuantity(product?._id, product?.quantity)}
                    >
                      -
                    </button>
                    <span>{product?.quantity}</span>
                    <button className="border border-purple-400 text-purple-600 w-6 h-6 flex justify-center items-center rounded-full hover:bg-purple-700 hover:text-white"
                      onClick={() => increaseQuantity(product?._id, product?.quantity)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Total cart product */}
        {data[0] && (
          <div className="mt-5 lg:mt-0 w-full max-w-sm">
            {loading ? (
              <div className="h-36 bg-purple-100 border border-purple-300 animate-pulse"></div>
            ) : (
              <div className="h-36 bg-purple-100">
                <h2 className="text-white bg-purple-600 px-4 py-1">Summary</h2>
                <div className="flex items-center justify-between px-4 py-1 gap-2 ">
                  <p>Quantity</p>
                  <p>{totalQuantity}</p>
                </div>
                <div className="flex items-center justify-between px-4 py-1 gap-2 ">
                  <p>Total Price</p>
                  <p className="text-style">{displayCurrency(totalPrice)}</p>
                </div>

                <div className="flex justify-end items-end p-2">
                  <button className="bg-green-600 text-white px-4 py-1 w-fit rounded" onClick={handlePayment}>Payment</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showConfirm && (
        <ConfirmationDialog
          message="Are you sure you want to delete this product from your cart?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDeleteProduct}
        />
      )}
    </div>
  );
};

export default Cart;
