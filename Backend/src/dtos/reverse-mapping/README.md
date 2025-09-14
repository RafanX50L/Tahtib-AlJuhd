# Reverse Mapping DTOs

This folder contains DTOs (Data Transfer Objects) that handle reverse mapping - transforming data from the database/repository layer to client-facing formats and validating incoming requests.

## Folder Structure

```
reverse-mapping/
├── admin/           # Admin-related reverse mapping DTOs
│   └── ClientDTO.ts # Client management DTOs for admin
├── client/          # Client-related reverse mapping DTOs
├── trainer/         # Trainer-related reverse mapping DTOs
├── shared/          # Shared reverse mapping DTOs
├── domain/          # Domain-specific reverse mapping DTOs
└── README.md        # This documentation
```

## Purpose

Reverse mapping DTOs serve two main purposes:

### 1. Input Validation & Transformation
- Validate incoming request parameters
- Transform raw request data to typed DTOs
- Sanitize and normalize input data
- Provide default values for optional parameters

### 2. Output Formatting & Mapping
- Transform raw database/repository data to client-friendly formats
- Generate signed URLs for file resources (S3, etc.)
- Format dates, numbers, and other data types consistently
- Add computed fields and pagination metadata

## Usage Pattern

```typescript
// Input validation
const validatedParams = DTO.validateRequestParams(req.query);

// Service call with validated data
const rawData = await service.getData(validatedParams);

// Output mapping
const responseData = await DTO.mapToResponseDTO(rawData, pagination);

// Return formatted response
res.json({ message: "Success", data: responseData });
```

## Naming Convention

- **Input DTOs**: `{Entity}RequestDTO` (e.g., `GetAllClientsRequestDTO`)
- **Output DTOs**: `{Entity}ViewDTO` or `{Entity}ResponseDTO` (e.g., `ClientViewDTO`)
- **Mapping Classes**: `{Module}{Entity}DTO` (e.g., `AdminClientDTO`)

## Benefits

1. **Type Safety**: Full TypeScript support with compile-time checking
2. **Data Validation**: Comprehensive input validation with detailed error messages
3. **Consistency**: Standardized request/response formats across the API
4. **Security**: Input sanitization and validation to prevent injection attacks
5. **Maintainability**: Clear separation of concerns and reusable validation logic
6. **Documentation**: Self-documenting code with clear interfaces

## Example Implementation

See `admin/ClientDTO.ts` for a complete example of reverse mapping implementation including:
- Input validation with custom validation rules
- Output mapping with S3 URL generation
- Pagination metadata calculation
- Error handling and type safety
