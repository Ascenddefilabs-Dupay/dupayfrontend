'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const UserRegistration: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [qrCode, setQrCode] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/register/', {
                name,
                mobile_number: mobileNumber,
            });

            setQrCode(response.data.qr_code);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleMobileNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMobileNumber(e.target.value);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">User Registration</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium text-gray-700">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="mobileNumber" className="block font-medium text-gray-700">Mobile Number:</label>
                    <input
                        type="text"
                        id="mobileNumber"
                        value={mobileNumber}
                        onChange={handleMobileNumberChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Register
                </button>
            </form>

            {qrCode && (
                <div className="mt-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Your QR Code:</h2>
                    <img
                        src={`data:image/png;base64,${qrCode}`}
                        alt="QR Code"
                        className="mt-4 border-2 border-blue-500 rounded-md mx-auto"
                    />
                </div>
            )}
        </div>
    );
};

export default UserRegistration;
