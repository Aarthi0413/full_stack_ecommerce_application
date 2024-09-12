import React, { useEffect, useState } from "react";
import axios from "axios";
import displayCurrency from "../helpers/displayCurrency";

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", // "Sep"
    day: "numeric", // "9"
    year: "numeric", // "2024"
  }).format(date);
};

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/order-list`, {
        withCredentials: true,
      });
      console.log("order-list", response.data);
      setData(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const filteredData = data.filter((item) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      item.productDetails.some((product) =>
        product.name.toLowerCase().includes(lowercasedQuery)
      ) ||
      (item.paymentDetails.payment_method_types &&
        item.paymentDetails.payment_method_types.some((method) =>
          method.toLowerCase().includes(lowercasedQuery)
        )) ||
      (item.paymentDetails.payment_status &&
        item.paymentDetails.payment_status.toLowerCase().includes(lowercasedQuery)) ||
      item.shipping_options.some((shipping) =>
        shipping.shipping_amount.toString().toLowerCase().includes(lowercasedQuery)
      )
    );
  });

  return (
    <div className="font-serif">
      <div className="p-4 w-full">
        {data.length > 0 && (
          <input
            type="text"
            placeholder="Search your order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 p-2 border rounded w-full max-w-md focus:outline-none focus:border-transparent focus-within:shadow"
          />
        )}
        {filteredData.length === 0 && <p>No Orders Available</p>}
        {filteredData.map((item, index) => {
          const formattedDate = formatDate(new Date(item.createdAt));
          return (
            <div key={item.userId + index}>
              <p className="text-style first-line:font-bold text-md">
                {formattedDate}
              </p>
              <div className="border rounded">
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="grid gap-2">
                    {item.productDetails.map((product, index) => {
                      return (
                        <div
                          key={product.productId + index}
                          className="flex gap-3"
                        >
                          <img
                            src={product.image[0]}
                            alt="product"
                            className="w-28 h-28 object-scale-down p-2 bg-purple-300"
                          />
                          <div>
                            <p className="font-medium text-md text-ellipsis line-clamp-1">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-5 mt-1">
                              <p className="text-green-600">
                                Price: {displayCurrency(product.price)}
                              </p>
                              <p>Quantity: {product.quantity}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-4 p-2 min-w-[300px]">
                    <div>
                      <div className="text-lg font-bold text-green-600">Payment Details</div>
                      <p className=" ml-1">
                        Payment Method:{" "}
                        {item.paymentDetails.payment_method_types.join(", ")}
                      </p>
                      <p className=" ml-1">
                        Payment Status: {item.paymentDetails.payment_status}
                      </p>
                    </div>

                    <div>
                      <div className="text-lg font-bold text-green-600">
                        Shipping Details
                      </div>
                      {item.shipping_options.map((shipping, index) => {
                        return (
                          <div key={shipping.shipping_rate}>
                            <p className=" ml-1">
                              Shipping Amount: {shipping.shipping_amount}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="font-semibold ml-auto w-fit lg:text-md min-w-[300px] text-green-600">
                  Total Amount: {displayCurrency(item.totalAmount)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderPage;
