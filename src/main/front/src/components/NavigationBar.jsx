import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListIcon from '@mui/icons-material/List';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import BedroomChildIcon from '@mui/icons-material/BedroomChild';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useHistory } from 'react-router-dom'; // useHistory 추가
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import '../css/nav.css';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: 0,
    marginLeft: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

export default function NavigationBar() {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 네비게이션 함수 가져오기

    const iconMap = {
        '특가': <WhatshotIcon />,
        '기획전': <BedroomChildIcon />,
        '카테고리': <ListIcon />
    };

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const [isLoggedIn, setIsLoggedIn] = React.useState(false); // 기본적으로 로그아웃 상태

    // 추가: 세션 로그인 상태를 확인하고 업데이트하는 함수
    const checkLoginStatus = () => {
        // 세션 로그인 여부를 확인하는 로직
        // 세션이 로그인되어 있다면 setIsLoggedIn(true) 호출
        // 세션이 로그아웃되어 있다면 setIsLoggedIn(false) 호출
    };

    // 추가: 컴포넌트가 처음 마운트될 때 세션 로그인 상태를 확인
    React.useEffect(() => {
        checkLoginStatus();
    }, []);

    const handleLogin = () => {
        // 로그아웃 로직 수행
        // 세션 상태를 로그아웃 상태로 변경
        setIsLoggedIn(true);
    };
    const handleLogout = () => {
        // 로그아웃 로직 수행
        // 세션 상태를 로그아웃 상태로 변경
        setIsLoggedIn(false);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {['특가', '기획전', '카테고리'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {iconMap[text]}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['주문내역', '내 정보'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <ShoppingCartIcon /> : <AccountCircle />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const StyledAppBar = styled(AppBar)({
        backgroundColor: 'gray',
        height: '120px',
        justifyContent: 'center',
    });

    // 검색 버튼 클릭 시 실행되는 함수
    const handleSearch = (event) => {
        event.preventDefault(); // 기본 이벤트 방지
        const searchQuery = event.target.elements.search.value.trim(); // 검색어 추출
        if (searchQuery) {
            navigate(`/itemlist/${searchQuery}`); // navigate 함수로 페이지 이동
        }
    };

    return (
        <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
            <StyledAppBar position="static">
                <Toolbar>
                    <div>
                        <Button onClick={toggleDrawer(true)} color="inherit"><MenuIcon /></Button>
                        <Drawer open={open} onClose={toggleDrawer(false)}>
                            {DrawerList}
                        </Drawer>
                    </div>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'center', fontWeight: 'bolder' }}
                    >
                        <Link to={'/'} className='mainPageLink'>이건 링크임</Link>
                    </Typography>
                    <Box sx={{ flexGrow: 0.5 }} />
                    <form onSubmit={handleSearch}> 
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                name="search" // 검색어 필드의 이름 설정
                                placeholder="검색"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>
                    </form>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            color="inherit"
                        >
                            <Badge badgeContent={1} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                        {isLoggedIn ? (
                            <>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-haspopup="true"
                                    color="inherit"
                                    component={Link}
                                    to="/account" // 로그인 상태에 따라 연결할 URL 변경
                                >
                                    <AccountCircle />
                                </IconButton>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-haspopup="true"
                                    color="inherit"
                                    onClick={handleLogout}
                                >
                                    <LogoutIcon />
                                </IconButton>
                            </>
                        ) : (
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-haspopup="true"
                                color="inherit"
                                onClick={handleLogin} 
                            >
                                <LoginIcon />
                            </IconButton>
                        )}

                    </Box>
                </Toolbar>
            </StyledAppBar>
        </Box>
    );
}
