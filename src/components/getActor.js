import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid/";
import "../App.css";

const GetActor = ({ paginationModel, setPaginationModel }) => {
  const [comments, setComments] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [content, setContent] = useState("");
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/actor");
        setData(response.data);
        const response2 = await axios.get("/api/comments");
        setComments(response2.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComment = { customer_id: customerId, content };
      const response = await axios.post("/api/comments", newComment);
      setComments([response.data, ...comments]);
      setCustomerId("");
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!commentIdToDelete) return;

    try {
      await axios.delete(`/api/comments/${commentIdToDelete}`);
      setComments(
        comments.filter(
          (comment) => comment.comment_id !== parseInt(commentIdToDelete)
        )
      );
      setCommentIdToDelete("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const getRowId1 = (row) => row.actor_id;
  const getRowId2 = (row) => row.comment_id;

  const columns = [
    { field: "first_name", headerName: "First Name", flex: 1 },
    { field: "last_name", headerName: "Last Name", flex: 1 },
    { field: "last_update", headerName: "Last Update", flex: 2 },
  ];

  const commentColumns = [
    { field: "comment_id", headerName: "Comment ID" },
    { field: "customer_id", headerName: "Customer ID" },
    { field: "content", headerName: "Comment", flex: 3 },
    { field: "created_at", headerName: "Created At", flex: 1 },
  ];

  const changeHeight = () => {
    const rowHeight = 52;
    const footerHeight = 52;
    const visibleRows = paginationModel.pageSize;
    return visibleRows * rowHeight + footerHeight + 60;
  };

  return (
    <div className="actor-container">
      <h1 className="actor-title">List of Currently Recorded Actors</h1>
      <DataGrid
        getRowId={getRowId1}
        rows={data}
        columns={columns}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        className="data-grid"
        sx={{ width: "60%", height: changeHeight() }}
      />

      <div className="comments-container">
        <h1 className="comments-title">Comments Section</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
          <textarea
            placeholder="Enter Comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button type="submit">Post Comment</button>
        </form>

        <DataGrid
          getRowId={getRowId2}
          rows={comments}
          columns={commentColumns}
          autoHeight
          pageSizeOptions={[10]}
          pagination
          className="data-grid-comments"
          sx={{ width: "100%", marginTop: "20px" }}
        />

        <form onSubmit={handleDelete} style={{ marginTop: "20px" }}>
          <input
            type="number"
            placeholder="Comment ID to delete"
            value={commentIdToDelete}
            onChange={(e) => setCommentIdToDelete(e.target.value)}
            required
          />
          <button type="submit">Delete Comment</button>
        </form>
      </div>
    </div>
  );
};

export default GetActor;
