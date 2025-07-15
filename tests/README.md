# API Tests

This directory contains comprehensive tests for the astrology application's API routes.

## Test Structure

- `setup.ts` - Global test configuration and setup
- `utils/test-helpers.ts` - Shared test utilities and mock data
- `api.test.ts` - Main test suite that imports all API tests
- `routes/api/*/+server.test.ts` - Individual API route tests

## API Endpoints Tested

### `/api/birth-chart`
- **Method**: POST
- **Purpose**: Calculate birth chart using Swiss Ephemeris API
- **Tests**:
  - Valid request handling
  - Missing required fields validation
  - Null field validation
  - Error handling for calculation failures
  - Invalid JSON handling
  - Empty request body handling
  - Invalid date format handling
  - Swiss Ephemeris API integration

### `/api/transits`
- **Method**: POST
- **Purpose**: Calculate planetary transits
- **Tests**:
  - Valid request handling
  - Missing required fields validation
  - Null field validation
  - Error handling for calculation failures
  - Invalid JSON handling
  - Empty request body handling
  - Invalid date format handling
  - Empty natal chart handling

## Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage
```

## Test Utilities

### Mock Data
- `mockBirthData`: Complete birth data for testing
- `mockBirthDataMinimal`: Minimal birth data for testing
- `mockTransitData`: Transit calculation data for testing

### Helper Functions
- `createMockRequestEvent()`: Creates mock SvelteKit request events for testing

## Test Coverage

The tests cover:
- ✅ Happy path scenarios
- ✅ Input validation
- ✅ Error handling
- ✅ Edge cases
- ✅ Invalid data handling
- ✅ Service function mocking
- ✅ Response status codes
- ✅ Response data structure

## Adding New Tests

1. Create a new test file: `src/routes/api/[endpoint]/+server.test.ts`
2. Import the necessary test utilities
3. Mock any external dependencies
4. Write tests for all scenarios (success, validation, errors)
5. Add the test file to `src/test/api.test.ts`

## Best Practices

- Use descriptive test names
- Test both success and failure scenarios
- Mock external dependencies
- Validate response status codes and data
- Test edge cases and invalid inputs
- Keep tests isolated and independent 