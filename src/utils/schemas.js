import { z } from 'zod';

export const registerSchema = z
 .object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phoneNumber: z
   .string()
   .regex(
    /^0[0-9]{10}$/,
    'Phone number must start with 0 and be 11 digits',
   )
   .length(11, 'Phone number must be exactly 11 digits'),
  email: z.string().email('Valid email is required'),
  password: z
   .string()
   .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(5, 'Address is required'),
  termsAccepted: z.boolean().refine((val) => val === true, {
   message: 'You must accept the terms and conditions',
  }),
 })
 .refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
 });

export const loginSchema = z.object({
 email: z.string().email('Valid email is required'),
 password: z.string().min(1, 'Password is required'),
 rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
 email: z.string().email('Valid email is required'),
});

export const resetPasswordSchema = z
 .object({
  password: z
   .string()
   .min(8, 'Password must be at least 8 characters')
   .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
   ),
  confirmPassword: z.string(),
 })
 .refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
 });

export const kycSchema = z.object({
 businessTIN: z.string().min(1, 'Business TIN is required'),
 bvn: z.string().min(1, 'BVN is required'),
 issuedCountry: z.string().min(1, 'Issued Country is required'),
 driverLicense: z.string().min(1, "Driver's License/NIN is required"),
 tinCertificate: z.union([
  // Handle file objects
  z.any(),
  //    .refine((file) => file?.length > 0, 'TIN Certificate is required'),
  //   // Handle URL strings
  //   z.string().min(1, 'TIN Certificate is required'),
 ]),
 driverLicenseFile: z.union([
  // Handle file objects
  z.any(),
  //    .refine(
  //     (file) => file?.length > 0,
  //     "Driver's License/NIN is required",
  //    ),
  //   // Handle URL strings
  //   z.string().min(1, "Driver's License/NIN is required"),
 ]),
});
export const businessInfoSchema = z.object({
 businessName: z.string().min(1, 'Business name is required'),
 businessRCNumber: z.string().min(1, 'RC Number is required'),
 businessPhoneNumber: z
  .string()
  .min(10, 'Valid phone number is required'),
 businessType: z.string().min(1, 'Business type is required'),
 businessCategory: z.string().min(1, 'Business category is required'),
 businessSize: z.string().min(1, 'Business size is required'),
});

// Form validation schema
export const productSchema = z.object({
 name: z.string().min(1, 'Product name is required'),
 description: z.string().min(1, 'Description is required'),
 quantity: z.coerce
  .number()
  .min(0, 'Quantity must be a positive number'),
 price: z.coerce
  .number()
  .min(1, 'Price is required and must be positive'),
 weight: z.coerce.number().nullable().optional(),
 add_discount: z.boolean().default(false),
 discount_price: z.coerce.number().nullable().optional(),
 category: z.string().min(1, 'Category is required'),
 sub_category: z.string().min(1, 'Sub-category is required'),
 return_policy: z.boolean().default(false),
});

export const changePasswordSchema = z
 .object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z
   .string()
   .min(8, 'Password must be at least 8 characters')
   .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
   ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
 })
 .refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
 });
