import React, { useEffect, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";

import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function AddNews() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [title, setTitle] = useState("");
  const [image, setimage] = useState('');
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("news-user"));
  console.log(user);
  useEffect(() => {
    console.log(convertToRaw(editorState.getCurrentContent()));
  }, [editorState]);
  const navigate = useNavigate();


  function handleFileInput(e) {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setimage(reader.result);
    };
  }

  const save = async () => {
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
        likes: [],
        comments: [],
        image,
        user: {
          userid : user._id, 
          email : user.email
        },
      };
      await axios.post("/api/newsitems/addnewsitem", payload);
      setLoading(false);
      toast("News added successfully", "success");
      navigate("/home");
    } catch (error) {
      console.log(error);
      toast("Something went wrong", "error");
      setLoading(false);
    }
  };
  return (
    <Layout>
      {loading && <Spinner />}
      <h1 className="text-2xl font-semibold mt-5 ml-5">AddNews</h1>
      <div className="px-5 pt-5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="border-2 h-10 w-full border-gray-300 px-5 mb-2"
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-2 w-full border-gray-300 px-5 "
          rows="4"
          placeholder="Description"
        ></textarea>
        <div className="m-4">
          <label htmlFor="Image Upload" class="inline-block mb-2 text-gray-500">
            Upload Image(jpg,png,svg,jpeg)
          </label>
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
              <div class="flex flex-col items-center justify-center pt-7">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                  Select a photo
                </p>
              </div>
              <input type="file" class="opacity-0" onChange={handleFileInput}  />
            </label>
          </div>
          <div class="flex items-center w-full m-4">
          {image !== '' && (<img src={image} className="object-cover"/>)}
          </div>
        </div>
      </div>
      <div>

      </div>
      <div className="border-2 border-gray-300 mx-5 rounded px-2">
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          editorClassName="draft-editor"
        />
      </div>

      <div className="flex justify-end space-x-5 pr-5 mt-5">
        <button
          className="px-5 py-1 bg-red-700 text-sm text-white"
          onClick={() => navigate("/home")}
        >
          BACK
        </button>
        <button
          className="px-5 py-1 bg-green-500 text-sm text-white"
          onClick={save}
        >
          SAVE
        </button>
      </div>
    </Layout>
  );
}

export default AddNews;
