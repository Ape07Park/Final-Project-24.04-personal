import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Button, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import CountDown from "../components/CountDown";
import { Items, getItemDetail } from "../components/Items";
import Rating from "../components/Rating";


export default function ItemList() {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();
  const { searchQuery } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const productList = await Items();
        setList(productList);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product list:', error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const lowercaseSearchQuery = searchQuery ? searchQuery.toLowerCase() : ''; // 검색어가 없을 경우 빈 문자열로 설정
  
    const filtered = list.filter(item => {
      // 아이템 이름 검색
      const itemNameIncludes = item.name && item.name.toLowerCase().includes(lowercaseSearchQuery);
      
      // 태그 검색
      const tagsIncludes = item.tags && item.tags.some(tag => tag.tag.toLowerCase().includes(lowercaseSearchQuery));
      
      // 옵션 검색
      const optionsIncludes = item.options && item.options.some(option => option.option.toLowerCase().includes(lowercaseSearchQuery));
      
      // 아이템 이름, 태그, 옵션 중 하나라도 검색어를 포함하면 true 반환
      return itemNameIncludes || tagsIncludes || optionsIncludes;
    });
  
    setFilteredItems(filtered);
  }, [searchQuery, list]);

  return (
    <>
      <Button onClick={() => { navigate(`/admin/itemlist/`) }}>어드민</Button>
      <Grid container spacing={2}>
        {filteredItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper style={{ padding: 20, height: 320, cursor: 'pointer' }} onClick={() => { navigate(`/item/detail/${item.iid}`) }}>
              <img src={item.img1} alt={'img'} style={{ width: '100%', height: 200 }} />
              <table>
                <tbody>
                  <tr>
                    <td>{new Date(item.saleDate) > new Date() ? <CountDown saleDate={item.saleDate} /> : <Typography variant="h6">&nbsp;</Typography>}</td>
                  </tr>
                  <tr>
                    <td>
                      {item.name ? (
                        <Typography variant="body2" style={{ display: 'inline-block', lineHeight: '1.2', maxHeight: '2.4em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </Typography>
                      ) : (
                        <Typography variant="h6">&nbsp;</Typography>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Rating key={item.iid} item={item} strSize={16}/>
                    </td>
                  </tr>
                  {item.salePrice !== 0 && item.salePrice && new Date(item.saleDate) > new Date() && (
                  <tr>
                    <td>
                      <Stack direction={'row'} spacing={1} >
                        <Typography variant="body2">{((item.price - item.salePrice) / item.price * 100).toFixed(0)}%</Typography>
                        {item.salePrice && new Date(item.saleDate) > new Date() ? (
                          <Typography variant="body2" style={{ textDecoration: 'line-through', lineHeight: '1.7', fontSize: 'small' }}>
                            {item.price.toLocaleString()}원
                          </Typography>
                        ) : (
                          <Typography variant="body2">&nbsp;</Typography>
                        )}
                        <Typography variant="body2">{item.salePrice.toLocaleString()}원</Typography>
                      </Stack>
                    </td>
                    <td></td>
                  </tr>
                )}
                {!(item.salePrice !== 0 && item.salePrice && new Date(item.saleDate) > new Date()) && (
                  <tr>
                    <td>
                      <Typography variant="body2">{item.price.toLocaleString()}원</Typography>
                    </td>
                    <td></td>
                  </tr>
                )}
                </tbody>
              </table>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
