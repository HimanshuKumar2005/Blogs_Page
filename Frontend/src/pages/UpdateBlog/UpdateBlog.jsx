import { useState, useEffect } from "react";
import { getBlogById, updateBlog } from "../../api/internal";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./UpdateBlog.module.css";
import { useSelector } from "react-redux";
import TextInput from "../../components/TextInput/TextInput";

function UpdateBlog() {
  const navigate = useNavigate();

  const params = useParams();
  const blogId = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");

  const getPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
  };

  const author = useSelector((state) => state.user._id);

  const updateHandler = async () => {
    try {
      // http:backend_server:port/storage/filename.png
      // base64
      let data;
      if (photo.includes("http")) {
        data = {
          author,
          title,
          content,
          blogId,
        };
      } else {
        data = {
          author,
          title,
          content,
          photo,
          blogId,
        };
      }

      const response = await updateBlog(data);

      if (response && response.status === 200) {
        navigate("/");
      } else {
        console.error("Failed to update blog:", response);
        alert("Failed to update blog. Please try again.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Error updating blog. Please try again.");
    }
  };

  useEffect(() => {
    async function getBlogDetails() {
      try {
        const response = await getBlogById(blogId);
        if (response && response.status === 200) {
          setTitle(response.data.blog.title);
          setContent(response.data.blog.content);
          setPhoto(response.data.blog.photo);
        } else {
          console.error("Failed to fetch blog details:", response);
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    }
    getBlogDetails();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Edit your blog</div>
      <TextInput
        type="text"
        name="title"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "60%" }}
      />
      <textarea
        className={styles.content}
        placeholder="your content goes here..."
        maxLength={400}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={styles.photoPrompt}>
        <p>Choose a photo</p>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/jpg, image/jpeg, image/png"
          onChange={getPhoto}
        />
        <img src={photo} width={150} height={150} />
      </div>
      <button className={styles.update} onClick={updateHandler}>
        Update
      </button>
    </div>
  );
}

export default UpdateBlog;
