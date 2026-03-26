
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./BlogList.css";

function BlogList() {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const res = await axios.get("https://bmtadmin.onrender.com/api/blogs");
    setBlogs(res.data);
  };

  const deleteBlog = async (id) => {
    await axios.delete(`https://bmtadmin.onrender.com/api/blogs/${id}`);
    fetchBlogs();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="blog-list-container">
      <h2>Blog List</h2>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog._id}>
              <td><img src={blog.image} alt={blog.title} width="80" /></td>
              <td>{blog.title}</td>
              <td>{blog.category}</td>
              <td>{blog.status}</td>
              <td>
                <button onClick={() => deleteBlog(blog._id)}>Delete</button>
                {/* Add edit functionality here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BlogList;