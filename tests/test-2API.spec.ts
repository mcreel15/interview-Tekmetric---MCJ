const { test, expect } = require('@playwright/test');

test('GET products list', async ({ request }) => {
  // Make a GET request to the API
  const response = await request.get('https://automationexercise.com/api/productsList');
  
  // Assert the response status is 200 (OK)
  expect(response.status()).toBe(200);

  // Parse the JSON response body
  const responseBody = await response.json();
  
  // Log the entire response body to the console
  console.log('Response Body:', JSON.stringify(responseBody, null, 2));

  // You can assert the structure or values of the response
  // Example: Check if the products array is returned and contains items
  expect(responseBody).toHaveProperty('products');
  expect(Array.isArray(responseBody.products)).toBe(true);
  
  //Asserting something about the first product in the list
  if (responseBody.products.length > 0) {
    expect(responseBody.products[0]).toHaveProperty('id');
    expect(responseBody.products[0]).toHaveProperty('name');
    expect(responseBody.products[0]).toHaveProperty('price');
  }
});

test('POST products list', async ({ request }) => {
    // Make a GET request to the API
    const response = await request.post('https://automationexercise.com/api/productsList');
    
    // Assert the response status is 200
    expect(response.status()).toBe(200);
  
    // Parse the JSON response body
    const responseBody = await response.json();
    
    // Log the entire response body to the console
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
   
     // Assert that the response contains the expected message
     expect(responseBody).toHaveProperty('responseCode', 405);
     expect(responseBody).toHaveProperty('message', 'This request method is not supported.');
  });

  test('GET brands list', async ({ request }) => {
    // Make a GET request to the API
    const response = await request.get('https://automationexercise.com/api/brandsList');
    
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  
    // Parse the JSON response body
    const responseBody = await response.json();
    
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
    // Assert that the response body contains a 'brands' property
    expect(responseBody).toHaveProperty('brands');
    
    // Assert that the 'brands' property is an array
    expect(Array.isArray(responseBody.brands)).toBe(true);
    
    //Check that at least one brand exists in the list
    if (responseBody.brands.length > 0) {
      expect(responseBody.brands[0]).toHaveProperty('id');
      expect(responseBody.brands[0]).toHaveProperty('brand');
    }
  });

  test('PUT brands list', async ({ request }) => {
    // Make a GET request to the API
    const response = await request.put('https://automationexercise.com/api/brandsList');
    
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  
    // Parse the JSON response body
    const responseBody = await response.json();
    
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
   
    
 // Assert that the response contains the expected message
 expect(responseBody).toHaveProperty('responseCode', 405);
 expect(responseBody).toHaveProperty('message', 'This request method is not supported.');
   
  });


  test('POST searchProduct - Search for a Product', async ({ request }) => {
    // Define the search query data (form data format)
    const searchData = new URLSearchParams();
    searchData.append('search_product', 'tshirt');  // You can change this value to 'top', 'jean', etc.
  
    // Make a POST request with the correct headers and form data
    const response = await request.post('https://automationexercise.com/api/searchProduct', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // Ensure the correct content type is set
      },
      data: searchData.toString(),  // Send the search data as form data in string format
    });
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  
    // Parse the JSON response body
    const responseBody = await response.json();
    
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
     // Assert that the response body contains a 'products' property
  expect(responseBody).toHaveProperty('products');
  
  // Assert that the 'products' property is an array
  expect(Array.isArray(responseBody.products)).toBe(true);

  // Assert
  if (responseBody.products.length > 0) {
    expect(responseBody.products[0]).toHaveProperty('id');
    expect(responseBody.products[0]).toHaveProperty('name');
    expect(responseBody.products[0]).toHaveProperty('price');
  } else {
    console.log('No products found for the search term.');
  }
});

test('POST searchProduct - Missing Search for a Product', async ({ request }) => {
    // Define the search query data (form data format)
    const searchData = new URLSearchParams();
    searchData.append('search_product', 'tshirt');  // You can change this value to 'top', 'jean', etc.
  
    // Make a POST request with the search parameter in form data
    const response = await request.post('https://automationexercise.com/api/searchProduct', {
        
      data: searchData,  // Send the search data as form data
    });
  
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  
  
    // Parse the JSON response body
    const responseBody = await response.json();
    
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
  // Assert that the response contains the expected message
  expect(responseBody).toHaveProperty('responseCode', 400);
  expect(responseBody).toHaveProperty('message', 'Bad request, search_product parameter is missing in POST request.');
   

  
  
});
 
