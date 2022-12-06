import React, { useState } from "react";
import { toast } from "react-toastify";
import StockUpdate from "../../../components/dashboard/StockUpdate";
import Modal from "../../../components/Modal";
import Title from "../../../components/Title";
import SmallLoading from "../../../shared/loading/SmallLoading";
import useStocks from "../../../hooks/useStocks";

const ManageStocks = () => {
  const { stocks, loading: stocksLoading } = useStocks();
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const tinyLoading = (
    <div className="w-8 h-8 border-b-2 border-gray-900 rounded-full animate-spin" />
  );

  // delete product
  function handleRemoveStock(id) {
    setLoading(true);
    const removeProduct = async () => {
      const request = await fetch(
        `https://e-commerce-ssr.onrender.com/stock/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const response = await request.json();
      if (response.acknowledgement) {
        toast.success(response.description);
        setLoading(false);
      } else {
        toast.error(response.description);
        setLoading(false);
      }
    };
    removeProduct();
  }

  return (
    <>
      <Title>Manage Stocks</Title>
      <table className="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Description</th>
            <th>Unit</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        {stocksLoading ? (
          <SmallLoading />
        ) : (
          <tbody>
            {stocks?.map((stock) => (
              <tr key={stock._id} className="hover">
                <th title={stock._id}>{stock._id.slice(0, 5) + "..."}</th>
                <td>
                  <img
                    src={stock.thumbnail.url}
                    alt="stock thumbnail"
                    className="h-8 w-8 object-cover"
                    loading="lazy"
                  />
                </td>
                <td>{stock.title}</td>
                <td>
                  <span
                    className="whitespace-normal tooltip tooltip-left"
                    data-tip={stock.description}
                  >
                    {stock.description.slice(0, 10) + "..."}
                  </span>
                </td>
                <td>{stock.unit}</td>
                <td>{stock.quantity}</td>
                <td>{stock.status}</td>
                {loading ? (
                  <td>{tinyLoading}</td>
                ) : (
                  <td className="flex gap-x-2">
                    {/* edit */}
                    <button
                      className="btn btn-sm btn-circle btn-secondary"
                      onClick={() => {
                        setShowUpdateModal(true);
                        setStock(stock);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>

                    {/* delete */}
                    <button
                      className="btn btn-sm btn-circle btn-accent"
                      onClick={() => handleRemoveStock(stock._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {showUpdateModal && (
        <Modal
          showModal={showUpdateModal}
          setShowModal={setShowUpdateModal}
          modalHeader={"Stock Update"}
          content={<StockUpdate stock={stock} />}
        />
      )}
    </>
  );
};

export default ManageStocks;
