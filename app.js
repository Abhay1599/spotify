document.addEventListener("DOMContentLoaded", function () {
  const fetchAlbumButton = document.getElementById("fetchAlbum");
  const albumDetailsDiv = document.getElementById("albumDetails");

  fetchAlbumButton.addEventListener("click", fetchAlbumData);

  // Authorization 
  async function fetchAccessToken() {
    const client_id = "1e66683ed4004a06be4eeebe743750e0"; // Replace with your client ID
    const client_secret = "7c8663b4307f4e81a5334a1d2947c600"; // Replace with your client secret

    const authOptions = {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(client_id + ":" + client_secret),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    };

    const response = await fetch("https://accounts.spotify.com/api/token", authOptions);
    const data = await response.json();
    return data.access_token;
  }

  // ablbum fetch
  async function fetchAlbumData() {
    try {
      const accessToken = await fetchAccessToken();
      const albumId = "2up3OPMp9Tb4dAKM2erWXQ"; // Replace with desired album ID

      const headers = new Headers({
        Authorization: `Bearer ${accessToken}`
      });

      const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        method: "GET",
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const albumData = await response.json();
      displayAlbumData(albumData);
    } catch (error) {
      console.error("Error fetching album data:", error);
      albumDetailsDiv.innerHTML = "Error fetching album data. Please check your access token and network connection.";
    }
  }

  function displayAlbumData(albumData) {
    const albumName = albumData.name;
    const artistName = albumData.artists[0].name;
    const releaseDate = albumData.release_date;
    const imageUrl = albumData.images[0].url; // Get the URL of the first image

    const albumInfoParagraph = document.createElement("p");
    albumInfoParagraph.textContent = `Album: ${albumName} by ${artistName}, Released: ${releaseDate}`;

    const albumImage = document.createElement("img");
    albumImage.src = imageUrl;
    albumImage.alt = "Album Cover";

    albumDetailsDiv.innerHTML = "";
    albumDetailsDiv.appendChild(albumInfoParagraph);
    albumDetailsDiv.appendChild(albumImage);
  }
});
