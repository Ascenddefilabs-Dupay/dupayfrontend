export async function getSalt(sub: string, jwt: string): Promise<bigint> {
    const response = await fetch('http://localhost:3002/getSalt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sub, jwt }),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch salt: ${response.statusText}`);
    }

    let data: { salt: string };

    try {
        // Call response.json() to get the JSON data
        data = await response.json();
    } catch (error) {
        throw new Error('Failed to parse response JSON');
    }

    if (!data.salt) {
        throw new Error('Salt not found in response');
    }

    // Convert the salt from string to bigint
    return BigInt(data.salt);
}