test('POST verifyLogin - User Login Verification', async ({ request }) => {
    // Define the login credentials (change these values as needed)
    const loginData = new URLSearchParams();
  loginData.append('email', 'test123@blah.com');   
  loginData.append('password', 'test1234');      
  
    // Make a POST request to the API with email and password
    const response = await request.post('https://automationexercise.com/api/verifyLogin', { headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // Ensure the correct content type is set
      },
      data: loginData.toString(),  // Send the login data in the body
    });
  
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  
    // Parse the JSON response body
    const responseBody = await response.json();
    
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
    // Assert that the response message is "User exists!"
    expect(responseBody.message).toBe('User exists!');
  });

  test('POST verifyLogin - User Login Verification - missing email', async ({ request }) => {
    // Define the login credentials (change these values as needed)
    const loginData = new URLSearchParams();
    
  loginData.append('password', 'test1234');      
  
    // Make a POST request to the API with email and password
    const response = await request.post('https://automationexercise.com/api/verifyLogin', { headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // Ensure the correct content type is set
      },
      data: loginData.toString(),  // Send the login data in the body
    });
  
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  
    // Parse the JSON response body
    const responseBody = await response.json();
    
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
    // Assert message
    expect(responseBody).toHaveProperty('responseCode', 400);
    expect(responseBody).toHaveProperty('message', 'Bad request, email or password parameter is missing in POST request.');
  });

  test('POST verifyLogin - User Login Verification Delete', async ({ request }) => {
    // Define the login credentials (change these values as needed)
    const loginData = new URLSearchParams();
  loginData.append('email', 'test123@blah.com');   
  loginData.append('password', 'test1234');      
  
    // Make a POST request to the API with email and password
    const response = await request.delete('https://automationexercise.com/api/verifyLogin', { headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // Ensure the correct content type is set
      },
      data: loginData.toString(),  // Send the login data in the body
    });
  
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  
    // Parse the JSON response body
    const responseBody = await response.json();
    
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
    // Assert 
    expect(responseBody).toHaveProperty('responseCode', 405);
    expect(responseBody.message).toBe('This request method is not supported.');
  });

  test('POST verifyLogin - User Login Verification not found', async ({ request }) => {
    // Define the login credentials (change these values as needed)
    const loginData = new URLSearchParams();
  loginData.append('email', 'test1e23@blah.com');   
  loginData.append('password', 'test1e234');      
  
    // Make a POST request to the API with email and password
    const response = await request.post('https://automationexercise.com/api/verifyLogin', { headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // Ensure the correct content type is set
      },
      data: loginData.toString(),  // Send the login data in the body
    });
  
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  
    // Parse the JSON response body
    const responseBody = await response.json();
    
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
    // Assert 
    expect(responseBody).toHaveProperty('responseCode', 404);
    expect(responseBody.message).toBe('User not found!');
  });

  test('POST createAccount - User Account Creation', async ({ request }) => {
    // Define the account creation data
    const accountData = new URLSearchParams();
    accountData.append('name', 'Tester Test');              // Name
    accountData.append('email', 'test1234@blah.com');  // Email
    accountData.append('password', 'test1234');        // Password
    accountData.append('title', 'Mr');                    // Title (Mr, Mrs, Miss, etc.)
    accountData.append('birth_date', '15');                // Birth date
    accountData.append('birth_month', 'July');             // Birth month
    accountData.append('birth_year', '1990');              // Birth year
    accountData.append('firstname', 'Tester');               // First name
    accountData.append('lastname', 'Test');                 // Last name
    accountData.append('company', 'Moss co');             // Company name
    accountData.append('address1', '123 fish Street');     // Address 1
    accountData.append('address2', 'Apt 4B');              // Address 2
    accountData.append('country', 'United States');        // Country
    accountData.append('zipcode', '12345');                // Zipcode
    accountData.append('state', 'Ohio');             // State
    accountData.append('city', 'Miami');             // City
    accountData.append('mobile_number', '1234567890');    // Mobile number
  
    // Make a POST request to create the user account
    const response = await request.post('https://automationexercise.com/api/createAccount', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // Ensure the correct content type is set
      },
      data: accountData.toString(),  // Send the account data as form data
    });
  
    // Assert that the response status is 201 (Created)
    expect(response.status()).toBe(200);
  
    // Parse the JSON response body
    const responseBody = await response.json();
  
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
    // Assert that the response message is "User created!"
    expect(responseBody).toHaveProperty('responseCode', 201);
    expect(responseBody).toHaveProperty('message', 'User created!');
  });

  

  test('PUT updateAccount - Update User Account', async ({ request }) => {
    // Define login credentials
    const loginData = new URLSearchParams();
    loginData.append('email', 'test1234@blah.com');  
    loginData.append('password', 'test1234');      
  
    // Make a POST request to verify the login
    const loginResponse = await request.post('https://automationexercise.com/api/verifyLogin', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: loginData.toString(),
    });
  
    // Assert that login was successful
    expect(loginResponse.status()).toBe(200);
  
    // Log the login response for debugging
    const loginResponseBody = await loginResponse.json();
    console.log('Login Response:', JSON.stringify(loginResponseBody, null, 2));
  

    
    // Define the updated account data
    const accountData = new URLSearchParams();
    accountData.append('name', 'Test Updated');
    accountData.append('email', 'updated1234@example.com');
    accountData.append('password', 'update1234');
    accountData.append('title', 'Mr');
    accountData.append('birth_date', '15');
    accountData.append('birth_month', 'July');
    accountData.append('birth_year', '1990');
    accountData.append('firstname', 'John');
    accountData.append('lastname', 'Updated');
    accountData.append('company', 'Moss Change');
    accountData.append('address1', '456 New Street');
    accountData.append('address2', 'Suite 101');
    accountData.append('country', 'United States');
    accountData.append('zipcode', '67890');
    accountData.append('state', 'Ohio');
    accountData.append('city', 'Parma');
    accountData.append('mobile_number', '1987654321');
  
    // Make a PUT request to update the user account without manually including the token
    const response = await request.put('https://automationexercise.com/api/updateAccount', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // No need for the Authorization header with token if cookies are handled automatically
      },
      data: accountData.toString(),  // Send the updated account data as form data
    });
  
    // Log the full response for debugging
    console.log('Response Status:', response.status());
    const responseBody = await response.json();
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
    // Assert that the response status is 200 (OK) if successful
    expect(response.status()).toBe(200);
  
    // Assert that the response message is "User updated!"
    expect(responseBody).toHaveProperty('message', 'User updated!');
  });

  test('GET getUserDetailByEmail - Retrieve User Details by Email', async ({ request }) => {
    const email = 'test1234@blah.com';  

    // Make a GET request to retrieve user details by email
    const response = await request.get(`https://automationexercise.com/api/getUserDetailByEmail`, {
      params: {
        email: email,  // Send the email as a query parameter
      },
    });
  
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  
    // Parse the response body to JSON
    const responseBody = await response.json();
  
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
    // Assert that the response contains user details (assuming a "user" property exists)
    expect(responseBody).toHaveProperty('responseCode', 200);
    //expect(responseBody).toHaveProperty('message', 'User details retrieved!');
    
  
    expect(responseBody.user).toHaveProperty('email', email);  // Check if email in response matches the one sent
  });


  test('DELETE deleteAccount - Account Deletion', async ({ request }) => {
    // Define the account deletion data (email and password)
    const accountData = new URLSearchParams();
    accountData.append('email', 'test1234@blah.com');  // Replace with the valid email to delete
    accountData.append('password', 'test1234');         // Replace with the valid password
  
    // Make a DELETE request to delete the account
    const response = await request.delete('https://automationexercise.com/api/deleteAccount', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',  // Ensure the correct content type is set
      },
      data: accountData.toString(),  // Send the account deletion data in the body
    });
  
    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  
    // Parse the JSON response body
    const responseBody = await response.json();
  
    // Log the response body to the console for debugging
    console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
    // Assert that the response message is "Account deleted!"
    expect(responseBody).toHaveProperty('message', 'Account deleted!');
  });