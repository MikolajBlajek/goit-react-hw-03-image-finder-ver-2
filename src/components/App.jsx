import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';

import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import styled from 'styled-components';

const AppWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding-bottom: 24px;
`;
const SearchbarWrapper = styled.div`
  top: 0;
  left: 0;
  position: sticky;
  z-index: 1100;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 64px;
  padding-right: 24px;
  padding-left: 24px;
  padding-top: 12px;
  padding-bottom: 12px;
  color: #fff;
  background-color: #3f51b5;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
`;

const apiKey = '42631072-6b0d19ed7a3e888324b209d49';

export function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const newUrl = `https://pixabay.com/api/?q=${searchTerm}&page=${currentPage}&key=${apiKey}&image_type=photo&orientation=horizontal&per_page=12`;

  useEffect(() => {
    if (searchTerm) {
      fetchPics();
    }
    // eslint-disable-next-line
  }, [searchTerm, currentPage]);

  const fetchPics = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(newUrl);
      setImages([...images, ...res.data.hits]);
      console.log(res);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setImages([]);
  };

  const eventListener = function (event) {
    const key = event.key;
    if (key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', eventListener);

    return () => {
      document.removeEventListener('keydown', eventListener);
    };
    // eslint-disable-next-line
  }, [selectedImage]);

  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const openModal = imageURL => {
    setSelectedImage(imageURL);
    console.log(imageURL);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <AppWrapper>
        <SearchbarWrapper>
          <Searchbar onSubmit={handleInputChange} value={searchTerm} />
        </SearchbarWrapper>
        {searchTerm && (
          <>
            <ImageGallery images={images} onClick={openModal} />
            {isLoading ? (
              <Loader />
            ) : (
              <Button onClick={loadMore}>Load More</Button>
            )}
          </>
        )}
        {selectedImage && (
          <Modal imageURL={selectedImage} onClose={closeModal} />
        )}
      </AppWrapper>
    </div>
  );
}
