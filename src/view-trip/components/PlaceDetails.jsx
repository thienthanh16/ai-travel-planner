import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '@/view-trip/components/Footer';
import { Button } from '@/components/ui/button';
import { RiArrowGoBackFill } from "react-icons/ri";


const PlaceDetails = () => {
    const { id } = useParams(); // Lấy tên địa điểm từ URL
    const [placeDetails, setPlaceDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    // Hàm loại bỏ ký tự đặc biệt từ tên địa điểm
    const sanitizePlaceName = (name) => {
        // Giữ lại các ký tự chữ cái và số, loại bỏ ký tự đặc biệt
        return name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    };
    // Hàm fetch dữ liệu từ Google Custom Search API
    const fetchPlaceDetails = async () => {
        try {
            setLoading(true);

            const apiKey = ''; // API Key 
            const cx = ''; // Search Engine ID (CX)
            //const sanitizeQuery = sanitizePlaceName(id);
            const query = sanitizePlaceName(id);
            console.log('Yêu cầu tới API:', `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`);

            if (!query) {
                setError('Tên địa điểm không hợp lệ.');
                setLoading(false);
                return;
            }

            const endpoint = 'https://www.googleapis.com/customsearch/v1';

            // Gửi request tới Google Custom Search API
            const response = await axios.get(endpoint, {
                params: {
                    key: apiKey,
                    cx: cx,
                    q: query,
                },
            });

            const data = response.data;
            if (data.items && data.items.length > 0) {
                // Lấy thông tin từ kết quả tìm kiếm đầu tiên
                const result = data.items[0];
                setPlaceDetails({
                    name: result.title,
                    description: result.snippet,
                    url: result.link,
                    imageUrl: result.pagemap?.cse_image?.[0]?.src || '', // Lấy hình ảnh từ kết quả

                });
            } else {
                setError('Không tìm thấy thông tin về địa điểm này.');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu từ Google Custom Search API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPlaceDetails(); // Gọi hàm fetch khi có tên địa điểm
        }
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
            <h1 className="text-2xl font-bold mb-4">{placeDetails?.name}</h1>
            {placeDetails?.imageUrl && (
                <img
                    src={placeDetails.imageUrl}
                    alt={placeDetails?.name}
                    className="h-[500px] w-full object-cover mb-4 rounded-xl"
                />
            )}
            <p className="text-gray-600 mb-2">{placeDetails?.description}</p>
            <a
                href={placeDetails?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
            >
                See more...
            </a>

            
            <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
                <Footer />
            </div>
        </div>

    );

};

export default PlaceDetails;
