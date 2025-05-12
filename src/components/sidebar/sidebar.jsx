import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import SearchIcon from '@mui/icons-material/Search';

import styles from './sidebar.module.css'
import { useNavigate } from 'react-router-dom';

function SideBar() {
    const navigate = useNavigate();

    return(
        <div className={styles.source}>
            <button className={styles.button} onClick={() => navigate('/spotlight')}>
                <EmojiObjectsOutlinedIcon sx={{ fontSize: 60 }} className="icon"/>
            </button>

            <button className={styles.button} onClick={() => navigate('/search')}>
                <SearchIcon sx={{ fontSize: 60 }} className="icon"/> 
            </button>

            <button className={styles.button} onClick={() => navigate('/camera')}>
                <AddAPhotoOutlinedIcon sx={{ fontSize: 60 }} className="icon"/>
            </button>

            <button className={styles.button} onClick={() => navigate('/profile')}>
                <AccountCircleOutlinedIcon sx={{ fontSize: 60 }} className="icon"/>
            </button>
        </div>
    );
}

export default SideBar;