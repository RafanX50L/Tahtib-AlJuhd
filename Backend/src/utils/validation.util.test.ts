/**
 * Test file for ValidationUtil
 * This demonstrates the validation functionality
 */

import { ValidationUtil, ValidationError } from './validation.util';

// Test cases for validation utility
export class ValidationUtilTest {
  static runTests(): void {
    console.log('Running ValidationUtil tests...');

    // Test positive integer validation
    this.testPositiveInteger();
    
    // Test range validation
    this.testRangeValidation();
    
    // Test enum validation
    this.testEnumValidation();
    
    // Test string validation
    this.testStringValidation();
    
    // Test pagination validation
    this.testPaginationValidation();
    
    console.log('All ValidationUtil tests passed!');
  }

  private static testPositiveInteger(): void {
    console.log('Testing positive integer validation...');
    
    // Valid cases
    console.assert(ValidationUtil.validatePositiveInteger('5', 'test') === 5);
    console.assert(ValidationUtil.validatePositiveInteger(10, 'test') === 10);
    console.assert(ValidationUtil.validatePositiveInteger(null, 'test') === 1); // default
    
    // Invalid cases
    try {
      ValidationUtil.validatePositiveInteger('abc', 'test');
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
    
    try {
      ValidationUtil.validatePositiveInteger(-5, 'test');
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testRangeValidation(): void {
    console.log('Testing range validation...');
    
    // Valid cases
    console.assert(ValidationUtil.validateRange('5', 'test', 1, 10) === 5);
    console.assert(ValidationUtil.validateRange(3, 'test', 1, 10) === 3);
    
    // Invalid cases
    try {
      ValidationUtil.validateRange('15', 'test', 1, 10);
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testEnumValidation(): void {
    console.log('Testing enum validation...');
    
    const allowedValues = ['Active', 'Inactive', 'all'] as const;
    
    // Valid cases
    console.assert(ValidationUtil.validateEnum('Active', 'status', allowedValues) === 'Active');
    console.assert(ValidationUtil.validateEnum('', 'status', allowedValues) === '');
    console.assert(ValidationUtil.validateEnum(null, 'status', allowedValues) === 'Active'); // default
    
    // Invalid cases
    try {
      ValidationUtil.validateEnum('Invalid', 'status', allowedValues);
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testStringValidation(): void {
    console.log('Testing string validation...');
    
    // Valid cases
    console.assert(ValidationUtil.validateString('hello', 'test') === 'hello');
    console.assert(ValidationUtil.validateString('  hello  ', 'test') === 'hello'); // trimmed
    console.assert(ValidationUtil.validateString(null, 'test') === ''); // default
    
    // Length validation
    console.assert(ValidationUtil.validateString('hello', 'test', 10) === 'hello');
    
    try {
      ValidationUtil.validateString('very long string', 'test', 5);
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testPaginationValidation(): void {
    console.log('Testing pagination validation...');
    
    // Valid cases
    const validQuery1 = { page: '1', limit: '10' };
    const result1 = ValidationUtil.validatePagination(validQuery1);
    console.assert(result1.page === 1 && result1.limit === 10);
    
    const validQuery2 = { page: '5', limit: '25' };
    const result2 = ValidationUtil.validatePagination(validQuery2);
    console.assert(result2.page === 5 && result2.limit === 25);
    
    // Invalid cases
    try {
      const invalidQuery = { page: '0', limit: '10' };
      ValidationUtil.validatePagination(invalidQuery);
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
    
    try {
      const invalidQuery = { page: '1', limit: '200' };
      ValidationUtil.validatePagination(invalidQuery);
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }
}

// Example usage for admin client controller validation
export class AdminClientValidationExample {
  static demonstrateValidation(): void {
    console.log('Demonstrating admin client validation...');
    
    // Example 1: Valid request
    const validRequest = {
      page: '1',
      limit: '10',
      planStatus: 'Active',
      search: 'john'
    };
    
    try {
      const { page, limit } = ValidationUtil.validatePagination(validRequest);
      const planStatus = ValidationUtil.validateEnum(validRequest.planStatus, 'planStatus', ['Active', 'Inactive', ''] as const);
      const search = ValidationUtil.validateString(validRequest.search, 'search', 100);
      
      console.log('Valid request processed:', { page, limit, planStatus, search });
    } catch (error) {
      console.error('Unexpected validation error:', error);
    }
    
    // Example 2: Invalid request
    const invalidRequest = {
      page: 'invalid',
      limit: '200',
      planStatus: 'InvalidStatus',
      search: 'a'.repeat(200) // Too long
    };
    
    try {
      ValidationUtil.validatePagination(invalidRequest);
      console.error('Should have thrown validation error');
    } catch (error) {
      console.log('Caught expected validation error:', error.message);
    }
  }
}

// Uncomment to run tests
// ValidationUtilTest.runTests();
// AdminClientValidationExample.demonstrateValidation();
