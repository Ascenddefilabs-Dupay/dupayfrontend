// 'use client'
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const QRCodeList = () => {
//     const [users, setUsers] = useState([]);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchQRCodeList = async () => {
//             try {
//                 const response = await axios.get(`${TransactionType}/transaction_api/qr_code_list/`);
//                 setUsers(response.data);
//             } catch (error) {
//                 setError('Error fetching QR codes');
//             }
//         };

//         fetchQRCodeList();
//     }, []);

//     return (
//         <div>
//             <h1>QR Code List</h1>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {users.length === 0 && <p>No QR codes available</p>}
//             {users.length > 0 && (
//                 <ul>
//                     {users.map((user, index) => (
//                         <li key={index}>
//                             <h2>{user.name}</h2>
//                             <p>Mobile Number: {user.mobile_number}</p>
//                             <img
//                                 src={`data:image/png;base64,${user.qr_code}`}
//                                 alt={`QR Code for ${user.name}`}
//                                 style={{ width: '200px', height: '200px' }}
//                             />
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default QRCodeList;



'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
const TransactionType = process.env.TransactionType

// Define types for the user data and error state
interface User {
    name: string;
    mobile_number: string;
    qr_code: string;
}

const QRCodeList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQRCodeList = async () => {
            try {
                const response = await axios.get<User[]>(`${TransactionType}/transaction_api/qr_code_list/`);
                setUsers(response.data);
            } catch (error) {
                setError('Error fetching QR codes');
            }
        };

        fetchQRCodeList();
    }, []);

    return (
        <div>
            <h1>QR Code List</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {users.length === 0 && <p>No QR codes available</p>}
            {users.length > 0 && (
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>
                            <h2>{user.name}</h2>
                            <p>Mobile Number: {user.mobile_number}</p>
                            <img
                                src={`data:image/png;base64,${user.qr_code}`}
                                alt={`QR Code for ${user.name}`}
                                style={{ width: '200px', height: '200px' }}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default QRCodeList;
