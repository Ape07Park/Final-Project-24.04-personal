import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuIcon from '@mui/icons-material/Menu';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import YouTubeIcon from '@mui/icons-material/YouTube';
import VideocamIcon from '@mui/icons-material/Videocam';

import { useAuthContext } from "../context/AuthContext";

export default function SearchHeader() {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthContext(); // useAuthContext 훅에서 가져온 값

  const handleSubmit = e => {
    e.preventDefault();
    navigate(`/videos/${text}`);
  }

  useEffect(() => {
    setText(keyword || '');
  }, [keyword]);

  return (
    <header>
      <Stack direction={'row'} alignItems='center'>
        <Grid container>
          <Grid item xs={2} md={2} lg={3}>
            <Link href='/' style={{textDecoration: 'none', color: 'black'}}>
              <Stack direction={'row'} spacing={1} alignItems='center'>
                <YouTubeIcon color='error' fontSize="large" />
                <Typography variant="h4" 
                  sx={{fontWeight: 'bold', display: {xs: 'none', md: 'none', lg: 'flex'}}}>
                  Youtube
                </Typography>
              </Stack>
            </Link>
          </Grid>
          <Grid item xs={7} md={6} lg={4}>
            <Paper
              component="form" onSubmit={handleSubmit}
              sx={{ p:'2px 4px', display:'flex', alignItems:'center', width:'100%' }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="검색..."
                value={text} 
                onChange={e => setText(e.target.value)}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton type="button" sx={{ p: 1 }} aria-label="search" onClick={handleSubmit}>
                <SearchIcon />
              </IconButton>
            </Paper>
          </Grid>
          <Grid item xs={3} md={4} lg={5}>
            <Stack direction='row' spacing={2} justifyContent='right' alignItems='center'
              sx={{display: {xs: 'none', md: 'none', lg: 'flex'}}}>
              {user && user.isAdmin && 
                <Link href='/videos/admin' underline="hover" color='primary'>
                  <Typography variant="h6">관리자 메뉴</Typography>
                </Link>}
              {user && 
                <Link href='/videos/record' underline="hover" color='primary'>
                  <Stack direction={'row'} alignItems='center' sx={{mr: 1}}>
                    <Typography variant="h6">시청기록</Typography>
                    
                  </Stack>
                </Link>}
              {user && user.photoURL && (
                <img src={user.photoURL} alt={user.displayName} height='32' style={{borderRadius:100}} />
              )}
              {user && <Typography variant="h6">{user.displayName}</Typography>}
              {user && (
                <Button variant="outlined" onClick={logout}>
                  로그아웃
                </Button>
              )}
              
            </Stack>
            <Stack direction='row' spacing={2} justifyContent='right' alignItems='center'
              sx={{display: {xs: 'flex', md: 'flex', lg: 'none'}}}>
          
                
              <IconButton sx={{ p: 1 }} aria-label="menu" color="inherit"
                onClick={() => setIsMenuOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer open={isMenuOpen} onClose={() => setIsMenuOpen(false)} anchor="right"
                sx={{ "& .MuiDrawer-paper": { height: "20%" } }}>
                <Box sx={{ width: 250 }} role="presentation" onClick={() => setIsMenuOpen(false)}>
                  <List>
                    {user && 
                      <ListItem key={'key01'} disablePadding sx={{ px: 2, py: 0.5 }}>
                        <Link href='/videos/record' color='primary'>
                          <Typography variant="h6">시청기록</Typography>
                        </Link>
                      </ListItem>}
                    {user && user.isAdmin &&
                      <ListItem key={'key02'} disablePadding sx={{ px: 2, py: 0.5 }}>
                        <Link href='/videos/admin' color='primary'>
                          <Typography variant="h6">관리자 메뉴</Typography>
                        </Link>
                      </ListItem>}
                    <ListItem key={'key03'} disablePadding sx={{ px: 2, py: 0.5 }}>
                      {user && (
                        <Button variant="outlined" onClick={logout}>
                          로그아웃
                        </Button>
                      )}
                      
                    </ListItem>
                  </List>
                </Box>
              </Drawer>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <Divider sx={{my: 1}} />
    </header>
  )
}
