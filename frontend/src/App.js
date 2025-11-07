import { useState, useEffect } from "react";

function App() {
  const [favorites, setFavorites] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    const res = await fetch("http://localhost:5000/favorites");
    const data = await res.json();
    setFavorites(data);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Add favorite
  const addFavorite = async () => {
    if (!title || !type) return;
    await fetch("http://localhost:5000/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type }),
    });
    setTitle("");
    setType("");
    fetchFavorites();
  };

  // Delete favorite
  const deleteFavorite = async (id) => {
    await fetch(`http://localhost:5000/favorites/${id}`, { method: "DELETE" });
    fetchFavorites();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Favorites App</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <input
        placeholder="Type (Movie/Book)"
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <button onClick={addFavorite}>Add Favorite</button>

      <ul style={{ marginTop: "20px" }}>
        {favorites.map((fav) => (
          <li key={fav.id}>
            {fav.title} ({fav.type}){" "}
            <button onClick={() => deleteFavorite(fav.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
