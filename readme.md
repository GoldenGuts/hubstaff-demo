# Hubstaff Automation Demo

This repository contains automated tests for the Hubstaff Platform. The tests are designed to validate functionality as specified in the provided test cases and reported issues.

## Prerequisites

Before you run the tests, ensure you have the following installed:
- Node.js
- Playwright

## Environment Setup

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/GoldenGuts/hubstaff-demo.git
   ```

2. Navigate to the project directory:
   ```bash
   cd hubstaff-demo
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Set up the environment variables by creating a `.env` file in the root of your project directory and populating it with the necessary credentials and settings. The required environment variables include:
   - `CUSTOMER_USERNAME`
   - `CUSTOMER_PASSWORD`

## Running the Tests

To run the tests, execute the following command in the terminal:
```bash
npx playwright test
```

## Test Cases and Bug Reports

- **Test Cases:** Detailed test cases can be found [here](https://docs.google.com/spreadsheets/d/1525rnszf_5Y4bEklywQ2gKSQvB-aYXg-y9Q4jp9mknE/edit?usp=sharing).
- **Bug Reports:** Issues and bugs reported during testing are tracked [here](https://github.com/GoldenGuts/hubstaff-demo/issues).
