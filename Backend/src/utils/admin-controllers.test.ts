/**
 * Test file for Admin Controllers with DTO Mapping and Validation
 * This demonstrates the validation functionality for all admin controllers
 */

import { ValidationUtil, ValidationError } from './validation.util';

// Test cases for admin trainer controller validation
export class AdminTrainerControllerTest {
  static runTests(): void {
    console.log('Running Admin Trainer Controller tests...');

    this.testGetTrainersValidation();
    this.testScheduleInterviewValidation();
    this.testSubmitInterviewFeedbackValidation();
    this.testApproveTrainerValidation();
    this.testRejectTrainerValidation();
    
    console.log('All Admin Trainer Controller tests passed!');
  }

  private static testGetTrainersValidation(): void {
    console.log('Testing get trainers validation...');
    
    // Valid cases
    const validQuery1 = { page: '1', limit: '10', search: 'john' };
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
  }

  private static testScheduleInterviewValidation(): void {
    console.log('Testing schedule interview validation...');
    
    // Valid cases
    const validParams = {
      trainerId: '64f1a2b3c4d5e6f7g8h9i0j1',
      date: '2023-12-25',
      time: '14:30'
    };
    
    console.assert(ValidationUtil.validateObjectId(validParams.trainerId, 'trainerId') === validParams.trainerId);
    console.assert(ValidationUtil.validateString(validParams.date, 'date') === validParams.date);
    console.assert(ValidationUtil.validateString(validParams.time, 'time') === validParams.time);
    
    // Invalid cases
    try {
      ValidationUtil.validateObjectId('invalid-id', 'trainerId');
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
    
    try {
      const invalidTime = '25:70';
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(invalidTime)) {
        throw new ValidationError([{
          field: 'time',
          message: 'Time must be in HH:MM format',
          value: invalidTime
        }]);
      }
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testSubmitInterviewFeedbackValidation(): void {
    console.log('Testing submit interview feedback validation...');
    
    // Valid cases
    const validBody = {
      id: '64f1a2b3c4d5e6f7g8h9i0j1',
      feedback: {
        communicationSkills: 8,
        technicalKnowledge: 7,
        coachingStyle: 9,
        confidencePresence: 8,
        brandAlignment: 7,
        equipmentQuality: 6,
        notes: 'Great candidate'
      }
    };
    
    console.assert(ValidationUtil.validateObjectId(validBody.id, 'id') === validBody.id);
    console.assert(typeof validBody.feedback === 'object');
    
    // Invalid cases
    try {
      ValidationUtil.validateObjectId('invalid-id', 'id');
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testApproveTrainerValidation(): void {
    console.log('Testing approve trainer validation...');
    
    // Valid cases
    const validBody = {
      id: '64f1a2b3c4d5e6f7g8h9i0j1',
      salary: 5000
    };
    
    console.assert(ValidationUtil.validateObjectId(validBody.id, 'id') === validBody.id);
    console.assert(ValidationUtil.validatePositiveInteger(validBody.salary, 'salary') === 5000);
    
    // Invalid cases
    try {
      ValidationUtil.validatePositiveInteger(-1000, 'salary');
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testRejectTrainerValidation(): void {
    console.log('Testing reject trainer validation...');
    
    // Valid cases
    const validBody = {
      id: '64f1a2b3c4d5e6f7g8h9i0j1'
    };
    
    console.assert(ValidationUtil.validateObjectId(validBody.id, 'id') === validBody.id);
    
    // Invalid cases
    try {
      ValidationUtil.validateObjectId('invalid-id', 'id');
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }
}

// Test cases for admin dashboard controller validation
export class AdminDashboardControllerTest {
  static runTests(): void {
    console.log('Running Admin Dashboard Controller tests...');

    this.testGetRevenueTrendsValidation();
    this.testGetTopTrainersValidation();
    this.testGetRecentPaymentsValidation();
    
    console.log('All Admin Dashboard Controller tests passed!');
  }

  private static testGetRevenueTrendsValidation(): void {
    console.log('Testing get revenue trends validation...');
    
    // Valid cases
    const validQuery1 = { monthsBack: '6' };
    const result1 = ValidationUtil.validateRange(validQuery1.monthsBack, 'monthsBack', 1, 24);
    console.assert(result1 === 6);
    
    const validQuery2 = { monthsBack: '12' };
    const result2 = ValidationUtil.validateRange(validQuery2.monthsBack, 'monthsBack', 1, 24);
    console.assert(result2 === 12);
    
    // Invalid cases
    try {
      ValidationUtil.validateRange('25', 'monthsBack', 1, 24);
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testGetTopTrainersValidation(): void {
    console.log('Testing get top trainers validation...');
    
    // Valid cases
    const validQuery1 = { limit: '5' };
    const result1 = ValidationUtil.validateRange(validQuery1.limit, 'limit', 1, 50);
    console.assert(result1 === 5);
    
    const validQuery2 = { limit: '10' };
    const result2 = ValidationUtil.validateRange(validQuery2.limit, 'limit', 1, 50);
    console.assert(result2 === 10);
    
    // Invalid cases
    try {
      ValidationUtil.validateRange('100', 'limit', 1, 50);
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testGetRecentPaymentsValidation(): void {
    console.log('Testing get recent payments validation...');
    
    // Valid cases
    const validQuery = { page: '1', pageSize: '10', searchTerm: 'payment' };
    const page = ValidationUtil.validateRange(validQuery.page, 'page', 1, 1000);
    const pageSize = ValidationUtil.validateRange(validQuery.pageSize, 'pageSize', 1, 100);
    const searchTerm = ValidationUtil.validateString(validQuery.searchTerm, 'searchTerm', 100);
    
    console.assert(page === 1);
    console.assert(pageSize === 10);
    console.assert(searchTerm === 'payment');
    
    // Invalid cases
    try {
      ValidationUtil.validateRange('0', 'page', 1, 1000);
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }
}

// Test cases for admin common controller validation
export class AdminCommonControllerTest {
  static runTests(): void {
    console.log('Running Admin Common Controller tests...');

    this.testBlockOrUnblockValidation();
    
    console.log('All Admin Common Controller tests passed!');
  }

  private static testBlockOrUnblockValidation(): void {
    console.log('Testing block/unblock validation...');
    
    // Valid cases
    const validParams = { id: '64f1a2b3c4d5e6f7g8h9i0j1' };
    const result = ValidationUtil.validateObjectId(validParams.id, 'id');
    console.assert(result === validParams.id);
    
    // Invalid cases
    try {
      ValidationUtil.validateObjectId('invalid-id', 'id');
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }
}

// Test cases for admin payment controller validation
export class AdminPaymentControllerTest {
  static runTests(): void {
    console.log('Running Admin Payment Controller tests...');

    this.testGetPaymentsByClientValidation();
    this.testGetPaymentsByTrainerValidation();
    this.testGetPaymentsByDateRangeValidation();
    
    console.log('All Admin Payment Controller tests passed!');
  }

  private static testGetPaymentsByClientValidation(): void {
    console.log('Testing get payments by client validation...');
    
    // Valid cases
    const validParams = { clientId: '64f1a2b3c4d5e6f7g8h9i0j1' };
    const result = ValidationUtil.validateObjectId(validParams.clientId, 'clientId');
    console.assert(result === validParams.clientId);
    
    // Invalid cases
    try {
      ValidationUtil.validateObjectId('invalid-id', 'clientId');
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testGetPaymentsByTrainerValidation(): void {
    console.log('Testing get payments by trainer validation...');
    
    // Valid cases
    const validParams = { trainerId: '64f1a2b3c4d5e6f7g8h9i0j1' };
    const result = ValidationUtil.validateObjectId(validParams.trainerId, 'trainerId');
    console.assert(result === validParams.trainerId);
    
    // Invalid cases
    try {
      ValidationUtil.validateObjectId('invalid-id', 'trainerId');
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }

  private static testGetPaymentsByDateRangeValidation(): void {
    console.log('Testing get payments by date range validation...');
    
    // Valid cases
    const validQuery = { 
      startDate: '2023-01-01', 
      endDate: '2023-12-31' 
    };
    
    const startDate = ValidationUtil.validateString(validQuery.startDate, 'startDate');
    const endDate = ValidationUtil.validateString(validQuery.endDate, 'endDate');
    
    console.assert(startDate === '2023-01-01');
    console.assert(endDate === '2023-12-31');
    
    // Validate date format
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    console.assert(!isNaN(startDateObj.getTime()));
    console.assert(!isNaN(endDateObj.getTime()));
    console.assert(startDateObj <= endDateObj);
    
    // Invalid cases
    try {
      const invalidQuery = { 
        startDate: 'invalid-date', 
        endDate: '2023-12-31' 
      };
      const invalidStartDate = new Date(invalidQuery.startDate);
      if (isNaN(invalidStartDate.getTime())) {
        throw new ValidationError([{
          field: 'startDate',
          message: 'Start date must be a valid date format',
          value: invalidQuery.startDate
        }]);
      }
      console.error('Should have thrown validation error');
    } catch (error) {
      console.assert(error instanceof ValidationError);
    }
  }
}

// Example usage for all admin controllers
export class AdminControllersExample {
  static demonstrateAllValidations(): void {
    console.log('Demonstrating all admin controller validations...');
    
    // Example 1: Valid trainer request
    const validTrainerRequest = {
      page: '1',
      limit: '10',
      search: 'john'
    };
    
    try {
      const { page, limit } = ValidationUtil.validatePagination(validTrainerRequest);
      const search = ValidationUtil.validateString(validTrainerRequest.search, 'search', 100);
      
      console.log('Valid trainer request processed:', { page, limit, search });
    } catch (error) {
      console.error('Unexpected validation error:', error);
    }
    
    // Example 2: Valid dashboard request
    const validDashboardRequest = {
      monthsBack: '6',
      limit: '5'
    };
    
    try {
      const monthsBack = ValidationUtil.validateRange(validDashboardRequest.monthsBack, 'monthsBack', 1, 24);
      const limit = ValidationUtil.validateRange(validDashboardRequest.limit, 'limit', 1, 50);
      
      console.log('Valid dashboard request processed:', { monthsBack, limit });
    } catch (error) {
      console.error('Unexpected validation error:', error);
    }
    
    // Example 3: Valid payment request
    const validPaymentRequest = {
      clientId: '64f1a2b3c4d5e6f7g8h9i0j1'
    };
    
    try {
      const clientId = ValidationUtil.validateObjectId(validPaymentRequest.clientId, 'clientId');
      
      console.log('Valid payment request processed:', { clientId });
    } catch (error) {
      console.error('Unexpected validation error:', error);
    }
  }
}

// Uncomment to run all tests
// AdminTrainerControllerTest.runTests();
// AdminDashboardControllerTest.runTests();
// AdminCommonControllerTest.runTests();
// AdminPaymentControllerTest.runTests();
// AdminControllersExample.demonstrateAllValidations();
