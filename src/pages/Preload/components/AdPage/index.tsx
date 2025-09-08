import { IAdData, PreloadPageStatus } from "@/types/preload";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface IProps {
    adData: IAdData;
    setPageStatus: (status: PreloadPageStatus) => void;
}

const AdPage = (props:IProps) => {
    const { adData, setPageStatus } = props;
    const [countdown, setCountdown] = useState(6);
    const navigate = useNavigate();

    useEffect(() => {
        if (countdown === 0 && adData) {
            handleAdComplete();
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, adData]);

    const handleAdOver = () => {
        setPageStatus(PreloadPageStatus.Loading);
    }


    const handleSkipAd = () => {
        handleAdOver();
    };

    const handleAdComplete = () => {
        handleAdOver();
    };

    const handleAdClick = () => {
        if (adData && adData.link) {
            handleAdOver();
            navigate(adData.link);
        }
    };

    return (
        <div className="ad-page">
            <div className="ad-content" onClick={handleAdClick}>
                <h2>{adData.title}</h2>
                <p>{adData.description}</p>
                <div className="ad-image">
                    <img src={adData.image} alt={adData.title} />
                </div>
            </div>
            <button className="skip-btn" onClick={handleSkipAd}>
                跳过 {countdown}s
            </button>
        </div>
    );
};

export default AdPage;