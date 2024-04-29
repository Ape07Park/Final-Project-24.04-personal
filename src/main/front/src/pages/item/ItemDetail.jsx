import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { Typography } from '@mui/material';
import CountDown from "../components/CountDown";
import Rating from "../components/Rating";
import { useNavigate } from 'react-router-dom';

export default function ItemDetail() {
  const { iid } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState({});
  const [options, setOptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/ft/item/detail/${iid}`)
      .then(response => {
        const { item, options, tags } = response.data;

        const formattedItem = {
          iid: item.iid,
          name: item.name,
          category: item.category,
          img1: item.img1,
          img2: item.img2,
          img3: item.img3,
          price: item.price,
          saleDate: item.saleDate,
          salePrice: item.salePrice,
          totalSta: item.totalSta,
        };
        setItem(formattedItem);

        const formattedOptions = options ? options.map(option => ({
          ioid: option.ioid,
          option: option.option,
          stock: option.count, 
          count: 0, 
          price: option.price, 
        })) : [];
        setOptions(formattedOptions);

        const formattedTags = tags ? tags.map(tag => ({
          itid: tag.itid,
          tag: tag.tag,
        })) : [];
        setTags(formattedTags);

        setIsLoading(false);
      })
      .catch(err => console.log(err))
  }, [iid]);

  const increaseQuantity = (index) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[index].count += 1;
    setSelectedOptions(updatedSelectedOptions);
  };

  const decreaseQuantity = (index) => {
    const updatedSelectedOptions = [...selectedOptions];
    if (updatedSelectedOptions[index].count > 1) {
      updatedSelectedOptions[index].count -= 1;
      setSelectedOptions(updatedSelectedOptions);
    }
  };

  const handleOptionChange = (e) => {
    const selectedOption = e.target.value;
    const optionIndex = options.findIndex(option => option.option === selectedOption);
    if (optionIndex !== -1) {
      const updatedOptions = [...options];
      updatedOptions[optionIndex].count = 1;
      if (isOptionAlreadySelected(selectedOption)) {
        alert('이미 옵션이 선택되어 있습니다.');
        return;
      }
      setSelectedOptions([...selectedOptions, updatedOptions[optionIndex]]);
    }
  };

  const isOptionAlreadySelected = (selectedOption) => {
    return selectedOptions.some(option => option.option === selectedOption);
  };

  const removeOption = (index) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions.splice(index, 1);
    setSelectedOptions(updatedSelectedOptions);
  };

  useEffect(() => {
    let totalPrice = 0;
    selectedOptions.forEach(option => {
      totalPrice += option.count * Number(document.getElementById('currentPrice').innerText);
    });
    setTotalPrice(totalPrice);
  }, [selectedOptions]);

  const handleAddToCart = () => {
    const cartItems = selectedOptions.map(option => ({
      iid: item.iid,
      ioid: option.ioid,
      count: option.count,
      totalPrice: document.getElementById('currentPrice').innerText
    }));
    axios.post('/ft/api/carts', cartItems)
      .then(response => {
        console.log('장바구니에 상품이 추가되었습니다.');
      })
      .catch(error => {
        console.error('장바구니 추가 실패:', error);
      });
  };
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={7} style={{ padding:50, textAlign: 'center' }}>
        <img src={item.img1} alt={item.img1} style={{ width: '80%', height: 400 }} />
        <Rating item={item} strSize={22}/>
        {tags.map((tag, index) => (
          <span 
            key={index}
            style={{ 
              display: "inline-block", 
              borderRadius: "999px",
              padding: "2px 8px", 
              marginRight: "5px",
              fontSize: "0.7rem", 
              fontWeight: "bold", 
              color: "black", 
              backgroundColor: "lightgrey", 
              border: "1px solid grey", 
            }}
            onClick={() => navigate(`/itemlist/${tag.tag}`)}
          >
            #{tag.tag}
          </span>
        ))}
      </Grid>
      <Grid item xs={12} md={5} style={{padding:50}}>
        <Typography variant="h5" gutterBottom>
          {item.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <CountDown saleDate={item.saleDate} />
        </Typography>
        <div style={{ marginBottom: '10px' }} >
          <span id="nowPrice" style={item.salePrice && new Date(item.saleDate) > new Date() ? { textDecoration: 'line-through', lineHeight: '1.5', fontSize: 'small' } : {}}>
            {item.saleDate && new Date(item.saleDate) > new Date() && item.price ? `${item.price}원` : ''}
          </span><br/>
          <span id="currentPrice">{item.saleDate && new Date(item.saleDate) > new Date() ? (item.salePrice ? item.salePrice : '') : (item.price ? item.price : '')}</span><span>원</span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Select
            value=''
            onChange={handleOptionChange}
            displayEmpty
            title="옵션 선택"
            fullWidth
            style={{ width: '80%' }}
            MenuProps={{ PaperProps: { style: { width: 'max-content' } } }}
          >
            <MenuItem value='' disabled>옵션 선택</MenuItem>
            {options.map(option => (
              <MenuItem key={option.option} value={option.option} style={{ justifyContent: 'space-between' }}>
                <span>{option.option}</span>
                <span>{option.stock}개</span>
              </MenuItem>
            ))}
          </Select>
          {selectedOptions.map((option, index) => (
            <Box 
              key={index} 
              display="flex" 
              alignItems="center" 
              marginBottom={1} 
              p={1}
              borderRadius={1}
              boxShadow={2}
              bgcolor="#f5f5f5"
              border="1px solid #ccc"
              style={{ width: '65%', marginTop: 5, minHeight: 50 }} 
            >
              <Typography variant="body1" style={{ flexGrow: 1 }}>
                {option.option}
              </Typography>
              <Button onClick={() => decreaseQuantity(index)}>-</Button>
              <Input
                value={option.count}
                readOnly
                style={{ width: `${(option.count.toString().length + 1) * 10}px`, margin: '0 5px' }} 
                disableUnderline 
              />
              <Button onClick={() => increaseQuantity(index)}>+</Button>
              <Button onClick={() => removeOption(index)}>X</Button>
            </Box>
          ))}
        </div>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>
          총 가격: {totalPrice}원
        </Typography>
        <Button variant="contained" color="primary" style={{ marginBottom: '10px' }}>구매하기</Button>
        <Button variant="contained" color="primary" style={{ marginBottom: '10px', marginLeft:5 }} onClick={handleAddToCart}>장바구니</Button>
        <Button variant="contained" color="primary" style={{ marginBottom: '10px', marginLeft:5 }}>찜</Button>
      </Grid>
      <Grid item xs={12} md={12} style={{ padding:50, textAlign: 'center' }}>
        <img src={item.img2} alt={item.img2} style={{ width: '90%' }} />
        <img src={item.img2} alt={item.img2} style={{ width: '90%' }} />
      </Grid>
    </Grid>
  )
}
