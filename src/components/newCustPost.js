import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import axios from 'axios';

const NewCustomerForm = () => {
    const [customer, setCustomer] = useState({
        first_name: '',
        last_name: '',
        email: '',
        active: true,
    });

    const [address, setAddress] = useState({
        address: '',
        address2: ' ', // Default value as a space
        district: '',
        postal_code: '',
        phone: '',
    });

    const [storeId, setStoreId] = useState(1); // Default store_id
    const [city, setCity] = useState('New York'); // Default city
    const [country, setCountry] = useState('USA'); // Default country

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            customer: { ...customer, store_id: storeId },
            address: { ...address },
            city: { city: city },
            country: { country: country },
        };

        try {
            const response = await axios.post('/api/newcustomer', payload);
            console.log('Customer added successfully:', response.data);
            // Optionally reset the form or show a success message
        } catch (error) {
            console.error('There was an error adding the customer!', error);
            // Optionally show an error message to the user
        }
    };

    return (
        <Container>
            <Typography variant="h4">Add New Customer</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.first_name}
                    onChange={(e) => setCustomer({ ...customer, first_name: e.target.value })}
                    required
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.last_name}
                    onChange={(e) => setCustomer({ ...customer, last_name: e.target.value })}
                    required
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    required
                />

                {/* Store ID Radio Group */}
                <Typography variant="h6">Select Store</Typography>
                <RadioGroup
                    value={storeId}
                    onChange={(e) => setStoreId(Number(e.target.value))}
                >
                    <FormControlLabel value={1} control={<Radio />} label="Store 1" />
                    <FormControlLabel value={2} control={<Radio />} label="Store 2" />
                </RadioGroup>

                {/* City Radio Group */}
                <Typography variant="h6">Select City</Typography>
                <RadioGroup
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                >
                    <FormControlLabel value="New York" control={<Radio />} label="New York" />
                    <FormControlLabel value="Los Angeles" control={<Radio />} label="Los Angeles" />
                </RadioGroup>

                {/* Country Radio Group */}
                <Typography variant="h6">Select Country</Typography>
                <RadioGroup
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                >
                    <FormControlLabel value="USA" control={<Radio />} label="USA" />
                    <FormControlLabel value="Canada" control={<Radio />} label="Canada" />
                </RadioGroup>

                <TextField
                    label="Address"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    required
                />
                <TextField
                    label="Address Line 2"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={address.address2}
                    onChange={(e) => setAddress({ ...address, address2: e.target.value })}
                />
                <TextField
                    label="District"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={address.district}
                    onChange={(e) => setAddress({ ...address, district: e.target.value })}
                    required
                />
                <TextField
                    label="Postal Code"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={address.postal_code}
                    onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                    required
                />
                <TextField
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </form>
        </Container>
    );
};

export default NewCustomerForm;
