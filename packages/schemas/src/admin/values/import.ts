import { z } from "zod";

export const BASE_VALUE_SCHEMA = z.object({
  value: z.string().min(1).max(255),
});
export const BASE_ARR = z.array(BASE_VALUE_SCHEMA).min(1);

export const HASH_SCHEMA = BASE_VALUE_SCHEMA.extend({
  hash: z.string().max(255).optional(),
});

export const HASH_SCHEMA_ARR = z.array(HASH_SCHEMA).min(1);

/**
 * codes_10
 */
const SHOULD_DO_REGEX = /SET_OFF_DUTY|SET_ON_DUTY|SET_ASSIGNED|SET_STATUS|PANIC_BUTTON/;
const TYPE_REGEX = /STATUS_CODE|SITUATION_CODE/;

export const CODES_10_SCHEMA = BASE_VALUE_SCHEMA.extend({
  shouldDo: z.string().regex(SHOULD_DO_REGEX),
  color: z.string().max(255).optional(),
  type: z.string().regex(TYPE_REGEX).max(255),
});

export const CODES_10_ARR = z.array(CODES_10_SCHEMA).min(1);

/**
 * business_role
 */
const AS_REGEX = /OWNER|MANAGER|EMPLOYEE/;

export const BUSINESS_ROLE_SCHEMA = BASE_VALUE_SCHEMA.extend({
  as: z.string().regex(AS_REGEX),
});

export const BUSINESS_ROLE_ARR = z.array(BUSINESS_ROLE_SCHEMA).min(1);

/**
 * driverslicense_category
 */
const DLC_TYPE_REGEX = /AUTOMOTIVE|AVIATION|WATER/;

export const DLC_SCHEMA = BASE_VALUE_SCHEMA.extend({
  type: z.string().regex(DLC_TYPE_REGEX).max(255),
});

export const DLC_ARR = z.array(DLC_SCHEMA).min(1);

/**
 * department
 */
const DEPARTMENT_TYPE_REGEX = /LEO|EMS_FD/;

export const DEPARTMENT_SCHEMA = BASE_VALUE_SCHEMA.extend({
  callsign: z.string().max(255).optional(),
  type: z.string().regex(DEPARTMENT_TYPE_REGEX).max(255),
});

export const DEPARTMENT_ARR = z.array(DEPARTMENT_SCHEMA).min(1);