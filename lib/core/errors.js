const errors = {}

const errorMessages = {
  E_UNKNOWN: 'Unknown error',
  E_BAD_REQUEST: 'Bad request',
  E_UNPROCESSABLE_ENTITY: 'Unprocessable entity',
  E_UNAUTHORIZED: 'Unauthorized',
  E_FORBIDDEN: 'Forbidden',
  E_NOT_FOUND: 'Not found',
  E_CONFLICT: 'Conflict',
  E_INTERNAL_SERVER: 'Internal server error',
}

// AppError
class AppError extends Error {
  constructor(name, status) {
    if (errorMessages[name]) {
      super(errorMessages[name])
    } else {
      super(errorMessages.E_UNKNOWN)
    }

    this.name = name
    this.status = status
    this.appError = true
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status
    }
  }
}

// AppError
errors.AppError = AppError

// BadRequest
errors.BadRequestError = class extends AppError {
  constructor(name, errors) {
    super(name || 'E_BAD_REQUEST', 400)
    this.errors = errors
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      errors: this.errors
    }
  }
}

// Unauthorized
errors.UnauthorizedError = class extends AppError {
  constructor(name) {
    super(name || 'E_UNAUTHORIZED', 401)
  }
}

// Forbidden
errors.ForbiddenError = class extends AppError {
  constructor(name) {
    super(name || 'E_FORBIDDEN', 403)
  }
}
// Not Found
errors.NotFoundError = class extends AppError {
  constructor(name) {
    super(name || 'E_NOT_FOUND', 404)
  }
}

// Conflict
errors.ConflictError = class extends AppError {
  constructor(name) {
    super(name || 'E_CONFLICT', 409)
  }
}

// InternalServerError
errors.InternalServerError = class extends AppError {
  constructor(name) {
    super(name || 'E_INTERNAL_SERVER', 500)
  }
}

module.exports = errors
