import React, { useState, useEffect } from "react";
import axios from "axios";

function ListingForm({ home, homeId }) {
  const isEditing = Boolean(home);
  const [images, setImages] = useState(home ? home.images : []);
  const [uploadedImageURLs, setUploadedImageURLs] = useState(home ? home.images : []);
  const [features, setFeatures] = useState(home ? home.features : []);
  const [price, setPrice] = useState(home ? home.price : '');
  const [baths, setBaths] = useState(home ? home.baths : '');
  const [beds, setBeds] = useState(home ? home.beds : '');
  const [squareFeet, setSquareFeet] = useState(home ? home.squareFeet : '');
  const [description, setDescription] = useState(home ? home.description : '');
  const [address, setAddress] = useState(home ? home.address : '');
  const [zipcode, setZipCode] = useState(home ? home.zipcode : '');
  const [city, setCity] = useState(home ? home.city : '');
  const [currentFeature, setCurrentFeature] = useState("");
  
  const handleFeatureAdd = () => {
    if (currentFeature) {
      setFeatures(prevFeatures => [...prevFeatures, currentFeature]);
      setCurrentFeature("");
    }
  };

  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(image));
        }
      });
    };
  }, [images]);
  

  const handleImageUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setImages(prevImages => [...prevImages, ...newFiles]);
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const removeUploadedImageURL = (index) => {
    setUploadedImageURLs(prevURLs => prevURLs.filter((_, i) => i !== index));
  };  

  const handleSubmit = async (e) => {  // <-- Add async here
    e.preventDefault();
    const formData = new FormData();
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    formData.append('existingImageURLs', JSON.stringify(uploadedImageURLs));
    images.forEach(image => formData.append('newImages', image));
    formData.append('price', e.target[1].value);
    formData.append('baths', e.target[2].value);
    formData.append('beds', e.target[3].value);
    formData.append('squareFeet', e.target[4].value);
    features.forEach(feature => formData.append('features', feature));
    formData.append('description', e.target[7].value);
    formData.append('address', e.target[8].value);
    formData.append('zipcode', e.target[9].value);
    formData.append('city', e.target[10].value);
  
    const token = localStorage.getItem('authToken');
    
    if (isEditing) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      };
      try {
        const response = await axios.put(`http://localhost:5000/api/homes/${homeId}`, formData, config);
        console.log('Attempting to upload image: works');
        console.log('Home updated:', response.data);
      } catch (error) {
        console.error('Error updating home:', error.message);
      }
     } else {
      axios.post('http://localhost:5000/addhome', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
          }
      })
      .then(response => {
        console.log(response.data.message);
        console.log('Attempting to upload image then');
      })
      .catch(error => {
        console.log('Attempting to upload image error');
        console.error('Error adding home:', error.message);
      });
    }
  };  

  return (
    <div>
      <div>
        Selected Images:

        {uploadedImageURLs.map((url, index) => (
          <div key={index}>
            <img src={url} alt="Uploaded" style={{ width: '100px', height: '100px' }} />
            <button onClick={() => removeUploadedImageURL(index)}>Remove</button>
          </div>
        ))}
        {images.map((image, index) => (
          <div key={index + uploadedImageURLs.length}>
            {image.name}
            {image instanceof File && <img src={URL.createObjectURL(image)} alt="Preview" style={{ width: '100px', height: '100px' }} />}
            <button onClick={() => removeImage(index)}>Remove</button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
      <label>
          Images:
          <input type="file" multiple onChange={handleImageUpload} />
        </label>

        <h2 className="informationlisting">Main Information</h2>
        
        <label className="pricelisting">
          Price:
          <input className="pricefield" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" />
        </label>
        
        <label className="bathslisting">
          Baths:
          <input type="number" value={baths} onChange={(e) => setBaths(e.target.value)} placeholder="Number of baths" />
        </label>
        
        <label className="bedslisting">
          Beds:
          <input type="number" value={beds} onChange={(e) => setBeds(e.target.value)} placeholder="Number of beds" />
        </label>
        
        <label className="squarefeetlisting">
          Square Feet:
          <input type="number" value={squareFeet} onChange={(e) => setSquareFeet(e.target.value)} placeholder="Total square feet" />
        </label>
        
        <div className="featureslisting">
          <h3>Features:</h3>
          {features.map((feature, idx) => (
            <div key={idx}>{feature}</div>
          ))}
          <input
            type="text"
            value={currentFeature}
            placeholder="Add feature"
            onChange={(e) => setCurrentFeature(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleFeatureAdd();
              }
            }}
          />
          <button type="button" onClick={handleFeatureAdd}>Add</button>
        </div>
        
        <label className="descriptionlisting">
          <h3>Description:</h3>
          <textarea className="descriptiontextlisting" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description"></textarea>
        </label>

        <h2 className="locationlisting">Location</h2>

        <label className="addresslisting">
          Address:
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" />
        </label>

        <label className="zipcodelisting">
          Zip Code:
          <input type="text" value={zipcode} onChange={(e) => setZipCode(e.target.value)} placeholder="Enter Zip code" />
        </label>

        <label className="citylisting">
          City:
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter City" />
        </label>
        
        <button className="buttonlisting" type="submit">Submit Listing</button>
      </form>
    </div>
  );
}

export default ListingForm;