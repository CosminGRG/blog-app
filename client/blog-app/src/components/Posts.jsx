import { useEffect, useState } from "react";
import axios from "../utils/api/axios.config.js";

import PostList from "./PostList.jsx";
import Pagination from './Pagination.jsx'

import './Posts.css';

const API_URL = "/post";

function Post({ data, error, setData, setError }) {
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`)
      .then(() => setData(data.filter(item => item.id !== id)))
    } catch(error) {
      console.log(error);
      setError(error);
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const itemsPerPage = 3;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="app-container">
      <PostList 
        data={data}
        error={error} 
        onDelete={handleDelete}
        itemsPerPage={itemsPerPage} 
        currentPage={currentPage} 
      />
      <div className="pagination-container">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}></Pagination>
      </div>
    </div>
  );
}

export default Post;