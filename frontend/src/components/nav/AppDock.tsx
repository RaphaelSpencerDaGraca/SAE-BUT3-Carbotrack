import { useNavigate } from 'react-router-dom';
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import Dock from './Dock';

export default function AppDock() {
    const navigate = useNavigate();

    const items = [
        { icon: <VscHome size={18} />,    label: 'Accueil',  onClick: () => navigate('/') },
        { icon: <VscArchive size={18} />, label: 'Archives', onClick: () => navigate('/archives') },
        { icon: <VscAccount size={18} />, label: 'Profil',   onClick: () => navigate('/profile') },
        { icon: <VscSettingsGear size={18} />, label: 'Réglages', onClick: () => navigate('/settings') },
    ];

    return (
        <Dock
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
            className="backdrop-blur bg-white/70 dark:bg-black/40"
        />
    );
}
