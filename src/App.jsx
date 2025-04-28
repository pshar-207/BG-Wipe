import { useState } from "react";
import "./App.css";
const VITE_APIKEY = import.meta.env.VITE_APIKEY;
function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image_file", file);

    try {
      const response = await fetch(
        "https://clipdrop-api.co/remove-background/v1",
        {
          method: "POST",
          headers: {
            "x-api-key": VITE_APIKEY,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from API:", errorData);
        alert(`Error: ${errorData.error}`);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "no-background.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error occurred.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Remove Background & Download</button>
      </form>
    </>
  );
}

export default App;
