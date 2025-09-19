
import React from 'react';

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
);

const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

interface InfoBoxProps {
    isResultView: boolean;
}

const articles = [
    { title: 'Tuyển tập 100+ stt Trung Thu hài hước, độc đáo', url: 'https://phanmemmkt.vn/stt-trung-thu-hai-huoc' },
    { title: '158+ ý tưởng trang trí Trung Thu đẹp, độc đáo', url: 'https://phanmemmkt.vn/y-tuong-trang-tri-trung-thu' },
    { title: '1000+ Cap Trung Thu bán hàng Facebook', url: 'https://phanmemmkt.vn/cap-trung-thu' },
    { title: 'Trung Thu bán gì? 10+ ý tưởng kinh doanh hái ra tiền', url: 'https://phanmemmkt.vn/trung-thu-ban-gi' },
    { title: '6+ ý tưởng content Trung Thu cho quán cafe hút khách', url: 'https://phanmemmkt.vn/content-trung-thu-cho-quan-cafe' },
    { title: '10+ Mẫu content bánh Trung Thu gửi gắm yêu thương đến khách hàng', url: 'https://phanmemmkt.vn/content-banh-trung-thu' },
    { title: 'Lời dẫn chương trình Trung Thu hay, đặc sắc', url: 'https://phanmemmkt.vn/loi-dan-chuong-trinh-trung-thu' },
    { title: '10+ chiến lược marketing bánh Trung Thu X5 doanh số', url: 'https://phanmemmkt.vn/marketing-banh-trung-thu' },
    { title: '5 cách kinh doanh đồ chơi Trung Thu hút khách', url: 'https://phanmemmkt.vn/kinh-doanh-do-choi-trung-thu' },
    { title: 'Tổng hợp 35+ mẫu banner Trung Thu độc đáo, bắt mắt', url: 'https://phanmemmkt.vn/banner-trung-thu' },
    { title: 'Tuyển tập 1001 lời chúc Trung Thu ý nghĩa, ấn tượng', url: 'https://phanmemmkt.vn/loi-chuc-trung-thu' },
    { title: '14 ý tưởng quà tặng Trung Thu ý nghĩa cho người thân, đối tác', url: 'https://phanmemmkt.vn/qua-tang-trung-thu' },
];

const InfoBox: React.FC<InfoBoxProps> = ({ isResultView }) => {
    if (isResultView) {
        return (
            <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner">

            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner">
            
        </div>
    );
};

export default InfoBox;
