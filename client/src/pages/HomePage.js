import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { FiThumbsUp } from "react-icons/fi";

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [newsItems, setNewsItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [like, setlike] = useState("");
  const navigate = useNavigate();

  const currentuser = JSON.parse(localStorage.getItem("news-user"));
  const likepost = async (newsid,userid) =>{
      try {
        const likeorunlike = await axios.post("/api/newsitems/likeorunlikepost",newsid, userid );
        setlike(likeorunlike);
        console.log("Liked Successfully");
        const alreadyLiked = newsid.likes.find(
          (obj) => obj.userid.toString() == currentuser._id
        );
        console.log(alreadyLiked);
      } catch (error) {
        console.log(error);
      }
  }
  const getData = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/newsitems/getallnewsitems");
      setLoading(false);
      setNewsItems(result.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="grid px-20 sm:px-5 mt-5">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          type="text"
          className="border-2 h-10 w-full border-gray-300 px-5"
          placeholder="Search news"
        />
      </div>
      {newsItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-5 mx-20 sm:mx-5 my-5">
          {newsItems
            .filter((item) =>
              item.title.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((item) => {
              return (
                <div
                  className="shadow-md p-3 border cursor-pointer"
                >
                  <h1 className="text-primary text-lg font-semibold" onClick={() => navigate(`/newsdesc/${item._id}`)}>
                    {item.title}
                  </h1>
                  <p>{item.description}</p>
                  <img src={item.image} class="object-fill h-48 w-96" />
                  <div className="flex justify-between items-center">
                    <div className="mt-2 ml-3 flex justify-between">
                      <FiThumbsUp className="text-4xl"  onClick={()=>{
                        likepost({ newsid: item._id,
                        userid: currentuser._id
                        })
                      }}/>
                      <p className="m-3">{item.likes.length}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-500 text-sm">
                        By : {item.user.email}
                      </span>
                      <br />
                      <span className="text-gray-500  text-sm">
                        On : {item.createdAt.slice(0, 10)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </Layout>
  );
}

export default HomePage;
