export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  PreferNotToSay = 'Prefer not to say',
}

export interface UserProfile {
  users_id: number;
  users_firstname: string;
  users_lastname: string;
  username: string;
  password: string;
  users_gender: Gender;
  users_email: string;
  users_phone: string;
  users_image: string;
  users_role: string;
  users_age: number;
  users_birthday: string;
}
